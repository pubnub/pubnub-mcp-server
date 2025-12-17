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
