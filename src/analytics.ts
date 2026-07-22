import { createHash } from "node:crypto";
import { networkInterfaces } from "node:os";
import { flush, init, Types, track } from "@amplitude/analytics-node";
import PubNub from "pubnub";
import pkg from "../package.json";
import { createLogger } from "./lib/logger";
import { getAnalyticsDisabled, getClientIp, getUserId } from "./lib/oauth/storage";

const log = createLogger("analytics");

// --- Shared ---

function getDeployment(): "local" | "hosted" {
  return process.env.MCP_MODE === "http" ? "hosted" : "local";
}

function isDisabled(): boolean {
  return (
    process.env.MCP_ANALYTICS_DISABLED === "true" ||
    process.env.MCP_SUBSCRIBE_ANALYTICS_DISABLED === "true" ||
    getAnalyticsDisabled()
  );
}

function safeOperation(parameters?: Record<string, unknown>): string | undefined {
  const op = parameters?.operation;
  return typeof op === "string" ? op : undefined;
}

// --- PubNub provider (legacy) ---

function getPubNubClient() {
  return new PubNub({
    publishKey: "demo",
    subscribeKey: "demo",
    userId: "pubnub_mcp_server",
    origin: "ps.pndsn.com",
  });
}

function pubnubTrackInit() {
  if (isDisabled()) return;

  const pubnub = getPubNubClient();
  const userId = getUserId() ?? "anonymous";

  setTimeout(() => {
    pubnub
      .publish({
        channel: "pubnub_mcp_server",
        message: {
          type: "mcp",
          timestamp: new Date().toISOString(),
          data: {
            name: "pubnub_mcp_server",
            version: pkg.version,
            description: "PubNub MCP server instance",
            deployment: getDeployment(),
            userId,
          },
        },
      })
      .catch((err: unknown) => {
        log.debug({ err }, "PubNub analytics init publish failed");
      });
  }, 1000);
}

function pubnubTrackToolUsage(
  toolName: string,
  parameters?: Record<string, unknown>,
  result?: unknown,
  error?: unknown
) {
  if (isDisabled()) return;

  const pubnub = getPubNubClient();

  try {
    const message = {
      type: "tool_usage",
      timestamp: new Date().toISOString(),
      data: {
        toolName,
        operation: safeOperation(parameters) ?? null,
        success: !error,
        error: error ? String(error) : null,
        resultSize: result ? JSON.stringify(result).length : 0,
        serverVersion: pkg.version,
        deployment: getDeployment(),
        userId: getUserId() ?? "anonymous",
      },
    } as PubNub.Publish.PublishParameters["message"];

    pubnub
      .publish({
        channel: "pubnub_mcp_server",
        message,
      })
      .catch((err: unknown) => {
        log.debug({ err }, "PubNub analytics publish failed");
      });
  } catch (err) {
    log.debug({ err }, "PubNub analytics tracking failed");
  }
}

// --- Amplitude provider ---

const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY;

let amplitudeInitialized = false;

function ensureAmplitudeInitialized(): boolean {
  if (amplitudeInitialized) return true;
  if (isDisabled() || !AMPLITUDE_API_KEY) return false;

  try {
    init(AMPLITUDE_API_KEY, {
      flushIntervalMillis: 10_000,
      flushQueueSize: 30,
      logLevel:
        process.env.MCP_ANALYTICS_DEBUG === "true" ? Types.LogLevel.Debug : Types.LogLevel.Warn,
    });
    amplitudeInitialized = true;
    return true;
  } catch (err) {
    log.debug({ err }, "Amplitude initialization failed");
    return false;
  }
}

export function flushAnalytics(): Promise<void> {
  if (!amplitudeInitialized) return Promise.resolve();
  return flush().promise.then(
    () => undefined,
    () => undefined
  );
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function machineDeviceId(): string | null {
  try {
    const nets = networkInterfaces();
    for (const ifaces of Object.values(nets).sort()) {
      if (!ifaces) continue;
      for (const iface of ifaces) {
        if (!iface.internal && iface.mac !== "00:00:00:00:00:00") {
          return sha256(iface.mac);
        }
      }
    }
  } catch {
    // fall through
  }
  return null;
}

function resolveIdentity(): { user_id?: string; device_id?: string; ip?: string } {
  const ip = getClientIp();
  const base: { user_id?: string; device_id?: string; ip?: string } = {};
  if (ip) base.ip = ip;

  const sub = getUserId();
  if (sub) {
    base.user_id = sub.padStart(5, "0");
    return base;
  }

  const apiKey = process.env.PUBNUB_API_KEY;
  if (apiKey) {
    base.device_id = `api_${sha256(apiKey)}`;
    return base;
  }

  if (getDeployment() === "local") {
    const machine = machineDeviceId();
    if (machine) base.device_id = `machine_${machine}`;
  }

  return base;
}

const trackedInitIds = new Set<string>();

function amplitudeTrackInit() {
  if (!ensureAmplitudeInitialized()) return;

  try {
    const identity = resolveIdentity();
    if (!identity.user_id && !identity.device_id) return;

    const key = identity.user_id ?? identity.device_id ?? "";
    if (trackedInitIds.has(key)) return;
    trackedInitIds.add(key);

    track(
      "mcp_server_init",
      {
        server_name: "pubnub_mcp_server",
        server_version: pkg.version,
        mode: process.env.MCP_MODE ?? "stdio",
      },
      identity
    );
  } catch (err) {
    log.debug({ err }, "Amplitude analytics init tracking failed");
  }
}

function amplitudeTrackToolUsage(
  toolName: string,
  parameters?: Record<string, unknown>,
  result?: unknown,
  error?: unknown
) {
  if (!ensureAmplitudeInitialized()) return;

  try {
    const identity = resolveIdentity();
    if (!identity.user_id && !identity.device_id) return;

    track(
      "mcp_tool_usage",
      {
        tool_name: toolName,
        operation: safeOperation(parameters),
        success: !error,
        error: error ? String(error) : undefined,
        result_size: result ? JSON.stringify(result).length : 0,
        server_version: pkg.version,
        mode: process.env.MCP_MODE ?? "stdio",
      },
      identity
    );
  } catch (err) {
    log.debug({ err }, "Amplitude analytics tracking failed");
  }
}

// --- Public API (fires both providers) ---

export function trackInit(): void {
  pubnubTrackInit();
  amplitudeTrackInit();
}

export function trackToolUsage(
  toolName: string,
  parameters?: Record<string, unknown>,
  result?: unknown,
  error?: unknown
): void {
  pubnubTrackToolUsage(toolName, parameters, result, error);
  amplitudeTrackToolUsage(toolName, parameters, result, error);
}

export function wrapToolHandler<TArgs extends Record<string, unknown>>(
  originalHandler: (
    _args: TArgs
  ) => Promise<{ content: { type: "text"; text: string }[]; isError: boolean }>,
  toolName: string
) {
  return async (parameters: TArgs) => {
    const result = await originalHandler(parameters);
    if (result.isError) {
      trackToolUsage(toolName, parameters, null, result.content[0]?.text || "Unknown error");
    } else {
      trackToolUsage(toolName, parameters, result, null);
    }
    return result;
  };
}
