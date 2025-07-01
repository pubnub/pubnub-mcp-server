On this page
# Publish/Subscribe API for JavaScript SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the status errors, you must use the [`try...catch`](https://javascript.info/try-catch) syntax in your code.

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/javascript/api-reference/configuration#initialization) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/javascript/api-reference/configuration). You can also [encrypt](/docs/sdks/javascript/api-reference/configuration#cryptomodule) messages.

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

To `Publish a message`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.publish({  
    message: any,  
    channel: string,  
    meta: any,  
    storeInHistory: boolean,  
    sendByPost: boolean,  
    ttl: number,  
    customMessageType: string  
}): PromisePublishResponse>;  
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

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
`  
`
```

```
`  
`
```

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Response[​](#response)

```
`type PublishResponse = {  
    timetoken: number  
}  
`
```

### Other Examples[​](#other-examples)

#### Publish a JSON serialized message[​](#publish-a-json-serialized-message)

```
`  
`
```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
`  
`
```

#### Publish successful[​](#publish-successful)

```
`  
`
```

#### Publish unsuccessful by network down[​](#publish-unsuccessful-by-network-down)

```
`  
`
```

#### Publish unsuccessful by initialization without publishKey[​](#publish-unsuccessful-by-initialization-without-publishkey)

```
`  
`
```

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message`, you can use the following method(s) in the JavaScript SDK:

```
`fire({  
    Object message,  
    String channel,  
    Boolean sendByPost,  
    Object meta  
})  
`
```

*  requiredParameterDescription`message` *Type: ObjectDefault:  
n/aThe `message` may be any valid JSON type including objects, arrays, strings, and numbers.`channel` *Type: StringDefault:  
n/aSpecifies `channel` ID to publish messages to.`sendByPost`Type: BooleanDefault:  
`false`If `true` the messages sent via POST.`meta`Type: ObjectDefault:  
n/aPublish extra `meta` with the request.

### Basic Usage[​](#basic-usage-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
`  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-2)

To `Signal a message`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.signal({  
    message: string,  
    channel: string,  
    customMessageType: string,  
}): PromiseSignalResponse>;  
`
```

*  requiredParameterDescription`message` *Type: stringThe `message` may be any valid JSON type including objects, arrays, strings, and numbers.`channel` *Type: stringSpecifies `channel` ID to send messages to.`customMessageType`Type: stringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`  
`
```

### Response[​](#response-1)

```
`type SignalResponse = {  
    timetoken: number  
}  
`
```

## Subscribe[​](#subscribe)

The subscribe function creates an open TCP socket to PubNub and begins listening for messages and events on a specified entity or set of entities. To subscribe successfully, you must configure the appropriate `subscribeKey` at [initialization](/docs/sdks/javascript/api-reference/configuration#initialization).

##### Conceptual overview

For more general information about subscriptions, refer to [Subscriptions](/docs/general/channels/subscribe).

Entities are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) that provide access to their encapsulated APIs. You can subscribe using the PubNub client object or directly on a specific entity:

- [`channel`](#create-channels)

- [`channelGroup`](#create-channel-groups)

- [`userMetadata`](#create-user-metadata)

- [`channelMetadata`](#create-channel-metadata)

A newly subscribed client receives messages after the `subscribe()` call completes. You can configure [`retryConfiguration`](/docs/sdks/javascript/api-reference/configuration#initialization) to automatically attempt to reconnect and retrieve any available messages if a client gets disconnected.

### Subscription scope[​](#subscription-scope)

Subscription objects provide an interface to attach listeners for various real-time update types. Your app receives messages and events via those event listeners. Two types of subscriptions are available:

- [`subscription`](#create-a-subscription), created from an entity with a scope of only that entity (for example, a particular channel)

- [`subscriptionSet`](#create-a-subscription-set), created from the PubNub client with a global scope (for example, all subscriptions created on a single `pubnub` object ). A subscription set can have one or more subscriptions.

  

The event listener is a single point through which your app receives all the messages, signals, and events in the entities you subscribed to. For information on adding event listeners, refer to [Event listeners](#event-listeners).

### Create a subscription[​](#create-a-subscription)

An entity-level `subscription` allows you to receive messages and events for only that entity for which it was created. Using multiple entity-level `subscription`s is useful for handling various message/event types differently in each channel.

```
`// entity-based, local-scoped  
const channel = pubnub.channel('channel_1');  
channel.subscription(subscriptionOptions)  
`
```

*  requiredParameterDescription`subscriptionOptions`Type: `subscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

### Create a subscription set[​](#create-a-subscription-set)

A client-level `subscriptionSet` allows you to receive messages and events for all entities in the set. A single `subscriptionSet` is useful for similarly handling various message/event types in each channel.

```
`// client-based, general-scoped  
pubnub.subscriptionSet({  
    channels: string[],  
    channelGroups: string[],  
    subscriptionOptions: subscriptionOptions  
}))  
`
```

*  requiredParameterDescription → `channels`Type: `string[]`Channels to subscribe to. Either `channels` or `channelGroups` is mandatory. → `channelGroups`Type: `string[]`Channel groups to subscribe to. Either `channels` or `channelGroups` is mandatory. → `subscriptionOptions`Type: `subscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

##### Add/remove sets

You can add and remove subscription sets to create new sets. Refer to the [Other examples](#other-examples-1) section for more information.

#### `subscriptionOptions`[​](#subscriptionoptions)

`subscriptionOptions` is a class. Available properties include:

OptionTypeDescription`receivePresenceEvents`booleanWhether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`cursor`objectCursor from which to return any available cached messages. Message retrieval with cursor is not guaranteed and should only be considered a best-effort service. A cursor consists of a timetoken and region: `cursor?: { timetoken?: string; region?: number }`   
   
 If you pass any primitive type, the SDK converts them into `SubscriptionCursor` but if their value is not a 17-digit number or a string with numeric characters, the provided value will be ignored.

### Method(s)[​](#methods-3)

`subscription` and `subscriptionSet` use the same `subscribe()` method.

#### Subscribe[​](#subscribe-1)

To subscribe, you can use the following method in the JavaScript SDK:

```
`subscription.subscribe()  
subscriptionSet.subscribe()  
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

###### Create a subscription set from 2 sets[​](#create-a-subscription-set-from-2-sets)

```
`  
`
```

##### Returns[​](#returns)

The `subscribe()` method doesn't have a return value.

## Entities[​](#entities)

Entities are subscribable objects for which you can receive real-time updates (messages, events, etc).

- [`channel`](#create-channels)

- [`channelGroup`](#create-channel-groups)

- [`userMetadata`](#create-user-metadata)

- [`channelMetadata`](#create-channel-metadata)

### Create channels[​](#create-channels)

This method returns a local `channel` entity.

```
`pubnub.channel(string)  
`
```

*  requiredParameterDescription`channel` *Type: `string`The ID of the [channel](/docs/general/channels/overview) to create a subscription of.

#### Basic usage[​](#basic-usage-4)

```
`  
`
```

### Create channel groups[​](#create-channel-groups)

This method returns a local `channelGroup` entity.

```
`pubnub.channelGroup(string)  
`
```

*  requiredParameterDescription`channel_group` *Type: `string`The name of the [channel group](/docs/general/channels/subscribe#channel-groups) to create a subscription of.

#### Basic usage[​](#basic-usage-5)

```
`  
`
```

### Create channel metadata[​](#create-channel-metadata)

This method returns a local `channelMetadata` entity.

```
`pubnub.channelMetadata(string)  
`
```

*  requiredParameterDescription`channelMetadata` *Type: `string`The String identifier of the [channel metadata](/docs/general/metadata/channel-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-6)

```
`  
`
```

### Create user metadata[​](#create-user-metadata)

This method returns a local `userMetadata` entity.

```
`pubnub.userMetadata(string)  
`
```

*  requiredParameterDescription`userMetadata` *Type: `string`The String identifier of the [user metadata](/docs/general/metadata/users-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-7)

```
`  
`
```

## Event listeners[​](#event-listeners)

Messages and events are received in your app using a listener. This listener allows a single point to receive all messages, signals, and events.

You can attach listeners to the instances of [`subscription`](#create-a-subscription), [`subscriptionSet`](#create-a-subscription-set), and, in the case of the connection status, the PubNub client.

### Add listeners[​](#add-listeners)

You can implement multiple listeners with the `addListener()` method or register an event-specific listener that receives only a selected type, like `message` or `file`.

#### Method(s)[​](#methods-4)

```
`  
`
```

#### Basic usage[​](#basic-usage-8)

```
`  
`
```

### Add connection status listener[​](#add-connection-status-listener)

The PubNub client has a listener dedicated to handling connection status updates.

##### Client scope

This listener is only available on the PubNub object.

#### Method(s)[​](#methods-5)

```
`  
`
```

#### Basic usage[​](#basic-usage-9)

```
`  
`
```

#### Returns[​](#returns-1)

The subscription status. For information about available statuses, refer to [SDK statuses](/docs/general/setup/connection-management#sdk-statuses).

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a [`subscription`](#create-a-subscription) or a [`subscriptionSet`](#create-a-subscription-set).

### Method(s)[​](#methods-6)

```
`subscription.unsubscribe()  
  
subscriptionSet.unsubscribe()  
`
```

### Basic Usage[​](#basic-usage-10)

```
`  
`
```

### Returns[​](#returns-2)

None

## Unsubscribe All[​](#unsubscribe-all)

Stop receiving real-time updates from all data streams and remove the entities associated with them.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-7)

```
`pubnub.unsubscribeAll()  
`
```

### Basic Usage[​](#basic-usage-11)

```
`  
`
```

### Returns[​](#returns-3)

None
