import { randomUUID } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express, { type Application, type Request, type Response } from "express";
import { trackInit } from "../analytics";
import { SERVER_INFO } from "../index";
import { createLogger } from "../lib/logger";
import {
  authMiddleware,
  getOAuthConfig,
  getProtectedResourceMetadata,
  isOAuthEnabled,
} from "../lib/oauth";

const log = createLogger("http");

const enableSessions = process.env.MCP_SESSION_SUPPORT === "true";

/**
 * Create and configure Express app with MCP HTTP transport
 * This can be used for both production (via runHttp) and testing
 */
export function createApp(server: McpServer): Application {
  const app: Application = express();
  app.use(express.json());

  const transports = new Map<string, StreamableHTTPServerTransport>();

  async function createStatelessTransport(
    server: McpServer,
    res: express.Response
  ): Promise<StreamableHTTPServerTransport> {
    const transport = new StreamableHTTPServerTransport({});
    transport.onclose = () => {};
    res.on("close", () => transport.close());
    await server.connect(transport as Transport);
    return transport;
  }

  app.use((req, res, next) => {
    if (process.env.MCP_CLOUD_MODE !== "true") {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id");
    }
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Protected Resource Metadata endpoint (RFC 9728)
  app.get("/.well-known/oauth-protected-resource", (_req: Request, res: Response) => {
    res.json(getProtectedResourceMetadata());
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

  app.post("/", authMiddleware, async (req, res) => {
    log.debug(
      { method: req.method, path: req.path, contentType: req.headers["content-type"] },
      "Request received"
    );

    if (!enableSessions) {
      const transport = await createStatelessTransport(server, res);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      transport = transports.get(sessionId) as StreamableHTTPServerTransport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: sessionId => {
          transports.set(sessionId, transport);
          trackInit();
          log.info({ sessionId }, "New MCP session initialized");
        },
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          log.info({ sessionId: transport.sessionId }, "MCP session closed");
          transports.delete(transport.sessionId);
        }
      };

      await server.connect(transport as Transport);
    } else {
      res.status(404).json({
        jsonrpc: "2.0",
        error: {
          code: -32001,
          message: "Session not found. Please reinitialize.",
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  });

  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    if (!enableSessions) {
      const transport = await createStatelessTransport(server, res);
      await transport.handleRequest(req, res);
      return;
    }

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      log.warn({ sessionId, activeSessions: transports.size }, "Invalid or missing session ID");
      res.status(404).json({
        jsonrpc: "2.0",
        error: {
          code: -32001,
          message: "Session not found. Please reinitialize.",
        },
        id: null,
      });
      return;
    }

    const transport = transports.get(sessionId) as StreamableHTTPServerTransport;
    await transport.handleRequest(req, res);
  };

  app.get("/", authMiddleware, handleSessionRequest);

  app.delete("/", authMiddleware, handleSessionRequest);

  return app;
}

/**
 * Run MCP HTTP server on the specified port
 */
export function runHttp(server: McpServer, port = 3000) {
  // Validate OAuth configuration if auth is enabled
  if (isOAuthEnabled()) {
    getOAuthConfig(); // This will throw if config is invalid
  }

  const app = createApp(server);

  app.listen(port, () => {
    log.info(
      { port, sessions: enableSessions, health: `http://localhost:${port}/health` },
      "PubNub MCP server started"
    );
  });
}
