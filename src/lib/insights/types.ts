import type { z } from "zod";
import type { InsightsSchema } from "./schemas.js";

export type InsightsSchemaType = z.infer<typeof InsightsSchema>;

export const METRIC_ENDPOINT: Record<string, "insights" | "insights/top"> = {
  top_20_channels: "insights/top",
  top_1000_channels: "insights/top",
  top_20_users: "insights/top",
  top_1000_users: "insights/top",
  top_10_message_types: "insights/top",
  top_20_channels_with_user_duration: "insights/top",
  top_1000_channels_with_user_duration: "insights/top",
  unique_channels: "insights",
  unique_channels_combination: "insights",
  percent_unique_channels_with_messages: "insights",
  channel_patterns: "insights",
  unique_users: "insights",
  unique_users_combination: "insights",
  percent_unique_users_with_messages: "insights",
  new_vs_recurring_users: "insights",
  unique_users_by_country: "insights",
  messages: "insights",
  message_by_country: "insights",
  avg_user_duration: "insights",
  unique_users_by_duration_timeframe: "insights",
  publishes_by_device_type: "insights",
  subscribers_by_device_type: "insights",
  unique_users_by_device_type: "insights",
};

export const METRIC_PERIODS: Record<
  string,
  ReadonlyArray<"hourly" | "daily" | "weekly" | "monthly">
> = {
  avg_user_duration: ["hourly"],
  unique_users_by_duration_timeframe: ["hourly"],
  top_20_channels_with_user_duration: ["hourly"],
  top_1000_channels_with_user_duration: ["hourly"],
  top_20_channels: ["hourly", "daily"],
  top_1000_channels: ["hourly", "daily"],
  top_20_users: ["hourly", "daily"],
  top_1000_users: ["hourly", "daily"],
  top_10_message_types: ["hourly", "daily"],
  unique_users_by_country: ["hourly", "daily"],
  message_by_country: ["hourly", "daily"],
  new_vs_recurring_users: ["daily", "weekly", "monthly"],
  unique_channels: ["hourly", "daily", "weekly", "monthly"],
  unique_channels_combination: ["hourly", "daily", "weekly", "monthly"],
  percent_unique_channels_with_messages: ["hourly", "daily", "weekly", "monthly"],
  channel_patterns: ["hourly", "daily", "weekly", "monthly"],
  unique_users: ["hourly", "daily", "weekly", "monthly"],
  unique_users_combination: ["hourly", "daily", "weekly", "monthly"],
  percent_unique_users_with_messages: ["hourly", "daily", "weekly", "monthly"],
  messages: ["hourly", "daily", "weekly", "monthly"],
  publishes_by_device_type: ["hourly", "daily", "weekly", "monthly"],
  subscribers_by_device_type: ["hourly", "daily", "weekly", "monthly"],
  unique_users_by_device_type: ["hourly", "daily", "weekly", "monthly"],
};

export const TOP_METRICS_REQUIRING_CATEGORY: ReadonlySet<string> = new Set([
  "top_20_channels",
  "top_1000_channels",
  "top_20_users",
  "top_1000_users",
  "top_20_channels_with_user_duration",
  "top_1000_channels_with_user_duration",
]);
