import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Resource } from "@modelcontextprotocol/sdk/types";
import {
  getChatSDKDocumentationResourceHandler,
  getSDKDocumentationResourceHandler,
} from "./lib/docs/handlers";
import { chatSdkLanguageToFeatures, sdkLanguageToFeatures } from "./lib/docs/schemas";

/**
 * Factory function to create a ResourceTemplate for language/feature-based documentation
 */
function createDocsResourceTemplate(
  uriScheme: string,
  languageToFeatures: Record<string, readonly string[]>,
  nameSuffix = "docs"
) {
  return new ResourceTemplate(`pubnub-docs://${uriScheme}/{language}/{feature}`, {
    list: () => {
      const resources: Resource[] = [];

      for (const [language, features] of Object.entries(languageToFeatures)) {
        for (const feature of features) {
          resources.push({
            uri: `pubnub-docs://${uriScheme}/${language}/${feature}`,
            name: `${language}_${feature}_${nameSuffix}`,
            description: `PubNub ${uriScheme.replace("-", " ")} documentation for ${feature} in ${language}`,
            mimeType: "application/json",
          });
        }
      }

      return { resources };
    },
    complete: {
      language: () => Object.keys(languageToFeatures),
      feature: () => Array.from(new Set(Object.values(languageToFeatures).flat())),
    },
  });
}

const sdkDocsResource = {
  name: "pubnub_sdk_docs",
  template: createDocsResourceTemplate("sdk", sdkLanguageToFeatures, "docs"),
  definition: {
    title: "PubNub SDK Documentation",
    description:
      "Access PubNub SDK documentation for various programming languages and features. URI format: pubnub-docs://sdk/{language}/{feature}",
    mimeType: "application/json",
  },
  handler: getSDKDocumentationResourceHandler,
};

const chatSdkDocsResource = {
  name: "pubnub_chat_sdk_docs",
  template: createDocsResourceTemplate("chat-sdk", chatSdkLanguageToFeatures, "chat_docs"),
  definition: {
    title: "PubNub Chat SDK Documentation",
    description:
      "Access PubNub Chat SDK documentation for various programming languages and features. URI format: pubnub-docs://chat-sdk/{language}/{feature}",
    mimeType: "application/json",
  },
  handler: getChatSDKDocumentationResourceHandler,
};

export const resources = [sdkDocsResource, chatSdkDocsResource];
