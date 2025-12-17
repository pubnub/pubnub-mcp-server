import { createResponse, parseError } from "../utils";
import { getBestPractices, getChatSdkDocumentation, getHowTo, getSdkDocumentation } from "./api";
import type {
  DocumentationApiResponse,
  GetChatSdkDocumentationSchemaType,
  GetSdkDocumentationSchemaType,
  HowToSchemaType,
} from "./types";

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
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getChatSDKDocumentationHandler(args: GetChatSdkDocumentationSchemaType) {
  try {
    const result = await getChatSdkDocumentation(args.language, args.feature);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function howToHandler(args: HowToSchemaType) {
  try {
    const result = await getHowTo(args.slug);
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}

export async function getBestPracticesHandler() {
  try {
    const result = await getBestPractices();
    return createResponse(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
    return createResponse(JSON.stringify(parseError(e)), true);
  }
}
