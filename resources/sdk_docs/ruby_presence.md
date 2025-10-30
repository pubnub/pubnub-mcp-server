# Presence API for Ruby SDK

Presence tracks online/offline status and custom state. It provides:
- Join/leave events per channel
- Occupancy (user count) per channel
- Channels a UUID is subscribed to
- Presence state associated with users

Learn more: Presence overview.

## Here now

Requires Presence: Enable the Presence add-on in the Admin Portal. See Presence Events to receive events.

Returns the current state of a channel: list of UUIDs subscribed and total occupancy.

Cache: 3-second response cache.

### Method(s)

```
`1here_now(  
2    channels: channels,  
3    channel_groups: channel_groups,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters:
- channels (String, Symbol): Channel(s) to return occupancy for. If omitted, returns global here_now for all channels.
- channel_groups (String, Symbol): Channel group(s) to return occupancy for. Wildcards not supported.
- http_sync (Boolean): Default false. Async returns a future; call value to get Envelope. If true, returns array of envelopes (even if only one). For sync methods, an Envelope object is returned.
- callback (Lambda with one parameter): Called for each envelope. For async methods, a future is returned; call value to retrieve the Envelope (blocks thread).

### Sample code

#### Get a list of uuids subscribed to channel

Reference code

```
1require 'pubnub'  
2
  
3def fetch_uuids(pubnub)  
4  pubnub.here_now(  
5    channel: 'my_channel'  
6  ) do |envelope|  
7    if envelope.status[:error]  
8      puts "Error fetching UUIDs: #{envelope.status[:error]}"  
9    else  
10      puts "UUIDs subscribed to my_channel: #{envelope.result[:data][:uuids]}"  
11      puts "Occupancy: #{envelope.result[:data][:occupancy]}"  
12    end  
13  end  
14end  
15
  
16def main  
17  # Configuration for PubNub instance  
18  pubnub = Pubnub.new(  
19    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
20    user_id: 'myUniqueUserId'  
21  )  
22
  
23  # Fetch UUIDs  
24  fetch_uuids(pubnub)  
25  sleep 1 # Allow time for the async operation to complete  
26end  
27
  
28if __FILE__ == $0  
29  main  
30end  
```

### Response

```
`1#  
2    @result = {  
3        :data => {  
4            :uuids => ["2d588b75-0451-4bde-8952-13128c10e952"],  
5            :occupancy => 1  
6        }  
7    },  
8    @status = {  
9        :code => 200  
10    }  
11>  
`
```

## Where now

Requires Presence: Enable the Presence add-on in the Admin Portal. See Presence Events to receive events.

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1where_now(  
2    uuid: uuid,  
3    http_sync: http_sync,  
4    callback: callback  
5)  
`
```

Parameters:
- uuid (String): UUID to look up.
- http_sync (Boolean): Default false. Async returns a future; call value to get Envelope. If true, returns array of envelopes (even if only one). For sync methods, an Envelope object is returned.
- callback (Lambda with one parameter): Called for each envelope. For async methods, a future is returned; call value to retrieve the Envelope (blocks thread).

### Sample code

```
`1pubnub.where_now(  
2    uuid: "my_uuid"  
3) do |envelope|  
4    puts envelope.result[:data]  
5end  
`
```

### Response

```
`1#  
2    @result = {  
3        :data => {  
4        "channels" => ["whatever"]  
5        }  
6    },  
7    @status = {  
8        :code =>200  
9    }  
10>  
`
```

## User state

Requires Presence: Enable the Presence add-on in the Admin Portal. See Presence Events to receive events.

Clients can set dynamic custom state (for example: score, game state, location) per channel while subscribed. State is not persisted; it is lost when the client disconnects. See Presence State.

### Method(s)

```
`1set_state(  
2    channels: channels,  
3    state: state,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters:
- channels (String, Symbol): Channels to set state for.
- state (Hash): State payload to set.
- http_sync (Boolean): Default false. Async returns a future; call value to get Envelope. If true, returns array of envelopes (even if only one). For sync methods, an Envelope object is returned.
- callback (Lambda with one parameter): Called for each envelope. For async methods, a future is returned; call value to retrieve the Envelope (blocks thread).

```
`1get_state(  
2    channels: channels,  
3    uuid: uuid,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters:
- channels (String, Symbol): Channels to get state from.
- uuid (String): Target UUID.
- http_sync (Boolean): Default false. Async returns a future; call value to get Envelope. If true, returns array of envelopes (even if only one). For sync methods, an Envelope object is returned.
- callback (Lambda with one parameter): Called for each envelope. For async methods, a future is returned; call value to retrieve the Envelope (blocks thread).

### Sample code

#### Set state

```
`1pubnub.set_state(channel: 'my_channel', state: { key: 'value' }) do |envelope|  
2    puts envelope.status  
3end  
`
```

#### Get state

```
`1pubnub.state(channel: :my_channel, uuid: 'some-uuid') do |envelope|  
2    puts envelope.result[:data][:state]  
3end  
`
```

### Response

```
`1#**2    @result = {  
3        :data => {  
4            :state => {  
5                "age"=>59,  
6                "first" => "Robert",  
7                "last" => "Plant"  
8            },  
9            :channel=>"whatever"  
10        }  
11    },  
12    @status = {  
13        :code => 200  
14    }  
15>  
`
```