# Publish/Subscribe – Ruby SDK (condensed)

Below are the essential APIs, parameters, constraints, and examples exactly as used in the PubNub Ruby SDK.  
All code blocks appear unmodified.

---

## Publish

Essentials  
* Requires `publish_key` during initialization; subscriber status not required to publish.  
* One channel per call; max payload 32 KiB (optimum < 1800 B).  
* No manual JSON serialization for `message` / `meta`.  
* Optional TLS: set `ssl: true`; optional encryption via Crypto module.  
* Optional `custom_message_type` (3–50 chars, not starting with `pn_`/`pn-`).  
* In-memory subscriber queue: 100 messages → throttle bursts (≈ ≤ 5 msg/s).  
* Check `[1,"Sent", ...]` success response before sending next message; retry on failure.

#### Method
```
`publish(  
    channel: String,  
    message: Object,  
    store: Boolean,           # default true  
    compressed: Boolean,      # default false  
    publish_key: String,  
    http_sync: Boolean,       # default false  
    custom_message_type: String,  
    meta: Object,  
    callback: Lambda  
)  
`
```

#### Examples
##### Basic
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

##### JSON payload
```
`pubnub.publish(  
    message: {  
        key: { inner_key: :value }  
    },  
    custom_message_type: 'text-message',  
    channel: :whatever,  
    meta: { sender_uuid: 'user123-uuid', priority: 'high', location: 'office' }  
)  
`
```

##### Skip storage
```
`pubnub.publish(message: 'Not gonna store that', store: false)  
`
```

##### Server response
```
`[1, "Sent", "13769558699541401"]  
`
```

---

## Fire

* Executes Functions/Event Handlers only.  
* Message isn’t replicated, stored, or delivered to channel subscribers.

#### Method
```
`fire(  
    channel: channel,  
    message: message,  
    compressed: compressed,     # default false  
    publish_key: publish_key,  
    http_sync: http_sync,       # default false  
    callback: callback  
)  
`
```

#### Example
```
`pubnub.fire(  
    channel: 'my_channel',  
    message: { text: 'Hi!' }  
) do |envelope|  
    puts envelope.status  
end  
`
```

---

## Signal

* Lightweight message to all subscribers.  
* Payload limit: 64 bytes (contact support to raise).  

#### Method
```
`pubnub.signal(  
    message: Object,  
    channel: String,  
    compressed: Boolean,        # default false  
    custom_message_type: String  
)  
`
```

#### Example
```
`pubnub.signal(  
    channel: 'foo',  
    message: { msg: 'Hello Signals' },  
    custom_message_type: 'text-message'  
);  
`
```

##### Server response
```
`[1, "Sent", "13769558699541401"]  
`
```

---

## Subscribe

Key facts  
* Opens a socket and streams messages/events; requires `subscribe_key`.  
* Use `restore: true` to auto-reconnect and fetch missed messages (default timeout 320 s).  
* Event delivery via listener callbacks.  
* Wildcards/channel groups need Stream Controller add-on.  
* Presence events require Presence add-on.  
* Unsubscribing from *all* channels resets last timetoken (possible gaps).

#### Method
```
`subscribe(  
    channels: channels,  
    channel_groups: group,  
    presence: presence,  
    presence_callback: presence_callback,  
    with_presence: with_presence,  
    http_sync: http_sync,        # default false  
    callback: callback  
)  
`
```

#### Basic example
```
`# Subscribe to channel 'my_channel'.  
pubnub.subscribe(  
    channels: :my_channel  
)  
`
```

##### Response
```
`[[], "Time Token"]  
`
```

#### Multiple channels / groups / presence
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

#### Presence, wildcard, state & other reference snippets
All original samples are retained below for quick copy-paste:

```
`# Subscribes to room0, room0-pnpres, room1, room1-pnpres, room2, room2-pnpres  
pubnub.subscribe(  
    channels: ['room0', 'room1', 'room2'],  
    with_presence: true  
)  
`
```

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
    "data": { "isTyping": true }  
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
```
`# Subscribe to wildcard channel 'ruby.*' (make sure you have wildcard subscribe enabled in your pubnub admin console!)  
# specify two different callbacks for messages from channels and presence events in channels.  
pubnub.subscribe(  
    channels: 'ruby.*'  
)  
`
```
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
    message: ->(envelope) { puts "MESSAGE: #{envelope.result[:data]}" },  
`
```
```
`# Subscribe to group  
pubnub.subscribe(  
    channel_groups: 'ruby_group'  
)  
`
```
```
`pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key: :demo  
)  
  
callback = Pubnub::SubscribeCallback.new(  
    message:  ->(_envelope) { },  
    presence: ->(envelope) { puts "PRESENCE: #{envelope.result[:data]}" },  
    status:   ->(_envelope) { }  
)  
  
`
```
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

* Removes specified channels/groups; socket closes when none remain.  
* Unsubscribing from *all* then subscribing resets timetoken (possible gaps).

#### Method
```
`unsubscribe(  
    channels: channels,  
    channel_groups: group,  
    http_sync: http_sync,        # default false  
    callback: callback  
)  
`
```

#### Basic example
```
`pubnub.unsubscribe(  
    channel: 'my_channel'  
) do |envelope|  
    puts envelope.status  
end  
`
```

##### Response
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

#### Multiple channels / groups
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

---

_Last updated Jun 16 2025_