import { describe, expect, it } from "vitest";
import { ManageAppContextSchema } from "./schemas";

describe("App Context Schemas", () => {
  describe("ManageAppContextSchema", () => {
    it("should accept valid payload with keys", () => {
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

    it("should include publishKey and subscribeKey fields", () => {
      const keys = Object.keys(ManageAppContextSchema.shape);

      expect(keys).toContain("publishKey");
      expect(keys).toContain("subscribeKey");
      expect(keys).toContain("type");
      expect(keys).toContain("operation");
      expect(keys).toContain("id");
    });

    it("should reject payload without keys", () => {
      const payload = {
        type: "user" as const,
        operation: "get" as const,
        id: "user-123",
      };

      const result = ManageAppContextSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
