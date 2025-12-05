# Publish/Subscribe API for Java SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new client instantiation approach, and changes async callbacks and status events. See Java/Kotlin SDK migration guide for details.

PubNub delivers messages worldwide in <30 ms. For concepts, see Connection Management and Publish Messages.

## Publish

Available in entities
- Channel

`publish()` sends a message to all subscribers on a channel. Messages replicate globally and deliver to all subscribed clients.

Prerequisites and limitations
- Initialize PubNub with publishKey.
- Create a Channel entity to publish to.
- You don’t need to be subscribed to publish.
- You can’t publish to multiple channels simultaneously.

Security
- Enable TLS/SSL by setting ssl=true during initialization.
- Optional message encryption (CryptoModule).

Message data
- Any JSON-serializable data (objects, arrays, numbers, strings). Avoid special classes/functions.
- Strings can include any UTF-8 characters.
- Don’t JSON serialize message or meta yourself; pass objects and the SDK will serialize.

Size
- Max 32 KiB including escaped chars and channel name. Aim for <1,800 bytes. Exceeding limit returns Message Too Large.

Publish rate
- Publish as fast as bandwidth allows. Soft throughput limits apply. In-memory queue stores only 100 messages; older messages may drop if subscribers can’t keep up.

Custom message type
- Optionally set customMessageType (examples: text, action, poll).

Best practices
- Publish to a channel serially (not concurrently).
- Verify success ([1,"Sent","136074940..."]) before sending next.
- On failure ([0,"blah","<timetoken>"]), retry.
- Keep in-memory queue under 100.
- Throttle bursts (for example, ≤5 msgs/sec).

### Method(s)

To publish to a channel, first create a Channel entity.

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
- message (required) Type: Object — Payload.
- shouldStore Type: Boolean, Default: account default — Store in history; if not set, key’s history config applies.
- meta Type: Object, Default: Not set — Meta object for filtering.
- queryParam Type: HashMap<String,String>, Default: Not set — Custom query params (for analytics). Overridden if conflicts with reserved params (uuid, instance_id). Accessible from Dashboard; not returned in responses.
- usePOST Type: Boolean, Default: false — Use POST to publish.
- ttl Type: Integer — Per-message time-to-live in Message Persistence.
- customMessageType Type: String — 3–50 chars, case-sensitive, alphanumeric; dashes and underscores allowed. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- sync Type: Command — Blocks; throws on error.
- async Type: Consumer<Result> — Consumer of PNPublishResult.

### Sample code

##### Reference code

#### Publish a message to a channel

```
1
  

```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (for example, in the Debug Console or a separate script).

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
`publish()` returns PNPublishResult:
- getTimetoken(): Long — Timetoken of when the message was published.

## Fire

Available in entities
- Channel

`fire()` sends a message to Functions event handlers and Illuminate on the target channel. Not replicated to subscribers and not stored in history.

Prerequisites and limitations
- Initialize PubNub with publishKey.
- Create a Channel entity.
- Not replicated to subscribers; not stored.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.fire(Object message)  
4    .meta(Object)  
5    .usePOST(Boolean);  

```

Parameters
- message (required) Type: Object — Payload.
- meta Type: Object, Default: Not set — Meta for filtering.
- usePOST Type: Boolean, Default: false — Use POST to publish.
- sync Type: Command — Blocks; throws on error.
- async Type: Consumer<Result> — Consumer of PNPublishResult.

### Sample code

```
1
  

```

### Response
`fire()` returns PNPublishResult:
- getTimetoken(): Long — Timetoken of when the message was published.

## Signal

Available in entities
- Channel

`signal()` sends a lightweight signal to all subscribers of a channel.

Prerequisites and limitations
- Initialize PubNub with publishKey.
- Create a Channel entity.
- Payload size limit: 64 bytes (contact support for larger needs).

Signal vs. Message
- Payload size: Signal 64B; Message up to 32KB
- Cost: Signals cost less
- Persistence: Signals cannot be saved; Messages can be saved (Message Persistence)
- Push Notifications: Signals cannot trigger; Messages can
- Use case: Signals for non-critical data (e.g., geolocation updates)
- Metadata: Signals don’t support metadata; Messages do

Channel separation
- Send signals and messages on separate channels to improve recovery.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.signal(Object message)  
4    .customMessageType(String);  

```

Parameters
- message (required) Type: Object — Payload to be serialized and sent.
- customMessageType Type: String — 3–50 chars, case-sensitive, alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- sync Type: PNPublishResult — Blocks; throws on error.
- async Type: Consumer<Result> — Executes asynchronously.

### Sample code

```
1
  

```

### Response
`signal()` returns PNPublishResult:
- getTimetoken(): Long — Timetoken of when the signal was published.

## Subscribe

Opens a TCP socket and listens for messages and events on specified entities. Set subscribeKey during initialization. Configure retryConfiguration for automatic reconnects after disconnects.

Entities
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Subscription scope
- Subscription: created from an entity; scoped to that entity (for example, one channel).
- SubscriptionSet: created from the PubNub client; scoped to the client; can include multiple subscriptions.

One event listener receives all messages, signals, and events for subscribed entities. See Event listeners.

### Create a subscription

Managing subscription lifecycle
- Subscription implements AutoCloseable. Always call Subscription.close() when done.

Entity-level Subscription receives updates only for the entity it was created for.

```
1// Entity-based, local-scoped  
2
  
3channel.subscription(SubscriptionOptions options)  

```

Parameters
- options Type: SubscriptionOptions — Subscription behavior configuration. Use null for defaults.

#### Sample code

```
1
  

```

### Create a subscription set

Managing subscription lifecycle
- SubscriptionSet implements AutoCloseable. Always call SubscriptionSet.close() when done.

Client-level SubscriptionSet receives events for all entities in the set.

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
- channels Type: Set<String> — Channel names. Use empty set for none.
- channelGroups Type: Set<String> — Channel group names. Use empty set for none.
- options Type: SubscriptionOptions — Additional configuration. Defaults to EmptyOptions.

Add/remove sets
- You can add/remove subscriptions in a set (see examples).

#### SubscriptionOptions
Configures subscription behavior. Defaults to EmptyOptions.
- receivePresenceEvents() — Deliver presence updates via listeners. See Presence Events.
- filter(predicate: (PNEvent) -> Boolean) — Custom filter for delivered events.

#### Sample code

```
1
  

```

### Method(s)

Subscription and SubscriptionSet share methods:

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
- subscribe() has no return value.

#### Subscribe with timetoken

Impact on other subscriptions
- Using a timetoken overwrites the single connection’s timetoken and affects all subscriptions. Subscriptions never deliver older events than already delivered; after any event, only future events are received.

To subscribe from a given timetoken:

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Parameters
- cursor (required) Type: SubscriptionCursor — Cursor for cached/available messages; typically includes timetoken (long) to start from.

##### Sample code

```
1
  

```

##### Returns
- No return value.

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and (status only) PubNub client to receive messages, signals, events, and connection status.

### Add listeners

Handle multiple event types

##### Method(s)

```
`1fun addListener(listener: EventListener)  
`
```

##### Sample code

```
1
  

```

Handle one event type

##### Method(s)
Assign lambdas for specific event types (Message, Signal, Message Action, File, Objects, Presence). Only one listener per event type; assigning a new one overwrites the previous.

##### Sample code

```
1
  

```

Remove event listener
- Assign null to remove a specific event listener.

```
`1subscription.setOnMessage(null);  
`
```

### Add connection status listener

Client scope
- Only available on the PubNub object.

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

Stop receiving updates from all listeners and remove associated entities.

Client scope
- Only available on the PubNub object.

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