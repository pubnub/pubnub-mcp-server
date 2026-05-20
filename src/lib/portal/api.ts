import { createLogger } from "../logger";
import { getOAuthToken } from "../oauth";
import type {
  ApiApp,
  ApiCreateKeysetRequest,
  ApiKeyset,
  AppsResponse,
  CreateKeysetResponse,
  KeysetConfig,
  KeysetConfigResponse,
  KeysetsResponse,
  UsageMetricsParams,
  UsageMetricsResponse,
} from "./types";

const log = createLogger("portal:api");

const API_VERSION = "2026-03-23";

function getBaseUrl(): string {
  return process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
}

function getUrl(path: string): string {
  return `${getBaseUrl()}${path}`;
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

  log.error("No authentication available for Admin API request");
  throw new Error(
    "No authentication available. Provide a Bearer token (HTTP/OAuth mode) or set PUBNUB_API_KEY environment variable (stdio mode)."
  );
}

async function makeRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method as string) ?? "GET";
  log.debug({ method, path }, "Admin API request");

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      "PubNub-Version": API_VERSION,
      ...options.headers,
    },
  };

  const response = await fetch(getUrl(path), requestOptions);

  if (!response.ok) {
    log.error({ status: response.status, path }, "Admin API request failed");
    const error = await response.json();
    throw error;
  }

  const json = (await response.json()) as T;
  return json;
}

// --- Public API used by handlers ---

export interface App {
  id: string;
  name: string;
}

export interface AppListResult {
  apps: App[];
  total: number;
}

export interface Keyset {
  id: string;
  name: string;
  subscribeKey: string;
  publishKey: string;
  type: "testing" | "production";
}

export interface CreateKeysetRequest {
  name: string;
  appId?: string;
  type: "testing" | "production";
  config: KeysetConfig;
}

export interface CreateKeysetResult {
  publishKey: string;
  subscribeKey: string;
  message: string;
}

export async function listApps(): Promise<AppListResult> {
  const limit = 100;
  let page = 1;
  let apps: ApiApp[] = [];
  let total = 0;

  let response = await makeRequest<AppsResponse>(`/v2/apps?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  apps = [...response.apps];
  total = response.total;

  while (apps.length < total) {
    page++;
    response = await makeRequest<AppsResponse>(`/v2/apps?page=${page}&limit=${limit}`, {
      method: "GET",
    });
    apps = [...apps, ...response.apps];
  }

  return {
    apps: apps.map(app => ({ id: app.id, name: app.name })),
    total,
  };
}

export async function createApp(name: string): Promise<{ id: string }> {
  const result = await makeRequest<ApiApp>("/v2/apps", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return { id: result.id };
}

export async function updateApp(id: string, name: string): Promise<void> {
  await makeRequest<ApiApp>(`/v2/apps/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function getKeyset(id: string): Promise<Omit<Keyset, "name">> {
  const data = await makeRequest<ApiKeyset>(`/v2/keysets/${id}`, { method: "GET" });
  return {
    id: data.id,
    subscribeKey: data.subscribeKey,
    publishKey: data.publishKey,
    type: data.type,
  };
}

export async function listKeysets(appId?: string): Promise<Keyset[]> {
  const limit = 100;
  let page = 1;
  let keysets: ApiKeyset[] = [];
  let total = 0;

  let response = await makeRequest<KeysetsResponse>(`/v2/keysets?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  keysets = [...response.keysets];
  total = response.total;

  while (keysets.length < total) {
    page++;
    response = await makeRequest<KeysetsResponse>(`/v2/keysets?page=${page}&limit=${limit}`, {
      method: "GET",
    });
    keysets = [...keysets, ...response.keysets];
  }

  if (appId) {
    keysets = keysets.filter(keyset => keyset.appId === appId);
  }

  return keysets.map(keyset => ({
    id: keyset.id,
    name: keyset.name,
    subscribeKey: keyset.subscribeKey,
    publishKey: keyset.publishKey,
    type: keyset.type,
  }));
}

export async function createKeyset(request: CreateKeysetRequest): Promise<CreateKeysetResult> {
  let appId = request.appId;
  if (!appId) {
    const appResult = await makeRequest<ApiApp>("/v2/apps", {
      method: "POST",
      body: JSON.stringify({ name: request.name }),
    });
    appId = appResult.id;
  }
  const apiRequest: ApiCreateKeysetRequest = {
    keyset: {
      name: request.name,
      appId: appId,
      type: request.type,
    },
    config: request.config,
  };
  const response = await makeRequest<CreateKeysetResponse>("/v2/keysets", {
    method: "POST",
    body: JSON.stringify(apiRequest),
  });
  return {
    publishKey: response.keyset.publishKey,
    subscribeKey: response.keyset.subscribeKey,
    message: "Keyset created successfully",
  };
}

export async function updateKeysetConfig(id: string, config: KeysetConfig): Promise<void> {
  await makeRequest<KeysetConfigResponse>(`/v2/keysets/${id}/config`, {
    method: "PATCH",
    body: JSON.stringify(config),
  });
}

export async function getUsageMetrics(params: UsageMetricsParams): Promise<UsageMetricsResponse> {
  const queryParams = new URLSearchParams({
    entityType: params.entityType,
    entityId: params.entityId,
    from: params.from,
    to: params.to,
    metrics: params.metrics.join(","),
  });

  return await makeRequest<UsageMetricsResponse>(`/v2/usage-metrics?${queryParams.toString()}`, {
    method: "GET",
  });
}
