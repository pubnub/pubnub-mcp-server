import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export const createMcpClient = () => {
  const mcpClient = new Client(
    {
      name: "mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  const stdioTransport = new StdioClientTransport({
    command: "npm",
    args: ["start"],
  });

  return { mcpClient, stdioTransport };
};
