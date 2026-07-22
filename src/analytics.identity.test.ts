import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Mocks -----------------------------------------------------------------

const track = vi.fn();
const init = vi.fn();
const flush = vi.fn(() => ({ promise: Promise.resolve() }));

vi.mock("@amplitude/analytics-node", () => ({
  init,
  track,
  flush,
  Types: { LogLevel: { Debug: 4, Warn: 2 } },
}));

// The public API fires the PubNub provider too; stub it so nothing hits the net.
vi.mock("pubnub", () => ({
  default: class {
    publish = vi.fn().mockResolvedValue(undefined);
  },
}));

let mockUserId: string | undefined;
let mockClientIp: string | undefined;
vi.mock("./lib/oauth/storage", () => ({
  getUserId: () => mockUserId,
  getClientIp: () => mockClientIp,
  getAnalyticsDisabled: () => false,
}));

let mockMac: string | null;
vi.mock("node:os", async importOriginal => {
  const actual = await importOriginal<typeof import("node:os")>();
  return {
    ...actual,
    networkInterfaces: () =>
      (mockMac ? { eth0: [{ mac: mockMac, internal: false }] } : {}) as unknown as ReturnType<
        typeof actual.networkInterfaces
      >,
  };
});

// Re-import analytics with the current env applied (AMPLITUDE_API_KEY and the
// deployment mode are read at module-load / call time).
async function loadAnalytics() {
  vi.resetModules();
  return import("./analytics");
}

// Identity is the 3rd argument passed to Amplitude's track().
function lastIdentity(): { user_id?: string; device_id?: string; ip?: string } {
  const call = track.mock.calls.at(-1);
  return call?.[2] ?? {};
}

// Event properties are the 2nd argument passed to Amplitude's track().
function lastEventProps(): Record<string, unknown> {
  const call = track.mock.calls.at(-1);
  return (call?.[1] ?? {}) as Record<string, unknown>;
}

describe("resolveIdentity (via Amplitude track)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserId = undefined;
    mockClientIp = undefined;
    mockMac = "aa:bb:cc:dd:ee:ff";
    process.env.AMPLITUDE_API_KEY = "amp-test-key-123456";
    delete process.env.MCP_MODE;
    delete process.env.PUBNUB_API_KEY;
    delete process.env.MCP_ANALYTICS_DISABLED;
    delete process.env.MCP_SUBSCRIBE_ANALYTICS_DISABLED;
  });

  afterEach(() => {
    delete process.env.AMPLITUDE_API_KEY;
    delete process.env.MCP_MODE;
    delete process.env.PUBNUB_API_KEY;
  });

  // Hosted is OAuth-only (a sub is always present); local never has OAuth and
  // uses an API key or runs anonymously.

  it("hosted (OAuth): identifies by the raw sub as user_id, never a shared server device_id", async () => {
    process.env.MCP_MODE = "http";
    mockUserId = "123456";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    const id = lastIdentity();
    expect(id.user_id).toBe("123456");
    expect(id.device_id).toBeUndefined();
  });

  it("pads a sub shorter than 5 chars with leading zeroes (Amplitude min length)", async () => {
    process.env.MCP_MODE = "http";
    mockUserId = "42";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    expect(lastIdentity().user_id).toBe("00042");
  });

  it("leaves a sub of exactly 5 chars unchanged", async () => {
    process.env.MCP_MODE = "http";
    mockUserId = "12345";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    expect(lastIdentity().user_id).toBe("12345");
  });

  it("local + API key: device_id uses the api hash, no user_id", async () => {
    process.env.PUBNUB_API_KEY = "pub-secret-key";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    const id = lastIdentity();
    expect(id.user_id).toBeUndefined();
    expect(id.device_id).toMatch(/^api_/);
  });

  it("local + anonymous: falls back to the machine device_id", async () => {
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    const id = lastIdentity();
    expect(id.user_id).toBeUndefined();
    expect(id.device_id).toMatch(/^machine_/);
  });

  it("local + anonymous with no usable MAC: omits device_id and does not send", async () => {
    mockMac = null;
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    expect(track).not.toHaveBeenCalled();
  });

  it("safety net: an unauthenticated hosted request never emits the server MAC", async () => {
    process.env.MCP_MODE = "http";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    expect(track).not.toHaveBeenCalled();
  });

  it("includes the client ip when present", async () => {
    mockUserId = "sub123";
    mockClientIp = "203.0.113.7";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage("manage_apps", {}, {}, null);

    expect(lastIdentity().ip).toBe("203.0.113.7");
  });

  it("emits the operation but never raw parameters or secrets", async () => {
    mockUserId = "sub123";
    const { trackToolUsage } = await loadAnalytics();

    trackToolUsage(
      "manage_illuminate",
      { operation: "publish-fake-data", secret_key: "sec-super-secret" },
      { ok: true },
      null
    );

    const props = lastEventProps();
    expect(props.tool_name).toBe("manage_illuminate");
    expect(props.operation).toBe("publish-fake-data");
    expect(props.parameters).toBeUndefined();
    expect(JSON.stringify(props)).not.toContain("sec-super-secret");
  });
});
