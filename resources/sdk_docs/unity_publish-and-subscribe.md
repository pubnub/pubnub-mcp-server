On this page
# Publish/Subscribe API for Unity SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Message serialization
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/unity/api-reference/configuration#configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/unity/api-reference/configuration#configuration). You can also [encrypt](/docs/sdks/unity/api-reference/configuration#cryptomodule) messages.

The message can contain any JSON-serializable data (Objects, Arrays, Ints, Strings) and shouldn't contain any special classes or functions. String content can include any single-byte or multi-byte UTF-8 characters.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

Sending structures with circular references (like Vector3) may cause issues depending on your JSON library settings. In those cases, you can use the `GetJsonSafe()` extension method included in the PubNub namespace.

```
`pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
`
```

 You can optionally provide the `CustomMessageType` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

To `Publish a message` you can use the following method(s) in the Unity SDK:

```
`pubnub.Publish()  
    .Message(object)  
    .Channel(string)  
    .ShouldStore(bool)  
    .Meta(Dictionarystring, object>)  
    .UsePOST(bool)  
    .Ttl(int)  
    .QueryParam(Dictionarystring,object>)  
    .CustomMessageType(string)  
    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

*  requiredParameterDescription`Message` *Type: objectThe payload.`Channel` *Type: stringDestination of the `Message` (channel ID).`ShouldStore`Type: boolStore in history.   
If `ShouldStore` is not specified, then the history configuration on the key is used.`Meta`Type: Dictionary`<string, object>``Meta` data object which can be used with the filtering ability.`UsePOST`Type: boolUse POST to `Publish`.`Ttl`Type: intSet a per message time to live in storage. 
1. $1
2. $1
3. $1
4. $1

`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`CustomMessageType`Type: stringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`Sync`Type: CommandBlock the thread, exception thrown if something goes wrong.`Async`Type: `PNCallback``PNCallback` of type `PNPublishResult`.`Execute`Type: `System.Action``System.Action` of type `PNPublishResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPublishResult>>`.

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi.Unity;  
using UnityEngine;  
  
public class PubnubBasicUsageExample : MonoBehaviour {  
  
    //Reference to a pubnub manager previously setup in Unity Editor  
    //For more details see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    //An editor-serialized string with the test channel ID  
    [SerializeField] private string testChannelId = "test_channel_id";  
  
    private async void Start() {  
        //Getting a reference to the Pubnub instance  
        var pubnub = pubnubManager.pubnub;  
`
```
show all 33 lines

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Returns[​](#returns)

The `Publish()` operation returns a `PNResult<PNPublishResult>` which contains the following properties:

Property NameTypeDescription`Result`PNPublishResultReturns a `PNPublishResult` object.`Status``PNStatus`Returns a `PNStatus` object.

`PNPublishResult` contains the following properties:

Property NameTypeDescription`Timetoken`longReturns a `long` representation of the timetoken when the message was published.

### Other Examples[​](#other-examples)

#### Publish a message to a channel synchronously[​](#publish-a-message-to-a-channel-synchronously)

```
`//Publishing Dictionary  
Dictionarystring, float> position = new Dictionarystring, float>();  
position.Add("lat", 32F);  
position.Add("lng", 32F);  
  
Debug.Log("before pub: " + pubnub.JsonPluggableLibrary.SerializeToJsonString(position));  
  
pubnub.Publish()  
    .Message(position)  
    .Channel("my_channel")  
    .CustomMessageType("text-message")  
    .Execute(new PNPublishResultExt(  
        (result, status) => {  
            Debug.Log("pub timetoken: " + result.Timetoken.ToString());  
            Debug.Log("pub status code : " + status.StatusCode.ToString());  
`
```
show all 17 lines

#### Publish with metadata[​](#publish-with-metadata)

```
`string[] arrayMessage = new string[] {  
    "hello",  
    "there"  
};  
  
pubnub.Publish()  
    .Message(arrayMessage.ToList())  
    .Channel("suchChannel")  
    .ShouldStore(true)  
    .Meta("")  
    .UsePOST(true)  
    .CustomMessageType("text-message")  
    .Execute((result, status) => {  
            // handle publish result, status always present, result if successful  
            // status.Error to see if error happened  
`
```
show all 17 lines

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
`PNPublishResult res = pubnub.Publish()  
    .Channel("coolChannel")  
    .Message("test")  
    .ShouldStore(true)  
    .Ttl(10)  
    .CustomMessageType("text-message")  
    .Sync();  
`
```

#### Publishing messages for receipt on FCM and APNS associated devices, sample payload[​](#publishing-messages-for-receipt-on-fcm-and-apns-associated-devices-sample-payload)

```
`public class MobilePayload  
{  
    public Dictionarystring, object> pn_apns;  
    public Dictionarystring, object> pn_gcm;  
    public Dictionarystring, object> full_game;  
}  
  
Dictionarystring, object> apnsData = new Dictionarystring, object>();  
apnsData.Add("aps", new Dictionarystring, object>() {  
    { "alert", "Game update 49ers touchdown" },  
    { "badge", 2 }  
});  
apnsData.Add("teams", new string[] { "49ers", "raiders" });  
apnsData.Add("score", new int[] { 7, 0 });  
  
`
```
show all 54 lines

For more details, refer to [Mobile Push](/docs/general/push/send).

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message` you can use the following method(s) in the Unity SDK:

```
`pubnub.Fire()  
    .Message(object)  
    .Channel(string)  
    .Meta(Dictionarystring, object>)  
    .UsePOST(bool)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

*  requiredParameterDescription`Message` *Type: objectThe payload.`Channel` *Type: stringDestination of the `message` (channel ID).`Meta`Type: Dictionary`<string, object>``Meta` data object which can be used with the filtering ability.`UsePOST`Type: boolUse POST to `Publish`.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Sync`Type: CommandBlock the thread, exception thrown if something goes wrong.`Async`Type: `PNCallback``PNCallback` of type `PNPublishResult``Execute`Type: `System.Action``System.Action` of type `PNPublishResult``ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPublishResult>>`.

### Basic Usage[​](#basic-usage-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
`string[] arrMessage = new string[] {  
    "hello",  
    "there"  
};  
  
pubnub.Fire()  
    .Message(arrMessage.ToList())  
    .Channel(channel)  
    .UsePOST(true)  
    .Execute((result, status) => {  
            if (status.Error) {  
                // something bad happened.  
                Debug.Log("error happened while publishing: " + pubnub.JsonPluggableLibrary.SerializeToJsonString(status));  
            } else {  
                Debug.Log("publish worked! timetoken: " + result.Timetoken.ToString());  
`
```
show all 18 lines

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-2)

To `Signal a message` you can use the following method(s) in the Unity SDK:

```
`pubnub.Signal()  
    .Message(object)  
    .Channel(string)  
    .CustomMessageType(string)  
    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

*  requiredParameterDescription`Message` *Type: objectThe payload.`Channel` *Type: stringDestination of the `Message` (channel ID).`CustomMessageType`Type: stringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`Execute`Type: `System.Action``System.Action` of type `PNPublishResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPublishResult>>`.

### Basic Usage[​](#basic-usage-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`Dictionarystring, string> myMessage = new Dictionarystring, string>();  
myMessage.Add("msg", "Hello Signals");  
  
pubnub.Signal()  
    .Message(myMessage)  
    .Channel("foo")  
    .CustomMessageType("text-message")  
    .Execute((result, status) => {  
        if (status.Error) {  
            Debug.Log(status.ErrorData.Information);  
        } else {  
            Debug.Log(result.Timetoken);  
        }  
    });  
`
```

### Response[​](#response)

Property NameTypeDescription`Timetoken`longReturns a `long` representation of the timetoken when the message was signaled.

## Subscribe[​](#subscribe)

The subscribe function creates an open TCP socket to PubNub and begins listening for messages and events on a specified entity or set of entities. To subscribe successfully, you must configure the appropriate `subscribeKey` at [initialization](/docs/sdks/unity/api-reference/configuration).

##### Conceptual overview

For more general information about subscriptions, refer to [Subscriptions](/docs/general/channels/subscribe).

Entities are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) that provide access to their encapsulated APIs. You can subscribe using the PubNub client object or directly on a specific entity:

- [`Channel`](#create-channels)

- [`ChannelGroup`](#create-channel-groups)

- [`UserMetadata`](#create-user-metadata)

- [`ChannelMetadata`](#create-channel-metadata)

A newly subscribed client receives messages after the `subscribe()` call completes. You can configure [`automaticRetry`](/docs/sdks/unity/api-reference/configuration#initializers) to attempt to reconnect automatically and retrieve any available messages if a client gets disconnected.

### Subscription scope[​](#subscription-scope)

Subscription objects provide an interface to attach listeners for various real-time update types. Your app receives messages and events via those event listeners. Two types of subscriptions are available:

- [`Subscription`](#create-a-subscription), created from an entity with a scope of only that entity (for example, a particular channel)

- [`SubscriptionSet`](#create-a-subscription-set), created from the PubNub client with a global scope (for example, all subscriptions created on a single `pubnub` object ). A subscription set can have one or more subscriptions.

  

The event listener is a single point through which your app receives all the messages, signals, and events in the entities you subscribed to. For information on adding event listeners, refer to [Event listeners](#event-listeners).

### Create a subscription[​](#create-a-subscription)

An entity-level `Subscription` allows you to receive messages and events for only that entity for which it was created. Using multiple entity-level `Subscription`s is useful for handling various message/event types differently in each channel.

##### Keep a strong reference

You should keep a strong reference to every created subscription/subscription set because they must stay in memory to listen for updates. If you were to create a `Subscription`/`SubscriptionSet` and not keep a strong reference to it, Automatic Reference Counting (ARC) could deallocate the `Subscription` as soon as your code finishes executing.

```
`// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  
  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  
`
```

*  requiredParameterDescription`options`Type: `SubscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

### Create a subscription set[​](#create-a-subscription-set)

A client-level `SubscriptionSet` allows you to receive messages and events for all entities. A single `SubscriptionSet` is useful for similarly handling various message/event types in each channel.

##### Keep a strong reference

You should keep a strong reference to every created subscription/subscription set because they must stay in memory to listen for updates. If you were to create a `Subscription`/`SubscriptionSet` and not keep a strong reference to it, Automatic Reference Counting (ARC) could deallocate the `Subscription` as soon as your code finishes executing.

```
`// client-based, general-scoped  
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(  
   channels: string[],  
   channelGroups: string[],  
   options: SubscriptionOptions  
)  
`
```

*  requiredParameterDescription`channels` *Type: `string[]`One or more channels to create a subscription of. Either `channels` or `channelGroups` is required.`channelGroups` *Type: `string[]`One or more channels to create a subscription of. Either `channels` or `channelGroups` is required.`options`Type: `SubscriptionOptions``Subscription` [behavior configuration](#subscriptionoptions).

##### Add/remove sets

You can add and remove subscriptions to create new sets. Refer to the [Other examples](#other-examples-1) section for more information.

#### `SubscriptionOptions`[​](#subscriptionoptions)

`SubscriptionOptions` is an enum. Available properties include:

OptionDescription`ReceivePresenceEvents`Whether presence updates for `userId`s should be delivered through the listener streams.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

### Method(s)[​](#methods-3)

`Subscription` and `SubscriptionSet` use the same `subscribe<object>()` method.

#### Subscribe[​](#subscribe-1)

To subscribe, you can use the following method in the Swift SDK:

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

*  requiredParameterDescription`cursor`Type: `SubscriptionCursor`Cursor from which to return any available cached messages. Message retrieval with cursor is not guaranteed and should only be considered a best-effort service. A cursor consists of a timetoken and region: `cursor: { Timetoken: long?; Region: int? }`   
   
 If you pass any primitive type, the SDK converts them into `SubscriptionCursor` but if their value is not a 17-digit number or a string with numeric characters, the provided value will be ignored.

##### Basic usage[​](#basic-usage-3)

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription()  
subscription1.Subscribeobject>()  
  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
)  
  
subscriptionSet.Subscribeobject>()  
`
```

##### Other examples[​](#other-examples-1)

###### Create a subscription set from 2 individual subscriptions[​](#create-a-subscription-set-from-2-individual-subscriptions)

```
`// Create a subscription from a channel entity  
Subscription subscription1 = pubnub.Channel("channelName").Subscription()  
  
// Create a subscription from a channel group entity  
Subscription subscription2 = pubnub.ChannelGroup("channelGroupName").Subscription()  
  
// create a subscription set from individual entities  
SubscriptionSet subscriptionSet = subscription1.Add(subscription2)  
  
subscriptionSet.Subscribeobject>()  
`
```

##### Returns[​](#returns-1)

The `subscribe()` method doesn't have a return value.

## Entities[​](#entities)

Entities are subscribable objects for which you can receive real-time updates (messages, events, etc).

- [`ChannelRepresentation`](#create-channels)

- [`ChannelGroupRepresentation`](#create-channel-groups)

- [`UserMetadataRepresentation`](#create-user-metadata)

- [`ChannelMetadataRepresentation`](#create-channel-metadata)

### Create channels[​](#create-channels)

This method returns a local `Channel` entity.

```
`pubnub.Channel(String)  
`
```

*  requiredParameterDescription`Channel` *Type: `String`The ID of the [channel](/docs/general/channels/overview) to create a subscription of.

#### Basic usage[​](#basic-usage-4)

```
`pubnub.Channel("channelName")  
`
```

### Create channel groups[​](#create-channel-groups)

This method returns a local `ChannelGroup` entity.

```
`pubnub.ChannelGroup(String)  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: `String`The name of the [channel group](/docs/general/channels/subscribe#channel-groups) to create a subscription of.

#### Basic usage[​](#basic-usage-5)

```
`pubnub.ChannelGroup("channelGroupName")  
`
```

### Create channel metadata[​](#create-channel-metadata)

This method returns a local `ChannelMetadata` entity.

```
`pubnub.ChannelMetadata(String)  
`
```

*  requiredParameterDescription`ChannelMetadata` *Type: `String`The String identifier of the [channel metadata](/docs/general/metadata/channel-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-6)

```
`pubnub.ChannelMetadata("channelMetadata")  
`
```

### Create user metadata[​](#create-user-metadata)

This method returns a local `UserMetadata` entity.

```
`pubnub.UserMetadata(String)  
`
```

*  requiredParameterDescription`UserMetadata` *Type: `String`The String identifier of the [user metadata](/docs/general/metadata/users-metadata) object to create a subscription of.

#### Basic usage[​](#basic-usage-7)

```
`pubnub.UserMetadata("userMetadata")  
`
```

## Event listeners[​](#event-listeners)

Messages and events are received in your app using a listener. This listener allows a single point to receive all messages, signals, and events.

You can attach listeners to the instances of [`Subscription`](#create-a-subscription), [`SubscriptionSet`](#create-a-subscription-set), and, in the case of the connection status, the PubNub client.

### Add listeners[​](#add-listeners)

You can implement multiple listeners with the `onEvent` closure or register an event-specific listener that receives only a selected type, like `message` or `file`.

#### Method(s)[​](#methods-4)

```
`// Add event-specific listeners  
// Add a listener to receive Message changes  
Subscription subscription1 = pubnub.Channel("channelName").Subscription()  
  
subscription1.OnMessage = (Pubnub pn, PNMessageResultobject> messageEvent) => {  
 Console.WriteLine($"Message received {messageEvent.Message}");  
};  
  
subscription1.Subscribeobject>()  
  
  
// Add multiple listeners  
SubscribeCallbackExt eventListener = new SubscribeCallbackExt(  
 delegate (Pubnub pn, PNMessageResultobject> messageEvent) {  
  Console.WriteLine($"received message {messageEvent.Message}");  
`
```
show all 37 lines

#### Basic usage[​](#basic-usage-8)

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription()  
  
  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
)  
  
SubscribeCallbackExt eventListener = new SubscribeCallbackExt(  
 delegate (Pubnub pn, PNMessageResultobject> messageEvent) {  
  Console.WriteLine($"received message {messageEvent.Message}");  
 }  
)  
  
`
```
show all 22 lines

### Add connection status listener[​](#add-connection-status-listener)

The PubNub client has a listener dedicated to handling connection status updates.

##### Client scope

This listener is only available on the PubNub object.

#### Method(s)[​](#methods-5)

```
`pubnub.AddListener(listener)  
`
```

#### Basic usage[​](#basic-usage-9)

```
`SubscribeCallbackExt eventListener = new SubscribeCallbackExt(  
 delegate (Pubnub pn, PNStatus e) {  
  Console.WriteLine("Status event");  
 }  
);  
  
pubnub.AddListener(eventListener)  
`
```

#### Returns[​](#returns-2)

The subscription status. For information about available statuses, refer to [SDK statuses](/docs/general/setup/connection-management#sdk-statuses).

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a [`Subscription`](#create-a-subscription) or a [`SubscriptionSet`](#create-a-subscription-set).

### Method(s)[​](#methods-6)

```
`subscription.Unsubscribeobject>()  
  
subscriptionSet.Unsubscribeobject>()  
`
```

### Basic Usage[​](#basic-usage-10)

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription()  
  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
)  
  
subscription1.Subscribeobject>()  
subscriptionSet.Subscribeobject>()  
  
subscription1.Unsubscribeobject>()  
subscriptionSet.Unsubscribeobject>()  
`
```

### Returns[​](#returns-3)

None

## Unsubscribe All[​](#unsubscribe-all)

Stop receiving real-time updates from all data streams and remove the entities associated with them.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-7)

```
`pubnub.UnsubscribeAllobject>()  
`
```

### Basic Usage[​](#basic-usage-11)

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription()  
  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
)  
  
subscription1.Subscribeobject>()  
subscriptionSet.Subscribeobject>()  
  
pubnub.UnsubscribeAllobject>()  
`
```

### Returns[​](#returns-4)

None
