import { describe, expect, it } from "vitest";
import {
  GetChatSdkDocumentationSchemaRefined,
  GetSdkDocumentationSchemaRefined,
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
      // javascript doesn't have '_users' feature
      const invalidData = {
        language: "javascript",
        feature: "_users",
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
});
