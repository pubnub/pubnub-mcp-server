# Publish/Subscribe API for JavaScript SDK

PubNub delivers messages globally in under 30 ms. Use publish/subscribe for one-to-one or one-to-many messaging.

For conceptual details, see Connection Management and Publish Messages.

##### Supported asynchronous patterns
- Supports Callbacks, Promises, and Async/Await.
- Recommended: Async/Await. Handle errors with try...catch.

## Publish

`publish()` sends a message to all subscribers of a channel.

Key points:
- Initialize with publishKey.
- You don't need to subscribe to publish.
- You can't publish to multiple channels simultaneously.
- Secure transport with TLS/SSL (`ssl: true`) and optional message encryption.
- Message data: any JSON-serializable data (objects, arrays, numbers, strings). Avoid functions/special classes.
- Don't JSON serialize the message or meta parameters; the SDK handles serialization.
- Size limit: max 32 KiB per message (including escaped chars and channel). Aim for < 1,800 bytes.
- Throughput: publish as fast as bandwidth allows, but subscribers have a soft limit (in-memory queue ~100 messages). Throttle to avoid drops.
- Optional customMessageType for business-specific categorization (e.g., text, action, poll).

Best practices:
- Publish to a channel serially.
- Verify success response before sending the next message (e.g., [1,"Sent","136074940..."]).
- Retry on failure (e.g., [0,"blah","<timetoken>"]).
- Keep queue under 100 messages.
- Throttle bursts (e.g., <= 5 msgs/sec).

### Method(s)

```ts
pubnub.publish({
  message: any,
  channel: string,
  meta?: any,
  storeInHistory?: boolean,
  sendByPost?: boolean,
  ttl?: number,
  customMessageType?: string
}): Promise<PublishResponse>;
```

Parameters:
- message (required, any): Any JSON type.
- channel (required, string): Target channel ID.
- storeInHistory (boolean, default true): Store message in history; if omitted, key’s history config applies.
- sendByPost (boolean, default false): Use HTTP POST (body, compressed) vs GET.
- meta (any): Extra metadata sent with request.
- ttl (number): Per-message time to live for Message Persistence.
- customMessageType (string): 3–50 chars; case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_ / pn- (examples: text, action, poll).

### Sample code

##### Reference code

```
  
```

#### Publish a message to a channel

```
  
```

```
  
```

##### Subscribe to the channel
Before publishing, subscribe to the same channel (using the Debug Console or another script) to observe messages.

### Response

```ts
type PublishResponse = {
  timetoken: number
}
```

### Other examples

#### Publish a JSON-serialized message

```
  
```

#### Store the published message for 10 hours

```
  
```

#### Publish successful

```
  
```

#### Publish unsuccessful by network down

```
  
```

#### Publish unsuccessful by initialization without a publish key

```
  
```

## Fire

Sends a message to Functions event handlers and Illuminate. Messages sent via fire():
- Go directly to handlers on the target channel.
- Aren’t replicated to subscribers.
- Aren’t stored in history.

### Method(s)

```ts
pubnub.fire({
  message: Object,
  channel: String,
  sendByPost?: Boolean,
  meta?: Object
});
```

Parameters:
- message (Object): Any JSON type.
- channel (String): Target channel ID.
- sendByPost (Boolean, default false): Use POST.
- meta (Object): Extra metadata.

### Sample code

#### Fire a message to a channel

```
  
```

## Signal

Sends lightweight signals to subscribers.

- Default payload size limit: 64 bytes (payload only; not URI/headers). Contact support for higher limits.

### Method(s)

```ts
pubnub.signal({
  message: string,
  channel: string,
  customMessageType?: string,
}): Promise<SignalResponse>;
```

Parameters:
- message (string): Signal payload.
- channel (string): Target channel ID.
- customMessageType (string): 3–50 chars; rules as in publish (examples: text, action, poll).

### Sample code

#### Signal a message to a channel

```
  
```

### Response

```ts
type SignalResponse = {
  timetoken: number
}
```

## Subscribe

Opens a persistent connection and listens for messages/events on specified entities. Requires subscribeKey at initialization.

- subscribe() only opens the connection; add event listeners to receive data.
- The received message object includes the sender’s ID in the publisher field.
- retryConfiguration can auto-reconnect and attempt to catch up on available cached messages.

### Subscription scope

- subscription: entity-scoped (e.g., a specific channel).
- subscriptionSet: client-scoped; manages one or more subscriptions on a single PubNub client.

Adding subscriptions to a subscribed subscriptionSet auto-subscribes them.

### Create a subscription

Entity-level subscription for a single entity.

```ts
// entity-based, local-scoped
const channel = pubnub.channel('channel_1');
channel.subscription(subscriptionOptions)
```

- subscriptionOptions (subscriptionOptions): Behavior configuration.

### Create a subscription set

Client-level set covering multiple entities.

```ts
// client-based, general-scoped
pubnub.subscriptionSet({
  channels?: string[],
  channelGroups?: string[],
  subscriptionOptions?: subscriptionOptions
})
```

- channels (string[]): Channels to subscribe. Either channels or channelGroups is required.
- channelGroups (string[]): Channel groups to subscribe. Either channels or channelGroups is required.
- subscriptionOptions (subscriptionOptions): Behavior configuration.

#### subscriptionOptions

- receivePresenceEvents (boolean): Deliver presence updates via listeners.
- cursor (object): Best-effort retrieval cursor { timetoken?: string; region?: number }. Non-17-digit or non-numeric strings are ignored.

#### Modify a subscription set
Add or remove subscriptions to/from an existing set. Newly added ones auto-subscribe if the set is subscribed.

### Method(s)

subscription and subscriptionSet use the same subscribe().

#### Subscribe

```ts
subscription.subscribe()
subscriptionSet.subscribe()
```

##### Sample code

```
  
```

##### Wildcard subscribe and message objects
Subscribing to wildcards (e.g., sports.*) works like regular subscribe; add listeners to receive messages. Message objects include:
- publisher: sender’s ID
- channel: actual channel name
- subscription: wildcard used

##### Other examples

###### Create a subscription set from 2 individual subscriptions

```
  
```

###### Create a subscription set from 2 sets

```
  
```

###### Add subscriptions to an existing set

```
  
```

##### Returns
No return value.

## Entities

Subscribable entity types:
- channel
- channelGroup
- userMetadata
- channelMetadata

### Create channels

Returns a local channel entity.

```ts
pubnub.channel(string)
```

- channel (string): Channel ID.

#### Sample code

```
  
```

### Create channel groups

Returns a local channelGroup entity.

```ts
pubnub.channelGroup(string)
```

- channel_group (string): Channel group name.

#### Sample code

```
  
```

### Create channel metadata

Returns a local channelMetadata entity.

```ts
pubnub.channelMetadata(string)
```

- channelMetadata (string): Channel metadata identifier.

#### Sample code

```
  
```

### Create user metadata

Returns a local userMetadata entity.

```ts
pubnub.userMetadata(string)
```

- userMetadata (string): User metadata identifier.

#### Sample code

```
  
```

## Event listeners

Receive messages and events using listeners. You can attach listeners to subscription, subscriptionSet, and (for connection status only) the PubNub client.

### Add listeners

Implement multiple listeners with addListener() or event-specific listeners (e.g., message, file).

#### Method(s)

```
  
```

#### Sample code

```
  
```

Message objects include publisher (sender’s ID), message content, channel name, timetoken, and metadata.

### Add connection status listener

Client-scoped listener for connection status updates (available on the PubNub object).

#### Method(s)

```
  
```

#### Sample code

```
  
```

#### Returns
Subscription status. See SDK statuses.

## Unsubscribe

Stop receiving updates from a subscription or a subscriptionSet.

### Method(s)

```ts
subscription.unsubscribe()

subscriptionSet.unsubscribe()
```

### Sample code

```
  
```

### Returns
None

## Unsubscribe all

Stop receiving updates from all streams and remove associated entities. Client scope (PubNub object only).

### Method(s)

```ts
pubnub.unsubscribeAll()
```

### Sample code

```
  
```

### Returns
None