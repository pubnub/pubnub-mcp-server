import { AsyncLocalStorage } from "node:async_hooks";

// AsyncLocalStorage to store OAuth tokens for the current request context
const oauthTokenStorage = new AsyncLocalStorage<string>();

/**
 * Run a function with OAuth tokens in context
 */
export function withOAuthToken<T>(adminApiToken: string, fn: () => T): T {
  return oauthTokenStorage.run(adminApiToken, fn);
}

/**
 * Get the Admin API OAuth token from the current request context
 */
export function getOAuthToken(): string | undefined {
  return oauthTokenStorage.getStore();
}
