# Configuration API – PubNub Java SDK (v9.x)

## Overview  
`PNConfiguration` stores all runtime options for the PubNub client.  
• Configuration is **immutable** after it’s passed to the PubNub constructor.  
• Use **value overrides** (see below) for per-request changes.

---

## Instantiate `PNConfiguration`

```
import com.pubnub.api.java.v2.PNConfiguration;

PNConfiguration.builder(UserId userId, String subscribeKey).build()
```

---

## Parameters (builder setters)

* `subscribeKey` (String, required) – key from Admin Portal.  
* `publishKey` (String) – only required if you publish.  
* `secretKey` (String) – only for access-manager operations (server-side only).  
* `logVerbosity` (PNLogVerbosity, default `NONE`) – set `BODY` to log HTTP bodies.  
* `cacheBusting` (Boolean) – shuffle sub-domains when behind faulty proxy.  
* `secure` (Boolean, default `true`) – enable TLS.  
* `connectTimeout` (Int, default 5 s) – connection timeout.  
* `subscribeTimeout` (Int, default 310 s) – subscribe request timeout.  
* `nonSubscribeRequestTimeout` (Int, default 10 s) – read timeout for non-subscribe calls.  
* `filterExpression` (String) – server-side stream filter.  
* `heartbeatNotificationOptions` (PNHeartbeatNotificationOptions, default `FAILURES`).  
* `origin` (String) – custom origin if required.  
* `retryConfiguration` (RetryConfiguration, default `Exponential` subscribe-only)  
  • `RetryConfiguration.None.INSTANCE`  
  • `RetryConfiguration.Linear(delayInSec, maxRetry, excludedOperations)`  
  • `RetryConfiguration.Exponential(minDelay, maxDelay, maxRetry, excludedOperations)`  
  • `excludedOperations` list of `RetryableEndpointGroup` (e.g., `SUBSCRIBE`).  
* `presenceTimeout` (Int, default 300 s, min 20 s) – server considers client alive.  
* `heartbeatInterval` (Int, default 0 s) – manual heartbeat; usually `(presenceTimeout/2)-1`.  
* `proxy` (java.net.Proxy) – HTTP proxy.  
* `proxySelector` (ProxySelector)  
* `proxyAuthenticator` (Authenticator)  
* `googleAppEngineNetworking` (Boolean).  
* `suppressLeaveEvents` (Boolean, default false).  
* `maintainPresenceState` (Boolean, default true).  
* `cryptoModule` (CryptoModule) – see “Crypto Module” below.  
* `includesInstanceIdentifier` (Boolean, default false).  
* `includeRequestIdentifier` (Boolean, default true).  
* `maximumConnections` (Int?) – okhttp `setMaxRequestsPerHost`.  
* `certificatePinner` (CertificatePinner).  
* `httpLoggingInterceptor` (HttpLoggingInterceptor).  
* `sslSocketFactory` (SSLSocketFactory).  
* `x509ExtendedTrustManager` (X509ExtendedTrustManager).  
* `connectionSpec` (ConnectionSpec).  
* `hostnameVerifier` (HostnameVerifier).  
* `fileMessagePublishRetryLimit` (Int, default 5).  
* `dedupOnSubscribe` (Boolean).  
* `maximumMessagesCacheSize` (Int).  
* `pnsdkSuffixes` (Map<String,String>).  
* `managePresenceListManually` (Boolean).  
* `authKey` (String, deprecated) – see Access Manager v2 docs.

---

## Crypto Module

```
 // 256-bit AES-CBC (recommended)
 pnConfiguration.cryptoModule = CryptoModule.createAesCbcCryptoModule("enigma", true);

 // 128-bit legacy encryption
 pnConfiguration.cryptoModule = CryptoModule.createLegacyCryptoModule("enigma", true);
```

• Either module can decrypt messages created by the other.  
• SDKs older than 6.3.6 can’t decrypt AES-CBC 256-bit data.

---

## Value Override (per-request)

```
PNConfigurationOverride.from(pnConfiguration)
    // set only the fields you want to override
```

Overridable fields: `subscribeKey`, `publishKey`, `secretKey`, `retryConfiguration`, `userId`, `includeInstanceIdentifier`, `includeRequestIdentifier`, `cryptoModule`, `connectTimeout`, `nonSubscribeReadTimeout`.

---

## User ID helpers

```
import com.pubnub.api.java.v2.PNConfiguration;

pnConfiguration.setUserId(String userId);
pnConfiguration.getUserId();
```

`userId` is required for successful connection.

---

## Filter Expression helpers

```
import com.pubnub.api.java.v2.PNConfiguration;

pnConfiguration.setFilterExpression(String filterExpression);
pnConfiguration.getFilterExpression();
```

Server-side message filtering requires the Stream Controller add-on.

---

_Last updated 2025-05-28_