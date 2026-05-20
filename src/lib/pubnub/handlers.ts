import { createLogger } from "../logger";
import { createResponse, parseError } from "../utils";
import { getHistory, getPresence, publishMessage, subscribeToChannel } from "./api";
import { manageAppContext } from "./app-context/api";
import type { ManageAppContextHandlerArgs } from "./app-context/types";
import type {
  GetHistoryHandlerArgs,
  GetPresenceHandlerArgs,
  PublishMessageHandlerArgs,
  SubscribeHandlerArgs,
} from "./types";

const log = createLogger("pubnub:handlers");

export async function manageAppContextHandler(args: ManageAppContextHandlerArgs) {
  try {
    const result = await manageAppContext(args);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error(
      { err: e, type: args.type, operation: args.operation },
      "Failed to manage app context"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function publishMessageHandler(args: PublishMessageHandlerArgs) {
  try {
    const result = await publishMessage(args);
    return createResponse(JSON.stringify(result));
  } catch (e) {
    log.error({ err: e, channel: args.channel }, "Failed to publish message");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getPresenceHandler(args: GetPresenceHandlerArgs) {
  try {
    const result = await getPresence(args);
    return createResponse(JSON.stringify(result));
  } catch (e) {
    log.error({ err: e }, "Failed to get presence");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function subscribeHandler(args: SubscribeHandlerArgs) {
  try {
    const result = await subscribeToChannel(args);
    return createResponse(JSON.stringify(result));
  } catch (e) {
    log.error({ err: e, channel: args.channel }, "Failed to subscribe");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getHistoryHandler(args: GetHistoryHandlerArgs) {
  try {
    const result = await getHistory(args);
    return createResponse(JSON.stringify(result));
  } catch (e) {
    log.error({ err: e, channels: args.channels }, "Failed to get history");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
