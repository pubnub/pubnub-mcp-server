# Presence API – Ruby SDK (condensed)

Presence lets you:
• See who is on a channel (Here Now).  
• See which channels a UUID is on (Where Now).  
• Store transient, per-channel key/value data (User State).

Presence add-on must be enabled for your keys.

---

## Here Now
Returns channel occupancy and UUID list (3-second cache).

### Method

```
`here_now(  
    channels: channels,  
    channel_groups: channel_groups,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

Parameters  
• channels (String | Symbol) – target channel(s); omit for global.  
• channel_groups (String | Symbol) – channel-group(s).  
• http_sync (Boolean, default false) – true → sync (Envelope / array of Envelopes); false → async (Future).  
• callback (Lambda<Envelope>) – invoked per Envelope when async.

### Example

```
`require 'pubnub'  
  
def fetch_uuids(pubnub)  
  pubnub.here_now(  
    channel: 'my_channel'  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "Error fetching UUIDs: #{envelope.status[:error]}"  
    else  
      puts "UUIDs subscribed to my_channel: #{envelope.result[:data][:uuids]}"  
      puts "Occupancy: #{envelope.result[:data][:occupancy]}"  
    end  
  end  
end  
  
`
```

### Response

```
`#  
    @result = {  
        :data => {  
            :uuids => ["2d588b75-0451-4bde-8952-13128c10e952"],  
            :occupancy => 1  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

---

## Where Now
Returns channels currently joined by a UUID (no timeout event if reconnects within heartbeat window).

### Method

```
`where_now(  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

Parameters  
• uuid (String) – UUID to inspect.  
• http_sync, callback – same semantics as Here Now.

### Example

```
`pubnub.where_now(  
    uuid: "my_uuid"  
) do |envelope|  
    puts envelope.result[:data]  
end  
`
```

### Response

```
`#  
    @result = {  
        :data => {  
        "channels" => ["whatever"]  
        }  
    },  
    @status = {  
        :code =>200  
    }  
>  
`
```

---

## User State
Transient per-channel key/value data (lost when client unsubscribes).

### set_state

```
`set_state(  
    channels: channels,  
    state: state,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

Parameters  
• channels (String | Symbol) – channel(s) to set.  
• state (Hash) – data to store.  
• http_sync, callback – as above.

### get_state

```
`get_state(  
    channels: channels,  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

Parameters  
• channels (String | Symbol) – channel(s).  
• uuid (String) – whose state to fetch.  
• http_sync, callback – as above.

### Examples

```
`pubnub.set_state(channel: 'my_channel', state: { key: 'value' }) do |envelope|  
    puts envelope.status  
end  
`
```

```
`pubnub.state(channel: :my_channel, uuid: 'some-uuid') do |envelope|  
    puts envelope.result[:data][:state]  
end  
`
```

### Response

```
`#**    @result = {  
        :data => {  
            :state => {  
                "age"=>59,  
                "first" => "Robert",  
                "last" => "Plant"  
            },  
            :channel=>"whatever"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

_Last updated Jul 15 2025_