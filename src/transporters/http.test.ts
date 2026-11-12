import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp, isLoopbackOrigin } from "./http";

const originalOAuth = process.env.MCP_OAUTH_ENABLED;

afterEach(() => {
  if (originalOAuth === undefined) {
    delete process.env.MCP_OAUTH_ENABLED;
  } else {
    process.env.MCP_OAUTH_ENABLED = originalOAuth;
  }
});

function appWithOAuth(enabled: boolean) {
  process.env.MCP_OAUTH_ENABLED = enabled ? "true" : "false";
  return createApp({} as McpServer);
}

describe("createApp", () => {
  it("trusts the proxy so req.ip resolves X-Forwarded-For behind an ingress", () => {
    const app = createApp({} as McpServer);
    expect(app.get("trust proxy")).toBe(true);
  });
});

describe("isLoopbackOrigin", () => {
  it.each([
    "http://localhost:6274",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
    "https://localhost",
  ])("accepts %s", origin => {
    expect(isLoopbackOrigin(origin)).toBe(true);
  });

  it.each([
    "http://attacker.example",
    "http://localhost.attacker.example",
    "http://127.0.0.1.nip.io",
    "null",
    "file://",
    "chrome-extension://abc",
    "not a url",
  ])("rejects %s", origin => {
    expect(isLoopbackOrigin(origin)).toBe(false);
  });
});

describe("HTTP transport without OAuth", () => {
  it("rejects cross-site requests to the MCP endpoint", async () => {
    const res = await request(appWithOAuth(false))
      .post("/")
      .set("Origin", "http://attacker.example")
      .send({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "manage_keysets" } });

    expect(res.status).toBe(403);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("rejects CORS preflight from non-local origins", async () => {
    const res = await request(appWithOAuth(false))
      .options("/")
      .set("Origin", "http://attacker.example")
      .set("Access-Control-Request-Method", "POST");

    expect(res.status).toBe(403);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("rejects non-localhost Host headers (DNS rebinding)", async () => {
    const res = await request(appWithOAuth(false))
      .get("/health")
      .set("Host", "rebind.attacker.example");

    expect(res.status).toBe(403);
  });

  it("reflects loopback origins instead of sending a wildcard", async () => {
    const res = await request(appWithOAuth(false))
      .get("/health")
      .set("Origin", "http://localhost:6274");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:6274");
  });

  it("allows non-browser clients that send no Origin", async () => {
    const res = await request(appWithOAuth(false)).get("/health");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("HTTP transport with OAuth", () => {
  it("keeps wildcard CORS for browser-based MCP clients", async () => {
    const res = await request(appWithOAuth(true))
      .get("/health")
      .set("Host", "mcp.pubnub.com")
      .set("Origin", "https://some-client.example");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });
});
