import { createLogger } from "../logger";
import { createResponse, parseError } from "../utils.js";
import * as api from "./api.js";
import {
  type FunctionsResource,
  type ManageFunctionsSchemaType,
  RESOURCE_OPERATIONS,
} from "./types.js";

const log = createLogger("functions:handlers");

type HandlerResponse = ReturnType<typeof createResponse>;

function ok(result: unknown): HandlerResponse {
  return createResponse(JSON.stringify(result));
}

function err(message: string): HandlerResponse {
  return createResponse(message, true);
}

function requireArg(value: string | undefined, label: string): string {
  if (!value) {
    throw new ArgError(`Missing required argument: ${label}.`);
  }
  return value;
}

// Used to distinguish caller-input errors (return as friendly text) from
// upstream/runtime errors (run through parseError).
class ArgError extends Error {}

// KV-store and secret operations are scoped by the subscribe key, sent to the
// API as the `subkey` query parameter.
function resolveSubkey(args: ManageFunctionsSchemaType): string {
  const subkey = args.subscribe_key;
  if (!subkey) {
    throw new ArgError(
      `Operation ${args.resource}/${args.operation} is keyset-scoped and requires a subscribe key. ` +
        "Pass subscribe_key (sub-c-...)."
    );
  }
  return subkey;
}

// Deployment create and blueprint import are scoped by the NUMERIC keyset id,
// carried in the request body as `keysetId` (distinct from the subscribe key).
function resolveKeysetId(args: ManageFunctionsSchemaType, data: Record<string, unknown>): number {
  const fromData = typeof data.keysetId === "number" ? data.keysetId : undefined;
  const keysetId = fromData ?? args.keyset_id;
  if (keysetId === undefined) {
    throw new ArgError(
      `Operation ${args.resource}/${args.operation} requires the numeric keyset id. ` +
        "Pass keyset_id (a number) or include keysetId in data."
    );
  }
  return keysetId;
}

// ─── Per-resource dispatch ────────────────────────────────────────────────────

async function handlePackage(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  switch (args.operation) {
    case "list":
      return ok(await api.listPackages(buildListQuery(args)));
    case "get":
      return ok(await api.getPackage(requireArg(args.id, "id")));
    case "create":
      return ok(await api.createPackage(requireData(args)));
    case "update":
      return ok(await api.updatePackage(requireArg(args.id, "id"), requireData(args)));
    case "delete":
      return ok(await api.deletePackage(requireArg(args.id, "id")));
    case "list-revisions":
      return ok(
        await api.listPackageRevisions(requireArg(args.id, "id"), buildListQuery(args, "search"))
      );
    default:
      return unsupported(args);
  }
}

async function handleRevision(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  switch (args.operation) {
    case "get":
      return ok(await api.getRevision(requireArg(args.id, "id")));
    case "create":
      return ok(await api.createRevision(requireData(args)));
    case "update":
      return ok(await api.updateRevision(requireArg(args.id, "id"), requireData(args)));
    case "delete":
      return ok(await api.deleteRevision(requireArg(args.id, "id")));
    case "list-functions":
      return ok(await api.listRevisionFunctions(requireArg(args.id, "id"), buildListQuery(args)));
    case "list-deployments":
      return ok(
        await api.listRevisionDeployments(requireArg(args.id, "id"), buildListQuery(args, "search"))
      );
    case "list-test-inputs":
      return ok(
        await api.listTestInputs(
          requireArg(args.function_revision_id, "function_revision_id"),
          buildListQuery(args)
        )
      );
    case "create-test-input":
      return ok(
        await api.createTestInput(
          requireArg(args.function_revision_id, "function_revision_id"),
          requireData(args)
        )
      );
    case "update-test-input":
      return ok(
        await api.updateTestInput(
          requireArg(args.function_revision_id, "function_revision_id"),
          requireArg(args.test_input_id, "test_input_id"),
          requireData(args)
        )
      );
    case "delete-test-input":
      return ok(
        await api.deleteTestInput(
          requireArg(args.function_revision_id, "function_revision_id"),
          requireArg(args.test_input_id, "test_input_id")
        )
      );
    default:
      return unsupported(args);
  }
}

async function handleDeployment(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  // stop-by is account-scoped; all other deployment ops are keyset-scoped.
  if (args.operation === "stop-by") {
    if (!args.package_id && !args.package_revision_id) {
      return err("deployment/stop-by requires exactly one of package_id or package_revision_id.");
    }
    if (args.package_id && args.package_revision_id) {
      return err(
        "deployment/stop-by accepts only ONE of package_id or package_revision_id, not both."
      );
    }
    return ok(
      await api.stopDeploymentsBy(
        args.package_id
          ? { package_id: args.package_id }
          : { package_revision_id: args.package_revision_id }
      )
    );
  }

  switch (args.operation) {
    case "create": {
      const data = requireData(args);
      const keysetId = resolveKeysetId(args, data);
      return ok(await api.createDeployment({ ...data, keysetId }));
    }
    case "get":
      return ok(await api.getDeployment(requireArg(args.id, "id")));
    case "delete":
      return ok(await api.deleteDeployment(requireArg(args.id, "id")));
    case "start":
      return ok(await api.startDeployment(requireArg(args.id, "id")));
    case "stop":
      return ok(await api.stopDeployment(requireArg(args.id, "id"), args.force));
    case "rolling-update":
      return ok(await api.rollingUpdateDeployment(requireArg(args.id, "id"), requireData(args)));
    case "intersected": {
      if (args.keyset_id === undefined) {
        throw new ArgError(
          "deployment/intersected requires keyset_id (the numeric keyset id) and channels."
        );
      }
      return ok(
        await api.getIntersectedDeployments(args.keyset_id, args.channels ?? [], args.function_type)
      );
    }
    default:
      return unsupported(args);
  }
}

async function handleKvStore(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  const subkey = resolveSubkey(args);
  const kvType = args.kv_type ?? "string";

  if ((args.operation === "increment" || args.operation === "decrement") && kvType !== "counter") {
    return err(`kv-store/${args.operation} is only valid for kv_type="counter".`);
  }

  switch (args.operation) {
    case "list":
      return ok(await api.listKvEntries(kvType, subkey, buildKvListQuery(args)));
    case "get":
      return ok(await api.getKvEntry(kvType, requireArg(args.key, "key"), subkey));
    case "set":
      return ok(
        await api.setKvEntry(kvType, requireArg(args.key, "key"), args.value, subkey, args.ttl)
      );
    case "delete":
      return ok(await api.deleteKvEntry(kvType, requireArg(args.key, "key"), subkey));
    case "increment":
      return ok(await api.incrementCounter(requireArg(args.key, "key"), subkey, args.amount));
    case "decrement":
      return ok(await api.decrementCounter(requireArg(args.key, "key"), subkey, args.amount));
    default:
      return unsupported(args);
  }
}

async function handleSecret(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  const subkey = resolveSubkey(args);
  switch (args.operation) {
    case "list":
      // The secrets list endpoint does not support pagination (FAAS-1029).
      return ok(await api.listSecrets(subkey));
    case "set":
      return ok(await api.setSecret(requireArg(args.key, "key"), args.value, subkey));
    case "delete":
      return ok(await api.deleteSecret(requireArg(args.key, "key"), subkey));
    default:
      return unsupported(args);
  }
}

async function handleScheduledEvent(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  switch (args.operation) {
    case "list":
      return ok(await api.listScheduledEvents(buildListQuery(args)));
    case "get":
      return ok(await api.getScheduledEvent(requireArg(args.id, "id")));
    case "create":
      return ok(await api.createScheduledEvent(requireData(args)));
    case "update":
      return ok(await api.updateScheduledEvent(requireArg(args.id, "id"), requireData(args)));
    case "delete":
      return ok(await api.deleteScheduledEvent(requireArg(args.id, "id")));
    default:
      return unsupported(args);
  }
}

async function handleCatalog(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  switch (args.operation) {
    case "list-blueprints":
      return ok(await api.listPackageBlueprints(buildListQuery(args, "name")));
    case "get-blueprint":
      return ok(await api.getPackageBlueprint(requireArg(args.id, "id")));
    case "list-function-blueprints":
      return ok(await api.listFunctionBlueprints(requireArg(args.id, "id")));
    case "list-parameters":
      return ok(
        await api.listBlueprintParameters(requireArg(args.id, "id (function blueprint id)"))
      );
    case "list-all-parameters":
      return ok(await api.listAllBlueprintParameters(buildListQuery(args, "name")));
    case "get-parameter":
      return ok(await api.getBlueprintParameter(requireArg(args.id, "id")));
    case "import": {
      const data = requireData(args);
      const keysetId = resolveKeysetId(args, data);
      return ok(
        await api.importPackageFromBlueprint(requireArg(args.id, "id (package blueprint id)"), {
          ...data,
          keysetId,
        })
      );
    }
    default:
      return unsupported(args);
  }
}

async function handleLimit(args: ManageFunctionsSchemaType): Promise<HandlerResponse> {
  if (args.operation === "get-running-deployments") {
    return ok(await api.getRunningDeploymentsLimit());
  }
  return unsupported(args);
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function requireData(args: ManageFunctionsSchemaType): Record<string, unknown> {
  if (!args.data || Object.keys(args.data).length === 0) {
    throw new ArgError(
      `Operation ${args.resource}/${args.operation} requires a request body in the data argument.`
    );
  }
  return args.data;
}

// Standard Spring-pageable list query (packages, revisions, blueprints, events).
// `filterKey` selects the name-filter param: packages/revisions use `search`,
// blueprints/params use `name`.
function buildListQuery(args: ManageFunctionsSchemaType, filterKey: "search" | "name" = "search") {
  const query: Record<string, string | number | undefined> = {};
  if (args.name) query[filterKey] = args.name;
  if (args.page !== undefined) query.page = args.page;
  if (args.count !== undefined) query.size = args.count;
  if (args.sort) query.sort = args.sort;
  return Object.keys(query).length > 0 ? query : undefined;
}

// KV/secret list query uses cursor pagination (`size` + `page_token`).
function buildKvListQuery(args: ManageFunctionsSchemaType) {
  const query: Record<string, string | number | undefined> = {};
  if (args.count !== undefined) query.size = args.count;
  if (args.page_token) query.page_token = args.page_token;
  return Object.keys(query).length > 0 ? query : undefined;
}

function unsupported(args: ManageFunctionsSchemaType): HandlerResponse {
  const allowed = RESOURCE_OPERATIONS[args.resource as FunctionsResource] ?? [];
  return err(
    `Operation "${args.operation}" is not supported for resource "${args.resource}". ` +
      `Allowed operations: ${allowed.join(", ")}.`
  );
}

const RESOURCE_HANDLERS: Record<
  FunctionsResource,
  (args: ManageFunctionsSchemaType) => Promise<HandlerResponse>
> = {
  package: handlePackage,
  revision: handleRevision,
  deployment: handleDeployment,
  "kv-store": handleKvStore,
  secret: handleSecret,
  "scheduled-event": handleScheduledEvent,
  catalog: handleCatalog,
  limit: handleLimit,
};

export async function manageFunctionsHandler(
  args: ManageFunctionsSchemaType
): Promise<HandlerResponse> {
  try {
    log.debug({ resource: args.resource, operation: args.operation }, "Handling Functions request");

    const resource = args.resource as FunctionsResource;
    const allowed = RESOURCE_OPERATIONS[resource];
    if (!allowed) {
      return err(`Unknown resource: ${args.resource}.`);
    }
    if (!allowed.includes(args.operation)) {
      return unsupported(args);
    }

    const handler = RESOURCE_HANDLERS[resource];
    return await handler(args);
  } catch (e) {
    if (e instanceof ArgError) {
      return err(e.message);
    }
    log.error(
      { err: e, resource: args.resource, operation: args.operation },
      "Functions request failed"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
