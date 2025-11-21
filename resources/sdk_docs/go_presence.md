# Presence API for Go SDK

Presence tracks online/offline status and optional custom state. It shows:
- Join/leave events per channel
- Channel occupancy (user count)
- Channels a UUID is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. See Presence overview and Presence Events for details.

## Here now

Returns the current state of channels: UUIDs present and occupancy counts.

Cache: 3-second response cache time.

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
- Channels
  - Type: []string
  - Default: n/a
  - The channels to get here-now details.
- ChannelGroups
  - Type: []string
  - Default: n/a
  - Channel groups to get here-now details. Wildcards are not supported.
- IncludeState
  - Type: bool
  - Default: false
  - If true, include presence state for users.
- IncludeUUIDs
  - Type: bool
  - Default: true
  - If true, include UUIDs of connected clients.
- Limit
  - Type: int
  - Default: 1000
  - Max occupants per channel to return. Range 0–1000. Use 0 for occupancy counts only (no UUIDs).
- Offset
  - Type: int
  - Default: 0
  - Zero-based start index for pagination. Must be >= 0 and requires Limit > 0. Use with Limit to paginate. Only included when Offset > 0.
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Extra query string parameters.

### Sample code

Reference code
```
1
  
```

#### Get a list of UUIDs subscribed to channel

```
1
  
```

### REST response

PNHereNowResult fields:
- TotalChannels
  - Type: int
  - Total channels
- TotalOccupancy
  - Type: int
  - Total occupancy
- Channels
  - Type: []HereNowChannelData

HereNowChannelData:
- ChannelName
  - Type: string
  - Channel name
- Occupancy
  - Type: int
  - Channel occupancy
- Occupants
  - Type: []HereNowOccupantsData

HereNowOccupantsData:
- UUID
  - Type: string
  - User UUID
- State
  - Type: map[string]interface
  - User state

### Other examples

Returning state
```
1
  
```

Return occupancy only (set IncludeUUIDs/UUIDs to false)
```
1
  
```

Here now for channel groups
```
1
  
```

## Where now

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pn.WhereNow().  
2    UUID(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- UUID
  - Type: string
  - Default: n/a
  - UUID to query.
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Extra query string parameters.

### Sample code

Get a list of channels a UUID is subscribed to
```
1
  
```

### REST response

- Channels
  - Type: []string
  - Channels where the UUID is present.

### Other examples

Omit UUID to use the current PubNub instance UUID
```
1
  
```

## User state

Clients can set dynamic custom state (for example, score, game state, location) per channel while subscribed. State is not persisted and is lost on disconnect. See Presence State for details.

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
- Channels
  - Type: []string
  - Channels to set state.
- ChannelGroups
  - Type: []string
  - Channel groups to set state.
- State
  - Type: map[string]interface
  - State to set.
- UUID
  - Type: string
  - Set presence state for this UUID.
- QueryParam
  - Type: map[string]string
  - Extra query string parameters.

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
- Channels
  - Type: []string
  - Channels to get state.
- ChannelGroups
  - Type: []string
  - Channel groups to get state.
- UUID
  - Type: string
  - Get presence state for this UUID.
- QueryParam
  - Type: map[string]string
  - Extra query string parameters.

### Sample code

Set state
```
1
  
```

Get state
```
1
  
```

### Response

SetState() returns PNSetStateResult:
- State
  - Type: interface
  - Map of UUIDs and user states.

GetState() returns PNGetStateResult:
- State
  - Type: map[string]interface
  - Map of UUIDs and user states.

### Other examples

Set state for channels in a channel group
```
1
  
```

Get state for multiple channels
```
1
  
```

## Heartbeat without subscription

Send presence heartbeat notifications without subscribing to a channel. Configure presence timeout and interval during SDK configuration.

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
- Connected
  - Type: bool
  - Set presence to connected (true to join) or offline (false to leave).
- Channels
  - Type: []string
  - Channels to apply the presence state change.
- ChannelGroups
  - Type: []string
  - Channel groups to apply the presence state change.

### Sample code

```
1
  
```

### Other examples

To stop heartbeating without subscription to channel or channel group
```
1
**
```