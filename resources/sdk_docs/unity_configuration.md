# PubNub Unity SDK – Configuration (Condensed)

## Build-platform configuration
### Mobile (Android / iOS)  
Unity code-stripping can remove PubNub assemblies; if the build receives no messages, follow the Troubleshooting guide.

### WebGL  
1. Create or open a `PNConfigAsset`, enable **WebGL Build Mode** (sets `UnityWebGLHttpClientService`).  
2. If you don’t use `PnManagerBehaviour`, initialize with either of the following:

```
`  
`
```

```
`  
`
```

3. Editor: **Player Settings → Managed Stripping Level → Minimal**.  
4. If `Secure = false`, set **Player Settings → WebGL Settings → Allow downloads over HTTP → Always allowed**.  
5. Install the WebGL Threading Patcher (`git+https://github.com/VolodymyrBS/WebGLThreadingPatcher.git`).

---

## PNConfiguration

Create:

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

Key fields (types & notes)  
• `SubscribeKey` (string, required)  
• `PublishKey` (string; needed for publish)  
• `SecretKey` (string; **server-side only**)  
• `UserId` (UserId, required) – unique UTF-8 ≤ 92 chars  
• `LogLevel` (PubnubLogLevel)  
• `AuthKey` (string)  
• `Secure` (bool, SSL)  
• `SubscribeTimeout`, `NonSubscribeRequestTimeout` (int, seconds)  
• `FilterExpression` (string)  
• `HeartbeatNotificationOption` (PNHeartbeatNotificationOption: NONE | FAILURES | ALL)  
• `Origin` (string)  
• `ReconnectionPolicy` (PNReconnectionPolicy: NONE | LINEAR | EXPONENTIAL) + `ConnectionMaxRetries`  
• `PresenceTimeout`, `PresenceInterval` (int, seconds)  
• `Proxy` (Proxy)  
• `EnableTelemetry` (bool, default true)  
• `RequestMessageCountThreshold` (number)  
• `SuppressLeaveEvents`, `DedupOnSubscribe` (bool) + `MaximumMessagesCacheSize`  
• `FileMessagePublishRetryLimit` (int, default 5)  
• `EnableEventEngine` (bool, default true)  
• `CryptoModule` (`AesCbcCryptor(CipherKey)` or `LegacyCryptor(CipherKey)`)  
• Deprecated: `PubnubLog`, `LogVerbosity`, `CipherKey`, `UseRandomInitializationVector`, `Uuid`

### CryptoModule
• Legacy (128-bit) encryption remains the default if `CipherKey`/`UseRandomInitializationVector` are set and no `CryptoModule` is specified.  
• For 256-bit AES-CBC, explicitly set:

```
`  
`
```

Older SDKs (< 7.0.1) cannot decrypt AES-CBC.

---

## Initialization

Include code:

```
`  
`
```

Create a client:

```
`new PubNub(pnConfiguration);  
`
```

or

```
`PubnubUnityUtils.NewUnityPubnub(configuration, webGLBuildMode, unityLogging);  
`
```

or

```
`PubnubUnityUtils.NewUnityPubnub(configurationAsset, userId);  
`
```

All return a `Pubnub` instance.

Sample:

```
`  
`
```

Other patterns  
• Non-secure client

```
`  
`
```  

• Read-only client

```
`  
`
```  

• SSL enabled

```
`  
`
```

• With `SecretKey`

```
`  
`
```

---

## UserId

Change at runtime:

```
`pubnub.ChangeUserId(UserId newUserid)  
`
```

Example:

```
`  
`
```

Retrieve:

```
`  
`
```

---

## Filter Expression  (Stream Controller add-on)

Property:

```
`FilterExpression  
`
```

```
`pnConfiguration.FilterExpression;  
`
```

Set:

```
`  
`
```

Get:

```
`**`
```

_Last updated  Jul 16 2025_