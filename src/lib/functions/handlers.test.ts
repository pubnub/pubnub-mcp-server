import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { manageFunctionsHandler } from "./handlers";
import type { ManageFunctionsSchemaType } from "./types";

// Mock the API facade
vi.mock("./api");

function parseResult(result: { content?: Array<{ text?: string }> }) {
  return JSON.parse(result.content?.[0]?.text ?? "{}");
}

// Cast helper so tests can pass partial arg objects without the full type noise.
function run(args: Partial<ManageFunctionsSchemaType>) {
  return manageFunctionsHandler(args as ManageFunctionsSchemaType);
}

describe("manageFunctionsHandler", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  // ─── Package operations (account-scoped) ────────────────────────────────────

  describe("package", () => {
    it("list calls listPackages", async () => {
      const mock = { data: [{ id: "pkg-1", name: "Chat" }] };
      vi.mocked(api.listPackages).mockResolvedValue(mock);

      const res = await run({ resource: "package", operation: "list" });

      expect(api.listPackages).toHaveBeenCalledOnce();
      expect(parseResult(res)).toEqual(mock);
    });

    it("get calls getPackage with id", async () => {
      vi.mocked(api.getPackage).mockResolvedValue({ id: "pkg-1" });

      await run({ resource: "package", operation: "get", id: "pkg-1" });

      expect(api.getPackage).toHaveBeenCalledWith("pkg-1");
    });

    it("create calls createPackage with data", async () => {
      vi.mocked(api.createPackage).mockResolvedValue({ id: "pkg-new" });

      await run({ resource: "package", operation: "create", data: { name: "New" } });

      expect(api.createPackage).toHaveBeenCalledWith({ name: "New" });
    });

    it("create without data returns a friendly error and does not call the API", async () => {
      const res = await run({ resource: "package", operation: "create" });

      expect(api.createPackage).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/data argument/i);
    });

    it("get without id returns a friendly error", async () => {
      const res = await run({ resource: "package", operation: "get" });

      expect(api.getPackage).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/Missing required argument: id/);
    });

    it("list-revisions calls listPackageRevisions", async () => {
      vi.mocked(api.listPackageRevisions).mockResolvedValue({ data: [] });

      await run({ resource: "package", operation: "list-revisions", id: "pkg-1" });

      expect(api.listPackageRevisions).toHaveBeenCalledWith("pkg-1", undefined);
    });

    it("rejects an unsupported operation for the resource", async () => {
      const res = await run({ resource: "package", operation: "start" });

      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/not supported for resource "package"/);
    });
  });

  // ─── Revision + test inputs ──────────────────────────────────────────────────

  describe("revision", () => {
    it("list-functions calls listRevisionFunctions", async () => {
      vi.mocked(api.listRevisionFunctions).mockResolvedValue({ data: [] });

      await run({ resource: "revision", operation: "list-functions", id: "rev-1" });

      expect(api.listRevisionFunctions).toHaveBeenCalledWith("rev-1", undefined);
    });

    it("create-test-input requires function_revision_id", async () => {
      const res = await run({
        resource: "revision",
        operation: "create-test-input",
        data: { name: "t" },
      });

      expect(api.createTestInput).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/function_revision_id/);
    });

    it("create-test-input calls createTestInput", async () => {
      vi.mocked(api.createTestInput).mockResolvedValue({ id: "ti-1" });

      await run({
        resource: "revision",
        operation: "create-test-input",
        function_revision_id: "fr-1",
        data: { name: "t", payload: {} },
      });

      expect(api.createTestInput).toHaveBeenCalledWith("fr-1", { name: "t", payload: {} });
    });
  });

  // ─── Deployments (keyset-scoped + lifecycle) ─────────────────────────────────

  describe("deployment", () => {
    it("create requires a numeric keyset id", async () => {
      const res = await run({
        resource: "deployment",
        operation: "create",
        data: { packageRevisionId: "rev-1" },
      });

      expect(api.createDeployment).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/keyset id/i);
    });

    it("create merges keyset_id into the body as keysetId", async () => {
      vi.mocked(api.createDeployment).mockResolvedValue({ id: "dep-1" });

      await run({
        resource: "deployment",
        operation: "create",
        data: { packageRevisionId: "rev-1" },
        keyset_id: 12345,
      });

      expect(api.createDeployment).toHaveBeenCalledWith({
        packageRevisionId: "rev-1",
        keysetId: 12345,
      });
    });

    it("create accepts keysetId supplied directly in data", async () => {
      vi.mocked(api.createDeployment).mockResolvedValue({ id: "dep-2" });

      await run({
        resource: "deployment",
        operation: "create",
        data: { packageRevisionId: "rev-1", keysetId: 999 },
      });

      expect(api.createDeployment).toHaveBeenCalledWith({
        packageRevisionId: "rev-1",
        keysetId: 999,
      });
    });

    it("start calls startDeployment with only the id", async () => {
      vi.mocked(api.startDeployment).mockResolvedValue({ status: "starting" });

      await run({ resource: "deployment", operation: "start", id: "dep-1" });

      expect(api.startDeployment).toHaveBeenCalledWith("dep-1");
    });

    it("stop calls stopDeployment with the id and no force by default", async () => {
      vi.mocked(api.stopDeployment).mockResolvedValue({ status: "stopping" });

      await run({ resource: "deployment", operation: "stop", id: "dep-1" });

      expect(api.stopDeployment).toHaveBeenCalledWith("dep-1", undefined);
    });

    it("stop forwards force when set", async () => {
      vi.mocked(api.stopDeployment).mockResolvedValue({ status: "stopping" });

      await run({ resource: "deployment", operation: "stop", id: "dep-1", force: true });

      expect(api.stopDeployment).toHaveBeenCalledWith("dep-1", true);
    });

    it("rolling-update calls rollingUpdateDeployment with id and data", async () => {
      vi.mocked(api.rollingUpdateDeployment).mockResolvedValue({ ok: true });

      await run({
        resource: "deployment",
        operation: "rolling-update",
        id: "dep-1",
        data: { newPackageDeploymentId: "dep-2" },
      });

      expect(api.rollingUpdateDeployment).toHaveBeenCalledWith("dep-1", {
        newPackageDeploymentId: "dep-2",
      });
    });

    it("intersected passes keyset_id and channels", async () => {
      vi.mocked(api.getIntersectedDeployments).mockResolvedValue({ data: [] });

      await run({
        resource: "deployment",
        operation: "intersected",
        channels: ["chat.*", "alerts.*"],
        keyset_id: 42,
      });

      expect(api.getIntersectedDeployments).toHaveBeenCalledWith(
        42,
        ["chat.*", "alerts.*"],
        undefined
      );
    });

    it("intersected forwards function_type when set", async () => {
      vi.mocked(api.getIntersectedDeployments).mockResolvedValue({ data: [] });

      await run({
        resource: "deployment",
        operation: "intersected",
        channels: ["chat.*"],
        keyset_id: 42,
        function_type: "js-before-publish",
      });

      expect(api.getIntersectedDeployments).toHaveBeenCalledWith(
        42,
        ["chat.*"],
        "js-before-publish"
      );
    });

    it("intersected requires keyset_id", async () => {
      const res = await run({
        resource: "deployment",
        operation: "intersected",
        channels: ["chat.*"],
      });

      expect(api.getIntersectedDeployments).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/keyset_id/);
    });

    it("stop-by is account-scoped and works without a keyset", async () => {
      vi.mocked(api.stopDeploymentsBy).mockResolvedValue({ stopped: 2 });

      await run({ resource: "deployment", operation: "stop-by", package_id: "pkg-1" });

      expect(api.stopDeploymentsBy).toHaveBeenCalledWith({ package_id: "pkg-1" });
    });

    it("stop-by rejects when neither package_id nor package_revision_id is set", async () => {
      const res = await run({ resource: "deployment", operation: "stop-by" });

      expect(api.stopDeploymentsBy).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
    });

    it("stop-by rejects when both id params are set", async () => {
      const res = await run({
        resource: "deployment",
        operation: "stop-by",
        package_id: "pkg-1",
        package_revision_id: "rev-1",
      });

      expect(api.stopDeploymentsBy).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/only ONE/i);
    });
  });

  // ─── KV store ────────────────────────────────────────────────────────────────

  describe("kv-store", () => {
    it("set defaults to string type", async () => {
      vi.mocked(api.setKvEntry).mockResolvedValue({ success: true });

      await run({
        resource: "kv-store",
        operation: "set",
        key: "config",
        value: "hello",
        subscribe_key: "sub-c-test",
      });

      expect(api.setKvEntry).toHaveBeenCalledWith(
        "string",
        "config",
        "hello",
        "sub-c-test",
        undefined
      );
    });

    it("set json passes ttl through", async () => {
      vi.mocked(api.setKvEntry).mockResolvedValue({ success: true });

      await run({
        resource: "kv-store",
        operation: "set",
        kv_type: "json",
        key: "cfg",
        value: { a: 1 },
        ttl: 60,
        subscribe_key: "sub-c-test",
      });

      expect(api.setKvEntry).toHaveBeenCalledWith("json", "cfg", { a: 1 }, "sub-c-test", 60);
    });

    it("increment requires counter type", async () => {
      const res = await run({
        resource: "kv-store",
        operation: "increment",
        kv_type: "string",
        key: "n",
        subscribe_key: "sub-c-test",
      });

      expect(api.incrementCounter).not.toHaveBeenCalled();
      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/counter/);
    });

    it("increment calls incrementCounter with amount", async () => {
      vi.mocked(api.incrementCounter).mockResolvedValue({ value: 5 });

      await run({
        resource: "kv-store",
        operation: "increment",
        kv_type: "counter",
        key: "votes",
        amount: 3,
        subscribe_key: "sub-c-test",
      });

      expect(api.incrementCounter).toHaveBeenCalledWith("votes", "sub-c-test", 3);
    });
  });

  // ─── Secrets ─────────────────────────────────────────────────────────────────

  describe("secret", () => {
    it("set calls setSecret", async () => {
      vi.mocked(api.setSecret).mockResolvedValue({ success: true });

      await run({
        resource: "secret",
        operation: "set",
        key: "API_KEY",
        value: "shh",
        subscribe_key: "sub-c-test",
      });

      expect(api.setSecret).toHaveBeenCalledWith("API_KEY", "shh", "sub-c-test");
    });

    it("list calls listSecrets", async () => {
      vi.mocked(api.listSecrets).mockResolvedValue({ keys: ["API_KEY"] });

      await run({ resource: "secret", operation: "list", subscribe_key: "sub-c-test" });

      expect(api.listSecrets).toHaveBeenCalledWith("sub-c-test");
    });
  });

  // ─── Catalog + limits ────────────────────────────────────────────────────────

  describe("catalog and limit", () => {
    it("list-blueprints calls listPackageBlueprints", async () => {
      vi.mocked(api.listPackageBlueprints).mockResolvedValue({ data: [] });

      await run({ resource: "catalog", operation: "list-blueprints" });

      expect(api.listPackageBlueprints).toHaveBeenCalledOnce();
    });

    it("import calls importPackageFromBlueprint with id and keysetId-merged data", async () => {
      vi.mocked(api.importPackageFromBlueprint).mockResolvedValue({ id: "pkg-imported" });

      await run({
        resource: "catalog",
        operation: "import",
        id: "bp-1",
        data: { revisionName: "v1", functions: [] },
        keyset_id: 777,
      });

      expect(api.importPackageFromBlueprint).toHaveBeenCalledWith("bp-1", {
        revisionName: "v1",
        functions: [],
        keysetId: 777,
      });
    });

    it("get-running-deployments calls getRunningDeploymentsLimit", async () => {
      vi.mocked(api.getRunningDeploymentsLimit).mockResolvedValue({ current: 1, max: 10 });

      await run({ resource: "limit", operation: "get-running-deployments" });

      expect(api.getRunningDeploymentsLimit).toHaveBeenCalledOnce();
    });
  });

  // ─── Error surfacing ─────────────────────────────────────────────────────────

  describe("upstream errors", () => {
    it("surfaces a FAAS error from the API through parseError", async () => {
      vi.mocked(api.getPackage).mockRejectedValue(
        new Error('HTTP 404: {"errors":[{"code":"FAAS-1004","message":"Package not found"}]}')
      );

      const res = await run({ resource: "package", operation: "get", id: "missing" });

      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/FAAS-1004/);
    });

    it("surfaces a 403 permission error", async () => {
      vi.mocked(api.listPackages).mockRejectedValue(
        new Error("HTTP 403: insufficient permissions")
      );

      const res = await run({ resource: "package", operation: "list" });

      expect(res.isError).toBe(true);
      expect(res.content?.[0]?.text).toMatch(/403/);
    });
  });

  it("rejects an unknown resource", async () => {
    const res = await run({
      resource: "nope" as unknown as ManageFunctionsSchemaType["resource"],
      operation: "list",
    });

    expect(res.isError).toBe(true);
    expect(res.content?.[0]?.text).toMatch(/Unknown resource/);
  });
});
