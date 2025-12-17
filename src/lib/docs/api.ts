import type { z } from "zod";
import {
  GetBestPracticesSchema,
  GetChatSdkDocumentationSchemaRefined,
  GetSdkDocumentationSchemaRefined,
  HowToSchema,
} from "./schemas";
import type {
  GetBestPracticesSchemaType,
  DocumentationApiResponse,
  GetChatSdkDocumentationSchemaType,
  GetSdkDocumentationSchemaType,
  HowToSchemaType,
} from "./types";

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
    throw new Error(errors);
  }

  const response = await fetch(baseUrl + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch SDK documentation: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as DocumentationApiResponse;
}

export async function getSdkDocumentation(
  language: GetSdkDocumentationSchemaType["language"],
  feature: GetSdkDocumentationSchemaType["feature"]
) {
  const path = `/sdk?feature=${feature}&language=${language}`;

  return await makeDocsRequest<GetSdkDocumentationSchemaType>({
    path,
    schema: GetSdkDocumentationSchemaRefined,
    args: {
      language,
      feature,
    },
  });
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
