On this page
# Publish/Subscribe API for Ruby SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

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

- You must [initialize PubNub](/docs/sdks/ruby/api-reference/configuration#configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/ruby/api-reference/configuration#configuration). You can also [encrypt](/docs/sdks/ruby/api-reference/configuration#crypto_module) messages.

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

To `Publish a message` you can use the following method(s) in the Ruby SDK:

```
`publish(  
    channel: String,  
    message: Object,  
    store: Boolean,  
    compressed: Boolean,  
    publish_key: String,  
    http_sync: Boolean,  
    custom_message_type: String,  
    meta: Object,  
    callback: Lambda  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringSpecify the `channel` ID to `publish` the messages.`message` *Type: ObjectSerializable `object` that has defined `#to_json` method.`store`Type: BooleanSpecifies if `message` should be stored for `history`.Default `true`.`compressed`Type: BooleanSpecifies if `message` should be compressed.Default `false`.`publish_key`Type: StringSpecifies the required `publish_key` to use to send messages to a `channel` ID.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`custom_message_type`Type: StringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`meta`Type: ObjectA JSON-serializable object that provides additional context information for the message.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def publish_message(pubnub)  
  pubnub.publish(  
    channel: 'my_channel',  
    message: { text: 'Hi!' },  
    custom_message_type: 'text-message'  
  ) do |envelope|  
    puts "Publish status: #{envelope.status[:code]}"  
  end  
end  
  
def main  
  # Configuration for PubNub instance  
  pubnub = Pubnub.new(  
`
```
show all 28 lines

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Rest Response from Server[​](#rest-response-from-server)

The function returns the following formatted response:

```
`[1, "Sent", "13769558699541401"]  
`
```

### Other Examples[​](#other-examples)

#### Publish a JSON serialized message[​](#publish-a-json-serialized-message)

```
`pubnub.publish(  
    message: {  
        key: {  
            inner_key: :value  
        }  
    },  
    custom_message_type: 'text-message',  
    channel: :whatever,  
    meta: {  
        sender_uuid: 'user123-uuid',  
        priority: 'high',  
        location: 'office'  
    }  
)  
`
```

#### Skip message from storage[​](#skip-message-from-storage)

```
`pubnub.publish(message: 'Not gonna store that', store: false)  
`
```

## Fire[​](#fire)

The fire endpoint allows the client to send a message to Functions Event Handlers and [Illuminate](/docs/illuminate/business-objects/external-data-sources). These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` isn't replicated, and so won't be received by any subscribers to the channel. The message is also not stored in history.

### Method(s)[​](#methods-1)

To `Fire a message` you can use the following method(s) in the Ruby SDK:

```
`fire(  
    channel: channel,  
    message: message,  
    compressed: compressed,  
    publish_key: publish_key,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringSpecify the `channel` ID to `publish` the messages.`message` *Type: ObjectSerializable `object` that has defined `#to_json` method.`compressed`Type: BooleanSpecifies if `message` should be compressed.Default `false`.`publish_key`Type: StringSpecifies the required `publish_key` to use to send messages to a `channel` ID.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
`pubnub.fire(  
    channel: 'my_channel',  
    message: {  
        text: 'Hi!'  
    }  
) do |envelope|  
    puts envelope.status  
end  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-2)

To `Signal a message` you can use the following method(s) in the Ruby SDK:

```
`pubnub.signal(  
    message: Object,  
    channel: String,  
    compressed: Boolean,  
    custom_message_type: String  
)  
`
```

*  requiredParameterDescription`message` *Type: ObjectSerializable `object` that has defined `#to_json` method.`channel` *Type: StringSpecify the `channel` ID to `send` the messages.`compressed`Type: BooleanSpecifies if `message` should be compressed. Default `false`.`custom_message_type`Type: StringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`pubnub.signal(  
    channel: 'foo',  
    message: {  
        msg: 'Hello Signals'  
    },  
    custom_message_type: 'text-message'  
);  
`
```

### Rest Response from Server[​](#rest-response-from-server-1)

The function returns the following formatted response:

```
`[1, "Sent", "13769558699541401"]  
`
```

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Your app receives messages and events via event listeners. The event listener is a single point through which your app receives all the messages, signals, and events that are sent in any channel you are subscribed to.

For more information about adding a listener, refer to the [Event Listeners](/docs/sdks/ruby/api-reference/configuration#event-listeners) section.

### Description[​](#description)

This function causes the client to create an open TCP socket to the PubNub Real-Time Network and begin listening for messages on a specified `channel` ID. To subscribe to a `channel` ID the client must send the appropriate `subscribe_key` at initialization. By default a newly subscribed client will only receive messages published to the channel after the `subscribe()` call completes.

##### Connectivity notification

You can be notified of connectivity via the `envelope.status`. By waiting for the `envelope.status` to return before attempting to publish, you can avoid a potential race condition on clients that subscribe and immediately publish messages before the subscribe has completed.

Using Ruby SDK, if a client becomes disconnected from a channel, it can automatically attempt to reconnect to that channel and retrieve any available messages that were missed during that period by setting `restore` to `true`. By default a client will attempt to reconnect after exceeding a `320` second connection timeout.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then  **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-3)

To `Subscribe to a channel` you can use the following method(s) in the Ruby SDK:

```
`subscribe(  
    channels: channels,  
    channel_groups: group,  
    presence: presence,  
    presence_callback: presence_callback,  
    with_presence: with_presence,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels`Type: String, Symbol, ArraySpecify the `channels` to `subscribe` to. It is possible to specify multiple channels as an array. It is possible to `subscribe` to wildcard channels.`channel_groups`Type: String, Symbol, ArraySpecifies the `group` to `subscribe` to. It is possible to specify multiple groups as an array.`presence`Type: String, Symbol, ArraySpecifies the `channel` ID to `presence` `subscribe` to. It is possible to specify multiple channels as an array.`presence_callback`Type: Lambda accepting one argument`Callback` that is called for each `presence` event from wildcard `subscribe`. Works only with `http_sync` set to `true`.`with_presence`Type: BooleanSubscribes to all `presence` channels of channels listed in channels parameter.   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods they will return array of Envelopes - `envelope` object for each message.`callback`Type: Lambda accepting one parameter`Callback` that is called for each retrieved `message`. Works only with `http_sync` set to `true`.

##### Event listeners

The response of the subscription is handled by Listener. Please see the [Listeners section](/docs/sdks/ruby#add-event-listeners) for more details.

### Basic Usage[​](#basic-usage-3)

Subscribe to a channel:

```
`# Subscribe to channel 'my_channel'.  
pubnub.subscribe(  
    channels: :my_channel  
)  
`
```

### Rest Response from Server[​](#rest-response-from-server-2)

The output below demonstrates the response format to a successful call:

```
`[[], "Time Token"]  
`
```

### Other Examples[​](#other-examples-1)

#### Subscribing to multiple channels[​](#subscribing-to-multiple-channels)

It's possible to subscribe to more than one channel using the [Multiplexing](/docs/general/channels/subscribe#channel-multiplexing) feature. The example shows how to do that using an array to specify the channel names.

##### Alternative subscription methods

You can also use [Wildcard Subscribe](/docs/general/channels/subscribe#wildcard-subscribe) and [Channel Groups](/docs/general/channels/subscribe#channel-groups) to subscribe to multiple channels at a time. To use these features, the *Stream Controller* add-on must be enabled on your keyset in the [Admin Portal](https://admin.pubnub.com).

```
`# Subscribe to channels (with presence) and groups  
pubnub.subscribe(  
    channels: ['debug', 'info', 'warn'],  
    channel_groups: ['ruby_group', 'jruby_group', 'rbx_group'],  
    presence: ['debug', 'info', 'warn']  
)  
# You will be subscribed to channels: debug, info, warn, debug-pnpres, info-pnpres and warn-pnpres  
# and to groups: ruby_group, jruby_group, rbx_group.  
`
```

#### Subscribing to a Presence channel[​](#subscribing-to-a-presence-channel)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

For any given channel there is an associated Presence channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name. For example the channel named `my_channel` would have the presence channel named `my_channel-pnpres`.

```
`# Subscribes to room0, room0-pnpres, room1, room1-pnpres, room2, room2-pnpres  
pubnub.subscribe(  
    channels: ['room0', 'room1', 'room2'],  
    with_presence: true  
)  
`
```

#### Sample Responses[​](#sample-responses)

#### Join Event[​](#join-event)

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

##### State Change Event[​](#state-change-event)

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
`# Subscribe to wildcard channel 'ruby.*' (make sure you have wildcard subscribe enabled in your pubnub admin console!)  
# specify two different callbacks for messages from channels and presence events in channels.  
pubnub.subscribe(  
    channels: 'ruby.*'  
)  
`
```

##### Wildcard grants and revokes

Only one level (`a.*`) of wildcarding is supported. If you grant on `*` or `a.b.*`, the grant will treat `*` or `a.b.*` as a single channel named either `*` or `a.b.*`. You can also revoke permissions from multiple channels using wildcards but only if you previously granted permissions using the same wildcards. Wildcard revokes, similarly to grants, only work one level deep, like `a.*`.

#### Subscribing with State[​](#subscribing-with-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`require 'pubnub'  
  
PUBKEY = 'demo'  
SUBKEY = 'demo'  
  
pubnub = Pubnub.new(  
    subscribe_key: SUBKEY,  
    publish_key: PUBKEY,  
    ssl: true  
)  
  
callback = Pubnub::SubscribeCallback.new(  
    message: ->(envelope) {  
        puts "MESSAGE: #{envelope.result[:data]}"  
    },  
`
```
show all 32 lines

#### Subscribe to a channel group[​](#subscribe-to-a-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`# Subscribe to group  
pubnub.subscribe(  
    channel_groups: 'ruby_group'  
)  
`
```

#### Subscribe to the presence channel of a channel group[​](#subscribe-to-the-presence-channel-of-a-channel-group)

##### Requires Stream Controller and Presence add-ons

This method requires both the *Stream Controller* and *Presence* add-ons are enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key: :demo  
)  
  
callback = Pubnub::SubscribeCallback.new(  
    message:  ->(_envelope) {  
    },  
    presence: ->(envelope) {  
        puts "PRESENCE: #{envelope.result[:data]}"  
    },  
    status:   ->(_envelope) {  
    }  
)  
  
`
```
show all 18 lines

##### Subscribe Sync[​](#subscribe-sync)

##### Loop

The loop will exit when there is no subscribed channel left, closing the program in turn.

```
`require 'pubnub'  
pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key: :demo  
)  
  
pubnub.subscribe(channels: :whatever)  
while pubnub.subscribed_channels.size > 0 do  
    sleep 1  
end  
`
```

## Unsubscribe[​](#unsubscribe)

When subscribed to a single channel, this function causes the client to issue a `leave` from the `channel` and close any open socket to the PubNub Network. For multiplexed channels, the specified `channel`(s) will be removed and the socket remains open until there are no more channels remaining in the list.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-4)

To `Unsubscribe from a channel` you can use the following method(s) in the Ruby SDK:

```
`unsubscribe(  
    channels: channels,  
    channel_groups: group,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels`Type: Symbol, StringSpecify the `channels` to `unsubscribe` from. (Required if `channel_groups` is not specified)`channel_groups`Type: Symbol, StringSpecify the `channel_groups` to `unsubscribe` from. (Required if `channels` is not specified)`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-4)

Unsubscribe from a channel:

```
`pubnub.unsubscribe(  
    channel: 'my_channel'  
) do |envelope|  
    puts envelope.status  
end  
`
```

### Response[​](#response)

```
`#  
    @status = {  
        :code => 200,  
        :operation => :leave,  
        :category => :ack,  
        :error => false,  
        # [...]  
    },  
    # [...]  
>  
`
```

### Other Examples[​](#other-examples-2)

#### Unsubscribing from multiple channels[​](#unsubscribing-from-multiple-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`pubnub.unsubscribe(  
    channel: ['chan1','chan2','chan3']  
) do |envelope|  
    puts envelope.status  
end  
`
```

```
`pubnub.unsubscribe(  
    channel: ['chan1','chan2','chan3']  
) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
`
```

##### Example Response[​](#example-response)

```
`{  
    "action" : "leave"  
}  
`
```

#### Unsubscribing from a channel group[​](#unsubscribing-from-a-channel-group)

```
`pubnub.leave(channel_group: "cg1") do |envelope|  
    puts envelope.status  
end  
`
```

#### Unsubscribing from multiple channel groups[​](#unsubscribing-from-multiple-channel-groups)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`pubnub.leave(group: ["cg1", "cg2"]) do |envelope|**    puts envelope  
end  
`
```
Last updated on Jun 16, 2025**