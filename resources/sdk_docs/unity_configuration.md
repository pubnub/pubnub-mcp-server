# Configuration API for Unity SDK

Concise reference for configuring, initializing, and handling events with the PubNub Unity SDK. You can configure via Unity Editor assets or fully in code.

Refer to Getting Started for asset setup.

Important: Always set a unique, persistent UserId for each user/device. If not set, you cannot connect.

## Build platform configuration

### Mobile build configuration

On Android/iOS, the SDK may work in Editor but fail on device due to Unity code stripping removing PubNub assemblies. See Troubleshooting for fixes.

### WebGL configuration

PubNub Unity SDK supports WebGL.

- Use UnityWebGLHttpClientService only in WebGL builds (UnityWebRequest is thread-unsafe elsewhere).
- Create a PubNub Config Asset: right-click a folder → Create → PubNub → PubNub Config Asset. Enter account info.
- If an asset exists, reuse it. In PNConfigAsset, check Enable Web GL Build Mode. This sets UnityWebGLHttpClientService in PnManagerBehaviour during initialization.
- If not using PnManagerBehaviour, initialize with WebGL build mode using one of the following methods:

```
1
  

```

```
1
  

```

- Project Settings → Player → set Managed Stripping Level to Minimal.

Additional HTTP setup:
- If you can’t enable Secure in PNConfiguration or the Scriptable Object, set Project Settings → Player → WebGL Settings → Allow downloads over HTTP to Always allowed.

Threading:
- Install WebGL Threading Patcher via Window → Package Manager → + → Add package from git URL → https://github.com/VolodymyrBS/WebGLThreadingPatcher.git.

These settings apply to WebGL builds only.

## Configuration

A PNConfiguration instance stores user-provided settings controlling PubNub client behavior.

### Methods

Create a PNConfiguration in code:

```
`1PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

Parameters (Type → Description):
- SubscribeKey (string) → SubscribeKey from Admin Portal.
- PublishKey (string) → PublishKey from Admin Portal (required if publishing).
- SecretKey (string) → Required for access operations (server-side only).
- UserId (UserId) → Required. Unique identifier (UTF-8, up to 92 alphanumeric chars). Without it, you can’t connect.
- LogLevel (PubnubLogLevel) → Logging detail level. See Logging.
- AuthKey (string) → Used with Access Manager for restricted requests.
- Secure (bool) → Use SSL/TLS.
- SubscribeTimeout (int) → Seconds to keep subscribe loop before disconnect.
- NonSubscribeRequestTimeout (int) → Seconds to wait on non-subscribe operations.
- FilterExpression (string) → Server-side message filtering for subscribe.
- HeartbeatNotificationOption (PNHeartbeatNotificationOption) → Default FAILURES. Options: ALL, NONE.
- Origin (string) → Custom domain. See request process.
- ReconnectionPolicy (PNReconnectionPolicy) → Default EXPONENTIAL (subscribe only). Options: NONE, LINEAR, EXPONENTIAL. See SDK connection lifecycle.
- ConnectionMaxRetries (int) → Max reconnection attempts. If not set, SDK won’t reconnect. See Reconnection Policy.
- PresenceTimeout (int) → Presence liveness window in seconds; marks timeout on absence of heartbeats. Triggers presence timeout.
- PresenceInterval (int) → Heartbeat interval in seconds. Typically set to (PresenceTimeout / 2) - 1 for shorter timeout.
- Proxy (Proxy) → Proxy configuration for SDK requests.
- EnableTelemetry (bool) → Default true. Sends response time analytics.
- RequestMessageCountThreshold (Number) → Throws PNRequestMessageCountExceededCategory when exceeded.
- SuppressLeaveEvents (bool) → If true, suppresses leave requests.
- DedupOnSubscribe (bool) → Deduplicate cross-region subscribe messages.
- MaximumMessagesCacheSize (int) → Used with DedupOnSubscribe. Default 100.
- FileMessagePublishRetryLimit (int) → Publish file message retry attempts. Default 5.
- EnableEventEngine (bool) → Default true. Uses updated event processing. See SDK connection lifecycle.
- CryptoModule (AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)) → Configure message/file encryption. See CryptoModule section.
- PubnubLog (IPubnubLog) → Deprecated. Use pubnub.SetLogger(IPubnubLogger).
- LogVerbosity (PNLogVerbosity) → Deprecated. Use LogLevel.
- CipherKey (string) → Deprecated. Pass to CryptoModule instead.
- UseRandomInitializationVector (bool) → Deprecated. Pass to CryptoModule. Default false. Random IV should be enabled for new apps.
- Uuid (string) → Deprecated. Use userId.

Disabling random initialization vector:
- Only for backward compatibility (< 5.0.0). Don’t disable for new apps.

#### CryptoModule

CryptoModule encrypts/decrypts messages/files. From 7.0.1, algorithms are configurable.

- Options: legacy 128-bit; recommended 256-bit AES-CBC. See Message Encryption and File Encryption.
- If CryptoModule isn’t set but CipherKey and UseRandomInitializationVector are in config, legacy encryption is used.
- See Encryption for details and examples.

Legacy encryption with 128-bit cipher key entropy:
- No change needed to keep legacy. To use 256-bit AES-CBC, set it explicitly in config.

### Sample code

Required User ID:
- Always set UserId. Persist it for the lifetime of the user/device.

Reference code:

```
1
  

```

## Initialization

#### Include the code

```
1
  

```

### Description

Initialize the PubNub Client API context before calling any APIs to establish PublishKey and SubscribeKey.

### Methods

```
`1new PubNub(pnConfiguration);  
`
```
- pnConfiguration (PNConfiguration) → See Configuration.

```
`1PubnubUnityUtils.NewUnityPubnub(configuration, webGLBuildMode, unityLogging);  
`
```
- configuration (PNConfiguration) → See Configuration.
- webGLBuildMode (bool) → Default false. If true, sets UnityWebGLHttpClientService transport.
- unityLogging (bool) → Default false. If true, sets UnityPubNubLogger.

```
`1PubnubUnityUtils.NewUnityPubnub(configurationAsset, userId);  
`
```
- configurationAsset (PNConfigAsset) → Scriptable Object configuration.
- userId (string) → User ID for this Pubnub instance.

All methods return a new Pubnub instance.

### Sample code

Initialize the PubNub client API

Required User ID:
- Always set UserId.

```
1
  

```

### Returns

Returns a PubNub instance for Publish(), Subscribe(), History(), HereNow(), etc.

### Other examples

Initialize a non-secure client

Required User ID:
- Always set UserId.

```
1
  

```

Initialization for a Read-Only client
- Omit PublishKey to read-only.

Required User ID:
- Always set UserId.

```
1
  

```

Initializing with SSL enabled
- Set Secure to true.

Required User ID:
- Always set UserId.

```
1
  

```

Requires Access Manager add-on
- Enable in Admin Portal.

Secure your 'secretKey'
- SecretKey grants root permissions for Access Manager. Keep server-side only and never expose.

Initialize with SecretKey (server-side administration):

Required User ID:
- Always set UserId.

```
1
  

```

## Event listeners

Sources for real-time updates:
- PubNub client: updates from all subscriptions (channels, channel groups, metadata, users).
- Subscription: updates for a specific entity.
- SubscriptionsSet: updates for a list of subscriptions.

Use local representations of server entities. See Publish & Subscribe for details.

## UserId

Set/get a user ID on the fly.

### Methods

```
`1pubnub.ChangeUserId(UserId newUserid)  
`
```
- newUserid (UserId) → New identifier for this Pubnub instance.

### Sample code

Set user ID

```
1
  

```

Get user ID

```
1
  

```

## Filter expression

Requires Stream Controller add-on
- Enable in Admin Portal.

Server-side stream filtering for subscribe.

### Properties

```
`1FilterExpression  
`
```
- FilterExpression (string) → PSV2 feature to Subscribe with a custom filter.

```
`1pnConfiguration.FilterExpression;  
`
```
- Property of PNConfiguration.

### Sample code

Set filter expression

Required User ID:
- Always set UserId.

```
1
  

```

Get filter expression

```
1
**
```

Last updated on Oct 29, 2025**