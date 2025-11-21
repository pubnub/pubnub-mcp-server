# Configuration API for Swift Native SDK

Use this configuration object to define how a PubNub instance behaves.

## Initializer(s)

Create a configuration with your Publish and Subscribe Keys.

##### Privacy

- MAU billing tracks users (Device and MAU) for analytics and billing.
- PubNub does not track customers using transactions with random UUIDs/UserIDs.

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

Parameters (Type | Default | Description):
- publishKey: String? | nil | Publish Key used to publish messages.
- subscribeKey: String | n/a | Subscribe Key used to subscribe.
- userId: String | n/a | Required unique UTF-8 ID (≤92 alphanumeric chars) for the user/device. Required to connect.
- cryptoModule: CryptoModule? | nil | Module to encrypt/decrypt messages and files. Prefer passing cipherKey via cryptoModule.
- authKey: String? | nil | If Access Manager is enabled, used on all requests.
- authToken: String? | nil | If Access Manager is enabled, used instead of authKey on all requests.
- useSecureConnections: Bool | true | HTTPS if true; HTTP if false. To use HTTP, disable ATS as per Apple docs.
- origin: String | "ps.pndsn.com" | Domain for requests. For custom domains, follow the request process.
- useInstanceId: Bool | false | Include PubNub object instanceId in requests.
- useRequestId: Bool | false | Include a request identifier in requests.
- automaticRetry: AutomaticRetry? | .default | Custom auto-retry config. Subscribe uses ReconnectionPolicy.exponential by default.
- durationUntilTimeout: UInt | 300 | Presence timeout window (server considers client alive). Long-poll behavior. Min 20 seconds.
- heartbeatInterval: UInt | 0 | Heartbeat frequency for presence. Recommended ≈ (durationUntilTimeout / 2) - 1. Do not set below 3. 0 disables explicit heartbeats.
- supressLeaveEvents: Bool | false | Whether to send leave requests.
- requestMessageCountThreshold: UInt | 100 | Emit RequestMessageCountExceeded when payload message count exceeds this value.
- filterExpression: String? | nil | PSV2 filter expression for subscribe.
- enableEventEngine: Bool | true | Use standardized subscribe/presence workflows and statuses.
- maintainPresenceState: Bool | true | With enableEventEngine=true, send custom presence state with each subscribe call.
- cipherKey: Crypto? | nil | Deprecated. Pass via cryptoModule. If set, all communication uses this key.
- uuid: String | n/a | Deprecated. Use userId instead.

#### cryptoModule

- Encrypts/decrypts messages and files. From 6.1.0, algorithm choice supported.
- Options:
  - Legacy 128-bit encryption (default if cryptoModule not set but cipherKey present).
  - Recommended 256-bit AES-CBC (explicitly set via cryptoModule).
- See Encryption docs for configuration, utilities, and examples.

##### Legacy encryption with 128-bit cipher key entropy

- You may keep legacy encryption. To use recommended 256-bit AES-CBC, set via PubNub config using cryptoModule.

##### automaticRetry

automaticRetry lets the client retry requests automatically.

Parameters:
- retryLimit: UInt | Max retry attempts per request.
- policy: ReconnectionPolicy | One of:
  - ReconnectionPolicy.linear(delay)
  - ReconnectionPolicy.exponential(minDelay, maxDelay)
  - Default for subscribe: exponential
- retryableHTTPStatusCodes: Set<Int> | HTTP status codes that trigger retries.
- retryableURLErrorCode: Set<URLError.Code> | URL error codes that trigger retries.
- excluded: [AutomaticRetry.Endpoint] | Endpoints excluded from retry.

```
1
  

```

#### Request configuration

Use PubNub.RequestConfiguration to customize a single request without changing global settings.

- customSession: SessionReplaceable? | nil | Custom network session implementing SessionReplaceable (routing, tasks, lifecycle).
- customConfiguration: RouterConfiguration? | nil | Endpoint configuration for this request.
- responseQueue: DispatchQueue | n/a | Queue used for dispatching the response.

##### SessionReplaceable

Defines a custom network session interface.

Properties:
- sessionID: UUID | Unique identifier for the session object.
- session: URLSessionReplaceable | Underlying URLSession used for tasks.
- sessionQueue: DispatchQueue | Queue used for session operations.
- defaultRequestOperator: RequestOperator? | Default request operator attached to every request (settable).
- sessionStream: SessionStream? | Optional session stream for real-time communication (settable).

##### RouterConfiguration

Base settings for PubNub endpoints (auth, security, encryption, behavior).

Properties:
- publishKey: String? | See publishKey above.
- subscribeKey: String | See subscribeKey above.
- uuid: String | Unique device identifier (equivalent to userId in Configuration).
- useSecureConnections: Bool | See useSecureConnections above.
- origin: String | See origin above.
- authKey: String? | See authKey above.
- authToken: String? | See authToken above.
- cryptoModule: CryptoModule? | See cryptoModule above.
- useRequestId: Bool | See useRequestId above.
- consumerIdentifiers: [String: String] | Key-value pairs to identify consumers for request tracking.
- enableEventEngine: Bool | See enableEventEngine above.
- maintainPresenceState: Bool | See maintainPresenceState above.
- urlScheme: String | "https" or "http" derived from useSecureConnections.
- subscribeKeyExists: Bool | Whether subscribeKey is valid and not empty.
- publishKeyExists: Bool | Whether publishKey is valid and not empty.

##### DispatchQueue

Specifies which queue handles response callbacks.

Method:
- currentLabel: String | Returns the label of the current DispatchQueue or "Unknown Queue" if no label set.

##### Official Apple Documentation

For standard DispatchQueue properties and methods, refer to Apple's DispatchQueue documentation.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set the userId to uniquely identify the user or device. Persist it for the lifetime of the user/device. Required to connect.

##### Reference code

```
1
  

```

### Other examples

#### Initialization for a read-only client

If the client only reads and never publishes, set publishKey to nil.

##### Required User ID

Always set the userId to uniquely identify the user or device. Persist it for the lifetime of the user/device. Required to connect.

```
1
  

```

## Event listeners

- PubNub client: updates from all subscriptions (channels, groups, channel metadata, users).
- Subscription: updates for its specific entity.
- SubscriptionsSet: updates for all entities in its subscription list.

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