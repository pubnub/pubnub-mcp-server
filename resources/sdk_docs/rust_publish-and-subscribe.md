On this page
# Publish/Subscribe API for Rust SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

## Publish[​](#publish)

### Available in features
defaultfullpublish
  

The `publish_message()` function is used to send a message to all subscribers of a channel. To publish a message you must first specify a valid `publish_key` at initialization. A successfully published message is replicated across the PubNub Real-Time Network and sent simultaneously to all subscribed clients on a channel.

##### Publish Anytime[​](#publish-anytime)

It's not required to be subscribed to a channel in order to publish to that channel.

##### Message Data[​](#message-data)

The message argument can contain any JSON serializable data, including Objects, Arrays, Integers, and Strings. `data` should not contain special classes or functions as these will not serialize. String content can include any single-byte or multi-byte UTF-8 character.

##### Don't JSON serialize

It is important to note that you should not JSON serialize when sending signals/messages via PUBNUB. Why? Because the serialization is done for you automatically. Instead, just pass the full object as the message payload. PubNub takes care of everything for you.

##### Message Size[​](#message-size)

The maximum number of characters per message is 32 KiB by default. The maximum message size is based on the final escaped character count, including the channel name. An ideal message size is under 1800 bytes which allows a message to be compressed and sent using single IP datagram (1.5 KiB) providing optimal network performance.

##### Message Too Large Error[​](#message-too-large-error)

If the message size exceeds 32KiB, you receive an appropriate error response.

For further details, check the [support article](https://support.pubnub.com/hc/en-us/articles/360051495932-Calculating-Message-Payload-Size-Before-Publish).

##### Message Publish Rate[​](#message-publish-rate)

Messages can be published as fast as bandwidth conditions will allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any messages, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

##### Publishing to Multiple Channels[​](#publishing-to-multiple-channels)

It is not possible to publish a message to multiple channels simultaneously. The message must be published to one channel at a time.

##### Publishing Messages Reliably[​](#publishing-messages-reliably)

There are some best practices to ensure messages are delivered when publishing to a channel:

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts in accordance with your app's latency needs, for example, Publish no faster than 5 messages per second to any one channel.

### Method(s)[​](#methods)

To Publish a message you can use the following method(s) in the Rust SDK:

```
`pubnub  
    .publish_message(T: Serialize)  
    .channel(IntoString>)  
    .store(Optionbool>)  
    .meta(OptionHashMapString, String>>)  
    .replicate(bool)  
    .ttl(Optionu32>)  
    .use_post(bool)  
    .execute()  
`
```

*  requiredParameterDescription`publish_message` *Type: `T: Serialize`Default:  
n/aThe message payload. Any type that implements the Serialize trait is allowed.`channel` *Type: `Into<String>`Default:  
n/aThe channel ID to send the message to.`store`Type: `Option<bool>`Default:  
Account defaultWhether to store the messages in Message Persistence or not.`meta`Type: `Option<HashMap<String, String>>`Default:  
n/aA hash map of additional information about the message you can use for Filters.`replicate`Type: `bool`Default:  
n/aWhether to replicate the messages across points of presence or not. Refer to [Replicated Transactions](https://www.pubnub.com/pricing/transaction-classification/) for more information.`ttl`Type: `Option<u32>`Default:  
n/aA per message time to live in Message Persistence.   
1. If `store = true`, and `ttl = 0`, the message is stored with no expiry time.   
2. If `store = true` and `ttl = X` (`X` is an Integer value), the message is stored with an expiry time of `X` hours unless you have message retention set to `Unlimited` on your keyset configuration in the Admin Portal.   
3. If `store = false`, the `ttl` parameter is ignored.   
4. If `ttl` isn't specified, then expiration of the message defaults back to the expiry value for the key.`use_post`Type: `bool`Default:  
`false`Whether to use HTTP POST to publish the message.`execute` *Type: Default:  
`false`Executes the request based on the provided data. This function returns a [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) and you must `.await` the value.

### Basic Usage[​](#basic-usage)

Publish a message to a channel:

```
`  
`
```

### Other Examples[​](#other-examples)

```
`  
`
```

### Returns[​](#returns)

The `publish()` operation returns a `PublishResult` which contains the timetoken, or a `PubNub Error` which contains the error indicator and the description of the error.

```
`// success example  
PublishResult { timetoken: "16808621084073203" }  
  
// failure example  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  
`
```

## Subscribe[​](#subscribe)

### Available in features
defaultfullsubscribe
  

The subscribe function creates an open TCP socket to PubNub and begins listening for messages and events on a specified entity or set of entities. To subscribe successfully, you must configure the appropriate `subscribe_key` at [initialization](/docs/sdks/rust/api-reference/configuration).

##### Conceptual overview

For more general information about subscriptions, refer to [Subscriptions](/docs/general/channels/subscribe).

Entities are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) that provide access to their encapsulated APIs. You can subscribe using the PubNub client object or directly on a specific entity:

- [`Channel`](#create-channels)

- [`ChannelGroup`](#create-channel-groups)

- [`UserMetadata`](#create-user-metadata)

- [`ChannelMetadata`](#create-channel-metadata)

A newly subscribed client receives messages after the `subscribe()` call completes. You can configure   [`with_retry_policy()`](/docs/sdks/rust/api-reference/configuration#initialization) to automatically attempt to reconnect and retrieve any available messages if a client gets disconnected.

### Subscription scope[​](#subscription-scope)

Subscription objects provide an interface to attach listeners for various real-time update types. Your app receives messages and events via those event listeners. Two types of subscriptions are available:

- [`Subscription`](#create-a-subscription), created from an entity with a scope of only that entity (for example, a particular channel)

- [`SubscriptionSet`](#create-a-subscription-set), created from the PubNub client with a global scope (for example, all subscriptions created on a single `pubnub` object ). A subscription set can have one or more subscriptions.

  

The event listener is a single point through which your app receives all the messages, signals, and events in the entities you subscribed to. For information on adding event listeners, refer to [Event listeners](#event-listeners).

### Create a subscription[​](#create-a-subscription)

An entity-level `Subscription` allows you to receive messages and events for only that entity for which it was created. Using multiple entity-level `Subscription`s is useful for handling various message/event types differently in each channel.

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

*  requiredParameterDescription`options` *Type: `Option<Vec<SubscriptionOptions>>``Subscription` [behavior configuration](#subscriptionoptions). Pass `None` for no options.

### Create a subscription set[​](#create-a-subscription-set)

A client-level `SubscriptionSet` allows you to receive messages and events for all entities in the set. A single `SubscriptionSet` is useful for similarly handling various message/event types in each channel.

```
`// client-based, general-scoped  
pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Option&[String]>,  
    channel_groups: Option&[String]>,  
    options: OptionVecSubscriptionOptions>>  
}))  
`
```

*  requiredParameterDescription`parameters` *Type: `SubscriptionParams<String>`Additional `Subscription` configuration. → `channels` *Type: `Option<&[String]>``Subscription` behavior configuration. Pass `None` for no options. → `channel_groups` *Type: `Option<&[String]>``Subscription` behavior configuration. Pass `None` for no options. → `options` *Type: `Option<Vec<SubscriptionOptions>>``Subscription` [behavior configuration](#subscriptionoptions). Pass `None` for no options.

##### Add/remove sets

You can add and remove subscription sets to create new sets. Refer to the [Other examples](#other-examples-1) section for more information.

#### `SubscriptionOptions`[​](#subscriptionoptions)

`SubscriptionOptions` is an enum. Available variants include:

OptionDescription`ReceivePresenceEvents`Whether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

### Method(s)[​](#methods-1)

`Subscription` and `SubscriptionSet` use the same methods to subscribe:

- [Subcribe](#subscribe-1)

- [Subscribe with timetoken](#subscribe-with-timetoken)

#### Subscribe[​](#subscribe-1)

To subscribe, you can use the following method in the Rust SDK:

```
`subscription.subscribe()  
`
```

##### Basic usage[​](#basic-usage-1)

```
`  
`
```

##### Other examples[​](#other-examples-1)

###### Create a subscription set from 2 individual subscriptions[​](#create-a-subscription-set-from-2-individual-subscriptions)

```
`// create a subscription from a channel entity  
let channel = client.channel("channelName");  
let subscription1 = channel.subscription(options: OptionVecSubscriptionOptions>>);  
  
// create a subscription from a channel group entity  
let channel_group = client.channel_group("channelGroup");  
let subscription2 = channel_group.subscription(options: OptionVecSubscriptionOptions>>);  
  
// create a subscription set from individual entities  
let set = subscription1 + subscription2;  
  
// Add another subscription to the set  
set += subscription3  
// Or  
set.add_subscriptions(subscription3)  
`
```
show all 20 lines

###### Create a subscription set from 2 sets[​](#create-a-subscription-set-from-2-sets)

```
`// create a subscription set with multiple channels  
let set1 = pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Some(&["channelName1", "channelName2"]),  
    channel_groups: None,  
    options: None  
}))  
  
// create a subscription set with multiple channel groups and options  
let set2 = pubnub.subscription(parameters: (SubscriptionParams {  
    channels: None,  
    channel_groups: Some(&["channelGroup1", "channelGroup2"]),  
    options: OptionVecSubscriptionOptions>>  
}))  
  
// create a new subscription set from 2 sets  
`
```
show all 19 lines

##### Returns[​](#returns-1)

The `subscribe()` method doesn't have a return value.

#### Subscribe with timetoken[​](#subscribe-with-timetoken)

To subscribe to real-time updates from a given timetoken, use the following method in the Rust SDK:

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

*  requiredParameterDescription`cursor` *Type: `Into<SubscriptionCursor>`   
 `String`   
 `usize`   
 `u64`Cursor from which to return any available cached messages. Message retrieval with cursor is not guaranteed and should only be considered a best-effort service. A cursor consists of a timetoken and region: `SubscriptionCursor{timetoken: String, region: u32}`   
   
 If you pass any primitive type, the SDK converts them into `SubscriptionCursor` but if their value is not a 17-digit number or a string with numeric characters, the provided value will be ignored.

##### Basic usage[​](#basic-usage-2)

```
`let subscription = pubnub.subscription(SubscriptionParams {  
    channels: Some(&["my_channel", "other_channel"]),  
    channel_groups: None,  
    options: Some(vec![SubscriptionOptions::ReceivePresenceEvents]),  
});  
  
let cursor = SubscriptionCursor {  
    timetoken: "100000000000".to_string(),  
    region: 1,  
};  
  
subscription.subscribe_with_timetoken(cursor);  
`
```

##### Returns[​](#returns-2)

The `subscribe_with_timetoken()` method doesn't have a return value.

## Entities[​](#entities)

Entities are subscribable objects for which you can receive real-time updates (messages, events, etc).

- [`Channel`](#create-channels)

- [`ChannelGroup`](#create-channel-groups)

- [`UserMetadata`](#create-user-metadata)

- [`ChannelMetadata`](#create-channel-metadata)

### Create channels[​](#create-channels)

These methods return one or more local `Channel` entities.

```
`pubnub.channel(String)  
  
pubnub.channels(&[String])  
`
```

*  requiredParameterDescription`channel` *Type: `String`The ID of the [channel](/docs/general/channels/overview) to create a subscription of.`channel` *Type: `&[String]`The slice with IDs of the channels to create a subscription of.

#### Basic usage[​](#basic-usage-3)

```
`  
`
```

```
`  
`
```

### Create channel groups[​](#create-channel-groups)

These methods return one or more local `ChannelGroup` entities.

```
`pubnub.channel_group(String)  
  
pubnub.channel_groups(&[String])  
`
```

*  requiredParameterDescription`channel_group` *Type: `String`The name of the [channel group](/docs/general/channels/subscribe#channel-groups) to create a subscription of.`channel_groups` *Type: `&[String]`The slice with names of the [channel groups](/docs/general/channels/subscribe#channel-groups) to create a subscription of.

#### Basic usage[​](#basic-usage-4)

```
`  
`
```

```
`  
`
```

### Create channel metadata[​](#create-channel-metadata)

These methods return one or more local `ChannelMetadata` entities.

```
`pubnub.channel_metadata(String)  
  
pubnub.channels_metadata(&[String])  
`
```

*  requiredParameterDescription`channel_metadata` *Type: `String`The String identifier of the [channel metadata](/docs/general/metadata/channel-metadata) object to create a subscription of.`channels_metadata` *Type: `&[String]`The slice with string identifiers of the [channel metadata](/docs/general/metadata/channel-metadata) objects to create a subscription of.

#### Basic usage[​](#basic-usage-5)

```
`  
`
```

```
`  
`
```

### Create user metadata[​](#create-user-metadata)

These methods return one or more local `UserMetadata` entities.

```
`pubnub.user_metadata(String)  
  
pubnub.users_metadata(&[String])  
`
```

*  requiredParameterDescription`user_metadata` *Type: `String`The String identifier of the [user metadata](/docs/general/metadata/users-metadata) object to create a subscription of.`users_metadata` *Type: `&[String]`The slice with string identifiers of the [user metadata](/docs/general/metadata/users-metadata) objects to create a subscription of.

#### Basic usage[​](#basic-usage-6)

```
`  
`
```

```
`  
`
```

## Event listeners[​](#event-listeners)

Messages and events are received in your app using a listener. This listener allows a single point to receive all messages, signals, and events.

You can attach listeners to the instances of [`Subscription`](#create-a-subscription), [`SubscriptionSet`](#create-a-subscription-set), and, in the case of the connection status, the PubNub client.

### Add listeners[​](#add-listeners)

You can choose to implement a generic stream of updates for a given subscription (`DataStream<Update>`) or a stream dedicated to receiving only a selected type, like `Message` or `File`.

#### Method(s)[​](#methods-2)

```
`subscription  
    /// Stream used to notify regular messages.  
    .messages_stream() -> DataStreamMessage>;  
  
    /// Stream used to notify signals.  
    .signals_stream() -> DataStreamMessage>;  
  
    /// Stream used to notify message action updates.  
    .message_actions_stream() -> DataStreamMessageAction>;  
  
    /// Stream used to notify about file receive.  
    .files_stream() -> DataStreamFile>;  
  
    /// Stream used to notify about App Context (Channel and User) updates.  
    .app_context_stream() -> DataStreamAppContext>;  
`
```
show all 21 lines

#### Basic usage[​](#basic-usage-7)

```
`  
`
```

### Add connection status listener[​](#add-connection-status-listener)

The PubNub client has a listener dedicated to handling connection status updates.

##### Client scope

This listener is only available on the PubNub object.

#### Method(s)[​](#methods-3)

```
`pubnub.status_stream()  
`
```

#### Basic usage[​](#basic-usage-8)

```
`  
`
```

#### Returns[​](#returns-3)

The subscription status. For information about available statuses, refer to [SDK statuses](/docs/general/setup/connection-management#sdk-statuses).

## Clone empty[​](#clone-empty)

Create a clone of an existing subscription with the same subscription state but an empty list of real-time event listeners.

### Method(s)[​](#methods-4)

```
`subscription.clone_empty()  
`
```

### Basic Usage[​](#basic-usage-9)

```
`  
`
```

### Returns[​](#returns-4)

A new instance of the subscription object with an empty event dispatcher.

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a [`Subscription`](#create-a-subscription) or a [`SubscriptionSet`](#create-a-subscription-set).

### Method(s)[​](#methods-5)

```
`subscription.unsubscribe()  
  
subscription_set.unsubscribe()  
`
```

### Basic Usage[​](#basic-usage-10)

```
`let subscription = client.subscription(SubscriptionParams {  
    channels: Some(&["my_channel", "other_channel"]),  
    channel_groups: None,  
    options: None  
});  
subscription.subscribe(None);  
  
subscription.unsubscribe();  
`
```

### Returns[​](#returns-5)

None

## Unsubscribe All[​](#unsubscribe-all)

Stop receiving real-time updates from all data streams and remove the entities associated with them.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-6)

```
`pubnub.unsubscribe_all()  
`
```

### Basic Usage[​](#basic-usage-11)

```
`let subscription = client.subscription(SubscriptionParams {  
    channels: Some(&["my_channel", "other_channel"]),  
    channel_groups: None,  
    options: None  
});  
subscription.subscribe();  
  
let channel_group = client.channel_group("my_channel_group");  
let cg_subscription = channel_group.subscription(None);  
cg_subscription.subscribe();  
  
pubnub.unsubscribe_all();  
`
```

### Returns[​](#returns-6)

None
Last updated on **Jun 16, 2025**