import { HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { overrideAdminApiRoute } from "../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../test-utils/msw-setup";
import { getOAuthToken } from "../oauth";
import {
  createPackage,
  deleteDeployment,
  getIntersectedDeployments,
  getKvEntry,
  getPackage,
  listPackages,
  setKvEntry,
  stopDeployment,
} from "./api";

vi.mock("../oauth", () => ({
  getOAuthToken: vi.fn(() => "mock-oauth-token"),
}));

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

// Captures the outgoing request so tests can assert on how faasRequest built it
// (auth header, version header, URL/query, body) while returning a canned response.
interface CapturedRequest {
  method: string;
  url: string;
  authorization: string | null;
  pubnubVersion: string | null;
  contentType: string | null;
  body: unknown;
}

function captureAdminRoute(
  method: HttpMethod,
  path: string,
  respond: () => HttpResponse = () => HttpResponse.json({ ok: true })
): CapturedRequest {
  const captured: CapturedRequest = {
    method: "",
    url: "",
    authorization: null,
    pubnubVersion: null,
    contentType: null,
    body: undefined,
  };
  overrideAdminApiRoute(method, path, async ({ request }) => {
    captured.method = request.method;
    captured.url = request.url;
    captured.authorization = request.headers.get("Authorization");
    captured.pubnubVersion = request.headers.get("PubNub-Version");
    captured.contentType = request.headers.get("Content-Type");
    const raw = await request.text();
    captured.body = raw ? JSON.parse(raw) : undefined;
    return respond();
  });
  return captured;
}

describe("Functions API", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    setupTestEnv();
    vi.mocked(getOAuthToken).mockReturnValue("mock-oauth-token");
  });

  afterEach(() => {
    clearTestEnv();
    process.env = { ...ORIGINAL_ENV };
    vi.clearAllMocks();
  });

  // ─── Authentication ──────────────────────────────────────────────────────────

  describe("authentication", () => {
    it("sends a Bearer token when an OAuth token is present", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/packages");

      await listPackages();

      expect(captured.authorization).toBe("Bearer mock-oauth-token");
    });

    it("sends the raw API key when no OAuth token is present", async () => {
      vi.mocked(getOAuthToken).mockReturnValue(undefined);
      process.env.PUBNUB_API_KEY = "si-test-key";
      const captured = captureAdminRoute("get", "/v2/faas/packages");

      await listPackages();

      expect(captured.authorization).toBe("si-test-key");
    });

    it("throws when neither an OAuth token nor PUBNUB_API_KEY is available", async () => {
      vi.mocked(getOAuthToken).mockReturnValue(undefined);
      delete process.env.PUBNUB_API_KEY;

      await expect(listPackages()).rejects.toThrow("No authentication available");
    });
  });

  // ─── Common headers ────────────────────────────────────────────────────────--

  describe("headers", () => {
    it("sends the default PubNub-Version and JSON content type", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/packages");

      await listPackages();

      expect(captured.pubnubVersion).toBe("2026-05-26");
      expect(captured.contentType).toBe("application/json");
    });
  });

  // ─── URL and query building ────────────────────────────────────────────────--

  describe("request building", () => {
    it("targets the /v2/faas base path", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/packages");

      await listPackages();

      expect(captured.method).toBe("GET");
      expect(new URL(captured.url).pathname).toBe("/v2/faas/packages");
    });

    it("omits the query string when no params are supplied", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/packages");

      await listPackages();

      expect(captured.url).not.toContain("?");
    });

    it("serializes scalar query params and includes zero", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/packages");

      await listPackages({ search: "chat", page: 0, size: 10 });

      const params = new URL(captured.url).searchParams;
      expect(params.get("search")).toBe("chat");
      expect(params.get("page")).toBe("0");
      expect(params.get("size")).toBe("10");
    });

    it("repeats array query params and omits undefined ones", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/package-deployments/intersected");

      await getIntersectedDeployments(42, ["chat.*", "alerts.*"]);

      const params = new URL(captured.url).searchParams;
      expect(params.get("keyset_id")).toBe("42");
      expect(params.getAll("channel")).toEqual(["chat.*", "alerts.*"]);
      expect(params.has("function_type")).toBe(false);
    });

    it("includes function_type in the query when provided", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/package-deployments/intersected");

      await getIntersectedDeployments(42, ["chat.*"], "js-before-publish");

      expect(new URL(captured.url).searchParams.get("function_type")).toBe("js-before-publish");
    });

    it("serializes a boolean query param and omits it when undefined", async () => {
      const withForce = captureAdminRoute(
        "delete",
        "/v2/faas/package-deployments/:id/function-deployments",
        () => new HttpResponse(null, { status: 204 })
      );
      await stopDeployment("dep-1", true);
      expect(new URL(withForce.url).searchParams.get("force")).toBe("true");

      const withoutForce = captureAdminRoute(
        "delete",
        "/v2/faas/package-deployments/:id/function-deployments",
        () => new HttpResponse(null, { status: 204 })
      );
      await stopDeployment("dep-1");
      expect(withoutForce.url).not.toContain("?");
    });

    it("URL-encodes path segments and appends the subkey query param", async () => {
      const captured = captureAdminRoute("get", "/v2/faas/kv/strings/:key");

      await getKvEntry("string", "my key/with:special", "sub-c-test");

      expect(captured.url).toContain("/v2/faas/kv/strings/my%20key%2Fwith%3Aspecial");
      expect(new URL(captured.url).searchParams.get("subkey")).toBe("sub-c-test");
    });
  });

  // ─── Request bodies ──────────────────────────────────────────────────────────

  describe("request bodies", () => {
    it("sends a JSON body for writes", async () => {
      const captured = captureAdminRoute("post", "/v2/faas/packages", () =>
        HttpResponse.json({ id: "pkg-1" }, { status: 201 })
      );

      await createPackage({ name: "New" });

      expect(captured.method).toBe("POST");
      expect(captured.body).toEqual({ name: "New" });
    });

    it("sends the value and ttlSeconds body with the subkey query for kv set", async () => {
      const captured = captureAdminRoute("put", "/v2/faas/kv/strings/:key");

      await setKvEntry("string", "config", "hello", "sub-c-test", 60);

      expect(captured.method).toBe("PUT");
      expect(captured.body).toEqual({ value: "hello", ttlSeconds: 60 });
      expect(new URL(captured.url).searchParams.get("subkey")).toBe("sub-c-test");
    });
  });

  // ─── Response handling ─────────────────────────────────────────────────────--

  describe("response handling", () => {
    it("parses a JSON response body", async () => {
      const payload = { id: "pkg-1", name: "Chat" };
      overrideAdminApiRoute("get", "/v2/faas/packages/:id", () => HttpResponse.json(payload));

      await expect(getPackage("pkg-1")).resolves.toEqual(payload);
    });

    it("returns { success: true } for a 204 No Content response", async () => {
      overrideAdminApiRoute(
        "delete",
        "/v2/faas/package-deployments/:id",
        () => new HttpResponse(null, { status: 204 })
      );

      await expect(deleteDeployment("dep-1")).resolves.toEqual({ success: true });
    });

    it("returns { success: true } for an empty 200 body", async () => {
      overrideAdminApiRoute("get", "/v2/faas/packages/:id", () =>
        HttpResponse.text("", { status: 200 })
      );

      await expect(getPackage("pkg-1")).resolves.toEqual({ success: true });
    });

    it("wraps a non-JSON 200 body in { success: true, body }", async () => {
      overrideAdminApiRoute("get", "/v2/faas/packages/:id", () =>
        HttpResponse.text("plain text", { status: 200 })
      );

      await expect(getPackage("pkg-1")).resolves.toEqual({
        success: true,
        body: "plain text",
      });
    });

    it("throws HTTP <status>: <body> for a non-ok response", async () => {
      overrideAdminApiRoute("get", "/v2/faas/packages/:id", () =>
        HttpResponse.text('{"errors":[{"code":"FAAS-1004","message":"Package not found"}]}', {
          status: 404,
        })
      );

      await expect(getPackage("missing")).rejects.toThrow(
        'HTTP 404: {"errors":[{"code":"FAAS-1004","message":"Package not found"}]}'
      );
    });
  });
});
