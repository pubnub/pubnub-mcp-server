import { setupServer } from "msw/node";
import { handlers } from "./msw-handlers";

export const server = setupServer(...handlers);

export function setupTestEnv(overrides: Record<string, string> = {}) {
  const defaultEnv = {
    PUBNUB_EMAIL: "test@example.com",
    PUBNUB_PASSWORD: "test-password",
    ADMIN_API_V1_URL: "https://admin.pubnub.com/api",
    ADMIN_API_V2_URL: "https://admin-api.pubnub.com",
    SDK_DOCS_API_URL: "https://docs.pubnubtools.com/api/v1",
  };

  const env = { ...defaultEnv, ...overrides };

  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }

  return env;
}

export function setupV2TestEnv(overrides: Record<string, string> = {}) {
  const defaultEnv = {
    PUBNUB_API_KEY: "test-api-key",
    ADMIN_API_V2_URL: "https://admin-api.pubnub.com",
    SDK_DOCS_API_URL: "https://docs.pubnubtools.com/api/v1",
  };

  const env = { ...defaultEnv, ...overrides };

  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }

  return env;
}

export function clearTestEnv() {
  delete process.env.PUBNUB_EMAIL;
  delete process.env.PUBNUB_PASSWORD;
  delete process.env.PUBNUB_API_KEY;
  delete process.env.ADMIN_API_V1_URL;
  delete process.env.ADMIN_API_V2_URL;
  delete process.env.SDK_DOCS_API_URL;
  delete process.env.PUBNUB_PUBLISH_KEY;
  delete process.env.PUBNUB_SUBSCRIBE_KEY;
}

/**
 * Sets up PubNub keys in environment variables for testing.
 * Call this in tests to simulate having PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY set.
 */
export function setupEnvKeys(
  publishKey = "pub-c-env-test-key",
  subscribeKey = "sub-c-env-test-key"
) {
  process.env.PUBNUB_PUBLISH_KEY = publishKey;
  process.env.PUBNUB_SUBSCRIBE_KEY = subscribeKey;
}

export function clearEnvKeys() {
  delete process.env.PUBNUB_PUBLISH_KEY;
  delete process.env.PUBNUB_SUBSCRIBE_KEY;
}
