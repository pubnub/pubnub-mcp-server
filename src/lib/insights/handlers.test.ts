import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { insightsHandler } from "./handlers";

vi.mock("./api");

function parseResult(result: { content?: Array<{ text?: string }> }) {
  return JSON.parse(result.content?.[0]?.text ?? "{}");
}

const baseArgs = {
  entityType: "keyset" as const,
  entityId: "sub-c-test",
  period: "daily" as const,
  fromDate: "2026-04-01",
  toDate: "2026-04-07",
};

describe("insightsHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("endpoint routing", () => {
    it("routes regular metrics through queryInsights", async () => {
      const mockResult = {
        metric: "unique_channels",
        data: [{ timestamp: "2026-04-01T00:00:00Z", value: 42 }],
      };
      vi.mocked(api.queryInsights).mockResolvedValue(mockResult);

      const result = await insightsHandler({
        ...baseArgs,
        metric: "unique_channels",
      });

      expect(api.queryInsights).toHaveBeenCalledWith(
        expect.objectContaining({ metric: "unique_channels", entityType: "keyset" })
      );
      expect(result.isError).toBeFalsy();
      expect(parseResult(result)).toEqual(mockResult);
    });

    it("routes top metrics through queryInsights", async () => {
      const mockResult = {
        metric: "top_20_channels",
        category: "by_messages",
        data: [{ name: "channel-a", count: 100 }],
      };
      vi.mocked(api.queryInsights).mockResolvedValue(mockResult);

      const result = await insightsHandler({
        ...baseArgs,
        metric: "top_20_channels",
        category: "by_messages",
      });

      expect(api.queryInsights).toHaveBeenCalledWith(
        expect.objectContaining({
          metric: "top_20_channels",
          category: "by_messages",
        })
      );
      expect(parseResult(result)).toEqual(mockResult);
    });

    it("routes top duration metrics through queryInsights", async () => {
      vi.mocked(api.queryInsights).mockResolvedValue({ data: [] });

      await insightsHandler({
        ...baseArgs,
        metric: "top_20_channels_with_user_duration",
        period: "hourly",
        category: "by_messages",
      });

      expect(api.queryInsights).toHaveBeenCalledWith(
        expect.objectContaining({
          metric: "top_20_channels_with_user_duration",
          period: "hourly",
        })
      );
    });
  });

  describe("query parameter forwarding", () => {
    it("forwards optional params when provided", async () => {
      vi.mocked(api.queryInsights).mockResolvedValue({ data: [] });

      await insightsHandler({
        ...baseArgs,
        metric: "top_1000_channels",
        category: "by_messages",
        filters: '{"top_1000_channels":[{"field":"count_messages","operator":"gt","value":5000}]}',
        orderBy: "count_messages:desc",
        limit: 50,
      });

      expect(api.queryInsights).toHaveBeenCalledWith(
        expect.objectContaining({
          filters:
            '{"top_1000_channels":[{"field":"count_messages","operator":"gt","value":5000}]}',
          orderBy: "count_messages:desc",
          limit: 50,
        })
      );
    });

    it("forwards filter for channel_patterns without filters", async () => {
      vi.mocked(api.queryInsights).mockResolvedValue({ data: [] });

      await insightsHandler({
        ...baseArgs,
        metric: "channel_patterns",
        filter: "startsWith:group.",
      });

      expect(api.queryInsights).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: "startsWith:group.",
        })
      );
      expect(vi.mocked(api.queryInsights).mock.calls[0][0]).not.toHaveProperty("filters");
    });

    it("forwards user filters unchanged", async () => {
      const filters =
        '{"top_1000_users":[{"field":"uuid","operator":"startsWith","value":"system"}]}';
      vi.mocked(api.queryInsights).mockResolvedValue({ data: [] });

      await insightsHandler({
        ...baseArgs,
        metric: "top_1000_users",
        category: "by_messages",
        filters,
      });

      expect(api.queryInsights).toHaveBeenCalledWith(expect.objectContaining({ filters }));
    });
  });

  describe("period validation", () => {
    it("rejects top_20_channels with period=weekly", async () => {
      const result = await insightsHandler({
        ...baseArgs,
        metric: "top_20_channels",
        period: "weekly",
        category: "by_messages",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(/period.*weekly/i);
    });

    it("rejects top_20_channels with period=monthly", async () => {
      const result = await insightsHandler({
        ...baseArgs,
        metric: "top_20_channels",
        period: "monthly",
        category: "by_messages",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(/period.*monthly/i);
    });

    it("rejects avg_user_duration with period=daily", async () => {
      const result = await insightsHandler({
        ...baseArgs,
        metric: "avg_user_duration",
        period: "daily",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(/period.*daily/i);
    });

    it("rejects new_vs_recurring_users with period=hourly", async () => {
      const result = await insightsHandler({
        ...baseArgs,
        metric: "new_vs_recurring_users",
        period: "hourly",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(/period.*hourly/i);
    });
  });

  describe("category requirement", () => {
    it("rejects top_20_channels without category", async () => {
      const result = await insightsHandler({
        ...baseArgs,
        metric: "top_20_channels",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(/category/i);
    });

    it("rejects top_20_users without category", async () => {
      const result = await insightsHandler({
        ...baseArgs,
        metric: "top_20_users",
      });

      expect(api.queryInsights).not.toHaveBeenCalled();
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(/category/i);
    });

    it("allows non-top metrics without category", async () => {
      vi.mocked(api.queryInsights).mockResolvedValue({ data: [] });

      const result = await insightsHandler({
        ...baseArgs,
        metric: "unique_channels",
      });

      expect(api.queryInsights).toHaveBeenCalled();
      expect(result.isError).toBeFalsy();
    });
  });

  describe("upstream error paths", () => {
    it.each([
      ["401", "HTTP 401: unauthorized"],
      ["403", "HTTP 403: insights premium required"],
      ["400", "HTTP 400: invalid date format"],
      ["429", "HTTP 429: rate limited"],
    ])("surfaces %s responses", async (_status, message) => {
      vi.mocked(api.queryInsights).mockRejectedValue(new Error(message));

      const result = await insightsHandler({
        ...baseArgs,
        metric: "unique_channels",
      });

      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toMatch(new RegExp(_status));
    });
  });
});
