# Publish/Subscribe API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies Kotlin and [Java](/docs/sdks/java) SDKs, changes client instantiation, async callbacks, and emitted [status events](/docs/sdks/kotlin/status-events). Apps using < 9.0.0 may be affected. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

PubNub delivers messages worldwide in <30 ms. For concepts, see [Connection Management](/docs/general/setup/connection-management) and [Publish Messages](/docs/general/messages/publish).

##### Request execution

Most API calls return an Endpoint. You must call `.sync()` or `.async()` to execute.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## Publish

This method is available to use with the `Channel` entity. For more information, refer to [Channel](/docs/sdks/kotlin/entities/channel).

### Available in entities
Channel

`publish()` sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - Create a [Channel](/docs/sdks/kotlin/entities/channel) to publish to.
  - You don't have to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting `ssl = true` during [initialization](/docs/sdks/kotlin/api-reference/configuration). Optional [encryption](/docs/sdks/kotlin/api-reference/configuration#cryptomodule).
- Message data
  - Any JSON-serializable data (objects, arrays, numbers, strings). Avoid custom classes/functions.
  - Don't JSON serialize `message` or `meta`; the SDK handles serialization.
- Size
  - Max 32 KiB (includes escaped characters and channel name). Aim < ~1,800 bytes. Exceeding returns `Message Too Large`. See [limits](/docs/general/messages/publish#message-size-limit).
- Publish rate
  - Publish as fast as bandwidth allows; there is a [soft limit](/docs/general/setup/limits). In-memory queue stores only 100 messages; excess may drop if subscribers lag.
- Custom message type
  - Optional `customMessageType` to label messages (for example `text`, `action`, `poll`).
- Best practices
  - Publish serially; verify success; publish next only after success.
  - Retry on failure.
  - Keep queue <100 messages; throttle bursts (for example ≤5 msg/s).

### Method(s)

Create a [`Channel` entity](/docs/sdks/kotlin/entities/channel) and call:

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish(  
4    message: Any,  
5    shouldStore: Boolean,  
6    meta: Any,  
7    queryParam: MapString, String>,  
8    usePost: Boolean,  
9    ttl: Integer,  
10    customMessageType: String  
11).async { result -> /* check result */ }  
```

Parameters:
- message (required)
  - Type: Any. Default: n/a. The payload.
- shouldStore
  - Type: Boolean. Default: account default. Store in history if enabled for key.
- meta
  - Type: Any. Default: not set. Metadata for filtering.
- queryParam
  - Type: Map<String, String>. Default: not set. Custom query params (analytics). Overridden by reserved PubNub params. Not returned in responses.
- usePost
  - Type: Boolean. Default: false. Use HTTP POST.
- ttl
  - Type: Integer. Default: n/a. Time to live (hours) in Message Persistence.
    1. If shouldStore = true and ttl = 0 → stored, no expiry.
    2. If shouldStore = true and ttl = X → stored, expires in X hours (unless keyset retention is Unlimited).
    3. If shouldStore = false → ttl ignored.
    4. If ttl not specified → falls back to key’s expiry value.
- customMessageType
  - Type: String. Default: n/a. Case-sensitive 3–50 char alphanumeric; dashes and underscores allowed; cannot start with special chars or with `pn_`/`pn-`. Examples: `text`, `action`, `poll`.

### Sample code

##### Reference code
```
1
  
```

##### Subscribe to the channel

Before publishing, [subscribe to the same channel](#subscribe) (for example, using the [Debug Console](https://www.pubnub.com/docs/console/)).

### Response

`publish()` returns `PNPublishResult?`:
- timetoken: Long. Timetoken when the message was published.

### Other examples

#### Publish with metadata
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

## Fire

This method is available to use with the `Channel` entity. For more information, refer to [Channel](/docs/sdks/kotlin/entities/channel).

### Available in entities
Channel

`fire()` sends a message to Functions event handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources) on the target channel. Not replicated to subscribers and not stored.

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - Create a [Channel](/docs/sdks/kotlin/entities/channel).
  - Not replicated to subscribers; not stored.

### Method(s)

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.fire(  
4    message: Any,  
5    meta: Any,  
6    usePost: Boolean,  
7).async { result -> /* check result */ }  
```

Parameters:
- message (required)
  - Type: Any. Default: n/a. The payload.
- meta
  - Type: Any. Default: not set. Metadata for filtering.
- usePost
  - Type: Boolean. Default: false. Use POST.

### Sample code
```
1
  
```

### Response

`fire()` returns `PNPublishResult?`:
- timetoken: Long. Timetoken when the message was published.

## Signal

This method is available to use with the `Channel` entity. For more information, refer to [Channel](/docs/sdks/kotlin/entities/channel).

### Available in entities
Channel

`signal()` sends a lightweight signal to all channel subscribers.

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - Create a [Channel](/docs/sdks/kotlin/entities/channel).
  - Payload size max 64 bytes (excluding URI/headers). For larger, [contact support](mailto:support@pubnub.com).

- Signal vs. Message
  - Payload size: Signals 64B; Messages 32KB.
  - Cost: Signals cost less.
  - Persistence: Signals not stored; Messages can be stored.
  - Push: Signals cannot trigger push; Messages can.
  - Use cases: Signals for non-critical data (for example, location pings).
  - Metadata: Signals don’t support metadata; Messages do.

##### Channel separation

Send signals and messages on separate channels for better recovery.

### Method(s)

```
1val channel = pubnub.channel("myChannel")  
2
  
3channel.signal(  
4    message: Any,  
5    customMessageType: String  
6).async { result -> }  
```

Parameters:
- message (required)
  - Type: Any. Default: n/a. The payload (≤64B).
- customMessageType
  - Type: String. Default: n/a. Same constraints as Publish.

### Sample code
```
1
  
```

### Response

`signal()` returns `PNPublishResult?`:
- timetoken: Long. Timetoken when the signal was published.

## Subscribe

Opens a TCP socket and listens for messages and events. Set `subscribeKey` during [initialization](/docs/sdks/kotlin/api-reference/configuration#initialization). Configure [`retryConfiguration`](/docs/sdks/kotlin/api-reference/configuration) to auto-reconnect.

Entities you can subscribe to:
- [`Channel`](/docs/sdks/kotlin/entities/channel)
- [`ChannelGroup`](/docs/sdks/kotlin/entities/channel-group)
- [`UserMetadata`](/docs/sdks/kotlin/entities/user-metadata)
- [`ChannelMetadata`](/docs/sdks/kotlin/entities/channel-metadata)

### Subscription scope

- [`Subscription`](#create-a-subscription): created from an entity; scoped to that entity.
- [`SubscriptionSet`](#create-a-subscription-set): created from the client; scoped to the client; can include multiple subscriptions.

Events are delivered through listeners. See [Event listeners](#event-listeners).

### Create a subscription

##### Managing subscription lifecycle

`Subscription` implements AutoCloseable. Always call `Subscription.close()` when done.

```
1// Entity-based, local-scoped  
2
  
3// Specify the channel for subscription  
4val myChannel = pubnub.channel("channelName")  
5
  
6// Create subscription options, if any  
7val options = SubscriptionOptions.receivePresenceEvents()  
8
  
9// Return a Subscription object that is used to establish the subscription  
10val subscription = myChannel.subscription(options)  
11
  
12// Activate the subscription to start receiving events  
13subscription.subscribe()  
```

Parameters:
- options
  - Type: `SubscriptionOptions`. Use `null` for no specific options.

### Create a subscription set

##### Managing subscription lifecycle

`SubscriptionSet` implements AutoCloseable. Always call `SubscriptionSet.close()` when done.

```
1// client-based, general-scoped  
2
  
3pubnub.subscriptionSetOf(  
4    channels: SetString>,  
5    channelGroups: SetString>,  
6    options: SubscriptionOptions  
7)  
```

Parameters:
- channels: Set<String>. Empty set for none.
- channelGroups: Set<String>. Empty set for none.
- options: `SubscriptionOptions`. If not set, `EmptyOptions` is used.

##### Add/remove sets

You can add and remove subscription sets to create new sets. See [Other examples](#other-examples-1).

#### `SubscriptionOptions`

Optional modifiers for subscription behavior. Default: `EmptyOptions`.

- receivePresenceEvents()
  - Deliver presence updates for `userId`s. See [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).
- filter(predicate: (PNEvent) -> Boolean)
  - Filter events with a predicate for event-specific handling.

### Method(s)

Shared by `Subscription` and `SubscriptionSet`:
- [Subscribe](#subscribe-1)
- [Subscribe with timetoken](#subscribe-with-timetoken)

#### Subscribe

```
1
  
```

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

#### Subscribe with timetoken

##### Impact on other subscriptions

Subscribing with a timetoken overwrites the single connection’s timetoken, affecting all subscriptions. Subscriptions won’t deliver messages older than already delivered.

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameters:
- cursor (required)
  - Type: `SubscriptionCursor`. Typically includes a `timetoken` (Long) from which to receive updates.

##### Sample code
```
1
  
```

##### Returns

No return value.

## Event listeners

Attach listeners to `Subscription`, `SubscriptionSet`, and (for connection status) the PubNub client. Single point for messages, signals, and events.

### Add listeners

Handle multiple event types with a general listener, or attach dedicated listeners per event type (Message, File, Actions, Presence, etc.).

#### Handle multiple event types

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

#### Method(s)

Attach lambdas directly to a subscription for specific event types. Only one listener per event type; assigning a new one overwrites the previous.

##### Sample code
```
1
  
```

##### Remove event listener

Assign `null` to remove a specific event listener.
```
1
  
```

### Add connection status listener

Use `StatusListener` on the `PubNub` instance for connection updates. Client scope only.

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

Emits various statuses depending on network state. See [Status Events for Subscribe](/docs/sdks/kotlin/status-events#subscribe) and [SDK Connection Lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

## Unsubscribe

Stop receiving updates from a `Subscription` or a `SubscriptionSet`.

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

Stop receiving updates from all listeners and remove associated entities. Client scope only.

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