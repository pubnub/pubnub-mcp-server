# Presence API for Ruby SDK

Presence tracks who is online, channel occupancy, subscriptions, and per-user presence state. See Presence overview for concepts and events.

All methods require the Presence add-on to be enabled for your key in the Admin Portal.

## Here now

Returns the current state of a channel: list of UUIDs subscribed and total occupancy.

Cache: 3-second response cache time.

### Method(s)

```
`1here_now(  
2    channels: channels,  
3    channel_groups: channel_groups,  
4    limit: limit,  
5    offset: offset,  
6    http_sync: http_sync,  
7    callback: callback  
8)  
`
```

Parameters:
- channels (String, Symbol) — Channel(s) to return occupancy for. If omitted, returns global here_now across all channels.
- channel_groups (String, Symbol) — Channel group(s) to return occupancy for. Wildcards not supported.
- limit (Integer, default 1000) — Max occupants per channel. Range 0–1000. Use 0 for counts only (no UUID details).
- offset (Integer, default 0) — Zero-based starting index for pagination. Must be >= 0, requires limit > 0. Included only when offset > 0.
- http_sync (Boolean, default false) — Async returns a future; call value to get Envelope. If true, returns array of Envelope(s); sync methods return Envelope.
- callback (Lambda) — Called for each Envelope. For async, call value on future to get Envelope (blocks until available).

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

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

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
- uuid (String) — Target UUID.
- http_sync (Boolean, default false) — Async returns a future; call value to get Envelope. If true, returns array of Envelope(s); sync methods return Envelope.
- callback (Lambda) — Called for each Envelope. For async, call value on future to get Envelope.

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

Set or get dynamic custom presence state (for example, score or location) per channel while subscribed. State is not persisted and is lost on disconnect.

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
- channels (String, Symbol) — Channel(s) to set state for.
- state (Hash) — State key-values to set.
- http_sync (Boolean, default false) — Async returns a future; call value to get Envelope. If true, returns array of Envelope(s); sync methods return Envelope.
- callback (Lambda) — Called for each Envelope. For async, call value on future to get Envelope.

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
- channels (String, Symbol) — Channel(s) to get state from.
- uuid (String) — UUID to retrieve state for.
- http_sync (Boolean, default false) — Async returns a future; call value to get Envelope. If true, returns array of Envelope(s); sync methods return Envelope.
- callback (Lambda) — Called for each Envelope. For async, call value on future to get Envelope.

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