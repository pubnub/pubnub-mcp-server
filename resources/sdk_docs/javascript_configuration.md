# Configuration API for JavaScript SDK

JavaScript configuration reference for building real-time applications on PubNub, including basic usage and sample code.

Include the PubNub JavaScript SDK before initializing the client.

```
<script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.0.js"></script>
```

## Bundling

Use Rollup or Webpack to bundle only the modules you need. Use the PubNub JS SDK repo as a starting point.

- Repo: https://github.com/pubnub/javascript
- Rollup config example: https://github.com/pubnub/javascript/blob/master/rollup.config.js

### Rollup

- In rollup.config.js, set enableTreeShaking = true.
- Disable modules via environment variables, for example:
```
export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled
```
- Build:
```
rollup -c rollup.config.js --bundleConfigAsCjs
```
- Output bundle location: upload directory in the repo folder.

### Webpack

- Create webpack.config.js using the Rollup config as a guide.
- Enable/disable modules with environment variables using DefinePlugin:
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
- Disable unnecessary modules via env vars, for example:
```
export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled
```
- Build:
```
npx webpack --config webpack.config.js
```

## Initialization

Initialize the PubNub client with publish/subscribe keys and required userId.

### Method(s)

```
new PubNub({
  subscribeKey: string,
  publishKey: string,
  userId: string,
  authKey: string,

  // Logging
  logLevel: LogLevel,          // LogLevel.None | Trace | Debug | Info | Warn | Error
  loggers: Logger[],           // Custom logger implementations
  logVerbosity: boolean,       // DEPRECATED; use logLevel

  // Networking
  ssl: boolean,
  origin: string | string[],
  keepAlive: boolean,
  keepAliveSettings: {
    keepAliveMsecs?: number,
    freeSocketKeepAliveTimeout?: number,
    timeout?: number,
    maxSockets?: number,
    maxFreeSockets?: number,
  },

  // Presence / subscribe
  presenceTimeout: number,
  heartbeatInterval: number,
  suppressLeaveEvents: boolean,
  requestMessageCountThreshold: number,

  // Connection lifecycle
  enableEventEngine: boolean,
  restore: boolean,
  retryConfiguration: any,     // RequestRetryPolicy
  autoNetworkDetection: boolean,
  listenToBrowserNetworkEvents: boolean,

  // Presence state with Event Engine
  maintainPresenceState: boolean,

  // Crypto
  cryptoModule: PubNub.CryptoModule,
  subscriptionWorkerUrl: string,

  // Server / Access
  secretKey: string,

  // Deprecated, use userId instead
  uuid: string,
});
```

### Parameters

- subscribeKey (string, required) — Key for subscribing.
- publishKey (string) — Key for publishing.
- userId (string, required) — Unique UTF-8 identifier (<= 92 alphanumeric chars). Required to connect.
- secretKey (string) — Server-only key for Access Manager admin operations.
- authKey (string) — Access Manager token.

Logging:
- logLevel (LogLevel, default: LogLevel.None) — Minimum severity to log.
- loggers (Logger[], default: []) — Custom loggers.
- logVerbosity (boolean, default: false) — Deprecated; use logLevel.

Networking:
- ssl (boolean, default: true for v4.20.0+, false before) — Use HTTPS.
- origin (string|string[], default: ps.pndsn.com) — Custom domain if needed.
- keepAlive (boolean, default: false) — Reuse TCP connections.
- keepAliveSettings (object, defaults: keepAliveMsecs=1000, freeSocketKeepAliveTimeout=15000, timeout=30000, maxSockets=Infinity, maxFreeSockets=256) — Node.js agent options.

Presence/subscribe:
- presenceTimeout (number, default: 300) — Presence liveness timeout (seconds).
- heartbeatInterval (number, default: not set; min 3) — Heartbeat interval; typically (presenceTimeout/2)-1.
- suppressLeaveEvents (boolean, default: false) — Don’t send leave events.
- requestMessageCountThreshold (number, default: 100) — Emit PNRequestMessageCountExceededCategory when exceeded.

Connection lifecycle:
- enableEventEngine (boolean, default: false) — Use standardized subscribe/presence workflows and statuses.
  - If true: autoNetworkDetection is ignored; maintainPresenceState is automatically enabled.
- restore (boolean, default: false; browser only; requires listenToBrowserNetworkEvents=true)
  - true: enter disconnected state without leave; keep timetoken & subscriptions; catch up on missed messages after reconnect.
  - false: reset timetoken and subscriptions on disconnect.
- retryConfiguration (RequestRetryPolicy; browser and Node.js)
  - Policies:
    - PubNub.NoneRetryPolicy()
    - PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })
    - PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })
  - excluded: array of Endpoint enum values, e.g., excluded: [PubNub.Endpoint.MessageSend]
- autoNetworkDetection (boolean, default: false; browser/Node.js; only when enableEventEngine=false) — Emit PNNetworkDownCategory/PNNetworkUpCategory on network changes.
- listenToBrowserNetworkEvents (boolean, default: true; browser only) — Listen to browser reachability events and try to reconnect; set false if browser events are unreliable.

Presence state with Event Engine:
- maintainPresenceState (boolean, default: true; only when enableEventEngine=true) — Send custom presence state with subscribe.

Crypto:
- cryptoModule (PubNub.CryptoModule; default: none)
  - PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs })
  - PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey })
- subscriptionWorkerUrl (string) — Shared worker URL (see Shared workers).
- cipherKey (string) — DEPRECATED; pass via cryptoModule.
- useRandomIVs (boolean, default: true) — DEPRECATED; pass via cryptoModule.
  - For backward compatibility (< 4.31.0) you may disable random IV; do not disable for new apps.

Deprecated:
- uuid (string) — Use userId instead.

#### cryptoModule

- Encrypts/decrypts messages and files. Two options are included:
  - Legacy 128-bit encryption (legacyCryptoModule)
  - Recommended 256-bit AES-CBC (aesCbcCryptoModule)
- If cryptoModule is not set but cipherKey/useRandomIVs are set, legacy encryption is used.

## Shared workers

Shared workers manage concurrent connections and presence across multiple instances (tabs/windows).

Source:
```
http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.0.js
```

Why:
- Browsers limit parallel connections per origin; shared worker aggregates subscriptions per keyset to use one long-poll subscribe.
- Prevent false leave events by tracking channels/groups across tabs/windows; only terminate long-poll when all associated contexts close.

Hosting:
- Must be hosted under the same origin as the client app (Same-origin Policy).

Configuration:
- Download from CDN:
```
http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.0.js
```
- Host on your origin and configure subscriptionWorkerUrl during initialization:
```
1
```
- Worker version must match the PubNub client version.

## Sample code

Initialize with your subscribeKey, publishKey, and a persistent userId that identifies the client.

```
1
```

## Server operations

Use secretKey on server-side only to administer Access Manager.

```
var pubnub = new PubNub({
    subscribeKey: "mySubscribeKey",
    publishKey: "myPublishKey",
    userId: "myUniqueUserId",
    secretKey: "secretKey",
    heartbeatInterval: 0
});
```

## Other examples

### Initialization for a Read-Only client

Omit publishKey for read-only clients.

```
1
```

### Initializing with SSL enabled

Set ssl: true to enable TLS.

```
1
```

## Event listeners

- Client: receives updates from all subscriptions.
- Subscription: updates for a single channel/group/metadata/user.
- SubscriptionsSet: updates for a set of subscription objects.

See Publish & Subscribe event listeners for details.

## User ID

A userId is a required unique alphanumeric identifier for the client. Persist and reuse it per user/device.

### Set user ID

Set userId when instantiating PubNub.

```
var pubnub = new PubNub({
    subscribeKey: "mySubscribeKey",
    publishKey: "myPublishKey",
    userId: "myUniqueUserId"
});
```

You can also set it later:

```
pubnub.setUserId(string)
```

- userId (String) — userId to set.

```
pubnub.setUserId("myUniqueUserId")
```

### Save user ID

The SDK stores userId in browser localStorage by default; you may implement your own caching strategy.

### Get user ID

Get the current userId.

```
pubnub.getUserId();
```

Note: userId may be visible to users; avoid PII like emails/usernames.

## Authentication key

Reset or update the authKey (for Access Manager).

### Property

```
pubnub.setAuthKey(string)
```

- key (String) — Auth key to set.

### Sample code

```
1
```

### Returns

None.

## Filter expression

Requires Stream Controller add-on enabled in the Admin Portal.

Set or get a server-side message filter applied to subscriptions.

### Method(s)

```
pubnub.setFilterExpression(
  filterExpression: string
)
```

- filterExpression (string) — PSV2 filter expression for subscribe.

```
pubnub.getFilterExpression()
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

```
1
```

#### Get filter expression

```
1
**```