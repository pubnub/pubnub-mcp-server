# Publish/Subscribe API for Java SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies the Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new PubNub client instantiation model, and changes async callbacks and emitted [status events](/docs/sdks/kotlin/status-events). Apps using versions < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

PubNub delivers messages globally in <30 ms. Publish to one or many subscribers.

For conceptual details, see [Connection Management](/docs/general/setup/connection-management) and [Publish Messages](/docs/general/messages/publish).

## Publish

Available in entities: Channel

`publish()` sends a JSON-serializable message to all subscribers of a channel. Messages are replicated globally and delivered to all clients subscribed to that channel.

- Prerequisites
  - Initialize PubNub with `publishKey` ([configuration](/docs/sdks/java/api-reference/configuration#configuration)).
  - Create a [Channel entity](/docs/sdks/java/entities/channel) to publish to.
  - You don't need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.

- Security
  - Enable TLS/SSL by setting `ssl: true` at initialization.
  - Optional message [encryption](/docs/sdks/java/api-reference/configuration#cryptomodule).

- Message data
  - Any JSON-serializable data (objects, arrays, integers, strings). Avoid special classes/functions.
  - Strings may include any UTF‑8 characters.
  - Don't JSON serialize `message` or `meta`; pass full objects and let the SDK serialize.

- Size
  - Max 32 KiB including escaped chars and channel name. Aim for <1,800 bytes for best latency. Over-limit returns “Message Too Large.” See [Message size limits](/docs/general/messages/publish#message-size-limit).

- Publish rate
  - Publish as fast as bandwidth allows; there’s a [soft throughput limit](/docs/general/setup/limits).
  - In-memory queue holds up to 100 messages per subscriber. Large bursts may drop earlier messages on slow subscribers.

- Custom message type
  - Optional `customMessageType` to label messages (for example, `text`, `action`, `poll`).

- Best practices
  - Publish serially; verify success (for example, `[1,"Sent","136074940..."]`) before sending next.
  - Retry on failure (`[0,"blah","<timetoken>"]`).
  - Keep in-memory queue <100 messages.
  - Throttle bursts (for example, ≤5 msgs/sec) per your latency needs.

### Method(s)

To publish to a channel, first create a [`Channel` entity](/docs/sdks/java/entities/channel).

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.publish(Object message)  
4    .shouldStore(Boolean)  
5    .meta(Object)  
6    .queryParam(HashMap)  
7    .usePOST(Boolean)  
8    .ttl(Integer);  
9    .customMessageType(String)  

```

Parameters:
- message (required)
  - Type: Object
  - Payload to send.
- shouldStore
  - Type: Boolean
  - Default: account default
  - Whether to store in history; if omitted, uses key’s history configuration.
- meta
  - Type: Object
  - Default: not set
  - Metadata for message filtering.
- queryParam
  - Type: HashMap<string,string>
  - Default: not set
  - Custom query params for analytics; overridden by reserved params (`uuid`, `instance_id`). Visible in Dashboard; never returned by server.
- usePOST
  - Type: Boolean
  - Default: false
  - Use POST to publish.
- ttl
  - Type: Integer
  - Per-message time-to-live for Message Persistence.
- customMessageType
  - Type: String
  - Case-sensitive, alphanumeric, length 3–50; dashes and underscores allowed; cannot start with special chars or `pn_`/`pn-`. Examples: `text`, `action`, `poll`.
- sync
  - Type: Command
  - Blocks thread; throws on error.
- async
  - Type: Consumer<Result>
  - `Consumer` of `PNPublishResult`.

### Sample code

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the publish example, either use the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script, [subscribe to the same channel](#subscribe).

### Other examples

#### Publish with metadata

```
1
  

```

#### Publishing JsonObject (Google GSON)

```
1
  

```

#### Publishing JsonArray (Google GSON)

```
1
  

```

#### Publishing JSONObject (org.json)

```
1
  

```

#### Publishing JSONArray (org.json)

```
1
  

```

#### Store the published message for 10 hours

```
1
  

```

### Response

`publish()` returns `PNPublishResult`:
- getTimetoken(): Long — timetoken (long) when the message was published.

## Fire

Available in entities: Channel

`fire()` sends a message to Functions event handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). It triggers handlers on the target channel. Not replicated to subscribers and not stored in history.

- Prerequisites
  - Initialize PubNub with `publishKey`.
  - Create a [Channel entity](/docs/sdks/java/entities/channel).
  - Messages sent via `fire()` aren’t replicated and aren’t stored.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.fire(Object message)  
4    .meta(Object)  
5    .usePOST(Boolean);  

```

Parameters:
- message (required)
  - Type: Object
  - Payload to send.
- meta
  - Type: Object
  - Default: not set
  - Metadata for filtering.
- usePOST
  - Type: Boolean
  - Default: false
  - Use POST to publish.
- sync
  - Type: Command
  - Blocks thread; throws on error.
- async
  - Type: Consumer<Result>
  - `Consumer` of `PNPublishResult`.

### Sample code

```
1
  

```

### Response

`fire()` returns `PNPublishResult`:
- getTimetoken(): Long — timetoken (long) when the message was published.

## Signal

Available in entities: Channel

`signal()` sends a lightweight signal to all channel subscribers.

- Prerequisites
  - Initialize PubNub with `publishKey`.
  - Create a [Channel entity](/docs/sdks/java/entities/channel).
  - Payload size limit: 64 bytes (excluding URI/headers). For larger payloads, [contact support](mailto:support@pubnub.com).

- Signal vs. Message
  - Payload size: Signals ≤64B; Messages ≤32KB.
  - Cost: Signals cheaper than messages.
  - Persistence: Signals cannot be stored; messages can be.
  - Push notifications: Signals cannot trigger; messages can.
  - Use cases: Signals for non-critical data (e.g., geolocation); messages for most use cases.
  - Metadata: Signals don’t support metadata; messages do.

Channel separation: Send signals and messages on separate channels for better recovery behavior.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.signal(Object message)  
4    .customMessageType(String);  

```

Parameters:
- message (required)
  - Type: Object
  - Payload to serialize and send (≤64B).
- customMessageType
  - Type: String
  - Case-sensitive, alphanumeric, length 3–50; dashes/underscores allowed; cannot start with special chars or `pn_`/`pn-`. Examples: `text`, `action`, `poll`.
- sync
  - Type: PNPublishResult
  - Executes call, blocks, throws on error.
- async
  - Type: Consumer<Result>
  - Executes asynchronously.

### Sample code

```
1
  

```

### Response

`signal()` returns `PNPublishResult`:
- getTimetoken(): Long — timetoken (long) when the signal was published.

## Subscribe

Opens a TCP socket and listens for messages and events on a specified entity or set of entities. Set `subscribeKey` during [initialization](/docs/sdks/java/api-reference/configuration#initialization). Configure [`retryConfiguration`](/docs/sdks/java/api-reference/configuration) to automatically reconnect after disconnects.

- Entities
  - [`Channel`](/docs/sdks/java/entities/channel)
  - [`ChannelGroup`](/docs/sdks/java/entities/channel-group)
  - [`UserMetadata`](/docs/sdks/java/entities/user-metadata)
  - [`ChannelMetadata`](/docs/sdks/java/entities/channel-metadata)

### Subscription scope

- [`Subscription`](#create-a-subscription): scoped to a single entity.
- [`SubscriptionSet`](#create-a-subscription-set): scoped to the client; may include one or more subscriptions.

One event listener receives all messages, signals, and events for subscribed entities. See [Event listeners](#event-listeners).

### Create a subscription

The `Subscription` implements [AutoCloseable](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html). Always call `Subscription.close()` to release resources.

An entity-level `Subscription` receives updates only for that entity.

```
1// Entity-based, local-scoped  
2
  
3channel.subscription(SubscriptionOptions options)  

```

Parameters:
- options
  - Type: `SubscriptionOptions`
  - Behavior configuration. Use `null` for defaults.

#### Sample code

```
1
  

```

### Create a subscription set

The `SubscriptionSet` implements [AutoCloseable](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html). Always call `SubscriptionSet.close()` when no longer needed.

A client-level `SubscriptionSet` receives updates for all entities in the set.

```
1// client-based, general-scoped  
2
  
3pubnub.subscriptionSetOf(  
4    SetString> channels,   
5    SetString> channelGroups,   
6    SubscriptionOptions options  
7)  

```

Parameters:
- channels
  - Type: `Set<String>`
  - Channel names; empty set for none.
- channelGroups
  - Type: `Set<String>`
  - Channel group names; empty set for none.
- options
  - Type: `SubscriptionOptions`
  - Behavior configuration; `EmptyOptions` by default.

Add/remove sets: You can add and remove subscription sets to create new sets. See [Other examples](#other-examples-1).

#### `SubscriptionOptions`

Optional modifiers:
- receivePresenceEvents()
  - Deliver presence updates for `userId`s. See [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).
- filter(predicate: (PNEvent) -> Boolean)
  - Custom filter for events delivered to the subscription.

#### Sample code

```
1
  

```

### Method(s)

`Subscription` and `SubscriptionSet` share the same subscribe methods.

- Subscribe
- Subscribe with timetoken

#### Subscribe

```
1
  

```

##### Sample code

```
1
  

```

##### Other examples

###### Create a subscription set and add/remove subscriptions

```
1
  

```

##### Returns

`subscribe()` has no return value.

#### Subscribe with timetoken

Subscribing with a timetoken overwrites the single server connection timetoken, impacting other subscriptions; they won’t deliver messages older than already delivered ones.

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameters:
- cursor (required)
  - Type: `SubscriptionCursor`
  - Typically includes a `timetoken` (long) representing the start point.

##### Sample code

```
1
  

```

##### Returns

No return value.

## Event listeners

Attach listeners to `Subscription`, `SubscriptionSet`, and (for connection status) the PubNub client. One listener can receive all messages, signals, and events.

### Add listeners

Handle multiple event types:

#### Method(s)

```
`1fun addListener(listener: EventListener)  
`
```

#### Sample code

```
1
  

```

Handle one event type:

#### Method(s)

Assign lambdas for specific event types (messages, signals, message actions, files, objects, presence). Only one listener per event type; assigning a new one overwrites the previous.

##### Sample code

```
1
  

```

##### Remove event listener

Assign `null` to remove a specific event listener.

```
`1subscription.setOnMessage(null);  
`
```

### Add connection status listener

Use `StatusListener` with your `PubNub` instance for connection status updates. Client scope only.

#### Method(s)

```
`1pubnub.addListener(object : StatusListener() {  
2    override fun status(pubnub: PubNub, status: PNStatus) {  
3        // Handle connection status updates  
4        println("Connection Status: ${status.category}")  
5    }  
6})  
`
```

#### Sample code

```
1
  

```

#### Returns

Emits various statuses depending on network connection. See [Status Events for Subscribe](/docs/sdks/java/status-events#subscribe) and [SDK Connection Lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

## Unsubscribe

Stop receiving updates from a `Subscription` or `SubscriptionSet`.

### Method(s)

```
1
  

```

### Sample code

```
1
  

```

### Returns

None

## Unsubscribe all

Stop receiving updates from all listeners and remove their associated entities. Client scope only.

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