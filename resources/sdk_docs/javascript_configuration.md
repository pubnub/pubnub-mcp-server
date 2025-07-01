On this page
# Configuration API for JavaScript SDK

JavaScript complete API reference for building real-time applications on PubNub, including basic usage and sample code.

You must include the PubNub JavaScript SDK in your code before initializing the client.

```
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.js">script>  
`
```

## Bundling[​](#bundling)

PubNub JavaScript SDK allows you to opt out of modules you don't want to use in your application. You can use either [Rollup](https://rollupjs.org/) or [Webpack](https://webpack.js.org/) to bundle modules.

We provide a [configuration file](https://github.com/pubnub/javascript/blob/master/rollup.config.js) you can use to create your bundle configuration for both systems.

- Rollup
- Webpack

Clone the [PubNub JavaScript SDK repository](https://github.com/pubnub/javascript) to a directory of your choice.

In the [`rollup.config.js`](https://github.com/pubnub/javascript/blob/master/rollup.config.js) Rollup configuration file, change the value of the `enableTreeShaking` constant to `true`.

Inspect the `rollup.config.js` file and decide which modules you want to bundle. Disable the unnecessary modules by setting the environment variables with their labels to `disabled`, for example, in Terminal:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

Run the `rollup -c rollup.config.js --bundleConfigAsCjs` command to bundle the modules. Once the process is finished, you can find the bundle in the *your_js_sdk_repo_dir*`/upload` directory.

Clone the [PubNub JavaScript SDK repository](https://github.com/pubnub/javascript) to a directory of your choice.

In the repository, create a `webpack.config.js` file and base its contents on the [Rollup configuration file](https://github.com/pubnub/javascript/blob/master/rollup.config.js). This setup allows you to dynamically change which modules are enabled/disabled by setting environment variables in Terminal.

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

##### Webpack configuration

Make sure to add any other necessary configuration to the `webpack.config.js`. For more information, refer to [Webpack documentation](https://webpack.js.org/concepts/).

Disable the unnecessary modules by setting the environment variables with their labels to `disabled`, for example, in Terminal:

```
`export PRESENCE_MODULE=disabled PUBLISH_MODULE=disabled  
`
```

Run the `npx webpack --config webpack.config.js` command to bundle the modules. Once the process is finished, you can find the bundle in the directory you configured in the `webpack.config.js` file.

## Initialization[​](#initialization)

Use this method to initialize the PubNub Client API context and establish account-level credentials such as publish and subscribe keys. You can create an account and get your keys from the Admin Portal.

### Method(s)[​](#methods)

To `Initialize` PubNub, you can use the following method(s) in the JavaScript SDK:

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
*  requiredParameterDescription`subscribeKey` *Type: stringDefault:  
n/aSpecifies the `subscribeKey` to be used for subscribing to a channel. This key can be specified at initialization or along with a `subscribe()`.`publishKey`Type: stringDefault:  
n/aSpecifies the `publishKey` to be used for publishing messages to a channel. This key can be specified at initialization or along with a `publish()`.`userId` *Type: stringDefault:  
n/a`userId` to use. You should set a unique `userId` to identify the user or the device that connects to PubNub.  

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
If you don't set the `userId`, you won't be able to connect to PubNub.`secretKey`Type: stringDefault:  
n/aSecret key from Admin Portal. When you initialize PubNub with `secretKey`, you get root permissions for [Access Manager](/docs/general/security/access-control). For more information, refer to [Server Operations](#server-operations).`authKey`Type: stringDefault:  
n/aThe token returned from Access Manager that provides access to resources. For more information, refer to [Access Manager](/docs/general/security/access-control#authorization-flow).`logVerbosity`Type: booleanDefault:  
`false`Log HTTP information.   
  
 For information on enabling logging and collecting logs for troubleshooting, see [Logging](/docs/sdks/javascript/logging).`ssl`Type: booleanDefault:  
`true` for v4.20.0 onwards,   
`false` before v4.20.0If set to `true`, requests will be made over HTTPS.`origin`Type: string or string[]Default:  
`ps.pndsn.com`If a custom domain is required, SDK accepts it here.`presenceTimeout`Type: numberDefault:  
`300`Defines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server every `300` seconds by default. These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview).`heartbeatInterval`Type: numberDefault:  
`Not Set`Specifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `presenceTimeout`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(presenceTimeout / 2) - 1`.`keepAlive`Type: booleanDefault:  
`false`If set to `true`, SDK will use the same TCP connection for each HTTP request, instead of opening a new one for each new request.`keepAliveSettings`Type: anyDefault:  
`keepAliveMsecs`: 1000   
 `freeSocketKeepAliveTimeout`: 15000   
 `timeout`: 30000   
 `maxSockets`: Infinity   
 `maxFreeSockets`: 256Set a custom parameters for setting your connection `keepAlive` if this is set to `true`.   
  
  `keepAliveMsecs: (Number)` how often to send TCP KeepAlive packets over sockets.   
 `freeSocketKeepAliveTimeout: (Number)` sets the free socket to timeout after freeSocketKeepAliveTimeout milliseconds of inactivity on the free socket.   
 `timeout: (Number)` sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.   
 `maxSockets: (Number)` maximum number of sockets to allow per host.   
 `maxFreeSockets: (Number)` maximum number of sockets to leave open in a free state.`suppressLeaveEvents`Type: booleanDefault:  
`false`When `true` the SDK doesn't send out the leave requests.`requestMessageCountThreshold`Type: numberDefault:  
`100``PNRequestMessageCountExceededCategory` is thrown when the number of messages into the payload is above of `requestMessageCountThreshold`. `enableEventEngine`Type: booleanDefault:  
`false`Whether to use the recommended standardized workflows for subscribe and presence, optimizing how the SDK internally handles these operations and which [statuses](/docs/sdks/javascript/status-events) it emits. Refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle) for more information.   
   
 This flag affects the following parameters:   
   

- [`autoNetworkDetection`](#auto-network-detection) is ignored when `enableEventEngine` is `true`
- [`maintainPresenceState`](#maintain-presence-state) is automatically enabled when `enableEventEngine` is `true`

`restore`Type: booleanDefault:  
`false`This option is available only in the **browser environment** and requires [`listenToBrowserNetworkEvents`](#listen-to-browser-network-events) to be set to `true`.   
  
 A flag to allow catch up on the front-end applications. Its main purpose is to manage the state in which the SDK will be set after the network goes down:  
  

- `true` — moves the client into the `disconnected` state without sending any `leave` events. It keeps the current timetoken and the list of active channels and groups intact. This option also allows for the network restore to try to catch up on messages that were missed when the client was offline.
- `false` — the client will reset the current timetoken as well as the list of active channels and groups.

`retryConfiguration`Type: `RequestRetryPolicy`Default:  
`PubNub.ExponentialRetryPolicy` (subscribe only)This option is available in the **browser** and **Node.js environments**.   
   
 Custom reconnection configuration parameters. You can specify one or more [endpoint groups](https://github.com/pubnub/javascript/blob/master/src/core/components/retryPolicy.ts) for which the retry policy won't be applied.   
  
 `retryConfiguration: policy` is the type of policy to be used.   
   
 Available values:   
 
- `PubNub.NoneRetryPolicy()`
- `PubNub.LinearRetryPolicy({ delay, maximumRetry, excluded })`
- `PubNub.ExponentialRetryPolicy({ minimumDelay, maximumDelay, maximumRetry, excluded })`

`excluded` takes an array of [`Endpoint`](https://github.com/pubnub/javascript/blob/master/src/core/components/retryPolicy.ts) enum values, for example, `excluded: [PubNub.Endpoint.MessageSend]`.  
  
For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#reconnection-policy). `autoNetworkDetection`Type: booleanDefault:  
`false`This option is available in the **browser** and **Node.js environments**, only when [`enableEventEngine`](#enable-event-engine) is `false`.  
  
Whether the SDK should emit the [`PNNetworkDownCategory`](/docs/sdks/javascript/status-events#browser-specific-statuses) and [`PNNetworkUpCategory`](/docs/sdks/javascript/status-events#browser-specific-statuses) statuses on network status change. `listenToBrowserNetworkEvents`Type: booleanDefault:  
`true`This option is available only in the **browser environment**.   
   
 Whether the SDK should emit the [`PNNetworkDownCategory`](/docs/sdks/javascript/status-events#browser-specific-statuses) and [`PNNetworkUpCategory`](/docs/sdks/javascript/status-events#browser-specific-statuses) statuses, listen for the browser reachability events, and try to reconnect on network status change.  
  
 If the browser fails to detect the network changes from WiFi to LAN or you get reconnection issues, set the flag to `false`. This allows the SDK reconnection logic to take over. `maintainPresenceState`Type: booleanDefault:  
`true`Works only when [`enableEventEngine`](#enable-event-engine) is `true`.   
  
 Whether the custom presence state information set using [`pubnub.setState()`](/docs/sdks/javascript/api-reference/presence#set-state) should be sent every time the SDK sends a subscribe call.`cryptoModule`Type: `PubNub.CryptoModule.legacyCryptoModule({ cipherKey, useRandomIVs })`   
   
 `PubNub.CryptoModule.aesCbcCryptoModule({cipherKey})`Default:  
NoneThe cryptography module used for encryption and decryption of messages and files. Takes the `cipherKey` and `useRandomIVs` parameters as arguments.   
   
 For more information, refer to the [cryptoModule](#cryptomodule) section.`subscriptionWorkerUrl`Type: stringDefault:  
NoneThe URL for the shared worker on the server or the origin as the page where it's used. For more information, refer to [Shared workers](#shared-workers).`cipherKey`Type: stringDefault:  
n/aThis way of setting this parameter is deprecated, pass it to `cryptoModule` instead.   
   
 If passed, will encrypt the payloads.`useRandomIVs`Type: booleanDefault:  
`true`This way of setting this parameter is deprecated, pass it to `cryptoModule` instead.   
   
 When `true` the initialization vector (IV) is random for all requests (not just for file upload). When `false` the IV is hard-coded for all requests except for file upload.`uuid` *Type: stringDefault:  
n/aThis parameter is deprecated, use `userId` instead.  
  
 `UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   
If you don't set the `UUID`, you won't be able to connect to PubNub.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (<`4.31.0`) with existing applications. Never disable random IV on new applications.

#### `cryptoModule`[​](#cryptomodule)

`cryptoModule` provides encrypt/decrypt functionality for messages and files. From the 7.3.3 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `cryptoModule` in your app and have the `cipherKey` and `useRandomIVs` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `cryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `cryptoModule` to encrypt all messages/files, you can use the following methods in the Javascript SDK:

```
`  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 7.3.3 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

#### Shared workers[​](#shared-workers)

Shared workers manage concurrent connections and maintain presence states across multiple client instances. They're useful in scenarios where you have multiple browser tabs or windows using the PubNub SDK. PubNub's shared worker source code is accessible via our CDN:

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.9.7.0.js  
`
```

There are two main reasons for implementing shared workers:

Browser per-origin parallel connections limit

Browsers limit the number of parallel connections that can be established to the same origin (e.g., `ps.pndsn.com`). Due to this limitation, having multiple PubNub clients operating independently in the same context may produce connection issues. Shared workers can aggregate subscriptions for matching keysets, allowing them to utilize one long-poll subscribe request rather than one per client.

Presence maintenance with the "Generate Leave on TCP FIN or RST" feature

This feature emits a `leave` presence event immediately when a connection used for a long-poll subscribe request is closed, which can lead to false presence events if multiple tabs or windows are open. The shared worker tracks channels and groups to ensure long-poll requests are only truly terminated when all associated tabs or windows are closed, preventing incorrect presence updates.

##### Hosting a shared worked

As browsers enforce the [Same-origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), you must host the shared worker under the same origin as the client application. Pages loaded from different origins won't be able to share a worker.

##### Configuration[​](#configuration)

Download the shared worker source code from our CDN.

```
`http://cdn.pubnub.com/sdk/javascript/pubnub.worker.9.7.0.js  
`
```

Host the shared worker on your server or make it available under the same origin as the page where it's used according to the [Same-origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

Configure the `subscriptionWorkerUrl` property when initializing the PubNub client:

```
`  
`
```

When this URL is specified, the PubNub client downloads the shared worker's source code and uses it to manage subscriptions.

##### Worker version

The version of the shared worker must match the version of the PubNub client being used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Applications can `initialize` the PubNub object by passing the `subscribeKey` and `publishKey` keys from your account. Each client should also pass a `userId` that represents the user or the device that connects to PubNub.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

### Server Operations[​](#server-operations)

For servers connecting to PubNub, setting a `userId` is different than for a client device as there can be multiple instances of the server on the same machine and there is no "authentication" process for a server (at least not like an end-user).

The API can be initialized with the `secretKey` if the server needs to administer Access Manager permissions for client applications. When you initialize PubNub with `secretKey`, you get root permissions for the [Access Manager](/docs/general/security/access-control). With this feature, you don't have to grant access to your servers to access channels or channel groups. The servers get all access to all channels and channel groups.

##### Secure your secretKey

Anyone with the `secretKey` can grant and revoke permissions to your app. Never let your `secretKey` be discovered, and only exchange and deliver it securely. Only use the `secretKey` on secure environments such as `Node.js` applications or other server-side platforms.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

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

Now that the pubnub object is instantiated, the client will be able to access the Access Manager functions. The pubnub object will use the `secretKey` to sign all Access Manager messages to the PubNub Network.

### Other Examples[​](#other-examples)

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `publishKey` when initializing the client:

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This examples demonstrates how to enable PubNub Transport Layer Encryption with `TLS` (*formerly known as `SSL`*). Just initialize the client with `ssl` set to `true`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users.

- The [`Subscription`](/docs/sdks/javascript/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/javascript/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/javascript/api-reference/publish-and-subscribe#event-listeners).

## User ID[​](#user-id)

A `userId` (Universal Unique Identifier) is a required unique alphanumeric identifier used to identify the client to the PubNub platform. Each client must pass a `userId` that represents the user or the device that connects to PubNub.

### Set User ID[​](#set-user-id)

Set the `userId` parameter when you instantiate a PubNub instance (new `PubNub()`). It's important that your application reuse the `userId` on each device instead of generating a new `userId` on each connection.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`var pubnub = new PubNub({  
    subscribeKey: "mySubscribeKey",  
    publishKey: "myPublishKey",  
    userId: "myUniqueUserId"  
});  
`
```

You can also call the following method to explicitly set the `userId`:

```
`pubnub.setUserId(string)  
`
```

*  requiredParameterDescription`userId` *Type: String`userId` to set.

```
`pubnub.setUserId("myUniqueUserId")  
`
```

### Save User ID[​](#save-user-id)

Providing a value for the `userId` parameter in the PubNub object initialization will result in that value getting saved in the browser's localStorage key (described above) automatically by the PubNub SDK. You may implement a different local caching strategy, as required.

Consider the following when implementing a `userId` reuse strategy:

1. $1

2. $1

3. $1

### Get User ID[​](#get-user-id)

Use this method to get the current `userId` set on your application. This method doesn't take any arguments.

```
`pubnub.getUserId();  
`
```

##### Required UserId recommendation

Remember that whatever user ID you use is visible to other users (if a user peeks behind the scenes using the browser console or other tools), so you should not use a username or email as the `userId`. The `userId` should be something that can be easily replaced as required without user interaction or even knowledge that it has happened.

## Authentication Key[​](#authentication-key)

This function provides the capability to reset a user's auth Key.

Typically auth Key is specified during initialization for Access Manager enabled applications. In the event that auth Key has expired or a new auth Key is issued to the client from a Security Authority, the new auth Key can be sent using `setAuthKey()`.

### Property[​](#property)

To `Set Authentication Key` you can use the following method(s) in the JavaScript SDK

```
`pubnub.setAuthKey(string)  
`
```

*  requiredParameterDescription`key` *Type: String`Auth key` to set.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns)

None.

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following method. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-1)

```
`pubnub.setFilterExpression(  
  filterExpression: string  
)  
`
```

*  requiredParameterDescription`filterExpression` *Type: stringPSV2 feature to `subscribe` with a custom filter expression.

```
`pubnub.getFilterExpression()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-2)

#### Set Filter Expression[​](#set-filter-expression)

```
`  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`**`
```
Last updated on Jun 30, 2025**