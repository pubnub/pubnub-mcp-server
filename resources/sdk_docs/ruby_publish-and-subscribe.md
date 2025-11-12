# Publish/Subscribe API for Ruby SDK

Send messages to channel subscribers, listen for messages and presence events, and manage subscriptions.

For conceptual guidance, see Connection Management and Publish Messages.

## Publish

publish() sends a JSON-serializable message to all subscribers of a channel. Messages are replicated globally.

Key points:
- Initialize PubNub with publishKey.
- Not required to be subscribed to publish.
- Cannot publish to multiple channels simultaneously.
- Security: set ssl: true at initialization for TLS/SSL; optional message encryption.
- Message data: any JSON-serializable object; pass objects directly—do not pre‑serialize message or meta (serialization is automatic).
- Size: max 32 KiB (including escaped characters and channel name); aim < 1,800 bytes.
- Throughput: publish as fast as bandwidth allows; subscribers have an in‑memory queue of ~100 messages—throttle bursts to avoid drops.
- Optional custom_message_type: business-specific label (for example: text, action, poll). 3–50 chars; case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special characters or pn_/pn-.
- Best practices:
  - Publish serially, not concurrently.
  - Check success response (for example, [1,"Sent","136074940..."]) before sending next.
  - Retry on failure ([0,"blah","<timetoken>"]).
  - Keep in-memory queue under 100 messages; throttle, for example ≤5 msgs/sec.

### Method(s)

To Publish a message you can use the following method(s) in the Ruby SDK:

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

Parameters:
- channel (String, required): target channel.
- message (Object, required): JSON-serializable object (defines #to_json).
- store (Boolean): store in History; default true.
- compressed (Boolean): compress message; default false.
- publish_key (String): key to use when publishing.
- http_sync (Boolean): default false. Async returns a future; call value to get Envelope. If true, returns array of Envelopes (even for one).
- custom_message_type (String): 3–50 chars; case-sensitive alphanumeric; - and _ allowed; not starting with special chars, pn_, or pn-.
- meta (Object): JSON-serializable metadata.
- callback (Lambda): called per envelope. For async, use future.value to retrieve Envelope.

### Sample code

#### Publish a message to a channel

Reference code:

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

Before running the above publish example, either use the Debug Console or, in another process, subscribe to the same channel.

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

fire() sends a message to Functions event handlers and Illuminate on the target channel. Messages are not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message you can use the following method(s) in the Ruby SDK:

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

Parameters:
- channel (String, required), message (Object, required).
- compressed (Boolean): default false.
- publish_key (String).
- http_sync (Boolean): default false. Async returns future; sync returns Envelope or array of Envelopes if true.
- callback (Lambda): per-envelope; for async use future.value.

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

signal() sends a lightweight signal to all subscribers of a channel.

- Default max payload size: 64 bytes (payload only). Contact support for higher limits.

### Method(s)

To Signal a message you can use the following method(s) in the Ruby SDK:

```
`1pubnub.signal(  
2    message: Object,  
3    channel: String,  
4    compressed: Boolean,  
5    custom_message_type: String  
6)  
`
```

Parameters:
- message (Object, required), channel (String, required).
- compressed (Boolean): default false.
- custom_message_type (String): same constraints as publish.

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

Receive messages, signals, and events through event listeners. See Event Listeners.

### Description

Opens a TCP socket to PubNub and listens on specified channels. You must initialize with subscribe_key. By default, you receive only messages published after subscribe() completes.

- Connectivity notification: check envelope.status to know when subscribed before publishing to avoid race conditions.
- Auto-reconnect and catch-up: set restore: true to attempt to retrieve missed messages after disconnect. Default reconnect after ~320 seconds timeout.
- Unsubscribing from all channels resets the last-received timetoken and may cause message gaps.

### Method(s)

To Subscribe to a channel you can use the following method(s) in the Ruby SDK:

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

Parameters:
- channels (String|Symbol|Array): channels to subscribe; supports arrays and wildcard channels.
- channel_groups (String|Symbol|Array): group(s) to subscribe.
- presence (String|Symbol|Array): channels to subscribe for presence events.
- presence_callback (Lambda): called for presence events from wildcard subscribe; works only with http_sync: true.
- with_presence (Boolean): also subscribe to corresponding -pnpres channels. See Presence Events.
- http_sync (Boolean): default false. Async returns future; if true returns array of Envelopes (one per message).
- callback (Lambda): called per retrieved message; works only with http_sync: true.

##### Event listeners

Responses are handled by listener callbacks. See Listeners section.

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

Multiplex multiple channels using arrays. Wildcard Subscribe and Channel Groups require the Stream Controller add-on.

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

Requires Presence add-on. Subscribe to presence by appending -pnpres or use with_presence: true.

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

With presence_deltas enabled, interval messages may include arrays joined, left, timedout:

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

If the interval message exceeds ~30 KB, extra fields are omitted and here_now_refresh: true is included. Call hereNow to fetch the full list.

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

Requires Stream Controller add-on (Enable Wildcard Subscribe). Supports one-level wildcard (a.*). Grants/revokes with wildcards must match the same one-level pattern.

```
`1# Subscribe to wildcard channel 'ruby.*' (make sure you have wildcard subscribe enabled in your pubnub admin console!)  
2# specify two different callbacks for messages from channels and presence events in channels.  
3pubnub.subscribe(  
4    channels: 'ruby.*'  
5)  
`
```

#### Subscribing with state

Requires Presence. Always set a persistent UserId to uniquely identify the user/device.

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

Loop exits when there are no subscribed channels left.

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

Unsubscribe from one or more channels or groups. For a single channel, issues a leave and closes the socket if no channels remain. For multiplexed channels, removes specified channels; socket stays open while others remain.

- Unsubscribing from all channels resets the last-received timetoken and may cause message gaps if you resubscribe later.

### Method(s)

To Unsubscribe from a channel you can use the following method(s) in the Ruby SDK:

```
`1unsubscribe(  
2    channels: channels,  
3    channel_groups: group,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters:
- channels (Symbol|String): channels to unsubscribe (required if channel_groups not provided).
- channel_groups (Symbol|String): groups to unsubscribe (required if channels not provided).
- http_sync (Boolean): default false. Async returns future; if true returns array of Envelopes.
- callback (Lambda): per-envelope; for async use future.value.

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