import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContext {
  adminApiToken: string;
  // Authenticated user's identity (OAuth JWT `sub`), if available
  userId?: string;
}

// AsyncLocalStorage to store per-request context (OAuth token + user identity)
const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Run a function with the OAuth token (and optional user id) in context
 */
export function withOAuthToken<T>(adminApiToken: string, fn: () => T, userId?: string): T {
  return requestContextStorage.run({ adminApiToken, ...(userId ? { userId } : {}) }, fn);
}

/**
 * Get the Admin API OAuth token from the current request context
 */
export function getOAuthToken(): string | undefined {
  return requestContextStorage.getStore()?.adminApiToken;
}

/**
 * Get the authenticated user's id (OAuth JWT `sub`) from the current request context
 */
export function getUserId(): string | undefined {
  return requestContextStorage.getStore()?.userId;
}
