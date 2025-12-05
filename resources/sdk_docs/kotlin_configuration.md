# Configuration API for Kotlin SDK

##### Breaking changes in v9.0.0
- Unified Kotlin and Java SDKs, new client instantiation, updated async callbacks and status events. Apps built with < 9.0.0 may be impacted.
- See Java/Kotlin SDK migration guide for details.

##### Request execution
- Most methods return an Endpoint; you must call .sync() or .async() or the request won’t execute.

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

`PNConfiguration` holds client behavior and credentials. Immutable after passed to PubNub constructor. To change values per request, use value overrides.

##### Immutable configuration
- Once used to construct PubNub, properties can’t be changed. Use value overrides if you need dynamic values.

### Method(s)

```
1
  
```

To create a `pnConfiguration` instance you can use the following properties:

- subscribeKey
  - Type: String
  - Default: n/a
  - Description: subscribeKey from the Admin Portal.
- publishKey
  - Type: String
  - Default: n/a
  - Description: publishKey from the Admin Portal (only required if publishing).
- secretKey
  - Type: String
  - Default: n/a
  - Description: secretKey (only required for access operations, keep away from Android).
- userId
  - Type: UserId
  - Default: n/a
  - Description: Unique identifier for the user/device (UTF-8, up to 92 alphanumeric chars). Required to connect. Construct with UserId("...").
- customLoggers
  - Type: List<CustomLogger>
  - Default: n/a
  - Description: Custom logger implementations. See Logging.
- cacheBusting
  - Type: Boolean
  - Default: false
  - Description: Shuffle subdomains for misbehaving proxies.
- secure
  - Type: Boolean
  - Default: true
  - Description: Enable TLS when true.
- connectTimeout
  - Type: Int
  - Default: 5
  - Description: Connection establishment timeout (seconds).
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
  - Default: n/a
  - Description: Subscribe with a custom filter expression.
- heartbeatNotificationOptions
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Description: Heartbeat notifications: ALL, FAILURES (default), or NONE.
- origin
  - Type: String
  - Default: n/a
  - Description: Custom origin (contact support to request a custom domain).
- presenceTimeout
  - Type: Int
  - Default: 300
  - Description: Presence timeout (seconds). Min 20. Updates heartbeatInterval when set.
- heartbeatInterval
  - Type: Int
  - Default: 0
  - Description: Heartbeat frequency (seconds). Suggested ≈ (presenceTimeout / 2) - 1. Min 3. 0 disables.
- proxy
  - Type: Proxy
  - Default: n/a
  - Description: Use a proxy configuration (see Oracle docs).
- proxySelector
  - Type: ProxySelector
  - Default: n/a
  - Description: Sets Java ProxySelector.
- proxyAuthenticator
  - Type: Authenticator
  - Default: n/a
  - Description: Sets Java Authenticator.
- googleAppEngineNetworking
  - Type: Boolean
  - Default: n/a
  - Description: Enable Google App Engine networking.
- suppressLeaveEvents
  - Type: Boolean
  - Default: false
  - Description: Don’t send leave requests when true.
- retryConfiguration
  - Type: RetryConfiguration
  - Default: RetryConfiguration.Exponential (subscribe only)
  - Description: Custom reconnection policy. You can exclude endpoint groups from retry. Values:
    - RetryConfiguration.None
    - RetryConfiguration.Linear(delayInSec, maxRetryNumber, excludedOperations)
    - RetryConfiguration.Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations)
    - excludedOperations is a list of RetryableEndpointGroup enums (e.g., RetryableEndpointGroup.SUBSCRIBE).
- maintainPresenceState
  - Type: Boolean
  - Default: true
  - Description: Send custom presence state on each subscribe call (set via pubnub.setPresenceState()).
- cryptoModule
  - Type: CryptoModule.createAesCbcCryptoModule(cipherKey) or CryptoModule.createLegacyCryptoModule(cipherKey)
  - Default: None
  - Description: Select cryptography module for message/file encryption. Takes cipherKey. See cryptoModule section.
- includeInstanceIdentifier
  - Type: Boolean
  - Default: false
  - Description: Include PubNubCore.instanceId in requests.
- includeRequestIdentifier
  - Type: Boolean
  - Default: true
  - Description: Include PubNubCore.requestId in requests.
- maximumConnections
  - Type: Int?
  - Default: n/a
  - Description: Maximum inbound concurrent connections PubNub will handle.
- certificatePinner
  - Type: CertificatePinner
  - Default: n/a
  - Description: SSL certificate pinning (OkHttp CertificatePinner).
- sslSocketFactory
  - Type: SSLSocketFactory
  - Default: n/a
  - Description: Custom SSL socket factory.
- x509ExtendedTrustManager
  - Type: X509ExtendedTrustManager
  - Default: n/a
  - Description: Custom trust manager for X509 certificates.
- connectionSpec
  - Type: ConnectionSpec
  - Default: n/a
  - Description: Supported TLS versions/cipher suites (OkHttp ConnectionSpec).
- hostnameVerifier
  - Type: HostnameVerifier
  - Default: n/a
  - Description: Verifies hostname in SSL session.
- dedupOnSubscribe
  - Type: Boolean
  - Default: n/a
  - Description: Enable message deduplication on subscription.
- maximumMessagesCacheSize
  - Type: Int
  - Default: n/a
  - Description: Max size of message cache.
- pnsdkSuffixes
  - Type: Map<String, String>
  - Default: n/a
  - Description: Custom suffixes for SDK identification headers.
- managePresenceListManually
  - Type: Boolean
  - Default: n/a
  - Description: Enable explicit manual presence list management (use with server-side ACL).
- authKey
  - Type: String
  - Default: n/a
  - Description: Deprecated. See Manage Access and Kotlin Access Manager API. If Access Manager v2 is used, client will use this authKey in restricted requests.

#### cryptoModule
- Encrypts/decrypts messages and files. Encryption disabled by default. Options:
  - Legacy 128-bit encryption
  - Recommended 256-bit AES-CBC
- See Encryption reference for configuration and examples.

##### Legacy encryption with 128-bit cipher key entropy
- No change needed to keep legacy encryption.
- To use 256-bit AES-CBC, explicitly set the AES-CBC cryptoModule.

### Sample code

##### Required User ID
- Always set and persist UserId; it must remain stable for the user/device lifetime. Without it, you can’t connect.

```
1
  
```

### Value override

Override selected configuration values per request using overrideConfiguration.

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

Add PubNub via Getting Started. Initialize client with account-level credentials.

### Description
- Initialize PubNub Client API before use.

### Methods
Initialize PubNub with:

```
1
  
```

- builder
  - Type: PNConfiguration
  - Description: See configuration.

### Sample code

##### Required User ID
- Always set and persist userId; otherwise you can’t connect.

```
1
  
```

### Returns
- Returns a PubNub instance to call APIs such as publish(), subscribe(), history(), hereNow().

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
- Set secure to true.

```
1
  
```

#### Initializing with Access Manager

##### Requires Access Manager add-on
- Enable in Admin Portal.

##### Secure your secretKey
- secretKey grants/revokes permissions; never expose it. Use only on secure server-side platforms.
- Initializing with secretKey grants root permissions; servers get access to all channels and can administer permissions.

```
1
  
```

#### How to set proxy
```
1
  
```

## Event listeners

- PubNub client: updates from all subscriptions (channels, groups, channel metadata, user metadata).
- Subscription: updates only for its entity (channel, group, channel metadata, or user).
- SubscriptionsSet: updates for all listed subscriptions.

See Publish & Subscribe for details.

## UserId

Set/get userId on the fly.

### Method(s)

To set/get userId:

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
  - Description: Identifier for the device/user. Construct with UserId(String). Required to connect.

### Sample code

##### Required User ID
- Always set and persist userId; otherwise you can’t connect.

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
- Apply a server-side message filter so only matching messages are delivered. Set/get filter with the method below. See Publish Messages for filtering details.

### Method(s)
```
1
  
```

- filterExpression
  - Type: String
  - Description: PSV2 feature to subscribe with a custom filter expression.

### Sample code
```
1
**
```

Last updated on Nov 18, 2025**