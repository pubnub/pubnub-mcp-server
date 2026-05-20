import { HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { overrideAdminApiRoute } from "../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../test-utils/msw-setup";
import { mockV2App, mockV2CreateKeysetResponse } from "../../test-utils/test-fixtures";
import {
  createApp,
  createKeyset,
  listApps,
  listKeysets,
  updateApp,
  updateKeysetConfig,
} from "./api";

vi.mock("../oauth", () => ({
  getOAuthToken: vi.fn(() => "mock-oauth-token"),
}));

describe("Portal v2 API", () => {
  beforeEach(() => {
    setupTestEnv();
  });

  afterEach(() => {
    clearTestEnv();
  });

  describe("listApps", () => {
    it("should list apps successfully", async () => {
      const result = await listApps();

      expect(result.apps).toHaveLength(1);
      expect(result.apps[0]).toMatchObject({
        id: "100",
        name: "Test App",
      });
      expect(result.total).toBe(1);
    });
  });

  describe("createApp", () => {
    it("should create app successfully", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("post", "/v2/apps", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockV2App, { status: 201 });
      });

      const result = await createApp("New App");

      expect(requestBody).toMatchObject({ name: "New App" });
      expect(result.id).toBe("100");
    });
  });

  describe("updateApp", () => {
    it("should update app successfully", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("patch", "/v2/apps/:id", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockV2App);
      });

      const result = await updateApp("100", "Updated Name");

      expect(requestBody).toMatchObject({ name: "Updated Name" });
      expect(result).toBeUndefined();
    });
  });

  describe("listKeysets", () => {
    it("should list keysets successfully", async () => {
      const result = await listKeysets();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "1",
        name: "Test Keyset",
        publishKey: "pub-c-mock-key",
        subscribeKey: "sub-c-mock-key",
      });
    });
  });

  describe("createKeyset", () => {
    it("should create keyset successfully", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("post", "/v2/keysets", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockV2CreateKeysetResponse, { status: 201 });
      });

      const result = await createKeyset({
        name: "New Keyset",
        appId: "100",
        type: "testing",
        config: {
          messagePersistence: { enabled: true, retention: 7 },
        },
      });

      expect(requestBody).toMatchObject({
        keyset: {
          name: "New Keyset",
          appId: "100",
          type: "testing",
        },
      });
      expect(result.publishKey).toBe("pub-c-mock-key");
      expect(result.subscribeKey).toBe("sub-c-mock-key");
    });
  });

  describe("updateKeysetConfig", () => {
    it("should update keyset config successfully", async () => {
      let requestBody: unknown = null;

      overrideAdminApiRoute("patch", "/v2/keysets/:id/config", async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(mockV2CreateKeysetResponse.config);
      });

      const result = await updateKeysetConfig("1", {
        messagePersistence: { enabled: true, retention: 30 },
      });

      expect(requestBody).toMatchObject({
        messagePersistence: { enabled: true, retention: 30 },
      });
      expect(result).toBeUndefined();
    });
  });
});
