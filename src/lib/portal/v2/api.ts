import { getApiKey } from "../auth";
import type { KeysetConfig } from "../types";
import type {
  App,
  AppsResponse,
  CreateKeysetRequest,
  CreateKeysetResponse,
  Keyset,
  KeysetConfigResponse,
  KeysetsResponse,
  KeysetWithConfig,
  UsageMetricsParams,
  UsageMetricsResponse,
} from "./types";

const API_VERSION = "2025-11-15";

function getBaseUrl(): string {
  return process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
}

function getUrl(path: string): string {
  return `${getBaseUrl()}${path}`;
}

async function makeRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiKey = getApiKey();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
      "PubNub-Version": API_VERSION,
      ...options.headers,
    },
  };

  const response = await fetch(getUrl(path), requestOptions);

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const json = (await response.json()) as T;
  return json;
}

export async function listApps(): Promise<AppsResponse> {
  const limit = 100;
  let page = 1;
  let apps: App[] = [];
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

  return { apps, total };
}

export async function createApp(name: string): Promise<App> {
  return await makeRequest<App>("/v2/apps", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateApp(id: string, name: string): Promise<App> {
  return await makeRequest<App>(`/v2/apps/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function getApp(id: string): Promise<App> {
  return await makeRequest<App>(`/v2/apps/${id}`, { method: "GET" });
}

export async function listKeysets(appId?: string): Promise<KeysetsResponse> {
  const limit = 100;
  let page = 1;
  let keysets: Keyset[] = [];
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
    total = keysets.length;
  }

  return { keysets, total };
}

export async function getKeyset(id: string): Promise<KeysetWithConfig> {
  const data = await makeRequest<Keyset>(`/v2/keysets/${id}`, { method: "GET" });
  const config = await getKeysetConfig(id);
  return { ...data, config };
}

export async function createKeyset(request: CreateKeysetRequest): Promise<CreateKeysetResponse> {
  return await makeRequest<CreateKeysetResponse>("/v2/keysets", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getKeysetConfig(keysetId: string): Promise<KeysetConfigResponse> {
  return await makeRequest<KeysetConfigResponse>(`/v2/keysets/${keysetId}/config`, {
    method: "GET",
  });
}

export async function updateKeysetConfig(
  keysetId: string,
  config: KeysetConfig
): Promise<KeysetConfigResponse> {
  return await makeRequest<KeysetConfigResponse>(`/v2/keysets/${keysetId}/config`, {
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
