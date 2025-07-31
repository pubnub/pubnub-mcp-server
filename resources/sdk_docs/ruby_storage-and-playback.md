# Message Persistence API – Ruby SDK (Storage & Playback)

Message Persistence lets you store and retrieve messages, reactions, and files for 1 day – Unlimited, with optional AES-256 encryption.  
All features below require **Message Persistence to be enabled for your key** (Admin Portal).

---

## Batch History (`fetch_messages`)

Fetch messages (and optionally message actions) from one or many channels.

### Method

```
fetch_messages(  
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
```

### Parameters

* channel (String) – Single channel. Required when `include_message_actions: true`.
* channels (Array<String>) – Multiple channels (max 500, 25 msgs/channel).  
  Incompatible with `include_message_actions`.
* max (Integer) – Messages per channel (default 25, max 100 for one channel).
* start (Integer) – Exclusive start timetoken.
* end (Integer) – Inclusive end timetoken.
* include_meta (Boolean, default false)
* include_message_actions (Boolean, default false)
* include_uuid (Boolean, default true)
* include_message_type (Boolean, default true)
* include_custom_message_type (Boolean, default false)
* http_sync (Boolean, default false) – Async unless `true`.
* callback (Proc) – Executed per envelope (async).

Start/End usage:  
• Only `start` ⇒ older than `start`.  
• Only `end`   ⇒ `end` and newer.  
• Both         ⇒ between `start` and `end` (inclusive on `end`).  
Iterate with updated `start`/`end` to page more than the 100/25-message limits.

### Examples

Reference (multiple channels, last 25 messages):

```
require 'pubnub'  
  
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
        end  
      end  
    end  
  end  
end  
```

With metadata:

```
pubnub.fetch_messages(  
    channels: ['channel1', 'channel2'],  
    include_meta: true  
) do |envelope|  
    puts envelope.result[:data][:channels]  
end  
```

With message actions:

```
pubnub.fetch_messages(  
    channel: 'channel1',  
    include_message_actions: true  
) do |envelope|  
    puts envelope.result[:data][:channels]  
end  
```

Sample response:

```
    @result = {  
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
    @status = { … }  
```

---

## History (`history`)

Retrieve up to 100 messages for a channel.

### Method

```
history(  
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
```

### Parameters

* channels (String/Symbol) – Target channel.
* count (Integer, default/max 100)
* start (Integer) – Exclusive start timetoken.
* end (Integer) – Inclusive end timetoken.
* reverse (Boolean, default false) – If both `start` & `end` supplied, ignored.
* include_token (Boolean, default false) – Include per-message timetoken.
* include_meta (Boolean, default false)
* http_sync (Boolean, default false)
* callback (Proc)

Reverse & paging notes:  
Messages are returned oldest→newest; `reverse` only changes which end of the interval is returned first when more than `count` messages exist.

### Examples

Latest 100 messages:

```
pubnub.history(  
    channel: 'history_channel',  
    count: 100  
) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
```

Oldest three:

```
pubnub.history(  
    channel: :history,  
    count: 3,  
    reverse: true,  
    http_sync: true  
)  
```

After specific timetoken:

```
pubnub.history(  
    channel: :history,  
    start: 15010808287700000,  
    reverse: true,  
    http_sync: true  
)  
```

Until specific timetoken:

```
pubnub.history(  
    channel: :history,  
    end: 15010808287700000,  
    http_sync: true  
)  
```

Paged helper:

```
pubnub.paged_history(channel: :messages, limit: 10, page: 20) do |envelope|  
    puts envelope.result[:data][:messages]  
end  
```

Include timetoken:

```
# ASYNC  
future_envelope = pubnub.history(channel: :demo, include_token: true)  
future_envelope.value.result[:data][:messages].first['timetoken']  
  
# SYNC  
envelope = pubnub.history(channel: :demo, include_token: true, http_sync: true)  
envelope.result[:data][:messages].first['timetoken']  
# Example response in result[:data][:messages]  
# [ {"message"=>"Whatever", "timetoken"=>14865606002747651}, … ]  
```

Sample response:

```
#  
    @result = {  
        :data => {  
            :messages => ["Pub1", …, "Pub10"],  
            :end => 15010808292416521,  
            :start => 15010808287349573  
        }  
    },  
    @status = { :code => 200 }  
>  
```

---

## Delete Messages (`delete_messages`)

Remove messages from channel history.

• Requires **“Enable Delete-From-History”** in the Admin Portal and SDK initialization with the **secret key**.

### Method

```
delete_messages(  
    channels: channels,  
    start: start,  
    end: end,  
    http_sync: http_sync,  
    callback: callback  
)  
```

### Parameters

* channels (String/Symbol) – Target channel(s).  
* start (Integer/String) – From timetoken.  
* end (Integer/String) – To timetoken.  
* http_sync (Boolean, default false)  
* callback (Proc)

### Examples

Delete range:

```
pubnub.delete_messages(channel: 'my-channel', start: 1508284800, end: 1508935781, callback: check_response_status)  
```

Delete one message (publish timetoken = 15526611838554310):

```
pubnub.delete_messages(channel: 'my-channel',
                       start: 15526611838554309,
                       end:   15526611838554310,
                       callback: check_response_status)  
```

Response:

```
#  
    @status = {  
        :code => 200,  
        :operation => :delete,  
        :category => :ack,  
        :error => false,  
        …  
    }  
>  
```

---

## Message Counts (`message_counts`)

Return the number of messages published on channels since given timetoken(s).  
For unlimited retention keys only messages from the last 30 days are counted.

### Method

```
pubnub.message_counts(  
    channels: array_of_channels,  
    channel_timetokens: array_of_timetokens  
)  
```

### Parameters

* channels (Array<String>|String) – One or more channels.
* channel_timetokens (Array<Integer>|Integer) –  
  • Single timetoken ⇒ applied to all channels.  
  • Array must match `channels` length.
* http_sync (Boolean, default false)

### Examples

Same timetoken for all:

```
envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'],
                                 channel_timetokens: 12123).value  
p envelope.result[:data]  
```

Different timetokens per channel:

```
envelope = pubnub.message_counts(channel:['a', 'b', 'c', 'd'],
    channel_timetokens: [123135129, 123135124, 12312312, 123135125]).value  
p envelope.result[:data]  
```

Sample response:

```
#  
    @result=  
      {  
       :data=>{ "channels"=>{"a"=>2, "c"=>0, "b"=>0, "d"=>0} }  
      }  
    @status={ :code=>200 }  
>  
```

---

_Last updated: Jul 15, 2025_