import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createResponse,
  getPubSubEnvKeys,
  hasPubSubEnvKeys,
  parseError,
  withPubSubEnvKeys,
} from "./utils";

describe("Utils", () => {
  describe("createResponse", () => {
    it("should create a valid MCP response with text content", () => {
      const text = "Hello, World!";
      const response = createResponse(text);

      expect(response).toEqual({
        content: [
          {
            type: "text",
            text: "Hello, World!",
          },
        ],
        isError: false,
      });
    });

    it("should create a valid MCP response with error content", () => {
      const text = new Error("Something went wrong");
      const response = createResponse(JSON.stringify(parseError(text)), true);

      expect(response).toEqual({
        content: [
          {
            type: "text",
            text: '{"message":"Something went wrong","name":"Error"}',
          },
        ],
        isError: true,
      });
    });

    it("should create response with JSON string", () => {
      const jsonData = JSON.stringify({ key: "value", number: 42 });
      const response = createResponse(jsonData);

      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe("text");
      expect(response.content[0]?.text).toBe(jsonData);
    });

    it("should create response with empty string", () => {
      const response = createResponse("");

      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.text).toBe("");
    });
  });

  describe("parseError", () => {
    it("should parse Error object correctly", () => {
      const error = new Error("Something went wrong");
      const parsed = parseError(error);

      expect(parsed).toEqual({
        message: "Something went wrong",
        name: "Error",
      });
    });

    it("should parse custom Error subclass", () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }

      const error = new CustomError("Custom error occurred");
      const parsed = parseError(error);

      expect(parsed).toEqual({
        message: "Custom error occurred",
        name: "CustomError",
      });
    });

    it("should parse string as error", () => {
      const errorString = "This is a string error";
      const parsed = parseError(errorString);

      expect(parsed).toEqual({
        message: "This is a string error",
        name: "Unknown",
      });
    });

    it("should parse number as error", () => {
      const errorNumber = 404;
      const parsed = parseError(errorNumber);

      expect(parsed).toEqual({
        message: "404",
        name: "Unknown",
      });
    });

    it("should throw when parsing null", () => {
      expect(() => parseError(null)).toThrow(TypeError);
    });

    it("should throw when parsing undefined", () => {
      expect(() => parseError(undefined)).toThrow(TypeError);
    });

    it("should parse object without Error interface", () => {
      const errorObj = { code: 500, details: "Server error" };
      const parsed = parseError(errorObj);

      expect(parsed).toEqual({
        message: '{"code":500,"details":"Server error"}',
        name: "Unknown",
      });
    });

    it("should parse Error with empty message", () => {
      const error = new Error("");
      const parsed = parseError(error);

      expect(parsed).toEqual({
        message: "",
        name: "Error",
      });
    });
  });

  describe("pubsub-env-keys", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.PUBNUB_PUBLISH_KEY;
      delete process.env.PUBNUB_SUBSCRIBE_KEY;
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    describe("getPubSubEnvKeys", () => {
      it("should return undefined when no pubsub env keys are set", () => {
        expect(getPubSubEnvKeys()).toBeUndefined();
      });

      it("should return undefined when only PUBNUB_PUBLISH_KEY is set", () => {
        process.env.PUBNUB_PUBLISH_KEY = "pub-c-test";
        expect(getPubSubEnvKeys()).toBeUndefined();
      });

      it("should return undefined when only PUBNUB_SUBSCRIBE_KEY is set", () => {
        process.env.PUBNUB_SUBSCRIBE_KEY = "sub-c-test";
        expect(getPubSubEnvKeys()).toBeUndefined();
      });

      it("should return pubsub env keys when both are set", () => {
        process.env.PUBNUB_PUBLISH_KEY = "pub-c-test";
        process.env.PUBNUB_SUBSCRIBE_KEY = "sub-c-test";

        expect(getPubSubEnvKeys()).toEqual({
          publishKey: "pub-c-test",
          subscribeKey: "sub-c-test",
        });
      });
    });

    describe("hasPubSubEnvKeys", () => {
      it("should return false when no pubsub env keys are set", () => {
        expect(hasPubSubEnvKeys()).toBe(false);
      });

      it("should return false when only PUBNUB_PUBLISH_KEY is set", () => {
        process.env.PUBNUB_PUBLISH_KEY = "pub-c-test";
        expect(hasPubSubEnvKeys()).toBe(false);
      });

      it("should return false when only PUBNUB_SUBSCRIBE_KEY is set", () => {
        process.env.PUBNUB_SUBSCRIBE_KEY = "sub-c-test";
        expect(hasPubSubEnvKeys()).toBe(false);
      });

      it("should return true when both pubsub env keys are set", () => {
        process.env.PUBNUB_PUBLISH_KEY = "pub-c-test";
        process.env.PUBNUB_SUBSCRIBE_KEY = "sub-c-test";
        expect(hasPubSubEnvKeys()).toBe(true);
      });
    });

    describe("withPubSubEnvKeys", () => {
      it("should use pubsub env keys when available", () => {
        process.env.PUBNUB_PUBLISH_KEY = "pub-c-env";
        process.env.PUBNUB_SUBSCRIBE_KEY = "sub-c-env";

        const args = { channel: "test-channel" };
        const result = withPubSubEnvKeys(args);

        expect(result).toEqual({
          channel: "test-channel",
          publishKey: "pub-c-env",
          subscribeKey: "sub-c-env",
        });
      });

      it("should use args keys when pubsub env keys are not available", () => {
        const args = {
          channel: "test-channel",
          publishKey: "pub-c-args",
          subscribeKey: "sub-c-args",
        };
        const result = withPubSubEnvKeys(args);

        expect(result).toEqual({
          channel: "test-channel",
          publishKey: "pub-c-args",
          subscribeKey: "sub-c-args",
        });
      });

      it("should prefer pubsub env keys over args keys", () => {
        process.env.PUBNUB_PUBLISH_KEY = "pub-c-env";
        process.env.PUBNUB_SUBSCRIBE_KEY = "sub-c-env";

        const args = {
          channel: "test-channel",
          publishKey: "pub-c-args",
          subscribeKey: "sub-c-args",
        };
        const result = withPubSubEnvKeys(args);

        expect(result).toEqual({
          channel: "test-channel",
          publishKey: "pub-c-env",
          subscribeKey: "sub-c-env",
        });
      });

      it("should throw when no pubsub publishKey and subscribeKey are available", () => {
        const args = { channel: "test-channel" };

        expect(() => withPubSubEnvKeys(args)).toThrow(
          "PubNub keys are required. Either set PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY environment variables, or provide publishKey and subscribeKey in the request."
        );
      });

      it("should throw when only publishKey is provided in args", () => {
        const args = {
          channel: "test-channel",
          publishKey: "pub-c-args",
        };

        expect(() => withPubSubEnvKeys(args)).toThrow(
          "PubNub keys are required. Either set PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY environment variables, or provide publishKey and subscribeKey in the request."
        );
      });

      it("should throw when only subscribeKey is provided in args", () => {
        const args = {
          channel: "test-channel",
          subscribeKey: "sub-c-args",
        };

        expect(() => withPubSubEnvKeys(args)).toThrow(
          "PubNub keys are required. Either set PUBNUB_PUBLISH_KEY and PUBNUB_SUBSCRIBE_KEY environment variables, or provide publishKey and subscribeKey in the request."
        );
      });
    });
  });
});
