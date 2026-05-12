import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { overridePortalResponse } from "../../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../../test-utils/msw-setup";
import { mockAuthError, mockAuthResponse } from "../../../test-utils/test-fixtures";
import { authenticate, listKeysets, resetPortalState } from "./api";

describe("Portal v1 API", () => {
  beforeEach(() => {
    setupTestEnv();
    resetPortalState();
  });

  afterEach(() => {
    clearTestEnv();
    resetPortalState();
  });

  describe("authenticate", () => {
    it("should authenticate successfully", async () => {
      const result = await authenticate();

      expect(result.sessionToken).toBe("mock-session-token-123");
      expect(result.accountId).toBe(789);
    });

    it("should throw error on authentication failure", async () => {
      overridePortalResponse("post", "/me", mockAuthError, { status: 401 });

      await expect(authenticate()).rejects.toThrow("Authentication failed: 401");
    });

    it("should throw error when credentials are missing", async () => {
      delete process.env.PUBNUB_EMAIL;
      delete process.env.PUBNUB_PASSWORD;

      await expect(authenticate()).rejects.toThrow(
        "PUBNUB_EMAIL and PUBNUB_PASSWORD environment variables must be set"
      );
    });

    it("should use custom portal API URL", async () => {
      const customUrl = "https://custom.api.com";
      process.env.ADMIN_API_V1_URL = customUrl;

      overridePortalResponse("post", "/me", mockAuthResponse);

      const result = await authenticate();

      expect(result.sessionToken).toBe("mock-session-token-123");
    });
  });

  describe("listKeysets", () => {
    it("should list keysets by account", async () => {
      const result = await listKeysets("account", 789);

      expect(result).toHaveLength(1);
      expect(result?.[0]).toMatchObject({
        id: "1",
        name: "Test Keyset",
        subscribeKey: "sub-c-mock-key",
        publishKey: "pub-c-mock-key",
      });
    });

    it("should list keysets by app", async () => {
      const result = await listKeysets("app", 100);

      expect(result).toHaveLength(1);
    });

    it("should return empty array when no keysets exist", async () => {
      overridePortalResponse("get", "/keys", { result: [] });

      const result = await listKeysets("account", 789);

      expect(result).toEqual([]);
    });
  });
});
