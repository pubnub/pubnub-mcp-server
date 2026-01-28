import type { KeysetConfig } from "../types";

export interface App {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Keyset {
  id: string;
  name: string;
  appId: string;
  type: "testing" | "production";
  publishKey: string;
  subscribeKey: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KeysetWithConfig extends Keyset {
  config: KeysetConfigResponse;
}

export interface AppsResponse {
  apps: App[];
  total: number;
}

export interface KeysetsResponse {
  keysets: Keyset[];
  total: number;
}

export interface CreateKeysetRequest {
  keyset: {
    name: string;
    appId: string;
    type: "testing" | "production";
  };
  config?: KeysetConfig;
}

export interface CreateKeysetResponse {
  keyset: Keyset;
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
