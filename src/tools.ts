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
    description: `Retrieve Core SDK documentation for low-level real-time features.
      
      **When to use:**
      - Building NON-CHAT real-time apps (IoT, gaming state sync, live analytics, notifications)
      - Need fine-grained control over pub/sub, presence, storage, or access management
      - Implementing custom real-time patterns
      - Need API reference for specific SDK methods (publish, subscribe, history, etc.)
      
      **Do NOT use for:**
      - Chat/messaging apps → use "get_chat_sdk_documentation" instead
      - Conceptual guides → use "how_to"
      
      **Parameters:**
      - language: SDK language (javascript, python, swift, kotlin, java, go, c-sharp, unity, unreal, etc.)
      - feature: SDK feature area (publish-and-subscribe, presence, storage-and-playback, access-manager, files, objects, etc.)
      
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
      
      **Parameters:**
      - language: Chat SDK language (javascript, kotlin, swift, unity, unreal)
      - feature: Chat feature area (channels-*, messages-*, users-*, typing-indicator, read-receipts, etc.)
      
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
      - Need step-by-step integration guide for a platform (Unity, Unreal, Alexa)
      - Understanding PubNub features in context (presence, push notifications, moderation, functions)
      
      **Do NOT use for:**
      - API reference or code samples of a specific PubNub features → use \`get_sdk_documentation\` or \`get_chat_sdk_documentation\`
      - General best practices → use \`get_best_practices\`
      
      **Example slugs:**
      - Gaming: add-pubnub-to-your-unity-game, add-presence-to-your-unreal-engine-game
      - Chat: chat-sdk-mention-users, chat-sdk-add-reactions-to-messages
      - Portal: admin-portal-create-keys, admin-portal-presence
      - IoT: develop-an-iot-solution, implement-iot-predictive-maintenance
      
      **Parameter:** slug - The guide identifier (e.g., "add-pubnub-to-your-unity-game")`,
    inputSchema: HowToSchema.shape,
  },
  handler: howToHandler,
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
      "Fetches historical messages from one or more PubNub channels. Call this tool whenever you need to access past message history. Provide a list of channel names. Returns message content and metadata in JSON format. Supports pagination with start/end timetokens and count limit. Requires publish and subscribe keys from your PubNub keyset.",
    inputSchema: GetHistorySchema.shape,
  },
  handler: getHistoryHandler,
};

export const tools = [
  getSDKDocumentationTool,
  getChatSDKDocumentationTool,
  howToTool,
  writePubNubAppTool,
  manageAppsTool,
  manageKeysetsTool,
  manageAppContextTool,
  publishMessageTool,
  getPresenceTool,
  subscribeTool,
  getHistoryTool,
];
