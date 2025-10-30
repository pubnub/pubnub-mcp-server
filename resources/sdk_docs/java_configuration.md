# Configuration API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new client instantiation flow, and changes async callbacks and [status events](/docs/sdks/java/status-events). Apps built with versions < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

## Configuration

`PNConfiguration` stores user-provided options that control PubNub client behavior.

##### Immutable configuration

Once passed to the PubNub constructor, configuration is immutable. To change values per request, use [value overrides](#value-override).

### Method(s)

To create a configuration instance:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3PNConfiguration.builder(UserId userId, String subscribeKey).build()  

```

Parameters:
- subscribeKey
  - Type: String
  - Default: n/a
  - Description: Your subscribe key from the Admin Portal.
- publishKey
  - Type: String
  - Default: n/a
  - Description: Publish key from the Admin Portal (required if publishing).
- secretKey
  - Type: String
  - Default: n/a
  - Description: Secret key (only for access operations; do not use on Android).
- customLoggers
  - Type: List<CustomLogger>
  - Default: n/a
  - Description: Custom logger implementations. See [Logging](/docs/sdks/java/logging).
- cacheBusting
  - Type: Boolean
  - Default: n/a
  - Description: Shuffle subdomains when operating behind misbehaving proxies.
- secure
  - Type: Boolean
  - Default: true
  - Description: Enables TLS when true.
- connectTimeout
  - Type: Int
  - Default: 5
  - Description: Max time to establish a connection (seconds).
- subscribeTimeout
  - Type: Int
  - Default: 310
  - Description: Subscribe request timeout (seconds).
- nonSubscribeRequestTimeout
  - Type: Int
  - Default: 10
  - Description: Non-subscribe request timeout (seconds).
- filterExpression
  - Type: String
  - Default: Not set
  - Description: Subscribe with a custom filter expression.
- heartbeatNotificationOptions
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Description: Heartbeat notification options. Other values: ALL, NONE.
- origin
  - Type: String
  - Default: n/a
  - Description: Custom origin. For custom domain request, see [request process](/docs/general/setup/data-security#request-process).
- retryConfiguration
  - Type: RetryConfiguration
  - Default: RetryConfiguration.Exponential (subscribe only)
  - Description: Reconnection policy. Choose None, Linear(delayInSec, maxRetryNumber, excludedOperations), or Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations). You can exclude [endpoint groups](https://github.com/pubnub/kotlin/blob/master/pubnub-kotlin/pubnub-kotlin-core-api/src/commonMain/kotlin/com/pubnub/api/retry/RetryableEndpointGroup.kt) (e.g., SUBSCRIBE). See [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).
- presenceTimeout
  - Type: Int
  - Default: 300
  - Description: Presence lifetime (seconds). Min 20. Client sends periodic heartbeats; if none arrive in time, a timeout presence event is emitted.
- heartbeatInterval
  - Type: Int
  - Default: 0
  - Description: Heartbeat frequency. Suggested ~ (presenceTimeout / 2) - 1. Min 3. 0 disables heartbeats.
- proxy
  - Type: Proxy
  - Default: n/a
  - Description: Use a Java proxy. See https://docs.oracle.com/javase/7/docs/api/java/net/Proxy.html
- proxySelector
  - Type: ProxySelector
  - Default: n/a
  - Description: Sets Java ProxySelector. See https://docs.oracle.com/javase/7/docs/api/java/net/ProxySelector.html
- proxyAuthenticator
  - Type: Authenticator
  - Default: n/a
  - Description: Sets Java Authenticator. See https://docs.oracle.com/javase/7/docs/api/java/net/Authenticator.html
- googleAppEngineNetworking
  - Type: Boolean
  - Default: n/a
  - Description: Enable Google App Engine networking.
- suppressLeaveEvents
  - Type: Boolean
  - Default: false
  - Description: When true, the SDK does not send leave requests.
- maintainPresenceState
  - Type: Boolean
  - Default: true
  - Description: Send custom presence state (set via [`pubnub.setPresenceState()`](/docs/sdks/java/api-reference/presence#set-state)) on each subscribe call.
- cryptoModule
  - Type: CryptoModule.createAesCbcCryptoModule(cipherKey, useRandomInitializationVector) or CryptoModule.createLegacyCryptoModule(cipherKey, useRandomInitializationVector)
  - Default: None
  - Description: Cryptography module for message/file encryption. See [cryptoModule](#cryptomodule).
- includesInstanceIdentifier
  - Type: Boolean
  - Default: false
  - Description: Include PubNubCore.instanceId with every request.
- includeRequestIdentifier
  - Type: Boolean
  - Default: true
  - Description: Include PubNubCore.requestId with every request.
- maximumConnections
  - Type: Int?
  - Default: n/a
  - Description: Max requests per host (okhttp3.Dispatcher.setMaxRequestsPerHost).
- certificatePinner
  - Type: CertificatePinner
  - Default: n/a
  - Description: Certificate pinning for HTTPS.
- sslSocketFactory
  - Type: SSLSocketFactory
  - Default: n/a
  - Description: Custom SSL socket factory.
- x509ExtendedTrustManager
  - Type: X509ExtendedTrustManager
  - Default: n/a
  - Description: Custom SSL trust manager.
- connectionSpec
  - Type: ConnectionSpec
  - Default: n/a
  - Description: TLS connection spec. See [ConnectionSpec](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-connection-spec/index.html).
- hostnameVerifier
  - Type: HostnameVerifier
  - Default: n/a
  - Description: Hostname verification.
- fileMessagePublishRetryLimit
  - Type: Int
  - Default: 5
  - Description: Max automatic retries for file message publish.
- dedupOnSubscribe
  - Type: Boolean
  - Default: n/a
  - Description: Enable message de-duplication on subscribe.
- maximumMessagesCacheSize
  - Type: Int
  - Default: n/a
  - Description: Max messages cache size.
- pnsdkSuffixes
  - Type: Map<String,String>
  - Default: n/a
  - Description: Add custom suffixes to SDK version info.
- managePresenceListManually
  - Type: Boolean
  - Default: n/a
  - Description: Enables explicit presence control; affects heartbeat/presence behavior.
- authKey
  - Type: String
  - Default: Not set
  - Description: Deprecated. See [Manage Access](/docs/general/security/access-control) and Java [Access Manager API](/docs/sdks/java/api-reference/access-manager). With Access Manager v2, the client uses this authKey on restricted requests.

#### cryptoModule

Encrypts/decrypts messages and files. Encryption is disabled by default. Options:
- Legacy 128‑bit encryption (backward compatible).
- Recommended 256‑bit AES‑CBC (must be explicitly configured).

See [Message Encryption](/docs/general/setup/data-security#message-encryption), [File Encryption](/docs/general/setup/data-security#file-encryption), and [Encryption](/docs/sdks/java/api-reference/encryption).

##### Legacy encryption with 128-bit cipher key entropy

No change required to keep using legacy encryption. To use 256‑bit AES‑CBC, explicitly configure it in PNConfiguration.

### Sample code

##### Required User ID

Always set a stable userId to identify the user/device. Persist it; you cannot connect without it.

```
1
  

```

### Value override

Override select configuration values per request with `PnConfigurationOverride.from()`.

```
1
  

```

Overridable options:
- subscribeKey
- publishKey
- secretKey
- retryConfiguration
- userId
- includeInstanceIdentifier
- includeRequestIdentifier
- cryptoModule
- connectTimeout
- nonSubscribeReadTimeout

## Initialization

Initialize the PubNub Client API before using any APIs.

### Method(s)

```
1
  

```

- pnConfiguration
  - Type: PNConfiguration
  - Description: See [Configuration](#configuration).

### Sample code

#### Initialize the PubNub client API

```
1
  

```

### Returns

A PubNub instance for APIs such as publish(), subscribe(), history(), hereNow().

### Other examples

#### Initialize a non-secure client

```
1
  

```

#### Initialization for a Read-Only client

Omit publishKey for read-only clients.

```
1
  

```

#### Initializing with SSL enabled

Set secure to true to enable TLS.

```
1
  

```

#### Initializing with Access Manager

Requires Access Manager add-on. Keep secretKey secure and never use it on insecure clients. Initializing with secretKey grants root permissions (server-side use only).

```
1
  

```

#### How to set proxy

```
1
  

```

## Event listeners

- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users metadata).
- Subscription: updates for a specific entity (channel, channel group, channel metadata, or user).
- SubscriptionsSet: updates for a list of subscriptions.

See [Publish & Subscribe > Event listeners](/docs/sdks/java/api-reference/publish-and-subscribe#event-listeners).

## UserId

Set/get user ID at runtime.

### Method(s)

Set userId:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.setUserId(String userId);  

```

- userId
  - Type: String
  - Default: n/a
  - Description: Required device/user identifier.

Get userId:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.getUserId();  

```

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

Requires Stream Controller add-on. Apply server-side filters to receive only messages that match the expression. See [Publish Messages](/docs/general/messages/publish).

### Method(s)

setFilterExpression()

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.setFilterExpression(String filterExpression);  

```

- filterExpression
  - Type: String
  - Description: PSV2 feature to subscribe with a custom filter expression.

getFilterExpression()

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.getFilterExpression();  

```

### Sample code

#### Set filter expression

```
1
  

```

#### Get filter expression

```
1
**
```
Last updated on Sep 15, 2025**