# Configuration API for Swift Native SDK

Use this configuration object to define how a PubNub instance behaves.

## Initializer(s)

Create a configuration with your Publish and Subscribe Keys.

##### Privacy

MAU billing tracks users (Device and MAU) for analytics and billing. PubNub does not track customers using transactions with random UUIDs/UserIDs.

### Method(s)

To initialize PubNub, use:

```
`1PubNubConfiguration(  
2  publishKey: String?,  
3  subscribeKey: String,  
4  userId: String,  
5  cryptoModule: CryptoModule? = nil,  
6  authKey: String? = nil,  
7  authToken: String? = nil,  
8  useSecureConnections: Bool = true,  
9  origin: String = "ps.pndsn.com",  
10  useInstanceId: Bool = false,  
11  useRequestId: Bool = false,  
12  automaticRetry: AutomaticRetry? = .default,  
13  durationUntilTimeout: UInt = 300,  
14  heartbeatInterval: UInt = 0,  
15  supressLeaveEvents: Bool = false,  
16  requestMessageCountThreshold: UInt = 100,  
17  filterExpression: String? = nil,  
18  enableEventEngine: Bool = true,  
19  maintainPresenceState: Bool = true  
20)  
`
```

Parameters:
- publishKey
  - Type: String?
  - Default: nil
  - PubNub Publish Key used when publishing.
- subscribeKey
  - Type: String
  - Default: nil
  - PubNub Subscribe Key used when subscribing.
- userId
  - Type: String
  - UTF-8 string up to 92 alphanumeric characters. Required to connect; persist and keep stable per user/device.
- cryptoModule
  - Type: CryptoModule?
  - Default: nil
  - Cryptography module for messages/files; pass cipherKey via cryptoModule (see cryptoModule section).
- authKey
  - Type: String?
  - Default: nil
  - Used on all requests if Access Manager is enabled.
- authToken
  - Type: String?
  - Default: nil
  - Used instead of authKey on all requests if Access Manager is enabled.
- useSecureConnections
  - Type: Bool
  - Default: true
  - HTTPS if true; HTTP if false (disable ATS for insecure traffic per Apple docs).
- origin
  - Type: String
  - Default: "ps.pndsn.com"
  - Domain for requests. For custom domain, contact support and follow the request process.
- useInstanceId
  - Type: Bool
  - Default: false
  - Include PubNub object instanceId on requests.
- useRequestId
  - Type: Bool
  - Default: false
  - Include a request identifier on requests.
- automaticRetry
  - Type: AutomaticRetry?
  - Default: ReconnectionPolicy.exponential (subscribe only)
  - Custom reconnection parameters (see automaticRetry section).
- durationUntilTimeout
  - Type: Int
  - Default: 300
  - Presence server timeout in seconds; client is marked inactive if no heartbeat within this period. Minimum 20.
- heartbeatInterval
  - Type: UInt
  - Default: 0
  - Interval for explicit heartbeats. Recommended ≈ (durationUntilTimeout / 2) - 1. Do not set below 3. 0 means no explicit heartbeats.
- suppressLeaveEvents
  - Type: Bool
  - Default: false
  - Whether to send leave requests.
- requestMessageCountThreshold
  - Type: UInt
  - Default: 100
  - Number of messages in payload before emitting RequestMessageCountExceeded.
- filterExpression
  - Type: String?
  - Default: nil
  - PSV2 filter expression for subscribe.
- enableEventEngine
  - Type: Bool
  - Default: true
  - Use standardized workflows for subscribe/presence and related status events.
- maintainPresenceState
  - Type: Bool
  - Default: true
  - Effective only when enableEventEngine is true. Send custom presence state (set via pubnub.setPresence()) with each subscribe.
- cipherKey
  - Type: Crypto?
  - Default: nil
  - Deprecated. Pass via cryptoModule. If set, all communication is encrypted with this key.
- uuid
  - Type: String
  - Deprecated; use userId instead. Required to connect if used.

#### cryptoModule

Encrypts and decrypts messages and files. From 6.1.0, you can choose algorithms.

- Options: legacy 128-bit encryption, recommended 256-bit AES-CBC.
- If cryptoModule is not set and cipherKey is set in config, legacy encryption is used.
- See Encryption docs for configuration and utilities.

Legacy encryption with 128-bit cipher key entropy
- Keep using legacy encryption if desired; to use 256-bit AES-CBC, explicitly set it in config.

##### automaticRetry

Automatically retries requests. Parameters:
- retryLimit
  - Type: UInt
  - Max retry attempts before failing.
- policy
  - Type: ReconnectionPolicy
  - Values:
    - ReconnectionPolicy.linear(delay)
    - ReconnectionPolicy.exponential(minDelay, maxDelay)
  - Default for subscribe connections: ReconnectionPolicy.exponential.
- retryableHTTPStatusCodes
  - Type: Set<Int>
  - HTTP status codes eligible for retry.
- retryableURLErrorCode
  - Type: Set<URLError.Code>
  - URL error codes eligible for retry.
- excluded
  - Type: [AutomaticRetry.Endpoint]
  - Endpoints excluded from retry.

See SDK connection lifecycle for more.

```
1
  

```

#### Request configuration

Use PubNub.RequestConfiguration to customize a single request without changing global settings.

- customSession
  - Type: SessionReplaceable?
  - Default: nil
  - Custom network session implementing SessionReplaceable (routing, task execution, lifecycle).
- customConfiguration
  - Type: RouterConfiguration?
  - Default: nil
  - Endpoint configuration used by the request.
- responseQueue
  - Type: DispatchQueue
  - Queue used for dispatching the response.

##### SessionReplaceable

Custom network session interface (routing, task execution, lifecycle).

Properties:
- sessionID
  - Type: UUID
  - Unique identifier for the session object.
- session
  - Type: URLSessionReplaceable
  - Underlying URLSession used to execute network tasks.
- sessionQueue
  - Type: DispatchQueue
  - Queue used to execute session operations.
- defaultRequestOperator
  - Type: RequestOperator?
  - Default request operator attached to every request (settable).
- sessionStream
  - Type: SessionStream?
  - Optional session stream for real-time communication (settable).

##### RouterConfiguration

Base settings for PubNub endpoints (authentication, security, encryption, and HTTP behavior).

Properties:
- publishKey: String?
- subscribeKey: String
- uuid: String (equivalent to userId in Configuration)
- useSecureConnections: Bool
- origin: String (request custom domain via support)
- authKey: String?
- authToken: String?
- cryptoModule: CryptoModule?
- useRequestId: Bool
- consumerIdentifiers: [String: String] (key-value pairs for request tracking)
- enableEventEngine: Bool
- maintainPresenceState: Bool
- urlScheme: String ("https" or "http" from useSecureConnections)
- subscribeKeyExists: Bool
- publishKeyExists: Bool

##### DispatchQueue

Specifies which queue handles response callbacks.

Method:
- currentLabel
  - Type: String
  - Returns the label of the current DispatchQueue or "Unknown Queue" if none.

##### Official Apple Documentation

For standard DispatchQueue API, see Apple's DispatchQueue documentation.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set userId to uniquely identify the user/device; persist and keep unchanged. Without userId, you cannot connect.

##### Reference code

```
1
  

```

### Other examples

#### Initialization for a read-only client

If the client only reads and never publishes, set publishKey to nil.

##### Required User ID

Always set userId to uniquely identify the user/device; persist and keep unchanged. Without userId, you cannot connect.

```
1
  

```

## Event listeners

Real-time update sources:
- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for the specific object it was created for.
- SubscriptionsSet: updates for all objects represented by its subscriptions.

See Publish & Subscribe for details.

## Overriding PubNub configuration

You can change PubNubConfiguration properties until you set the configuration on a PubNub instance. After that, settings are locked; create a new PubNub instance to change them.

```
1
  

```

### Filter

Update the filter expression without creating a new instance:

```
1
**
```

Last updated on Sep 3, 2025**