import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { localhostHostValidation } from "@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express, { type Application, type Request, type Response } from "express";
import { trackInit } from "../analytics";
import { createLogger } from "../lib/logger";
import {
  authMiddleware,
  getAuthServerMetadata,
  getOAuthConfig,
  getProtectedResourceMetadata,
  isOAuthEnabled,
} from "../lib/oauth";
import { SERVER_INFO } from "../server-info";

const log = createLogger("http");

const LOOPBACK_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

/**
 * True when the Origin points at the local machine (e.g. a local MCP Inspector).
 * Opaque origins ("null"), file:// and anything unparsable are rejected.
 */
export function isLoopbackOrigin(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin);
    return (protocol === "http:" || protocol === "https:") && LOOPBACK_HOSTNAMES.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * Create and configure Express app with MCP HTTP transport
 * This can be used for both production (via runHttp) and testing
 *
 * Every request gets its own McpServer from `createServer`: the SDK's Protocol owns a single
 * transport, so sharing one server across transports lets responses reach the wrong client.
 */
export function createApp(createServer: () => McpServer): Application {
  const app: Application = express();
  app.set("trust proxy", true);
  app.use(express.json());

  async function handleMcpRequest(req: Request, res: Response) {
    try {
      const server = createServer();
      const transport = new StreamableHTTPServerTransport({});
      res.on("close", () => {
        void server.close();
      });
      await server.connect(transport as Transport);
      if (isInitializeRequest(req.body)) {
        trackInit();
      }
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      log.error({ err: error, method: req.method }, "Failed to handle MCP request");
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  }

  // Without OAuth every tool runs with the server's own credentials (PUBNUB_API_KEY),
  // so only local clients may talk to it. Host validation blocks DNS rebinding;
  // the Origin check below blocks cross-site requests from pages in the user's browser.
  const unauthenticated = !isOAuthEnabled();
  if (unauthenticated) {
    app.use(localhostHostValidation());
  }

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (unauthenticated) {
      if (origin !== undefined && !isLoopbackOrigin(origin)) {
        log.warn({ origin }, "Rejected request from non-local origin");
        res.status(403).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: `Origin not allowed: ${origin}` },
          id: null,
        });
        return;
      }
      if (origin !== undefined) {
        res.header("Access-Control-Allow-Origin", origin);
      }
      res.header("Vary", "Origin");
    } else {
      // Every MCP route requires a bearer token, so browser-based MCP clients may call from any origin.
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, mcp-session-id, mcp-protocol-version, last-event-id"
    );
    // Expose headers so browsers can read them.
    res.header("Access-Control-Expose-Headers", "mcp-session-id, WWW-Authenticate");
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

  // Mirror AS metadata (RFC 8414) for pre-RFC 9728 clients.
  const serveAuthServerMetadata = async (_req: Request, res: Response) => {
    if (!isOAuthEnabled()) {
      res.status(404).json({ error: "OAuth is not enabled" });
      return;
    }
    try {
      res.json(await getAuthServerMetadata());
    } catch (error) {
      log.error({ err: error }, "Failed to mirror authorization server metadata");
      res.status(502).json({ error: "Failed to fetch authorization server metadata" });
    }
  };
  app.get("/.well-known/oauth-authorization-server", serveAuthServerMetadata);
  app.get("/.well-known/openid-configuration", serveAuthServerMetadata);

  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "OK",
      server: SERVER_INFO.name,
      version: SERVER_INFO.version,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.post("/", authMiddleware, handleMcpRequest);
  app.get("/", authMiddleware, handleMcpRequest);
  app.delete("/", authMiddleware, handleMcpRequest);

  return app;
}

/**
 * Run MCP HTTP server on the specified port
 */
export function runHttp(createServer: () => McpServer, port = 3000) {
  // Validate OAuth configuration if auth is enabled
  if (isOAuthEnabled()) {
    getOAuthConfig(); // This will throw if config is invalid
  }

  // Cloud deployments sit behind an ingress and must listen on all interfaces;
  // local runs stay on loopback unless HOST is set explicitly.
  // (undefined = Node's default of all interfaces, IPv4 and IPv6).
  const host =
    process.env.HOST ?? (process.env.MCP_CLOUD_MODE === "true" ? undefined : "127.0.0.1");

  if (!isOAuthEnabled()) {
    log.warn(
      { host },
      "OAuth is disabled: every request runs with this server's PubNub credentials. " +
        "Only localhost clients are accepted. Set MCP_OAUTH_ENABLED=true for any shared or remote deployment."
    );
  }

  const app = createApp(createServer);

  const onListening = () => {
    log.info(
      {
        host: host ?? "all interfaces",
        port,
        health: `http://localhost:${port}/health`,
      },
      "PubNub MCP server started"
    );
  };

  if (host) {
    app.listen(port, host, onListening);
  } else {
    app.listen(port, onListening);
  }
}
