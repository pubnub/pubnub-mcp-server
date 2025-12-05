# Presence API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK 9.0.0 unifies Java and Kotlin SDKs, introduces a new client instantiation, and changes asynchronous callbacks and emitted status events. See the Java/Kotlin SDK migration guide.

Presence tracks who is online/offline, occupancy counts, subscriptions, and user presence state. See the Presence overview.

## Here now

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal. To receive presence events, see Presence Events.

Returns current state of a channel: list of UUIDs and total occupancy.

##### Cache
3-second response cache time.

### Method(s)
To call Here Now, use:

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
- channels (Array, required): Channels to get here-now details.
- channelGroups (Arrays): Channel groups to get here-now details. Wildcards not supported.
- includeState (Boolean, default false): Include presence state for users.
- includeUUIDs (Boolean, default true): Include UUIDs of connected clients.
- limit (int, default 1000): Max occupants per channel. Valid: 0–1000. Server enforces 1000. Use 0 to return only occupancy (UUIDs omitted).
- offset (Integer, default null): Zero-based starting index for pagination. Must be >= 0 and requires limit > 0.
- async (Consumer<Result>): Consumer of PNHereNowResult.

### Sample code

##### Reference code
Self-contained runnable snippet with imports and console logging.

#### Get a list of UUIDs subscribed to channel
```
1
  

```

### Returns
hereNow() returns PNHereNowResult:

- getTotalChannels(): Int — Total channels.
- getTotalOccupancy(): Int — Total occupancy.
- getChannels(): Map<String, PNHereNowChannelData> — Data per channel.

#### PNHereNowChannelData
- getChannelName(): String — Channel name.
- getOccupancy(): Int — Channel occupancy.
- getOccupants(): List<PNHereNowOccupantData> — Occupants list.

#### PNHereNowOccupantData
- getUuid(): String — User UUID.
- getState(): Object — User state.

### Other examples

#### Returning state
```
1
  

```

#### Return occupancy only
You can return only occupancy for a single channel by setting UUIDs to false:
```
1
  

```

#### Here now for channel groups
```
1
  

```

## Where now

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal. To receive presence events, see Presence Events.

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
- uuid (String, required): UUID to query.
- async: Execute as async.

### Sample code
#### Get a list of channels a UUID is subscribed to
```
1
  

```

### Returns
whereNow() returns PNWhereNowResult:
- getChannels(): List<String> — Channels where the UUID is present.

### Other examples
#### Obtain information about the current list of channels of some other UUID
```
1
  

```

## User state

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal. Clients can set dynamic custom state for users on one or more channels; state is not persisted and is lost on disconnect. See Presence State.

##### Presence state format
Presence state must be expressed as a JsonObject (or POJO serializable to JsonObject).

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
- channels (Array): Channels to set state.
- channelGroups (Array): Channel groups to set state.
- state (HashMap): State to set.
- uuid (String): Set state for specific UUID.
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
- channels (Arrays): Channel(s) to fetch state.
- channelGroups (Arrays): Channel group(s) to fetch state.
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
setPresenceState() returns PNSetStateResult:
- getState(): Map<String, Object> — Map of UUIDs and user states.

getPresenceState() returns PNGetStateResult:
- getStateByUUID(): Map<String, Object> — Map of UUIDs and user states.

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

Last updated on Oct 21, 2025**