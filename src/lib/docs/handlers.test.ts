import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { overrideDocsResponse } from "../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../test-utils/msw-setup";
import {
  getBestPracticesHandler,
  getChatSDKDocumentationHandler,
  getChatSDKDocumentationResourceHandler,
  getSDKDocumentationHandler,
  getSDKDocumentationResourceHandler,
  howToHandler,
} from "./handlers";
import type { GetChatSdkDocumentationSchemaType, GetSdkDocumentationSchemaType } from "./types";

describe("Docs Handlers", () => {
  beforeEach(() => {
    setupTestEnv();
  });

  afterEach(() => {
    clearTestEnv();
  });

  describe("getSDKDocumentationHandler", () => {
    it("should get SDK documentation successfully", async () => {
      const args = { language: "javascript" as const, feature: "publish-and-subscribe" as const };
      const result = await getSDKDocumentationHandler(args);

      expect(result.content).toHaveLength(1);
      const response = result.content?.[0];
      expect(response?.type).toBe("text");

      const parsedText = JSON.parse(response?.text ?? "{}");
      expect(parsedText.content).toContain("PubNub SDK Documentation");
      expect(parsedText.metadata.title).toBe("Publish and Subscribe - JavaScript SDK");
    });

    it("should handle API error", async () => {
      overrideDocsResponse(
        "get",
        "/sdk",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      const args = {
        language: "javascript" as const,
        feature: "invalid-feature" as unknown as GetSdkDocumentationSchemaType["feature"],
      };
      const result = await getSDKDocumentationHandler(args);

      const parsedText = JSON.parse(result.content?.[0]?.text ?? "{}");
      expect(parsedText.message).toBeDefined();
    });
  });

  describe("getChatSDKDocumentationHandler", () => {
    it("should get Chat SDK documentation successfully", async () => {
      const args = {
        language: "javascript" as const,
        feature: "messages-send-receive" as const,
      };
      const result = await getChatSDKDocumentationHandler(args);

      expect(result.content).toHaveLength(1);
      const response = result.content?.[0];
      expect(response?.type).toBe("text");

      const parsedText = JSON.parse(response?.text ?? "{}");
      expect(parsedText.content).toContain("PubNub Chat SDK Documentation");
      expect(parsedText.metadata.title).toBe("Send and Receive Messages - JavaScript Chat SDK");
    });

    it("should handle API error", async () => {
      overrideDocsResponse(
        "get",
        "/chat-sdk",
        { error: "Server Error" },
        {
          status: 500,
          statusText: "Server Error",
        }
      );

      const args = {
        language: "javascript" as const,
        feature: "messages-send-receive" as const,
      };
      const result = await getChatSDKDocumentationHandler(args);

      const parsedText = JSON.parse(result.content?.[0]?.text ?? "{}");
      expect(parsedText.message).toBeDefined();
    });
  });

  describe("getSDKDocumentationResourceHandler", () => {
    it("should handle resource request successfully", async () => {
      const uri = new URL("pubnub-docs://sdk/javascript/publish-and-subscribe");
      const args = { language: "javascript" as const, feature: "publish-and-subscribe" as const };

      const result = await getSDKDocumentationResourceHandler(uri, args);

      expect(result.contents).toHaveLength(1);
      const content = result.contents?.[0];
      expect(content?.uri).toBe(uri.href);
      expect(content?.mimeType).toBe("application/json");

      const parsedContent = JSON.parse(content?.text ?? "{}");
      expect(parsedContent.content).toBeDefined();
      expect(parsedContent.metadata).toBeDefined();
    });

    it("should throw error for missing language", async () => {
      const uri = new URL("pubnub-docs://sdk//publish-and-subscribe");
      const args = {
        language: "" as unknown as GetSdkDocumentationSchemaType["language"],
        feature: "publish-and-subscribe" as const,
      };

      await expect(getSDKDocumentationResourceHandler(uri, args)).rejects.toThrow(
        "Invalid URI format"
      );
    });

    it("should throw error for missing feature", async () => {
      const uri = new URL("pubnub-docs://sdk/javascript/");
      const args = {
        language: "javascript" as const,
        feature: "" as unknown as GetSdkDocumentationSchemaType["feature"],
      };

      await expect(getSDKDocumentationResourceHandler(uri, args)).rejects.toThrow(
        "Invalid URI format"
      );
    });

    it("should handle fetch error", async () => {
      overrideDocsResponse(
        "get",
        "/sdk",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      const uri = new URL("pubnub-docs://sdk/javascript/invalid-feature");
      const args = {
        language: "javascript" as const,
        feature: "invalid-feature" as unknown as GetSdkDocumentationSchemaType["feature"],
      };

      await expect(getSDKDocumentationResourceHandler(uri, args)).rejects.toThrow(
        "Failed to fetch documentation"
      );
    });
  });

  describe("getChatSDKDocumentationResourceHandler", () => {
    it("should handle chat SDK resource request successfully", async () => {
      const uri = new URL("pubnub-docs://chat-sdk/javascript/messages-send-receive");
      const args = {
        language: "javascript" as const,
        feature: "messages-send-receive" as const,
      };

      const result = await getChatSDKDocumentationResourceHandler(uri, args);

      expect(result.contents).toHaveLength(1);
      const content = result.contents?.[0];
      expect(content?.uri).toBe(uri.href);
      expect(content?.mimeType).toBe("application/json");

      const parsedContent = JSON.parse(content?.text ?? "{}");
      expect(parsedContent.content).toBeDefined();
      expect(parsedContent.metadata).toBeDefined();
    });

    it("should throw error for invalid URI format", async () => {
      const uri = new URL("pubnub-docs://chat-sdk//");
      const args = {
        language: "" as unknown as GetChatSdkDocumentationSchemaType["language"],
        feature: "" as unknown as GetChatSdkDocumentationSchemaType["feature"],
      };

      await expect(getChatSDKDocumentationResourceHandler(uri, args)).rejects.toThrow(
        "Invalid URI format"
      );
    });

    it("should handle fetch error", async () => {
      overrideDocsResponse(
        "get",
        "/chat-sdk",
        { error: "Server Error" },
        {
          status: 500,
          statusText: "Server Error",
        }
      );

      const uri = new URL("pubnub-docs://chat-sdk/javascript/messages-send-receive");
      const args = {
        language: "javascript" as const,
        feature: "messages-send-receive" as const,
      };

      await expect(getChatSDKDocumentationResourceHandler(uri, args)).rejects.toThrow(
        "Failed to fetch documentation"
      );
    });
  });

  describe("howToHandler", () => {
    it("should get how-to documentation successfully", async () => {
      const args = { slug: "message-timestamps" as const };
      const result = await howToHandler(args);

      expect(result.content).toHaveLength(1);
      const response = result.content?.[0];
      expect(response?.type).toBe("text");

      const parsedText = JSON.parse(response?.text ?? "{}");
      expect(parsedText.content).toContain("How to manage chat message timestamps");
      expect(parsedText.metadata.title).toBe("How to manage chat message timestamps");
    });

    it("should handle API error", async () => {
      overrideDocsResponse(
        "get",
        "/how-to",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      const args = { slug: "message-timestamps" as const };
      const result = await howToHandler(args);

      const parsedText = JSON.parse(result.content?.[0]?.text ?? "{}");
      expect(parsedText.message).toBeDefined();
    });
  });

  describe("getBestPracticesHandler", () => {
    it("should get best practices documentation successfully", async () => {
      const result = await getBestPracticesHandler();

      expect(result.content).toHaveLength(1);
      const response = result.content?.[0];
      expect(response?.type).toBe("text");

      const parsedText = JSON.parse(response?.text ?? "{}");
      expect(parsedText.content).toContain("PubNub Best Practices");
      expect(parsedText.metadata.title).toBe("PubNub Best Practices");
    });

    it("should handle API error", async () => {
      overrideDocsResponse(
        "get",
        "/best-practice",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      const result = await getBestPracticesHandler();

      const parsedText = JSON.parse(result.content?.[0]?.text ?? "{}");
      expect(parsedText.message).toBeDefined();
    });
  });
});
