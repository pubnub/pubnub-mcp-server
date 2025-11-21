# Publish/Subscribe API for Ruby SDK

Low-latency real-time messaging to one or many subscribers.

For conceptual guidance, see Connection Management and Publish Messages.

## Publish

publish() sends a JSON-serializable message to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize the client with publishKey.
  - You don't need to be subscribed to publish.
  - You can't publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl: true during initialization. Optional message encryption is available.
- Message data
  - Send JSON-serializable data (objects, arrays, integers, strings).
  - Don't JSON serialize message or meta; PubNub serializes them automatically.
- Size
  - Max 32 KiB per message (including escaped characters and channel name). Aim for < 1,800 bytes. Errors return Message Too Large.
- Publish rate
  - Soft throughput limits; in-memory queue stores only 100 messages. Bursts can cause drops if subscribers can't keep up.
- Custom message type
  - Optionally set custom_message_type to label messages (for example text, action, poll).
- Best practices
  - Publish serially; verify success ([1,"Sent","..."]); publish next only after success; retry on failure ([0,"...","..."]); keep queue < 100; throttle as needed (for example ≤5 msg/s).

### Method(s)

To Publish a message:

```
`1publish(  
2    channel: String,  
3    message: Object,  
4    store: Boolean,  
5    compressed: Boolean,  
6    publish_key: String,  
7    http_sync: Boolean,  
8    custom_message_type: String,  
9    meta: Object,  
10    callback: Lambda  
11)  
`
```

Parameters
- channel (String) — Channel ID to publish to.
- message (Object) — Serializable object (defines #to_json).
- store (Boolean) — Store in history. Default true.
- compressed (Boolean) — Compress the message. Default false.
- publish_key (String) — Publish key to use.
- http_sync (Boolean) — Default false. Async returns a future (call value). If true, returns array of Envelope(s). Sync methods return Envelope.
- custom_message_type (String) — Case-sensitive, 3–50 alphanumeric chars; dashes - and underscores _ allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- meta (Object) — JSON-serializable context object for the message.
- callback (Lambda) — Called for each envelope. For async, use future.value to retrieve Envelope.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1require 'pubnub'  
2
  
3def publish_message(pubnub)  
4  pubnub.publish(  
5    channel: 'my_channel',  
6    message: { text: 'Hi!' },  
7    custom_message_type: 'text-message'  
8  ) do |envelope|  
9    puts "Publish status: #{envelope.status[:code]}"  
10  end  
11end  
12
  
13def main  
14  # Configuration for PubNub instance  
15  pubnub = Pubnub.new(  
16    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
17    publish_key: ENV.fetch('PUBLISH_KEY', 'demo'),  
18    user_id: 'myUniqueUserId'  
19  )  
20
  
21  # Publish a message  
22  publish_message(pubnub)  
23  sleep 1 # Allow time for the async operation to complete  
24end  
25
  
26if __FILE__ == $0  
27  main  
28end  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel.

### Rest response from server

```
`1[1, "Sent", "13769558699541401"]  
`
```

### Other examples

#### Publish a JSON serialized message

```
`1pubnub.publish(  
2    message: {  
3        key: {  
4            inner_key: :value  
5        }  
6    },  
7    custom_message_type: 'text-message',  
8    channel: :whatever,  
9    meta: {  
10        sender_uuid: 'user123-uuid',  
11        priority: 'high',  
12        location: 'office'  
13    }  
14)  
`
```

#### Skip message from storage

```
`1pubnub.publish(message: 'Not gonna store that', store: false)  
`
```

## Fire

Sends a message to Functions event handlers and Illuminate on a channel. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message:

```
`1fire(  
2    channel: channel,  
3    message: message,  
4    compressed: compressed,  
5    publish_key: publish_key,  
6    http_sync: http_sync,  
7    callback: callback  
8)  
`
```

Parameters
- channel (String) — Channel ID.
- message (Object) — Serializable object (defines #to_json).
- compressed (Boolean) — Compress the message. Default false.
- publish_key (String) — Publish key to use.
- http_sync (Boolean) — Default false. Async returns future (call value). If true, returns array of Envelope(s). Sync methods return Envelope.
- callback (Lambda) — Called for each envelope. For async, call future.value to get Envelope.

### Sample code

#### Fire a message to a channel

```
`1pubnub.fire(  
2    channel: 'my_channel',  
3    message: {  
4        text: 'Hi!'  
5    }  
6) do |envelope|  
7    puts envelope.status  
8end  
`
```

## Signal

signal() sends a small payload to all subscribers.

- Payload limit: 64 bytes (payload only). Contact support to request higher limits.

### Method(s)

To Signal a message:

```
`1pubnub.signal(  
2    message: Object,  
3    channel: String,  
4    compressed: Boolean,  
5    custom_message_type: String  
6)  
`
```

Parameters
- message (Object) — Serializable object (defines #to_json).
- channel (String) — Channel ID to send to.
- compressed (Boolean) — Compress the signal. Default false.
- custom_message_type (String) — Case-sensitive, 3–50 alphanumeric chars; - and _ allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

#### Signal a message to a channel

```
`1pubnub.signal(  
2    channel: 'foo',  
3    message: {  
4        msg: 'Hello Signals'  
5    },  
6    custom_message_type: 'text-message'  
7);  
`
```

### Rest response from server

```
`1[1, "Sent", "13769558699541401"]  
`
```

## Subscribe

### Receive messages

Receive messages, signals, and events via event listeners. See Event Listeners.

### Description

Creates a TCP socket to PubNub and listens for messages on specified channels. subscribe_key is required. By default, only messages published after subscribe completes are received.

- Connectivity notification: Check envelope.status to know when subscribe is active to avoid race conditions when publishing immediately after subscribing.
- Reconnect and catch-up: Set restore: true to attempt reconnection and retrieve missed messages. Default reconnect after a 320-second timeout.
- Unsubscribing from all channels resets the last-received timetoken and may cause message gaps.

### Method(s)

To Subscribe to a channel:

```
`1subscribe(  
2    channels: channels,  
3    channel_groups: group,  
4    presence: presence,  
5    presence_callback: presence_callback,  
6    with_presence: with_presence,  
7    http_sync: http_sync,  
8    callback: callback  
9)  
`
```

Parameters
- channels (String|Symbol|Array) — One or more channels to subscribe to. Supports wildcards.
- channel_groups (String|Symbol|Array) — One or more channel groups to subscribe to.
- presence (String|Symbol|Array) — One or more channels to presence-subscribe to.
- presence_callback (Lambda) — Called for each presence event from wildcard subscribe. Works only with http_sync: true.
- with_presence (Boolean) — Also subscribe to the presence channels of provided channels. See Presence Events.
- http_sync (Boolean) — Default false. Async returns future (call value). If true, returns array of Envelope(s) (one per message).
- callback (Lambda) — Called for each retrieved message. Works only with http_sync: true.

##### Event listeners

Subscription responses are handled by a Listener. See Listeners section.

### Sample code

Subscribe to a channel:

```
`1# Subscribe to channel 'my_channel'.  
2pubnub.subscribe(  
3    channels: :my_channel  
4)  
`
```

### Rest response from server

```
`1[[], "Time Token"]  
`
```

### Other examples

#### Subscribing to multiple channels

Use channel multiplexing or Stream Controller features (Wildcard Subscribe, Channel Groups) to subscribe to multiple channels.

```
`1# Subscribe to channels (with presence) and groups  
2pubnub.subscribe(  
3    channels: ['debug', 'info', 'warn'],  
4    channel_groups: ['ruby_group', 'jruby_group', 'rbx_group'],  
5    presence: ['debug', 'info', 'warn']  
6)  
7# You will be subscribed to channels: debug, info, warn, debug-pnpres, info-pnpres and warn-pnpres  
8# and to groups: ruby_group, jruby_group, rbx_group.  
`
```

#### Subscribing to a Presence channel

Requires Presence.

For any channel, append -pnpres to subscribe to its presence channel.

```
`1# Subscribes to room0, room0-pnpres, room1, room1-pnpres, room2, room2-pnpres  
2pubnub.subscribe(  
3    channels: ['room0', 'room1', 'room2'],  
4    with_presence: true  
5)  
`
```

#### Sample Responses

#### Join event

```
`1{  
2    "action": "join",  
3    "timestamp": 1345546797,  
4    "uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
5    "occupancy": 2  
6}  
`
```

##### Leave event

```
`1{  
2    "action" : "leave",  
3    "timestamp" : 1345549797,  
4    "uuid" : "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
5    "occupancy" : 1  
6}  
`
```

##### Timeout event

```
`1{  
2    "action": "timeout",  
3    "timestamp": 1345549797,  
4    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
5    "occupancy": 0  
6}  
`
```

##### State change event

```
`1{  
2    "action": "state-change",  
3    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
4    "timestamp": 1345549797,  
5    "data": {  
6        "isTyping": true  
7    }  
8}  
`
```

##### Interval event

```
`1{  
2    "action":"interval",  
3    "timestamp":1474396578,  
4    "occupancy":2  
5}  
`
```

When presence_deltas pnconfig is enabled, interval messages may include:
- joined
- left
- timedout

Example:

```
`1{  
2    "action" : "interval",  
3    "occupancy" : ,  
4    "timestamp" : ,  
5    "joined" : ["uuid2", "uuid3"],  
6    "timedout" : ["uuid1"]  
7}  
`
```

If the interval message exceeds ~30 KB, extra fields are omitted and here_now_refresh: true is included. Perform a hereNow request to fetch occupants.

```
`1{  
2    "action" : "interval",  
3    "occupancy" : ,  
4    "timestamp" : ,  
5    "here_now_refresh" : true  
6}  
`
```

#### Wildcard subscribe to channels

Requires Stream Controller add-on (Enable Wildcard Subscribe).

```
`1# Subscribe to wildcard channel 'ruby.*' (make sure you have wildcard subscribe enabled in your pubnub admin console!)  
2# specify two different callbacks for messages from channels and presence events in channels.  
3pubnub.subscribe(  
4    channels: 'ruby.*'  
5)  
`
```

Wildcard grants and revokes: Only one level (a.*) is supported.

#### Subscribing with state

Requires Presence.

Required User ID: Always set user_id to uniquely identify the device/user and persist it.

```
1require 'pubnub'  
2
  
3PUBKEY = 'demo'  
4SUBKEY = 'demo'  
5
  
6pubnub = Pubnub.new(  
7    subscribe_key: SUBKEY,  
8    publish_key: PUBKEY,  
9    ssl: true  
10)  
11
  
12callback = Pubnub::SubscribeCallback.new(  
13    message: ->(envelope) {  
14        puts "MESSAGE: #{envelope.result[:data]}"  
15    },  
16    presence: ->(envelope) {  
17        puts "PRESENCE: #{envelope.result[:data]}"  
18    }  
19)  
20
  
21pubnub.add_listener(callback: callback)  
22subs = pubnub.subscribe(channels: 'public', with_presence: true)  
23
  
24subs.add_observer do  
25    pubnub.set_state(channels: 'public', state: {key: 'val'}) do |env|  
26        if env.error?  
27            # handle error  
28        else  
29            # success  
30        end  
31    end  
32end  

```

#### Subscribe to a channel group

Requires Stream Controller add-on.

```
`1# Subscribe to group  
2pubnub.subscribe(  
3    channel_groups: 'ruby_group'  
4)  
`
```

#### Subscribe to the Presence channel of a channel group

Requires Stream Controller and Presence add-ons.

```
1pubnub = Pubnub.new(  
2    subscribe_key: :demo,  
3    publish_key: :demo  
4)  
5
  
6callback = Pubnub::SubscribeCallback.new(  
7    message:  ->(_envelope) {  
8    },  
9    presence: ->(envelope) {  
10        puts "PRESENCE: #{envelope.result[:data]}"  
11    },  
12    status:   ->(_envelope) {  
13    }  
14)  
15
  
16pubnub.add_listener(callback: callback)  
17
  
18pubnub.presence(channel_groups: 'family')  

```

##### Subscribe sync

Loop exits when there are no subscribed channels.

```
1require 'pubnub'  
2pubnub = Pubnub.new(  
3    subscribe_key: :demo,  
4    publish_key: :demo  
5)  
6
  
7pubnub.subscribe(channels: :whatever)  
8while pubnub.subscribed_channels.size > 0 do  
9    sleep 1  
10end  

```

## Unsubscribe

Leave a channel (or remove some from a multiplexed connection). Socket closes when no channels remain.

Unsubscribing from all channels resets the last-received timetoken and may cause message gaps if you then subscribe to new channels.

### Method(s)

To Unsubscribe from a channel:

```
`1unsubscribe(  
2    channels: channels,  
3    channel_groups: group,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters
- channels (Symbol|String) — Channels to unsubscribe from. Required if channel_groups not specified.
- channel_groups (Symbol|String) — Channel groups to unsubscribe from. Required if channels not specified.
- http_sync (Boolean) — Default false. Async returns future (call value). If true, returns array of Envelope(s). Sync methods return Envelope.
- callback (Lambda) — Called for each envelope. For async, call future.value to get Envelope.

### Sample code

Unsubscribe from a channel:

```
`1pubnub.unsubscribe(  
2    channel: 'my_channel'  
3) do |envelope|  
4    puts envelope.status  
5end  
`
```

### Response

```
`1#  
2    @status = {  
3        :code => 200,  
4        :operation => :leave,  
5        :category => :ack,  
6        :error => false,  
7        # [...]  
8    },  
9    # [...]  
10>  
`
```

### Other examples

#### Unsubscribing from multiple channels

Requires Stream Controller add-on.

```
`1pubnub.unsubscribe(  
2    channel: ['chan1','chan2','chan3']  
3) do |envelope|  
4    puts envelope.status  
5end  
`
```

```
`1pubnub.unsubscribe(  
2    channel: ['chan1','chan2','chan3']  
3) do |envelope|  
4    puts envelope.result[:data][:messages]  
5end  
`
```

##### Example response

```
`1{  
2    "action" : "leave"  
3}  
`
```

#### Unsubscribing from a channel group

```
`1pubnub.leave(channel_group: "cg1") do |envelope|  
2    puts envelope.status  
3end  
`
```

#### Unsubscribing from multiple channel groups

Requires Stream Controller add-on.

```
`1pubnub.leave(group: ["cg1", "cg2"]) do |envelope|**2    puts envelope  
3end  
`
```