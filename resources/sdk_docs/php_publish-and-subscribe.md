# Publish/Subscribe API for PHP SDK

Low-latency publish and real-time subscribe for channels and channel groups.

For conceptual guidance, see Connection Management and Publish Messages.

## Publish

`publish()` sends a JSON-serializable payload to all subscribers of a channel. Messages are replicated globally and delivered to all subscribers.

Key points
- Initialize with publishKey. Subscribing isn’t required to publish.
- One channel per publish call (no multi-channel publish).
- Transport security: set ssl = true at initialization; optional message encryption via Crypto module.
- Payload: Any JSON-serializable type (object, array, number, string; UTF‑8 strings). Don’t pass special classes/functions.
- Don’t JSON serialize message or meta yourself—SDK handles it.
- Size: Max 32 KiB (including escaped characters and channel name). Aim for <1,800 bytes. Oversize returns Message Too Large.
- Throughput: Publish as fast as bandwidth allows; soft limits apply. Subscribers may drop messages if overwhelmed; in-memory queue is 100 messages.
- customMessageType: Optional case-sensitive label (3–50 alphanumeric chars; dashes and underscores allowed; can’t start with special chars or pn_/pn-). Examples: text, action, poll.
- Best practices:
  - Publish serially; check success response [1,"Sent","136074940..."] before sending next.
  - On failure [0,"blah","<timetoken>"], retry.
  - Keep queue <100; throttle bursts (example ≤5 msg/s).

### Method(s)

```
`1$pubnub->publish()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->shouldStore(boolean)  
5    ->ttl($ttl)  
6    ->meta(array)  
7    ->usePost(boolean)  
8    ->customMessageType(string)  
9    ->sync();  
`
```

Parameters
- channel (string, required): Destination channel ID.
- message (string|array, required): Payload.
- shouldStore (bool, default: account default): Store in history.
- ttl (number): Per-message TTL in Message Persistence.
- meta (array, default: null): Metadata for server-side filtering.
- usePost (bool, default: false): Use POST to publish.
- customMessageType (string): Business-specific label; see constraints above.

### Sample code

#### Publish a message to a channel

##### Reference code
This example is a self-contained code snippet ready to be run.

```
1
  

```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (via Debug Console or a separate script).

### Response

Returns PNPublishResult:
- getTimetoken() → Integer: Timetoken when the message was published.

### Other examples

#### Publish with metadata

```
1
  

```

#### Publish array

```
1
  

```

## Fire

`fire()` sends a message to Functions event handlers and Illuminate. It doesn’t replicate to subscribers and isn’t stored in history.

### Method(s)

```
`1$pubnub->fire()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->meta(array)  
5    ->usePost(boolean)  
6    ->sync();  
`
```

Parameters
- channel (string, required): Destination channel ID.
- message (string|array, required): Payload to handlers.
- meta (array, default: null): Metadata for filtering.
- usePost (bool, default: false): Use POST to publish.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

`signal()` sends a lightweight signal to all subscribers of a channel.

Key points
- Initialize with publishKey.
- Signal payload size limit: 64 bytes (body only). For larger, contact support.
- Channel separation: Use separate channels for signals vs messages to aid recovery.

Signals vs Messages
- Payload size: signals 64B; messages up to 32KB.
- Cost: signals cost less.
- Persistence: signals aren’t stored; messages can be persisted.
- Push: signals can’t trigger Mobile Push; messages can.
- Use cases: signals for non-critical/ephemeral (e.g., geo updates); messages for critical/non-critical.
- Metadata: signals don’t support metadata; messages do.

### Method(s)

```
`1$pubnub->signal()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->sync();  
`
```

Parameters
- channel (string, required): Channel ID.
- message (string|array, required): Signal payload (≤64B).

### Sample code

#### Send a signal to a channel

```
1
  

```

### Response

Returns PNSignalResult:
- getTimetoken() → int: Timetoken when the signal was sent.

## Subscribe

Receive messages, signals, and presence via event listeners. Add listeners before subscribing.

Description
- Opens a TCP socket to PubNub and listens on specified channels. Requires subscribeKey at initialization.
- By default, only receives messages published after subscribe() completes.
- Blocking behavior: subscribe blocks until a message event, presence event, or status event occurs. Throw PubNubUnsubscribeException inside callbacks to exit the loop.
- Unsubscribing from all channels resets last timetoken and may cause message gaps; prefer unsubscribing selectively when switching channels.

### Method(s)

```
`1$pubnub->subscribe()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->withTimetoken(integer)  
5    ->withPresence(boolean)  
6    ->execute();  
`
```

Parameters
- channels (string|array): Channels to subscribe. Either channel or channelGroup is required.
- channelGroups (string|array): Channel groups to subscribe. Either channel or channelGroup is required.
- withTimetoken (integer): Start from a specific timetoken.
- withPresence (boolean): Also subscribe to related presence information.

### Sample code

Subscribe to a channel:

```
1
  

```

##### Event listeners
Handle responses via a Listener. Add listeners before calling subscribe.

### Response

PNStatus
- getCategory() → PNStatusCategory: See PHP SDK status categories.
- isError() → bool: True if an error occurred.
- getException() → PubNubException: Exception details (if error).
- getStatusCode() → int: Status code.
- Operation → OperationType: Operation type of the request.

PNMessageResult
- getMessage() → object: The message.
- getSubscription() → string: Channel ID on which message was received.
- getTimetoken() → integer: Timetoken for the message.

PNPresenceEventResult
- getStatusCode() → integer: Event code (join, leave, timeout, state-change).
- getUuid() → string: UUID for event.
- getTimestamp() → integer: Timestamp for event.
- getOccupancy() → integer: Current occupancy.
- getSubscription() → string: Channel ID.
- getTimetoken() → integer: Timetoken.

### Other examples

#### Basic subscribe with logging

```
1
  

```

#### Subscribing to multiple channels
Use multiplexing (array of channel names). You can also use Wildcard Subscribe and Channel Groups (requires Stream Controller add-on enabled in Admin Portal).

```
1
  

```

#### Subscribing to a Presence channel

Requires Presence add-on. For a channel my_channel, its presence channel is my_channel-pnpres.

```
1
  

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

##### Custom Presence event (state change)

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

When presence_deltas is enabled, interval messages may include:
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

If the interval message exceeds ~30KB, extra fields are omitted and here_now_refresh: true is included; perform hereNow to get full state.

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

Requires Stream Controller add-on (Enable Wildcard Subscribe). Only one level supported (a.*).

```
1
  

```

Wildcard grants and revokes
- One level only (a.*). Granting on * or a.b.* treats them as literal channels unless matching the supported depth. Revokes work at the same one-level depth and must match previously granted patterns.

#### Subscribing with state

Requires Presence add-on.

Required UUID
- Always set and persist a unique UUID for the user/device. Without it, you can’t connect.

```
1
  

```

#### Subscribe to a channel group

Requires Stream Controller add-on.

```
1
  

```

#### Subscribe to the Presence channel of a channel group

Requires Stream Controller and Presence add-ons.

```
1
  

```

## Unsubscribe

To unsubscribe, throw PubNubUnsubscribeException inside status/message/presence callbacks. Specify channels and/or channel groups to remove while keeping the loop for remaining subscriptions; otherwise, it unsubscribes from all.

### Method(s)

```
`1(new PubNubUnsubscribeException())  
2    ->setChannels(array)  
3    ->setChannelGroups(array);  
`
```

Parameters
- setChannels (array): Channels to unsubscribe; either channel or channelGroup required.
- setChannelGroups (array): Channel groups to unsubscribe; either channel or channelGroup required.

### Sample code

Unsubscribe from a channel:

```
1
  

```

### Rest response from server

```
`1{  
2    "action" : "leave"  
3}  
`
```

### Other examples

#### Unsubscribing from multiple channels

Requires Stream Controller add-on.

```
1
  

```

##### Example response

```
`1{  
2    "action" : "leave"  
3}  
`
```

#### Unsubscribe from a channel group

```
1
  

```

##### Example response

```
`1{**2    "action": "leave"  
3}  
`
```