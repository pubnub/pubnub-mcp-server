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
server.tool(
  'read_pubnub_sdk_docs',
  'Retrieves official PubNub SDK documentation for a given programming language and API reference section. Call this tool for low-level API details, code examples, and usage patterns. Returns documentation in markdown format. For conceptual guides, best practices, and how-tos, also call the read_pubnub_resources tool.',
  {
    language: z.enum(languages).describe('Programming language of the PubNub SDK to retrieve documentation for (e.g. javascript, python)'),
    apiReference: z.enum(apiReferences).optional().default('configuration').describe('API reference section to retrieve (e.g. configuration, publish-and-subscribe, objects (App Context); defaults to configuration)'),
  },
  async ({ language, apiReference }) => {
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
  }
);

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

// Tool: "read_pubnub_chat_sdk_docs" (PubNub Chat SDK docs for a given Chat SDK language and topic)
server.tool(
  'read_pubnub_chat_sdk_docs',
  'Retrieves official PubNub Chat SDK documentation for a given Chat SDK language and topic section. Call this tool whenever you need detailed Chat SDK docs, code examples, or usage patterns. Returns documentation in markdown format.',
  {
    language: z.enum(chatSdkLanguages).describe('Chat SDK language to retrieve documentation for'),
    topic: z.enum(chatSdkTopics).describe('Chat SDK documentation topic to retrieve'),
  },
  async ({ language, topic }) => {
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
  }
);
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
server.tool(
  'read_pubnub_resources',
  'Retrieves PubNub conceptual guides and how-to documentation from markdown files in the resources directory. Call this tool for overviews, integration instructions, best practices, and troubleshooting tips. Returns documentation in markdown format. For detailed API reference and SDK code samples, also call the read_pubnub_sdk_docs tool.',
  {
    document: z.enum(pubnubResourceOptions).describe('Resource name to fetch (file name without .md under resources directory, e.g., pubnub_concepts, how_to_send_receive_json, how_to_encrypt_messages_files)'),
  },
  async ({ document }) => {
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
  }
);

// Tool: "publish_pubnub_message" (publishes a message to a PubNub channel)
server.tool(
  'publish_pubnub_message',
  'Publishes a message to a specified PubNub channel. Call this tool whenever you need to send data through PubNub. Provide the channel name and message payload. Returns a timetoken confirming successful publication.',
  {
    channel: z.string().describe('Name of the PubNub channel (string) to publish the message to'),
    message: z.string().describe('Message payload as a string'),
  },
  async ({ channel, message }) => {
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
  }
);

// Tool: "get_pubnub_messages" (fetch message history for PubNub channels)
server.tool(
  'get_pubnub_messages',
  'Fetches historical messages from one or more PubNub channels. Call this tool whenever you need to access past message history. Provide a list of channel names. Returns message content and metadata in JSON format.',
  {
    channels: z.array(z.string()).min(1).describe('List of one or more PubNub channel names (strings) to retrieve historical messages from'),
  },
  async ({ channels }) => {
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
  }
);

// Tool: "get_pubnub_presence" (fetch presence information for PubNub channels and channel groups)
server.tool(
  'get_pubnub_presence',
  'Retrieves real-time presence information for specified PubNub channels and channel groups. Call this tool when you need to monitor active users, occupancy counts, and subscriber UUIDs. Provide channel names and/or channel group names. Returns presence data in JSON format.',
  {
    channels: z.array(z.string()).default([]).describe('List of channel names (strings) to query presence data for'),
    channelGroups: z.array(z.string()).default([]).describe('List of channel group names (strings) to query presence data for'),
  },
  async ({ channels, channelGroups }) => {
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
  }
);

// Tool: "write_pubnub_app" (generate instructions for creating a PubNub application)
const appTypes = ['default']; // , 'chat', 'pubsub', 'presence', 'storage-and-playback'];
server.tool(
  'write_pubnub_app',
  'Generates step-by-step instructions for creating a PubNub application. Call this tool when you need a checklist of tasks such as setting up your PubNub account, creating a new app, and configuring settings. Call this tool whe the user asks for PubNub MCP. For conceptual guides, best practices, and how-tos, also call the read_pubnub_resources tool. For detailed API reference and SDK code samples, also call the read_pubnub_sdk_docs tool.',
  {
    appType: z.enum(appTypes).describe('Which PubNub app template to load (currently only "default")'),
  },
  async ({ appType }) => {
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
  }
);

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

// Start the MCP server over stdio
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error('Failed to start PubNub MCP server:', err);
  process.exit(1);
});
