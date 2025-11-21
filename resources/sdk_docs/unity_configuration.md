# Configuration API for Unity SDK

Configure and initialize the PubNub Unity SDK via Unity assets or programmatically.

Refer to Getting Started for asset setup.

## Build platform configuration

Different Unity build platforms may require specific configuration.

### Mobile build configuration

On Android/iOS, builds may fail to receive messages due to Unity's code stripping removing PubNub assemblies. See Troubleshooting for solutions.

### WebGL configuration

The PubNub Unity SDK supports WebGL builds.

- Enable WebGL build mode only for builds
  - Using UnityWebGLHttpClientService outside WebGL builds (including Editor) may cause issues due to UnityWebRequest being thread-unsafe.
  - In Unity Editor: Create -> PubNub -> PubNub Config Asset to provide account info.
  - If you already have a config asset, open PNConfigAsset and check Enable Web GL Build Mode. This sets UnityWebGLHttpClientService in PnManagerBehaviour during initialization.
  - If you don't use PnManagerBehaviour, initialize with WebGL build mode using:

```
1
  
```

```
1
  
```

- Set Managed Stripping Level
  - Edit -> Project Settings -> Player -> Managed Stripping Level = Minimal.

- Additional HTTP setup
  - If you can't enable Secure in PNConfiguration or the asset, set Project Settings -> Player -> WebGL Settings -> Allow downloads over HTTP = Always allowed.

- Install WebGL Threading Patcher
  - Window -> Package Manager -> + -> Add package from git URL -> https://github.com/VolodymyrBS/WebGLThreadingPatcher.git

These steps apply to WebGL builds only.

## Configuration

A PNConfiguration instance stores settings controlling PubNub client behavior.

### Method(s)

Configure via assets or entirely in code. Examples below use code.

Create PNConfiguration:

```
`1PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

Parameters (Type: Description):
- SubscribeKey (string): SubscribeKey from Admin Portal.
- PublishKey (string): PublishKey from Admin Portal (required if publishing).
- SecretKey (string): Required for access operations.
- UserId (UserId): UTF-8 string up to 92 alphanumeric chars. Required to connect. Represents a unique user/device identifier.
- LogLevel (PubnubLogLevel): Sets logging level. See Logging.
- AuthKey (string): Used for restricted requests when Access Manager is enabled.
- Secure (bool): Use SSL/TLS.
- SubscribeTimeout (int): Seconds to keep subscribe loop running before disconnect.
- NonSubscribeRequestTimeout (int): Seconds to wait for server response on non-subscribe operations.
- FilterExpression (string): Custom filter expression for subscribe.
- HeartbeatNotificationOption (PNHeartbeatNotificationOption): Default FAILURES. Options: ALL, NONE.
- Origin (string): Custom domain. See request process for custom domain.
- ReconnectionPolicy (PNReconnectionPolicy): Default EXPONENTIAL (subscribe only). Values: NONE, LINEAR, EXPONENTIAL. See SDK connection lifecycle.
- ConnectionMaxRetries (int): Max reconnection attempts. If not set, no reconnect. See Reconnection Policy.
- PresenceTimeout (int): Seconds server considers client alive for presence; triggers timeout event if no heartbeat.
- PresenceInterval (int): Seconds between heartbeats. Typically (PresenceTimeout / 2) - 1 for shorter timeout.
- Proxy (Proxy): Proxy configuration to communicate with PubNub.
- EnableTelemetry (bool): Capture and send response-time analytics. Enabled by default.
- RequestMessageCountThreshold (Number): Throws PNRequestMessageCountExceededCategory when payload message count exceeds threshold.
- SuppressLeaveEvents (bool): If true, SDK does not send leave requests.
- DedupOnSubscribe (bool): Filter duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (int): Used with DedupOnSubscribe. Default 100.
- FileMessagePublishRetryLimit (int): Retries for Publish File Message. Default 5.
- EnableEventEngine (bool): Default true. Use updated standardized event processing. See SDK connection lifecycle.
- CryptoModule (AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)): Configures encryption/decryption. See CryptoModule.
- PubnubLog (IPubnubLog): Deprecated. Use pubnub.SetLogger(IPubnubLogger).
- LogVerbosity (PNLogVerbosity): Deprecated. Use LogLevel. BODY enables debugging; NONE disables.
- CipherKey (string): Deprecated; pass to CryptoModule instead. If set, all communications are encrypted.
- UseRandomInitializationVector (bool): Deprecated; pass to CryptoModule instead. Default false. When true, IV is random for all requests (not just file upload).
- Uuid (string): Deprecated; use userId instead. Required in older versions to connect.

#### Disabling random initialization vector

Disable random IV only for backward compatibility (<5.0.0). Do not disable for new apps.

#### CryptoModule

Encrypts/decrypts messages and files. From 7.0.1, you can configure algorithms.

- Options: legacy 128‑bit encryption or recommended 256‑bit AES‑CBC.
- If you set CipherKey/UseRandomInitializationVector in config but not CryptoModule, legacy encryption is used.
- See Encryption for details and examples.

##### Legacy encryption with 128-bit cipher key entropy

You can keep legacy encryption. To use 256-bit AES-CBC, explicitly set it in config.

### Sample code

##### Required User ID

Always set the UserId to uniquely identify the user/device. Persist it for the user's/device's lifetime. Without UserId, you cannot connect.

##### Reference code

```
1
  
```

## Initialization

#### Include the code

```
1
  
```

### Description

Initialize the PubNub Client API context before calling any APIs to establish credentials like PublishKey and SubscribeKey.

### Method(s)

```
`1new PubNub(pnConfiguration);  
`
```

- pnConfiguration (PNConfiguration): See Configuration.

```
`1PubnubUnityUtils.NewUnityPubnub(configuration, webGLBuildMode, unityLogging);  
`
```

- configuration (PNConfiguration): See Configuration.
- webGLBuildMode (bool): Default false; if true uses UnityWebGLHttpClientService as transport.
- unityLogging (bool): Default false; if true sets UnityPubNubLogger.

```
`1PubnubUnityUtils.NewUnityPubnub(configurationAsset, userId);  
`
```

- configurationAsset (PNConfigAsset): PubNub configuration Scriptable Object.
- userId (string): ID for this Pubnub instance.

All methods return a new Pubnub instance.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set the UserId.

```
1
  
```

### Returns

Returns the PubNub instance for APIs like Publish(), Subscribe(), History(), HereNow(), etc.

### Other examples

#### Initialize a non-secure client

##### Required User ID

Always set the UserId.

```
1
  
```

#### Initialization for a Read-Only client

Omit PublishKey if the client only reads messages.

##### Required User ID

Always set the UserId.

```
1
  
```

#### Initializing with SSL enabled

Set Secure = true to enable TLS.

##### Required User ID

Always set the UserId.

```
1
  
```

##### Requires Access Manager add-on

Access Manager must be enabled for your key.

##### Secure your 'secretKey'

Never expose SecretKey. Use only on secure server-side platforms.

Initialize with SecretKey to administer Access Manager permissions:

##### Required User ID

Always set the UserId.

```
1
  
```

With SecretKey, the client signs Access Manager messages to PubNub.

## Event listeners

- PubNub client: updates from all subscriptions (channels, groups, channel metadata, users).
- Subscription object: updates only for its target (channel, group, metadata, or user).
- SubscriptionsSet object: updates for all objects from a list of subscriptions.

See Publish & Subscribe for details.

## UserId

Set/get user ID at runtime.

### Method(s)

```
`1pubnub.ChangeUserId(UserId newUserid)  
`
```

- newUserid (UserId): New identifier for this Pubnub instance.

### Sample code

#### Set user ID

```
1
  
```

#### Get user ID

```
1
  
```

## Filter expression

##### Requires Stream Controller add-on

Server-side stream filtering to receive only messages matching the filter.

### Property(s)

```
`1FilterExpression  
`
```

- FilterExpression (string): PSV2 feature to Subscribe with a custom filter expression.

```
`1pnConfiguration.FilterExpression;  
`
```

A property in the PNConfiguration class.

### Sample code

#### Set filter expression

##### Required User ID

Always set the UserId.

```
1
  
```

#### Get filter expression

```
1
**
```

Last updated on Oct 29, 2025**