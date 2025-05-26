# PubNub Functions 2.0 Development Guidelines

## Overview

PubNub Functions 2.0 allow you to run custom JavaScript code on PubNub's servers in response to real-time events or HTTP requests, without managing your own infrastructure. Each Function is defined as a JavaScript module with a default exported async function. Functions execute in a **serverless sandbox environment** with a set of built-in modules available via `require()`.

**Key features of PubNub Functions 2.0:**

* **Event-driven execution:** Functions can trigger on PubNub message events (before or after publish, signals, presence events), on a schedule (interval timers), or via HTTP endpoints (on-request Functions).
* **Default export structure:** Each Function module must `export default async function(...) { ... }`. Depending on the event type, the function receives different parameters.
* **Built-in modules:** A variety of modules are available to extend functionality – for example, persistent storage (`kvstore`), making HTTP requests (`xhr`), secret storage (`vault`), PubNub publish/subscribe actions (`pubnub`), utility libraries (UUID generation, cryptography, etc.).
* **Asynchronous code support:** The Functions 2.0 runtime supports modern JavaScript, including `async/await`. Always use `await` and `try/catch` for clarity.
* **Execution limits:** Functions have some limits to prevent infinite loops or excessive work. Notably, a Function that triggers other Functions can only chain up to **3** executions deep. Also, in a single execution, you can perform at most **3** combined operations of certain types (KV store reads/writes, XHR fetches, or PubNub publish/fire calls).

---

## Function Structure and Event Types

Depending on how a Function is triggered, the signature of the exported function and how you handle the event differ:

### Before/After Event (Publish, Signal, etc.)

For non-HTTP event triggers, use a single parameter and return `ok()` or `abort()` on it:

```js
export default async (event) => {
  // Your business logic for the event
  // Access event data:
  const message = event.message;       // The published message payload (as an object)
  const channel = event.channels[0];   // Channel name that triggered the Function
  // ... process the message ...

  return event.ok();   // indicate successful completion
  // Use event.abort() to stop or block the event (in a Before trigger) if needed
};
```

In a **Before Publish** Function, calling `event.abort()` will prevent the message from being delivered. In an **After** Function, `event.abort()` simply stops further function processing.

### On Request (HTTP Function)

For HTTP-triggered Functions, use two parameters and respond with `response.send()`:

```js
export default async (request, response) => {
  try {
    // Access request data:
    const params = request.params;       // URL path parameters, if any
    const query = request.query;         // Query string parameters
    const body = await request.json();   // Parsed JSON body (if JSON content-type)
    // ... perform operations based on the request ...

    return response.send({ status: 'OK' }, 200);  // send JSON response with HTTP 200
  } catch (err) {
    console.error('Request handling error:', err);
    return response.send({ error: 'Internal Server Error' }, 500);
  }
};
```

### On Interval (Scheduled Function)

On Interval Functions use the same pattern as other event triggers (single `event` parameter):

```js
export default async (event) => {
  // This code executes on a schedule (no incoming message)
  // e.g., perform periodic aggregation or cleanup
  console.log('On Interval trigger fired at', new Date().toISOString());

  // ... your periodic task logic ...

  return event.ok();  // complete successfully
};
```

---

## Channel Pattern Wildcards in 2.0

When configuring which channel(s) a Function should trigger on, you can specify a channel name or a wildcard pattern. PubNub Functions 2.0 supports wildcard patterns with specific rules:

* The `*` wildcard matches exactly one channel segment (a segment is a dot-delimited token in a channel name). Wildcards **must be at the end of the channel pattern**.
* You can have up to two literal segments before the wildcard. In other words, patterns of the form `prefix.*` or `prefix1.prefix2.*` are allowed.

**Wildcard pattern examples:**

* ✅ **Valid**: `challenge.*` – matches `challenge.`***anything*** (one segment after "challenge").
* ✅ **Valid**: `challenge.votes.*` – matches `challenge.votes.`***anything*** (one segment after "challenge.votes").
* ❌ **Invalid**: `challenge.*.votes` – wildcard is not in the final position.
* ❌ **Invalid**: `*.global` – cannot start with a wildcard.

---

## Promises and Async/Await in Functions

All PubNub Functions APIs use Promises for asynchronous operations. In Functions 2.0 you can and should use `async/await` for cleaner code. Avoid using `.then()`/`.catch()` chains.

#### **Preferred (async/await with try/catch)**

```js
export default async (request) => {
  const db = require('kvstore');
  const xhr = require('xhr');
  try {
    const [fullName, ipResponse] = await Promise.all([
      db.get('fullName'),
      xhr.fetch("https://httpbin.org/ip")
    ]);
    request.message.fullName = fullName;
    request.message.ip = JSON.parse(ipResponse.body).origin;
    return request.ok();
  } catch (err) {
    console.error('Error in function execution:', err);
    return request.abort(err);
  }
};
```

**Always wrap your function logic in a try/catch** so that errors are caught and handled gracefully.

---

## Available Modules in PubNub Functions 2.0

PubNub provides a collection of built-in modules that you can `require()` in your Function to perform common tasks. **All module methods are asynchronous (return Promises)** unless otherwise noted, so use `await` when calling them.

### Core Modules

* **`xhr`** - HTTP requests to external APIs
* **`kvstore`** - Key-value storage for persisting data
* **`vault`** - Secure storage for sensitive information like API keys
* **`pubnub`** - Core PubNub client API for publishing, files, etc.

### Utility Modules

* **`crypto`** - Cryptographic functions (HMAC, hashing, etc.)
* **`utils`** - General utilities (random numbers, numeric checks)
* **`uuid`** - UUID generation and validation
* **`jwt`** - JSON Web Token creation and verification
* **`advanced_math`** - Geospatial calculations and math functions

### Codec Modules

* **`codec/auth`** - Basic authentication header generation
* **`codec/base64`** - Base64 encoding/decoding
* **`codec/query_string`** - URL query parameter parsing

### Advanced Modules

* **`jsonpath`** - JSONPath queries for complex JSON manipulation

---

## Module Usage Examples

### XHR Module (HTTP Requests)

```js
const xhr = require('xhr');

// GET request
const response = await xhr.fetch('https://api.example.com/data');
const data = JSON.parse(response.body);

// POST request with JSON body
const postOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
};
const result = await xhr.fetch('https://api.example.com/endpoint', postOptions);
```

### KV Store Module (Persistent Storage)

```js
const db = require('kvstore');

// Store data with TTL
await db.set("user:123", { name: "Alice" }, 1440); // 1 day TTL

// Retrieve data
const userData = await db.get("user:123");

// Atomic counters
const newCount = await db.incrCounter("page_views");
```

### Vault Module (Secrets Storage)

```js
const vault = require('vault');

// Retrieve secret securely
const apiKey = await vault.get("myApiKey");
if (!apiKey) {
  throw new Error("API key not found in vault");
}
```

### PubNub Module (Publish/Subscribe)

```js
const pubnub = require('pubnub');

// Publish message
await pubnub.publish({
  channel: "alerts",
  message: { type: "alert", text: "System notification" }
});

// Send signal (lightweight message)
await pubnub.signal({
  channel: "typing",
  message: { user: "alice", typing: true }
});

// Fire event (triggers Functions but not subscribers)
await pubnub.fire({
  channel: "analytics",
  message: { event: "user_action", timestamp: Date.now() }
});
```

### Crypto Module (Cryptographic Operations)

```js
const crypto = require('crypto');

// Generate HMAC signature
const signature = await crypto.hmac('secretKey', 'data', crypto.ALGORITHM.HMAC_SHA256);

// Hash data
const hash = await crypto.sha256('hello world');
```

### UUID Module (Unique Identifiers)

```js
const { v4, validate } = require('uuid');

// Generate random UUID
const id = v4();

// Validate UUID
if (validate(id)) {
  console.log('Valid UUID:', id);
}
```

---

## Best Practices for Writing Functions

* **Use `async/await` and `try/catch`**: Structure your code with asynchronous calls in a linear, synchronous-looking style. Always wrap the function body in a `try/catch` to handle errors.
* **Prefer `request.ok()`/`event.ok()` over raw returns**: For event-triggered functions, call the `.ok()` method on the context object to signify successful completion.
* **Import modules correctly**: Use `const module = require('moduleName')` for any module you need.
* **Avoid long blocking operations**: Functions have execution time limits (a few seconds). Heavy computation or waiting loops are discouraged.
* **Limit external calls and recursion**: Remember the limit of 3 external operations (XHR, KV, publish, fire) per function invocation and 3-deep function chaining.
* **Log appropriately**: Use `console.log()` or `console.error()` for debugging. Do not log sensitive information.

### Standard Function Template

```js
export default async (request, response) => {
  try {
    // 1. Parse inputs (from request.message, request.params, etc.)
    // 2. Perform business logic (e.g., read/write KV store, call external APIs)
    // 3. Return a result using request.ok()/response.send() as appropriate

    return request.ok();  // or response.send() for HTTP
  } catch (e) {
    console.error('Function error:', e);
    return request.abort();  // or response.send("Error", 500) for HTTP
  }
};
```

---

## Real-World Implementation Patterns

### Distributed Counter (Atomic Increment)

```js
// Function Type: Before Signal (triggered on channels matching "votes.*")
export default async (request) => {
  const db = require('kvstore');
  try {
    const voteMessage = request.message;
    const submissionId = voteMessage.submissionId;
    const counterKey = `votes:${submissionId}`;

    // Atomically increment the vote count
    const newCount = await db.incrCounter(counterKey);
    console.log(`Vote count for submission ${submissionId} is now ${newCount}`);

    return request.ok();
  } catch (error) {
    console.error('Error incrementing vote count:', error);
    return request.abort();
  }
};
```

### Periodic Aggregation and Broadcast

```js
// Function Type: On Interval (runs every 5000 ms)
export default async (event) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  try {
    const allKeys = await db.getKeys();
    const voteData = {};

    // Collect all vote counters
    for (const key of allKeys) {
      if (key.startsWith('votes:')) {
        const count = await db.getCounter(key);
        voteData[key.replace('votes:', '')] = count;
      }
    }

    // Publish aggregated vote counts
    await pubnub.publish({
      channel: 'vote_updates',
      message: { type: 'vote_counts', data: voteData, timestamp: Date.now() }
    });

    return event.ok();
  } catch (error) {
    console.error('Error broadcasting vote totals:', error);
    return event.abort();
  }
};
```

---

**When generating or transforming PubNub Functions code, always:**  
- Use the above patterns for structure.  
- Replace `.then()` chains with async/await + try/catch.  
- Use the correct module and method signatures as described.
- Ensure proper error handling and completion calls.
