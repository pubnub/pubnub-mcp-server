import type z from "zod";
import type {
  CreateAppDataSchema,
  CreateKeysetDataSchema,
  KeysetConfigSchema,
  ListKeysetDataSchema,
  ManageAppsSchema,
  ManageKeysetsSchema,
  UpdateAppDataSchema,
  UpdateKeysetDataSchema,
  UsageMetricsV2Schema,
} from "./schemas";

// Zod-inferred types
export type ManageKeysetsSchemaType = z.infer<typeof ManageKeysetsSchema>;
export type ManageAppsSchemaType = z.infer<typeof ManageAppsSchema>;
export type KeysetConfig = z.infer<typeof KeysetConfigSchema>;

export type CreateAppData = z.infer<typeof CreateAppDataSchema>;
export type UpdateAppData = z.infer<typeof UpdateAppDataSchema>;
export type CreateKeysetData = z.infer<typeof CreateKeysetDataSchema>;
export type UpdateKeysetData = z.infer<typeof UpdateKeysetDataSchema>;
export type ListKeysetData = z.infer<typeof ListKeysetDataSchema>;
export type UsageMetricsV2SchemaType = z.infer<typeof UsageMetricsV2Schema>;

// API response/request types (internal - used by the HTTP layer)
export interface ApiApp {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiKeyset {
  id: string;
  name: string;
  appId: string;
  type: "testing" | "production";
  publishKey: string;
  subscribeKey: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiKeysetWithConfig extends ApiKeyset {
  config: KeysetConfigResponse;
}

export interface AppsResponse {
  apps: ApiApp[];
  total: number;
}

export interface KeysetsResponse {
  keysets: ApiKeyset[];
  total: number;
}

export interface ApiCreateKeysetRequest {
  keyset: {
    name: string;
    appId: string;
    type: "testing" | "production";
  };
  config?: KeysetConfig;
}

export interface CreateKeysetResponse {
  keyset: ApiKeyset;
  config: KeysetConfigResponse;
}

export interface KeysetConfigResponse {
  accessManager: {
    enabled: boolean;
    tokenRevoke: boolean | null;
  };
  messagePersistence: {
    enabled: boolean;
    retention: number | null;
    includePresenceEvents: boolean;
    deleteFromHistory: boolean;
  };
  appContext: {
    enabled: boolean;
    region: string | null;
    userMetadataEvents: boolean;
    channelMetadataEvents: boolean;
    membershipEvents: boolean;
    disallowGetAllChannelMetadata: boolean;
    disallowGetAllUserMetadata: boolean;
    referentialIntegrity: boolean;
  };
  files: {
    enabled: boolean;
    retention: number | null;
    region: string | null;
  };
  streamController: {
    enabled: boolean;
    wildcardSubscribe: boolean;
    channelGroupLimit: number | null;
  };
  presence: {
    announceMax: number | null;
    interval: number | null;
    deltas: boolean | null;
    generateLeaveOnDisconnect: boolean | null;
    streamFiltering: boolean | null;
    activeNoticeChannel: string | null;
    debounce: number | null;
  };
  apns: {
    enabled: boolean;
    teamId: string | null;
    authKeyId: string | null;
    filename: string | null;
  };
  fcm: {
    filename: string | null;
  };
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string[];
}

export type UsageMetricsEntityType = "account" | "app" | "keyset";

export interface UsageMetricsParams {
  entityType: UsageMetricsEntityType;
  entityId: string;
  from: string;
  to: string;
  metrics: string[];
}

export interface UsageMetricsResponse {
  metrics: {
    [metricName: string]: {
      [date: string]: number;
    };
  };
}
