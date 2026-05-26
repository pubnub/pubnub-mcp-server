import type z from "zod";
import type {
  GetBestPracticesSchema,
  GetChatSdkDocumentationSchemaRefined,
  GetGeneralMigrationGuideSchemaRefined,
  GetSdkDocumentationSchemaRefined,
  GetSdkMigrationGuideSchemaRefined,
  HowToSchema,
} from "./schemas";

export type GetChatSdkDocumentationSchemaType = z.infer<
  typeof GetChatSdkDocumentationSchemaRefined
>;
export type GetSdkDocumentationSchemaType = z.infer<typeof GetSdkDocumentationSchemaRefined>;
export type HowToSchemaType = z.infer<typeof HowToSchema>;
export type GetBestPracticesSchemaType = z.infer<typeof GetBestPracticesSchema>;
export type GetSdkMigrationGuideSchemaType = z.infer<typeof GetSdkMigrationGuideSchemaRefined>;
export type GetGeneralMigrationGuideSchemaType = z.infer<
  typeof GetGeneralMigrationGuideSchemaRefined
>;

export type DocumentationApiResponse = {
  content: string;
  metadata: {
    title: string;
    source_url: string;
    updated_at: string;
  };
  hint?: string;
};
