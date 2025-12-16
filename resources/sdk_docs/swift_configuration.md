# Configuration API for Swift Native SDK

Use `PubNubConfiguration` to define how a PubNub instance behaves.

## Initializer(s)

Create a configuration with your Publish and Subscribe Keys.

##### Privacy

[MAU billing](/docs/general/setup/account-setup#pricing-model) tracks users ([Device](/docs/general/basics/identify-users-and-devices) and MAU) for analytics and billing. PubNub does not track customers using transactions with random UUIDs/UserIDs.

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

### Parameters (critical details)

- `publishKey: String?` (default `nil`): Publish key (required for publishing).
- `subscribeKey: String`: Subscribe key (required for subscribing).
- `userId: String` (required): Unique identifier for the user/device; UTF-8 string up to 92 alphanumeric characters. If unset, you can’t connect.
- `cryptoModule: CryptoModule?` (default `nil`): Encrypt/decrypt messages and files (see **cryptoModule** below).
- `authKey: String?` (default `nil`): Used on all requests when Access Manager is enabled.
- `authToken: String?` (default `nil`): Used instead of `authKey` when Access Manager is enabled.
- `useSecureConnections: Bool` (default `true`): HTTPS if `true`, HTTP if `false` (requires ATS changes to allow insecure traffic).
- `origin: String` (default `"ps.pndsn.com"`): Request domain; custom domains require support request ([process](/docs/general/setup/data-security#request-process)).
- `useInstanceId: Bool` (default `false`): Include SDK `instanceId` on outgoing requests.
- `useRequestId: Bool` (default `false`): Include request identifier on outgoing requests.
- `automaticRetry: AutomaticRetry?` (default `.default`; subscribe default policy is `ReconnectionPolicy.exponential`): Automatic retry configuration (see **automaticRetry** below).
- `durationUntilTimeout: UInt` (default `300`, min `20`): Presence liveness timeout; absence triggers a “timeout” event on the [presence channel](/docs/general/presence/overview).
- `heartbeatInterval: UInt` (default `0`): Heartbeat frequency; recommended `(durationUntilTimeout / 2) - 1`. `0` disables explicit heartbeats. Don’t set below `3`.
- `suppressLeaveEvents: Bool` (default `false`): Whether to send leave requests.
- `requestMessageCountThreshold: UInt` (default `100`): Messages per payload threshold before `RequestMessageCountExceeded`.
- `filterExpression: String?` (default `nil`): PSV2 subscription filter expression.
- `enableEventEngine: Bool` (default `true`): Use standardized subscribe/presence workflows and emitted [statuses](/docs/sdks/swift/status-events).
- `maintainPresenceState: Bool` (default `true`): Only when `enableEventEngine == true`; sends state (set via [`pubnub.setPresence()`](/docs/sdks/swift/api-reference/presence#set-state)) with each subscribe call.

Deprecated configuration:
- `cipherKey` (deprecated; use `cryptoModule`): If set, encrypts communication.
- `uuid` (deprecated; use `userId`): Unique identifier; required to connect.

#### `cryptoModule`

`cryptoModule` encrypts/decrypts messages and files; from 6.1.0 you can choose algorithms.

- Options: legacy 128-bit encryption and recommended 256-bit AES-CBC.
- If `cryptoModule` is not set and `cipherKey` is present, legacy encryption is used.
- Details/examples: [Encryption](/docs/sdks/swift/api-reference/encryption).

##### Legacy encryption with 128-bit cipher key entropy

No changes needed to keep legacy encryption. To use recommended 256-bit AES-CBC, explicitly set it in config.

##### `automaticRetry`

`automaticRetry` parameters:

- `retryLimit: UInt`: Max retries before failing.
- `policy: ReconnectionPolicy`:  
  - `ReconnectionPolicy.linear(delay)`  
  - `ReconnectionPolicy.exponential(minDelay, maxDelay)` (default for subscribe)
- `retryableHTTPStatusCodes: Set<Int>`: HTTP status codes eligible for retry.
- `retryableURLErrorCode: Set<URLError.Code>`: URL error codes eligible for retry.
- `excluded: [AutomaticRetry.Endpoint]`: Endpoints excluded from retry (see [endpoints](https://github.com/pubnub/swift/blob/master/Sources/PubNub/Networking/Request/Operators/AutomaticRetry.swift)).

More: [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

```
1
  

```

## Request configuration

Use `PubNub.RequestConfiguration` to customize a single request without changing global settings.

Parameters:
- `customSession: SessionReplaceable?` (default `nil`): Custom session implementing `SessionReplaceable`.
- `customConfiguration: RouterConfiguration?` (default `nil`): Per-endpoint router configuration.
- `responseQueue: DispatchQueue` (required): Queue for dispatching responses.

##### SessionReplaceable

Custom session interface for routing, task execution, and lifecycle.

Properties:
- `sessionID: UUID`
- `session: URLSessionReplaceable`
- `sessionQueue: DispatchQueue`
- `defaultRequestOperator: RequestOperator?` (settable)
- `sessionStream: SessionStream?` (settable)

##### RouterConfiguration

Base endpoint settings (auth, security, encryption, request behavior).

Properties:
- `publishKey: String?`
- `subscribeKey: String`
- `uuid: String` (equivalent to `userId` in Configuration)
- `useSecureConnections: Bool`
- `origin: String` (custom domain via [request process](/docs/general/setup/data-security#request-process))
- `authKey: String?`
- `authToken: String?`
- `cryptoModule: CryptoModule?`
- `useRequestId: Bool`
- `consumerIdentifiers: [String: String]` (consumer tracking)
- `enableEventEngine: Bool`
- `maintainPresenceState: Bool`
- `urlScheme: String` (`"https"` or `"http"` derived from `useSecureConnections`)
- `subscribeKeyExists: Bool`
- `publishKeyExists: Bool`

##### DispatchQueue

Controls where response callbacks run.

Method:
- `currentLabel -> String`: Returns current queue label or `"Unknown Queue"`.

##### Official Apple Documentation

See [Apple’s DispatchQueue documentation](https://developer.apple.com/documentation/dispatch/dispatchqueue).

## Sample code

### Initialize the PubNub client API

##### Required User ID

Always set and persist `userId` for the lifetime of the user/device; without it you can’t connect.

##### Reference code

```
1
  

```

## Other examples

### Initialization for a read-only client

If the client only reads and never publishes, set `publishKey` to `nil`.

##### Required User ID

Always set and persist `userId`; without it you can’t connect.

```
1
  

```

## Event listeners

Real-time updates can be received via:
- PubNub client (all subscriptions)
- [`Subscription`](/docs/sdks/swift/api-reference/publish-and-subscribe#create-a-subscription) (only its target)
- [`SubscriptionsSet`](/docs/sdks/swift/api-reference/publish-and-subscribe#create-a-subscription-set) (all included targets)

Details: [Publish & Subscribe](/docs/sdks/swift/api-reference/publish-and-subscribe#event-listeners).

## Overriding PubNub configuration

`PubNubConfiguration` is mutable until applied to a `PubNub` instance; afterwards it’s locked. To change settings, create a new `PubNub` instance.

```
1
  

```

### Filter

Update `filterExpression` without creating a new instance:

```
1
**
```