import type { Server } from "node:http";
import express, { type Express } from "express";
import {
  mockAppsListResponse,
  mockAuthResponse,
  mockBestPracticesDocumentation,
  mockBillingInfoPro,
  mockChatSdkDocumentation,
  mockCreateAppResponse,
  mockHowToDocumentation,
  mockListKeysResponse,
  mockSdkDocumentation,
} from "./test-fixtures";

/**
 * Creates a mock Portal API server that handles all PubNub Portal API endpoints
 * This server runs in the test process and handles requests from the MCP child process
 */
export function createMockPortalApiServer(
  port: number
): Promise<{ server: Server; close: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    const app: Express = express();
    app.use(express.json());

    // Enable CORS
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      if (req.method === "OPTIONS") {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Authentication endpoint - CRITICAL
    app.post("/api/me", (_req, res) => {
      res.json(mockAuthResponse);
    });

    // Apps endpoints
    app.get("/api/apps", (_req, res) => {
      res.json(mockAppsListResponse);
    });

    app.post("/api/apps", (_req, res) => {
      res.json(mockCreateAppResponse);
    });

    app.patch("/api/apps/:appId", (_req, res) => {
      res.json({ success: true });
    });

    // Keysets endpoints
    app.get("/api/keys", (_req, res) => {
      res.json(mockListKeysResponse);
    });

    app.post("/api/keys", (_req, res) => {
      res.json(mockListKeysResponse);
    });

    app.patch("/api/keys/:keysetId", (_req, res) => {
      res.json({ success: true });
    });

    // Account/billing endpoint
    app.get("/api/subscription/accounts/:accountId/is-paid", (_req, res) => {
      res.json(mockBillingInfoPro);
    });

    // Auto moderation config endpoints
    // Check for conflicts (called before creating AM config)
    app.get("/api/faas/v1/package-deployments/intersected", (_req, res) => {
      res.json({
        data: [], // No conflicts - empty array
      });
    });

    // Create word list (called when word masking is enabled)
    app.post("/api/bizops-dashboards/accounts/:accountId/word-lists", (req, res) => {
      res.json({
        id: 123, // Must be a number, not a string
        name: req.body?.name || "Test Word List",
        words: req.body?.words || [],
      });
    });

    // Create auto moderation config
    app.post("/api/bizops-dashboards/auto-moderation/:accountId/configs", (req, res) => {
      res.json({
        success: true,
        config: {
          id: "am-config-123",
          keysetId: req.body?.keysetId || "123456",
          name: req.body?.name || "Test Config",
          description: req.body?.description || "",
          channels: req.body?.channels || [],
          activate: true,
        },
      });
    });

    const httpServer = app.listen(port, () => {
      resolve({
        server: httpServer,
        close: () =>
          new Promise(resolveClose => {
            httpServer.close(() => resolveClose());
          }),
      });
    });

    httpServer.on("error", reject);
  });
}

/**
 * Creates a mock Docs API server that handles all documentation API endpoints
 * This server runs in the test process and handles requests from the MCP child process
 */
export function createMockDocsApiServer(
  port: number
): Promise<{ server: Server; close: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    const app: Express = express();
    app.use(express.json());

    // SDK documentation endpoint
    app.get("/api/v1/sdk", (_req, res) => {
      res.json(mockSdkDocumentation);
    });

    // Chat SDK documentation endpoint
    app.get("/api/v1/chat-sdk", (_req, res) => {
      res.json(mockChatSdkDocumentation);
    });

    const httpServer = app.listen(port, () => {
      resolve({
        server: httpServer,
        close: () =>
          new Promise(resolveClose => {
            httpServer.close(() => resolveClose());
          }),
      });
    });

    app.get("/api/v1/how-to", (_req, res) => {
      res.json(mockHowToDocumentation);
    });

    app.get("/api/v1/best-practice", (_req, res) => {
      res.json(mockBestPracticesDocumentation);
    });

    httpServer.on("error", reject);
  });
}
