# Presence API for Go SDK

Presence tracks online/offline status and custom state. It shows:
- Join/leave events
- Occupancy (subscriber counts)
- Subscriptions per UUID
- Presence state per UUID

Learn more in Presence overview and Presence Events.

## Here now

Requires Presence (enable in Admin Portal). Returns current state of channels: list of UUIDs and total occupancy. Cache: 3 seconds.

### Method(s)

```
`1pn.HereNow().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    IncludeState(bool).  
5    IncludeUUIDs(bool).  
6    Limit(int).  
7    Offset(int).  
8    QueryParam(queryParam).  
9    Execute()  
`
```

Parameters:
- Channels (Type: []string): Channels to query.
- ChannelGroups (Type: []string): Channel groups to query. Wildcards not supported.
- IncludeState (Type: bool, Default: false): Include presence state for users.
- IncludeUUIDs (Type: bool, Default: true): Include UUIDs of connected clients.
- Limit (Type: int, Default: 1000): Max occupants per channel. Range 0–1000. Use 0 for occupancy-only (no user details).
- Offset (Type: int, Default: 0): Zero-based index for pagination. Must be >= 0 and requires Limit > 0. Only sent when > 0.
- QueryParam (Type: map[string]string, Default: nil): Appends query string parameters.

### Sample code

#### Reference code

#### Get a list of UUIDs subscribed to channel

```
1
  

```

### Rest response from server

PNHereNowResult:
- TotalChannels (Type: int): Total channels.
- TotalOccupancy (Type: int): Total occupancy.
- Channels (Type: []HereNowChannelData)

HereNowChannelData:
- ChannelName (Type: string): Channel name.
- Occupancy (Type: int): Channel occupancy.
- Occupants (Type: []HereNowOccupantsData)

HereNowOccupantsData:
- UUID (Type: string): User UUID.
- State (Type: map[string]interface): User state.

### Other examples

#### Returning state

Requires Presence.

```
1
  

```

#### Return occupancy only

Requires Presence. For a single channel, set IncludeUUIDs/UUIDs to false to return occupancy only.

```
1
  

```

#### Here now for channel groups

```
1
  

```

## Where now

Requires Presence. Returns the list of channels a UUID is subscribed to. Timeout events: if the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pn.WhereNow().  
2    UUID(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- UUID (Type: string): UUID to query.
- QueryParam (Type: map[string]string, Default: nil): Appends query string parameters.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

### Rest response from server

- Channels (Type: []string): Channels where the UUID is present.

### Other examples

If UUID is omitted, the current PubNub instance UUID is used.

```
1
  

```

## User state

Requires Presence. Clients can set/get dynamic custom state (not persisted; lost on disconnect).

### Method(s)

#### Set state

```
`1pn.SetState().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    State(map[string]interface{}).  
5    UUID(string).  
6    QueryParam(queryParam).  
7    Execute()  
`
```

Parameters:
- Channels (Type: []string): Channels to set state.
- ChannelGroups (Type: []string): Channel groups to set state.
- State (Type: map[string]interface): State to set.
- UUID (Type: string): UUID for which to set state.
- QueryParam (Type: map[string]string): Appends query string parameters.

#### Get state

```
`1pn.GetState().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    UUID(string).  
5    QueryParam(queryParam).  
6    Execute()  
`
```

Parameters:
- Channels (Type: []string): Channels to get state.
- ChannelGroups (Type: []string): Channel groups to get state.
- UUID (Type: string): UUID for which to get state.
- QueryParam (Type: map[string]string): Appends query string parameters.

### Sample code

#### Set state

```
1
  

```

#### Get state

```
1
  

```

### Response

SetState() → PNSetStateResult:
- State (Type: interface): Map of UUIDs and user states.

GetState() → PNGetStateResult:
- State (Type: map[string]interface): Map of UUIDs and user states.

### Other examples

#### Set state for channels in a channel group

```
1
  

```

#### Get state for multiple channels

```
1
  

```

## Heartbeat without subscription

Requires Presence. Send periodic presence heartbeats without subscribing. Configure presence timeout and interval during Configuration.

### Method(s)

```
`1pn.Presence().  
2    Connected(bool).  
3    Channels([]‌string).  
4    ChannelGroups([]string).  
5    Execute()  
`
```

Parameters:
- Connected (Type: bool): true to mark connected (join), false to mark offline (leave).
- Channels (Type: []string): Channels whose presence state should be changed.
- ChannelGroups (Type: []string): Channel groups whose presence state should be changed.

### Sample code

```
1
  

```

### Other examples

#### To stop heartbeating without subscription to channel or channel group

```
1
**
```

Last updated on Nov 10, 2025**