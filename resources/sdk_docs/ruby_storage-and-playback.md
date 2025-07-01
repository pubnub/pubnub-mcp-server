# Message Persistence API – Ruby SDK (Storage & Playback)

Requires the Message Persistence add-on to be enabled for your key (Admin Portal).  
Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.  
Messages are timestamped to 10 ns and may be AES-256 encrypted.

---

## Batch History (`fetch_messages`)

Fetch historical messages from one or many channels.  
Limits: 100 messages on a single channel, or 25 per channel on up to 500 channels.  
`include_message_actions` works with a single channel only.

Timetoken usage  
• `start` only → messages **older** than `start`  
• `end` only → messages **newer/including** `end`  
• `start` + `end` → messages between, inclusive of `end`  

Page through results with successive calls adjusting `start`/`end`.

### Method

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
)`  
```

Parameter summary  
• `channel` String – single channel (mutually exclusive with `channels`).  
• `channels` Array – multiple channels.  
• `max` Integer – per-channel limit, default 25.  
• `start`, `end` Integer – timetokens.  
• `include_meta`, `include_message_actions`, `include_uuid`, `include_message_type`, `include_custom_message_type` Booleans (defaults: `false`, except `include_uuid` & `include_message_type` = `true`).  
• `http_sync` Boolean (default `false`).  
• `callback` Lambda.

### Examples & Response

All example code and response formats are unchanged:

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
*show all 36 lines*

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
*show all 18 lines*

```
`pubnub.fetch_messages(  
    channels: ['channel1', 'channel2'],  
    include_meta: true  
) do |envelope|  
    puts envelope.result[:data][:channels]  
end  
` 
```

```
`pubnub.fetch_messages(  
    channel: 'channel1',  
    include_message_actions: true  
) do |envelope|  
    puts envelope.result[:data][:channels]  
end  
` 
```

---

## History (`history`)

Retrieve up to 100 messages on a channel.

• Default order: newest → oldest (`reverse: false`).  
• `reverse: true` traverses oldest → newest (ignored if both `start` and `end` supplied).  
• Use `start` / `end` timetokens to slice or page.

### Method

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
)`  
```

Key parameters  
• `channels` String/Symbol – target channel(s).  
• `count` Integer – 1-100 (default 100).  
• `start`, `end` Integer – timetokens.  
• `reverse`, `include_token`, `include_meta` Booleans.  
• `http_sync`, `callback` as above.

### Examples & Responses (unchanged)

```
`pubnub.history(  
    channel: 'history_channel',  
    count: 100  
) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
` 
```

```
`#  
    @result = {  
        :data => {  
            :messages => ["Pub1", "Pub2", ...],  
            :end => 15010808292416521,  
            :start => 15010808287349573  
        }  
    },  
    @status = { :code => 200 }  
>` 
```

Additional scenarios (oldest-first, paging, include tokens, etc.):

```
`pubnub.history(  
    channel: :history,  
    count: 3,  
    reverse: true,  
    http_sync: true  
)` 
```

```
`pubnub.history(  
    channel: :history,  
    start: 15010808287700000,  
    reverse: true,  
    http_sync: true  
)` 
```

```
`pubnub.history(  
    channel: :history,  
    end: 15010808287700000,  
    http_sync: true  
)` 
```

```
`pubnub.paged_history(channel: :messages, limit: 10, page: 20) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
` 
```

```
`# ASYNC  
future_envelope = pubnub.history(channel: :demo, include_token: true)  
future_envelope.value.result[:data][:messages].first['timetoken']  
  
# SYNC  
envelope = pubnub.history(channel: :demo, include_token: true, http_sync: true)  
envelope.result[:data][:messages].first['timetoken']  
# [ {"message"=>"Whatever", "timetoken"=>14865606002747651}, ... ]  
` 
```

---

## Delete Messages from History (`delete_messages`)

Requires:  
1. Message Persistence enabled.  
2. “Delete-From-History” option activated in the Admin Portal.  
3. SDK initialized with **secret key**.

Deletes messages on a channel between `start` and `end` timetokens (inclusive).

### Method

```
`delete_messages(  
    channels: channels,  
    start: start,  
    end: end,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters  
• `channels` String/Symbol – channel(s) to purge.  
• `start`, `end` Integer/String – timetoken range.  
• `http_sync`, `callback` as before.

### Examples & Response

```
`pubnub.delete_messages(channel: 'my-channel', start: 1508284800, end: 1508935781, callback: check_response_status)` 
```

```
`#  
    @status = {  
        :code => 200,  
        :operation => :delete,  
        :category => :ack,  
        :error => false  
    }  
>` 
```

Delete a specific message:

```
`pubnub.delete_messages(channel: 'my-channel', start: 15526611838554309, end: 15526611838554310, callback: check_response_status)` 
```

---

## Message Counts (`message_counts`)

Returns the number of messages published **since** the supplied timetoken(s).  
For unlimited retention keys, only messages from the last 30 days are considered.

### Method

```
`pubnub.message_counts(  
    channels: array_of_channels,  
    channel_timetokens: array_of_timetokens  
)`  
```

Parameters  
• `channels` Array/String – target channels.  
• `channel_timetokens` Array – one timetoken per channel, or a single timetoken for all.  
• Optional `http_sync`.

### Examples & Responses

```
`envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: 12123).value  
p envelope.result[:data]  
` 
```

```
`#  
    @result = {  
        :data => { "channels"=>{"a"=>2, "c"=>0, "b"=>0, "d"=>0} }  
    },  
    @status = { :code => 200 }  
>` 
```

Different timetokens per channel:

```
`envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'], channel_timetokens: [123135129, 123135124, 12312312, 123135125]).value  
p envelope.result[:data]  
` 
```

Counts are 0 for channels with no messages; 10 000 for channels with ≥10 000 messages.

---

_Last updated Jun 10 2025_