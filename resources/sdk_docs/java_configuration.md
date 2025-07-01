On this page
# Configuration API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Java complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration[​](#configuration)

`PNConfiguration` instance is storage for user-provided information which describe further PubNub client behavior. Configuration instance contains additional set of properties which allow performing precise PubNub client configuration.

##### Immutable configuration

Once a configuration object has been passed to the PubNub constructor, you can't change its properties.

If you require changing values dynamically consider using [value overrides](#value-override).

### Method(s)[​](#methods)

To create `configuration` instance you can use the following function in the Java SDK:

```
`import com.pubnub.api.java.v2.PNConfiguration;  
  
PNConfiguration.builder(UserId userId, String subscribeKey).build()  
`
```

*  requiredParameterDescription`subscribeKey` *Type: StringDefault:  
n/a`subscribeKey` from the Admin Portal.`publishKey`Type: StringDefault:  
n/a`publishKey` from the Admin Portal (only required if publishing).`secretKey`Type: StringDefault:  
n/a`secretKey` (only required for access operations, keep away from Android).`logVerbosity`Type: PNLogVerbosityDefault:  
`PNLogVerbosity.NONE`Set `PNLogVerbosity.BODY` to enable logging of network calls along with proper logging framework configuration (if any) that is described in the [Logging](/docs/sdks/java/logging) document. To disable logging of network calls, use the `PNLogVerbosity.NONE` option.`cacheBusting`Type: BooleanDefault:  
n/aIf operating behind a misbehaving proxy, allow the client to shuffle the subdomains.`secure`Type: BooleanDefault:  
`true`When `true` `TLS` is enabled.`connectTimeout`Type: IntDefault:  
`5`How long before the client gives up trying to connect with the server.   
The value is in seconds.`subscribeTimeout`Type: IntDefault:  
`310`The subscribe request timeout.   
The value is in seconds.`nonSubscribeRequestTimeout`Type: IntDefault:  
`10`For `non subscribe` operations (publish, herenow, etc), this property relates to a read timeout that is applied from the moment the connection between a client and the server has been successfully established. It defines a maximum time of inactivity between two data packets when waiting for the server's response.   
The value is in seconds.`filterExpression`Type: StringDefault:  
`Not set`Feature to subscribe with a custom filter expression.`heartbeatNotificationOptions`Type: PNHeartbeatNotificationOptionsDefault:  
`PNHeartbeatNotificationOptions.FAILURES``Heartbeat` notification options. By default, the SDK alerts on failed heartbeats (equivalent to `PNHeartbeatNotificationOptions.FAILURES`).   
Other options including all heartbeats (`PNHeartbeatNotificationOptions.ALL`) and no heartbeats (`PNHeartbeatNotificationOptions.NONE`) are supported.`origin`Type: StringDefault:  
n/aCustom `origin` if needed. `retryConfiguration`Type: `RetryConfiguration`Default:  
`RetryConfiguration.Exponential` (subscribe only)Custom reconnection configuration parameters. You can specify one or more [endpoint groups](https://github.com/pubnub/kotlin/blob/master/pubnub-kotlin/pubnub-kotlin-core-api/src/commonMain/kotlin/com/pubnub/api/retry/RetryableEndpointGroup.kt) for which the retry policy won't be applied.   
  
 `RetryConfiguration` is the type of policy to be used.   
   
 Available values:   
 
- `RetryConfiguration.None.INSTANCE`
- `RetryConfiguration.Linear(delayInSec, maxRetryNumber, excludedOperations)`
- `RetryConfiguration.Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations`

   
 `excludedOperations` takes a list of `RetryableEndpointGroup` [enums](https://github.com/pubnub/kotlin/blob/master/pubnub-kotlin/pubnub-kotlin-core-api/src/commonMain/kotlin/com/pubnub/api/retry/RetryableEndpointGroup.kt), for example, `RetryableEndpointGroup.SUBSCRIBE`.   
   
 For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).`presenceTimeout`Type: IntDefault:  
`300`Defines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server every `300` seconds by default. These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview).   
   
 The value is in seconds, and the minimum value is `20` seconds.`heartbeatInterval`Type: `Int`Default:  
`0`Specifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `presenceTimeout`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(presenceTimeout / 2) - 1`.   
   
 Heartbeats are disabled by default, hence the default value is `0` seconds.`proxy`Type: [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html)Default:  
n/aInstructs the SDK to use a `proxy` configuration when communicating with PubNub servers. For more details see this [https://docs.oracle.com/javase/7/docs/api/java/net/Proxy.html](https://docs.oracle.com/javase/7/docs/api/java/net/Proxy.html)`proxySelector`Type: ProxySelectorDefault:  
n/aSets Java ProxySelector. For more details, refer to [https://docs.oracle.com/javase/7/docs/api/java/net/ProxySelector.html](https://docs.oracle.com/javase/7/docs/api/java/net/ProxySelector.html)`proxyAuthenticator`Type: AuthenticatorDefault:  
n/aSets Java Authenticator. For more details refer to [https://docs.oracle.com/javase/7/docs/api/java/net/Authenticator.html](https://docs.oracle.com/javase/7/docs/api/java/net/Authenticator.html)`googleAppEngineNetworking`Type: BooleanDefault:  
n/aEnable Google App Engine networking.`suppressLeaveEvents`Type: BooleanDefault:  
`false`When `true` the SDK doesn't send out the `leave` requests.`maintainPresenceState`Type: `Boolean`Default:  
`true`Whether the custom presence state information set using [`pubnub.setPresenceState()`](/docs/sdks/java/api-reference/presence#set-state) should be sent every time the SDK sends a subscribe call.`cryptoModule`Type: `CryptoModule.createAesCbcCryptoModule(cipherKey, useRandomInitializationVector)`   
   
 `CryptoModule.createLegacyCryptoModule(cipherKey, useRandomInitializationVector)`Default:  
NoneThe cryptography module used for encryption and decryption of messages and files. Takes the `cipherKey` and `useRandomInitializationVector` parameters as arguments. For more information, refer to the [cryptoModule](#cryptomodule) section.`includesInstanceIdentifier`Type: BooleanDefault:  
`false`Whether to include a `PubNubCore.instanceId` with every request.`includeRequestIdentifier`Type: BooleanDefault:  
`true`Whether to include a `PubNubCore.requestId` with every request.`maximumConnections`Type: Int?Default:  
n/aSets max requests per host ([okhttp3.Dispatcher.setMaxRequestsPerHost](https://square.github.io/okhttp/3.x/okhttp/okhttp3/Dispatcher.html)).`certificatePinner`Type: CertificatePinnerDefault:  
n/aSets certificate pinner for HTTPS connections.`httpLoggingInterceptor`Type: HttpLoggingInterceptorDefault:  
n/aSets a custom interceptor for logging network traffic.`sslSocketFactory`Type: SSLSocketFactoryDefault:  
n/aSets the SSL socket factory for creating SSL sockets.`x509ExtendedTrustManager`Type: X509ExtendedTrustManagerDefault:  
n/aSets the SSL trust manager for managing SSL certificates.`connectionSpec`Type: ConnectionSpecDefault:  
n/aSets the specifications for making connections ([ConnectionSpec](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-connection-spec/index.html)).`hostnameVerifier`Type: HostnameVerifierDefault:  
n/aManages the verification of the hostnames.`fileMessagePublishRetryLimit`Type: IntDefault:  
`5`Specifies how many times publishing file messages should automatically retry before failing.`dedupOnSubscribe`Type: BooleanDefault:  
n/aEnables deduplication on subscribe.`maximumMessagesCacheSize`Type: IntDefault:  
n/aSets the maximum size of messages cache.`pnsdkSuffixes`Type: `Map<String,String>`Default:  
n/aAdds custom suffixes to the SDK version info.`managePresenceListManually`Type: BooleanDefault:  
n/aEnables explicit presence control when set to true, affecting heartbeat and presence behavior.`authKey`Type: StringDefault:  
`Not set`This parameter is deprecated. Refer to [Manage Access](/docs/general/security/access-control) to understand the permission authorization flow and to Java [Access Manager API](/docs/sdks/java/api-reference/access-manager) for an overview of the API.  
   
 If Access Manager v2 is utilized, client will use this `authKey` in all restricted requests.

#### `cryptoModule`[​](#cryptomodule)

`cryptoModule` provides encrypt/decrypt functionality for messages and files. From the 6.3.6 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `cryptoModule` in your app and have the `setCipherKey` and `useRandomInitializationVector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `cryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `cryptoModule` to encrypt all messages/files, you can use the following methods in the Java SDK:

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pnConfiguration.cryptoModule = CryptoModule.createAesCbcCryptoModule("enigma", true):  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pnConfiguration.cryptoModule = CryptoModule.createLegacyCryptoModule("enigma", true);  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 6.3.6 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

### Value override[​](#value-override)

You can provide updated values for certain configuration options for a single request to any supported API with `PnConfigurationOverride.from()`.

```
`  
`
```

The configuration options you can override include:

- `subscribeKey`

- `publishKey`

- `secretKey`

- `retryConfiguration`

- `userId`

- `includeInstanceIdentifier`

- `includeRequestIdentifier`

- `cryptoModule`

- `connectTimeout`

- `nonSubscribeReadTimeout`

## Initialization[​](#initialization)

Add PubNub to your project using one of the procedures defined under [Getting Started](/docs/sdks/java).

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `publishKey` and `subscribeKey`.

### Method(s)[​](#methods-1)

To initialize PubNub you can use the following method(s) in the Java SDK:

```
`  
`
```

*  requiredParameterDescription`pnConfiguration` *Type: PNConfigurationGoto [Configuration](#configuration)  for more details.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `publish()`, `subscribe()`, `history()`, `hereNow()`, etc.

### Other Examples[​](#other-examples)

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `publishKey` when initializing the client:

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This examples demonstrates how to enable PubNub Transport Layer Encryption with `SSL`. Just initialize the client with `setSecure` set to `true`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Initializing with Access Manager[​](#initializing-with-access-manager)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your secretKey

Anyone with the `secretKey` can grant and revoke permissions to your app. Never let your `secretKey` be discovered, and to only exchange it / deliver it securely. Only use the `secretKey` on secure server-side platforms.

When you init with `secretKey`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `secretKey` as in the following example:

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

Now that the pubnub object is instantiated the client will be able to access the Access Manager functions. The pubnub object will use the `secretKey` to sign all Access Manager messages to the PubNub Network.

#### How to Set Proxy[​](#how-to-set-proxy)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users metadata.

- The [`Subscription`](/docs/sdks/java/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/java/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/java/api-reference/publish-and-subscribe#event-listeners).

## UserId[​](#userid)

These functions are used to set/get a user ID on the fly.

### Method(s)[​](#methods-2)

To set/get `userId` you can use the following method(s) in Java SDK:

```
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.setUserId(String userId);  
`
```

*  requiredParameterDescription`userId` *Type: StringDefault:  
n/a`userId` to be used as a device identifier. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.getUserId();  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-2)

#### Set User ID[​](#set-user-id)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Get User ID[​](#get-user-id)

```
`  
`
```

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following method. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-3)

`setFilterExpression()`

```
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.setFilterExpression(String filterExpression);  
`
```

*  requiredParameterDescription`filterExpression` *Type: StringPSV2 feature to `subscribe` with a custom filter expression

`getFilterExpression()`

```
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.getFilterExpression();  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-3)

#### Set Filter Expression[​](#set-filter-expression)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`**`
```
Last updated on May 28, 2025**