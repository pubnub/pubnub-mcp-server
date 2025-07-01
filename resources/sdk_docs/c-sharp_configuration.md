On this page
# Configuration API for C# SDK

C# complete API reference for building real-time applications on PubNub, including basic usage and sample code.

##### Request execution

We recommend using `try` and `catch` statements when working with the C# SDK.

If there's an issue with the provided API parameter values, like missing a required parameter, the SDK throws an exception. However, if there is a server-side API execution issue or a network problem, the error details are contained within the `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

## Configuration[​](#configuration)

`PNConfiguration` instance is storage for user-provided information which describe further PubNub client behavior. Configuration instance contain additional set of properties which allow to perform precise PubNub client configuration.

### Method(s)[​](#methods)

To create `configuration` instance you can use the following function in the C# SDK:

```
`  
`
```

*  requiredParameterDescription`SubscribeKey` *Type: string`SubscribeKey` from Admin Portal.`PublishKey`Type: string`PublishKey` from Admin Portal (only required if publishing).`SecretKey`Type: string`SecretKey` required for access control operations.`UserId` *Type: `UserId``UserId` to use. The `UserId` object takes `string` as an argument. You should set a unique identifier for the user or the device that connects to PubNub.  

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `UserId`, you won't be able to connect to PubNub.`LogLevel`Type: `PubnubLogLevel`Enum defining the level of severity captured in logs.   
  
 Available values:
- `PubnubLogLevel.Trace`
- `PubnubLogLevel.Debug`
- `PubnubLogLevel.Info`
- `PubnubLogLevel.Warn`
- `PubnubLogLevel.Error`

Default is `PubnubLogLevel.None`, which means logging is off.   
 For more information, refer to [Logging](/docs/sdks/c-sharp/logging#how-to-enable-logging).`AuthKey`Type: stringIf Access Manager is utilized, client will use this `AuthKey` in all restricted requests.`Secure`Type: boolUse `SSL`.`SubscribeTimeout`Type: intHow long to keep the `subscribe` loop running before disconnect. The value is in seconds.`NonSubscribeRequestTimeout`Type: intOn `non subscribe` operations, how long to wait for server response. The value is in seconds.`FilterExpression`Type: stringFeature to subscribe with a custom filter expression.`HeartbeatNotificationOption`Type: `PNHeartbeatNotificationOption``Heartbeat` notifications, by default, the SDK will alert on failed heartbeats (equivalent to: `PNHeartbeatNotificationOption.FAILURES`).   
Other options such as all heartbeats (`PNHeartbeatNotificationOption.ALL`) or no heartbeats (`PNHeartbeatNotificationOption.NONE`) are supported.`Origin`Type: stringCustom `Origin` if needed. `ReconnectionPolicy`Type: `PNReconnectionPolicy`Custom reconnection configuration parameters. Default is `PNReconnectionPolicy.EXPONENTIAL` (subscribe only).   
  
 Available values:   
 
- `PNReconnectionPolicy.NONE`
- `PNReconnectionPolicy.LINEAR`
- `PNReconnectionPolicy.EXPONENTIAL`

   
For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).`ConnectionMaxRetries`Type: intThe maximum number of reconnection attempts. If not provided, the SDK will not reconnect.   
   
  For more information, refer to [Reconnection Policy](/docs/general/setup/connection-management#reconnection-policy).`PresenceTimeout`Type: intDefines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server at a given interval (like every 300 seconds). These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview).`SetPresenceTimeoutWithCustomInterval`Type: intSpecifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `PresenceTimeout`.   
   
Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(PresenceTimeout / 2) - 1`.`Proxy`Type: ProxyInstructs the SDK to use a `Proxy` configuration when communicating with PubNub servers.`RequestMessageCountThreshold`Type: Number`PNRequestMessageCountExceededCategory` is thrown when the number of messages into the payload is above of `requestMessageCountThreshold`.`SuppressLeaveEvents`Type: boolWhen `true` the SDK doesn't send out the leave requests.`DedupOnSubscribe`Type: boolWhen `true` duplicates of subscribe messages will be filtered out when devices cross regions.`MaximumMessagesCacheSize`Type: intIt is used with `DedupOnSubscribe` to cache message size.Default is `100`.`FileMessagePublishRetryLimit`Type: intThe number of tries made in case of Publish File Message failure.Default is `5`.`CryptoModule`Type: `AesCbcCryptor(CipherKey)`   
   
 `LegacyCryptor(CipherKey)`The cryptography module used for encryption and decryption of messages and files. Takes the `CipherKey` parameter as argument.   
   
 For more information, refer to the [CryptoModule](#cryptomodule) section.`EnableEventEngine`Type: `Boolean`True by default. Whether to use the recommended standardized workflows for subscribe and presence, optimizing how the SDK internally handles these operations and which [statuses](/docs/sdks/c-sharp/status-events) it emits.`MaintainPresenceState`Type: `Boolean`This option works only when `EnableEventEngine` is set to `true`.    
   
 Whether the custom presence state information set using [`pubnub.setPresenceState()`](/docs/sdks/c-sharp/api-reference/presence#set-state) should be sent every time the SDK sends a subscribe call.`RetryConfiguration`Type: `RetryConfiguration`(Applicable when `enableEventEngine = true`) Custom reconnection configuration parameters.   
   
 Available values:   
 
- `RetryConfiguration.Linear(int delayInSecond, int maxRetry)`
- `RetryConfiguration.Exponential(int minDelayInSecond, int maxDelayInSecond, int maxRetry)`

   
 For more information, refer to [Reconnection Policy](/docs/general/setup/connection-management#reconnection-policy). The C-sharp SDK doesn't support excluding endpoints.`LogVerbosity`Type: `PNLogVerbosity`This parameter is deprecated, use `LogLevel` instead.  
  
Set `PNLogVerbosity.BODY` to enable debugging. To disable debugging use the option `PNLogVerbosity.NONE``PubnubLog`Type: `IPubnubLog`This parameter is deprecated, use the `SetLogger` method to configure a custom logger that implements the `IPubnubLogger` interface.  
  
Pass the instance of a class that implements `IPubnubLog` to capture logs for troubleshooting.`CipherKey`Type: stringThis way of setting this parameter is deprecated, pass it to `CryptoModule` instead.   
   
 If `cipher` is passed, all communications to/from PubNub will be encrypted.`UseRandomInitializationVector`Type: boolThis way of setting this parameter is deprecated, pass it to `CryptoModule` instead.   
   
 When `true` the IV will be random for all requests and not just file upload. When `false` the IV will be hardcoded for all requests except File Upload. Default `false`.`Uuid` *Type: stringThis parameter is deprecated, use `userId` instead.  
  
`UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   
 If you don't set the `UUID`, you won't be able to connect to PubNub.

#### `CryptoModule`[​](#cryptomodule)

`CryptoModule` provides encrypt/decrypt functionality for messages and files. From the 6.18.0 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `CryptoModule` in your app and have the `CipherKey` and `UseRandomInitializationVector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `CryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `CryptoModule` to encrypt all messages/files, you can use the following methods in the C# SDK:

```
`  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 6.18.0 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

## Initialization[​](#initialization)

#### Include the code[​](#include-the-code)

```
`  
`
```

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `PublishKey` and `SubscribeKey`.

### Method(s)[​](#methods-1)

To `Initialize` PubNub you can use the following method(s) in the C# SDK:

```
`  
`
```

*  requiredParameterDescription`pnConfiguration` *Type: PNConfigurationGo to [Configuration](#configuration)  for more details.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `Publish()`, `Subscribe()`, `History()`, `HereNow()`, etc.

### Other Examples[​](#other-examples)

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `PublishKey` when initializing the client:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This examples demonstrates how to enable PubNub Transport Layer Encryption with `SSL`. Just initialize the client with `Secure` set to `true`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your secretKey

Anyone with the `SecretKey` can grant and revoke permissions to your app. Never let your `SecretKey` be discovered, and to only exchange it / deliver it securely. Only use the `SecretKey` on secure server-side platforms.

When you init with `SecretKey`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `SecretKey` as in the following example:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

Now that the pubnub object is instantiated the client will be able to access the Access Manager functions. The pubnub object will use the `SecretKey` to sign all Access Manager messages to the PubNub Network.

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users.

- The [`Subscription`](/docs/sdks/c-sharp/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/c-sharp/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/c-sharp/api-reference/publish-and-subscribe#event-listeners).

## UserId[​](#userid)

These functions are used to set/get a user ID on the fly.

### Property(s)[​](#propertys)

To set/get `UserId` you can use the following property(s) in C# SDK:

```
`  
`
```

*  requiredPropertyDescription`UserId` *Type: string`UserId` to be used as a device identifier. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`pubnub.GetCurrentUserId();  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-2)

#### Set User ID[​](#set-user-id)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Get User ID[​](#get-user-id)

```
`  
`
```

## Authentication Key[​](#authentication-key)

Setter and getter for users auth key.

### Property(s)[​](#propertys-1)

```
`pnConfiguration.AuthKey  
`
```

*  requiredPropertyDescription`AuthKey` *Type: stringIf Access Manager is utilized, client will use this `AuthKey` in all restricted requests.

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-3)

#### Set Auth Key[​](#set-auth-key)

```
`  
`
```

#### Get Auth Key[​](#get-auth-key)

```
`  
`
```

### Returns[​](#returns-1)

`Get Auth key` returns the current authentication key.

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following property. To learn more about filtering,refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Property(s)[​](#propertys-2)

```
`FilterExpression  
`
```

*  requiredPropertyDescription`FilterExpression` *Type: stringPSV2 feature to `Subscribe` with a custom filter expression.

```
`pnConfiguration.FilterExpression;  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-4)

#### Set Filter Expression[​](#set-filter-expression)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`**`
```
Last updated on Jun 30, 2025**