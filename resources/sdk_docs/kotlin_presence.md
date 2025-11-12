# Presence API for Kotlin SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, and updates asynchronous callbacks and emitted status events. Review the Java/Kotlin SDK migration guide for details.

Presence provides:
- Join/leave events
- Channel occupancy counts
- Channels a UUID is subscribed to
- Presence state per UUID

Learn more in the Presence overview.

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

## Here now[​](#here-now)

##### Requires Presence
Presence add-on must be enabled for your key in the Admin Portal. See Presence Events to receive presence updates.

Returns current channel state: list of UUIDs subscribed and total occupancy.

##### Cache
3-second response cache.

### Method(s)[​](#methods)

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
- channels (List<String>, default: emptyList()) — Channels to query.
- channelGroups (List<String>, default: emptyList()) — Channel groups to query. Wildcards not supported.
- includeState (Boolean, default: false) — Include users’ presence state.
- includeUUIDs (Boolean, default: true) — Include UUIDs of connected clients.
- limit (Int, default: 1000) — Max occupants per channel. Range: 0–1000. 0 = occupancy only (UUIDs omitted).
- offset (Int?, default: null) — Zero-based start index for pagination. Must be >= 0 and requires limit > 0.

### Sample code[​](#sample-code)

##### Reference code
Use as a template for executing examples below.

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
1
  

```

### Returns[​](#returns)
hereNow() returns PNHereNowResult? with:
- totalChannels (Int) — Total channels
- totalOccupancy (Int) — Total occupancy
- channels (Map<String, PNHereNowChannelData>) — Per-channel details

PNHereNowChannelData:
- channelName (String)
- occupancy (Int)
- occupants (List<PNHereNowOccupantData>)

PNHereNowOccupantData:
- uuid (String)
- state (JsonElement?)

### Other examples[​](#other-examples)

#### Returning state[​](#returning-state)

##### Requires Presence
Presence add-on must be enabled. See Presence Events.

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

#### Return occupancy only[​](#return-occupancy-only)

##### Requires Presence
Presence add-on must be enabled. See Presence Events.

Return occupancy only for a single channel by disabling UUIDs:

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

#### Here now for channel groups[​](#here-now-for-channel-groups)

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

## Where now[​](#where-now)

##### Requires Presence
Presence add-on must be enabled. See Presence Events.

Returns the list of channels a UUID is subscribed to.

##### Timeout events
If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)[​](#methods-1)

```
`1pubnub.whereNow(  
2    uuid: String  
3).async { result -> }  
`
```

Parameters:
- uuid (String) — UUID to query.

### Sample code[​](#sample-code-1)

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
1
  

```

### Returns[​](#returns-1)
whereNow() returns PNWhereNowResult? with:
- channels (List<String>) — Channels where the uuid is present.

### Other examples[​](#other-examples-1)

#### Obtain information about the current list of channels of some other UUID[​](#obtain-information-about-the-current-list-of-channels-of-some-other-uuid)

```
1
  

```

## User state[​](#user-state)

##### Requires Presence
Presence add-on must be enabled. See Presence State for details.

Clients can set dynamic custom state for their users on one or more channels while subscribed. State isn’t persisted and is lost on disconnect.

##### Presence state format
State must be a JsonObject (or a POJO serializable to JsonObject).

### Method(s)[​](#methods-2)

#### Set state[​](#set-state)

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
- channels (List<String>) — Channels to set state on.
- channelGroups (List<String>) — Channel groups to set state on.
- state (Any) — The state to set (JsonObject/serializable).
- uuid (String) — UUID to set state for.

#### Get state[​](#get-state)

```
`1pubnub.getPresenceState(  
2    channels: ListString>,  
3    channelGroups: ListString>,  
4    uuid: String  
5).async { result -> }  
`
```

Parameters:
- channels (List<String>) — Channels to get state of.
- channelGroups (List<String>) — Channel groups to get state of.
- uuid (String) — UUID to get state for.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)
setPresenceState() returns PNSetStateResult? with:
- state (JsonElement) — The actual state object

getPresenceState() returns PNSetStateResult? with:
- stateByUUID (Map<String, JsonElement>) — Map of UUIDs to user states

### Other examples[​](#other-examples-2)

#### Set state for channels in channel group[​](#set-state-for-channels-in-channel-group)

```
1
  

```

#### Get state for UUID[​](#get-state-for-uuid)

```
1
**
```

Last updated on Oct 21, 2025**