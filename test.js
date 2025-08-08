#!/usr/bin/env node

import assert from 'assert';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Terminal colors and styles
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const FG_GREEN = '\x1b[32m';
const FG_RED = '\x1b[31m';

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
  console.log('Starting MCP server and client...');
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: 'node', args: ['index.js'] });
  await client.connect(transport);
  console.log('Connected to MCP server.');

  console.log('Listing available tools...');
  const { tools } = await client.listTools();
  const toolNames = tools.map((tool) => tool.name);
  const expectedTools = [
    'read_pubnub_sdk_docs',
    'read_pubnub_resources',
    'publish_pubnub_message',
    'signal_pubnub_message',  // new signal tool
    'get_pubnub_messages',
    'get_pubnub_presence',
    'write_pubnub_app',  // should expose the app creation instructions tool
    'pubnub_subscribe_and_receive_messages',  // new subscribe and receive tool
  ];
  for (const tool of expectedTools) {
    assert(
      toolNames.includes(tool),
      `Missing expected tool: ${tool}. Available tools: ${toolNames.join(', ')}`
    );
  }
  console.log('All expected tools are present.');

  console.log("Testing 'read_pubnub_resources' tool with document 'how_to_write_a_pubnub_app'...");
  const pubnubResourcesResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'how_to_write_a_pubnub_app' },
  });
  assert(
    Array.isArray(pubnubResourcesResult.content) && pubnubResourcesResult.content.length > 0,
    "'read_pubnub_resources' tool returned no content."
  );
  console.log("'read_pubnub_resources' tool returned content successfully.");

  console.log("Testing 'read_pubnub_resources' tool with document 'how_to_use_pubnub_presence_best_practices'...");
  const presencePracResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'how_to_use_pubnub_presence_best_practices' },
  });
  assert(
    Array.isArray(presencePracResult.content) && presencePracResult.content.length > 0 && presencePracResult.content[0].text.includes('# PubNub Presence Best Practices'),
    "'read_pubnub_resources' tool did not load how_to_use_pubnub_presence_best_practices.md content."
  );
  console.log("'read_pubnub_resources' tool loaded presence best practices content successfully.");

  // Test the 'read_pubnub_sdk_docs' tool
  console.log("Testing 'read_pubnub_sdk_docs' tool...");
  const sdkDocsResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript', apiReference: 'configuration' },
  });
  assert(
    Array.isArray(sdkDocsResult.content) && sdkDocsResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool returned no content."
  );
  console.log("'read_pubnub_sdk_docs' tool returned content successfully.");

  // Test the 'publish_pubnub_message' tool
  console.log("Testing 'publish_pubnub_message' tool...");
  const publishResult = await client.callTool({
    name: 'publish_pubnub_message',
    arguments: { channel: 'test-channel', message: 'Hello from test!' },
  });
  assert(
    Array.isArray(publishResult.content) &&
      publishResult.content.length > 0 &&
      publishResult.content[0].text.length > 0,
    "'publish_pubnub_message' tool returned no content."
  );
  console.log("'publish_pubnub_message' tool published message successfully.");

  // Test the 'signal_pubnub_message' tool
  console.log("Testing 'signal_pubnub_message' tool...");
  const signalResult = await client.callTool({
    name: 'signal_pubnub_message',
    arguments: { channel: 'test-channel', message: 'Hello signal!' },
  });
  assert(
    Array.isArray(signalResult.content) &&
      signalResult.content.length > 0 &&
      signalResult.content[0].text.length > 0,
    "'signal_pubnub_message' tool returned no content."
  );
  console.log("'signal_pubnub_message' tool sent signal successfully.");
  // Test the 'get_pubnub_messages' tool
  console.log("Testing 'get_pubnub_messages' tool...");
  const getMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel'] },
  });
  assert(
    Array.isArray(getMessagesResult.content) &&
      getMessagesResult.content.length > 0 &&
      getMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' tool returned no content."
  );
  console.log("'get_pubnub_messages' tool returned content successfully.");
  // Test the 'get_pubnub_presence' tool
  console.log("Testing 'get_pubnub_presence' tool...");
  const presenceResult = await client.callTool({
    name: 'get_pubnub_presence',
    arguments: { channels: ['test-channel'] },
  });
  assert(
    Array.isArray(presenceResult.content) &&
      presenceResult.content.length > 0 &&
      presenceResult.content[0].text.length > 0,
    "'get_pubnub_presence' tool returned no content."
  );
  console.log("'get_pubnub_presence' tool returned content successfully.");
  // Test the 'write_pubnub_app' tool
  console.log("Testing 'write_pubnub_app' tool...");
  const writeAppResult = await client.callTool({
    name: 'write_pubnub_app',
    arguments: { appType: 'default' },
  });
  assert(
    Array.isArray(writeAppResult.content) && writeAppResult.content.length > 0,
    "'write_pubnub_app' tool returned no content."
  );
  console.log("'write_pubnub_app' tool returned content successfully.");
  
  // Additional tests for server.tool arguments and options

  console.log("Testing 'read_pubnub_sdk_docs' tool default apiReference behavior...");
  const sdkDefaultResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript' },
  });
  assert(
    Array.isArray(sdkDefaultResult.content) && sdkDefaultResult.content.length > 0,
    "'read_pubnub_sdk_docs' default behavior returned no content."
  );
  console.log("'read_pubnub_sdk_docs' default behavior returned content successfully.");
  // Test presence best practices inclusion in default javascript behavior
  console.log("Testing presence best practices inclusion in 'read_pubnub_sdk_docs' tool default javascript behavior...");
  assert(
    sdkDefaultResult.content[0].text.includes('# PubNub Presence Best Practices'),
    "Expected presence best practices header in default 'read_pubnub_sdk_docs' tool output."
  );
  console.log("Presence best practices content included successfully in default 'read_pubnub_sdk_docs' tool output.");

  // Test the 'read_pubnub_sdk_docs' tool with 'functions' apiReference
  console.log("Testing 'read_pubnub_sdk_docs' tool with apiReference 'functions'...");
  const sdkFunctionsResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript', apiReference: 'functions' },
  });
  assert(
    Array.isArray(sdkFunctionsResult.content) && sdkFunctionsResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool with 'functions' returned no content."
  );
  // Verify that the functions documentation is included
  assert(
    sdkFunctionsResult.content[0].text.includes('# PubNub Functions 2.0 Development Guidelines'),
    "Expected functions documentation header in 'read_pubnub_sdk_docs' tool output."
  );
  console.log("'read_pubnub_sdk_docs' tool with 'functions' returned content successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with language 'dart' and default apiReference behavior...");
  const dartSdkResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'dart' },
  });
  assert(
    Array.isArray(dartSdkResult.content) && dartSdkResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool with language 'dart' returned no content."
  );
  assert(
    dartSdkResult.content[0].text.includes('TITLE: Installing PubNub Dart SDK using Pub'),
    "Expected Dart SDK installation header in 'read_pubnub_sdk_docs' tool output."
  );
  console.log("'read_pubnub_sdk_docs' tool with language 'dart' returned content successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with language 'dart' and apiReference 'publish-and-subscribe'...");
  const dartPubSubResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'dart', apiReference: 'publish-and-subscribe' },
  });
  assert(
    Array.isArray(dartPubSubResult.content) && dartPubSubResult.content.length > 0,
    "'read_pubnub_sdk_docs' tool with language 'dart' and apiReference 'publish-and-subscribe' returned no content."
  );
  console.log("'read_pubnub_sdk_docs' tool with language 'dart' and apiReference 'publish-and-subscribe' returned content successfully.");
  
  // Ensure that any "(old)" sections and subsequent content are removed
  assert(
    !dartPubSubResult.content[0].text.includes('(old)'),
    "Expected no '(old)' sections in 'publish-and-subscribe' documentation."
  );
  console.log("'read_pubnub_sdk_docs' tool removed '(old)' sections from 'publish-and-subscribe' docs successfully.");

  // Test alias 'App Context' for apiReference equals 'objects'
  console.log("Testing 'read_pubnub_sdk_docs' tool with alias 'App Context' is same as 'objects'...");
  const objectsJsResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript', apiReference: 'objects' },
  });
  const appContextJsResult = await client.callTool({
    name: 'read_pubnub_sdk_docs',
    arguments: { language: 'javascript', apiReference: 'App Context' },
  });
  assert.deepStrictEqual(
    appContextJsResult.content,
    objectsJsResult.content,
    "'App Context' alias did not produce same content as 'objects'"
  );
  console.log("'App Context' alias behaves the same as 'objects' in 'read_pubnub_sdk_docs' tool.");

  console.log("Testing 'read_pubnub_sdk_docs' tool for language 'java' and all apiReference options...");
  const javaApiReferences = [
    'configuration',
    'publish-and-subscribe',
    'presence',
    'access-manager',
    'channel-groups',
    'storage-and-playback',
    'mobile-push',
    'objects',
    'files',
    'message-actions',
    'misc',
    'functions',
  ];
  for (const apiReference of javaApiReferences) {
    console.log(`Testing 'read_pubnub_sdk_docs' tool with language 'java', apiReference '${apiReference}'...`);
    const javaResult = await client.callTool({
      name: 'read_pubnub_sdk_docs',
      arguments: { language: 'java', apiReference },
    });
    assert(
      Array.isArray(javaResult.content) && javaResult.content.length > 0,
      `'read_pubnub_sdk_docs' tool returned no content for java ${apiReference}`
    );
    if (apiReference === 'functions') {
      assert(
        javaResult.content[0].text.includes('# PubNub Functions 2.0 Development Guidelines'),
        "Expected functions documentation header in 'read_pubnub_sdk_docs' tool output for java"
      );
    }
  }
  console.log("All 'read_pubnub_sdk_docs' tests for language 'java' passed successfully.");

  console.log("Testing 'read_pubnub_chat_sdk_docs' tool for all chat SDK docs...");
  {
    const { readFile } = await import('fs/promises');
    const data = await readFile('chat_sdk_urls.txt', 'utf8');
    const lines = data.split(/\r?\n/);
    const chatSdkUrlsMap = {};
    let currentLang = null;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        currentLang = null;
      } else if (!currentLang) {
        currentLang = trimmed;
        chatSdkUrlsMap[currentLang] = [];
      } else {
        chatSdkUrlsMap[currentLang].push(trimmed);
      }
    }
    for (const [lang, urls] of Object.entries(chatSdkUrlsMap)) {
      const languageArg = lang.toLowerCase();
      for (const url of urls) {
        const topic = url.split('/').pop();
        console.log(`Testing 'read_pubnub_chat_sdk_docs' for language '${languageArg}', topic '${topic}'...`);
        const result = await client.callTool({
          name: 'read_pubnub_chat_sdk_docs',
          arguments: { language: languageArg, topic },
        });
        assert(
          Array.isArray(result.content) && result.content.length > 0,
          `'read_pubnub_chat_sdk_docs' returned no content for ${languageArg} ${topic}`
        );
      }
    }
    console.log("All 'read_pubnub_chat_sdk_docs' tests passed successfully.");
  }
  console.log("Testing 'read_pubnub_resources' tool with document 'pubnub_concepts'...");
  const conceptsResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'pubnub_concepts' },
  });
  assert(
    Array.isArray(conceptsResult.content) && conceptsResult.content.length > 0,
    "'read_pubnub_resources' with 'pubnub_concepts' returned no content."
  );
  console.log("'read_pubnub_resources' returned concepts content successfully.");
  // Test for chat_sdk resource
  console.log("Testing 'read_pubnub_resources' tool with document 'chat_sdk'...");
  const chatSdkResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'chat_sdk' },
  });
  assert(
    Array.isArray(chatSdkResult.content) && chatSdkResult.content.length > 0,
    "'read_pubnub_resources' with 'chat_sdk' returned no content."
  );
  assert(
    chatSdkResult.content[0].text.includes('Sample chat app'),
    "Expected 'Sample chat app' in 'chat_sdk' result"
  );
  console.log("'read_pubnub_resources' tool with 'chat_sdk' returned content successfully.");
  // Verify new examples (user creation note, channel helper, logout, reactions) present in chat_sdk guide
  assert(
    chatSdkResult.content[0].text.includes('**Note:** The Chat SDK requires you to explicitly create or retrieve users'),
    "Expected user creation note in 'chat_sdk' result"
  );
  assert(
    chatSdkResult.content[0].text.includes('async function getOrCreateDirectChannel'),
    "Expected getOrCreateDirectChannel helper in 'chat_sdk' result"
  );
  assert(
    chatSdkResult.content[0].text.includes('async function logout(chat)'),
    "Expected logout cleanup snippet in 'chat_sdk' result"
  );
  assert(
    chatSdkResult.content[0].text.includes('async function toggleReaction'),
    "Expected reaction toggle snippet in 'chat_sdk' result"
  );
  console.log("New examples (user creation, channel helper, logout, reactions) present in 'chat_sdk' guide.");
  // Test for pubnub_chat_sdk resource
  console.log("Testing 'read_pubnub_resources' tool with document 'pubnub_chat_sdk'...");
  const pubnubChatSdkResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'pubnub_chat_sdk' },
  });
  assert(
    Array.isArray(pubnubChatSdkResult.content) && pubnubChatSdkResult.content.length > 0,
    "'read_pubnub_resources' with 'pubnub_chat_sdk' returned no content."
  );
  assert(
    pubnubChatSdkResult.content[0].text.includes('Sample chat app'),
    "Expected 'Sample chat app' in 'pubnub_chat_sdk' result"
  );
  console.log("'read_pubnub_resources' tool with 'pubnub_chat_sdk' returned content successfully.");

  // Verify new examples (user creation note, channel helper, logout, reactions) present in pubnub_chat_sdk guide
  assert(
    pubnubChatSdkResult.content[0].text.includes('**Note:** The Chat SDK requires you to explicitly create or retrieve users'),
    "Expected user creation note in 'pubnub_chat_sdk' result"
  );
  assert(
    pubnubChatSdkResult.content[0].text.includes('async function getOrCreateDirectChannel'),
    "Expected getOrCreateDirectChannel helper in 'pubnub_chat_sdk' result"
  );
  assert(
    pubnubChatSdkResult.content[0].text.includes('async function logout(chat)'),
    "Expected logout cleanup snippet in 'pubnub_chat_sdk' result"
  );
  assert(
    pubnubChatSdkResult.content[0].text.includes('async function toggleReaction'),
    "Expected reaction toggle snippet in 'pubnub_chat_sdk' result"
  );
  console.log("New examples (user creation, channel helper, logout, reactions) present in 'pubnub_chat_sdk' guide.");
  console.log("Testing 'read_pubnub_resources' tool with document 'how_to_use_app_context_objects_with_dart'...");
  const dartAppContextResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'how_to_use_app_context_objects_with_dart' },
  });
  assert(
    Array.isArray(dartAppContextResult.content) && dartAppContextResult.content.length > 0,
    "'read_pubnub_resources' with 'how_to_use_app_context_objects_with_dart' returned no content."
  );
  assert(
    dartAppContextResult.content[0].text.includes('App Context'),
    "Expected 'App Context' in 'how_to_use_app_context_objects_with_dart' result"
  );
  console.log("'read_pubnub_resources' tool with 'how_to_use_app_context_objects_with_dart' returned content successfully.");

  console.log("Testing 'read_pubnub_resources' tool with document 'dart'...");
  const dartLangResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'dart' },
  });
  assert(
    Array.isArray(dartLangResult.content) && dartLangResult.content.length > 0,
    "'read_pubnub_resources' with 'dart' returned no content."
  );
  assert(
    dartLangResult.content[0].text.includes('TITLE: Installing PubNub Dart SDK using Pub'),
    "Expected Dart language resource header in 'read_pubnub_resources' tool output."
  );
  console.log("'read_pubnub_resources' tool with 'dart' returned content successfully.");

  console.log("Testing 'read_pubnub_resources' tool with document 'how_to_use_channel_filters_subscribe_filters_and_message_filters'...");
  const channelFiltersResult = await client.callTool({
    name: 'read_pubnub_resources',
    arguments: { document: 'how_to_use_channel_filters_subscribe_filters_and_message_filters' },
  });
  assert(
    Array.isArray(channelFiltersResult.content) && channelFiltersResult.content.length > 0,
    "'read_pubnub_resources' with 'how_to_use_channel_filters_subscribe_filters_and_message_filters' returned no content."
  );
  assert(
    channelFiltersResult.content[0].text.includes('Subscribe Filters'),
    "Expected 'Subscribe Filters' in 'how_to_use_channel_filters_subscribe_filters_and_message_filters' result"
  );
  assert(
    channelFiltersResult.content[0].text.includes('Message Filters'),
    "Expected 'Message Filters' in 'how_to_use_channel_filters_subscribe_filters_and_message_filters' result"
  );
  assert(
    channelFiltersResult.content[0].text.includes('Filter Expression Language'),
    "Expected 'Filter Expression Language' in 'how_to_use_channel_filters_subscribe_filters_and_message_filters' result"
  );
  assert(
    channelFiltersResult.content[0].text.includes('message.priority == "high"'),
    "Expected filter expression example in 'how_to_use_channel_filters_subscribe_filters_and_message_filters' result"
  );
  console.log("'read_pubnub_resources' tool with 'how_to_use_channel_filters_subscribe_filters_and_message_filters' returned content successfully.");

  // Test error handling for 'read_pubnub_resources' tool with invalid document
  console.log("Testing 'read_pubnub_resources' tool with invalid document...");
  try {
    await client.callTool({
      name: 'read_pubnub_resources',
      arguments: { document: 'nonexistent_doc' },
    });
    assert(false, "Expected 'read_pubnub_resources' with invalid document to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool read_pubnub_resources'),
      `Unexpected error for invalid document: ${err.message}`
    );
  }
  console.log("'read_pubnub_resources' invalid document error handling works successfully.");

  // Additional test for 'get_pubnub_messages' tool with multiple channels
  console.log("Testing 'get_pubnub_messages' tool with multiple channels...");
  const multiMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel', 'another-channel'] },
  });
  assert(
    Array.isArray(multiMessagesResult.content) &&
      multiMessagesResult.content.length > 0 &&
      multiMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' with multiple channels returned no content."
  );
  console.log("'get_pubnub_messages' multiple channels returned content successfully.");

  // Test 'get_pubnub_messages' tool with pagination parameters
  console.log("Testing 'get_pubnub_messages' tool with pagination parameters (count)...");
  const paginatedMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel'], count: 5 },
  });
  assert(
    Array.isArray(paginatedMessagesResult.content) &&
      paginatedMessagesResult.content.length > 0 &&
      paginatedMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' with count parameter returned no content."
  );
  console.log("'get_pubnub_messages' with count parameter returned content successfully.");

  // Test 'get_pubnub_messages' tool with start timetoken
  console.log("Testing 'get_pubnub_messages' tool with start timetoken...");
  const startTimeMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel'], start: '15000000000000000' },
  });
  assert(
    Array.isArray(startTimeMessagesResult.content) &&
      startTimeMessagesResult.content.length > 0 &&
      startTimeMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' with start timetoken returned no content."
  );
  console.log("'get_pubnub_messages' with start timetoken returned content successfully.");

  // Test 'get_pubnub_messages' tool with end timetoken
  console.log("Testing 'get_pubnub_messages' tool with end timetoken...");
  const endTimeMessagesResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { channels: ['test-channel'], end: '17000000000000000' },
  });
  assert(
    Array.isArray(endTimeMessagesResult.content) &&
      endTimeMessagesResult.content.length > 0 &&
      endTimeMessagesResult.content[0].text.length > 0,
    "'get_pubnub_messages' with end timetoken returned no content."
  );
  console.log("'get_pubnub_messages' with end timetoken returned content successfully.");

  // Test 'get_pubnub_messages' tool with all pagination parameters
  console.log("Testing 'get_pubnub_messages' tool with all pagination parameters...");
  const fullPaginationResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { 
      channels: ['test-channel'], 
      start: '15000000000000000',
      end: '17000000000000000',
      count: 10 
    },
  });
  assert(
    Array.isArray(fullPaginationResult.content) &&
      fullPaginationResult.content.length > 0 &&
      fullPaginationResult.content[0].text.length > 0,
    "'get_pubnub_messages' with all pagination parameters returned no content."
  );
  console.log("'get_pubnub_messages' with all pagination parameters returned content successfully.");

  // Test publishing and retrieving a specific message
  console.log("Testing publish and retrieve workflow with pagination...");
  const randomChannel = `test-channel-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const testMessage = {
    text: `Test message at ${new Date().toISOString()}`,
    random: Math.random(),
    testId: 'pagination-test'
  };
  
  // Publish a message
  console.log(`Publishing message to channel '${randomChannel}'...`);
  const publishTestResult = await client.callTool({
    name: 'publish_pubnub_message',
    arguments: { 
      channel: randomChannel, 
      message: JSON.stringify(testMessage) 
    },
  });
  assert(
    Array.isArray(publishTestResult.content) &&
      publishTestResult.content.length > 0 &&
      publishTestResult.content[0].text.includes('Message published successfully'),
    "Failed to publish test message."
  );
  
  // Extract timetoken from publish result
  const publishResponse = publishTestResult.content[0].text;
  const timetokenMatch = publishResponse.match(/Timetoken: (\d+)/);
  const publishedTimetoken = timetokenMatch ? timetokenMatch[1] : null;
  console.log(`Message published with timetoken: ${publishedTimetoken}`);
  
  // Sleep for 2 seconds to ensure message is stored
  console.log("Waiting 2 seconds for message to be stored...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Retrieve the specific message using pagination
  console.log(`Retrieving message from channel '${randomChannel}'...`);
  const retrieveResult = await client.callTool({
    name: 'get_pubnub_messages',
    arguments: { 
      channels: [randomChannel],
      count: 10
    },
  });
  
  assert(
    Array.isArray(retrieveResult.content) &&
      retrieveResult.content.length > 0,
    "Failed to retrieve messages."
  );
  
  // Parse the response and verify our message is there
  const messagesData = JSON.parse(retrieveResult.content[0].text);
  const channelMessages = messagesData.channels[randomChannel];
  
  assert(
    Array.isArray(channelMessages) && channelMessages.length > 0,
    `No messages found in channel '${randomChannel}'.`
  );
  
  // Find our specific message
  const foundMessage = channelMessages.find(msg => {
    try {
      const parsed = typeof msg.message === 'string' ? JSON.parse(msg.message) : msg.message;
      return parsed.testId === 'pagination-test';
    } catch {
      return false;
    }
  });
  
  assert(
    foundMessage !== undefined,
    "Could not find the published test message in retrieved messages."
  );
  
  console.log("Successfully published and retrieved the same message!");
  
  // Test retrieving with timetoken range
  if (publishedTimetoken) {
    console.log("Testing retrieval with timetoken range...");
    const startTimetoken = (BigInt(publishedTimetoken) - BigInt(1000)).toString();
    const endTimetoken = (BigInt(publishedTimetoken) + BigInt(1000)).toString();
    
    const rangeResult = await client.callTool({
      name: 'get_pubnub_messages',
      arguments: { 
        channels: [randomChannel],
        start: startTimetoken,
        end: endTimetoken
      },
    });
    
    assert(
      Array.isArray(rangeResult.content) &&
        rangeResult.content.length > 0,
      "Failed to retrieve messages with timetoken range."
    );
    
    const rangeData = JSON.parse(rangeResult.content[0].text);
    const rangeMessages = rangeData.channels[randomChannel];
    
    assert(
      Array.isArray(rangeMessages) && rangeMessages.length > 0,
      "No messages found in timetoken range."
    );
    
    console.log("Successfully retrieved message using timetoken range!");
  }

  // Test the new 'pubnub_subscribe_and_receive_messages' tool
  console.log("Testing 'pubnub_subscribe_and_receive_messages' tool...");
  const subscribeTestChannel = `subscribe-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const subscribeTestMessage = {
    text: "Test message for subscription",
    timestamp: new Date().toISOString(),
    testType: "subscription-test"
  };
  
  // Start the subscription with a timeout (this will run in background)
  console.log(`Starting subscription to channel '${subscribeTestChannel}' with 5-second timeout...`);
  const subscriptionPromise = client.callTool({
    name: 'pubnub_subscribe_and_receive_messages',
    arguments: { 
      channel: subscribeTestChannel,
      messageCount: 1,
      timeout: 5000
    }
  });
  
  // Wait a moment, then publish a message
  console.log("Waiting 1 second before publishing message...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`Publishing message to channel '${subscribeTestChannel}'...`);
  const subscribePublishResult = await client.callTool({
    name: 'publish_pubnub_message',
    arguments: { 
      channel: subscribeTestChannel, 
      message: JSON.stringify(subscribeTestMessage)
    }
  });
  
  assert(
    Array.isArray(subscribePublishResult.content) &&
      subscribePublishResult.content.length > 0 &&
      subscribePublishResult.content[0].text.includes('Message published successfully'),
    "Failed to publish message for subscription test."
  );
  
  // Wait for the subscription to receive the message
  console.log("Waiting for subscription to receive the message...");
  const subscribeResult = await subscriptionPromise;
  
  assert(
    Array.isArray(subscribeResult.content) &&
      subscribeResult.content.length > 0,
    "'pubnub_subscribe_and_receive_messages' returned no content."
  );
  
  // Parse and verify the received message
  const receivedData = JSON.parse(subscribeResult.content[0].text);
  assert(
    receivedData.channel === subscribeTestChannel,
    `Expected channel '${subscribeTestChannel}', got '${receivedData.channel}'`
  );
  assert(
    receivedData.messageCount === 1,
    `Expected messageCount 1, got ${receivedData.messageCount}`
  );
  assert(
    Array.isArray(receivedData.messages) && receivedData.messages.length === 1,
    "Expected exactly 1 message in the received data"
  );
  
  // Verify the message content
  const receivedMessage = receivedData.messages[0];
  const parsedMessage = typeof receivedMessage.message === 'string' 
    ? JSON.parse(receivedMessage.message) 
    : receivedMessage.message;
  
  assert(
    parsedMessage.testType === "subscription-test",
    "Received message does not match the published message"
  );
  
  console.log("'pubnub_subscribe_and_receive_messages' successfully received the published message!");
  
  // Test with multiple messages
  console.log("Testing 'pubnub_subscribe_and_receive_messages' with multiple messages...");
  const multiSubscribeChannel = `multi-subscribe-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const messageCount = 3;
  
  // Start subscription for multiple messages with timeout
  console.log(`Starting subscription for ${messageCount} messages with 10-second timeout...`);
  const multiSubscriptionPromise = client.callTool({
    name: 'pubnub_subscribe_and_receive_messages',
    arguments: { 
      channel: multiSubscribeChannel,
      messageCount: messageCount,
      timeout: 10000
    }
  });
  
  // Wait a moment, then publish multiple messages
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  for (let i = 1; i <= messageCount; i++) {
    console.log(`Publishing message ${i}/${messageCount}...`);
    const multiMessage = {
      text: `Message ${i} of ${messageCount}`,
      messageNumber: i,
      testType: "multi-subscription-test"
    };
    
    await client.callTool({
      name: 'publish_pubnub_message',
      arguments: { 
        channel: multiSubscribeChannel, 
        message: JSON.stringify(multiMessage)
      }
    });
    
    // Small delay between messages
    if (i < messageCount) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Wait for the subscription to receive all messages
  console.log(`Waiting for subscription to receive all ${messageCount} messages...`);
  const multiSubscribeResult = await multiSubscriptionPromise;
  
  assert(
    Array.isArray(multiSubscribeResult.content) &&
      multiSubscribeResult.content.length > 0,
    "'pubnub_subscribe_and_receive_messages' with multiple messages returned no content."
  );
  
  // Parse and verify the received messages
  const multiReceivedData = JSON.parse(multiSubscribeResult.content[0].text);
  assert(
    multiReceivedData.channel === multiSubscribeChannel,
    `Expected channel '${multiSubscribeChannel}', got '${multiReceivedData.channel}'`
  );
  assert(
    multiReceivedData.messageCount === messageCount,
    `Expected messageCount ${messageCount}, got ${multiReceivedData.messageCount}`
  );
  assert(
    Array.isArray(multiReceivedData.messages) && multiReceivedData.messages.length === messageCount,
    `Expected exactly ${messageCount} messages in the received data, got ${multiReceivedData.messages.length}`
  );
  
  console.log(`'pubnub_subscribe_and_receive_messages' successfully received all ${messageCount} messages!`);

  // Test timeout behavior
  console.log("Testing 'pubnub_subscribe_and_receive_messages' timeout behavior...");
  const timeoutChannel = `timeout-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
  const timeoutResult = await client.callTool({
    name: 'pubnub_subscribe_and_receive_messages',
    arguments: { 
      channel: timeoutChannel,
      messageCount: 1,
      timeout: 2000  // 2 second timeout with no messages published
    }
  });
  
  assert(
    Array.isArray(timeoutResult.content) &&
      timeoutResult.content.length > 0 &&
      timeoutResult.content[0].text.includes('Timeout'),
    "'pubnub_subscribe_and_receive_messages' did not handle timeout correctly."
  );
  
  console.log("'pubnub_subscribe_and_receive_messages' timeout behavior works correctly!");

  // Additional test for 'get_pubnub_presence' tool with channelGroups option
  console.log("Testing 'get_pubnub_presence' tool with channelGroups option...");
  const presenceCgResult = await client.callTool({
    name: 'get_pubnub_presence',
    arguments: { channelGroups: ['test-channel-group'] },
  });
  assert(
    Array.isArray(presenceCgResult.content) &&
      presenceCgResult.content.length > 0 &&
      presenceCgResult.content[0].text.length > 0,
    "'get_pubnub_presence' with channelGroups returned no content."
  );
  console.log("'get_pubnub_presence' channelGroups returned content successfully.");

  // Invalid argument tests
  console.log("Testing 'get_pubnub_messages' tool with empty channels (should error)...");
  try {
    await client.callTool({
      name: 'get_pubnub_messages',
      arguments: { channels: [] },
    });
    assert(false, "Expected 'get_pubnub_messages' with empty channels to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool get_pubnub_messages'),
      `Unexpected error for empty channels: ${err.message}`
    );
  }
  console.log("'get_pubnub_messages' empty channels error handling works successfully.");

  console.log("Testing 'write_pubnub_app' tool with invalid appType (should error)...");
  try {
    await client.callTool({
      name: 'write_pubnub_app',
      arguments: { appType: 'chat' },
    });
    assert(false, "Expected 'write_pubnub_app' with invalid appType to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool write_pubnub_app'),
      `Unexpected error for invalid appType: ${err.message}`
    );
  }
  console.log("'write_pubnub_app' invalid appType error handling works successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with invalid language (should error)...");
  try {
    await client.callTool({
      name: 'read_pubnub_sdk_docs',
      arguments: { language: 'haskell', apiReference: 'configuration' },
    });
    assert(false, "Expected 'read_pubnub_sdk_docs' with invalid language to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool read_pubnub_sdk_docs'),
      `Unexpected error for invalid language: ${err.message}`
    );
  }
  console.log("'read_pubnub_sdk_docs' invalid language error handling works successfully.");

  console.log("Testing 'read_pubnub_sdk_docs' tool with missing language (should error)...");
  try {
    await client.callTool({
      name: 'read_pubnub_sdk_docs',
      arguments: { apiReference: 'configuration' },
    });
    assert(false, "Expected 'read_pubnub_sdk_docs' missing language to throw an error.");
  } catch (err) {
    assert(
      err.message.includes('Invalid arguments for tool read_pubnub_sdk_docs'),
      `Unexpected error for missing language: ${err.message}`
    );
  }
  console.log("'read_pubnub_sdk_docs' missing language error handling works successfully.");
  
  console.log('All tests passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
