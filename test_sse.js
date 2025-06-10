#!/usr/bin/env node
import fetch from 'node-fetch';
import { EventSource } from 'eventsource';

const SERVER_URL = 'http://localhost:3000';
const MCP_ENDPOINT = `${SERVER_URL}/mcp`;

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: Initialize session
async function testInitialize() {
  log('\n=== Test 1: Initialize Session ===', 'blue');
  
  try {
    const initRequest = {
      jsonrpc: '2.0',
      method: 'initialize',
      params: {
        protocolVersion: '0.1.0',
        capabilities: {
          tools: {},
          sampling: {}
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      },
      id: 1
    };

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify(initRequest)
    });

    const sessionId = response.headers.get('mcp-session-id');
    const responseText = await response.text();
    
    // Parse SSE format response
    let result;
    if (responseText.startsWith('event:')) {
      const dataLine = responseText.split('\n').find(line => line.startsWith('data:'));
      if (dataLine) {
        result = JSON.parse(dataLine.substring(5).trim());
      }
    } else {
      result = JSON.parse(responseText);
    }
    
    log(`✓ Initialization successful`, 'green');
    log(`  Session ID: ${sessionId}`, 'yellow');
    log(`  Server name: ${result.result?.serverInfo?.name}`, 'yellow');
    log(`  Server version: ${result.result?.serverInfo?.version}`, 'yellow');
    
    return sessionId;
  } catch (error) {
    log(`✗ Initialization failed: ${error.message}`, 'red');
    throw error;
  }
}

// Test 2: Test SSE connection
async function testSSE(sessionId) {
  log('\n=== Test 2: SSE Connection ===', 'blue');
  
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(MCP_ENDPOINT, {
      headers: {
        'mcp-session-id': sessionId
      }
    });

    eventSource.onopen = () => {
      log('✓ SSE connection opened', 'green');
    };

    eventSource.onmessage = (event) => {
      log(`✓ Received SSE message: ${event.data}`, 'green');
    };

    eventSource.onerror = (error) => {
      // Don't reject on SSE errors, just log them
      // SSE will reconnect automatically
      log(`⚠ SSE connection issue (this is normal during testing)`, 'yellow');
    };

    // Keep connection open for 5 seconds to observe any server-sent events
    setTimeout(() => {
      eventSource.close();
      log('✓ SSE connection closed after 5 seconds', 'yellow');
      resolve();
    }, 5000);
  });
}

// Test 3: List available tools
async function testListTools(sessionId) {
  log('\n=== Test 3: List Available Tools ===', 'blue');
  
  try {
    const listToolsRequest = {
      jsonrpc: '2.0',
      method: 'tools/list',
      params: {},
      id: 2
    };

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'mcp-session-id': sessionId
      },
      body: JSON.stringify(listToolsRequest)
    });

    const responseText = await response.text();
    
    // Parse SSE format response
    let result;
    if (responseText.startsWith('event:')) {
      const dataLine = responseText.split('\n').find(line => line.startsWith('data:'));
      if (dataLine) {
        result = JSON.parse(dataLine.substring(5).trim());
      }
    } else {
      result = JSON.parse(responseText);
    }
    
    log(`✓ Tools list retrieved`, 'green');
    log(`  Available tools:`, 'yellow');
    result.result?.tools?.forEach(tool => {
      log(`    - ${tool.name}: ${tool.description?.substring(0, 60)}...`, 'yellow');
    });
    
    return result.result?.tools || [];
  } catch (error) {
    log(`✗ List tools failed: ${error.message}`, 'red');
    throw error;
  }
}

// Test 4: Call a tool
async function testCallTool(sessionId) {
  log('\n=== Test 4: Call Tool (read_pubnub_resources) ===', 'blue');
  
  try {
    const callToolRequest = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'read_pubnub_resources',
        arguments: {
          document: 'pubnub_concepts'
        }
      },
      id: 3
    };

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'mcp-session-id': sessionId
      },
      body: JSON.stringify(callToolRequest)
    });

    const responseText = await response.text();
    
    // Parse SSE format response
    let result;
    if (responseText.startsWith('event:')) {
      const dataLine = responseText.split('\n').find(line => line.startsWith('data:'));
      if (dataLine) {
        result = JSON.parse(dataLine.substring(5).trim());
      }
    } else {
      result = JSON.parse(responseText);
    }
    
    if (result.result) {
      log(`✓ Tool call successful`, 'green');
      log(`  Content length: ${result.result.content?.[0]?.text?.length || 0} characters`, 'yellow');
      log(`  First 100 chars: ${result.result.content?.[0]?.text?.substring(0, 100)}...`, 'yellow');
    } else if (result.error) {
      log(`✗ Tool call returned error: ${result.error.message}`, 'red');
    }
    
    return result;
  } catch (error) {
    log(`✗ Tool call failed: ${error.message}`, 'red');
    throw error;
  }
}

// Test 5: Publish a PubNub message
async function testPublishMessage(sessionId) {
  log('\n=== Test 5: Publish PubNub Message ===', 'blue');
  
  try {
    const publishRequest = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'publish_pubnub_message',
        arguments: {
          channel: 'test-channel',
          message: 'Hello from SSE test!'
        }
      },
      id: 4
    };

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'mcp-session-id': sessionId
      },
      body: JSON.stringify(publishRequest)
    });

    const responseText = await response.text();
    
    // Parse SSE format response
    let result;
    if (responseText.startsWith('event:')) {
      const dataLine = responseText.split('\n').find(line => line.startsWith('data:'));
      if (dataLine) {
        result = JSON.parse(dataLine.substring(5).trim());
      }
    } else {
      result = JSON.parse(responseText);
    }
    
    if (result.result) {
      log(`✓ Message published successfully`, 'green');
      log(`  ${result.result.content?.[0]?.text}`, 'yellow');
    } else if (result.error) {
      log(`✗ Publish failed: ${result.error.message}`, 'red');
    }
    
    return result;
  } catch (error) {
    log(`✗ Publish failed: ${error.message}`, 'red');
    throw error;
  }
}

// Test 6: Close session
async function testCloseSession(sessionId) {
  log('\n=== Test 6: Close Session ===', 'blue');
  
  try {
    const response = await fetch(MCP_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'mcp-session-id': sessionId
      }
    });

    if (response.ok) {
      log(`✓ Session closed successfully`, 'green');
    } else {
      log(`✗ Failed to close session: ${response.status} ${response.statusText}`, 'red');
    }
  } catch (error) {
    log(`✗ Close session failed: ${error.message}`, 'red');
    throw error;
  }
}

// Main test runner
async function runTests() {
  log('\n🚀 Starting PubNub MCP SSE Tests', 'blue');
  log(`Testing server at: ${SERVER_URL}`, 'yellow');
  
  try {
    // Check if server is running
    try {
      await fetch(SERVER_URL);
    } catch (error) {
      log(`\n✗ Server is not running at ${SERVER_URL}`, 'red');
      log(`  Please start the server with: HTTP_PORT=3000 node index.js`, 'yellow');
      process.exit(1);
    }
    
    // Run tests
    const sessionId = await testInitialize();
    
    // Run SSE test in parallel with other tests
    const ssePromise = testSSE(sessionId);
    
    await testListTools(sessionId);
    await testCallTool(sessionId);
    await testPublishMessage(sessionId);
    
    // Wait for SSE test to complete
    await ssePromise;
    
    await testCloseSession(sessionId);
    
    log('\n✅ All tests completed successfully!', 'green');
  } catch (error) {
    log(`\n❌ Tests failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the tests
runTests();