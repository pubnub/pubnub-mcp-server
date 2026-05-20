import type { NextFunction, Request, Response } from "express";
import { createLogger } from "../logger";
import { isOAuthEnabled } from "./config";
import { buildWWWAuthenticateHeader } from "./resource-server";
import { withOAuthToken } from "./storage";
import { exchangeToken } from "./token-exchange";
import { validateToken } from "./validate";

const log = createLogger("oauth:middleware");

function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") return null;
  return parts[1] ?? null;
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
  // The token will be available to all tool handlers via getOAuthToken()
  withOAuthToken(adminApiToken, () => {
    next();
  });
}
