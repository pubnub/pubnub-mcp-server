# Publish/Subscribe API for JavaScript SDK

PubNub supports **Callbacks, Promises, and Async/Await** (recommended). With Async/Await, status is returned only on error—use `try...catch` to receive errors.

---

## Publish

`publish()` sends a message to all subscribers of a **single** channel (cannot publish to multiple channels at once). You must initialize PubNub with a **`publishKey`**. You don’t need to be subscribed to publish.

**Security**
- Enable TLS/SSL by setting `ssl: true` during initialization.
- Optional message encryption via Crypto Module.

**Message data**
- Any **JSON-serializable** value (objects/arrays/strings/numbers). Strings support UTF‑8.
- **Don’t JSON serialize** `message` or `meta`; PubNub serializes automatically.

**Limits / performance**
- Max size: **32 KiB** (includes escaped characters and channel name). Recommended: **< 1800 bytes**.
- Soft throughput limits: subscriber in-memory queue is **100 messages**; bursts can drop messages.
- Best practice: publish serially, verify success, retry failures, keep queue < 100, throttle bursts (example: ≤ 5 msg/sec).

**Custom message type**
- Optional `customMessageType` to label message (e.g., `text`, `action`, `poll`).

### Method(s)

To `Publish a message`, you can use the following method(s) in the JavaScript SDK:

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

*  requiredParameterDescription`message` *Type: anyDefault:  
n/aThe `message` may be any valid JSON type including objects, arrays, strings, and numbers.`channel` *Type: stringDefault:  
n/aSpecifies the `channel` ID to publish messages to.`storeInHistory`Type: booleanDefault:  
`true`If `true` the messages are stored in history.   
If `storeInHistory` is not specified, then the history configuration on the key is used.`sendByPost`Type: booleanDefault:  
`false`When `true`, the SDK uses HTTP POST to publish the messages. The message is sent in the BODY of the request, instead of the query string when HTTP GET is used. Also the messages are compressed thus reducing the size of the messages. Using HTTP POST to publish messages adheres to RESTful API best practices.`meta`Type: anyDefault:  
n/aPublish extra `meta` with the request.`ttl`Type: numberDefault:  
n/aSet a per message time to live in Message Persistence. 
1. $1
2. $1
3. $1
4. $1

`customMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Sample code

##### Reference code
Self-contained snippet with imports and console logging (used as a base for other examples).

#### Publish a message to a channel

```
1
  

```

```
1
  

```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (via Debug Console or separate script) as described in [Subscribe](#subscribe).

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

---

## Fire

`fire()` sends a message directly to **Functions event handlers** and **Illuminate** handlers registered on the target channel. Messages sent via `fire()`:
- **aren’t replicated to subscribers**
- **aren’t stored in history**
- handler can read request body

### Method(s)

To `Fire a message`, you can use the following method(s) in the JavaScript SDK:

```
`1fire({  
2    Object message,  
3    String channel,  
4    Boolean sendByPost,  
5    Object meta  
6})  
`
```

*  requiredParameterDescription`message` *Type: ObjectDefault:  
n/aThe `message` may be any valid JSON type including objects, arrays, strings, and numbers.`channel` *Type: StringDefault:  
n/aSpecifies `channel` ID to publish messages to.`sendByPost`Type: BooleanDefault:  
`false`If `true` the messages sent via POST.`meta`Type: ObjectDefault:  
n/aPublish extra `meta` with the request.

### Sample code

#### Fire a message to a channel

```
1
  

```

---

## Signal

`signal()` sends a signal to all subscribers of a channel.

- Default payload limit: **64 bytes** (payload only, not URI/headers). For larger payloads, contact support.

### Method(s)

To `Signal a message`, you can use the following method(s) in the JavaScript SDK:

```
`1pubnub.signal({  
2    message: string,  
3    channel: string,  
4    customMessageType: string,  
5}): PromiseSignalResponse>;  
`
```

*  requiredParameterDescription`message` *Type: stringThe `message` may be any valid JSON type including objects, arrays, strings, and numbers.`channel` *Type: stringSpecifies `channel` ID to send messages to.`customMessageType`Type: stringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

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

---

## Subscribe

`subscribe()` opens a persistent TCP connection and listens for updates on specified entities. You must initialize PubNub with a **`subscribeKey`**.

Key points:
- `subscribe()` **only opens the connection**; to receive messages/events you must add **event listeners**.
- Message objects delivered through listeners include sender ID in `publisher`.
- Configure `retryConfiguration` at initialization to auto-reconnect and best-effort retrieve available messages after disconnects.

### Subscription scope

Two ways to subscribe:
- **`subscription`**: created from an entity; scoped to that entity (e.g., a single channel).
- **`subscriptionSet`**: created from the PubNub client; scoped to the client; contains one or more subscriptions.

If you subscribe to a set and later add more subscriptions to it, they are **automatically subscribed**.

### Create a subscription

```
`1// entity-based, local-scoped  
2const channel = pubnub.channel('channel_1');  
3channel.subscription(subscriptionOptions)  
`
```

*  requiredParameterDescription`subscriptionOptions`Type: `subscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

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

*  requiredParameterDescription → `channels`Type: `string[]`Channels to subscribe to. Either `channels` or `channelGroups` is mandatory. → `channelGroups`Type: `string[]`Channel groups to subscribe to. Either `channels` or `channelGroups` is mandatory. → `subscriptionOptions`Type: `subscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

#### `subscriptionOptions`

`subscriptionOptions` is a class. Available properties include:

OptionTypeDescription`receivePresenceEvents`booleanWhether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`cursor`objectCursor from which to return any available cached messages. Message retrieval with cursor is not guaranteed and should only be considered a best-effort service. A cursor consists of a timetoken and region: `cursor?: { timetoken?: string; region?: number }`   
   
 If you pass any primitive type, the SDK converts them into `SubscriptionCursor` but if their value is not a 17-digit number or a string with numeric characters, the provided value will be ignored.

#### Modify a subscription set

Add/remove subscriptions to/from a set to create new sets; adding subscriptions to a subscribed set auto-subscribes them.

### Method(s)

`subscription` and `subscriptionSet` use the same `subscribe()` method.

#### Subscribe

To subscribe, you can use the following method in the JavaScript SDK:

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
Wildcard subscribe (for example `sports.*`) behaves like regular subscribe; you still need listeners. Message objects include:
- `publisher`: sender ID
- `channel`: actual channel name
- `subscription`: wildcard match

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
`subscribe()` has no return value.

---

## Entities

Entities are subscribable objects for real-time updates.

- `channel`
- `channelGroup`
- `userMetadata`
- `channelMetadata`

### Create channels

```
`1pubnub.channel(string)  
`
```

*  requiredParameterDescription`channel` *Type: `string`The ID of the [channel](/docs/general/channels/overview) to create a subscription of.

#### Sample code

```
1
  

```

### Create channel groups

```
`1pubnub.channelGroup(string)  
`
```

*  requiredParameterDescription`channel_group` *Type: `string`The name of the [channel group](/docs/general/channels/subscribe#channel-groups) to create a subscription of.

#### Sample code

```
1
  

```

### Create channel metadata

```
`1pubnub.channelMetadata(string)  
`
```

*  requiredParameterDescription`channelMetadata` *Type: `string`The String identifier of the [channel metadata](/docs/general/metadata/channel-metadata) object to create a subscription of.

#### Sample code

```
1
  

```

### Create user metadata

```
`1pubnub.userMetadata(string)  
`
```

*  requiredParameterDescription`userMetadata` *Type: `string`The String identifier of the [user metadata](/docs/general/metadata/users-metadata) object to create a subscription of.

#### Sample code

```
1
  

```

---

## Event listeners

Listeners are how your app receives messages, signals, and events. You can attach listeners to:
- `subscription`
- `subscriptionSet`
- PubNub client (connection status)

### Add listeners

You can implement multiple listeners with `addListener()` or register event-specific listeners (e.g., only `message` or `file`).

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

##### Message object contains sender information
Listener-delivered message objects include `publisher` (sender ID), plus content, channel, timetoken, and metadata.

### Add connection status listener

Client-scope (PubNub object only) listener for connection status updates.

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

#### Returns
Subscription status (see [SDK statuses](/docs/general/setup/connection-management#sdk-statuses)).

---

## Unsubscribe

Stop receiving updates from a `subscription` or `subscriptionSet`.

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

---

## Unsubscribe all

Stop receiving updates from **all** data streams and remove associated entities.

Client scope (PubNub object only).

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