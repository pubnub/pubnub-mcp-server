import { HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { overrideDocsResponse, overrideDocsRoute } from "../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../test-utils/msw-setup";
import {
  mockBestPracticesDocumentation,
  mockChatSdkDocumentation,
  mockHowToDocumentation,
  mockSdkDocumentation,
} from "../../test-utils/test-fixtures";
import { getBestPractices, getChatSdkDocumentation, getHowTo, getSdkDocumentation } from "./api";
import type { GetChatSdkDocumentationSchemaType, GetSdkDocumentationSchemaType } from "./types";

describe("Docs API", () => {
  beforeEach(() => {
    setupTestEnv();
  });

  afterEach(() => {
    clearTestEnv();
  });

  describe("getSdkDocumentation", () => {
    it("should fetch SDK documentation successfully", async () => {
      const result = await getSdkDocumentation("python", "configuration");

      expect(result).toEqual(mockSdkDocumentation);
    });

    it("should throw error on HTTP error response", async () => {
      overrideDocsResponse(
        "get",
        "/sdk",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      await expect(getSdkDocumentation("javascript", "publish-and-subscribe")).rejects.toThrow(
        "Failed to fetch SDK documentation: 404 Not Found"
      );
    });

    it("should throw error on network failure", async () => {
      overrideDocsRoute("get", "/sdk", () => HttpResponse.error());

      await expect(getSdkDocumentation("javascript", "publish-and-subscribe")).rejects.toThrow();
    });

    it("should reject invalid language/feature combination", async () => {
      // freertos doesn't support files feature
      await expect(
        getSdkDocumentation(
          "freertos" as unknown as GetSdkDocumentationSchemaType["language"],
          "files" as unknown as GetSdkDocumentationSchemaType["feature"]
        )
      ).rejects.toThrow();
    });

    it("should use custom SDK docs API URL", async () => {
      const customUrl = "https://custom-docs.api.com";
      process.env.SDK_DOCS_API_URL = customUrl;

      overrideDocsResponse("get", "/sdk", mockSdkDocumentation);

      // Need to reimport to pick up new env var
      const { getSdkDocumentation: getCustomSdkDocs } = await import("./api");

      const result = await getCustomSdkDocs("javascript", "publish-and-subscribe");

      expect(result).toEqual(mockSdkDocumentation);
    });
  });

  describe("getChatSdkDocumentation", () => {
    it("should fetch Chat SDK documentation successfully", async () => {
      const result = await getChatSdkDocumentation("kotlin", "channels-create");

      expect(result).toEqual(mockChatSdkDocumentation);
    });

    it("should throw error on HTTP error response", async () => {
      overrideDocsResponse(
        "get",
        "/chat-sdk",
        { error: "Server Error" },
        {
          status: 500,
          statusText: "Server Error",
        }
      );

      await expect(getChatSdkDocumentation("javascript", "messages-send-receive")).rejects.toThrow(
        "Failed to fetch SDK documentation: 500 Server Error"
      );
    });

    it("should throw error on network failure", async () => {
      overrideDocsRoute("get", "/chat-sdk", () => HttpResponse.error());

      await expect(
        getChatSdkDocumentation("javascript", "messages-send-receive")
      ).rejects.toThrow();
    });

    it("should reject invalid language/feature combination", async () => {
      // swift doesn't support connection-management feature
      await expect(
        getChatSdkDocumentation(
          "swift" as unknown as GetChatSdkDocumentationSchemaType["language"],
          "connection-management" as unknown as GetChatSdkDocumentationSchemaType["feature"]
        )
      ).rejects.toThrow();
    });

    it("should use custom SDK docs API URL", async () => {
      const customUrl = "https://chat-docs.api.com";
      process.env.SDK_DOCS_API_URL = customUrl;

      overrideDocsResponse("get", "/chat-sdk", mockChatSdkDocumentation);

      // Need to reimport to pick up new env var
      const { getChatSdkDocumentation: getCustomChatSdkDocs } = await import("./api");

      const result = await getCustomChatSdkDocs("javascript", "messages-send-receive");

      expect(result).toEqual(mockChatSdkDocumentation);
    });
  });

  describe("getHowTo", () => {
    it("should fetch how-to documentation successfully", async () => {
      const result = await getHowTo("message-timestamps");

      expect(result).toEqual(mockHowToDocumentation);
    });

    it("should throw error on HTTP error response", async () => {
      overrideDocsResponse(
        "get",
        "/how-to",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      await expect(getHowTo("message-timestamps")).rejects.toThrow(
        "Failed to fetch SDK documentation: 404 Not Found"
      );
    });

    it("should throw error on network failure", async () => {
      overrideDocsRoute("get", "/how-to", () => HttpResponse.error());

      await expect(getHowTo("message-timestamps")).rejects.toThrow();
    });

    it("should reject invalid slug", async () => {
      await expect(getHowTo("invalid-slug" as Parameters<typeof getHowTo>[0])).rejects.toThrow();
    });
  });

  describe("getBestPractices", () => {
    it("should fetch best practices documentation successfully", async () => {
      const result = await getBestPractices();

      expect(result).toEqual(mockBestPracticesDocumentation);
    });

    it("should throw error on HTTP error response", async () => {
      overrideDocsResponse(
        "get",
        "/best-practice",
        { error: "Not Found" },
        {
          status: 404,
          statusText: "Not Found",
        }
      );

      await expect(getBestPractices()).rejects.toThrow(
        "Failed to fetch SDK documentation: 404 Not Found"
      );
    });

    it("should throw error on network failure", async () => {
      overrideDocsRoute("get", "/best-practice", () => HttpResponse.error());

      await expect(getBestPractices()).rejects.toThrow();
    });
  });
});
