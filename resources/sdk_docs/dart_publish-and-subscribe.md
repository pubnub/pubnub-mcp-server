On this page
# Publish/Subscribe API for Dart SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

- Prerequisites and limitations
- Security
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/dart/api-reference/configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/dart/api-reference/configuration). You can also [encrypt](/docs/sdks/dart/api-reference/configuration#cryptomodule) messages.

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

To Publish a message you can use the following method(s) in the Dart SDK:

```
`pubnub.publish(  
  String channel,  
  dynamic message,  
  {Keyset? keyset,  
  String? using,  
  dynamic meta,  
  bool? storeMessage,  
  int? ttl,  
  String? customMessageType}  
)   
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aDestination of the `message` (channel ID).`message` *Type: `Any`Default:  
n/aThe payload.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`meta`Type: `dynamic`Default:  
Not setMetadata object which can be used with the filtering ability.`storeMessage`Type: `bool`Default:  
Account defaultStore message in history.  
If not specified, the decision depends on whether Message Persistence has been enabled for the key or not.`ttl`Type: `int`Default:  
n/aSet a per message time to live in Message Persistence.  
1. If `storeMessage = true`, and `ttl = 0`, the message is stored with no expiry time.  
2. If `storeMessage = true` and `ttl = X` (`X` is an Integer value), the message is stored with an expiry time of `X` hours unless you have message retention set to `Unlimited` on your keyset configuration in the Admin Portal.  
3. If `storeMessage = false`, the `ttl` parameter is ignored.  
4. If `ttl` isn't specified, then expiration of the message defaults back to the expiry value for the key.`customMessageType`Type: `String`Default:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Publish a message to a channel:

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Channel to publish the message to  
  String channel = 'myChannel';  
  
`
```
show all 32 lines

### Returns[​](#returns)

The `publish()` operation returns a `PublishResult` which contains the following operations:

MethodDescription`description`Type: `String`The description, for example `Sent`.`timetoken`Type: `int`Returns an `int` representation of the timetoken when the message was published.

### Other Examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
`var result = await pubnub.publish('my_channel', 'hello', meta: '', customMessageType: 'text-message');  
`
```

#### Publishing JsonObject (Google GSON)[​](#publishing-jsonobject-google-gson)

```
`var message = {'hello': 'world'};  
var result = await pubnub.publish('my_channel', message, customMessageType: 'text-message');  
`
```

#### Publishing JsonArray (Google GSON)[​](#publishing-jsonarray-google-gson)

```
`var message = ['hello', 'world'];  
var result = await pubnub.publish('my_channel', message, customMessageType: 'text-message');  
`
```

#### Publishing JSONObject (org.json)[​](#publishing-jsonobject-orgjson)

```
`var jsonString = '{"score": 40}';  
var result = await pubnub.publish('my_channel', jsonDecode(jsonString), customMessageType: 'text-message');  
`
```

#### Publishing JSONArray (org.json)[​](#publishing-jsonarray-orgjson)

```
`var jsonString = '''  
[  
  {"score": 40},  
  {"score": 80}  
]  
''';  
var result = await pubnub.publish('my_channel', jsonDecode(jsonString), customMessageType: 'text-message');  
`
```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
`var result =  
    await pubnub.publish('my_channel', 'hello', storeMessage: true, ttl: 10, customMessageType: 'text-message');  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-1)

To Signal a message you can use the following method(s) in the Dart SDK:

```
`pubnub.signal(  
  String channel,  
  dynamic message,  
  {Keyset? keyset,  
  String? using,  
  String? customMessageType}  
)   
`
```

*  requiredParameterDescription`channel` *Type: `String`Destination of the `message` (channel ID).`message` *Type: `Any`The payload.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.`customMessageType`Type: `String`A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-1)

Signal a message to a channel:

```
`var result = await pubnub.signal('myChannel', 'signal!', customMessageType: 'text-message');  
`
```

### Response[​](#response)

The `signal()` operation returns a `SignalResult` which contains the following operations:

MethodDescription`description`Type: `String`The description, for example `Sent`.`timetoken`Type: `int`Returns an `int` representation of the timetoken when the signal was published.

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Your app receives messages and events via event listeners. The event listener is a single point through which your app receives all the messages, signals, and events that are sent in any channel you are subscribed to.

For more information about adding a listener, refer to the [Subscription](#subscription) section.

### Description[​](#description)

This function causes the client to create an open TCP socket to the PubNub Real-Time Network and begin listening for messages on a specified `channel` ID. To subscribe to a `channel` ID the client must send the appropriate `subscribeKey` at initialization.

By default a newly subscribed client will only receive messages published to the channel after the `subscribe()` call completes.

If a client gets disconnected from a channel, it can automatically attempt to reconnect to that `channel` ID and retrieve any available messages that were missed during that period. This can be achieved by setting `retryPolicy` to `RetryPolicy.linear`, when [initializing](/docs/sdks/dart/api-reference/configuration) the client.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-2)

To Subscribe to a channel you can use the following method(s) in the Dart SDK:

```
`pubnub.subscribe(  
  {SetString>? channels,  
  SetString>? channelGroups,  
  bool withPresence = false,  
  Timetoken? timetoken,  
  Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`channels` *Type: `Set<String>``channels` to subscribe to. Either `channel` ID or `channelGroup` is required.`channelGroups` *Type: `Set<String>``channelGroups` to subscribe to. Either `channel` ID or `channelGroup` is required.`withPresence`Type: `bool`Also subscribe to related presence information.   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`timetoken`Type: `Timetoken`Timetoken to start the subscription from.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-2)

Subscribe to a channel:

```
`var channel = "my_channel";  
var subscription = pubnub.subscribe(channels: {channel});  
`
```

### Returns[​](#returns-1)

The `subscribe()` method returns a `Subscription`. For more information, refer to [Subscription](#subscription).

### Subscription[​](#subscription)

A `Subscription` contains a Dart stream of messages from the channel(s) to which you are subscribed. You can transform that stream in the usual ways, or add a listener using `listen`.

### Listeners[​](#listeners)

For a list of available listeners, refer to the [Listeners](/docs/sdks/dart/api-reference/configuration#event-listeners) section.

##### Cancel[​](#cancel)

The `cancel()` method cancels the subscription. This disposes of internal streams, so the subscription becomes unusable.

###### Method(s)[​](#methods-3)

```
`subscription.cancel();  
`
```

###### Basic Usage[​](#basic-usage-3)

```
`// var subscription = pubnub.subscribe(channels: {'my_channel'});  
// active subscription available  
await subscription.cancel();  
`
```

###### Returns[​](#returns-2)

The `cancel()` operation on `Subscription` doesn't return any object. It disposes of internal streams, so the subscription becomes unusable.

##### Dispose[​](#dispose)

The `dispose()` method is an alias for the `cancel()` method.

##### Pause[​](#pause)

Pausing a subscription prevents the message and presence streams from emitting messages. Keep in mind that you may miss messages while subscription is paused. If subscription is currently paused, this method is a no-op.

###### Method(s)[​](#methods-4)

```
`subscription.pause()   
`
```

###### Basic Usage[​](#basic-usage-4)

```
`var subscription = pubnub.subscribe(channels: {'my_channel'});  
// active subscription available  
subscription.pause();  
`
```

###### Returns[​](#returns-3)

The `pause()` operation on `Subscription` doesn't return any object. Pausing subscription prevents the `messages` and `presence` streams from emitting messages.

##### Resume[​](#resume)

Resumes a paused subscription. If a subscription isn't paused, then this method is a no-op.

###### Method(s)[​](#methods-5)

```
`subscription.resume()   
`
```

###### Basic Usage[​](#basic-usage-5)

```
`// If subscription is paused  
subscription.resume();  
`
```

###### Returns[​](#returns-4)

The `resume()` operation on `Subscription` object doesn't return any object. If subscription isn't paused, then this method does nothing.

### Other Examples[​](#other-examples-1)

#### Basic subscribe with logging[​](#basic-subscribe-with-logging)

```
`// Create a root logger  
var logger = StreamLogger.root('root', logLevel: Level.all);  
  
// Subscribe to messages with a default printer  
var sub = logger.stream.listen(  
    LogRecord.createPrinter(r'[$time] (${level.name}) $scope: $message'));  
  
// Provide logging only for the parts that you are interested in.  
var _ = await provideLogger(logger, () async {  
  var subscription = pubnub.subscribe(channels: {'test'});  
  
  var message = subscription.messages.first;  
  
  await pubnub.publish('test', {'message': 'My message'});  
  
`
```
show all 19 lines

#### Subscribing to multiple channels[​](#subscribing-to-multiple-channels)

It's possible to subscribe to more than one channel using the [Multiplexing](/docs/general/channels/subscribe#channel-multiplexing) feature. The example shows how to do that using an array to specify the channel names.

##### Alternative subscription methods

You can also use [Wildcard Subscribe](/docs/general/channels/subscribe#wildcard-subscribe) and [Channel Groups](/docs/general/channels/subscribe#channel-groups) to subscribe to multiple channels at a time. To use these features, the *Stream Controller* add-on must be enabled on your keyset in the [Admin Portal](https://admin.pubnub.com).

```
`var subscription = pubnub.subscribe(channels: {'my_channel', 'channel1'});  
`
```

#### Subscribing to a Presence channel[​](#subscribing-to-a-presence-channel)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

For any given channel there is an associated Presence channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name. For example the channel named `my_channel` would have the presence channel named `my_channel-pnpres`. Presence data can be observed inside the `SubscribeCallback#message(PubNub, PNMessageResult)` callback.

```
`var subscription =  
    pubnub.subscribe(channels: {'my_channel'}, withPresence: true);  
`
```

### Sample Responses[​](#sample-responses)

#### Join Event[​](#join-event)

```
`{  
    "Event": "join",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 2,  
    "State": null,  
    "Channel":" my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

#### Leave Event[​](#leave-event)

```
`{  
    "Event": "leave",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 1,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

#### Timeout Event[​](#timeout-event)

```
`{  
  "Event": "timeout",  
  "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
  "Timestamp": 1345546797,  
  "Occupancy": 0,  
  "State": null,  
  "Channel": "my_channel",  
  "Subscription": "",  
  "Timetoken": 15034141109823424,  
  "UserMetadata": null,  
  "Join": null,  
  "Timeout": null,  
  "Leave": null,  
  "HereNowRefresh": false  
}   
`
```

#### State Change Event[​](#state-change-event)

```
`{  
  "Event":  "state-change",  
  "Uuid":  "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
  "Timestamp": 1345546797,  
  "Occupancy": 1,  
  "State": {  
      "isTyping": true  
  },  
  "Channel":  "my_channel",  
  "Subscription":  "",  
  "Timetoken": 15034141109823424,  
  "UserMetadata": null,  
  "Join": null,  
  "Timeout": null,  
  "Leave": null,  
`
```
show all 17 lines

#### Interval Event[​](#interval-event)

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 2,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

When a channel is in interval mode with `presence_deltas` `pnconfig` flag enabled, the interval message may also include the following fields which contain an array of changed UUIDs since the last interval message. This settings can be altered in the [Admin Portal](https://admin.pubnub.com).

- joined

- left

- timed out

For example, this interval message indicates there were 2 new UUIDs that joined and 1 timed out UUID since the last interval:

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": ,  
    "Occupancy": ,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": ["uuid2", "uuid3"],  
    "Timeout": ["uuid1"],  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

If the full interval message is greater than `30KiB` (since the max publish payload is `∼32KiB`), none of the extra fields will be present. Instead, there will be a `here_now_refresh` Boolean field set to `true`. This indicates to the user that they should do a `hereNow` request to get the complete list of users present in the channel.

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": ,  
    "Occupancy": ,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": true  
}  
`
```

#### Wildcard subscribe to channels[​](#wildcard-subscribe-to-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/) (with Enable Wildcard Subscribe checked). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Wildcard subscribes allow the client to subscribe to multiple channels using wildcard. For example, if you subscribe to `a.*` you will get all messages for `a.b`, `a.c`, `a.x`. The wildcarded `*` portion refers to any portion of the channel string name after the `dot (.)`.

```
`var subscription = pubnub.subscribe(channels: {'foo.*'});  
`
```

##### Wildcard grants and revokes

Only one level (`a.*`) of wildcarding is supported. If you grant on `*` or `a.b.*`, the grant will treat `*` or `a.b.*` as a single channel named either `*` or `a.b.*`. The same rule applies to revokes - you can revoke permissions with wildcards from one level deep, like `a.*`. However, you can do that only if you initially used wildcards to grant permissions to `a.*`.

#### Subscribe to a channel group[​](#subscribe-to-a-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`var subscription = pubnub.subscribe(channelGroups: {'cg1'});  
`
```

#### Subscribe to the presence channel of a channel group[​](#subscribe-to-the-presence-channel-of-a-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`var subscription =**    pubnub.subscribe(channelGroups: {'cg1', 'cg2'}, withPresence: true);  
`
```
Last updated on Jun 16, 2025**