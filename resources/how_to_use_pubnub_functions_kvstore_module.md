# How to Use the KV Store Module in PubNub Functions 2.0

The `kvstore` (Key-Value Store) module in PubNub Functions provides a globally-distributed, persistent storage solution for your serverless code. It's useful for storing state, counters, configuration, cached data, and more across different Function executions.

## Requiring the KV Store Module

To use the `kvstore` module, you first need to require it in your Function:

```javascript
const db = require("kvstore"); // Common alias
// or
const store = require("kvstore");
// or  
const kvstore = require("kvstore");
```

## Core Methods

All methods of the `kvstore` module return Promises, so you should always use `async/await` with `try/catch` for error handling.

### 1. `db.set(key, value, ttlMinutes?)`

Stores a JavaScript object or value under the given key with optional Time-To-Live.

*   `key` (String): The unique key for the data (up to 250 characters).
*   `value` (Any): The data to store. Can be any JSON-serializable data (object, array, string, number, boolean).
*   `ttlMinutes` (Number, optional): Time-To-Live in minutes (minimum 1 minute, maximum 1 year = 525,600 minutes). If not provided, defaults to 24 hours (1440 minutes).

```javascript
// Store user preferences with 7-day TTL
await db.set("user_preferences:123", { 
  theme: "dark", 
  notifications: true,
  language: "en"
}, 10080); // 7 days

// Store session data with default 24-hour TTL
await db.set("session:abc123", {
  userId: "user123",
  createdAt: new Date().toISOString(),
  lastActivity: Date.now()
});

// Store a simple value
await db.set("last_update_timestamp", Date.now(), 60); // 1 hour TTL
```

### 2. `db.get(key)`

Retrieves the value associated with a key.

*   `key` (String): The key of the data to retrieve.
*   Returns the stored value. If the key doesn't exist or has expired, returns `null`.

```javascript
// Retrieve user preferences
const userPrefs = await db.get("user_preferences:123");
if (userPrefs) {
  console.log('User Theme:', userPrefs.theme);
  console.log('Notifications enabled:', userPrefs.notifications);
} else {
  console.log('No preferences found for user 123.');
}

// Check if session is valid
const sessionData = await db.get("session:abc123");
if (sessionData) {
  const lastActivity = sessionData.lastActivity;
  const now = Date.now();
  if (now - lastActivity > 1800000) { // 30 minutes
    console.log('Session expired due to inactivity');
  }
}
```

### 3. `db.setItem(key, stringValue, ttlMinutes?)`

Like `set()`, but specifically optimized for plain string values.

*   `key` (String): The key for the data.
*   `stringValue` (String): The string value to store.
*   `ttlMinutes` (Number, optional): TTL in minutes.

```javascript
// Store a simple string value
await db.setItem("api_cache_key", "cached_response_data", 30);

// Store JSON as string (though db.set() is preferred for objects)
await db.setItem("config", JSON.stringify({ version: "2.0" }), 1440);
```

### 4. `db.getItem(key)`

Retrieve a string value by key. Returns the string or `null` if not found.

```javascript
const cachedData = await db.getItem("api_cache_key");
if (cachedData) {
  console.log('Cache hit:', cachedData);
} else {
  console.log('Cache miss - need to fetch fresh data');
}
```

### 5. `db.removeItem(key)`

Deletes a key and its associated value from the store.

```javascript
// Clean up expired session
await db.removeItem("session:abc123");

// Remove user data after account deletion
await db.removeItem("user_preferences:123");
```

### 6. Counter Operations

The KV store supports atomic counters for safe incrementing across distributed function instances.

#### `db.getCounter(key)`

Get the current value of a counter. If the counter was never set, returns `0`.

```javascript
const currentViews = await db.getCounter("page_views:/home");
console.log('Current page views:', currentViews);
```

#### `db.incrCounter(key, increment?)`

Atomically increment a counter and return the new value. If the counter doesn't exist, it's initialized to `0` before incrementing.

*   `key` (String): The counter key.
*   `increment` (Number, optional): Amount to increment by (defaults to `1`). Can be negative to decrement.

```javascript
// Increment page view counter
const newViewCount = await db.incrCounter("page_views:/home");
console.log('New page view count:', newViewCount);

// Increment by custom amount
const totalScore = await db.incrCounter("user_score:123", 50);

// Decrement counter
const remainingCredits = await db.incrCounter("user_credits:123", -1);

// Track daily events
const today = new Date().toISOString().split('T')[0];
const dailyCount = await db.incrCounter(`events:login:${today}`);
```

### 7. Key Management

#### `db.getKeys(paginationKey?)`

Retrieve up to 100 keys currently stored. For more than 100 keys, use pagination.

*   `paginationKey` (String, optional): Token for retrieving the next page of results.
*   Returns an object with `keys` array and optional `next` pagination token.

```javascript
// Get all keys (first page)
const result = await db.getKeys();
console.log('Found keys:', result.keys);

// If there are more than 100 keys, paginate
if (result.next) {
  const nextPage = await db.getKeys(result.next);
  console.log('Next page keys:', nextPage.keys);
}

// Find all user preference keys
const allKeys = await db.getKeys();
const userPrefKeys = allKeys.keys.filter(key => key.startsWith('user_preferences:'));
console.log('User preference keys:', userPrefKeys);
```

#### `db.getCounterKeys()`

List keys that have counter values (similar to `getKeys`, but specifically for counters).

```javascript
const counterKeys = await db.getCounterKeys();
console.log('All counter keys:', counterKeys);
```

## Practical Examples

### Example 1: Rate Limiting with KV Store

```javascript
export default async (request) => {
  const db = require('kvstore');
  const userId = request.message.userId;
  
  try {
    // Check rate limit for user (max 10 requests per minute)
    const rateLimitKey = `rate_limit:${userId}:${Math.floor(Date.now() / 60000)}`;
    const currentCount = await db.getCounter(rateLimitKey);
    
    if (currentCount >= 10) {
      console.log(`Rate limit exceeded for user ${userId}`);
      return request.abort();
    }
    
    // Increment request counter with 2-minute TTL
    await db.incrCounter(rateLimitKey);
    await db.set(rateLimitKey + '_ttl', Date.now(), 2); // Mark for cleanup
    
    // Add rate limit info to message
    request.message.rateLimitRemaining = 10 - (currentCount + 1);
    
    return request.ok();
  } catch (error) {
    console.error('Rate limiting error:', error);
    return request.ok(); // Allow on error to avoid blocking
  }
};
```

### Example 2: Message Caching and Deduplication

```javascript
export default async (request) => {
  const db = require('kvstore');
  const crypto = require('crypto');
  
  try {
    // Create message hash for deduplication
    const messageHash = await crypto.sha256(JSON.stringify(request.message));
    const dedupeKey = `message_hash:${messageHash}`;
    
    // Check if we've seen this message before (within last 5 minutes)
    const existingMessage = await db.get(dedupeKey);
    if (existingMessage) {
      console.log('Duplicate message detected, ignoring');
      return request.abort();
    }
    
    // Store message hash with 5-minute TTL
    await db.set(dedupeKey, {
      originalChannel: request.channels[0],
      timestamp: Date.now(),
      messageId: request.message.id
    }, 5);
    
    // Cache the processed message for potential retrieval
    if (request.message.id) {
      await db.set(`cached_message:${request.message.id}`, request.message, 1440);
    }
    
    return request.ok();
  } catch (error) {
    console.error('Caching error:', error);
    return request.ok();
  }
};
```

### Example 3: User Session Management

```javascript
export default async (request, response) => {
  const db = require('kvstore');
  const uuid = require('uuid');
  
  try {
    const action = request.query.action;
    const sessionToken = request.headers['authorization']?.replace('Bearer ', '');
    
    switch (action) {
      case 'login':
        // Create new session
        const newSessionId = uuid.v4();
        const sessionData = {
          userId: request.body.userId,
          createdAt: new Date().toISOString(),
          lastActivity: Date.now(),
          ipAddress: request.headers['x-forwarded-for'] || 'unknown'
        };
        
        // Store session with 24-hour TTL
        await db.set(`session:${newSessionId}`, sessionData, 1440);
        
        // Track active sessions count
        await db.incrCounter('active_sessions');
        
        return response.send({ sessionToken: newSessionId }, 200);
        
      case 'validate':
        // Validate existing session
        if (!sessionToken) {
          return response.send({ error: 'No session token' }, 401);
        }
        
        const session = await db.get(`session:${sessionToken}`);
        if (!session) {
          return response.send({ error: 'Invalid session' }, 401);
        }
        
        // Update last activity
        session.lastActivity = Date.now();
        await db.set(`session:${sessionToken}`, session, 1440);
        
        return response.send({ valid: true, userId: session.userId }, 200);
        
      case 'logout':
        // End session
        if (sessionToken) {
          const existingSession = await db.get(`session:${sessionToken}`);
          if (existingSession) {
            await db.removeItem(`session:${sessionToken}`);
            await db.incrCounter('active_sessions', -1);
          }
        }
        
        return response.send({ message: 'Logged out' }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Session management error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 4: Configuration Management

```javascript
export default async (request) => {
  const db = require('kvstore');
  
  try {
    // Get application configuration with fallback to defaults
    const config = await db.get('app_config') || {
      maxMessageSize: 1024,
      rateLimitPerMinute: 60,
      enabledFeatures: ['analytics', 'caching'],
      version: '1.0.0'
    };
    
    // Apply configuration to message processing
    if (JSON.stringify(request.message).length > config.maxMessageSize) {
      console.log(`Message too large: ${JSON.stringify(request.message).length} > ${config.maxMessageSize}`);
      return request.abort();
    }
    
    // Add configuration context to message
    request.message.processedWith = {
      configVersion: config.version,
      features: config.enabledFeatures,
      timestamp: Date.now()
    };
    
    // Update usage statistics
    await db.incrCounter('messages_processed_total');
    
    const today = new Date().toISOString().split('T')[0];
    await db.incrCounter(`messages_processed:${today}`);
    
    return request.ok();
  } catch (error) {
    console.error('Configuration error:', error);
    return request.ok(); // Continue processing with defaults
  }
};
```

## Limits and Considerations

*   **Size Limits:**
    *   Key size: Up to 250 characters.
    *   Value size: Up to 30KB (after JSON stringification).
    *   Total KV Store size per keyset: Check current PubNub documentation for limits.
*   **Rate Limits:** High-frequency reads/writes may be throttled. Design your functions to handle this gracefully.
*   **Data Types:** Values are stored as JSON. Complex objects are automatically stringified and parsed.
*   **Atomicity:** `incrCounter` operations are atomic, making them safe for concurrent updates across distributed function instances.
*   **Scope:** The KV Store is scoped to your PubNub keyset. All Functions under the same keyset share the same store.
*   **Consistency:** The KV Store is eventually consistent across regions. For most use cases, this provides sufficient consistency, but be aware of this for highly time-sensitive operations.
*   **TTL Behavior:** Items with expired TTL are automatically removed. The minimum TTL is 1 minute, maximum is 1 year.
*   **Operation Limits:** Remember that KV Store operations count toward the 3-operation limit per function execution.

## Best Practices

*   **Use meaningful key naming conventions** like `user:${userId}`, `session:${sessionId}`, `cache:${hashKey}` to organize your data.
*   **Set appropriate TTLs** to prevent unlimited data accumulation and to ensure data freshness.
*   **Handle null returns gracefully** since `get()` returns `null` for missing or expired keys.
*   **Use counters for metrics** rather than storing and incrementing regular values, as counters are atomic.
*   **Consider data relationships** when designing your key structure to enable efficient queries.
*   **Monitor KV usage** to stay within size and rate limits.
*   **Use pagination** with `getKeys()` when you might have more than 100 keys.