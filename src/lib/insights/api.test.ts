import { HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { overrideAdminApiRoute } from "../../test-utils/msw-overrides";
import { clearTestEnv, setupTestEnv } from "../../test-utils/msw-setup";
import { mockInsightsResult, mockInsightsTopResult } from "../../test-utils/test-fixtures";
import { queryInsights } from "./api";

vi.mock("../oauth", () => ({
  getOAuthToken: vi.fn(() => "mock-oauth-token"),
}));

describe("Insights API", () => {
  beforeEach(() => {
    setupTestEnv();
  });

  afterEach(() => {
    clearTestEnv();
  });

  describe("queryInsights", () => {
    it("GETs /v2/insights for regular metrics", async () => {
      const result = await queryInsights({
        entityType: "keyset",
        entityId: "sub-c-test",
        metric: "unique_channels",
        period: "daily",
        fromDate: "2026-04-01",
        toDate: "2026-04-07",
      });

      expect(result).toEqual(mockInsightsResult);
    });

    it("GETs /v2/insights/top for top metrics", async () => {
      const result = await queryInsights({
        entityType: "keyset",
        entityId: "sub-c-test",
        metric: "top_20_channels",
        period: "daily",
        fromDate: "2026-04-01",
        toDate: "2026-04-07",
        category: "by_messages",
      });

      expect(result).toEqual(mockInsightsTopResult);
    });

    it("throws Error with HTTP status for non-ok responses", async () => {
      overrideAdminApiRoute("get", "/v2/insights", () => {
        return HttpResponse.text("Bad Request: invalid metric", { status: 400 });
      });

      await expect(
        queryInsights({
          entityType: "keyset",
          entityId: "sub-c-test",
          metric: "unique_channels",
          period: "daily",
          fromDate: "2026-04-01",
          toDate: "2026-04-07",
        })
      ).rejects.toThrow("HTTP 400: Bad Request: invalid metric");
    });

    it("throws Error when unknown metric is provided", async () => {
      await expect(
        queryInsights({
          entityType: "keyset",
          entityId: "sub-c-test",
          metric: "nonexistent_metric" as never,
          period: "daily",
          fromDate: "2026-04-01",
          toDate: "2026-04-07",
        })
      ).rejects.toThrow("Unknown metric: nonexistent_metric");
    });

    it("returns { success: true } for 204 responses", async () => {
      overrideAdminApiRoute("get", "/v2/insights", () => {
        return new HttpResponse(null, { status: 204 });
      });

      const result = await queryInsights({
        entityType: "keyset",
        entityId: "sub-c-test",
        metric: "unique_channels",
        period: "daily",
        fromDate: "2026-04-01",
        toDate: "2026-04-07",
      });

      expect(result).toEqual({ success: true });
    });
  });
});
