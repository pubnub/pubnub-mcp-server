import type { z } from "zod";
import type { ManageIlluminateSchema } from "./schemas.js";

export type ManageIlluminateSchemaType = z.infer<typeof ManageIlluminateSchema>;

export const RESOURCE_PATH: Record<string, string> = {
  "business-object": "business-objects",
  metric: "metrics",
  query: "queries",
  decision: "decisions",
  dashboard: "dashboards",
};

export interface IlluminateField {
  id?: string;
  name: string;
  source: "JSONPATH" | "DERIVED";
  jsonPath?: string;
  jsonFieldType?: "TEXT" | "TEXT_LONG" | "NUMERIC" | "TIMESTAMP" | "BOOLEAN";
}
