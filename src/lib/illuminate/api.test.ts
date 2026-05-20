import { HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { overrideAdminApiRoute } from "../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../test-utils/msw-setup";
import {
  mockIlluminateActionLog,
  mockIlluminateBusinessObject,
  mockIlluminateQueryFields,
  mockIlluminateQueryResult,
} from "../../test-utils/test-fixtures";
import {
  createResource,
  deleteResource,
  executeAdHocQuery,
  executeSavedQuery,
  getActionLog,
  getQueryFields,
  getResource,
  listResources,
  updateResource,
} from "./api";

vi.mock("../oauth", () => ({
  getOAuthToken: vi.fn(() => "mock-oauth-token"),
}));

describe("Illuminate API", () => {
  beforeEach(() => {
    setupTestEnv();
  });

  afterEach(() => {
    clearTestEnv();
  });

  describe("listResources", () => {
    it("GETs /{resource-path}", async () => {
      const result = await listResources("business-object");

      expect(result).toEqual([mockIlluminateBusinessObject]);
    });
  });

  describe("getResource", () => {
    it("GETs /{resource-path}/{id}", async () => {
      const result = await getResource("business-object", "bo-abc-123");

      expect(result).toEqual(mockIlluminateBusinessObject);
    });
  });

  describe("createResource", () => {
    it("POSTs to /{resource-path} with JSON body", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("post", "/v2/illuminate/business-objects", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockIlluminateBusinessObject, { status: 201 });
      });

      const data = { name: "New BO", fields: [] };
      const result = await createResource("business-object", data);

      expect(requestBody).toEqual(data);
      expect(result).toEqual(mockIlluminateBusinessObject);
    });
  });

  describe("updateResource", () => {
    it("PUTs to /{resource-path}/{id} with JSON body", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("put", "/v2/illuminate/business-objects/:id", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockIlluminateBusinessObject);
      });

      const data = { name: "Updated BO" };
      await updateResource("business-object", "bo-abc-123", data);

      expect(requestBody).toEqual(data);
    });
  });

  describe("deleteResource", () => {
    it("returns { success: true } for 204 response", async () => {
      const result = await deleteResource("business-object", "bo-abc-123");

      expect(result).toEqual({ success: true });
    });
  });

  describe("getQueryFields", () => {
    it("GETs /queries/{queryId}/fields", async () => {
      const result = await getQueryFields("q-123");

      expect(result).toEqual(mockIlluminateQueryFields);
    });
  });

  describe("executeAdHocQuery", () => {
    it("POSTs pipeline to /queries/execute", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("post", "/v2/illuminate/queries/execute", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockIlluminateQueryResult);
      });

      const pipeline = { version: "2.0", pipeline: { sources: [], output: {} } };
      const result = await executeAdHocQuery(pipeline);

      expect(requestBody).toEqual(pipeline);
      expect(result).toEqual(mockIlluminateQueryResult);
    });
  });

  describe("executeSavedQuery", () => {
    it("POSTs to /queries/{queryId}/execute", async () => {
      const result = await executeSavedQuery("q-saved-1");

      expect(result).toEqual(mockIlluminateQueryResult);
    });
  });

  describe("getActionLog", () => {
    it("GETs /decisions/{decisionId}/action-log", async () => {
      const result = await getActionLog("dec-xyz-789");

      expect(result).toEqual(mockIlluminateActionLog);
    });
  });

  describe("error handling", () => {
    it("throws Error with HTTP status and body for non-ok responses", async () => {
      overrideAdminApiRoute("get", "/v2/illuminate/business-objects", () => {
        return HttpResponse.text("Bad Request: invalid resource", { status: 400 });
      });

      await expect(listResources("business-object")).rejects.toThrow(
        "HTTP 400: Bad Request: invalid resource"
      );
    });
  });
});
