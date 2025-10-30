# Publish/Subscribe API for Swift Native SDK

PubNub delivers messages worldwide in less than 30 ms. Send a message to one recipient or broadcast to thousands of subscribers.

For concepts, see Connection Management and Publish Messages.

## Publish

publish() asynchronously sends a message to all subscribers of a channel. Messages are replicated globally.

Key details:
- Initialize PubNub with publishKey.
- You don't need to be subscribed to publish.
- You cannot publish to multiple channels simultaneously.
- Enable TLS/SSL by setting ssl = true during initialization; you can also encrypt messages.
- message and meta can be any Swift type conforming to JSONCodable. Strings support UTF‑8.
- Don't JSON serialize message/meta; pass full objects and let the SDK handle serialization.
- Max message size: 32 KiB (includes escaped characters and channel name). Aim for < 1,800 bytes for best performance. Exceeding limit returns Message Too Large.
- Throughput: publish as fast as bandwidth allows; subscribers have an in-memory queue of 100 messages. A burst (e.g., 200 messages) may drop early messages if subscriber lags.
- Optional customMessageType lets you label messages (e.g., text, action, poll).

Best practices:
- Publish to a channel serially (not concurrently).
- Verify success (check Result.success) before sending the next message; on failure, retry.
- Keep the in-memory queue under 100 messages to avoid drops.
- Throttle bursts (e.g., ≤ 5 msg/s) to meet latency needs.

### Method(s)

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

Parameters:
- channel (String, required): Channel ID to publish to.
- message (JSONCodable, required): Message payload.
- customMessageType (String?, default nil): Case-sensitive 3–50 alphanumeric chars; dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- shouldStore (Bool?, default nil): If true, store message in history.
- storeTTL (Int?, default nil): Per-message TTL (hours) when shouldStore = true.
  1) shouldStore = true and storeTTL = 0: store with no expiry.
  2) shouldStore = true and storeTTL = X: store with expiry X hours.
  3) shouldStore = false or not specified: not stored; storeTTL ignored.
  4) If storeTTL not specified: falls back to key’s default expiry.
- meta (JSONCodable?, default nil): Extra metadata to send with request.
- shouldCompress (Bool, default false): If true, uses HTTP POST and compresses the message (payload in body).
- custom (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result callback.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Publish a message to a channel

```
1
  

```

Before running the publish example, subscribe to the same channel (via Debug Console or a separate script).

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

fire() sends a message to Functions event handlers and Illuminate on the target channel. It’s not replicated to subscribers and not stored in history.

### Method(s)

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

Parameters:
- channel (String, required)
- message (JSONCodable, required)
- meta (JSONCodable?, default nil)
- custom (PubNub.RequestConfiguration, default PubNub.RequestConfiguration())
- completion ((Result<Timetoken, Error>) -> Void)?

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

signal() sends a lightweight signal to all channel subscribers.

- Payload limit: 64 bytes (payload only; not URI/headers). For larger payloads, contact support.

### Method(s)

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

Parameters:
- channel (String, required)
- message (JSONCodable, required)
- customMessageType (String?, default nil): Same rules as publish.
- custom (PubNub.RequestConfiguration, default PubNub.RequestConfiguration())
- completion ((Result<Timetoken, Error>) -> Void)?

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Signal a message to a channel

```
1
  

```

## Subscribe

Opens a TCP socket and listens for messages/events on specified entities. Set subscribeKey during initialization. Configure automaticRetry to reconnect and fetch available messages after a disconnect.

Concepts:
- Subscriptions: see Subscriptions.
- Subscribe via client or directly on entities:
  - ChannelRepresentation
  - ChannelGroupRepresentation
  - UserMetadataRepresentation
  - ChannelMetadataRepresentation

### Subscription scope

- Subscription: scoped to a single entity (e.g., one channel).
- SubscriptionSet: scoped to the client; includes one or more subscriptions.

One listener receives all messages, signals, and events for subscribed entities. See Event listeners.

### Create a subscription

Keep a strong reference to Subscription/SubscriptionSet to prevent ARC deallocation.

```
`// Entity-based, local-scoped  
func subscription(  
  queue: DispatchQueue = .main,  
  options: SubscriptionOptions = SubscriptionOptions.empty()  
)  
`
```

Parameters:
- options (SubscriptionOptions): Subscription behavior configuration.

### Create a subscription set

Keep a strong reference to Subscription/SubscriptionSet to prevent ARC deallocation.

```
`// Client-based, general-scoped  
func subscription(  
    queue: DispatchQueue = .main,  
    entities: any CollectionSubscribable>,  
    options: SubscriptionOptions = SubscriptionOptions.empty()  
) -> SubscriptionSet  
`
```

Parameters:
- queue (DispatchQueue): Dispatch queue for events. Default: main.
- entities (Collection<Subscribable>, required): One or more entities: ChannelRepresentation, ChannelGroupRepresentation, UserMetadataRepresentation, ChannelMetadataRepresentation.
- options (SubscriptionOptions): Subscription behavior configuration.

Add/remove sets: you can add/remove subscriptions to create new sets.

#### SubscriptionOptions

Base class for options. Available subclass:
- ReceivePresenceEvents: Receive presence updates for userIds. See Presence Events.

### Method(s)

#### Subscribe

```
`func subscribe(with: Timetoken? = nil)  
`
```

Parameters:
- with (Timetoken?): Start from timetoken for best-effort cached message retrieval. Non–17-digit values are ignored.

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
- ChannelRepresentation
- ChannelGroupRepresentation
- UserMetadataRepresentation
- ChannelMetadataRepresentation

Create local entities from a PubNub instance:

### Create channels

```
`func channel(_ name: String) -> ChannelRepresentation  
`
```

Parameters:
- channel (String, required): Channel ID.

#### Sample code

```
1
  

```

### Create a channel group

```
`func channelGroup(_ name: String) -> ChannelGroupRepresentation  
`
```

Parameters:
- name (String, required): Channel group name.

#### Sample code

```
1
  

```

### Create channel metadata

```
`func channelMetadata(_ name: String) -> ChannelMetadataRepresentation  
`
```

Parameters:
- name (String, required): Channel metadata identifier.

#### Sample code

```
1
  

```

### Create user metadata

```
`func userMetadata(_ name: String) -> UserMetadataRepresentation  
`
```

Parameters:
- name (String, required): User metadata identifier.

#### Sample code

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and (connection status only) the PubNub client. Use onEvent for multiple types or event-specific listeners.

### Add listeners

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

Client scope: available only on the PubNub object.

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

Subscription status. See SDK statuses.

## Clone

Create a clone of an existing subscription with the same state but empty event listeners.

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

New instance of the subscription object with an empty event dispatcher.

## Unsubscribe

Stop receiving updates from a Subscription or SubscriptionSet.

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

Client scope: available only on the PubNub object. Removes active subscriptions from all channels and clears the client’s list.

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