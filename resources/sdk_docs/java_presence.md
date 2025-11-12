# Presence API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK 9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, async API callbacks, and emitted status events. Apps using versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Presence lets you:
- Detect join/leave events
- Get occupancy counts per channel
- See which channels a UUID is subscribed to
- Manage per-user presence state

See Presence overview and Presence Events for more context.

## Here now

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal.

Returns current channel state: list of UUIDs and total occupancy.

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
- channels (Array): Channels to query.
- channelGroups (Arrays): Channel groups to query. Wildcards not supported.
- includeState (Boolean, default false): Include user presence state.
- includeUUIDs (Boolean, default true): Include connected client UUIDs.
- limit (int, default 1000): Max occupants per channel. Range 0–1000. 0 returns only occupancy counts (server omits UUIDs entirely).
- offset (Integer, default null): Zero-based index for pagination. Must be >= 0. Requires limit > 0.
- async (Consumer<Result>): Consumer of a Result of type PNHereNowResult.

### Sample code

##### Reference code

#### Get a list of UUIDs subscribed to channel

```
1
  
```

### Returns

PNHereNowResult:
- getTotalChannels(): Int — total channels.
- getTotalOccupancy(): Int — total occupancy.
- getChannels(): Map<String, PNHereNowChannelData> — per-channel data.

#### PNHereNowChannelData
- getChannelName(): String
- getOccupancy(): Int
- getOccupants(): List<PNHereNowOccupantData>

#### PNHereNowOccupantData
- getUuid(): String
- getState(): Object

### Other examples

#### Returning state

```
1
  
```

#### Return occupancy only
You can return only the occupancy information for a single channel by specifying the channel and setting UUIDs to false:

```
1
  
```

#### Here now for channel groups

```
1
  
```

## Where now

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal.

Returns the list of channels a UUID is subscribed to.

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
- async (Command): Execute as async.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  
```

### Returns

PNWhereNowResult:
- getChannels(): List<String> — channels where the UUID is present.

### Other examples

#### Obtain information about the current list of channels of some other UUID

```
1
  
```

## User state

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal.

Clients can set dynamic custom state (score, game state, location) per channel while subscribed. State is not persisted; it is lost on disconnect. See Presence State.

##### Presence state format
Presence state must be a JsonObject (or POJO serializable to JsonObject).

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
- uuid (String): UUID to target.
- async (Consumer<Result>): Consumer of a Result of type PNSetStateResult.

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
- async (Consumer<Result>): Consumer of a Result of type PNGetStateResult.

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

setPresenceState() → PNSetStateResult:
- getState(): Map<String, Object> — map of UUIDs and states.

getPresenceState() → PNGetStateResult:
- getStateByUUID(): Map<String, Object> — map of UUIDs and states.

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