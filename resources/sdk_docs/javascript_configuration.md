# PubNub JavaScript SDK – Configuration (Condensed)

## 1. Load SDK

```html
<script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.8.3.js"></script>
```

---

## 2. Bundling (opt-out unused modules)

### Rollup

1. Clone the repo and set `enableTreeShaking = true` in `rollup.config.js`.  
2. Disable modules via environment variables, e.g.
   ```bash
   export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled
   ```
3. Build:
   ```bash
   rollup -c rollup.config.js --bundleConfigAsCjs
   ```
   The bundle is created in `/upload`.

### Webpack

`webpack.config.js` (excerpt):

```js
const webpack = require('webpack');

module.exports = {
  // …other config…
  plugins: [
    new webpack.DefinePlugin({
      'process.env.CRYPTO_MODULE': JSON.stringify(process.env.CRYPTO_MODULE ?? 'enabled'),
      'process.env.SHARED_WORKER': JSON.stringify(process.env.SHARED_WORKER ?? 'enabled'),
      'process.env.PUBLISH_MODULE': JSON.stringify(process.env.PUBLISH_MODULE ?? 'enabled'),
      'process.env.SUBSCRIBE_MODULE': JSON.stringify(process.env.SUBSCRIBE_MODULE ?? 'enabled'),
      'process.env.SUBSCRIBE_EVENT_ENGINE_MODULE': JSON.stringify(process.env.SUBSCRIBE_EVENT_ENGINE_MODULE ?? 'enabled'),
      'process.env.SUBSCRIBE_MANAGER_MODULE': JSON.stringify(process.env.SUBSCRIBE_MANAGER_MODULE ?? 'enabled'),
      'process.env.PRESENCE_MODULE': JSON.stringify(process.env.PRESENCE_MODULE ?? 'enabled'),
      'process.env.PAM_MODULE': JSON.stringify(process.env.PAM_MODULE ?? 'enabled'),
      'process.env.CHANNEL_GROUPS_MODULE': JSON.stringify(process.env.CHANNEL_GROUPS_MODULE ?? 'enabled'),
    }),
  ],
};
```

Disable modules and build:

```bash
export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled
npx webpack --config webpack.config.js
```

---

## 3. Initialization

```js
pubnub = new PubNub({
  subscribeKey: string,                 // required
  publishKey:  string,                  // optional for read-only
  userId:      string,                  // required
  authKey:     string,
  secretKey:   string,                  // servers only
  logVerbosity: boolean,
  ssl:                  boolean,        // default true ≥4.20
  origin:               string|string[],
  presenceTimeout:      number,         // default 300 s
  heartbeatInterval:    number,
  keepAlive:            boolean,
  keepAliveSettings:    object,
  suppressLeaveEvents:  boolean,
  requestMessageCountThreshold: number, // default 100
  enableEventEngine:    boolean,
  restore:              boolean (browser),
  retryConfiguration:   RequestRetryPolicy,
  autoNetworkDetection: boolean,
  listenToBrowserNetworkEvents: boolean,
  maintainPresenceState: boolean,
  cryptoModule:         PubNub.CryptoModule,
  subscriptionWorkerUrl:string,
  cipherKey:            string, // deprecated, use cryptoModule
  useRandomIVs:         boolean,// deprecated, use cryptoModule
  uuid:                 string  // deprecated, use userId
});
```

Key parameters (defaults shown above when relevant):

• `userId` – unique, persistent identifier (required).  
• `secretKey` – **servers only**; grants full PAM permissions.  
• `cryptoModule` – choose legacy (128-bit) or `PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey })` (256-bit AES-CBC).  
• `subscriptionWorkerUrl` – enable shared-worker mode (see below).

---

## 4. Cryptography (`cryptoModule`)

• Legacy 128-bit cipher (default if only `cipherKey`/`useRandomIVs` are set).  
• Recommended: 256-bit AES-CBC → explicitly set `cryptoModule: PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey })`.  
• SDKs < 7.3.3 cannot decrypt AES-CBC.

---

## 5. Shared Workers

SDK-provided worker (version must match SDK):

```text
http://cdn.pubnub.com/sdk/javascript/pubnub.worker.9.8.3.js
```

Host under the same origin and initialize:

```js
new PubNub({
  /* …keys… */
  userId: "myUniqueUserId",
  subscriptionWorkerUrl: "/pubnub.worker.9.8.3.js"
});
```

Aggregates connections across tabs and prevents spurious presence events.

---

## 6. Common Initialization Examples

Read-write:

```js
var pubnub = new PubNub({
  subscribeKey: "subKey",
  publishKey:   "pubKey",
  userId:       "myUniqueUserId"
});
```

Read-only (omit `publishKey`):

```js
var pubnub = new PubNub({
  subscribeKey: "subKey",
  userId:       "myUniqueUserId"
});
```

TLS:

```js
var pubnub = new PubNub({
  subscribeKey: "subKey",
  publishKey:   "pubKey",
  userId:       "myUniqueUserId",
  ssl: true
});
```

Server with `secretKey`:

```js
var pubnub = new PubNub({
  subscribeKey: "subKey",
  publishKey:   "pubKey",
  userId:       "serverInstance-1",
  secretKey:    "secretKey",
  heartbeatInterval: 0
});
```

---

## 7. User ID Helpers

```js
pubnub.setUserId(string);  // change userId at runtime
pubnub.getUserId();        // returns current userId
```

---

## 8. Authentication Key

```js
pubnub.setAuthKey(string); // replace auth key
```

---

## 9. Stream Filter Expression (requires Stream Controller add-on)

```js
pubnub.setFilterExpression(filterExpression: string);
pubnub.getFilterExpression(); // returns current expression
```

---

_Last updated: Jul 16 2025_
