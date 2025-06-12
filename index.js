#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath, URL } from 'url';
import { dirname, join as pathJoin, extname, basename } from 'path';
import fs from 'fs';
import PubNub from 'pubnub';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(pathJoin(__dirname, 'package.json'), 'utf8'));

// Create and configure PubNub instance with userId = 'pubnub_mcp'
const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY || 'demo',
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || 'demo',
  userId: 'pubnub_mcp',
});

// MCP server setup
const server = new McpServer({
  name: 'pubnub_mcp_server',
  version: pkg.version,
});

// Store tool handlers for reuse in HTTP sessions
const toolHandlers = {};

// Tool definitions - defined once and reused
const toolDefinitions = {};

// Tool: "read_pubnub_sdk_docs" (PubNub SDK docs for a given language)
const languages = [
    'javascript', 'python', 'java', 'go', 'ruby',
    'swift', 'objective-c', 'c-sharp', 'php', 'dart',
    'rust', 'unity', 'kotlin', 'unreal',
];
const apiReferences = [
    'configuration',
    'publish-and-subscribe',
    'presence',
    'access-manager',
    'channel-groups',
    'storage-and-playback',
    'mobile-push',
    'objects',
    'App Context',
    'files',
    'message-actions',
    'misc',
    // Special section for PubNub Functions; loads from local resources/pubnub_functions.md
    'functions',
];

// Define tool metadata for read_pubnub_sdk_docs
toolDefinitions['read_pubnub_sdk_docs'] = {
  name: 'read_pubnub_sdk_docs',
  description: 'Retrieves official PubNub SDK documentation for a given programming language and API reference section. Call this tool for low-level API details, code examples, and usage patterns. Returns documentation in markdown format. For conceptual guides, best practices, and how-tos, also call the read_pubnub_resources tool.',
  parameters: {
    language: z.enum(languages).describe('Programming language of the PubNub SDK to retrieve documentation for (e.g. javascript, python)'),
    apiReference: z.enum(apiReferences).optional().default('configuration').describe('API reference section to retrieve (e.g. configuration, publish-and-subscribe, objects (App Context); defaults to configuration)'),
  }
};

// Define the handler for read_pubnub_sdk_docs
toolHandlers['read_pubnub_sdk_docs'] = async ({ language, apiReference }) => {
    const apiRefKey = apiReference === 'App Context' ? 'objects' : apiReference;
    // Early return for PubNub Functions documentation
    if (apiRefKey === 'functions') {
      try {
        const functionsDoc = fs.readFileSync(
          pathJoin(__dirname, 'resources', 'pubnub_functions.md'),
          'utf8'
        );
        return { content: [ { type: 'text', text: functionsDoc } ] };
      } catch (err) {
        return {
          content: [ { type: 'text', text: `Error loading functions documentation: ${err}` } ],
          isError: true
        };
      }
    }
    const sdkURL = `https://www.pubnub.com/docs/sdks/${language}`;
    const apiRefURL = `https://www.pubnub.com/docs/sdks/${language}/api-reference/${apiRefKey}`;

    const sdkResponse = await loadArticle(sdkURL);
    // Load API reference: fetch remote article or load local functions documentation
    let apiRefResponse;
    if (apiRefKey === 'functions') {
      try {
        apiRefResponse = fs.readFileSync(
          pathJoin(__dirname, 'resources', 'pubnub_functions.md'),
          'utf8'
        );
      } catch (err) {
        apiRefResponse = `Error loading functions documentation: ${err}`;
      }
    } else {
      apiRefResponse = await loadArticle(apiRefURL);

      const lines = apiRefResponse.split('\n');
      const oldIndex = lines.findIndex((line) => /^##\s.*\(old\)/i.test(line));
      if (oldIndex !== -1) {
        apiRefResponse = lines.slice(0, oldIndex).join('\n');
      }
    }
    const context7Response = loadLanguageFile(language);
    const presenceBestPracticesResponse = loadPresenceBestPracticesFile(language);

    // Combine the content of both responses
    let combinedContent;
    if (apiRefKey === 'functions') {
      combinedContent = [apiRefResponse, context7Response].join('\n\n');
    } else {
      combinedContent = [sdkResponse, apiRefResponse, context7Response, presenceBestPracticesResponse].join('\n\n');
    }

    // Return the combined content
    return {
      content: [
        {
          type: 'text',
          text: combinedContent + getPubNubInitSDKInstructions(),
        },
      ],
    };
};


// Function that loads a file from resources directory
function loadLanguageFile(file) {
  // Java Github repository does not have a specific language file, so we return an empty string
  if (file==='java') {
    return '';
  }
  try {
    const content = fs.readFileSync(pathJoin(__dirname, 'resources', 'languages', `${file}.md`), 'utf8');
    return content;
  } catch (err) {
    console.error(`Error loading specific langauge file ${file}: ${err}`);
    return '';
  }
}

// Function that loads presence best practices for JavaScript requests
function loadPresenceBestPracticesFile(language) {
  if (language === 'javascript') {
    try {
      const content = fs.readFileSync(pathJoin(__dirname, 'resources', 'how_to_use_pubnub_presence_best_practices.md'), 'utf8');
      return content;
    } catch (err) {
      console.error(`Error loading presence best practices file: ${err}`);
      return '';
    }
  }
  return '';
}

// Utility function that fetches the article content from the PubNub SDK documentation
async function loadArticle(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `Error fetching ${url}: ${response.status} ${response.statusText}`;
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const article = dom.window.document.querySelector('article');
    const td = new TurndownService();
    return td.turndown(article);
  } catch (err) {
    return `Error fetching ${url}: ${err.message}`;
  }
}

// Parse chat_sdk_urls.txt to generate mapping of Chat SDK documentation URLs per language and topic
const chatSdkUrlsPath = pathJoin(__dirname, 'chat_sdk_urls.txt');
let chatSdkDocsUrlMap = {};
try {
  const chatSdkUrlsContent = fs.readFileSync(chatSdkUrlsPath, 'utf8');
  const lines = chatSdkUrlsContent.split(/\n/);
  let currentLang = null;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      currentLang = null;
      continue;
    }
    if (!line.startsWith('http')) {
      currentLang = line.toLowerCase();
      chatSdkDocsUrlMap[currentLang] = {};
    } else if (currentLang) {
      const url = line;
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      let topicKey;
      const buildIndex = pathSegments.indexOf('build');
      const learnIndex = pathSegments.indexOf('learn');
      if (buildIndex !== -1) {
        topicKey = pathSegments[pathSegments.length - 1];
      } else if (learnIndex !== -1) {
        const remaining = pathSegments.slice(learnIndex + 1);
        topicKey = remaining.length > 1 ? remaining[remaining.length - 1] : remaining[0];
      } else {
        topicKey = pathSegments[pathSegments.length - 1];
      }
      chatSdkDocsUrlMap[currentLang][topicKey] = url;
    }
  }
} catch (err) {
  console.error(`Error loading chat_sdk_urls.txt: ${err}`);
}
const chatSdkLanguages = Object.keys(chatSdkDocsUrlMap);
const chatSdkTopics = chatSdkLanguages.length > 0
  ? Object.keys(chatSdkDocsUrlMap[chatSdkLanguages[0]])
  : [];

// Define the handler for read_pubnub_chat_sdk_docs
toolHandlers['read_pubnub_chat_sdk_docs'] = async ({ language, topic }) => {
    const url = chatSdkDocsUrlMap[language]?.[topic];
    if (!url) {
      return {
        content: [
          { type: 'text', text: `Documentation URL not found for language '${language}' and topic '${topic}'.` },
        ],
        isError: true,
      };
    }
    try {
      const markdown = await loadArticle(url);
      return {
        content: [{ type: 'text', text: markdown }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error fetching ${url}: ${err.message || err}` }],
        isError: true,
      };
    }
};

// Define tool metadata for read_pubnub_chat_sdk_docs
toolDefinitions['read_pubnub_chat_sdk_docs'] = {
  name: 'read_pubnub_chat_sdk_docs',
  description: 'Retrieves official PubNub Chat SDK documentation for a given Chat SDK language and topic section. Call this tool whenever you need detailed Chat SDK docs, code examples, or usage patterns. Returns documentation in markdown format.',
  parameters: {
    language: z.enum(chatSdkLanguages).describe('Chat SDK language to retrieve documentation for'),
    topic: z.enum(chatSdkTopics).describe('Chat SDK documentation topic to retrieve'),
  }
};


// Tool: "read_pubnub_resources" (fetch PubNub conceptual guides and how-to documentation from markdown files)
// Dynamically generate available resource names based on markdown files in the resources directory and languages subdirectory
const resourcesDir = pathJoin(__dirname, 'resources');
const languagesDir = pathJoin(resourcesDir, 'languages');
const pubnubResourceOptions = (() => {
  try {
    // Top-level markdown files in resources directory
    const files = fs.readdirSync(resourcesDir);
    const topLevel = files
      .filter((file) => fs.statSync(pathJoin(resourcesDir, file)).isFile())
      .filter((file) => extname(file).toLowerCase() === '.md')
      .map((file) => basename(file, extname(file)));
    // Markdown files in resources/languages directory
    let langFiles = [];
    if (fs.existsSync(languagesDir)) {
      langFiles = fs.readdirSync(languagesDir)
        .filter((file) => fs.statSync(pathJoin(languagesDir, file)).isFile())
        .filter((file) => extname(file).toLowerCase() === '.md')
        .map((file) => basename(file, extname(file)));
    }
    return [...topLevel, ...langFiles];
  } catch (err) {
    console.error(`Error reading resources directories: ${err}`);
    return [];
  }
})();

// Define the handler for read_pubnub_resources
toolHandlers['read_pubnub_resources'] = async ({ document }) => {
    try {
      // determine the file path for the requested resource (top-level or languages)
      let filePath = pathJoin(resourcesDir, `${document}.md`);
      if (!fs.existsSync(filePath)) {
        // fallback to languages directory
        filePath = pathJoin(languagesDir, `${document}.md`);
        if (!fs.existsSync(filePath)) {
          return {
            content: [
              {
                type: 'text',
                text: `Documentation file not found: ${document}.md`,
              },
            ],
            isError: true,
          };
        }
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [
          {
            type: 'text',
            text: content + getPubNubInitSDKInstructions(),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading pubnub documentation for '${document}.md': ${err.message || err}`,
          },
        ],
        isError: true,
      };
    }
};

// Define tool metadata for read_pubnub_resources
toolDefinitions['read_pubnub_resources'] = {
  name: 'read_pubnub_resources',
  description: 'Retrieves PubNub conceptual guides and how-to documentation from markdown files in the resources directory. Call this tool for overviews, integration instructions, best practices, and troubleshooting tips. Returns documentation in markdown format. For detailed API reference and SDK code samples, also call the read_pubnub_sdk_docs tool.',
  parameters: {
    document: z.enum(pubnubResourceOptions).describe('Resource name to fetch (file name without .md under resources directory, e.g., pubnub_concepts, how_to_send_receive_json, how_to_encrypt_messages_files)'),
  }
};


// Define the handler for publish_pubnub_message
toolHandlers['publish_pubnub_message'] = async ({ channel, message }) => {
    try {
      const result = await pubnub.publish({
        channel,
        message,
      });
      return {
        content: [
          {
            type: 'text',
            text: `Message published successfully. Timetoken: ${result.timetoken}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error publishing message: ${err}`,
          },
        ],
        isError: true,
      };
    }
};

// Define tool metadata for publish_pubnub_message
toolDefinitions['publish_pubnub_message'] = {
  name: 'publish_pubnub_message',
  description: 'Publishes a message to a specified PubNub channel. Call this tool whenever you need to send data through PubNub. Provide the channel name and message payload. Returns a timetoken confirming successful publication.',
  parameters: {
    channel: z.string().describe('Name of the PubNub channel (string) to publish the message to'),
    message: z.string().describe('Message payload as a string'),
  }
};


// Define the handler for get_pubnub_messages
toolHandlers['get_pubnub_messages'] = async ({ channels }) => {
    try {
      const result = await pubnub.fetchMessages({ channels });
      return {
        content: [
          { type: 'text', text: JSON.stringify(result, null, 2) },
        ],
      };
    } catch (err) {
      return {
        content: [ { type: 'text', text: `Error fetching messages: ${err}` } ],
        isError: true,
      };
    }
};

// Define tool metadata for get_pubnub_messages
toolDefinitions['get_pubnub_messages'] = {
  name: 'get_pubnub_messages',
  description: 'Fetches historical messages from one or more PubNub channels. Call this tool whenever you need to access past message history. Provide a list of channel names. Returns message content and metadata in JSON format.',
  parameters: {
    channels: z.array(z.string()).min(1).describe('List of one or more PubNub channel names (strings) to retrieve historical messages from'),
  }
};


// Define the handler for get_pubnub_presence
toolHandlers['get_pubnub_presence'] = async ({ channels, channelGroups }) => {
    try {
      const result = await pubnub.hereNow({ channels, channelGroups });
      return {
        content: [ { type: 'text', text: JSON.stringify(result, null, 2) } ],
      };
    } catch (err) {
      return {
        content: [ { type: 'text', text: `Error fetching presence information: ${err}` } ],
        isError: true,
      };
    }
};

// Define tool metadata for get_pubnub_presence
toolDefinitions['get_pubnub_presence'] = {
  name: 'get_pubnub_presence',
  description: 'Retrieves real-time presence information for specified PubNub channels and channel groups. Call this tool when you need to monitor active users, occupancy counts, and subscriber UUIDs. Provide channel names and/or channel group names. Returns presence data in JSON format.',
  parameters: {
    channels: z.array(z.string()).default([]).describe('List of channel names (strings) to query presence data for'),
    channelGroups: z.array(z.string()).default([]).describe('List of channel group names (strings) to query presence data for'),
  }
};


// Define the handler for write_pubnub_app
const appTypes = ['default']; // , 'chat', 'pubsub', 'presence', 'storage-and-playback'];
toolHandlers['write_pubnub_app'] = async ({ appType }) => {
    try {
      const fileName = appType === 'default' ? 'how_to_write_a_pubnub_app' : `how_to_write_a_${appType}`;
      const filePath = pathJoin(__dirname, 'resources', `${fileName}.md`);
      if (!fs.existsSync(filePath)) {
        return {
          content: [
            { type: 'text', text: `App template not found: ${fileName}.md` },
          ],
          isError: true,
        };
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: [{ type: 'text', text: content + getPubNubInitSDKInstructions() }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: `Error loading app template '${appType}': ${err.message || err}`,
          },
        ],
        isError: true,
      };
    }
};

// Define tool metadata for write_pubnub_app
toolDefinitions['write_pubnub_app'] = {
  name: 'write_pubnub_app',
  description: 'Generates step-by-step instructions for creating a PubNub application. Call this tool when you need a checklist of tasks such as setting up your PubNub account, creating a new app, and configuring settings. Call this tool whe the user asks for PubNub MCP. For conceptual guides, best practices, and how-tos, also call the read_pubnub_resources tool. For detailed API reference and SDK code samples, also call the read_pubnub_sdk_docs tool.',
  parameters: {
    appType: z.enum(appTypes).describe('Which PubNub app template to load (currently only "default")'),
  }
};


// Define the handler for manage_pubnub_account
const managementSubjects = ['app', 'api_key'];
const managementActions = ['create', 'list', 'delete'];
let sessionToken = null;
let accountId = null;

// Helper function to authenticate with PubNub Admin API
async function authenticateWithPubNub() {
  const email = process.env.PUBNUB_EMAIL;
  const password = process.env.PUBNUB_PASSWORD;
  
  if (!email || !password) {
    throw new Error('PUBNUB_EMAIL and PUBNUB_PASSWORD environment variables must be set');
  }
  
  try {
    const response = await fetch('https://admin.pubnub.com/api/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    sessionToken = data.result.token;
    accountId = data.result.user.account_id;
    
    return { sessionToken, accountId };
  } catch (err) {
    throw new Error(`Authentication error: ${err.message}`);
  }
}

// Helper function to make authenticated API calls with retry
async function makeAuthenticatedRequest(url, options = {}) {
  if (!sessionToken) {
    await authenticateWithPubNub();
  }
  
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      'X-Session-Token': sessionToken,
    },
  };
  
  let response = await fetch(url, requestOptions);
  
  // Retry with re-authentication if session expired
  if (response.status === 401 || response.status === 403) {
    await authenticateWithPubNub();
    requestOptions.headers['X-Session-Token'] = sessionToken;
    response = await fetch(url, requestOptions);
  }
  
  return response;
}

toolHandlers['manage_pubnub_account'] = async ({ subject, action }) => {
  try {
    // Handle list actions
    if (action === 'list') {
      if (subject === 'app') {
        // List apps without keys
        const response = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/apps?owner_id=${accountId}&no_keys=1`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to list apps: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
        
      } else if (subject === 'api_key') {
        // List all apps with their keys
        const response = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/apps?owner_id=${accountId}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to list API keys: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Extract just the keys from all apps for a cleaner response
        const allKeys = [];
        if (data.result && Array.isArray(data.result)) {
          data.result.forEach(app => {
            if (app.keys && Array.isArray(app.keys)) {
              app.keys.forEach(key => {
                allKeys.push({
                  app_name: app.name,
                  app_id: app.id,
                  key_id: key.id,
                  key_name: key.properties?.name || 'Unnamed Key',
                  publish_key: key.publish_key,
                  subscribe_key: key.subscribe_key,
                  secret_key: key.secret_key,
                  status: key.status,
                  type: key.type
                });
              });
            }
          });
        }
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({ 
              total_keys: allKeys.length, 
              keys: allKeys 
            }, null, 2) 
          }],
        };
      }
    }
    
    // Handle create actions
    if (action === 'create') {
      if (subject === 'app') {
        // Create a new app
        const appName = `New App ${new Date().toISOString()}`;
        const response = await makeAuthenticatedRequest(
          'https://admin.pubnub.com/api/apps',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              owner_id: accountId,
              name: appName
            }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to create app: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
          content: [{ 
            type: 'text', 
            text: `App created successfully!\n${JSON.stringify(data, null, 2)}` 
          }],
        };
        
      } else if (subject === 'api_key') {
        // First, we need to get the list of apps to pick one
        const appsResponse = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/apps?owner_id=${accountId}&no_keys=1`
        );
        
        if (!appsResponse.ok) {
          throw new Error(`Failed to get apps: ${appsResponse.status} ${appsResponse.statusText}`);
        }
        
        const appsData = await appsResponse.json();
        if (!appsData.result || appsData.result.length === 0) {
          throw new Error('No apps found. Please create an app first.');
        }
        
        // Use the first app for now
        const appId = appsData.result[0].id;
        const keyName = `New Key ${new Date().toISOString()}`;
        
        // Create a new API key
        const response = await makeAuthenticatedRequest(
          'https://admin.pubnub.com/api/keys',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              app_id: appId,
              type: 1, // production
              properties: {
                name: keyName,
                history: 1,
                message_storage_ttl: 30,
                presence: 1,
                wildcardsubscribe: 1
              }
            }),
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create API key: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const data = await response.json();
        return {
          content: [{ 
            type: 'text', 
            text: `API key created successfully in app "${appsData.result[0].name}"!\n${JSON.stringify(data, null, 2)}` 
          }],
        };
      }
    }
    
    // Handle delete actions
    if (action === 'delete') {
      if (subject === 'app') {
        // Get list of apps to find the most recently created test app
        const appsResponse = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/apps?owner_id=${accountId}&no_keys=1`
        );
        
        if (!appsResponse.ok) {
          throw new Error(`Failed to get apps: ${appsResponse.status} ${appsResponse.statusText}`);
        }
        
        const appsData = await appsResponse.json();
        if (!appsData.result || appsData.result.length === 0) {
          throw new Error('No apps found to delete.');
        }
        
        // Find a test app to delete (look for apps with "Test App" in the name)
        const testApps = appsData.result.filter(app => app.name.includes('Test App'));
        if (testApps.length === 0) {
          return {
            content: [{ 
              type: 'text', 
              text: `No test apps found to delete. Only apps with "Test App" in the name can be deleted via this tool for safety.` 
            }],
            isError: true,
          };
        }
        
        // Sort by created date (descending) and delete the most recent test app
        const appToDelete = testApps.sort((a, b) => b.created - a.created)[0];
        
        // Delete the app
        const deleteResponse = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/apps/${appToDelete.id}`,
          {
            method: 'DELETE',
          }
        );
        
        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text();
          throw new Error(`Failed to delete app: ${deleteResponse.status} ${deleteResponse.statusText} - ${errorText}`);
        }
        
        return {
          content: [{ 
            type: 'text', 
            text: `App deleted successfully!\nDeleted app: "${appToDelete.name}" (ID: ${appToDelete.id})` 
          }],
        };
        
      } else if (subject === 'api_key') {
        // Get all apps with their keys
        const appsResponse = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/apps?owner_id=${accountId}`
        );
        
        if (!appsResponse.ok) {
          throw new Error(`Failed to get API keys: ${appsResponse.status} ${appsResponse.statusText}`);
        }
        
        const appsData = await appsResponse.json();
        
        // Find test keys to delete (look for keys with "Test Key" in the name)
        let keyToDelete = null;
        let appContainingKey = null;
        
        if (appsData.result && Array.isArray(appsData.result)) {
          for (const app of appsData.result) {
            if (app.keys && Array.isArray(app.keys)) {
              const testKeys = app.keys.filter(key => 
                key.properties?.name && key.properties.name.includes('Test Key')
              );
              if (testKeys.length > 0) {
                // Sort by ID (descending) to get the most recent test key
                keyToDelete = testKeys.sort((a, b) => b.id - a.id)[0];
                appContainingKey = app;
                break;
              }
            }
          }
        }
        
        if (!keyToDelete) {
          return {
            content: [{ 
              type: 'text', 
              text: `No test API keys found to delete. Only keys with "Test Key" in the name can be deleted via this tool for safety.` 
            }],
            isError: true,
          };
        }
        
        // Delete the API key
        const deleteResponse = await makeAuthenticatedRequest(
          `https://admin.pubnub.com/api/keys/${keyToDelete.id}`,
          {
            method: 'DELETE',
          }
        );
        
        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text();
          throw new Error(`Failed to delete API key: ${deleteResponse.status} ${deleteResponse.statusText} - ${errorText}`);
        }
        
        return {
          content: [{ 
            type: 'text', 
            text: `API key deleted successfully!\nDeleted key: "${keyToDelete.properties.name}" (ID: ${keyToDelete.id}) from app "${appContainingKey.name}"` 
          }],
        };
      }
    }
    
    return {
      content: [{ type: 'text', text: `Unsupported combination: ${action} ${subject}` }],
      isError: true,
    };
    
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error managing PubNub account: ${err.message}` }],
      isError: true,
    };
  }
};

// Define tool metadata for manage_pubnub_account
toolDefinitions['manage_pubnub_account'] = {
  name: 'manage_pubnub_account',
  description: 'Manages the users PubNub account apps and API key settings. Uses PUBNUB_EMAIL and PUBNUB_PASSWORD environment variables for authentication. Supports creating, listing, and deleting apps and API keys. Delete action only works on test apps/keys (with "Test App" or "Test Key" in the name) for safety.',
  parameters: {
    subject: z.enum(managementSubjects).describe('The subject to manage: "app" for applications, "api_key" for API keys'),
    action: z.enum(managementActions).describe('The action to perform: "create" to create new, "list" to list existing, "delete" to delete test items'),
  }
};

// Helper function to register all tools to a server instance
function registerAllTools(serverInstance) {
  for (const toolName in toolDefinitions) {
    if (toolHandlers[toolName]) {
      // Special handling for chat SDK docs tool
      if (toolName === 'read_pubnub_chat_sdk_docs' && 
          (chatSdkLanguages.length === 0 || chatSdkTopics.length === 0)) {
        continue; // Skip this tool if chat SDK data isn't loaded
      }
      
      const toolDef = toolDefinitions[toolName];
      serverInstance.tool(
        toolDef.name,
        toolDef.description,
        toolDef.parameters,
        toolHandlers[toolName]
      );
    }
  }
}

// Register all tools to the main server
registerAllTools(server);

// Function that returns instructions for creating a PubNub application using the user's API keys
function getPubNubInitSDKInstructions() {
  const publishKey = process.env.PUBNUB_PUBLISH_KEY || 'demo';
  const subscribeKey = process.env.PUBNUB_SUBSCRIBE_KEY || 'demo';
  return `
To initialize the PubNub SDK with your API keys, configure your client in the language of your choice:

JavaScript:
\`\`\`javascript
import PubNub from 'pubnub';

const pubnub = new PubNub({
  publishKey: '${publishKey}',
  subscribeKey: '${subscribeKey}',
  uuid: 'your-unique-uuid',
});
\`\`\`

Python:
\`\`\`python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.publish_key = '${publishKey}'
pnconfig.subscribe_key = '${subscribeKey}'
pnconfig.uuid = 'your-unique-uuid'
pubnub = PubNub(pnconfig)
\`\`\`

Ruby:
\`\`\`ruby
require 'pubnub'

pubnub = Pubnub.new(
  publish_key: '${publishKey}',
  subscribe_key: '${subscribeKey}',
  uuid: 'your-unique-uuid'
)
\`\`\`

Objective-C:
\`\`\`objectivec
#import <PubNub/PubNub.h>

PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"${publishKey}" subscribeKey:@"${subscribeKey}"];
configuration.uuid = @"your-unique-uuid";
PubNub *pubnub = [PubNub clientWithConfiguration:configuration];
\`\`\`

Replace 'your-unique-uuid' with a unique identifier for your client instance.
`;
}

if (process.env.MCP_SUBSCRIBE_ANALYTICS_DISABLED !== 'true') {
  // Online: PubNub server instance for MCP messages
  const pubnubServer = new PubNub({
    publishKey: 'demo',
    subscribeKey: 'demo',
    userId: 'pubnub_mcp_server',
  });

  // Subscribe to the 'pubnub_mcp_server'
  pubnubServer.addListener({
    message: envelope => {
      const { channel, message } = envelope;
      //console.log(`Received message on channel ${channel}:`, message);
    }
  });
  pubnubServer.subscribe({ channels: ['pubnub_mcp_server'] });

  // Publish to the 'pubnub_mcp_server' channel
  setTimeout( () => {
    pubnubServer.publish({
      channel: 'pubnub_mcp_server',
      message: {
        type: 'mcp',
        data: {
          name: 'pubnub_mcp_server',
          version: pkg.version,
          description: 'PubNub MCP server instance',
        },
      },
    }).catch((err) => {
      //console.error('Failed to publish to PubNub MCP server:', err);
    });
  }, 1000);
}

// Check if we should start HTTP server
const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : null;

if (HTTP_PORT) {
  // HTTP Server with StreamableHTTPServerTransport
  const app = express();
  app.use(express.json());

  // Map to store transports by session ID
  const transports = {};

  // Handle POST requests for client-to-server communication
  app.post('/mcp', async (req, res) => {
    // Check for existing session ID
    const sessionId = req.headers['mcp-session-id'];
    let transport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          transports[sessionId] = transport;
        }
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      // Create a new server instance for this session
      const sessionServer = new McpServer({
        name: 'pubnub_mcp_server',
        version: pkg.version,
      });

      // Register all the same tools for this session server
      registerAllTools(sessionServer);

      // Connect to the MCP server
      await sessionServer.connect(transport);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  // Reusable handler for GET and DELETE requests
  const handleSessionRequest = async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  };

  // Handle GET requests for server-to-client notifications via SSE
  app.get('/mcp', handleSessionRequest);

  // Handle DELETE requests for session termination
  app.delete('/mcp', handleSessionRequest);

  app.listen(HTTP_PORT, () => {
    console.log(`PubNub MCP server running on HTTP port ${HTTP_PORT}`);
  });
} else {
  // Start the MCP server over stdio (default behavior)
  const transport = new StdioServerTransport();
  server.connect(transport).catch((err) => {
    console.error('Failed to start PubNub MCP server:', err);
    process.exit(1);
  });
}