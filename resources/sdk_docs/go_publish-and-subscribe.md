# Publish/Subscribe API for Go SDK (Condensed)

PubNub delivers messages globally with low latency. Use these APIs to publish, fire, signal, subscribe, and unsubscribe.

For conceptual guidance see Connection Management and Publish Messages.

## Publish

Use Publish() to send JSON-serializable data to a single channel. You must initialize PubNub with publishKey. You don't need to be subscribed to publish. You can't publish to multiple channels simultaneously.

Security:
- Enable TLS/SSL by setting ssl=true during initialization. You can also encrypt messages with CryptoModule.

Message data:
- Send JSON-serializable data (objects, arrays, numbers, strings). Avoid special classes/functions.
- Do not JSON serialize message or meta; pass objects directly.

Size:
- Max message size: 32 KiB (includes escaped characters and channel name). Aim under ~1,800 bytes for best performance.
- Exceeding the limit returns Message Too Large.

Publish rate:
- Publish as fast as bandwidth allows. Soft throughput limit applies; subscribers with slow consumption may drop messages.
- In-memory queue holds 100 messages.

Custom message type:
- Optional CustomMessageType to label messages (for example, text, action, poll). Case-sensitive, 3–50 chars, alphanumeric plus - and _. Cannot start with special chars or pn_ / pn-.

Best practices:
- Publish serially; check success ([1,"Sent","<timetoken>"]) before sending next; retry on failure.
- Keep queue < 100; throttle bursts (e.g., ≤5 msg/s) to meet latency needs.

### Method(s)

To Publish a message use:

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
- Message (required) Type: interface — Payload.
- Channel (required) Type: string — Destination channel ID.
- ShouldStore Type: bool — Store in history (default: account setting).
- UsePost Type: bool — Use POST (default: false).
- Meta Type: interface — Metadata for message filtering.
- TTL Type: int — Per-message time to live in Message Persistence.
- QueryParam Type: map[string]string — Key/values appended to request query string.
- CustomMessageType Type: string — Business-specific label (see constraints above).

### Sample code

##### Reference code

```
1
  
```

#### Publish a message to a channel

```
1
  
```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel.

### Response

- Timestamp Type: int — Timetoken when the message was published.

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

Use the helper to format payloads for Push messages.

```
1
  
```

## Fire

fire() sends a message to Functions event handlers and Illuminate on the target channel. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message use:

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
- Message (required) Type: interface — Payload.
- Channel (required) Type: string — Destination channel ID.
- UsePost Type: bool — Use POST (default: false).
- Meta Type: interface — Metadata for filtering.
- TTL Type: int — Per-message TTL in Message Persistence.
- QueryParam Type: map[string]string — Query parameters.

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

signal() sends a lightweight payload to all subscribers of a channel.

Limits:
- Default payload size limit: 64 bytes (payload only). Contact support for larger limits.

### Method(s)

To Signal a message use:

```
`1pubnub.Signal().  
2    Message(interface{}).  
3    Channel(string).  
4    CustomMessageType(string).  
5    Execute()  
`
```

Parameters:
- Message (required) Type: interface — Payload.
- Channel (required) Type: string — Destination channel ID.
- CustomMessageType Type: string — Business-specific label (same constraints as Publish).

### Sample code

#### Signal a message to a channel

```
1
  
```

### Response

- Timestamp Type: int — Timetoken when the signal was sent.

## Subscribe

Receive messages and events via event listeners. Requires subscribeKey at initialization. By default, only messages published after Subscribe() completes are received.

Connectivity:
- Use envelope.status to detect readiness and avoid publish-before-subscribe race conditions.
- Set restore=true to recover missed messages after disconnect. Default reconnect after exceeding 320s connection timeout.

Unsubscribing from all channels resets the last timetoken and may cause message gaps.

### Method(s)

To Subscribe to a channel use:

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
- Channels Type: []string — Channels to subscribe to (channel or channel group required).
- ChannelGroups Type: []string — Channel groups to subscribe to (channel or channel group required).
- Timetoken Type: int64 — Start from a specific timetoken.
- WithPresence Type: bool — Subscribe to presence events for these channels.
- QueryParam Type: map[string]string — Query parameters.

### Sample code

Subscribe to a channel:

```
1
  
```

### Response

PNMessage is returned via event listeners.

Subscribe() returns:
- PNStatus:
  - Category: StatusCategory — See Go SDK listener categories.
  - Error: bool — True on error.
  - ErrorData: error — Error info if Error is true.
  - StatusCode: int — HTTP status.
  - Operation: OperationType — Operation type.

- PNMessage (for Publish and Signal):
  - Message: interface — Payload.
  - Channel: string — Channel ID.
  - Subscription: string — Channel group or wildcard match (if any).
  - Timetoken: int64 — Message timetoken.
  - UserMetadata: interface — User metadata.
  - SubscribedChannel: string — Current subscribed channel.
  - Publisher: string — Publisher UUID.

- PNPresence:
  - Event: string — join, leave, timeout, state-change.
  - UUID: string — UUID for event.
  - Timestamp: int64 — Event timestamp.
  - Occupancy: int — Current occupancy.
  - Subscription: string — Channel on which event was received.
  - Timetoken: int64 — Timetoken.
  - State: interface — UUID state.
  - UserMetadata: map[string]interface — User metadata.
  - SubscribedChannel: string — Current subscribed channel.
  - Channel: string — Channel ID.

- PNUUIDEvent (UUID Events):
  - Event: PNObjectsEvent — PNObjectsEventRemove, PNObjectsEventSet.
  - Timestamp: string — Event timestamp.
  - Subscription: string — Channel on which event was received.
  - SubscribedChannel: string — Current subscribed channel.
  - Channel: string — Channel ID.
  - UUID: string — UUID.
  - Name: string — Display name.
  - ExternalID: string — External identifier.
  - ProfileURL: string — Profile picture URL.
  - Email: string — Email address.
  - Custom: map[string]interface — Custom fields.
  - Updated: string — Last updated time.
  - ETag: string — ETag.

- PNChannelEvent (Channel Events):
  - Event: PNObjectsEvent — PNObjectsEventRemove, PNObjectsEventSet.
  - Timestamp: string — Event timestamp.
  - Subscription: string — Channel on which event was received.
  - SubscribedChannel: string — Current subscribed channel.
  - Channel: string — Channel ID.
  - ChannelID: string — Channel ID.
  - Name: string — Display name.
  - Description: string — Description.
  - Custom: map[string]interface — Custom fields.
  - Updated: string — Last updated time.
  - ETag: string — ETag.

- PNMembershipEvent (Membership Events):
  - Event: PNObjectsEvent — PNObjectsEventRemove, PNObjectsEventSet.
  - Timestamp: string — Event timestamp.
  - Subscription: string — Channel on which event was received.
  - SubscribedChannel: string — Current subscribed channel.
  - Channel: string — Channel ID.
  - ChannelID: string — Channel ID.
  - UUID: string — UUID.
  - Custom: map[string]interface — Custom fields.

- PNMessageActionsEvent (Message Actions):
  - Event: PNMessageActionsEventType — PNMessageActionsAdded, PNMessageActionsRemoved.
  - Data: PNMessageActionsResponse — Message Actions payload.
  - Subscription: string — Channel on which event was received.
  - SubscribedChannel: string — Current subscribed channel.
  - Channel: string — Channel ID.

### Other examples

#### Basic subscribe with logging

```
1
  
```

#### Subscribing to multiple channels

Multiplexing allows subscribing to multiple channels.

```
1
  
```

#### Subscribing to a Presence channel

Requires Presence. Subscribe to my_channel-pnpres to receive presence events for my_channel.

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

When presence_deltas is enabled, interval messages may include joined, left, timedout arrays. If >30KB, here_now_refresh=true indicates you should call hereNow for full list.

```
`if presence.Event == "interval" {  
    presence.UUID // 175c2c67-b2a9-470d-8f4b-1db94f90e39e  
    presence.Timestamp // 1345546797  
    presence.Occupancy // 2  
}  
`
```

Example with deltas:

```
`if presence.Event == "interval" {  
    presence.Occupancy // # users in channel  
    presence.Join // [uuid1 uuid2]  
    presence.Timeout //[uuid3]  
    presence.Timestamp // unix timestamp  
}  
`
```

#### Wildcard subscribe to channels

Requires Stream Controller (Enable Wildcard Subscribe). Only one level of wildcarding (a.*) is supported.

```
1
  
```

#### Subscribing with state

Requires Presence. Always set and persist UUID to uniquely identify the user/device.

```
1
  
```

#### Subscribe to a channel group

Requires Stream Controller.

```
1
  
```

#### Subscribe to the Presence channel of a channel group

Requires Stream Controller and Presence.

```
1
  
```

## Unsubscribe

Unsubscribe removes channels; closing the socket only when no channels remain. Unsubscribing from all channels resets the last timetoken and may cause message gaps.

### Method(s)

To Unsubscribe from a channel use:

```
`1pn.Unsubscribe().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels Type: []string — Channels to unsubscribe (channel or channelGroup required).
- ChannelGroups Type: []string — Channel groups to unsubscribe (channel or channelGroup required).
- QueryParam Type: map[string]string — Query parameters.

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

Requires Stream Controller.

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

Requires Stream Controller.

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