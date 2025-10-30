# Configuration API for Kotlin SDK

##### Breaking changes in v9.0.0

- Kotlin and Java SDKs share a unified codebase.
- New client instantiation approach.
- Asynchronous API callbacks and emitted status events changed.
- Apps built with versions < 9.0.0 may be impacted.
- See Java/Kotlin SDK migration guide.

##### Request execution

Most method invocations return an Endpoint. You must call .sync() or .async() to execute.

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

PNConfiguration holds user-provided settings. Once passed to the PubNub constructor, it is immutable. To change values per request, use value overrides.

##### Immutable configuration
- Configuration is immutable after being passed to PubNub.
- To change per-call values, use value overrides.

### Method(s)

```
1
  
```

Use these PNConfiguration properties:

- subscribeKey
  - Type: String
  - Default: n/a
  - Required. From the Admin Portal.
- publishKey
  - Type: String
  - Default: n/a
  - From the Admin Portal (required if publishing).
- secretKey
  - Type: String
  - Default: n/a
  - Only for access operations; do not use on Android.
- userId
  - Type: UserId
  - Default: n/a
  - Required to connect. Pass a unique UTF-8 string (up to 92 alphanumeric chars) to UserId.
- customLoggers
  - Type: List<CustomLogger>
  - Default: n/a
  - Custom logger implementations.
- cacheBusting
  - Type: Boolean
  - Default: false
  - Shuffle subdomains for misbehaving proxies.
- secure
  - Type: Boolean
  - Default: true
  - Enable TLS when true.
- connectTimeout
  - Type: Int
  - Default: 5
  - Connection establishment timeout (seconds).
- subscribeTimeout
  - Type: Int
  - Default: 310
  - Subscribe request timeout (seconds).
- nonSubscribeRequestTimeout
  - Type: Int
  - Default: 10
  - Non-subscribe request timeout (seconds).
- filterExpression
  - Type: String
  - Default: n/a
  - Subscribe filter expression.
- heartbeatNotificationOptions
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Options: FAILURES, ALL, NONE.
- origin
  - Type: String
  - Default: n/a
  - Custom origin. For custom domains, follow the request process.
- presenceTimeout
  - Type: Int
  - Default: 300
  - Server presence timeout (seconds). Min 20. Updates heartbeatInterval.
- heartbeatInterval
  - Type: Int
  - Default: 0
  - Heartbeat interval (seconds). Min 3. Recommended ≈ (presenceTimeout / 2) - 1. 0 disables.
- proxy
  - Type: Proxy
  - Default: n/a
  - Use a proxy configuration.
- proxySelector
  - Type: ProxySelector
  - Default: n/a
  - Java ProxySelector.
- proxyAuthenticator
  - Type: Authenticator
  - Default: n/a
  - Java Authenticator.
- googleAppEngineNetworking
  - Type: Boolean
  - Default: n/a
  - Enable Google App Engine networking.
- suppressLeaveEvents
  - Type: Boolean
  - Default: false
  - Do not send leave requests when true.
- retryConfiguration
  - Type: RetryConfiguration
  - Default: RetryConfiguration.Exponential (subscribe only)
  - Custom reconnection policy. Can exclude endpoint groups from retry.
  - Values:
    - RetryConfiguration.None
    - RetryConfiguration.Linear(delayInSec, maxRetryNumber, excludedOperations)
    - RetryConfiguration.Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations)
  - excludedOperations: list of RetryableEndpointGroup enums (for example, SUBSCRIBE).
- maintainPresenceState
  - Type: Boolean
  - Default: true
  - Send presence state set via pubnub.setPresenceState() with each subscribe call.
- cryptoModule
  - Type: CryptoModule.createAesCbcCryptoModule(cipherKey) or CryptoModule.createLegacyCryptoModule(cipherKey)
  - Default: None
  - Encryption/decryption for messages and files. Provide cipherKey. See cryptoModule.
- includeInstanceIdentifier
  - Type: Boolean
  - Default: false
  - Include PubNubCore.instanceId with every request.
- includeRequestIdentifier
  - Type: Boolean
  - Default: true
  - Include PubNubCore.requestId with every request.
- maximumConnections
  - Type: Int?
  - Default: n/a
  - Maximum inbound concurrent connections PubNub handles.
- certificatePinner
  - Type: CertificatePinner
  - Default: n/a
  - SSL certificate pinning.
- sslSocketFactory
  - Type: SSLSocketFactory
  - Default: n/a
  - Custom SSLSocketFactory for HTTPS.
- x509ExtendedTrustManager
  - Type: X509ExtendedTrustManager
  - Default: n/a
  - Custom trust manager for X509 certificates.
- connectionSpec
  - Type: ConnectionSpec
  - Default: n/a
  - Supported TLS versions/cipher suites for HTTPS.
- hostnameVerifier
  - Type: HostnameVerifier
  - Default: n/a
  - Verifies hostnames in SSL sessions.
- fileMessagePublishRetryLimit
  - Type: Int
  - Default: 5
  - Auto-retry attempts for file message publish.
- dedupOnSubscribe
  - Type: Boolean
  - Default: n/a
  - Enable message deduplication on subscribe.
- maximumMessagesCacheSize
  - Type: Int
  - Default: n/a
  - Maximum messages cache size.
- pnsdkSuffixes
  - Type: Map<String, String>
  - Default: n/a
  - Custom suffixes for SDK identification headers.
- managePresenceListManually
  - Type: Boolean
  - Default: n/a
  - Manually manage presence list (useful with server-side ACL).
- authKey
  - Type: String
  - Default: n/a
  - Deprecated. For Access Manager v2, client uses this in restricted requests.

#### cryptoModule

- Used to encrypt/decrypt messages and files; encryption disabled by default.
- Options:
  - Legacy 128-bit encryption.
  - Recommended 256-bit AES-CBC; must be explicitly set.
- See Encryption reference for configuration and examples.

### Sample code

##### Reference code
Self-contained runnable snippet with imports and logging.

##### Required User ID
Always set a persistent UserId to uniquely identify the user or device. Without it, you cannot connect.

```
1
  
```

### Value override

Override specific configuration values per request using overrideConfiguration.

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

Initialize the PubNub client before using APIs to set account-level credentials (publishKey, subscribeKey).

### Description

Initialize the PubNub Client API.

### Methods

Initialize PubNub with:

```
1
  
```

- builder
  - Type: PNConfiguration

### Sample code

##### Required User ID
Always set a persistent userId. Without it, you cannot connect.

```
1
  
```

### Returns

PubNub instance to call APIs: publish(), subscribe(), history(), hereNow().

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

- Requires Access Manager add-on enabled for your keys.
- Keep secretKey secure; never expose on client platforms.
- Initializing with secretKey grants root permissions for Access Manager. Servers get all access on all channels.

```
1
  
```

Now the pubnub object can use Access Manager functions and will sign all Access Manager requests with secretKey.

#### How to set proxy

```
1
  
```

## Event listeners

- Client receives updates from all subscriptions: channels, channel groups, channel metadata, users metadata.
- Subscription: updates for its specific object.
- SubscriptionsSet: updates for all objects in the set.
- See Publish & Subscribe for details and handlers.

## UserId

Set/get a user ID on the fly.

### Method(s)

```
`1// Getting the userId  
2val userId = pubnub.configuration.userId.value  
`
```

```
1
  
```

- userId
  - Type: UserId
  - Default: n/a
  - Required to connect. Pass a String to UserId.

### Sample code

##### Required User ID
Always set a persistent userId. Without it, you cannot connect.

#### Set UserId

```
1
  
```

#### Get UserId

```
1
  
```

## Filter expression

##### Requires Stream Controller add-on

Apply a server-side filter to only receive messages matching a filter expression.

### Method(s)

```
1
  
```

- filterExpression
  - Type: String
  - Subscribe with a custom filter expression.

### Sample code

```
1
**
```