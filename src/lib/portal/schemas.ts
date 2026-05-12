import { z } from "zod";

const AppContextRegion = z
  .enum([
    "aws-iad-1", // US East
    "aws-pdx-1", // US West
    "aws-fra-1", // EU Central
    "aws-bom-1", // APAC South
    "aws-hnd-1", // APAC Northeast
  ])
  .describe(
    "Region for App Context storage. This setting cannot be changed once set. Make sure to ask the user what the value should be. Do not set it without explicit consent."
  );

const FilesRegion = z
  .enum([
    "us-east-1", // US East
    "us-west-1", // US West
    "eu-central-1", // EU Central
    "ap-south-1", // APAC South
    "ap-northeast-1", // APAC Northeast
  ])
  .describe(
    "Region for Files storage. This setting cannot be changed once set. Make sure to ask the user what the value should be. Do not set it without explicit consent."
  );

export const MessageStorageRetention = z
  .union([
    z.literal(1),
    z.literal(7),
    z.literal(30),
    z.literal(90),
    z.literal(180),
    z.literal(365),
    z.literal(0),
  ])
  .describe(
    [
      "Retention for messages stored in history (in days).",
      "Allowed values by billing type:",
      "Free: 1, 7;",
      "Starter: 30, 90, 180;",
      "Pro: 365, 0 (unlimited).",
    ].join(" ")
  );

export const FilesRetention = z
  .union([z.literal(1), z.literal(7), z.literal(30), z.literal(0)])
  .describe(
    [
      "Retention for Files storage (in days).",
      "Allowed values by billing type:",
      "Free: 1, 7;",
      "Starter: 30;",
      "Pro: 0 (unlimited).",
    ].join(" ")
  );

const MessagePersistenceConfigSchema = z
  .object({
    enabled: z
      .boolean()
      .describe(
        "Enable or disable message persistence. Allows storing and retrieving historical messages."
      ),
    retention: MessageStorageRetention.optional().describe(
      "Number of days to retain messages. Required when enabled=true."
    ),
    includePresenceEvents: z
      .boolean()
      .optional()
      .describe("Store presence event messages in message history."),
    deleteFromHistory: z
      .boolean()
      .optional()
      .describe(
        "A setting that lets you use API calls to delete specific messages previously stored in a channel's message history."
      ),
  })
  .refine(data => !data.enabled || data.retention !== undefined, {
    message: "retention is required when enabled=true",
    path: ["retention"],
  });

const AppContextConfigSchema = z
  .object({
    enabled: z
      .boolean()
      .describe(
        "Enable or disable App Context (Objects). Allows persisting user and channel metadata."
      ),
    region: AppContextRegion.optional().describe(
      "Region for App Context storage. Required when enabled=true. Cannot be changed once set."
    ),
    userMetadataEvents: z
      .boolean()
      .optional()
      .describe(
        "Enable or disable user metadata events, which are triggered when user metadata is set or removed in the objects database."
      ),
    channelMetadataEvents: z
      .boolean()
      .optional()
      .describe(
        "Enable or disable channel metadata events, which are triggered when channel metadata is set or removed in the objects database. Apps can subscribe and update UI based on channel property changes."
      ),
    membershipEvents: z
      .boolean()
      .optional()
      .describe(
        "Enables or disables membership (associations between users and channels) events, which are triggered when memberships are added, updated or removed in the objects database. This helps you manage and respond to who belongs to which channels. Subscribe to receive and handle these events."
      ),
    disallowGetAllChannelMetadata: z
      .boolean()
      .optional()
      .describe(
        'If enabled, the "Get All Channel Metadata" call is disallowed. If you enable Access Manager and leave this unchecked, you can get all channel metadata without listing it in the token\'s permission schema.'
      ),
    disallowGetAllUserMetadata: z
      .boolean()
      .optional()
      .describe(
        'If enabled, the "Get All User Metadata" call is disallowed. If you enable Access Manager and leave this unchecked, you can get all user metadata without listing it in the token\'s permission schema.'
      ),
    referentialIntegrity: z
      .boolean()
      .optional()
      .describe(
        "When enabled: you can create a membership only if the specified user ID and channel ID exist as standalone metadata entities. Deleting a user or channel automatically deletes its child membership associations. When disabled: you can create memberships even if the user or channel entity doesn't exist. Deleting a user or channel doesn't delete associated memberships."
      ),
  })
  .refine(data => !data.enabled || data.region !== undefined, {
    message: "region is required when enabled=true",
    path: ["region"],
  });

const FilesConfigSchema = z
  .object({
    enabled: z
      .boolean()
      .describe("Enable or disable file sharing. Allows uploading and sharing files up to 5MB."),
    region: FilesRegion.optional().describe(
      "Region for file storage. Required when enabled=true. Cannot be changed once set."
    ),
    retention: FilesRetention.optional().describe(
      "Number of days to retain files. Required when enabled=true."
    ),
  })
  .refine(data => !data.enabled || data.region !== undefined, {
    message: "region is required when enabled=true",
    path: ["region"],
  })
  .refine(data => !data.enabled || data.retention !== undefined, {
    message: "retention is required when enabled=true",
    path: ["retention"],
  });

const PresenceConfigSchema = z.object({
  enabled: z
    .boolean()
    .describe(
      "Enable or disable presence. Provides visibility into who is currently subscribed to channels."
    ),
  announceMax: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe(
      'Maximum number of occupants in a channel before announcements switch to emitting occupancy counts instead of emitting "join", "leave" and "timeout" events.'
    ),
  interval: z
    .number()
    .min(10)
    .optional()
    .describe(
      "Cadence in seconds between each announcement of the channel occupancy. Must be greater than or equal to 10"
    ),
  deltas: z
    .boolean()
    .optional()
    .describe(
      "If enabled, adds two fields to interval event: a list of UUIDs that have joined and left the channel since the last presence interval message."
    ),
  generateLeaveOnDisconnect: z
    .boolean()
    .optional()
    .describe(
      'Triggers a "leave" event at the closing of the clients connection (for example, when a browser tab closes or an app is force quit). Generates additional billable events.'
    ),
  streamFiltering: z
    .boolean()
    .optional()
    .describe(
      "Once enabled, filters presence events at the client. You receive only relevant events on the Presence channel (for example, join events for a specific User ID)."
    ),
  activeNoticeChannel: z
    .string()
    .optional()
    .describe(
      "Sends notifications when a channel switches between active (has subscribers) and inactive (no subscribers)."
    ),
  debounce: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The number of seconds to wait before allowing implicit "joins" after an explicit "leave". Helps smooth out rapid state changes.'
    ),
});

export const KeysetConfigSchema = z
  .object({
    messagePersistence: MessagePersistenceConfigSchema.optional().describe(
      "Message persistence configuration for storing and retrieving historical messages."
    ),
    appContext: AppContextConfigSchema.optional().describe(
      "App Context (Objects) configuration for persisting user and channel metadata."
    ),
    files: FilesConfigSchema.optional().describe(
      "File sharing configuration for uploading and sharing files."
    ),
    presence: PresenceConfigSchema.optional().describe(
      "Presence configuration for real-time subscriber information."
    ),
  })
  .describe("Keyset feature configuration.");

export const ListAppsDataSchema = z.object({}).strict().optional();

export const CreateAppDataSchema = z
  .object({
    name: z.string().describe("Name of the app to create."),
  })
  .strict();

export const UpdateAppDataSchema = z
  .object({
    id: z.string().describe("App ID to update."),
    name: z.string().describe("New name for the app."),
  })
  .strict();

const ListAppsOperationSchema = z.object({
  operation: z.literal("list").describe("List all apps in the account."),
});

const CreateAppOperationSchema = z.object({
  operation: z.literal("create").describe("Create a new app."),
  data: CreateAppDataSchema.describe("For 'create': {name}."),
});

const UpdateAppOperationSchema = z.object({
  operation: z.literal("update").describe("Update an existing app."),
  data: UpdateAppDataSchema.describe("For 'update': {id, name}."),
});

export const ManageAppsSchema = z.discriminatedUnion("operation", [
  ListAppsOperationSchema,
  CreateAppOperationSchema,
  UpdateAppOperationSchema,
]);

/** Schema shape for MCP tool definition - describes all possible inputs */
export const ManageAppsDefinitionSchema = z.object({
  operation: z
    .enum(["list", "create", "update"])
    .describe(
      "Operation to perform: 'list' to list all apps, 'create' to create a new app, 'update' to update an existing app."
    ),
  data: z
    .union([CreateAppDataSchema, UpdateAppDataSchema])
    .optional()
    .describe(
      "Operation-specific data. For 'list': not required. For 'create': {name}. For 'update': {id, name}."
    ),
});

// Keyset schemas
export const ListKeysetDataSchema = z
  .object({
    appId: z
      .string()
      .optional()
      .describe(
        "App ID to list keysets for. If not provided, keysets for the entire account will be listed."
      ),
  })
  .strict();

export const CreateKeysetDataSchema = z
  .object({
    name: z.string().describe("Name of the keyset."),
    appId: z
      .string()
      .optional()
      .describe(
        "App ID. If not provided, a new app will be created. You must ask the user if they want to create a new app."
      ),
    type: z
      .enum(["testing", "production"])
      .describe(
        "Keyset type: 'testing' for testing/development or 'production' for live environments."
      ),
    config: KeysetConfigSchema.describe("Keyset feature configuration."),
  })
  .strict();

export const UpdateKeysetDataSchema = z
  .object({
    id: z.string().describe("Keyset ID to update."),
    config: KeysetConfigSchema.describe("Keyset feature configuration to update."),
  })
  .strict();

export const GetKeysetDataSchema = z
  .object({
    id: z.string().describe("Keyset ID to get."),
  })
  .strict();

const GetKeysetOperationSchema = z.object({
  operation: z.literal("get").describe("Get a specific keyset information."),
  data: GetKeysetDataSchema.describe("For 'get': {id}."),
});

const ListKeysetsOperationSchema = z.object({
  operation: z.literal("list").describe("List keysets for an app or account."),
  data: ListKeysetDataSchema.optional().describe(
    "For 'list': {appId?}. If not provided, keysets for the account will be listed."
  ),
});

const CreateKeysetOperationSchema = z.object({
  operation: z.literal("create").describe("Create a new keyset."),
  data: CreateKeysetDataSchema.describe("For 'create': {name, appId?, type, config}."),
});

const UpdateKeysetOperationSchema = z.object({
  operation: z.literal("update").describe("Update an existing keyset."),
  data: UpdateKeysetDataSchema.describe("For 'update': {id, config}."),
});

export const ManageKeysetsSchema = z.discriminatedUnion("operation", [
  GetKeysetOperationSchema,
  ListKeysetsOperationSchema,
  CreateKeysetOperationSchema,
  UpdateKeysetOperationSchema,
]);

/** Schema shape for MCP tool definition - describes all possible inputs */
export const ManageKeysetsDefinitionSchema = z.object({
  operation: z
    .enum(["get", "list", "create", "update"])
    .describe(
      "Operation to perform: 'get' to get specific keyset information, 'list' to list keysets, 'create' to create a new keyset, 'update' to update an existing keyset."
    ),
  data: z
    .union([
      GetKeysetDataSchema,
      ListKeysetDataSchema,
      CreateKeysetDataSchema,
      UpdateKeysetDataSchema,
    ])
    .optional()
    .describe(
      "Operation-specific data. For 'get': {id}. For 'list': {appId?}. For 'create': {name, appId?, type, config}. For 'update': {id, config}."
    ),
});

const UsageMetricsDateFormat = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .describe("Date in YYYY-MM-DD format.");

export const UsageMetricsV2EntityType = z
  .enum(["account", "app", "keyset"])
  .describe("The type of entity to fetch metrics for.");

export const UsageMetricV2Name = z.enum([
  "txn_total",
  "mtd_txn_total",
  "replicated",
  "signals",
  "edge",
  "message_actions",
  "free",
  "mtd_uuid",
  "uuid",
  "pn_uuid",
  "msgs_total",
  "publish",
  "subscribe_msgs",
  "history_msgs",
  "files_msgs",
  "push_msgs",
  "bytes_stored",
  "bytes_stored_blocks",
  "bytes_stored_channel_groups",
  "bytes_stored_files",
  "bytes_stored_messages",
  "bytes_stored_push",
  "bytes_stored_size_auth",
  "bytes_stored_users",
  "bytes_stored_memberships",
  "accessmanager_audits_transactions",
  "accessmanager_grants_v3_transactions",
  "accessmanager_grants_transactions",
  "accessmanager_replicated",
  "accessmanager_edge",
  "accessmanager_clienterrors_transactions",
  "executions",
  "kv_read_transactions",
  "kv_write_transactions",
  "xhr_transactions",
  "functions_replicated",
  "functions_edge",
  "misfire_client_transactions",
  "misfire_eh_transactions",
  "fire_transactions",
  "fire_eh_transactions",
  "fire_client_transactions",
  "history_messages_count_transactions",
  "history_transactions",
  "history_edge",
  "history_with_actions_transactions",
  "history_clienterrors_transactions",
  "history_with_actions_clienterrors_transactions",
  "history_with_actions_unauthorized_transactions",
  "message_actions_add_transactions",
  "message_actions_get_transactions",
  "message_actions_remove_transactions",
  "subscribe_message_actions_transactions",
  "message_actions_clienterrors_transactions",
  "message_actions_unauthorized_transactions",
  "objects_create_space_transactions",
  "objects_create_user_transactions",
  "objects_delete_space_transactions",
  "objects_delete_user_transactions",
  "objects_get_all_spaces_transactions",
  "objects_get_all_users_transactions",
  "objects_get_space_transactions",
  "objects_get_user_space_memberships_transactions",
  "objects_get_space_user_memberships_transactions",
  "objects_get_user_transactions",
  "objects_update_space_transactions",
  "objects_update_space_user_memberships_transactions",
  "objects_update_user_space_memberships_transactions",
  "objects_update_user_transactions",
  "internal_publish_objects_transactions",
  "objects_replicated",
  "objects_edge",
  "objects_users",
  "objects_spaces",
  "objects_memberships",
  "objects_errors",
  "objects_clienterrors_transactions",
  "objects_unauthorized_transactions",
  "presence_getuserstate_transactions",
  "presence_herenow_global_transactions",
  "presence_herenow_transactions",
  "presence_leave_transactions",
  "presence_setuserstate_transactions",
  "presence_heartbeats_transactions",
  "presence_wherenow_transactions",
  "presence_replicated",
  "presence_edge",
  "presence_clienterrors_transactions",
  "apns_sent_transactions",
  "apns_removed_transactions",
  "mpns_sent_transactions",
  "mpns_removed_transactions",
  "gcm_removed_transactions",
  "gcm_sent_transactions",
  "push_device_writes_transactions",
  "push_device_reads_transactions",
  "push_notifications_replicated",
  "push_notifications_edge",
  "push_notifications_apple",
  "push_notifications_android",
  "push_notifications_microsoft",
  "push_device_clienterrors_transactions",
  "steam_controller_edge",
  "steam_controller_replicated",
  "streamcontroller_reads_transactions",
  "streamcontroller_writes_transactions",
  "streamcontroller_clienterrors_transactions",
  "subscribe_transactions",
  "subscribe_timeouts_transactions",
  "subscribe_objects_transactions",
  "subscribe_heartbeats_transactions",
  "subscribe_streaming_transactions",
  "subscribe_clientclosedconnection_transactions",
  "subscribe_edge",
  "subscribe_signal_transactions",
  "subscribe_files_transactions",
  "subscribe_clienterrors_transactions",
  "subscribe_unauthorized_transactions",
  "publish_transactions",
  "publish_edge",
  "publish_replicated",
  "publish_bytes",
  "publish_msg_average_size",
  "publish_clienterrors_transactions",
  "publish_unauthorized_transactions",
  "signal_transactions",
  "signal_clienterrors_transactions",
  "signal_unauthorized_transactions",
  "files_publish_transactions",
  "files_delete_file_transactions",
  "files_generate_url_transactions",
  "files_get_file_transactions",
  "files_get_all_files_transactions",
  "files_replicated",
  "files_edge",
  "files_clienterrors_transactions",
  "files_unauthorized_transactions",
  "events_ingested",
  "subscribe_bytes",
  "message_ratio",
  "mtd_txn_mtd_uuid_ratio",
  "channel",
  "ip",
  "key_ip_ch",
  "key_ip_ua",
  "pres_pub",
]);

export const UsageMetricsV2Schema = z
  .object({
    entityType: UsageMetricsV2EntityType.describe(
      "The type of entity to fetch metrics for: 'account', 'app', or 'keyset'."
    ),
    entityId: z.string().describe("The ID of the entity (account ID, app ID, or keyset ID)."),
    from: UsageMetricsDateFormat.describe("Start date (inclusive) in YYYY-MM-DD format."),
    to: UsageMetricsDateFormat.describe("End date (exclusive) in YYYY-MM-DD format."),
    metrics: z
      .array(UsageMetricV2Name)
      .min(1, "At least one metric must be specified")
      .describe("Array of metric names to retrieve."),
  })
  .strict();

export const UsageMetricsV1Type = z.enum(["monthly_active_users", "transaction"]);

const UsageMetricsV1AppSchema = z
  .object({
    scope: z.literal("app"),
    appId: z.string().describe("The app ID to fetch metrics for."),
    usageType: UsageMetricsV1Type.describe(
      "Type of usage metrics: 'monthly_active_users' for chat, 'transaction' for other use cases."
    ),
    start: UsageMetricsDateFormat.describe("Start date in YYYY-MM-DD format."),
    end: UsageMetricsDateFormat.describe("End date in YYYY-MM-DD format."),
  })
  .strict();

const UsageMetricsV1KeysetSchema = z
  .object({
    scope: z.literal("keyset"),
    keysetId: z.string().describe("The keyset (key) ID to fetch metrics for."),
    usageType: UsageMetricsV1Type.describe(
      "Type of usage metrics: 'monthly_active_users' for chat, 'transaction' for other use cases."
    ),
    start: UsageMetricsDateFormat.describe("Start date in YYYY-MM-DD format."),
    end: UsageMetricsDateFormat.describe("End date in YYYY-MM-DD format."),
  })
  .strict();

export const UsageMetricsV1Schema = z.discriminatedUnion("scope", [
  UsageMetricsV1AppSchema,
  UsageMetricsV1KeysetSchema,
]);

export const UsageMetricsV1DefinitionSchema = z.object({
  scope: z
    .enum(["app", "keyset"])
    .describe(
      "Scope of the metrics: 'app' to fetch metrics for an app, 'keyset' to fetch metrics for a keyset."
    ),
  appId: z
    .string()
    .optional()
    .describe("The app ID to fetch metrics for. Required when scope='app'."),
  keysetId: z
    .string()
    .optional()
    .describe("The keyset (key) ID to fetch metrics for. Required when scope='keyset'."),
  usageType: UsageMetricsV1Type.describe(
    "Type of usage metrics: 'monthly_active_users' for chat, 'transaction' for other use cases."
  ),
  start: UsageMetricsDateFormat.describe("Start date in YYYY-MM-DD format."),
  end: UsageMetricsDateFormat.describe("End date in YYYY-MM-DD format."),
});
