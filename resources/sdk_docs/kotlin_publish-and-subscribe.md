# Publish/Subscribe API for Kotlin SDK

##### Breaking changes in v9.0.0
- Unified Java/Kotlin codebase, new PubNub client instantiation, updated async API callbacks and emitted status events. Apps using < 9.0.0 may be impacted.
- See Java/Kotlin SDK migration guide.

PubNub delivers sub-30 ms message delivery globally.

##### Request execution
Most method invocations return an Endpoint you must execute with .sync() or .async(); otherwise, nothing happens.

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

Available in entities: Channel

Sends a message to all channel subscribers. PubNub replicates and delivers to all subscribed clients.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Create a Channel entity to publish to.
  - Not required to be subscribed to publish.
  - Cannot publish to multiple channels simultaneously.

- Security
  - Enable TLS/SSL by setting ssl = true at initialization.
  - Optional message encryption via CryptoModule.

- Message data
  - Any JSON-serializable type (objects, arrays, numbers, strings; UTF‑8).
  - Don’t JSON serialize message or meta; pass objects directly.

- Size
  - Max 32 KiB (includes escaped chars and channel name). Aim for < ~1,800 bytes.
  - Exceeding returns “Message Too Large” error.

- Publish rate
  - Publish as fast as bandwidth allows. Subscribers have soft throughput limits; in-memory queue holds only 100 messages.

- Custom message type
  - Optional customMessageType: business-specific label like text, action, poll.

- Best practices
  - Publish serially, not concurrently.
  - Verify success return code before sending next.
  - Retry on failure.
  - Keep in-memory queue under 100 messages.
  - Throttle bursts (e.g., ≤ 5 msgs/sec) to meet latency needs.

### Method(s)
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
- message (required): Any. Message payload.
- shouldStore: Boolean. Store in history (falls back to keyset’s Message Persistence setting if not specified).
- meta: Any. Metadata for message filtering.
- queryParam: Map<String, String>. Custom analytics params; never returned in responses; overridden by reserved parameters.
- usePost: Boolean. Default false. Use HTTP POST.
- ttl: Integer. Per-message TTL for Message Persistence.
  1) shouldStore = true, ttl = 0 → store with no expiry.
  2) shouldStore = true, ttl = X → store with expiry X hours (unless keyset retention Unlimited).
  3) shouldStore = false → ttl ignored.
  4) Not specified → defaults to key expiry value.
- customMessageType: String. 3–50 chars, alphanumeric, dash and underscore allowed; cannot start with special chars or pn_/pn-.

### Sample code
```
1
```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (see Subscribe).

### Response
Returns PNPublishResult?
- timetoken: Long. Timetoken when published.

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

Available in entities: Channel

Sends a message to Functions event handlers and Illuminate. Not replicated to subscribers and not stored in history.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Create a Channel entity to fire to.
  - Not replicated to subscribers; not stored in history.

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
- message (required): Any. Payload.
- meta: Any. Metadata for filtering.
- usePost: Boolean. Default false. Use POST.

### Sample code
```
1
```

### Response
Returns PNPublishResult?
- timetoken: Long.

## Signal

Available in entities: Channel

Sends a signal to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Create a Channel entity.
  - Payload size limited to 64 bytes (excluding URI/headers). For larger payloads, contact support.

- Signal vs. Message
  - Payload size: Signal 64B; Message up to 32KB.
  - Cost: Signals lower cost.
  - Persistence: Signals not stored; Messages can be stored.
  - Push notifications: Signals cannot trigger; Messages can.
  - Use cases: Signals for non‑critical streams (e.g., geolocation).
  - Metadata: Signals do not support meta; Messages do.

Channel separation: Use separate channels for signals and messages for better recovery.

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
- message (required): Any. Payload.
- customMessageType: String. Same constraints as publish().

### Sample code
```
1
```

### Response
Returns PNPublishResult?
- timetoken: Long.

## Subscribe

Opens a TCP socket and listens for messages and events on specified entities. Set subscribeKey during initialization. Configure retryConfiguration for automatic reconnects.

Entities:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Subscription scope
- Subscription: created from an entity; scoped to that entity.
- SubscriptionSet: created from the PubNub client; scoped to the client and can include multiple subscriptions.
- Add event listeners to receive messages, signals, and events.

### Create a subscription

Managing subscription lifecycle: Subscription implements AutoCloseable. Call close() when done.

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
- options: SubscriptionOptions or null (no specific options).

### Create a subscription set

Managing subscription lifecycle: SubscriptionSet implements AutoCloseable. Call close() when done.

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
- channels: Set<String>. Use empty set for none.
- channelGroups: Set<String>. Use empty set for none.
- options: SubscriptionOptions. Defaults to EmptyOptions.

Add/remove sets: You can add/remove subscription sets to create new sets (see Other examples).

#### SubscriptionOptions
- EmptyOptions is default.
- receivePresenceEvents(): Deliver presence updates through listener streams. See Presence Events for more.
- filter(predicate: (PNEvent) -> Boolean): Custom event filtering for the subscription.

### Method(s)
Shared for Subscription and SubscriptionSet:
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

###### Create a subscription set from 2 individual subscriptions
```
1
```

##### Returns
No return value.

#### Subscribe with timetoken

Impact: Overwrites timetoken on the single server connection, affecting other subscriptions; they won’t deliver older messages than already delivered.

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameters:
- cursor (required): SubscriptionCursor (typically includes timetoken: Long).

##### Sample code
```
1
```

##### Returns
No return value.

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and connection status (PubNub client only).

### Add listeners

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

##### Method(s)
Assign lambda expressions directly to specific event types (message, signal, message action, file, objects, presence). Only one listener per event type; assigning a new one overwrites the previous.

##### Sample code
```
1
```

##### Remove event listener
Assign null to remove the listener.
```
1
```

### Add connection status listener

Client scope: Available only on PubNub object.

##### Method(s)
```
`1pubnub.addListener(object : StatusListener() {  
2    override fun status(pubnub: PubNub, status: PNStatus) {  
3        // Handle connection status updates  
4        println("Connection Status: ${status.category}")  
5    }  
6})  
`
```

##### Sample code
```
1
```

##### Returns
Emits various connection statuses. See Status Events for Subscribe and SDK Connection Lifecycle.

## Unsubscribe

Stop receiving updates from a Subscription or SubscriptionSet.

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

Client scope: Available only on PubNub object. Stops all listeners and removes associated entities.

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