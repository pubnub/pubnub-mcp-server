# Publish/Subscribe API – Ruby SDK (Condensed)

Below is an abridged version of the PubNub Publish/Subscribe documentation.  
All code blocks, method signatures, parameters, and server-response examples are preserved verbatim.

---

## Publish

Essential facts
* `publish_key` required at initialization; subscription to the same channel not required.
* One channel per call; max payload 32 KiB (optimum < 1800 bytes).
* Supports SSL/TLS (`ssl: true`) and optional message encryption.
* Message is any JSON-serializable object. **Do NOT pre-serialize `message` or `meta`.**
* Soft in-memory queue limit: 100 messages per subscriber.
* Optional `custom_message_type` (3–50 characters; no `pn_` / `pn-` prefix).

### Method

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

### Sample code

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
  pubnub = PubNub.new(  
`
```
(show all 28 lines)

#### REST response

```
`[1, "Sent", "13769558699541401"]  
`
```

### Other publish examples

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

```
`pubnub.publish(message: 'Not gonna store that', store: false)  
`
```

---

## Fire

Sends data only to Functions Event Handlers/Illuminate.  
No replication, storage, or delivery to channel subscribers.

### Method

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

### Example

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

---

## Signal

Lightweight (< 64 bytes payload) real-time signalling to current subscribers.

### Method

```
`pubnub.signal(  
    message: Object,  
    channel: String,  
    compressed: Boolean,  
    custom_message_type: String  
)  
`
```

### Example

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

#### REST response

```
`[1, "Sent", "13769558699541401"]  
`
```

---

## Subscribe

Creates a socket to receive messages, signals, and presence events.

Key points
* Requires `subscribe_key`.
* `restore: true` will attempt reconnection and catch-up.
* Wildcard channels and Channel Groups require Stream Controller add-on.
* Presence events require Presence add-on.
* Use `envelope.status` to confirm connectivity before publishing.

### Method

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

### Basic example

```
`# Subscribe to channel 'my_channel'.  
pubnub.subscribe(  
    channels: :my_channel  
)  
`
```

#### REST response

```
`[[], "Time Token"]  
`
```

### Multiplex / Presence / Wildcard examples

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

```
`# Subscribes to room0, room0-pnpres, room1, room1-pnpres, room2, room2-pnpres  
pubnub.subscribe(  
    channels: ['room0', 'room1', 'room2'],  
    with_presence: true  
)  
`
```

##### Presence event samples

```
`{  
    "action": "join",  
    "timestamp": 1345546797,  
    "uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy": 2  
}  
`
```
```
`{  
    "action" : "leave",  
    "timestamp" : 1345549797,  
    "uuid" : "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy" : 1  
}  
`
```
```
`{  
    "action": "timeout",  
    "timestamp": 1345549797,  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "occupancy": 0  
}  
`
```
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
```
`{  
    "action":"interval",  
    "timestamp":1474396578,  
    "occupancy":2  
}  
`
```
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
```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "here_now_refresh" : true  
}  
`
```

##### Wildcard subscribe

```
`# Subscribe to wildcard channel 'ruby.*' (make sure you have wildcard subscribe enabled in your pubnub admin console!)  
# specify two different callbacks for messages from channels and presence events in channels.  
pubnub.subscribe(  
    channels: 'ruby.*'  
)  
`
```

##### Subscribe with state (Presence required)

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
(show all 32 lines)

##### Channel group subscribe

```
`# Subscribe to group  
pubnub.subscribe(  
    channel_groups: 'ruby_group'  
)  
`
```

##### Presence on a channel group

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
(show all 18 lines)

##### Subscribe sync loop

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

---

## Unsubscribe

Removes specified channels/groups; closes socket when none remain.  
Unsubscribing from *all* channels resets last `timetoken` (possible message gaps).

### Method

```
`unsubscribe(  
    channels: channels,  
    channel_groups: group,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

### Example

```
`pubnub.unsubscribe(  
    channel: 'my_channel'  
) do |envelope|  
    puts envelope.status  
end  
`
```

#### Response

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

### Multiple channel/group examples

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

```
`{  
    "action" : "leave"  
}  
`
```

```
`pubnub.leave(channel_group: "cg1") do |envelope|  
    puts envelope.status  
end  
`
```

```
`pubnub.leave(group: ["cg1", "cg2"]) do |envelope|**    puts envelope  
end  
`
```

_Last updated: Jul 15 2025_