import { z } from "zod";

export const InsightsSchema = z.object({
  entityType: z
    .enum(["account", "app", "keyset"])
    .describe(
      "The type of entity to fetch metrics for: 'account', 'app', or 'keyset'. Use 'keyset' with a subscribe key as entityId for keyset-scoped queries."
    ),

  entityId: z
    .string()
    .describe(
      "The ID of the entity. For entityType='account': numeric account ID. For 'app': numeric app ID. For 'keyset': the subscribe key (sub-c-...)."
    ),

  metric: z
    .enum([
      "unique_channels",
      "unique_channels_combination",
      "percent_unique_channels_with_messages",
      "channel_patterns",
      "top_20_channels",
      "top_1000_channels",
      "unique_users",
      "unique_users_combination",
      "percent_unique_users_with_messages",
      "new_vs_recurring_users",
      "unique_users_by_country",
      "top_20_users",
      "top_1000_users",
      "messages",
      "top_10_message_types",
      "message_by_country",
      "avg_user_duration",
      "unique_users_by_duration_timeframe",
      "top_20_channels_with_user_duration",
      "top_1000_channels_with_user_duration",
      "publishes_by_device_type",
      "subscribers_by_device_type",
      "unique_users_by_device_type",
    ])
    .describe(
      "Insights metric to query. Top metrics (top_20_*, top_1000_*) route to /v2/insights/top automatically and require the `category` parameter. Duration metrics (avg_user_duration, unique_users_by_duration_timeframe, top_*_channels_with_user_duration) only support period=hourly. new_vs_recurring_users does NOT support period=hourly. See Period Restrictions table in the how-to guide for the full matrix."
    ),

  period: z
    .enum(["hourly", "daily", "weekly", "monthly"])
    .describe(
      "Time grain. Default to `daily` for most queries. Use `hourly` for intra-day or duration metrics. `weekly` and `monthly` are not supported by top-N metrics, country breakdowns, or some other categories."
    ),

  fromDate: z.string().describe("Start date (inclusive) in YYYY-MM-DD format, UTC."),

  toDate: z.string().describe("End date (inclusive) in YYYY-MM-DD format, UTC."),

  category: z
    .enum([
      "by_messages",
      "by_chats",
      "by_subscribers",
      "by_users_with_messages",
      "by_users_with_chats",
      "by_subscribed_channels",
      "all",
    ])
    .optional()
    .describe(
      "Required ONLY for top metrics (top_20_*, top_1000_*). Picks the ranking dimension. by_subscribers, by_users_with_messages, by_users_with_chats apply to channel rankings only. by_subscribed_channels applies to user rankings only. Use `all` for combined results."
    ),

  filter: z
    .string()
    .optional()
    .describe(
      "Filter expression for metric=channel_patterns only (`startsWith:group.` or `eq:lobby`). Do not use for top metrics — use `filters` instead."
    ),

  filters: z
    .string()
    .optional()
    .describe(
      'JSON object for top metrics on /v2/insights/top. Top-level key must match `metric` (e.g. top_1000_channels). Value is an array of {field, operator, value} conditions combined with AND. Operators: eq, neq, gt, lt, gte, lte, in, nin, startsWith. See how_to(slug="how-to-query-insights-filters").'
    ),

  orderBy: z
    .string()
    .optional()
    .describe(
      "Sort field and direction (e.g. `count_messages:desc`). Optional — most metrics default to a sensible ordering."
    ),

  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      "Number of results to return. Optional — top metrics already cap at 20 or 1000 by name."
    ),
});
