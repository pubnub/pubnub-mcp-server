# Publish/Subscribe API for Swift Native SDK

PubNub enables low-latency global messaging. Publish is async; subscribe listens on a TCP socket for messages/events.

## Publish

`publish()` sends a message to all subscribers on **one** channel (cannot publish to multiple channels in one call). You **must** initialize PubNub with a `publishKey`. You do **not** need to be subscribed to publish.

### Security / transport

- Enable TLS/SSL by setting `ssl = true` during initialization.
- Optional message encryption via CryptoModule (see configuration docs).

### Message data / serialization

- `message` and `meta` can be any Swift type conforming to `JSONCodable` (`String` supports UTF-8).
- **Don't JSON serialize** `message`/`meta`; PubNub auto-serializes.

### Size / rate limits

- Max publish payload: **32 KiB** (includes escaped characters + channel name). Target **< 1,800 bytes** for best performance.
- If exceeded: `Message Too Large`.
- Soft throughput limit: if subscribers can’t keep up, messages may drop (in-memory queue stores only **100** messages).
- Best practices: publish serially, verify success (`Result.success`), publish next only after success, retry on failure, keep queue < 100, throttle bursts (example: ≤ 5 msg/sec).

### Custom message type

Optional `customMessageType` for a business label/category (examples: `text`, `action`, `poll`).

### Method(s)

To `Publish a message` you can use the following method(s) in the Swift SDK:

```
`1func publish(  
2    channel: String,  
3    message: JSONCodable,  
4    customMessageType: String? = nil,  
5    shouldStore: Bool? = nil,  
6    storeTTL: Int? = nil,  
7    meta: AnyJSON? = nil,  
8    shouldCompress: Bool = false,  
9    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
10    completion: ((ResultTimetoken, Error>) -> Void)?  
11)  
`
```

**Parameters (critical details)**

- `channel` *(String, required)*: Channel ID to publish to.
- `message` *(JSONCodable, required)*: Message payload.
- `customMessageType` *(String?, default `nil`)*: Case-sensitive alphanumeric 3–50 chars; `-` and `_` allowed; cannot start with special chars or `pn_` / `pn-`.
- `shouldStore` *(Bool?, default `nil`)*: If `true`, store in history.
- `storeTTL` *(Int?, default `nil`)*: Per-message persistence TTL (hours):
  1. `shouldStore = true` and `storeTTL = 0` → store forever  
  2. `shouldStore = true` and `storeTTL = X` → expire in X hours  
  3. `shouldStore = false` or unspecified → not stored; `storeTTL` ignored  
  4. if `storeTTL` unspecified → defaults to key’s TTL
- `meta` *(JSONCodable?, default `nil`)*: Extra metadata with the request.
- `shouldCompress` *(Bool, default `false`)*: If `true`, uses HTTP POST with message in body and compressed (instead of HTTP GET query string).
- `custom requestConfig` *(PubNub.RequestConfiguration)*: Per-request config/network customization.
- `completion` *(((Result<Timetoken, Error>) -> Void)?, default `nil`)*: Async result.

#### Completion handler result

##### Success
`Timetoken` of the published message.

##### Failure
`Error` describing the failure.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Other examples

#### Publish a dictionary object

```
1
  

```

#### Publish the above dictionary as a custom Swift Object

```
1
  

```

#### Mix and match types with custom objects

```
1
  

```

#### Publish an APNs2 push notification

```
1
  

```

#### Root level push message object

```
1public struct PubNubPushMessage: JSONCodable {  
2    
3  /// The payload delivered via Apple Push Notification service (APNS)  
4  public let apns: PubNubAPNSPayload?  
5
  
6  /// The payload delivered via Firebase Cloud Messaging service (FCM)  
7  public let fcm: PubNubFCMPayload?  
8
  
9  /// Additional message payload sent outside of the push notification  
10  ///  
11  /// In order to guarantee valid JSON any scalar values will be assigned to the `data` key.  
12  /// Non-scalar values will retain their coding keys.  
13  public var additionalMessage: JSONCodable?  
14}  
```

## Fire

`fire()` sends a message to **Functions event handlers** and **Illuminate** on the target channel. It triggers handlers (handlers can read request body). Messages sent via `fire()`:
- **aren’t replicated to subscribers**
- **aren’t stored in history**

### Method(s)

To `Fire a message` you can use the following method(s) in the Swift SDK:

```
`1func fire(  
2    channel: String,  
3    message: JSONCodable,  
4    meta: JSONCodable? = nil,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((ResultTimetoken, Error>) -> Void)?  
7)  
`
```

**Parameters**
- `channel` *(String, required)*: Channel ID to fire to.
- `message` *(JSONCodable, required)*: Message payload.
- `meta` *(JSONCodable?, default `nil`)*: Extra metadata.
- `custom requestConfig` *(PubNub.RequestConfiguration)*: Per-request customization.
- `completion` *(((Result<Timetoken, Error>) -> Void)?, default `nil`)*: Async result.

#### Completion handler result

##### Success
`Timetoken` of the published message.

##### Failure
`Error` describing the failure.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

`signal()` sends a signal to all subscribers of a channel.

- Default signal payload limit: **64 bytes** (payload only; not URI/headers). For larger payloads, contact support.

### Method(s)

To `Signal a message` you can use the following method(s) in the Swift SDK:

```
`1func signal(   
2  channel: String,   
3  message: JSONCodable,  
4  customMessageType: String? = nil,  
5  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6  completion: ((ResultTimetoken, Error>) -> Void)?  
7)  
`
```

**Parameters**
- `channel` *(String, required)*: Channel ID to signal to.
- `message` *(JSONCodable, required)*: Signal payload.
- `customMessageType` *(String?, default `nil`)*: Same constraints as publish (`3–50`, alphanumeric, `-`/`_`, cannot start with special chars or `pn_`/`pn-`).
- `custom requestConfig` *(PubNub.RequestConfiguration)*: Per-request customization.
- `completion` *(((Result<Timetoken, Error>) -> Void)?, default `nil`)*: Async result.

#### Completion handler result

##### Success
`Timetoken` of the published message.

##### Failure
`Error` describing the failure.

### Sample code

#### Signal a message to a channel

```
1
  

```

## Subscribe

Subscribe opens a TCP socket to listen for messages/events. Set `subscribeKey` during initialization. Configure `automaticRetry` to reconnect and best-effort fetch available messages after disconnect.

### Subscription scope

- `Subscription`: entity-scoped (ex: specific channel); useful when handling channels differently.
- `SubscriptionSet`: client-scoped (all entities within a `pubnub` instance); useful for common handling across channels.
- One event listener receives all messages/signals/events for subscribed entities (see [Event listeners](#event-listeners)).

### Create a subscription

Keep a **strong reference** to created `Subscription`/`SubscriptionSet` to prevent ARC deallocation.

```
`// Entity-based, local-scoped  
func subscription(  
  queue: DispatchQueue = .main,  
  options: SubscriptionOptions = SubscriptionOptions.empty()  
)  
`
```

- `options` *(SubscriptionOptions)*: subscription behavior configuration.

### Create a subscription set

Keep a **strong reference** to created `Subscription`/`SubscriptionSet` to prevent ARC deallocation.

```
`// Client-based, general-scoped  
func subscription(  
    queue: DispatchQueue = .main,  
    entities: any CollectionSubscribable>,  
    options: SubscriptionOptions = SubscriptionOptions.empty()  
) -> SubscriptionSet  
`
```

- `queue` *(DispatchQueue)*: Dispatch queue for events (default `.main`).
- `entities` *(Collection<Subscribable>, required)*: One or more of `ChannelRepresentation`, `ChannelGroupRepresentation`, `UserMetadataRepresentation`, `ChannelMetadataRepresentation`.
- `options` *(SubscriptionOptions)*: behavior configuration.

##### Add/remove sets
You can add/remove subscriptions to create new sets (see other examples below).

#### `SubscriptionOptions`

Base class for options. Subclass:
- `ReceivePresenceEvents`: deliver presence updates for `userId`s through listener streams.

### Method(s)

`Subscription` and `SubscriptionSet` use the same `subscribe()` method.

#### Subscribe

```
`func subscribe(with: Timetoken? = nil)  
`
```

- `with` *(Timetoken?)*: timetoken to return any available cached messages (best-effort; not guaranteed). If not a 17-digit number, ignored.

##### Sample code

```
1
  

```

##### Other examples

###### Create a subscription set from 2 individual subscriptions

```
1
  

```

##### Returns
No return value.

## Entities

Subscribable objects for real-time updates:
- `ChannelRepresentation`
- `ChannelGroupRepresentation`
- `UserMetadataRepresentation`
- `ChannelMetadataRepresentation`

Create local entities from a `PubNub` instance:

### Create channels

```
`func channel(_ name: String) -> ChannelRepresentation  
`
```

- `channel` *(String)*: Channel ID.

#### Sample code

```
1
  

```

### Create a channel group

```
`func channelGroup(_ name: String) -> ChannelGroupRepresentation  
`
```

- `name` *(String)*: Channel group name.

#### Sample code

```
1
  

```

### Create channel metadata

```
`func channelMetadata(_ name: String) -> ChannelMetadataRepresentation  
`
```

- `name` *(String)*: Channel metadata identifier.

#### Sample code

```
1
  

```

### Create user metadata

```
`func userMetadata(_ name: String) -> UserMetadataRepresentation  
`
```

- `name` *(String)*: User metadata identifier.

#### Sample code

```
1
  

```

## Event listeners

Listeners deliver messages, signals, and events. You can attach listeners to `Subscription`, `SubscriptionSet`, and (for connection status) the `PubNub` client.

### Add listeners

Multiple listeners can be implemented using `onEvent` or event-specific listeners (ex: `message`, `file`).

#### Method(s)

```
1
  

```

```
1
  

```

```
1
  

```

```
1
  

```

```
1
  

```

```
1
  

```

```
1
  

```

```
1
  

```

### Add connection status listener

Client-scoped (only on `PubNub` object).

#### Method(s)

```
`1var onConnectionStateChange: ((ConnectionStatus) -> Void)?  
`
```

#### Sample code

```
1
  

```

#### Returns
Subscription status; see SDK statuses in connection management docs.

## Clone

Clone an existing subscription with the same subscription state but **empty** real-time event listener closures.

### Method(s)

```
`1// Method in the `Subscription` class  
2func clone() -> Subscription  
3// Method in the `SubscriptionSet` class  
4func clone() -> SubscriptionSet  
`
```

### Sample code

```
1
  

```

### Returns
New subscription instance with an empty event dispatcher.

## Unsubscribe

Stop receiving updates from a `Subscription` or `SubscriptionSet`.

### Method(s)

```
`func unsubscribe()  
`
```

### Sample code

```
1
  

```

### Returns
None

## Unsubscribe all

Client-scoped (only on `PubNub` object). Removes all active subscriptions from all channels.

### Method(s)

```
`1func unsubscribeAll()  
`
```

### Sample code

```
1
  

```

### Returns
None