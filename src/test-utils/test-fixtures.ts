import type { DocumentationApiResponse } from "../lib/docs/types";
import type * as v2 from "../lib/portal/types";

// v2 Portal API Fixtures
export const mockV2App: v2.ApiApp = {
  id: "100",
  name: "Test App",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockV2AppsListResponse: v2.AppsResponse = {
  apps: [mockV2App],
  total: 1,
};

export const mockV2Keyset: v2.ApiKeyset = {
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

export const mockSdkMigrationGuideDocumentation: DocumentationApiResponse = {
  content:
    "# Go SDK v8 Migration Guide\n\nThis guide covers the breaking changes when upgrading to Go SDK v8.",
  metadata: {
    title: "Go SDK v8 Migration Guide",
    source_url: "https://www.pubnub.com/docs/sdks/go/migration-guides/go-v8-migration-guide",
    updated_at: "2024-06-01T00:00:00Z",
  },
};

export const mockGeneralMigrationGuideDocumentation: DocumentationApiResponse = {
  content: "# PAM v3 Migration Guide\n\nThis guide covers migrating from Access Manager v2 to v3.",
  metadata: {
    title: "PAM v3 Migration Guide",
    source_url: "https://www.pubnub.com/docs/general/resources/migration-guides/pam-v3-migration",
    updated_at: "2024-03-01T00:00:00Z",
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

// Insights API Fixtures
export const mockInsightsResult = {
  metric: "unique_channels",
  data: [
    { timestamp: "2026-04-01T00:00:00Z", value: 42 },
    { timestamp: "2026-04-02T00:00:00Z", value: 45 },
  ],
};

export const mockInsightsTopResult = {
  metric: "top_20_channels",
  category: "by_messages",
  data: [
    { name: "channel-a", count_messages: 1000 },
    { name: "channel-b", count_messages: 500 },
  ],
};

// Error fixtures
export const mockApiError = {
  message: "API request failed",
  name: "APIError",
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

// Illuminate API Fixtures
export const mockIlluminateBusinessObject = {
  id: "bo-abc-123",
  name: "Chat Messages",
  isActive: true,
  subkeys: ["sub-c-mock-key"],
  fields: [
    {
      id: "f-user",
      name: "userId",
      source: "custom",
      jsonPath: "$.message.body.userId",
      jsonFieldType: "TEXT",
    },
    {
      id: "f-channel",
      name: "channel",
      source: "custom",
      jsonPath: "$.message.body.channel",
      jsonFieldType: "TEXT",
    },
    {
      id: "f-msg",
      name: "message",
      source: "custom",
      jsonPath: "$.message.body.message",
      jsonFieldType: "TEXT_LONG",
    },
    {
      id: "f-count",
      name: "messageCount",
      source: "custom",
      jsonPath: "$.message.body.messageCount",
      jsonFieldType: "NUMERIC",
    },
  ],
};

export const mockIlluminateDecisionScaffold = {
  id: "dec-xyz-789",
  name: "Spam Detection",
  hitType: "SINGLE",
  executeOnce: false,
  enabled: false,
  rules: [],
  sourceType: "BUSINESSOBJECT",
  sourceId: "bo-abc-123",
  inputFields: [{ id: "if-aaa", name: "message_count", sourceType: "BUSINESSOBJECT" }],
  outputFields: [{ id: "of-bbb", name: "alert_level", variable: "alert_level" }],
  actions: [{ id: "act-ccc", name: "notify_moderator", actionType: "WEBHOOK" }],
  activeFrom: "2026-01-01T00:00:00.000Z",
  activeUntil: "2027-12-31T23:59:59.000Z",
};

export const mockIlluminateDecisionWithRules = {
  ...mockIlluminateDecisionScaffold,
  enabled: true,
  rules: [
    {
      inputValues: [{ inputFieldId: "if-aaa", operation: "GREATER_THAN", value: "10" }],
      outputValues: [{ outputFieldId: "of-bbb", value: "high" }],
      actionValues: [{ actionId: "act-ccc", enabled: true }],
    },
  ],
};

export const mockIlluminateQueryFields = [
  { id: "qf-1", name: "userId", alias: "userId", type: "dimension" },
  { id: "qf-2", name: "channel", alias: "channel", type: "dimension" },
  { id: "qf-3", name: "count", alias: "count", type: "measure" },
];

export const mockIlluminateQueryResult = {
  data: [
    { userId: "user-1", channel: "general", count: 42 },
    { userId: "user-2", channel: "random", count: 17 },
  ],
};

export const mockIlluminateActionLog = {
  entries: [
    {
      id: "log-1",
      decisionId: "dec-xyz-789",
      actionName: "notify_moderator",
      firedAt: "2026-04-01T12:00:00Z",
      result: "SUCCESS",
    },
  ],
};
