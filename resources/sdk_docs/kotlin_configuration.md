# Configuration API for Kotlin SDK

##### Breaking changes in v9.0.0

- Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async API callbacks, and emitted status events. Apps built with versions < 9.0.0 may be impacted.
- See Java/Kotlin SDK migration guide for details.

##### Request execution

Most method invocations return an Endpoint you must execute with .sync() or .async(), or the operation won’t run.

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

`PNConfiguration` holds user-provided information controlling PubNub client behavior.

##### Immutable configuration

Once passed to the PubNub constructor, configuration is immutable. For per-request changes, use value overrides.

### Method(s)

```
1
  

```

Required: set a unique `userId` (UTF-8, up to 92 alphanumeric characters) or the client can’t connect.

Configuration properties:

- `subscribeKey`  
  - Type: String | Default: n/a  
  - From Admin Portal.

- `publishKey`  
  - Type: String | Default: n/a  
  - From Admin Portal (required to publish).

- `secretKey`  
  - Type: String | Default: n/a  
  - Required for access operations; do not use on Android.

- `userId`  
  - Type: UserId | Default: n/a  
  - Required unique identifier for the user/device. Construct with a String.

- `customLoggers`  
  - Type: List<CustomLogger> | Default: n/a  
  - Custom logger implementations. See Logging.

- `cacheBusting`  
  - Type: Boolean | Default: false  
  - Shuffle subdomains when behind a misbehaving proxy.

- `secure`  
  - Type: Boolean | Default: true  
  - Enable TLS when true.

- `connectTimeout`  
  - Type: Int | Default: 5 seconds  
  - Max time to establish a connection.

- `subscribeTimeout`  
  - Type: Int | Default: 310 seconds  
  - Subscribe request timeout.

- `nonSubscribeRequestTimeout`  
  - Type: Int | Default: 10 seconds  
  - Non-subscribe request timeout.

- `filterExpression`  
  - Type: String | Default: n/a  
  - PSV2 subscribe filter expression.

- `heartbeatNotificationOptions`  
  - Type: PNHeartbeatNotificationOptions | Default: PNHeartbeatNotificationOptions.FAILURES  
  - Options: FAILURES, ALL, NONE.

- `origin`  
  - Type: String | Default: n/a  
  - Custom origin. For custom domain, contact support.

- `presenceTimeout`  
  - Type: Int | Default: 300 seconds (min 20)  
  - Server considers client alive for this period; updates `heartbeatInterval` when set.

- `heartbeatInterval`  
  - Type: Int | Default: 0 (disabled), min 3  
  - Suggested: `(presenceTimeout / 2) - 1`.

- `proxy`  
  - Type: Proxy | Default: n/a  
  - Use a proxy when communicating with PubNub.

- `proxySelector`  
  - Type: ProxySelector | Default: n/a

- `proxyAuthenticator`  
  - Type: Authenticator | Default: n/a

- `googleAppEngineNetworking`  
  - Type: Boolean | Default: n/a  
  - Enable GAE networking.

- `suppressLeaveEvents`  
  - Type: Boolean | Default: false  
  - Do not send leave requests when true.

- `retryConfiguration`  
  - Type: RetryConfiguration | Default: RetryConfiguration.Exponential (subscribe only)  
  - Configure reconnection behavior. Can exclude one or more endpoint groups from retry policy.  
  - Values:  
    - `RetryConfiguration.None`  
    - `RetryConfiguration.Linear(delayInSec, maxRetryNumber, excludedOperations)`  
    - `RetryConfiguration.Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations)`  
  - `excludedOperations` is a list of `RetryableEndpointGroup` enums (e.g., `RetryableEndpointGroup.SUBSCRIBE`).

- `maintainPresenceState`  
  - Type: Boolean | Default: true  
  - Resend custom presence state set via `pubnub.setPresenceState()` on each subscribe.

- `cryptoModule`  
  - Type: `CryptoModule.createAesCbcCryptoModule(cipherKey)` or `CryptoModule.createLegacyCryptoModule(cipherKey)` | Default: None  
  - Controls encryption/decryption of messages and files. Takes `cipherKey`. See cryptoModule section.

- `includeInstanceIdentifier`  
  - Type: Boolean | Default: false  
  - Include `PubNubCore.instanceId` in every request.

- `includeRequestIdentifier`  
  - Type: Boolean | Default: true  
  - Include `PubNubCore.requestId` in every request.

- `maximumConnections`  
  - Type: Int? | Default: n/a  
  - Maximum inbound concurrent connections PubNub will handle.

- `certificatePinner`  
  - Type: CertificatePinner | Default: n/a  
  - Manage SSL certs for HTTPS.

- `sslSocketFactory`  
  - Type: SSLSocketFactory | Default: n/a

- `x509ExtendedTrustManager`  
  - Type: X509ExtendedTrustManager | Default: n/a

- `connectionSpec`  
  - Type: ConnectionSpec | Default: n/a  
  - Supported TLS versions and cipher suites.

- `hostnameVerifier`  
  - Type: HostnameVerifier | Default: n/a

- `dedupOnSubscribe`  
  - Type: Boolean | Default: n/a  
  - Enable message deduplication on subscription.

- `maximumMessagesCacheSize`  
  - Type: Int | Default: n/a  
  - Max messages cache size.

- `pnsdkSuffixes`  
  - Type: Map<String, String> | Default: n/a  
  - Custom SDK identification header suffixes.

- `managePresenceListManually`  
  - Type: Boolean | Default: n/a  
  - Enable manual presence list management (used with server-side ACL).

- `authKey`  
  - Type: String | Default: n/a  
  - Deprecated. See Manage Access and Kotlin Access Manager API. If Access Manager v2 is used, client will use this `authKey` in restricted requests.

#### `cryptoModule`

- Encrypts/decrypts messages and files. Encryption disabled by default. Configurable since 7.6.0.
- Options:
  - Legacy 128‑bit encryption (`CryptoModule.createLegacyCryptoModule(cipherKey)`).
  - Recommended 256‑bit AES‑CBC (`CryptoModule.createAesCbcCryptoModule(cipherKey)`).
- You can keep legacy encryption; set AES‑CBC explicitly to switch.

### Sample code

##### Reference code

Self-contained runnable snippet with imports and console logging.

##### Required User ID

Always set and persist a unique `UserId` for the device/user; otherwise, connection to PubNub will fail.

```
1
  

```

### Value override

Override select configuration values per request using `overrideConfiguration`.

```
1
  

```

Overridable options:
- `subscribeKey`
- `publishKey`
- `secretKey`
- `retryConfiguration`
- `userId`
- `includeInstanceIdentifier`
- `includeRequestIdentifier`
- `cryptoModule`
- `connectTimeout`
- `nonSubscribeReadTimeout`

## Initialization

Add PubNub to your project (see Getting Started).

### Description

Initialize the client with account-level credentials, such as `publishKey` and `subscribeKey`.

### Methods

Initialize PubNub with:

```
1
  

```

- `builder`  
  - Type: PNConfiguration  
  - See configuration section.

### Sample code

##### Required User ID

Always set and persist a unique `userId`; otherwise, connection will fail.

```
1
  

```

### Returns

A PubNub instance for APIs such as `publish()`, `subscribe()`, `history()`, `hereNow()`.

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

- Requires Access Manager add-on enabled.
- Keep `secretKey` secure. Use only on server-side platforms. With `secretKey`, you get root Access Manager permissions; it signs all Access Manager messages.

```
1
  

```

Now `pubnub` can use Access Manager functions using `secretKey`.

#### How to set proxy

```
1
  

```

## Event listeners

- PubNub client: updates from all subscriptions.
- `Subscription`: updates for its specific channel/group/metadata/user.
- `SubscriptionsSet`: updates for all objects in the set.  
See Publish & Subscribe for details.

## UserId

Set/get `userId` on the fly.

### Method(s)

```
`1// Getting the userId  
2val userId = pubnub.configuration.userId.value  
`
```

```
1
  

```

- `userId`  
  - Type: UserId | Default: n/a  
  - Device/user identifier. Construct with a String. Required to connect.

### Sample code

##### Required User ID

Always set and persist a unique `userId`.

#### Set UserId

```
1
  

```

#### Get UserId

```
1
  

```

## Filter expression

- Requires Stream Controller add-on.  
- Server-side filtering prevents unwanted messages reaching the client. Set/get filters on the client; applied on server. See Publish Messages for filter info.

### Method(s)

```
1
  

```

- `filterExpression`  
  - Type: String  
  - PSV2 custom filter expression for `subscribe`.

### Sample code

```
1
**
```

Last updated on Nov 18, 2025**