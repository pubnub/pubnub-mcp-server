import { createLogger } from "../logger";
import { getOAuthToken } from "../oauth";
import { KV_TYPE_PATH } from "./types.js";

const log = createLogger("functions:api");

const PUBNUB_VERSION = "2026-05-26";

function getBaseUrl(): string {
  const adminApiUrl = process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
  return `${adminApiUrl}/v2/faas`;
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

  log.error("No authentication available for Functions API request");
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
    log.error({ status: response.status, path }, "Functions API request failed");
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

type Query = Record<string, string | number | boolean | string[] | undefined>;

function buildQuery(query?: Query): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      // Repeatable params (e.g. `channel`) are sent as repeated keys per the spec.
      for (const v of value) params.append(key, v);
    } else {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function faasRequest(
  method: string,
  path: string,
  options: { query?: Query | undefined; body?: unknown } = {}
): Promise<unknown> {
  const url = `${getBaseUrl()}/${path}${buildQuery(options.query)}`;
  log.debug({ method, path }, "Functions API request");
  const init: RequestInit = {
    method,
    headers: getHeaders(),
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }
  const response = await fetch(url, init);
  return handleResponse(path, response);
}

// ─── Packages (account-scoped) ───────────────────────────────────────────────

export function listPackages(query?: Query): Promise<unknown> {
  return faasRequest("GET", "packages", { query });
}

export function getPackage(id: string): Promise<unknown> {
  return faasRequest("GET", `packages/${id}`);
}

export function createPackage(data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("POST", "packages", { body: data });
}

export function updatePackage(id: string, data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("PUT", `packages/${id}`, { body: data });
}

export function deletePackage(id: string): Promise<unknown> {
  return faasRequest("DELETE", `packages/${id}`);
}

export function listPackageRevisions(packageId: string, query?: Query): Promise<unknown> {
  return faasRequest("GET", `packages/${packageId}/package-revisions`, { query });
}

// ─── Revisions (account-scoped) ──────────────────────────────────────────────

export function getRevision(id: string): Promise<unknown> {
  return faasRequest("GET", `package-revisions/${id}`);
}

export function createRevision(data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("POST", "package-revisions", { body: data });
}

export function updateRevision(id: string, data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("PUT", `package-revisions/${id}`, { body: data });
}

export function deleteRevision(id: string): Promise<unknown> {
  return faasRequest("DELETE", `package-revisions/${id}`);
}

export function listRevisionFunctions(revisionId: string, query?: Query): Promise<unknown> {
  return faasRequest("GET", `package-revisions/${revisionId}/functions`, { query });
}

export function listRevisionDeployments(revisionId: string, query?: Query): Promise<unknown> {
  return faasRequest("GET", `package-revisions/${revisionId}/package-deployments`, { query });
}

// ─── Test inputs (account-scoped, under function-revisions) ───────────────────

export function listTestInputs(functionRevisionId: string, query?: Query): Promise<unknown> {
  return faasRequest("GET", `function-revisions/${functionRevisionId}/test-inputs`, { query });
}

export function createTestInput(
  functionRevisionId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return faasRequest("POST", `function-revisions/${functionRevisionId}/test-inputs`, {
    body: data,
  });
}

export function updateTestInput(
  functionRevisionId: string,
  testInputId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return faasRequest("PUT", `function-revisions/${functionRevisionId}/test-inputs/${testInputId}`, {
    body: data,
  });
}

export function deleteTestInput(functionRevisionId: string, testInputId: string): Promise<unknown> {
  return faasRequest(
    "DELETE",
    `function-revisions/${functionRevisionId}/test-inputs/${testInputId}`
  );
}

// ─── Deployments ──────────────────────────────────────────────────────────────
// Deployments are scoped by the numeric `keysetId` carried in the create/import
// request body (not the subscribe key). Lifecycle endpoints operate on the
// deployment id alone and take no keyset parameter.

export function createDeployment(data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("POST", "package-deployments", { body: data });
}

export function getDeployment(id: string): Promise<unknown> {
  return faasRequest("GET", `package-deployments/${id}`);
}

export function deleteDeployment(id: string): Promise<unknown> {
  return faasRequest("DELETE", `package-deployments/${id}`);
}

// Start = create the function-deployments under a package-deployment.
export function startDeployment(id: string): Promise<unknown> {
  return faasRequest("POST", `package-deployments/${id}/function-deployments`);
}

// Stop = delete the function-deployments under a package-deployment.
export function stopDeployment(id: string, force?: boolean): Promise<unknown> {
  return faasRequest("DELETE", `package-deployments/${id}/function-deployments`, {
    query: force === undefined ? undefined : { force },
  });
}

// Rolling update = swap the running function-deployments to a new package deployment.
export function rollingUpdateDeployment(
  id: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return faasRequest("PUT", `package-deployments/${id}/function-deployments`, { body: data });
}

export function getIntersectedDeployments(
  keysetId: number,
  channels: string[],
  functionType?: string
): Promise<unknown> {
  return faasRequest("GET", "package-deployments/intersected", {
    query: { keyset_id: keysetId, channel: channels, function_type: functionType },
  });
}

export function stopDeploymentsBy(query: Query): Promise<unknown> {
  // Exactly one of package_id / package_revision_id must be provided by the caller.
  return faasRequest("DELETE", "function-deployments", { query });
}

// ─── KV store (keyset-scoped via `subkey` = subscribe key) ────────────────────

export function listKvEntries(kvType: string, subkey: string, query?: Query): Promise<unknown> {
  return faasRequest("GET", `kv/${KV_TYPE_PATH[kvType]}`, { query: { ...query, subkey } });
}

export function getKvEntry(kvType: string, key: string, subkey: string): Promise<unknown> {
  return faasRequest("GET", `kv/${KV_TYPE_PATH[kvType]}/${encodeURIComponent(key)}`, {
    query: { subkey },
  });
}

export function setKvEntry(
  kvType: string,
  key: string,
  value: unknown,
  subkey: string,
  ttlSeconds?: number
): Promise<unknown> {
  return faasRequest("PUT", `kv/${KV_TYPE_PATH[kvType]}/${encodeURIComponent(key)}`, {
    query: { subkey },
    body: { value, ttlSeconds },
  });
}

export function deleteKvEntry(kvType: string, key: string, subkey: string): Promise<unknown> {
  return faasRequest("DELETE", `kv/${KV_TYPE_PATH[kvType]}/${encodeURIComponent(key)}`, {
    query: { subkey },
  });
}

export function incrementCounter(key: string, subkey: string, amount?: number): Promise<unknown> {
  return faasRequest("POST", `kv/counters/${encodeURIComponent(key)}/increment`, {
    query: { subkey },
    body: { value: amount ?? 1 },
  });
}

export function decrementCounter(key: string, subkey: string, amount?: number): Promise<unknown> {
  return faasRequest("POST", `kv/counters/${encodeURIComponent(key)}/decrement`, {
    query: { subkey },
    body: { value: amount ?? 1 },
  });
}

// ─── Secrets (keyset-scoped via `subkey`) ─────────────────────────────────────

export function listSecrets(subkey: string, query?: Query): Promise<unknown> {
  return faasRequest("GET", "kv/secrets", { query: { ...query, subkey } });
}

export function setSecret(key: string, value: unknown, subkey: string): Promise<unknown> {
  return faasRequest("PUT", `kv/secrets/${encodeURIComponent(key)}`, {
    query: { subkey },
    body: { value },
  });
}

export function deleteSecret(key: string, subkey: string): Promise<unknown> {
  return faasRequest("DELETE", `kv/secrets/${encodeURIComponent(key)}`, { query: { subkey } });
}

// ─── Scheduled events (account/token-scoped, no keyset parameter) ─────────────

export function listScheduledEvents(query?: Query): Promise<unknown> {
  return faasRequest("GET", "scheduled/events", { query });
}

export function getScheduledEvent(id: string): Promise<unknown> {
  return faasRequest("GET", `scheduled/events/${id}`);
}

export function createScheduledEvent(data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("POST", "scheduled/events", { body: data });
}

export function updateScheduledEvent(id: string, data: Record<string, unknown>): Promise<unknown> {
  return faasRequest("PUT", `scheduled/events/${id}`, { body: data });
}

export function deleteScheduledEvent(id: string): Promise<unknown> {
  return faasRequest("DELETE", `scheduled/events/${id}`);
}

// ─── Catalog / blueprints (account-scoped) ────────────────────────────────────

export function listPackageBlueprints(query?: Query): Promise<unknown> {
  return faasRequest("GET", "package-blueprints", { query });
}

export function getPackageBlueprint(id: string): Promise<unknown> {
  return faasRequest("GET", `package-blueprints/${id}`);
}

export function listFunctionBlueprints(
  packageBlueprintId: string,
  query?: Query
): Promise<unknown> {
  return faasRequest("GET", `package-blueprints/${packageBlueprintId}/function-blueprints`, {
    query,
  });
}

export function listBlueprintParameters(
  functionBlueprintId: string,
  query?: Query
): Promise<unknown> {
  return faasRequest(
    "GET",
    `function-blueprints/${functionBlueprintId}/function-blueprint-params`,
    { query }
  );
}

export function listAllBlueprintParameters(query?: Query): Promise<unknown> {
  return faasRequest("GET", "function-blueprint-params", { query });
}

export function getBlueprintParameter(id: string): Promise<unknown> {
  return faasRequest("GET", `function-blueprint-params/${id}`);
}

export function importPackageFromBlueprint(
  packageBlueprintId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return faasRequest("POST", `package-blueprints/${packageBlueprintId}/packages`, { body: data });
}

// ─── Limits (account-scoped) ──────────────────────────────────────────────────

export function getRunningDeploymentsLimit(): Promise<unknown> {
  return faasRequest("GET", "limits/package-deployments-running");
}
