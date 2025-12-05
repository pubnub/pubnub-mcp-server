# Publish/Subscribe API for Swift Native SDK

PubNub delivers messages worldwide in <30 ms. For concepts, see Connection Management and Publish Messages.

## Publish

publish() sends a message to all subscribers of a single channel. Calls are asynchronous.

Prerequisites and limitations:
- Initialize PubNub with publishKey.
- You don't need to be subscribed to publish.
- You cannot publish to multiple channels simultaneously.

Security:
- Enable TLS/SSL by setting ssl to true during initialization.
- Optional message encryption via CryptoModule.

Message data:
- message and meta accept any Swift type conforming to JSONCodable. Strings can include any UTF‑8 characters.
- Don't JSON serialize message or meta; the SDK handles serialization.

Size:
- Max message size: 32 KiB (includes escaped characters and channel name). Aim for <1,800 bytes.
- Exceeding limit returns Message Too Large. See Message size limits.

Publish rate:
- Publish as fast as bandwidth allows; soft throughput limit applies. In-memory queue stores 100 messages. Large bursts (e.g., 200 at once) can cause early messages to drop if subscribers lag.

Custom message type:
- Optional customMessageType to label messages (for example, text, action, poll).

Best practices:
- Publish to a channel serially, not concurrently.
- Verify success (Result.success) before sending next.
- Retry on failure.
- Keep the in-memory queue under 100 messages.
- Throttle bursts (e.g., ≤5 msgs/sec) to meet latency needs.

### Method(s)

To Publish a message use:

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
- message (JSONCodable, required): Payload to publish.
- customMessageType (String?, default nil): 3–50 char case-sensitive label; alphanumeric, dashes and underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- shouldStore (Bool?, default nil): If true, store in history.
- storeTTL (Int?, default nil): Per-message TTL (hours). If shouldStore true and storeTTL = 0: no expiry. If shouldStore true and storeTTL = X: expires in X hours. If shouldStore false/not specified: not stored and TTL ignored. If storeTTL not specified: uses key’s default expiry.
- meta (JSONCodable?/AnyJSON?, default nil): Extra metadata.
- shouldCompress (Bool, default false): If true, publishes via HTTP POST with compressed body.
- custom requestConfig (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request config.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Publish a message to a channel

```
1
  
```

Before running, subscribe to the same channel (Debug Console or a separate script).

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

fire() sends a message to Functions event handlers and Illuminate on the target channel. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message use:

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
- channel (String, required): Channel ID to fire to.
- message (JSONCodable, required): Payload to fire.
- meta (JSONCodable?, default nil): Extra metadata.
- custom requestConfig (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request config.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Fire a message to a channel

```
1
  
```

## Signal

signal() sends a signal to all subscribers of a channel.

Payload size:
- Default max payload: 64 bytes (payload only). For higher limits, contact support.

### Method(s)

To Signal a message use:

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
- channel (String, required): Channel ID to send a signal to.
- message (JSONCodable, required): Signal payload.
- customMessageType (String?, default nil): Optional label (same constraints as publish).
- custom requestConfig (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request config.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Signal a message to a channel

```
1
  
```

## Subscribe

Subscribe opens a TCP socket and listens for messages/events on specified entities. Set subscribeKey during initialization. Configure automaticRetry to reconnect and fetch available messages after disconnects.

Concepts:
- Subscribe to entities directly: ChannelRepresentation, ChannelGroupRepresentation, UserMetadataRepresentation, ChannelMetadataRepresentation.
- One listener receives messages, signals, and events for subscribed entities. See Event listeners.

### Subscription scope

- Subscription: entity-scoped (e.g., a single channel).
- SubscriptionSet: client-scoped (group of subscriptions on one PubNub instance). A set can include one or more subscriptions.

### Create a subscription

Keep a strong reference to every Subscription/SubscriptionSet to avoid deallocation by ARC.

Create on an entity:

```
`// Entity-based, local-scoped  
func subscription(  
  queue: DispatchQueue = .main,  
  options: SubscriptionOptions = SubscriptionOptions.empty()  
)  
`
```

Parameter:
- options (SubscriptionOptions): Behavior configuration.

### Create a subscription set

Keep a strong reference to every Subscription/SubscriptionSet.

Create on a PubNub instance:

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
- queue (DispatchQueue): Queue for event dispatch (default main).
- entities (Collection<Subscribable>, required): One or more entities (ChannelRepresentation, ChannelGroupRepresentation, UserMetadataRepresentation, ChannelMetadataRepresentation).
- options (SubscriptionOptions): Behavior configuration.

Add/remove sets:
- You can add and remove subscriptions to create new sets. See Other examples.

#### SubscriptionOptions

Base class for all options. Available subclass:
- ReceivePresenceEvents: Deliver presence updates for userIds via listener streams. See Presence Events.

### Method(s)

subscribe() is available on Subscription and SubscriptionSet.

#### Subscribe

```
`func subscribe(with: Timetoken? = nil)  
`
```

Parameter:
- with (Timetoken?): Start timetoken to return any available cached messages (best-effort). If not a 17-digit number, it’s ignored.

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

- No return value.

## Entities

Subscribable objects for real-time updates:
- ChannelRepresentation
- ChannelGroupRepresentation
- UserMetadataRepresentation
- ChannelMetadataRepresentation

Create entities on a PubNub instance:

### Create channels

```
`func channel(_ name: String) -> ChannelRepresentation  
`
```

Parameter:
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

Parameter:
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

Parameter:
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

Parameter:
- name (String, required): User metadata identifier.

#### Sample code

```
1
  
```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and (for connection status) the PubNub client. A single listener can receive all messages, signals, and events.

### Add listeners

Implement with onEvent or register event-specific listeners (message, file, etc.).

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

Client scope: Available only on PubNub.

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

Clone an existing subscription with the same state and empty listener closures.

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

A new instance with an empty event dispatcher.

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

Remove the client’s active subscriptions from all channels and clear the listening list.

Client scope: Available only on PubNub.

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