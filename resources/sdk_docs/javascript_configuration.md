# Configuration API for JavaScript SDK

JavaScript API reference for configuring PubNub. Include the SDK before initializing the client.

```
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.9.0.js">script>  
`
```

## Bundling

Bundle only needed modules with Rollup or Webpack. Use environment variables to enable/disable modules.

- Rollup
  - Clone the PubNub JavaScript SDK repo.
  - In rollup.config.js, set enableTreeShaking to true.
  - Disable modules via env vars, for example:
    ```
    `export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
    `
    ```
  - Build:
    ```
    rollup -c rollup.config.js --bundleConfigAsCjs
    ```
    Bundle is in the upload directory.

- Webpack
  - Clone the PubNub JavaScript SDK repo.
  - Create webpack.config.js (based on rollup.config.js). Enable/disable modules with env vars:
    ```
    `const webpack = require('webpack');  
    
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
    `
    ```
    show all 24 lines
  - Optionally disable modules:
    ```
    `export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
    `
    ```
  - Build:
    ```
    npx webpack --config webpack.config.js
    ```

## Initialization

Initialize the PubNub client with your keys and configuration.

### Method(s)

```
`pubnub.PubNub({  
  subscribeKey: string,  
  publishKey: string,  
  userId: string,  
  authKey: string,  
  logVerbosity: boolean,  
  ssl: boolean,  
  origin: string | string[],  
  presenceTimeout: number,  
  heartbeatInterval: number,  
  keepAlive: boolean,  
  keepAliveSettings: any,  
  suppressLeaveEvents: boolean,  
  requestMessageCountThreshold: number,  
  enableEventEngine: boolean  
`
```
show all 25 lines

Parameters (Type • Default • Description):
- subscribeKey • string • n/a • Subscribe key for channel subscriptions.
- publishKey • string • n/a • Publish key for sending messages.
- userId • string • n/a • Required unique UTF‑8 string (≤92 alphanumeric chars). Must be set to connect.
- secretKey • string • n/a • Admin key for Access Manager (server-side only). Grants root PAM permissions.
- authKey • string • n/a • Access Manager token for resource authorization.
- logVerbosity • boolean • false • Log HTTP information.
- ssl • boolean • true (v4.20.0+) • Use HTTPS for requests.
- origin • string | string[] • ps.pndsn.com • Custom domain(s) if required.
- presenceTimeout • number • 300 • How long the server considers the client alive (seconds).
- heartbeatInterval • number • Not Set • Heartbeat frequency; typically (presenceTimeout / 2) - 1; min 3.
- keepAlive • boolean • false • Reuse TCP connection per host.
- keepAliveSettings • any • { keepAliveMsecs:1000, freeSocketKeepAliveTimeout:15000, timeout:30000, maxSockets:Infinity, maxFreeSockets:256 } • Node.js HTTP agent tuning.
- suppressLeaveEvents • boolean • false • Do not send leave requests when true.
- requestMessageCountThreshold • number • 100 • Emit PNRequestMessageCountExceededCategory if exceeded.
- enableEventEngine • boolean • false • Use standardized subscribe/presence workflows and statuses.
  - When true: autoNetworkDetection is ignored; maintainPresenceState is enabled automatically.
- restore • boolean • false (browser only; requires listenToBrowserNetworkEvents=true) •
  - true: move to disconnected without sending leave; keep timetoken/channels; try to catch up.
  - false: reset timetoken and active channels/groups.
- retryConfiguration • RequestRetryPolicy • ExponentialRetryPolicy (subscribe only) • Configure reconnection. You can exclude endpoint groups.
  - Policies:
    - PubNub.NoneRetryPolicy()
    - PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })
    - PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })
- autoNetworkDetection • boolean • false (browser/Node; only when enableEventEngine=false) • Emit PNNetworkDownCategory/PNNetworkUpCategory on network changes.
- listenToBrowserNetworkEvents • boolean • true (browser only) • Listen for reachability and reconnect on network changes; set false if browser events are unreliable.
- maintainPresenceState • boolean • true (only when enableEventEngine=true) • Send custom presence state with each subscribe call.
- cryptoModule • PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs }) | PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey }) • None • Cryptography module for messages/files.
- subscriptionWorkerUrl • string • None • URL for shared worker; see Shared workers.
- cipherKey • string • n/a • Deprecated; pass via cryptoModule.
- useRandomIVs • boolean • true • Deprecated; pass via cryptoModule. Random IVs recommended.
- uuid • string • n/a • Deprecated; use userId instead.

##### Disabling random initialization vector
Only for backward compatibility (<4.31.0). Do not disable random IVs for new apps.

#### cryptoModule

Configures message/file encryption. Two options:
- Legacy 128‑bit encryption (keep existing behavior).
- Recommended 256‑bit AES‑CBC (explicitly set in config).

If cryptoModule is not set but cipherKey/useRandomIVs are set, legacy encryption is used. See Encryption docs for details.

#### Shared workers

Shared workers manage concurrent connections/presence across tabs/windows.

Source:
```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.9.9.0.js  
`
```

Host under the same origin as your app (Same-origin Policy).

##### Configuration

Download and host the shared worker:
```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.9.9.0.js  
`
```

Set subscriptionWorkerUrl on initialization:
```
`  
`
```

When set, the client uses the worker to aggregate subscriptions.

##### Worker version
Worker version must match the PubNub client version.

### Sample code

Reference code and required userId:
```
`  
`
```

### Server operations

Use secretKey for server-side Access Manager administration (secure environments only). Always set userId.

```
`var pubnub = new PubNub({  
    subscribeKey: "mySubscribeKey",  
    publishKey: "myPublishKey",  
    userId: "myUniqueUserId",  
    secretKey: "secretKey",  
    heartbeatInterval: 0  
});  
`
```

### Other examples

#### Initialization for a Read-Only client
Omit publishKey when the client only reads messages.
```
`  
`
```

#### Initializing with SSL enabled
Set ssl: true to enable TLS.
```
`  
`
```

## Event listeners

- PubNub client: updates from all subscriptions.
- Subscription: updates for a specific channel/group/metadata/user.
- SubscriptionsSet: updates for a set of subscriptions.

See Publish & Subscribe for details.

## User ID

A required unique alphanumeric identifier identifying the client.

### Set user ID

Set userId during initialization or via setUserId.

```
`var pubnub = new PubNub({  
    subscribeKey: "mySubscribeKey",  
    publishKey: "myPublishKey",  
    userId: "myUniqueUserId"  
});  
`
```

```
`pubnub.setUserId(string)  
`
```

- userId • string • userId to set.

```
`pubnub.setUserId("myUniqueUserId")  
`
```

### Save user ID

When set at initialization in a browser, userId is saved to localStorage automatically (or implement your own caching).

### Get user ID

Get the current userId:
```
`pubnub.getUserId();  
`
```

Recommendation: userId is visible to clients (e.g., via dev tools). Avoid emails/usernames.

## Authentication key

Reset or update the auth key at runtime (typically set during initialization for PAM-enabled apps).

### Property

```
`pubnub.setAuthKey(string)  
`
```

- key • string • Auth key to set.

### Sample code

```
`  
`
```

### Returns

None.

## Filter expression

Requires Stream Controller add-on enabled in Admin Portal.

Filter server-side to receive only messages matching the expression.

### Method(s)

```
`pubnub.setFilterExpression(  
  filterExpression: string  
)  
`
```

- filterExpression • string • PSV2 filter for subscribe.

```
`pubnub.getFilterExpression()  
`
```

This method has no arguments.

### Sample code

#### Set filter expression
```
`  
`
```

#### Get filter expression
```
`**`
```

Last updated on Sep 3, 2025**