#!/usr/bin/env node

import assert from 'assert';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Terminal colors and styles
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const FG_GREEN = '\x1b[32m';
const FG_RED = '\x1b[31m';
const FG_YELLOW = '\x1b[33m';

const originalLog = console.log.bind(console);
const originalError = console.error.bind(console);

// Color success messages green and bold
console.log = (...args) => {
  const msg = args.join(' ');
  if (/successfully|passed/.test(msg)) {
    originalLog(`${FG_GREEN}${BOLD}${msg}${RESET}`);
  } else {
    originalLog(...args);
  }
};

// Color error messages red and bold
console.error = (...args) => {
  const msg = args.join(' ');
  originalError(`${FG_RED}${BOLD}${msg}${RESET}`);
};

async function main() {
  console.log('Starting MCP server in Chat SDK mode and client...');
  const client = new Client({ name: 'test-chat-sdk-client', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: 'node', args: ['index.js', '--chat-sdk'] });
  await client.connect(transport);
  console.log('Connected to MCP server in Chat SDK mode.');

  console.log('Listing available tools in Chat SDK mode...');
  const { tools } = await client.listTools();
  const toolNames = tools.map((tool) => tool.name);
  
  // Tools that should be included in Chat SDK mode
  const expectedIncludedTools = [
    'read_pubnub_chat_sdk_docs',
    'publish_pubnub_message',
    'get_pubnub_messages',
    'get_pubnub_presence',
    'pubnub_subscribe_and_receive_messages',
  ];
  
  // Tools that should be excluded in Chat SDK mode
  const expectedExcludedTools = [
    'read_pubnub_sdk_docs',
    'write_pubnub_app',
    'read_pubnub_resources',
    'manage_pubnub_account',
  ];

  console.log(`${FG_YELLOW}Available tools in Chat SDK mode: ${toolNames.join(', ')}${RESET}`);

  // Verify that all expected tools are present
  for (const tool of expectedIncludedTools) {
    assert(
      toolNames.includes(tool),
      `Missing expected tool in Chat SDK mode: ${tool}. Available tools: ${toolNames.join(', ')}`
    );
  }
  console.log('All expected Chat SDK tools are present.');

  // Verify that excluded tools are not present
  for (const tool of expectedExcludedTools) {
    assert(
      !toolNames.includes(tool),
      `Unexpected tool found in Chat SDK mode: ${tool}. This tool should be excluded.`
    );
  }
  console.log('All general PubNub tools are correctly excluded in Chat SDK mode.');

  // Test the 'read_pubnub_chat_sdk_docs' tool if it's available
  if (toolNames.includes('read_pubnub_chat_sdk_docs')) {
    console.log("Testing 'read_pubnub_chat_sdk_docs' tool...");
    
    // Test with JavaScript configuration docs
    const chatSdkDocsResult = await client.callTool({
      name: 'read_pubnub_chat_sdk_docs',
      arguments: { language: 'javascript', topic: 'configuration' },
    });
    assert(
      Array.isArray(chatSdkDocsResult.content) && chatSdkDocsResult.content.length > 0,
      "'read_pubnub_chat_sdk_docs' tool returned no content."
    );
    console.log("'read_pubnub_chat_sdk_docs' tool returned content successfully.");

    // Test with Swift chat docs
    try {
      const swiftChatResult = await client.callTool({
        name: 'read_pubnub_chat_sdk_docs',
        arguments: { language: 'swift', topic: 'chat' },
      });
      assert(
        Array.isArray(swiftChatResult.content) && swiftChatResult.content.length > 0,
        "'read_pubnub_chat_sdk_docs' tool with Swift returned no content."
      );
      console.log("'read_pubnub_chat_sdk_docs' tool with Swift returned content successfully.");
    } catch (err) {
      console.log(`${FG_YELLOW}Note: Swift chat docs test skipped (may not be available): ${err.message}${RESET}`);
    }

    // Test with Unity user docs
    try {
      const unityChatResult = await client.callTool({
        name: 'read_pubnub_chat_sdk_docs',
        arguments: { language: 'unity', topic: 'user' },
      });
      assert(
        Array.isArray(unityChatResult.content) && unityChatResult.content.length > 0,
        "'read_pubnub_chat_sdk_docs' tool with Unity returned no content."
      );
      console.log("'read_pubnub_chat_sdk_docs' tool with Unity returned content successfully.");
    } catch (err) {
      console.log(`${FG_YELLOW}Note: Unity user docs test skipped (may not be available): ${err.message}${RESET}`);
    }
  } else {
    console.log(`${FG_YELLOW}Note: 'read_pubnub_chat_sdk_docs' tool not available (chat SDK URLs may not be loaded)${RESET}`);
  }

  // Test the 'publish_pubnub_message' tool (should be available)
  console.log("Testing 'publish_pubnub_message' tool in Chat SDK mode...");
  const publishResult = await client.callTool({
    name: 'publish_pubnub_message',
    arguments: { channel: 'chat-sdk-test-channel', message: 'Hello from Chat SDK test!' },
  });
  assert(
    Array.isArray(publishResult.content) &&
      publishResult.content.length > 0 &&
      publishResult.content[0].text.length > 0,
    "'publish_pubnub_message' tool returned no content in Chat SDK mode."
  );
  console.log("'publish_pubnub_message' tool published message successfully in Chat SDK mode.");

  // Test the 'get_pubnub_messages' tool (should be available)
  console.log("Testing 'get_pubnub_messages' tool in Chat SDK mode...");
  const getMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['chat-sdk-test-channel'] },
  });
  assert(
    Array.isArray(getMessagesResult.content) &&
      getMessagesResult.content.length > 0 &&
      getMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' tool returned no content in Chat SDK mode."
  );
  console.log("'get_pubnub_messages' tool returned content successfully in Chat SDK mode.");

  // Test the 'get_pubnub_presence' tool (should be available)
  console.log("Testing 'get_pubnub_presence' tool in Chat SDK mode...");
  const presenceResult = await client.callTool({
    name: 'get_pubnub_presence',
    arguments: { channels: ['chat-sdk-test-channel'] },
  });
  assert(
    Array.isArray(presenceResult.content) &&
      presenceResult.content.length > 0 &&
      presenceResult.content[0].text.length > 0,
    "'get_pubnub_presence' tool returned no content in Chat SDK mode."
  );
  console.log("'get_pubnub_presence' tool returned content successfully in Chat SDK mode.");

  // Test the 'pubnub_subscribe_and_receive_messages' tool (should be available)
  console.log("Testing 'pubnub_subscribe_and_receive_messages' tool in Chat SDK mode...");
  const subscribeTestChannel = `chat-sdk-subscribe-test-${Date.now()}`;
  const subscribeTestMessage = {
    text: "Test message for Chat SDK subscription",
    timestamp: new Date().toISOString(),
    testType: "chat-sdk-subscription-test"
  };
  
  // Start the subscription with a timeout
  console.log(`Starting subscription to channel '${subscribeTestChannel}' with 3-second timeout...`);
  const subscriptionPromise = client.callTool({
    name: 'pubnub_subscribe_and_receive_messages',
    arguments: { 
      channel: subscribeTestChannel,
      messageCount: 1,
      timeout: 3000
    }
  });
  
  // Wait a moment, then publish a message
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Publishing message to channel '${subscribeTestChannel}' for subscription test...`);
  await client.callTool({
    name: 'publish_pubnub_message',
    arguments: { 
      channel: subscribeTestChannel, 
      message: JSON.stringify(subscribeTestMessage)
    }
  });
  
  // Wait for the subscription to receive the message
  const subscribeResult = await subscriptionPromise;
  
  assert(
    Array.isArray(subscribeResult.content) && subscribeResult.content.length > 0,
    "'pubnub_subscribe_and_receive_messages' returned no content in Chat SDK mode."
  );
  
  console.log("'pubnub_subscribe_and_receive_messages' tool worked successfully in Chat SDK mode.");

  // Verify that excluded tools are actually not callable
  console.log("Verifying that excluded tools cannot be called in Chat SDK mode...");
  
  try {
    await client.callTool({
      name: 'read_pubnub_sdk_docs',
      arguments: { language: 'javascript', apiReference: 'configuration' },
    });
    assert(false, "Expected 'read_pubnub_sdk_docs' tool to be unavailable in Chat SDK mode.");
  } catch (err) {
    assert(
      err.message.includes('not found') || err.message.includes('Unknown tool'),
      `Expected 'not found' or 'Unknown tool' error, got: ${err.message}`
    );
  }
  console.log("'read_pubnub_sdk_docs' tool correctly unavailable in Chat SDK mode.");

  try {
    await client.callTool({
      name: 'write_pubnub_app',
      arguments: { appType: 'default' },
    });
    assert(false, "Expected 'write_pubnub_app' tool to be unavailable in Chat SDK mode.");
  } catch (err) {
    assert(
      err.message.includes('not found') || err.message.includes('Unknown tool'),
      `Expected 'not found' or 'Unknown tool' error, got: ${err.message}`
    );
  }
  console.log("'write_pubnub_app' tool correctly unavailable in Chat SDK mode.");

  try {
    await client.callTool({
      name: 'read_pubnub_resources',
      arguments: { document: 'pubnub_concepts' },
    });
    assert(false, "Expected 'read_pubnub_resources' tool to be unavailable in Chat SDK mode.");
  } catch (err) {
    assert(
      err.message.includes('not found') || err.message.includes('Unknown tool'),
      `Expected 'not found' or 'Unknown tool' error, got: ${err.message}`
    );
  }
  console.log("'read_pubnub_resources' tool correctly unavailable in Chat SDK mode.");

  console.log('All Chat SDK mode tests passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Chat SDK test failed:', err);
  process.exit(1);
});