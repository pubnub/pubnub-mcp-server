# Configuration API for JavaScript SDK

JavaScript reference for configuring the PubNub client.

Include the PubNub JavaScript SDK before initializing the client:

```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.3.js">script>  
`
```

## Bundling

Bundle only needed modules with Rollup or Webpack. Use the PubNub SDK repo and configuration as a starting point.

- Rollup
  - Clone the PubNub JavaScript SDK repository.
  - In rollup.config.js, set enableTreeShaking to true.
  - Disable modules via environment variables:
    ```
    `export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
    `
    ```
  - Build: rollup -c rollup.config.js --bundleConfigAsCjs. The bundle is created in the upload directory.

- Webpack
  - Clone the PubNub JavaScript SDK repository.
  - Create webpack.config.js based on the Rollup config. Enable/disable modules via env variables using DefinePlugin:
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
  - Optionally disable modules via env variables:
    ```
    `export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
    `
    ```
  - Build: npx webpack --config webpack.config.js.

## Initialization

Initialize the PubNub Client API with your keyset and configuration.

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

Required identity
- subscribeKey (string, required): Used for subscribe.
- publishKey (string): Used for publish.
- userId (string, required): Unique UTF-8 string up to 92 alphanumeric chars. Required to connect.
- uuid (string, deprecated): Use userId instead.
- secretKey (string): Admin portal secret for server operations (Access Manager). Use only in secure server environments.

Authorization
- authKey (string): Access Manager token.

Logging
- logLevel (LogLevel, default: LogLevel.None): Minimum level to log. Values: Trace, Debug, Info, Warn, Error.
- loggers (Logger[], default: []): Custom logger implementations.
- logVerbosity (boolean, deprecated): Use logLevel instead.

Transport and origin
- ssl (boolean, default: true for v4.20.0+, false before): Use HTTPS if true.
- origin (string | string[], default: ps.pndsn.com): Custom domain if required.

Presence
- presenceTimeout (number, default: 300): How long the server considers the client alive.
- heartbeatInterval (number, default: Not Set): Heartbeat frequency; typically (presenceTimeout / 2) - 1, min 3.
- suppressLeaveEvents (boolean, default: false): Do not send leave events when true.
- maintainPresenceState (boolean, default: true): Only when enableEventEngine is true; sends state on subscribe.

Connection management
- keepAlive (boolean, default: false): Reuse TCP connection.
- keepAliveSettings (any, defaults: keepAliveMsecs 1000, freeSocketKeepAliveTimeout 15000, timeout 30000, maxSockets Infinity, maxFreeSockets 256): Fine-tune keepAlive when enabled.
- requestMessageCountThreshold (number, default: 100): Emits PNRequestMessageCountExceededCategory when exceeded.
- enableEventEngine (boolean, default: false): Enables standardized subscribe/presence workflows and statuses.
  - When true: autoNetworkDetection is ignored; maintainPresenceState is automatically enabled.
- restore (boolean, default: false; browser only; requires listenToBrowserNetworkEvents=true):
  - true: enter disconnected state without leave; keep timetoken and subscriptions; catch up on missed messages on reconnection.
  - false: reset timetoken and subscriptions on network loss.
- retryConfiguration (RequestRetryPolicy, default: PubNub.ExponentialRetryPolicy for subscribe; browser and Node.js):
  - Policies:
    - PubNub.NoneRetryPolicy()
    - PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })
    - PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })
  - excluded: array of Endpoint enums (e.g., excluded: [PubNub.Endpoint.MessageSend]).
- autoNetworkDetection (boolean, default: false; browser and Node.js; only when enableEventEngine=false): Emit PNNetworkDownCategory/PNNetworkUpCategory on network changes.
- listenToBrowserNetworkEvents (boolean, default: true; browser only): Emit PNNetworkDownCategory/PNNetworkUpCategory, listen to browser reachability events, and try to reconnect. Set false to let SDK reconnection take over if browser reachability is unreliable.

Cryptography
- cryptoModule (PubNub.CryptoModule): Encryption/decryption for messages/files.
  - PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs })
  - PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey })
- cipherKey (string, deprecated): Pass via cryptoModule instead.
- useRandomIVs (boolean, default: true; deprecated): Pass via cryptoModule instead.

Shared workers
- subscriptionWorkerUrl (string): URL to the worker script used to manage subscriptions across tabs.

##### Disabling random initialization vector
Only for backward compatibility (<4.31.0). Do not disable random IV in new applications.

#### cryptoModule

Configure algorithms used for encrypting/decrypting messages and files. SDK provides:
- Legacy 128-bit encryption (default if cipherKey/useRandomIVs are set in config and cryptoModule is not explicitly set).
- Recommended 256-bit AES-CBC.

See Message Encryption and File Encryption docs and the Encryption page for configuration and examples.

#### Shared workers

Use a shared worker to aggregate subscriptions and manage presence across tabs/windows.

Source:
```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.3.js  
`
```

Reasons:
- Browser parallel connection limits can cause connection issues; shared worker consolidates to one long-poll per keyset.
- Prevents false leave events by tracking channels/groups across tabs.

##### Hosting a shared worker
Must be served under the same origin as the client (Same-origin Policy).

##### Configuration

Download from CDN:
```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.10.2.3.js  
`
```

Set subscriptionWorkerUrl during initialization:

```
1
  
```

When set, the client downloads and uses the shared worker. Worker version must match the PubNub client version.

### Sample code

Initialize with your subscribeKey, publishKey, and a persistent userId that identifies the client.

##### Required User ID
Always set userId. Persist it for the lifetime of the user/device.

```
1
  
```

### Server operations

Use secretKey on servers (Node.js or other secure environments) to administer Access Manager.

##### Secure your secretKey
Never expose secretKey in client apps.

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

### Other examples

#### Initialization for a Read-Only client
Omit publishKey.

```
1
  
```

#### Initializing with SSL enabled
Set ssl to true.

```
1
  
```

## Event listeners

- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for a single channel/group/metadata/user.
- SubscriptionsSet: updates for a list of subscriptions.

See Publish & Subscribe for details.

## User ID

A required unique alphanumeric identifier used to identify the client.

### Set user ID

Set userId on instantiation or via setUserId. Reuse the same userId per device.

##### Required User ID
Always set userId. Persist it for the lifetime of the user/device.

```
`1var pubnub = new PubNub({  
2    subscribeKey: "mySubscribeKey",  
3    publishKey: "myPublishKey",  
4    userId: "myUniqueUserId"  
5});  
`
```

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

If provided at initialization in a browser, the SDK saves it to localStorage. You may implement your own caching strategy.

### Get user ID

Get the current userId. No arguments.

```
`1pubnub.getUserId();  
`
```

##### Required User ID recommendation
userId is visible to users; avoid using emails/usernames. Use an easily replaceable identifier.

## Authentication key

Reset or update the auth key at runtime (for Access Manager-enabled apps).

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

Apply a server-side filter to only receive messages matching the expression.

### Method(s)

```
`1pubnub.setFilterExpression(  
2  filterExpression: string  
3)  
`
```
- filterExpression (string): PSV2 custom filter expression for subscribe.

```
`1pubnub.getFilterExpression()  
`
```
No arguments.

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