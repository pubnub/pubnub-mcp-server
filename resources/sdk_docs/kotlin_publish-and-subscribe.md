# Publish/Subscribe API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies the Kotlin and Java SDKs, introduces a new PubNub client instantiation, and changes asynchronous API callbacks and emitted status events. Apps built with earlier versions (< 9.0.0) may be impacted.

- See Java/Kotlin SDK migration guide and Status Events for details.

PubNub delivers messages globally in <30 ms. See Connection Management and Publish Messages for concepts.

##### Request execution

Most method invocations return an Endpoint. You must call .sync() or .async() to execute; otherwise, the operation will not run.

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

Send a message to all subscribers on a channel. PubNub replicates across POPs and delivers to subscribed clients.

- Prerequisites:
  - Initialize PubNub with publishKey.
  - Create a Channel entity to publish to.
  - You don’t need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security:
  - Enable TLS/SSL by setting ssl=true during initialization; optional message encryption via CryptoModule.
- Message data:
  - Any JSON-serializable data (objects, arrays, numbers, strings). Avoid special classes/functions.
  - Don’t JSON serialize message and meta; pass objects directly.
- Size:
  - Max 32 KiB (includes escaped chars and channel name). Aim < ~1,800 bytes. Exceeding returns Message Too Large.
- Publish rate:
  - Throughput is bandwidth-limited. In-memory subscriber queue stores only 100 messages; older messages may drop during bursts.
- Custom message type:
  - Optional customMessageType (e.g., text, action, poll).
- Best practices:
  - Publish serially; check success code; on failure, retry.
  - Keep queue under 100; throttle bursts (e.g., <=5 msgs/s).

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
- message (Any, required): Payload.
- shouldStore (Boolean, default: account default): Store in history depending on keyset Message Persistence.
- meta (Any, default: not set): Metadata for filtering.
- queryParam (Map<String, String>, default: not set): Custom analytics params; overridden by reserved PubNub params. Not returned in responses.
- usePost (Boolean, default: false): Use HTTP POST.
- ttl (Integer, default: n/a): Per-message TTL (hours) in persistence:
  1) shouldStore=true, ttl=0 → no expiry
  2) shouldStore=true, ttl=X → expires in X hours unless keyset retention is Unlimited
  3) shouldStore=false → ttl ignored
  4) ttl not specified → defaults to key expiry
- customMessageType (String, default: n/a): 3–50 chars, case-sensitive, alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-.

### Sample code

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (below) or use the Debug Console.

### Response

`publish()` returns PNPublishResult?:
- timetoken (Long): Publish timetoken.

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

Send a message directly to Functions event handlers and Illuminate on a channel. Not replicated to subscribers and not stored in history.

- Prerequisites:
  - Initialize with publishKey.
  - Create a Channel entity.
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
- message (Any, required): Payload.
- meta (Any, default: not set): Metadata for filtering.
- usePost (Boolean, default: false): Use POST.

### Sample code

```
1
  

```

### Response

`fire()` returns PNPublishResult?:
- timetoken (Long): Publish timetoken.

## Signal

Available in entities: Channel

Send a lightweight signal to all channel subscribers.

- Prerequisites:
  - Initialize with publishKey.
  - Create a Channel entity.
  - Payload size limit: 64 bytes (excluding URI/headers). For larger, contact support.
- Signal vs. Message:
  - Size: Signals 64B; Messages up to 32KB.
  - Cost: Signals cheaper.
  - Persistence: Signals not stored; Messages can be stored.
  - Push: Signals cannot trigger push; Messages can.
  - Use case: Signals for non-critical (e.g., geolocation), Messages for general use.
  - Metadata: Signals no meta; Messages support meta.
- Channel separation: Use separate channels for signals vs messages for better recovery.

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
- message (Any, required): Payload (<=64B).
- customMessageType (String): Same constraints as publish.

### Sample code

```
1
  

```

### Response

`signal()` returns PNPublishResult?:
- timetoken (Long): Signal timetoken.

## Subscribe

Open a TCP socket and listen for messages/events. Set subscribeKey during initialization. Configure retryConfiguration for reconnection.

Entities:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Subscription scope

- Subscription: Created from an entity; scoped to that entity.
- SubscriptionSet: Created from the PubNub client; scoped to the client; can include multiple subscriptions.
- Use event listeners to receive messages/signals/events.

### Create a subscription

The Subscription implements AutoCloseable; call close() when done.

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
- options (SubscriptionOptions): Behavior configuration; null for defaults.

### Create a subscription set

SubscriptionSet implements AutoCloseable; call close() when done.

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
- channels (Set<String>): Channels to subscribe; empty set allowed.
- channelGroups (Set<String>): Channel groups; empty set allowed.
- options (SubscriptionOptions): Behavior config; EmptyOptions by default.

Add/remove sets as needed.

#### SubscriptionOptions

Optional modifiers:
- receivePresenceEvents(): Deliver presence updates for userIds.
- filter(predicate: (PNEvent) -> Boolean): Custom event filtering.

### Method(s)

Subscription and SubscriptionSet use the same subscribe methods.

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

Returns: None.

#### Subscribe with timetoken

Subscribing with a timetoken overwrites the single connection’s timetoken and affects all subscriptions. Subscriptions won’t deliver events older than already delivered.

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameters:
- cursor (SubscriptionCursor, required): Typically includes a timetoken (Long) from which to receive updates.

##### Sample code

```
1
  

```

Returns: None.

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and connection status on the PubNub client to receive messages, signals, and events.

### Add listeners

Handle multiple event types:

#### Method(s)

```
`1fun addListener(listener: EventListener)  
`
```

##### Sample code

```
1
  

```

Handle one event type

#### Method(s)

You can assign lambdas to handle specific event types (message, signal, message actions, files, objects, presence). Only one listener per event type; assigning a new one overwrites the previous.

##### Sample code

```
1
  

```

Remove event listener

Assign null to remove a specific event listener.

```
1
  

```

### Add connection status listener

Client scope: Available only on the PubNub object.

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

##### Sample code

```
1
  

```

#### Returns

Emits connection statuses. See Status Events for Subscribe and SDK Connection Lifecycle for details.

## Unsubscribe

Stop receiving real-time updates from a Subscription or SubscriptionSet.

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

Client scope: Only on the PubNub object.

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