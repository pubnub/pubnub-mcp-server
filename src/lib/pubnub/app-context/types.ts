import type { AppContext } from "pubnub";
import type z from "zod";
import type { ApiParams, HandlerArgs } from "../types";
import type { ManageAppContextSchema } from "./schemas";

export type ManageAppContextSchemaType = z.infer<typeof ManageAppContextSchema>;

// Type for handler args where keys are optional (may come from env)
export type ManageAppContextHandlerArgs = HandlerArgs<ManageAppContextSchemaType>;

// Type for API params where keys are ALWAYS required (withEnvKeys guarantees this)
export type ManageAppContextParams = ApiParams<ManageAppContextSchemaType>;

export type MetadataSortingOptions = AppContext.MetadataSortingOptions<
  AppContext.UUIDMetadataObject<AppContext.CustomData>
>;

export type ChannelMetadataSortingOptions = AppContext.MetadataSortingOptions<
  AppContext.ChannelMetadataObject<AppContext.CustomData>
>;

export type MembershipsSortingOptions = AppContext.MembershipsSortingOptions;

export type MembershipData =
  | AppContext.SetMembershipsParameters<AppContext.CustomData>
  | AppContext.RemoveMembershipsParameters
  | AppContext.SetChannelMembersParameters<AppContext.CustomData>
  | undefined;

export type IncludeKey =
  | "customFields"
  | "totalCount"
  | "statusField"
  | "typeField"
  | "channelFields"
  | "customChannelFields"
  | "channelStatusField"
  | "channelTypeField"
  | "UUIDFields"
  | "customUUIDFields"
  | "UUIDStatusField"
  | "UUIDTypeField";

export type ManageAppContextOptions = NonNullable<ManageAppContextParams["options"]>;

export type OptionalBooleanRecord<K extends IncludeKey> = {
  [P in K]?: boolean;
};
