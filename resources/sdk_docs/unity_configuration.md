On this page
# Configuration API for Unity SDK

Unity complete API reference for building Real-time Applications on PubNub, including basic usage and sample code.

Even though you can configure and initialize the Unity SDK directly from Unity Editor via assets, you can also do it programmatically.

Refer to [Getting Started](/docs/sdks/unity) for instructions on how to set up the Unity SDK using assets.

## Build platform configuration[​](#build-platform-configuration)

Different Unity build platforms may require specific configuration to ensure the PubNub SDK functions correctly.

### Mobile build configuration[​](#mobile-build-configuration)

When building for Android or iOS platforms, you might encounter an issue where the PubNub Unity SDK works perfectly in the Unity Editor but fails to receive messages when deployed to mobile devices. This is typically caused by Unity's code stripping optimization removing PubNub SDK assemblies during the build process.

For detailed solutions to resolve this issue, refer to the [Troubleshooting](/docs/sdks/unity/troubleshoot) document.

### WebGL configuration[​](#webgl-configuration)

The PubNub Unity SDK is compatible with Unity WebGL builds. To configure your project to build for WebGL:

In your Unity Editor project tree, right-click any folder and navigate to **Create** -> **PubNub** -> **PubNub Config Asset**. This step creates a new scriptable object where you provide your PubNub account information.

##### Existing Config asset

If you have already created a config asset, you don't have to create a new one.

Open the scriptable `PNConfigAsset` object and mark the **Enable Web GL Build Mode** checkbox. This sets to `UnityWebGLHttpClientService` as the transport layer in `PnManagerBehaviour` during initialization.

If you don't use `PnManagerBehaviour`, initialize PubNub with the WebGL build mode:

```
`var pubnub = new Pubnub(pnConfig, httpTransportService: new UnityWebGLHttpClientService(),  
				ipnsdkSource: new UnityPNSDKSource());  
`
```

##### Enable Web GL build mode only for builds

Using `UnityWebGLHttpClientService` outside of WebGL builds (including the editor) might cause unexpected behavior due to `UnityWebRequest` being thread-unsafe.

Go to **Edit** -> **Project Settings** -> **Player** and set **Managed Stripping Level** to `Minimal`.

##### Additional HTTP setup
If for some reason you can't turn on the `Secure` option in either `PNConfiguration` or the Scriptable Object config file, then you need to also go to  **Project Settings** -> **Player** -> **WebGL Settings** and set the **Allow downloads over HTTP** option to **Always allowed**.

Install the WebGL Threading Patcher. Navigate to **Window -> Package Manager**, click **+**, select **Add package from git URL**, paste the link to the Threading Patcher's [GIT repository](https://github.com/VolodymyrBS/WebGLThreadingPatcher.git), and click **Add**.

These steps configure your project for WebGL builds only. If you want to build for other targets, configure your project accordingly.

## Configuration[​](#configuration)

A `PNConfiguration` instance is the storage for user-provided information that describe further PubNub client behavior.

### Method(s)[​](#methods)

As mentioned above there are two ways to configure your PubNub instance - entirely from the Unity Editor ([described in detail here](/docs/sdks/unity)) or entirely in code. The first method is faster so set up out of the box, while the second one can be easier to integrate into a project less reliant on Unity objects (e.g. one using non-MonoBehaviour DI Services).

In the examples below we'll focus on showcasing the pure-code approach.

To create a `PNConfiguration` instance, you can use the following function in the Unity SDK:

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

*  requiredParameterDescription`SubscribeKey` *Type: string`SubscribeKey` from Admin Portal.`PublishKey`Type: string`PublishKey` from Admin Portal (only required if publishing).`SecretKey`Type: string`SecretKey` (only required for access operations, keep away from Android).`UserId` *Type: UserId`UserId` to use. The `UserId` object takes `string` as an argument. You should set a unique identifier for the user or the device that connects to PubNub.  

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `UserId`, you won't be able to connect to PubNub.`LogLevel`Type: PubnubLogLevelSets the level of logging detail for this PubNub instance.   
  
 For more information about enabling logs, refer to the [Logging](/docs/sdks/unity/logging) document.`AuthKey`Type: stringIf Access Manager is utilized, client will use this `AuthKey` in all restricted requests.`Secure`Type: boolUse `SSL`.`SubscribeTimeout`Type: intHow long to keep the `subscribe` loop running before disconnect. The value is in seconds.`NonSubscribeRequestTimeout`Type: intOn `non subscribe` operations, how long to wait for server response. The value is in seconds.`FilterExpression`Type: stringFeature to subscribe with a custom filter expression.`HeartbeatNotificationOption`Type: PNHeartbeatNotificationOption`Heartbeat` notifications, by default, the SDK will alert on failed heartbeats (equivalent to: `PNHeartbeatNotificationOption.FAILURES`).   
Other options such as all heartbeats (`PNHeartbeatNotificationOption.ALL`) or no heartbeats (`PNHeartbeatNotificationOption.NONE`) are supported.`Origin`Type: stringCustom `Origin` if needed.`ReconnectionPolicy`Type: PNReconnectionPolicyCustom reconnection configuration parameters. Default is `PNReconnectionPolicy.EXPONENTIAL` (subscribe only).   
  
 Available values:   
 
- `PNReconnectionPolicy.NONE`
- `PNReconnectionPolicy.LINEAR`
- `PNReconnectionPolicy.EXPONENTIAL`

   
For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).`ConnectionMaxRetries`Type: intThe maximum number of reconnection attempts. If not provided, the SDK will not reconnect.   
   
  For more information, refer to [Reconnection Policy](/docs/general/setup/connection-management#reconnection-policy).`PresenceTimeout`Type: intDefines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server at a given interval (like every 300 seconds). These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview).   
   
 The value is in seconds.`PresenceInterval`Type: intSpecifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `PresenceTimeout`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(PresenceTimeout / 2) - 1`.`Proxy`Type: ProxyInstruct the SDK to use a `Proxy` configuration when communicating with PubNub servers.`EnableTelemetry`Type: boolEnables the SDK to capture analytics in terms of response time and sends them to PubNub server.   
It is enabled by default.`RequestMessageCountThreshold`Type: Number`PNRequestMessageCountExceededCategory` is thrown when the number of messages into the payload is above of `requestMessageCountThreshold`.`SuppressLeaveEvents`Type: boolWhen `true` the SDK doesn't send out the leave requests.`DedupOnSubscribe`Type: boolWhen `true` duplicates of subscribe messages will be filtered out when devices cross regions.`MaximumMessagesCacheSize`Type: intIt is used with `DedupOnSubscribe` to cache message size. Default is `100`.`FileMessagePublishRetryLimit`Type: intThe number of tries made in case of Publish File Message failure. Default is `5`.`EnableEventEngine`Type: boolTrue by default. Whether to use the updated, standardized event processing. For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle.)`CryptoModule`Type: `AesCbcCryptor(CipherKey)`   
   
 `LegacyCryptor(CipherKey)`The cryptography module used for encryption and decryption of messages and files. Takes the `CipherKey` parameter as argument.   
   
 For more information, refer to the [CryptoModule](#cryptomodule) section.`PubnubLog`Type: IPubnubLogThis way of setting a custom logger is deprecated, please use `pubnub.SetLogger(IPubnubLogger)` instead.   
  
Pass the instance of a class that implements `IPubnubLog` to capture logs for troubleshooting.`LogVerbosity`Type: PNLogVerbosityThis way of setting this parameter is deprecated, please use `LogLevel` instead.   
  
 Set `PNLogVerbosity.BODY` to enable debugging. To disable debugging use the option `PNLogVerbosity.NONE``CipherKey`Type: stringThis way of setting this parameter is deprecated, pass it to `CryptoModule` instead.   
   
 If `cipher` is passed, all communications to/from PubNub will be encrypted.`UseRandomInitializationVector`Type: boolThis way of setting this parameter is deprecated, pass it to `CryptoModule` instead.   
   
 When `true` the IV will be random for all requests and not just file upload. When `false` the IV will be hardcoded for all requests except File Upload.Default `false`.`Uuid` *Type: stringThis parameter is deprecated, use `userId` instead.  
  
`UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   
 If you don't set the `UUID`, you won't be able to connect to PubNub.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (<`5.0.0`) with existing applications. Never disable random IV on new applications.

#### `CryptoModule`[​](#cryptomodule)

`CryptoModule` provides encrypt/decrypt functionality for messages and files. From the 7.0.1 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `CryptoModule` in your app and have the `CipherKey` and `UseRandomInitializationVector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `CryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `CryptoModule` to encrypt all messages/files, you can use the following methods in the C# SDK:

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pnConfiguration.CryptoModule = new CryptoModule(new AesCbcCryptor("enigma"), new ListICryptor> { new LegacyCryptor("enigma") })  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pnConfiguration.CryptoModule = new CryptoModule(new LegacyCryptor("enigma"), new ListICryptor> { new AesCbCCryptor("enigma") })  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 7.0.1 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using UnityEngine;  
  
public class PubnubConfigurationExample : MonoBehaviour {  
    // Serialized fields to allow configuration within Unity Editor  
    //Note that you can always use the PnConfigAsset Scriptable Object for setting these values in editor  
    [SerializeField] private string userId = "myUniqueUserId";  
    [SerializeField] private string subscribeKey = "demo"; // Replace with your actual SubscribeKey  
    [SerializeField] private string publishKey = "demo"; // Replace with your actual PublishKey if publishing is needed  
    [SerializeField] private string secretKey = "yourSecretKey"; // Used if Access Manager operations are needed  
    [SerializeField] private string authKey = "authKey"; // Used if Access Manager is enabled  
    [SerializeField] private string filterExpression = "such=wow";  
    [SerializeField] private bool useSSL = true;  
    [SerializeField] private bool logToUnityConsole = true;  
  
`
```
show all 44 lines

## Initialization[​](#initialization)

#### Include the code[​](#include-the-code)

```
`using PubnubApi;  
using PubnubApi.Unity;  
`
```

### Description[​](#description)

This function is used for initializing the PubNub Client API context. You must initialize PubNub before calling any APIs to establish account-level credentials such as `PublishKey` and `SubscribeKey`.

### Method(s)[​](#methods-1)

To `Initialize` PubNub you can use the following method(s) in the Unity SDK:

```
`new PubNub(pnConfiguration);  
`
```

*  requiredParameterDescription`pnConfiguration` *Type: `PNConfiguration`Refer to [Configuration](#configuration)  for more details.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.Secure = true;  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `Publish()`, `Subscribe()`, `History()`, `HereNow()`, etc.

### Other Examples[​](#other-examples)

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.Secure = false;  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `PublishKey` when initializing the client:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.SubscribeKey = "my_subkey";  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This examples demonstrates how to enable PubNub Transport Layer Encryption with `SSL`. Just initialize the client with `Secure` set to `true`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.Secure = true;  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your 'secretKey'

Anyone with the `SecretKey` can grant and revoke permissions to your app. Never let your `SecretKey` be discovered, and to only exchange it / deliver it securely. Only use the `SecretKey` on secure server-side platforms.

When you init with `SecretKey`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `SecretKey` as in the following example:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.SecretKey = "my_secretkey";  
pnConfiguration.Secure = true;  
  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

Now that the PubNub object is instantiated the client can access the Access Manager functions. The PubNub object will use the `SecretKey` to sign all Access Manager messages to the PubNub Network.

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users.

- The [`Subscription`](/docs/sdks/unity/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/unity/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/unity/api-reference/publish-and-subscribe#event-listeners).

## UserId[​](#userid)

These functions are used to set/get a user ID on the fly.

### Method(s)[​](#methods-2)

To set a new `UserId` you can use the following method in Unity SDK:

```
`pubnub.ChangeUserId(UserId newUserid)  
`
```

*  requiredPropertyDescription`newUserid` *Type: `UserId`The new `UserId` to be used as the Pubnub instance identifier.

### Basic Usage[​](#basic-usage-2)

#### Set User ID[​](#set-user-id)

```
`pubnub.ChangeUserId(new UserId("myNewUserId"));  
`
```

#### Get User ID[​](#get-user-id)

```
`var currentUserId = pubnub.GetCurrentUserId();  
`
```

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following property. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Property(s)[​](#propertys)

```
`FilterExpression  
`
```

*  requiredPropertyDescription`FilterExpression` *Type: stringPSV2 feature to `Subscribe` with a custom filter expression.

```
`pnConfiguration.FilterExpression;  
`
```

A property in the `PNConfiguration` class.

### Basic Usage[​](#basic-usage-3)

#### Set Filter Expression[​](#set-filter-expression)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`PNConfiguration pnConfiguration = new PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.FilterExpression = "such=wow";  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`var sampleFilterExp = pnConfiguration.FilterExpression;**`
```
Last updated on Jun 30, 2025**