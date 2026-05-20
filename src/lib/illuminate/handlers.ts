import { createLogger } from "../logger";
import { getPubNubClient } from "../pubnub/api.js";
import type { PubNubConfig } from "../pubnub/types.js";
import { createResponse, parseError } from "../utils.js";
import * as api from "./api.js";
import type { IlluminateField, ManageIlluminateSchemaType } from "./types.js";

const log = createLogger("illuminate:handlers");

type HandlerResponse = ReturnType<typeof createResponse>;

// ─── Shared helpers ──────────────────────────────────────────────────────────

function extractBodyKey(jsonPath: string): string {
  const prefix = "$.message.body.";
  if (jsonPath?.startsWith(prefix)) return jsonPath.slice(prefix.length);
  if (jsonPath) return jsonPath.split(".").pop() || "field";
  return "field";
}

function getQueryableFields(bo: Record<string, unknown>) {
  return (bo.fields as Array<IlluminateField & { id?: string; jsonPath?: string }>).filter(
    (f): f is IlluminateField & { id: string; jsonPath: string } => !!(f.id && f.jsonPath)
  );
}

// ─── Decision helpers ────────────────────────────────────────────────────────

const DECISION_SERVER_FIELDS = ["accountId", "createdAt", "updatedAt", "createdBy", "updatedBy"];

const DECISION_DEFAULTS = {
  hitType: "SINGLE",
  executeOnce: false,
};

function getDecisionDefaults() {
  const now = new Date();
  const twoYearsLater = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  return {
    ...DECISION_DEFAULTS,
    activeFrom: now.toISOString(),
    activeUntil: twoYearsLater.toISOString(),
  };
}

function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function resolveId(value: unknown, nameMap: Map<string, string>): unknown {
  if (typeof value !== "string") return value;
  if (isUUID(value)) return value;
  return nameMap.get(value) ?? value;
}

function buildIdMaps(scaffoldResponse: Record<string, unknown>) {
  const inputFieldMap = new Map<string, string>();
  const outputFieldMap = new Map<string, string>();
  const actionMap = new Map<string, string>();

  for (const f of (scaffoldResponse.inputFields as Array<Record<string, string>>) ?? []) {
    if (f.name && f.id) inputFieldMap.set(f.name, f.id);
  }
  for (const f of (scaffoldResponse.outputFields as Array<Record<string, string>>) ?? []) {
    if (f.name && f.id) outputFieldMap.set(f.name, f.id);
    if (f.variable && f.id) outputFieldMap.set(f.variable, f.id);
  }
  for (const a of (scaffoldResponse.actions as Array<Record<string, string>>) ?? []) {
    if (a.name && a.id) actionMap.set(a.name, a.id);
  }

  return { inputFieldMap, outputFieldMap, actionMap };
}

function resolveTemplateString(value: string, allMaps: Map<string, string>): string {
  return value.replace(/\$\{([^}]+)\}/g, (match, ref) => {
    const trimmed = (ref as string).trim();
    if (isUUID(trimmed)) return match;
    const uuid = allMaps.get(trimmed);
    return uuid ? `\${${uuid}}` : match;
  });
}

function resolveRuleIds(
  rules: unknown[],
  inputFieldMap: Map<string, string>,
  outputFieldMap: Map<string, string>,
  actionMap: Map<string, string>
): unknown[] {
  // outputValues[].value supports the same `${name}` template syntax as action templates
  // and references both input AND output field names. Build a combined map for it.
  const allFieldMap = new Map<string, string>([...inputFieldMap, ...outputFieldMap]);

  return rules.map(rule => {
    const r = rule as Record<string, unknown>;
    return {
      ...r,
      inputValues: ((r.inputValues as Array<Record<string, unknown>>) ?? []).map(iv => ({
        ...iv,
        inputFieldId: resolveId(iv.inputFieldId, inputFieldMap),
      })),
      outputValues: ((r.outputValues as Array<Record<string, unknown>>) ?? []).map(ov => {
        const next: Record<string, unknown> = {
          ...ov,
          outputFieldId: resolveId(ov.outputFieldId, outputFieldMap),
        };
        if (typeof ov.value === "string") {
          next.value = resolveTemplateString(ov.value, allFieldMap);
        }
        return next;
      }),
      actionValues: ((r.actionValues as Array<Record<string, unknown>>) ?? []).map(av => {
        const next: Record<string, unknown> = {
          ...av,
          actionId: resolveId(av.actionId, actionMap),
        };
        // executionLimitInputFieldIds references input-field UUIDs (not BO dimension UUIDs).
        // Resolve any name placeholders against the input field map.
        if (Array.isArray(av.executionLimitInputFieldIds)) {
          next.executionLimitInputFieldIds = (av.executionLimitInputFieldIds as unknown[]).map(v =>
            resolveId(v, inputFieldMap)
          );
        }
        return next;
      }),
    };
  });
}

function resolveTemplateVariables(
  actions: Array<Record<string, unknown>>,
  inputFieldMap: Map<string, string>,
  outputFieldMap: Map<string, string>
): Array<Record<string, unknown>> {
  const allMaps = new Map([...inputFieldMap, ...outputFieldMap]);
  return actions.map(action => {
    const template = action.template as Record<string, unknown> | undefined;
    if (!template) return action;
    const resolved: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(template)) {
      if (typeof val === "string") {
        resolved[key] = resolveTemplateString(val, allMaps);
      } else {
        resolved[key] = val;
      }
    }
    return { ...action, template: resolved };
  });
}

function stripServerFields(body: Record<string, unknown>): Record<string, unknown> {
  const result = { ...body };
  for (const field of DECISION_SERVER_FIELDS) {
    delete result[field];
  }
  return result;
}

function prepareDecisionPutBody(
  scaffoldResponse: Record<string, unknown>,
  resolvedRules: unknown[]
): Record<string, unknown> {
  const putBody = stripServerFields(scaffoldResponse);
  putBody.rules = resolvedRules;
  if (putBody.sourceType === "BUSINESSOBJECT") {
    delete putBody.executionFrequency;
  }
  return putBody;
}

// ─── Bug #7 helpers: pre-POST sentinel substitution for input-name template refs ─

const INPUT_REF_SENTINEL_PREFIX = "__MCP_INPUTREF__";
const INPUT_REF_SENTINEL_SUFFIX = "__";

function buildSentinel(name: string): string {
  // Encode the name so any non-alphanumeric chars survive the round-trip without
  // colliding with regex/JSON syntax. Hex-encoded so we can decode by regex later.
  const hex = Buffer.from(name, "utf8").toString("hex");
  return `${INPUT_REF_SENTINEL_PREFIX}${hex}${INPUT_REF_SENTINEL_SUFFIX}`;
}

function decodeSentinelHex(hex: string): string {
  return Buffer.from(hex, "hex").toString("utf8");
}

/**
 * The PubNub Illuminate API validates action template variables at scaffold POST time.
 * It natively recognizes ${output.variable} (since output `variable` names are part of
 * the POST body) but rejects ${input-field-name} because input field UUIDs don't exist
 * yet at POST time. To let users reference input fields by name in templates, we
 * substitute ${name} -> <sentinel> BEFORE the POST, then swap <sentinel> -> ${UUID}
 * AFTER the POST returns the assigned input-field UUIDs.
 */
function substituteInputRefsWithSentinels(actions: unknown, inputFieldNames: Set<string>): unknown {
  if (!Array.isArray(actions)) return actions;
  if (inputFieldNames.size === 0) return actions;

  return actions.map(action => {
    const a = action as Record<string, unknown>;
    const template = a.template as Record<string, unknown> | undefined;
    if (!template) return action;
    const newTemplate: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(template)) {
      if (typeof val === "string") {
        newTemplate[key] = val.replace(/\$\{([^}]+)\}/g, (match, ref) => {
          const trimmed = (ref as string).trim();
          if (inputFieldNames.has(trimmed)) return buildSentinel(trimmed);
          return match;
        });
      } else {
        newTemplate[key] = val;
      }
    }
    return { ...a, template: newTemplate };
  });
}

function restoreInputRefsFromSentinels(
  actions: Array<Record<string, unknown>>,
  inputFieldMap: Map<string, string>
): Array<Record<string, unknown>> {
  const sentinelPattern = new RegExp(
    `${INPUT_REF_SENTINEL_PREFIX}([0-9a-f]+)${INPUT_REF_SENTINEL_SUFFIX}`,
    "g"
  );
  return actions.map(action => {
    const template = action.template as Record<string, unknown> | undefined;
    if (!template) return action;
    const newTemplate: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(template)) {
      if (typeof val === "string") {
        newTemplate[key] = val.replace(sentinelPattern, (match, hex) => {
          const name = decodeSentinelHex(hex as string);
          const uuid = inputFieldMap.get(name);
          // If we somehow can't resolve, leave the sentinel literal so the user
          // sees the failure clearly (better than silently producing broken templates).
          return uuid ? `\${${uuid}}` : match;
        });
      } else {
        newTemplate[key] = val;
      }
    }
    return { ...action, template: newTemplate };
  });
}

function collectInputFieldNames(data: Record<string, unknown>): Set<string> {
  const names = new Set<string>();
  const inputFields = data.inputFields;
  if (!Array.isArray(inputFields)) return names;
  for (const f of inputFields) {
    const name = (f as Record<string, unknown>)?.name;
    if (typeof name === "string" && name.length > 0) names.add(name);
  }
  return names;
}

// ─── Fake data generation ────────────────────────────────────────────────────

function generateFakeValue(
  field: IlluminateField & { jsonPath?: string },
  index: number,
  scenario: string,
  userId: string,
  channel: string
): string | number | boolean {
  const alias = field.jsonPath ? extractBodyKey(field.jsonPath) : field.name.toLowerCase();
  const isUserField = alias.includes("user") || alias.includes("uuid") || alias.includes("author");
  const isChannelField = alias.includes("channel") || alias.includes("room");

  if (scenario === "cross-posting") {
    return crossPostingValue(field, index, isUserField, isChannelField, userId);
  }

  return genericValue(field, index, scenario, isUserField, isChannelField, userId, channel);
}

function crossPostingValue(
  field: IlluminateField,
  index: number,
  isUserField: boolean,
  isChannelField: boolean,
  userId: string
): string | number | boolean {
  if (isUserField) return userId;
  if (isChannelField) return `test-channel-${index}`;
  switch (field.jsonFieldType) {
    case "NUMERIC":
      return 1;
    case "BOOLEAN":
      return false;
    case "TIMESTAMP":
      return "2026-01-01T00:00:00.000Z";
    default:
      return "cross-post-message";
  }
}

function genericValue(
  field: IlluminateField,
  index: number,
  scenario: string,
  isUserField: boolean,
  isChannelField: boolean,
  userId: string,
  channel: string
): string | number | boolean {
  switch (field.jsonFieldType) {
    case "NUMERIC":
      return Math.floor(Math.random() * 100) + 1;
    case "BOOLEAN":
      return Math.random() > 0.5;
    case "TIMESTAMP":
      return new Date().toISOString();
    case "TEXT_LONG":
      return `sample-long-text-${index}`;
    default:
      return defaultTextValue(index, scenario, isUserField, isChannelField, userId, channel);
  }
}

function defaultTextValue(
  index: number,
  scenario: string,
  isUserField: boolean,
  isChannelField: boolean,
  userId: string,
  channel: string
): string {
  if (isUserField) {
    if (scenario === "chat-flooding" || scenario === "cross-posting") return userId;
    return `test-user-${index % 5}`;
  }
  if (isChannelField) {
    if (scenario === "cross-posting") return `test-channel-${index}`;
    if (scenario === "chat-flooding") return channel;
    return `test-channel-${index % 3}`;
  }
  return `value-${index}`;
}

function setNestedValue(
  target: Record<string, unknown>,
  dotPath: string,
  value: string | number | boolean
): void {
  const parts = dotPath.split(".").filter(p => p.length > 0);
  if (parts.length === 0) return;
  const leaf = parts[parts.length - 1] as string;
  let cursor: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i] as string;
    const existing = cursor[key];
    if (typeof existing !== "object" || existing === null || Array.isArray(existing)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[leaf] = value;
}

function buildMessage(
  fields: Array<IlluminateField & { jsonPath?: string }>,
  index: number,
  scenario: string,
  userId: string,
  channel: string
): Record<string, unknown> {
  const message: Record<string, unknown> = {};
  for (const field of fields) {
    if (!field.jsonPath) continue;
    setNestedValue(
      message,
      extractBodyKey(field.jsonPath),
      generateFakeValue(field, index, scenario, userId, channel)
    );
  }
  return message;
}

// ─── Pipeline builders ───────────────────────────────────────────────────────

function buildSourceFields(fields: Array<IlluminateField & { id: string; jsonPath: string }>) {
  return fields.map(f => ({ id: f.id, alias: extractBodyKey(f.jsonPath), type: "dimension" }));
}

function buildTimeRange() {
  return { field: "timestamp", relative: { direction: "past", value: 30, unit: "days" } };
}

function buildRawSnapshotPipeline(
  boId: string,
  fields: Array<IlluminateField & { id: string; jsonPath: string }>,
  limit: number
): Record<string, unknown> {
  const sourceFields = buildSourceFields(fields);
  return {
    version: "2.0",
    pipeline: {
      sources: [
        {
          id: "src",
          type: "businessObject",
          businessObjectId: boId,
          fields: sourceFields,
          timeRange: buildTimeRange(),
        },
      ],
      transforms: [],
      output: { from: "src", select: sourceFields.map(f => ({ field: f.alias })), limit },
    },
  };
}

function buildAggregatePipeline(
  boId: string,
  fields: Array<IlluminateField & { id: string; jsonPath: string }>,
  groupByAliases: string[],
  limit: number
): Record<string, unknown> {
  const relevantFields = fields.filter(f => groupByAliases.includes(extractBodyKey(f.jsonPath)));
  const sourceFields = relevantFields.map(f => ({
    id: f.id,
    alias: extractBodyKey(f.jsonPath),
    type: "dimension",
  }));

  return {
    version: "2.0",
    pipeline: {
      sources: [
        {
          id: "src",
          type: "businessObject",
          businessObjectId: boId,
          fields: sourceFields,
          timeRange: buildTimeRange(),
        },
      ],
      transforms: [
        {
          type: "aggregate",
          id: "grouped",
          input: "src",
          aggregate: {
            groupBy: groupByAliases,
            aggregations: [{ function: "count", field: "*", alias: "count" }],
          },
        },
      ],
      output: {
        from: "grouped",
        select: [...groupByAliases.map(alias => ({ field: alias })), { field: "count" }],
        orderBy: [{ field: "count", direction: "DESC" }],
        limit,
      },
    },
  };
}

// ─── Operation handlers ──────────────────────────────────────────────────────

async function handleList(args: ManageIlluminateSchemaType) {
  if (!args.resource) return createResponse("resource is required for the list operation.", true);
  return createResponse(JSON.stringify(await api.listResources(args.resource)));
}

async function handleGet(args: ManageIlluminateSchemaType) {
  if (!args.resource) return createResponse("resource is required for the get operation.", true);
  if (!args.id) return createResponse("id is required for the get operation.", true);
  return createResponse(JSON.stringify(await api.getResource(args.resource, args.id)));
}

async function handleCreate(args: ManageIlluminateSchemaType) {
  if (!args.resource) return createResponse("resource is required for the create operation.", true);
  if (!args.data) return createResponse("data is required for the create operation.", true);

  if (args.resource === "decision") {
    return handleDecisionCreate(args.data as Record<string, unknown>);
  }

  if (args.resource === "business-object") {
    const validationError = validateBusinessObjectCreate(args.data as Record<string, unknown>);
    if (validationError) return createResponse(validationError, true);
  }

  const result = await api.createResource(args.resource, args.data as Record<string, unknown>);
  return createResponse(JSON.stringify(result));
}

const BO_LIMITS = {
  nameMin: 1,
  nameMax: 100,
  fieldNameMin: 1,
  fieldNameMax: 50,
  fieldsMax: 100,
  textLongMax: 5,
};

function validateBusinessObjectCreate(data: Record<string, unknown>): string | undefined {
  const errors: string[] = [];

  const name = data.name;
  if (
    typeof name === "string" &&
    (name.length < BO_LIMITS.nameMin || name.length > BO_LIMITS.nameMax)
  ) {
    errors.push(
      `name length is ${name.length} characters; must be ${BO_LIMITS.nameMin}-${BO_LIMITS.nameMax}.`
    );
  }

  const fields = data.fields;
  if (Array.isArray(fields)) {
    if (fields.length > BO_LIMITS.fieldsMax) {
      errors.push(
        `${fields.length} fields defined; max ${BO_LIMITS.fieldsMax} per Business Object. ` +
          `Split the schema into multiple BOs grouped by domain.`
      );
    }

    let textLongCount = 0;
    for (const f of fields) {
      const field = f as Record<string, unknown>;
      if (field.jsonFieldType === "TEXT_LONG") textLongCount++;
      const fieldName = field.name;
      if (
        typeof fieldName === "string" &&
        (fieldName.length < BO_LIMITS.fieldNameMin || fieldName.length > BO_LIMITS.fieldNameMax)
      ) {
        errors.push(
          `field "${fieldName}" name length is ${fieldName.length}; must be ${BO_LIMITS.fieldNameMin}-${BO_LIMITS.fieldNameMax}.`
        );
      }
    }
    if (textLongCount > BO_LIMITS.textLongMax) {
      errors.push(
        `${textLongCount} TEXT_LONG fields defined; max ${BO_LIMITS.textLongMax} per Business Object. ` +
          `Use TEXT (256 chars) instead of TEXT_LONG (1000 chars) for fields that don't need >256 characters. ` +
          `Reserve TEXT_LONG for the longest free-text fields only.`
      );
    }
  }

  if (errors.length === 0) return undefined;
  return [
    "Business Object create blocked by pre-flight validation:",
    ...errors.map(e => `  - ${e}`),
    "",
    "Documented Illuminate limits: name 1-100 chars, fields[].name 1-50 chars, " +
      "max 100 fields per BO, max 5 TEXT_LONG fields per BO. " +
      "Adjust the data and retry.",
  ].join("\n");
}

async function validateQueryDecisionInputNames(
  data: Record<string, unknown>
): Promise<string | undefined> {
  // For QUERY-sourced decisions, Illuminate binds query rows to decision inputs by NAME.
  // If inputFields[].name doesn't match an output alias of the source query, the decision
  // is created/activated successfully but never fires. Pre-flight check to surface this.
  if (data.sourceType !== "QUERY") return undefined;
  const sourceId = data.sourceId;
  if (typeof sourceId !== "string" || !sourceId) return undefined;
  const inputFields = data.inputFields;
  if (!Array.isArray(inputFields) || inputFields.length === 0) return undefined;

  let queryFields: Array<{ field?: string }>;
  try {
    queryFields = (await api.getQueryFields(sourceId)) as Array<{ field?: string }>;
  } catch {
    // If we can't fetch fields (e.g. transient error), don't block the create.
    return undefined;
  }
  const validAliases = new Set(
    queryFields.map(f => f.field).filter((f): f is string => typeof f === "string")
  );
  if (validAliases.size === 0) return undefined;

  const mismatched: string[] = [];
  for (const f of inputFields) {
    const name = (f as Record<string, unknown>)?.name;
    if (typeof name === "string" && name.length > 0 && !validAliases.has(name)) {
      mismatched.push(name);
    }
  }
  if (mismatched.length === 0) return undefined;
  return (
    `QUERY decision inputField name mismatch. The following inputFields[].name values ` +
    `do not match any output alias of the source query (${sourceId}): ` +
    `[${mismatched.map(n => JSON.stringify(n)).join(", ")}]. ` +
    `Valid aliases from the source query are: [${[...validAliases].map(a => JSON.stringify(a)).join(", ")}]. ` +
    `Illuminate binds query rows to decision inputs by NAME — names that do not match cause ` +
    `the decision to silently never fire. Update inputFields[].name to use exactly these aliases.`
  );
}

async function handleDecisionCreate(data: Record<string, unknown>) {
  const originalData = { ...data };
  const originalRules = (originalData.rules as unknown[]) ?? [];

  const queryNameError = await validateQueryDecisionInputNames(originalData);
  if (queryNameError) return createResponse(queryNameError, true);

  // Bug #7: pre-substitute input-field name template references with sentinels so the
  // scaffold POST doesn't reject them. We restore them to ${UUID} after the POST returns.
  const inputFieldNames = collectInputFieldNames(originalData);
  const sanitizedActions = substituteInputRefsWithSentinels(originalData.actions, inputFieldNames);

  const scaffoldBody: Record<string, unknown> = {
    ...getDecisionDefaults(),
    ...originalData,
    actions: sanitizedActions,
    rules: [],
    enabled: false,
  };

  const scaffoldResponse = (await api.createResource("decision", scaffoldBody)) as Record<
    string,
    unknown
  >;

  const decisionId = scaffoldResponse.id as string;
  if (!decisionId) {
    return createResponse(
      `Decision scaffold POST failed: ${JSON.stringify(scaffoldResponse)}`,
      true
    );
  }

  if (originalRules.length === 0) {
    return createResponse(JSON.stringify(scaffoldResponse));
  }

  const { inputFieldMap, outputFieldMap, actionMap } = buildIdMaps(scaffoldResponse);
  const resolvedRules = resolveRuleIds(originalRules, inputFieldMap, outputFieldMap, actionMap);
  // Restore Bug #7 sentinels first, then run the regular ${name}-> ${UUID} resolver.
  const sentinelRestored = restoreInputRefsFromSentinels(
    (scaffoldResponse.actions as Array<Record<string, unknown>>) ?? [],
    inputFieldMap
  );
  const resolvedActions = resolveTemplateVariables(sentinelRestored, inputFieldMap, outputFieldMap);
  const putBody = prepareDecisionPutBody(scaffoldResponse, resolvedRules);
  putBody.actions = resolvedActions;

  try {
    const putResponse = await api.updateResource("decision", decisionId, putBody);
    return createResponse(JSON.stringify(putResponse));
  } catch (putErr) {
    // Bug #3: the scaffold POST already created a Decision in the account. If the rule-install
    // PUT fails, leaving it behind means a hidden orphan that counts toward the METRIC-decision
    // limit. Best-effort delete, then re-throw the original error so the user sees the real cause.
    try {
      await api.deleteResource("decision", decisionId);
    } catch (cleanupErr) {
      // Surface the cleanup failure alongside the real error so the user knows there's a leftover.
      const original = putErr instanceof Error ? putErr.message : JSON.stringify(putErr);
      const cleanup = cleanupErr instanceof Error ? cleanupErr.message : JSON.stringify(cleanupErr);
      return createResponse(
        `Decision rule install (PUT) failed: ${original}. ` +
          `Additionally, automatic cleanup of the scaffold Decision ${decisionId} failed: ${cleanup}. ` +
          `Please delete decision ${decisionId} manually before retrying.`,
        true
      );
    }
    throw putErr;
  }
}

async function handleUpdate(args: ManageIlluminateSchemaType) {
  if (!args.resource) return createResponse("resource is required for the update operation.", true);
  if (!args.id) return createResponse("id is required for the update operation.", true);
  if (!args.data) return createResponse("data is required for the update operation.", true);

  const updateData = { ...(args.data as Record<string, unknown>) };
  if (args.resource === "decision") {
    Object.assign(updateData, { ...getDecisionDefaults(), ...updateData });
    if (updateData.sourceType === "BUSINESSOBJECT") {
      delete updateData.executionFrequency;
    }
  }
  const result = await api.updateResource(args.resource, args.id, updateData);
  return createResponse(JSON.stringify(result));
}

async function handleDelete(args: ManageIlluminateSchemaType) {
  if (!args.resource) return createResponse("resource is required for the delete operation.", true);
  if (!args.id) return createResponse("id is required for the delete operation.", true);
  return createResponse(JSON.stringify(await api.deleteResource(args.resource, args.id)));
}

async function handleActivate(args: ManageIlluminateSchemaType) {
  if (!args.resource)
    return createResponse("resource is required for the activate operation.", true);
  if (!args.id) return createResponse("id is required for the activate operation.", true);

  const current = (await api.getResource(args.resource, args.id)) as Record<string, unknown>;

  if (args.resource === "business-object") {
    const subkeys = [...((current.subkeys as string[]) ?? [])];
    if (args.subscribe_key && !subkeys.includes(args.subscribe_key))
      subkeys.push(args.subscribe_key);
    const body: Record<string, unknown> = { ...current, isActive: true };
    if (subkeys.length > 0) body.subkeys = subkeys;
    return createResponse(
      JSON.stringify(await api.updateResource("business-object", args.id, body))
    );
  }

  if (args.resource === "decision") {
    const putBody = prepareDecisionPutBody(current, (current.rules as unknown[]) ?? []);
    putBody.enabled = true;
    return createResponse(JSON.stringify(await api.updateResource("decision", args.id, putBody)));
  }

  return createResponse(
    `activate is supported for business-object and decision. Got: ${args.resource}`,
    true
  );
}

async function handleDeactivate(args: ManageIlluminateSchemaType) {
  if (!args.resource)
    return createResponse("resource is required for the deactivate operation.", true);
  if (!args.id) return createResponse("id is required for the deactivate operation.", true);

  const current = (await api.getResource(args.resource, args.id)) as Record<string, unknown>;

  if (args.resource === "business-object") {
    const body: Record<string, unknown> = { ...current, isActive: false };
    return createResponse(
      JSON.stringify(await api.updateResource("business-object", args.id, body))
    );
  }

  if (args.resource === "decision") {
    const putBody = prepareDecisionPutBody(current, (current.rules as unknown[]) ?? []);
    putBody.enabled = false;
    return createResponse(JSON.stringify(await api.updateResource("decision", args.id, putBody)));
  }

  return createResponse(
    `deactivate is supported for business-object and decision. Got: ${args.resource}`,
    true
  );
}

async function handleGetFields(args: ManageIlluminateSchemaType) {
  if (!args.id)
    return createResponse("id (query UUID) is required for the get-fields operation.", true);
  return createResponse(JSON.stringify(await api.getQueryFields(args.id)));
}

async function handleExecuteAdhoc(args: ManageIlluminateSchemaType) {
  const pipelineData = (args.data ?? args.pipeline) as Record<string, unknown> | undefined;
  if (!pipelineData) {
    return createResponse(
      "data (pipeline body with version='2.0') is required for execute-adhoc.",
      true
    );
  }
  return createResponse(JSON.stringify(await api.executeAdHocQuery(pipelineData)));
}

function describePublishError(err: unknown, channel: string): string {
  // PubNub SDK errors come in a few shapes — look for Access Manager 403 specifically.
  const e = err as Record<string, unknown> | undefined;
  const status = e?.status as Record<string, unknown> | number | undefined;
  const errorData = (typeof status === "object" ? status?.errorData : undefined) as
    | Record<string, unknown>
    | undefined;
  const candidate = errorData ?? e ?? {};
  const service = (candidate as Record<string, unknown>).service;
  const httpStatus =
    (candidate as Record<string, unknown>).status ?? (typeof status === "number" ? status : null);

  if (service === "Access Manager" || httpStatus === 403) {
    return (
      `PubNub Access Manager rejected the publish on channel "${channel}" with HTTP 403. ` +
      "This keyset has Access Manager enabled. To allow publish-fake-data to work, do ONE of: " +
      "(1) pass the keyset's secret_key argument — initializing with the secret key grants " +
      "root permissions and bypasses Access Manager; " +
      "(2) pass an auth_key argument issued via grantToken() that " +
      `permits write on "${channel}"; or ` +
      "(3) temporarily disable Access Manager on this keyset in the PubNub Admin Portal."
    );
  }

  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

async function handlePublishFakeData(args: ManageIlluminateSchemaType) {
  const { publish_key: publishKey, subscribe_key: subscribeKey } = args;

  if (!publishKey || !subscribeKey) {
    return createResponse(
      "publish-fake-data requires a PubNub keyset. " +
        "Provide your keyset's publish and subscribe keys using the publish_key and " +
        "subscribe_key arguments. Obtain them via manage_keysets with operation list. " +
        "If the keyset has Access Manager enabled you also need to pass secret_key " +
        "(easiest, grants root) or auth_key (a grantToken() result).",
      true
    );
  }

  if (!args.bo_id) return createResponse("bo_id is required for publish-fake-data.", true);

  const bo = (await api.getResource("business-object", args.bo_id)) as Record<string, unknown>;
  const queryableFields = (
    (bo.fields as Array<IlluminateField & { jsonPath?: string }>) ?? []
  ).filter(f => f.jsonPath);
  const scenario = args.scenario ?? "generic";
  const count = args.count ?? 5;
  const userId = args.user_id ?? defaultUserId(scenario);
  const baseChannel = args.channel ?? "test-channel";

  const clientConfig: PubNubConfig = { publishKey, subscribeKey };
  if (args.secret_key) clientConfig.secretKey = args.secret_key;
  if (args.auth_key) clientConfig.authKey = args.auth_key;
  const pubnub = getPubNubClient(clientConfig);

  const published: Array<{ channel: string; message: Record<string, unknown> }> = [];
  const failed: Array<{
    channel: string;
    message: Record<string, unknown>;
    error: string;
  }> = [];

  for (let i = 0; i < count; i++) {
    const targetChannel = scenario === "cross-posting" ? `test-channel-${i}` : baseChannel;
    const message = buildMessage(queryableFields, i, scenario, userId, targetChannel);
    try {
      await pubnub.publish({ channel: targetChannel, message: message as never });
      published.push({ channel: targetChannel, message });
    } catch (err) {
      failed.push({
        channel: targetChannel,
        message,
        error: describePublishError(err, targetChannel),
      });
    }
  }

  const allFailed = published.length === 0 && failed.length > 0;
  const responseBody: Record<string, unknown> = {
    published: published.length,
    failed: failed.length,
    scenario,
    userId,
    messages: published,
    note: "Illuminate ingests messages with a 20–30 second delay. Wait before running raw-snapshot, verify-query, or check-action-log.",
  };
  if (failed.length > 0) responseBody.failures = failed;

  return createResponse(JSON.stringify(responseBody), allFailed);
}

function defaultUserId(scenario: string): string {
  if (scenario === "chat-flooding") return "flood-test-user";
  if (scenario === "cross-posting") return "xpost-test-user";
  return `test-user-${Math.random().toString(36).slice(2, 6)}`;
}

async function handleVerifyQuery(args: ManageIlluminateSchemaType) {
  if (!args.query_id) return createResponse("query_id is required for verify-query.", true);
  return createResponse(JSON.stringify(await api.executeSavedQuery(args.query_id)));
}

async function handleCheckActionLog(args: ManageIlluminateSchemaType) {
  if (!args.decision_id)
    return createResponse("decision_id is required for check-action-log.", true);
  return createResponse(JSON.stringify(await api.getActionLog(args.decision_id)));
}

async function handleRawSnapshot(args: ManageIlluminateSchemaType) {
  if (!args.bo_id) return createResponse("bo_id is required for raw-snapshot.", true);

  const bo = (await api.getResource("business-object", args.bo_id)) as Record<string, unknown>;
  const fields = getQueryableFields(bo);
  if (fields.length === 0) {
    return createResponse(
      JSON.stringify({ error: "No queryable fields found in this Business Object." })
    );
  }

  return createResponse(
    JSON.stringify(
      await api.executeAdHocQuery(buildRawSnapshotPipeline(args.bo_id, fields, args.limit ?? 50))
    )
  );
}

async function handleAggregate(args: ManageIlluminateSchemaType) {
  if (!args.bo_id) return createResponse("bo_id is required for aggregate.", true);

  const bo = (await api.getResource("business-object", args.bo_id)) as Record<string, unknown>;
  const allFields = getQueryableFields(bo);
  if (allFields.length === 0) {
    return createResponse(
      JSON.stringify({ error: "No queryable fields found in this Business Object." })
    );
  }

  const groupByAliases: string[] =
    args.group_by ??
    allFields
      .filter(f => f.jsonFieldType === "TEXT")
      .slice(0, 2)
      .map(f => extractBodyKey(f.jsonPath));

  if (groupByAliases.length === 0) {
    return createResponse(
      JSON.stringify({
        error: "No TEXT fields found for grouping. Provide group_by with field aliases explicitly.",
      })
    );
  }

  return createResponse(
    JSON.stringify(
      await api.executeAdHocQuery(
        buildAggregatePipeline(args.bo_id, allFields, groupByAliases, args.limit ?? 50)
      )
    )
  );
}

async function handleFieldHealth(args: ManageIlluminateSchemaType) {
  if (!args.bo_id) return createResponse("bo_id is required for field-health.", true);

  const bo = (await api.getResource("business-object", args.bo_id)) as Record<string, unknown>;
  const allFields = getQueryableFields(bo);
  if (allFields.length === 0) {
    return createResponse(
      JSON.stringify({ error: "No queryable fields found in this Business Object." })
    );
  }

  const limit = args.limit ?? 50;
  const result = (await api.executeAdHocQuery(
    buildRawSnapshotPipeline(args.bo_id, allFields, limit)
  )) as Record<string, unknown>;
  const rows = (result.data as Array<Record<string, unknown>>) ?? [];

  const fieldHealth: Record<
    string,
    { jsonPath: string; populated: number; empty: number; total: number; sampleValues: unknown[] }
  > = {};
  for (const field of allFields) {
    const alias = extractBodyKey(field.jsonPath);
    const populated = rows.filter(
      row => row[alias] !== "" && row[alias] !== null && row[alias] !== undefined
    ).length;
    fieldHealth[field.name] = {
      jsonPath: field.jsonPath,
      populated,
      empty: rows.length - populated,
      total: rows.length,
      sampleValues: rows.slice(0, 3).map(row => row[alias]),
    };
  }

  return createResponse(
    JSON.stringify({
      businessObjectId: args.bo_id,
      rowsAnalyzed: rows.length,
      note: "Empty string fields indicate JSONPath mismatch. Ensure all field paths start with $.message.body.<field>",
      fieldHealth,
    })
  );
}

async function handleCustomQuery(args: ManageIlluminateSchemaType) {
  const pipelineData = (args.pipeline ?? args.data) as Record<string, unknown> | undefined;
  if (!pipelineData) {
    return createResponse(
      "pipeline is required for custom-query. Must include version='2.0': { version: '2.0', pipeline: { sources: [...], output: {...} } }.",
      true
    );
  }
  return createResponse(JSON.stringify(await api.executeAdHocQuery(pipelineData)));
}

// ─── Dispatch map ────────────────────────────────────────────────────────────

type OpHandler = (args: ManageIlluminateSchemaType) => Promise<HandlerResponse>;

const operationHandlers: Record<string, OpHandler> = {
  list: handleList,
  get: handleGet,
  create: handleCreate,
  update: handleUpdate,
  delete: handleDelete,
  activate: handleActivate,
  deactivate: handleDeactivate,
  "get-fields": handleGetFields,
  "execute-adhoc": handleExecuteAdhoc,
  "publish-fake-data": handlePublishFakeData,
  "verify-query": handleVerifyQuery,
  "check-action-log": handleCheckActionLog,
  "raw-snapshot": handleRawSnapshot,
  aggregate: handleAggregate,
  "field-health": handleFieldHealth,
  "custom-query": handleCustomQuery,
};

// ─── Main entry point ────────────────────────────────────────────────────────

export async function manageIlluminateHandler(args: ManageIlluminateSchemaType) {
  try {
    const handler = operationHandlers[args.operation];
    if (!handler) return createResponse(`Unknown operation: ${args.operation}`, true);
    log.debug(
      { operation: args.operation, resource: args.resource },
      "Handling Illuminate request"
    );
    return await handler(args);
  } catch (e) {
    log.error(
      { err: e, operation: args.operation, resource: args.resource },
      "Illuminate operation failed"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
