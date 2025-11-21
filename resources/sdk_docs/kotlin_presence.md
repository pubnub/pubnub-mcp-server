# Presence API for Kotlin SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK 9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, asynchronous API callbacks, and emitted status events. Apps built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Presence provides:
- Join/leave notifications
- Occupancy counts
- Channels per user/device
- Presence state per user

##### Request execution
Most SDK methods return an Endpoint. You must call .sync() or .async() to execute.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## Here now

##### Requires Presence
Enable the Presence add-on for your key in the Admin Portal. See Presence Events to receive presence events.

Returns current state of channels: list of UUIDs and total occupancy.

##### Cache
3-second response cache.

### Method(s)
```
`1pubnub.hereNow(  
2    channels: ListString>,  
3    channelGroups: ListString>,  
4    includeState: Boolean,  
5    includeUUIDs: Boolean,  
6    limit: Int,  
7    offset: Int?  
8).async { result -> }  
`
```

Parameters:
- channels: List<String>, default emptyList() — Channels to query.
- channelGroups: List<String>, default emptyList() — Channel groups to query. Wildcards not supported.
- includeState: Boolean, default false — Include presence states for occupants.
- includeUUIDs: Boolean, default true — Include occupant UUIDs.
- limit: Int, default 1000 — Max occupants per channel, range 0–1000. 0 returns occupancy only (UUIDs omitted).
- offset: Int?, default null — Zero-based start index for pagination. Must be >= 0 and requires limit > 0.

### Sample code

##### Reference code
```
1
  
```

#### Get a list of UUIDs subscribed to channel
```
1
  
```

### Returns
hereNow() returns PNHereNowResult?:
- totalChannels: Int — Total channels.
- totalOccupancy: Int — Total occupancy.
- channels: Map<String, PNHereNowChannelData> — Per-channel data.

PNHereNowChannelData:
- channelName: String — Channel name.
- occupancy: Int — Occupancy.
- occupants: List<PNHereNowOccupantData> — Occupants list.

PNHereNowOccupantData:
- uuid: String — User UUID.
- state: JsonElement? — User state.

### Other examples

#### Returning state

##### Requires Presence
Enable the Presence add-on for your key in the Admin Portal.

```
1
  
```

Example response:
```
`1.async { result: ResultPNHereNowResult> ->  
2    result.onSuccess { res: PNHereNowResult ->  
3        res.channels.values.forEach { channelData ->  
4            channelData.channelName // ch1  
5            channelData.occupancy // 3  
6            channelData.occupants.forEach { o ->  
7                o.uuid // some_uuid, returned by default  
8                o.state // {"data":{"isTyping":true}}, requested  
9            }  
10        }  
11    }.onFailure { e ->  
12        // handle error  
13        e.message  
14        e.statusCode  
15        e.pubnubError  
16    }  
17}  
`
```

#### Return occupancy only

##### Requires Presence
Enable the Presence add-on for your key in the Admin Portal.

Specify the channel and disable UUIDs (or set limit=0) to return occupancy only.
```
1
  
```

Example response:
```
`1.async { result: ResultPNHereNowResult> ->  
2    result.onSuccess { res: PNHereNowResult ->  
3        res.channels.values.forEach { channelData ->  
4            channelData.channelName // ch1  
5            channelData.occupancy // 3  
6        }  
7    }.onFailure { e ->  
8        // handle error  
9        e.message  
10        e.statusCode  
11        e.pubnubError  
12    }  
13}  
`
```

#### Here now for channel groups
```
1
  
```

Example response:
```
`1.async { result: ResultPNHereNowResult> ->  
2    result.onSuccess { res: PNHereNowResult ->  
3        res.totalOccupancy  
4    }.onFailure { e ->  
5        // handle error  
6        e.message  
7        e.statusCode  
8        e.pubnubError  
9    }  
10}  
`
```

## Where now

##### Requires Presence
Enable the Presence add-on for your key in the Admin Portal.

Returns the list of channels a UUID is subscribed to.

##### Timeout events
If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)
```
`1pubnub.whereNow(  
2    uuid: String  
3).async { result -> }  
`
```

Parameters:
- uuid: String — UUID whose channel subscriptions to fetch.

### Sample code

#### Get a list of channels a UUID is subscribed to
```
1
  
```

### Returns
whereNow() returns PNWhereNowResult?:
- channels: List<String> — Channels where the UUID is present.

### Other examples

#### Obtain information about the current list of channels of some other UUID
```
1
  
```

## User state

##### Requires Presence
Enable the Presence add-on for your key in the Admin Portal.

Clients can set dynamic custom state for users on one or more channels for as long as they’re subscribed. State isn’t persisted after disconnect.

##### Presence state format
State must be a JsonObject (or a POJO serializable to JsonObject).

### Method(s)

#### Set state
```
`1pubnub.setPresenceState(  
2    channels: ListString>,  
3    channelGroups: ListString>,  
4    state: Any,  
5    uuid: String  
6).async { result -> }  
`
```

Parameters:
- channels: List<String> — Channels to set state on.
- channelGroups: List<String> — Channel groups to set state on.
- state: Any — State to set (JsonObject/serializable).
- uuid: String — UUID to set state for.

#### Get state
```
`1pubnub.getPresenceState(  
2    channels: ListString>,  
3    channelGroups: ListString>,  
4    uuid: String  
5).async { result -> }  
`
```

Parameters:
- channels: List<String> — Channels to get state for.
- channelGroups: List<String> — Channel groups to get state for.
- uuid: String — UUID to get state for.

### Sample code
```
1
  
```

### Returns
setPresenceState() returns PNSetStateResult?:
- state: JsonElement — The state object.

getPresenceState() returns PNSetStateResult?:
- stateByUUID: Map<String, JsonElement> — Map of UUIDs to user states.

### Other examples

#### Set state for channels in channel group
```
1
  
```

#### Get state for UUID
```
1
**
```

Last updated on Oct 21, 2025**