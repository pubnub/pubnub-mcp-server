import { createLogger } from "../logger";

const log = createLogger("oauth:config");

type OAuthConfig = {
  issuer: string;
  mcpResource: string;
  adminApiResource: string;
  oauthClientId: string;
  oauthClientSecret: string;
};

const requireEnv = (varName: string): string => {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`${varName} environment variable is required`);
  }
  return value;
};

export function isOAuthEnabled(): boolean {
  return process.env.MCP_OAUTH_ENABLED === "true";
}

let config: OAuthConfig | null = null;
export function getOAuthConfig(): OAuthConfig {
  if (!config) {
    const isCloudMode = process.env.MCP_CLOUD_MODE === "true";
    const resource = isCloudMode
      ? requireEnv("MCP_RESOURCE_URL")
      : `http://localhost:${process.env.PORT || "3000"}/`;
    config = {
      issuer: requireEnv("OAUTH_ISSUER"),
      mcpResource: resource,
      adminApiResource: requireEnv("ADMIN_API_RESOURCE_URL"),
      oauthClientId: requireEnv("OAUTH_CLIENT_ID"),
      oauthClientSecret: requireEnv("OAUTH_CLIENT_SECRET"),
    };
  }
  return config;
}

/**
 * Fetch OAuth Authorization Server Metadata (RFC 8414)
 */
interface AuthorizationServerMetadata {
  issuer: string;
  token_endpoint: string;
  // Other fields omitted for brevity
}
let authServerMetadata: AuthorizationServerMetadata | null = null;
export async function getAuthServerMetadata(): Promise<AuthorizationServerMetadata> {
  if (authServerMetadata) {
    return authServerMetadata;
  }

  log.info("Fetching OAuth authorization server metadata");

  // RFC 8414: /.well-known/oauth-authorization-server
  const metadataUrl = `${getOAuthConfig().issuer}/.well-known/oauth-authorization-server`;

  try {
    const response = await fetch(metadataUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch authorization server metadata: ${response.status} ${response.statusText}`
      );
    }

    const metadata = (await response.json()) as AuthorizationServerMetadata;

    if (!metadata.token_endpoint) {
      throw new Error("Authorization server metadata missing token_endpoint");
    }

    log.info({ tokenEndpoint: metadata.token_endpoint }, "Discovered token endpoint");

    // Cache the metadata
    authServerMetadata = metadata;

    return metadata;
  } catch (error) {
    log.error({ err: error }, "Failed to fetch authorization server metadata");
    throw error;
  }
}
