import type z from "zod";
import type {
  KeysetConfigSchema,
  ManageAppsSchema,
  ManageKeysetsSchema,
  CreateAppDataSchema,
  UpdateAppDataSchema,
  CreateKeysetDataSchema,
  UpdateKeysetDataSchema,
  ListKeysetDataSchema,
} from "./schemas";

// Inferred types from schemas
export type ManageKeysetsSchemaType = z.infer<typeof ManageKeysetsSchema>;
export type ManageAppsSchemaType = z.infer<typeof ManageAppsSchema>;
export type KeysetConfig = z.infer<typeof KeysetConfigSchema>;

// Inferred data types for operations
export type CreateAppData = z.infer<typeof CreateAppDataSchema>;
export type UpdateAppData = z.infer<typeof UpdateAppDataSchema>;
export type CreateKeysetData = z.infer<typeof CreateKeysetDataSchema>;
export type UpdateKeysetData = z.infer<typeof UpdateKeysetDataSchema>;
export type ListKeysetData = z.infer<typeof ListKeysetDataSchema>;
