# Publish/Subscribe API for Go SDK (Condensed)

PubNub delivers messages worldwide in under 30 ms. Publish to one or many subscribers on a channel.

- Initialize with publishKey.
- You don't need to be subscribed to publish.
- You can't publish to multiple channels simultaneously.

Secure transport with TLS/SSL by setting ssl=true at initialization. Optionally enable message encryption. Message payloads must be JSON-serializable. Pass objects directly; don't JSON-serialize message or meta (PubNub handles serialization).

Max message size: 32 KiB (includes escaped characters and channel name). Aim for < 1,800 bytes. Exceeding limit returns Message Too Large. Throughput is soft-limited; in-memory queue stores 100 messages per subscriber. Publish serially and verify success before sending next. Optionally include CustomMessageType (for business labels like text, action, poll).

## Publish

- Size: 32 KiB max (payload + channel). 
- Rate: Publish serially; verify success; retry on failure; keep queue under 100; throttle if needed.
- CustomMessageType: optional, 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn-.

### Method(s)

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
- Message (required): Type interface — payload.
- Channel (required): Type string — channel ID.
- ShouldStore: Type bool, Default: account default — store in history.
- UsePost: Type bool, Default: false — use POST to publish.
- Meta: Type interface, Default: null — metadata for filtering.
- TTL: Type int — per-message time to live in Message Persistence.
- QueryParam: Type map[string]string, Default: nil — additional query string parameters.
- CustomMessageType: Type string — business-specific label for the message.

### Sample code

#### Publish a message to a channel

```
1
  
```

Before running the publish example, subscribe to the same channel (via Debug Console or another script) so you can receive the message.

### Response

- Timestamp: Type int — timetoken when the message was published.

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

Use helper to format payloads for Push messages; pass its output to Message.

```
1
  
```

## Fire

Sends a message directly to Functions event handlers and Illuminate on the target channel. Not replicated to subscribers; not stored in history.

### Method(s)

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
- Message (required): Type interface — payload.
- Channel (required): Type string — channel ID.
- UsePost: Type bool, Default: false — use POST.
- Meta: Type interface, Default: null — metadata for filtering.
- TTL: Type int — per-message TTL in persistence.
- QueryParam: Type map[string]string, Default: nil — additional query parameters.

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

Sends a lightweight signal to all channel subscribers.

- Payload size limit: 64 bytes (payload only; URI/headers excluded). Contact support for higher limits.

### Method(s)

```
`1pubnub.Signal().  
2    Message(interface{}).  
3    Channel(string).  
4    CustomMessageType(string).  
5    Execute()  
`
```

Parameters:
- Message (required): Type interface — payload.
- Channel (required): Type string — channel ID.
- CustomMessageType: Type string — business-specific label (same constraints as Publish).

### Sample code

#### Signal a message to a channel

```
1
  
```

### Response

- Timestamp: Type int — timetoken when Signal was sent.

## Subscribe

Receive messages via event listeners (messages, signals, presence, objects, message actions). Requires subscribeKey at initialization. Newly subscribed clients receive messages after Subscribe() completes.

- Connectivity notification: check envelope.status before publishing to avoid race conditions.
- Auto-reconnect and catch-up: set restore=true; default reconnect after 320 seconds timeout.
- Unsubscribing from all channels resets last timetoken and can cause gaps.

### Method(s)

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
- Channels: Type []string — channel IDs.
- ChannelGroups: Type []string — channel groups.
- Timetoken: Type int64 — start from timetoken.
- WithPresence: Type bool — also subscribe to presence events for those channels.
- QueryParam: Type map[string]string — additional query parameters.

### Sample code

Subscribe to a channel:

```
1
  
```

### Response

PNMessage (delivered via listeners):
- Message: Type interface — payload.
- Channel: Type string — channel ID.
- Subscription: Type string — channel group or wildcard match (if any).
- Timetoken: Type int64 — message timetoken.
- UserMetadata: Type interface — user metadata.
- SubscribedChannel: Type string — the subscribed channel.
- Publisher: Type string — publisher UUID.

PNStatus (subscribe operation status):
- Category: StatusCategory — see Go SDK listener categories.
- Error: bool — whether an error occurred.
- ErrorData: error — error details when Error is true.
- StatusCode: int — HTTP status code.
- Operation: OperationType — operation type.

PNPresence:
- Event: Type string — join, leave, timeout, state-change, interval.
- UUID: Type string — UUID for event.
- Timestamp: Type int64 — timestamp.
- Occupancy: Type int — current occupancy.
- Subscription: Type string — channel ID where received.
- Timetoken: Type int64 — timetoken.
- State: Type interface — UUID state.
- UserMetadata: Type map[string]interface — user metadata.
- SubscribedChannel: Type string — subscribed channel.
- Channel: Type string — channel ID for event.

PNUUIDEvent (UUID Events):
- Event: Type PNObjectsEvent — PNObjectsEventRemove, PNObjectsEventSet.
- Timestamp: Type string.
- Subscription: Type string.
- SubscribedChannel: Type string.
- Channel: Type string.
- UUID: Type string.
- Name: Type string — display name.
- ExternalID: Type string — external system ID.
- ProfileURL: Type string — profile picture URL.
- Email: Type string.
- Custom: Type map[string]interface.
- Updated: Type string — last updated date.
- ETag: Type string.

PNChannelEvent (Channel Events):
- Event: Type PNObjectsEvent — PNObjectsEventRemove, PNObjectsEventSet.
- Timestamp: Type string.
- Subscription: Type string.
- SubscribedChannel: Type string.
- Channel: Type string.
- ChannelID: Type string.
- Name: Type string.
- Description: Type string.
- Custom: Type map[string]interface.
- Updated: Type string.
- ETag: Type string.

PNMembershipEvent (Membership Events):
- Event: Type PNObjectsEvent — PNObjectsEventRemove, PNObjectsEventSet.
- Timestamp: Type string.
- Subscription: Type string.
- SubscribedChannel: Type string.
- Channel: Type string.
- ChannelID: Type string.
- UUID: Type string.
- Custom: Type map[string]interface.

PNMessageActionsEvent (Message Actions Events):
- Event: Type PNMessageActionsEventType — PNMessageActionsAdded, PNMessageActionsRemoved.
- Data: Type PNMessageActionsResponse — message actions payload.
- Subscription: Type string.
- SubscribedChannel: Type string.
- Channel: Type string.

### Other examples

#### Basic subscribe with logging

```
1
  
```

#### Subscribing to multiple channels

Use array of channels (Multiplexing). Alternative: Wildcard Subscribe and Channel Groups (requires Stream Controller add-on enabled in Admin Portal).

```
1
  
```

#### Subscribing to a Presence channel

Requires Presence add-on enabled. Presence channel is <channel>-pnpres (for my_channel, subscribe to my_channel-pnpres).

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

When presence_deltas pnconfig flag is enabled and channel is in interval mode, interval messages may include arrays: joined, left, timedout. If the interval message exceeds ~30 KB, extra fields are omitted and here_now_refresh=true indicates a hereNow request is needed for full user list.

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

#### Wildcard subscribe to channels

Requires Stream Controller add-on (Enable Wildcard Subscribe). One-level wildcard only (a.*). The * refers to any portion after the dot. Grants/revokes respect one-level wildcards; a.b.* or * are treated as literal names if used beyond one level.

```
1
  
```

#### Subscribing with state

Requires Presence add-on. Always set a stable UUID for the user/device; persist it.

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

Leaves specified channels or groups. For multiplexed subscriptions, removes only specified items; socket closes when no subscriptions remain.

Unsubscribing from all channels resets last timetoken and can cause gaps.

### Method(s)

```
`1pn.Unsubscribe().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels: Type []string, Default: false — unsubscribe from channels.
- ChannelGroups: Type []string, Default: false — unsubscribe from channel groups.
- QueryParam: Type map[string]string, Default: nil — additional query parameters.

### Sample code

Unsubscribe from a channel:

```
1
  
```

Event responses are delivered via listeners.

### Rest response from server

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