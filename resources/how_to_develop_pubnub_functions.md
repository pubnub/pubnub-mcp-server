# How to Develop PubNub Functions 2.0

PubNub Functions 2.0 allow you to execute serverless JavaScript code at the PubNub network edge in response to various events. This enables you to build real-time logic, integrations, and data transformations without managing your own backend infrastructure.

## Overview of PubNub Functions 2.0

*   **JavaScript Modules:** Functions are JavaScript modules with a default export using `export default async function`.
*   **Event-Driven:** They are triggered by events such as incoming messages, HTTP requests, or scheduled intervals.
*   **Built-in Modules:** PubNub Functions provide access to powerful modules:
    *   `kvstore`: A key-value store for persisting data across function executions with TTL support and atomic counters.
    *   `xhr`: For making external HTTP/S requests to third-party APIs or your own servers.
    *   `vault`: A secure store for sensitive information like API keys or tokens.
    *   `pubnub`: The core PubNub client API for publishing messages, managing files, etc.
    *   `crypto`: Cryptographic functions including HMAC and hashing.
    *   `utils`: Utility functions for random numbers and validation.
    *   `uuid`: UUID generation and validation.
    *   `jwt`: JSON Web Token creation and verification.
    *   `codec/*`: Encoding/decoding utilities (auth, base64, query strings).
    *   `advanced_math`: Geospatial calculations and mathematical functions.
    *   `jsonpath`: Complex JSON querying and manipulation.
*   **Asynchronous Operations:** All asynchronous operations use standard JavaScript Promises with `async/await` syntax. **Always avoid `.then()`/`.catch()` chains** for better readability and error handling.
*   **Function Chaining:** You can chain up to **3** Functions consecutively, where the output of one Function can trigger another.
*   **Execution Limits:** A single function execution can perform at most **3** combined operations of certain types (KV store reads/writes, XHR fetches, or PubNub publish/fire calls).
*   **Language:** Functions are written in JavaScript (ES6+ features are supported).

## Function Event Types and Structures

The structure of your Function depends on the event type it handles.

### 1. Before/After Publish, Signal, or Presence Events

These Functions trigger when a message is published to a specific channel or when presence events occur.

*   **`request` or `event` object:** Contains details about the incoming message and client.
*   **Methods:**
    *   `request.ok()` / `event.ok()`: Allows the message to proceed (possibly modified).
    *   `request.abort()` / `event.abort()`: Stops the message from being published or further processed.

**Access event data:**
*   `event.message` / `request.message`: The payload of a published message (as a JavaScript object)
*   `event.channels` / `request.channels`: Array of channel names that triggered the Function
*   For wildcard patterns, multiple channels may be listed

```javascript
// Example: Before Publish Function
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    console.log('Message received:', request.message);
    console.log('Channel:', request.channels[0]);

    // Validate message structure
    if (!request.message || typeof request.message !== 'object') {
      console.error('Invalid message format');
      return request.abort();
    }

    // Example: Add timestamp and increment counter
    request.message.processedAt = new Date().toISOString();
    const messageCount = await db.incrCounter('total_messages');
    request.message.sequenceNumber = messageCount;

    // Example: Publish analytics event (fire doesn't trigger other Functions)
    await pubnub.fire({
      channel: 'analytics',
      message: { 
        event: 'message_processed',
        channel: request.channels[0],
        timestamp: Date.now()
      }
    });

    return request.ok(); // Allow the message to proceed
  } catch (error) {
    console.error('Error processing message:', error);
    return request.abort(); // Stop the message
  }
};
```

### 2. On Request (HTTP Endpoint)

These Functions trigger when an HTTP request is made to a unique URL assigned to the Function.

*   **`request` object:** Contains HTTP request details (method, headers, query params, body).
*   **`response` object:** Used to send an HTTP response back to the caller.
*   **Methods:**
    *   `response.send(body, statusCode)`: Sends the HTTP response.
    *   `request.json()`: Parses the request body as JSON.

```javascript
// Example: REST API endpoint for user management
export default async (request, response) => {
  const db = require('kvstore');
  const vault = require('vault');
  
  try {
    console.log('HTTP Request:', request.method, request.uri);
    
    // Set CORS headers for browser requests
    response.headers['Access-Control-Allow-Origin'] = '*';
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    
    if (request.method === 'OPTIONS') {
      return response.send('', 200);
    }

    // Extract user ID from URL path
    const userId = request.params.userId;
    if (!userId) {
      return response.send({ error: 'Missing user ID' }, 400);
    }

    switch (request.method) {
      case 'GET':
        // Retrieve user data
        const userData = await db.get(`user:${userId}`);
        if (!userData) {
          return response.send({ error: 'User not found' }, 404);
        }
        return response.send(userData, 200);

      case 'POST':
      case 'PUT':
        // Create or update user
        const body = await request.json();
        if (!body.name || !body.email) {
          return response.send({ error: 'Name and email required' }, 400);
        }
        
        const user = {
          id: userId,
          name: body.name,
          email: body.email,
          updatedAt: new Date().toISOString()
        };
        
        await db.set(`user:${userId}`, user, 43200); // TTL: 30 days
        return response.send({ message: 'User saved', user }, 200);

      case 'DELETE':
        await db.removeItem(`user:${userId}`);
        return response.send({ message: 'User deleted' }, 200);

      default:
        return response.send({ error: 'Method not allowed' }, 405);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### 3. On Interval (Scheduled Execution)

These Functions trigger at a predefined time interval (e.g., every 5 minutes).

*   **`event` object:** Contains information about the scheduled event.
*   **Methods:**
    *   `event.ok()`: Signals successful execution.
    *   `event.abort()`: Signals an error during execution.

```javascript
// Example: Periodic cleanup and monitoring
export default async (event) => {
  const db = require('kvstore');
  const xhr = require('xhr');
  const pubnub = require('pubnub');
  
  try {
    console.log('Scheduled cleanup triggered at:', new Date().toISOString());

    // Clean up expired temporary data
    const allKeys = await db.getKeys();
    const tempKeys = allKeys.filter(key => key.startsWith('temp:'));
    
    for (const key of tempKeys) {
      const data = await db.get(key);
      if (!data) { // Already expired
        continue;
      }
      
      // Check if temp data is older than 1 hour
      if (data.createdAt && Date.now() - new Date(data.createdAt).getTime() > 3600000) {
        await db.removeItem(key);
        console.log(`Cleaned up expired temp data: ${key}`);
      }
    }

    // Fetch external health check
    const healthResponse = await xhr.fetch('https://api.example.com/health');
    const healthData = JSON.parse(healthResponse.body);
    
    // Store health metrics
    await db.set('system_health', {
      status: healthData.status,
      lastCheck: new Date().toISOString(),
      uptime: healthData.uptime
    }, 60); // TTL: 1 hour

    // Alert if system is down
    if (healthData.status !== 'healthy') {
      await pubnub.publish({
        channel: 'system_alerts',
        message: {
          type: 'health_alert',
          status: healthData.status,
          timestamp: Date.now()
        }
      });
    }

    return event.ok();
  } catch (error) {
    console.error('Error during scheduled execution:', error);
    
    // Send error notification
    try {
      await pubnub.publish({
        channel: 'system_errors',
        message: {
          type: 'scheduled_function_error',
          error: error.message,
          timestamp: Date.now()
        }
      });
    } catch (publishError) {
      console.error('Failed to publish error notification:', publishError);
    }
    
    return event.abort();
  }
};
```

## Channel Pattern Wildcards

When configuring which channel(s) a Function should trigger on, you can use wildcard patterns:

*   The `*` wildcard matches exactly one channel segment (dot-delimited token)
*   Wildcards **must be at the end** of the channel pattern
*   Maximum of two literal segments before the wildcard

**Valid patterns:**
*   `alerts.*` - matches `alerts.critical`, `alerts.info`, etc.
*   `user.notifications.*` - matches `user.notifications.email`, `user.notifications.push`, etc.

**Invalid patterns:**
*   `alerts.*.critical` - wildcard not at the end
*   `*.notifications` - wildcard at the beginning

## Best Practices for `async/await` and Error Handling

*   **Always use `async/await`:** This is the preferred way to handle Promises returned by PubNub modules and other asynchronous operations.
*   **`try/catch` for Error Handling:** Wrap `await` calls in `try/catch` blocks to handle potential errors gracefully.
*   **`Promise.all()` for Parallel Operations:** When performing multiple independent asynchronous operations, use `Promise.all()` to execute them concurrently.

```javascript
// Best practice example with parallel operations
export default async (request) => {
  const db = require('kvstore');
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    // Execute multiple operations in parallel
    const [userData, apiKey, configData] = await Promise.all([
      db.get(`user:${request.message.userId}`),
      vault.get('external_api_key'),
      xhr.fetch('https://api.config.example.com/settings')
    ]);

    // Process the results
    if (!userData) {
      throw new Error('User not found');
    }
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const config = JSON.parse(configData.body);
    
    // Use the data to enrich the message
    request.message.userProfile = userData;
    request.message.systemConfig = config.settings;

    // Make authenticated API call
    const enrichmentResponse = await xhr.fetch('https://api.example.com/enrich', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: userData,
        message: request.message.content
      })
    });

    const enrichedData = JSON.parse(enrichmentResponse.body);
    request.message.enrichment = enrichedData;

    return request.ok();
  } catch (error) {
    console.error('Error in enrichment function:', error);
    
    // Add error context to message for debugging
    request.message.error = {
      type: 'enrichment_failed',
      message: error.message,
      timestamp: Date.now()
    };
    
    // Still allow message to proceed, but with error info
    return request.ok();
  }
};
```

## Function Development Workflow

### 1. Planning Your Function

Before writing code, consider:
*   **Trigger type:** When should your Function execute?
*   **Input data:** What data will your Function receive?
*   **External dependencies:** What APIs or services will you call?
*   **Output:** How will your Function respond or modify data?
*   **Error scenarios:** What could go wrong and how to handle it?

### 2. Security Considerations

*   **Use Vault for secrets:** Never hardcode API keys or sensitive data
*   **Validate inputs:** Always validate message content and HTTP request data
*   **Limit data exposure:** Don't log sensitive information
*   **Handle authentication:** For HTTP endpoints, implement proper auth checking

### 3. Performance Optimization

*   **Parallel operations:** Use `Promise.all()` for independent async calls
*   **Efficient KV usage:** Group related data to minimize store operations
*   **Cache external data:** Store frequently accessed data in KV store with appropriate TTL
*   **Monitor limits:** Stay within the 3-operation limit per execution

### 4. Testing and Debugging

*   **Use console.log():** Add logging for debugging and monitoring
*   **Test error paths:** Ensure your error handling works correctly
*   **Monitor function logs:** Check PubNub portal for execution logs
*   **Start simple:** Begin with basic functionality, then add complexity

## Common Development Patterns

### Message Transformation

```javascript
export default async (request) => {
  try {
    // Transform message format
    if (request.message.type === 'legacy_format') {
      request.message = {
        version: '2.0',
        data: request.message.content,
        metadata: {
          originalType: request.message.type,
          transformedAt: Date.now()
        }
      };
    }
    
    return request.ok();
  } catch (error) {
    console.error('Transformation error:', error);
    return request.abort();
  }
};
```

### External API Integration

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    const apiKey = await vault.get('slack_webhook_url');
    
    await xhr.fetch(apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New alert: ${request.message.alert}`,
        channel: '#alerts'
      })
    });
    
    return request.ok();
  } catch (error) {
    console.error('Slack notification failed:', error);
    return request.ok(); // Don't block the original message
  }
};
```

### Data Aggregation

```javascript
export default async (request) => {
  const db = require('kvstore');
  
  try {
    const eventType = request.message.type;
    const today = new Date().toISOString().split('T')[0];
    const counterKey = `events:${eventType}:${today}`;
    
    // Increment daily counter
    const count = await db.incrCounter(counterKey);
    
    // Add aggregation info to message
    request.message.analytics = {
      dailyCount: count,
      eventType: eventType,
      date: today
    };
    
    return request.ok();
  } catch (error) {
    console.error('Analytics error:', error);
    return request.ok(); // Don't block the message
  }
};
```

## General Development Guidance

*   **Module Loading:** Use `require('module_name')` to load built-in modules at the top of your function or within the function body.
*   **Default Export:** Your Function must always be an `async` function that is the default export of the module.
*   **Error Handling:** Implement robust error handling using `try/catch` and use `event.abort()` or `request.abort()` appropriately.
*   **Logging:** Use `console.log()` and `console.error()` for debugging. Logs are available in the PubNub portal.
*   **Resource Management:** Be mindful of execution limits and timeouts. Functions should complete quickly.
*   **Idempotency:** Design functions to handle duplicate executions gracefully when possible.