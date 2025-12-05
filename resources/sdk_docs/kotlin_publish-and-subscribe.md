# Publish/Subscribe API for Kotlin SDK

##### Breaking changes in v9.0.0

Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new client instantiation model, and changes async API callbacks and emitted status events. These changes may impact apps built with versions < 9.0.0. See Java/Kotlin SDK migration guide.

PubNub delivers messages in <30 ms. For conceptual info, see Connection Management and Publish Messages.

##### Request execution

Most SDK method calls return an Endpoint. You must call .sync() or .async() on the Endpoint to execute the request.

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

## Publish[​](#publish)

Available in entities
- Channel

publish() sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize with publishKey.
  - Create a Channel entity to publish to.
  - You don't have to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl = true during initialization.
  - Optional message encryption via CryptoModule.
- Message data
  - Any JSON-serializable data (objects, arrays, integers, strings). Avoid special classes/functions.
  - Don't JSON serialize: Pass message and meta as objects; SDK serializes automatically.
- Size
  - Max 32 KiB (includes escaped chars and channel name). Aim < ~1,800 bytes. Over-limit returns Message Too Large.
- Publish rate
  - Soft throughput limit; in-memory queue holds 100 messages. Large bursts can drop messages if subscribers lag.
- Custom message type
  - Optional customMessageType (e.g., text, action, poll).
- Best practices
  - Publish serially, verify success code, publish next only on success.
  - Retry on failure.
  - Keep in-memory queue < 100 messages.
  - Throttle bursts (e.g., ≤5 msg/s) to meet latency needs.

### Method(s)[​](#methods)

Create a Channel entity, then call publish:

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

Parameters
- message (required): Any. The payload.
- shouldStore: Boolean. Default: account default. Store message in history. If not specified, storage depends on Message Persistence enablement.
- meta: Any. Default: not set. Metadata object for filtering.
- queryParam: Map<String, String>. Default: not set. Additional query params (analytics). Overridden on conflict with reserved params. Visible in Admin Portal, never returned in responses.
- usePost: Boolean. Default: false. Use HTTP POST.
- ttl: Integer. Per-message TTL in hours for Message Persistence.
  1. If shouldStore = true and ttl = 0: stored with no expiry.
  2. If shouldStore = true and ttl = X: stored with expiry X hours (unless retention Unlimited).
  3. If shouldStore = false: ttl ignored.
  4. If ttl not specified: defaults to key expiry value.
- customMessageType: String. Case-sensitive, alphanumeric, 3–50 chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (Debug Console or separate script).

### Response[​](#response)

publish() returns PNPublishResult?:
- timetoken: Long. Timetoken when the message was published.

### Other examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
1
  

```

#### Publishing JsonArray (Google GSON)[​](#publishing-jsonarray-google-gson)

```
1
  

```

#### Publishing JSONObject (org.json)[​](#publishing-jsonobject-orgjson)

```
1
  

```

#### Publishing JSONArray (org.json)[​](#publishing-jsonarray-orgjson)

```
1
  

```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
1
  

```

## Fire[​](#fire)

Available in entities
- Channel

fire() sends a message to Functions event handlers and Illuminate. Messages go directly to handlers on the channel, are not replicated to subscribers, and are not stored in history.

- Prerequisites and limitations
  - Initialize with publishKey.
  - Create a Channel entity to fire to.
  - Not replicated to subscribers; not stored in history.

### Method(s)[​](#methods-1)

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.fire(  
4    message: Any,  
5    meta: Any,  
6    usePost: Boolean,  
7).async { result -> /* check result */ }  

```

Parameters
- message (required): Any. The payload.
- meta: Any. Metadata object for filtering.
- usePost: Boolean. Default: false. Use POST.

### Sample code[​](#sample-code-1)

```
1
  

```

### Response[​](#response-1)

fire() returns PNPublishResult?:
- timetoken: Long. Timetoken when the message was published.

## Signal[​](#signal)

Available in entities
- Channel

signal() sends a signal to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize with publishKey.
  - Create a Channel entity to signal to.
  - Payload size limit: 64 bytes (without URI/headers). Contact support for larger needs.
- Signal vs. Message
  - Payload size: signals 64B; messages up to 32KB.
  - Cost: signals cost less.
  - Persistence: signals cannot be stored; messages can be stored/accessed.
  - Push notifications: signals cannot trigger push; messages can.
  - Use cases: signals best for non-critical/low-latency (e.g., geolocation); messages suit both.
  - Metadata: signals do not support meta; messages do.
- Channel separation
  - Send signals and messages on separate channels for better recovery.

### Method(s)[​](#methods-2)

```
1val channel = pubnub.channel("myChannel")  
2
  
3channel.signal(  
4    message: Any,  
5    customMessageType: String  
6).async { result -> }  

```

Parameters
- message (required): Any. The payload.
- customMessageType: String. Case-sensitive, alphanumeric, 3–50 chars; dashes/underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-2)

```
1
  

```

### Response[​](#response-2)

signal() returns PNPublishResult?:
- timetoken: Long. Timetoken when the signal was published.

## Subscribe[​](#subscribe)

Opens a socket and listens for messages/events. Set subscribeKey during initialization. See Subscriptions for conceptual details.

Subscribe using:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

After subscribe(), client receives new messages. Configure retryConfiguration to reconnect after disconnects.

### Subscription scope[​](#subscription-scope)

- Subscription: created from an entity; scoped to that entity.
- SubscriptionSet: created from the client; scoped to the client; can include multiple subscriptions.
- A single event listener is used to receive messages/signals/events. See Event listeners.

### Create a subscription[​](#create-a-subscription)

Subscription implements AutoCloseable. Always call close() when done.

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

Parameter
- options: SubscriptionOptions. Use null for no options.

### Create a subscription set[​](#create-a-subscription-set)

SubscriptionSet implements AutoCloseable. Always call close() when done.

```
1// client-based, general-scoped  
2
  
3pubnub.subscriptionSetOf(  
4    channels: SetString>,  
5    channelGroups: SetString>,  
6    options: SubscriptionOptions  
7)  

```

Parameters
- channels: Set<String>. Channels to subscribe to. Use empty set for none.
- channelGroups: Set<String>. Channel groups to subscribe to. Use empty set for none.
- options: SubscriptionOptions. Additional configuration. If unset, EmptyOptions is used.

Add/remove sets: you can create new sets by adding/removing. See Other examples.

#### SubscriptionOptions[​](#subscriptionoptions)

Optional modifiers; EmptyOptions by default.
- receivePresenceEvents(): deliver presence updates via listener streams.
- filter(predicate: (PNEvent) -> Boolean): custom event filtering for the subscription.

### Method(s)[​](#methods-3)

Both Subscription and SubscriptionSet use the same methods:
- Subscribe
- Subscribe with timetoken

#### Subscribe[​](#subscribe-1)

```
1
  

```

##### Sample code[​](#sample-code-3)

```
1
  

```

##### Other examples[​](#other-examples-1)

###### Create a subscription set from 2 individual subscriptions[​](#create-a-subscription-set-from-2-individual-subscriptions)

```
1
  

```

##### Returns[​](#returns)

subscribe() has no return value.

#### Subscribe with timetoken[​](#subscribe-with-timetoken)

- Impact on other subscriptions: subscribing with a timetoken overwrites the single connection timetoken; other subscriptions won’t deliver messages older than those already delivered.

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameter
- cursor (required): SubscriptionCursor, typically with timetoken (Long) from which to receive updates.

##### Sample code[​](#sample-code-4)

```
1
  

```

##### Returns[​](#returns-1)

No return value.

## Event listeners[​](#event-listeners)

Receive messages and events via listeners attached to Subscription, SubscriptionSet, and (for connection status) the PubNub client.

### Add listeners[​](#add-listeners)

You can handle multiple event types with a general listener or attach listeners for specific types (Message, File, etc.).

#### Handle multiple event types[​](#handle-multiple-event-types)

##### Method(s)[​](#methods-4)

```
`1fun addListener(listener: EventListener)  
`
```

##### Sample code[​](#sample-code-5)

```
1
  

```

#### Handle one event type[​](#handle-one-event-type)

#### Method(s)[​](#methods-5)

Assign lambdas directly to handle specific event types (messages, signals, message actions, files, objects, presence). Only one listener per event type via this method; assigning a new one overwrites the previous.

##### Sample code[​](#sample-code-6)

```
1
  

```

##### Remove event listener[​](#remove-event-listener)

Assign null to remove a specific event listener.

```
1
  

```

### Add connection status listener[​](#add-connection-status-listener)

Use StatusListener on PubNub to receive connection status updates.

##### Client scope

Only available on the PubNub object.

#### Method(s)[​](#methods-6)

```
`1pubnub.addListener(object : StatusListener() {  
2    override fun status(pubnub: PubNub, status: PNStatus) {  
3        // Handle connection status updates  
4        println("Connection Status: ${status.category}")  
5    }  
6})  
`
```

#### Sample code[​](#sample-code-7)

```
1
  

```

#### Returns[​](#returns-2)

Emits various connection statuses. See Status Events for Subscribe and SDK Connection Lifecycle.

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a Subscription or a SubscriptionSet.

### Method(s)[​](#methods-7)

```
1
  

```

### Sample code[​](#sample-code-8)

```
1
  

```

### Returns[​](#returns-3)

None

## Unsubscribe all[​](#unsubscribe-all)

Stop receiving real-time updates from all listeners and remove associated entities.

##### Client scope

Only available on the PubNub object.

### Method(s)[​](#methods-8)

```
1
  

```

### Sample code[​](#sample-code-9)

```
1
  

```

### Returns[​](#returns-4)

None