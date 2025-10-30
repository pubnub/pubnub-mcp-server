# Presence API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java/Kotlin SDKs, changes PubNub client instantiation, async API callbacks, and emitted status events. Apps built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Presence tracks who is online/offline and user state:
- Join/leave events
- Occupancy per channel
- Channels a user/device is subscribed to
- Presence state for users

Learn more in the Presence overview.

## Here now

##### Requires Presence
Enable the Presence add-on for your key in the Admin Portal. See Presence Events to subscribe to presence channels.

Returns current state of a channel: list of UUIDs currently subscribed and total occupancy.

##### Cache
3-second response cache.

### Method(s)

```
`1this.pubnub.hereNow()  
2    .channels(Array)  
3    .channelGroups(Arrays)  
4    .includeState(true)  
5    .includeUUIDs(true)  
6    .limit(int)  
7    .offset(Integer)  
`
```

Parameters:
- channels (Array): Channels to get here-now details.
- channelGroups (Arrays): Channel groups to get here-now details. Wildcards not supported.
- includeState (Boolean, default false): Include presence state of users.
- includeUUIDs (Boolean, default true): Include UUIDs of connected clients.
- limit (int, default 1000): Max occupants per channel (0–1000). Server enforces 1000. Use 0 for occupancy only; UUIDs omitted when limit=0.
- offset (Integer, default null): Zero-based index for pagination. Must be >= 0 and requires limit > 0.
- async (Consumer<Result>): Consumer of PNHereNowResult.

### Sample code

##### Reference code
Self-contained snippet with imports and console logging.

#### Get a list of UUIDs subscribed to channel
```
1
  

```

### Returns
hereNow() returns PNHereNowResult with:
- getTotalChannels() -> Int: Total channels.
- getTotalOccupancy() -> Int: Total occupancy.
- getChannels() -> Map<String, PNHereNowChannelData>: Per-channel data.

#### PNHereNowChannelData
- getChannelName() -> String: Channel name.
- getOccupancy() -> Int: Channel occupancy.
- getOccupants() -> List<PNHereNowOccupantData>: Occupants.

#### PNHereNowOccupantData
- getUuid() -> String: User UUID.
- getState() -> Object: User state.

### Other examples

#### Returning state

##### Requires Presence
Enable Presence add-on. See Presence Events to subscribe to presence channels.

```
1
  

```

#### Return occupancy only

##### Requires Presence
Enable Presence add-on. See Presence Events to subscribe to presence channels.

Return only occupancy by setting UUIDs to false (and/or limit=0):
```
1
  

```

#### Here now for channel groups
```
1
  

```

## Where now

##### Requires Presence
Enable Presence add-on. See Presence Events to subscribe to presence channels.

Returns list of channels a UUID is subscribed to.

##### Timeout events
If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)
```
`1pubnub.whereNow()  
2    .uuid(String)  
`
```

Parameters:
- uuid (String): UUID to query.
- async: Execute as async.

### Sample code
Define uuid and callback:

#### Get a list of channels a UUID is subscribed to
```
1
  

```

### Returns
whereNow() returns PNWhereNowResult with:
- getChannels() -> List<String>: Channels where the UUID is present.

### Other examples

#### Obtain information about the current list of channels of some other UUID
```
1
  

```

## User state

##### Requires Presence
Enable Presence add-on. See Presence Events to subscribe to presence channels.

Clients can set dynamic custom state (score, game state, location) per channel while subscribed. State isn’t persisted and is lost on disconnect. See Presence State.

##### Presence state format
State must be a JsonObject (or POJO serializable to JsonObject).

### Method(s)

#### Set state
```
`1this.pubnub.setPresenceState()  
2    .channels(Array)  
3    .channelGroups(Array)  
4    .state(HashMap)  
5    .uuid(String)  
`
```

Parameters:
- channels (Array): Channels to set state on.
- channelGroups (Array): Channel groups to set state on.
- state (HashMap): State to set.
- uuid (String): UUID to set state for.
- async (Consumer<Result>): Consumer of PNSetStateResult.

#### Get state
```
`1this.pubnub.getPresenceState()  
2    .channels(Arrays)  
3    .channelGroups(Arrays)  
4    .uuid(String)  
`
```

Parameters:
- channels (Arrays): Channels to fetch state for.
- channelGroups (Arrays): Channel groups to fetch state for.
- uuid (String): UUID.
- async (Consumer<Result>): Consumer of PNGetStateResult.

### Sample code

#### Set state
```
1
  

```

#### Get state
```
1
  

```

### Returns
setPresenceState() returns PNSetStateResult with:
- getState() -> Map<String, Object>: Map of UUIDs and user states.

getPresenceState() returns PNGetStateResult with:
- getStateByUUID() -> Map<String, Object>: Map of UUIDs and user states.

### Other examples

#### Set state for channels in channel group
```
1
  

```

The above code would return the following response to the client:
```
1
**
```