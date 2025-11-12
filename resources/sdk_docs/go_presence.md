# Presence API for Go SDK

Presence lets you track who is online/offline and store custom state. It shows:
- Join/leave events
- Channel occupancy
- Channels a UUID is subscribed to
- Presence state per user

Learn more in the Presence overview.

## Here now

##### Requires Presence

Returns current state of channels: list of UUIDs and total occupancy.

##### Cache
3-second response cache time.

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
- Channels (Type: []string, required): Channels to query.
- ChannelGroups (Type: []string): Channel groups to query. Wildcards not supported.
- IncludeState (Type: bool, default: false): Include presence states of users.
- IncludeUUIDs (Type: bool, default: true): Include UUIDs of connected clients.
- Limit (Type: int, default: 1000): 0–1000. 0 returns occupancy counts only (no user details).
- Offset (Type: int, default: 0): Zero-based starting index. Requires Limit > 0. Only included when Offset > 0. Use with Limit to paginate.
- QueryParam (Type: map[string]string, default: nil): Custom query string parameters.

### Sample code

##### Reference code
Use as a template when working with examples below.

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

##### Requires Presence

```
1
  

```

#### Return occupancy only

##### Requires Presence

You can return only occupancy for a single channel by setting UUIDs to false.

```
1
  

```

#### Here now for channel groups

```
1
  

```

## Where now

##### Requires Presence

Returns the list of channels a UUID is subscribed to.

##### Timeout events
If the app restarts (or page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pn.WhereNow().  
2    UUID(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- UUID (Type: string, required): UUID to query. If omitted, uses the current PubNub instance UUID.
- QueryParam (Type: map[string]string, default: nil): Custom query string parameters.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

### Rest response from server

- Channels (Type: []string): Channels where the UUID is present.

### Other examples

If UUID is omitted, the current instance UUID is used.

```
1
  

```

## User state

##### Requires Presence

Clients can set dynamic custom state (for example, score or location) for users per channel while subscribed. State is not persisted and is lost on disconnect. See Presence State.

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
- Channels (Type: []string): Channels to set state on.
- ChannelGroups (Type: []string): Channel groups to set state on.
- State (Type: map[string]interface): State to set.
- UUID (Type: string): Set state for this UUID.
- QueryParam (Type: map[string]string): Custom query string parameters.

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
- Channels (Type: []string): Channels to get state from.
- ChannelGroups (Type: []string): Channel groups to get state from.
- UUID (Type: string): Get state for this UUID.
- QueryParam (Type: map[string]string): Custom query string parameters.

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

##### Requires Presence

Send presence heartbeat notifications without subscribing. Configure presence timeout and interval during Configuration.

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
- Connected (Type: bool): true to mark as connected (join), false to mark as offline (leave).
- Channels (Type: []string): Channels whose presence state should change.
- ChannelGroups (Type: []string): Channel groups whose presence state should change.

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