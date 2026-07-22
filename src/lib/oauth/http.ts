import type { NextFunction, Request, Response } from "express";
import { createLogger } from "../logger";
import { isOAuthEnabled } from "./config";
import { buildWWWAuthenticateHeader } from "./resource-server";
import { withRequestContext } from "./storage";
import { exchangeToken } from "./token-exchange";
import { validateToken } from "./validate";

const log = createLogger("oauth:middleware");

function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") return null;
  return parts[1] ?? null;
}

export function normalizeClientIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  return ip.replace(/^::ffff:/, "");
}

const unauthorizedResponse = (res: Response, error: string, errorDescription: string) =>
  res
    .status(401)
    .set("WWW-Authenticate", buildWWWAuthenticateHeader(error, errorDescription))
    .json({
      jsonrpc: "2.0",
      error: {
        code: -32001,
        message: `Unauthorized: ${errorDescription}`,
      },
      id: null,
    });

/**
 * Authentication middleware for protected endpoints
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!isOAuthEnabled()) {
    return next();
  }

  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    unauthorizedResponse(res, "missing_auth", "Missing bearer token");
    return;
  }

  const result = await validateToken(token);

  if (!result.valid) {
    unauthorizedResponse(
      res,
      result.error ?? "invalid_token",
      result.errorDescription ?? "Invalid token"
    );
    return;
  }

  // Exchange MCP token for Admin API token and store in AsyncLocalStorage
  let adminApiToken: string;
  try {
    adminApiToken = await exchangeToken(token);
  } catch (error) {
    log.error({ err: error }, "Token exchange failed");
    unauthorizedResponse(res, "invalid_token", "Token exchange failed");
    return;
  }

  // Set up AsyncLocalStorage context and call next()
  // The token (and analytics identity) is available to all tool handlers via storage getters.
  const userId = result.payload?.sub ?? "unknown";
  // With `trust proxy` enabled on the app, req.ip already resolves the leftmost
  // X-Forwarded-For entry (the real client behind the ingress/proxy).
  const clientIp = normalizeClientIp(req.ip);
  const analyticsDisabled = req.headers["x-analytics-disabled"] === "true";
  const ctx: {
    adminApiToken: string;
    userId: string;
    clientIp?: string;
    analyticsDisabled?: boolean;
  } = {
    adminApiToken,
    userId,
  };
  if (clientIp) ctx.clientIp = clientIp;
  if (analyticsDisabled) ctx.analyticsDisabled = true;
  withRequestContext(ctx, () => {
    next();
  });
}
