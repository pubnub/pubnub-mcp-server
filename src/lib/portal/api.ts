import { getPubSubEnvKeys, hasPubSubEnvKeys } from "../utils";
import { getApiVersion } from "./auth";
import type { KeysetConfig } from "./types";
import * as v1 from "./v1/api";
import { toProperties } from "./v1/mappers";
import type {
  UsageMetricsParams as UsageMetricsV1Params,
  UsageMetricsResponse as UsageMetricsV1Response,
} from "./v1/types";
import * as v2 from "./v2/api";
import type {
  UsageMetricsParams as UsageMetricsV2Params,
  UsageMetricsResponse as UsageMetricsV2Response,
} from "./v2/types";

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
  const apiVersion = getApiVersion();

  if (apiVersion === "v2") {
    const result = await v2.listApps();
    return {
      apps: result.apps.map(app => ({
        id: app.id,
        name: app.name,
      })),
      total: result.total,
    };
  } else {
    const accountId = await v1.getAccountId();
    const result = await v1.listApps(accountId);
    return {
      apps: result.result.map(app => ({
        id: String(app.id),
        name: app.name,
      })),
      total: result.total,
    };
  }
}

export async function createApp(name: string): Promise<{ id: string }> {
  const apiVersion = getApiVersion();

  if (apiVersion === "v2") {
    const result = await v2.createApp(name);
    return { id: result.id };
  } else {
    const accountId = await v1.getAccountId();
    const result = await v1.createApp({
      name,
      create_demo_key: false,
      owner_id: accountId,
    });
    return { id: String(result.result.id) };
  }
}

export async function updateApp(id: string, name: string): Promise<void> {
  const apiVersion = getApiVersion();

  if (apiVersion === "v2") {
    await v2.updateApp(id, name);
  } else {
    await v1.updateApp(Number(id), name);
  }
}

export async function getKeyset(id: string): Promise<Omit<Keyset, "name">> {
  const apiVersion = getApiVersion();

  if (apiVersion === "v2") {
    const response = await v2.getKeyset(id);
    return response;
  } else {
    const response = await v1.getKeyset(Number(id));
    const { subscribe_key, publish_key, type } = response.result;
    return {
      id: String(id),
      subscribeKey: subscribe_key,
      publishKey: publish_key,
      type: type === 1 ? "production" : "testing",
      ...response,
    };
  }
}

export async function listKeysets(appId?: string): Promise<Keyset[]> {
  const apiVersion = getApiVersion();

  if (apiVersion === "v2") {
    const result = await v2.listKeysets(appId);
    return result.keysets.map(keyset => ({
      id: keyset.id,
      name: keyset.name,
      subscribeKey: keyset.subscribeKey,
      publishKey: keyset.publishKey,
      type: keyset.type,
    }));
  } else {
    const accountId = await v1.getAccountId();
    const type = appId ? "app" : "account";
    const entityId = appId ? Number(appId) : accountId;
    const result = await v1.listKeysets(type, entityId);
    return (
      result?.map(keyset => ({
        ...keyset,
        name: keyset.name || `Keyset ${keyset.id}`, // Provide default name if undefined
      })) ?? []
    );
  }
}

async function createKeysetV2(
  request: CreateKeysetRequest
): Promise<{ publishKey: string; subscribeKey: string }> {
  let appId = request.appId;
  if (!appId) {
    const appResult = await v2.createApp(request.name);
    appId = appResult.id;
  }
  const response = await v2.createKeyset({
    keyset: {
      name: request.name,
      appId: appId,
      type: request.type,
    },
    config: request.config,
  });
  return {
    publishKey: response.keyset.publishKey,
    subscribeKey: response.keyset.subscribeKey,
  };
}

async function createKeysetV1(
  request: CreateKeysetRequest
): Promise<{ publishKey: string; subscribeKey: string }> {
  let appId = request.appId ? Number(request.appId) : undefined;
  if (!appId) {
    const accountId = await v1.getAccountId();
    const appResponse = await v1.createApp({
      name: request.name,
      create_demo_key: false,
      owner_id: accountId,
    });
    appId = appResponse.result.id;
  }
  const properties = toProperties(request.config);
  const response = await v1.createKeyset({
    app_id: appId,
    type: request.type === "production" ? 1 : 0,
    properties: {
      name: request.name,
      ...properties,
    },
  });
  return {
    publishKey: response.result?.publish_key,
    subscribeKey: response.result?.subscribe_key,
  };
}

export async function createKeyset(request: CreateKeysetRequest): Promise<CreateKeysetResult> {
  const apiVersion = getApiVersion();

  const { publishKey, subscribeKey } =
    apiVersion === "v2" ? await createKeysetV2(request) : await createKeysetV1(request);

  const hasEnvKeys = hasPubSubEnvKeys();
  return {
    publishKey,
    subscribeKey,
    message: hasEnvKeys
      ? "Keyset created successfully. ⚠️ You must notify the user that because PubNub Environment Keys are being used, this keyset won't be used automatically. They must manually update their environment variables with the new keys."
      : "Keyset created successfully",
  };
}

export async function updateKeysetConfig(id: string, config: KeysetConfig): Promise<void> {
  const envKeysetId = await getEnvKeysetId();
  if (envKeysetId !== undefined && envKeysetId !== id) {
    throw new Error(
      `Cannot update keyset ${id}. When PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY are set, only the configured keyset (ID: ${envKeysetId}) can be updated.`
    );
  }

  const apiVersion = getApiVersion();

  if (apiVersion === "v2") {
    await v2.updateKeysetConfig(id, config);
  } else {
    const properties = toProperties(config);
    await v1.updateKeyset({
      id: Number(id),
      properties,
    });
  }
}

async function getEnvKeysetId(): Promise<string | undefined> {
  const envKeys = getPubSubEnvKeys();
  if (!envKeys) return undefined;

  const keysets = await listKeysets();
  const matchingKeyset = keysets?.find(
    k => k.publishKey === envKeys.publishKey && k.subscribeKey === envKeys.subscribeKey
  );

  return matchingKeyset ? matchingKeyset.id : undefined;
}

export async function getUsageMetricsV1(
  params: UsageMetricsV1Params
): Promise<UsageMetricsV1Response> {
  return await v1.getUsageMetrics(params);
}

export async function getUsageMetricsV2(
  params: UsageMetricsV2Params
): Promise<UsageMetricsV2Response> {
  return await v2.getUsageMetrics(params);
}
