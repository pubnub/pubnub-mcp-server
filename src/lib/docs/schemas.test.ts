import { describe, expect, it } from "vitest";
import {
  GetChatSdkDocumentationSchemaRefined,
  GetGeneralMigrationGuideSchemaRefined,
  GetSdkDocumentationSchemaRefined,
  GetSdkMigrationGuideSchemaRefined,
  HowToSchema,
} from "./schemas";

describe("Docs Schemas", () => {
  describe("GetSdkDocumentationSchemaRefined", () => {
    it("should reject when feature is not available for language", () => {
      // freertos doesn't support 'files' feature
      const invalidData = {
        language: "freertos",
        feature: "files",
      };

      const result = GetSdkDocumentationSchemaRefined.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("not available for language");
      }
    });

    it("should reject feature not supported by specific language", () => {
      // javascript doesn't have 'publish-builder' feature (only objective-c does)
      const invalidData = {
        language: "javascript",
        feature: "publish-builder",
      };

      const result = GetSdkDocumentationSchemaRefined.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("GetChatSdkDocumentationSchemaRefined", () => {
    it("should reject when feature is not available for language", () => {
      // swift doesn't support 'connection-management' feature
      const invalidData = {
        language: "swift",
        feature: "connection-management",
      };

      const result = GetChatSdkDocumentationSchemaRefined.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("not available for language");
      }
    });

    it("should reject draft feature variant not available for other languages", () => {
      // kotlin has 'messages-drafts' but not 'messages-drafts_v1'
      const invalidData = {
        language: "kotlin",
        feature: "messages-drafts_v1",
      };

      const result = GetChatSdkDocumentationSchemaRefined.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("HowToSchema", () => {
    it("should accept valid slug", () => {
      const validData = {
        slug: "message-timestamps",
      };

      const result = HowToSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept another valid slug", () => {
      const validData = {
        slug: "add-presence-to-your-unity-game",
      };

      const result = HowToSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid slug", () => {
      const invalidData = {
        slug: "invalid-slug-that-does-not-exist",
      };

      const result = HowToSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty slug", () => {
      const invalidData = {
        slug: "",
      };

      const result = HowToSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("GetSdkMigrationGuideSchemaRefined", () => {
    it("should accept valid language and version", () => {
      const result = GetSdkMigrationGuideSchemaRefined.safeParse({
        language: "go",
        version: "8",
      });
      expect(result.success).toBe(true);
    });

    it("should accept kotlin with version 13", () => {
      const result = GetSdkMigrationGuideSchemaRefined.safeParse({
        language: "kotlin",
        version: "13",
      });
      expect(result.success).toBe(true);
    });

    it("should reject version not available for language", () => {
      const result = GetSdkMigrationGuideSchemaRefined.safeParse({
        language: "go",
        version: "13",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("not available for language");
      }
    });

    it("should reject invalid language", () => {
      const result = GetSdkMigrationGuideSchemaRefined.safeParse({
        language: "rust",
        version: "8",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid version", () => {
      const result = GetSdkMigrationGuideSchemaRefined.safeParse({
        language: "go",
        version: "99",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("GetGeneralMigrationGuideSchemaRefined", () => {
    it("should accept valid slug", () => {
      const result = GetGeneralMigrationGuideSchemaRefined.safeParse({
        slug: "pam-v3-migration",
      });
      expect(result.success).toBe(true);
    });

    it("should accept another valid slug", () => {
      const result = GetGeneralMigrationGuideSchemaRefined.safeParse({
        slug: "256-bit-encryption-migration",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid slug", () => {
      const result = GetGeneralMigrationGuideSchemaRefined.safeParse({
        slug: "invalid-slug-that-does-not-exist",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty slug", () => {
      const result = GetGeneralMigrationGuideSchemaRefined.safeParse({
        slug: "",
      });
      expect(result.success).toBe(false);
    });
  });
});
