import { get_encoding, get_encoding_name_for_model, type Tiktoken } from "tiktoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getChatSdkDocumentation, getSdkDocumentation } from "./api";
import { chatSdkLanguageToFeatures, sdkLanguageToFeatures } from "./schemas";

const TOKEN_LIMIT = 20_000;

let encoding: Tiktoken;

function calculateTokenCounts(text: string) {
  const openAiTokens = encoding.encode(text).length;

  return {
    openAiTokens,
  } as const;
}

async function verifyDocumentationTokens<L extends string, F extends string>(
  label: string,
  mapping: Record<string, readonly string[]>,
  fetcher: (language: L, feature: F) => Promise<{ content: string }>
) {
  const failures: string[] = [];

  for (const [language, features] of Object.entries(mapping)) {
    for (const feature of features) {
      const docs = await fetcher(language as L, feature as F);

      expect(docs?.content, `${label} ${language}/${feature} returned empty content`).toBeTruthy();

      const { openAiTokens } = calculateTokenCounts(docs.content);

      if (openAiTokens > TOKEN_LIMIT) {
        failures.push(
          `${label} ${language}/${feature} exceeds OpenAI token limit: ${openAiTokens} > ${TOKEN_LIMIT}`
        );
      }
    }
  }

  const failureMessage =
    failures.length > 0 ? `Token limit violations detected:\n${failures.join("\n")}` : undefined;

  expect(failures, failureMessage).toHaveLength(0);
}

describe("Docs API token limits", () => {
  beforeAll(() => {
    encoding = get_encoding(get_encoding_name_for_model("gpt-5"));
  });

  afterAll(() => {
    encoding.free();
  });

  it(
    "ensures all SDK documentation responses stay within token limits",
    { timeout: 120_000 },
    async () => {
      await verifyDocumentationTokens("SDK", sdkLanguageToFeatures, getSdkDocumentation);
    }
  );

  it(
    "ensures all Chat SDK documentation responses stay within token limits",
    { timeout: 120_000 },
    async () => {
      await verifyDocumentationTokens(
        "Chat SDK",
        chatSdkLanguageToFeatures,
        getChatSdkDocumentation
      );
    }
  );
});
