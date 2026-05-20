import { z } from "zod";

export const ManageIlluminateSchema = z.object({
  resource: z
    .enum(["business-object", "metric", "query", "decision", "dashboard"])
    .optional()
    .describe(
      "The Illuminate resource type to operate on. " +
        "business-object: the data schema that maps JSONPath fields from PubNub messages. " +
        "metric: aggregations (COUNT, SUM, AVG, MIN, MAX) over a Business Object field. " +
        "query: flexible data pipeline (sources → transforms → output). " +
        "decision: automation rule that evaluates conditions and fires actions. " +
        "dashboard: visualisation of metrics with optional decision trigger overlay."
    ),

  operation: z
    .enum([
      "list",
      "get",
      "create",
      "update",
      "delete",
      "activate",
      "deactivate",
      "get-fields",
      "execute-adhoc",
      "publish-fake-data",
      "verify-query",
      "check-action-log",
      "raw-snapshot",
      "aggregate",
      "field-health",
      "custom-query",
    ])
    .describe(
      "Operation to perform. " +
        "list: GET all resources of this type. " +
        "get: GET one resource by id. " +
        "create: POST a new resource. Decision create runs a 2-step POST→PUT workflow automatically. " +
        "update: PUT/replace a resource (decisions and dashboards are FULL replacements). " +
        "delete: DELETE a resource by id (Business Object deletes cascade to all associated resources). " +
        "activate: set isActive=true (business-object) or enabled=true (decision). " +
        "deactivate: set isActive=false (business-object) or enabled=false (decision). " +
        "get-fields: (query only) fetch output field definitions required to build QUERY decision inputFields. " +
        "execute-adhoc: (query only) run a one-off pipeline without saving it. " +
        "publish-fake-data: generate type-aware fake PubNub messages and publish them to test Decisions. " +
        "Fetches BO field schema and produces realistic values per field type. " +
        "Generated payloads are properly NESTED to match each field's JSONPath — e.g. a field with " +
        "jsonPath '$.message.body.application.user_id' produces { application: { user_id: ... } }, " +
        "not the flat key 'application.user_id'. This guarantees JSONPath resolution works against " +
        "nested BO schemas. " +
        "NOTE: Illuminate ingests with a 20–30 second delay — wait before querying after publish. " +
        "verify-query: execute a saved Query by id and return results (confirms data is flowing). " +
        "check-action-log: fetch recent Decision action log entries to verify a Decision fired. " +
        "raw-snapshot: return the most recent rows from a Business Object via ad-hoc query. " +
        "aggregate: group and count BO data by user/channel or custom group_by fields. " +
        "field-health: check which BO fields are populated vs empty — reveals JSONPath mismatches. " +
        "custom-query: run a fully custom ad-hoc pipeline supplied in the pipeline argument."
    ),

  id: z
    .string()
    .optional()
    .describe(
      "Resource UUID. Required for: get, update, delete, activate, deactivate, get-fields, execute-adhoc."
    ),

  data: z
    .record(z.string(), z.unknown())
    .optional()
    .describe(
      "Request body for create, update, and execute-adhoc. " +
        "BUSINESS OBJECT: create with isActive=false. Include 'subkeys' array with at least one subscribe key (sub-c-...). " +
        "jsonPath fields must start with '$.message.body.'. " +
        "Supported jsonFieldType: TEXT, TEXT_LONG, NUMERIC, TIMESTAMP, BOOLEAN. " +
        "BO LIMITS (handler pre-flights and rejects on violation): name 1-100 chars, " +
        "fields[].name 1-50 chars, max 100 fields per BO, MAX 5 TEXT_LONG fields per BO. " +
        "Use TEXT (256 chars) for fields under 256 characters; reserve TEXT_LONG (1000 chars) " +
        "for the longest free-text fields only. Keep `description` concise — overly long " +
        "descriptions are rejected with HTTP 400 by the Illuminate API. " +
        "Deactivate before editing measures/dimensions. " +
        "METRIC: COUNT → set function='COUNT', omit measureId entirely. " +
        "SUM/AVG/MIN/MAX → set function and measureId to a NUMERIC field ID. " +
        "QUERY execute-adhoc: { version: '2.0', pipeline: { sources: [...], output: {...} } }. " +
        "CRITICAL: version must be the string '2.0' — omitting causes 400. " +
        "DECISION — the 2-step create workflow auto-resolves names → UUIDs in: " +
        "(1) action template strings (e.g. body, channel) using dollar-brace syntax — " +
        "you may reference output `variable` names (handled natively by the API) AND input " +
        // biome-ignore lint/suspicious/noTemplateCurlyInString: describes literal dollar-brace syntax used by the Illuminate API
        "field names (handler substitutes a sentinel pre-POST and swaps to ${UUID} post-POST), " +
        "(2) rules[].inputValues[].inputFieldId, (3) rules[].outputValues[].outputFieldId, " +
        "(4) rules[].outputValues[].value (dollar-brace syntax, references input or output field names), " +
        "(5) rules[].actionValues[].actionId, and " +
        "(6) rules[].actionValues[].executionLimitInputFieldIds (array of input-field names). " +
        "Use inputField/outputField/action names everywhere — raw UUIDs are passed through unchanged. " +
        "If the rule-install PUT fails, the handler automatically deletes the orphaned scaffold. " +
        "Required fields (missing hitType or executeOnce causes HTTP 500): " +
        "hitType: 'SINGLE' or 'MATCH_ALL'. executeOnce: true or false. " +
        "activeFrom: ISO datetime e.g. '2026-01-01T00:00:00Z'. " +
        "activeUntil: ISO datetime (handler defaults to now + 2 years if absent). " +
        "Handler auto-injects these defaults if absent. " +
        "BUSINESSOBJECT decision: set sourceId = businessObjectId at top level; inputFields.sourceType = 'FIELD'. " +
        "METRIC COUNT: inputFields.sourceType = 'BUSINESSOBJECT' (count) or 'DIMENSION' (grouped). " +
        "METRIC SUM/AVG/MIN/MAX: inputFields.sourceType = 'MEASURE' (value) or 'DIMENSION' (grouped). " +
        "QUERY decision: inputFields.sourceType = 'QUERYFIELD'; get sourceIds from get-fields first. " +
        "CRITICAL: each inputField.name MUST exactly match the source query's output field alias " +
        "(case-sensitive). Illuminate binds query rows to decision inputs by NAME, not by sourceId. " +
        "If names don't match, the decision will silently never fire even though the rule conditions " +
        "are met. Fetch field names via get-fields and use them verbatim. " +
        "Rules: every inputValues array must cover ALL inputFields (use operation='ANY' for unconstrained fields). " +
        "Actions: use 'actionType' (not 'type'). OutputFields: use 'variable' and 'name' (no 'type'). " +
        "ACTION DEFAULT: when the user doesn't specify what action to fire, default to " +
        "actionType='PUBNUB_PUBLISH' with a message body that includes the relevant input/output " +
        "values via dollar-brace template references. PUBNUB_PUBLISH requires no external " +
        "infrastructure and is trivially verifiable via check-action-log or by subscribing to " +
        "the target channel. Only use WEBHOOK when the user has provided a specific URL. " +
        "Account limits: METRIC decisions max 3/account; saved queries ~10/account. " +
        "DASHBOARD charts: use metric: { id: '<metricId>' } — NOT metricId directly. " +
        "PUT is FULL replacement for charts array — always include all existing charts when updating."
    ),

  subscribe_key: z
    .string()
    .optional()
    .describe(
      "PubNub subscribe key (sub-c-...). Required for business-object activate and publish-fake-data. " +
        "Obtain via manage_keysets with operation list."
    ),

  publish_key: z
    .string()
    .optional()
    .describe(
      "PubNub publish key (pub-c-...). Required for publish-fake-data. " +
        "Obtain via manage_keysets with operation list."
    ),

  secret_key: z
    .string()
    .optional()
    .describe(
      "PubNub secret key (sec-c-...). Optional for publish-fake-data. " +
        "Use this when the keyset has Access Manager enabled — initializing the SDK " +
        "with the secret key grants the publisher root permissions and bypasses 403 errors. " +
        "Never expose secret keys to client devices."
    ),

  auth_key: z
    .string()
    .optional()
    .describe(
      "PubNub Access Manager v3 grant token (authKey). Optional for publish-fake-data. " +
        "Use this when the keyset has Access Manager enabled and you have a token " +
        "issued via grantToken() that allows publishing on the test channels. " +
        "Prefer secret_key for backend test harnesses unless you specifically need a scoped grant."
    ),

  bo_id: z
    .string()
    .optional()
    .describe(
      "Business Object UUID. Required for: publish-fake-data, raw-snapshot, aggregate, field-health."
    ),

  query_id: z.string().optional().describe("Saved query UUID. Required for verify-query."),

  decision_id: z.string().optional().describe("Decision UUID. Required for check-action-log."),

  scenario: z
    .enum(["generic", "chat-flooding", "cross-posting"])
    .optional()
    .describe(
      "Fake-data scenario for publish-fake-data. " +
        "generic: random users and channels (default). " +
        "chat-flooding: many messages from one user on one channel — triggers message_count > N rules. " +
        "cross-posting: same user posting to many channels — triggers channel_count > N rules."
    ),

  count: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe("Number of fake messages to publish (1–50). Defaults to 5."),

  user_id: z
    .string()
    .optional()
    .describe("Specific user ID to use for chat-flooding and cross-posting scenarios."),

  channel: z.string().optional().describe("Specific channel for generic/chat-flooding publish."),

  limit: z
    .number()
    .min(1)
    .max(500)
    .optional()
    .describe(
      "Max rows to return for raw-snapshot, aggregate, field-health (1–500). Defaults to 50."
    ),

  group_by: z
    .array(z.string())
    .optional()
    .describe(
      "Field names to group by for the aggregate operation (e.g. ['userId', 'channel']). " +
        "Defaults to the first two TEXT fields found in the Business Object."
    ),

  pipeline: z
    .record(z.string(), z.unknown())
    .optional()
    .describe(
      "Full pipeline body for custom-query. Must include version='2.0': " +
        "{ version: '2.0', pipeline: { sources: [...], output: {...} } }. " +
        "CRITICAL: version must be the string '2.0' — omitting it returns 400."
    ),
});
