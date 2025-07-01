On this page
# Publish/Subscribe API for Python SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

##### ObjectNode

The new Jackson parser does not recognize JSONObject. Use ObjectNode instead.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/python/api-reference/configuration#configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/python/api-reference/configuration). You can also [encrypt](/docs/sdks/python/api-reference/configuration#crypto_module) messages.

The message can contain any JSON-serializable data (Objects, Arrays, Ints, Strings) and shouldn't contain any special classes or functions. String content can include any single-byte or multi-byte UTF-8 characters.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

 You can optionally provide the `custom_message_type` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

To `Publish a message` you can use the following method(s) in the Python SDK:

```
`pubnub.publish() \  
    .channel(String) \  
    .message(Object) \  
    .custom_message_type(String) \  
    .should_store(Boolean) \  
    .meta(Dictionary) \  
    .use_post(Boolean)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aDestination of `message` (channel ID).`message` *Type: ObjectDefault:  
n/aThe payload.`custom_message_type`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`should_store`Type: BooleanDefault:  
`account default`Store in history`meta`Type: ObjectDefault:  
`None`Meta data object which can be used with the filtering ability.

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
  
def publish_message(pubnub: PubNub):  
    try:  
        envelope = pubnub.publish() \  
            .channel("my_channel") \  
            .message({  
                'name': 'Alex',  
                'online': True  
            }) \  
            .custom_message_type("text-message") \  
`
```
show all 37 lines
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
  
def publish_message(pubnub: PubNub):  
    try:  
        envelope = pubnub.publish(  
            channel="my_channel",  
            message={  
                'name': 'Alex',  
                'online': True  
            },  
            custom_message_type="text-message"  
`
```
show all 38 lines

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Returns[​](#returns)

The `publish()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNPublishResult`](#pnpublishresult)A string representation of the result and the timetoken when the message was published.status`PNStatus`A status object with additional information.

#### PNPublishResult[​](#pnpublishresult)

```
`Publish success with timetoken 17193163560057793  
`
```

### Other Examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
`def publish_callback(result, status):  
    pass  
    # handle publish result, status always present, result if successful  
    # status.is_error() to see if error happened  
  
pubnub.publish().channel("my_channel").message(["hello", "there"]) \  
    .meta({'name': 'Alex'}).pn_async(publish_callback)  
`
```

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message` you can use the following method(s) in the Python SDK:

```
`pubnub.fire() \  
    .channel(String) \  
    .message(Object) \  
    .use_post(Boolean) \  
    .meta(Object)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aDestination of `message` (channel ID).`message` *Type: ObjectDefault:  
n/aThe payload.`use_post`Type: BooleanDefault:  
`False`Use POST to publish.`meta`Type: ObjectDefault:  
`None`Meta data object which can be used with the filtering ability.

### Basic Usage[​](#basic-usage-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

- Builder Pattern
- Named Arguments

```
`envelope = pubnub.fire() \  
    .channel('my_channel') \  
    .message('hello there') \  
    .use_post(True) \  
    .sync()  
print(f'fire timetoken: {envelope.result.timetoken}')  
`
```

```
`fire = pubnub.fire(channel="my_channel", message='hello there').sync()  
print(f'fire timetoken: {fire.result.timetoken}')  
`
```

### Returns[​](#returns-1)

The `fire()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNFireResult`](#pnfireresult)A string representation of the result and the timetoken when the message was fired.status`PNStatus`A status object with additional information.

#### PNFireResult[​](#pnfireresult)

```
`Fire success with timetoken 17193163560057793  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-2)

To `Signal a message` you can use the following method(s) in the Python SDK:

```
`pubnub.signal() \  
    .message(Object) \  
    .custom_message_type(String) \  
    .channel(String)  
`
```

*  requiredParameterDescription`message` *Type: ObjectThe payload.`custom_message_type`Type: StringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`channel` *Type: StringDestination of `message` (channel ID).

### Basic Usage[​](#basic-usage-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

- Builder Pattern
- Named Arguments

```
`envelope = pubnub.signal() \  
    .channel('some_channel') \  
    .message('foo') \  
    .custom_message_type('text-message') \  
    .sync()  
`
```

```
`signal = pubnub.signal(channel="my_channel", message='hello there', custom_message_type='text-message').sync()  
print(f'signal timetoken: {signal.result.timetoken}')  
`
```

### Returns[​](#returns-2)

The `signal()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNSignalResult`](#pnsignalresult)A string representation of the result and the timetoken when the signal was sent.status`PNStatus`A status object with additional information.

#### PNSignalResult[​](#pnsignalresult)

```
`Signal success with timetoken 17193165584676126  
`
```

## Subscribe[​](#subscribe)

The subscribe function creates an open TCP socket to PubNub and begins listening for messages and events on a specified entity or set of entities. To subscribe successfully, you must configure the appropriate `subscribeKey` at [initialization](/docs/sdks/python/api-reference/configuration).

##### Conceptual overview

For more general information about subscriptions, refer to [Subscriptions](/docs/general/channels/subscribe).

Entities are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) that provide access to their encapsulated APIs. You can subscribe using the PubNub client object or directly on a specific entity:

- [`ChannelRepresentation`](#create-channels)

- [`ChannelGroupRepresentation`](#create-channel-groups)

- [`UserMetadataRepresentation`](#create-user-metadata)

- [`ChannelMetadataRepresentation`](#create-channel-metadata)

A newly subscribed client receives messages after the `subscribe()` call completes. You can configure [automatic retries](/docs/sdks/python/api-reference/configuration#configuration) to attempt to reconnect automatically and retrieve any available messages if a client gets disconnected.

### Subscription scope[​](#subscription-scope)

Subscription objects provide an interface to attach listeners for various real-time update types. Your app receives messages and events via those event listeners. Two types of subscriptions are available:

- [`Subscription`](#create-a-subscription), created from an entity with a scope of only that entity (for example, a particular channel)

- [`SubscriptionSet`](#create-a-subscription-set), created from the PubNub client with a global scope (for example, all subscriptions created on a single `pubnub` object ). A subscription set can have one or more subscriptions.

  

The event listener is a single point through which your app receives all the messages, signals, and events in the entities you subscribed to. For information on adding event listeners, refer to [Event listeners](#event-listeners).

### Create a subscription[​](#create-a-subscription)

An entity-level `Subscription` allows you to receive messages and events for only that entity for which it was created. Using multiple entity-level `Subscription`s is useful for handling various message/event types differently in each channel.

```
`# entity-based, local-scoped  
subscription = pubnub.channel(f'{channel}').subscription(with_presence: bool = False)  
`
```

*  requiredParameterDescription`with_presence`Type: `bool`Whether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

### Create a subscription set[​](#create-a-subscription-set)

A client-level `SubscriptionSet` allows you to receive messages and events for all entities. A single `SubscriptionSet` is useful for similarly handling various message/event types in each channel.

```
`# client-based, general-scoped  
subscription_set = pubnub.subscription_set(subscriptions: List[PubNubSubscription])  
`
```

*  requiredParameterDescription`subscriptions` *Type: `List[PubNubSubscription]`Channels/Channel group subscriptions.

### Method(s)[​](#methods-3)

`Subscription` and `SubscriptionSet` use the same `subscribe()` method.

#### Subscribe[​](#subscribe-1)

To subscribe, you can use the following method in the Python SDK:

```
`subscription.subscribe(timetoken: Optional[int] = None, region: Optional[str] = None,)  
`
```

*  requiredParameterDescription`timetoken`Type: `int`Timetoken from which to return any available cached messages. Message retrieval with timetoken is not guaranteed and should only be considered a best-effort service.   
   
 If the value is not a 17-digit number, the provided value will be ignored.`region`Type: StringThe region the message was published in.

##### Basic usage[​](#basic-usage-3)

```
`# single channel subscription  
channel = pubnub.channel(f'{channel}')  
t1_subscription = channel.subscription()  
t1_subscription.subscribe()  
  
# multiple channel subscription  
channel_1 = pubnub.channel(channel).subscription()  
channel_2 = pubnub.channel(f'{channel}.2').subscription(with_presence=True)  
channel_x = pubnub.channel(f'{channel}.*').subscription(with_presence=True)  
  
group = pubnub.channel_group('group-test').subscription()  
  
subscription_set = pubnub.subscription_set([channel_1, channel_2, channel_x, group])  
  
set_subscription = subscription_set.subscribe()  
`
```

##### Returns[​](#returns-3)

The `subscribe()` method doesn't have a return value.

## Entities[​](#entities)

Entities are subscribable objects for which you can receive real-time updates (messages, events, etc).

- [`PubNubChannel`](#create-channels)

- [`PubNubChannelGroup`](#create-channel-groups)

- [`PubNubUserMetadata`](#create-user-metadata)

- [`PubNubChannelMetadata`](#create-channel-metadata)

### Create channels[​](#create-channels)

This method returns a local `PubNubChannel` entity.

```
`pubnub.channel(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringThe ID of the [channel](/docs/general/channels/overview) to create a subscription of.

#### Basic usage[​](#basic-usage-4)

```
`pubnub.channel(f'{channel1}')  
`
```

### Create channel groups[​](#create-channel-groups)

This method returns a local `PubNubChannelGroup` entity.

```
`pubnub.channel_group(String)  
`
```

*  requiredParameterDescription`channel_group` *Type: StringThe name of the [channel group](/docs/general/channels/subscribe#channel-groups) to create a subscription of.

#### Basic usage[​](#basic-usage-5)

```
`pubnub.channel_group("channelGroupName")  
`
```

### Create channel metadata[​](#create-channel-metadata)

This method returns a local `PubNubChannelMetadata` entity.

```
`pubnub.channel_metadata(String)  
`
```

*  requiredParameterDescription`channel_metadata` *Type: StringThe String identifier of the [channel metadata](/docs/general/metadata/channel-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-6)

```
`pubnub.channel_metadata("channelMetadata")  
`
```

### Create user metadata[​](#create-user-metadata)

This method returns a local `PubNubUserMetadata` entity.

```
`pubnub.user_metadata(String)  
`
```

*  requiredParameterDescription`user_metadata` *Type: StringThe String identifier of the [user metadata](/docs/general/metadata/users-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-7)

```
`pubnub.userMetadata("user_metadata")  
`
```

## Event listeners[​](#event-listeners)

Messages and events are received in your app using a listener. This listener allows a single point to receive all messages, signals, and events.

You can attach listeners to the instances of [`Subscription`](#create-a-subscription), [`SubscriptionSet`](#create-a-subscription-set), and, in the case of the connection status, the PubNub client.

### Add listeners[​](#add-listeners)

You can implement multiple listeners or register an event-specific listener that receives only a selected type, like `message` or `file`.

#### Method(s)[​](#methods-4)

```
`# Add event-specific listeners  
  
# using closure for reusable listener  
def on_message(listener):  
    def message_callback(message):  
        print(f"\033[94mMessage received on: {listener}: \n{message.message}\033[0m\n")  
    return message_callback  
  
# without closure  
def on_message_action(message_action):  
    print(f"\033[5mMessageAction received: \n{message_action.value}\033[0m\n")  
  
def on_presence(listener):  
    def presence_callback(presence):  
        print(f"\033[0;32mPresence received on: {listener}: \t{presence.uuid} {presence.event}s "  
`
```
show all 77 lines

#### Basic usage[​](#basic-usage-8)

```
`subscription = pubnub.channel(f'{channel1}').subscription()  
  
def on_message(listener):  
    def message_callback(message):  
        print(f"\033[94mMessage received on: {listener}: \n{message.message}\033[0m\n")  
    return message_callback  
  
def on_message_action(message_action):  
    print(f"\033[5mMessageAction received: \n{message_action.value}\033[0m\n")  
  
subscription.on_message = on_message('message_listener')  
subscription.on_message_action = on_message_action  
  
subscription.subscribe()  
  
`
```
show all 20 lines

### Add connection status listener[​](#add-connection-status-listener)

The PubNub client has a listener dedicated to handling connection status updates.

##### Client scope

This listener is only available on the PubNub object.

#### Method(s)[​](#methods-5)

```
`pubnub.add_listener()  
`
```

#### Basic usage[​](#basic-usage-9)

```
`class PrintListener(SubscribeListener):  
    def status(self, pubnub, status):  
        print(f'Status:\n{status.__dict__}')  
  
    def message(self, pubnub, message):  
        pass  
  
    def presence(self, pubnub, presence):  
        pass  
  
listener = PrintListener()  
pubnub.add_listener(listener)  
`
```

#### Returns[​](#returns-4)

The subscription status. For information about available statuses, refer to [SDK statuses](/docs/general/setup/connection-management#sdk-statuses).

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a [`Subscription`](#create-a-subscription) or a [`SubscriptionSet`](#create-a-subscription-set).

### Method(s)[​](#methods-6)

```
`subscription.unsubscribe()  
  
subscription_set.unsubscribe()  
`
```

### Basic Usage[​](#basic-usage-10)

```
`channel = pubnub.channel(f'{channel}')  
t1_subscription = channel.subscription()  
t1_subscription.subscribe()  
  
subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])  
subscription_set.subscribe()  
  
  
t1_subscription1.unsubscribe()  
subscription_set.unsubscribe()  
`
```

### Returns[​](#returns-5)

None

## Unsubscribe All[​](#unsubscribe-all)

Stop receiving real-time updates from all data streams and remove the entities associated with them.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-7)

```
`pubnub.unsubscribe_all()  
`
```

### Basic Usage[​](#basic-usage-11)

```
`channel = pubnub.channel(f'{channel}')  
t1_subscription = channel.subscription()  
t1_subscription.subscribe()  
  
subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])  
subscription_set.subscribe()  
  
  
t1_subscription1.unsubscribe()  
subscription_set.unsubscribe()  
  
pubnub.unsubscribe_all()  
`
```

### Returns[​](#returns-6)

None
