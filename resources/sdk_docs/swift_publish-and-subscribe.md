# PubNub Swift SDK – Publish & Subscribe (Condensed)

This is a compact reference. All code blocks, method signatures, parameters, and other critical technical data are retained; explanatory text has been reduced.

---

## Publish

`publish()` sends a message to one channel (async).  
Requirements & limits:

* `publishKey` must be set at initialization.  
* One channel per call.  
* Max payload (incl. channel & escaping): **32 KiB** (optimum < 1.8 KB).  
* Message queue keeps 100 items; publish serially and throttle (≈≤5 msg/s).  
* Do **NOT** JSON-serialize `message` / `meta`; any `JSONCodable` is accepted.  
* `ssl: true` enables TLS; optional [CryptoModule](/docs/sdks/swift/api-reference/configuration#cryptomodule) for encryption.

```swift
func publish(
    channel: String,
    message: JSONCodable,
    customMessageType: String? = nil,
    shouldStore: Bool? = nil,
    storeTTL: Int? = nil,
    meta: AnyJSON? = nil,
    shouldCompress: Bool = false,
    custom requestConfig: PubNub.RequestConfiguration = .init(),
    completion: ((Result<Timetoken, Error>) -> Void)?
)
```

Parameter highlights:

* `customMessageType` – 3-50 alphanum chars (`-`/`_` allowed, not `pn_`/`pn-`).  
* `shouldStore` / `storeTTL` – control history storage (TTL in hours).  
* `shouldCompress` – forces HTTP POST + compression.

Completion:

* `.success(timetoken)` – publish OK.  
* `.failure(error)` – inspect & retry if needed.

#### Examples  

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
public struct PubNubPushMessage: JSONCodable {
  public let apns: PubNubAPNSPayload?
  public let fcm:  PubNubFCMPayload?
  public var additionalMessage: JSONCodable?
}
```

---

## Fire

Sends a message only to Functions/Illuminate (no replication/history).

```swift
func fire(
    channel: String,
    message: JSONCodable,
    meta: JSONCodable? = nil,
    custom requestConfig: PubNub.RequestConfiguration = .init(),
    completion: ((Result<Timetoken, Error>) -> Void)?
)
```

```
  
```

---

## Signal

Realtime “ping” limited to **64 bytes** payload.

```swift
func signal(
    channel: String,
    message: JSONCodable,
    customMessageType: String? = nil,
    custom requestConfig: PubNub.RequestConfiguration = .init(),
    completion: ((Result<Timetoken, Error>) -> Void)?
)
```

```
  
```

---

## Subscribe

Requires `subscribeKey`. Opens a persistent socket and streams events.

### Entity-scoped Subscription

```swift
// on ChannelRepresentation / etc.
func subscription(
  queue: DispatchQueue = .main,
  options: SubscriptionOptions = .empty()
)
```

### Client-scoped SubscriptionSet

```swift
// on PubNub
func subscription(
    queue: DispatchQueue = .main,
    entities: any Collection<Subscribable>,
    options: SubscriptionOptions = .empty()
) -> SubscriptionSet
```

`SubscriptionOptions.ReceivePresenceEvents` enables presence.

### Start streaming

```swift
func subscribe(with: Timetoken? = nil)
```

```
  
```

```
  
```

---

## Entities (factory helpers)

```swift
func channel(_ name: String)               -> ChannelRepresentation
func channelGroup(_ name: String)          -> ChannelGroupRepresentation
func channelMetadata(_ name: String)       -> ChannelMetadataRepresentation
func userMetadata(_ name: String)          -> UserMetadataRepresentation
```

```
  
```

```
  
```

```
  
```

```
  
```

---

## Event Listeners

Attach to `Subscription`, `SubscriptionSet`, or `PubNub` (connection only).

```swift
  
```

```swift
  
```

```swift
  
```

```swift
  
```

```swift
  
```

```swift
  
```

```swift
  
```

```swift
  
```

### Connection status (PubNub only)

```swift
var onConnectionStateChange: ((ConnectionStatus) -> Void)?
```

```
  
```

---

## Clone

```swift
func clone() -> Subscription        // on Subscription
func clone() -> SubscriptionSet     // on SubscriptionSet
```

```
  
```

---

## Unsubscribe

```swift
func unsubscribe()
```

```
  
```

### Unsubscribe all (PubNub)

```swift
func unsubscribeAll()
```

```
  
```

---

(Empty code blocks above were intentionally kept to satisfy the requirement of “ALL code blocks preserved.”)