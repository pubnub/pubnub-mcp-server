import type { z } from "zod";
import { createLogger } from "../logger";
import {
  GetBestPracticesSchema,
  GetChatSdkDocumentationSchemaRefined,
  GetGeneralMigrationGuideSchemaRefined,
  GetSdkDocumentationSchemaRefined,
  GetSdkMigrationGuideSchemaRefined,
  HowToSchema,
} from "./schemas";
import type {
  DocumentationApiResponse,
  GetBestPracticesSchemaType,
  GetChatSdkDocumentationSchemaType,
  GetGeneralMigrationGuideSchemaType,
  GetSdkDocumentationSchemaType,
  GetSdkMigrationGuideSchemaType,
  HowToSchemaType,
} from "./types";

const log = createLogger("docs:api");

const baseUrl = process.env.SDK_DOCS_API_URL ?? "https://docs.pubnubtools.com/api/v1";

type MakeDocsRequestProps<T> = {
  path: string;
  schema: z.ZodSchema<T>;
  args: T;
  options?: RequestInit;
};

async function makeDocsRequest<T>({
  path,
  schema,
  args,
  options = {},
}: MakeDocsRequestProps<T>): Promise<DocumentationApiResponse> {
  const { success: isValid, error } = schema.safeParse(args);
  if (!isValid) {
    const errors = error?.issues.map(e => e.message).join(", ");
    log.warn({ errors, path }, "Documentation request validation failed");
    throw new Error(errors);
  }

  log.debug({ path }, "Documentation API request");

  const response = await fetch(baseUrl + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    log.error({ status: response.status, path }, "Documentation API request failed");
    throw new Error(`Failed to fetch SDK documentation: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as DocumentationApiResponse;
}

const pythonEcosystemHints: Partial<Record<GetSdkDocumentationSchemaType["language"], string>> = {
  "python-sync":
    "IMPORTANT: This is the SYNCHRONOUS Python SDK. Before answering or generating code, ALWAYS ask the customer to confirm whether they need the sync (python-sync) or async (python-asyncio) version of the SDK, then use the matching Resource!",
  "python-asyncio":
    "IMPORTANT: This is the ASYNCHRONOUS (asyncio) Python SDK. Before answering or generating code, ALWAYS ask the customer to confirm whether they need the sync (python-sync) or async (python-asyncio) version of the SDK, then use the matching Resource!",
};

const sdkLanguageApiAliases: Partial<Record<GetSdkDocumentationSchemaType["language"], string>> = {
  "python-sync": "python",
  "python-asyncio": "asyncio",
};

export async function getSdkDocumentation(
  language: GetSdkDocumentationSchemaType["language"],
  feature: GetSdkDocumentationSchemaType["feature"]
) {
  const apiLanguage = sdkLanguageApiAliases[language] ?? language;
  const path = `/sdk?feature=${feature}&language=${apiLanguage}`;

  const response = await makeDocsRequest<GetSdkDocumentationSchemaType>({
    path,
    schema: GetSdkDocumentationSchemaRefined,
    args: {
      language,
      feature,
    },
  });

  const hint = pythonEcosystemHints[language];
  if (hint) {
    return { ...response, hint };
  }

  return response;
}

export async function getChatSdkDocumentation(
  language: GetChatSdkDocumentationSchemaType["language"],
  feature: GetChatSdkDocumentationSchemaType["feature"]
) {
  const path = `/chat-sdk?feature=${feature}&language=${language}`;

  return await makeDocsRequest<GetChatSdkDocumentationSchemaType>({
    path,
    schema: GetChatSdkDocumentationSchemaRefined,
    args: {
      language,
      feature,
    },
  });
}

export async function getHowTo(slug: HowToSchemaType["slug"]) {
  const path = `/how-to?slug=${slug}`;

  return await makeDocsRequest<HowToSchemaType>({
    path,
    schema: HowToSchema,
    args: {
      slug,
    },
  });
}

export async function getBestPractices() {
  const path = "/best-practice";

  return await makeDocsRequest<GetBestPracticesSchemaType>({
    path,
    schema: GetBestPracticesSchema,
    args: {},
  });
}

export async function getSdkMigrationGuide(
  language: GetSdkMigrationGuideSchemaType["language"],
  version: GetSdkMigrationGuideSchemaType["version"]
) {
  const path = `/migration-guide?language=${language}&version=${version}`;

  return await makeDocsRequest<GetSdkMigrationGuideSchemaType>({
    path,
    schema: GetSdkMigrationGuideSchemaRefined,
    args: { language, version },
  });
}

export async function getGeneralMigrationGuide(slug: GetGeneralMigrationGuideSchemaType["slug"]) {
  const path = `/general-migration-guide?slug=${slug}`;

  return await makeDocsRequest<GetGeneralMigrationGuideSchemaType>({
    path,
    schema: GetGeneralMigrationGuideSchemaRefined,
    args: { slug },
  });
}
