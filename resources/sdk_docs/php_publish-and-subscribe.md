# Publish/Subscribe API for PHP SDK

PubNub delivers messages globally in <30 ms. Send to a single recipient or broadcast to many.

For conceptual guidance, see:
- Connection Management (/docs/general/setup/connection-management)
- Publish Messages (/docs/general/messages/publish)

## Publish

publish() sends a message to all subscribers of a channel. PubNub replicates messages across PoPs and delivers to all subscribed clients.

Essential details:
- Prerequisites:
  - Initialize PubNub with publishKey (/docs/sdks/php/api-reference/configuration#configuration).
  - You don't need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security:
  - Enable TLS/SSL by setting ssl: true at initialization.
  - You can encrypt messages (/docs/sdks/php/api-reference/configuration#crypto-module).
- Message data:
  - Message can be any JSON-serializable data (objects, arrays, integers, strings). UTF‑8 strings supported. Avoid special classes/functions.
  - Don't JSON serialize: Pass raw objects/arrays for message and meta; SDK handles serialization.
- Size:
  - Max 32 KiB (includes escaped characters and channel name). Aim for <1,800 bytes for best performance.
  - Exceeding limit returns Message Too Large. See message size limits (/docs/general/messages/publish#message-size-limit).
- Publish rate:
  - Publish as fast as bandwidth allows; soft throughput limit (/docs/general/setup/limits). In-memory queue stores only 100 messages; subscribers may drop if they can’t keep up.
- Custom message type:
  - Optional customMessageType for business-specific labels (for example: text, action, poll).
- Best practices:
  - Publish to a channel serially (not concurrently).
  - Verify success return code (for example, [1,"Sent","136074940..."]).
  - Publish the next message only after success.
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep in-memory queue <100 messages.
  - Throttle bursts to meet latency needs (for example, ≤5 messages/sec).

### Method(s)

To Publish a message you can use the following method(s) in the PHP SDK:

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
- ttl (Number): Per-message time to live for Message Persistence.
- meta (Array, default: null): Metadata for server-side filtering.
- usePost (Boolean, default: false): Use POST to publish.
- customMessageType (String): 3–50 chars, case-sensitive alphanumeric; dashes - and underscores _ allowed. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the above publish example, either using the Debug Console (https://www.pubnub.com/docs/console/) or in a separate script/terminal, subscribe to the same channel.

### Response

The publish() operation returns a PNPublishResult:

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

fire() sends a message to Functions event handlers and Illuminate (/docs/illuminate/business-objects/external-data-sources). It triggers handlers on the target channel. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message you can use the following method(s) in the PHP SDK:

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

signal() sends a lightweight signal to all subscribers of a channel.

Key details:
- Prerequisite: Initialize with publishKey.
- Payload size limit: 64 bytes (excluding URI/headers). For larger payloads, contact support@pubnub.com.
- Signals vs. Messages:
  - Payload: 64B vs. 32KB
  - Cost: Signals cheaper
  - Persistence: Signals not stored; messages can be stored
  - Push Notifications: Signals cannot trigger; messages can
  - Use cases: Signals for non-critical data (for example, geolocation), messages for critical/non-critical
  - Metadata: Signals don’t support metadata; messages do
- Channel separation: Use separate channels for signals and messages to improve recovery.

### Method(s)

To Send a signal you can use the following method(s) in the PHP SDK:

```
`1$pubnub->signal()  
2    ->channel(string)  
3    ->message(string|array)  
4    ->sync();  
`
```

Parameters:
- channel (String, required): Channel ID.
- message (String|Array, required): Signal payload (≤64 bytes).

### Sample code

#### Send a signal to a channel

```
1
  

```

### Response

The signal() operation returns a PNSignalResult:

- getTimetoken() → int: Timetoken when the signal was sent.

## Subscribe

### Receive messages

Receive messages and events via event listeners. See Event Listeners (/docs/sdks/php/api-reference/configuration#event-listeners).

### Description

Creates an open TCP socket and listens for messages on specified channels. You must initialize with subscribeKey. By default, you receive messages published after subscribe() completes.

Subscribe call is blocking and will block until:
- A message is published (message callback).
- A presence event is received (presence callback).
- A status event is triggered by the SDK (status callback).

Throw PubNubUnsubscribeException inside any callback to exit the loop.

Unsubscribing from all channels resets the last-received timetoken and may cause gaps leading to message loss.

### Method(s)

To Subscribe to a channel you can use the following method(s) in the PHP SDK:

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
- channels (String|Array): Channel IDs to subscribe. Either channel or channelGroups is required.
- channelGroups (String|Array): Channel groups to subscribe. Either channel or channelGroups is required.
- withTimetoken (Integer): Start from a specific timetoken.
- withPresence (Boolean): Also subscribe to presence events for the channels/groups.
  - Presence details: /docs/general/presence/presence-events#subscribe-to-presence-channel

### Sample code

Subscribe to a channel:

```
1
  

```

##### Event listeners

Handle responses via listeners. See Listeners section (/docs/sdks/php#add-event-listeners). Add listeners before calling subscribe().

### Response

PNStatus:
- getCategory() → PNStatusCategory (see /docs/sdks/php/status-events)
- isError() → bool
- getException() → PubNubException
- getStatusCode() → int
- Operation → OperationType

PNMessageResult:
- getMessage() → Object: Message payload.
- getSubscription() → String: Channel ID message was received on.
- getTimetoken() → Integer: Message timetoken.

PNPresenceEventResult:
- getStatusCode() → Integer: Presence event status (join, leave, timeout, state-change).
- getUuid() → String: UUID for the event.
- getTimestamp() → Integer: Event timestamp.
- getOccupancy() → Integer: Current occupancy.
- getSubscription() → String: Channel ID.
- getTimetoken() → Integer: Timetoken.

### Other examples

#### Basic subscribe with logging

```
1
  

```

#### Subscribing to multiple channels

Multiplexing (/docs/general/channels/subscribe#channel-multiplexing). Also see alternative methods below.

##### Alternative subscription methods

Wildcard Subscribe (/docs/general/channels/subscribe#wildcard-subscribe) and Channel Groups (/docs/general/channels/subscribe#channel-groups) require Stream Controller enabled on your keyset (https://admin.pubnub.com).

```
1
  

```

#### Subscribing to a Presence channel

Requires Presence add-on enabled (https://admin.pubnub.com/). See presence events (/docs/general/presence/presence-events#subscribe-to-presence-channel).

Subscribe to my_channel-pnpres to receive presence events for my_channel.

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

When a channel is in interval mode with presence_deltas pnconfig flag enabled, the interval message may include arrays of changed UUIDs since the last interval: joined, left, timedout.

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

If the full interval message >30KB, extra fields are omitted and here_now_refresh: true is included; perform a hereNow to retrieve the full list.

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

Requires Stream Controller (Enable Wildcard Subscribe) in Admin Portal. Only one wildcard level is supported (a.*).

```
1
  

```

Wildcard grants and revokes: Only one level (a.*). Granting on * or a.b.* treats them as literal names. Revokes work only if granted with the same wildcard and one level deep.

#### Subscribing with state

Requires Presence. Presence add-on must be enabled.

Required UUID: Always set and persist a UUID per user/device; it must remain stable to connect.

```
1
  

```

#### Subscribe to a channel group

Requires Stream Controller.

```
1
  

```

#### Subscribe to the Presence channel of a channel group

Requires both Stream Controller and Presence add-ons.

```
1
  

```

## Unsubscribe

To unsubscribe, throw PubNubUnsubscribeException inside status/message/presence callbacks. Specify channels and/or channel groups to unsubscribe and keep the loop running for remaining subscriptions. Otherwise, it unsubscribes from all and channel-groups.

### Method(s)

To Unsubscribe from a channel you can use the following method(s) in the PHP SDK:

```
`1(new PubNubUnsubscribeException())  
2    ->setChannels(array)  
3    ->setChannelGroups(array);  
`
```

Parameters:
- getChannels (String, default: false): Channels to get here now details.
- getChannelGroups (String, default: false): Channel groups to get here now details.
- setChannels (Array, default: false): Unsubscribe channels. Either channel or channelGroup is required.
- setChannelGroups (Array, default: false): Unsubscribe channel groups. Either channel or channelGroup is required.

### Sample code

Unsubscribe from a channel:

```
1
  

```

### Rest response from server

Successful response:

```
`1{  
2    "action" : "leave"  
3}  
`
```

### Other examples

#### Unsubscribing from multiple channels

Requires Stream Controller.

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