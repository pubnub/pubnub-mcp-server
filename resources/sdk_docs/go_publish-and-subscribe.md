# Publish/Subscribe API for Go SDK

PubNub delivers messages in under 30 ms to one or many subscribers.

For conceptual guidance, see Connection Management and Publish Messages.

## Publish

Sends a message to all subscribers of a channel. Messages are replicated globally.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - You can publish without being subscribed.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl=true at initialization. Optional message encryption available.
- Message data
  - Any JSON-serializable data (objects, arrays, integers, strings, UTF‑8 strings).
  - Don’t JSON serialize message or meta yourself; SDK handles it.
- Size
  - Max message size: 32 KiB (includes escapes and channel). Aim under ~1,800 bytes.
- Publish rate
  - Publish as fast as bandwidth allows; soft throughput limits apply. In-memory queue holds 100 messages; excess may drop.
- Custom message type
  - Optional CustomMessageType to label messages (for example, text, action, poll).
- Best practices
  - Publish serially, verify success ([1,"Sent","<timetoken>"]) before next publish.
  - On failure ([0,"...",<timetoken>]), retry.
  - Keep in-memory queue < 100.
  - Throttle bursts (for example, ≤5 msgs/sec) as needed.

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
  - The payload
- Channel (required)
  - Type: string
  - Default: n/a
  - Destination channel ID
- ShouldStore
  - Type: bool
  - Default: account default
  - Store in history
- UsePost
  - Type: bool
  - Default: false
  - Use POST to Publish
- Meta
  - Type: interface
  - Default: null
  - Metadata for message filtering
- TTL
  - Type: int
  - Default: n/a
  - Per-message TTL in Message Persistence
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Additional URL query parameters
- CustomMessageType
  - Type: string
  - Default: n/a
  - Case-sensitive, alphanumeric, 3–50 chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

##### Reference code

#### Publish a message to a channel

```
1
  
```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel in another terminal or Debug Console.

### Response

- Timestamp
  - Type: int
  - Timetoken when the message was published

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

Use helper to format payloads for Push messages (Create Push Payload Helper Section).

```
1
  
```

## Fire

Sends a message to Functions event handlers and Illuminate. Delivered only to handlers on the target channel; not replicated to subscribers and not stored in history.

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
- Message (required): Type interface; payload
- Channel (required): Type string; destination channel ID
- UsePost: Type bool; Default false; use POST
- Meta: Type interface; Default null; metadata for filtering
- TTL: Type int; per-message TTL in Message Persistence
- QueryParam: Type map[string]string; Default nil; extra query params

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

Sends a lightweight signal to all subscribers of a channel.

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
- Message (required): Type interface; payload
- Channel (required): Type string; destination channel ID
- CustomMessageType: Type string; same constraints as in Publish (3–50 chars, alphanumeric, dashes/underscores allowed, not starting with special chars or pn_/pn-). Examples: text, action, poll.

### Sample code

#### Signal a message to a channel

```
1
  
```

### Response

- Timestamp
  - Type: int
  - Timetoken when Signal was sent

## Subscribe

### Receive messages

Use event listeners to receive messages, signals, and events on subscribed channels. See Event Listeners.

### Description

Opens a TCP socket and listens for messages on specified channels. Requires SubscribeKey at initialization. By default, you receive only messages published after Subscribe() completes.

- Connectivity notification: wait for envelope.status before publishing to avoid race conditions.
- Automatic reconnect and catch-up: set restore=true; default reconnect after 320 seconds timeout.
- Unsubscribing from all channels resets last-received timetoken and may cause message gaps.

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
- Channels: Type []string; subscribe to channels; either channel or channel group is required
- ChannelGroups: Type []string; subscribe to channel groups; either channel or channel group is required
- Timetoken: Type int64; start from specific timetoken
- WithPresence: Type bool; also subscribe to presence
- QueryParam: Type map[string]string; extra query params

### Sample code

Subscribe to a channel:

```
1
  
```

### Response

PNMessage is delivered via Listeners.

Subscribe() returns PNStatus:
- Category: StatusCategory (see Go SDK listener categories)
- Error: bool
- ErrorData: error
- StatusCode: int
- Operation: OperationType

Subscribe() message payloads:
- PNMessage
  - Message: interface
  - Channel: string
  - Subscription: string
  - Timetoken: int64
  - UserMetadata: interface
  - SubscribedChannel: string
  - Publisher: string
- PNPresence
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
- PNUUIDEvent
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
- PNChannelEvent
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
- PNMembershipEvent
  - Event: PNObjectsEvent (PNObjectsEventRemove, PNObjectsEventSet)
  - Timestamp: string
  - Subscription: string
  - SubscribedChannel: string
  - Channel: string
  - ChannelID: string
  - UUID: string
  - Custom: map[string]interface
- PNMessageActionsEvent
  - Event: PNMessageActionsEventType (PNMessageActionsAdded, PNMessageActionsRemoved)
  - Data: PNMessageActionsResponse (Message Actions)
  - Subscription: string
  - SubscribedChannel: string
  - Channel: string

### Other examples

#### Basic subscribe with logging

```
1
  
```

#### Subscribing to multiple channels

Use channel multiplexing. Wildcard Subscribe and Channel Groups also supported (requires Stream Controller enabled).

```
1
  
```

#### Subscribing to a Presence channel

Requires Presence add-on enabled. To subscribe to a channel’s Presence, append -pnpres (for example, my_channel-pnpres).

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

When presence_deltas is enabled, interval messages may include:
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

If the interval message exceeds ~30 KB, extra fields are omitted and here_now_refresh=true is set. Perform hereNow to fetch users.

#### Wildcard subscribe to channels

Requires Stream Controller add-on (Enable Wildcard Subscribe). Only one level wildcard (a.*) is supported.

```
1
  
```

#### Subscribing with state

Requires Presence. Always set and persist a unique UUID for the user/device.

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

Unsubscribe from one or more channels. For multiplexed subscriptions, the socket closes only when no channels remain.

Unsubscribing from all channels resets the last-received timetoken and can cause message gaps if you immediately subscribe elsewhere.

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
- Channels: Type []string; Default false; unsubscribe from channels; channel or channelGroup required
- ChannelGroups: Type []string; Default false; unsubscribe from channel groups; channel or channelGroup required
- QueryParam: Type map[string]string; Default nil; extra query params

### Sample code

Unsubscribe from a channel:

```
1
  
```

##### Event listeners

Subscription responses are handled by Listener (see Event Listeners).

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

Unsubscribe from all channels and all channel groups.

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