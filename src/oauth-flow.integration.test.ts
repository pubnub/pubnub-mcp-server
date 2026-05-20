import * as jose from "jose";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

// Generate test RSA key pair for signing JWTs
const { publicKey, privateKey } = await jose.generateKeyPair("RS256");

const TEST_ADMIN_TOKEN = "test-admin-token";

// OAuth configuration
const OAUTH_ISSUER = "https://admin-test.example.com/oauth";
const MCP_RESOURCE_URL = "https://mcp-test.example.com/";
const ADMIN_API_RESOURCE_URL = "https://admin-api-test.example.com/";

// Generate a valid JWT token for testing
async function createTestToken(audience: string): Promise<string> {
  return await new jose.SignJWT({
    sub: "test-user-123",
    email: "test@example.com",
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key-1" })
    .setIssuer(OAUTH_ISSUER)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);
}

describe("OAuth Flow Integration Test", () => {
  let testMcpToken: string;
  // MSW server setup
  const server = setupServer(
    // Mock OAuth Authorization Server Metadata (RFC 8414)
    http.get(`${OAUTH_ISSUER}/.well-known/oauth-authorization-server`, () => {
      return HttpResponse.json({
        issuer: OAUTH_ISSUER,
        token_endpoint: `${OAUTH_ISSUER}/token`,
        jwks_uri: `${OAUTH_ISSUER}/jwks`,
      });
    }),
    http.get(`${OAUTH_ISSUER}/jwks`, async () => {
      const jwk = await jose.exportJWK(publicKey);
      return HttpResponse.json({
        keys: [
          {
            kty: "RSA",
            use: "sig",
            kid: "test-key-1",
            ...jwk,
          },
        ],
      });
    }),
    http.post(`${OAUTH_ISSUER}/token`, async ({ request }) => {
      const body = await request.text();
      const params = new URLSearchParams(body);

      // Verify token exchange parameters
      expect(params.get("grant_type")).toBe("urn:ietf:params:oauth:grant-type:token-exchange");
      expect(params.get("subject_token")).toBe(testMcpToken);
      expect(params.get("resource")).toBe(ADMIN_API_RESOURCE_URL);

      return HttpResponse.json({
        access_token: TEST_ADMIN_TOKEN,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "openid profile email",
      });
    }),
    http.get("https://admin-api-test.example.com/v2/apps", ({ request }) => {
      const auth = request.headers.get("authorization");

      // Verify Admin API is called with exchanged token
      expect(auth).toBe(`Bearer ${TEST_ADMIN_TOKEN}`);

      return HttpResponse.json({
        apps: [
          { id: "100", name: "Test App", owner: "test-user" },
          { id: "200", name: "Another App", owner: "test-user" },
        ],
        total: 2,
      });
    })
  );

  beforeAll(async () => {
    // Start MSW server - bypass unhandled requests (like POST to local Express server)
    server.listen({ onUnhandledRequest: "bypass" });

    // Generate test MCP token with correct audience
    testMcpToken = await createTestToken(MCP_RESOURCE_URL);

    // Set environment variables for OAuth
    process.env.MCP_OAUTH_ENABLED = "true";
    process.env.MCP_CLOUD_MODE = "true";
    process.env.MCP_RESOURCE_URL = MCP_RESOURCE_URL;
    process.env.OAUTH_ISSUER = OAUTH_ISSUER;
    process.env.OAUTH_CLIENT_ID = "test-client-id";
    process.env.OAUTH_CLIENT_SECRET = "test-client-secret";
    process.env.ADMIN_API_RESOURCE_URL = ADMIN_API_RESOURCE_URL;
    process.env.ADMIN_API_V2_URL = "https://admin-api-test.example.com";
    process.env.MCP_SESSION_SUPPORT = "false"; // Use stateless mode for testing
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("should complete full OAuth flow: validate MCP token → exchange for Admin API token → call Admin API", async () => {
    // Use production MCP server with all real tools
    const { PubNubMCPServer } = await import("./index");
    const pubNubServer = new PubNubMCPServer();
    const mcpServer = pubNubServer.getServer();

    // Use production app setup
    const { createApp } = await import("./transporters/http");
    const app = createApp(mcpServer);

    // Make MCP protocol request with valid JWT token
    const mcpRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "manage_apps",
        arguments: {
          operation: "list",
        },
      },
    };

    const response = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${testMcpToken}`)
      .set("Accept", "application/json, text/event-stream")
      .send(mcpRequest);

    // Verify response
    expect(response.status).toBe(200);

    // Parse SSE response
    let result: unknown;
    if (response.headers["content-type"]?.includes("text/event-stream")) {
      // Parse SSE format: "event: message\ndata: {json}\n\n"
      const lines = response.text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.substring(6));
          if (data.result) {
            result = data.result;
            break;
          }
        }
      }
    } else {
      result = response.body.result;
    }

    expect(result).toBeDefined();
    expect(result.isError).toBeFalsy(); // Should not be an error

    // Parse the result content
    const resultContent = JSON.parse(result.content[0].text);
    expect(resultContent.total).toBe(2);
    expect(resultContent.apps).toHaveLength(2);
    expect(resultContent.apps[0].name).toBe("Test App");
  });

  it("should reject request when token exchange fails", async () => {
    // Create a token with wrong audience (will pass JWT validation but fail exchange)
    const wrongToken = await createTestToken(MCP_RESOURCE_URL);

    // Override token exchange handler to reject this specific token
    server.use(
      http.post(`${OAUTH_ISSUER}/token`, () => {
        // Reject the token exchange
        return HttpResponse.json(
          {
            error: "invalid_token",
            error_description: "Token exchange failed",
          },
          { status: 401 }
        );
      })
    );

    // Use production MCP server
    const { PubNubMCPServer } = await import("./index");
    const pubNubServer = new PubNubMCPServer();
    const mcpServer = pubNubServer.getServer();

    const { createApp } = await import("./transporters/http");
    const app = createApp(mcpServer);

    const mcpRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "manage_apps",
        arguments: {
          operation: "list",
        },
      },
    };

    const response = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${wrongToken}`)
      .set("Accept", "application/json, text/event-stream")
      .send(mcpRequest);

    // Verify 401 response
    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toContain("Token exchange failed");
  });

  it("should reject expired JWT token", async () => {
    // Create an expired token
    const expiredToken = await new jose.SignJWT({
      sub: "test-user-123",
      email: "test@example.com",
    })
      .setProtectedHeader({ alg: "RS256", kid: "test-key-1" })
      .setIssuer(OAUTH_ISSUER)
      .setAudience(MCP_RESOURCE_URL)
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200) // 2 hours ago
      .setExpirationTime("-1h") // Expired 1 hour ago
      .sign(privateKey);

    const { PubNubMCPServer } = await import("./index");
    const pubNubServer = new PubNubMCPServer();
    const { createApp } = await import("./transporters/http");
    const app = createApp(pubNubServer.getServer());

    const mcpRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    };

    const response = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${expiredToken}`)
      .set("Accept", "application/json, text/event-stream")
      .send(mcpRequest);

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toContain("Token has expired");
  });

  it("should reject token with wrong audience", async () => {
    const wrongAudienceToken = await createTestToken("https://wrong-audience.example.com/");

    const { PubNubMCPServer } = await import("./index");
    const pubNubServer = new PubNubMCPServer();
    const { createApp } = await import("./transporters/http");
    const app = createApp(pubNubServer.getServer());

    const mcpRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    };

    const response = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${wrongAudienceToken}`)
      .set("Accept", "application/json, text/event-stream")
      .send(mcpRequest);

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toContain("Claim validation failed");
  });

  it("should reject request without authorization header", async () => {
    const { PubNubMCPServer } = await import("./index");
    const pubNubServer = new PubNubMCPServer();
    const { createApp } = await import("./transporters/http");
    const app = createApp(pubNubServer.getServer());

    const mcpRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    };

    const response = await request(app)
      .post("/")
      .set("Accept", "application/json, text/event-stream")
      .send(mcpRequest);

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toContain("Missing bearer token");
  });
});
