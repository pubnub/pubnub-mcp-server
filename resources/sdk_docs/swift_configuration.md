# Configuration API for Swift Native SDK

Use this configuration object to define how a PubNub instance behaves.

## Initializer(s)

Create a configuration with your Publish and Subscribe Keys.

Privacy

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

Parameters

- publishKey
  - Type: String?
  - Default: nil
  - PubNub Publish Key used when publishing messages.
- subscribeKey
  - Type: String
  - Default: nil
  - PubNub Subscribe Key used when subscribing.
- userId
  - Type: String
  - Required
  - UTF-8 string up to 92 alphanumeric characters; required to connect.
- cryptoModule
  - Type: CryptoModule?
  - Default: nil
  - Module for message/file encryption/decryption. Pass cipherKey via cryptoModule. See cryptoModule section.
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
  - HTTPS if true; HTTP otherwise. Disable ATS to allow HTTP in iOS/macOS.
- origin
  - Type: String
  - Default: "ps.pndsn.com"
  - Domain for requests. For custom domains, contact support and follow the request process.
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
  - Custom reconnection behavior. See automaticRetry section.
- durationUntilTimeout
  - Type: UInt
  - Default: 300
  - Presence timeout window in seconds. Long-poll-like keepalive every 300s by default. Minimum 20s. Triggers timeout on presence channel when exceeded.
- heartbeatInterval
  - Type: UInt
  - Default: 0
  - Frequency of explicit heartbeat messages. Recommended: (durationUntilTimeout / 2) - 1. 0 disables explicit heartbeats. Do not set below 3 due to server constraints.
- suppressLeaveEvents
  - Type: Bool
  - Default: false
  - Whether to send leave requests.
- requestMessageCountThreshold
  - Type: UInt
  - Default: 100
  - Payload message count before emitting RequestMessageCountExceeded.
- filterExpression
  - Type: String?
  - Default: nil
  - PSV2 filter expression for subscriptions.
- enableEventEngine
  - Type: Bool
  - Default: true
  - Use standardized workflows for subscribe/presence and corresponding statuses.
- maintainPresenceState
  - Type: Bool
  - Default: true
  - Effective only when enableEventEngine is true. Sends custom presence state (set via pubnub.setPresence()) with subscribe calls.
- cipherKey
  - Type: Crypto?
  - Default: nil
  - Deprecated. Pass via cryptoModule instead. If set, encrypts all communication.
- uuid
  - Type: String
  - Required previously; deprecated. Use userId instead.

#### cryptoModule

Encrypts and decrypts messages and files. From 6.1.0, you can choose algorithms.

- Options: legacy 128-bit encryption and recommended 256-bit AES-CBC.
- If cryptoModule is not set and cipherKey is set in config, the client uses legacy encryption.
- For details and utilities, see Encryption.

Legacy encryption with 128-bit cipher key entropy

- Keep existing config to continue legacy encryption.
- To use 256-bit AES-CBC, explicitly set cryptoModule.

#### automaticRetry

automaticRetry lets the client retry requests automatically. Parameters:

- retryLimit
  - Type: UInt
  - Max retry attempts before failing.
- policy
  - Type: ReconnectionPolicy
  - Values:
    - ReconnectionPolicy.linear(delay)
    - ReconnectionPolicy.exponential(minDelay, maxDelay)
  - Default for subscribe connections: exponential.
- retryableHTTPStatusCodes
  - Type: Set<Int>
  - HTTP status codes eligible for retry.
- retryableURLErrorCode
  - Type: Set<URLError.Code>
  - URL error codes eligible for retry.
- excluded
  - Type: [AutomaticRetry.Endpoint]
  - Endpoints excluded from retry policy.

For more, see SDK connection lifecycle.

```
1
  

```

#### Request configuration

Use PubNub.RequestConfiguration to customize a single request without changing global settings.

- customSession
  - Type: SessionReplaceable?
  - Default: nil
  - Custom network session implementing SessionReplaceable for routing, task execution, and session lifecycle.
- customConfiguration
  - Type: RouterConfiguration?
  - Default: nil
  - Endpoint configuration used by the request.
- responseQueue
  - Type: DispatchQueue
  - Queue used to dispatch a response.

##### SessionReplaceable

Custom network session interface managing routing, tasks, and lifecycle.

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

Base settings for PubNub endpoints, including authentication, transport security, encryption, and request behavior.

- publishKey: String?
- subscribeKey: String
- uuid: String (equivalent to userId in Configuration)
- useSecureConnections: Bool
- origin: String (custom domain supported via request process)
- authKey: String?
- authToken: String?
- cryptoModule: CryptoModule?
- useRequestId: Bool
- consumerIdentifiers: [String: String] (key-value pairs for request tracking)
- enableEventEngine: Bool
- maintainPresenceState: Bool
- urlScheme: String ("https" or "http" derived from useSecureConnections)
- subscribeKeyExists: Bool (non-empty subscribeKey)
- publishKeyExists: Bool (non-empty publishKey)

##### DispatchQueue

Specifies which queue handles response callbacks.

- currentLabel
  - Type: String
  - Returns the label of the current DispatchQueue or "Unknown Queue" if unset.

Official Apple Documentation

For standard DispatchQueue properties and methods, see Apple's DispatchQueue documentation.

### Sample code

#### Initialize the PubNub client API

Required User ID

Always set userId to uniquely identify the user or device and persist it. Without userId, you cannot connect.

Reference code

```
1
  

```

### Other examples

#### Initialization for a read-only client

If the client only reads and never publishes, set publishKey to nil.

Required User ID

Always set userId and persist it. Without userId, you cannot connect.

```
1
  

```

## Event listeners

- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for the specific entity it was created for.
- SubscriptionsSet: updates across a list of subscription objects.

See Publish & Subscribe for details.

## Overriding PubNub configuration

You can change PubNubConfiguration properties until applied to a PubNub instance. After that, settings are locked; create a new PubNub instance to change them.

```
1
  

```

### Filter

Update the filter expression without creating a new instance:

```
1
**
```