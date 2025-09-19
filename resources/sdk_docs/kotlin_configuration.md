# Configuration API – Kotlin SDK

## Breaking changes in 9.0.0
• Unified Kotlin/Java codebase.  
• New client-instantiation pattern.  
• Updated async callbacks and [status events](/docs/sdks/kotlin/status-events).  
Apps built with < 9.0.0 must follow the [migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

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
All endpoints must be finished with `.sync()` or `.async()`.

---

## PNConfiguration

`PNConfiguration` is immutable after passing it to the `PubNub` constructor (use *value overrides* for per-request changes).

### Constructor

```
`  
`
```

### Properties

* **subscribeKey** :String – required.  
* **publishKey** :String – required only for publish.  
* **secretKey** :String – required for access operations (never embed in client apps).  
* **userId** :UserId – required. UTF-8 string ≤ 92 chars.  
* **logVerbosity** :PNLogVerbosity = NONE (`BODY` logs HTTP bodies).  
* **cacheBusting** :Boolean = false – randomize subdomains behind broken proxy.  
* **secure** :Boolean = true – enable TLS.  
* **connectTimeout** :Int = 5 s.  
* **subscribeTimeout** :Int = 310 s.  
* **nonSubscribeRequestTimeout** :Int = 10 s.  
* **filterExpression** :String – server-side message filter.  
* **heartbeatNotificationOptions** :PNHeartbeatNotificationOptions = FAILURES (`ALL`, `NONE`).  
* **origin** :String – custom domain.  
* **presenceTimeout** :Int = 300 s (min 20); sets `heartbeatInterval` if changed.  
* **heartbeatInterval** :Int = 0 s (disabled). Recommended ≈ `presenceTimeout/2 - 1`, min 3.  
* **proxy / proxySelector / proxyAuthenticator** – standard Java networking proxies.  
* **googleAppEngineNetworking** :Boolean.  
* **suppressLeaveEvents** :Boolean = false.  
* **retryConfiguration** :RetryConfiguration = Exponential (subscribe only).  
    • `None` • `Linear(delaySec,maxRetries,excludedOperations)` • `Exponential(minDelaySec,maxDelaySec,maxRetries,excludedOperations)`  
    • `excludedOperations` list of `RetryableEndpointGroup` (e.g., `SUBSCRIBE`).  
* **maintainPresenceState** :Boolean = true (sends `setState` on every subscribe).  
* **cryptoModule** – `CryptoModule.createAesCbcCryptoModule(cipherKey)` or `createLegacyCryptoModule(cipherKey)`.  
* **includeInstanceIdentifier** :Boolean = false.  
* **includeRequestIdentifier** :Boolean = true.  
* **maximumConnections** :Int? – inbound connection cap.  
* **certificatePinner / httpLoggingInterceptor / sslSocketFactory / x509ExtendedTrustManager / connectionSpec / hostnameVerifier** – advanced TLS/HTTP options.  
* **fileMessagePublishRetryLimit** :Int = 5.  
* **dedupOnSubscribe** :Boolean.  
* **maximumMessagesCacheSize** :Int.  
* **pnsdkSuffixes** :Map<String,String>.  
* **managePresenceListManually** :Boolean.  
* **authKey** :String – deprecated; see [Access Manager](/docs/sdks/kotlin/api-reference/access-manager).

---

### cryptoModule

Two bundled options:  
1. Legacy 128-bit cipher (default if you set `cipherKey` but not `cryptoModule`).  
2. Recommended 256-bit AES-CBC (`createAesCbcCryptoModule`).  

Older SDKs (< 7.6.0) can’t decrypt AES-CBC.

```
`  
`
```

---

### Sample PNConfiguration usage

```
`  
`
```

---

## Value override (per-request)

```kotlin
`  
`
```
Overridable fields:  
`subscribeKey`, `publishKey`, `secretKey`, `retryConfiguration`, `userId`, `includeInstanceIdentifier`, `includeRequestIdentifier`, `cryptoModule`, `connectTimeout`, `nonSubscribeReadTimeout`.

---

## Initialization

Add PubNub per [Getting Started](/docs/sdks/kotlin).

### Constructor

```
`  
`
```
Parameter: **builder** :PNConfiguration.

### Example (required `userId`)

```
`  
`
```

### Non-secure client

```
`  
`
```

### Read-only client

```
`  
`
```

### SSL-enabled

```
`  
`
```

### Access Manager (server-side only – keep `secretKey` private)

```
`  
`
```

### Proxy

```
`  
`
```

---

## Event listeners

Choose from:  
• Global PubNub client.  
• `Subscription` (single object).  
• `SubscriptionsSet` (collection).  
See [Publish & Subscribe – Event listeners](/docs/sdks/kotlin/api-reference/publish-and-subscribe#event-listeners).

---

## UserId runtime control

```kotlin
// Get
val userId = pubnub.configuration.userId.value
```

```
`  
`
```

### Set

```
`  
`
```

### Get

```
`  
`
```

---

## Filter expression (requires *Stream Controller*)

```
`  
`
```
Parameter: **filterExpression** :String – PSV2 filter sent with `subscribe`.

### Example

```
`**`
```

_Last updated Jul 16 2025_