import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withOAuthToken } from "./lib/oauth/storage";

const mockPublish = vi.fn();

vi.mock("pubnub", () => {
  return {
    default: class MockPubNub {
      publish = mockPublish;
    },
  };
});

import { trackInit, trackToolUsage } from "./analytics";

// Extract the message payload from the most recent publish() call
function lastPublishedData(): Record<string, unknown> {
  const call = mockPublish.mock.calls.at(-1);
  const message = call?.[0]?.message as { data: Record<string, unknown> };
  return message.data;
}

describe("trackToolUsage userId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPublish.mockResolvedValue(undefined);
    delete process.env.MCP_SUBSCRIBE_ANALYTICS_DISABLED;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("uses the authenticated user's id from request context when present", () => {
    withOAuthToken(
      "admin-token",
      () => {
        trackToolUsage("manage_apps", { operation: "list" }, { ok: true }, null);
      },
      "oauth-sub-123"
    );

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(lastPublishedData().userId).toBe("oauth-sub-123");
  });

  it('falls back to "anonymous" when there is no request context', () => {
    trackToolUsage("manage_apps", { operation: "list" }, { ok: true }, null);

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(lastPublishedData().userId).toBe("anonymous");
  });
});

describe("trackToolUsage parameter redaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPublish.mockResolvedValue(undefined);
    delete process.env.MCP_SUBSCRIBE_ANALYTICS_DISABLED;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("forwards the operation discriminator but never the raw parameters", () => {
    trackToolUsage(
      "manage_illuminate",
      { operation: "publish-fake-data", secret_key: "sec-super-secret", auth_key: "tok-123" },
      { ok: true },
      null
    );

    const data = lastPublishedData();
    expect(data.toolName).toBe("manage_illuminate");
    expect(data.operation).toBe("publish-fake-data");
    // The raw parameters object must not be present under any key.
    expect(data.parameters).toBeUndefined();
    expect(JSON.stringify(data)).not.toContain("sec-super-secret");
    expect(JSON.stringify(data)).not.toContain("tok-123");
  });

  it("sends a null operation when there is no operation parameter", () => {
    trackToolUsage("get_pubnub_messages", { channel: "secret-channel-name" }, { ok: true }, null);

    const data = lastPublishedData();
    expect(data.operation).toBeNull();
    expect(JSON.stringify(data)).not.toContain("secret-channel-name");
  });
});

describe("trackInit userId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockPublish.mockResolvedValue(undefined);
    delete process.env.MCP_SUBSCRIBE_ANALYTICS_DISABLED;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("includes the authenticated user's id from request context when present", () => {
    withOAuthToken(
      "admin-token",
      () => {
        trackInit();
      },
      "oauth-sub-123"
    );
    vi.runAllTimers();

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(lastPublishedData().userId).toBe("oauth-sub-123");
  });

  it('falls back to "anonymous" when there is no request context', () => {
    trackInit();
    vi.runAllTimers();

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(lastPublishedData().userId).toBe("anonymous");
  });
});
