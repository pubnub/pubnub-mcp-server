# Publish/Subscribe API for Java SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and [Java](/docs/sdks/java) SDKs, changes client instantiation, async callbacks, and emitted [status events](/docs/sdks/kotlin/status-events). See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

PubNub delivers messages worldwide in <30 ms. For concepts, see [Connection Management](/docs/general/setup/connection-management) and [Publish Messages](/docs/general/messages/publish).

## Publish

Available in entities
Channel

`publish()` sends a message to all channel subscribers. PubNub replicates globally and delivers to all subscribed clients on that channel.

- Prerequisites
  - Initialize with `publishKey` in [configuration](/docs/sdks/java/api-reference/configuration#configuration).
  - Create a [Channel entity](/docs/sdks/java/entities/channel).
  - You don't need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting `ssl: true` during [initialization](/docs/sdks/java/api-reference/configuration).
  - Optional message [encryption](/docs/sdks/java/api-reference/configuration#cryptomodule).
- Message data
  - Any JSON-serializable data (objects, arrays, integers, strings). Strings may include any UTF‑8 chars.
  - Don't JSON-serialize `message` or `meta`; the SDK serializes automatically.
- Size
  - Max 32 KiB including escaped chars and channel name. Aim <1,800 bytes for best performance.
  - Oversize returns `Message Too Large`. See [limits](/docs/general/messages/publish#message-size-limit).
- Publish rate
  - Soft throughput limits; in-memory subscriber queue holds 100 messages. Excess may drop if subscribers lag.
- Custom message type
  - Optional `customMessageType` to label messages (for example `text`, `action`, `poll`).
- Best practices
  - Publish serially; verify success (for example, `[1,"Sent","136074940..."]`).
  - On failure (`[0,"blah","<timetoken>"]`), retry.
  - Keep in-memory queue <100; throttle bursts (for example, ≤5 msgs/sec).

### Method(s)

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

Parameters
- message (required)
  - Type: Object
  - The payload.
- shouldStore
  - Type: Boolean
  - Default: account default
  - Store in history. If omitted, the key’s history configuration applies.
- meta
  - Type: Object
  - Default: Not set
  - Metadata for server-side filtering.
- queryParam
  - Type: HashMap<string,string>
  - Default: Not set
  - Custom query params for analytics. Overridden if conflicting with reserved params (for example, `uuid`, `instance_id`). Accessible in the PubNub Dashboard; not returned in responses.
- usePOST
  - Type: Boolean
  - Default: false
  - Use POST to publish.
- ttl
  - Type: Integer
  - Default: n/a
  - Per-message time-to-live for Message Persistence.
- customMessageType
  - Type: String
  - Default: n/a
  - Case-sensitive, alphanumeric, 3–50 chars. `-` and `_` allowed. Cannot start with special chars or `pn_`/`pn-`. Examples: `text`, `action`, `poll`.
- sync
  - Type: Command
  - Blocks thread; throws on error.
- async
  - Type: Consumer<Result> of PNPublishResult

### Sample code

##### Reference code
Use as a runnable template with imports and console logging.

#### Publish a message to a channel

```
1
  
```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (for example, with the [Debug Console](https://www.pubnub.com/docs/console/) or a separate script).

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
- getTimetoken() -> Long: Timetoken when the message was published.

## Fire

Available in entities
Channel

Sends a message to Functions event handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources) on a channel. Not replicated to subscribers and not stored in history.

- Prerequisites
  - Initialize with `publishKey`.
  - Create a [Channel entity](/docs/sdks/java/entities/channel).
- Behavior
  - Not replicated; subscribers won’t receive it.
  - Not stored in history.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.fire(Object message)  
4    .meta(Object)  
5    .usePOST(Boolean);  
```

Parameters
- message (required)
  - Type: Object
  - The payload.
- meta
  - Type: Object
  - Default: Not set
  - Metadata for filtering.
- usePOST
  - Type: Boolean
  - Default: false
  - Use POST to publish.
- sync
  - Type: Command
  - Blocks thread; throws on error.
- async
  - Type: Consumer<Result> of PNPublishResult

### Sample code

```
1
  
```

### Response
`fire()` returns `PNPublishResult`:
- getTimetoken() -> Long: Timetoken when the message was published.

## Signal

Available in entities
Channel

Sends a lightweight signal to all subscribers of a channel.

- Prerequisites
  - Initialize with `publishKey`.
  - Create a [Channel entity](/docs/sdks/java/entities/channel).
- Limitations
  - Payload size limited to 64 bytes (excluding URI/headers). For larger sizes, [contact support](mailto:support@pubnub.com).
- Signal vs. Message
  - Payload size: Signals 64B; Messages up to 32KB.
  - Cost: Signals cheaper than messages.
  - Persistence: Signals aren’t persisted; messages can be.
  - Push Notifications: Signals can’t trigger; messages can.
  - Use cases: Signals for non-critical (for example, geolocation pings); messages for all use cases.
  - Metadata: Signals don’t support metadata; messages do.
- Channel separation
  - Send signals and messages on separate channels to improve recovery.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.signal(Object message)  
4    .customMessageType(String);  
```

Parameters
- message (required)
  - Type: Object
  - The payload to serialize and send.
- customMessageType
  - Type: String
  - Same constraints as in Publish: 3–50 chars, alphanumeric, `-`/`_` allowed, not starting with special chars or `pn_`/`pn-`.
- sync
  - Type: PNPublishResult
  - Executes call, blocks; throws on error.
- async
  - Type: Consumer<Result>
  - Executes call asynchronously.

### Sample code

```
1
  
```

### Response
`signal()` returns `PNPublishResult`:
- getTimetoken() -> Long: Timetoken when the signal was published.

## Subscribe

Opens a TCP socket and listens for messages and events on entities. Set `subscribeKey` during [initialization](/docs/sdks/java/api-reference/configuration#initialization). Configure `retryConfiguration` to auto-reconnect.

Entities you can subscribe to:
- [`Channel`](/docs/sdks/java/entities/channel)
- [`ChannelGroup`](/docs/sdks/java/entities/channel-group)
- [`UserMetadata`](/docs/sdks/java/entities/user-metadata)
- [`ChannelMetadata`](/docs/sdks/java/entities/channel-metadata)

One event listener receives all messages/signals/events for the subscribed entities. See [Event listeners](#event-listeners).

### Subscription scope
- [`Subscription`](#create-a-subscription): created from an entity; scoped to that entity.
- [`SubscriptionSet`](#create-a-subscription-set): created from the client; scoped to the client; includes one or more subscriptions.

### Create a subscription

Managing subscription lifecycle
- `Subscription` implements AutoCloseable. Always call `Subscription.close()` to unsubscribe and remove listeners.

Entity-level subscription handles messages/events for that specific entity.

```
1// Entity-based, local-scoped  
2
  
3channel.subscription(SubscriptionOptions options)  
```

Parameters
- options
  - Type: `SubscriptionOptions`
  - Use `null` for defaults.

#### Sample code

```
1
  
```

### Create a subscription set

Managing subscription lifecycle
- `SubscriptionSet` implements AutoCloseable. Always call `SubscriptionSet.close()` to unsubscribe and remove listeners.

Client-level `SubscriptionSet` handles messages/events for all entities in the set.

```
1// client-based, general-scoped  
2
  
3pubnub.subscriptionSetOf(  
4    SetString> channels,   
5    SetString> channelGroups,   
6    SubscriptionOptions options  
7)  
```

Parameters
- channels
  - Type: Set<String>
  - Channels to subscribe to. Use empty set for none.
- channelGroups
  - Type: Set<String>
  - Channel groups to subscribe to. Use empty set for none.
- options
  - Type: SubscriptionOptions
  - Additional behavior; defaults to `EmptyOptions` if not set.

Add/remove sets
- You can add and remove subscription sets dynamically. See [Other examples](#other-examples-1).

#### `SubscriptionOptions`
Configures subscription behaviors; defaults to `EmptyOptions` if none specified.

Options
- receivePresenceEvents()
  - Deliver presence updates for `userId`s. See [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).
- filter(predicate: (PNEvent) -> Boolean)
  - Custom filter for events delivered to the subscription.

#### Sample code

```
1
  
```

### Method(s)

Both `Subscription` and `SubscriptionSet` expose:

- [Subscribe](#subscribe-1)
- [Subscribe with timetoken](#subscribe-with-timetoken)

#### Subscribe
Use the following method:

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
No return value.

#### Subscribe with timetoken

Impact on other subscriptions
- Overwrites the single-connection timetoken, affecting all subscriptions. Subscriptions won’t deliver messages older than those already delivered; after an event, only future events are delivered.

To subscribe from a specific timetoken:

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameters
- cursor (required)
  - Type: SubscriptionCursor
  - Typically includes a `timetoken` (long) from which to receive updates.

##### Sample code

```
1
  
```

##### Returns
No return value.

## Event listeners

Attach listeners to `Subscription`, `SubscriptionSet`, and (for connection status) the `PubNub` client.

### Add listeners

Handle multiple event types via a general listener.

##### Method(s)

```
`1fun addListener(listener: EventListener)  
`
```

##### Sample code

```
1
  
```

#### Handle one event type

You can register per-event-type listeners by assigning lambdas on the subscription. Only one listener per event type is supported; assigning a new one overwrites the previous.

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

Use `StatusListener` on the `PubNub` client to receive connection status updates.

Client scope
- Available only on the PubNub object.

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
Emits various statuses depending on network conditions. See [Status Events for Subscribe](/docs/sdks/java/status-events#subscribe) and [SDK Connection Lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

## Unsubscribe

Stop receiving real-time updates from a `Subscription` or `SubscriptionSet`.

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

Stop receiving updates from all listeners and remove associated entities.

Client scope
- Only on the PubNub object.

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