# Publish/Subscribe API for JavaScript SDK

Low-latency real-time messaging (global delivery <30 ms). Use Async/Await (recommended) with try...catch for error handling. PubNub returns status on error only.

## Publish

`publish()` sends a message to all subscribers on a channel.

Key points:
- Initialize with publishKey. Subscribe is not required to publish. Cannot publish to multiple channels simultaneously.
- Security: Enable TLS/SSL by setting `ssl: true` during initialization; optional message encryption via CryptoModule.
- Data: Any JSON-serializable value (objects, arrays, numbers, strings). Do not manually JSON-serialize `message` or `meta`.
- Size: Max 32 KiB including escaped characters and channel name. Target <1,800 bytes for best performance. Exceeding returns Message Too Large.
- Rate/throughput: Publish as bandwidth allows; soft limits apply. Subscriber in-memory queue holds 100 messages.
- customMessageType: Optional business-specific label (e.g., text, action, poll). See constraints below.
- Best practices:
  - Publish serially; wait for success response then send next.
  - Verify success code; retry on failure.
  - Keep queue <100; throttle bursts (e.g., ≤5 msgs/s).

### Method(s)

To Publish a message, you can use:

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
- message (required): any JSON type.
- channel (required): string channel ID.
- storeInHistory: boolean, default true. If omitted, key’s history config applies.
- sendByPost: boolean, default false. Uses HTTP POST with BODY and compression.
- meta: any additional metadata.
- ttl: number, per-message TTL for Message Persistence.
- customMessageType: string, 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_/pn-.

### Sample code

#### Publish a message to a channel

```
1
  

```

```
1
  

```

Before running the publish example, subscribe to the same channel.

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

Sends a message to Functions event handlers and Illuminate. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message, you can use:

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
- message (required): any JSON type.
- channel (required): string channel ID.
- sendByPost: boolean, default false.
- meta: any.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

Sends a small control payload to subscribers of a channel.

- Payload size limit: 64 bytes (payload only). Contact support to increase.

### Method(s)

To Signal a message, you can use:

```
`1pubnub.signal({  
2    message: string,  
3    channel: string,  
4    customMessageType: string,  
5}): PromiseSignalResponse>;  
`
```

Parameters:
- message (required): string (limit applies).
- channel (required): string channel ID.
- customMessageType: same constraints as publish.

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

Opens a socket and listens for messages/events on entities. Initialize with subscribeKey. Add event listeners to receive data; messages include sender ID in publisher.

- Entities: channel, channelGroup, userMetadata, channelMetadata.
- Retry: Configure retryConfiguration to auto-reconnect and retrieve any available messages.
- Subscriptions:
  - subscription: scoped to a single entity.
  - subscriptionSet: scoped to the PubNub client and can include multiple subscriptions. Adding to a subscribed set auto-subscribes the new items.

### Create a subscription

```
`1// entity-based, local-scoped  
2const channel = pubnub.channel('channel_1');  
3channel.subscription(subscriptionOptions)  
`
```

- subscriptionOptions: see subscriptionOptions.

### Create a subscription set

```
`1// client-based, general-scoped  
2pubnub.subscriptionSet({  
3    channels: string[],  
4    channelGroups: string[],  
5    subscriptionOptions: subscriptionOptions  
6}))  
`
```

- channels: string[] (required if channelGroups not provided)
- channelGroups: string[] (required if channels not provided)
- subscriptionOptions: see below.

#### subscriptionOptions

Class fields:
- receivePresenceEvents: boolean. Deliver presence updates for userIds.
- cursor: object best-effort retrieval cursor { timetoken?: string; region?: number }. Non-17-digit numbers or non-numeric strings are ignored.

#### Modify a subscription set

Add/remove subscriptions; newly added items to a subscribed set are auto-subscribed.

### Method(s)

subscription and subscriptionSet share subscribe().

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

Wildcard subscribe behaves like regular; message objects include publisher, the actual channel in channel, and the wildcard match in subscription.

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

Subscribable objects:
- channel
- channelGroup
- userMetadata
- channelMetadata

### Create channels

```
`1pubnub.channel(string)  
`
```

- channel: string channel ID.

#### Sample code

```
1
  

```

### Create channel groups

```
`1pubnub.channelGroup(string)  
`
```

- channel_group: string channel group name.

#### Sample code

```
1
  

```

### Create channel metadata

```
`1pubnub.channelMetadata(string)  
`
```

- channelMetadata: string identifier.

#### Sample code

```
1
  

```

### Create user metadata

```
`1pubnub.userMetadata(string)  
`
```

- userMetadata: string identifier.

#### Sample code

```
1
  

```

## Event listeners

Receive messages and events via a listener. Attach to subscription, subscriptionSet, and for connection status, the PubNub client.

### Add listeners

Implement multiple listeners with addListener(), or event-specific listeners.

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

Message objects include publisher (sender ID), content, channel, timetoken, and metadata.

### Add connection status listener

Client-scoped listener for connection status.

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

#### Returns

Subscription status (see SDK statuses).

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

Stop receiving updates from all streams and remove associated entities. Client-only.

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