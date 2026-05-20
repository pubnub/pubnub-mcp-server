import { createLogger } from "../logger";
import { createResponse, parseError } from "../utils";
import {
  getBestPractices,
  getChatSdkDocumentation,
  getGeneralMigrationGuide,
  getHowTo,
  getSdkDocumentation,
  getSdkMigrationGuide,
} from "./api";
import type {
  DocumentationApiResponse,
  GetChatSdkDocumentationSchemaType,
  GetGeneralMigrationGuideSchemaType,
  GetSdkDocumentationSchemaType,
  GetSdkMigrationGuideSchemaType,
  HowToSchemaType,
} from "./types";

const log = createLogger("docs:handlers");

/**
 * Factory function to create a documentation resource handler
 */
function createDocumentationResourceHandler<T extends { language: string; feature: string }>(
  uriScheme: string,
  fetchFn: (language: T["language"], feature: T["feature"]) => Promise<DocumentationApiResponse>
) {
  return async (uri: URL, args: T) => {
    const { language, feature } = args;

    if (!language || !feature) {
      throw new Error(
        `Invalid URI format. Expected: pubnub-docs://${uriScheme}/<language>/<feature>, got: ${uri.href}`
      );
    }
    try {
      const docs = await fetchFn(language, feature);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(docs, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch documentation for ${language}/${feature}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
}

export const getSDKDocumentationResourceHandler =
  createDocumentationResourceHandler<GetSdkDocumentationSchemaType>("sdk", getSdkDocumentation);

export const getChatSDKDocumentationResourceHandler =
  createDocumentationResourceHandler<GetChatSdkDocumentationSchemaType>(
    "chat-sdk",
    getChatSdkDocumentation
  );

export async function getSDKDocumentationHandler(args: GetSdkDocumentationSchemaType) {
  try {
    const result = await getSdkDocumentation(args.language, args.feature);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error(
      { err: e, language: args.language, feature: args.feature },
      "Failed to get SDK documentation"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getChatSDKDocumentationHandler(args: GetChatSdkDocumentationSchemaType) {
  try {
    const result = await getChatSdkDocumentation(args.language, args.feature);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error(
      { err: e, language: args.language, feature: args.feature },
      "Failed to get Chat SDK documentation"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function howToHandler(args: HowToSchemaType) {
  try {
    const result = await getHowTo(args.slug);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error({ err: e, slug: args.slug }, "Failed to get how-to guide");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getBestPracticesHandler() {
  try {
    const result = await getBestPractices();
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error({ err: e }, "Failed to get best practices");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getSdkMigrationGuideHandler(args: GetSdkMigrationGuideSchemaType) {
  try {
    const result = await getSdkMigrationGuide(args.language, args.version);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error(
      { err: e, language: args.language, version: args.version },
      "Failed to get SDK migration guide"
    );
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getGeneralMigrationGuideHandler(args: GetGeneralMigrationGuideSchemaType) {
  try {
    const result = await getGeneralMigrationGuide(args.slug);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    log.error({ err: e, slug: args.slug }, "Failed to get general migration guide");
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
