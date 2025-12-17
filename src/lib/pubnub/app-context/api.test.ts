import { beforeEach, describe, expect, it, vi } from "vitest";
import { manageAppContext } from "./api";
import type { ManageAppContextParams } from "./types";

const { mockPubnub, mockGetPubNubClient } = vi.hoisted(() => {
  const createAsyncMock = () => vi.fn().mockResolvedValue({});

  const pubnub = {
    objects: {
      getUUIDMetadata: createAsyncMock(),
      setUUIDMetadata: createAsyncMock(),
      removeUUIDMetadata: createAsyncMock(),
      getAllUUIDMetadata: createAsyncMock(),
      getChannelMetadata: createAsyncMock(),
      setChannelMetadata: createAsyncMock(),
      removeChannelMetadata: createAsyncMock(),
      getAllChannelMetadata: createAsyncMock(),
      getMemberships: createAsyncMock(),
      setMemberships: createAsyncMock(),
      removeMemberships: createAsyncMock(),
      setChannelMembers: createAsyncMock(),
      removeChannelMembers: createAsyncMock(),
      getChannelMembers: createAsyncMock(),
    },
  };

  return {
    mockPubnub: pubnub,
    mockGetPubNubClient: vi.fn(() => pubnub),
  };
});

vi.mock("../api", () => ({
  getPubNubClient: mockGetPubNubClient,
}));

const baseArgs: ManageAppContextParams = {
  type: "user",
  operation: "get",
  id: "user-123",
  publishKey: "pub-c-test-key",
  subscribeKey: "sub-c-test-key",
};

describe("manageAppContext", () => {
  beforeEach(() => {
    mockGetPubNubClient.mockClear();
    Object.values(mockPubnub.objects).forEach(mockFn => {
      mockFn.mockClear();
    });
  });

  it("fetches user metadata with include options", async () => {
    await manageAppContext({
      ...baseArgs,
      options: { includeCustomFields: true },
    });

    expect(mockPubnub.objects.getUUIDMetadata).toHaveBeenCalledWith({
      uuid: "user-123",
      include: { customFields: true },
    });
  });

  it("sets user metadata with include options and etag", async () => {
    await manageAppContext({
      ...baseArgs,
      operation: "set",
      data: { name: "Jane Doe" },
      options: { includeCustomFields: true, ifMatchesEtag: "etag-1" },
    });

    expect(mockPubnub.objects.setUUIDMetadata).toHaveBeenCalledWith({
      uuid: "user-123",
      data: { name: "Jane Doe" },
      include: { customFields: true },
      ifMatchesEtag: "etag-1",
    });
  });

  it("lists channel metadata with pagination and include", async () => {
    await manageAppContext({
      ...baseArgs,
      type: "channel",
      operation: "getAll",
      options: {
        includeCustomFields: true,
        includeTotalCount: true,
        filter: "name LIKE '*Team'",
        limit: 25,
        sort: { name: "asc" },
        page: { next: "cursor" },
      },
    });

    expect(mockPubnub.objects.getAllChannelMetadata).toHaveBeenCalledWith({
      filter: "name LIKE '*Team'",
      limit: 25,
      sort: { name: "asc" },
      page: { next: "cursor" },
      include: { customFields: true, totalCount: true },
    });
  });

  it("sets memberships for a user with include options", async () => {
    await manageAppContext({
      ...baseArgs,
      type: "membership",
      operation: "set",
      data: { channels: ["team.blue"] },
      options: { includeChannelFields: true },
    });

    expect(mockPubnub.objects.setMemberships).toHaveBeenCalledWith({
      uuid: "user-123",
      channels: ["team.blue"],
      include: { channelFields: true },
    });
    expect(mockPubnub.objects.setChannelMembers).not.toHaveBeenCalled();
  });

  it("sets channel members with UUID include options", async () => {
    await manageAppContext({
      ...baseArgs,
      type: "membership",
      operation: "set",
      id: "team.blue",
      data: { uuids: ["user-999"] },
      options: { includeUuidFields: true },
    });

    expect(mockPubnub.objects.setChannelMembers).toHaveBeenCalledWith({
      channel: "team.blue",
      uuids: ["user-999"],
      include: { UUIDFields: true },
    });
    expect(mockPubnub.objects.setMemberships).not.toHaveBeenCalled();
  });

  it("removes channel members when uuids are provided", async () => {
    await manageAppContext({
      ...baseArgs,
      type: "membership",
      operation: "remove",
      id: "team.blue",
      data: { uuids: ["user-888"] },
      options: { includeUuidFields: true },
    });

    expect(mockPubnub.objects.removeChannelMembers).toHaveBeenCalledWith({
      channel: "team.blue",
      uuids: ["user-888"],
      include: { UUIDFields: true },
    });
  });

  it("lists channel members with pagination helpers", async () => {
    await manageAppContext({
      ...baseArgs,
      type: "membership",
      operation: "getAll",
      id: "team.blue",
      options: {
        includeCustomFields: true,
        includeUuidFields: true,
        limit: 50,
        filter: "uuid.name LIKE '*admin*'",
        page: { prev: "cursor-prev" },
      },
    });

    expect(mockPubnub.objects.getChannelMembers).toHaveBeenCalledWith({
      channel: "team.blue",
      limit: 50,
      filter: "uuid.name LIKE '*admin*'",
      page: { prev: "cursor-prev" },
      include: { customFields: true, UUIDFields: true },
    });
  });
});
