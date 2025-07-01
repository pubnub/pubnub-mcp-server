# Configuration API – PubNub Kotlin SDK  

## Breaking changes in v9.0.0
• Unified Java/Kotlin codebase.  
• New client-instantiation pattern.  
• Changed asynchronous callbacks and status events.  
See “Java/Kotlin SDK migration guide” for details.

---

## Request execution

```kotlin
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle successful method result
    }
}
```
Invoke `.sync()` or `.async()` on every Endpoint; otherwise the request isn’t executed.

---

## PNConfiguration

`PNConfiguration` holds all runtime options and is **immutable** once passed to the `PubNub` constructor.  
Use value-override (see below) for per-request changes.

### Constructor

```
`  
`
```

### Properties

| Property | Type | Default | Notes |
|----------|------|---------|-------|
| subscribeKey* | String | – | Required. |
| publishKey | String | – | Required for publishing. |
| secretKey | String | – | Server-side access (never embed in Android). |
| userId* | UserId | – | Required. `UserId(<String>)`, ≤ 92 UTF-8 chars. |
| logVerbosity | PNLogVerbosity | NONE | BODY enables full HTTP logging. |
| cacheBusting | Boolean | false | Shuffle sub-domains for bad proxies. |
| secure | Boolean | true | TLS on/off. |
| connectTimeout | Int | 5 | Seconds. |
| subscribeTimeout | Int | 310 | Seconds. |
| nonSubscribeRequestTimeout | Int | 10 | Seconds (read timeout). |
| filterExpression | String | – | Server-side stream filter. |
| heartbeatNotificationOptions | PNHeartbeatNotificationOptions | FAILURES | ALL / NONE also available. |
| origin | String | – | Custom origin. |
| presenceTimeout | Int | 300 | Seconds (min 20). Updates `heartbeatInterval`. |
| heartbeatInterval | Int | 0 | Seconds; `(presenceTimeout/2)-1` recommended. |
| proxy | Proxy | – | Java `Proxy`. |
| proxySelector | ProxySelector | – | Java `ProxySelector`. |
| proxyAuthenticator | Authenticator | – | Java `Authenticator`. |
| googleAppEngineNetworking | Boolean | – | Enable GAE networking. |
| suppressLeaveEvents | Boolean | false | Skip `leave` calls. |
| retryConfiguration | RetryConfiguration | Exponential (subscribe) | None / Linear / Exponential. `excludedOperations: List<RetryableEndpointGroup>`. |
| maintainPresenceState | Boolean | true | Send presence state on every subscribe. |
| cryptoModule | CryptoModule | – | `createAesCbcCryptoModule(cipherKey)` or `createLegacyCryptoModule(cipherKey)`. |
| includeInstanceIdentifier | Boolean | false | Send `instanceId`. |
| includeRequestIdentifier | Boolean | true | Send `requestId`. |
| maximumConnections | Int? | – | Max inbound concurrent connections. |
| certificatePinner | CertificatePinner | – | Custom cert pinning. |
| httpLoggingInterceptor | HttpLoggingInterceptor | – | Additional HTTP logging. |
| sslSocketFactory | SSLSocketFactory | – | Custom SSL factory. |
| x509ExtendedTrustManager | X509ExtendedTrustManager | – | Custom trust manager. |
| connectionSpec | ConnectionSpec | – | TLS versions / ciphers. |
| hostnameVerifier | HostnameVerifier | – | Custom hostname verification. |
| fileMessagePublishRetryLimit | Int | 5 | Automatic file-publish retries. |
| dedupOnSubscribe | Boolean | – | Enable message de-duplication. |
| maximumMessagesCacheSize | Int | – | Max de-duplication cache size. |
| pnsdkSuffixes | Map<String,String> | – | Custom SDK header suffixes. |
| managePresenceListManually | Boolean | – | Manual presence list (ACL). |
| authKey (deprecated) | String | – | Access-Manager v2 fallback. |

\* Required.

---

### `cryptoModule`

• `createLegacyCryptoModule(cipherKey)` – 128-bit legacy (default when only `cipherKey` + `useRandomInitializationVector` are set).  
• `createAesCbcCryptoModule(cipherKey)` – Recommended 256-bit AES-CBC (SDK ≥ 7.6.0).  
Older SDKs (< 7.6.0) cannot decrypt 256-bit AES-CBC data.

```
`  
`
```

---

## Value override

Override selected configuration values per-request with `overrideConfiguration`.

```
`  
`
```

Overridable keys: `subscribeKey`, `publishKey`, `secretKey`, `retryConfiguration`, `userId`, `includeInstanceIdentifier`, `includeRequestIdentifier`, `cryptoModule`, `connectTimeout`, `nonSubscribeReadTimeout`.

---

## Initialization

```
`  
`
```
*Parameter*  
• `builder` : `PNConfiguration` (see above).

Returns a `PubNub` instance for all API calls.

### Examples
(All examples keep mandatory `userId`.)

```
`  
`
```

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

• Access-Manager (requires enabled add-on; never expose `secretKey` in client apps)

```
`  
`
```

• Proxy configuration  

```
`  
`
```

---

## UserId helpers

Get current userId:

```kotlin
// Getting the userId
val userId = pubnub.configuration.userId.value
```

```
`  
`
```

Set userId:

```
`  
`
```

---

## Filter Expression

```
`  
`
```

```
`**`
```

---

_Last updated: Jun 2 2025_