import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { trackInit } from "../analytics";
import { createLogger } from "../lib/logger";

const log = createLogger("stdio");

export async function runStdio(server: McpServer): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  trackInit();
  log.info("PubNub MCP server running on stdio");
}
