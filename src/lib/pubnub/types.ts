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
};

export type HandlerArgs<T> = Omit<T, keyof PubNubConfig> & Partial<PubNubConfig>;
export type ApiParams<T> = Omit<T, keyof PubNubConfig> & PubNubConfig;

// Schema types - inferred from schemas (keys may or may not be present depending on env)
export type PublishMessageSchemaType = z.infer<typeof PublishMessageSchema>;
export type GetPresenceSchemaType = z.infer<typeof GetPresenceSchema>;
export type SubscribeSchemaType = z.infer<typeof SubscribeSchema>;
export type GetHistorySchemaType = z.infer<typeof GetHistorySchema>;

// Handler arg types - keys are optional (may come from env vars)
export type PublishMessageHandlerArgs = HandlerArgs<PublishMessageSchemaType>;
export type GetPresenceHandlerArgs = HandlerArgs<GetPresenceSchemaType>;
export type SubscribeHandlerArgs = HandlerArgs<SubscribeSchemaType>;
export type GetHistoryHandlerArgs = HandlerArgs<GetHistorySchemaType>;

// API param types - keys are ALWAYS required (withEnvKeys guarantees this)
export type PublishMessageParams = ApiParams<PublishMessageSchemaType>;
export type GetPresenceParams = ApiParams<GetPresenceSchemaType>;
export type SubscribeParams = ApiParams<SubscribeSchemaType>;
export type GetHistoryParams = ApiParams<GetHistorySchemaType>;
