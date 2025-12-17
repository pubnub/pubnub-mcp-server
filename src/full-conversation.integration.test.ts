/**
 * Full Conversation Flow Integration Test
 *
 * This test validates complete multi-turn conversations with OpenAI using AI SDK v5 and MCP tools.
 * Unlike the existing tool-call.integration.test.ts which stops after the first tool call,
 * this test runs until the conversation completes naturally.
 *
 * Key features:
 * - Uses AI SDK's experimental_createMCPClient for MCP integration
 * - Uses MSW to mock PubNub API responses (Portal API and Docs API)
 * - Tests both single and multi-tool call scenarios
 * - Allows up to 10 conversation turns (maxSteps)
 * - Validates that expected tools are called and conversations complete successfully
 */

import type { Server } from "node:http";
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { createOpenAI } from "@ai-sdk/openai";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { generateText, stepCountIs } from "ai";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMockDocsApiServer, createMockPortalApiServer } from "./test-utils/api-server-mocks";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const MOCK_PORTAL_API_PORT = 3457;
const MOCK_DOCS_API_PORT = 3458;

type TestScenario = {
  prompt: string;
  expectedTools: string[];
  description: string;
};

const TEST_SCENARIOS: TestScenario[] = [
  {
    prompt:
      "Please retrieve the API reference for the PubNub JavaScript SDK, publish-and-subscribe section.",
    expectedTools: ["get_sdk_documentation"],
    description: "Single tool call - fetch SDK documentation",
  },
  {
    prompt: "Create a new PubNub app called 'Test Integration App' and then list all my apps.",
    expectedTools: ["manage_apps"],
    description: "Multi-tool call - create and list apps using manage_apps",
  },
  {
    prompt: "Show me all my keysets",
    expectedTools: ["manage_keysets"],
    description: "Multi-tool call - list keysets",
  },
  {
    prompt:
      "I need documentation for the PubNub JavaScript SDK on publish-and-subscribe, and also the Swift Chat SDK documentation for thread-channel.",
    expectedTools: ["get_sdk_documentation", "get_chat_sdk_documentation"],
    description: "Multi-tool call - fetch multiple documentation types",
  },
  {
    prompt: `Create a javascript chat application that allows users to send and receive messages in a channel using PubNub.
     Use the PubNub Chat SDK. Use available tools (they are PubNub related).
     Do not ask use for any input, just figure it yourself.
     Use latest documentation, and create new app and keyset and then produce the code for the application`,
    expectedTools: ["get_chat_sdk_documentation", "manage_apps", "manage_keysets"],
    description: "Multi-tool call - create a chat application",
  },
];

describe.skipIf(!OPENAI_API_KEY)("Full conversation flow with OpenAI", () => {
  let mcpClient: Awaited<ReturnType<typeof createMCPClient>>;
  let mockPortalServer: { server: Server; close: () => Promise<void> } | undefined;
  let mockDocsServer: { server: Server; close: () => Promise<void> } | undefined;
  let openai: ReturnType<typeof createOpenAI>;
  let aiTools: Awaited<
    ReturnType<NonNullable<Awaited<ReturnType<typeof createMCPClient>>>["tools"]>
  >;

  beforeAll(async () => {
    console.log("\n[Test Setup] Starting mock API servers...");

    mockPortalServer = await createMockPortalApiServer(MOCK_PORTAL_API_PORT);
    mockDocsServer = await createMockDocsApiServer(MOCK_DOCS_API_PORT);

    const ADMIN_API_V1_URL = `http://localhost:${MOCK_PORTAL_API_PORT}/api`;
    const SDK_DOCS_API_URL = `http://localhost:${MOCK_DOCS_API_PORT}/api/v1`;

    console.log(`\n[Test Setup] Environment configured:`);
    console.log(`  Mock Portal API: ${ADMIN_API_V1_URL}`);
    console.log(`  Mock Docs API: ${SDK_DOCS_API_URL}`);

    openai = createOpenAI({
      apiKey: OPENAI_API_KEY ?? "",
    });

    console.log("[Test Setup] Starting MCP client with stdio transport...");
    mcpClient = await createMCPClient({
      transport: new StdioClientTransport({
        command: "npm",
        args: ["start"],
        env: {
          ...process.env,
          ADMIN_API_V1_URL: ADMIN_API_V1_URL,
          SDK_DOCS_API_URL: SDK_DOCS_API_URL,
          PUBNUB_EMAIL: "test@example.com",
          PUBNUB_PASSWORD: "test-password",
        },
      }),
    });

    console.log("[Test Setup] MCP client connected");

    aiTools = await mcpClient.tools();

    console.log(`[Test Setup] Loaded ${Object.keys(aiTools).length} tools with mock API servers\n`);
  }, 60_000);

  afterAll(async () => {
    await mcpClient?.close();

    await mockPortalServer?.close();
    await mockDocsServer?.close();
    mockPortalServer = undefined;
    mockDocsServer = undefined;
  });

  for (const scenario of TEST_SCENARIOS) {
    it(scenario.description, { timeout: 180_000 }, async () => {
      console.log(`\n\n=== Testing scenario: ${scenario.description} ===`);
      console.log(`Prompt: ${scenario.prompt}`);

      const result = await generateText({
        model: openai(OPENAI_MODEL),
        messages: [
          {
            role: "user",
            content: scenario.prompt,
          },
        ],
        tools: aiTools as any, // Mismatch between AI SDK and AI MCP tools types
        stopWhen: stepCountIs(10),
      });

      console.log(`\n--- Conversation Result ---`);
      console.log(`Finish Reason: ${result.finishReason}`);
      console.log(`Steps: ${result.steps?.length || 0}`);
      console.log(`Text length: ${result.text.length}`);
      if (result.text.length > 0) {
        console.log(`Text preview: ${result.text.substring(0, 200)}...`);
      }

      const toolCallsMade = new Set<string>();
      const allToolCalls: { stepIndex: number; toolName: string; args: unknown }[] = [];

      if (result.steps) {
        for (const [i, step] of result.steps.entries()) {
          if (step?.toolCalls && step.toolCalls.length > 0) {
            for (const toolCall of step.toolCalls) {
              toolCallsMade.add(toolCall.toolName);
              allToolCalls.push({
                stepIndex: i,
                toolName: toolCall.toolName,
                args: "args" in toolCall ? toolCall.args : undefined,
              });
              console.log(`  Step ${i}: Tool ${toolCall.toolName} called`);
            }
          }
        }
      }

      console.log(`\nTools called: ${Array.from(toolCallsMade).join(", ")}`);
      console.log(`Total tool calls: ${allToolCalls.length}`);

      expect(["stop", "length", "tool-calls"]).toContain(result.finishReason);
      expect(allToolCalls.length).toBeGreaterThan(0);

      // Verify expected tools were called
      if (scenario.expectedTools.length === 1) {
        // Single tool scenario - verify at least the expected tool was called
        const expectedTool = scenario.expectedTools[0];
        if (!expectedTool) {
          throw new Error("Test configuration error: expectedTools[0] is undefined");
        }
        console.log(`Single-tool scenario - verifying ${expectedTool} was called`);
        expect(
          toolCallsMade.has(expectedTool),
          `Expected tool '${expectedTool}' was not called. Called: [${Array.from(toolCallsMade).join(", ")}]`
        ).toBe(true);
      } else {
        // Multi-tool scenario - verify ALL expected tools were called
        console.log(
          `Multi-tool scenario - verifying all ${scenario.expectedTools.length} expected tools were called`
        );
        const allExpectedToolsCalled = scenario.expectedTools.every(expectedTool =>
          toolCallsMade.has(expectedTool)
        );

        expect(
          allExpectedToolsCalled,
          `Not all expected tools were called. Expected: [${scenario.expectedTools.join(", ")}], Called: [${Array.from(toolCallsMade).join(", ")}]`
        ).toBe(true);
        console.log(`✓ All ${scenario.expectedTools.length} expected tools were called`);
      }

      // Verify the response - text might be empty if finishReason is "tool-calls"
      // In that case, the LLM made tool calls but didn't generate a final text response
      if (result.finishReason === "stop") {
        // When conversation finishes normally, there should be text
        expect(result.text).toBeTruthy();
        expect(result.text.length).toBeGreaterThan(0);
      } else {
        // For other finish reasons (tool-calls, length), text might be empty
        console.log(`Note: Empty text is acceptable with finishReason: ${result.finishReason}`);
      }

      console.log(`✓ Scenario passed: ${scenario.description}\n`);
    });
  }
});
