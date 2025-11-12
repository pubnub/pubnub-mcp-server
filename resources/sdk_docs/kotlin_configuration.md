# Configuration API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies the Kotlin and [Java](/docs/sdks/java) SDKs, changes client instantiation, and updates async callbacks and [status events](/docs/sdks/kotlin/status-events). Apps built with versions < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

##### Request execution

Most method invocations return an Endpoint object. You must call `.sync()` or `.async()` or the operation will not run.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## Configuration

`PNConfiguration` stores all client configuration. Once passed to the PubNub constructor, it’s immutable. For per-request changes, use [value overrides](#value-override).

##### Immutable configuration

Configuration properties cannot be changed after the client is constructed.

### Method(s)

```
1
  
```

To create a `pnConfiguration` instance you can use the following properties in the Kotlin SDK:

- subscribeKey  
  Type: String | Default: n/a  
  Your `subscribeKey` from the Admin Portal. Required.

- publishKey  
  Type: String | Default: n/a  
  Your `publishKey` from the Admin Portal (required if publishing).

- secretKey  
  Type: String | Default: n/a  
  Your `secretKey` (only required for access operations; don’t include in Android apps).

- userId  
  Type: UserId | Default: n/a  
  Unique identifier for the user/device (UTF-8 String up to 92 alphanumeric chars). Required to connect. Construct with `UserId(String)`.

- customLoggers  
  Type: List<CustomLogger> | Default: n/a  
  Custom logger implementations. See [Logging](/docs/sdks/kotlin/logging).

- cacheBusting  
  Type: Boolean | Default: false  
  Shuffle subdomains to work around misbehaving proxies.

- secure  
  Type: Boolean | Default: true  
  Enables TLS when true.

- connectTimeout  
  Type: Int | Default: 5  
  Connection establishment timeout (seconds).

- subscribeTimeout  
  Type: Int | Default: 310  
  Subscribe request timeout (seconds).

- nonSubscribeRequestTimeout  
  Type: Int | Default: 10  
  Non-subscribe request timeout (seconds).

- filterExpression  
  Type: String | Default: n/a  
  Subscribe with a custom filter expression.

- heartbeatNotificationOptions  
  Type: PNHeartbeatNotificationOptions | Default: PNHeartbeatNotificationOptions.FAILURES  
  Options: `ALL`, `FAILURES`, `NONE`.

- origin  
  Type: String | Default: n/a  
  Custom origin. To request a custom domain, see the [request process](/docs/general/setup/data-security#request-process).

- presenceTimeout  
  Type: Int | Default: 300  
  Presence timeout (seconds). Minimum 20. Updates heartbeatInterval when set. Client sends periodic heartbeats; if none arrive within the timeout, the client is marked inactive and a "timeout" event is emitted on the [presence channel](/docs/general/presence/overview).

- heartbeatInterval  
  Type: Int | Default: 0  
  Heartbeat interval (seconds). Recommended ≈ `(presenceTimeout / 2) - 1`. Minimum 3. Default 0 (disabled).

- proxy  
  Type: Proxy | Default: n/a  
  Use a proxy configuration. See [Oracle documentation](https://docs.oracle.com/javase/7/docs/api/java/net/Proxy.html).

- proxySelector  
  Type: ProxySelector | Default: n/a  
  Sets Java ProxySelector. See [Oracle documentation](https://docs.oracle.com/javase/7/docs/api/java/net/ProxySelector.html).

- proxyAuthenticator  
  Type: Authenticator | Default: n/a  
  Sets Java Authenticator. See [Oracle documentation](https://docs.oracle.com/javase/7/docs/api/java/net/Authenticator.html).

- googleAppEngineNetworking  
  Type: Boolean | Default: n/a  
  Enable Google App Engine networking.

- suppressLeaveEvents  
  Type: Boolean | Default: false  
  Do not send `leave` requests when true.

- retryConfiguration  
  Type: RetryConfiguration | Default: RetryConfiguration.Exponential (subscribe only)  
  Custom reconnection parameters. You can exclude [endpoint groups](https://github.com/pubnub/kotlin/blob/master/pubnub-kotlin/pubnub-kotlin-core-api/src/commonMain/kotlin/com/pubnub/api/retry/RetryableEndpointGroup.kt) from retry policy.  
  Available values:
  - `RetryConfiguration.None`
  - `RetryConfiguration.Linear(delayInSec, maxRetryNumber, excludedOperations)`
  - `RetryConfiguration.Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations)`  
  `excludedOperations` is a list of `RetryableEndpointGroup` enums (for example, `RetryableEndpointGroup.SUBSCRIBE`). See [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

- maintainPresenceState  
  Type: Boolean | Default: true  
  Resend presence state set with [`pubnub.setPresenceState()`](/docs/sdks/kotlin/api-reference/presence#set-state) on each subscribe.

- cryptoModule  
  Type: `CryptoModule.createAesCbcCryptoModule(cipherKey)` or `CryptoModule.createLegacyCryptoModule(cipherKey)` | Default: None  
  Cryptography module for message/file encryption and decryption. Takes `cipherKey`. See [cryptoModule](#cryptomodule).

- includeInstanceIdentifier  
  Type: Boolean | Default: false  
  Include `PubNubCore.instanceId` on each request.

- includeRequestIdentifier  
  Type: Boolean | Default: true  
  Include `PubNubCore.requestId` on each request.

- maximumConnections  
  Type: Int? | Default: n/a  
  Maximum number of inbound concurrent connections PubNub will handle.

- certificatePinner  
  Type: CertificatePinner | Default: n/a  
  SSL certificate pinning. See [OkHttp CertificatePinner](https://square.github.io/okhttp/3.x/okhttp/okhttp3/CertificatePinner.html).

- sslSocketFactory  
  Type: SSLSocketFactory | Default: n/a  
  Custom SSLSocketFactory for HTTPS.

- x509ExtendedTrustManager  
  Type: X509ExtendedTrustManager | Default: n/a  
  Custom trust manager for X509 certificates.

- connectionSpec  
  Type: ConnectionSpec | Default: n/a  
  Supported TLS versions and cipher suites. See [ConnectionSpec](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-connection-spec/index.html).

- hostnameVerifier  
  Type: HostnameVerifier | Default: n/a  
  Custom hostname verifier.

- fileMessagePublishRetryLimit  
  Type: Int | Default: 5  
  Max automatic retries for file message publish.

- dedupOnSubscribe  
  Type: Boolean | Default: n/a  
  Enable/disable message de-duplication on subscription.

- maximumMessagesCacheSize  
  Type: Int | Default: n/a  
  Max size of the messages cache.

- pnsdkSuffixes  
  Type: Map<String, String> | Default: n/a  
  Custom suffixes for SDK identification headers.

- managePresenceListManually  
  Type: Boolean | Default: n/a  
  Enable manual management of presence list (used with server-side ACL).

- authKey  
  Type: String | Default: n/a  
  Deprecated. See [Manage Access](/docs/general/security/access-control) and Kotlin [Access Manager API](/docs/sdks/kotlin/api-reference/access-manager). If Access Manager v2 is used, client sends this `authKey` on restricted requests.

#### `cryptoModule`

Encrypts/decrypts messages and files. From 7.6.0, algorithms are configurable; encryption is disabled by default. Options: legacy 128‑bit, or recommended 256‑bit AES‑CBC. See [Message Encryption](/docs/general/setup/data-security#message-encryption), [File Encryption](/docs/general/setup/data-security#file-encryption), and [Encryption](/docs/sdks/kotlin/api-reference/encryption).

##### Legacy encryption with 128-bit cipher key entropy

Legacy encryption continues to work unchanged. To use 256-bit AES-CBC, set it explicitly in configuration.

### Sample code

##### Reference code

```
1
  
```

##### Required User ID

Always set and persist a `UserId` to uniquely identify the user/device. If not set, you can’t connect.

```
1
  
```

### Value override

Override selected configuration options per request using `overrideConfiguration`.

```
1
  
```

You can override:
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

Initialize before using APIs; set credentials like `publishKey` and `subscribeKey`. Add PubNub via [Getting Started](/docs/sdks/kotlin).

### Description

Create and configure the PubNub client.

### Methods

Initialize PubNub with:

```
1
  
```

- builder  
  Type: PNConfiguration  
  See [configuration](#configuration).

### Sample code

##### Required User ID

```
1
  
```

### Returns

A PubNub instance to call APIs such as `publish()`, `subscribe()`, `history()`, and `hereNow()`.

### Other examples

#### Initialize a non-secure client

```
1
  
```

#### Initialization for a Read-Only client

```
1
  
```

#### Initializing with SSL enabled

```
1
  
```

#### Initializing with Access Manager

Requires that the Access Manager add-on is enabled. Keep `secretKey` secure and server-side only.

```
1
  
```

#### How to set proxy

```
1
  
```

## Event listeners

- The PubNub client receives updates for all subscriptions (channels, groups, channel metadata, user metadata).
- A [`Subscription`](/docs/sdks/kotlin/api-reference/publish-and-subscribe#create-a-subscription) receives updates only for its target.
- A [`SubscriptionsSet`](/docs/sdks/kotlin/api-reference/publish-and-subscribe#create-a-subscription-set) receives updates for its list of subscriptions.

See [Publish & Subscribe](/docs/sdks/kotlin/api-reference/publish-and-subscribe#event-listeners).

## UserId

Set/get a user ID at runtime.

### Method(s)

To set/get `userId`:

```
`1// Getting the userId  
2val userId = pubnub.configuration.userId.value  
`
```

```
1
  
```

- userId  
  Type: UserId | Default: n/a  
  The `UserId` to use (wrap a String). Required to connect.

### Sample code

##### Required User ID

#### Set UserId

```
1
  
```

#### Get UserId

```
1
  
```

## Filter expression

Requires Stream Controller add-on. Server-side filtering allows receiving only messages that match the filter. See [Publish Messages](/docs/general/messages/publish).

### Method(s)

```
1
  
```

- filterExpression  
  Type: String  
  PSV2 feature to `subscribe` with a custom filter expression.

### Sample code

```
1
**
```