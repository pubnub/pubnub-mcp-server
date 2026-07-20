import type { z } from "zod";
import type { ManageFunctionsSchema } from "./schemas.js";

export type ManageFunctionsSchemaType = z.infer<typeof ManageFunctionsSchema>;

export type FunctionsResource =
  | "package"
  | "revision"
  | "deployment"
  | "kv-store"
  | "secret"
  | "scheduled-event"
  | "catalog"
  | "limit";

// Valid operations per resource. The handler validates the (resource, operation)
// pair against this map before making any request, returning a helpful error for
// unsupported combinations (mirrors the runtime validation pattern used by insights).
export const RESOURCE_OPERATIONS: Record<FunctionsResource, ReadonlyArray<string>> = {
  package: ["list", "get", "create", "update", "delete", "list-revisions"],
  revision: [
    "get",
    "create",
    "update",
    "delete",
    "list-functions",
    "list-deployments",
    "list-test-inputs",
    "create-test-input",
    "update-test-input",
    "delete-test-input",
  ],
  deployment: [
    "create",
    "get",
    "delete",
    "start",
    "stop",
    "rolling-update",
    "intersected",
    "stop-by",
  ],
  "kv-store": ["list", "get", "set", "delete", "increment", "decrement"],
  secret: ["list", "set", "delete"],
  "scheduled-event": ["list", "get", "create", "update", "delete"],
  catalog: [
    "list-blueprints",
    "get-blueprint",
    "list-function-blueprints",
    "list-parameters",
    "list-all-parameters",
    "get-parameter",
    "import",
  ],
  limit: ["get-running-deployments"],
};

// KV store entry type → REST collection segment under /v2/faas/kv.
export const KV_TYPE_PATH: Record<string, string> = {
  string: "strings",
  json: "jsons",
  counter: "counters",
};
