On this page
# Message Persistence API for Ruby SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

## Batch History[​](#batch-history)

##### Requires Message Persistence

This method requires that Message Persistence is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function fetches historical messages from multiple channels. The `include_message_actions` flag also allows you to fetch message actions along with the messages for a single channel.

It's possible to control how messages are returned and in what order. For example, you can:

- Search for messages starting on the newest end of the timeline.

- Search for messages from the oldest end of the timeline.

- Page through results by providing a `start` OR `end` timetoken.

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Retrieve a specific (maximum) number of messages using the `max` parameter.

Batch history returns up to 100 messages on a single channel, or 25 per channel on a maximum of 500 channels. Use the `start` and `end` timestamps to page through the next batch of messages.

##### Start & End parameter usage clarity

If you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` timetoken.

If you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer.

Specify values for both `start` and `end` parameters to retrieve messages between those timetokens (inclusive of the `end` value).

Keep in mind that you will still receive a maximum of 100 messages (or 25, for multiple channels) even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken are necessary to page through the full set of results if more messages meet the timetoken values.

### Method(s)[​](#methods)

To run `Batch History` you can use the following method(s) in the Ruby SDK:

```
`fetch_messages(  
    channel: channel,  
    channels: channels,  
    max: max,  
    start: start,  
    end: end,  
    include_meta: include_meta,  
    include_message_actions: include_message_actions,  
    include_uuid: include_uuid,  
    include_message_type: include_message_type,  
    include_custom_message_type: include_custom_message_type,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel`Type: StringA single channel to fetch messages from. You can use the `include_message_actions` flag to get message actions history for this channel.`channels`Type: ListList of channels to fetch messages from. Can't be used with `include_message_actions` as you can only get the message actions history for a single channel.`max`Type: IntegerMaximum number of messages to return per channel. Default is `25`.`start`Type: IntegerTimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`end`Type: IntegerTimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`include_meta`Type: BooleanInclude message metadata in the response. Default is `false`.`include_message_actions`Type: BooleanInclude message actions in the response. Default is `false`.`include_uuid`Type: BooleanInclude UUID of the publisher in the response. Default is `true`.`include_message_type`Type: BooleanWhether to include the PubNub message type in the response. Default is `true`.`include_custom_message_type`Type: BooleanWhether to include the custom message type in the response. Default is `false`.`http_sync`Type: BooleanDefault `false`. The method is executed asynchronously and returns a future. To retrieve the value, call the `value` method on the `Envelope` object. If set to `true`, method returns an array of envelopes (even if there's only one `Envelope`).`callback`Type: Lambda accepting one parameterCallback that is called for each `Envelope`. For `async` methods, a future is returned. To retrieve the value, call the `value` method on the `Envelope` object. The thread is locked until the `value` is returned.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last 25 messages on multiple channels:

```
`require 'pubnub'  
  
def fetch_messages(pubnub)  
  pubnub.fetch_messages(  
    channels: ['demo', 'example'],  
    max: 25  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "Error fetching messages: #{envelope.status[:error]}"  
    else  
      puts "Messages fetched successfully:"  
      envelope.result[:data][:channels].each do |channel, messages|  
        puts "Channel: #{channel}"  
        messages.each do |message|  
          puts "Message: #{message['message']}, Timetoken: #{message['timetoken']}"  
`
```
show all 36 lines

### Response[​](#response)

The Ruby SDK returns false on fail. An array is returned on success.

The `fetch_messages()` function returns a list of messages for each channel. The output below demonstrates the format for a `fetch_messages()` response:

```
`    @result = {  
        :data => {  
            :channels => {  
                'channel1' => [  
                    { 'message' => 'Message1', 'timetoken' => 15010808292416521 },  
                    { 'message' => 'Message2', 'timetoken' => 15010808292416522 }  
                ],  
                'channel2' => [  
                    { 'message' => 'Message3', 'timetoken' => 15010808292416523 },  
                    { 'message' => 'Message4', 'timetoken' => 15010808292416524 }  
                ]  
            }  
        }  
    },  
    @status = {  
`
```
show all 18 lines

### Other Examples[​](#other-examples)

#### Fetch messages with metadata[​](#fetch-messages-with-metadata)

```
`pubnub.fetch_messages(  
    channels: ['channel1', 'channel2'],  
    include_meta: true  
) do |envelope|  
    puts envelope.result[:data][:channels]  
end  
`
```

#### Fetch messages with message actions[​](#fetch-messages-with-message-actions)

```
`pubnub.fetch_messages(  
    channel: 'channel1',  
    include_message_actions: true  
) do |envelope|  
    puts envelope.result[:data][:channels]  
end  
`
```

## History[​](#history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `true`.

- Page through results by providing a `start` OR `end` [timetoken](/docs/sdks/ruby/api-reference/misc#time).

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `count` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older** than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`) you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-1)

To run `History` you can use the following method(s) in the Ruby SDK:

```
`history(  
    channels: channels,  
    count: count,  
    start: start,  
    end: end,  
    reverse: reverse,  
    include_token: include_token,  
    include_meta: include_meta,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels` *Type: String, SymbolSpecify `channels` to return history messages from.`count`Type: IntegerSpecifies the number of historical messages to return. Default/maximum is `100`.`start`Type: IntegerTimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`end`Type: IntegerTimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`reverse`Type: BooleanSetting to `true` will traverse the time line in reverse starting with the oldest `message` first.Default is `false`. If both `start` and `end` arguments are provided, `reverse` is ignored and messages are returned starting with the newest `message`.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`include_token`Type: BooleanWith `include_token` parameter set to `true` each envelope will contain timetoken specific for `message` that it holds. Default: `false``include_meta`Type: BooleanWhen set to `true`, the history response will include the `meta` information associated with each message if it was set during [publishing](/docs/sdks/kotlin/api-reference/publish-and-subscribe#publish). Default: `false`.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `count`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-1)

Retrieve the last 100 messages on a channel:

```
`pubnub.history(  
    channel: 'history_channel',  
    count: 100  
) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
`
```

### Response[​](#response-1)

The Ruby SDK returns false on fail. An array is returned on success.

The `history()` function returns a list of up to 100 messages, the timetoken of the first (oldest) message and the timetoken of the last (newest) message in the resulting set of messages. The output below demonstrates the format for a `history()` response:

```
`#  
    @result = {  
        :data => {  
            :messages => ["Pub1", "Pub2", "Pub3", "Pub4", "Pub5", "Pub6", "Pub7", "Pub8", "Pub9", "Pub10"],  
            :end => 15010808292416521,  
            :start => 15010808287349573  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

### Other Examples[​](#other-examples-1)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`pubnub.history(  
    channel: :history,  
    count: 3,  
    reverse: true,  
    http_sync: true  
)  
`
```

##### Response[​](#response-2)

```
`#  
    @result = {  
        :data => {  
            :messages => ["Pub1", "Pub2", "Pub3"],  
            :end => 15010808288498250,  
            :start => 15010808287349573  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`pubnub.history(  
    channel: :history,  
    start: 15010808287700000,  
    reverse: true,  
    http_sync: true  
)  
`
```

##### Response[​](#response-3)

```
`#  
    @result = {  
        :data => {  
            :messages => ["Pub1"],  
            :end => 15010808287349573,  
            :start => 15010808287349573  
        }  
    }  
    @status = {  
        :code => 200  
    }  
>  
`
```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`pubnub.history(  
    channel: :history,  
    end: 15010808287700000,  
    http_sync: true  
)  
`
```

##### Response[​](#response-4)

```
`#  
    @result = {  
        :data => {  
            :messages => ["Pub2", "Pub3", "Pub4", "Pub5", "Pub6", "Pub7", "Pub8", "Pub9", "Pub10"],  
            :end => 15010808292416521,  
            :start => 15010808287951883  
        }  
    }  
    @status = {  
        :code => 200  
    }  
>  
`
```

#### History Paging Example[​](#history-paging-example)

##### Usage

You can call the method by passing 0 or a valid **timetoken** as the argument.

```
`pubnub.paged_history(channel: :messages, limit: 10, page: 20) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
`
```

#### Include timetoken in history response[​](#include-timetoken-in-history-response)

```
`# ASYNC  
# Call history with include_token: true  
future_envelope = pubnub.history(channel: :demo, include_token: true)  
# Get timetoken of first retrieved message  
future_envelope.value.result[:data][:messages].first['timetoken']  
  
# SYNC  
# Call history with include_token: true  
envelope = pubnub.history(channel: :demo, include_token: true, http_sync: true)  
# Get timetoken of first retrieved message  
envelope.result[:data][:messages].first['timetoken']  
  
# Example response in result[:data][:messages]  
# [  
#   {"message"=>"Whatever", "timetoken"=>14865606002747651},  
`
```
show all 18 lines

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-2)

To `Delete Messages from History` you can use the following method(s) in the Ruby SDK.

```
`delete_messages(  
    channels: channels,  
    start: start,  
    end: end,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels` *Type: String, Symbol`Channels` from which messages will be deleted.`start`Type: String, Integer`Timestamp` since when messages should be deleted.`end`Type: String, Integer`Timestamp` until when messages should be deleted.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-2)

```
`pubnub.delete_messages(channel: 'my-channel', start: 1508284800, end: 1508935781, callback: check_response_status)  
`
```

### Response[​](#response-5)

```
`#  
    @status = {  
        :code => 200,  
        :operation => :delete,  
        :category => :ack,  
        :error => false,  
        # [...]  
    },  
    # [...]  
>  
`
```

### Other Examples[​](#other-examples-2)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `end` parameter and `timetoken +/- 1` in the `start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `start` and `15526611838554310` in `end` parameters respectively as shown in the following code snippet.

```
`pubnub.delete_messages(channel: 'my-channel', start: 15526611838554309, end: 15526611838554310, callback: check_response_status)  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `channel_timetokens`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-3)

You can use the following method(s) in the Ruby SDK:

```
`pubnub.message_counts(  
    channels: array_of_channels,  
    channel_timetokens: array_of_timetokens  
)  
`
```

*  requiredParameterDescription`channel` *Type: String, SymbolDefault:  
n/aEither array of channels, string with single channel or string with comma separated channels`channel_timetokens` *Type: ArrayDefault:  
`null`Array of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.`http_sync`Type: BooleanDefault:  
n/aDefault `false`. Method will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.

### Basic Usage[​](#basic-usage-3)

```
`envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: 12123).value  
    p envelope.result[:data]  
`
```

### Returns[​](#returns)

##### Channels count

`Channels` without messages have a count of 0. `Channels` with 10,000 messages or more have a count of 10000.

Returns `Concurrent::Future` object if PubNub is configured with `http_sync: false` (default behavior) or `envelope` if it's set to `sync mode`

```
`#  
    @result=  
      {  
       :data=>  
        {  
         "channels"=>{"a"=>2, "c"=>0, "b"=>0, "d"=>0}  
        }  
     @status=  
      {  
        :code=>200  
      }  
>  
`
```

### Other Examples[​](#other-examples-3)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: [123135129, 123135124, 12312312, 123135125]).value**    p envelope.result[:data]  
`
```
Last updated on Jun 10, 2025**