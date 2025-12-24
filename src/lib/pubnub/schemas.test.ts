import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockHasPubSubEnvKeys = vi.fn();

vi.mock("../utils", () => ({
  hasPubSubEnvKeys: () => mockHasPubSubEnvKeys(),
}));

describe("PubNub Schemas", () => {
  beforeEach(() => {
    vi.resetModules();
    mockHasPubSubEnvKeys.mockReturnValue(false);
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("PublishMessageSchema", () => {
    it("should accept string messages", async () => {
      const { PublishMessageSchema } = await import("./schemas");
      const validPayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
        message: "Hello World",
        type: "message" as const,
      };

      const result = PublishMessageSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should accept JSON-stringifiable messages", async () => {
      const { PublishMessageSchema } = await import("./schemas");
      const validPayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
        message: { text: "Hello World", count: 42 },
        type: "message" as const,
      };

      const result = PublishMessageSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject number messages", async () => {
      const { PublishMessageSchema } = await import("./schemas");
      const invalidPayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
        message: 42,
        type: "message" as const,
      };

      const result = PublishMessageSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("should reject boolean messages", async () => {
      const { PublishMessageSchema } = await import("./schemas");
      const invalidPayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
        message: true,
        type: "message" as const,
      };

      const result = PublishMessageSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("SubscribeSchema", () => {
    it("should accept valid timeout values (0-30)", async () => {
      const { SubscribeSchema } = await import("./schemas");
      const basePayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
      };

      expect(SubscribeSchema.safeParse({ ...basePayload, timeout: 0 }).success).toBe(true);
      expect(SubscribeSchema.safeParse({ ...basePayload, timeout: 10 }).success).toBe(true);
      expect(SubscribeSchema.safeParse({ ...basePayload, timeout: 30 }).success).toBe(true);
    });

    it("should reject negative timeout values", async () => {
      const { SubscribeSchema } = await import("./schemas");
      const payload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
        timeout: -5,
      };

      const result = SubscribeSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject timeout values greater than 30", async () => {
      const { SubscribeSchema } = await import("./schemas");
      const payload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
        timeout: 31,
      };

      const result = SubscribeSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should accept valid messageCount values (>= 1)", async () => {
      const { SubscribeSchema } = await import("./schemas");
      const basePayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
      };

      expect(SubscribeSchema.safeParse({ ...basePayload, messageCount: 1 }).success).toBe(true);
      expect(SubscribeSchema.safeParse({ ...basePayload, messageCount: 10 }).success).toBe(true);
      expect(SubscribeSchema.safeParse({ ...basePayload, messageCount: 100 }).success).toBe(true);
    });

    it("should reject messageCount values less than 1", async () => {
      const { SubscribeSchema } = await import("./schemas");
      const basePayload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
      };

      expect(SubscribeSchema.safeParse({ ...basePayload, messageCount: 0 }).success).toBe(false);
      expect(SubscribeSchema.safeParse({ ...basePayload, messageCount: -1 }).success).toBe(false);
      expect(SubscribeSchema.safeParse({ ...basePayload, messageCount: -10 }).success).toBe(false);
    });

    it("should use default values when timeout and messageCount are not provided", async () => {
      const { SubscribeSchema } = await import("./schemas");
      const payload = {
        publishKey: "pub-c-test-key",
        subscribeKey: "sub-c-test-key",
        channel: "test-channel",
      };

      const result = SubscribeSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timeout).toBe(10);
        expect(result.data.messageCount).toBe(1);
      }
    });
  });

  describe("Conditional Key Fields", () => {
    describe("when env keys are NOT set", () => {
      beforeEach(() => {
        mockHasPubSubEnvKeys.mockReturnValue(false);
      });

      it("PublishMessageSchema should include publishKey and subscribeKey fields", async () => {
        const { PublishMessageSchema } = await import("./schemas");
        const keys = Object.keys(PublishMessageSchema.shape);

        expect(keys).toContain("publishKey");
        expect(keys).toContain("subscribeKey");
        expect(keys).toContain("channel");
        expect(keys).toContain("message");
      });

      it("GetPresenceSchema should include publishKey and subscribeKey fields", async () => {
        const { GetPresenceSchema } = await import("./schemas");
        const keys = Object.keys(GetPresenceSchema.shape);

        expect(keys).toContain("publishKey");
        expect(keys).toContain("subscribeKey");
        expect(keys).toContain("channels");
      });

      it("SubscribeSchema should include publishKey and subscribeKey fields", async () => {
        const { SubscribeSchema } = await import("./schemas");
        const keys = Object.keys(SubscribeSchema.shape);

        expect(keys).toContain("publishKey");
        expect(keys).toContain("subscribeKey");
        expect(keys).toContain("channel");
      });

      it("GetHistorySchema should include publishKey and subscribeKey fields", async () => {
        const { GetHistorySchema } = await import("./schemas");
        const keys = Object.keys(GetHistorySchema.shape);

        expect(keys).toContain("publishKey");
        expect(keys).toContain("subscribeKey");
        expect(keys).toContain("channels");
      });
    });

    describe("when env keys ARE set", () => {
      beforeEach(() => {
        mockHasPubSubEnvKeys.mockReturnValue(true);
      });

      it("PublishMessageSchema should NOT include publishKey and subscribeKey fields", async () => {
        const { PublishMessageSchema } = await import("./schemas");
        const keys = Object.keys(PublishMessageSchema.shape);

        expect(keys).not.toContain("publishKey");
        expect(keys).not.toContain("subscribeKey");
        expect(keys).toContain("channel");
        expect(keys).toContain("message");
      });

      it("GetPresenceSchema should NOT include publishKey and subscribeKey fields", async () => {
        const { GetPresenceSchema } = await import("./schemas");
        const keys = Object.keys(GetPresenceSchema.shape);

        expect(keys).not.toContain("publishKey");
        expect(keys).not.toContain("subscribeKey");
        expect(keys).toContain("channels");
      });

      it("SubscribeSchema should NOT include publishKey and subscribeKey fields", async () => {
        const { SubscribeSchema } = await import("./schemas");
        const keys = Object.keys(SubscribeSchema.shape);

        expect(keys).not.toContain("publishKey");
        expect(keys).not.toContain("subscribeKey");
        expect(keys).toContain("channel");
      });

      it("GetHistorySchema should NOT include publishKey and subscribeKey fields", async () => {
        const { GetHistorySchema } = await import("./schemas");
        const keys = Object.keys(GetHistorySchema.shape);

        expect(keys).not.toContain("publishKey");
        expect(keys).not.toContain("subscribeKey");
        expect(keys).toContain("channels");
      });
    });
  });
});
