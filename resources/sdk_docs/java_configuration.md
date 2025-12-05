# Configuration API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK 9.0.0 unifies Java and Kotlin SDKs, introduces a new client instantiation pattern, and changes async callbacks and status events. These changes impact apps built with versions < 9.0.0. See Java/Kotlin SDK migration guide.

## Configuration

`PNConfiguration` stores user-provided settings that control client behavior.

##### Immutable configuration
Once passed to the PubNub constructor, configuration properties can’t be changed. For per-request changes, use value overrides.

### Method(s)

To create a configuration:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
  
3PNConfiguration.builder(UserId userId, String subscribeKey).build()  
```

Parameters:
- subscribeKey  
  Type: String  
  Default: n/a  
  subscribeKey from the Admin Portal.
- publishKey  
  Type: String  
  Default: n/a  
  publishKey from the Admin Portal (required if publishing).
- secretKey  
  Type: String  
  Default: n/a  
  secretKey (only for access operations; keep off Android).
- customLoggers  
  Type: List<CustomLogger>  
  Default: n/a  
  Custom logger implementations. See Logging.
- cacheBusting  
  Type: Boolean  
  Default: n/a  
  Shuffle subdomains if behind a misbehaving proxy.
- secure  
  Type: Boolean  
  Default: true  
  Enable TLS when true.
- connectTimeout  
  Type: Int  
  Default: 5  
  Max connection establishment time (seconds).
- subscribeTimeout  
  Type: Int  
  Default: 310  
  Subscribe request timeout (seconds).
- nonSubscribeRequestTimeout  
  Type: Int  
  Default: 10  
  Non-subscribe request timeout (seconds).
- filterExpression  
  Type: String  
  Default: Not set  
  Subscribe with a custom filter expression.
- heartbeatNotificationOptions  
  Type: PNHeartbeatNotificationOptions  
  Default: PNHeartbeatNotificationOptions.FAILURES  
  Heartbeat alert behavior. Options: FAILURES, ALL, NONE.
- origin  
  Type: String  
  Default: n/a  
  Custom origin. For custom domain, contact support.
- retryConfiguration  
  Type: RetryConfiguration  
  Default: RetryConfiguration.Exponential (subscribe only)  
  Reconnection policy. Choose None, Linear(delayInSec, maxRetryNumber, excludedOperations), or Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations). You can exclude endpoint groups (e.g., SUBSCRIBE).
- presenceTimeout  
  Type: Int  
  Default: 300  
  Presence liveness timeout (seconds). Min 20.
- heartbeatInterval  
  Type: Int  
  Default: 0  
  Heartbeat interval (seconds). Set ~((presenceTimeout / 2) - 1). Min 3. Default 0 (disabled).
- proxy  
  Type: Proxy  
  Default: n/a  
  Use a proxy. See Java Proxy.
- proxySelector  
  Type: ProxySelector  
  Default: n/a  
  Sets Java ProxySelector.
- proxyAuthenticator  
  Type: Authenticator  
  Default: n/a  
  Sets Java Authenticator.
- googleAppEngineNetworking  
  Type: Boolean  
  Default: n/a  
  Enable GAE networking.
- suppressLeaveEvents  
  Type: Boolean  
  Default: false  
  Don’t send leave requests when true.
- maintainPresenceState  
  Type: Boolean  
  Default: true  
  Resend state from pubnub.setPresenceState() on each subscribe call.
- cryptoModule  
  Type: CryptoModule.createAesCbcCryptoModule(cipherKey, useRandomInitializationVector) or CryptoModule.createLegacyCryptoModule(cipherKey, useRandomInitializationVector)  
  Default: None  
  Cryptography module for message/file encryption and decryption. See cryptoModule section.
- includesInstanceIdentifier  
  Type: Boolean  
  Default: false  
  Include PubNubCore.instanceId with every request.
- includeRequestIdentifier  
  Type: Boolean  
  Default: true  
  Include PubNubCore.requestId with every request.
- maximumConnections  
  Type: Int?  
  Default: n/a  
  Max requests per host (okhttp3.Dispatcher.setMaxRequestsPerHost).
- certificatePinner  
  Type: CertificatePinner  
  Default: n/a  
  HTTPS certificate pinning.
- sslSocketFactory  
  Type: SSLSocketFactory  
  Default: n/a  
  SSL socket factory.
- x509ExtendedTrustManager  
  Type: X509ExtendedTrustManager  
  Default: n/a  
  SSL trust manager.
- connectionSpec  
  Type: ConnectionSpec  
  Default: n/a  
  TLS connection specification.
- hostnameVerifier  
  Type: HostnameVerifier  
  Default: n/a  
  Hostname verification.
- dedupOnSubscribe  
  Type: Boolean  
  Default: n/a  
  Enable subscribe de-duplication.
- maximumMessagesCacheSize  
  Type: Int  
  Default: n/a  
  Max message cache size.
- pnsdkSuffixes  
  Type: Map<String,String>  
  Default: n/a  
  Add custom suffixes to SDK version info.
- managePresenceListManually  
  Type: Boolean  
  Default: n/a  
  Manual presence control; affects heartbeat/presence behavior.
- authKey  
  Type: String  
  Default: Not set  
  Deprecated. See Manage Access and Access Manager API. If Access Manager v2 is used, client sends this authKey on restricted requests.

#### cryptoModule
Encrypts/decrypts messages/files. Encryption is disabled by default. Two options available: legacy 128-bit and recommended 256-bit AES-CBC. See Encryption reference for configuration, utilities, and examples.

Legacy 128-bit remains supported; set 256-bit AES-CBC explicitly to use it.

### Sample code

##### Required User ID
Always set a stable userId per user/device; it must persist for the user/device lifetime. Without userId, you can’t connect.

```
1
  

```

### Value override

Provide per-request config overrides via `PnConfigurationOverride.from()`:

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

Add PubNub per Getting Started.

### Description
Initialize the PubNub client with account credentials like publishKey and subscribeKey.

### Method(s)

Initialize PubNub with:

```
1
  

```

- pnConfiguration  
  Type: PNConfiguration  
  See Configuration.

### Sample code

#### Initialize the PubNub client API

##### Required User ID
Always set userId (see above).

```
1
  

```

### Returns
Returns a PubNub instance to call APIs like publish(), subscribe(), history(), hereNow().

### Other examples

#### Initialize a non-secure client

##### Required User ID
Always set userId.

```
1
  

```

#### Initialization for a Read-Only client
Omit publishKey for read-only usage.

##### Required User ID
Always set userId.

```
1
  

```

#### Initializing with SSL enabled
Enable TLS with setSecure(true).

##### Required User ID
Always set userId.

```
1
  

```

#### Initializing with Access Manager

Requires Access Manager add-on enabled. Keep secretKey secure; use only on trusted server-side. Initializing with secretKey yields root Access Manager permissions.

##### Required User ID
Always set userId.

```
1
  

```

#### How to set proxy

##### Required User ID
Always set userId.

```
1
  

```

## Event listeners

- PubNub client: updates from all subscriptions (channels, groups, channel metadata, user metadata).
- Subscription: updates for its specific entity.
- SubscriptionsSet: updates for its set of subscriptions.

See Publish & Subscribe event listeners.

## UserId

Set/get user ID dynamically.

### Method(s)

```
1import com.pubnub.api.java.v2.PNConfiguration;  
  
3pnConfiguration.setUserId(String userId);  
```

- userId  
  Type: String  
  Default: n/a  
  Device/user identifier. Required to connect.

```
1import com.pubnub.api.java.v2.PNConfiguration;  
  
3pnConfiguration.getUserId();  
```

No arguments.

### Sample code

#### Set user ID

##### Required User ID
Always set userId.

```
1
  

```

#### Get user ID

```
1
  
```

## Filter expression

Requires Stream Controller add-on. Server-side filtering delivers only messages matching the expression.

To set/get filter expressions:

### Method(s)

setFilterExpression()

```
1import com.pubnub.api.java.v2.PNConfiguration;  
  
3pnConfiguration.setFilterExpression(String filterExpression);  
```

- filterExpression  
  Type: String  
  PSV2 feature to subscribe with a custom filter expression.

getFilterExpression()

```
1import com.pubnub.api.java.v2.PNConfiguration;  
  
3pnConfiguration.getFilterExpression();  
```

No arguments.

### Sample code

#### Set filter expression

##### Required User ID
Always set userId.

```
1
  

```

#### Get filter expression

```
1
**
```