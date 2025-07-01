On this page
# Publish/Subscribe API for Swift Native SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel. All publish calls are performed asynchronously.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/swift/api-reference/configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/swift/api-reference/configuration). You can also [encrypt](/docs/sdks/swift/api-reference/configuration#cryptomodule) messages.

The `message` and `meta` arguments can contain any Swift type conforming to `JSONCodable` protocol. By default, scalar values like `Int`, `String`, `Double`, `Bool`, `Date` are provided with this conformance by us, as do collections like `Array` and `Dictionary` where their values conform to `JSONCodable`. You can also apply `JSONCodable` to your own custom types. String content can include any single-byte or multi-byte UTF-8 character.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

 You can optionally provide the `customMessageType` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check the `Result` value in the completion handler to determine if the operation was successful or if it failed

- Publish the next message only after receiving a success return code.

- If `.failure(error)` is returned as the `Result`, retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

To `Publish a message` you can use the following method(s) in the Swift SDK:

```
`func publish(  
    channel: String,  
    message: JSONCodable,  
    customMessageType: String? = nil,  
    shouldStore: Bool? = nil,  
    storeTTL: Int? = nil,  
    meta: AnyJSON? = nil,  
    shouldCompress: Bool = false,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe `channel` ID to publish to.`message` *Type: JSONCodableDefault:  
n/aThe `message` to publish.`customMessageType`Type: String?Default:  
`nil`A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`shouldStore`Type: Bool?Default:  
`nil`If `true` the published message is stored in history.`storeTTL`Type: Int?Default:  
`nil`Set a per message time to live in Message Persistence. 1. If shouldStore = `true`, and `storeTTL` = 0, the message is stored with no expiry time. 2. If shouldStore = `true` and `storeTTL` = X (X is an Integer value), the message is stored with an expiry time of X hours. 3. If shouldStore is `false` or not specified, the message isn't stored and the `storeTTL` parameter is ignored. 4. If `storeTTL` isn't specified, then expiration of the message defaults back to the expiry value for the key.`meta`Type: JSONCodable?Default:  
`nil`Publish extra `meta` with the request.`shouldCompress`Type: BoolDefault:  
`false`When `true`, the SDK uses HTTP POST to publish the messages. The message is sent in the BODY of the request, instead of the query string when HTTP GET is used. Also the messages are compressed thus reducing the size of the messages.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<Timetoken, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success)

The `Timetoken` of the published Message.

##### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Other Examples[​](#other-examples)

#### Publish a Dictionary object[​](#publish-a-dictionary-object)

```
`  
`
```

#### Publish the above Dictionary as a custom Swift Object[​](#publish-the-above-dictionary-as-a-custom-swift-object)

```
`  
`
```

#### Mix and match types with custom objects[​](#mix-and-match-types-with-custom-objects)

```
`  
`
```

#### Publish an APNs2 push notification[​](#publish-an-apns2-push-notification)

```
`  
`
```

#### Root level push message object[​](#root-level-push-message-object)

```
`public struct PubNubPushMessage: JSONCodable {  
    
  /// The payload delivered via Apple Push Notification service (APNS)  
  public let apns: PubNubAPNSPayload?  
  
  /// The payload delivered via Firebase Cloud Messaging service (FCM)  
  public let fcm: PubNubFCMPayload?  
  
  /// Additional message payload sent outside of the push notification  
  ///  
  /// In order to guarantee valid JSON any scalar values will be assigned to the `data` key.  
  /// Non-scalar values will retain their coding keys.  
  public var additionalMessage: JSONCodable?  
}  
`
```

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message` you can use the following method(s) in the Swift SDK:

```
`func fire(  
    channel: String,  
    message: JSONCodable,  
    meta: JSONCodable? = nil,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe `channel` ID to fire to.`message` *Type: JSONCodableDefault:  
n/aThe `message` to fire.`meta`Type: JSONCodable?Default:  
nilPublish extra `meta` with the request.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<Timetoken, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-1)

##### Success[​](#success-1)

The `Timetoken` of the published Message.

##### Failure[​](#failure-1)

An `Error` describing the failure.

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

To `Signal a message` you can use the following method(s) in the Swift SDK:

```
`func signal(   
  channel: String,   
  message: JSONCodable,  
  customMessageType: String? = nil,  
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
  completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe channel ID to send a signal to.`message` *Type: JSONCodableDefault:  
n/aThe message to signal.`customMessageType`Type: String?Default:  
`nil`A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<Timetoken, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-2)

##### Success[​](#success-2)

The `Timetoken` of the published Message.

##### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`  
`
```

## Subscribe[​](#subscribe)

The subscribe function creates an open TCP socket to PubNub and begins listening for messages and events on a specified entity or set of entities. To subscribe successfully, you must configure the appropriate `subscribeKey` at [initialization](/docs/sdks/swift/api-reference/configuration).

##### Conceptual overview

For more general information about subscriptions, refer to [Subscriptions](/docs/general/channels/subscribe).

Entities are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) that provide access to their encapsulated APIs. You can subscribe using the PubNub client object or directly on a specific entity:

- [`ChannelRepresentation`](#create-channels)

- [`ChannelGroupRepresentation`](#create-channel-groups)

- [`UserMetadataRepresentation`](#create-user-metadata)

- [`ChannelMetadataRepresentation`](#create-channel-metadata)

A newly subscribed client receives messages after the `subscribe()` call completes. You can configure [`automaticRetry`](/docs/sdks/swift/api-reference/configuration#initializers) to attempt to reconnect automatically and retrieve any available messages if a client gets disconnected (stops all real-time data flow but might not necessarily remove subscriptions or affect the state of subscribed channels).

### Subscription scope[​](#subscription-scope)

Subscription objects provide an interface to attach listeners for various real-time update types. Your app receives messages and events via those event listeners. Two types of subscriptions are available:

- [`Subscription`](#create-a-subscription), created from an entity with a scope of only that entity (for example, a particular channel)

- [`SubscriptionSet`](#create-a-subscription-set), created from the PubNub client with a global scope (for example, all subscriptions created on a single `pubnub` object). A subscription set can have one or more subscriptions.

  

The event listener is a single point through which your app receives all the messages, signals, and events in the entities you subscribed to. For information on adding event listeners, refer to [Event listeners](#event-listeners).

### Create a subscription[​](#create-a-subscription)

An entity-level `Subscription` allows you to receive messages and events for only that entity for which it was created. Using multiple entity-level `Subscription`s is useful for handling various message/event types differently in each channel.

##### Keep a strong reference

You should keep a strong reference to every created subscription/subscription set because they must stay in memory to listen for updates. If you were to create a `Subscription`/`SubscriptionSet` and not keep a strong reference to it, Automatic Reference Counting (ARC) could deallocate the `Subscription` as soon as your code finishes executing.

To create a subscription object, call the following method on any entity defined in the [Entities](#entities) section:

```
`// Entity-based, local-scoped  
func subscription(  
  queue: DispatchQueue = .main,  
  options: SubscriptionOptions = SubscriptionOptions.empty()  
)  
`
```

*  requiredParameterDescription`options`Type: `SubscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

### Create a subscription set[​](#create-a-subscription-set)

A client-level `SubscriptionSet` allows you to receive messages and events for all entities. A single `SubscriptionSet` is useful for similarly handling various message/event types in each channel.

##### Keep a strong reference

You should keep a strong reference to every created subscription/subscription set because they must stay in memory to listen for updates. If you were to create a `Subscription`/`SubscriptionSet` and not keep a strong reference to it, Automatic Reference Counting (ARC) could deallocate the `Subscription` as soon as your code finishes executing.

To create a `SubscriptionSet`, call the following method on a `PubNub` instance:

```
`// Client-based, general-scoped  
func subscription(  
    queue: DispatchQueue = .main,  
    entities: any CollectionSubscribable>,  
    options: SubscriptionOptions = SubscriptionOptions.empty()  
) -> SubscriptionSet  
`
```

*  requiredParameterDescription`queue`Type: `DispatchQueue`An underlying queue to dispatch events. Defaults to the main queue.`entities` *Type: `Collection<Subscribable>`One or more entities to create a subscription of. Available values include: `ChannelRepresentation`, `ChannelGroupRepresentation`, `UserMetadataRepresentation`, `ChannelMetadataRepresentation`.`options`Type: `SubscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

##### Add/remove sets

You can add and remove subscriptions to create new sets. Refer to the [Other examples](#other-examples-1) section for more information.

#### `SubscriptionOptions`[​](#subscriptionoptions)

`SubscriptionOptions` is the base class for all possible options. Available subclasses are:

OptionDescription`ReceivePresenceEvents`Whether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

### Method(s)[​](#methods-3)

`Subscription` and `SubscriptionSet` use the same `subscribe()` method.

#### Subscribe[​](#subscribe-1)

To subscribe, you can use the following method in the Swift SDK:

```
`func subscribe(with: Timetoken? = nil)  
`
```

*  requiredParameterDescription`with`Type: `Timetoken`Timetoken from which to return any available cached messages. Message retrieval with timetoken is not guaranteed and should only be considered a best-effort service.   
   
 If the value is not a 17-digit number, the provided value will be ignored.

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

## Entities[​](#entities)

Entities are subscribable objects for which you can receive real-time updates (messages, events, etc).

- [`ChannelRepresentation`](#create-channels)

- [`ChannelGroupRepresentation`](#create-channel-groups)

- [`UserMetadataRepresentation`](#create-user-metadata)

- [`ChannelMetadataRepresentation`](#create-channel-metadata)

The following methods can be called on a `PubNub` instance to create a local entity:

### Create channels[​](#create-channels)

This method returns a local `ChannelRepresentation` entity.

```
`func channel(_ name: String) -> ChannelRepresentation  
`
```

*  requiredParameterDescription`channel` *Type: `String`The ID of the [channel](/docs/general/channels/overview) to create a subscription of.

#### Basic usage[​](#basic-usage-4)

```
`  
`
```

### Create a channel group[​](#create-a-channel-group)

This method returns a local `ChannelGroupRepresentation` entity.

```
`func channelGroup(_ name: String) -> ChannelGroupRepresentation  
`
```

*  requiredParameterDescription`name` *Type: `String`The name of the [channel group](/docs/general/channels/subscribe#channel-groups) to create a subscription of.

#### Basic usage[​](#basic-usage-5)

```
`  
`
```

### Create channel metadata[​](#create-channel-metadata)

This method returns a local `ChannelMetadataRepresentation` entity.

```
`func channelMetadata(_ name: String) -> ChannelMetadataRepresentation  
`
```

*  requiredParameterDescription`name` *Type: `String`The String identifier of the [channel metadata](/docs/general/metadata/channel-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-6)

```
`  
`
```

### Create user metadata[​](#create-user-metadata)

This method returns a local `UserMetadataRepresentation` entity.

```
`func userMetadata(_ name: String) -> UserMetadataRepresentation  
`
```

*  requiredParameterDescription`name` *Type: `String`The String identifier of the [user metadata](/docs/general/metadata/users-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-7)

```
`  
`
```

## Event listeners[​](#event-listeners)

Messages and events are received in your app using a listener. This listener allows a single point to receive all messages, signals, and events.

You can attach listeners to the instances of [`Subscription`](#create-a-subscription), [`SubscriptionSet`](#create-a-subscription-set), and, in the case of the connection status, the PubNub client.

### Add listeners[​](#add-listeners)

You can implement multiple listeners with the `onEvent` closure or register an event-specific listener that receives only a selected type, like `message` or `file`.

#### Method(s)[​](#methods-4)

```
`  
`
```

```
`  
`
```

```
`  
`
```

```
`  
`
```

```
`  
`
```

```
`  
`
```

```
`  
`
```

```
`  
`
```

### Add connection status listener[​](#add-connection-status-listener)

The PubNub client has a listener dedicated to handling connection status updates.

##### Client scope

This listener is only available on the `PubNub` object.

#### Method(s)[​](#methods-5)

```
`var onConnectionStateChange: ((ConnectionStatus) -> Void)?  
`
```

#### Basic usage[​](#basic-usage-8)

```
`  
`
```

#### Returns[​](#returns-1)

The subscription status. For information about available statuses, refer to [SDK statuses](/docs/general/setup/connection-management#sdk-statuses).

## Clone[​](#clone)

Create a clone of an existing subscription with the same subscription state but an empty closures of real-time event listeners.

### Method(s)[​](#methods-6)

```
`// Method in the `Subscription` class  
func clone() -> Subscription  
// Method in the `SubscriptionSet` class  
func clone() -> SubscriptionSet  
`
```

### Basic Usage[​](#basic-usage-9)

```
`  
`
```

### Returns[​](#returns-2)

A new instance of the subscription object with an empty event dispatcher.

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a [`Subscription`](#create-a-subscription) or a [`SubscriptionSet`](#create-a-subscription-set).

### Method(s)[​](#methods-7)

```
`func unsubscribe()  
`
```

### Basic Usage[​](#basic-usage-10)

```
`  
`
```

### Returns[​](#returns-3)

None

## Unsubscribe All[​](#unsubscribe-all)

Remove the client's active subscriptions from all channels. It clears out the list of channels the client is currently listening to.

##### Client scope

This method is only available on the `PubNub` object.

### Method(s)[​](#methods-8)

```
`func unsubscribeAll()  
`
```

### Basic Usage[​](#basic-usage-11)

```
`  
`
```

### Returns[​](#returns-4)

None
