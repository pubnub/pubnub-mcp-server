import type { Server } from "node:http";
import express, { type Express } from "express";
import {
  mockBestPracticesDocumentation,
  mockChatSdkDocumentation,
  mockHowToDocumentation,
  mockIlluminateActionLog,
  mockIlluminateBusinessObject,
  mockIlluminateDecisionScaffold,
  mockIlluminateDecisionWithRules,
  mockIlluminateQueryFields,
  mockIlluminateQueryResult,
  mockSdkDocumentation,
  mockV2App,
  mockV2AppsListResponse,
  mockV2CreateKeysetResponse,
  mockV2KeysetsListResponse,
} from "./test-fixtures";

export function createMockPortalApiServer(
  port: number
): Promise<{ server: Server; close: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    const app: Express = express();
    app.use(express.json());

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

    app.get("/v2/apps", (_req, res) => {
      res.json(mockV2AppsListResponse);
    });

    app.post("/v2/apps", (_req, res) => {
      res.status(201).json(mockV2App);
    });

    app.get("/v2/apps/:id", (_req, res) => {
      res.json(mockV2App);
    });

    app.patch("/v2/apps/:id", (_req, res) => {
      res.json(mockV2App);
    });

    app.get("/v2/keysets", (_req, res) => {
      res.json(mockV2KeysetsListResponse);
    });

    app.post("/v2/keysets", (_req, res) => {
      res.status(201).json(mockV2CreateKeysetResponse);
    });

    app.get("/v2/keysets/:id/config", (_req, res) => {
      res.json(mockV2CreateKeysetResponse.config);
    });

    app.patch("/v2/keysets/:id/config", (_req, res) => {
      res.json(mockV2CreateKeysetResponse.config);
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

export function createMockDocsApiServer(
  port: number
): Promise<{ server: Server; close: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    const app: Express = express();
    app.use(express.json());

    app.get("/api/v1/sdk", (_req, res) => {
      res.json(mockSdkDocumentation);
    });

    app.get("/api/v1/chat-sdk", (_req, res) => {
      res.json(mockChatSdkDocumentation);
    });

    app.get("/api/v1/how-to", (_req, res) => {
      res.json(mockHowToDocumentation);
    });

    app.get("/api/v1/best-practice", (_req, res) => {
      res.json(mockBestPracticesDocumentation);
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
 * Creates a mock Illuminate API server that handles all Illuminate REST endpoints
 * This server runs in the test process and handles requests from the MCP child process
 */
export function createMockIlluminateApiServer(
  port: number
): Promise<{ server: Server; close: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    const app: Express = express();
    app.use(express.json());

    const router = express.Router();

    // Business Objects
    router.get("/business-objects", (_req, res) => {
      res.json([mockIlluminateBusinessObject]);
    });

    router.get("/business-objects/:id", (_req, res) => {
      res.json(mockIlluminateBusinessObject);
    });

    router.post("/business-objects", (req, res) => {
      res.json({ ...mockIlluminateBusinessObject, ...req.body });
    });

    router.put("/business-objects/:id", (req, res) => {
      res.json({ ...mockIlluminateBusinessObject, ...req.body });
    });

    router.delete("/business-objects/:id", (_req, res) => {
      res.status(204).send();
    });

    // Metrics
    router.get("/metrics", (_req, res) => {
      res.json([]);
    });

    router.get("/metrics/:id", (req, res) => {
      res.json({ id: req.params.id, name: "Test Metric", function: "COUNT" });
    });

    router.post("/metrics", (req, res) => {
      res.json({ id: "met-001", ...req.body });
    });

    // Decisions
    router.get("/decisions", (_req, res) => {
      res.json([mockIlluminateDecisionWithRules]);
    });

    router.get("/decisions/:id", (_req, res) => {
      res.json(mockIlluminateDecisionWithRules);
    });

    router.post("/decisions", (req, res) => {
      const scaffoldActions = mockIlluminateDecisionScaffold.actions.map(
        (a: Record<string, unknown>, i: number) => {
          const reqAction = req.body?.actions?.[i];
          return reqAction ? { ...a, ...reqAction } : a;
        }
      );
      res.json({ ...mockIlluminateDecisionScaffold, actions: scaffoldActions });
    });

    router.put("/decisions/:id", (req, res) => {
      res.json({ ...mockIlluminateDecisionScaffold, ...req.body });
    });

    router.delete("/decisions/:id", (_req, res) => {
      res.status(204).send();
    });

    router.get("/decisions/:id/action-log", (_req, res) => {
      res.json(mockIlluminateActionLog);
    });

    // Queries
    router.get("/queries/:id/fields", (_req, res) => {
      res.json(mockIlluminateQueryFields);
    });

    router.post("/queries/execute", (_req, res) => {
      res.json(mockIlluminateQueryResult);
    });

    router.post("/queries/:id/execute", (_req, res) => {
      res.json(mockIlluminateQueryResult);
    });

    // Dashboards
    router.get("/dashboards", (_req, res) => {
      res.json([]);
    });

    router.post("/dashboards", (req, res) => {
      res.json({ id: "dash-001", ...req.body });
    });

    app.use("/v2/illuminate", router);

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
