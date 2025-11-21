# Configuration API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDK codebases, introduces a new client instantiation approach, and changes asynchronous callbacks and emitted status events. These changes can impact applications built with previous versions (< 9.0.0).

See Java/Kotlin SDK migration guide.

Java complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration

PNConfiguration stores user-provided information that controls PubNub client behavior. Once passed to the PubNub constructor, it’s immutable. To change values per-request, use value overrides.

##### Immutable configuration

Once a configuration object has been passed to the PubNub constructor, you can't change its properties.

If you require changing values dynamically consider using value overrides.

### Method(s)

To create configuration instance:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3PNConfiguration.builder(UserId userId, String subscribeKey).build()  
```

Configuration properties:

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
- customLoggers
  - Type: List<CustomLogger>
  - Default: n/a
  - Description: Your custom logger implementations. See Logging.
- cacheBusting
  - Type: Boolean
  - Default: n/a
  - Description: If operating behind a misbehaving proxy, allow the client to shuffle the subdomains.
- secure
  - Type: Boolean
  - Default: true
  - Description: When true TLS is enabled.
- connectTimeout
  - Type: Int
  - Default: 5
  - Description: Maximum time to establish a connection, in seconds.
- subscribeTimeout
  - Type: Int
  - Default: 310
  - Description: Subscribe request timeout, in seconds.
- nonSubscribeRequestTimeout
  - Type: Int
  - Default: 10
  - Description: Non-subscribe request timeout, in seconds.
- filterExpression
  - Type: String
  - Default: Not set
  - Description: Subscribe with a custom filter expression.
- heartbeatNotificationOptions
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Description: Heartbeat notification options. Other options: ALL, NONE.
- origin
  - Type: String
  - Default: n/a
  - Description: Custom origin if needed. To request a custom domain, contact support and follow the request process.
- retryConfiguration
  - Type: RetryConfiguration
  - Default: RetryConfiguration.Exponential (subscribe only)
  - Description: Reconnection policy. Choose None, Linear(delayInSec, maxRetryNumber, excludedOperations), or Exponential(minDelayInSec, maxDelayInSec, maxRetryNumber, excludedOperations). You can exclude endpoint groups (for example, SUBSCRIBE). See SDK connection lifecycle.
- presenceTimeout
  - Type: Int
  - Default: 300
  - Description: Presence TTL in seconds; minimum 20. Client sends periodic heartbeats. If no heartbeat arrives within the timeout, the client is marked inactive and a "timeout" event is emitted on the presence channel.
- heartbeatInterval
  - Type: Int
  - Default: 0
  - Description: How often the client sends heartbeats. To shorten presence timeout, set roughly to (presenceTimeout / 2) - 1. Minimum 3. Default 0 (disabled).
- proxy
  - Type: Proxy
  - Default: n/a
  - Description: Use a proxy configuration for PubNub server communication.
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
  - Description: When true the SDK doesn't send out the leave requests.
- maintainPresenceState
  - Type: Boolean
  - Default: true
  - Description: Whether custom presence state set via pubnub.setPresenceState() should be sent with each subscribe call.
- cryptoModule
  - Type: CryptoModule.createAesCbcCryptoModule(cipherKey, useRandomInitializationVector) / CryptoModule.createLegacyCryptoModule(cipherKey, useRandomInitializationVector)
  - Default: None
  - Description: Cryptography module for message and file encryption/decryption. See cryptoModule section.
- includesInstanceIdentifier
  - Type: Boolean
  - Default: false
  - Description: Whether to include a PubNubCore.instanceId with every request.
- includeRequestIdentifier
  - Type: Boolean
  - Default: true
  - Description: Whether to include a PubNubCore.requestId with every request.
- maximumConnections
  - Type: Int?
  - Default: n/a
  - Description: Sets max requests per host (okhttp3.Dispatcher.setMaxRequestsPerHost).
- certificatePinner
  - Type: CertificatePinner
  - Default: n/a
  - Description: Sets certificate pinner for HTTPS connections.
- sslSocketFactory
  - Type: SSLSocketFactory
  - Default: n/a
  - Description: Sets the SSL socket factory for creating SSL sockets.
- x509ExtendedTrustManager
  - Type: X509ExtendedTrustManager
  - Default: n/a
  - Description: Sets the SSL trust manager for managing SSL certificates.
- connectionSpec
  - Type: ConnectionSpec
  - Default: n/a
  - Description: Sets the specifications for making connections.
- hostnameVerifier
  - Type: HostnameVerifier
  - Default: n/a
  - Description: Manages the verification of hostnames.
- dedupOnSubscribe
  - Type: Boolean
  - Default: n/a
  - Description: Enables deduplication on subscribe.
- maximumMessagesCacheSize
  - Type: Int
  - Default: n/a
  - Description: Sets the maximum size of messages cache.
- pnsdkSuffixes
  - Type: Map<String,String>
  - Default: n/a
  - Description: Adds custom suffixes to the SDK version info.
- managePresenceListManually
  - Type: Boolean
  - Default: n/a
  - Description: Enables explicit presence control when true, affecting heartbeat and presence behavior.
- authKey
  - Type: String
  - Default: Not set
  - Description: Deprecated. See Manage Access and Java Access Manager API. If Access Manager v2 is utilized, the client will use this authKey in all restricted requests.

#### cryptoModule

cryptoModule encrypts and decrypts messages and files. From 6.3.6, you can configure the algorithms. By default, encryption is disabled.

Each SDK includes two options: legacy 128‑bit encryption and recommended 256‑bit AES‑CBC. See Message Encryption and File Encryption. For configuration details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy

You can keep using legacy encryption. To use recommended 256-bit AES-CBC, explicitly set it in PubNub config.

### Sample code

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging.

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged for the lifetime of the user or device. Without userId, you can't connect.

```
1
  
```

### Value override

Provide updated values for certain configuration options for a single request with PnConfigurationOverride.from().

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

Add PubNub to your project using one of the procedures under Getting Started.

### Description

Initialize the PubNub Client API before using any APIs. This sets credentials such as publishKey and subscribeKey.

### Method(s)

Initialize PubNub with:

```
1
  
```

- pnConfiguration
  - Type: PNConfiguration
  - Description: See Configuration for details.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

### Returns

Returns the PubNub instance to call APIs such as publish(), subscribe(), history(), and hereNow().

### Other examples

#### Initialize a non-secure client

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

#### Initialization for a Read-Only client

If a client only reads (never publishes), omit publishKey when initializing the client.

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

#### Initializing with SSL enabled

Enable TLS by setting secure to true.

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

#### Initializing with Access Manager

Requires Access Manager add-on enabled for your key in the Admin Portal.

Secure your secretKey: Never expose it in client apps. Use only on secure server-side platforms. Initializing with secretKey grants root permissions for Access Manager.

For applications that administer Access Manager permissions, initialize with secretKey:

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

Now the client can access Access Manager functions. The secretKey is used to sign all Access Manager messages.

#### How to set proxy

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

## Event listeners

- The PubNub client can receive updates from all subscriptions: channels, channel groups, channel metadata, users metadata.
- The Subscription object can receive updates only for its target object (channel, channel group, channel metadata, user).
- The SubscriptionsSet object can receive updates for all objects for which a list of subscription objects was created.

See Publish & Subscribe for details.

## UserId

Set/get a user ID on the fly.

### Method(s)

To set/get userId:

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.setUserId(String userId);  
```

- userId
  - Type: String
  - Default: n/a
  - Description: userId used as a device identifier. Without userId, you can't connect to PubNub.

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.getUserId();  
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

#### Get user ID

```
1
  
```

## Filter expression

Requires Stream Controller add-on enabled for your key.

Stream filtering allows a subscriber to receive only messages that satisfy the filter conditions. The filter is set by the subscriber and applied server-side.

To set or get message filters, use:

### Method(s)

setFilterExpression()

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.setFilterExpression(String filterExpression);  
```

- filterExpression
  - Type: String
  - Description: PSV2 feature to subscribe with a custom filter expression

getFilterExpression()

```
1import com.pubnub.api.java.v2.PNConfiguration;  
2
  
3pnConfiguration.getFilterExpression();  
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it and keep it unchanged. Without userId, you can't connect.

```
1
  
```

#### Get filter expression

```
1
**
```

Last updated on Nov 18, 2025**