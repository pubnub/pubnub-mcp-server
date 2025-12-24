import { describe, expect, it } from "vitest";
import {
  CreateKeysetDataSchema,
  UpdateKeysetDataSchema,
  FilesRetention,
  MessageStorageRetention,
} from "./schemas";

describe("Portal Schemas", () => {
  describe("FilesRetention", () => {
    it("should accept valid retention values (1, 7, 30, 90, 180, 365, 0)", () => {
      const validValues = [1, 7, 30, 90, 180, 365, 0];

      for (const value of validValues) {
        const result = FilesRetention.safeParse(value);
        expect(result.success, `Expected ${value} to be valid`).toBe(true);
      }
    });

    it("should reject invalid retention values", () => {
      const invalidValues = [2, 5, 10, 15, 60, 100, 200, 400, -1, -7];

      for (const value of invalidValues) {
        const result = FilesRetention.safeParse(value);
        expect(result.success, `Expected ${value} to be rejected`).toBe(false);
      }
    });
  });

  describe("MessageStorageRetention", () => {
    it("should accept valid retention values (1, 7, 30, 90, 180, 365, 0)", () => {
      const validValues = [1, 7, 30, 90, 180, 365, 0];

      for (const value of validValues) {
        const result = MessageStorageRetention.safeParse(value);
        expect(result.success, `Expected ${value} to be valid`).toBe(true);
      }
    });

    it("should reject invalid retention values", () => {
      const invalidValues = [2, 5, 10, 15, 60, 100, 200, 400, -1, -7];

      for (const value of invalidValues) {
        const result = MessageStorageRetention.safeParse(value);
        expect(result.success, `Expected ${value} to be rejected`).toBe(false);
      }
    });
  });


  describe("CreateKeysetDataSchema - nested config structure", () => {
    it("should accept valid keyset data with all config options", () => {
      const validData = {
        name: "My Keyset",
        type: "production",
        config: {
          messagePersistence: { enabled: true, retention: 7 },
          appContext: { enabled: true, region: "aws-iad-1" },
          files: { enabled: true, region: "us-east-1", retention: 7 },
          presence: { enabled: true },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept keyset data with string appId", () => {
      const validData = {
        name: "My Keyset",
        appId: "12345",
        type: "production",
        config: {
          messagePersistence: { enabled: true, retention: 7 },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject when messagePersistence.enabled=true but retention is missing", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          messagePersistence: {
            enabled: true,
            // missing retention
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("retention");
      }
    });

    it("should reject when appContext.enabled=true but region is missing", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          appContext: {
            enabled: true,
            // missing region
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("region");
      }
    });

    it("should reject when files.enabled=true but region is missing", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          files: {
            enabled: true,
            retention: 7,
            // missing region
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("region");
      }
    });

    it("should reject when files.enabled=true but retention is missing", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          files: {
            enabled: true,
            region: "us-east-1",
            // missing retention
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("retention");
      }
    });

    it("should reject invalid appContext.region", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          appContext: {
            enabled: true,
            region: "invalid-region",
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid files.region", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          files: {
            enabled: true,
            region: "invalid-region",
            retention: 7,
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid messagePersistence.retention value", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          messagePersistence: {
            enabled: true,
            retention: 15, // invalid value
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid files.retention value", () => {
      const invalidData = {
        name: "My Keyset",
        type: "production",
        config: {
          files: {
            enabled: true,
            region: "us-east-1",
            retention: 15, // invalid value
          },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept all valid files.retention values (1, 7, 30, 90, 180, 365, 0)", () => {
      const validRetentions = [1, 7, 30, 90, 180, 365, 0];

      for (const retention of validRetentions) {
        const validData = {
          name: "My Keyset",
          type: "production",
          config: {
            files: {
              enabled: true,
              region: "us-east-1",
              retention,
            },
          },
        };

        const result = CreateKeysetDataSchema.safeParse(validData);
        expect(result.success, `Expected files.retention=${retention} to be valid`).toBe(true);
      }
    });

    it("should allow disabled features without required fields", () => {
      const validData = {
        name: "My Keyset",
        type: "production",
        config: {
          messagePersistence: { enabled: false },
          appContext: { enabled: false },
          files: { enabled: false },
        },
      };

      const result = CreateKeysetDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("UpdateKeysetDataSchema", () => {
    it("should accept valid update data with string id", () => {
      const validData = {
        id: "12345",
        config: {
          messagePersistence: { enabled: true, retention: 30 },
        },
      };

      const result = UpdateKeysetDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should apply same refinement rules as CreateKeysetDataSchema", () => {
      const invalidData = {
        id: "123",
        config: {
          messagePersistence: {
            enabled: true,
            // missing retention
          },
        },
      };

      const result = UpdateKeysetDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
