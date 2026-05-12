import { randomUUID } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express, { type Application, type Request, type Response } from "express";
import { trackInit } from "../analytics";
import { SERVER_INFO } from "../index";

export function runHttp(server: McpServer, port = 3000) {
  const app: Application = express();
  app.use(express.json());

  const transports = new Map<string, StreamableHTTPServerTransport>();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "OK",
      server: SERVER_INFO.name,
      version: SERVER_INFO.version,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      sessions: transports.size,
    });
  });

  app.post("/mcp", async (req, res) => {
    console.debug("POST /mcp request received");
    console.debug("Headers:", JSON.stringify(req.headers, null, 2));
    console.debug("Body:", JSON.stringify(req.body, null, 2));

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      transport = transports.get(sessionId)!;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: sessionId => {
          transports.set(sessionId, transport);
          trackInit();
          console.log(`New MCP session initialized: ${sessionId}`);
        },
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          console.log(`MCP session closed: ${transport.sessionId}`);
          transports.delete(transport.sessionId);
        }
      };

      await server.connect(transport);
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided or invalid request",
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  });

  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    console.debug(`${req.method} /mcp request received`);
    console.debug("Headers:", JSON.stringify(req.headers, null, 2));

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      console.warn("Invalid or missing session ID:", sessionId);
      console.warn("Available sessions:", Array.from(transports.keys()));
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided or invalid request",
        },
        id: null,
      });
      return;
    }

    const transport = transports.get(sessionId)!;
    await transport.handleRequest(req, res);
  };

  app.get("/mcp", handleSessionRequest);

  app.delete("/mcp", handleSessionRequest);

  app.listen(port, () => {
    console.log(`🚀 PubNub MCP server running on port ${port}`);
    console.log(`📍 Health check: http://localhost:${port}/health`);
    console.log(`🔗 MCP over HTTP: POST/GET/DELETE http://localhost:${port}/mcp`);
    console.log(`📡 Streamable HTTP transport with session management enabled`);
  });
}
