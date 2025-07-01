# PubNub Swift SDK – Publish / Subscribe (Condensed)

This is a concise reference for PubNub’s real-time publish / subscribe API in the Swift SDK.  
All method signatures, parameters, limits, and examples are unchanged; explanatory text is trimmed.

---

## Publish

`publish()` delivers a message to all subscribers of a single channel (async).

Essentials  
• `publishKey` required during initialization  
• One channel per call, messages ≤ 32 KiB (optimal ≤ 1800 B)  
• `JSONCodable` payloads; **do NOT pre-serialize to JSON**  
• Optional TLS (`ssl = true`) and encryption (CryptoModule)  
• Soft queue limit: 100 messages per subscriber

### Method

```swift
func publish(
    channel: String,
    message: JSONCodable,
    customMessageType: String? = nil,
    shouldStore: Bool? = nil,
    storeTTL: Int? = nil,
    meta: AnyJSON? = nil,
    shouldCompress: Bool = false,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<Timetoken, Error>) -> Void)?
)
```

Parameter highlights  
• `customMessageType` – 3-50 chars, case-sensitive (`text`, `action`, …)  
• `shouldStore` / `storeTTL` – history control  
• `shouldCompress = true` forces HTTP POST + gzip

Completion  
`success` → Timetoken `failure` → Error

### Basic usage

```swift

```

### Other examples

```swift

```

```swift

```

```swift

```

```swift

```

#### Root-level push payload object

```swift
public struct PubNubPushMessage: JSONCodable {

  public let apns: PubNubAPNSPayload?
  public let fcm:  PubNubFCMPayload?
  public var additionalMessage: JSONCodable?
}
```

---

## Fire

`fire()` sends data only to Functions Event Handlers / Illuminate.  
Not replicated, not stored, not delivered to regular subscribers.

### Method

```swift
func fire(
    channel: String,
    message: JSONCodable,
    meta: JSONCodable? = nil,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<Timetoken, Error>) -> Void)?
)
```

### Basic usage

```swift

```

---

## Signal

Lightweight (< 64 B payload) real-time ping to subscribers.

### Method

```swift
func signal(
  channel: String,
  message: JSONCodable,
  customMessageType: String? = nil,
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<Timetoken, Error>) -> Void)?
)
```

### Basic usage

```swift

```

---

## Subscribe

Opens a TCP socket and streams messages/events.

Initialization requirement: `subscribeKey`.

### Subscription objects

• `Subscription` – per-entity (channel, group, user, etc.)  
• `SubscriptionSet` – client-level aggregate

Keep a strong reference to every subscription/subscription set.

#### Create subscription (entity scoped)

```swift
// Entity-based
func subscription(
  queue: DispatchQueue = .main,
  options: SubscriptionOptions = SubscriptionOptions.empty()
)
```

#### Create subscription set (client scoped)

```swift
// Client-based
func subscription(
  queue: DispatchQueue = .main,
  entities: any Collection<Subscribable>,
  options: SubscriptionOptions = SubscriptionOptions.empty()
) -> SubscriptionSet
```

`SubscriptionOptions` subclasses (example)  
• `ReceivePresenceEvents`

#### Start streaming

```swift
func subscribe(with: Timetoken? = nil)
```

```swift

```

##### Combine two subscriptions into a set

```swift

```

---

## Entities (builders)

```swift
func channel(_ name: String) -> ChannelRepresentation
func channelGroup(_ name: String) -> ChannelGroupRepresentation
func channelMetadata(_ name: String) -> ChannelMetadataRepresentation
func userMetadata(_ name: String) -> UserMetadataRepresentation
```

Example usages

```swift

```

---

## Event Listeners

Attach closures to receive real-time data.

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

### Connection status (client)

```swift
var onConnectionStateChange: ((ConnectionStatus) -> Void)?
```

```swift

```

---

## Clone

```swift
func clone() -> Subscription      // on Subscription
func clone() -> SubscriptionSet   // on SubscriptionSet
```

```swift

```

---

## Unsubscribe

```swift
func unsubscribe()          // on Subscription / SubscriptionSet
func unsubscribeAll()       // on PubNub client
```

```swift

```

```swift

```

---

End of condensed reference.