import { createResponse, parseError, withPubSubEnvKeys } from "../utils";
import { getHistory, getPresence, publishMessage, subscribeToChannel } from "./api";
import { manageAppContext } from "./app-context/api";
import type { ManageAppContextHandlerArgs } from "./app-context/types";
import type {
  GetHistoryHandlerArgs,
  GetPresenceHandlerArgs,
  PublishMessageHandlerArgs,
  SubscribeHandlerArgs,
} from "./types";

export async function manageAppContextHandler(args: ManageAppContextHandlerArgs) {
  try {
    const result = await manageAppContext(withPubSubEnvKeys(args));
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function publishMessageHandler(args: PublishMessageHandlerArgs) {
  try {
    const result = await publishMessage(withPubSubEnvKeys(args));
    return createResponse(JSON.stringify(result));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getPresenceHandler(args: GetPresenceHandlerArgs) {
  try {
    const result = await getPresence(withPubSubEnvKeys(args));
    return createResponse(JSON.stringify(result));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function subscribeHandler(args: SubscribeHandlerArgs) {
  try {
    const result = await subscribeToChannel(withPubSubEnvKeys(args));
    return createResponse(JSON.stringify(result));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getHistoryHandler(args: GetHistoryHandlerArgs) {
  try {
    const result = await getHistory(withPubSubEnvKeys(args));
    return createResponse(JSON.stringify(result));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)));
  }
}
