# Presence API – Ruby SDK (Condensed)

Presence add-on must be enabled for your keys in the Admin Portal.

----------------------------------------------------------------------------------------------------
## Here Now

Tracks current occupancy (3 s cache).

### Method
```
`here_now(  
    channels: channels,  
    channel_groups: channel_groups,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters  
• channels (String|Symbol) – channel(s) to query; omit for global.  
• channel_groups (String|Symbol) – channel group(s) to query.  
• http_sync (Boolean, default false) – synchronous when true; otherwise returns a future (use `value`).  
• callback (Proc) – executed per Envelope (async).

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

### Sample Response
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

----------------------------------------------------------------------------------------------------
## Where Now

Returns channels to which a UUID is currently subscribed (no timeout event if client reconnects within heartbeat window).

### Method
```
`where_now(  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters  
• uuid (String) – target UUID.  
• http_sync, callback – same behavior as in Here Now.

### Example
```
`pubnub.where_now(  
    uuid: "my_uuid"  
) do |envelope|  
    puts envelope.result[:data]  
end  
`  
```

### Sample Response
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

----------------------------------------------------------------------------------------------------
## User State

Dynamic, non-persistent key/value data for a UUID on specific channels.

### Methods
```
`set_state(  
    channels: channels,  
    state: state,  
    http_sync: http_sync,  
    callback: callback  
)`  
```
```
`get_state(  
    channels: channels,  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)`  
```

Parameters (both methods)  
• channels (String|Symbol) – channel(s).  
• http_sync (Boolean, default false) – synchronous when true.  
• callback (Proc) – executed per Envelope.  
Additional  
• set_state: state (Hash) – data to set.  
• get_state: uuid (String) – UUID whose state is requested.

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

### Sample Response
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

_Last updated: Jun 16 2025_