# Message Persistence API for Ruby SDK

Message Persistence provides real-time access to stored, timestamped messages (10 ns precision) across multiple regions. Optional AES-256 encryption is supported. Configure retention in Admin Portal: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. Retrievable data:
- Messages
- Message reactions
- Files (via File Sharing API)

## Batch history

Requires Message Persistence (enable in Admin Portal).

Fetch messages from multiple channels simultaneously (up to 500). Use include_message_actions only with a single channel. Limits:
- Single channel: up to 100 messages.
- Multiple channels: up to 25 messages per channel, up to 500 channels.
- Page with start and/or end timetokens.

fetch_messages() vs history():
- Use fetch_messages() for multiple channels.
- Use history() for single channel with options like reverse or include_token.

Start & End usage:
- start only: returns messages older than start (exclusive).
- end only: returns messages from end and newer (inclusive).
- start and end: messages between them (inclusive of end).
- Max messages apply; page using start to iterate through full results.

### Method(s)

Use the following method(s) in the Ruby SDK:

```
`1fetch_messages(  
2    channel: channel,  
3    channels: channels,  
4    max: max,  
5    start: start,  
6    end: end,  
7    include_meta: include_meta,  
8    include_message_actions: include_message_actions,  
9    include_uuid: include_uuid,  
10    include_message_type: include_message_type,  
11    include_custom_message_type: include_custom_message_type,  
12    encode_channels: encode_channels,  
13    cipher_key: cipher_key,  
14    random_iv: random_iv,  
15    http_sync: http_sync,  
16    callback: callback  
17)  
`
```

*  requiredParameterDescription`channel`Type: StringA single channel to fetch messages from. You can use the `include_message_actions` flag to get message actions history for this channel.`channels`Type: ArrayArray of channels to fetch messages from. Maximum of 500 channels. Can't be used with `include_message_actions` as you can only get the message actions history for a single channel.`max`Type: IntegerMaximum number of messages to return per channel. Default is `25` for multiple channels or `100` for a single channel.`start`Type: Integertimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`end`Type: Integertimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`include_meta`Type: BooleanInclude message metadata in the response. Default is `false`.`include_message_actions`Type: BooleanInclude message actions in the response. Only works with single channel. Default is `false`.`include_uuid`Type: BooleanInclude UUID of the publisher in the response. Default is `true`.`include_message_type`Type: BooleanWhether to include the PubNub message type in the response. Default is `true`.`include_custom_message_type`Type: BooleanWhether to include the custom message type in the response. Default is `false`.`encode_channels`Type: BooleanWhether to encode channel names for URL safety. Default is `true`. Set to `false` when not using `include_message_actions`.`cipher_key`Type: StringCustom cipher key for message decryption. If provided, overrides the default crypto configuration.`random_iv`Type: BooleanWhether to use random initialization vector for encryption. Default is `true`. Only used when `cipher_key` is provided.`http_sync`Type: BooleanDefault `false`. The method is executed asynchronously and returns a future. To retrieve the value, call the `value` method on the `Envelope` object. If set to `true`, method returns an array of envelopes (even if there's only one `Envelope`).`callback`Type: Lambda accepting one parameterCallback that is called for each `Envelope`. For `async` methods, a future is returned. To retrieve the value, call the `value` method on the `Envelope` object. The thread is locked until the `value` is returned.

### Sample code

Retrieve the last 25 messages on multiple channels:

```
1require 'pubnub'  
2
  
3def fetch_messages(pubnub)  
4  pubnub.fetch_messages(  
5    channels: ['demo', 'example'],  
6    max: 25  
7  ) do |envelope|  
8    if envelope.status[:error]  
9      puts "Error fetching messages: #{envelope.status[:error]}"  
10    else  
11      puts "Messages fetched successfully:"  
12      envelope.result[:data][:channels].each do |channel, messages|  
13        puts "Channel: #{channel}"  
14        messages.each do |message|  
15          puts "Message: #{message['message']}, Timetoken: #{message['timetoken']}"  
16        end  
17      end  
18    end  
19  end  
20end  
21
  
22def main  
23  # Configuration for PubNub instance  
24  pubnub = Pubnub.new(  
25    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
26    user_id: 'myUniqueUserId'  
27  )  
28
  
29  # Fetch messages  
30  fetch_messages(pubnub)  
31  sleep 1 # Allow time for the async operation to complete  
32end  
33
  
34if __FILE__ == $0  
35  main  
36end  
```

### Response

The Ruby SDK returns false on fail. An array is returned on success.

The `fetch_messages()` function returns a list of messages for each channel. The output below demonstrates the format for a `fetch_messages()` response:

```
`1    @result = {  
2        :data => {  
3            :channels => {  
4                'channel1' => [  
5                    { 'message' => 'Message1', 'timetoken' => 15010808292416521 },  
6                    { 'message' => 'Message2', 'timetoken' => 15010808292416522 }  
7                ],  
8                'channel2' => [  
9                    { 'message' => 'Message3', 'timetoken' => 15010808292416523 },  
10                    { 'message' => 'Message4', 'timetoken' => 15010808292416524 }  
11                ]  
12            }  
13        }  
14    },  
15    @status = {  
16        :code => 200  
17    }  
18>  
`
```

### Other examples

#### Fetch messages with metadata

```
`1pubnub.fetch_messages(  
2    channels: ['channel1', 'channel2'],  
3    include_meta: true  
4) do |envelope|  
5    puts envelope.result[:data][:channels]  
6end  
`
```

#### Fetch messages with message actions

```
`1pubnub.fetch_messages(  
2    channel: 'channel1',  
3    include_message_actions: true  
4) do |envelope|  
5    puts envelope.result[:data][:channels]  
6end  
`
```

#### Fetch messages with custom encryption

```
`1pubnub.fetch_messages(  
2    channels: ['channel1', 'channel2'],  
3    cipher_key: 'my_custom_cipher_key',  
4    random_iv: true  
5) do |envelope|  
6    puts envelope.result[:data][:channels]  
7end  
`
```

## History

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages for a single channel. Control order and range with reverse, start, end, and count.
- reverse false (default): newest end first; true: traverse from oldest.
- Page using start or end.
- Provide both start and end for a slice (end inclusive).
- count limits messages (default/max 100).

Start & End usage:
- start only: messages older than and up to start (exclusive).
- end only: messages at end and newer (inclusive).
- Both: between them (end inclusive). Max 100 per call; page using start to iterate more.

### Method(s)

Use the following method(s) in the Ruby SDK:

```
`1history(  
2    channels: channels,  
3    count: count,  
4    start: start,  
5    end: end,  
6    reverse: reverse,  
7    include_token: include_token,  
8    include_meta: include_meta,  
9    http_sync: http_sync,  
10    callback: callback  
11)  
`
```

*  requiredParameterDescription`channels` *Type: String, SymbolSpecify `channels` to return history messages from.`count`Type: IntegerSpecifies the number of historical messages to return. Default/maximum is `100`.`start`Type: Integertimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`end`Type: Integertimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`reverse`Type: BooleanSetting to `true` will traverse the time line in reverse starting with the oldest `message` first.Default is `false`. If both `start` and `end` arguments are provided, `reverse` is ignored and messages are returned starting with the newest `message`.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`include_token`Type: BooleanWith `include_token` parameter set to `true` each envelope will contain timetoken specific for `message` that it holds. Default: `false``include_meta`Type: BooleanWhen set to `true`, the history response will include the `meta` information associated with each message if it was set during [publishing](/docs/sdks/kotlin/api-reference/publish-and-subscribe#publish). Default: `false`.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

Tip: Messages are returned in ascending time within the selected interval. reverse affects which end of the interval retrieval starts from when more than count messages exist.

### Sample code

Retrieve the last 100 messages on a channel:

```
`1pubnub.history(  
2    channel: 'history_channel',  
3    count: 100  
4) do |envelope|  
5    puts envelope.result[:data][:messages]  
6end  
`
```

### Response

The Ruby SDK returns false on fail. An array is returned on success.

The `history()` function returns messages plus start and end timetokens for the result set:

```
`1#  
2    @result = {  
3        :data => {  
4            :messages => ["Pub1", "Pub2", "Pub3", "Pub4", "Pub5", "Pub6", "Pub7", "Pub8", "Pub9", "Pub10"],  
5            :end => 15010808292416521,  
6            :start => 15010808287349573  
7        }  
8    },  
9    @status = {  
10        :code => 200  
11    }  
12>  
`
```

### Other examples

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
`1pubnub.history(  
2    channel: :history,  
3    count: 3,  
4    reverse: true,  
5    http_sync: true  
6)  
`
```

##### Response

```
`1#  
2    @result = {  
3        :data => {  
4            :messages => ["Pub1", "Pub2", "Pub3"],  
5            :end => 15010808288498250,  
6            :start => 15010808287349573  
7        }  
8    },  
9    @status = {  
10        :code => 200  
11    }  
12>  
`
```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)

```
`1pubnub.history(  
2    channel: :history,  
3    start: 15010808287700000,  
4    reverse: true,  
5    http_sync: true  
6)  
`
```

##### Response

```
`1#  
2    @result = {  
3        :data => {  
4            :messages => ["Pub1"],  
5            :end => 15010808287349573,  
6            :start => 15010808287349573  
7        }  
8    }  
9    @status = {  
10        :code => 200  
11    }  
12>  
`
```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)

```
`1pubnub.history(  
2    channel: :history,  
3    end: 15010808287700000,  
4    http_sync: true  
5)  
`
```

##### Response

```
`1#  
2    @result = {  
3        :data => {  
4            :messages => ["Pub2", "Pub3", "Pub4", "Pub5", "Pub6", "Pub7", "Pub8", "Pub9", "Pub10"],  
5            :end => 15010808292416521,  
6            :start => 15010808287951883  
7        }  
8    }  
9    @status = {  
10        :code => 200  
11    }  
12>  
`
```

#### History paging example

##### Usage

You can call the method by passing 0 or a valid timetoken as the argument.

```
`1pubnub.paged_history(channel: :messages, limit: 10, page: 20) do |envelope|  
2    puts envelope.result[:data][:messages]  
3end  
`
```

#### Include timetoken in history response

```
1# ASYNC  
2# Call history with include_token: true  
3future_envelope = pubnub.history(channel: :demo, include_token: true)  
4# Get timetoken of first retrieved message  
5future_envelope.value.result[:data][:messages].first['timetoken']  
6
  
7# SYNC  
8# Call history with include_token: true  
9envelope = pubnub.history(channel: :demo, include_token: true, http_sync: true)  
10# Get timetoken of first retrieved message  
11envelope.result[:data][:messages].first['timetoken']  
12
  
13# Example response in result[:data][:messages]  
14# [  
15#   {"message"=>"Whatever", "timetoken"=>14865606002747651},  
16#   {"message"=>"Message", "timetoken"=>14865606051899206},  
17#   {"message"=>"Another", "timetoken"=>14865606101428628}  
18# ]  
```

## Delete messages from history

Requires Message Persistence and enabling Delete-From-History in Admin Portal. Requires initialization with secret key.

Removes messages from a channel’s history within a time range.

### Method(s)

To Delete Messages from History you can use the following method(s) in the Ruby SDK.

```
`1delete_messages(  
2    channels: channels,  
3    start: start,  
4    end: end,  
5    http_sync: http_sync,  
6    callback: callback  
7)  
`
```

*  requiredParameterDescription`channels` *Type: String, Symbol`Channels` from which messages will be deleted.`start`Type: String, Integer`Timestamp` since when messages should be deleted.`end`Type: String, Integer`Timestamp` until when messages should be deleted.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Sample code

```
`1pubnub.delete_messages(channel: 'my-channel', start: 1508284800, end: 1508935781, callback: check_response_status)  
`
```

### Response

```
`1#  
2    @status = {  
3        :code => 200,  
4        :operation => :delete,  
5        :category => :ack,  
6        :error => false,  
7        # [...]  
8    },  
9    # [...]  
10>  
`
```

### Other examples

#### Delete specific message from history

To delete a specific message, pass the publish timetoken in end and timetoken +/- 1 in start.

```
`1pubnub.delete_messages(channel: 'my-channel', start: 15526611838554309, end: 15526611838554310, callback: check_response_status)  
`
```

## Message counts

Requires Message Persistence (enable in Admin Portal).

Returns counts of messages published on channels since given timetokens. For keys with Unlimited retention, only messages from the last 30 days are considered.
- count is number of messages with timetoken >= provided timetoken.
- Provide a single timetoken for all channels or one per channel (must match channel list length).

### Method(s)

You can use the following method(s) in the Ruby SDK:

```
`1pubnub.message_counts(  
2    channels: array_of_channels,  
3    channel_timetokens: array_of_timetokens  
4)  
`
```

*  requiredParameterDescription`channel` *Type: String, SymbolDefault:  
n/aEither array of channels, string with single channel or string with comma separated channels`channel_timetokens` *Type: ArrayDefault:  
`null`Array of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.`http_sync`Type: BooleanDefault:  
n/aDefault `false`. Method will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.

### Sample code

```
`1envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: 12123).value  
2    p envelope.result[:data]  
`
```

### Returns

Channels without messages have a count of 0. Channels with 10,000 messages or more have a count of 10000.

Returns `Concurrent::Future` when http_sync: false (default) or envelope when sync mode.

```
`1#  
2    @result=  
3      {  
4       :data=>  
5        {  
6         "channels"=>{"a"=>2, "c"=>0, "b"=>0, "d"=>0}  
7        }  
8     @status=  
9      {  
10        :code=>200  
11      }  
12>  
`
```

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
`1envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: [123135129, 123135124, 12312312, 123135125]).value**2    p envelope.result[:data]  
`
```