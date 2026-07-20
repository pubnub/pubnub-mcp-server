import { z } from "zod";

export const ManageFunctionsSchema = z.object({
  resource: z
    .enum([
      "package",
      "revision",
      "deployment",
      "kv-store",
      "secret",
      "scheduled-event",
      "catalog",
      "limit",
    ])
    .describe(
      "The PubNub Functions v2 resource type to operate on. " +
        "package: account-level container that groups Functions and tracks revisions. " +
        "revision: immutable, versioned snapshot of a package's functions and code. " +
        "deployment: a running instance of a package revision on a keyset (keyset-scoped). " +
        "kv-store: keyset-scoped key-value storage (string, json, counter) used by Functions at runtime. " +
        "secret: keyset-scoped encrypted secret storage (the Vault). " +
        "scheduled-event: keyset-scoped scheduled deployment event. " +
        "catalog: read/import blueprints (templates) from the Integrations Catalog. " +
        "limit: read account resource limits (e.g. running deployments)."
    ),

  operation: z
    .enum([
      "list",
      "get",
      "create",
      "update",
      "delete",
      "list-revisions",
      "list-functions",
      "list-deployments",
      "list-test-inputs",
      "create-test-input",
      "update-test-input",
      "delete-test-input",
      "start",
      "stop",
      "rolling-update",
      "intersected",
      "stop-by",
      "set",
      "increment",
      "decrement",
      "list-blueprints",
      "get-blueprint",
      "list-function-blueprints",
      "list-parameters",
      "list-all-parameters",
      "get-parameter",
      "import",
      "get-running-deployments",
    ])
    .describe(
      "Operation to perform. Valid operations depend on the resource (the handler validates the pair). " +
        "package: list, get, create, update, delete, list-revisions. " +
        "revision: get, create, update, delete, list-functions, list-deployments, list-test-inputs, create-test-input, update-test-input, delete-test-input. " +
        "deployment: create, get, delete, start, stop, rolling-update, intersected, stop-by. " +
        "kv-store: list, get, set, delete, increment (counter), decrement (counter). " +
        "secret: list, set, delete. " +
        "scheduled-event: list, get, create, update, delete. " +
        "catalog: list-blueprints, get-blueprint, list-function-blueprints, list-parameters, list-all-parameters, get-parameter, import. " +
        "limit: get-running-deployments."
    ),

  id: z
    .string()
    .optional()
    .describe(
      "Primary resource UUID. The package id (package get/update/delete/list-revisions), " +
        "package-revision id (revision get/update/delete/list-functions/list-deployments), " +
        "deployment id (deployment get/delete/start/stop/rolling-update), " +
        "scheduled-event id, package-blueprint id (catalog get-blueprint/list-function-blueprints/import), " +
        "or function-blueprint-parameter id (catalog get-parameter)."
    ),

  data: z
    .record(z.string(), z.unknown())
    .optional()
    .describe(
      "Request body for create/update/import/rolling-update/create-test-input/update-test-input/create-scheduled-event. " +
        "PACKAGE create: { name, revisionName, functions: [...], description?, tags?, apiManaged? } — creating a package also creates its initial revision and functions. " +
        "REVISION create: { packageId, functions: [...] } where each function has { name, eventType, channels|path, code, ... }. " +
        "Function eventType is one of the Before/After Publish/Signal/File, After Presence, On Request, On Interval types. " +
        "DEPLOYMENT create: { packageRevisionId, keysetId } — keysetId is the NUMERIC keyset id (or pass keyset_id). " +
        "DEPLOYMENT rolling-update: { newPackageDeploymentId }. " +
        "SCHEDULED-EVENT create: { packageDeploymentId, dttmBegin, dttmEnd, description? }. " +
        "CATALOG import: { keysetId (or pass keyset_id), revisionName, functions, name?, description?, tags? }. " +
        "All function code must be valid PubNub Functions JavaScript (default export with the correct handler signature)."
    ),

  subscribe_key: z
    .string()
    .optional()
    .describe(
      "PubNub subscribe key (sub-c-...) identifying the keyset for kv-store and secret operations. " +
        "Passed to the API as the `subkey` query parameter. " +
        "Required for kv-store and secret operations; not used for package/revision/deployment/scheduled-event/catalog/limit operations."
    ),

  keyset_id: z
    .number()
    .int()
    .optional()
    .describe(
      "NUMERIC keyset id (not the subscribe key). Required for deployment create, deployment intersected, " +
        "and catalog import. For create/import it is sent in the request body as keysetId; for intersected " +
        "it is sent as the keyset_id query parameter."
    ),

  package_id: z
    .string()
    .optional()
    .describe("Package UUID. Used by deployment stop-by (stop all deployments for a package)."),

  package_revision_id: z
    .string()
    .optional()
    .describe(
      "Package revision UUID. Used by deployment stop-by (stop all deployments for a revision). " +
        "Exactly one of package_id or package_revision_id must be supplied for stop-by."
    ),

  function_revision_id: z
    .string()
    .optional()
    .describe(
      "Function revision UUID. Required for revision test-input operations " +
        "(list-test-inputs, create-test-input, update-test-input, delete-test-input). " +
        "Obtain it from revision list-functions."
    ),

  test_input_id: z
    .string()
    .optional()
    .describe("Test input UUID. Required for update-test-input and delete-test-input."),

  kv_type: z
    .enum(["string", "json", "counter"])
    .optional()
    .describe(
      "KV store entry type for kv-store operations. string: /kv/strings; json: /kv/jsons; counter: /kv/counters. " +
        "increment and decrement apply to counter only. Defaults to string when omitted."
    ),

  key: z
    .string()
    .optional()
    .describe(
      "KV store or secret key name. Required for kv-store get/set/delete/increment/decrement and secret set/delete. " +
        "KV keys may be up to 1000 characters. KV data is scoped per subscribe key (keyset)."
    ),

  value: z
    .unknown()
    .optional()
    .describe(
      "Value for kv-store set (string/json entry value) and secret set (the secret value). " +
        "For json entries this may be any JSON-serializable object; string entry values may be up to 32000 characters. " +
        "Counter increment/decrement use the `amount` field instead of value."
    ),

  ttl: z
    .number()
    .int()
    .min(20)
    .max(31536000)
    .optional()
    .describe(
      "Optional TTL in SECONDS for kv-store set (string/json entries); sent as ttlSeconds in the body. " +
        "Range 20s–31536000s (1 year); defaults to 1 day if omitted. Counters are never subject to TTL. " +
        "NOTE: the runtime kvstore module (require('kvstore').set) takes TTL in MINUTES — this Admin API field is in SECONDS."
    ),

  amount: z
    .number()
    .int()
    .optional()
    .describe("Increment/decrement amount for kv-store counter operations. Defaults to 1."),

  channels: z
    .array(z.string())
    .optional()
    .describe(
      "Channel names for deployment intersected (find deployments that intersect these channels). " +
        "Used together with keyset_id."
    ),

  function_type: z
    .string()
    .optional()
    .describe(
      "Optional function/event type filter for deployment intersected (sent as the function_type query " +
        "parameter), e.g. the Before/After Publish/Signal/File, After Presence, On Request, or On Interval type. " +
        "Omit to match all function types."
    ),

  force: z
    .boolean()
    .optional()
    .describe(
      "Optional flag for deployment stop. When true, forces the deployment to stop immediately (sent as the " +
        "force query parameter) instead of draining gracefully. Omit for a graceful stop."
    ),

  name: z
    .string()
    .optional()
    .describe(
      "Optional name filter for list operations. Sent as `search` for packages/revisions and as `name` for blueprints/blueprint parameters."
    ),

  page: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      "Zero-based page number for Spring-pageable list operations (packages, revisions, blueprints, scheduled events)."
    ),

  sort: z
    .string()
    .optional()
    .describe(
      "Sort expression for Spring-pageable list operations, e.g. 'updatedDttm,DESC' or 'createdDttm,ASC'."
    ),

  page_token: z
    .string()
    .optional()
    .describe(
      "Cursor pagination token for kv-store/secret list operations (sent as `page_token`), returned by a previous list response."
    ),

  count: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Optional page size for paginated list operations (sent as `size`)."),
});
