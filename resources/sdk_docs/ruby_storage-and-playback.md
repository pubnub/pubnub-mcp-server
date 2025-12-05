# Message Persistence API for Ruby SDK

Message Persistence provides real-time access to stored, timestamped messages across multiple zones with optional AES-256 encryption. Configure retention in the Admin Portal: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve messages, message reactions, and files (via File Sharing API).

## Batch history

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages from multiple channels (up to 500). Use include_message_actions to fetch message actions for a single channel only.

fetch_messages() vs history()
- Use fetch_messages() for multiple channels (up to 500). For single-channel retrieval with options like reverse or include_token, use history().
- Limits: up to 100 messages on a single channel, or 25 per channel across up to 500 channels. Page using start/end.

Start & End usage
- start only: returns messages older than start timetoken.
- end only: returns messages from end timetoken and newer.
- start and end: returns messages between (inclusive of end). Page iteratively with adjusted start to retrieve more than the limit.

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

Parameters
- channel (String): Single channel to fetch from. Supports include_message_actions.
- channels (Array): Up to 500 channels. Not compatible with include_message_actions.
- max (Integer): Max messages per channel. Default 25 (multi-channel) or 100 (single channel).
- start (Integer): Start timetoken (exclusive).
- end (Integer): End timetoken (inclusive).
- include_meta (Boolean): Include message metadata. Default false.
- include_message_actions (Boolean): Include message actions (single channel only). Default false.
- include_uuid (Boolean): Include publisher UUID. Default true.
- include_message_type (Boolean): Include PubNub message type. Default true.
- include_custom_message_type (Boolean): Include custom message type. Default false.
- encode_channels (Boolean): URL-encode channel names. Default true. Set false when not using include_message_actions.
- cipher_key (String): Custom cipher key to decrypt messages (overrides default crypto).
- random_iv (Boolean): Use random IV for encryption. Default true. Only used with cipher_key.
- http_sync (Boolean): Default false (async; returns future; call value on Envelope). If true, returns array of envelopes.
- callback (Lambda): Called for each Envelope. For async methods, returns future; call value to get Envelope (thread blocks until value).

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

Fetch messages with metadata:

```
`1pubnub.fetch_messages(  
2    channels: ['channel1', 'channel2'],  
3    include_meta: true  
4) do |envelope|  
5    puts envelope.result[:data][:channels]  
6end  
`
```

Fetch messages with message actions:

```
`1pubnub.fetch_messages(  
2    channel: 'channel1',  
3    include_message_actions: true  
4) do |envelope|  
5    puts envelope.result[:data][:channels]  
6end  
`
```

Fetch messages with custom encryption:

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

Fetch historical messages of a channel with control over order and range:
- reverse=false (default): newest-first search; reverse=true: oldest-first traversal.
- Page with start or end timetoken; provide both to slice a range.
- Limit via count (max 100).

Start & End usage
- start only: older than and up to start.
- end only: end and newer.
- start and end: between (inclusive on end).
- Max 100 messages per call; page with adjusted start.

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

Parameters
- channels (String, Symbol): Channel(s) to return history from.
- count (Integer): Number of messages to return. Default/maximum 100.
- start (Integer): Start timetoken (exclusive).
- end (Integer): End timetoken (inclusive).
- reverse (Boolean): true traverses from oldest first; false default. Ignored if both start and end provided (messages returned starting from newest).
- http_sync (Boolean): Default false (async; returns future; use value). If true, returns array of envelopes; sync returns Envelope.
- include_token (Boolean): Include message timetoken per message. Default false.
- include_meta (Boolean): Include meta set during publish. Default false.
- callback (Lambda): Called for each Envelope; for async, call value to retrieve Envelope (blocks until value).

Tip: Messages are returned in ascending time order; reverse affects which end of the interval is read first when more than count messages exist.

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

Use history() to retrieve the three oldest messages (reverse):

```
`1pubnub.history(  
2    channel: :history,  
3    count: 3,  
4    reverse: true,  
5    http_sync: true  
6)  
`
```

Response

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

Retrieve messages newer than a given timetoken (reverse from start, exclusive):

```
`1pubnub.history(  
2    channel: :history,  
3    start: 15010808287700000,  
4    reverse: true,  
5    http_sync: true  
6)  
`
```

Response

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

Retrieve messages until a given timetoken (newest to oldest, inclusive end):

```
`1pubnub.history(  
2    channel: :history,  
3    end: 15010808287700000,  
4    http_sync: true  
5)  
`
```

Response

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

History paging example

Usage: Call with 0 or a valid timetoken.

```
`1pubnub.paged_history(channel: :messages, limit: 10, page: 20) do |envelope|  
2    puts envelope.result[:data][:messages]  
3end  
`
```

Include timetoken in history response

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

Requires Message Persistence. Enable Delete-From-History in key settings (Admin Portal). Requires initialization with secret key.

### Method(s)

To Delete Messages from History use:

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

Parameters
- channels (String, Symbol): Channels from which messages are deleted.
- start (String, Integer): Timestamp since when messages should be deleted.
- end (String, Integer): Timestamp until when messages should be deleted.
- http_sync (Boolean): Default false (async; returns future; use value). If true, returns array of envelopes; sync returns Envelope.
- callback (Lambda): Called for each Envelope; for async, call value to retrieve Envelope (blocks until value).

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

Delete specific message from history

To delete a specific message, pass the publish timetoken in end and timetoken +/- 1 in start.

```
`1pubnub.delete_messages(channel: 'my-channel', start: 15526611838554309, end: 15526611838554310, callback: check_response_status)  
`
```

## Message counts

Requires Message Persistence.

Returns the number of messages on one or more channels since a given time. The count is the number of messages with timetoken >= provided value in channel_timetokens.

Unlimited message retention: for keys with unlimited retention, counts consider only messages from the last 30 days.

### Method(s)

You can use:

```
`1pubnub.message_counts(  
2    channels: array_of_channels,  
3    channel_timetokens: array_of_timetokens  
4)  
`
```

Parameters
- channel (String, Symbol): Either array of channels, single channel string, or comma-separated channels.
- channel_timetokens (Array): Array of timetokens ordered to match channels, or a single timetoken applied to all channels. Length must match channels list if array; otherwise returns PNStatus error.
- http_sync (Boolean): Default false (async; returns future; use value). If true, returns array of envelopes; sync returns Envelope.

### Sample code

```
`1envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: 12123).value  
2    p envelope.result[:data]  
`
```

### Returns

Channels without messages have a count of 0. Channels with 10,000 messages or more return 10000.

Returns Concurrent::Future (http_sync: false, default) or envelope (sync).

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

Retrieve count of messages using different timetokens for each channel

```
`1envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: [123135129, 123135124, 12312312, 123135125]).value**2    p envelope.result[:data]  
`
```

Last updated on Sep 17, 2025**