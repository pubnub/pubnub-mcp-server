import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it } from "vitest";
import { createApp } from "./http";

describe("createApp", () => {
  it("trusts the proxy so req.ip resolves X-Forwarded-For behind an ingress", () => {
    const app = createApp({} as McpServer);
    expect(app.get("trust proxy")).toBe(true);
  });
});
