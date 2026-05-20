import type { Server } from "node:http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PubNubMCPServer } from "./index";
import { chatSdkLanguageToFeatures, sdkLanguageToFeatures } from "./lib/docs/schemas";
import { createMcpClient } from "./test-utils/mcp-client";
import { createApp } from "./transporters/http";

const TEST_PORT = 3460;

let mcpClient: ReturnType<typeof createMcpClient>["mcpClient"];
let httpTransport: ReturnType<typeof createMcpClient>["httpTransport"];
let httpServer: Server | undefined;

const getClient = () => {
  if (!mcpClient) {
    throw new Error("MCP client not initialized");
  }
  return mcpClient;
};

describe("Resources", () => {
  beforeEach(async () => {
    process.env.MCP_OAUTH_ENABLED = "false";
    const serverInstance = new PubNubMCPServer();
    const app = createApp(serverInstance.getServer());
    httpServer = app.listen(TEST_PORT);
    await new Promise<void>((resolve, reject) => {
      if (httpServer) {
        httpServer.on("listening", resolve);
        httpServer.on("error", reject);
      }
    });

    ({ mcpClient, httpTransport } = createMcpClient(TEST_PORT));
    await mcpClient.connect(httpTransport);
  });

  afterEach(async () => {
    await mcpClient?.close();
    await httpTransport?.close();
    mcpClient = undefined;
    httpTransport = undefined;

    await new Promise<void>(resolve => {
      if (httpServer) {
        httpServer.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
    httpServer = undefined;
  });

  describe("Resource Registration", () => {
    it("should list resources", async () => {
      const { resources } = await getClient().listResources();
      expect(resources).toBeDefined();
      expect(Array.isArray(resources)).toBe(true);
    });

    it("should have SDK docs resources", async () => {
      const { resources } = await getClient().listResources();
      const sdkResources = resources.filter(r => r.uri.includes("pubnub-docs://sdk/"));
      expect(sdkResources.length).toBeGreaterThan(0);
    });

    it("should have Chat SDK docs resources", async () => {
      const { resources } = await getClient().listResources();
      const chatSdkResources = resources.filter(r => r.uri.includes("pubnub-docs://chat-sdk/"));
      expect(chatSdkResources.length).toBeGreaterThan(0);
    });

    it("should list all resource templates", async () => {
      const { resourceTemplates } = await getClient().listResourceTemplates();
      expect(resourceTemplates).toBeDefined();
      expect(Array.isArray(resourceTemplates)).toBe(true);
      expect(resourceTemplates.length).toBe(2);

      const sdkTemplate = resourceTemplates.find(t => t.name === "pubnub_sdk_docs");
      expect(sdkTemplate).toBeDefined();
      expect(sdkTemplate?.uriTemplate).toBe("pubnub-docs://sdk/{language}/{feature}");
      expect(sdkTemplate?.title).toBe("PubNub SDK Documentation");
      expect(sdkTemplate?.mimeType).toBe("application/json");

      const chatSdkTemplate = resourceTemplates.find(t => t.name === "pubnub_chat_sdk_docs");
      expect(chatSdkTemplate).toBeDefined();
      expect(chatSdkTemplate?.uriTemplate).toBe("pubnub-docs://chat-sdk/{language}/{feature}");
      expect(chatSdkTemplate?.title).toBe("PubNub Chat SDK Documentation");
      expect(chatSdkTemplate?.mimeType).toBe("application/json");
    });

    it("should generate all possible SDK resources from template", async () => {
      const { resources } = await getClient().listResources();

      let expectedSdkResourceCount = 0;
      for (const features of Object.values(sdkLanguageToFeatures)) {
        expectedSdkResourceCount += features.length;
      }

      const sdkResources = resources.filter(r => r.uri.includes("pubnub-docs://sdk/"));
      expect(sdkResources.length).toBe(expectedSdkResourceCount);

      for (const [language, features] of Object.entries(sdkLanguageToFeatures)) {
        for (const feature of features) {
          const expectedUri = `pubnub-docs://sdk/${language}/${feature}`;
          const resource = sdkResources.find(r => r.uri === expectedUri);
          expect(resource, `Missing resource: ${expectedUri}`).toBeDefined();
          expect(resource?.name).toBe(`${language}_${feature}_docs`);
          expect(resource?.description).toContain(language);
          expect(resource?.description).toContain(feature);
          expect(resource?.mimeType).toBe("application/json");
        }
      }
    });

    it("should generate all possible Chat SDK resources from template", async () => {
      const { resources } = await getClient().listResources();

      let expectedChatSdkResourceCount = 0;
      for (const features of Object.values(chatSdkLanguageToFeatures)) {
        expectedChatSdkResourceCount += features.length;
      }

      const chatSdkResources = resources.filter(r => r.uri.includes("pubnub-docs://chat-sdk/"));
      expect(chatSdkResources.length).toBe(expectedChatSdkResourceCount);

      for (const [language, features] of Object.entries(chatSdkLanguageToFeatures)) {
        for (const feature of features) {
          const expectedUri = `pubnub-docs://chat-sdk/${language}/${feature}`;
          const resource = chatSdkResources.find(r => r.uri === expectedUri);
          expect(resource, `Missing resource: ${expectedUri}`).toBeDefined();
          expect(resource?.name).toBe(`${language}_${feature}_chat_docs`);
          expect(resource?.description).toContain(language);
          expect(resource?.description).toContain(feature);
          expect(resource?.mimeType).toBe("application/json");
        }
      }
    });
  });
});
