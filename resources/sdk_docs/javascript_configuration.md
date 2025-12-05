# Configuration API for JavaScript SDK

Concise reference to configure and initialize the PubNub JavaScript SDK. Include the SDK before initializing the client.

```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.4.js">script>  
`
```

## Bundling

Bundle only required modules using Rollup or Webpack. Start from PubNub’s configuration file and disable unused modules via environment variables.

- Clone the PubNub JavaScript SDK repository: https://github.com/pubnub/javascript
- Rollup
  - In rollup.config.js, set enableTreeShaking to true.
  - Disable modules via env vars.
  - Build with rollup -c rollup.config.js --bundleConfigAsCjs. Output is in upload directory.
- Webpack
  - Create webpack.config.js based on the Rollup configuration, and disable modules via env vars using DefinePlugin.

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

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

##### Webpack configuration

Add any required Webpack config as needed. Disable modules with env vars and build with npx webpack --config webpack.config.js.

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

## Initialization

Initialize the client with your keys and required userId.

### Method(s)

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

Essential parameters:
- subscribeKey (string, required): Key for subscribe operations.
- publishKey (string): Key for publish operations.
- userId (string, required): UTF-8 up to 92 alphanumeric chars. Required to connect.
- secretKey (string): For server-side admin with Access Manager. Use only on secure servers.
- authKey (string): Token for Access Manager authorization.
- logLevel (PubNub.LogLevel, default LogLevel.None): Trace | Debug | Info | Warn | Error.
- loggers (Logger[], default []): Custom logger implementations.
- logVerbosity (boolean, deprecated): Use logLevel instead.
- ssl (boolean, default true in v4.20.0+, else false): Use HTTPS for requests.
- origin (string | string[], default ps.pndsn.com): Custom domain if configured.
- presenceTimeout (number, default 300): Presence liveness window in seconds.
- heartbeatInterval (number): Heartbeat period; typically (presenceTimeout/2)-1; min 3.
- keepAlive (boolean, default false): Reuse TCP connections.
- keepAliveSettings (any, defaults: keepAliveMsecs 1000, freeSocketKeepAliveTimeout 15000, timeout 30000, maxSockets Infinity, maxFreeSockets 256): TCP keep-alive tuning.
- suppressLeaveEvents (boolean, default false): Don’t send leave on unsubscribe/disconnect.
- requestMessageCountThreshold (number, default 100): Emit PNRequestMessageCountExceededCategory when exceeded.
- enableEventEngine (boolean, default false): Use standardized workflows for subscribe/presence. Effects:
  - autoNetworkDetection ignored when true.
  - maintainPresenceState automatically enabled when true.
- restore (boolean, default false, browser only; requires listenToBrowserNetworkEvents=true): If true, keep timetoken and subscriptions across network loss and catch up on missed messages. If false, reset state.
- retryConfiguration (RequestRetryPolicy, default PubNub.ExponentialRetryPolicy for subscribe): Custom reconnection policy. Exclude endpoint groups as needed with excluded: Endpoint[].
  - PubNub.NoneRetryPolicy()
  - PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })
  - PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })
- autoNetworkDetection (boolean, default false; browser/Node; only when enableEventEngine=false): Emit PNNetworkDownCategory/PNNetworkUpCategory on network change.
- listenToBrowserNetworkEvents (boolean, default true; browser only): Listen to browser reachability and try reconnect on network changes. Set false if browser misdetects; SDK logic will handle reconnection.
- maintainPresenceState (boolean, default true; only when enableEventEngine=true): Send setState presence info on each subscribe.
- cryptoModule (PubNub.CryptoModule): Select encryption implementation:
  - PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs })
  - PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey })
- subscriptionWorkerUrl (string): URL to shared worker (same-origin). See Shared workers.
- cipherKey (string, deprecated): Set via cryptoModule instead.
- useRandomIVs (boolean, deprecated; default true): Set via cryptoModule instead.
- uuid (string, deprecated): Use userId instead.

##### Disabling random initialization vector

Only for backward compatibility (< 4.31.0). Don’t disable random IVs for new apps.

#### cryptoModule

Encrypts/decrypts messages/files. From 7.3.3+, supports legacy 128-bit or recommended 256-bit AES-CBC. If cryptoModule isn’t set but cipherKey/useRandomIVs are set in config, legacy encryption is used. See Encryption page for full configuration and utilities.

##### Legacy encryption with 128-bit cipher key entropy

To keep legacy encryption, no change needed. For 256-bit AES-CBC, explicitly set the AES-CBC cryptoModule.

#### Shared workers

Manage concurrent connections and presence across multiple tabs/windows.

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.4.js  
`
```

Reasons: Reduce parallel connection limits by aggregating subscriptions; avoid false leave events when long-poll closes by tracking tabs/windows.

##### Hosting a shared worker

Must be hosted under the same origin as the client app due to Same-origin Policy.

##### Configuration

Download and host the worker under the same origin. Set subscriptionWorkerUrl in client initialization.

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.4.js  
`
```

```
1
  

```

When set, the client downloads and uses the shared worker for subscriptions.

##### Worker version

Worker version must match the client version.

### Sample code

Initialize with your subscribeKey, publishKey, and a persistent userId.

##### Required User ID

Always set userId; persist it for the user/device lifetime.

```
1
  

```

### Server operations

Use secretKey on secure server environments (Node.js, etc.) to administer Access Manager. This grants server-side access to all channels and groups.

##### Secure your secretKey

Keep secretKey confidential; only use server-side.

##### Required User ID

Always set userId for servers as well.

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

### Other examples

#### Initialization for a Read-Only client

Omit publishKey for read-only.

##### Required User ID

Always set userId.

```
1
  

```

#### Initializing with SSL enabled

Set ssl: true to use TLS.

##### Required User ID

Always set userId.

```
1
  

```

## Event listeners

Real-time updates can be received from:
- PubNub client: all subscriptions (channels, groups, metadata, users).
- Subscription: a specific channel/group/metadata/user.
- SubscriptionsSet: a set of subscription objects.

See Publish & Subscribe for listener APIs and handlers.

## User ID

A required unique identifier for the client.

### Set user ID

Provide userId on initialization; reuse on each device/session.

##### Required User ID

Always set and persist userId.

```
`1var pubnub = new PubNub({  
2    subscribeKey: "mySubscribeKey",  
3    publishKey: "myPublishKey",  
4    userId: "myUniqueUserId"  
5});  
`
```

You can also set it explicitly:

```
`1pubnub.setUserId(string)  
`
```

- userId (string): Value to set.

```
`1pubnub.setUserId("myUniqueUserId")  
`
```

### Save user ID

The SDK stores userId in localStorage by default in browsers. You may implement a different caching strategy.

Considerations:
1. $1
2. $1
3. $1

### Get user ID

Returns the current userId.

```
`1pubnub.getUserId();  
`
```

##### Required User ID recommendation

Don’t use personally identifiable info; use a replaceable identifier.

## Authentication key

Update the Access Manager auth key at runtime when it changes.

### Property

```
`1pubnub.setAuthKey(string)  
`
```

- key (string): Auth key to set.

### Sample code

```
1
  

```

### Returns

None.

## Filter expression

Requires Stream Controller add-on enabled. Filters are applied server-side to only deliver matching messages.

### Method(s)

```
`1pubnub.setFilterExpression(  
2  filterExpression: string  
3)  
`
```

- filterExpression (string): PSV2 filter expression applied to subscribe.

```
`1pubnub.getFilterExpression()  
`
```

Returns the current filter expression.

### Sample code

#### Set filter expression

```
1
  

```

#### Get filter expression

```
1
**
```

Last updated on Dec 4, 2025**