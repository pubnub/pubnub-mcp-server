# Message Persistence API for Ruby SDK

Message Persistence provides real-time access to stored messages, reactions, and files. Messages are timestamped and redundantly stored. You can encrypt stored messages with AES-256. Configure retention per key: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. Requires Message Persistence enabled in the Admin Portal.

## Batch history

##### Requires Message Persistence

Fetch historical messages from multiple channels (up to 500). Use include_message_actions only for a single channel. Use fetch_messages() for multi-channel retrieval; use history() for single-channel retrieval with options like reverse or include_token.

Behavior and limits:
- Up to 100 messages for a single channel, or 25 per channel across up to 500 channels.
- Page via start and/or end timetokens:
  - start only: returns messages older than start.
  - end only: returns messages from end and newer.
  - both: returns messages between start and end (end inclusive).
- Use max to limit messages per channel.

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

Parameters:
- channel (String): Single channel. Can be used with include_message_actions to fetch message actions.
- channels (Array): Up to 500 channels. Not compatible with include_message_actions.
- max (Integer): Messages per channel. Default 25 for multiple channels; 100 for a single channel.
- start (Integer): Start timetoken (exclusive).
- end (Integer): End timetoken (inclusive).
- include_meta (Boolean): Include message metadata. Default false.
- include_message_actions (Boolean): Include message actions; only for single channel. Default false.
- include_uuid (Boolean): Include publisher UUID. Default true.
- include_message_type (Boolean): Include PubNub message type. Default true.
- include_custom_message_type (Boolean): Include custom message type. Default false.
- encode_channels (Boolean): URL-encode channel names. Default true. Set false when not using include_message_actions.
- cipher_key (String): Custom cipher key for decryption; overrides default crypto config.
- random_iv (Boolean): Use random IV for encryption. Default true; applies when cipher_key is provided.
- http_sync (Boolean): Default false (async returns Future; call value on Envelope). If true, returns array of Envelopes.
- callback (Lambda): Called for each Envelope. For async, retrieve value via future.value.

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

The fetch_messages() function returns a list of messages for each channel:

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

##### Requires Message Persistence

Fetch historical messages for a channel with control over order and paging.
- reverse: false (default) starts from newest; true starts from oldest.
- Page using start (exclusive) and/or end (inclusive). Max 100 messages per call.
- Use count to limit returned messages.

Start & End usage:
- start only: older than start.
- end only: from end and newer.
- both: messages between start and end (end inclusive).
Iterate with adjusted start to page through more than 100 messages.

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

Parameters:
- channels (String, Symbol): Channel(s) to return history from.
- count (Integer): Number of messages. Default/max 100.
- start (Integer): Start timetoken (exclusive).
- end (Integer): End timetoken (inclusive).
- reverse (Boolean): true traverses from oldest first. Default false. Ignored if both start and end are provided (messages return newest-first).
- include_token (Boolean): Include per-message timetokens. Default false.
- include_meta (Boolean): Include meta set at publish time. Default false.
- http_sync (Boolean): Default false (async future; use value). If true, returns array of envelopes. Sync returns Envelope.
- callback (Lambda): Called for each envelope. For async, call value to retrieve Envelope.

Tip: Messages are returned in ascending time. reverse determines which end of the interval to start from when the interval contains more than count messages.

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

##### Requires Message Persistence

Removes messages from a channel’s history.

Required settings:
- Enable Delete-From-History in the Admin Portal for the key.
- Initialize with a secret key.

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

Parameters:
- channels (String, Symbol): Channel(s) to delete from.
- start (String, Integer): Timestamp from which to delete (inclusive behavior per endpoint semantics).
- end (String, Integer): Timestamp until which to delete.
- http_sync (Boolean): Default false (async future; use value). If true, returns array of envelopes.
- callback (Lambda): Called per envelope.

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

##### Requires Message Persistence

Returns the number of messages published on one or more channels since a given timetoken. Count equals messages with timetoken >= provided channel_timetokens value.

Unlimited retention note: For keys with unlimited retention enabled, this method considers only messages from the last 30 days.

### Method(s)

You can use the following method(s) in the Ruby SDK:

```
`1pubnub.message_counts(  
2    channels: array_of_channels,  
3    channel_timetokens: array_of_timetokens  
4)  
`
```

Parameters:
- channel (String, Symbol or Array): Array of channels, single channel string, or comma-separated string.
- channel_timetokens (Array or single timetoken): Single timetoken applies to all channels; otherwise array length must match channels. On mismatch, returns PNStatus with error.
- http_sync (Boolean): Default false (async future; use value). If true, returns array of envelopes.

### Sample code

```
`1envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: 12123).value  
2    p envelope.result[:data]  
`
```

### Returns

Channels without messages have a count of 0. Channels with 10,000+ messages return 10000. Returns Concurrent::Future (default) or Envelope in sync mode.

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

Last updated on Sep 17, 2025**