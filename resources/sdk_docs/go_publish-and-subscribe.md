# Publish/Subscribe API for Go SDK

Low-latency publish and subscribe messaging. See Connection Management and Publish Messages for higher-level concepts.

## Publish

Sends a message to all subscribers of a channel. Messages are replicated globally and delivered to all subscribed clients.

Key points:
- Initialize PubNub with publishKey. You don’t need to subscribe to publish. You can’t publish to multiple channels simultaneously.
- TLS/SSL: set ssl to true during initialization. Encryption is available via CryptoModule.
- Message payload: any JSON-serializable data (objects, arrays, numbers, strings). Use UTF‑8 strings. Avoid special classes/functions.
- Don’t JSON serialize: Pass message and meta as objects; PubNub serializes automatically.
- Size limit: 32 KiB (including escapes and channel name). Target < ~1,800 bytes for best performance. Errors: Message Too Large.
- Throughput: Publish as fast as bandwidth allows, but subscribers have a soft limit. In-memory queue is 100 messages; older may drop if consumers lag.
- CustomMessageType: Optional business label like text, action, poll.
- Best practices:
  - Publish serially (not concurrently).
  - Verify success response before next publish.
  - On failure, retry.
  - Keep in-memory queue < 100 messages.
  - Throttle bursts as needed (e.g., ≤ 5 msgs/s).

### Method(s)

To Publish a message:

```
`1pn.Publish().  
2    Message(interface{}).  
3    Channel(string).  
4    ShouldStore(bool).  
5    UsePost(bool).  
6    Meta(interface{}).  
7    QueryParam(queryParam).  
8    CustomMessageType(string).  
9    Execute()  
`
```

Parameters:
- Message (required)
  - Type: interface
  - Default: n/a
  - The payload.
- Channel (required)
  - Type: string
  - Default: n/a
  - Destination channel ID.
- ShouldStore
  - Type: bool
  - Default: account default
  - Store in history.
- UsePost
  - Type: bool
  - Default: false
  - Use POST to publish.
- Meta
  - Type: interface
  - Default: null
  - Metadata for message filtering.
- TTL
  - Type: int
  - Default: n/a
  - Per-message time to live in Message Persistence.
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Adds query string parameters to the request.
- CustomMessageType
  - Type: string
  - Default: n/a
  - Case-sensitive, 3–50 chars, alphanumeric, dashes and underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).

### Sample code

#### Publish a message to a channel

```
1
  

```

Subscribe to the same channel before running the publish example.

### Response

- Timestamp
  - Type: int
  - Timetoken when the message was published.

### Other examples

#### Publish with metadata

```
1
  

```

#### Publish array

```
1
  

```

#### Store the published message for 24 hours

```
1
  

```

#### Push payload helper

Use helper to format payload for Push messages. See Create Push Payload Helper.

```
1
  

```

## Fire

Sends a message to Functions event handlers and Illuminate only. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message:

```
`1pn.Fire().  
2    Message(interface{}).  
3    Channel(string).  
4    UsePost(bool).  
5    Meta(interface{}).  
6    QueryParam(queryParam).  
7    Execute()  
`
```

Parameters:
- Message (required): interface, payload.
- Channel (required): string, destination channel ID.
- UsePost: bool, default false, use POST.
- Meta: interface, default null, metadata for filtering.
- TTL: int, per-message TTL in Message Persistence.
- QueryParam: map[string]string, default nil, adds query params.

### Sample code

#### Fire a message to a channel

```
1
  

```

#### Fire with metadata

```
1
  

```

## Signal

Sends a lightweight signal to channel subscribers.

- Payload size limit: 64 bytes (payload only). Contact support for higher limits.

### Method(s)

To Signal a message:

```
`1pubnub.Signal().  
2    Message(interface{}).  
3    Channel(string).  
4    CustomMessageType(string).  
5    Execute()  
`
```

Parameters:
- Message (required): interface, payload.
- Channel (required): string, destination channel ID.
- CustomMessageType: string (3–50 chars; alphanumeric, - and _ allowed; not starting with special chars or pn_/pn-). Examples: text, action, poll.

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

- Timestamp
  - Type: int
  - Timetoken when the Signal was sent.

## Subscribe

Receive messages via a single event listener for all subscribed channels and channel groups.

- Subscribes open a TCP socket using your SubscribeKey. By default, only messages published after Subscribe() completes are received.
- Connectivity: Check envelope.status. Wait for status before immediately publishing to avoid race conditions.
- Auto-reconnect: Set restore to true to retrieve missed messages after disconnects. Default reconnect after 320 seconds timeout.
- Unsubscribing from all channels resets last received timetoken and may cause gaps; prefer removing specific channels when switching.

### Method(s)

To Subscribe to a channel:

```
`1pn.Subscribe().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    Timetoken(int64).  
5    WithPresence(bool).  
6    QueryParam(queryParam).  
7    Execute()  
`
```

Parameters:
- Channels: []string, subscribe to channels. Either channel(s) or channel group(s) required.
- ChannelGroups: []string, subscribe to channel groups. Either channel(s) or channel group(s) required.
- Timetoken: int64, start from a timetoken.
- WithPresence: bool, also subscribe to presence events. See Presence Events.
- QueryParam: map[string]string, adds query params.

### Sample code

Subscribe to a channel:

```
1
  

```

### Response

PNMessage is returned through Listeners.

PNStatus (from Subscribe()):
- Category: StatusCategory
- Error: bool
- ErrorData: error
- StatusCode: int
- Operation: OperationType

PNMessage (Publish and Signal messages):
- Message: interface
- Channel: string
- Subscription: string (group or wildcard match)
- Timetoken: int64
- UserMetadata: interface
- SubscribedChannel: string
- Publisher: string (UUID)

PNPresence:
- Event: string (join, leave, timeout, state-change)
- UUID: string
- Timestamp: int64
- Occupancy: int
- Subscription: string
- Timetoken: int64
- State: interface
- UserMetadata: map[string]interface
- SubscribedChannel: string
- Channel: string

PNUUIDEvent:
- Event: PNObjectsEvent (PNObjectsEventRemove, PNObjectsEventSet)
- Timestamp: string
- Subscription: string
- SubscribedChannel: string
- Channel: string
- UUID: string
- Name: string
- ExternalID: string
- ProfileURL: string
- Email: string
- Custom: map[string]interface
- Updated: string
- ETag: string

PNChannelEvent:
- Event: PNObjectsEvent (PNObjectsEventRemove, PNObjectsEventSet)
- Timestamp: string
- Subscription: string
- SubscribedChannel: string
- Channel: string
- ChannelID: string
- Name: string
- Description: string
- Custom: map[string]interface
- Updated: string
- ETag: string

PNMembershipEvent:
- Event: PNObjectsEvent (PNObjectsEventRemove, PNObjectsEventSet)
- Timestamp: string
- Subscription: string
- SubscribedChannel: string
- Channel: string
- ChannelID: string
- UUID: string
- Custom: map[string]interface

PNMessageActionsEvent:
- Event: PNMessageActionsEventType (PNMessageActionsAdded, PNMessageActionsRemoved)
- Data: PNMessageActionsResponse
- Subscription: string
- SubscribedChannel: string
- Channel: string

### Other examples

#### Basic subscribe with logging

```
1
  

```

#### Subscribing to multiple channels

Multiplexing allows subscribing to multiple channels by array. Wildcard Subscribe and Channel Groups also supported; enable Stream Controller add-on in Admin Portal.

```
1
  

```

#### Subscribing to a Presence channel

Requires Presence add-on. Subscribe directly to channel-pnpres (for my_channel use my_channel-pnpres).

```
1
  

```

#### Sample Responses

##### Join event

```
`1if presence.Event == "join" {  
2    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
3    presence.Timestamp // 1345546797  
4    presence.Occupancy // 2  
5}  
`
```

##### Leave event

```
`if presence.Event == "leave" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

##### Timeout event

```
`if presence.Event == "timeout" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

##### State change event

```
`if presence.Event == "state-change" {  
    presence.Timestamp  
    presence.Occupancy  
}  
`
```

##### Interval event

```
`if presence.Event == "interval" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

When presence_deltas is enabled, interval events may include:
- joined
- left
- timedout

Example:

```
`if presence.Event == "interval" {  
    presence.Occupancy // # users in channel  
    presence.Join // [uuid1 uuid2]  
    presence.Timeout //[uuid3]  
    presence.Timestamp // unix timestamp  
}  
`
```

If the interval message exceeds ~30 KB, extra fields are omitted and here_now_refresh: true is included; call hereNow to get full user list.

#### Wildcard subscribe to channels

Requires Stream Controller add-on, one-level wildcard only (a.*). Wildcard grants/revokes must match the same one-level pattern.

```
1
  

```

#### Subscribing with state

Requires Presence and a stable UUID set for the client.

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

Removes channels from the subscription. If only one channel, issues a leave and closes the socket; for multiplexed subscriptions, removes specified channels while keeping the socket open if others remain.

Note: Unsubscribing from all channels then subscribing to new ones resets timetoken and may cause message gaps.

### Method(s)

To Unsubscribe from a channel:

```
`1pn.Unsubscribe().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels: []string, unsubscribe from channels. Either channel(s) or channelGroup(s) required.
- ChannelGroups: []string, unsubscribe from channel groups. Either channel(s) or channelGroup(s) required.
- QueryParam: map[string]string, default nil, adds query params.

### Sample code

Unsubscribe from a channel:

```
1
  

```

Event listeners handle responses; see Event Listeners.

### Rest response from server

Successful leave example:

```
`1if presence.Event == "leave" {  
2    presence.UUID // left-uuid  
3    presence.Timestamp // 1345546797  
4    presence.Occupancy // 2  
5}  
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
`1if presence.Event == "leave" {  
2    presence.UUID // left-uuid  
3    presence.Timestamp // 1345546797  
4    presence.Occupancy // 2  
5}  
`
```

#### Unsubscribe from a channel group

Requires Stream Controller add-on.

```
1
  

```

## Unsubscribe all

Unsubscribe from all channels and channel groups.

### Method(s)

```
`1UnsubscribeAll()  
`
```

### Sample code

```
1
  

```

### Returns

None

Last updated on Oct 29, 2025