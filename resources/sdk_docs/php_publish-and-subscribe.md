# Publish/Subscribe API for PHP SDK

Low-latency messaging to one or many subscribers. For concepts, see Connection Management and Publish Messages.

## Publish

`publish()` sends a message to all subscribers on a channel. Messages are replicated globally.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - You don't need to subscribe to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl: true during initialization. You can also encrypt messages.
- Message data
  - Message can be any JSON-serializable data (objects, arrays, numbers, strings). Avoid special classes/functions. Strings can include any UTF‑8 characters.
  - Don't JSON serialize: Pass full objects for message and meta; SDK handles serialization.
- Size
  - Max 32 KiB (includes escaped chars and channel name). Aim under ~1,800 bytes for best performance. Oversize returns Message Too Large.
- Publish rate
  - Publish as fast as bandwidth allows. There’s a soft throughput limit; subscribers may drop messages if they can’t keep up. In-memory queue is 100 messages (e.g., publishing 200 at once may drop earlier messages if subscriber hasn’t received any).
- Custom message type
  - optional customMessageType to label messages (for example, text, action, poll).
- Best practices
  - Publish serially, not concurrently.
  - Verify success return code ([1,"Sent","136074940..."]) before sending next.
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep queue under 100 messages.
  - Throttle bursts (e.g., ≤ 5 msg/s) as needed.

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

Parameters:
- channel (String, required): Destination channel ID.
- message (String|Array, required): Payload.
- shouldStore (Boolean, default: account default): Store in history.
- ttl (Number): Per-message TTL for Message Persistence.
- meta (Array, default: null): Metadata for filtering.
- usePost (Boolean, default: false): Use POST.
- customMessageType (String): Case-sensitive 3–50 chars, alphanumeric with dashes/underscores allowed; cannot start with special chars or with pn_ or pn-. Examples: text, action, poll.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the above example, subscribe to the same channel (see Subscribe).

### Response

Returns PNPublishResult:
- getTimetoken() (Integer): Timetoken when the message was published.

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

Sends a message to Functions event handlers and Illuminate on a channel. Not replicated to subscribers and not stored in history.

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

Parameters:
- channel (String, required): Destination channel ID.
- message (String|Array, required): Payload.
- meta (Array, default: null): Metadata for filtering.
- usePost (Boolean, default: false): Use POST.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

`signal()` sends a lightweight signal to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - Payload size limit: 64 bytes (without URI/headers). Contact support for larger needs.
- Signal vs. Message
  - Payload: Signals ≤ 64B; Messages ≤ 32KB
  - Cost: Signals cheaper
  - Persistence: Signals not stored; Messages can be stored
  - Push: Signals can’t trigger mobile push; Messages can
  - Use cases: Signals for non-critical, high-frequency (e.g., geolocation)
  - Metadata: Signals don’t support; Messages do
- Channel separation
  - Use separate channels for signals and messages for better connection recovery.

### Method(s)

```
`1$pubnub->signal()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->sync();  
`
```

Parameters:
- channel (String, required): Channel ID.
- message (String|Array, required): Signal payload.

### Sample code

#### Send a signal to a channel

```
1
  

```

### Response

Returns PNSignalResult:
- getTimetoken() (int): Timetoken when the signal was sent.

## Subscribe

### Receive messages

Receive messages and events via event listeners (single entry point for messages, signals, and events across all subscribed channels). Add listeners before subscribing.

### Description

Creates an open TCP socket and listens on specified channels. Requires subscribeKey at initialization.

Newly subscribed clients receive messages published after subscribe() completes.

- Subscribe call is blocking until:
  - A message arrives (message callback),
  - A presence event arrives (presence callback),
  - A status event is triggered (status callback).
- Throw PubNubUnsubscribeException from within callbacks to exit the subscribe loop.

Unsubscribing from all channels resets the last-received timetoken, which may cause gaps and message loss vs. switching channels without fully unsubscribing.

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

Parameters:
- channels (String|Array): Channels to subscribe. Either channels or channelGroups is required.
- channelGroups (String|Array): Channel groups to subscribe. Either channels or channelGroups is required.
- withTimetoken (Integer): Start from a specific timetoken.
- withPresence (Boolean): Also subscribe to presence events. See Presence Events.

### Sample code

Subscribe to a channel:

```
1
  

```

##### Event listeners

Handle responses via listeners. Add listeners before calling subscribe.

### Response

PNStatus:
- getCategory() (PNStatusCategory): See PHP SDK status categories.
- isError() (bool): True if an error occurred.
- getException() (PubNubException): Exception data if error.
- getStatusCode() (int): HTTP status code.
- Operation (OperationType): Operation type.

PNMessageResult:
- getMessage() (Object): Message payload.
- getSubscription() (String): Channel ID where message was received.
- getTimetoken() (Integer): Message timetoken.

PNPresenceEventResult:
- getStatusCode() (Integer): Presence events like join, leave, timeout, state-change.
- getUuid() (String): Event UUID.
- getTimestamp() (Integer): Event timestamp.
- getOccupancy() (Integer): Current occupancy.
- getSubscription() (String): Channel ID.
- getTimetoken() (Integer): Message timetoken.

### Other examples

#### Basic subscribe with logging

```
1
  

```

#### Subscribing to multiple channels

Multiplexing allows subscribing to many channels using an array.

Alternative methods: Wildcard Subscribe and Channel Groups (requires Stream Controller add-on enabled in Admin Portal).

```
1
  

```

#### Subscribing to a Presence channel

Requires Presence add-on enabled. Presence events and details: Presence Events.

Presence channel is channelName-pnpres (example: my_channel-pnpres).

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

When presence_deltas pnconfig flag is enabled, interval messages may include:
- joined, left, timedout (arrays of UUIDs since last interval)

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

If the interval message would exceed ~30KB, extra fields are omitted and here_now_refresh: true is included. Use hereNow to fetch full list:

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

Requires Stream Controller add-on (Enable Wildcard Subscribe). Subscribe to patterns like a.* to receive a.b, a.c, etc. Only one-level wildcarding supported.

```
1
  

```

Wildcard grants and revokes: Only one level (a.*). Granting on * or a.b.* treats them as literal channels unless granted using wildcard features. Revokes work only for the same one-level wildcards previously granted.

#### Subscribing with state

Requires Presence add-on.

Required UUID: Always set and persist a stable UUID for users/devices; otherwise you cannot connect.

```
1
  

```

#### Subscribe to a channel group

Requires Stream Controller add-on.

```
1
  

```

#### Subscribe to the Presence channel of a channel group

Requires both Stream Controller and Presence add-ons.

```
1
  

```

## Unsubscribe

Throw PubNubUnsubscribeException inside status/message/presence callbacks to unsubscribe. Specify channels and/or channel groups in the exception to continue the subscribe loop for remaining subscriptions; otherwise, it unsubscribes from all.

### Method(s)

```
`1(new PubNubUnsubscribeException())  
2    ->setChannels(array)  
3    ->setChannelGroups(array);  
`
```

Parameters:
- getChannels (String, default: false): Channels to get here-now details. 
- getChannelGroups (String, default: false): Channel groups to get here-now details.
- setChannels (Array, default: false): Unsubscribe from channels. Either channel or channelGroup is required.
- setChannelGroups (Array, default: false): Unsubscribe from channel groups. Either channel or channelGroup is required.

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

Last updated on Nov 6, 2025**