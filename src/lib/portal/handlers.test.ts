import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { manageAppsHandler, manageKeysetsHandler } from "./handlers";

// Mock the API facade
vi.mock("./api");

describe("Portal Handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("manageAppsHandler", () => {
    it("should handle list operation", async () => {
      const mockResult = {
        apps: [{ id: "1", name: "Test App" }],
        total: 1,
      };
      vi.mocked(api.listApps).mockResolvedValue(mockResult);

      const result = await manageAppsHandler({ operation: "list" });

      expect(api.listApps).toHaveBeenCalledOnce();
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("should handle create operation", async () => {
      const mockResult = { id: "new-app-id" };
      vi.mocked(api.createApp).mockResolvedValue(mockResult);

      const result = await manageAppsHandler({
        operation: "create",
        data: { name: "New App" },
      });

      expect(api.createApp).toHaveBeenCalledWith("New App");
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("should handle update operation", async () => {
      vi.mocked(api.updateApp).mockResolvedValue();

      const result = await manageAppsHandler({
        operation: "update",
        data: { id: "app-id", name: "Updated Name" },
      });

      expect(api.updateApp).toHaveBeenCalledWith("app-id", "Updated Name");
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed.message).toBe("App updated successfully");
    });

    it("should handle API errors", async () => {
      const error = new Error("API Error");
      vi.mocked(api.listApps).mockRejectedValue(error);

      const result = await manageAppsHandler({ operation: "list" });

      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed.message).toContain("API Error");
    });
  });

  describe("manageKeysetsHandler", () => {
    it("should handle list operation without appId", async () => {
      const mockResult = [
        {
          id: "1",
          name: "Test Keyset",
          subscribeKey: "sub-key",
          publishKey: "pub-key",
          type: "production" as const,
        },
      ];
      vi.mocked(api.listKeysets).mockResolvedValue(mockResult);

      const result = await manageKeysetsHandler({ operation: "list" });

      expect(api.listKeysets).toHaveBeenCalledWith(undefined);
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("should handle list operation with appId", async () => {
      const mockResult = [
        {
          id: "1",
          name: "Test Keyset",
          subscribeKey: "sub-key",
          publishKey: "pub-key",
          type: "production" as const,
        },
      ];
      vi.mocked(api.listKeysets).mockResolvedValue(mockResult);

      const result = await manageKeysetsHandler({
        operation: "list",
        data: { appId: "app-123" },
      });

      expect(api.listKeysets).toHaveBeenCalledWith("app-123");
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("should handle create operation", async () => {
      const mockResult = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        message: "Keyset created successfully",
      };
      vi.mocked(api.createKeyset).mockResolvedValue(mockResult);

      const createRequest = {
        name: "Test Keyset",
        appId: "app-123",
        type: "production" as const,
        config: {
          messagePersistence: { enabled: true, retention: 7 as const },
          appContext: { enabled: false },
          files: { enabled: false },
          presence: { enabled: true },
        },
      };

      const result = await manageKeysetsHandler({
        operation: "create",
        data: createRequest,
      });

      expect(api.createKeyset).toHaveBeenCalledWith(createRequest);
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("should handle create operation without appId", async () => {
      const mockResult = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        message: "Keyset created successfully",
      };
      vi.mocked(api.createKeyset).mockResolvedValue(mockResult);

      const createRequest = {
        name: "Test Keyset",
        type: "testing" as const,
        config: {
          messagePersistence: { enabled: true, retention: 1 as const },
          appContext: { enabled: true, region: "aws-iad-1" as const },
          files: { enabled: false },
          presence: { enabled: true },
        },
      };

      const result = await manageKeysetsHandler({
        operation: "create",
        data: createRequest,
      });

      expect(api.createKeyset).toHaveBeenCalledWith({
        ...createRequest,
        appId: undefined,
      });
      expect(result.content?.[0]?.type).toBe("text");
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed).toEqual(mockResult);
    });

    it("should handle update operation", async () => {
      vi.mocked(api.updateKeysetConfig).mockResolvedValue();

      const config = {
        messagePersistence: { enabled: true, retention: 30 as const },
      };

      const result = await manageKeysetsHandler({
        operation: "update",
        data: { id: "keyset-123", config },
      });

      expect(api.updateKeysetConfig).toHaveBeenCalledWith("keyset-123", config);
      expect(result.content?.[0]?.text).toBe("Keyset updated successfully");
    });

    it("should handle environment key restrictions", async () => {
      const error = new Error(
        "Cannot update keyset 999. When PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY are set, only the configured keyset (ID: 1) can be updated."
      );
      vi.mocked(api.updateKeysetConfig).mockRejectedValue(error);

      const result = await manageKeysetsHandler({
        operation: "update",
        data: {
          id: "999",
          config: { messagePersistence: { enabled: true, retention: 30 as const } },
        },
      });

      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed.message).toContain("Cannot update keyset 999");
    });

    it("should handle API errors", async () => {
      const error = new Error("Keyset creation failed");
      vi.mocked(api.createKeyset).mockRejectedValue(error);

      const result = await manageKeysetsHandler({
        operation: "create",
        data: {
          name: "Test Keyset",
          type: "production" as const,
          config: {},
        },
      });

      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content?.[0]?.text ?? "");
      expect(parsed.message).toContain("Keyset creation failed");
    });
  });
});
