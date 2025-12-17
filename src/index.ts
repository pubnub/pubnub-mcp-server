import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import pkg from "../package.json";
import { wrapToolHandler } from "./analytics.js";
import { prompts } from "./prompts.js";
import { resources } from "./resources";
import { tools } from "./tools.js";
import { runHttp } from "./transporters/http.js";
import { runStdio } from "./transporters/stdio.js";

export const SERVER_INFO = {
  name: "pubnub-mcp",
  version: pkg.version,
  description: "PubNub MCP Server - Build Realtime applications with PubNub and AI assistants",
};

class PubNubMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(SERVER_INFO, {
      instructions:
        "Use this MCP to build real-time/chat applications. ALways use get_sdk_documentation or get_chat_sdk_documentation (when building chat based application) to get latest information about PubNub features.",
    });

    this.setupToolHandlers();
    this.setupPromptHandlers();
    this.setupResourceHandlers();
  }

  private setupToolHandlers() {
    tools.forEach(tool => {
      this.server.registerTool(
        tool.name,
        tool.definition,
        // @ts-expect-error - Union types from heterogeneous tool schemas
        wrapToolHandler(tool.handler, tool.name)
      );
    });
  }

  private setupPromptHandlers() {
    prompts.forEach(prompt => {
      this.server.registerPrompt(prompt.name, prompt.definition, prompt.handler);
    });
  }

  private setupResourceHandlers() {
    resources.forEach(resource => {
      // @ts-expect-error - Union types from heterogeneous resource schemas
      this.server.registerResource(
        resource.name,
        resource.template,
        resource.definition,
        resource.handler
      );
    });
  }

  async run() {
    const mode = process.env.MCP_MODE ?? "stdio";
    const port = parseInt(process.env.PORT ?? "3000", 10);

    if (mode === "http") {
      runHttp(this.server, port);
    } else {
      await runStdio(this.server);
    }
  }
}

const args = process.argv.slice(2);
const httpMode = args.includes("--http") ?? args.includes("-h");
const port =
  args.find(arg => arg.startsWith("--port="))?.split("=")[1] ?? process.env.PORT ?? "3000";

if (httpMode) {
  process.env.MCP_MODE = "http";
  process.env.PORT = port;
}

const server = new PubNubMCPServer();
server.run().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
