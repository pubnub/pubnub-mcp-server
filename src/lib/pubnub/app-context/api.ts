import type PubNub from "pubnub";
import type { AppContext } from "pubnub";
import { getPubNubClient } from "../api";
import type {
  ChannelMetadataSortingOptions,
  IncludeKey,
  ManageAppContextOptions,
  ManageAppContextParams,
  MembershipData,
  MembershipsSortingOptions,
  MetadataSortingOptions,
  OptionalBooleanRecord,
} from "./types";

export type ManageAppContextResult =
  | Awaited<ReturnType<typeof handleUserOperation>>
  | Awaited<ReturnType<typeof handleChannelOperation>>
  | Awaited<ReturnType<typeof handleMembershipOperation>>;

const SIMPLE_INCLUDE_KEYS = ["customFields"] as const;
const TOTAL_COUNT_CUSTOM_FIELDS_KEYS = ["customFields", "totalCount"] as const;
const MEMBERSHIP_INCLUDE_KEYS = [
  "customFields",
  "totalCount",
  "statusField",
  "typeField",
  "channelFields",
  "customChannelFields",
  "channelStatusField",
  "channelTypeField",
] as const;
const CHANNEL_MEMBERS_INCLUDE_KEYS = [
  "customFields",
  "totalCount",
  "statusField",
  "typeField",
  "UUIDFields",
  "customUUIDFields",
  "UUIDStatusField",
  "UUIDTypeField",
] as const;

const OPTION_FLAG_TO_INCLUDE_KEY: Partial<Record<keyof ManageAppContextOptions, IncludeKey>> = {
  includeCustomFields: "customFields",
  includeTotalCount: "totalCount",
  includeStatusField: "statusField",
  includeTypeField: "typeField",
  includeChannelFields: "channelFields",
  includeCustomChannelFields: "customChannelFields",
  includeChannelStatusField: "channelStatusField",
  includeChannelTypeField: "channelTypeField",
  includeUuidFields: "UUIDFields",
  includeCustomUuidFields: "customUUIDFields",
  includeUuidStatusField: "UUIDStatusField",
  includeUuidTypeField: "UUIDTypeField",
};

function buildIncludeOptions<K extends IncludeKey>(
  options: ManageAppContextParams["options"],
  allowedKeys: readonly K[]
): OptionalBooleanRecord<K> | undefined {
  if (!options) {
    return undefined;
  }

  const allowedSet = new Set<string>(allowedKeys.map(key => key as string));
  const include: OptionalBooleanRecord<K> = {};

  (
    Object.entries(OPTION_FLAG_TO_INCLUDE_KEY) as Array<[keyof ManageAppContextOptions, IncludeKey]>
  ).forEach(([optionKey, includeKey]) => {
    const value = options[optionKey];
    if (typeof value === "boolean" && allowedSet.has(includeKey)) {
      include[includeKey as K] = value;
    }
  });

  return Object.keys(include).length > 0 ? include : undefined;
}

function buildPaginatedParams<T>(options?: ManageAppContextParams["options"]): {
  filter?: string;
  sort?: T;
  limit?: number;
  page?: {
    next?: string;
    prev?: string;
  };
} {
  return {
    ...(options?.filter && { filter: options.filter }),
    ...(options?.sort && { sort: options.sort }),
    ...(options?.limit !== undefined && { limit: options.limit }),
    ...(options?.page && { page: options.page }),
  };
}

async function handleUserOperation(
  pubnub: PubNub,
  operation: ManageAppContextParams["operation"],
  id: string,
  data: AppContext.UUIDMetadata<AppContext.CustomData> | undefined,
  options: ManageAppContextParams["options"]
) {
  switch (operation) {
    case "get":
      return pubnub.objects.getUUIDMetadata({
        uuid: id,
        ...(() => {
          const include = buildIncludeOptions(options, SIMPLE_INCLUDE_KEYS);
          return include ? { include } : {};
        })(),
      });

    case "set":
      if (!data) {
        throw new Error("data is required for set operation");
      }
      return pubnub.objects.setUUIDMetadata({
        uuid: id,
        data: data,
        ...(() => {
          const include = buildIncludeOptions(options, SIMPLE_INCLUDE_KEYS);
          return include ? { include } : {};
        })(),
        ...(options?.ifMatchesEtag && { ifMatchesEtag: options.ifMatchesEtag }),
      });

    case "remove":
      return pubnub.objects.removeUUIDMetadata({ uuid: id });

    case "getAll":
      return pubnub.objects.getAllUUIDMetadata({
        ...buildPaginatedParams<MetadataSortingOptions>(options),
        ...(() => {
          const include = buildIncludeOptions(options, TOTAL_COUNT_CUSTOM_FIELDS_KEYS);
          return include ? { include } : {};
        })(),
      });

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

async function handleChannelOperation(
  pubnub: PubNub,
  operation: ManageAppContextParams["operation"],
  id: string,
  data: AppContext.ChannelMetadata<AppContext.CustomData> | undefined,
  options: ManageAppContextParams["options"]
) {
  switch (operation) {
    case "get":
      return pubnub.objects.getChannelMetadata({
        channel: id,
        ...(() => {
          const include = buildIncludeOptions(options, SIMPLE_INCLUDE_KEYS);
          return include ? { include } : {};
        })(),
      });

    case "set":
      if (!data) {
        throw new Error("data is required for set operation");
      }
      return pubnub.objects.setChannelMetadata({
        channel: id,
        data: data,
        ...(() => {
          const include = buildIncludeOptions(options, SIMPLE_INCLUDE_KEYS);
          return include ? { include } : {};
        })(),
        ...(options?.ifMatchesEtag && { ifMatchesEtag: options.ifMatchesEtag }),
      });

    case "remove":
      return pubnub.objects.removeChannelMetadata({ channel: id });

    case "getAll":
      return pubnub.objects.getAllChannelMetadata({
        ...buildPaginatedParams<ChannelMetadataSortingOptions>(options),
        ...(() => {
          const include = buildIncludeOptions(options, TOTAL_COUNT_CUSTOM_FIELDS_KEYS);
          return include ? { include } : {};
        })(),
      });

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

async function handleMembershipOperation(
  pubnub: PubNub,
  operation: ManageAppContextParams["operation"],
  id: string,
  data: MembershipData,
  options: ManageAppContextParams["options"]
) {
  const membershipInclude = buildIncludeOptions(options, MEMBERSHIP_INCLUDE_KEYS);
  const channelMemberInclude = buildIncludeOptions(options, CHANNEL_MEMBERS_INCLUDE_KEYS);

  switch (operation) {
    case "get":
      return pubnub.objects.getMemberships({
        uuid: id,
        ...buildPaginatedParams<MembershipsSortingOptions>(options),
        ...(membershipInclude && {
          include: membershipInclude,
        }),
      });

    case "set": {
      if (!data) {
        throw new Error("data is required for set operation");
      }
      // For set operations, data can contain either channels or uuids
      const setData = data as
        | AppContext.SetMembershipsParameters<AppContext.CustomData>
        | AppContext.SetChannelMembersParameters<AppContext.CustomData>;
      if ("channels" in setData) {
        // Setting user memberships to channels
        return pubnub.objects.setMemberships({
          uuid: id,
          channels: setData.channels,
          ...(membershipInclude && {
            include: membershipInclude,
          }),
        });
      }
      if ("uuids" in setData) {
        // Setting channel members (users to a channel)
        return pubnub.objects.setChannelMembers({
          channel: id,
          uuids: setData.uuids,
          ...(channelMemberInclude && {
            include: channelMemberInclude,
          }),
        });
      }
      throw new Error(
        "data.channels or data.uuids is required for set operation based on whether setting user memberships or channel members"
      );
    }
    case "remove": {
      if (!data) {
        throw new Error("data is required for remove operation");
      }
      // For remove operations, data can contain either channels or uuids
      const removeData = data as
        | AppContext.RemoveMembershipsParameters
        | AppContext.RemoveMembersParameters;
      if ("channels" in removeData) {
        // Removing user memberships from channels
        return pubnub.objects.removeMemberships({
          uuid: id,
          channels: removeData.channels,
          ...(membershipInclude && {
            include: membershipInclude,
          }),
        });
      }
      if ("uuids" in removeData) {
        // Removing channel members (users from a channel)
        return pubnub.objects.removeChannelMembers({
          channel: id,
          uuids: removeData.uuids,
          ...(channelMemberInclude && {
            include: channelMemberInclude,
          }),
        });
      }
      throw new Error(
        "data.channels or data.uuids is required for remove operation based on whether removing user memberships or channel members"
      );
    }
    case "getAll":
      // getAll returns channel members when id is a channel
      return pubnub.objects.getChannelMembers({
        channel: id,
        ...buildPaginatedParams(options),
        ...(channelMemberInclude && {
          include: channelMemberInclude,
        }),
      });

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

export async function manageAppContext(args: ManageAppContextParams) {
  const { type, operation, id, publishKey, subscribeKey, data, options } = args;

  const pubnub = getPubNubClient({ publishKey, subscribeKey });

  switch (type) {
    case "user":
      return handleUserOperation(
        pubnub,
        operation,
        id,
        data as AppContext.UUIDMetadata<AppContext.CustomData> | undefined,
        options
      );

    case "channel":
      return handleChannelOperation(
        pubnub,
        operation,
        id,
        data as AppContext.ChannelMetadata<AppContext.CustomData> | undefined,
        options
      );

    case "membership":
      return handleMembershipOperation(
        pubnub,
        operation,
        id,
        data as
          | AppContext.SetMembershipsParameters<AppContext.CustomData>
          | AppContext.RemoveMembershipsParameters
          | AppContext.SetChannelMembersParameters<AppContext.CustomData>
          | undefined,
        options
      );

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
