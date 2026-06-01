import { createLogger } from "../logger";
import { getOAuthToken } from "../oauth";
import { type InsightsSchemaType, METRIC_ENDPOINT } from "./types.js";

const log = createLogger("insights:api");

const PUBNUB_VERSION = "2026-03-23";

function getBaseUrl(): string {
  const adminApiUrl = process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
  return `${adminApiUrl}/v2`;
}

function getAuthHeader(): string {
  const oauthToken = getOAuthToken();
  if (oauthToken) {
    return `Bearer ${oauthToken}`;
  }

  const apiKey = process.env.PUBNUB_API_KEY;
  if (apiKey) {
    return apiKey;
  }

  log.error("No authentication available for Insights API request");
  throw new Error(
    "No authentication available. Provide a Bearer token (HTTP/OAuth mode) or set PUBNUB_API_KEY environment variable (stdio mode)."
  );
}

function getHeaders(): Record<string, string> {
  return {
    Authorization: getAuthHeader(),
    "PubNub-Version": PUBNUB_VERSION,
    "Content-Type": "application/json",
  };
}

async function handleResponse(path: string, response: Response): Promise<unknown> {
  if (response.status === 204) {
    return { success: true };
  }

  const text = await response.text();

  if (!response.ok) {
    log.error({ status: response.status, path }, "Insights API request failed");
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  if (!text) {
    return { success: true };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { success: true, body: text };
  }
}

export async function queryInsights(args: InsightsSchemaType): Promise<unknown> {
  const endpoint = METRIC_ENDPOINT[args.metric];
  if (!endpoint) {
    throw new Error(`Unknown metric: ${args.metric}`);
  }

  const params = new URLSearchParams();
  params.set("entityType", args.entityType);
  params.set("entityId", args.entityId);
  params.set("metric", args.metric);
  params.set("period", args.period);
  params.set("fromDate", args.fromDate);
  params.set("toDate", args.toDate);
  if (args.category) {
    params.set("category", args.category);
  }
  if (args.filters) {
    params.set("filters", args.filters);
  }
  if (args.filter) {
    params.set("filter", args.filter);
  }
  if (args.orderBy) {
    params.set("orderBy", args.orderBy);
  }
  if (args.limit !== undefined) {
    params.set("limit", String(args.limit));
  }

  log.debug({ method: "GET", path: endpoint }, "Insights API request");

  const url = `${getBaseUrl()}/${endpoint}?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(endpoint, response);
}
