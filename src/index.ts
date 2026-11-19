import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { flushAnalytics, wrapToolHandler } from "./analytics.js";
import { createLogger } from "./lib/logger";
import { prompts } from "./prompts.js";
import { resources } from "./resources";
import { SERVER_INFO } from "./server-info";
import { tools } from "./tools.js";
import { runHttp } from "./transporters/http.js";
import { runStdio } from "./transporters/stdio.js";

const log = createLogger("server");

export function createMcpServer(): McpServer {
  const server = new McpServer(SERVER_INFO, {
    instructions: `PubNub MCP Server - Build real-time applications with PubNub.
        TOOL SELECTION GUIDE:
        1. **Start here**: Call "write_pubnub_app" first when unsure which tool to use and for production-ready patterns
        2. **Chat apps**: Use "get_chat_sdk_documentation" for chat/messaging features
        3. **Non-chat real-time**: Use "get_sdk_documentation" for IoT, gaming, analytics, pub/sub and for non-chat real-time applications
        4. **Use case guides**: Use "how_to" for conceptual/integration guides
      `,
  });

  tools.forEach(tool => {
    server.registerTool(
      tool.name,
      tool.definition,
      // @ts-expect-error - Union types from heterogeneous tool schemas
      wrapToolHandler(tool.handler, tool.name)
    );
  });

  prompts.forEach(prompt => {
    server.registerPrompt(prompt.name, prompt.definition, prompt.handler);
  });

  resources.forEach(resource => {
    // @ts-expect-error - Union types from heterogeneous resource schemas
    server.registerResource(
      resource.name,
      resource.template,
      resource.definition,
      resource.handler
    );
  });

  return server;
}

async function run() {
  const mode = process.env.MCP_MODE ?? "stdio";
  const port = parseInt(process.env.PORT ?? "3000", 10);

  if (mode === "http") {
    runHttp(createMcpServer, port);
  } else {
    await runStdio(createMcpServer());
  }
}

function installShutdownHandlers() {
  let finished = false;

  function finish(signal: "SIGTERM" | "SIGINT") {
    if (finished) return;
    finished = true;
    process.off("SIGTERM", sigtermHandler);
    process.off("SIGINT", sigintHandler);
    process.kill(process.pid, signal);
  }

  function onShutdown(signal: "SIGTERM" | "SIGINT") {
    void flushAnalytics().finally(() => {
      finish(signal);
    });
    // Don't let a hung flush block shutdown indefinitely.
    setTimeout(() => {
      finish(signal);
    }, 2000).unref();
  }

  function sigtermHandler() {
    onShutdown("SIGTERM");
  }
  function sigintHandler() {
    onShutdown("SIGINT");
  }

  process.on("SIGTERM", sigtermHandler);
  process.on("SIGINT", sigintHandler);
}

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(
    [
      `${SERVER_INFO.name} ${SERVER_INFO.version}`,
      "",
      "Usage: npx @pubnub/mcp [options]",
      "",
      "Runs over stdio by default.",
      "",
      "Options:",
      "  --http          Run the Streamable HTTP transport (development use; localhost only without OAuth)",
      "  --port=<port>   HTTP port (default: 3000, or PORT env var)",
      "  -h, --help      Show this help",
      "",
    ].join("\n")
  );
  process.exit(0);
}

const httpMode = args.includes("--http");
const port =
  args.find(arg => arg.startsWith("--port="))?.split("=")[1] ?? process.env.PORT ?? "3000";

if (httpMode) {
  process.env.MCP_MODE = "http";
  process.env.PORT = port;
}

installShutdownHandlers();
run().catch((error: unknown) => {
  log.fatal({ err: error }, "Failed to start server");
  process.exit(1);
});
