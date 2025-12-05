# Configuration API for Swift Native SDK

Use this configuration object to define how a PubNub instance behaves.

## Initializer(s)

Create a configuration with your Publish and Subscribe Keys.

##### Privacy

MAU billing tracks users (Device and MAU) for analytics and billing. PubNub does not track customers using transactions with random UUIDs/UserIDs.

### Method(s)

```swift
PubNubConfiguration(
  publishKey: String?,
  subscribeKey: String,
  userId: String,
  cryptoModule: CryptoModule? = nil,
  authKey: String? = nil,
  authToken: String? = nil,
  useSecureConnections: Bool = true,
  origin: String = "ps.pndsn.com",
  useInstanceId: Bool = false,
  useRequestId: Bool = false,
  automaticRetry: AutomaticRetry? = .default,
  durationUntilTimeout: UInt = 300,
  heartbeatInterval: UInt = 0,
  supressLeaveEvents: Bool = false,
  requestMessageCountThreshold: UInt = 100,
  filterExpression: String? = nil,
  enableEventEngine: Bool = true,
  maintainPresenceState: Bool = true
)
```

Parameters:
- publishKey (String?, default: nil): Publish Key used for publishing.
- subscribeKey (String, required): Subscribe Key used for subscribing.
- userId (String, required): Unique UTF-8 identifier (≤92 alphanumeric). Required to connect.
- cryptoModule (CryptoModule?, default: nil): Encryption/decryption module (see cryptoModule).
- authKey (String?, default: nil): Used on all requests when Access Manager is enabled.
- authToken (String?, default: nil): Prefer over authKey when Access Manager is enabled.
- useSecureConnections (Bool, default: true): HTTPS if true, otherwise HTTP. Disable ATS for insecure traffic per Apple docs.
- origin (String, default: "ps.pndsn.com"): Domain for requests. For custom domains, see request process.
- useInstanceId (Bool, default: false): Include object instanceId on outgoing requests.
- useRequestId (Bool, default: false): Include request identifier on outgoing requests.
- automaticRetry (AutomaticRetry?, default: .default; subscribe uses exponential by default): Custom reconnection config (see automaticRetry).
- durationUntilTimeout (UInt, default: 300, min: 20): Presence timeout. Behaves like long polling; determines how long client is considered alive.
- heartbeatInterval (UInt, default: 0, min: 3 if set): Interval for explicit heartbeats. Recommended: (durationUntilTimeout / 2) - 1. 0 disables explicit heartbeats.
- supressLeaveEvents (Bool, default: false): Whether to send leave requests.
- requestMessageCountThreshold (UInt, default: 100): Emit RequestMessageCountExceeded when payload exceeds this count.
- filterExpression (String?, default: nil): PSV2 custom filter expression for subscribe.
- enableEventEngine (Bool, default: true): Use standardized subscribe/presence workflows and statuses.
- maintainPresenceState (Bool, default: true): When enableEventEngine is true, re-sends custom presence state on subscribe.
- cipherKey (Crypto?, deprecated): Set via cryptoModule instead. If set, all communication is encrypted with this key.
- uuid (String, deprecated): Use userId instead.

#### cryptoModule

Encrypts/decrypts messages and files. From 6.1.0, you can choose algorithms:
- Legacy 128-bit encryption
- Recommended 256-bit AES-CBC

If cryptoModule is not set and cipherKey is present, legacy encryption is used. See Encryption for configuration details.

Legacy 128-bit remains supported; explicitly set 256-bit AES-CBC to use the recommended encryption.

#### automaticRetry

Automatic request retry configuration:

- retryLimit (UInt): Max retries before failing.
- policy (ReconnectionPolicy): One of:
  - ReconnectionPolicy.linear(delay)
  - ReconnectionPolicy.exponential(minDelay, maxDelay) — default for subscribe
- retryableHTTPStatusCodes (Set<Int>): HTTP status codes to retry.
- retryableURLErrorCode (Set<URLError.Code>): URL error codes to retry.
- excluded ([AutomaticRetry.Endpoint]): Endpoints to exclude from retry.

See SDK connection lifecycle for details.

```
1
  

```

## Request configuration

Use PubNub.RequestConfiguration to customize one request without changing global settings.

- customSession (SessionReplaceable?, default: nil): Custom network session implementing SessionReplaceable for routing, task execution, and lifecycle control.
- customConfiguration (RouterConfiguration?, default: nil): Endpoint configuration for the request.
- responseQueue (DispatchQueue): Queue used to dispatch a response.

##### SessionReplaceable

Custom network session interface:

- sessionID (UUID): Unique session identifier.
- session (URLSessionReplaceable): Underlying URLSession for network tasks.
- sessionQueue (DispatchQueue): Queue for session operations.
- defaultRequestOperator (RequestOperator?, settable): Default operator attached to every request.
- sessionStream (SessionStream?, settable): Optional session stream for real-time communication.

##### RouterConfiguration

Base settings for PubNub endpoints (auth, security, encryption, request behavior):

- publishKey (String?): See publishKey in Initializers.
- subscribeKey (String): See subscribeKey in Initializers.
- uuid (String): Device identifier (equivalent to userId in Configuration).
- useSecureConnections (Bool): See useSecureConnections in Initializers.
- origin (String): See origin in Initializers (custom domain request process applies).
- authKey (String?): See authKey in Initializers.
- authToken (String?): See authToken in Initializers.
- cryptoModule (CryptoModule?): See cryptoModule.
- useRequestId (Bool): See useRequestId in Initializers.
- consumerIdentifiers ([String: String]): Key-value pairs for request tracking.
- enableEventEngine (Bool): See enableEventEngine in Initializers.
- maintainPresenceState (Bool): See maintainPresenceState in Initializers.
- urlScheme (String): Derived from useSecureConnections ("https" or "http").
- subscribeKeyExists (Bool): Whether subscribeKey is valid and not empty.
- publishKeyExists (Bool): Whether publishKey is valid and not empty.

##### DispatchQueue

Specifies which queue handles response callbacks.

- currentLabel() -> String: Returns the label of the current DispatchQueue or "Unknown Queue" if not set.

Official Apple Documentation: DispatchQueue

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set userId to uniquely identify the user or device. Persist it for the lifetime of the user/device. Without userId, you cannot connect.

##### Reference code

```
1
  

```

### Other examples

#### Initialization for a read-only client

If the client only reads and never publishes, set publishKey to nil.

##### Required User ID

Always set userId to uniquely identify the user or device. Persist it for the lifetime of the user/device. Without userId, you cannot connect.

```
1
  

```

## Event listeners

Sources for real-time updates:
- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for its target (channel, channel group, channel metadata, or user).
- SubscriptionsSet: updates for all objects represented by its subscriptions.

See Publish & Subscribe for details.

## Overriding PubNub configuration

You can change PubNubConfiguration properties until you set the configuration on a PubNub instance. After that, settings are locked. To change them, create a new PubNub instance.

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