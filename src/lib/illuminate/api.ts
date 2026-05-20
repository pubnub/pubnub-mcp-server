import { createLogger } from "../logger";
import { getOAuthToken } from "../oauth";
import { RESOURCE_PATH } from "./types.js";

const log = createLogger("illuminate:api");

const PUBNUB_VERSION = "2026-03-23";

function getBaseUrl(): string {
  const adminApiUrl = process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
  return `${adminApiUrl}/v2/illuminate`;
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

  log.error("No authentication available for Illuminate API request");
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
    log.error({ status: response.status, path }, "Illuminate API request failed");
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

export async function listResources(resource: string): Promise<unknown> {
  const path = `${RESOURCE_PATH[resource]}`;
  log.debug({ method: "GET", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(path, response);
}

export async function getResource(resource: string, id: string): Promise<unknown> {
  const path = `${RESOURCE_PATH[resource]}/${id}`;
  log.debug({ method: "GET", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(path, response);
}

export async function createResource(
  resource: string,
  data: Record<string, unknown>
): Promise<unknown> {
  const path = `${RESOURCE_PATH[resource]}`;
  log.debug({ method: "POST", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(path, response);
}

export async function updateResource(
  resource: string,
  id: string,
  data: Record<string, unknown>
): Promise<unknown> {
  const path = `${RESOURCE_PATH[resource]}/${id}`;
  log.debug({ method: "PUT", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(path, response);
}

export async function deleteResource(resource: string, id: string): Promise<unknown> {
  const path = `${RESOURCE_PATH[resource]}/${id}`;
  log.debug({ method: "DELETE", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(path, response);
}

export async function getQueryFields(queryId: string): Promise<unknown> {
  const path = `queries/${queryId}/fields`;
  log.debug({ method: "GET", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(path, response);
}

export async function executeAdHocQuery(pipeline: Record<string, unknown>): Promise<unknown> {
  const path = "queries/execute";
  log.debug({ method: "POST", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(pipeline),
  });
  return handleResponse(path, response);
}

export async function executeSavedQuery(queryId: string): Promise<unknown> {
  const path = `queries/${queryId}/execute`;
  log.debug({ method: "POST", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(path, response);
}

export async function getActionLog(decisionId: string): Promise<unknown> {
  const path = `decisions/${decisionId}/action-log`;
  log.debug({ method: "GET", path }, "Illuminate API request");
  const response = await fetch(`${getBaseUrl()}/${path}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(path, response);
}
