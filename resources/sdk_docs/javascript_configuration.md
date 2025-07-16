# PubNub JavaScript SDK – Configuration (concise reference)

Load SDK  
```  
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.js">script>  
```  

---

## Bundling

### Rollup
1. Clone https://github.com/pubnub/javascript  
2. In `rollup.config.js`, set `enableTreeShaking = true`.  
3. Disable modules via env-vars, e.g.  
   ```  
   `export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
   ```  
4. Run  
   ```
   rollup -c rollup.config.js --bundleConfigAsCjs
   ```  
   Result is placed in `<repo>/upload`.

### Webpack
1. Clone repo, create `webpack.config.js` based on `rollup.config.js`.  
2. Example of dynamic module enabling/disabling:  
   ```  
   `const webpack = require('webpack');  
     
   module.exports = {  
     // ...  
     plugins: [  
       new webpack.DefinePlugin({  
         'process.env.CRYPTO_MODULE'                    : JSON.stringify(process.env.CRYPTO_MODULE ?? 'enabled'),  
         'process.env.SHARED_WORKER'                   : JSON.stringify(process.env.SHARED_WORKER ?? 'enabled'),  
         'process.env.PUBLISH_MODULE'                  : JSON.stringify(process.env.PUBLISH_MODULE ?? 'enabled'),  
         'process.env.SUBSCRIBE_MODULE'                : JSON.stringify(process.env.SUBSCRIBE_MODULE ?? 'enabled'),  
         'process.env.SUBSCRIBE_EVENT_ENGINE_MODULE'   : JSON.stringify(process.env.SUBSCRIBE_EVENT_ENGINE_MODULE ?? 'enabled'),  
         'process.env.SUBSCRIBE_MANAGER_MODULE'        : JSON.stringify(process.env.SUBSCRIBE_MANAGER_MODULE ?? 'enabled'),  
         'process.env.PRESENCE_MODULE'                 : JSON.stringify(process.env.PRESENCE_MODULE ?? 'enabled'),  
         'process.env.PAM_MODULE'                      : JSON.stringify(process.env.PAM_MODULE ?? 'enabled'),  
         'process.env.CHANNEL_GROUPS_MODULE'           : JSON.stringify(process.env.CHANNEL_GROUPS_MODULE ?? 'enabled'),  
       })  
     ]  
   };  
   ```  
3. Disable modules (same `export` command as Rollup).  
4. Build: `npx webpack --config webpack.config.js`.

---

## Initialization

Create a client with account credentials and options:

```  
`pubnub.PubNub({  
  subscribeKey: string,      // required  
  publishKey: string,        // optional for read-only clients  
  userId: string,            // required, replaces uuid  
  secretKey: string,         // servers only, grants root PAM perms  
  authKey: string,           // client authentication token (NOT the same as Access Manager tokens)  
  logVerbosity: boolean,     // default false  
  ssl: boolean,              // default true (>=4.20.0)  
  origin: string|string[],   // default "ps.pndsn.com"  
  presenceTimeout: number,   // default 300 (sec)  
  heartbeatInterval: number, // recommended (presenceTimeout/2)-1  
  keepAlive: boolean,        // default false  
  keepAliveSettings: {       // optional (shown below)  
    keepAliveMsecs: number,  
    freeSocketKeepAliveTimeout: number,  
    timeout: number,  
    maxSockets: number,  
    maxFreeSockets: number  
  },  
  suppressLeaveEvents: boolean,          // default false  
  requestMessageCountThreshold: number,  // default 100  
  enableEventEngine: boolean,            // default false  
  restore: boolean,                      // browser, default false  
  retryConfiguration: RequestRetryPolicy,// default Exponential (subscribe only)  
  autoNetworkDetection: boolean,         // ignored if enableEventEngine true  
  listenToBrowserNetworkEvents: boolean, // browser, default true  
  maintainPresenceState: boolean,        // auto true when enableEventEngine true  
  cryptoModule: PubNub.CryptoModule,  
  subscriptionWorkerUrl: string,  
  /* deprecated */ cipherKey, useRandomIVs, uuid  
})  
```  

Key parameter notes (omit unchanged values for brevity):  
• `keepAliveSettings` defaults: `{ keepAliveMsecs:1000, freeSocketKeepAliveTimeout:15000, timeout:30000, maxSockets:Infinity, maxFreeSockets:256 }`  
• `retryConfiguration` helpers:  
  • `PubNub.NoneRetryPolicy()`  
  • `PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })`  
  • `PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })`  

---

## ⚠️ Common Confusion: authKey vs token

**IMPORTANT**: Do not confuse these two concepts when implementing Access Manager V3:

- **`authKey`** (configuration parameter): Used in client initialization to authenticate the client
  ```javascript
  const pubnub = new PubNub({
    subscribeKey: 'mySubscribeKey',
    publishKey: 'myPublishKey',
    userId: 'myUserId',
    authKey: 'myAuthToken'  // ✅ CORRECT: Use authKey for client configuration
  });
  ```

- **`token`** (method parameter): Used in Access Manager V3 methods like `grantToken()`, `setToken()`, etc.
  ```javascript
  // ✅ CORRECT: token is used in Access Manager methods
  const generatedToken = await pubnub.grantToken({...});
  pubnub.setToken(generatedToken);
  ```

**Common Mistake**: Never use `token` as a configuration parameter in client initialization:
```javascript
// ❌ INCORRECT: Do not use 'token' in client configuration
const pubnub = new PubNub({
  subscribeKey: 'mySubscribeKey',
  publishKey: 'myPublishKey',
  userId: 'myUserId',
  token: 'myAuthToken'  // ❌ WRONG: This will not work
});
```

---

## cryptoModule

Two built-in options (both decrypt either cipher):  
• Legacy 128-bit (default if only `cipherKey`/`useRandomIVs` supplied)  
• Recommended 256-bit AES-CBC (explicitly set via `cryptoModule`)  

_Disable random IVs only for legacy (<4.31.0) backward compatibility._

```  
`  
```  

---

## Shared workers

Source:  
```  
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.9.7.0.js  
```  

1. Host the file under the same origin as the page (Same-Origin Policy).  
2. When initializing, supply:  
   ```  
   `  
   ```  
   The client downloads and uses the worker to multiplex subscribe connections and maintain accurate presence across tabs.  
3. Worker version must match SDK version.

---

## Server-side initialization (with secretKey)

```  
`var pubnub = new PubNub({  
    subscribeKey: "mySubscribeKey",  
    publishKey : "myPublishKey",  
    userId     : "myUniqueUserId",  
    secretKey  : "secretKey",  
    heartbeatInterval: 0  
});  
```  

---

## Utility setters/getters

```  
`pubnub.setUserId(string)`     // change current userId  
`pubnub.getUserId()`           // returns current userId  
`pubnub.setAuthKey(string)`    // replace authKey at runtime  
```

---

## Stream Filter (requires Stream Controller add-on)

```  
`pubnub.setFilterExpression(filterExpression: string)`  
`pubnub.getFilterExpression()`  
```  

---

### Blank/placeholder code blocks from original spec (kept verbatim)

```  
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
```  

```  
`  
```  

```  
`  
```  

```  
`  
```  

```  
`**`  
```