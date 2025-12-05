# Configuration API for Unity SDK (Condensed)

Programmatically configure the PubNub Unity SDK using PNConfiguration or a Scriptable Object (PNConfigAsset). Editor-based setup is available, but the code approach is often easier to integrate with non-MonoBehaviour services.

## Build platform configuration

### Mobile build configuration

- Android/iOS may fail to receive messages on device due to Unity code stripping removing PubNub assemblies. See Troubleshooting for fixes.

### WebGL configuration

Enable Web GL build mode only for builds

- UnityWebGLHttpClientService is thread-unsafe outside WebGL builds (including the editor).
- Create config asset: In Project, Create -> PubNub -> PubNub Config Asset (PNConfigAsset). Provide PubNub keys.
- If you already have a config asset, reuse it.
- Open PNConfigAsset and enable Enable Web GL Build Mode. This sets UnityWebGLHttpClientService in PnManagerBehaviour during initialization.
- If not using PnManagerBehaviour, initialize PubNub with WebGL build mode using one of the following:

```
1
  
```

```
1
  
```

- Project Settings -> Player -> Managed Stripping Level = Minimal.

Additional HTTP setup

- If you can’t enable Secure in PNConfiguration or the config asset, set Project Settings -> Player -> WebGL Settings -> Allow downloads over HTTP = Always allowed.

WebGL threading patcher

- Install WebGL Threading Patcher: Window -> Package Manager -> + -> Add package from git URL -> https://github.com/VolodymyrBS/WebGLThreadingPatcher.git

These steps are for WebGL builds only.

## Configuration

A PNConfiguration instance stores settings controlling PubNub client behavior.

### Create PNConfiguration

```
`1PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

Required User ID

- Always set a unique UserId (UTF-8, up to 92 alphanumeric chars). Persist it for the user/device lifetime. Without it, you can’t connect.

### Parameters

- SubscribeKey (string) — Required. From Admin Portal.
- PublishKey (string) — From Admin Portal. Required if publishing.
- SecretKey (string) — Only for access operations (Access Manager).
- UserId (UserId) — Required. The UserId object accepts a string; must be unique per user/device.
- LogLevel (PubnubLogLevel) — Logging detail level. See Logging docs.
- AuthKey (string) — Used for restricted requests when Access Manager is enabled.
- Secure (bool) — Use SSL.
- SubscribeTimeout (int) — Seconds to keep the subscribe loop alive before disconnect.
- NonSubscribeRequestTimeout (int) — Seconds to wait for non-subscribe operation responses.
- FilterExpression (string) — Server-side stream filter expression for subscribe.
- HeartbeatNotificationOption (PNHeartbeatNotificationOption) — Heartbeat alerts; default FAILURES. Options: ALL, NONE.
- Origin (string) — Custom origin. Contact support to request a custom domain.
- ReconnectionPolicy (PNReconnectionPolicy) — NONE, LINEAR, EXPONENTIAL (default EXPONENTIAL for subscribe).
- ConnectionMaxRetries (int) — Max reconnection attempts; if not set, SDK won’t reconnect.
- PresenceTimeout (int) — Seconds the server considers the client alive; triggers timeout on presence channel if no heartbeat.
- PresenceInterval (int) — Heartbeat frequency in seconds. Typically (PresenceTimeout / 2) - 1.
- Proxy (Proxy) — Use a proxy for PubNub requests.
- EnableTelemetry (bool) — Enable response time analytics; enabled by default.
- RequestMessageCountThreshold (Number) — Throws PNRequestMessageCountExceededCategory when payload message count exceeds threshold.
- SuppressLeaveEvents (bool) — If true, don’t send leave requests.
- DedupOnSubscribe (bool) — Filter duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (int) — Cache size for dedup; default 100.
- FileMessagePublishRetryLimit (int) — Retries for Publish File Message; default 5.
- EnableEventEngine (bool) — True by default; uses updated standardized event processing.
- CryptoModule (AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)) — Encryption for messages/files. See CryptoModule below.
- PubnubLog (IPubnubLog) — Deprecated. Use pubnub.SetLogger(IPubnubLogger).
- LogVerbosity (PNLogVerbosity) — Deprecated. Use LogLevel (BODY for debug, NONE to disable).
- CipherKey (string) — Deprecated. Pass via CryptoModule instead.
- UseRandomInitializationVector (bool) — Deprecated. Pass via CryptoModule. Default false.
- Uuid (string) — Deprecated. Use userId instead.

Disabling random initialization vector

- Only disable IV randomness for backward compatibility (<5.0.0). Never disable for new apps.

### CryptoModule

- Encrypts/decrypts messages and files. From 7.0.1, algorithms are configurable.
- Options:
  - LegacyCryptor(CipherKey): legacy 128-bit encryption.
  - AesCbcCryptor(CipherKey): recommended 256-bit AES-CBC.
- If CryptoModule isn’t set but CipherKey and UseRandomInitializationVector are set in config, the client uses legacy encryption.
- See Encryption docs for configuration, utilities, and examples.

Legacy encryption with 128-bit cipher key entropy

- No changes required to continue using legacy encryption.
- To use recommended 256-bit AES-CBC, explicitly configure CryptoModule.

### Sample code

Reference code

```
1
  
```

## UserId

Set/get a user ID at runtime.

### Methods

```
`1pubnub.ChangeUserId(UserId newUserid)  
`
```

- newUserid (UserId) — New identifier for this Pubnub instance.

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

- Stream filtering applies server-side filters so only matching messages reach the client. See Publish Messages for filter syntax.

### Properties

```
`1FilterExpression  
`
```

- FilterExpression (string) — PSV2 feature used to subscribe with a custom filter expression.

```
`1pnConfiguration.FilterExpression;  
`
```

A property in the PNConfiguration class.

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