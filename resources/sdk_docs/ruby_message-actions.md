# Message Actions API – Ruby SDK

Message Actions (a.k.a. *Message Reactions* when used for emoji) let you attach metadata—receipts, emoji, etc.—to any published message.  
Message Persistence **must be enabled** on the key.

---

## Add Message Reaction

### Method
```ruby
`add_message_action(  
    channel: channel,  
    type: type,  
    value: value,  
    message_timetoken: message_timetoken,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters  
* `channel` (String) – target channel.  
* `type` (String, ≤ 15 chars) – action type.  
* `value` (String) – action value.  
* `message_timetoken` (Integer) – timetoken of the target message.  
* `http_sync` (Boolean, default: `false`) – run synchronously.  
* `callback` (Lambda) – executed per envelope (async returns `Future`).

### Example
```ruby
`require 'pubnub'  
  
def add_message_action(pubnub)  
  puts "Adding message action..."  
  pubnub.add_message_action(  
    channel: 'chat',  
    type: 'emotion',  
    value: 'smile',  
    message_timetoken: 16701562382648731  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "Error adding message action: #{envelope.status[:data]}"  
    else  
      puts "Message action added successfully:"  
      puts "Type: #{envelope.result[:data][:type]}"  
`  
```

### Response
```ruby
`#  
    @result = {  
        :data => {  
            :type => "emotion",  
            :value => "smile",  
            :uuid => "sender-uuid",  
            :action_timetoken => 16701656660127890,  
            :message_timetoken => 16701562382648731  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>`  
```

---

## Remove Message Reaction

### Method
```ruby
`remove_message_action(  
    channel: channel,  
    message_timetoken: message_timetoken,  
    action_timetoken: action_timetoken,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters  
* `channel` (String) – channel containing the message.  
* `message_timetoken` (Integer) – timetoken of the message.  
* `action_timetoken` (Integer) – timetoken of the action to remove.  
* `http_sync` (Boolean, default: `false`) – run synchronously.  
* `callback` (Lambda) – executed per envelope (async returns `Future`).

### Example
```ruby
`pubnub.add_message_action(  
    channel: 'chat',  
    message_timetoken: 16701562382648731,  
    action_timetoken: 16701656660127890  
) do |envelope|  
    puts envelope  
end  
`  
```

### Response
```ruby
`#  
    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>`  
```

---

## Get Message Reactions

### Method
```ruby
`get_message_actions(  
    channel: channel,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters  
* `channel` (String) – channel to query.  
* `start` (Integer) – return actions with timetoken < `start`.  
* `end` (Integer) – return actions with timetoken ≥ `end`.  
* `limit` (Integer) – max actions returned.  
* `http_sync` (Boolean, default: `false`) – run synchronously.  
* `callback` (Lambda) – executed per envelope (async returns `Future`).

### Example
```ruby
`pubnub.get_message_actions(  
    channel: 'chat',  
    start: 16701562382648731,  
    end: 16701562382348728  
) do |envelope|  
    puts envelope  
end  
`  
```

### Response
```ruby
`#**    @result = {  
        :data => {  
            :message_actions => [  
                {  
                    :type => "emotion_type_2",  
                    :uuid => "sender-uuid-1",  
                    :value => "surprised",  
                    :message_timetoken => 16703307481706612,  
                    :action_timetoken => 16703307649086202,  
                },  
                {  
                    :type => "emotion_type_3",  
                    :uuid => "sender-uuid-2",  
                    :value => "lol",  
`  
```

_Last updated: Jul 15 2025_