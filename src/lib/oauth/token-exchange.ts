import { createLogger } from "../logger";
import { getAuthServerMetadata, getOAuthConfig } from "./config";

const log = createLogger("oauth:token-exchange");

interface TokenExchangeResponse {
  access_token: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
}

export async function exchangeToken(mcpToken: string): Promise<string> {
  log.info("Exchanging MCP token for Admin API token");
  const authServer = await getAuthServerMetadata();

  try {
    const params = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token: mcpToken,
      subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
      resource: getOAuthConfig().adminApiResource,
      client_id: getOAuthConfig().oauthClientId,
      client_secret: getOAuthConfig().oauthClientSecret,
    });

    const response = await fetch(authServer.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      log.error(
        { status: response.status, statusText: response.statusText },
        "Token exchange failed"
      );
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as TokenExchangeResponse;

    if (!data.access_token || !data.expires_in) {
      log.error("Invalid response from token endpoint: missing access_token or expires_in");
      throw new Error("Invalid token exchange response");
    }

    log.info("Token exchange successful");
    return data.access_token;
  } catch (error) {
    log.error({ err: error }, "Error during token exchange");
    throw error;
  }
}
