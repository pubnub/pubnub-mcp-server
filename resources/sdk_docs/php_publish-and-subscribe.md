# Publish/Subscribe API for PHP SDK

PubNub delivers messages globally with low latency. Use publish to send data and subscribe to receive it.

For concepts, see Connection Management and Publish Messages.

## Publish

publish() sends a message to all subscribers on a channel.

Essentials:
- Initialize PubNub with publishKey.
- You don't need to subscribe to publish.
- You cannot publish to multiple channels simultaneously.
- Security: Set ssl=true during initialization; optional message encryption.
- Message data: JSON-serializable only; strings may include any UTF‑8.
- Don’t JSON-serialize message or meta; SDK handles serialization.
- Size: Max 32 KiB including channel and escapes. Target < ~1.8 KB.
- Rate: In-memory queue per-connection stores ~100 messages; bursts can drop messages if subscribers lag.
- customMessageType: Optional label like text, action, poll (3–50 chars, case-sensitive, alphanumeric, dashes/underscores allowed; cannot start with special chars or pn_/pn-).
- Best practices: Publish serially, confirm success before sending next, retry on failure, keep queue <100, throttle bursts (e.g., ≤5 msgs/sec).

### Method(s)

To Publish a message use:

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

Parameters:
- channel (String): Destination channel ID. Required.
- message (String|Array): Payload. Required.
- shouldStore (Boolean, default: account default): Store in history.
- ttl (Number): Per-message time to live for Message Persistence.
- meta (Array, default: null): Metadata for message filtering.
- usePost (Boolean, default: false): Use POST to publish.
- customMessageType (String): Case-sensitive 3–50 char label; allowed [A-Za-z0-9_-]; cannot start with special chars nor pn_/pn-. Examples: text, action, poll.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (see Subscribe).

### Response

publish() returns PNPublishResult:
- getTimetoken(): Integer timetoken when the message was published.

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

Sends a message to Functions event handlers and Illuminate on the target channel. Messages aren’t replicated to subscribers and aren’t stored in history.

### Method(s)

To Fire a message use:

```
`1$pubnub->fire()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->meta(array)  
5    ->usePost(boolean)  
6    ->sync();  
`
```

Parameters:
- channel (String): Destination channel ID. Required.
- message (String|Array): Payload. Required.
- meta (Array, default: null): Metadata for filtering.
- usePost (Boolean, default: false): Use POST.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

signal() sends a lightweight signal to channel subscribers.

Essentials:
- Initialize PubNub with publishKey.
- Payload size limit: 64 bytes (without URI/headers). Contact support for larger needs.
- Signals vs Messages:
  - Payload: 64B vs 32KB
  - Cost: cheaper vs more expensive
  - Persistence: no vs yes
  - Push notifications: no vs yes
  - Use cases: non-critical streams vs broad use
  - Metadata: signals don’t support metadata; messages do
- Channel separation: Use separate channels for signals and messages.

### Method(s)

To Send a signal use:

```
`1$pubnub->signal()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->sync();  
`
```

Parameters:
- channel (String): Channel ID. Required.
- message (String|Array): Signal payload. Required.

### Sample code

#### Send a signal to a channel

```
1
  

```

### Response

signal() returns PNSignalResult:
- getTimetoken(): int timetoken when the signal was sent.

## Subscribe

Receive messages, signals, and presence via event listeners. Requires subscribeKey during initialization. Newly subscribed clients receive messages published after subscribe() completes.

Behavior:
- subscribe() opens a long-lived TCP connection and blocks until:
  - message event
  - presence event
  - status event
- Throw PubNubUnsubscribeException inside callbacks to exit the loop.
- Unsubscribing from all channels resets last timetoken and can cause message gaps.

### Method(s)

To Subscribe to a channel use:

```
`1$pubnub->subscribe()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->withTimetoken(integer)  
5    ->withPresence(boolean)  
6    ->execute();  
`
```

Parameters:
- channels (String|Array): Channel(s) to subscribe. Either channels or channelGroups required.
- channelGroups (String|Array): Channel group(s) to subscribe. Either channels or channelGroups required.
- withTimetoken (Integer): Start from a specific timetoken.
- withPresence (Boolean): Also subscribe to presence events for the channels/groups.

### Sample code

Subscribe to a channel:

```
`1$pubnub->subscribe()  
2    ->channels("my_channel")  
3    ->execute();  
`
```

##### Event listeners

Add a listener before calling subscribe(). See Listeners section for details.

### Response

PNStatus:
- getCategory(): PNStatusCategory (see status categories)
- isError(): bool
- getException(): PubNubException (if error)
- getStatusCode(): int
- Operation: OperationType

PNMessageResult:
- getMessage(): Object message payload
- getSubscription(): String channel ID
- getTimetoken(): Integer timetoken

PNPresenceEventResult:
- getStatusCode(): Integer
- getUuid(): String
- getTimestamp(): Integer
- getOccupancy(): Integer
- getSubscription(): String channel ID
- getTimetoken(): Integer timetoken

### Other examples

#### Basic subscribe with logging

```
1
  

```

#### Subscribing to multiple channels

Multiplexing: subscribe to multiple channels with an array. Alternative: Wildcard Subscribe and Channel Groups (Stream Controller add-on required).

```
`1$pubnub->subscribe()  
2    ->channels(["my_channel1", "my_channel2"])  
3    ->execute();  
`
```

#### Subscribing to a Presence channel

Requires Presence add-on. To receive presence, either use withPresence() or subscribe to the presence channel by appending -pnpres to the channel name (e.g., my_channel-pnpres).

```
`1$pubnub->subscribe()  
2    ->channels("my_channel")  
3    ->withPresence()  
4    ->execute();  
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

With presence_deltas enabled, interval messages may include joined, left, timedout arrays. Example:

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

If > ~30 KB, extra fields omitted and here_now_refresh=true is included:

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

Requires Stream Controller add-on. One-level wildcard only (a.*). Example:

```
`1$pubnub->subscribe()  
2    ->channels("foo.*")  
3    ->execute();  
`
```

Wildcard grants/revokes: Only one-level deep; grant/revoke must match.

#### Subscribing with state

Requires Presence add-on. Required UUID: Set and persist a unique UUID for the user/device.

```
1
  

```

#### Subscribe to a channel group

Requires Stream Controller add-on.

```
`1$pubnub->subscribe()  
2    ->channelGroups(["cg1", "cg2"])  
3    ->execute();  
`
```

#### Subscribe to the Presence channel of a channel group

Requires Stream Controller and Presence add-ons.

```
`1$pubnub->subscribe()  
2    ->channelGroups("awesome_channel_group")  
3    ->withPresence()  
4    ->execute();  
`
```

## Unsubscribe

Unsubscribe by throwing PubNubUnsubscribeException inside status/message/presence callbacks. Specify channels and/or channel groups to keep the loop for others; otherwise unsubscribes from all.

### Method(s)

To Unsubscribe from a channel use:

```
`1(new PubNubUnsubscribeException())  
2    ->setChannels(array)  
3    ->setChannelGroups(array);  
`
```

Parameters:
- getChannels (String, default: false): Channels to get here-now details.
- getChannelGroups (String, default: false): Channel groups to get here-now details.
- setChannels (Array, default: false): Channels to unsubscribe (either channel or channelGroup required).
- setChannelGroups (Array, default: false): Channel groups to unsubscribe (either channel or channelGroup required).

### Sample code

Unsubscribe from a channel:

```
1
  

```

### Rest response from server

Successful call returns:

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
1use PubNub\Callbacks\SubscribeCallback;  
2use PubNub\Exceptions\PubNubUnsubscribeException;  
3
  
4class MySubscribeCallback extends SubscribeCallback {  
5    function status($pubnub, $status) {  
6        throw new PubNubUnsubscribeException();  
7    }  
8
  
9    function message($pubnub, $message) {  
10    }  
11
  
12    function presence($pubnub, $presence) {  
13    }  
14}  

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
1use PubNub\Callbacks\SubscribeCallback;  
2use PubNub\Exceptions\PubNubUnsubscribeException;  
3
  
4class MySubscribeCallback extends SubscribeCallback {  
5    function status($pubnub, $status) {  
6        throw (new PubNubUnsubscribeException())->setChannelGroups(["my_channel"]);  
7    }  
8
  
9    function message($pubnub, $message) {  
10    }  
11
  
12    function presence($pubnub, $presence) {  
13    }  
14}  

```

##### Example response

```
`1{**2    "action": "leave"  
3}  
`
```

Last updated on Oct 21, 2025**