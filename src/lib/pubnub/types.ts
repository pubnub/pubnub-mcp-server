import type { z } from "zod";
import type {
  GetHistorySchema,
  GetPresenceSchema,
  PublishMessageSchema,
  SubscribeSchema,
} from "./schemas";

export type PubNubConfig = {
  publishKey: string;
  subscribeKey: string;
  secretKey?: string;
  authKey?: string;
};

// Schema types - inferred from schemas (always include keys now)
export type PublishMessageSchemaType = z.infer<typeof PublishMessageSchema>;
export type GetPresenceSchemaType = z.infer<typeof GetPresenceSchema>;
export type SubscribeSchemaType = z.infer<typeof SubscribeSchema>;
export type GetHistorySchemaType = z.infer<typeof GetHistorySchema>;

// Handler arg types - same as schema types (keys are required)
export type PublishMessageHandlerArgs = PublishMessageSchemaType;
export type GetPresenceHandlerArgs = GetPresenceSchemaType;
export type SubscribeHandlerArgs = SubscribeSchemaType;
export type GetHistoryHandlerArgs = GetHistorySchemaType;

// API param types - same as schema types
export type PublishMessageParams = PublishMessageSchemaType;
export type GetPresenceParams = GetPresenceSchemaType;
export type SubscribeParams = SubscribeSchemaType;
export type GetHistoryParams = GetHistorySchemaType;
