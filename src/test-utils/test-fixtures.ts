import type { DocumentationApiResponse } from "../lib/docs/types";
import type * as v1 from "../lib/portal/v1/types";
import type * as v2 from "../lib/portal/v2/types";

// v1 Portal API Fixtures
export const mockAuthResponse: v1.AuthResponse = {
  result: {
    token: "mock-session-token-123",
    user_id: 456,
    user: {
      account_id: 789,
    },
  },
};

export const mockKey: v1.Keyset = {
  id: 1,
  app_id: 100,
  subscribe_key: "sub-c-mock-key",
  publish_key: "pub-c-mock-key",
  secret_key: "sec-c-mock-key",
  created: Date.now(),
  modified: Date.now(),
  type: 0,
  properties: {
    name: "Test Keyset",
    history: true,
    message_storage_ttl: 7,
    objects: true,
    objects_region: "aws-iad-1",
    presence: true,
    files_enabled: true,
    files_s3_bucket_region: "us-east-1",
    files_ttl_in_days: 7,
  },
};

export const mockApp: v1.App = {
  id: 100,
  name: "Test App",
  keys: [mockKey],
};

export const mockAppsListResponse: v1.AppsResponse = {
  result: [mockApp],
  total: 1,
};

export const mockCreateAppResponse: v1.AppResponse = {
  result: {
    id: 100,
  },
};

export const mockCreateKeyResponse: v1.KeysetResponse = {
  result: mockKey,
};

export const mockListKeysResponse: v1.KeysetsResponse = {
  result: [mockKey],
};

export const mockWordList: v1.CreateWordListRequest = {
  name: "Test Word List",
  words: ["word1", "word2", "word3"],
};

export const mockFaasNoConflictsResponse: v1.FaasConflictsResponse = {
  data: [
    {
      channel: "*",
      packageDeployments: [],
    },
  ],
};

export const mockFaasConflictsResponse: v1.FaasConflictsResponse = {
  data: [
    {
      channel: "*",
      packageDeployments: ["there is a conflict"],
    },
  ],
};

// v2 Portal API Fixtures
export const mockV2App: v2.App = {
  id: "100",
  name: "Test App",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockV2AppsListResponse: v2.AppsResponse = {
  apps: [mockV2App],
  total: 1,
};

export const mockV2Keyset: v2.Keyset = {
  id: "1",
  name: "Test Keyset",
  appId: "100",
  type: "testing",
  publishKey: "pub-c-mock-key",
  subscribeKey: "sub-c-mock-key",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockV2KeysetsListResponse: v2.KeysetsResponse = {
  keysets: [mockV2Keyset],
  total: 1,
};

export const mockV2CreateKeysetResponse: v2.CreateKeysetResponse = {
  keyset: mockV2Keyset,
  config: {
    accessManager: { enabled: false, tokenRevoke: null },
    messagePersistence: {
      enabled: true,
      retention: 7,
      includePresenceEvents: false,
      deleteFromHistory: false,
    },
    appContext: {
      enabled: true,
      region: "aws-iad-1",
      userMetadataEvents: true,
      channelMetadataEvents: true,
      membershipEvents: true,
      disallowGetAllChannelMetadata: false,
      disallowGetAllUserMetadata: false,
      referentialIntegrity: false,
    },
    files: {
      enabled: true,
      retention: 7,
      region: "us-east-1",
    },
    streamController: {
      enabled: true,
      wildcardSubscribe: true,
      channelGroupLimit: 100,
    },
    presence: {
      announceMax: 20,
      interval: 10,
      deltas: false,
      generateLeaveOnDisconnect: false,
      streamFiltering: false,
      activeNoticeChannel: null,
      debounce: 2,
    },
    apns: {
      enabled: false,
      teamId: null,
      authKeyId: null,
      filename: null,
    },
    fcm: {
      filename: null,
    },
  },
};

// Documentation API Fixtures
export const mockSdkDocumentation: DocumentationApiResponse = {
  content: "# PubNub SDK Documentation\n\nThis is a mock documentation content.",
  metadata: {
    title: "Publish and Subscribe - JavaScript SDK",
    source_url: "https://www.pubnub.com/docs/sdks/javascript/publish-and-subscribe",
    updated_at: "2024-01-01T00:00:00Z",
  },
};

export const mockChatSdkDocumentation: DocumentationApiResponse = {
  content: "# PubNub Chat SDK Documentation\n\nThis is mock chat SDK documentation.",
  metadata: {
    title: "Send and Receive Messages - JavaScript Chat SDK",
    source_url: "https://www.pubnub.com/docs/chat/javascript/messages-send-receive",
    updated_at: "2024-01-01T00:00:00Z",
  },
};

export const mockHowToDocumentation: DocumentationApiResponse = {
  content: "# How to manage chat message timestamps\n\nThis is mock how-to documentation.",
  metadata: {
    title: "How to manage chat message timestamps",
    source_url: "https://www.pubnub.com/how-to/message-timestamps",
    updated_at: "2024-01-01T00:00:00Z",
  },
};

export const mockBestPracticesDocumentation: DocumentationApiResponse = {
  content:
    "# PubNub Best Practices\n\n## 1. Architecture & project setup\n- Client-only for realtime UI; server for authority.",
  metadata: {
    title: "PubNub Best Practices",
    source_url: "https://docs.pubnubtools.com/api/v1/best-practice",
    updated_at: "2024-01-01T00:00:00Z",
  },
};

// Billing fixtures (used by integration tests)
export const mockBillingInfoPro = {
  base: true,
  rackRate: false,
  ena: true,
  insights: true,
  bizops: true,
  support: true,
  illuminate: true,
};

// Error fixtures
export const mockApiError = {
  message: "API request failed",
  name: "APIError",
};

export const mockAuthError = {
  message: "Authentication failed: 401 Unauthorized",
  name: "Error",
};

export const mockNetworkError = {
  message: "Network request failed",
  name: "NetworkError",
};

export const mockV2Error: v2.ErrorResponse = {
  statusCode: 400,
  error: "BadRequest",
  message: ["Invalid request"],
};
