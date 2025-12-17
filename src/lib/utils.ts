import type { PubNubConfig } from "./pubnub/types";

export const createResponse = (arg: string, isError: boolean = false) => {
  return {
    content: [
      {
        type: "text" as const,
        text: arg,
      },
    ],
    isError,
  };
};

export const parseError = (e: unknown) => {
  if (e === null || e === undefined) {
    throw new TypeError("parseError expects a non-null value");
  }

  // PubNubError
  if (
    e &&
    typeof e === "object" &&
    "status" in e &&
    e.status &&
    typeof e.status === "object" &&
    "errorData" in e.status
  ) {
    return {
      name: "PubNubError",
      message: e.status?.errorData,
    };
  }

  if (e instanceof Error) {
    return {
      message: e.message,
      name: e.name,
    };
  }

  let message: string;

  if (typeof e === "object") {
    try {
      message = JSON.stringify(e);
    } catch {
      message = String(e);
    }
  } else {
    message = String(e);
  }

  return {
    message,
    name: "Unknown",
  };
};

export function getPubSubEnvKeys(): PubNubConfig | undefined {
  const publishKey = process.env.PUBNUB_PUBLISH_KEY;
  const subscribeKey = process.env.PUBNUB_SUBSCRIBE_KEY;

  if (publishKey && subscribeKey) {
    return { publishKey, subscribeKey };
  }

  return undefined;
}

export function hasPubSubEnvKeys(): boolean {
  return !!(process.env.PUBNUB_PUBLISH_KEY && process.env.PUBNUB_SUBSCRIBE_KEY);
}

/**
 * Merges environment keys with provided args.
 * Environment keys take precedence if available, otherwise uses keys from args.
 * Throws an error if keys are not available from either source.
 */
export function withPubSubEnvKeys<T extends Record<string, unknown>>(args: T): T & PubNubConfig {
  const envKeys = getPubSubEnvKeys();

  if (envKeys) {
    return { ...args, ...envKeys };
  }

  const argsWithPubSubKeys = args as T & Partial<PubNubConfig>;
  if (argsWithPubSubKeys.publishKey && argsWithPubSubKeys.subscribeKey) {
    return argsWithPubSubKeys as T & PubNubConfig;
  }

  throw new Error(
    "PubNub keys are required. Either set PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY environment variables, or provide publishKey and subscribeKey in the request."
  );
}
