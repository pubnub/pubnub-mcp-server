On this page
# Publish/Subscribe API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

The foundation of PubNub is the ability to send and deliver a message in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## Publish[​](#publish)

### Available in entities
Channel
  

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/kotlin/api-reference/configuration#configuration) with the `publishKey`.

- You must create a [Channel](/docs/sdks/kotlin/entities/channel) entity where you will publish to.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/kotlin/api-reference/configuration). You can also [encrypt](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) messages.

The message can contain any JSON-serializable data (Objects, Arrays, Ints, Strings) and shouldn't contain any special classes or functions. String content can include any single-byte or multi-byte UTF-8 characters.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

 You can optionally provide the `customMessageType` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

To publish to a channel, you must first create a [`Channel` entity](/docs/sdks/kotlin/entities/channel) where you provide the name of the channel you want to publish to.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish(  
    message: Any,  
    shouldStore: Boolean,  
    meta: Any,  
    queryParam: MapString, String>,  
    usePost: Boolean,  
    ttl: Integer,  
    customMessageType: String  
).async { result -> /* check result */ }  
`
```

*  requiredParameterDescription`message` *Type: `Any`Default:  
n/aThe payload`shouldStore`Type: `Boolean`Default:  
account defaultStore message in history.  
If not specified, the decision depends on whether Message Persistence has been enabled for the key or not.`meta`Type: `Any`Default:  
Not setMetadata object which can be used with the filtering ability.`queryParam`Type: `Map<String, String>`Default:  
Not setOne or more query parameters to be passed to the server, for analytics purposes.  
Overridden in case of conflicts with reserved PubNub parameters, such as UUID or `instance_id`. Accessible from the Admin Portal, and never returned in server responses.`usePost`Type: `Boolean`Default:  
`false`Use HTTP POST to `publish`.`ttl`Type: `Integer`Default:  
n/aSet a per message time to live in Message Persistence.  
1. If `shouldStore = true`, and `ttl = 0`, the message is stored with no expiry time.  
2. If `shouldStore = true` and `ttl = X` (`X` is an Integer value), the message is stored with an expiry time of `X` hours unless you have message retention set to `Unlimited` on your keyset configuration in the Admin Portal.  
3. If `shouldStore = false`, the `ttl` parameter is ignored.  
4. If `ttl` isn't specified, then expiration of the message defaults back to the expiry value for the key.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Response[​](#response)

The `publish()` operation returns a `PNPublishResult?`:

ParameterDescription`timetoken`Type: `Long`Returns a `Long` representation of the timetoken when the message was published.

### Other Examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
`  
`
```

#### Publishing JsonArray (Google GSON)[​](#publishing-jsonarray-google-gson)

```
`  
`
```

#### Publishing JSONObject (org.json)[​](#publishing-jsonobject-orgjson)

```
`  
`
```

#### Publishing JSONArray (org.json)[​](#publishing-jsonarray-orgjson)

```
`  
`
```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
`  
`
```

## Fire[​](#fire)

### Available in entities
Channel
  

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler.

- Prerequisites and limitations

- You must [initialize PubNub](/docs/sdks/kotlin/api-reference/configuration#configuration) with the `publishKey`.

- You must create a [Channel](/docs/sdks/kotlin/entities/channel) entity where you will fire to.

- The message sent via `fire()` isn't replicated and won't be received by subscribers.

- The message is not stored in history.

### Method(s)[​](#methods-1)

To fire to a channel, you must first create a [`Channel` entity](/docs/sdks/kotlin/entities/channel) where you provide the name of the channel you want to fire to.

```
`val channel = pubnub.channel("channelName")  
  
channel.fire(  
    message: Any,  
    meta: Any,  
    usePost: Boolean,  
).async { result -> /* check result */ }  
`
```

*  requiredParameterDescription`message` *Type: `Any`Default:  
n/aThe payload`meta`Type: `Any`Default:  
Not setMetadata object which can be used with the filtering ability`usePost`Type: `Boolean`Default:  
`false`Use POST to `fire`

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Response[​](#response-1)

The `fire()` operation returns a `PNPublishResult?`:

ParameterDescription`timetoken`Type: `Long`Returns a `Long` representation of the timetoken when the message was published.

## Signal[​](#signal)

### Available in entities
Channel
  

The `signal()` function is used to send a signal to all subscribers of a channel.

- Prerequisites and limitations
- Signal vs. Message

- You must [initialize PubNub](/docs/sdks/kotlin/api-reference/configuration#configuration) with the `publishKey`.

- You must create a [Channel](/docs/sdks/kotlin/entities/channel) entity where you will fire to.

- The message payload size (without the URI or headers) is limited to `64` bytes. If you require a larger payload size, [contact support](mailto:support@pubnub.com).

**Feature****Signals****Messages****Payload size**Limited to 64 bytes (64B)Up to 32 kilobytes (32KB)**Cost efficiency**Cost less than standard messagesGenerally more expensive than signals**Persistence**Cannot be saved in [Message Persistence](/docs/sdks/kotlin/api-reference/storage-and-playback) (past signals cannot be accessed)Can be saved and accessed through Message Persistence**Push Notifications**Cannot trigger [Mobile Push Notifications](/docs/sdks/kotlin/api-reference/mobile-push)Can trigger Mobile Push Notifications**Use case suitability**Best for non-critical data streams, like geolocation updatesSuitable for critical and non-critical use cases**Metadata support**Do not support metadataSupport metadata
##### Channel separation

Signals and messages should be sent on separate channels to improve connection recovery behaviour.

### Method(s)[​](#methods-2)

```
`val channel = pubnub.channel("myChannel")  
  
channel.signal(  
    message: Any,  
    customMessageType: String  
).async { result -> }  
`
```

*  requiredParameterDescription`message` *Type: `Any`Default:  
n/aThe payload`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Response[​](#response-2)

The `signal()` operation returns a `PNPublishResult?`:

MethodDescription`timetoken`Type: `Long`Returns a `Long` representation of the timetoken when the signal was published.

## Subscribe[​](#subscribe)

The subscribe function creates an open TCP socket to PubNub and begins listening for messages and events on a specified entity or set of entities. To subscribe successfully, you must configure the appropriate `subscribeKey` at [initialization](/docs/sdks/kotlin/api-reference/configuration#initialization).

##### Conceptual overview

For more general information about subscriptions, refer to [Subscriptions](/docs/general/channels/subscribe).

Entities are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) that provide access to their encapsulated APIs. You can subscribe using the PubNub client object or directly on a specific entity:

- [`Channel`](/docs/sdks/kotlin/entities/channel)

- [`ChannelGroup`](/docs/sdks/kotlin/entities/channel-group)

- [`UserMetadata`](/docs/sdks/kotlin/entities/user-metadata)

- [`ChannelMetadata`](/docs/sdks/kotlin/entities/channel-metadata)

A newly subscribed client receives messages after the `subscribe()` call completes. You can configure [`retryConfiguration`](/docs/sdks/kotlin/api-reference/configuration) to automatically attempt to reconnect if a client gets disconnected.

### Subscription scope[​](#subscription-scope)

Subscription objects provide an interface to attach listeners for various real-time update types. Your app receives messages and events via those event listeners. Two types of subscriptions are available:

- [`Subscription`](#create-a-subscription), created from an entity with a scope of only that entity (for example, a particular channel)

- [`SubscriptionSet`](#create-a-subscription-set), created from the PubNub client with a global scope (for example, all subscriptions created on a single `pubnub` object ). A subscription set can have one or more subscriptions.

  

The event listener is a single point through which your app receives all the messages, signals, and events in the entities you subscribed to. For information on adding event listeners, refer to [Event listeners](#event-listeners).

### Create a subscription[​](#create-a-subscription)

##### Managing subscription lifecycle

The `Subscription` object implements the [AutoCloseable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/#kotlin.AutoCloseable) interface to help you release resources by unsubscribing and removing all listeners. Always call `Subscription.close()` when you no longer need this `Subscription`.

An entity-level `Subscription` allows you to receive messages and events for only that entity for which it was created. Using multiple entity-level `Subscription`s is useful for handling various message/event types differently in each channel.

```
`// Entity-based, local-scoped  
  
// Specify the channel for subscription  
val myChannel = pubnub.channel("channelName")  
  
// Create subscription options, if any  
val options = SubscriptionOptions.receivePresenceEvents()  
  
// Return a Subscription object that is used to establish the subscription  
val subscription = myChannel.subscription(options)  
  
// Activate the subscription to start receiving events  
subscription.subscribe()  
`
```

*  requiredParameterDescription`options`Type: `SubscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions). Use `null` for no specific options.

### Create a subscription set[​](#create-a-subscription-set)

##### Managing subscription lifecycle

The `SubscriptionSet` object implements the [AutoCloseable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/#kotlin.AutoCloseable) interface to help you release resources by unsubscribing and removing all listeners. Always call `SubscriptionSet.close()` when you no longer need this `SubscriptionSet`.

A client-level `SubscriptionSet` allows you to receive messages and events for all entities in the set. A single `SubscriptionSet` is useful for similarly handling various message/event types in each channel.

```
`// client-based, general-scoped  
  
pubnub.subscriptionSetOf(  
    channels: SetString>,  
    channelGroups: SetString>,  
    options: SubscriptionOptions  
)  
`
```

*  requiredParameterDescription → `channels`Type: `Set<String>`Set of channel names to subscribe to. Use an empty set for no channels. → `channelGroups`Type: `Set<String>`Set of channel group names to subscribe to. Use an empty set for no channel groups. → `options`Type: `SubscriptionOptions`Additional subscription configuration to define the subscription behavior. If you don't set any options, `EmptyOptions` is used by default.

##### Add/remove sets

You can add and remove subscription sets to create new sets. Refer to the [Other examples](#other-examples-1) section for more information.

#### `SubscriptionOptions`[​](#subscriptionoptions)

`SubscriptionOptions` is a class designed to configure subscription behaviors with optional modifiers. When no specific options are required, `EmptyOptions` is set by default.

The class includes:

OptionDescription`receivePresenceEvents()`Whether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`filter(predicate: (PNEvent) -> Boolean)`Allows for custom filtering of events delivered to the subscription based on the provided predicate. Useful for event-specific handling.

### Method(s)[​](#methods-3)

`Subscription` and `SubscriptionSet` use the same methods to subscribe:

- [Subscribe](#subscribe-1)

- [Subscribe with timetoken](#subscribe-with-timetoken)

#### Subscribe[​](#subscribe-1)

To subscribe, you can use the following method:

```
`  
`
```

##### Basic usage[​](#basic-usage-3)

```
`  
`
```

##### Other examples[​](#other-examples-1)

###### Create a subscription set from 2 individual subscriptions[​](#create-a-subscription-set-from-2-individual-subscriptions)

```
`  
`
```

##### Returns[​](#returns)

The `subscribe()` method doesn't have a return value.

#### Subscribe with timetoken[​](#subscribe-with-timetoken)

##### Impact on other subscriptions

Subscribing with a timetoken affects all other subscriptions because it overwrites the timetoken in the single PubNub server connection in the SDK. However, those other subscriptions will not deliver messages older than ones that were already delivered - after receiving an event, a subscription only gets future events, ignoring those before or at the time of the last event received.

To subscribe to real-time updates from a given timetoken, use the following method:

```
`subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

*  requiredParameterDescription`cursor` *Type: `SubscriptionCursor`Cursor from which to return any available cached messages. `SubscriptionCursor` would typically include a `timetoken` (long integer) representing the point in time from which to receive updates.

##### Basic usage[​](#basic-usage-4)

```
`  
`
```

##### Returns[​](#returns-1)

The method for subscribing with a timetoken doesn't have a return value.

## Event listeners[​](#event-listeners)

Messages and events are received in your app using a listener. This listener allows a single point to receive all messages, signals, and events.

You can attach listeners to the instances of [`Subscription`](#create-a-subscription), [`SubscriptionSet`](#create-a-subscription-set), and, in the case of the connection status, the PubNub client.

### Add listeners[​](#add-listeners)

You can add listeners for various types of updates related to your subscription. You can implement listeners for general updates (that handle multiple event types at once) or choose listeners dedicated to specific event types such as `Message` or `File`.

#### Handle multiple event types[​](#handle-multiple-event-types)

##### Method(s)[​](#methods-4)

```
`fun addListener(listener: EventListener)  
`
```

##### Basic usage[​](#basic-usage-5)

```
`  
`
```

#### Handle one event type[​](#handle-one-event-type)

#### Method(s)[​](#methods-5)

You can also directly register listeners for specific event types on the subscription object by assigning lambda expressions. This method allows you to handle events such as messages, signals, message actions, files, objects, and presence.

Using this method, you cannot have multiple listeners attached to the same event type. Assigning a new listener with this method overwrites the previous one.

##### Basic usage[​](#basic-usage-6)

```
`  
`
```

##### Remove event listener[​](#remove-event-listener)

To remove the listener for a specific event, assign `null` to it.

```
`  
`
```

### Add connection status listener[​](#add-connection-status-listener)

Use the `StatusListener` interface with your `PubNub` instance to add a listener dedicated to connection status updates.

##### Client scope

This listener is only available on the PubNub object.

#### Method(s)[​](#methods-6)

```
`pubnub.addListener(object : StatusListener() {  
    override fun status(pubnub: PubNub, status: PNStatus) {  
        // Handle connection status updates  
        println("Connection Status: ${status.category}")  
    }  
})  
`
```

#### Basic usage[​](#basic-usage-7)

```
`  
`
```

#### Returns[​](#returns-2)

This method returns the subscription status and will emit various statuses depending on your client network connection.

To help you adjust your app code, see the [Status Events for Subscribe](/docs/sdks/kotlin/status-events#subscribe) for the exact mapping between the current and deprecated Kotlin SDK statuses.

For more generic information, head to [SDK Connection Lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a [`Subscription`](#create-a-subscription) or a [`SubscriptionSet`](#create-a-subscription-set).

### Method(s)[​](#methods-7)

```
`  
`
```

### Basic Usage[​](#basic-usage-8)

```
`  
`
```

### Returns[​](#returns-3)

None

## Unsubscribe All[​](#unsubscribe-all)

Stop receiving real-time updates from all listeners and remove the entities associated with them.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-8)

```
`  
`
```

### Basic Usage[​](#basic-usage-9)

```
`  
`
```

### Returns[​](#returns-4)

None
