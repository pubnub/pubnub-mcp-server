import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const createMcpClient = (port = 3456) => {
  const mcpClient = new Client(
    {
      name: "mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  const httpTransport = new StreamableHTTPClientTransport(new URL(`http://localhost:${port}`));

  return { mcpClient, httpTransport };
};
