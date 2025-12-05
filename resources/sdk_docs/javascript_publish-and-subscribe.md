# Publish/Subscribe API for JavaScript SDK

Low-latency global messaging with publish/subscribe, signals, and fire. Use Async/Await (recommended). Use try...catch to capture errors.

##### Supported and recommended asynchronous patterns

PubNub supports Callbacks, Promises, and Async/Await. Recommended: Async/Await with try...catch for error status.

## Publish[​](#publish)

`publish()` sends a message to all subscribers on a channel. Messages are replicated globally.

Key points:
- Initialize with publishKey.
- You don't need to subscribe to publish.
- Cannot publish to multiple channels simultaneously.
- Use TLS/SSL (ssl: true). Optional encryption via CryptoModule.
- Message data: any JSON-serializable type (objects, arrays, numbers, strings). Avoid special classes/functions.
- Don't JSON serialize: Pass full objects for message and meta; SDK handles serialization.
- Size: Max 32 KiB (payload + channel + escaped chars). Target < ~1,800 bytes for best performance. Oversize returns “Message Too Large”.
- Publish rate: As fast as bandwidth; soft throughput limits. In-memory queue ~100 messages per subscriber; throttle bursts.
- Optional customMessageType: string label like text, action, poll.
- Best practices:
  - Publish serially; wait for success before next.
  - Verify success return code; retry on failure.
  - Keep queue under 100; throttle (example: ≤5 msg/sec).

### Method(s)[​](#methods)

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
- message (required, any): Any JSON type.
- channel (required, string): Channel ID.
- storeInHistory (boolean, default true): Store in persistence; if omitted, key’s history setting applies.
- sendByPost (boolean, default false): Use HTTP POST; compresses body; RESTful best practice.
- meta (any): Extra metadata.
- ttl (number): Per-message TTL for persistence.
- customMessageType (string): 3–50 chars; alphanumeric, dashes, underscores; cannot start with special chars or pn_/pn- (examples: text, action, poll).

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

Before publishing, subscribe to the target channel and add listeners to receive messages.

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

Sends a message to Functions event handlers and Illuminate on a channel. Not delivered to subscribers and not stored in history.

### Method(s)[​](#methods-1)

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
- message (Object): Any JSON type.
- channel (String): Target channel.
- sendByPost (Boolean, default false): Send via POST.
- meta (Object): Extra metadata.

### Sample code[​](#sample-code-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
1
  

```

## Signal[​](#signal)

Sends a lightweight signal to channel subscribers.

- Payload limit: 64 bytes (payload only). Contact support to increase.

### Method(s)[​](#methods-2)

```
`1pubnub.signal({  
2    message: string,  
3    channel: string,  
4    customMessageType: string,  
5}): PromiseSignalResponse>;  
`
```

Parameters:
- message (string): Signal payload.
- channel (string): Target channel.
- customMessageType (string): 3–50 chars; alphanumeric, dashes, underscores; cannot start with special chars or pn_/pn- (examples: text, action, poll).

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

Opens a persistent connection to receive messages and events for specified entities. Initialize with subscribeKey.

Notes:
- Newly subscribed clients receive messages after subscribe() completes.
- retryConfiguration can attempt reconnection and best-effort catch-up.
- subscribe() only opens the connection; you must add event listeners to receive messages. Message objects include publisher (sender ID).

### Subscription scope[​](#subscription-scope)

- subscription: entity-level (e.g., one channel).
- subscriptionSet: client-level; includes one or more subscriptions; single event listener handles all.

Adding to an existing subscribed set auto-subscribes new entries.

### Create a subscription[​](#create-a-subscription)

```
`1// entity-based, local-scoped  
2const channel = pubnub.channel('channel_1');  
3channel.subscription(subscriptionOptions)  
`
```

- subscriptionOptions (subscriptionOptions): Behavior configuration.

### Create a subscription set[​](#create-a-subscription-set)

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
- channels (string[]): Channels to subscribe. Require channels or channelGroups.
- channelGroups (string[]): Channel groups. Require channels or channelGroups.
- subscriptionOptions (subscriptionOptions): Behavior configuration.

#### `subscriptionOptions`[​](#subscriptionoptions)

- receivePresenceEvents (boolean): Deliver presence updates via listeners.
- cursor (object): Best-effort cached message retrieval from timetoken/region. Structure: cursor?: { timetoken?: string; region?: number }. Non-17-digit numeric or non-numeric strings are ignored.

#### Modify a subscription set[​](#modify-a-subscription-set)

Add or remove subscriptions from a set. New subscriptions are auto-subscribed if the set is active.

### Method(s)[​](#methods-3)

`subscription` and `subscriptionSet` both use subscribe().

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

Wildcard (e.g., sports.*) works like regular subscribe; add listeners. Message object includes:
- publisher: sender ID
- channel: actual channel name
- subscription: wildcard pattern matched

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

No return value.

## Entities[​](#entities)

Subscribable objects that emit real-time updates:

- channel
- channelGroup
- userMetadata
- channelMetadata

### Create channels[​](#create-channels)

```
`1pubnub.channel(string)  
`
```

- channel (string): Channel ID.

#### Sample code[​](#sample-code-4)

```
1
  

```

### Create channel groups[​](#create-channel-groups)

```
`1pubnub.channelGroup(string)  
`
```

- channel_group (string): Channel group name.

#### Sample code[​](#sample-code-5)

```
1
  

```

### Create channel metadata[​](#create-channel-metadata)

```
`1pubnub.channelMetadata(string)  
`
```

- channelMetadata (string): Channel metadata identifier.

#### Sample code[​](#sample-code-6)

```
1
  

```

### Create user metadata[​](#create-user-metadata)

```
`1pubnub.userMetadata(string)  
`
```

- userMetadata (string): User metadata identifier.

#### Sample code[​](#sample-code-7)

```
1
  

```

## Event listeners[​](#event-listeners)

Attach listeners to subscription, subscriptionSet, or PubNub client (for connection status) to receive messages, signals, files, presence, etc.

### Add listeners[​](#add-listeners)

Supports multiple listeners and event-specific listeners (message, file, etc.).

#### Method(s)[​](#methods-4)

```
1
  

```

#### Sample code[​](#sample-code-8)

```
1
  

```

##### Message object contains sender information

Listener message objects include publisher (sender ID), message content, channel name, timetoken, and metadata.

### Add connection status listener[​](#add-connection-status-listener)

Client-only listener for connection status.

##### Client scope

Available only on the PubNub client.

#### Method(s)[​](#methods-5)

```
1
  

```

#### Sample code[​](#sample-code-9)

```
1
  

```

#### Returns[​](#returns-1)

Subscription status (see SDK statuses).

## Unsubscribe[​](#unsubscribe)

Stop receiving updates from a subscription or subscriptionSet.

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

Stop all streams and remove associated entities.

##### Client scope

Available only on the PubNub client.

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