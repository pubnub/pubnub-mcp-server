# Publish/Subscribe API for JavaScript SDK

PubNub delivers messages worldwide in less than 30 ms. Publish to one or many subscribers. For conceptual details, see Connection Management and Publish Messages.

##### Supported and recommended asynchronous patterns
- Supports Callbacks, Promises, and Async/Await.
- Recommended: Async/Await with try...catch for error handling.

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. PubNub replicates the message across its PoPs and delivers it to all subscribed clients on that channel.

- Prerequisites and limitations
  - Initialize PubNub with the publishKey.
  - You don't need to subscribe to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl: true during initialization.
  - Optional message encryption via CryptoModule.
- Message data
  - Any JSON-serializable type (objects, arrays, strings, numbers). Avoid special classes/functions. Strings may include any UTF‑8 characters.
  - Don't JSON serialize the message or meta; the SDK handles serialization.
- Size
  - Max 32 KiB (includes escaped characters and channel name). Target under ~1,800 bytes.
  - Exceeding limit returns Message Too Large.
- Publish rate
  - Soft throughput limits; subscriber queues hold up to 100 messages. Large bursts can drop older messages if subscribers lag.
- Custom message type
  - customMessageType: 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_ / pn- (examples: text, action, poll).
- Best practices
  - Publish serially, not concurrently.
  - Check success code (e.g., [1,"Sent","136074940..."]); on failure ([0,"blah","<timetoken>"]), retry.
  - Keep in-memory queues under 100 messages.
  - Throttle bursts (e.g., ≤5 messages/sec) to meet latency targets.

### Method(s)[​](#methods)

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

Parameters
- message (required): any JSON type.
- channel (required): string channel ID to publish to.
- storeInHistory: boolean, default true. If omitted, key-level history config applies.
- sendByPost: boolean, default false. When true, uses HTTP POST with compressed body (REST best practice).
- meta: any; extra metadata for the request.
- ttl: number; per-message TTL for Message Persistence.
- customMessageType: string; business-specific label (constraints above).

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
1
  

```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (using Debug Console or another script).

### Response[​](#response)

```
`1type PublishResponse = {  
2    timetoken: number  
3}  
`
```

### Other examples[​](#other-examples)

#### Publish a JSON-serialized message[​](#publish-a-json-serialized-message)

```
1
  

```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
1
  

```

#### Publish successful[​](#publish-successful)

```
1
  

```

#### Publish unsuccessful by network down[​](#publish-unsuccessful-by-network-down)

```
1
  

```

#### Publish unsuccessful by initialization without a publish key[​](#publish-unsuccessful-by-initialization-without-a-publish-key)

```
1
  

```

## Fire[​](#fire)

Sends a message to Functions event handlers and Illuminate on a channel. Triggers handlers only; not delivered to subscribers and not stored in history.

### Method(s)[​](#methods-1)

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

Parameters
- message (required): any JSON type.
- channel (required): String channel ID.
- sendByPost: Boolean; when true, send via POST.
- meta: Object; extra metadata.

### Sample code[​](#sample-code-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
1
  

```

## Signal[​](#signal)

`signal()` sends a lightweight signal to all subscribers of a channel.

- Default payload size limit: 64 bytes (payload only). Contact support to request larger.

### Method(s)[​](#methods-2)

To Signal a message:

```
`1pubnub.signal({  
2    message: string,  
3    channel: string,  
4    customMessageType: string,  
5}): PromiseSignalResponse>;  
`
```

Parameters
- message (required): string payload.
- channel (required): string channel ID.
- customMessageType: string; label with same constraints as publish.

### Sample code[​](#sample-code-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
1
  

```

### Response[​](#response-1)

```
`1type SignalResponse = {  
2    timetoken: number  
3}  
`
```

## Subscribe[​](#subscribe)

Creates an open TCP socket and listens for messages and events on specified entities. Initialize with subscribeKey. Configure retryConfiguration to auto-reconnect and best-effort catch-up.

- subscribe() only opens the connection; add event listeners to receive messages. Message objects include publisher (sender ID).

### Subscription scope[​](#subscription-scope)

- subscription: entity-scoped (e.g., a channel).
- subscriptionSet: client-scoped (multiple subscriptions on a PubNub instance). Sets can include one or more subscriptions.
- Adding subscriptions to an existing set auto-subscribes them.

### Create a subscription[​](#create-a-subscription)

Entity-level subscription for a single entity.

```
`1// entity-based, local-scoped  
2const channel = pubnub.channel('channel_1');  
3channel.subscription(subscriptionOptions)  
`
```

- subscriptionOptions: Subscription behavior configuration (see subscriptionOptions).

### Create a subscription set[​](#create-a-subscription-set)

Client-level set for multiple entities.

```
`1// client-based, general-scoped  
2pubnub.subscriptionSet({  
3    channels: string[],  
4    channelGroups: string[],  
5    subscriptionOptions: subscriptionOptions  
6}))  
`
```

- channels: string[]; channels to subscribe (channels or channelGroups required).
- channelGroups: string[]; channel groups to subscribe (channels or channelGroups required).
- subscriptionOptions: see below.

#### `subscriptionOptions`[​](#subscriptionoptions)

- receivePresenceEvents: boolean; deliver presence updates via listeners. See Presence Events to subscribe to presence channels.
- cursor: object; best-effort cached message retrieval from timetoken/region. cursor?: { timetoken?: string; region?: number }. Primitive types are converted; non-17-digit or non-numeric strings are ignored.

#### Modify a subscription set[​](#modify-a-subscription-set)

Add or remove subscriptions from an existing set; new additions are auto-subscribed.

### Method(s)[​](#methods-3)

`subscription` and `subscriptionSet` use the same subscribe().

#### Subscribe[​](#subscribe-1)

```
`1subscription.subscribe()  
2subscriptionSet.subscribe()  
`
```

##### Sample code[​](#sample-code-3)

```
1
  

```

##### Wildcard subscribe and message objects
Wildcard (e.g., sports.*) behaves like regular subscribe; add listeners to receive messages. Message objects include publisher (sender ID), channel (actual channel), and subscription (wildcard pattern).

##### Other examples[​](#other-examples-1)

###### Create a subscription set from 2 individual subscriptions[​](#create-a-subscription-set-from-2-individual-subscriptions)

```
1
  

```

###### Create a subscription set from 2 sets[​](#create-a-subscription-set-from-2-sets)

```
1
  

```

###### Add subscriptions to an existing set[​](#add-subscriptions-to-an-existing-set)

```
1
  

```

##### Returns[​](#returns)
subscribe() has no return value.

## Entities[​](#entities)

Subscribable objects to receive real-time updates:
- channel
- channelGroup
- userMetadata
- channelMetadata

### Create channels[​](#create-channels)

Returns a local channel entity.

```
`1pubnub.channel(string)  
`
```

- channel: string channel ID.

#### Sample code[​](#sample-code-4)

```
1
  

```

### Create channel groups[​](#create-channel-groups)

Returns a local channelGroup entity.

```
`1pubnub.channelGroup(string)  
`
```

- channel_group: string channel group name.

#### Sample code[​](#sample-code-5)

```
1
  

```

### Create channel metadata[​](#create-channel-metadata)

Returns a local channelMetadata entity.

```
`1pubnub.channelMetadata(string)  
`
```

- channelMetadata: string identifier of the channel metadata object.

#### Sample code[​](#sample-code-6)

```
1
  

```

### Create user metadata[​](#create-user-metadata)

Returns a local userMetadata entity.

```
`1pubnub.userMetadata(string)  
`
```

- userMetadata: string identifier of the user metadata object.

#### Sample code[​](#sample-code-7)

```
1
  

```

## Event listeners[​](#event-listeners)

Receive messages and events via a single listener. Attach to subscription, subscriptionSet, and (for connection status) the PubNub client.

### Add listeners[​](#add-listeners)

Implement multiple listeners with addListener() or event-specific listeners (message, file, etc.).

#### Method(s)[​](#methods-4)

```
1
  

```

#### Sample code[​](#sample-code-8)

```
1
  

```

##### Message object contains sender information
Listeners receive message objects that include: publisher (sender ID), message content, channel, timetoken, and metadata.

### Add connection status listener[​](#add-connection-status-listener)

Client-only listener to handle connection status updates.

##### Client scope
Available only on the PubNub object.

#### Method(s)[​](#methods-5)

```
1
  

```

#### Sample code[​](#sample-code-9)

```
1
  

```

#### Returns[​](#returns-1)
Returns subscription status. See SDK statuses.

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a subscription or a subscriptionSet.

### Method(s)[​](#methods-6)

```
1subscription.unsubscribe()  
2
  
3subscriptionSet.unsubscribe()  

```

### Sample code[​](#sample-code-10)

```
1
  

```

### Returns[​](#returns-2)
None

## Unsubscribe all[​](#unsubscribe-all)

Stop receiving updates from all data streams and remove associated entities.

##### Client scope
Only on the PubNub object.

### Method(s)[​](#methods-7)

```
`1pubnub.unsubscribeAll()  
`
```

### Sample code[​](#sample-code-11)

```
1
  

```

### Returns[​](#returns-3)
None