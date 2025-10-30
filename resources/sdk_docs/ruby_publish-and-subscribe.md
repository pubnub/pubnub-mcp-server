# Publish/Subscribe API for Ruby SDK

Low-latency real-time messaging to channels and channel groups.

## Publish

`publish()` sends a JSON-serializable message to all subscribers of a channel.

- Prerequisites
  - Initialize with publish_key.
  - You can publish without being subscribed.
  - Cannot publish to multiple channels simultaneously.
- Security: Set ssl: true during initialization. Optional message encryption available.
- Message data: Any JSON-serializable data. Avoid special classes/functions.
- Don't JSON serialize: Pass full objects for message and meta; SDK serializes automatically.
- Size limit: Max 32 KiB including channel and escapes; target under 1,800 bytes. Oversize returns Message Too Large.
- Throughput: Publish as bandwidth allows; subscriber in-memory queue size ~100. Bursts can drop messages.
- custom_message_type: Optional business-specific label (3–50 chars, alphanumeric, dashes/underscores; cannot start with special chars or pn_/pn-).
- Best practices
  - Publish serially.
  - Verify success return code (for example, [1,"Sent","136074940..."]).
  - Publish next only after success; on failure ([0,"blah","<timetoken>"]) retry.
  - Keep queue under 100; throttle bursts (e.g., ≤5 msgs/s).

### Method(s)

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

- channel (String, required): Channel ID.
- message (Object, required): Ruby object with to_json.
- store (Boolean): Store for history. Default true.
- compressed (Boolean): Compress message. Default false.
- publish_key (String): Publish key override.
- http_sync (Boolean): Default false (async returns future; call value to get Envelope). If true, returns array of Envelopes.
- custom_message_type (String): Business-specific label (text, action, poll).
- meta (Object): JSON-serializable additional context.
- callback (Lambda): Invoked per envelope. For async, use future.value to get Envelope.

### Sample code

#### Publish a message to a channel

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

Before running the publish example, subscribe to the same channel (for example, using the Debug Console or a separate script).

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

Sends a message directly to Functions event handlers and Illuminate on the target channel. Not delivered to subscribers and not stored in history.

### Method(s)

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

- channel (String, required): Channel ID.
- message (Object, required): Ruby object with to_json.
- compressed (Boolean): Compress message. Default false.
- publish_key (String): Publish key override.
- http_sync (Boolean): Default false (async future.value to get Envelope). If true, returns array of Envelopes.
- callback (Lambda): Invoked per envelope.

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

`s

ignal()` sends a lightweight signal to all subscribers of a channel.

- Default payload size limit: 64 bytes (payload only). Contact support for larger limits.

### Method(s)

```
`1pubnub.signal(  
2    message: Object,  
3    channel: String,  
4    compressed: Boolean,  
5    custom_message_type: String  
6)  
`
```

- message (Object, required): Ruby object with to_json.
- channel (String, required): Channel ID.
- compressed (Boolean): Compress message. Default false.
- custom_message_type (String): Business-specific label (text, action, poll).

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

Add an event listener to receive messages, signals, and events for subscribed channels.

### Description

Creates an open TCP socket and begins listening for messages on specified channels. Requires subscribe_key during initialization. New subscribers receive messages published after subscribe completes.

- Connectivity: Check envelope.status to confirm subscribe before publishing to avoid race conditions.
- Reconnect: With restore: true, client attempts to reconnect and catch up missed messages after disconnect. Default reconnect after 320s timeout.
- Unsubscribing from all channels resets last timetoken and may cause message gaps.

### Method(s)

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

- channels (String|Symbol|Array): Channels to subscribe (supports arrays and wildcards).
- channel_groups (String|Symbol|Array): Channel groups to subscribe.
- presence (String|Symbol|Array): Presence channels to subscribe.
- presence_callback (Lambda): Callback per presence event from wildcard subscribe. Works only with http_sync: true.
- with_presence (Boolean): Also subscribes to presence channels for channels provided. See Presence Events.
- http_sync (Boolean): Default false (async future; call value). If true, returns array of Envelopes (one per message).
- callback (Lambda): Called for each retrieved message. Works only with http_sync: true.

##### Event listeners

Subscribe responses are handled by a Listener.

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

Supports multiplexing, wildcard subscribe, and channel groups (Stream Controller add-on required).

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

Requires Presence add-on. Presence channel is channel-name + "-pnpres".

```
`1# Subscribes to room0, room0-pnpres, room1, room1-pnpres, room2, room2-pnpres  
2pubnub.subscribe(  
3    channels: ['room0', 'room1', 'room2'],  
4    with_presence: true  
5)  
`
```

#### Sample Responses

##### Join event

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

When presence_deltas pnconfig flag is enabled, interval messages can include:
- joined
- left
- timedout

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

If the interval message would exceed ~32KB, extra fields are omitted and here_now_refresh: true is included:

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

Requires Stream Controller add-on (Enable Wildcard Subscribe). Only one level (a.*) supported.

```
`1# Subscribe to wildcard channel 'ruby.*' (make sure you have wildcard subscribe enabled in your pubnub admin console!)  
2# specify two different callbacks for messages from channels and presence events in channels.  
3pubnub.subscribe(  
4    channels: 'ruby.*'  
5)  
`
```

Wildcard grants/revokes only work one level deep (a.*).

#### Subscribing with state

Requires Presence add-on.

Required User ID: Always set user_id to uniquely identify the user/device and persist it.

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

The loop exits when no subscribed channels remain.

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

Unsubscribe removes channels from the subscription; the socket closes when no channels remain.

- Unsubscribing from all channels then resubscribing resets the last timetoken and may lead to message gaps.

### Method(s)

```
`1unsubscribe(  
2    channels: channels,  
3    channel_groups: group,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

- channels (Symbol|String): Channels to unsubscribe (required if channel_groups not specified).
- channel_groups (Symbol|String): Channel groups to unsubscribe (required if channels not specified).
- http_sync (Boolean): Default false (async future; call value). If true, returns array of Envelopes.
- callback (Lambda): Invoked per envelope.

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