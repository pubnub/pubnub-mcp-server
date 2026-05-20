import { createLogger } from "../logger";
import { createResponse, parseError } from "../utils";
import * as api from "./api";
import type {
  ManageAppsSchemaType,
  ManageKeysetsSchemaType,
  UsageMetricsV2SchemaType,
} from "./types";

const log = createLogger("portal:handlers");

export async function manageAppsHandler(args: ManageAppsSchemaType) {
  try {
    switch (args.operation) {
      case "list": {
        const result = await api.listApps();
        return createResponse(JSON.stringify(result));
      }

      case "create": {
        const result = await api.createApp(args.data.name);
        return createResponse(JSON.stringify(result));
      }

      case "update": {
        await api.updateApp(args.data.id, args.data.name);
        return createResponse(JSON.stringify({ message: "App updated successfully" }));
      }
    }
  } catch (e) {
    log.error({ err: e, operation: args.operation }, "Failed to manage apps");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function manageKeysetsHandler(args: ManageKeysetsSchemaType) {
  try {
    switch (args.operation) {
      case "get": {
        const result = await api.getKeyset(args.data.id);
        return createResponse(JSON.stringify(result));
      }

      case "list": {
        const result = await api.listKeysets(args.data?.appId);
        return createResponse(JSON.stringify(result));
      }

      case "create": {
        const createRequest: api.CreateKeysetRequest = {
          name: args.data.name,
          type: args.data.type,
          config: args.data.config,
        };
        if (args.data.appId) {
          createRequest.appId = args.data.appId;
        }

        const result = await api.createKeyset(createRequest);
        return createResponse(JSON.stringify(result));
      }

      case "update": {
        await api.updateKeysetConfig(args.data.id, args.data.config);
        return createResponse("Keyset updated successfully");
      }
    }
  } catch (e) {
    log.error({ err: e, operation: args.operation }, "Failed to manage keysets");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getUsageMetricsHandler(args: UsageMetricsV2SchemaType) {
  try {
    const result = await api.getUsageMetrics({
      entityType: args.entityType,
      entityId: args.entityId,
      from: args.from,
      to: args.to,
      metrics: args.metrics,
    });
    return createResponse(JSON.stringify(result));
  } catch (e) {
    log.error(
      { err: e, entityType: args.entityType, entityId: args.entityId },
      "Failed to get usage metrics"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
