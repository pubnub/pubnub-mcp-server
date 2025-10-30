# Configuration API for JavaScript SDK

JavaScript API reference for configuring the PubNub client for real-time apps.

You must include the PubNub JavaScript SDK before initializing the client.

```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.0.js">script>  
`
```

## Bundling

Use Rollup or Webpack to bundle only needed modules. Use the official configuration as a starting point.

- Rollup
- Webpack

Clone the PubNub JavaScript SDK repository to a directory of your choice.

In rollup.config.js, set enableTreeShaking to true. Enable/disable modules with environment variables, for example:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

Run rollup -c rollup.config.js --bundleConfigAsCjs. The bundle is in the _your_js_sdk_repo_dir_/upload directory.

Clone the PubNub JavaScript SDK repository to a directory of your choice.

Create webpack.config.js based on the Rollup configuration file. Enable or disable modules with environment variables.

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

Add any other necessary configuration to webpack.config.js.

Disable unnecessary modules by setting environment variables, for example:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

Run npx webpack --config webpack.config.js. Find the bundle in the configured output directory.

## Initialization

Initialize the PubNub client with publish and subscribe keys.

### Method(s)

```
`1pubnub.PubNub({  
2  subscribeKey: string,  
3  publishKey: string,  
4  userId: string,  
5  authKey: string,  
6  logVerbosity: boolean,  
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

Parameters (types, defaults, essentials):
- subscribeKey (string, required): Key for subscribing.
- publishKey (string): Key for publishing.
- userId (string, required): UTF-8 up to 92 alphanumeric characters. Required to connect.
- secretKey (string): Use only on secure server environments for Access Manager administration.
- authKey (string): Access Manager token.
- logLevel (LogLevel, default LogLevel.None): Minimum severity for logs. Values: Trace, Debug, Info, Warn, Error.
- loggers (Logger[], default []): Custom logger implementations.
- logVerbosity (boolean, default false): Deprecated; use logLevel.
- ssl (boolean, default true for v4.20.0+, false before): Use HTTPS.
- origin (string|string[], default ps.pndsn.com): Custom domain(s).
- presenceTimeout (number, default 300): How long the server considers the client alive for presence.
- heartbeatInterval (number, default Not Set): Suggested ≈ (presenceTimeout/2) − 1; min 3.
- keepAlive (boolean, default false): Reuse TCP connections.
- keepAliveSettings (any, defaults: keepAliveMsecs:1000, freeSocketKeepAliveTimeout:15000, timeout:30000, maxSockets:Infinity, maxFreeSockets:256).
- suppressLeaveEvents (boolean, default false): Don’t send leave requests when true.
- requestMessageCountThreshold (number, default 100): Emit PNRequestMessageCountExceededCategory when exceeded.
- enableEventEngine (boolean, default false): Use standardized subscribe/presence workflows and statuses.
  - When true: autoNetworkDetection is ignored; maintainPresenceState is automatically enabled.
- restore (boolean, default false; browser only; requires listenToBrowserNetworkEvents=true):
  - true: enter disconnected state without sending leave; keep timetoken and subscriptions; try to catch up on missed messages upon network restore.
  - false: reset timetoken and subscriptions.
- retryConfiguration (RequestRetryPolicy; browser/Node.js):
  - Policies: PubNub.NoneRetryPolicy(), PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded }), PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })
  - excluded: array of Endpoint enum values (e.g., excluded: [PubNub.Endpoint.MessageSend]).
- autoNetworkDetection (boolean, default false; browser/Node.js; only when enableEventEngine=false): Emit PNNetworkDownCategory/PNNetworkUpCategory on network change.
- listenToBrowserNetworkEvents (boolean, default true; browser only): Emit network statuses, listen to reachability events, and try to reconnect. Set false if browser fails to detect changes; SDK reconnection logic takes over.
- maintainPresenceState (boolean, default true; only when enableEventEngine=true): Send custom presence state with each subscribe.
- cryptoModule (PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs }) or PubNub.CryptoModule.aesCbcCryptoModule({cipherKey})): Encryption for messages/files. Prefer AES-CBC 256-bit.
- subscriptionWorkerUrl (string): URL for shared worker; must match client version.
- cipherKey (string): Deprecated; pass to cryptoModule instead.
- useRandomIVs (boolean, default true): Deprecated; pass to cryptoModule. true uses random IVs; false uses fixed IV except file upload.
- uuid (string): Deprecated; use userId.

##### Disabling random initialization vector

Disable random IVs only for backward compatibility (<4.31.0). Don’t disable in new apps.

#### cryptoModule

Encrypts/decrypts messages and files. From 7.3.3 onward, selectable algorithms: legacy 128-bit or recommended 256-bit AES-CBC. If cryptoModule isn’t set but cipherKey/useRandomIVs are present, client defaults to legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

Keep legacy if desired; explicitly set AES-CBC 256-bit to use the recommended encryption.

#### Shared workers

Shared workers manage concurrent connections/presence across tabs/windows.

Source code:

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.0.js  
`
```

Reasons: Aggregate subscriptions per keyset to reduce parallel connections; prevent false leave events by tracking channels/groups across tabs.

##### Hosting a shared worker

Must be hosted under the same origin as the client app (Same-origin Policy).

##### Configuration

Download the shared worker:

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.0.js  
`
```

Host it under the same origin and set subscriptionWorkerUrl during initialization:

```
1
  

```

When set, the client downloads and uses the shared worker to manage subscriptions.

##### Worker version

Worker version must match the PubNub client version.

### Sample code

Reference example setup with subscribeKey, publishKey, and userId.

##### Required User ID

Always set userId; persist it for the user/device lifetime.

```
1
  

```

### Server operations

Run servers with secretKey to administer Access Manager (grants server-side access to all channels/groups).

##### Secure your secretKey

Never expose secretKey; use only on secure server-side environments.

##### Required User ID

Always set userId.

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

## Other examples

### Initialization for a Read-Only client

Omit publishKey for read-only clients.

##### Required User ID

Always set userId.

```
1
  

```

### Initializing with SSL enabled

Set ssl: true to enable TLS.

##### Required User ID

Always set userId.

```
1
  

```

## Event listeners

- PubNub client: updates from all subscriptions (channels, groups, channel metadata, users).
- Subscription: updates for its specific entity.
- SubscriptionsSet: updates for its list of subscriptions.

## User ID

A userId is required to identify the client.

### Set user ID

Set during instantiation and reuse it on each device.

##### Required User ID

Always set userId.

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

- userId (String): userId to set.

```
`1pubnub.setUserId("myUniqueUserId")  
`
```

### Save user ID

The SDK saves userId in browser localStorage by default. You may implement a different caching strategy.

### Get user ID

Get the current userId:

```
`1pubnub.getUserId();  
`
```

##### Required User ID recommendation

Don’t use PII (e.g., email) as userId; it may be visible to other users.

## Authentication key

Reset or update the authKey (typically provided at initialization for Access Manager).

### Property

```
`1pubnub.setAuthKey(string)  
`
```

- key (String): Auth key to set.

### Sample code

```
1
  

```

### Returns

None.

## Filter expression

Requires Stream Controller add-on enabled.

Apply a server-side filter to only receive messages that match conditions.

### Method(s)

```
`1pubnub.setFilterExpression(  
2  filterExpression: string  
3)  
`
```

- filterExpression (string): PSV2 feature to subscribe with a custom filter expression.

```
`1pubnub.getFilterExpression()  
`
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
**
```

Last updated on Oct 21, 2025**