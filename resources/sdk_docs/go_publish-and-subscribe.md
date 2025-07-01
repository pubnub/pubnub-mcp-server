On this page
# Publish/Subscribe API for Go SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

## Publish[​](#publish)

The `Publish()` method sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/go/api-reference/configuration#configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/go/api-reference/configuration#configuration). You can also [encrypt](/docs/sdks/go/api-reference/configuration#cryptomodule) messages.

The message can contain any JSON-serializable data (Objects, Arrays, Ints, Strings) and shouldn't contain any special classes or functions. String content can include any single-byte or multi-byte UTF-8 characters.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

 You can optionally provide the `CustomMessageType` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

To `Publish a message` you can use the following method(s) in the Go SDK:

```
`pn.Publish().  
    Message(interface{}).  
    Channel(string).  
    ShouldStore(bool).  
    UsePost(bool).  
    Meta(interface{}).  
    QueryParam(queryParam).  
    CustomMessageType(string).  
    Execute()  
`
```

*  requiredParameterDescription`Message` *Type: interfaceDefault:  
n/aThe payload`Channel` *Type: stringDefault:  
n/aDestination of `Message` (channel ID)`ShouldStore`Type: boolDefault:  
`account default`Store in history`UsePost`Type: boolDefault:  
`false`Use POST to `Publish``Meta`Type: interfaceDefault:  
`null`Meta data object which can be used with the filtering ability`TTL`Type: intDefault:  
n/aSet a per message time to live in Message Persistence. 
1. $1
2. $1
3. $1
4. $1

`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.`CustomMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
`package main  
  
import (  
    "fmt"  
    pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
    config := pubnub.NewConfigWithUserId("myUniqueUserId")  
    config.SubscribeKey = "demo"  
    config.PublishKey = "demo"  
    pn := pubnub.NewPubNub(config)  
  
    message := []string{"Hello", "there"}  
  
`
```
show all 31 lines

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Response[​](#response)

MethodDescription`Timestamp`Type: intAn `int` representation of the timetoken when the message was published

### Other Examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
`res, status, err := pn.Publish().  
    Channel("my-channel").  
    Message([]string{"Hello", "there"}).  
    Meta(map[string]interface{}{  
        "name": "Alex",  
    }).  
    CustomMessageType("text-message").  
    Execute()  
`
```

#### Publish Array[​](#publish-array)

```
`res, status, err := pn.Publish().  
    Channel("my-channel").  
    Message([]string{"Hello", "there"}).  
    Meta([]string{"1a", "2b", "3c"}).  
    CustomMessageType("text-message").  
    Execute()  
`
```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
`res, status, err := pn.Publish().  
    Channel("my-channel").  
    Message("test").  
    ShouldStore(true).  
    TTL(10).  
    CustomMessageType("text-message").  
    Execute()  
`
```

#### Push Payload Helper[​](#push-payload-helper)

You can use the helper method as an input to the `Message` parameter, to format the payload for publishing [Push](/docs/general/push/send) messages. For more info on the helper method, check [Create Push Payload Helper Section](/docs/sdks/go/api-reference/misc#create-push-payload)

```
`aps := pubnub.PNAPSData{  
    Alert: "apns alert",  
    Badge: 1,  
    Sound: "ding",  
    Custom: map[string]interface{}{  
        "aps_key1": "aps_value1",  
        "aps_key2": "aps_value2",  
    },  
}  
  
apns := pubnub.PNAPNSData{  
    APS: aps,  
    Custom: map[string]interface{}{  
        "apns_key1": "apns_value1",  
        "apns_key2": "apns_value2",  
`
```
show all 82 lines

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message` you can use the following method(s) in the Go SDK:

```
`pn.Fire().  
    Message(interface{}).  
    Channel(string).  
    UsePost(bool).  
    Meta(interface{}).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Message` *Type: interfaceDefault:  
n/aThe payload`Channel` *Type: stringDefault:  
n/aDestination of `Message` (channel ID)`UsePost`Type: boolDefault:  
`false`Use POST to `Publish``Meta`Type: interfaceDefault:  
`null`Meta data object which can be used with the filtering ability`TTL`Type: intDefault:  
n/aSet a per message time to live in Message Persistence. 
1. $1
2. $1
3. $1
4. $1

`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
`res, status, err := pn.Fire().  
            Channel("my-channel").  
            Message("test").  
            Execute()  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-2)

To `Signal a message` you can use the following method(s) in the Go SDK:

```
`pubnub.Signal().  
    Message(interface{}).  
    Channel(string).  
    CustomMessageType(string).  
    Execute()  
`
```

*  requiredParameterDescription`Message` *Type: interfaceDefault:  
n/aThe payload.`Channel` *Type: stringDefault:  
n/aDestination of `Message` (channel ID).`CustomMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`result, status, err := pubnub.Signal().  
    Message([]string{  
        "Hello", "Signals"  
    }).  
    Channel("foo").  
    CustomMessageType("text-message").  
    Execute();  
`
```

### Response[​](#response-1)

MethodDescription`Timestamp`Type: intAn `int` representation of the timetoken when Signal was sent

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Your app receives messages and events via event listeners. The event listener is a single point through which your app receives all the messages, signals, and events that are sent in any channel you are subscribed to.

For more information about adding a listener, refer to the [Event Listeners](/docs/sdks/go/api-reference/configuration#event-listeners) section.

### Description[​](#description)

This function causes the client to create an open TCP socket to the PubNub Real-Time Network and begin listening for messages on a specified `channel` ID. To subscribe to a `channel` ID the client must send the appropriate `SubscribeKey` at initialization. By default a newly subscribed client will only receive messages published to the channel after the `Subscribe()` call completes.

##### Connectivity notification

You can be notified of connectivity via the `envelope.status`. By waiting for the `envelope.status` to return before attempting to publish, you can avoid a potential race condition on clients that subscribe and immediately publish messages before the subscribe has completed.

Using Go SDK, if a client becomes disconnected from a channel, it can automatically attempt to reconnect to that channel and retrieve any available messages that were missed during that period by setting `restore` to `true`. By default a client will attempt to reconnect after exceeding a `320` second connection timeout.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then  **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-3)

To `Subscribe to a channel` you can use the following method(s) in the Go SDK:

```
`pn.Subscribe().  
    Channels([]string).  
    ChannelGroups([]string).  
    Timetoken(int64).  
    WithPresence(bool).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels`Type: []stringSubscribe to `channels`, Either `channel` ID or `channel_group` is required.`ChannelGroups`Type: []stringSubscribe to `channel_groups`, Either `channel` ID or `channel_group` is required.`Timetoken`Type: int64Pass a `timetoken`.`WithPresence`Type: boolAlso subscribe to related presence information.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-3)

Subscribe to a channel:

```
`pn.Subscribe().  
    Channels([]string{"my-channel"}). // subscribe to channels  
    Execute()  
`
```

### Response[​](#response-2)

##### PNMessage

`PNMessage` is returned in the [Listeners](/docs/sdks/go/api-reference/configuration#event-listeners)

The `Subscribe()` operation returns a `PNStatus` which contains the following operations:

Property NameTypeDescription`Category``StatusCategory`Details of `StatusCategory` are [here](/docs/sdks/go/api-reference/configuration#event-listeners)`Error`boolThis is `true` if an error occurred in the execution of the operation.`ErrorData`errorError data of the exception (if `Error` is `true`).`StatusCode`intStatus code of the execution.`Operation`OperationTypeOperation type of the request.

The `Subscribe()` operation returns a `PNMessage` for messages, for both `Publish` and `Signal` messages, which contains the following operations:

MethodDescription`Message`Type: interfaceThe message sent on the `channel` ID.`Channel`Type: stringThe channel ID on which the message was received.`Subscription`Type: stringThe channel group or wildcard subscription match (if exists).`Timetoken`Type: int64`Timetoken` for the message.`UserMetadata`Type: interfaceUser `metadata`.`SubscribedChannel`Type: stringCurrent `subscribed channel`.`Publisher`Type: stringUUID of `publisher`.

The `Subscribe()` operation returns a `PNPresence` for messages which contains the following operations:

MethodDescription`Event`Type: stringEvents like `join`, `leave`, `timeout`, `state-change`.`UUID`Type: string`UUID` for event.`Timestamp`Type: int64`Timestamp` for event.`Occupancy`Type: intCurrent `occupancy`.`Subscription`Type: stringMessage has been received on the `Channel` ID.`Timetoken`Type: int64`Timetoken` of the message.`State`Type: interface`State` of the UUID.`UserMetadata`Type: map[string]interfaceUser `metadata`.`SubscribedChannel`Type: stringCurrent `subscribed channel`.`Channel`Type: stringThe `channel` ID for which the message belongs.

The `Subscribe()` operation returns a `PNUUIDEvent` for UUID Events which contains the following operations:

MethodDescription`Event`Type: PNObjectsEventEvents like `PNObjectsEventRemove`, `PNObjectsEventSet`.`Timestamp`Type: string`Timestamp` for event.`Subscription`Type: stringEvent has been received on the `Channel` ID.`SubscribedChannel`Type: stringCurrent `subscribed channel`.`Channel`Type: stringThe `channel` ID for which the event belongs.`UUID`Type: stringThe UUID.`Name`Type: stringDisplay name for the space.`ExternalID`Type: stringUser's identifier in an external system`ProfileURL`Type: stringThe URL of the user's profile picture`Email`Type: stringThe user's email address.`Custom`Type: map[string]interfaceMap of string and interface with supported data types.`Updated`Type: stringLast updated date.`ETag`Type: stringThe ETag.

The `Subscribe()` operation returns a `PNChannelEvent` for Channel Events which contains the following operations:

MethodDescription`Event`Type: PNObjectsEventEvents like `PNObjectsEventRemove`, `PNObjectsEventSet`.`Timestamp`Type: string`Timestamp` for event.`Subscription`Type: stringEvent has been received on the `Channel` ID.`SubscribedChannel`Type: stringCurrent `subscribed channel`.`Channel`Type: stringThe `channel` ID for which the event belongs.`ChannelID`Type: stringThe Channel ID.`Name`Type: stringDisplay name for the space.`Description`Type: stringDescription of the space.`Custom`Type: map[string]interfaceMap of string and interface with supported data types.`Updated`Type: stringLast updated date.`ETag`Type: stringThe ETag.

The `Subscribe()` operation returns a `PNMembershipEvent` for Membership Events which contains the following operations:

MethodDescription`Event`Type: PNObjectsEventEvents like `PNObjectsEventRemove`, `PNObjectsEventSet`.`Timestamp`Type: string`Timestamp` for event.`Subscription`Type: stringEvent has been received on the `Channel` ID.`SubscribedChannel`Type: stringCurrent `subscribed channel`.`Channel`Type: stringThe `channel` ID for which the event belongs.`ChannelID`Type: stringThe Channel ID.`UUID`Type: stringThe UUID.`Custom`Type: map[string]interfaceMap of string and interface with supported data types.

The `Subscribe()` operation returns a `PNMessageActionsEvent` for Message Actions Events which contains the following operations:

MethodDescription`Event`Type: PNMessageActionsEventTypeEvents like `PNMessageActionsAdded`, `PNMessageActionsRemoved`.`Data`Type: PNMessageActionsResponse[Message Actions](/docs/sdks/go/api-reference/message-actions)  for event.`Subscription`Type: stringEvent has been received on the `Channel` ID.`SubscribedChannel`Type: stringCurrent `subscribed channel`.`Channel`Type: stringThe `channel` ID for which the event belongs.

### Other Examples[​](#other-examples-1)

#### Basic subscribe with logging[​](#basic-subscribe-with-logging)

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
// publishKey from admin panel (only required if publishing)  
config.PublishKey = "demo" // required  
// subscribeKey from admin panel  
config.SubscribeKey = "demo"  
  
pn := pubnub.NewPubNub(config)  
  
pn.Subscribe().  
    Channels([]string{"my-channel"}).  
    Execute()  
`
```

#### Subscribing to multiple channels[​](#subscribing-to-multiple-channels)

It's possible to subscribe to more than one channel using the [Multiplexing](/docs/general/channels/subscribe#channel-multiplexing) feature. The example shows how to do that using an array to specify the channel names.

##### Alternative subscription methods

You can also use [Wildcard Subscribe](/docs/general/channels/subscribe#wildcard-subscribe) and [Channel Groups](/docs/general/channels/subscribe#channel-groups) to subscribe to multiple channels at a time. To use these features, the *Stream Controller* add-on must be enabled on your keyset in the [Admin Portal](https://admin.pubnub.com).

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
pn.Subscribe().  
    Channels([]string{"my-channel1", "my-channel2"}).  
    Execute()  
`
```

#### Subscribing to a Presence channel[​](#subscribing-to-a-presence-channel)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

For any given channel there is an associated Presence channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name. For example the channel named `my_channel` would have the presence channel named `my_channel-pnpres`.

```
`pn.Subscribe().  
    Channels([]string{"my-channel"}).  
    WithPresence(true).  
    Execute()  
`
```

#### Sample Responses[​](#sample-responses)

##### Join Event[​](#join-event)

```
`if presence.Event == "join" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

##### Leave Event[​](#leave-event)

```
`if presence.Event == "leave" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

##### Timeout Event[​](#timeout-event)

```
`if presence.Event == "timeout" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

##### State Change Event[​](#state-change-event)

```
`if presence.Event == "state-change" {  
    presence.Timestamp  
    presence.Occupancy  
}  
`
```

##### Interval Event[​](#interval-event)

```
`if presence.Event == "interval" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

When a channel is in interval mode with `presence_deltas` `pnconfig` flag enabled, the interval message may also include the following fields which contain an array of changed UUIDs since the last interval message.

- joined

- left

- timedout

For example, this interval message indicates there were 2 new UUIDs that joined and 1 timed out UUID since the last interval:

```
`if presence.Event == "interval" {  
    presence.Occupancy // # users in channel  
    presence.Join // [uuid1 uuid2]  
    presence.Timeout //[uuid3]  
    presence.Timestamp // unix timestamp  
}  
`
```

If the full interval message is greater than `30KB` (since the max publish payload is `∼32KB`), none of the extra fields will be present. Instead there will be a `here_now_refresh` boolean field set to `true`. This indicates to the user that they should do a `hereNow` request to get the complete list of users present in the channel.

#### Wildcard subscribe to channels[​](#wildcard-subscribe-to-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/) (with Enable Wildcard Subscribe checked). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Wildcard subscribes allow the client to subscribe to multiple channels using wildcard. For example, if you subscribe to `a.*` you will get all messages for `a.b`, `a.c`, `a.x`. The wildcarded `*` portion refers to any portion of the channel string name after the `dot (.)`.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
pn.Subscribe().  
    Channels([]string{"foo.*"}). // subscribe to channels information  
    Execute()  
`
```

##### Wildcard grants and revokes

Only one level (`a.*`) of wildcarding is supported. If you grant on `*` or `a.b.*`, the grant will treat `*` or `a.b.*` as a single channel named either `*` or `a.b.*`. You can also revoke permissions from multiple channels using wildcards but only if you previously granted permissions using the same wildcards. Wildcard revokes, similarly to grants, only work one level deep, like `a.*`.

#### Subscribing with State[​](#subscribing-with-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

##### Required UUID

Always set the `UUID` to uniquely identify the user or device that connects to PubNub. This `UUID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UUID`, you won't be able to connect to PubNub.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
config.SubscribeKey = "demo"  
config.PublishKey = "demo"  
  
pn := pubnub.NewPubNub(config)  
  
listener := pubnub.NewListener()  
done := make(chan bool)  
  
go func() {  
    for {  
`
```
show all 45 lines

#### Subscribe to a channel group[​](#subscribe-to-a-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
pn.Subscribe().  
    Channels([]string{"ch1", "ch2"}). // subscribe to channels  
    ChannelGroups([]string{"cg1", "cg2"}). // subscribe to channel groups  
    Timetoken(int64(1337)). // optional, pass a timetoken  
    WithPresence(true). // also subscribe to related presence information  
    Execute()  
`
```

#### ubscribe to the presence channel of a channel group[​](#ubscribe-to-the-presence-channel-of-a-channel-group)

##### Requires Stream Controller and Presence add-ons

This method requires both the *Stream Controller* and *Presence* add-ons are enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
pn.Subscribe().  
    ChannelGroups([]string{"cg1", "cg2"}). // subscribe to channel groups  
    Timetoken(int64(1337)). // optional, pass a timetoken  
    WithPresence(true). // also subscribe to related presence information  
    Execute()  
`
```

## Unsubscribe[​](#unsubscribe)

When subscribed to a single channel, this function causes the client to issue a `leave` from the `channel` and close any open socket to the PubNub Network. For multiplexed channels, the specified `channel`(s) will be removed and the socket remains open until there are no more channels remaining in the list.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-4)

To `Unsubscribe from a channel` you can use the following method(s) in the Go SDK:

```
`pn.Unsubscribe().  
    Channels([]string).  
    ChannelGroups([]string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels`Type: []stringDefault:  
`false`Unsubscribe to channels, Either `channel` ID or `channelGroup` is required.`ChannelGroups`Type: []stringDefault:  
`false`Unsubscribe to channel groups, Either `channel` ID or `channelGroup` is required.`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-4)

Unsubscribe from a channel:

```
`pn.Unsubscribe().  
    Channels([]string{"my-channel"}).  
    Execute()  
`
```

##### Event listeners

The response of the subscription is handled by Listener. Please see the [Listeners section](/docs/sdks/go/api-reference/configuration#event-listeners)  for more details.

### Rest Response from Server[​](#rest-response-from-server)

The output below demonstrates the response to a successful call:

```
`if presence.Event == "leave" {  
    presence.UUID // left-uuid  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

### Other Examples[​](#other-examples-2)

#### Unsubscribing from multiple channels[​](#unsubscribing-from-multiple-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
pn.Unsubscribe().  
    Channels([]string{"my-channel", "my-channel2"}).  
    Execute()  
`
```

##### Example Response[​](#example-response)

```
`if presence.Event == "leave" {  
    presence.UUID // left-uuid  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

#### Unsubscribe from a channel group[​](#unsubscribe-from-a-channel-group)

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
pn.Unsubscribe().  
    ChannelGroups([]string{"cg1", "cg2"}).  
    Execute()  
`
```

**Example Response:** [](#unsubscribe-example-2-response)

```
`if presence.Event == "leave" {  
    presence.UUID // left-uuid  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

## Unsubscribe All[​](#unsubscribe-all)

Unsubscribe from all channels and all channel groups

### Method(s)[​](#methods-5)

```
`UnsubscribeAll()  
`
```

### Basic Usage[​](#basic-usage-5)

```
`pn.UnsubscribeAll()  
`
```

### Returns[​](#returns)

None
Last updated on **Jun 16, 2025**