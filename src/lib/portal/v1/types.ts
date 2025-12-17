export interface App {
  id: number;
  name: string;
  keys: Keyset[];
}

export interface Keyset {
  id: number;
  app_id: number;
  subscribe_key: string;
  publish_key: string;
  secret_key: string | null;
  product_id?: number;
  status?: number;
  created: number;
  modified: number;
  type: 0 | 1;
  properties: KeysetProperties;
}

export interface KeysetProperties {
  name?: string;
  history?: boolean;
  message_storage_ttl?: number;
  objects?: boolean;
  objects_region?: string;
  presence?: boolean;
  presence_acl?: string;
  files_enabled?: boolean;
  files_s3_bucket_region?: string;
  files_ttl_in_days?: number;
}

export interface AuthResponse {
  result: {
    token?: string;
    user_id?: number;
    user: {
      account_id: number;
    };
  };
}

export interface AppsResponse {
  result: App[];
  total: number;
}

export interface CreateAppRequest {
  name: string;
  create_demo_key: boolean;
  owner_id: number;
}

export interface AppResponse {
  result: {
    id: number;
  };
}

export interface KeysetsResponse {
  result?: Keyset[];
}

export interface CreateKeysetRequest {
  app_id: number;
  type: 0 | 1;
  properties: KeysetProperties;
}

export interface UpdateKeysetRequest {
  id: number;
  properties: KeysetProperties;
}

export interface KeysetResponse {
  result: Keyset;
}

export interface CreateWordListRequest {
  name: string;
  words: string[];
}

export interface FaasConflictsResponse {
  data: Array<{
    channel: string;
    packageDeployments: Array<unknown>;
  }>;
}
