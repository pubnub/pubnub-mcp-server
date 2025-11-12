# Configuration API for Unity SDK

Configure and initialize the Unity SDK via Unity Editor assets or entirely in code. See Getting Started for asset setup.

## Build platform configuration

### Mobile build configuration

On Android/iOS, code stripping can remove PubNub assemblies, causing no messages on device while working in Editor. See Troubleshooting.

### WebGL configuration

Enable WebGL build mode only for builds
- Using UnityWebGLHttpClientService outside WebGL builds (including Editor) is unsafe due to UnityWebRequest being thread-unsafe.
- Create a config asset: right-click in Project -> Create -> PubNub -> PubNub Config Asset (PNConfigAsset). Provide account info.
- If you already have a PNConfigAsset, open it and check Enable Web GL Build Mode. This sets UnityWebGLHttpClientService as the transport in PnManagerBehaviour during initialization.
- If you don't use PnManagerBehaviour, initialize PubNub with WebGL build mode using one of the following methods:

```
1
  
```

```
1
  
```

- In Edit -> Project Settings -> Player, set Managed Stripping Level to Minimal.

Additional HTTP setup
- If you can't set Secure in PNConfiguration or the Scriptable Object, set Project Settings -> Player -> WebGL Settings -> Allow downloads over HTTP to Always allowed.

Install the WebGL Threading Patcher
- Window -> Package Manager -> + -> Add package from git URL -> https://github.com/VolodymyrBS/WebGLThreadingPatcher.git

These steps are for WebGL builds only.

## Configuration

A PNConfiguration instance stores settings controlling PubNub client behavior.

### Methods

Configure via Editor or entirely in code. Examples below use code.

Create PNConfiguration:

```
`1PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

Parameters (Type: description, defaults, notes)
- SubscribeKey (string): From Admin Portal. Required.
- PublishKey (string): From Admin Portal. Required if publishing.
- SecretKey (string): Required for access operations. Use only on secure server-side platforms.
- UserId (UserId): Required to connect. Unique user/device identifier. UTF-8 string up to 92 alphanumeric chars.
- LogLevel (PubnubLogLevel): Logging detail level. See Logging.
- AuthKey (string): Used when Access Manager is enabled.
- Secure (bool): Enable SSL/TLS transport.
- SubscribeTimeout (int, seconds): How long to keep the subscribe loop running before disconnect.
- NonSubscribeRequestTimeout (int, seconds): Timeout for non-subscribe operations.
- FilterExpression (string): Subscribe with a server-side filter expression.
- HeartbeatNotificationOption (PNHeartbeatNotificationOption): Default FAILURES; options: ALL, NONE.
- Origin (string): Custom domain. To request, see request process.
- ReconnectionPolicy (PNReconnectionPolicy): Default EXPONENTIAL (subscribe only). Values: NONE, LINEAR, EXPONENTIAL. See SDK connection lifecycle.
- ConnectionMaxRetries (int): Max reconnection attempts. If not provided, SDK will not reconnect. See Reconnection Policy.
- PresenceTimeout (int, seconds): How long the server considers the client alive. Missing heartbeats trigger a timeout event on the presence channel.
- PresenceInterval (int, seconds): How often to send heartbeats. Typically set to (PresenceTimeout / 2) - 1 for a shorter presence timeout.
- Proxy (Proxy): Proxy configuration.
- EnableTelemetry (bool): Enables SDK analytics (response time). Enabled by default.
- RequestMessageCountThreshold (Number): Triggers PNRequestMessageCountExceededCategory when payload message count exceeds threshold.
- SuppressLeaveEvents (bool): When true, SDK doesn't send leave requests.
- DedupOnSubscribe (bool): Filter duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (int): Used with DedupOnSubscribe. Default 100.
- FileMessagePublishRetryLimit (int): Retries for Publish File Message. Default 5.
- EnableEventEngine (bool): True by default. Enables standardized event processing. See SDK connection lifecycle.
- CryptoModule (AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)): Encryption module for messages/files. Prefer 256-bit AES-CBC. See Encryption.
- PubnubLog (IPubnubLog): Deprecated. Use pubnub.SetLogger(IPubnubLogger).
- LogVerbosity (PNLogVerbosity): Deprecated. Use LogLevel. BODY enables debug; NONE disables.
- CipherKey (string): Deprecated. Pass to CryptoModule instead. If set (with UseRandomInitializationVector), legacy encryption is used.
- UseRandomInitializationVector (bool): Deprecated. Configure via CryptoModule. Default false. When true, random IV is used for all requests (not just file upload).
- Uuid (string): Deprecated. Use userId instead.

Disabling random initialization vector
- Disable random IV only for backward compatibility (< 5.0.0). Do not disable for new apps.

#### CryptoModule

Configurable from 7.0.1. Options:
- Legacy 128-bit encryption (keep existing config to continue using).
- Recommended 256-bit AES-CBC (explicitly set in config).

If CryptoModule is not set but CipherKey and UseRandomInitializationVector are set, legacy encryption is used. See Message Encryption, File Encryption, and Encryption reference.

### Sample code

Required User ID
- Always set a stable UserId to identify the user/device. Without it, you can't connect.

Reference code

```
1
  
```

## Initialization

#### Include the code

```
1
  
```

### Description

Initialize the PubNub client before any API calls to establish credentials (PublishKey, SubscribeKey).

### Methods

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
- webGLBuildMode (bool): Default false. If true, sets UnityWebGLHttpClientService as transport.
- unityLogging (bool): Default false. If true, sets UnityPubNubLogger.

```
`1PubnubUnityUtils.NewUnityPubnub(configurationAsset, userId);  
`
```

- configurationAsset (PNConfigAsset): Scriptable Object config.
- userId (string): User ID for this Pubnub instance.

All methods return a new Pubnub instance.

### Sample code

Initialize the PubNub client API

```
1
  
```

### Returns

Returns a PubNub instance for Publish(), Subscribe(), History(), HereNow(), etc.

### Other examples

Initialize a non-secure client

```
1
  
```

Initialization for a Read-Only client (omit PublishKey)

```
1
  
```

Initializing with SSL enabled (set Secure = true)

```
1
  
```

Requires Access Manager add-on
- Enable Access Manager in Admin Portal.

Secure your 'secretKey'
- SecretKey grants/revokes permissions. Never expose it. Use only on secure server-side platforms.
- Initializing with SecretKey gives root permissions; server apps can access all channels.

Access Manager initialization example

```
1
  
```

## Event listeners

Real-time update sources:
- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for the particular subscribed object.
- SubscriptionsSet: updates for a set of subscription objects.

See Publish & Subscribe for entity subscriptions and event handlers.

## UserId

Set/get user ID at runtime.

### Methods

```
`1pubnub.ChangeUserId(UserId newUserid)  
`
```

- newUserid (UserId): New user identifier for this Pubnub instance.

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

Server-side stream filtering delivers only messages matching the filter. See Publish Messages.

### Properties

```
`1FilterExpression  
`
```

- FilterExpression (string): PSV2 feature to Subscribe with a custom filter expression.

```
`1pnConfiguration.FilterExpression;  
`
```

A property on PNConfiguration.

### Sample code

Set filter expression

```
1
  
```

Get filter expression

```
1
**
```

Last updated on Oct 29, 2025