import { describe, expect, it } from "vitest";
import { createResponse, parseError } from "./utils";

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
});
