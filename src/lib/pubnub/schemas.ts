import { z } from "zod";
import { hasPubSubEnvKeys } from "../utils";

export const PubNubConfigSchema = z.object({
  publishKey: z
    .string()
    .describe(
      "Publish Key that can be obtained from your keyset by list_keysets tool or in PubNub admin portal"
    ),
  subscribeKey: z
    .string()
    .describe(
      "Subscribe Key that can be obtained from your keyset by list_keysets tool or in PubNub admin portal"
    ),
});

const conditionalKeysShape = hasPubSubEnvKeys() ? {} : PubNubConfigSchema.shape;

export const PublishMessageSchema = z
  .object({
    channel: z.string().describe("Channel ID to publish message to"),
    message: z
      .union([z.string(), z.record(z.string(), z.any())])
      .describe("Message payload (can be any JSON-serializable value or plain string)"),
    type: z
      .enum(["message", "signal"])
      .optional()
      .describe(
        "Type of message to publish: 'message' for regular messages or 'signal' for lightweight signals"
      )
      .default("message"),
  })
  .extend(conditionalKeysShape);

export const GetPresenceSchema = z
  .object({
    channels: z
      .array(z.string())
      .default([])
      .describe("List of channel names (strings) to query presence data for"),
    channelGroups: z
      .array(z.string())
      .default([])
      .describe("List of channel group names (strings) to query presence data for"),
    uuid: z.string().optional().describe("UUID to query channel subscriptions for (WhereNow)"),
  })
  .extend(conditionalKeysShape);

export const SubscribeSchema = z
  .object({
    channel: z.string().describe("Channel ID to subscribe to and receive messages from"),
    messageCount: z
      .number()
      .optional()
      .default(1)
      .describe("Number of messages to wait for before unsubscribing (default: 1 message)"),
    timeout: z
      .number()
      .max(30)
      .optional()
      .default(10)
      .describe(
        "Maximum timeout in seconds. If not all messages are received within this time, the subscription will end (default: 10 seconds, max 30 seconds)"
      ),
  })
  .extend(conditionalKeysShape);

export const GetHistorySchema = z
  .object({
    channels: z.array(z.string()).describe("List of channel names to fetch history from"),
    start: z
      .string()
      .optional()
      .describe(
        "Timetoken delimiting the start (exclusive) of the time slice to pull messages from"
      ),
    end: z
      .string()
      .optional()
      .describe("Timetoken delimiting the end (inclusive) of the time slice to pull messages from"),
    count: z.number().optional().describe("Number of historical messages to return per channel"),
  })
  .extend(conditionalKeysShape);
