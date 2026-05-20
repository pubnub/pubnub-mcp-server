const generateHandler = (text: string) => {
  return () => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text,
        },
      },
    ],
  });
};

const hipaaChatShort = {
  name: "hipaa-chat-short",
  definition: {
    title: "Create a HIPAA Compliant Chat app",
    description:
      "Example of how to prompt PubNub MCP to create a HIPAA compliant chat application - short version",
  },
  handler: generateHandler(
    "Act as a senior software engineer and use PubNub MCP server to create a chat application for healthcare that is HIPAA compliant."
  ),
};

const hipaaChatLong = {
  name: "hipaa-chat-long",
  definition: {
    title: "Create a HIPAA Compliant Chat app",
    description:
      "Example of how to prompt PubNub MCP to create a HIPAA compliant chat application - long version",
  },
  handler: generateHandler(
    "Act as a senior software engineer and use PubNub MCP server to create a chat application for healthcare that is HIPAA compliant, with Pub/Sub messaging for real-time chat, Presence for patient/doctor availability, and App Context for roles."
  ),
};

const reactAppShort = {
  name: "react-app-short",
  definition: {
    title: "Scaffold React App with PubNub",
    description:
      "Example of how to scaffold a React application with PubNub Pub/Sub and Presence - short version",
  },
  handler: generateHandler(
    "Act as a frontend developer and use PubNub MCP server to scaffold a React app with Pub/Sub messaging and Presence."
  ),
};

const reactAppLong = {
  name: "react-app-long",
  definition: {
    title: "Scaffold React App with PubNub",
    description:
      "Example of how to scaffold a React application with PubNub Pub/Sub and Presence - long version",
  },
  handler: generateHandler(
    "Act as a frontend developer and use PubNub MCP server to scaffo ld a React app with Pub/Sub messaging for real-time updates, Presence to show when users are online or typing, and App Context to handle user metadata. Include sample React components for subscribing to a channel, publishing messages, and displaying presence indicators for active participants."
  ),
};

const gamelobbyShort = {
  name: "gamelobby-short",
  definition: {
    title: "Build Multiplayer Game Lobby",
    description:
      "Example of how to build a multiplayer game lobby with chat and presence - short version",
  },
  handler: generateHandler(
    "Act as a game developer and use PubNub MCP server to build a multiplayer lobby with chat and Presence indicators."
  ),
};

const gamelobbyLong = {
  name: "gamelobby-long",
  definition: {
    title: "Build Multiplayer Game Lobby",
    description:
      "Example of how to build a multiplayer game lobby with chat and presence - long version",
  },
  handler: generateHandler(
    "As a game developer, use PubNub MCP server to build a multiplayer game lobby that supports real-time chat using Pub/Sub, Presence for tracking when players come online or leave, and App Context for managing team assignments (e.g., red vs. blue team)."
  ),
};

const oemClientManagement = {
  name: "oem-client-management",
  definition: {
    title: "OEM Client Management",
    description: "Example of how to create apps and configure keysets for OEM clients",
  },
  handler: generateHandler(
    "[OEM (building resources used by someone else)] As a developer, use PubNub MCP to create a new app, configure and assign keysets to clients."
  ),
};

const multiTenantOnboardingShort = {
  name: "multi-tenant-onboarding-short",
  definition: {
    title: "Implement Multi-Tenant Onboarding",
    description:
      "Example of how to implement automated tenant onboarding for multi-tenant applications - short version",
  },
  handler: generateHandler(
    "[OEM] Act as a senior developer and use PubNub MCP server to implement automated tenant onboarding for a multi-tenant chat application in SaaS or healthcare industries."
  ),
};

const multiTenantOnboardingLong = {
  name: "multi-tenant-onboarding-long",
  definition: {
    title: "Implement Multi-Tenant Onboarding",
    description:
      "Example of how to implement automated tenant onboarding for multi-tenant applications - long version",
  },
  handler: generateHandler(
    "Act as a senior developer and use PubNub MCP (which leverages Admin API for Keysets and Usage & Monitoring) to implement a multi-tenant chat application with automated tenant onboarding. The tenant Application will use: pubsub, History, App-Context, Presence For every new tenant or end-customer the application should: Create a new App (if required by your OEM model). Create and configure a new Keyset to ensure data isolation Make sure publish and subscribe keys are properly retrieved and propagated to the tenant's application as configuration variables The implementation should be fully automated, idempotent, and include error handling, and retries."
  ),
};

const illuminateSpamDetection = {
  name: "illuminate-spam-detection",
  definition: {
    title: "Set Up Illuminate Spam Detection",
    description:
      "Guided setup of a complete Illuminate spam detection pipeline (message flooding and cross-posting)",
  },
  handler: generateHandler(
    "Act as a community moderator and use PubNub MCP to set up Illuminate spam detection. Start by asking: Is the concern chat flooding (one user sending too many messages in one channel), cross-posting (the same message sent to many channels), or both? For each pattern, copy the Illuminate Query Builder predefined template — do NOT invent custom query logic when a template fits. There is no programmatic 'create from template' helper; instead, list existing queries with `manage_illuminate {resource:'query', operation:'list'}`, find one tagged `meta.template: 'spam_cross_posting'` (or `'topn'` / `'advanced'`), GET it to read its pipeline shape, then create a new query with that pipeline shape adapted to the user's BO field UUIDs. First check whether a Chat-spam-shaped Business Object already exists on this keyset (typical fields: user, channel, message, message_type — these are commonly auto-provisioned when the PubNub Chat SDK is in use, so list BOs first; if a matching one is present, reuse it; only create a new BO if no suitable one exists, and ask the user to confirm field shapes if creating). Before creating anything, describe the detection approach in 1–2 sentences in plain English. Then show an escalating decision table with three severity rows: Low → notify moderator (quiet alert); Medium → notify + mute user in channel; High → notify + mute + ban user from channel. The mute/ban actions use `actionType: APPCONTEXT_SET_MEMBERSHIP_METADATA` with the appropriate operations array (see existing 'Decision for Cross Posting' in the account for shape); the notify action uses `actionType: PUBNUB_PUBLISH` to a moderation channel or `actionType: WEBHOOK_EXECUTION` to an external endpoint. Ask the user to confirm: (a) the time window (default: 60 seconds), (b) the message count or channel count thresholds for each severity level, and (c) which actions to enable per row. After confirmation: create the Business Object if not already active, copy the Query Builder template's pipeline shape into a new query, then create the Decision with the confirmed escalating rules and activate. CRITICAL for QUERY-sourced decisions: every inputFields[].name must exactly match the source query's output field alias (run get-fields on the query first; common aliases are 'user', 'channel', 'message_count', 'channel_count'). The handler now blocks name mismatches pre-flight, but using the right names from the start avoids the round-trip. Publish fake test data to verify the Decision fires correctly — use scenario:'chat-flooding' (count=20, single user/channel) for flooding rules and scenario:'cross-posting' (count=15, single user across channels) for cross-post rules. NOTE: if the keyset has Access Manager enabled, also pass `secret_key` (the keyset's secret key from Admin Portal → Keysets) — without it the publish returns a 403. Show the action log (per-decision endpoint; loop if multiple) to confirm fires."
  ),
};

const illuminateRewardEngagement = {
  name: "illuminate-reward-engagement",
  definition: {
    title: "Reward Engagement in Live Events",
    description:
      "Guided setup of an Illuminate engagement reward pipeline for live events and gaming",
  },
  handler: generateHandler(
    "Act as a live events manager and use PubNub MCP to set up Illuminate engagement rewards. Start by asking which participation behaviors to reward: poll answers, chat messages, reactions, or re-engaging low-engagement users (or a combination). For ranking rewards (Top N most chatty, Top N by reactions, Bottom N by engagement), copy the predefined Illuminate Query Builder template instead of inventing custom ranking logic. There is no programmatic 'create from template' helper; instead, list existing queries with `manage_illuminate {resource:'query', operation:'list'}`, find one tagged `meta.template: 'topn'`, GET it to read the pipeline shape, then create a new query with that pipeline shape adapted to the user's BO fields. For Bottom N (re-engagement), use the same topn template but reverse the orderBy direction (DESC -> ASC) on the count field. Before creating anything, describe the reward approach in 1–2 sentences in plain English. Then show a decision table: Poll answered → reward points or badge; Top N most chatty → Incentive A; Top N by reactions → Incentive B; Bottom N by engagement → Incentive C (re-engagement nudge). Ask the user to confirm: (a) which rows to enable, (b) the reward or incentive for each, (c) the evaluation window, and (d) a per-rule rate limit (default: once per day per user) to prevent duplicate rewards — translate this to `executionLimitType: 'ONCE_PER_INTERVAL_PER_CONDITION_GROUP'`, `executionLimitIntervalInSeconds: 86400`, and `executionLimitInputFieldIds: ['user']` (or the equivalent input field name on the decision; the handler resolves names to UUIDs automatically). After confirmation: create the Business Object capturing poll, chat, and reaction events (fields: user, channel, event_type). PRECHECK: list existing decisions and count those with sourceType='METRIC' — the account is hard-limited to 3 such decisions. If creating multiple per-behavior reward rules would push past the limit, consolidate them into multi-rule single decisions where possible. Create COUNT metrics — one per behavior being measured. Create a Dashboard with an engagement trend chart and active vs inactive user breakdown. Create the Decision(s) with the confirmed rules and rate limits, and activate. CRITICAL for QUERY-sourced ranking decisions (Top N / Bottom N): every inputFields[].name must exactly match the source query's output field alias (run get-fields on the query first; topn aliases are typically 'user', 'channel', 'message_count', 'rank_in_channel'). The handler now blocks name mismatches pre-flight, but using the right names from the start avoids the round-trip. Optionally: if the user wants an engagement drop alert, add a rule on the Chat Message Count metric using `operation: 'NUMERIC_LESS_THAN'` with the chosen threshold and an action that notifies moderators (PUBNUB_PUBLISH or WEBHOOK_EXECUTION). Publish fake test data with publish-fake-data (use scenario:'generic' with count=20 to spread events across users) to verify rewards fire correctly. NOTE: if the keyset has Access Manager enabled, also pass `secret_key` (the keyset's secret key from Admin Portal → Keysets) — without it the publish returns a 403. Show the action log per Decision (loop over decisions if more than one) to confirm."
  ),
};

const illuminateUseCase = {
  name: "illuminate-use-case",
  definition: {
    title: "Set Up an Illuminate Use Case",
    description: "Guided setup of a new Illuminate analytics and automation use case",
  },
  handler: generateHandler(
    "Act as a product manager and use PubNub MCP to set up a complete Illuminate use case. Follow this guided flow: Step 0 — Identify the goal. Ask: (1) What outcome do you want? Choose from: reward and incentivize desired behavior (e.g. most engaged users, high spenders, poll participants); prevent spam or abuse; alert when operational metrics like wait time or failure rates exceed normal; or automate live event or auction actions. (2) What should Illuminate do when the condition is met? Options: notify via webhook or channel message, reward or badge a user, mute or moderate a user, or trigger an external workflow. (3) How quickly should it react? Immediately on each event, near real-time every 1–5 minutes, or trend-based every 10–60 minutes. Step 1 — Choose the simplest implementation path: if the goal is spam (flooding or cross-posting) or ranking (Top N / Bottom N), start from a Query Builder template by listing existing queries with `manage_illuminate {resource:'query', operation:'list'}`, finding one with the matching `meta.template` tag (e.g. 'spam_cross_posting' or 'topn'), GET it to read its pipeline shape, then create a new query with that pipeline shape adapted to the user's BO field UUIDs (no programmatic 'create from template' helper exists — copy the shape). Otherwise use Metrics + Dashboard + Decision. Step 2 — Confirm data. Ask for one of: a sample event (JSON), a list of fields already in the payload, or where the data currently lives. Step 3 — Preview before building. Describe the automation in 1–2 sentences in plain English. Present the decision logic as a conditions → actions table with one rule per row. Ask for confirmation and threshold adjustments before creating any Illuminate resources. Step 4 — Build: create the Business Object (or confirm the existing one is active), create 1–3 Metrics for KPI visibility and tuning, create a Dashboard chart, then create and activate the Decision using the confirmed thresholds. PRECHECK: list existing decisions and count how many have sourceType='METRIC' — the account is hard-limited to 3 such decisions; if already at 3, either delete one or consolidate behaviors into multi-rule single decisions before creating more. CRITICAL for QUERY-sourced decisions: every inputFields[].name must exactly match the source query's output field alias (run get-fields on the query first and use those exact aliases — case-sensitive). Mismatched names cause the decision to silently never fire; the handler now blocks this pre-flight, but using the right names from the start avoids the round-trip. Step 5 — Validate: publish fake test data, check the dashboard and action log, and suggest threshold or rate-limit adjustments based on results. NOTE: if the keyset has Access Manager enabled, also pass `secret_key` (the keyset's secret key from Admin Portal → Keysets) to publish-fake-data — without it the publish returns a 403 with an actionable error pointing at the same fix."
  ),
};

const illuminateTestVerify = {
  name: "illuminate-test-verify",
  definition: {
    title: "Test and Verify Illuminate Setup",
    description:
      "Step-by-step test and verification workflow for an existing Illuminate configuration",
  },
  handler: generateHandler(
    "Act as a developer and use PubNub MCP to test and verify my existing Illuminate setup. 1. List all Business Objects and confirm the relevant one is active (isActive=true; if false, activate it before continuing). 2. Publish a small set of fake test messages (generic scenario, count=5) using publish-fake-data. NOTE: if the keyset has Access Manager enabled, also pass `secret_key` (the keyset's secret key from Admin Portal → Keysets) — without it the publish returns a 403; the tool will surface the AM error with the same fix suggestion. Wait 30 seconds for Illuminate ingestion. 3. Run a field-health query — flag any fields with populated=0 or with `sampleValues` containing only empty strings as potential JSONPath mismatches (every jsonPath should start with `$.message.body.`). On a brand-new BO, field-health is only meaningful AFTER step 2's publish has been ingested, which is why it follows the publish here. 4. Run a raw-snapshot query (limit=10) to confirm messages are being captured with the right shape. 5. List all saved queries; for any used as a Decision source, run verify-query to confirm the query returns rows for the time window it covers (an empty result here is the most common reason a QUERY decision doesn't fire). 6. List all decisions, filter to enabled=true, then for EACH active Decision call check-action-log (the endpoint is per-decision; loop over them). Report fires per decision over the last hour. Report any issues found and suggest fixes. If a QUERY-sourced Decision shows zero fires despite verify-query returning matching rows, check that every inputFields[].name on the Decision exactly matches a query output alias from get-fields (case-sensitive) — silent name mismatches are the #1 cause. If Decisions are firing too frequently or not at all, suggest adjustments to time window, thresholds, filters, and execution rate limits (executionLimitType, executionLimitIntervalInSeconds, executionLimitInputFieldIds)."
  ),
};

// ─── Insights prompts ────────────────────────────────────────────────────────

const insightsSnapshot = {
  name: "insights-snapshot",
  definition: {
    title: "Insights Account Snapshot",
    description:
      "Quick high-level analytics snapshot for a date range — unique channels, unique users, message volume, and top channels",
  },
  handler: generateHandler(
    'Act as an analytics engineer and use PubNub MCP to produce an Insights snapshot. Step 0 — Confirm inputs: (1) the entity to query (entityType: account, app, or keyset, and the corresponding entityId — for keyset use the subscribe key), (2) the date range (default: last 7 days, YYYY-MM-DD in UTC), and (3) the time grain (default: daily). If the user encounters an authentication error, ensure OAuth is configured and point them to the how-to guide for getting Insights API access. Step 1 — Use the `insights` tool to query four metrics in parallel for the confirmed date range and grain: `unique_channels`, `unique_users`, `messages`, and `top_20_channels` with `category=by_messages`. Note that `top_20_channels` requires `period=hourly` or `period=daily` only — never `weekly` or `monthly`. Step 2 — Present the results in this order: (a) a one-line headline with the date range and the trend in unique users (e.g. "+12% week-over-week"), (b) a table of daily unique users / unique channels / messages, (c) the top 20 channels by message volume with their counts. Step 3 — Call out anomalies: any day with more than ±30% deviation from the period average, any channel that appears in the top 20 with more than 50% of total volume, or any drop in unique users greater than 20% day-over-day. Step 4 — Suggest 2–3 follow-up queries the user might want to run (e.g. "Want to see new vs recurring user breakdown?" or "Want to see the top message types?"). Always include the date range and timezone (UTC) in the response so the user has unambiguous framing.'
  ),
};

const insightsChannelAnalysis = {
  name: "insights-channel-analysis",
  definition: {
    title: "Analyze Top Channels",
    description:
      "Deep dive into top channels by category, channel patterns, and channel engagement",
  },
  handler: generateHandler(
    'Act as a product analyst and use PubNub MCP to analyze top channels in detail. Step 0 — Confirm inputs: (1) the entity to query (entityType: account, app, or keyset, and the corresponding entityId), (2) date range (default: last 7 days, YYYY-MM-DD in UTC), (3) time grain (`hourly` or `daily` only — top metrics do not support weekly or monthly), and (4) which ranking categories to include (default: `by_messages`, `by_subscribers`, and `by_users_with_messages`). Step 1 — Use the `insights` tool to query `top_20_channels` for each requested category. Step 2 — Cross-reference the rankings: list channels that appear in all three categories (high engagement and high reach), channels that have many messages but few subscribers (chatty but small), and channels that have many subscribers but few messages (broadcast-style). Step 3 — If the user asks about a channel naming pattern (e.g. "channels starting with team." or "all room.* channels"), use the `channel_patterns` metric with a `filter=startsWith:` expression instead of post-filtering top-N results. Step 4 — Optionally query `unique_channels_combination` to show overlap between message-publishing channels and chat-publishing channels, and `percent_unique_channels_with_messages` to show how many of the entity\'s channels actually had messages in the period. Step 5 — Present results as: (a) a unified ranking table with all categories side-by-side, (b) the cross-category insights from step 2, (c) any pattern-based subtotals from step 3, and (d) 2–3 follow-up actions (e.g. "Want to look at user duration on these channels?"). Important: top-N counts cannot be summed across periods — when showing daily rankings, present one ranking per day rather than aggregating.'
  ),
};

const insightsUserGrowth = {
  name: "insights-user-growth",
  definition: {
    title: "Track User Growth",
    description: "New vs recurring users, daily/weekly/monthly trends, and geographic distribution",
  },
  handler: generateHandler(
    'Act as a growth analyst and use PubNub MCP to track user growth. Step 0 — Confirm inputs: (1) the entity to query (entityType: account, app, or keyset, and the corresponding entityId), (2) date range (default: last 30 days, YYYY-MM-DD in UTC), and (3) trend grain (`daily`, `weekly`, or `monthly` — note that `new_vs_recurring_users` does NOT support `hourly`). Step 1 — Use the `insights` tool to query in parallel: `unique_users` for the chosen grain, `new_vs_recurring_users` for the chosen grain, and `unique_users_by_country` (which only supports `hourly` or `daily`). Step 2 — Compute and present: (a) the headline week-over-week or month-over-month change in unique users, (b) the new-user count and the recurring-user count per period with a small chart-style table, (c) the new-to-recurring ratio (a healthy product typically has 20–40% new users in any given period), and (d) the top 10 countries by unique user count from `unique_users_by_country`. Step 3 — Call out: any period where new users dropped more than 30% from the prior period (acquisition issue), any period where recurring users dropped more than 20% (retention issue), and any geography that suddenly appears or disappears in the top 10 (potential market change or fraud). Step 4 — Optionally query `top_20_users` with `category=by_messages` to identify your most active users (whales), and `percent_unique_users_with_messages` to show the publish-vs-subscribe-only user split. Step 5 — Suggest 2–3 follow-up queries (e.g. "Want to see what channels new users are joining?"). Always frame results with the date range and UTC timezone.'
  ),
};

const insightsEngagementDeepDive = {
  name: "insights-engagement-deep-dive",
  definition: {
    title: "Engagement and Device Deep Dive",
    description:
      "Average user duration, duration buckets, and device-type breakdown of publishes, subscribers, and unique users",
  },
  handler: generateHandler(
    'Act as a product analyst and use PubNub MCP to do an engagement and device deep dive. Step 0 — Confirm inputs: (1) the entity to query (entityType: account, app, or keyset, and the corresponding entityId), (2) date range (default: last 24 hours for duration metrics, last 7 days for device metrics, YYYY-MM-DD in UTC), (3) for duration metrics, use `period=hourly` (the ONLY supported period for duration). For device metrics, use `period=daily` by default. Step 1 — Use the `insights` tool to query duration metrics: `avg_user_duration` (hourly), `unique_users_by_duration_timeframe` (hourly — bucketizes users by session length), and `top_20_channels_with_user_duration` (hourly, top channels ranked by total user time spent). Step 2 — Use the `insights` tool to query device metrics: `publishes_by_device_type`, `subscribers_by_device_type`, and `unique_users_by_device_type`. Step 3 — Present results in this order: (a) average user duration trend across the chosen window, (b) duration bucket histogram (e.g. < 1 min, 1–5 min, 5–30 min, 30+ min), (c) top 20 channels ranked by total user-minutes, (d) device-type table with publishes / subscribers / unique users side-by-side and percent share for each device type. Step 4 — Insight callouts: channels with high user-duration but low message volume (lurker / read-only channels), unusual device-mix shifts (e.g. mobile share dropping or web share spiking week-over-week), and the channel with the highest engagement-per-user ratio (total duration / unique users). Step 5 — Suggest 2–3 follow-up queries (e.g. "Want to see device split for top channels only?"). Always frame results with the time window and UTC timezone, and remind the user that duration metrics are only available at hourly grain.'
  ),
};

export const prompts = [
  hipaaChatShort,
  hipaaChatLong,
  reactAppShort,
  reactAppLong,
  gamelobbyShort,
  gamelobbyLong,
  oemClientManagement,
  multiTenantOnboardingShort,
  multiTenantOnboardingLong,
  illuminateSpamDetection,
  illuminateRewardEngagement,
  illuminateUseCase,
  illuminateTestVerify,
  insightsSnapshot,
  insightsChannelAnalysis,
  insightsUserGrowth,
  insightsEngagementDeepDive,
];
