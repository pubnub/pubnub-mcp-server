import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { manageIlluminateHandler } from "./handlers";

vi.mock("./api");

const publishMock = vi.fn();
const getPubNubClientMock = vi.fn(() => ({ publish: publishMock }));
vi.mock("../pubnub/api", () => ({
  getPubNubClient: (config: unknown) => getPubNubClientMock(config as never),
}));

function parseResult(result: { content?: Array<{ text?: string }> }) {
  return JSON.parse(result.content?.[0]?.text ?? "{}");
}

function tvar(name: string): string {
  return ["$", `{${name}}`].join("");
}

describe("Illuminate Handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publishMock.mockReset();
    publishMock.mockResolvedValue({ timetoken: "123" });
  });

  // ─── CRUD operations ──────────────────────────────────────────────────────

  describe("CRUD operations", () => {
    it("list: calls listResources and returns array", async () => {
      const mockData = [{ id: "bo-1", name: "Chat BO" }];
      vi.mocked(api.listResources).mockResolvedValue(mockData);

      const result = await manageIlluminateHandler({
        resource: "business-object",
        operation: "list",
      });

      expect(api.listResources).toHaveBeenCalledWith("business-object");
      expect(parseResult(result)).toEqual(mockData);
    });

    it("get: calls getResource by id", async () => {
      vi.mocked(api.getResource).mockResolvedValue({ id: "m-1" });

      const result = await manageIlluminateHandler({
        resource: "metric",
        operation: "get",
        id: "m-1",
      });

      expect(api.getResource).toHaveBeenCalledWith("metric", "m-1");
      expect(parseResult(result).id).toBe("m-1");
    });

    it("get: returns error when id is missing", async () => {
      const result = await manageIlluminateHandler({ resource: "query", operation: "get" });

      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain("id is required");
    });

    it("create: calls createResource with data", async () => {
      vi.mocked(api.createResource).mockResolvedValue({ id: "m-1" });

      await manageIlluminateHandler({
        resource: "metric",
        operation: "create",
        data: { name: "Count", function: "COUNT" },
      });

      expect(api.createResource).toHaveBeenCalledWith("metric", {
        name: "Count",
        function: "COUNT",
      });
    });

    it("update: calls updateResource with id and data", async () => {
      vi.mocked(api.updateResource).mockResolvedValue({ id: "bo-1" });

      await manageIlluminateHandler({
        resource: "business-object",
        operation: "update",
        id: "bo-1",
        data: { name: "Updated" },
      });

      expect(api.updateResource).toHaveBeenCalledWith("business-object", "bo-1", {
        name: "Updated",
      });
    });

    it("delete: calls deleteResource and returns success", async () => {
      vi.mocked(api.deleteResource).mockResolvedValue({ success: true });

      const result = await manageIlluminateHandler({
        resource: "business-object",
        operation: "delete",
        id: "bo-1",
      });

      expect(api.deleteResource).toHaveBeenCalledWith("business-object", "bo-1");
      expect(parseResult(result)).toEqual({ success: true });
    });
  });

  // ─── Business Object create validation ───────────────────────────────────

  describe("business-object create validation", () => {
    it("rejects BO exceeding limits and aggregates violations", async () => {
      const result = await manageIlluminateHandler({
        resource: "business-object",
        operation: "create",
        data: {
          name: "x".repeat(101),
          fields: [
            ...Array.from({ length: 6 }, (_, i) => ({
              name: `f${i}`,
              jsonPath: `$.message.body.f${i}`,
              jsonFieldType: "TEXT_LONG",
            })),
            { name: "x".repeat(51), jsonPath: "$.message.body.long", jsonFieldType: "TEXT" },
          ],
        },
      });

      expect(result.isError).toBe(true);
      const text = result.content?.[0]?.text ?? "";
      expect(text).toContain("name length is 101");
      expect(text).toContain("6 TEXT_LONG fields defined");
      expect(text).toContain("name length is 51");
      expect(api.createResource).not.toHaveBeenCalled();
    });

    it("allows BO at exact limits", async () => {
      vi.mocked(api.createResource).mockResolvedValue({ id: "bo-edge" });
      const fields = Array.from({ length: 100 }, (_, i) => ({
        name: `f${i}`,
        jsonPath: `$.message.body.f${i}`,
        jsonFieldType: i < 5 ? "TEXT_LONG" : "TEXT",
      }));

      const result = await manageIlluminateHandler({
        resource: "business-object",
        operation: "create",
        data: { name: "x".repeat(100), fields },
      });

      expect(result.isError).toBeFalsy();
      expect(api.createResource).toHaveBeenCalledOnce();
    });
  });

  // ─── Decision create 2-step workflow ──────────────────────────────────────

  const decisionScaffold = {
    id: "dec-123",
    hitType: "SINGLE",
    executeOnce: false,
    rules: [],
    inputFields: [{ id: "if-aaa", name: "message_count", sourceType: "BUSINESSOBJECT" }],
    outputFields: [{ id: "of-bbb", name: "alert_level", variable: "alert_level" }],
    actions: [{ id: "act-ccc", name: "notify_moderator", actionType: "WEBHOOK" }],
    sourceType: "BUSINESSOBJECT",
  };

  describe("decision create (2-step)", () => {
    it("POSTs scaffold with rules=[] then PUTs with resolved name→UUID rules", async () => {
      vi.mocked(api.createResource).mockResolvedValue(decisionScaffold);
      vi.mocked(api.updateResource).mockResolvedValue({ ...decisionScaffold, rules: [{}] });

      await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Spam Detection",
          sourceType: "BUSINESSOBJECT",
          inputFields: [{ name: "message_count", sourceType: "BUSINESSOBJECT" }],
          outputFields: [{ name: "alert_level", variable: "alert_level" }],
          actions: [{ name: "notify_moderator", actionType: "WEBHOOK" }],
          rules: [
            {
              inputValues: [
                { inputFieldId: "message_count", operation: "GREATER_THAN", value: 10 },
              ],
              outputValues: [{ outputFieldId: "alert_level", value: "high" }],
              actionValues: [{ actionId: "notify_moderator", enabled: true }],
            },
          ],
        },
      });

      const postCall = vi.mocked(api.createResource).mock.calls[0];
      expect(postCall[0]).toBe("decision");
      expect((postCall[1] as Record<string, unknown>).rules).toEqual([]);
      expect((postCall[1] as Record<string, unknown>).enabled).toBe(false);

      const putCall = vi.mocked(api.updateResource).mock.calls[0];
      expect(putCall[1]).toBe("dec-123");
      const putRules = (putCall[2] as Record<string, unknown>).rules as Array<
        Record<string, unknown>
      >;
      const iv = (putRules[0].inputValues as Array<Record<string, unknown>>)[0];
      expect(iv.inputFieldId).toBe("if-aaa");
      const ov = (putRules[0].outputValues as Array<Record<string, unknown>>)[0];
      expect(ov.outputFieldId).toBe("of-bbb");
      const av = (putRules[0].actionValues as Array<Record<string, unknown>>)[0];
      expect(av.actionId).toBe("act-ccc");
    });

    it("returns scaffold directly when no rules provided", async () => {
      vi.mocked(api.createResource).mockResolvedValue(decisionScaffold);

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: { name: "Empty", inputFields: [], outputFields: [], actions: [] },
      });

      expect(api.updateResource).not.toHaveBeenCalled();
      expect(parseResult(result).id).toBe("dec-123");
    });
  });

  // ─── Decision template resolution ────────────────────────────────────────

  describe("decision template resolution", () => {
    it("resolves ${name} to ${UUID} in action body, channel, outputValues, and executionLimitInputFieldIds", async () => {
      const bodyWithNames = `{"user": "${tvar("message_count")}", "level": "${tvar("alert_level")}"}`;
      const scaffoldWithTemplate = {
        ...decisionScaffold,
        actions: [
          {
            id: "act-ccc",
            name: "notify_moderator",
            actionType: "PUBNUB_PUBLISH",
            template: { channel: `alerts.${tvar("alert_level")}`, body: bodyWithNames },
          },
        ],
      };

      vi.mocked(api.createResource).mockResolvedValue(scaffoldWithTemplate);
      vi.mocked(api.updateResource).mockImplementation(async (_r, _id, body) => body);

      await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Template Test",
          sourceType: "BUSINESSOBJECT",
          inputFields: [{ name: "message_count", sourceType: "BUSINESSOBJECT" }],
          outputFields: [{ name: "alert_level", variable: "alert_level" }],
          actions: [
            {
              name: "notify_moderator",
              actionType: "PUBNUB_PUBLISH",
              template: { channel: `alerts.${tvar("alert_level")}`, body: bodyWithNames },
            },
          ],
          rules: [
            {
              inputValues: [{ inputFieldId: "message_count", operation: "ANY", argument: "" }],
              outputValues: [{ outputFieldId: "alert_level", value: tvar("message_count") }],
              actionValues: [
                {
                  actionId: "notify_moderator",
                  status: true,
                  executionLimitInputFieldIds: ["message_count"],
                },
              ],
            },
          ],
        },
      });

      const putBody = vi.mocked(api.updateResource).mock.calls[0][2] as Record<string, unknown>;

      const actions = putBody.actions as Array<Record<string, unknown>>;
      const template = actions[0].template as Record<string, string>;
      expect(template.body).toBe(`{"user": "${tvar("if-aaa")}", "level": "${tvar("of-bbb")}"}`);
      expect(template.channel).toBe(`alerts.${tvar("of-bbb")}`);

      const rules = putBody.rules as Array<Record<string, unknown>>;
      const ov = (rules[0].outputValues as Array<Record<string, unknown>>)[0];
      expect(ov.value).toBe(tvar("if-aaa"));
      const av = (rules[0].actionValues as Array<Record<string, unknown>>)[0];
      expect(av.executionLimitInputFieldIds).toEqual(["if-aaa"]);
    });
  });

  // ─── Bug #7: sentinel substitution ────────────────────────────────────────

  describe("Bug #7: input-name sentinel substitution", () => {
    it("substitutes ${input-name} with sentinel before POST and restores to ${UUID} after", async () => {
      let postedActions: Array<Record<string, unknown>> = [];
      vi.mocked(api.createResource).mockImplementation(async (_r, body) => {
        postedActions =
          ((body as Record<string, unknown>).actions as Array<Record<string, unknown>>) ?? [];
        return {
          ...decisionScaffold,
          actions: [{ ...decisionScaffold.actions[0], template: postedActions[0]?.template }],
        };
      });
      vi.mocked(api.updateResource).mockImplementation(async (_r, _id, body) => body);

      const channelTemplate = `{"channel": "${tvar("message_count")}", "user": "${tvar("alert_level")}"}`;

      await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Bug7 Test",
          sourceType: "BUSINESSOBJECT",
          inputFields: [{ name: "message_count", sourceType: "FIELD" }],
          outputFields: [{ name: "alert_level", variable: "alert_level" }],
          actions: [
            {
              name: "notify_moderator",
              actionType: "PUBNUB_PUBLISH",
              template: { body: channelTemplate },
            },
          ],
          rules: [
            {
              inputValues: [{ inputFieldId: "message_count", operation: "ANY", argument: "" }],
              outputValues: [{ outputFieldId: "alert_level", value: "high" }],
              actionValues: [{ actionId: "notify_moderator", status: true }],
            },
          ],
        },
      });

      const postedTemplate = (postedActions[0]?.template as Record<string, string>)?.body ?? "";
      expect(postedTemplate).not.toContain(tvar("message_count"));
      expect(postedTemplate).toContain("__MCP_INPUTREF__");
      expect(postedTemplate).toContain(tvar("alert_level"));

      const putBody = vi.mocked(api.updateResource).mock.calls[0][2] as Record<string, unknown>;
      const finalTemplate = (
        (putBody.actions as Array<Record<string, unknown>>)[0]?.template as Record<string, string>
      )?.body;
      expect(finalTemplate).not.toContain("__MCP_INPUTREF__");
      expect(finalTemplate).toContain(tvar("if-aaa"));
      expect(finalTemplate).toContain(tvar("of-bbb"));
    });
  });

  // ─── Bug #8: QUERY decision input-name validation ─────────────────────────

  describe("Bug #8: QUERY decision input-name validation", () => {
    it("returns error when inputFields[].name does not match query field aliases", async () => {
      vi.mocked(api.getQueryFields).mockResolvedValue([
        { field: "user_id" },
        { field: "total_events" },
      ]);

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Bad QUERY Decision",
          sourceType: "QUERY",
          sourceId: "query-uuid-123",
          inputFields: [
            { name: "User ID", sourceType: "QUERYFIELD", sourceId: "qf-1" },
            { name: "Total Events", sourceType: "QUERYFIELD", sourceId: "qf-2" },
          ],
          outputFields: [],
          actions: [],
          rules: [],
        },
      });

      expect(result.isError).toBe(true);
      const text = result.content?.[0]?.text ?? "";
      expect(text).toContain("QUERY decision inputField name mismatch");
      expect(text).toContain('"User ID"');
      expect(text).toContain("user_id");
      expect(api.createResource).not.toHaveBeenCalled();
    });

    it("allows creation when names match", async () => {
      vi.mocked(api.getQueryFields).mockResolvedValue([{ field: "user_id" }]);
      vi.mocked(api.createResource).mockResolvedValue(decisionScaffold);

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Good QUERY Decision",
          sourceType: "QUERY",
          sourceId: "query-uuid-123",
          inputFields: [{ name: "user_id", sourceType: "QUERYFIELD", sourceId: "qf-1" }],
          outputFields: [],
          actions: [],
          rules: [],
        },
      });

      expect(result.isError).toBeFalsy();
      expect(api.createResource).toHaveBeenCalledOnce();
    });

    it("does not block when get-fields lookup fails", async () => {
      vi.mocked(api.getQueryFields).mockRejectedValue(new Error("network blip"));
      vi.mocked(api.createResource).mockResolvedValue(decisionScaffold);

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "QUERY Network Issue",
          sourceType: "QUERY",
          sourceId: "q-1",
          inputFields: [{ name: "anything", sourceType: "QUERYFIELD", sourceId: "qf-1" }],
          outputFields: [],
          actions: [],
          rules: [],
        },
      });

      expect(result.isError).toBeFalsy();
    });
  });

  // ─── Bug #3: orphaned scaffold cleanup ────────────────────────────────────

  describe("Bug #3: orphaned scaffold cleanup", () => {
    it("deletes scaffold when rule-install PUT fails", async () => {
      vi.mocked(api.createResource).mockResolvedValue(decisionScaffold);
      vi.mocked(api.updateResource).mockRejectedValue(new Error("HTTP 400: bad rule"));
      vi.mocked(api.deleteResource).mockResolvedValue({ success: true });

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Cleanup Test",
          sourceType: "BUSINESSOBJECT",
          inputFields: [{ name: "message_count", sourceType: "BUSINESSOBJECT" }],
          outputFields: [{ name: "alert_level", variable: "alert_level" }],
          actions: [{ name: "notify_moderator", actionType: "WEBHOOK" }],
          rules: [
            {
              inputValues: [{ inputFieldId: "message_count", operation: "ANY", argument: "" }],
              outputValues: [{ outputFieldId: "alert_level", value: "high" }],
              actionValues: [{ actionId: "notify_moderator", status: true }],
            },
          ],
        },
      });

      expect(api.deleteResource).toHaveBeenCalledWith("decision", "dec-123");
      expect(result.isError).toBe(true);
      expect(parseResult(result).message).toContain("bad rule");
    });

    it("surfaces both errors when cleanup also fails", async () => {
      vi.mocked(api.createResource).mockResolvedValue(decisionScaffold);
      vi.mocked(api.updateResource).mockRejectedValue(new Error("HTTP 400: bad rule"));
      vi.mocked(api.deleteResource).mockRejectedValue(new Error("HTTP 500: delete failed"));

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: {
          name: "Double Failure",
          sourceType: "BUSINESSOBJECT",
          inputFields: [{ name: "message_count", sourceType: "BUSINESSOBJECT" }],
          outputFields: [{ name: "alert_level", variable: "alert_level" }],
          actions: [{ name: "notify_moderator", actionType: "WEBHOOK" }],
          rules: [
            {
              inputValues: [{ inputFieldId: "message_count", operation: "ANY", argument: "" }],
              outputValues: [{ outputFieldId: "alert_level", value: "high" }],
              actionValues: [{ actionId: "notify_moderator", status: true }],
            },
          ],
        },
      });

      expect(result.isError).toBe(true);
      const text = result.content?.[0]?.text ?? "";
      expect(text).toContain("bad rule");
      expect(text).toContain("dec-123");
    });
  });

  // ─── Decision defaults ────────────────────────────────────────────────────

  describe("decision defaults", () => {
    it("injects defaults on create and removes executionFrequency for BUSINESSOBJECT on update", async () => {
      vi.mocked(api.createResource).mockResolvedValue({ id: "dec-1", rules: [] });
      vi.mocked(api.updateResource).mockResolvedValue({ id: "dec-1" });

      await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: { name: "Test", inputFields: [], outputFields: [], actions: [] },
      });

      const postBody = vi.mocked(api.createResource).mock.calls[0][1] as Record<string, unknown>;
      expect(postBody.hitType).toBe("SINGLE");
      expect(postBody.executeOnce).toBe(false);
      expect(postBody.activeFrom).toBeDefined();
      expect(postBody.activeUntil).toBeDefined();

      await manageIlluminateHandler({
        resource: "decision",
        operation: "update",
        id: "dec-1",
        data: { name: "BO Decision", sourceType: "BUSINESSOBJECT", executionFrequency: "PT1M" },
      });

      const putBody = vi.mocked(api.updateResource).mock.calls[0][2] as Record<string, unknown>;
      expect(putBody.hitType).toBe("SINGLE");
      expect(putBody.executionFrequency).toBeUndefined();
    });
  });

  // ─── Activate / Deactivate ────────────────────────────────────────────────

  describe("activate / deactivate", () => {
    it("activates a BO with isActive=true and appends subscribe_key", async () => {
      vi.mocked(api.getResource).mockResolvedValue({ id: "bo-1", isActive: false, subkeys: [] });
      vi.mocked(api.updateResource).mockResolvedValue({ id: "bo-1", isActive: true });

      await manageIlluminateHandler({
        resource: "business-object",
        operation: "activate",
        id: "bo-1",
        subscribe_key: "sub-c-test",
      });

      const putCall = vi.mocked(api.updateResource).mock.calls[0];
      expect((putCall[2] as Record<string, unknown>).isActive).toBe(true);
      expect((putCall[2] as Record<string, unknown>).subkeys).toContain("sub-c-test");
    });

    it("activates a decision with enabled=true", async () => {
      vi.mocked(api.getResource).mockResolvedValue({
        id: "dec-1",
        enabled: false,
        rules: [],
        sourceType: "BUSINESSOBJECT",
      });
      vi.mocked(api.updateResource).mockResolvedValue({ id: "dec-1", enabled: true });

      await manageIlluminateHandler({
        resource: "decision",
        operation: "activate",
        id: "dec-1",
      });

      const putCall = vi.mocked(api.updateResource).mock.calls[0];
      expect((putCall[2] as Record<string, unknown>).enabled).toBe(true);
    });
  });

  // ─── publish-fake-data ────────────────────────────────────────────────────

  describe("publish-fake-data", () => {
    it("publishes nested messages matching JSONPath structure", async () => {
      vi.mocked(api.getResource).mockResolvedValue({
        id: "bo-1",
        fields: [
          {
            id: "f-1",
            name: "App User",
            jsonPath: "$.message.body.app.user_id",
            jsonFieldType: "TEXT",
          },
          { id: "f-2", name: "Count", jsonPath: "$.message.body.count", jsonFieldType: "NUMERIC" },
        ],
      });

      const result = await manageIlluminateHandler({
        operation: "publish-fake-data",
        bo_id: "bo-1",
        publish_key: "pub-c-test",
        subscribe_key: "sub-c-test",
        count: 1,
        scenario: "generic",
      });

      const parsed = parseResult(result);
      expect(parsed.published).toBe(1);
      const msg = parsed.messages[0].message as Record<string, unknown>;
      expect((msg.app as Record<string, unknown>).user_id).toBeTypeOf("string");
      expect(msg.count).toBeTypeOf("number");
    });

    it("collects per-message failures and continues", async () => {
      vi.mocked(api.getResource).mockResolvedValue({
        id: "bo-1",
        fields: [
          { id: "f-1", name: "User", jsonPath: "$.message.body.user", jsonFieldType: "TEXT" },
        ],
      });

      let call = 0;
      publishMock.mockImplementation(async () => {
        call += 1;
        if (call === 2) throw new Error("transient error");
        return { timetoken: "1" };
      });

      const result = await manageIlluminateHandler({
        operation: "publish-fake-data",
        bo_id: "bo-1",
        publish_key: "pub-c-test",
        subscribe_key: "sub-c-test",
        count: 3,
        scenario: "generic",
      });

      expect(result.isError).toBeFalsy();
      const parsed = parseResult(result);
      expect(parsed.published).toBe(2);
      expect(parsed.failed).toBe(1);
      expect(parsed.failures[0].error).toContain("transient error");
    });

    it("returns Access Manager 403 guidance when all publishes fail", async () => {
      vi.mocked(api.getResource).mockResolvedValue({
        id: "bo-1",
        fields: [
          { id: "f-1", name: "User", jsonPath: "$.message.body.user", jsonFieldType: "TEXT" },
        ],
      });

      publishMock.mockRejectedValue({
        status: { errorData: { service: "Access Manager", status: 403 } },
      });

      const result = await manageIlluminateHandler({
        operation: "publish-fake-data",
        bo_id: "bo-1",
        publish_key: "pub-c-test",
        subscribe_key: "sub-c-test",
        count: 2,
        scenario: "generic",
      });

      expect(result.isError).toBe(true);
      const parsed = parseResult(result);
      expect(parsed.failures[0].error).toContain("Access Manager");
      expect(parsed.failures[0].error).toContain("secret_key");
    });
  });

  // ─── Analysis operations ──────────────────────────────────────────────────

  describe("analysis operations", () => {
    it("raw-snapshot builds and executes pipeline from BO fields", async () => {
      vi.mocked(api.getResource).mockResolvedValue({
        id: "bo-1",
        fields: [
          { id: "f-1", name: "User", jsonPath: "$.message.body.user", jsonFieldType: "TEXT" },
        ],
      });
      vi.mocked(api.executeAdHocQuery).mockResolvedValue({ data: [{ user: "alice" }] });

      const result = await manageIlluminateHandler({
        operation: "raw-snapshot",
        bo_id: "bo-1",
        limit: 10,
      });

      expect(api.getResource).toHaveBeenCalledWith("business-object", "bo-1");
      const pipeline = vi.mocked(api.executeAdHocQuery).mock.calls[0][0] as Record<string, unknown>;
      expect(pipeline.version).toBe("2.0");
      expect(parseResult(result).data[0].user).toBe("alice");
    });
  });

  // ─── Error handling ───────────────────────────────────────────────────────

  describe("error handling", () => {
    it("surfaces API error messages through handler error path", async () => {
      vi.mocked(api.createResource).mockRejectedValue(
        new Error("HTTP 400: Maximum of 3 metric decisions allowed")
      );

      const result = await manageIlluminateHandler({
        resource: "decision",
        operation: "create",
        data: { name: "4th", inputFields: [], outputFields: [], actions: [] },
      });

      expect(result.isError).toBe(true);
      expect(parseResult(result).message).toContain("3 metric decisions");
    });
  });
});
