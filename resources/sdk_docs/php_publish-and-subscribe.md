On this page
# Publish/Subscribe API for PHP SDK

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

- You must [initialize PubNub](/docs/sdks/php/api-reference/configuration#configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/php/api-reference/configuration). You can also [encrypt](/docs/sdks/php/api-reference/configuration#crypto-module) messages.

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

To `Publish a message` you can use the following method(s) in the PHP SDK:

```
`$pubnub->publish()  
    ->channel(string)  
    ->message(string|array)  
    ->shouldStore(boolean)  
    ->ttl($ttl)  
    ->meta(array)  
    ->usePost(boolean)  
    ->customMessageType(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aDestination of `message` (channel ID).`message` *Type: String|ArrayDefault:  
n/aThe payload.`shouldStore`Type: BooleanDefault:  
`account default`Store in history.`ttl`Type: NumberDefault:  
n/aSet a per message time to live in Message Persistence. 
1. $1
2. $1
3. $1
4. $1

`meta`Type: ArrayDefault:  
`null``Meta` data object which can be used with the filtering ability.`usePost`Type: BooleanDefault:  
`false`Use POST to `publish`.`customMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
use PubNub\Exceptions\PubNubException;  
  
// Create configuration with demo keys  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-publish-demo-user");  
`
```
show all 71 lines

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Response[​](#response)

The `publish()` operation returns a `PNPublishResult` which contains the following fields:

Property NameTypeDescription`getTimetoken()`IntegerAn `integer` representation of the timetoken when the message was published.

### Other Examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
`$result = $pubnub->publish()  
                ->channel("my_channel")  
                ->message(["hello", "there"])  
                ->meta(["name" => "Alex"])  
                ->sync();  
`
```

#### Publish Array[​](#publish-array)

```
`use PubNub\Exceptions\PubNubException;  
  
try {  
    $result = $pubnub->publish()  
                    ->channel("my_channel")  
                    ->message(["hello", "there"])  
                    ->meta(["name" => "Alex", "online" => true])  
                    ->sync();  
    print_r($result->getTimetoken());  
} catch (PubNubException $error) {  
    handleException($error);  
}  
`
```

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message` you can use the following method(s) in the PHP SDK:

```
`$pubnub->fire()  
    ->channel(string)  
    ->message(string|array)  
    ->meta(array)  
    ->usePost(boolean)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aDestination of `message` (channel ID).`message` *Type: String|ArrayDefault:  
n/aThe payload.`meta`Type: ArrayDefault:  
`null``Meta` data object which can be used with the filtering ability.`usePost`Type: BooleanDefault:  
`false`Use POST to `publish`.

### Basic Usage[​](#basic-usage-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
`use PubNub\Exceptions\PubNubException;  
  
try {  
$result = $pubnub->fire()  
        ->channel("my_channel")  
        ->message(["hello","there"])  
        ->usePost(true)  
        ->sync();  
  
    echo "Publish worked! Timetoken: " . $result->getTimetoken();  
}  
catch(\PubNub\Exceptions\PubNubServerException $e) {  
    echo "Error happened while publishing: " . $e->getMessage();  
}  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

- Prerequisites and limitations
- Signal vs. Message

- You must [initialize PubNub](/docs/sdks/php/api-reference/configuration#configuration) with the `publishKey`.

- The message payload size (without the URI or headers) is limited to `64` bytes. If you require a larger payload size, [contact support](mailto:support@pubnub.com).

**Feature****Signals****Messages****Payload size**Limited to 64 bytes (64B)Up to 32 kilobytes (32KB)**Cost efficiency**Cost less than standard messagesGenerally more expensive than signals**Persistence**Cannot be saved in [Message Persistence](/docs/sdks/php/api-reference/storage-and-playback) (past signals cannot be accessed)Can be saved and accessed through Message Persistence**Push Notifications**Cannot trigger [Mobile Push Notifications](/docs/sdks/php/api-reference/mobile-push)Can trigger Mobile Push Notifications**Use case suitability**Best for non-critical data streams, like geolocation updatesSuitable for critical and non-critical use cases**Metadata support**Do not support metadataSupport metadata
##### Channel separation

Signals and messages should be sent on separate channels to improve connection recovery behaviour.

### Method(s)[​](#methods-2)

To `Send a signal` you can use the following method(s) in the PHP SDK:

```
`$pubnub->signal()  
    ->channel(string)  
    ->message(string|array)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: StringThe channel ID to send the signal to.`message` *Type: String|ArrayThe signal message payload.

### Basic Usage[​](#basic-usage-2)

#### Send a signal to a channel[​](#send-a-signal-to-a-channel)

```
`$result = $pubnub->signal()  
    ->channel("my_channel")  
    ->message("typing...")  
    ->sync();  
print_r($result->getTimetoken());  
  
`
```

### Response[​](#response-1)

The `signal()` operation returns a `PNSignalResult` which contains the following fields:

Property NameTypeDescription`getTimetoken()`intAn `int` representation of the timetoken when the signal was sent.

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Your app receives messages and events via event listeners. The event listener is a single point through which your app receives all the messages, signals, and events that are sent in any channel you are subscribed to.

For more information about adding a listener, refer to the [Event Listeners](/docs/sdks/php/api-reference/configuration#event-listeners) section.

### Description[​](#description)

This function causes the client to create an open TCP socket to the PubNub Real-Time Network and begin listening for messages on a specified `channel` ID. To subscribe to a `channel` ID the client must send the appropriate `subscribeKey` at initialization.

By default a newly subscribed client will only receive messages published to the channel after the `subscribe()` call completes.

##### Subscribe call is blocking and it will block until:

- A message is published on the channel(s) it is subscribed to (`message` callback).

- A presence event is received on the channel(s) it is subscribed to (`presence` callabck).

- A status event is triggered by SDK (`status` callback).

Inside of all of the callbacks above you can throw `PubNubUnsubscribeException` to exit the subscribe loop.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-3)

To `Subscribe to a channel` you can use the following method(s) in the PHP SDK:

```
`$pubnub->subscribe()  
    ->channels(string|array)  
    ->channelGroups(string|array)  
    ->withTimetoken(integer)  
    ->withPresence(boolean)  
    ->execute();  
`
```

*  requiredParameterDescription`channels`Type: String or ArraySubscribe to `channels`, Either `channel` ID or `channel_group` is required.`channelGroups`Type: String or ArraySubscribe to `channel_groups`, Either `channel` ID or `channel_group` is required.`withTimetoken`Type: IntegerPass a `timetoken`.`withPresence`Type: BooleanAlso subscribe to related presence information.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

### Basic Usage[​](#basic-usage-3)

Subscribe to a channel:

```
`$pubnub->subscribe()  
    ->channels("my_channel")  
    ->execute();  
`
```

##### Event listeners

The response of the call is handled by adding a Listener. Please see the [Listeners section](/docs/sdks/php#add-event-listeners)  for more details. Listeners should be added before calling the method.

### Response[​](#response-2)

PNStatus:

Property NameTypeDescription`getCategory()``PNStatusCategory`Details of `StatusCategory` are [here](/docs/sdks/php#add-event-listeners)`isError()`boolThis is `true` if an error occurred in the execution of the operation.`getException()`PubNubExceptionError data of the exception (if `Error` is `true`).`getStatusCode()`intStatus code of the execution.`Operation`OperationTypeOperation type of the request.

PNMessageResult:

MethodDescription`getMessage()`Type: ObjectThe message sent on the `channel` ID.`getSubscription()`Type: StringThe `channel` ID on which the message was received.`getTimetoken()`Type: Integer`Timetoken` for the message.

PNPresenceEventResult:

MethodDescription`getStatusCode()`Type: IntegerEvents like `join`, `leave`, `timeout`, `state-change`.`getUuid()`Type: String`uuid` for event.`getTimestamp()`Type: Integer`timestamp` for event.`getOccupancy()`Type: IntegerCurrent `occupancy`.`getSubscription()`Type: StringMessage has been received on the `channel` ID.`getTimetoken()`Type: Integer`timetoken` of the message.

### Other Examples[​](#other-examples-1)

#### Basic subscribe with logging[​](#basic-subscribe-with-logging)

```
`use Monolog\Handler\ErrorLogHandler;  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setPublishKey("demo");  
$pnconf->setSubscribeKey("demo");  
  
$pubnub = new PubNub($pnconf);  
  
$pubnub->getLogger()->pushHandler(new ErrorLogHandler());  
  
$pubnub->subscribe()->channels("my_channel")->execute();  
`
```

#### Subscribing to multiple channels[​](#subscribing-to-multiple-channels)

It's possible to subscribe to more than one channel using the [Multiplexing](/docs/general/channels/subscribe#channel-multiplexing) feature. The example shows how to do that using an array to specify the channel names.

##### Alternative subscription methods

You can also use [Wildcard Subscribe](/docs/general/channels/subscribe#wildcard-subscribe) and [Channel Groups](/docs/general/channels/subscribe#channel-groups) to subscribe to multiple channels at a time. To use these features, the *Stream Controller* add-on must be enabled on your keyset in the [Admin Portal](https://admin.pubnub.com).

```
`$pubnub->subscribe()  
    ->channels(["my_channel1", "my_channel2"])  
    ->execute();  
`
```

#### Subscribing to a Presence channel[​](#subscribing-to-a-presence-channel)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

For any given channel there is an associated Presence channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name. For example the channel named `my_channel` would have the presence channel named `my_channel-pnpres`.

```
`$pubnub->subscribe()  
    ->channels("my_channel")  
    ->withPresence()  
    ->execute();  
`
```

#### Sample Responses[​](#sample-responses)

##### Join Event[​](#join-event)

```
`{  
    "action": "join",  
    "timestamp": 1345546797,  
    "uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy": 2  
}  
`
```

##### Leave Event[​](#leave-event)

```
`{  
    "action" : "leave",  
    "timestamp" : 1345549797,  
    "uuid" : "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy" : 1  
}  
`
```

##### Timeout Event[​](#timeout-event)

```
`{  
    "action": "timeout",  
    "timestamp": 1345549797,  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "occupancy": 0  
}  
`
```

##### ustom Presence Event (State Change)[​](#ustom-presence-event-state-change)

```
`{  
    "action": "state-change",  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "timestamp": 1345549797,  
    "data": {  
        "isTyping": true  
    }  
}  
`
```

##### Interval Event[​](#interval-event)

```
`{  
    "action":"interval",  
    "timestamp":1474396578,  
    "occupancy":2  
}  
`
```

When a channel is in interval mode with `presence_deltas` `pnconfig` flag enabled, the interval message may also include the following fields which contain an array of changed UUIDs since the last interval message.

- joined

- left

- timedout

For example, this interval message indicates there were 2 new UUIDs that joined and 1 timed out UUID since the last interval:

```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "joined" : ["uuid2", "uuid3"],  
    "timedout" : ["uuid1"]  
}  
`
```

If the full interval message is greater than `30KB` (since the max publish payload is `∼32KB`), none of the extra fields will be present. Instead there will be a `here_now_refresh` boolean field set to `true`. This indicates to the user that they should do a `hereNow` request to get the complete list of users present in the channel.

```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "here_now_refresh" : true  
}  
`
```

#### Wildcard subscribe to channels[​](#wildcard-subscribe-to-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/) (with Enable Wildcard Subscribe checked). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Wildcard subscribes allow the client to subscribe to multiple channels using wildcard. For example, if you subscribe to `a.*` you will get all messages for `a.b`, `a.c`, `a.x`. The wildcarded `*` portion refers to any portion of the channel string name after the `dot (.)`.

```
`$pubnub->subscribe()  
    ->channels("foo.*")  
    ->execute();  
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
`use PubNub\PubNub;  
use PubNub\PNConfiguration;  
use PubNub\Callbacks\SubscribeCallback;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setPublishKey("demo");  
$pnconf->setSubscribeKey("demo");  
  
$pubnub = new PubNub($pnconf);  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        if ($status->getCategory() === PNStatusCategory::PNConnectedCategory) {  
            $result = $pubnub->setState()  
`
```
show all 40 lines

#### Subscribe to a channel group[​](#subscribe-to-a-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`$pubnub->subscribe()  
    ->channelGroups(["cg1", "cg2"])  
    ->execute();  
`
```

#### Subscribe to the presence channel of a channel group[​](#subscribe-to-the-presence-channel-of-a-channel-group)

##### Requires Stream Controller and Presence add-ons

This method requires both the *Stream Controller* and *Presence* add-ons are enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`$pubnub->subscribe()  
    ->channelGroups("awesome_channel_group")  
    ->withPresence()  
    ->execute();  
`
```

## Unsubscribe[​](#unsubscribe)

To unsubscribe you should throw `PubNubUnsubscribeException` somewhere inside `status`/`message`/`presence` callbacks of your subscribe listeners. You should specify channel and / or channel group names to unsubscribe and keep a subscription loop running if some other channels left. Otherwise the exception will unsubscribe from all channels and channel-groups.

### Method(s)[​](#methods-4)

To `Unsubscribe from a channel` you can use the following method(s) in the PHP SDK:

```
`(new PubNubUnsubscribeException())  
    ->setChannels(array)  
    ->setChannelGroups(array);  
`
```

*  requiredParameterDescription`getChannels`Type: StringDefault:  
`false`The `channels` to get the here now details.`getChannelGroups`Type: StringDefault:  
`false`The `channel groups` to get the here now details.`setChannels`Type: ArrayDefault:  
`false`Unsubscribe to channels, Either `channel` ID or `channelGroup` is required.`setChannelGroups`Type: ArrayDefault:  
`false`Unsubscribe to channel groups, Either `channel` ID or `channelGroup` is required.

### Basic Usage[​](#basic-usage-4)

Unsubscribe from a channel:

```
`use PubNub\Callbacks\SubscribeCallback;  
use PubNub\Enums\PNStatusCategory;  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubUnsubscribeException;  
  
$pnconfig = new PNConfiguration();  
  
$pnconfig->setPublishKey("demo");  
$pnconfig->setSubscribeKey("demo");  
  
$pubnub = new PubNub($pnconfig);  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
`
```
show all 38 lines

### Rest Response from Server[​](#rest-response-from-server)

The output below demonstrates the response to a successful call:

```
`{  
    "action" : "leave"  
}  
`
```

### Other Examples[​](#other-examples-2)

#### Unsubscribing from multiple channels[​](#unsubscribing-from-multiple-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`use PubNub\Callbacks\SubscribeCallback;  
use PubNub\Exceptions\PubNubUnsubscribeException;  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        throw new PubNubUnsubscribeException();  
    }  
  
    function message($pubnub, $message) {  
    }  
  
    function presence($pubnub, $presence) {  
    }  
}  
`
```

##### Example Response[​](#example-response)

```
`{  
    "action" : "leave"  
}  
`
```

#### Unsubscribe from a channel group[​](#unsubscribe-from-a-channel-group)

```
`use PubNub\Callbacks\SubscribeCallback;  
use PubNub\Exceptions\PubNubUnsubscribeException;  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        throw (new PubNubUnsubscribeException())->setChannelGroups(["my_channel"]);  
    }  
  
    function message($pubnub, $message) {  
    }  
  
    function presence($pubnub, $presence) {  
    }  
}  
`
```

##### Example Response[​](#example-response-1)

```
`{**    "action": "leave"  
}  
`
```
Last updated on Jun 16, 2025**