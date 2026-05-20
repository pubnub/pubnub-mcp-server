import { setupServer } from "msw/node";
import { handlers } from "./msw-handlers";

export const server = setupServer(...handlers);

export function setupTestEnv(overrides: Record<string, string> = {}) {
  const defaultEnv = {
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
  delete process.env.ADMIN_API_V2_URL;
  delete process.env.SDK_DOCS_API_URL;
}
