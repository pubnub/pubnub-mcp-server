import { createLogger } from "../logger";
import { createResponse, parseError } from "../utils.js";
import { queryInsights } from "./api.js";
import {
  type InsightsSchemaType,
  METRIC_PERIODS,
  TOP_METRICS_REQUIRING_CATEGORY,
} from "./types.js";

const log = createLogger("insights:handlers");

export async function insightsHandler(args: InsightsSchemaType) {
  try {
    log.debug({ metric: args.metric, entityType: args.entityType }, "Handling Insights request");

    const allowedPeriods = METRIC_PERIODS[args.metric];
    if (allowedPeriods && !allowedPeriods.includes(args.period)) {
      return createResponse(
        `Metric "${args.metric}" does not support period="${args.period}". ` +
          `Allowed periods: ${allowedPeriods.join(", ")}.`,
        true
      );
    }

    if (TOP_METRICS_REQUIRING_CATEGORY.has(args.metric) && !args.category) {
      return createResponse(
        `Metric "${args.metric}" requires the category parameter. ` +
          "Valid categories: by_messages, by_chats, by_subscribers, by_users_with_messages, " +
          "by_users_with_chats, by_subscribed_channels, all.",
        true
      );
    }

    const result = await queryInsights(args);
    return createResponse(JSON.stringify(result));
  } catch (e) {
    log.error({ err: e, metric: args.metric }, "Insights query failed");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
