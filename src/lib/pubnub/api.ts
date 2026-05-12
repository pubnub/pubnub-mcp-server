import PubNub from "pubnub";
import type {
  GetHistoryParams,
  GetPresenceParams,
  PublishMessageParams,
  PubNubConfig,
  SubscribeParams,
} from "./types";

type Message = PubNub.Subscription.Message;

export function getPubNubClient(config: PubNubConfig): PubNub {
  const { publishKey, subscribeKey } = config;
  const pubnub = new PubNub({
    publishKey,
    subscribeKey,
    userId: process.env.PUBNUB_USER_ID || "pubnub-mcp",
    origin: process.env.PUBNUB_ORIGIN || "ps.pndsn.com",
  });
  return pubnub;
}

export async function publishMessage(params: PublishMessageParams) {
  const { publishKey, subscribeKey, channel, message, type } = params;
  const pubnub = getPubNubClient({ publishKey, subscribeKey });
  const processedMessage = typeof message === "string" ? { text: message } : message;
  let result: { timetoken: string };

  if (type === "signal") {
    result = await pubnub.signal({
      channel,
      message: processedMessage,
    });
  } else {
    result = await pubnub.publish({
      channel,
      message: processedMessage,
    });
  }

  return result.timetoken;
}

export async function getPresence(params: GetPresenceParams) {
  const { publishKey, subscribeKey, channels, channelGroups, uuid } = params;
  const pubnub = getPubNubClient({ publishKey, subscribeKey });

  const hasHereNowTargets = channels.length > 0 || channelGroups.length > 0;
  const hasWhereNowTarget = !!uuid;

  if (hasHereNowTargets && hasWhereNowTarget) {
    const [hereNowData, whereNowData] = await Promise.all([
      pubnub.hereNow({ channels, channelGroups }),
      pubnub.whereNow({ uuid }),
    ]);
    return {
      usersInChannels: hereNowData,
      channelsUserIsIn: whereNowData,
    };
  }

  if (hasWhereNowTarget) {
    return {
      channelsUserIsIn: await pubnub.whereNow({ uuid }),
    };
  }

  return {
    usersInChannels: await pubnub.hereNow({ channels, channelGroups }),
  };
}

export async function subscribeToChannel(params: SubscribeParams) {
  const { publishKey, subscribeKey, channel, messageCount, timeout } = params;
  const pubnub = getPubNubClient({ publishKey, subscribeKey });
  const subscription = pubnub.channel(channel).subscription();
  const messages: Message[] = [];
  let cleanup = () => {};

  const result = await Promise.race([
    new Promise(resolve => {
      const listener = {
        message: (event: Message) => {
          messages.push(event);
          if (messages.length >= messageCount) {
            resolve("complete");
          }
        },
      };

      cleanup = () => {
        subscription.removeListener(listener);
        subscription.unsubscribe();
      };

      subscription.addListener(listener);
      subscription.subscribe();
    }),

    new Promise(resolve => setTimeout(() => resolve("timeout"), timeout * 1000)),
  ]);

  cleanup();

  return {
    messageCount: messages.length,
    messages,
    note: !messages.length
      ? `Timeout: No messages received on channel '${channel}' within ${timeout}s`
      : result === "timeout" && messages.length < messageCount
        ? `Timeout: Only ${messages.length} of ${messageCount} requested messages received within ${timeout}s`
        : undefined,
  };
}

export async function getHistory(params: GetHistoryParams) {
  const { publishKey, subscribeKey, channels, start, end, count } = params;
  const client = getPubNubClient({ publishKey, subscribeKey });

  const fetchParams: {
    channels: string[];
    start?: string;
    end?: string;
    count?: number;
  } = {
    channels,
  };

  if (start !== undefined) {
    fetchParams.start = start;
  }
  if (end !== undefined) {
    fetchParams.end = end;
  }
  if (count !== undefined) {
    fetchParams.count = count;
  }

  const result = await client.fetchMessages(fetchParams);

  return result;
}
