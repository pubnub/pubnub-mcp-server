import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockHasPubSubEnvKeys = vi.fn();

vi.mock("../../utils", () => ({
  hasPubSubEnvKeys: () => mockHasPubSubEnvKeys(),
}));

describe("App Context Schemas", () => {
  beforeEach(() => {
    vi.resetModules();
    mockHasPubSubEnvKeys.mockReturnValue(false);
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("ManageAppContextSchema", () => {
    describe("when env keys are NOT set", () => {
      beforeEach(() => {
        mockHasPubSubEnvKeys.mockReturnValue(false);
      });

      it("should accept valid payload with keys", async () => {
        const { ManageAppContextSchema } = await import("./schemas");
        const validPayload = {
          type: "user" as const,
          operation: "get" as const,
          id: "user-123",
          publishKey: "pub-c-test-key",
          subscribeKey: "sub-c-test-key",
        };

        const result = ManageAppContextSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
      });

      it("should include publishKey and subscribeKey fields", async () => {
        const { ManageAppContextSchema } = await import("./schemas");
        const keys = Object.keys(ManageAppContextSchema.shape);

        expect(keys).toContain("publishKey");
        expect(keys).toContain("subscribeKey");
        expect(keys).toContain("type");
        expect(keys).toContain("operation");
        expect(keys).toContain("id");
      });

      it("should reject payload without keys", async () => {
        const { ManageAppContextSchema } = await import("./schemas");
        const payload = {
          type: "user" as const,
          operation: "get" as const,
          id: "user-123",
        };

        const result = ManageAppContextSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe("when env keys ARE set", () => {
      beforeEach(() => {
        mockHasPubSubEnvKeys.mockReturnValue(true);
      });

      it("should NOT include publishKey and subscribeKey fields", async () => {
        const { ManageAppContextSchema } = await import("./schemas");
        const keys = Object.keys(ManageAppContextSchema.shape);

        expect(keys).not.toContain("publishKey");
        expect(keys).not.toContain("subscribeKey");
        expect(keys).toContain("type");
        expect(keys).toContain("operation");
        expect(keys).toContain("id");
      });

      it("should accept payload without keys", async () => {
        const { ManageAppContextSchema } = await import("./schemas");
        const payload = {
          type: "user" as const,
          operation: "get" as const,
          id: "user-123",
        };

        const result = ManageAppContextSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });
    });
  });
});
