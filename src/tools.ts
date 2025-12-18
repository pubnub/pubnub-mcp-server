import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import {
  getBestPracticesHandler,
  getChatSDKDocumentationHandler,
  getSDKDocumentationHandler,
  howToHandler,
} from "./lib/docs/handlers";
import {
  GetChatSdkDocumentationSchema,
  GetSdkDocumentationSchema,
  HowToSchema,
} from "./lib/docs/schemas";
import type {
  GetChatSdkDocumentationSchemaType,
  GetSdkDocumentationSchemaType,
  HowToSchemaType,
} from "./lib/docs/types";
import { manageAppsHandler, manageKeysetsHandler } from "./lib/portal/handlers";
import { ManageAppsDefinitionSchema, ManageKeysetsDefinitionSchema } from "./lib/portal/schemas";
import type { ManageAppsSchemaType, ManageKeysetsSchemaType } from "./lib/portal/types";
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

const getSDKDocumentationTool: ToolDef<GetSdkDocumentationSchemaType> = {
  name: "get_sdk_documentation",
  definition: {
    title: "Get PubNub Core SDK Documentation",
    description: `Retrieve Core SDK documentation for low-level real-time features (for example (but not limited to), publish/subscribe, presence, storage, access management).
      
      **When to use Core SDK:**
      - Building non-chat real-time apps (IoT, gaming state sync, live analytics, notifications)
      - Need fine-grained control over pub/sub behavior and message handling
      - Implementing custom real-time patterns not covered by Chat SDK
      - Building infrastructure that other applications will use
      
      **Relationship with Chat SDK:** The Chat SDK is built ON TOP of this Core SDK. If you're building a chat application, consider using get_chat_sdk_documentation instead for higher-level abstractions. You can also combine both - Chat SDK exposes Core SDK via chat.sdk property.
      
      Provides code examples, guides, and API references. Always use this tool when working with PubNub Core SDKs.`,
    inputSchema: GetSdkDocumentationSchema.shape,
  },
  handler: getSDKDocumentationHandler,
};

const getChatSDKDocumentationTool: ToolDef<GetChatSdkDocumentationSchemaType> = {
  name: "get_chat_sdk_documentation",
  definition: {
    title: "Get PubNub Chat SDK Documentation",
    description: `Retrieve Chat SDK documentation for high-level chat features with pre-built abstractions.
      
      **When to use Chat SDK (RECOMMENDED for chat apps):**
      - Building chat/messaging applications (1:1, group chat, channels)
      - Need typing indicators, read receipts, @mentions, unread message counts
      - Want threaded conversations, message reactions, pinned messages
      - Prefer rapid development with intuitive methods like sendText(), startTyping(), join()
      
      **Built-in features:** User management, channel management, message threads, read receipts, typing indicators, @mentions, message reactions, moderation tools, push notifications integration.
      
      **Relationship with Core SDK:** Chat SDK is built on top of Core SDK and provides access to it via chat.sdk property. Use Core SDK (get_sdk_documentation) only when you need features beyond chat or require low-level control.
      
      Provides code examples, guides, and API references. Use this tool first when building any chat-based application.`,
    inputSchema: GetChatSdkDocumentationSchema.shape,
  },
  handler: getChatSDKDocumentationHandler,
};

const howToTool: ToolDef<HowToSchemaType> = {
  name: "how_to",
  definition: {
    title: "Get PubNub How-To Guide",
    description: `Retrieve a PubNub conceptual guides. Returns detailed instructions for implementing specific PubNub features and use cases.
      Available guides include topics like: Unity/Unreal game development, chat SDK features, admin portal configuration, IoT solutions, presence, push notifications, moderation, and more.
      Call this tool for overviews, integration instructions, best practices, and troubleshooting tips. For detailed API reference and SDK code samples, also call the get_sdk_documentation or get_chat_sdk_documentation tool.'`,
    inputSchema: HowToSchema.shape,
  },
  handler: howToHandler,
};

const getBestPracticesTool: ToolDef = {
  name: "get_best_practices",
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
      "Fetches historical messages from one or more PubNub channels. Call this tool whenever you need to access past message history. Provide a list of channel names. Returns message content and metadata in JSON format. Supports pagination with start/end timetokens and count limit. Requires publish and subscribe keys from your PubNub keyset.",
    inputSchema: GetHistorySchema.shape,
  },
  handler: getHistoryHandler,
};

export const tools = [
  manageAppsTool,
  manageKeysetsTool,
  getSDKDocumentationTool,
  getChatSDKDocumentationTool,
  howToTool,
  getBestPracticesTool,
  manageAppContextTool,
  publishMessageTool,
  getPresenceTool,
  subscribeTool,
  getHistoryTool,
];
