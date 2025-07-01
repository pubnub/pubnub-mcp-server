On this page
# Configuration API for Swift Native SDK

A configuration object that defines behavior and policies for a `PubNub` instance.

## Initializer(s)[​](#initializers)

Creates a configuration using the specified PubNub Publish and Subscribe Keys.

##### Privacy

[MAU billing](/docs/general/setup/account-setup#pricing-model) tracks users ([Device](/docs/general/basics/identify-users-and-devices) and MAU) for analytics and billing. PubNub does not track customers using transactions with random UUIDs/UserIDs.

### Method(s)[​](#methods)

To `Initialize` PubNub, you can use the following method(s) in the Swift SDK:

```
`PubNubConfiguration(  
  publishKey: String?,  
  subscribeKey: String,  
  userId: String,  
  cryptoModule: CryptoModule? = nil,  
  authKey: String? = nil,  
  authToken: String? = nil,  
  useSecureConnections: Bool = true,  
  origin: String = "ps.pndsn.com",  
  useInstanceId: Bool = false,  
  useRequestId: Bool = false,  
  automaticRetry: AutomaticRetry? = .default,  
  durationUntilTimeout: UInt = 300,  
  heartbeatInterval: UInt = 0,  
  supressLeaveEvents: Bool = false,  
`
```
show all 20 lines
*  requiredParameterDescription`publishKey`Type: String?Default:  
`nil`Specifies the PubNub Publish Key to be used when publishing messages to a channel.`subscribeKey` *Type: StringDefault:  
`nil`Specifies the PubNub Subscribe Key to be used when subscribing to a channel.`userId` *Type: StringDefault:  
n/a`userId` to use. You should set a unique identifier for the user or the device that connects to PubNub.  
  

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `userId`, you won't be able to connect to PubNub.`cryptoModule`Type: CryptoModule?Default:  
`nil`The cryptography module used for encryption and decryption of messages and files. Takes the `cipherKey` parameter as argument.   
   
 For more information, refer to the [cryptoModule](#cryptomodule) section.`authKey`Type: String?Default:  
`nil`If Access Manager is enabled, client will use `authKey` on all requests.`authToken`Type: String?Default:  
`nil`If Access Manager is enabled, client will use  `authToken` instead of `authKey` on all requests.`useSecureConnections`Type: BoolDefault:  
`true`If `true`, requests will be made over HTTPS; otherwise they will use HTTP (for cases when HTTPS might not be necessary or feasible, like development or testing purposes). You will still need to disable ATS for the system to allow insecure network traffic. See Apple's documentation for further details.`origin`Type: StringDefault:  
`"ps.pndsn.com"`Domain name used for requests. `useInstanceId`Type: BoolDefault:  
`false`Whether a PubNub object `instanceId` should be included on outgoing requests.`useRequestId`Type: BoolDefault:  
`false`Whether a request identifier should be included on outgoing requests.`automaticRetry`Type: AutomaticRetry?Default:  
`ReconnectionPolicy.exponential` (subscribe only)Custom reconnection configuration parameters.   
   
 For more information, refer to the [automaticRetry](#automaticretry) section.`durationUntilTimeout`Type: IntDefault:  
`300`Defines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server every `300` seconds by default. These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview). Minimum value is `20`.`heartbeatInterval`Type: UIntDefault:  
`0`Specifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `durationUntilTimeout`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(durationUntilTimeout / 2) - 1`. Minimum value is `0` and it means that the SDK doesn't send explicit heartbeat messages to the server.`suppressLeaveEvents`Type: BoolDefault:  
`false`Whether to send out the leave requests.`requestMessageCountThreshold`Type: UIntDefault:  
`100`The number of messages into the payload before emitting `RequestMessageCountExceeded`.`filterExpression`Type: String?Default:  
`nil`PSV2 feature to subscribe with a custom filter expression.`enableEventEngine`Type: BoolDefault:  
`true`Whether to use the recommended standardized workflows for subscribe and presence, optimizing how the SDK internally handles these operations and which [statuses](/docs/sdks/swift/status-events) it emits.`maintainPresenceState`Type: BoolDefault:  
`true`This option works only when `enableEventEngine` is set to `true`.   
   
 Whether the custom presence state information set using [`pubnub.setPresence()`](/docs/sdks/swift/api-reference/presence#set-state) should be sent every time the SDK sends a subscribe call.`cipherKey`Type: Crypto?Default:  
`nil`This way of setting this parameter is deprecated, pass it to `cryptoModule` instead.   
   
 If set, all communication will be encrypted with this key.`uuid` *Type: StringDefault:  
n/aThis parameter is deprecated, use `userId` instead.  
  
UUID to use. You should set a unique UUID to identify the user or the device that connects to PubNub. If you don't set the `UUID`, you won't be able to connect to PubNub.

#### `cryptoModule`[​](#cryptomodule)

`cryptoModule` provides encrypt/decrypt functionality for messages and files. From the 6.1.0 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `cryptoModule` in your app and have the `cipherKey` param set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `cryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `cryptoModule` to encrypt all messages/files, you can use the following methods in the Swift SDK:

```
`  
`
```

```
`  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 6.1.0 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

##### `automaticRetry`[​](#automaticretry)

`automaticRetry` provides automatic reconnection options. The `AutomaticRetry` object has the following parameters:

ParameterDescription`retryLimit`Type: `UInt`Maximum number of times a request can be retried before failing.`policy`Type: `ReconnectionPolicy`The policy to be used.   
   
 Available values include:   
   
 
- `ReconnectionPolicy.linear(delay)`
- `ReconnectionPolicy.exponential(minDelay, maxDelay)`

  
   
 `ReconnectionPolicy.exponential` is the default value for subscribe connections.   
`retryableHTTPStatusCodes`Type: `Set<Int>`One or more HTTP status codes for which the retry policy will be applied.`retryableURLErrorCode`Type: `Set<URLError.Code>`One or more URL error codes for which the retry policy will be applied.`excluded`Type: `[AutomaticRetry.Endpoint]`One or more [endpoints](https://github.com/pubnub/swift/blob/master/Sources/PubNub/Networking/Request/Operators/AutomaticRetry.swift) for which the retry policy won't be applied.

For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

```
`  
`
```

#### Request Configuration[​](#request-configuration)

The `PubNub.RequestConfiguration` object allows for per-request customization of PubNub behavior without modifying the global configuration.

*  requiredParameterDescription`customSession`Type: [`SessionReplaceable?`](#sessionreplaceable)Default:  
`nil`A custom network session that implements the `SessionReplaceable` protocol, which provides session management capabilities including request routing, task execution, and session lifecycle control.`customConfiguration`Type: [`RouterConfiguration?`](#routerconfiguration)Default:  
`nil`The endpoint configuration used by the request.`responseQueue`Type: [`DispatchQueue`](#dispatchqueue)Default:  
n/aThe queue that will be used for dispatching a response.

##### SessionReplaceable[​](#sessionreplaceable)

`SessionReplaceable` is a protocol that defines an interface for objects capable of replacing the default network session implementation. It provides session management capabilities including request routing, task execution, and session lifecycle control.

PropertyDescription`sessionID`Type: `UUID`The unique identifier for the session object`session`Type: `URLSessionReplaceable`The underlying URLSession used to execute network tasks`sessionQueue`Type: `DispatchQueue`The dispatch queue used to execute session operations`defaultRequestOperator`Type: `RequestOperator?`The default request operator attached to every request (settable)`sessionStream`Type: `SessionStream?`Optional session stream for real-time communication (settable)

##### RouterConfiguration[​](#routerconfiguration)

`RouterConfiguration` is a protocol that defines the base configuration interface for PubNub endpoints. It encapsulates all the essential settings required for PubNub API communication, including authentication keys, connection security, encryption, and various behavioral options. This protocol serves as the foundation for configuring how HTTP requests are constructed and executed within the PubNub SDK.

*  requiredPropertyDescription`publishKey`Type: `String?`Refer to the [publishKey](/docs/sdks/swift/api-reference/configuration#initializers) section.`subscribeKey`Type: `String`Refer to the [subscribeKey](/docs/sdks/swift/api-reference/configuration#initializers) section.`uuid`Type: `String`Unique device identifier for the client (equivalent to `userId` in Configuration)`useSecureConnections`Type: `Bool`Refer to the [useSecureConnections](/docs/sdks/swift/api-reference/configuration#initializers) section.`origin`Type: `String`Refer to the [origin](/docs/sdks/swift/api-reference/configuration#initializers) section.`authKey`Type: `String?`Refer to the [authKey](/docs/sdks/swift/api-reference/configuration#initializers) section.`authToken`Type: `String?`Refer to the [authToken](/docs/sdks/swift/api-reference/configuration#initializers) section.`cryptoModule`Type: `CryptoModule?`Refer to the [cryptoModule](/docs/sdks/swift/api-reference/configuration#cryptomodule) section.`useRequestId`Type: `Bool`Refer to the [useRequestId](/docs/sdks/swift/api-reference/configuration#initializers) section.`consumerIdentifiers`Type: `[String: String]`Key-value pairs identifying various consumers for request tracking`enableEventEngine`Type: `Bool`Refer to the [enableEventEngine](/docs/sdks/swift/api-reference/configuration#initializers) section.`maintainPresenceState`Type: `Bool`Refer to the [maintainPresenceState](/docs/sdks/swift/api-reference/configuration#initializers) section.`urlScheme`Type: `String`URL scheme derived from `useSecureConnections` ("`https`" or "`http`").`subscribeKeyExists`Type: `Bool`Whether `subscribeKey` is valid and not empty.`publishKeyExists`Type: `Bool`Whether `publishKey` is valid and not empty.

##### DispatchQueue[​](#dispatchqueue)

`DispatchQueue` is Apple's Foundation framework type used to specify which queue should handle response callbacks in PubNub SDK.

MethodDescription`currentLabel`Type: `String`Returns the label of the current `DispatchQueue` or "Unknown Queue" if no label was set

##### Official Apple Documentation

For standard `DispatchQueue` properties and methods, refer to [Apple's DispatchQueue documentation](https://developer.apple.com/documentation/dispatch/dispatchqueue).

### Basic Usage[​](#basic-usage)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Other Examples[​](#other-examples)

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can set the `publishKey` to `nil` when initializing the client:

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`  
`
```

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users.

- The [`Subscription`](/docs/sdks/swift/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/swift/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/swift/api-reference/publish-and-subscribe#event-listeners).

## Overriding PubNub Configuration[​](#overriding-pubnub-configuration)

All `PubNubConfiguration` properties are mutable, and can be changed after the object has been initialized. However, once the configuration is set on a `PubNub` instance those configurations are locked and can't be changed. Any changes would require a creating new `PubNub` instance.

```
`  
`
```

### Filter[​](#filter)

You can override the filter expression without creating a new PubNub instance by using this approach:

```
`**`
```
Last updated on Jun 12, 2025**