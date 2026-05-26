import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import {
  getBestPracticesHandler,
  getChatSDKDocumentationHandler,
  getGeneralMigrationGuideHandler,
  getSDKDocumentationHandler,
  getSdkMigrationGuideHandler,
  howToHandler,
} from "./lib/docs/handlers";
import {
  GetChatSdkDocumentationSchema,
  GetGeneralMigrationGuideSchema,
  GetSdkDocumentationSchema,
  GetSdkMigrationGuideSchema,
  HowToSchema,
} from "./lib/docs/schemas";
import type {
  GetChatSdkDocumentationSchemaType,
  GetGeneralMigrationGuideSchemaType,
  GetSdkDocumentationSchemaType,
  GetSdkMigrationGuideSchemaType,
  HowToSchemaType,
} from "./lib/docs/types";
import { manageIlluminateHandler } from "./lib/illuminate/handlers";
import { ManageIlluminateSchema } from "./lib/illuminate/schemas";
import type { ManageIlluminateSchemaType } from "./lib/illuminate/types";
import { insightsHandler } from "./lib/insights/handlers";
import { InsightsSchema } from "./lib/insights/schemas";
import type { InsightsSchemaType } from "./lib/insights/types";
import {
  getUsageMetricsHandler,
  manageAppsHandler,
  manageKeysetsHandler,
} from "./lib/portal/handlers";
import {
  ManageAppsDefinitionSchema,
  ManageKeysetsDefinitionSchema,
  UsageMetricsV2Schema as UsageMetricsV2DefinitionSchema,
} from "./lib/portal/schemas";
import type {
  ManageAppsSchemaType,
  ManageKeysetsSchemaType,
  UsageMetricsV2SchemaType,
} from "./lib/portal/types";
import { ManageAppContextSchema } from "./lib/pubnub/app-context/schemas";
import type { ManageAppContextHandlerArgs } from "./lib/pubnub/app-context/types";
import {
  getHistoryHandler,
  getPresenceHandler,
  manageAppContextHandler,
  publishMessageHandler,
  subscribeHandler,
} from "./lib/pubnub/handlers";
import {
  GetHistorySchema,
  GetPresenceSchema,
  PublishMessageSchema,
  SubscribeSchema,
} from "./lib/pubnub/schemas";
import type {
  GetHistoryHandlerArgs,
  GetPresenceHandlerArgs,
  PublishMessageHandlerArgs,
  SubscribeHandlerArgs,
} from "./lib/pubnub/types";

type ZodRawShape = Record<string, z.ZodType<unknown>>;

type ToolConfig = {
  title?: string;
  description?: string;
  inputSchema?: ZodRawShape;
  outputSchema?: ZodRawShape;
  annotations?: ToolAnnotations;
  _meta?: Record<string, unknown>;
};

type ToolDef<TArgs = unknown> = {
  name: string;
  definition: ToolConfig;
  handler: (_args: TArgs) => Promise<{ content: { type: "text"; text: string }[] }>;
};

const manageAppsTool: ToolDef<ManageAppsSchemaType> = {
  name: "manage_apps",
  definition: {
    title: "Manage PubNub App",
    description: `Manages PubNub apps with operations: list, create, update.
      - 'list': List all apps on your account.
      - 'create': Create a new app. User must provide data.name.
      - 'update': Update an existing app name. User must provide data.id and data.name.`,
    inputSchema: ManageAppsDefinitionSchema.shape,
  },
  handler: manageAppsHandler,
};

const manageKeysetsTool: ToolDef<ManageKeysetsSchemaType> = {
  name: "manage_keysets",
  definition: {
    title: "Manage PubNub Keyset",
    description: `Manages PubNub keysets with operations: get, list, create, update.
      - 'get': Get a specific keyset information. User needs to provide the keyset id.
      - 'list': List all keysets for your account or a specific app.
      - 'create': Create a new keyset. New keyset is created with Message Persistence, App Context, Files, and Presence enabled by default;
        the user must provide name, production, and config with nested objects (messagePersistence, appContext, files, presence),
        and if any required parameter is missing, you must ask the user to provide it.
      - 'update': Update an existing keyset. User needs to provide the keyset id and the config to update.`,
    inputSchema: ManageKeysetsDefinitionSchema.shape,
  },
  handler: manageKeysetsHandler,
};

const usageMetricsV2Description = `Fetches usage metrics from the PubNub Admin API for an account, app, or keyset.

      **Parameters:**
      - entityType: 'account', 'app', or 'keyset'
      - entityId: The ID of the entity
      - from: Start date (inclusive) in YYYY-MM-DD format
      - to: End date (exclusive) in YYYY-MM-DD format
      - metrics: Array of metric names to retrieve

      **Available Metric Categories:**
      - Core transactions: txn_total, mtd_txn_total, replicated, signals, edge
      - MAU/UUID: mtd_uuid, uuid, pn_uuid
      - Messages: msgs_total, publish, subscribe_msgs, history_msgs, files_msgs, push_msgs
      - Storage: bytes_stored, bytes_stored_messages, bytes_stored_files, etc.
      - Access Manager: accessmanager_grants_transactions, accessmanager_audits_transactions
      - Functions: executions, kv_read_transactions, kv_write_transactions
      - History: history_transactions, history_with_actions_transactions
      - Message Actions: message_actions_add_transactions, message_actions_get_transactions
      - Objects/App Context: objects_create_user_transactions, objects_get_user_transactions, etc.
      - Presence: presence_herenow_transactions, presence_wherenow_transactions
      - Push Notifications: apns_sent_transactions, gcm_sent_transactions
      - Subscribe: subscribe_transactions, subscribe_heartbeats_transactions
      - Publish: publish_transactions, publish_bytes
      - Signal: signal_transactions
      - Files: files_publish_transactions, files_get_file_transactions`;

const getUsageMetricsTool: ToolDef<UsageMetricsV2SchemaType> = {
  name: "get_usage_metrics",
  definition: {
    title: "Get PubNub Usage Metrics",
    description: usageMetricsV2Description,
    inputSchema: UsageMetricsV2DefinitionSchema.shape,
  },
  handler: getUsageMetricsHandler,
};

const getSDKDocumentationTool: ToolDef<GetSdkDocumentationSchemaType> = {
  name: "get_sdk_documentation",
  definition: {
    title: "Get PubNub Core SDK Documentation",
    description: `Retrieve Core SDK documentation for low-level real-time features.

      **When to use:**
      - Building NON-CHAT real-time apps (IoT, gaming state sync, live analytics, notifications)
      - Need fine-grained control over pub/sub, presence, storage, or access management
      - Implementing custom real-time patterns
      - Need API reference for specific SDK methods (publish, subscribe, history, etc.)
      - For Python SDK usage always request about sync or asyncio version of langauge. 

      **Do NOT use for:**
      - Chat/messaging apps → use "get_chat_sdk_documentation" instead
      - Conceptual guides → use "how_to"

      Returns code examples, API references, and implementation guides for the specified language/feature combination.`,
    inputSchema: GetSdkDocumentationSchema.shape,
  },
  handler: getSDKDocumentationHandler,
};

const getChatSDKDocumentationTool: ToolDef<GetChatSdkDocumentationSchemaType> = {
  name: "get_chat_sdk_documentation",
  definition: {
    title: "Get PubNub Chat SDK Documentation",
    description: `Retrieve Chat SDK documentation for building chat/messaging applications.

      **When to use:**
      - Building ANY chat or messaging application (1:1, group, channels)
      - Need typing indicators, read receipts, @mentions, unread counts
      - Want message threads, reactions, pinned messages, moderation
      - Need user/channel management with chat-specific features
      - Prefer rapid development with intuitive methods like sendText(), startTyping(), join()

      **Do NOT use for:**
      - Non-chat real-time apps (IoT, gaming state, analytics) → use "get_sdk_documentation"
      - Conceptual guides → use "how_to"

      **Example features:**
      - messages-send-receive, messages-threads, messages-reactions
      - channels-create, channels-join, channels-typing-indicator
      - users-mentions, users-presence

      Returns code examples and API references for the specified language/feature.`,
    inputSchema: GetChatSdkDocumentationSchema.shape,
  },
  handler: getChatSDKDocumentationHandler,
};

const howToTool: ToolDef<HowToSchemaType> = {
  name: "how_to",
  definition: {
    title: "Get PubNub How-To Guide",
    description: `Retrieve conceptual guides for specific PubNub use cases and integrations.
      **When to use:**
      - Learning how to implement a specific use case (gaming, healthcare, IoT)
      - Need step-by-step integration guide for a platform (Unity, Unreal etc)
      - Understanding PubNub features in context (presence, push notifications, functions)

      **Do NOT use for:**
      - API reference or code samples of a specific PubNub features → use \`get_sdk_documentation\` or \`get_chat_sdk_documentation\`
      - General best practices → use \`write_pubnub_app\`
      `,
    inputSchema: HowToSchema.shape,
  },
  handler: howToHandler,
};

const getSdkMigrationGuideTool: ToolDef<GetSdkMigrationGuideSchemaType> = {
  name: "get_sdk_migration_guide",
  definition: {
    title: "Get PubNub SDK Migration Guide",
    description: `Retrieve SDK migration guides for upgrading between PubNub SDK versions.

      **When to use:**
      - Upgrading a PubNub SDK to a newer major version
      - Need step-by-step instructions for migrating breaking changes
      - Refactoring a codebase after a PubNub SDK version bump

      **Do NOT use for:**
      - General SDK documentation → use "get_sdk_documentation"
      - Chat SDK documentation → use "get_chat_sdk_documentation"

      Returns the migration guide content for the specified language and target version.`,
    inputSchema: GetSdkMigrationGuideSchema.shape,
  },
  handler: getSdkMigrationGuideHandler,
};

const getGeneralMigrationGuideTool: ToolDef<GetGeneralMigrationGuideSchemaType> = {
  name: "get_general_migration_guide",
  definition: {
    title: "Get PubNub General Migration Guide",
    description: `Retrieve general migration guides for cross-cutting PubNub platform changes.

      **When to use:**
      - Migrating to a new encryption standard (e.g. 256-bit encryption)
      - Upgrading push notification setup (e.g. APNs HTTP/2, FCM v1)
      - Migrating to new API versions (e.g. Access Manager v3, Objects v2)
      - Replacing deprecated features (e.g. legacy webhooks)

      **Do NOT use for:**
      - SDK version upgrades (e.g. JavaScript v7→v8) → use "get_sdk_migration_guide"
      - General SDK documentation → use "get_sdk_documentation"

      Returns the migration guide content for the specified slug.`,
    inputSchema: GetGeneralMigrationGuideSchema.shape,
  },
  handler: getGeneralMigrationGuideHandler,
};

const writePubNubAppTool: ToolDef = {
  name: "write_pubnub_app",
  definition: {
    title: "Get PubNub Best Practices",
    description: `Retrieve PubNub best practices guide covering:
      1) Architecture & project setup (environments, payload sizes), 2) Security (Access Manager tokens, least privilege, PII hygiene),
      3) Channel & data modeling (naming conventions, message schemas), 4) Publish/Subscribe patterns,
      5) History usage, 6) Client reliability (reconnect, idempotency, ordering),
      7) Functions/edge logic, 8) Presence & state, 9) App Context, 10) Mobile specifics (push notifications, caching),
      11) Web specifics (tab lifecycle, Service Workers), 12) Observability & ops, 13) Performance & cost optimization.
      Call this tool when building PubNub applications to ensure robust, scalable, and secure implementations.`,
  },
  handler: getBestPracticesHandler,
};

const manageAppContextTool: ToolDef<ManageAppContextHandlerArgs> = {
  name: "manage_app_context",
  definition: {
    title: "Manage PubNub App Context",
    description: `Manages PubNub App Context (Objects API) for users, channels, and memberships.
      Supports CRUD operations including get, set, remove, and getAll.
      Use this tool to manage user profiles, channel metadata, and membership relationships in your PubNub application.`,
    inputSchema: ManageAppContextSchema.shape,
  },
  handler: manageAppContextHandler,
};

const publishMessageTool: ToolDef<PublishMessageHandlerArgs> = {
  name: "send_pubnub_message",
  definition: {
    title: "Send Message or Signal to PubNub Channel",
    description: `Send a message or signal to a PubNub channel in real-time. Supports both regular messages and lightweight signals.
      Plain strings are automatically wrapped in a 'text' field. Requires publish and subscribe keys from your PubNub keyset.`,
    inputSchema: PublishMessageSchema.shape,
  },
  handler: publishMessageHandler,
};

const getPresenceTool: ToolDef<GetPresenceHandlerArgs> = {
  name: "get_pubnub_presence",
  definition: {
    title: "Get Presence Data (HereNow / WhereNow)",
    description: `Retrieves real-time presence information.
      Use 'channels'/'channelGroups' for HereNow (occupancy/users in channel) and/or 'uuid' for WhereNow (channels a user is in).
      Returns presence data in JSON format. Requires publish and subscribe keys from your PubNub keyset.`,
    inputSchema: GetPresenceSchema.shape,
  },
  handler: getPresenceHandler,
};

const subscribeTool: ToolDef<SubscribeHandlerArgs> = {
  name: "subscribe_and_receive_pubnub_messages",
  definition: {
    title: "Subscribe to PubNub Channel and Receive Messages",
    description: `Subscribe to a PubNub channel and receive messages in real-time.
      Specify the number of messages (default 1) and/or a timeout (default 10s, max 30s) to wait for.
      Requires publish and subscribe keys from your PubNub keyset.`,
    inputSchema: SubscribeSchema.shape,
  },
  handler: subscribeHandler,
};

const getHistoryTool: ToolDef<GetHistoryHandlerArgs> = {
  name: "get_pubnub_messages",
  definition: {
    title: "Get PubNub Channel History",
    description:
      "Fetches historical messages from one or more PubNub channels. Call this tool whenever you need to access past message history. Provide a list of channel names. Returns message content and metadata in JSON format. Supports pagination with start/end timetokens and count limit.",
    inputSchema: GetHistorySchema.shape,
  },
  handler: getHistoryHandler,
};

const manageIlluminateTool: ToolDef<ManageIlluminateSchemaType> = {
  name: "manage_illuminate",
  definition: {
    title: "Manage PubNub Illuminate",
    description: `Manages PubNub Illuminate resources with operations: list, get, create, update, delete, activate, deactivate, get-fields, execute-adhoc, publish-fake-data, verify-query, check-action-log, raw-snapshot, aggregate, field-health, and custom-query.

      Supports full CRUD for: Business Objects, Metrics, Queries, Decisions, and Dashboards.

      **Operations:**
      - list: GET all resources of a given type
      - get: GET one resource by id
      - create: POST a new resource (Decisions use automatic 2-step POST→PUT workflow)
      - update: PUT/replace a resource
      - delete: DELETE a resource (Business Object delete cascades to all associated resources)
      - activate / deactivate: toggle isActive (Business Object) or enabled (Decision)
      - get-fields: fetch Query output field definitions (required before building a Query Decision)
      - execute-adhoc: run a one-off Query pipeline without saving it
      - publish-fake-data: generate type-aware fake PubNub messages and publish them to test Decisions. Fetches BO field schema and produces realistic values per field type. Payloads are NESTED to match each field's JSONPath (e.g. \`$.message.body.application.user_id\` produces \`{ application: { user_id: ... } }\`, not the flat key \`"application.user_id"\`), so JSONPath resolution works against nested BO schemas. Pass secret_key when the keyset has Access Manager enabled — initializing with the secret key grants root permissions and bypasses 403 errors. Alternatively pass auth_key with a token from grantToken(). Failures are reported per-message; partial publishes return success with a 'failures' array. NOTE: Illuminate ingests with a 20–30 second delay — wait before querying after publish.
      - verify-query: execute a saved Query by id and return results (confirms data is flowing)
      - check-action-log: fetch recent Decision action log entries to verify a Decision fired
      - raw-snapshot: return the most recent rows from a Business Object via ad-hoc query
      - aggregate: group and count BO data by user/channel or custom group_by fields
      - field-health: check which BO fields are populated vs empty (reveals JSONPath mismatches)
      - custom-query: run a fully custom ad-hoc pipeline

      **ID Dependency Chain — always capture before proceeding:**
      Business Object → id, fields[*].id
      Metric          → id, measureId, dimensionIds
      Query           → id, then call get-fields for output field IDs
      Decision        → id, inputFields[*].id, outputFields[*].id, actions[*].id
      Dashboard       → id, charts[*].id

      **Critical Decision rules:**
      hitType ('SINGLE'|'MATCH_ALL') and executeOnce (boolean) are required — omitting causes HTTP 500.
      Handler auto-injects safe defaults (hitType=SINGLE, executeOnce=false, activeFrom=now, activeUntil=now+2yr).
      The 2-step create workflow resolves field/action names → UUIDs in: action templates
      (both output variable names AND input field names — input names are sentinel-substituted
      pre-POST and restored post-POST), inputValues.inputFieldId, outputValues.outputFieldId,
      outputValues.value (dollar-brace), actionValues.actionId, and
      actionValues.executionLimitInputFieldIds. Use names everywhere.
      If the PUT step fails the handler deletes the orphaned scaffold automatically.

      **CRITICAL — QUERY decision input field naming:**
      For sourceType=QUERY decisions, each inputField.name MUST exactly match the source
      query's output field alias (case-sensitive, including underscores). Illuminate binds
      query result rows to decision inputs by NAME — not by sourceId. If names don't match,
      the decision will be created and activated successfully but will silently NEVER fire
      even with valid data. Always run get-fields on the source query first and copy the
      'field' values verbatim into your decision's inputFields[].name.

      **Business Object limits (handler pre-flights and rejects on violation):**
      - name: 1-100 characters
      - fields[].name: 1-50 characters
      - max 100 fields per BO
      - **max 5 TEXT_LONG fields per BO** (use TEXT, which holds 256 chars, for shorter strings)
      - keep \`description\` concise — overly long descriptions are rejected with HTTP 400 by the API

      **Decision action default:**
      When the user doesn't specify what action to fire, default to actionType='PUBNUB_PUBLISH'
      with a message body that includes the relevant input/output values via dollar-brace
      template references. PUBNUB_PUBLISH requires no external infrastructure and is trivially
      verifiable via check-action-log or by subscribing to the target channel. Only use WEBHOOK
      when the user has provided a specific URL.

      NEVER delete without explicit user confirmation.

      TOOL SELECTION GUIDE — Illuminate Claude Behavior:
      1. Intent-first: Always start from the user's desired outcome. Ask what they want
         to achieve before suggesting Business Objects, Metrics, or Decisions.
      2. Preview-first: Before creating any resources, describe automation in 1-2 sentences
         and show a conditions → actions decision table. Ask for confirmation before building.
      3. Predefined templates: For spam (flooding/cross-posting) and ranking (Top N/Bottom N),
         use the Query Builder predefined templates. Never recreate these from scratch.
      4. Built-in BO fields: For chat/moderation/ranking, User/Channel/Message/Message Type
         are auto-created. Never ask users to define them.
      5. Start simple: Minimal decision for the core goal; add complexity only when requested.
      6. PubNub extension: For delayed checks, scheduling, or orchestration beyond Illuminate,
         suggest PubNub Functions or pub/sub as the first extension path.`,
    inputSchema: ManageIlluminateSchema.shape,
  },
  handler: manageIlluminateHandler,
};

const insightsTool: ToolDef<InsightsSchemaType> = {
  name: "insights",
  definition: {
    title: "Query PubNub Insights",
    description: `Queries PubNub Insights — read-only aggregated analytics scoped to an account, app, or keyset.

      **Entity scoping:** Every query requires an entityType ('account', 'app', or 'keyset') and
      an entityId. For 'account' and 'app', the entityId is the numeric ID. For 'keyset', the
      entityId is the subscribe key (sub-c-...).

      Two endpoints, picked automatically by metric name:
      - /v2/insights        → aggregated metrics (unique_channels, unique_users, messages, etc.)
      - /v2/insights/top    → ranked metrics (top_20_channels, top_20_users, top_10_message_types, etc.)

      TOOL SELECTION GUIDE — Insights Claude Behavior:

      1. Group-aware: Insights metrics are organized into 5 functional groups — Channels, Users,
         Messages, User Behavior, Devices. When a user asks an analytic question, pick the right
         group first and then the specific metric. See the how-to guides:
         how_to(slug="how-to-get-insights-api-access"), channels, users, messages,
         user-behavior-and-devices, filters.

      2. Period rules (enforced at runtime):
         - Duration metrics (avg_user_duration, unique_users_by_duration_timeframe,
           top_*_channels_with_user_duration) → period=hourly ONLY.
         - Top-N metrics (top_20_*, top_1000_*) → hourly or daily ONLY (no weekly/monthly).
         - Country metrics → hourly or daily ONLY.
         - new_vs_recurring_users → daily / weekly / monthly only (NOT hourly).
         - All other metrics → all four periods supported.

      3. Top metrics REQUIRE category. Without it, the call errors. Valid categories:
         by_messages, by_chats, by_subscribers, by_users_with_messages,
         by_users_with_chats, by_subscribed_channels, all.

      4. Top-metric filtering uses \`filters\` (JSON), not \`filter\`. Use \`filters\` on
         top_20_* / top_1000_* for thresholds (count_messages gt), allowlists (channel_name
         in), and prefixes (uuid startsWith). Use \`filter\` only on channel_patterns.

      5. UTC timestamps. fromDate and toDate are YYYY-MM-DD in UTC. Always frame the response
         with the date range and timezone so the user has unambiguous context.

      6. Top-N counts CANNOT be summed across periods. If the user asks for "top channels this
         week" and you query with period=daily, return one ranking per day, not a weekly sum.

      7. Default to period=daily for most queries. It supports the widest set of metrics and
         gives a clean trend view. Use hourly only when intra-day granularity is needed or for
         duration metrics.

      8. Account must be on Insights Premium. Free plan has no API access. Pro existing
         customers may need to upgrade from Standard to Premium. If a 403 comes back, surface
         this as the likely cause.

      9. The tool does not write or store anything. Insights is strictly read-only.
    `,
    inputSchema: InsightsSchema.shape,
  },
  handler: insightsHandler,
};

export const tools = [
  getSDKDocumentationTool,
  getChatSDKDocumentationTool,
  getSdkMigrationGuideTool,
  getGeneralMigrationGuideTool,
  howToTool,
  writePubNubAppTool,
  manageAppsTool,
  manageKeysetsTool,
  getUsageMetricsTool,
  manageAppContextTool,
  publishMessageTool,
  getPresenceTool,
  subscribeTool,
  getHistoryTool,
  manageIlluminateTool,
  insightsTool,
];
