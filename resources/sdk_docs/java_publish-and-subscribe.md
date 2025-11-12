# Publish/Subscribe API for Java SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and Java SDKs, introduces a new PubNub client instantiation, and changes asynchronous API callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

PubNub delivers messages globally in <30 ms.

## Publish

Available in entities: Channel

`publish()` sends a message to all subscribers of a channel. Messages are replicated and delivered to all subscribed clients on that channel.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Create a Channel entity for the destination.
  - You don't need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl=true during initialization. Optional message encryption is available.
- Message data
  - Payload must be JSON-serializable (objects, arrays, numbers, strings). Avoid special classes/functions.
  - Don't JSON serialize message or meta; the SDK serializes them automatically.
- Size
  - Max 32 KiB (includes escaped characters and channel name). Aim for <1,800 bytes for optimal performance. Oversized messages return Message Too Large.
- Publish rate and queue
  - Publish as fast as bandwidth allows. There is a soft throughput limit; the in-memory subscriber queue holds 100 messages.
- Custom message type
  - Optional customMessageType for business-specific labels (for example, text, action, poll).
- Best practices
  - Publish serially, verify success, publish next only after success.
  - On failure, retry.
  - Keep in-memory queue under 100 messages.
  - Throttle bursts (for example, <=5 messages/sec).

### Method(s)

To publish, create a Channel entity:

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

- message (required)
  - Type: Object
  - The payload.
- shouldStore
  - Type: Boolean
  - Default: account default
  - Store in history. If not specified, uses key-level history configuration.
- meta
  - Type: Object
  - Default: Not set
  - Data object used with message filtering.
- queryParam
  - Type: HashMap<string,string>
  - Default: Not set
  - Custom query parameters for analytics; overridden by reserved parameters. Accessible in the PubNub Dashboard; not returned in responses.
- usePOST
  - Type: Boolean
  - Default: false
  - Use POST to publish.
- ttl
  - Type: Integer
  - Set per-message time to live in Message Persistence.
- customMessageType
  - Type: String
  - Case-sensitive, alphanumeric, 3–50 chars; dashes and underscores allowed; cannot start with special characters or pn_/pn-.
  - Examples: text, action, poll.
- sync
  - Type: Command
  - Block the thread; throws exception on error.
- async
  - Type: Consumer<Result>
  - Consumer of PNPublishResult.

### Sample code

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (see Subscribe).

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

Method
- getTimetoken()
  - Type: Long
  - Returns a long timetoken for when the message was published.

## Fire

Available in entities: Channel

`fire()` sends a message to Functions event handlers and Illuminate. It triggers handlers on the target channel. Messages are not replicated to subscribers and not stored in history.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Create a Channel entity.
  - Not replicated to subscribers.
  - Not stored in history.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.fire(Object message)  
4    .meta(Object)  
5    .usePOST(Boolean);  

```

- message (required)
  - Type: Object
  - The payload.
- meta
  - Type: Object
  - Default: Not set
  - Data object used with message filtering.
- usePOST
  - Type: Boolean
  - Default: false
  - Use POST to publish.
- sync
  - Type: Command
  - Block the thread; throws exception on error.
- async
  - Type: Consumer<Result>
  - Consumer of PNPublishResult.

### Sample code

```
1
  

```

### Response

`fire()` returns PNPublishResult:

Method
- getTimetoken()
  - Type: Long
  - Returns a long timetoken for when the message was published.

## Signal

Available in entities: Channel

`signal()` sends a signal to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Create a Channel entity.
  - Payload size is limited to 64 bytes (excluding URI and headers). Contact support for larger needs.
- Signal vs. Message
  - Payload size: Signals 64B; Messages up to 32KB.
  - Cost: Signals cost less.
  - Persistence: Signals cannot be saved; Messages can be saved.
  - Push Notifications: Signals cannot trigger; Messages can.
  - Use case: Signals for non-critical streams (for example, geolocation).
  - Metadata: Signals do not support; Messages do.
- Channel separation
  - Send signals and messages on separate channels for improved recovery.

### Method(s)

```
1Channel channel = pubnub.channel("myChannel");  
2
  
3channel.signal(Object message)  
4    .customMessageType(String);  

```

- message (required)
  - Type: Object
  - The payload that will be serialized and sent.
- customMessageType
  - Type: String
  - Case-sensitive, alphanumeric, 3–50 chars; dashes and underscores allowed; cannot start with special characters or pn_/pn-.
  - Examples: text, action, poll.
- sync
  - Type: PNPublishResult
  - Executes the call; blocks thread; throws exception on error.
- async
  - Type: Consumer<Result>
  - Executes the call asynchronously.

### Sample code

```
1
  

```

### Response

`signal()` returns PNPublishResult:

Method
- getTimetoken()
  - Type: Long
  - Returns a long timetoken for when the signal was published.

## Subscribe

Subscribe opens a TCP socket and listens for messages and events. Set subscribeKey during initialization.

Entities you can subscribe to:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

After subscribe(), the client receives new messages. Configure retryConfiguration to auto-reconnect.

### Subscription scope

- Subscription: created from an entity and scoped to that entity.
- SubscriptionSet: created from the PubNub client and scoped to the client; can include multiple subscriptions.

One event listener receives all messages, signals, and events for the subscribed entities. See Event listeners.

### Create a subscription

Managing subscription lifecycle: Subscription implements AutoCloseable. Always call Subscription.close() when no longer needed.

Entity-level Subscription receives messages/events only for that entity. Multiple subscriptions help handle different channels differently.

```
1// Entity-based, local-scoped  
2
  
3channel.subscription(SubscriptionOptions options)  

```

- options
  - Type: SubscriptionOptions
  - Behavior configuration. Use null for default.

#### Sample code

```
1
  

```

### Create a subscription set

Managing subscription lifecycle: SubscriptionSet implements AutoCloseable. Always call SubscriptionSet.close() when no longer needed.

Client-level SubscriptionSet receives messages/events for all entities in the set.

```
1// client-based, general-scoped  
2
  
3pubnub.subscriptionSetOf(  
4    SetString> channels,   
5    SetString> channelGroups,   
6    SubscriptionOptions options  
7)  

```

- channels
  - Type: Set<String>
  - Set of channel names; empty set for none.
- channelGroups
  - Type: Set<String>
  - Set of channel group names; empty set for none.
- options
  - Type: SubscriptionOptions
  - Additional configuration. Defaults to EmptyOptions.

Add/remove sets: You can add and remove subscription sets to compose new sets.

#### SubscriptionOptions

Configure subscription behavior. Defaults to EmptyOptions.

Options:
- receivePresenceEvents()
  - Deliver presence updates for userIds.
- filter(predicate: (PNEvent) -> Boolean)
  - Custom filtering of delivered events.

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

subscribe() has no return value.

#### Subscribe with timetoken

Impact on other subscriptions: Using a timetoken sets the single server connection timetoken and affects other subscriptions. Subscriptions don’t deliver messages older than already delivered; after an event, each subscription only gets future events.

Subscribe from a given timetoken:

```
`1subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

- cursor (required)
  - Type: SubscriptionCursor
  - Cursor (typically includes a long timetoken) from which to return any available cached messages.

##### Sample code

```
1
  

```

##### Returns

No return value.

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and to the PubNub client for connection status.

### Add listeners

Handle multiple event types.

#### Method(s)

```
`1fun addListener(listener: EventListener)  
`
```

#### Sample code

```
1
  

```

### Handle one event type

#### Method(s)

Register single-event listeners by assigning lambda expressions on the subscription. Only one listener per event type; assigning a new one overwrites the previous.

##### Sample code

```
1
  

```

##### Remove event listener

Assign null to remove the listener for a specific event.

```
`1subscription.setOnMessage(null);  
`
```

### Add connection status listener

Use StatusListener on the PubNub instance to receive connection status updates.

Client scope: Only available on the PubNub object.

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

Emits various statuses depending on network connection. See Status Events for Subscribe and SDK Connection Lifecycle.

## Unsubscribe

Stop receiving real-time updates from a Subscription or a SubscriptionSet.

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

Stop receiving real-time updates from all listeners and remove associated entities.

Client scope: Only available on the PubNub object.

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