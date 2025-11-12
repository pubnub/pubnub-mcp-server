# Publish/Subscribe API for JavaScript SDK

Send a message to one recipient or broadcast to many subscribers. For conceptual details, see Connection Management and Publish Messages.

##### Supported and recommended asynchronous patterns

- PubNub supports Callbacks, Promises, and Async/Await.
- Recommended: Async/Await. Use try...catch to receive status errors.

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - You don’t need to be subscribed to publish.
  - You can’t publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting `ssl: true` during initialization. Optional message encryption is available.
- Message data
  - Any JSON-serializable type (object, array, number, string). Don’t send special classes or functions. UTF‑8 strings supported.
  - Don’t JSON serialize the `message` and `meta` parameters—serialization is automatic.
- Size
  - Max message size: 32 KiB (including escaped characters and channel name). Aim for < 1,800 bytes for optimal performance. Exceeding the limit returns “Message Too Large”.
- Publish rate
  - Publish as fast as bandwidth allows; soft throughput limit applies. In-memory queue holds 100 messages; exceeding may cause drops.
- Custom message type
  - Optional `customMessageType` for business-specific labels (for example, `text`, `action`, `poll`).
- Best practices
  - Publish serially; verify success before sending the next.
  - On failure, retry.
  - Keep queue under 100 messages.
  - Throttle bursts (for example, ≤ 5 messages/second).

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
- channel (required, string): Channel ID to publish to.
- storeInHistory (boolean, default: true): If true, message is stored in history. If omitted, key-level history configuration applies.
- sendByPost (boolean, default: false): If true, uses HTTP POST (message in body, compressed).
- meta (any): Extra metadata to publish with the request.
- ttl (number): Per-message time to live in Message Persistence.
- customMessageType (string): Case-sensitive, alphanumeric 3–50 chars; dashes/underscores allowed; cannot start with special characters or with `pn_`/`pn-`. Examples: `text`, `action`, `poll`.

### Sample code[​](#sample-code)

##### Reference code

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
1
  

```

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (in a separate process or via Debug Console).

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

Sends a message directly to Functions event handlers and Illuminate on a channel. Not replicated to subscribers and not stored in history.

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
- channel (String): Target channel ID.
- sendByPost (Boolean, default: false): If true, send via POST.
- meta (Object): Extra metadata.

### Sample code[​](#sample-code-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
1
  

```

## Signal[​](#signal)

Sends a low-latency signal to channel subscribers. Default payload size limit: 64 bytes (payload only).

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
- channel (string): Target channel ID.
- customMessageType (string): Same constraints as in publish.

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

Opens a socket and listens for messages/events. Requires `subscribeKey`.

- Add event listeners to receive messages; the message object includes the sender’s ID in `publisher`.
- Configure `retryConfiguration` to attempt reconnection and retrieve available messages after disconnects.

### Subscription scope[​](#subscription-scope)

- subscription: Entity-scoped (for example, a specific channel).
- subscriptionSet: Client-scoped; one set can include multiple subscriptions.

Adding subscriptions to an existing set auto-subscribes them.

### Create a subscription[​](#create-a-subscription)

```
`1// entity-based, local-scoped  
2const channel = pubnub.channel('channel_1');  
3channel.subscription(subscriptionOptions)  
`
```

- subscriptionOptions: See subscriptionOptions.

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

- channels (string[]): Channels to subscribe to. Either channels or channelGroups is required.
- channelGroups (string[]): Channel groups to subscribe to. Either channels or channelGroups is required.
- subscriptionOptions: See subscriptionOptions.

#### `subscriptionOptions`[​](#subscriptionoptions)

- receivePresenceEvents (boolean): Deliver presence updates via listeners.
- cursor (object): Best-effort retrieval cursor `{ timetoken?: string; region?: number }`. Non-numeric values ignored.

#### Modify a subscription set[​](#modify-a-subscription-set)

Add/remove subscriptions on an existing set; added subscriptions are auto-subscribed.

### Method(s)[​](#methods-3)

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

Wildcard (for example, `sports.*`) behaves like regular subscribe. Message objects include:
- publisher (sender ID)
- channel (actual channel)
- subscription (wildcard match)

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

Subscribable objects for real-time updates:

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

Attach listeners to subscription, subscriptionSet, and the PubNub client (for connection status). A single listener can receive messages, signals, and events. Message objects include `publisher`.

### Add listeners[​](#add-listeners)

#### Method(s)[​](#methods-4)

```
1
  

```

#### Sample code[​](#sample-code-8)

```
1
  

```

### Add connection status listener[​](#add-connection-status-listener)

Client scope only (PubNub object).

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

Stop receiving real-time updates from a subscription or subscriptionSet.

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

Stop all streams and remove associated entities. Client scope only.

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