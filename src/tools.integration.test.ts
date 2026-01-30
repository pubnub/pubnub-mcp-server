import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMcpClient } from "./test-utils/mcp-client";

let mcpClient: ReturnType<typeof createMcpClient>["mcpClient"] | undefined;
let stdioTransport: ReturnType<typeof createMcpClient>["stdioTransport"] | undefined;

const getClient = () => {
  if (!mcpClient) {
    throw new Error("MCP client not initialized");
  }

  return mcpClient;
};

describe("Tools", () => {
  beforeEach(async () => {
    ({ mcpClient, stdioTransport } = createMcpClient());
    await mcpClient.connect(stdioTransport);
  });

  afterEach(async () => {
    await mcpClient?.close();
    await stdioTransport?.close();
    mcpClient = undefined;
    stdioTransport = undefined;
  });

  describe("Tool Registration", () => {
    it("should have all expected tools registered", async () => {
      const { tools } = await getClient().listTools();
      const MCPToolsNames = tools.map(tool => tool.name);

      const expectedTools = [
        "get_sdk_documentation",
        "get_chat_sdk_documentation",
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
      ];

      expect(tools).toBeDefined();
      expect(tools.length).toBe(12);
      expect(MCPToolsNames).toEqual(expectedTools);
    });

    it("should have input schemas for tools that require arguments", async () => {
      const { tools } = await getClient().listTools();

      const toolsWithInputs = [
        "manage_apps",
        "manage_keysets",
        "get_sdk_documentation",
        "get_chat_sdk_documentation",
        "send_pubnub_message",
        "get_pubnub_presence",
        "manage_app_context",
        "subscribe_and_receive_pubnub_messages",
        "get_pubnub_messages",
        "how_to",
        "get_usage_metrics",
      ];

      for (const toolName of toolsWithInputs) {
        const tool = tools.find(t => t.name === toolName);
        expect(tool?.inputSchema).toBeDefined();
      }
    });
  });
});
