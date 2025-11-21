# Publish/Subscribe API for Swift Native SDK

PubNub delivers messages worldwide in less than 30 ms. Send a message to one recipient or broadcast to many subscribers.

For higher-level concepts, see Connection Management and Publish Messages.

## Publish

`publish()` sends a message to all subscribers on a channel. Calls are asynchronous and replicated globally.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - You don't need to be subscribed to publish.
  - You can't publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl = true during initialization. You can also encrypt messages.
- Message data
  - message and meta accept any Swift type conforming to JSONCodable. Strings may include any UTF‑8 characters.
  - Don't JSON serialize: Pass full objects; SDK serializes automatically for signals, messages, and files.
- Size
  - Max message size: 32 KiB (includes escaped characters and channel name). Aim for under 1,800 bytes for optimal performance.
  - Exceeding the limit returns Message Too Large.
- Publish rate
  - Publish as fast as bandwidth allows. There’s a soft throughput limit; messages may drop if subscribers can’t keep up.
  - In-memory queue stores only 100 messages; bursts (e.g., 200 at once) may drop early messages.
- Custom message type
  - Optionally label messages with customMessageType (e.g., text, action, poll).
- Best practices
  - Publish to a channel serially (not concurrently).
  - Verify success (e.g., Result.success) before sending the next.
  - Retry on failure.
  - Keep the in-memory queue < 100.
  - Throttle bursts (e.g., <= 5 messages/sec) to meet latency needs.

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
- message (JSONCodable, required): Message payload.
- customMessageType (String?, default nil): Case-sensitive alphanumeric, 3–50 chars; dashes and underscores allowed; cannot start with special characters or pn_/pn-.
- shouldStore (Bool?, default nil): If true, message is stored in history.
- storeTTL (Int?, default nil): Per-message TTL (hours) in Message Persistence.
  1) If shouldStore = true and storeTTL = 0: stored with no expiry.
  2) If shouldStore = true and storeTTL = X: expires in X hours.
  3) If shouldStore is false or not specified: message isn’t stored; storeTTL ignored.
  4) If storeTTL isn’t specified: defaults to key-level expiry.
- meta (JSONCodable?, default nil): Extra metadata sent with the request.
- shouldCompress (Bool, default false): If true, uses HTTP POST and compresses body.
- custom (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result callback.

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

Before running the publish example, subscribe to the same channel (using the Debug Console or a separate script).

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

Sends a message to Functions event handlers and Illuminate. Messages go to handlers registered on the target channel and trigger execution. Not replicated to subscribers and not stored in history.

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
- message (JSONCodable, required): Message payload.
- meta (JSONCodable?, default nil): Extra metadata.
- custom (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result callback.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Fire a message to a channel

```
1
  
```

## Signal

Sends a lightweight signal to all subscribers of a channel.

- Payload limit: 64 bytes (payload only; excludes URI/headers). Contact support for larger limits.

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
- customMessageType (String?, default nil): Same constraints as publish.
- custom (PubNub.RequestConfiguration, default PubNub.RequestConfiguration()): Per-request configuration.
- completion ((Result<Timetoken, Error>) -> Void)?: Async result callback.

#### Completion handler result

- Success: Timetoken of the published message.
- Failure: Error describing the failure.

### Sample code

#### Signal a message to a channel

```
1
  
```

## Subscribe

Opens a TCP socket and listens for messages/events on specified entities. Set subscribeKey during initialization.

- Conceptual overview
  - Entities are first-class citizens with their own APIs. Subscribe using the PubNub client or directly on:
    - ChannelRepresentation
    - ChannelGroupRepresentation
    - UserMetadataRepresentation
    - ChannelMetadataRepresentation
  - After subscribe(), the client receives new messages. Configure automaticRetry to reconnect and fetch available messages after a disconnect.

### Subscription scope

- Subscription: created from an entity and scoped to that entity (e.g., a particular channel).
- SubscriptionSet: created from the PubNub client and scoped to the client (can include multiple subscriptions).
- One event listener receives all messages, signals, and events. See Event listeners.

### Create a subscription

Create an entity-level Subscription for a single entity. Keep a strong reference to all Subscription/SubscriptionSet instances (ARC may deallocate otherwise).

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

Create a client-level SubscriptionSet for multiple entities. Keep a strong reference.

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
- queue (DispatchQueue): Event dispatch queue. Defaults to main.
- entities (Collection<Subscribable>, required): One or more of ChannelRepresentation, ChannelGroupRepresentation, UserMetadataRepresentation, ChannelMetadataRepresentation.
- options (SubscriptionOptions): Subscription behavior configuration.

Add/remove sets: You can add and remove subscriptions to form new sets.

#### SubscriptionOptions

Base class for options. Available subclasses:
- ReceivePresenceEvents: Whether presence updates for userIds should be delivered. See Presence Events for details.

### Method(s)

Subscription and SubscriptionSet use the same subscribe() method.

#### Subscribe

```
`func subscribe(with: Timetoken? = nil)  
`
```

Parameters:
- with (Timetoken): Start timetoken to return available cached messages. Best-effort only; non-17-digit values are ignored.

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

Returns ChannelRepresentation.

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

Returns ChannelGroupRepresentation.

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

Returns ChannelMetadataRepresentation.

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

Returns UserMetadataRepresentation.

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

Receive messages and events via listeners. Attach to Subscription, SubscriptionSet, and (for connection status) the PubNub client.

### Add listeners

Implement multiple listeners with onEvent or register event-specific listeners (e.g., message, file).

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

Client-only listener for connection status updates.

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

A new instance of the subscription object with an empty event dispatcher.

## Unsubscribe

Stop receiving real-time updates from a Subscription or a SubscriptionSet.

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

Client scope: Only available on the PubNub object.

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