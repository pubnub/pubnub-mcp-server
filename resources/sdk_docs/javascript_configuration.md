# Configuration API for JavaScript SDK

Include the PubNub JavaScript SDK before initializing the client.

```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.5.js">script>  
`
```

## Bundling[​](#bundling)

Use Rollup or Webpack to bundle only required modules (tree-shaking supported). Start from the SDK config: https://github.com/pubnub/javascript/blob/master/rollup.config.js

### Rollup

- Clone https://github.com/pubnub/javascript
- In `rollup.config.js`, set `enableTreeShaking` to `true`
- Disable modules via environment variables, for example:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

- Run `rollup -c rollup.config.js --bundleConfigAsCjs`
- Output bundle: `_your_js_sdk_repo_dir_/upload`

### Webpack

- Clone https://github.com/pubnub/javascript
- Create `webpack.config.js` based on the Rollup config; enable/disable modules via env vars.

```
const webpack = require('webpack');  

  
module.exports = {  
  // Other configuration...  
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
      'process.env.MESSAGE_PERSISTENCE_MODULE': JSON.stringify(process.env.MESSAGE_PERSISTENCE_MODULE ?? 'enabled'),  
      'process.env.MOBILE_PUSH_MODULE': JSON.stringify(process.env.MOBILE_PUSH_MODULE ?? 'enabled'),  
      'process.env.APP_CONTEXT_MODULE': JSON.stringify(process.env.APP_CONTEXT_MODULE ?? 'enabled'),  
      'process.env.FILE_SHARING_MODULE': JSON.stringify(process.env.FILE_SHARING_MODULE ?? 'enabled'),  
      'process.env.MESSAGE_REACTIONS_MODULE': JSON.stringify(process.env.MESSAGE_REACTIONS_MODULE ?? 'enabled'),  
    }),  
  ],  
};  

  

```

Disable modules via environment variables, for example:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

Run: `npx webpack --config webpack.config.js` (bundle in your configured output directory).

## Initialization[​](#initialization)

### Method(s)[​](#methods)

```
`1pubnub.PubNub({  
2  subscribeKey: string,  
3  publishKey: string,  
4  userId: string,  
5  authKey: string,  
6  logLevel: PubNub.LogLevel,  
7  ssl: boolean,  
8  origin: string | string[],  
9  presenceTimeout: number,  
10  heartbeatInterval: number,  
11  keepAlive: boolean,  
12  keepAliveSettings: any,  
13  suppressLeaveEvents: boolean,  
14  requestMessageCountThreshold: number,  
15  enableEventEngine: boolean  
16  restore: boolean,  
17  retryConfiguration: any  
18  autoNetworkDetection: boolean,  
19  listenToBrowserNetworkEvents: boolean  
20  maintainPresenceState: boolean  
21  cryptoModule: PubNub.CryptoModule  
22  subscriptionWorkerUrl: string  
23  // Deprecated, use userId instead  
24  uuid: string,  
25});  
`
```

### Core configuration fields (behavior + defaults)

- `subscribeKey: string` (required) — key used for subscribing.
- `publishKey: string` — key used for publishing; can be omitted for read-only clients.
- `userId: string` (required) — unique UTF-8 string up to 92 alphanumeric characters. If not set, client can’t connect.
- `secretKey: string` — server/admin key; grants root permissions for Access Manager (server-side only).
- `authKey: string` — Access Manager auth token.
- `logLevel: PubNub.LogLevel` (default `LogLevel.None`) — one of: `Trace|Debug|Info|Warn|Error|None`.
- `loggers: Logger[]` (default `[]`) — custom logger implementations.
- `logVerbosity: boolean` (default `false`) — **deprecated**, use `logLevel`.
- `ssl: boolean` (default `true` for v4.20.0+, `false` before) — HTTPS when `true`.
- `origin: string | string[]` (default `ps.pndsn.com`) — custom domain(s).
- `presenceTimeout: number` (default `300`) — presence liveness window (seconds).
- `heartbeatInterval: number` (default not set) — heartbeat frequency; recommended `(presenceTimeout/2)-1`, minimum `3`.
- `keepAlive: boolean` (default `false`) — reuse TCP connection.
- `keepAliveSettings: any` — used only when `keepAlive=true`. Defaults:
  - `keepAliveMsecs: 1000`
  - `freeSocketKeepAliveTimeout: 15000`
  - `timeout: 30000`
  - `maxSockets: Infinity`
  - `maxFreeSockets: 256`
- `suppressLeaveEvents: boolean` (default `false`) — when `true`, SDK won’t send leave requests.
- `requestMessageCountThreshold: number` (default `100`) — emits `PNRequestMessageCountExceededCategory` when exceeded.
- `enableEventEngine: boolean` (default `false`) — standardized subscribe/presence workflows.
  - When `true`: `autoNetworkDetection` is ignored; `maintainPresenceState` is automatically enabled.
- `restore: boolean` (default `false`) — **browser-only**, requires `listenToBrowserNetworkEvents=true`. When `true`, keeps timetoken/subscriptions on network down and attempts catch-up; when `false`, resets timetoken and active subscriptions.
- `retryConfiguration: RequestRetryPolicy` (default `PubNub.ExponentialRetryPolicy` for subscribe only) — browser + Node.js. Policies:
  - `PubNub.NoneRetryPolicy()`
  - `PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })`
  - `PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })`
  - `excluded` is an array of `Endpoint` enum values (e.g., `excluded: [PubNub.Endpoint.MessageSend]`).
- `autoNetworkDetection: boolean` (default `false`) — browser + Node.js **only when** `enableEventEngine=false`; emits `PNNetworkDownCategory` / `PNNetworkUpCategory`.
- `listenToBrowserNetworkEvents: boolean` (default `true`) — **browser-only**; listens to browser reachability and reconnects; set `false` if browser detection causes issues.
- `maintainPresenceState: boolean` (default `true`) — works only when `enableEventEngine=true`; resends state set via `pubnub.setState()` with each subscribe.
- `cryptoModule: PubNub.CryptoModule` (default None) — encryption/decryption module (see below).
- `subscriptionWorkerUrl: string` (default None) — shared worker URL (see Shared workers).
- `cipherKey: string` — **deprecated**, pass via `cryptoModule`.
- `useRandomIVs: boolean` (default `true`) — **deprecated**, pass via `cryptoModule`.
- `uuid: string` — **deprecated**, use `userId` (required identifier).

#### Disabling random initialization vector

Disable random IV only for backward compatibility (<`4.31.0`). Do not disable for new apps.

### `cryptoModule`[​](#cryptomodule)

- Encrypts/decrypts messages and files; configurable algorithms from 7.3.3+.
- Options:
  - `PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs })`
  - `PubNub.CryptoModule.aesCbcCryptoModule({cipherKey})` (recommended 256-bit AES-CBC)
- If `cryptoModule` isn’t set but deprecated `cipherKey`/`useRandomIVs` are present, client defaults to **legacy** encryption.

## Shared workers[​](#shared-workers)

Shared workers manage concurrent subscriptions/presence across tabs/windows and reduce parallel connections per origin.

Worker source:

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.5.js  
`
```

### Hosting a shared worker

Must be hosted under the **same origin** as the client app due to Same-origin Policy.

### Configuration[​](#configuration)

Download:

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.5.js  
`
```

Host it under the same origin as the page using it, then set `subscriptionWorkerUrl` during initialization:

```
1
  

```

### Worker version

Shared worker version must match the PubNub client version.

## Sample code[​](#sample-code)

##### Reference code

Initialize with `subscribeKey`, `publishKey`, and required `userId`:

```
1
  

```

## Server operations[​](#server-operations)

Server-side apps can initialize with `secretKey` to administer Access Manager (root permissions). Keep `secretKey` private and server-only.

```
`1var pubnub = new PubNub({  
2    subscribeKey: "mySubscribeKey",  
3    publishKey: "myPublishKey",  
4    userId: "myUniqueUserId",  
5    secretKey: "secretKey",  
6    heartbeatInterval: 0  
7});  
`
```

## Other examples[​](#other-examples)

### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

Omit `publishKey` (still requires `userId`):

```
1
  

```

### Initializing with SSL enabled[​](#initializing-with-ssl-enabled)

Set `ssl: true` (still requires `userId`):

```
1
  

```

## User ID[​](#user-id)

`userId` is required and must be reused/persisted for the lifetime of the user/device (don’t generate a new one per connection).

### Set user ID[​](#set-user-id)

Set in constructor:

```
`1var pubnub = new PubNub({  
2    subscribeKey: "mySubscribeKey",  
3    publishKey: "myPublishKey",  
4    userId: "myUniqueUserId"  
5});  
`
```

Or set explicitly:

```
`1pubnub.setUserId(string)  
`
```

Parameter:
- `userId: String` — userId to set.

Example:

```
`1pubnub.setUserId("myUniqueUserId")  
`
```

### Save user ID[​](#save-user-id)

When provided at initialization, `userId` is automatically saved to browser `localStorage` by the SDK (you may use your own caching strategy).

### Get user ID[​](#get-user-id)

```
`1pubnub.getUserId();  
`
```

Recommendation: `userId` is visible to others; avoid using usernames/emails.

## Authentication key[​](#authentication-key)

Reset/replace the current Access Manager auth key (for expired/rotated keys).

### Property[​](#property)

```
`1pubnub.setAuthKey(string)  
`
```

Parameter:
- `key: String` — auth key to set.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns)

None.

## Filter expression[​](#filter-expression)

Requires *Stream Controller* add-on enabled for your key.

### Method(s)[​](#methods-1)

Set filter:

```
`1pubnub.setFilterExpression(  
2  filterExpression: string  
3)  
`
```

Parameter:
- `filterExpression: string` — PSV2 subscribe filter expression.

Get filter:

```
`1pubnub.getFilterExpression()  
`
```

### Sample code[​](#sample-code-2)

#### Set filter expression[​](#set-filter-expression)

```
1
  

```

#### Get filter expression[​](#get-filter-expression)

```
1
**
```