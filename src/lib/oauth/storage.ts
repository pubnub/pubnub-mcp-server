import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContext {
  adminApiToken: string;
  // Authenticated user's identity (OAuth JWT `sub`), if available
  userId?: string;
  // Client IP captured at the edge, used for analytics geo/identity
  clientIp?: string;
  // Per-request opt-out signalled by the caller (e.g. `x-analytics-disabled` header)
  analyticsDisabled?: boolean;
}

// AsyncLocalStorage to store per-request context (OAuth token + identity + analytics flags)
const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Run a function with the full per-request context in scope
 */
export function withRequestContext<T>(
  ctx: { adminApiToken: string; userId: string; clientIp?: string; analyticsDisabled?: boolean },
  fn: () => T
): T {
  return requestContextStorage.run(
    {
      adminApiToken: ctx.adminApiToken,
      userId: ctx.userId,
      ...(ctx.clientIp ? { clientIp: ctx.clientIp } : {}),
      ...(ctx.analyticsDisabled ? { analyticsDisabled: true } : {}),
    },
    fn
  );
}

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

/**
 * Get the client IP captured for the current request context
 */
export function getClientIp(): string | undefined {
  return requestContextStorage.getStore()?.clientIp;
}

/**
 * Whether analytics are disabled for the current request context
 */
export function getAnalyticsDisabled(): boolean {
  return requestContextStorage.getStore()?.analyticsDisabled === true;
}
