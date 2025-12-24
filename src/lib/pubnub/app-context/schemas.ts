import { z } from "zod";
import { hasPubSubEnvKeys } from "../../utils";
import { PubNubConfigSchema } from "../schemas";

export const AppContextType = z
  .enum(["user", "channel", "membership"])
  .describe(
    'Type of App Context object: "user" for user metadata, "channel" for channel metadata, "membership" for user-channel relationships'
  );

export const AppContextOperation = z
  .enum(["get", "set", "remove", "getAll"])
  .describe(
    'Operation to perform: "get" to retrieve, "set" to create/update, "remove" to delete, "getAll" to list all'
  );

const CustomFieldsSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
  .describe("JSON object of key/value pairs with scalar values only (no arrays or objects)");

export const UserMetadataSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .max(2048)
      .describe("Name of the UUID. Must not be empty or consist only of whitespace.")
      .optional(),
    externalId: z
      .string()
      .max(2048)
      .describe("UUID's identifier in an external system.")
      .optional(),
    profileUrl: z
      .string()
      .url()
      .max(2048)
      .describe("URL for the UUID's profile picture.")
      .optional(),
    email: z.string().email().max(320).describe("The UUID's email address. ").optional(),
    type: z.string().max(50).describe("User type.").optional(),
    status: z.string().max(50).describe("User status.").optional(),
    custom: CustomFieldsSchema.optional(),
  })
  .strict()
  .describe("User metadata object");

export const ChannelMetadataSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .max(2048)
      .describe("The channel name. Must not be empty or consist only of whitespace.")
      .optional(),
    description: z.string().max(2048).describe("Description of the channel.").optional(),
    type: z.string().max(50).describe("Channel type.").optional(),
    status: z.string().max(50).describe("Channel status.").optional(),
    custom: CustomFieldsSchema.optional(),
  })
  .strict()
  .describe("Channel metadata object");

const ChannelRelationSchema = z.union([
  z.string().min(1).max(92).describe("Channel ID as a string"),
  z.object({
    id: z
      .string()
      .min(1)
      .max(92)
      .describe(
        "The channel ID. Must not be empty, and may contain up to 92 UTF-8 byte sequences. Prohibited characters: ,, /, \\, *, :, channel, non-printable ASCII control characters, and Unicode zero."
      ),
    custom: CustomFieldsSchema.optional().describe("Custom metadata for this membership"),
    status: z.string().max(50).describe("Membership status").optional(),
    type: z.string().max(50).describe("Membership type").optional(),
  }),
]);

const UUIDRelationSchema = z.union([
  z.string().min(1).max(92).describe("UUID as a string"),
  z.object({
    id: z
      .string()
      .min(1)
      .max(92)
      .describe(
        "The UUID. Must not be empty, and may contain up to 92 UTF-8 byte sequences. Prohibited characters: ,, /, \\, *, :, channel, non-printable ASCII control characters, and Unicode zero."
      ),
    custom: CustomFieldsSchema.optional().describe("Custom metadata for this member"),
    status: z.string().max(50).describe("Member status").optional(),
    type: z.string().max(50).describe("Member type").optional(),
  }),
]);

export const SetMembershipsDataSchema = z
  .object({
    channels: z
      .array(ChannelRelationSchema)
      .min(1)
      .describe(
        "Array of channels to add to membership. Can be strings (channel ID only) or objects with custom data, status, and type"
      ),
  })
  .strict()
  .describe("Data for setting user memberships to channels");

export const RemoveMembershipsDataSchema = z
  .object({
    channels: z
      .array(z.string().min(1).max(92))
      .min(1)
      .describe("Array of channel IDs to remove from membership"),
  })
  .strict()
  .describe("Data for removing user memberships from channels");

export const SetChannelMembersDataSchema = z
  .object({
    uuids: z
      .array(UUIDRelationSchema)
      .min(1)
      .describe(
        "Array of UUIDs to add as channel members. Can be strings (UUID only) or objects with custom data, status, and type"
      ),
  })
  .strict()
  .describe("Data for setting channel members");

export const RemoveChannelMembersDataSchema = z
  .object({
    uuids: z
      .array(z.string().min(1).max(92))
      .min(1)
      .describe("Array of UUIDs to remove from channel members"),
  })
  .strict()
  .describe("Data for removing channel members");

const BaseInclude = z
  .object({
    customFields: z.boolean().describe("Whether to include the Custom object in the response"),
  })
  .partial();

const TotalCount = z
  .object({
    totalCount: z
      .boolean()
      .describe("Whether to include the total count in the paginated response"),
  })
  .partial();

const StatusType = z
  .object({
    statusField: z.boolean().describe("Whether to include the status field in the response"),
    typeField: z.boolean().describe("Whether to include the type field in the response"),
  })
  .partial();

const ChannelRelated = z
  .object({
    channelFields: z
      .boolean()
      .describe("Whether to include fields for channel metadata in the response"),
    customChannelFields: z
      .boolean()
      .describe("Whether to include custom fields for channel metadata in the response"),
    channelStatusField: z
      .boolean()
      .describe("Whether to include the channel's status field in the response"),
    channelTypeField: z
      .boolean()
      .describe("Whether to include channel's type fields in the response"),
  })
  .partial();

const UUIDRelated = z
  .object({
    UUIDFields: z.boolean().describe("Whether to include fields for UUID metadata"),
    customUUIDFields: z.boolean().describe("Whether to include custom fields for UUID metadata"),
    UUIDStatusField: z
      .boolean()
      .describe("Whether to include the UUID's status field in the response"),
    UUIDTypeField: z.boolean().describe("Whether to include UUID's type fields in the response"),
  })
  .partial();

export const SimpleIncludeSchema = BaseInclude;

export const TotalCountCustomFieldsSchema = BaseInclude.extend(TotalCount.shape);

export const MembershipIncludeSchema = BaseInclude.extend(TotalCount.shape)
  .extend(ChannelRelated.shape)
  .extend(StatusType.shape);

export const ChannelMembersIncludeSchema = BaseInclude.extend(TotalCount.shape)
  .extend(UUIDRelated.shape)
  .extend(StatusType.shape);

export const ManageAppContextOptions = z
  .object({
    includeCustomFields: z.boolean().optional().describe("Include custom fields in response"),
    includeTotalCount: z.boolean().optional().describe("Include total count in paginated response"),
    includeStatusField: z
      .boolean()
      .optional()
      .describe("Include status field in membership or member responses"),
    includeTypeField: z
      .boolean()
      .optional()
      .describe("Include type field in membership or member responses"),
    includeChannelFields: z
      .boolean()
      .optional()
      .describe("Include channel fields in membership responses"),
    includeCustomChannelFields: z
      .boolean()
      .optional()
      .describe("Include custom channel fields in membership responses"),
    includeChannelStatusField: z
      .boolean()
      .optional()
      .describe("Include channel status field in membership responses"),
    includeChannelTypeField: z
      .boolean()
      .optional()
      .describe("Include channel type field in membership responses"),
    includeUuidFields: z
      .boolean()
      .optional()
      .describe("Include UUID fields in channel member responses"),
    includeCustomUuidFields: z
      .boolean()
      .optional()
      .describe("Include custom UUID fields in channel member responses"),
    includeUuidStatusField: z
      .boolean()
      .optional()
      .describe("Include UUID status field in channel member responses"),
    includeUuidTypeField: z
      .boolean()
      .optional()
      .describe("Include UUID type field in channel member responses"),
    filter: z.string().optional().describe("Filter expression for results"),
    sort: z.any().optional().describe('Sort criteria (e.g., {id: "asc", name: "desc"})'),
    limit: z.number().min(1).max(100).optional().describe("Number of objects to return (max 100)"),
    page: z
      .object({
        next: z.string().optional(),
        prev: z.string().optional(),
      })
      .optional()
      .describe("Pagination object from previous response"),
    ifMatchesEtag: z.string().optional().describe("ETag for conditional updates"),
  })
  .optional()
  .describe("Optional parameters for the operation");

export const ManageAppContextSchema = z
  .object({
    type: AppContextType,
    operation: AppContextOperation,
    id: z
      .string()
      .describe(
        "Identifier: UUID (defaults to the SDK-configured user when omitted) for users and membership operations, channel metadata id (for example, team.red) for channel metadata and channel member operations"
      ),
    data: z
      .union([
        UserMetadataSchema,
        ChannelMetadataSchema,
        SetMembershipsDataSchema,
        RemoveMembershipsDataSchema,
        SetChannelMembersDataSchema,
        RemoveChannelMembersDataSchema,
      ])
      .optional()
      .describe(
        "Data object for set/remove operations. For users: {name, email, externalId, profileUrl, custom}. For channels: {name, description, custom}. For memberships: {channels: [...]} — set operations accept strings or objects with {id, custom, status, type}, while remove operations accept only string channel IDs. For channel members: {uuids: [...]} — set operations accept strings or objects with {id, custom, status, type}, while remove operations accept only string UUIDs."
      ),
    options: ManageAppContextOptions,
  })
  .extend(hasPubSubEnvKeys() ? {} : PubNubConfigSchema.shape);
