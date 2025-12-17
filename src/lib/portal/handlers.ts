import { createResponse, parseError } from "../utils";
import * as api from "./api";
import type { ManageAppsSchemaType, ManageKeysetsSchemaType } from "./types";

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
    console.error(e);
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
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
