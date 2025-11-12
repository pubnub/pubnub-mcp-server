# Configuration API for JavaScript SDK

Include the PubNub JavaScript SDK before initializing the client.

```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.1.js">script>  
`
```

## Bundling

Use Rollup or Webpack to include only needed modules. Start from the PubNub config.

- Repo: https://github.com/pubnub/javascript
- Rollup config: https://github.com/pubnub/javascript/blob/master/rollup.config.js

### Rollup

- In rollup.config.js set enableTreeShaking = true
- Disable modules via env vars:
```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```
- Build:
  - rollup -c rollup.config.js --bundleConfigAsCjs
  - Output in upload directory

### Webpack

Create webpack.config.js based on Rollup config; toggle modules via env vars.

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

Disable modules via env vars:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

Build:
- npx webpack --config webpack.config.js
- Output in configured directory

## Initialization

Initialize PubNub with your keyset and configuration.

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

Parameters (Type • Default • Notes):
- subscribeKey • string • Required for subscribe operations.
- publishKey • string • Required for publish operations.
- userId • string • Required unique UTF-8 string (<= 92 alphanumerics). Without it, the client can’t connect.
- secretKey • string • Server-side only; grants root Access Manager permissions.
- authKey • string • Access Manager token for authorization.
- logLevel • LogLevel • LogLevel.None • Logging verbosity: Trace | Debug | Info | Warn | Error.
- loggers • Logger[] • [] • Custom logger implementations.
- logVerbosity • boolean • false • Deprecated; use logLevel.
- ssl • boolean • true (>= v4.20.0), false (< v4.20.0) • Use HTTPS if true.
- origin • string | string[] • ps.pndsn.com • Custom domain support.
- presenceTimeout • number • 300 • Presence liveness window (seconds).
- heartbeatInterval • number • Not Set • Suggest ~ (presenceTimeout/2) - 1; min 3.
- keepAlive • boolean • false • Reuse TCP connections.
- keepAliveSettings • any • { keepAliveMsecs: 1000, freeSocketKeepAliveTimeout: 15000, timeout: 30000, maxSockets: Infinity, maxFreeSockets: 256 } • Apply when keepAlive is true.
- suppressLeaveEvents • boolean • false • Don’t send leave requests when true.
- requestMessageCountThreshold • number • 100 • Emit PNRequestMessageCountExceededCategory when exceeded.
- enableEventEngine • boolean • false • Enables standardized subscribe/presence workflows and status events.
  - autoNetworkDetection ignored when true.
  - maintainPresenceState automatically enabled when true.
- restore • boolean • false • Browser only; requires listenToBrowserNetworkEvents = true.
  - true: client enters disconnected state without leave; keeps timetoken and subscriptions; tries to catch up on missed messages on network restore.
  - false: resets timetoken and subscriptions.
- retryConfiguration • RequestRetryPolicy • PubNub.ExponentialRetryPolicy (subscribe only) • Browser/Node.js. Configure per endpoint group exclusions.
  - Policies:
    - PubNub.NoneRetryPolicy()
    - PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })
    - PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })
  - excluded: array of PubNub.Endpoint enum values, e.g., excluded: [PubNub.Endpoint.MessageSend]
- autoNetworkDetection • boolean • false • Browser/Node.js, only when enableEventEngine is false. Emits PNNetworkDownCategory/PNNetworkUpCategory on network change.
- listenToBrowserNetworkEvents • boolean • true • Browser only. Listens to reachability changes and reconnects. Set false if browser detection is unreliable.
- maintainPresenceState • boolean • true • Only when enableEventEngine is true. Sends custom presence state on each subscribe call.
- cryptoModule • PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs }) | PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey }) • None • Controls message/file encryption. See cryptoModule section.
- subscriptionWorkerUrl • string • None • Shared worker URL; see Shared workers.
- cipherKey • string • Deprecated; pass via cryptoModule. Encrypts payloads if present.
- useRandomIVs • boolean • true • Deprecated; pass via cryptoModule. Random IVs for all requests when true.
- uuid • string • Deprecated; use userId.

##### Disabling random initialization vector

Disable random IVs only for backward compatibility (< 4.31.0). Do not disable for new apps.

#### cryptoModule

Configures message/file encryption. From 7.3.3 you can choose algorithms. Options:
- Legacy 128-bit encryption.
- Recommended 256-bit AES-CBC.

If cryptoModule is not set but cipherKey/useRandomIVs are set in config, legacy encryption is used by default. For details and examples, see Encryption docs.

##### Legacy encryption with 128-bit cipher key entropy

No change needed to keep legacy. To use 256-bit AES-CBC, explicitly set cryptoModule.

#### Shared workers

Manage concurrent connections and presence across tabs/windows.

Source:
```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.1.js  
`
```

Benefits:
- Aggregates subscriptions per keyset to reduce parallel connections to the same origin.
- Prevents false leave events by tracking channels/groups across tabs/windows.

##### Hosting a shared worker

Must be hosted under the same origin as the client app (Same-origin Policy).

##### Configuration

Download from CDN:
```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.1.js  
`
```

Host it under the same origin and set subscriptionWorkerUrl when initializing:

```
1
  
```

When set, the client downloads and uses the shared worker to manage subscriptions.

##### Worker version

Worker version must match the PubNub client version.

### Sample code

Initialize with your subscribeKey, publishKey, and a persistent userId.

##### Required User ID

Always set a unique, persistent userId; without it, connection fails.

```
1
  
```

### Server operations

Servers can use secretKey to administer Access Manager; use only in secure, server-side environments.

##### Secure your secretKey

Never expose secretKey; use only on trusted server environments.

##### Required User ID

Set a unique, persistent userId even for server SDK usage.

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

The client will sign Access Manager messages with secretKey.

### Other examples

#### Initialization for a Read-Only client

Omit publishKey for read-only clients.

```
1
  
```

#### Initializing with SSL enabled

Set ssl: true to enable TLS.

```
1
  
```

## Event listeners

- PubNub client: updates from all subscriptions.
- Subscription: updates for a specific channel/group/metadata/user.
- SubscriptionsSet: updates for a set of subscriptions.

See Publish & Subscribe for entity-specific handlers.

## User ID

A required unique identifier for each client (user or device).

### Set user ID

Set userId during instantiation; reuse the same value per device.

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

- userId • String • userId to set.

```
`1pubnub.setUserId("myUniqueUserId")  
`
```

### Save user ID

SDK saves userId in browser localStorage by default; you may implement custom caching.

Consider the following when implementing a userId reuse strategy:
1. $1
2. $1
3. $1

### Get user ID

Get the current userId (no arguments).

```
`1pubnub.getUserId();  
`
```

##### Required User ID recommendation

Avoid PII (like username/email) for userId; use a replaceable identifier.

## Authentication key

Update the authKey used by Access Manager-enabled apps at runtime.

### Property

```
`1pubnub.setAuthKey(string)  
`
```

- key • String • Auth key to set.

### Sample code

```
1
  
```

### Returns

None.

## Filter expression

Requires Stream Controller add-on enabled for your key.

Apply server-side filters to only receive messages matching conditions.

### Method(s)

```
`1pubnub.setFilterExpression(  
2  filterExpression: string  
3)  
`
```

- filterExpression • string • PSV2 filter applied to subscribe.

```
`1pubnub.getFilterExpression()  
`
```

Returns current filter expression.

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