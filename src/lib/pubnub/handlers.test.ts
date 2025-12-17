import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearEnvKeys, clearTestEnv, setupEnvKeys, setupTestEnv } from "../../test-utils/msw-setup";
import type { ManageAppContextHandlerArgs } from "./app-context/types";
import {
  getPresenceHandler,
  manageAppContextHandler,
  publishMessageHandler,
  subscribeHandler,
} from "./handlers";
import type {
  GetPresenceHandlerArgs,
  PublishMessageHandlerArgs,
  SubscribeHandlerArgs,
} from "./types";

const mockPublish = vi.fn();
const mockSignal = vi.fn();
const mockHereNow = vi.fn();
const mockWhereNow = vi.fn();
const mockAddListener = vi.fn();
const mockRemoveListener = vi.fn();
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();
const mockChannel = vi.fn();
const { mockManageAppContext } = vi.hoisted(() => ({
  mockManageAppContext: vi.fn(),
}));

vi.mock("pubnub", () => {
  return {
    default: class MockPubNub {
      publish = mockPublish;
      signal = mockSignal;
      hereNow = mockHereNow;
      whereNow = mockWhereNow;
      channel = mockChannel;
    },
  };
});

vi.mock("./app-context/api", () => {
  return {
    manageAppContext: mockManageAppContext,
  };
});

describe("PubNub Handlers", () => {
  beforeEach(() => {
    setupTestEnv();
    clearEnvKeys();
    vi.clearAllMocks();

    const mockSubscription = {
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    };

    mockChannel.mockReturnValue({
      subscription: () => mockSubscription,
    });
  });

  afterEach(() => {
    clearTestEnv();
    vi.clearAllMocks();
  });

  describe("manageAppContextHandler", () => {
    const baseArgs: ManageAppContextHandlerArgs = {
      type: "user",
      operation: "get",
      id: "user-123",
      publishKey: "pub-c-test-key",
      subscribeKey: "sub-c-test-key",
    };

    it("should return serialized app context result", async () => {
      const mockResult = { status: 200, data: [{ id: "user-123" }] };
      mockManageAppContext.mockResolvedValue(mockResult);

      const response = await manageAppContextHandler(baseArgs);
      const parsed = JSON.parse(response.content?.[0]?.text ?? "{}");

      expect(parsed).toEqual(mockResult);
      expect(mockManageAppContext).toHaveBeenCalledWith(baseArgs);
    });

    it("should surface PubNub error", async () => {
      const pubnubError = { status: { errorData: "Access denied" } };
      mockManageAppContext.mockRejectedValue(pubnubError);

      const response = await manageAppContextHandler(baseArgs);
      const parsed = JSON.parse(response.content?.[0]?.text ?? "{}");

      expect(parsed).toEqual({ name: "PubNubError", message: "Access denied" });
    });

    it("should use env keys when no keys are provided in args", async () => {
      setupEnvKeys("pub-c-env-key", "sub-c-env-key");
      const mockResult = { status: 200, data: [{ id: "user-123" }] };
      mockManageAppContext.mockResolvedValue(mockResult);

      const argsWithoutKeys: ManageAppContextHandlerArgs = {
        type: "user",
        operation: "get",
        id: "user-123",
      };

      await manageAppContextHandler(argsWithoutKeys);

      expect(mockManageAppContext).toHaveBeenCalledWith({
        ...argsWithoutKeys,
        publishKey: "pub-c-env-key",
        subscribeKey: "sub-c-env-key",
      });
    });

    it("should prefer env keys over args keys", async () => {
      setupEnvKeys("pub-c-env-key", "sub-c-env-key");
      const mockResult = { status: 200, data: [{ id: "user-123" }] };
      mockManageAppContext.mockResolvedValue(mockResult);

      await manageAppContextHandler(baseArgs);

      expect(mockManageAppContext).toHaveBeenCalledWith({
        ...baseArgs,
        publishKey: "pub-c-env-key",
        subscribeKey: "sub-c-env-key",
      });
    });
  });

  describe("publishMessageHandler", () => {
    const baseArgs: PublishMessageHandlerArgs = {
      publishKey: "pub-c-test-key",
      subscribeKey: "sub-c-test-key",
      channel: "test-channel",
      message: "Hello World",
      type: "message",
    };

    it("should publish a regular message successfully", async () => {
      mockPublish.mockResolvedValue({
        timetoken: "17034567890123456",
      });

      const result = await publishMessageHandler(baseArgs);
      const parsedText = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedText).toBe("17034567890123456");
      expect(mockPublish).toHaveBeenCalledWith({
        channel: "test-channel",
        message: { text: "Hello World" },
      });
      expect(mockSignal).not.toHaveBeenCalled();
    });

    it("should publish a signal successfully", async () => {
      mockSignal.mockResolvedValue({
        timetoken: "17034567890123456",
      });

      const signalArgs: PublishMessageHandlerArgs = {
        ...baseArgs,
        type: "signal",
      };

      const result = await publishMessageHandler(signalArgs);
      const parsedText = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedText).toBe("17034567890123456");
      expect(mockSignal).toHaveBeenCalledWith({
        channel: "test-channel",
        message: { text: "Hello World" },
      });
      expect(mockPublish).not.toHaveBeenCalled();
    });

    it("should handle JSON message payload", async () => {
      mockPublish.mockResolvedValue({
        timetoken: "17034567890123456",
      });

      const jsonArgs: PublishMessageHandlerArgs = {
        ...baseArgs,
        message: { type: "notification", content: "New message" },
      };

      await publishMessageHandler(jsonArgs);

      expect(mockPublish).toHaveBeenCalledWith({
        channel: "test-channel",
        message: { type: "notification", content: "New message" },
      });
    });

    it("should wrap plain string in text field", async () => {
      mockPublish.mockResolvedValue({
        timetoken: "17034567890123456",
      });

      const stringArgs: PublishMessageHandlerArgs = {
        ...baseArgs,
        message: "Simple string message",
      };

      await publishMessageHandler(stringArgs);

      expect(mockPublish).toHaveBeenCalledWith({
        channel: "test-channel",
        message: { text: "Simple string message" },
      });
    });

    it("should use env keys when no keys are provided in args", async () => {
      setupEnvKeys("pub-c-env-key", "sub-c-env-key");
      mockPublish.mockResolvedValue({
        timetoken: "17034567890123456",
      });

      const argsWithoutKeys: PublishMessageHandlerArgs = {
        channel: "test-channel",
        message: "Hello World",
        type: "message",
      };

      await publishMessageHandler(argsWithoutKeys);

      expect(mockPublish).toHaveBeenCalledWith({
        channel: "test-channel",
        message: { text: "Hello World" },
      });
    });

    it("should throw error when no keys are available", async () => {
      const argsWithoutKeys: PublishMessageHandlerArgs = {
        channel: "test-channel",
        message: "Hello World",
        type: "message",
      };

      const result = await publishMessageHandler(argsWithoutKeys);
      const parsed = JSON.parse(result.content?.[0]?.text ?? "{}");

      expect(parsed.name).toBe("Error");
      expect(parsed.message).toContain("PubNub keys are required");
    });
  });

  describe("getPresenceHandler", () => {
    const baseArgs: GetPresenceHandlerArgs = {
      publishKey: "pub-c-test-key",
      subscribeKey: "sub-c-test-key",
      channels: ["test-channel"],
      channelGroups: [],
    };

    it("should get presence for channels successfully", async () => {
      const mockResponse = {
        totalChannels: 1,
        totalOccupancy: 5,
        usersInChannels: {
          "test-channel": {
            occupancy: 5,
            occupants: [
              { uuid: "user1", state: null },
              { uuid: "user2", state: { status: "busy" } },
            ],
          },
        },
      };
      mockHereNow.mockResolvedValue(mockResponse);

      const result = await getPresenceHandler(baseArgs);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult).toEqual({ usersInChannels: mockResponse });
      expect(mockHereNow).toHaveBeenCalledWith({
        channels: ["test-channel"],
        channelGroups: [],
      });
    });

    it("should get presence for channel groups successfully", async () => {
      const mockResponse = {
        totalChannels: 1,
        totalOccupancy: 3,
        usersInChannels: {
          "group-channel-1": {
            occupancy: 3,
            occupants: [{ uuid: "user3", state: null }],
          },
        },
      };
      mockHereNow.mockResolvedValue(mockResponse);

      const groupArgs: GetPresenceHandlerArgs = {
        ...baseArgs,
        channels: [],
        channelGroups: ["test-group"],
      };

      const result = await getPresenceHandler(groupArgs);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult).toEqual({ usersInChannels: mockResponse });
      expect(mockHereNow).toHaveBeenCalledWith({
        channels: [],
        channelGroups: ["test-group"],
      });
    });

    it("should get whereNow for uuid successfully", async () => {
      const mockResponse = {
        channels: ["channel1", "channel2"],
      };
      mockWhereNow.mockResolvedValue(mockResponse);

      const whereNowArgs: GetPresenceHandlerArgs = {
        ...baseArgs,
        channels: [],
        channelGroups: [],
        uuid: "test-uuid",
      };

      const result = await getPresenceHandler(whereNowArgs);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult).toEqual({ channelsUserIsIn: mockResponse });
      expect(mockWhereNow).toHaveBeenCalledWith({
        uuid: "test-uuid",
      });
      expect(mockHereNow).not.toHaveBeenCalled();
    });

    it("should get combined hereNow and whereNow successfully", async () => {
      const mockHereNowResponse = {
        totalChannels: 1,
        totalOccupancy: 5,
        channels: {
          "test-channel": {
            occupancy: 5,
            occupants: [],
          },
        },
      };
      const mockWhereNowResponse = {
        channels: ["channel1"],
      };

      mockHereNow.mockResolvedValue(mockHereNowResponse);
      mockWhereNow.mockResolvedValue(mockWhereNowResponse);

      const combinedArgs: GetPresenceHandlerArgs = {
        ...baseArgs,
        uuid: "test-uuid",
      };

      const result = await getPresenceHandler(combinedArgs);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult).toEqual({
        usersInChannels: mockHereNowResponse,
        channelsUserIsIn: mockWhereNowResponse,
      });
      expect(mockHereNow).toHaveBeenCalledWith({
        channels: ["test-channel"],
        channelGroups: [],
      });
      expect(mockWhereNow).toHaveBeenCalledWith({
        uuid: "test-uuid",
      });
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Presence check failed");
      mockHereNow.mockRejectedValue(error);

      const result = await getPresenceHandler(baseArgs);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult).toEqual({
        message: "Presence check failed",
        name: "Error",
      });
    });

    it("should use env keys when no keys are provided in args", async () => {
      setupEnvKeys("pub-c-env-key", "sub-c-env-key");
      const mockResponse = {
        totalChannels: 1,
        totalOccupancy: 5,
        usersInChannels: {},
      };
      mockHereNow.mockResolvedValue(mockResponse);

      const argsWithoutKeys: GetPresenceHandlerArgs = {
        channels: ["test-channel"],
        channelGroups: [],
      };

      await getPresenceHandler(argsWithoutKeys);

      expect(mockHereNow).toHaveBeenCalledWith({
        channels: ["test-channel"],
        channelGroups: [],
      });
    });
  });

  describe("subscribeHandler", () => {
    const baseArgs: SubscribeHandlerArgs = {
      publishKey: "pub-c-test-key",
      subscribeKey: "sub-c-test-key",
      channel: "test-channel",
      messageCount: 2,
      timeout: 5,
    };

    it("should receive specified number of messages before timeout", async () => {
      let messageListener: any;
      mockAddListener.mockImplementation(listener => {
        messageListener = listener;
      });

      const resultPromise = subscribeHandler(baseArgs);

      setTimeout(() => {
        messageListener.message({ message: { text: "Message 1" }, channel: "test-channel" });
        messageListener.message({ message: { text: "Message 2" }, channel: "test-channel" });
      }, 100);

      const result = await resultPromise;
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult.messageCount).toBe(2);
      expect(parsedResult.messages).toHaveLength(2);
      expect(parsedResult.note).toBeUndefined();
    });

    it("should timeout when not receiving specified number of messages", async () => {
      let messageListener: any;
      mockAddListener.mockImplementation(listener => {
        messageListener = listener;
      });

      const partialArgs: SubscribeHandlerArgs = {
        ...baseArgs,
        messageCount: 3,
        timeout: 1,
      };

      const resultPromise = subscribeHandler(partialArgs);

      setTimeout(() => {
        messageListener.message({ message: { text: "Only message" }, channel: "test-channel" });
      }, 100);

      const result = await resultPromise;
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult.messageCount).toBe(1);
      expect(parsedResult.messages).toHaveLength(1);
      expect(parsedResult.note).toBe("Timeout: Only 1 of 3 requested messages received within 1s");
    });

    it("should timeout when not receiving any messages", async () => {
      mockAddListener.mockImplementation(() => {});

      const timeoutArgs: SubscribeHandlerArgs = {
        ...baseArgs,
        timeout: 1,
      };

      const result = await subscribeHandler(timeoutArgs);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult.messageCount).toBe(0);
      expect(parsedResult.messages).toHaveLength(0);
      expect(parsedResult.note).toBe(
        "Timeout: No messages received on channel 'test-channel' within 1s"
      );
    });

    it("should use env keys when no keys are provided in args", async () => {
      setupEnvKeys("pub-c-env-key", "sub-c-env-key");
      mockAddListener.mockImplementation(() => {});

      const argsWithoutKeys: SubscribeHandlerArgs = {
        channel: "test-channel",
        messageCount: 1,
        timeout: 1,
      };

      const result = await subscribeHandler(argsWithoutKeys);
      const parsedResult = JSON.parse(result.content?.[0]?.text ?? "");

      expect(parsedResult.messageCount).toBe(0);
    });
  });
});
