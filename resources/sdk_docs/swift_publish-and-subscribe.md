# Publish/Subscribe API for Swift Native SDK

Low-latency global messaging. See Connection Management and Publish Messages for concepts.

## Publish

`publish()` sends a message to all subscribers on a channel. Calls are asynchronous.

Essential details:
- Initialize with publishKey.
- You can publish without subscribing.
- You cannot publish to multiple channels simultaneously.
- TLS/SSL: set ssl = true during initialization. Messages can be encrypted via CryptoModule.
- message and meta accept any Swift type conforming to JSONCodable. Strings are UTF‑8.
- Do not JSON-serialize message/meta; pass objects directly.
- Max message size: 32 KiB (including escapes and channel). Target < 1,800 bytes for best performance. Oversize returns Message Too Large.
- Soft throughput limits: in-memory subscriber queue holds 100 messages. Excess bursts may drop earlier messages if subscribers lag.
- Optional customMessageType adds a business label (for example, text, action, poll).
- Best practices:
  - Publish serially.
  - Verify success (Result.success) before sending next message; retry on failure.
  - Keep in-memory queue under 100 messages.
  - Throttle bursts (for example, ≤ 5 msg/sec) to meet latency targets.

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
- message (JSONCodable, required): The message payload.
- customMessageType (String?, default nil): 3–50 chars, case-sensitive alphanumeric; dash/underscore allowed. Must not start with special chars or pn_/pn-. Examples: text, action, poll.
- shouldStore (Bool?, default nil): If true, store in history.
- storeTTL (Int?, default nil): Per-message TTL (hours) when stored.
  1) shouldStore = true and storeTTL = 0: stored with no expiry.
  2) shouldStore = true and storeTTL = X: stored with expiry X hours.
  3) shouldStore = false or unspecified: not stored; storeTTL ignored.
  4) If storeTTL unspecified, defaults to key-level expiry.
- meta (JSONCodable?/AnyJSON?, default nil): Extra metadata.
- shouldCompress (Bool, default false): Use POST and compress body.
- custom requestConfig (PubNub.RequestConfiguration, default new): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Result of publish.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running publish, subscribe to the same channel (see Subscribe) or use the Debug Console.

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

Sends a message to Functions event handlers and Illuminate on a channel. Not replicated to subscribers and not stored in history.

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
- channel (String, required): Target channel.
- message (JSONCodable, required): Payload to fire.
- meta (JSONCodable?, default nil): Extra metadata.
- custom requestConfig (PubNub.RequestConfiguration): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Result of fire.

#### Completion handler result

- Success: Timetoken of the message.
- Failure: Error describing the failure.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

Sends a lightweight signal to all channel subscribers.

- Default payload size limit: 64 bytes (payload only). Contact support for higher limits.

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
- channel (String, required): Channel ID.
- message (JSONCodable, required): Payload to signal.
- customMessageType (String?, default nil): Same rules as publish.
- custom requestConfig (PubNub.RequestConfiguration): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Result of signal.

#### Completion handler result

- Success: Timetoken of the message.
- Failure: Error describing the failure.

### Sample code

#### Signal a message to a channel

```
1
  

```

## Subscribe

Opens a socket to receive messages and events for entities. Initialize with subscribeKey.

- After subscribe(), client receives new messages. Configure automaticRetry to reconnect and fetch available messages after disconnect.

### Subscription scope

Subscriptions attach listeners for message/event types:

- Subscription: scoped to a single entity (for example, channel).
- SubscriptionSet: scoped to the client; includes one or more subscriptions.

One event listener receives all messages, signals, and events for subscribed entities. See Event listeners.

### Create a subscription

Entity-level Subscription receives updates only for that entity. Use multiple subscriptions to handle channels differently.

Keep a strong reference: Subscriptions must be retained to keep listening (ARC may deallocate otherwise).

Create from an entity:

```
`// Entity-based, local-scoped  
func subscription(  
  queue: DispatchQueue = .main,  
  options: SubscriptionOptions = SubscriptionOptions.empty()  
)  
`
```

- options (SubscriptionOptions): Subscription behavior configuration.

### Create a subscription set

Client-level SubscriptionSet receives updates for multiple entities. Use for common handling across channels.

Keep a strong reference: Must be retained to continue listening.

Create from PubNub:

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
- queue (DispatchQueue): Dispatch queue for events (default: main).
- entities (Collection<Subscribable>, required): One or more entities (ChannelRepresentation, ChannelGroupRepresentation, UserMetadataRepresentation, ChannelMetadataRepresentation).
- options (SubscriptionOptions): Subscription behavior configuration.

Add/remove sets: You can add/remove subscriptions to build new sets (see examples).

#### SubscriptionOptions

- ReceivePresenceEvents: Deliver presence updates for userIds via listener streams. See Presence Events for details.

### Method(s)

Subscription and SubscriptionSet share subscribe().

#### Subscribe

```
`func subscribe(with: Timetoken? = nil)  
`
```

- with (Timetoken?): Start from a timetoken to retrieve any available cached messages (best-effort; non-17-digit values ignored).

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

Subscribable objects that emit real-time updates:

- ChannelRepresentation
- ChannelGroupRepresentation
- UserMetadataRepresentation
- ChannelMetadataRepresentation

Create entities from PubNub:

### Create channels

Returns ChannelRepresentation.

```
`func channel(_ name: String) -> ChannelRepresentation  
`
```

- channel (String, required): Channel ID.

#### Sample code

```
1
  

```

### Create a channel group

Returns ChannelGroupRepresentation.

```
`func channelGroup(_ name: String) -> ChannelGroupRepresentation  
`
```

- name (String, required): Channel group name.

#### Sample code

```
1
  

```

### Create channel metadata

Returns ChannelMetadataRepresentation.

```
`func channelMetadata(_ name: String) -> ChannelMetadataRepresentation  
`
```

- name (String, required): Channel metadata identifier.

#### Sample code

```
1
  

```

### Create user metadata

Returns UserMetadataRepresentation.

```
`func userMetadata(_ name: String) -> UserMetadataRepresentation  
`
```

- name (String, required): User metadata identifier.

#### Sample code

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and PubNub (connection status) to receive messages, signals, events.

### Add listeners

You can implement multiple listeners via onEvent or register type-specific listeners (message, file, etc).

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

Client scope: Only on PubNub.

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

Create a clone of a subscription with same state but no listeners.

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

A new subscription instance with an empty event dispatcher.

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

Remove all active subscriptions for the client and clear the listening list.

Client scope: Only on PubNub.

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