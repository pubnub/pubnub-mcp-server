import type { Server } from "node:http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PubNubMCPServer } from "./index";
import { createMcpClient } from "./test-utils/mcp-client";
import { createApp } from "./transporters/http";

const TEST_PORT = 3456;

let mcpClient: ReturnType<typeof createMcpClient>["mcpClient"];
let httpTransport: ReturnType<typeof createMcpClient>["httpTransport"];
let httpServer: Server | undefined;

const getClient = () => {
  if (!mcpClient) {
    throw new Error("MCP client not initialized");
  }
  return mcpClient;
};

describe("Tools", () => {
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

  describe("Tool Registration", () => {
    it("should have all expected tools registered", async () => {
      const { tools } = await getClient().listTools();
      const MCPToolsNames = tools.map(tool => tool.name);

      const expectedTools = [
        "get_sdk_documentation",
        "get_chat_sdk_documentation",
        "get_sdk_migration_guide",
        "get_general_migration_guide",
        "how_to",
        "write_pubnub_app",
        "manage_apps",
        "manage_keysets",
        "get_usage_metrics",
        "manage_app_context",
        "send_pubnub_message",
        "get_pubnub_presence",
        "subscribe_and_receive_pubnub_messages",
        "get_pubnub_messages",
        "manage_illuminate",
        "insights",
      ];

      expect(tools).toBeDefined();
      expect(tools.length).toBe(16);
      expect(MCPToolsNames).toEqual(expectedTools);
    });

    it("should have input schemas for tools that require arguments", async () => {
      const { tools } = await getClient().listTools();

      const toolsWithInputs = [
        "manage_apps",
        "manage_keysets",
        "get_sdk_documentation",
        "get_chat_sdk_documentation",
        "get_sdk_migration_guide",
        "send_pubnub_message",
        "get_pubnub_presence",
        "manage_app_context",
        "subscribe_and_receive_pubnub_messages",
        "get_pubnub_messages",
        "how_to",
        "get_usage_metrics",
        "manage_illuminate",
        "insights",
      ];

      for (const toolName of toolsWithInputs) {
        const tool = tools.find(t => t.name === toolName);
        expect(tool?.inputSchema).toBeDefined();
      }
    });
  });
});
