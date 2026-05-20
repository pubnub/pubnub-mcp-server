import * as jose from "jose";
import { createLogger } from "../logger";
import { getOAuthConfig } from "./config";

const log = createLogger("oauth:validate");

// JWKS cache
let jwks: jose.JWTVerifyGetKey | null = null;

/**
 * Get or create the JWKS client for fetching public keys from the OAuth server
 */
function getJWKS(): jose.JWTVerifyGetKey {
  if (!jwks) {
    jwks = jose.createRemoteJWKSet(new URL(`${getOAuthConfig().issuer}/jwks`));
  }
  return jwks;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: jose.JWTPayload;
  error?: string;
  errorDescription?: string;
}

/**
 * Validate a JWT token against the OAuth server
 * Checks: signature, expiration, issuer, and audience claims
 */
export async function validateToken(token: string): Promise<TokenValidationResult> {
  try {
    const { payload } = await jose.jwtVerify(token, getJWKS(), {
      issuer: getOAuthConfig().issuer,
      audience: getOAuthConfig().mcpResource,
    });

    log.info("Token validation successful");

    if (!payload.sub) {
      return {
        valid: false,
        error: "invalid_token",
        errorDescription: "Token missing subject claim",
      };
    }

    return { valid: true, payload };
  } catch (err) {
    log.warn(
      { err: err instanceof Error ? err.message : "Unknown error" },
      "Token validation failed"
    );
    if (err instanceof jose.errors.JWTExpired) {
      return {
        valid: false,
        error: "invalid_token",
        errorDescription: "Token has expired",
      };
    }
    if (err instanceof jose.errors.JWTClaimValidationFailed) {
      return {
        valid: false,
        error: "invalid_token",
        errorDescription: `Claim validation failed: ${err.message}`,
      };
    }
    if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
      return {
        valid: false,
        error: "invalid_token",
        errorDescription: "Token signature verification failed",
      };
    }
    return {
      valid: false,
      error: "invalid_token",
      errorDescription: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Validate the audience claim against the expected resource
 */
export function validateAudience(aud: string | string[]): boolean {
  const audiences = Array.isArray(aud) ? aud : [aud];
  return audiences.includes(getOAuthConfig().mcpResource);
}
