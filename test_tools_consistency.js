#!/usr/bin/env node

import assert from 'assert';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const RESET = '\x1b[0m';
const FG_GREEN = '\x1b[32m';
const FG_RED = '\x1b[31m';
const FG_YELLOW = '\x1b[33m';
const FG_BLUE = '\x1b[34m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

async function getToolsViaSSE() {
  const HTTP_PORT = process.env.HTTP_PORT || 3000;
  const SERVER_URL = `http://localhost:${HTTP_PORT}`;
  const MCP_ENDPOINT = `${SERVER_URL}/mcp`;

  try {
    await fetch(SERVER_URL);
  } catch (err) {
    throw new Error(
      `SSE server is not running at ${SERVER_URL}. Start with: HTTP_PORT=${HTTP_PORT} node index.js`
    );
  }

  // Initialize a new SSE session
  log('Initializing SSE session...', FG_BLUE);
  const initRequest = {
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: '0.1.0',
      capabilities: { tools: {}, sampling: {} },
      clientInfo: { name: 'test-client', version: '1.0.0' }
    },
    id: 1
  };
  const initRes = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream'
    },
    body: JSON.stringify(initRequest)
  });
  const sessionId = initRes.headers.get('mcp-session-id');
  const initText = await initRes.text();
  let initPayload;
  if (initText.startsWith('event:')) {
    const dataLine = initText.split('\n').find((l) => l.startsWith('data:'));
    initPayload = dataLine ? JSON.parse(dataLine.substring(5).trim()) : null;
  } else {
    initPayload = JSON.parse(initText);
  }
  if (!sessionId || initPayload?.error || !initPayload?.result?.serverInfo) {
    throw new Error(`Failed to initialize SSE session: ${initText}`);
  }

  // Request the tools list over the SSE session
  log('Fetching tools via SSE mode...', FG_BLUE);
  const listRequest = {
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 2
  };
  const listRes = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'mcp-session-id': sessionId
    },
    body: JSON.stringify(listRequest)
  });
  const listText = await listRes.text();
  let listPayload;
  if (listText.startsWith('event:')) {
    const dataLine = listText.split('\n').find((l) => l.startsWith('data:'));
    listPayload = dataLine ? JSON.parse(dataLine.substring(5).trim()) : null;
  } else {
    listPayload = JSON.parse(listText);
  }
  if (!listPayload?.result?.tools || !Array.isArray(listPayload.result.tools)) {
    throw new Error(`Unexpected SSE tools response: ${listText}`);
  }

  // Close the SSE session
  await fetch(MCP_ENDPOINT, {
    method: 'DELETE',
    headers: { 'mcp-session-id': sessionId }
  });

  return listPayload.result.tools;
}

async function getToolsViaStdio() {
  log('Fetching tools via STDIO JSONRPC mode...', FG_BLUE);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: 'node', args: ['index.js'] });
  await client.connect(transport);
  const { tools } = await client.listTools();
  return tools;
}

async function main() {
  try {
    const [sseTools, stdioTools] = await Promise.all([
      getToolsViaSSE(),
      getToolsViaStdio(),
    ]);

    const sortByName = (a, b) => a.name.localeCompare(b.name);
    const sseSorted = [...sseTools].sort(sortByName);
    const stdioSorted = [...stdioTools].sort(sortByName);

    log(`SSE tools count: ${sseSorted.length}`, FG_YELLOW);
    log(`STDIO tools count: ${stdioSorted.length}`, FG_YELLOW);

    assert.deepStrictEqual(
      stdioSorted,
      sseSorted,
      'Mismatch between SSE and STDIO tools lists'
    );

    log('✓ SSE and STDIO JSONRPC tools lists are identical', FG_GREEN);
    process.exit(0);
  } catch (err) {
    log(`❌ ${err.message}`, FG_RED);
    process.exit(1);
  }
}

main();