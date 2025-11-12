# Configuration API for Java SDK

##### Breaking changes in v9.0.0
- Unified Java and Kotlin SDKs, new PubNub client instantiation, and updated async callbacks and status events.
- Apps built with < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Java API reference for configuring and initializing the PubNub client.

## Configuration

`PNConfiguration` stores user-provided settings that control PubNub client behavior.

##### Immutable configuration
Once passed to the PubNub constructor, configuration is immutable. To change values per request, use value overrides.

### Method(s)

Create a configuration instance:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3PNConfiguration.builder(UserId userId, String subscribeKey).build()  
```

Parameters:
- subscribeKey
  - Type: String
  - Default: n/a
  - Description: Your subscribeKey from the Admin Portal.
- publishKey
  - Type: String
  - Default: n/a
  - Description: Your publishKey from the Admin Portal (required if publishing).
- secretKey
  - Type: String
  - Default: n/a
  - Description: Secret key (required for access operations; don’t use on Android).
- customLoggers
  - Type: List<CustomLogger>
  - Default: n/a
  - Description: Custom loggers. See Logging.
- cacheBusting
  - Type: Boolean
  - Default: n/a
  - Description: Shuffle subdomains when operating behind a misbehaving proxy.
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
  - Description: Server-side filter expression for subscribe.
- heartbeatNotificationOptions
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Description: Heartbeat notifications (ALL, FAILURES, NONE).
- origin
  - Type: String
  - Default: n/a
  - Description: Custom origin/domain. To request a custom domain, contact support.
- retryConfiguration
  - Type: RetryConfiguration
  - Default: RetryConfiguration.Exponential (subscribe only)
  - Description: Reconnection policy. Choose:
    - None
    - Linear(delayInSec, maxRetryNumber, excludedOperations)
    - Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations)
    You can exclude endpoint groups (e.g., SUBSCRIBE).
- presenceTimeout
  - Type: Int
  - Default: 300
  - Description: Presence timeout in seconds (min 20). If no heartbeat within this time, the client is marked inactive and “timeout” is emitted.
- heartbeatInterval
  - Type: Int
  - Default: 0
  - Description: Heartbeat interval (min 3). Set roughly to (presenceTimeout / 2) - 1. 0 = disabled.
- proxy
  - Type: Proxy
  - Default: n/a
  - Description: Use Java Proxy when communicating with PubNub.
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
- maintainPresenceState
  - Type: Boolean
  - Default: true
  - Description: Send custom presence state on each subscribe when set via pubnub.setPresenceState().
- cryptoModule
  - Type: CryptoModule.createAesCbcCryptoModule(cipherKey, useRandomInitializationVector) or CryptoModule.createLegacyCryptoModule(cipherKey, useRandomInitializationVector)
  - Default: None
  - Description: Module for message/file encryption and decryption.
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
  - Description: Max requests per host (okhttp Dispatcher.setMaxRequestsPerHost).
- certificatePinner
  - Type: CertificatePinner
  - Default: n/a
  - Description: Certificate pinning for HTTPS.
- sslSocketFactory
  - Type: SSLSocketFactory
  - Default: n/a
  - Description: SSL socket factory.
- x509ExtendedTrustManager
  - Type: X509ExtendedTrustManager
  - Default: n/a
  - Description: SSL trust manager.
- connectionSpec
  - Type: ConnectionSpec
  - Default: n/a
  - Description: TLS connection specifications.
- hostnameVerifier
  - Type: HostnameVerifier
  - Default: n/a
  - Description: Hostname verification manager.
- fileMessagePublishRetryLimit
  - Type: Int
  - Default: 5
  - Description: Auto-retry attempts for publishing file messages.
- dedupOnSubscribe
  - Type: Boolean
  - Default: n/a
  - Description: Enables de-duplication on subscribe.
- maximumMessagesCacheSize
  - Type: Int
  - Default: n/a
  - Description: Max size of messages cache.
- pnsdkSuffixes
  - Type: Map<String, String>
  - Default: n/a
  - Description: Add custom suffixes to SDK version info.
- managePresenceListManually
  - Type: Boolean
  - Default: n/a
  - Description: Enables explicit presence control; affects heartbeat/presence behavior.
- authKey
  - Type: String
  - Default: Not set
  - Description: Deprecated. See Manage Access and Java Access Manager API. If Access Manager v2 is used, this authKey is sent with restricted requests.

#### cryptoModule
- Encrypts/decrypts messages and files. Encryption is disabled by default.
- Options: Legacy 128-bit, Recommended 256-bit AES-CBC.
- To keep legacy, no change required. To use 256-bit AES-CBC, set explicitly in config.
- See Encryption docs for details.

### Sample code

##### Required User ID
Always set a stable userId for the lifetime of the user/device.

```
1
  
```

### Value override

Provide per-request overrides with PnConfigurationOverride.from().

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

Add PubNub via Getting Started, then initialize the client with account credentials.

### Method(s)

Initialize PubNub with:

```
1
  
```

- pnConfiguration
  - Type: PNConfiguration
  - Description: See Configuration.

### Sample code

#### Initialize the PubNub client API

```
1
  
```

### Returns
PubNub instance for APIs such as publish(), subscribe(), history(), hereNow().

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
Enable TLS by setting secure to true.

```
1
  
```

#### Initializing with Access Manager

Requires Access Manager add-on. Keep secretKey secure; only use it server-side. Initializing with secretKey gives root permissions for Access Manager and signs Access Manager messages.

```
1
  
```

#### How to set proxy

```
1
  
```

## Event listeners

- PubNub client: updates from all subscriptions.
- Subscription: updates for its specific entity (channel/channel group/metadata).
- SubscriptionsSet: updates across multiple subscription objects.

See Publish & Subscribe event listeners.

## UserId

Set/get a user ID at runtime.

### Method(s)

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.setUserId(String userId);  
```

- userId
  - Type: String
  - Default: n/a
  - Description: Device/user identifier required to connect.

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.getUserId();  
```

This method takes no arguments.

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

Requires Stream Controller add-on. Server-side filtering ensures only messages matching the filter reach subscribers. See Publish Messages for filter details.

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

This method takes no arguments.

### Sample code

#### Set filter expression

```
1
  
```

#### Get filter expression

```
1
**```**