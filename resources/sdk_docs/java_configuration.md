# Configuration API – PubNub Java SDK (v9+)

> All code blocks, method signatures, parameter names, types, defaults, and option values are preserved exactly as in the original documentation.

---

## 1. Create `PNConfiguration`

``` 
`import com.pubnub.api.java.v2.PNConfiguration;  
  
PNConfiguration.builder(UserId userId, String subscribeKey).build()  
`
```

### Configuration properties

• `subscribeKey` Type: String Default: n/a – Admin-portal subscribe key  
• `publishKey` Type: String Default: n/a – publish key (only if publishing)  
• `secretKey` Type: String Default: n/a – secret key (server only)  
• `logVerbosity` Type: PNLogVerbosity Default: PNLogVerbosity.NONE – set PNLogVerbosity.BODY to log network calls  
• `cacheBusting` Type: Boolean Default: n/a – shuffle sub-domains behind misbehaving proxy  
• `secure` Type: Boolean Default: true – enable TLS  
• `connectTimeout` Type: Int Default: 5 – seconds  
• `subscribeTimeout` Type: Int Default: 310 – seconds  
• `nonSubscribeRequestTimeout` Type: Int Default: 10 – seconds  
• `filterExpression` Type: String Default: Not set – server–side message filter  
• `heartbeatNotificationOptions` Type: PNHeartbeatNotificationOptions Default: PNHeartbeatNotificationOptions.FAILURES  
• `origin` Type: String Default: n/a – custom domain  
• `retryConfiguration` Type: RetryConfiguration Default: RetryConfiguration.Exponential – subscribe only  
  – `RetryConfiguration.None.INSTANCE`  
  – `RetryConfiguration.Linear(delayInSec, maxRetryNumber, excludedOperations)`  
  – `RetryConfiguration.Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations)`  
  – `excludedOperations` takes a list of `RetryableEndpointGroup` enums (e.g., `SUBSCRIBE`)  
• `presenceTimeout` Type: Int Default: 300 – seconds, min 20  
• `heartbeatInterval` Type: Int Default: 0 – seconds, ≥ 3 when enabled  
• `proxy` Type: Proxy Default: n/a  
• `proxySelector` Type: ProxySelector Default: n/a  
• `proxyAuthenticator` Type: Authenticator Default: n/a  
• `googleAppEngineNetworking` Type: Boolean Default: n/a  
• `suppressLeaveEvents` Type: Boolean Default: false  
• `maintainPresenceState` Type: Boolean Default: true  
• `cryptoModule` Type: CryptoModule.createAesCbcCryptoModule(...) or CryptoModule.createLegacyCryptoModule(...) – see below  
• `includesInstanceIdentifier` Type: Boolean Default: false  
• `includeRequestIdentifier` Type: Boolean Default: true  
• `maximumConnections` Type: Int? Default: n/a  
• `certificatePinner` Type: CertificatePinner Default: n/a  
• `httpLoggingInterceptor` Type: HttpLoggingInterceptor Default: n/a  
• `sslSocketFactory` Type: SSLSocketFactory Default: n/a  
• `x509ExtendedTrustManager` Type: X509ExtendedTrustManager Default: n/a  
• `connectionSpec` Type: ConnectionSpec Default: n/a  
• `hostnameVerifier` Type: HostnameVerifier Default: n/a  
• `fileMessagePublishRetryLimit` Type: Int Default: 5  
• `dedupOnSubscribe` Type: Boolean Default: n/a  
• `maximumMessagesCacheSize` Type: Int Default: n/a  
• `pnsdkSuffixes` Type: Map<String,String> Default: n/a  
• `managePresenceListManually` Type: Boolean Default: n/a  
• `authKey` Type: String Default: Not set – deprecated (Access Manager v2)

---

## 2. `cryptoModule`

``` 
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pnConfiguration.cryptoModule = CryptoModule.createAesCbcCryptoModule("enigma", true):  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pnConfiguration.cryptoModule = CryptoModule.createLegacyCryptoModule("enigma", true);  
`
```
• 256-bit AES-CBC (recommended) or legacy 128-bit encryption.  
• Clients < 6.3.6 cannot decrypt 256-bit AES-CBC.

---

## 3. Per-call value overrides

``` 
`  
`
```
Use `PnConfigurationOverride.from()` to override on a single request:  
`subscribeKey`, `publishKey`, `secretKey`, `retryConfiguration`, `userId`, `includeInstanceIdentifier`, `includeRequestIdentifier`, `cryptoModule`, `connectTimeout`, `nonSubscribeReadTimeout`.

---

## 4. `userId` helpers

``` 
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.setUserId(String userId);  
`
```

``` 
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.getUserId();  
`
```

---

## 5. Filter expression helpers

``` 
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.setFilterExpression(String filterExpression);  
`
```

``` 
`import com.pubnub.api.java.v2.PNConfiguration;  
  
pnConfiguration.getFilterExpression();  
`
```

---

### Breaking changes (v9.0.0)

• Unified Java/Kotlin codebase, new client instantiation pattern, new async callbacks/status events. Refer to the migration guide if upgrading from < 9.0.0.

_Last updated Jul 16 2025_