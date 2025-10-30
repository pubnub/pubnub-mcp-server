# Publish/Subscribe API for JavaScript SDK

PubNub delivers messages worldwide in less than 30 ms. Send a message to one recipient or broadcast to thousands of subscribers.

For higher-level conceptual details on publishing and subscribing, refer to Connection Management and to Publish Messages.

##### Supported and recommended asynchronous patterns

- Supports Callbacks, Promises, and Async/Await. Recommended: Async/Await.
- Use try...catch to receive status errors.

## Publish

`publish()` sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize PubNub with the publishKey.
  - You don't have to be subscribed to a channel to publish to it.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl to true during initialization. Encryption is supported.
- Message data
  - Any JSON-serializable data (objects, arrays, integers, strings). Avoid special classes or functions. Strings may include UTF‑8.
  - Don't JSON serialize: Pass objects directly for message and meta; SDK handles serialization.
- Size
  - Max 32 KiB including escaped characters and channel name. Aim under 1,800 bytes.
  - Exceeding limit returns Message Too Large. See Message size limits.
- Publish rate
  - Publish as fast as bandwidth allows; soft throughput limit applies. In-memory queue stores 100 messages; excess may drop.
- Custom message type
  - Optional customMessageType to label/category messages, e.g., text, action, poll.
- Best practices
  - Publish serially (not concurrently).
  - Verify success return code (e.g., [1,"Sent","136074940..."]); publish next only on success.
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep in-memory queue under 100 messages; throttle bursts (e.g., ≤5 msg/s).

### Method(s)

To Publish a message:

```
`1pubnub.publish({  
2    message: any,  
3    channel: string,  
4    meta: any,  
5    storeInHistory: boolean,  
6    sendByPost: boolean,  
7    ttl: number,  
8    customMessageType: string  
9}): PromisePublishResponse>;  
`
```

Parameters:
- message (required, any): Any valid JSON type.
- channel (required, string): Channel ID to publish to.
- storeInHistory (boolean, default true): If true, messages are stored in history. If omitted, key-level history configuration is used.
- sendByPost (boolean, default false): If true, uses HTTP POST with compressed body; adheres to REST best practices.
- meta (any): Extra meta payload for the request.
- ttl (number): Per-message TTL for Message Persistence.
- customMessageType (string): 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.

### Sample code

##### Reference code

```
1
  

```

#### Publish a message to a channel

```
1
  

```

##### Subscribe to the channel

Before running the above publish example, either using the Debug Console or in a separate script, subscribe to the same channel that is being published to.

### Response

```
`1type PublishResponse = {  
2    timetoken: number  
3}  
`
```

### Other examples

#### Publish a JSON-serialized message

```
1
  

```

#### Store the published message for 10 hours

```
1
  

```

#### Publish successful

```
1
  

```

#### Publish unsuccessful by network down

```
1
  

```

#### Publish unsuccessful by initialization without a publish key

```
1
  

```

## Fire

Sends a message to Functions event handlers and Illuminate. Messages sent via fire() aren’t replicated to subscribers or stored in history.

### Method(s)

To Fire a message:

```
`1fire({  
2    Object message,  
3    String channel,  
4    Boolean sendByPost,  
5    Object meta  
6})  
`
```

Parameters:
- message (required, Object): Any valid JSON type.
- channel (required, String): Channel ID.
- sendByPost (Boolean, default false): If true, send via POST.
- meta (Object): Extra meta payload.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

The signal() function sends a signal to all subscribers of a channel.

- Default payload size limit: 64 bytes (payload only). Contact support for higher limits.

### Method(s)

To Signal a message:

```
`1pubnub.signal({  
2    message: string,  
3    channel: string,  
4    customMessageType: string,  
5}): PromiseSignalResponse>;  
`
```

Parameters:
- message (required, string): Signal payload.
- channel (required, string): Channel ID.
- customMessageType (string): 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

```
`1type SignalResponse = {  
2    timetoken: number  
3}  
`
```

## Subscribe

Creates an open TCP socket and listens for messages/events on specified entities. Requires subscribeKey at initialization.

- Add event listeners to receive messages; subscribe() only opens the connection.
- Message objects received include sender ID in publisher.
- retryConfiguration can auto-reconnect and retrieve available messages (best-effort).

##### Subscription scope

- subscription: entity-scoped (e.g., specific channel).
- subscriptionSet: client-scoped; includes one or more subscriptions created on the same pubnub instance.
- Adding subscriptions to an existing set auto-subscribes them.

### Create a subscription

Entity-level subscription for a specific entity:

```
`1// entity-based, local-scoped  
2const channel = pubnub.channel('channel_1');  
3channel.subscription(subscriptionOptions)  
`
```

Parameters:
- subscriptionOptions (subscriptionOptions): Subscription behavior configuration.

### Create a subscription set

Client-level subscriptionSet for multiple entities:

```
`1// client-based, general-scoped  
2pubnub.subscriptionSet({  
3    channels: string[],  
4    channelGroups: string[],  
5    subscriptionOptions: subscriptionOptions  
6}))  
`
```

Parameters:
- channels (string[]): Channels to subscribe to. Either channels or channelGroups is mandatory.
- channelGroups (string[]): Channel groups to subscribe to. Either channels or channelGroups is mandatory.
- subscriptionOptions (subscriptionOptions): Subscription behavior configuration.

#### subscriptionOptions

- receivePresenceEvents (boolean): Deliver presence updates through listener streams.
- cursor (object): Best-effort retrieval from a cursor: cursor?: { timetoken?: string; region?: number }. Non-17-digit numbers or non-numeric strings are ignored.

#### Modify a subscription set

You can add/remove subscriptions in an existing set; added ones are auto-subscribed. See Other examples.

### Method(s)

subscription and subscriptionSet use the same subscribe() method.

#### Subscribe

```
`1subscription.subscribe()  
2subscriptionSet.subscribe()  
`
```

##### Sample code

```
1
  

```

##### Wildcard subscribe and message objects

Wildcard subscriptions (e.g., sports.*) require listeners. Message objects include publisher (sender ID), channel (actual channel), and subscription (wildcard match).

##### Other examples

###### Create a subscription set from 2 individual subscriptions

```
1
  

```

###### Create a subscription set from 2 sets

```
1
  

```

###### Add subscriptions to an existing set

```
1
  

```

##### Returns

No return value.

## Entities

Subscribable objects: channel, channelGroup, userMetadata, channelMetadata.

### Create channels

Returns a local channel entity.

```
`1pubnub.channel(string)  
`
```

Parameters:
- channel (string): Channel ID.

#### Sample code

```
1
  

```

### Create channel groups

Returns a local channelGroup entity.

```
`1pubnub.channelGroup(string)  
`
```

Parameters:
- channel_group (string): Channel group name.

#### Sample code

```
1
  

```

### Create channel metadata

Returns a local channelMetadata entity.

```
`1pubnub.channelMetadata(string)  
`
```

Parameters:
- channelMetadata (string): Channel metadata identifier.

#### Sample code

```
1
  

```

### Create user metadata

Returns a local userMetadata entity.

```
`1pubnub.userMetadata(string)  
`
```

Parameters:
- userMetadata (string): User metadata identifier.

#### Sample code

```
1
  

```

## Event listeners

Receive all messages, signals, and events via listeners. Attach to subscription, subscriptionSet, and (for connection status) the PubNub client.

### Add listeners

Implement multiple listeners with addListener(), or event-specific listeners (e.g., message, file).

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

Note: Message object includes publisher (sender ID), message content, channel name, timetoken, and metadata.

### Add connection status listener

Client-scoped listener for connection status updates.

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

#### Returns

Subscription status. See SDK statuses.

## Unsubscribe

Stop receiving updates from a subscription or subscriptionSet.

### Method(s)

```
1subscription.unsubscribe()  
2
  
3subscriptionSet.unsubscribe()  
```

### Sample code

```
1
  

```

### Returns

None

## Unsubscribe all

Stop receiving updates from all streams and remove associated entities.

##### Client scope

Only available on the PubNub object.

### Method(s)

```
`1pubnub.unsubscribeAll()  
`
```

### Sample code

```
1
  

```

### Returns

None