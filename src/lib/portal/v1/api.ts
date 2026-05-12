import { getV1Credentials } from "../auth";
import type {
  AppResponse,
  AppsResponse,
  AuthResponse,
  CreateAppRequest,
  CreateKeysetRequest,
  CreateWordListRequest,
  FaasConflictsResponse,
  KeysetResponse,
  KeysetsResponse,
  UpdateKeysetRequest,
  UsageMetricsParams,
  UsageMetricsResponse,
} from "./types";

let sessionToken: string | undefined;
let accountId: number | undefined;

// Test-only function to reset module state between tests
export function resetPortalState() {
  sessionToken = undefined;
  accountId = undefined;
}

function getUrl(path: string) {
  const url = process.env.ADMIN_API_V1_URL ?? "https://admin.pubnub.com/api";
  return `${url}${path}`;
}

export async function authenticate() {
  const credentials = getV1Credentials();

  const response = await fetch(getUrl("/me"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as AuthResponse;
  sessionToken = data.result.token;
  accountId = data.result.user.account_id;

  return { sessionToken, accountId };
}

export async function getAccountId(): Promise<number> {
  if (!accountId) {
    await authenticate();
  }
  return accountId!;
}

async function makeRequest<T>(path: string, options: RequestInit = {}) {
  if (!sessionToken) {
    await authenticate();
  }

  const requestOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Session-Token": sessionToken,
      ...options.headers,
    },
  };

  let response = await fetch(getUrl(path), requestOptions);

  if (response.status === 401 || response.status === 403) {
    await authenticate();
    requestOptions.headers["X-Session-Token"] = sessionToken;
    response = await fetch(getUrl(path), requestOptions);
  }

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const json = (await response.json()) as T;
  return json;
}

export async function createApp(payload: CreateAppRequest) {
  const response = await makeRequest<AppResponse>("/apps", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
}

export async function updateApp(id: number, name: string) {
  const response = await makeRequest<AppResponse>(`/apps/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  return response;
}

export async function createKeyset(payload: CreateKeysetRequest) {
  const response = await makeRequest<KeysetResponse>("/keys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
}

export async function updateKeyset(payload: UpdateKeysetRequest) {
  const { id, ...rest } = payload;
  const response = await makeRequest<KeysetResponse>(`/keys/${id}`, {
    method: "PUT",
    body: JSON.stringify(rest),
  });
  return response;
}

export async function getKeyset(id: number) {
  const response = await makeRequest<KeysetResponse>(`/keys/${id}`);
  return response;
}

export async function listKeysets(type: "account" | "app", entityId: number) {
  const qs = type === "account" ? `owner_id=${entityId}` : `app_id=${entityId}`;
  const response = await makeRequest<KeysetsResponse>(`/keys?${qs}`);
  return response.result?.map(({ id, subscribe_key, publish_key, properties, type }) => ({
    id: String(id),
    name: properties.name,
    subscribeKey: subscribe_key,
    publishKey: publish_key,
    type: type === 1 ? ("production" as const) : ("testing" as const),
  }));
}

export async function listApps(accountId: number) {
  return await makeRequest<AppsResponse>(`/apps?owner_id=${accountId}`, {
    method: "GET",
  });
}

export async function createWordList(accountId: number, payload: CreateWordListRequest) {
  return await makeRequest<{ id: number }>(`/bizops-dashboards/accounts/${accountId}/word-lists`, {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      words: payload.words,
    }),
  });
}

export async function getAMConflicts(keysetId: number, channels: string[]) {
  const response = await makeRequest<FaasConflictsResponse>(
    `/faas/v1/package-deployments/intersected?` +
      new URLSearchParams({
        keyset_id: String(keysetId),
        channel: channels,
        function_type: "BEFORE_PUBLISH",
      }).toString(),
    {
      method: "GET",
    }
  );
  const conflicts = response.data.filter(d => d.packageDeployments.length > 0);
  return conflicts;
}

export async function getUsageMetrics(params: UsageMetricsParams): Promise<UsageMetricsResponse> {
  const queryParams = new URLSearchParams({
    usageType: params.usageType,
    file_format: "json",
    start: params.start,
    end: params.end,
  });

  if (params.appId) {
    queryParams.set("app_id", params.appId);
  } else if (params.keyId) {
    queryParams.set("key_id", params.keyId);
  }

  return await makeRequest<UsageMetricsResponse>(
    `/v4/services/usage/legacy/usage?${queryParams.toString()}`,
    { method: "GET" }
  );
}
