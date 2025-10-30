# Presence API for Go SDK

Presence tracks who is online/offline and stores presence state:
- Join/leave events per channel
- Occupancy (user count) per channel
- Channels a UUID is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. See Presence overview and Presence Events.

## Here now

Returns current state of channels: list of UUIDs subscribed and total occupancy.

- Cache: 3-second response cache time.

### Method(s)

```
`1pn.HereNow().  
2    Channels([]string).  
3    ChannelGroups([]string).  
4    IncludeState(bool).  
5    IncludeUUIDs(bool).  
6    QueryParam(queryParam).  
7    Execute()  
`
```

Parameters:
- Channels (Type: []string): Channels to query.
- ChannelGroups (Type: []string): Channel groups to query. Wildcards not supported.
- IncludeState (Type: bool, Default: false): Include users’ presence state.
- IncludeUUIDs (Type: bool, Default: true): Include UUIDs of connected clients.
- QueryParam (Type: map[string]string, Default: nil): Extra query string parameters.

### Sample code

Reference code

#### Get a list of UUIDs subscribed to channel

```
1
  

```

### Rest response from server

HereNow() returns PNHereNowResult:
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

```
1
  

```

#### Return occupancy only

You can return only occupancy for a single channel by specifying the channel and setting UUIDs to false:

```
1
  

```

#### Here now for channel groups

```
1
  

```

## Where now

Returns list of channels a UUID is subscribed to.

- Timeout events: If the app restarts (or page refreshes) within the heartbeat window, no timeout event is generated.

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
- QueryParam (Type: map[string]string, Default: nil): Extra query string parameters.

### Sample code

You simply need to define the UUID.

#### Get a list of channels a UUID is subscribed to

```
1
  

```

### Rest response from server

- Channels (Type: []string): Channels where the UUID is present.

### Other examples

If UUID is omitted, the current PubNub instance’s UUID is used.

```
1
  

```

## User state

Clients can set dynamic custom state (for example, score, game state, location) per channel while subscribed. State is not persisted and is lost when the client disconnects. See Presence State.

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
- UUID (Type: string): UUID to set presence state for.
- QueryParam (Type: map[string]string): Extra query string parameters.

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
- UUID (Type: string): UUID to retrieve presence state for.
- QueryParam (Type: map[string]string): Extra query string parameters.

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

SetState() returns PNSetStateResult:
- State (Type: interface): Map of UUIDs and user states.

GetState() returns PNGetStateResult:
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

Send presence heartbeat notifications without subscribing. Configure presence timeout and interval in Configuration.

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
- Connected (Type: bool): true to join (online), false to leave (offline).
- Channels (Type: []string): Channels whose presence state to change.
- ChannelGroups (Type: []string): Channel groups whose presence state to change.

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

Last updated on Oct 29, 2025