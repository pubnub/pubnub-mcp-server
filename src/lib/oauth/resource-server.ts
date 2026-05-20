import { getOAuthConfig } from "./config";

const getResourceUrl = () => getOAuthConfig().mcpResource;

/**
 * Build WWW-Authenticate header for 401 responses per RFC 6750
 */
export function buildWWWAuthenticateHeader(error?: string, errorDescription?: string): string {
  const parts = [`Bearer resource="${getResourceUrl()}"`];

  if (error) {
    parts.push(`error="${error}"`);
  }

  if (errorDescription) {
    parts.push(`error_description="${errorDescription}"`);
  }

  return parts.join(", ");
}

/**
 * Get Protected Resource Metadata per RFC 9728
 * This is served at /.well-known/oauth-protected-resource
 */
export function getProtectedResourceMetadata() {
  return {
    resource: getResourceUrl(),
    authorization_servers: [getOAuthConfig().issuer.replace(/\/oauth$/, "")],
    bearer_methods_supported: ["header"],
    resource_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "email", "profile", "offline_access"],
  };
}
