# Presence API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK 9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, and updates asynchronous API callbacks and emitted status events. Apps built with versions < 9.0.0 may be affected. See Java/Kotlin SDK migration guide.

Presence tracks online/offline users, occupancy, channel subscriptions, and presence state. See Presence overview.

## Here now[​](#here-now)

##### Requires Presence

Enable the Presence add-on in the Admin Portal. To receive presence events, see Presence Events.

Returns current channel state: list of UUIDs and total occupancy.

##### Cache

3-second response cache.

### Method(s)[​](#methods)

To call Here Now use:

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
- channels
  - Type: Array
  - Default: n/a
  - Channels to get here-now details.
- channelGroups
  - Type: Arrays
  - Default: n/a
  - Channel groups to get here-now details. Wildcards not supported.
- includeState
  - Type: Boolean
  - Default: false
  - Include presence state of users for channels/channelGroups.
- includeUUIDs
  - Type: Boolean
  - Default: true
  - Include UUIDs of connected clients.
- limit
  - Type: int
  - Default: 1000
  - Max occupants per channel. Valid 0–1000. Server enforces 1000 and rejects out-of-range. Use 0 for occupancy-only (UUIDs omitted).
- offset
  - Type: Integer
  - Default: null
  - Zero-based start index for pagination. Requires limit > 0. Must be >= 0.
- async
  - Type: Consumer<Result>
  - Consumer of a Result of type PNHereNowResult.

### Sample code[​](#sample-code)

##### Reference code

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
1
  

```

### Returns[​](#returns)

hereNow() returns PNHereNowResult:

- getTotalChannels()
  - Type: Int
  - Total channels.
- getTotalOccupancy()
  - Type: Int
  - Total occupancy.
- getChannels()
  - Type: Map<String, PNHereNowChannelData>
  - Per-channel data.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

- getChannelName()
  - Type: String
  - Channel name.
- getOccupancy()
  - Type: Int
  - Channel occupancy.
- getOccupants()
  - Type: List<PNHereNowOccupantData>
  - List of occupants.

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

- getUuid()
  - Type: String
  - User UUID.
- getState()
  - Type: Object
  - User state.

### Other examples[​](#other-examples)

#### Returning state[​](#returning-state)

##### Requires Presence

Enable the Presence add-on in the Admin Portal. See Presence Events.

```
1
  

```

#### Return occupancy only[​](#return-occupancy-only)

##### Requires Presence

Enable the Presence add-on in the Admin Portal. See Presence Events.

Return only occupancy for a single channel by specifying the channel and setting UUIDs to false:

```
1
  

```

#### Here now for channel groups[​](#here-now-for-channel-groups)

```
1
  

```

## Where now[​](#where-now)

##### Requires Presence

Enable the Presence add-on in the Admin Portal. See Presence Events.

Returns the list of channels a UUID is subscribed to.

##### Timeout events

If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)[​](#methods-1)

```
`1pubnub.whereNow()  
2    .uuid(String)  
`
```

Parameters:
- uuid
  - Type: String
  - UUID to query.
- async
  - Type: Command
  - Execute as async.

### Sample code[​](#sample-code-1)

Define the uuid and callback to receive data.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
1
  

```

### Returns[​](#returns-1)

whereNow() returns PNWhereNowResult:

- getChannels()
  - Type: List<String>
  - Channels where the UUID is present.

### Other examples[​](#other-examples-1)

#### Obtain information about the current list of channels of some other UUID[​](#obtain-information-about-the-current-list-of-channels-of-some-other-uuid)

```
1
  

```

## User state[​](#user-state)

##### Requires Presence

Enable the Presence add-on in the Admin Portal. See Presence Events.

Clients can set dynamic custom state (for example, score, game state, location) per channel while subscribed. State isn’t persisted; it’s lost on disconnect. See Presence State.

##### Presence state format

Presence state must be a JsonObject (or POJO serializable to JsonObject).

### Method(s)[​](#methods-2)

#### Set state[​](#set-state)

```
`1this.pubnub.setPresenceState()  
2    .channels(Array)  
3    .channelGroups(Array)  
4    .state(HashMap)  
5    .uuid(String)  
`
```

Parameters:
- channels
  - Type: Array
  - Channels to set state.
- channelGroups
  - Type: Array
  - Channel groups to set state.
- state
  - Type: HashMap
  - State to set.
- uuid
  - Type: String
  - UUID to set state for.
- async
  - Type: Consumer<Result>
  - Consumer of a Result of type PNSetStateResult.

#### Get state[​](#get-state)

```
`1this.pubnub.getPresenceState()  
2    .channels(Arrays)  
3    .channelGroups(Arrays)  
4    .uuid(String)  
`
```

Parameters:
- channels
  - Type: Arrays
  - Channel name(s) to fetch state.
- channelGroups
  - Type: Arrays
  - Channel group name(s) to fetch state.
- uuid
  - Type: String
  - UUID.
- async
  - Type: Consumer<Result>
  - Consumer of a Result of type PNGetStateResult.

### Sample code[​](#sample-code-2)

#### Set state[​](#set-state-1)

```
1
  

```

#### Get state[​](#get-state-1)

```
1
  

```

### Returns[​](#returns-2)

setPresenceState() returns PNSetStateResult:
- getState()
  - Type: Map<String, Object>
  - Map of UUIDs and user states.

getPresenceState() returns PNGetStateResult:
- getStateByUUID()
  - Type: Map<String, Object>
  - Map of UUIDs and user states.

### Other examples[​](#other-examples-2)

#### Set state for channels in channel group[​](#set-state-for-channels-in-channel-group)

```
1
  

```

The above code would return the following response to the client:

```
1
**
```
Last updated on Oct 21, 2025**