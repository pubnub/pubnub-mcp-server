# Presence API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and emitted status events. Apps using < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Presence tracks online/offline users, occupancy, subscriptions, and per-user presence state. See Presence overview.

##### Request execution
Most SDK method calls return an Endpoint you must execute with .sync() or .async(), otherwise nothing happens.

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

Requires Presence (enable in Admin Portal). 3-second response cache. Returns current channel state: UUID list and occupancy.

### Method(s)
```
pubnub.hereNow(
    channels: List<String>,
    channelGroups: List<String>,
    includeState: Boolean,
    includeUUIDs: Boolean,
    limit: Int,
    offset: Int?
).async { result -> }
```

Parameters:
- channels (List<String>, default: emptyList()) — Channels to fetch.
- channelGroups (List<String>, default: emptyList()) — Channel groups to fetch. Wildcards not supported.
- includeState (Boolean, default: false) — Include presence state in response.
- includeUUIDs (Boolean, default: true) — Include UUIDs of connected clients.
- limit (Int, default: 1000) — 0–1000. Server enforces max 1000; 0 returns occupancy only (UUIDs omitted).
- offset (Int?, default: null) — Zero-based pagination start. Requires limit > 0. Must be >= 0.

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
PNHereNowResult?:
- totalChannels: Int
- totalOccupancy: Int
- channels: Map<String, PNHereNowChannelData>

PNHereNowChannelData:
- channelName: String
- occupancy: Int
- occupants: List<PNHereNowOccupantData>

PNHereNowOccupantData:
- uuid: String
- state: JsonElement?

### Other examples

#### Returning state
```
1
  

```

Example response:
```
1.async { result: ResultPNHereNowResult> ->  
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
```

#### Return occupancy only
You can return only occupancy for a single channel by setting UUIDs to false or limit = 0.
```
1
  

```

Example response:
```
1.async { result: ResultPNHereNowResult> ->  
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
```

#### Here now for channel groups
```
1
  

```

Example response:
```
1.async { result: ResultPNHereNowResult> ->  
2    result.onSuccess { res: PNHereNowResult ->  
3        res.totalOccupancy  
4    }.onFailure { e ->  
5        // handle error  
6        e.message  
7        e.statusCode  
8        e.pubnubError  
9    }  
10}  
```

## Where now

Requires Presence. Returns the list of channels a UUID is currently subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)
```
pubnub.whereNow(
    uuid: String
).async { result -> }
```

Parameters:
- uuid (String, required) — User UUID.

### Sample code

#### Get a list of channels a UUID is subscribed to
```
1
  

```

### Returns
PNWhereNowResult?:
- channels: List<String>

### Other examples

#### Obtain information about channels of another UUID
```
1
  

```

## User state

Requires Presence. Clients can set/get transient custom state (for one or more channels) while subscribed. State is not persisted after disconnect. Presence state must be a JsonObject (or POJO serializable to JsonObject).

### Method(s)

#### Set state
```
pubnub.setPresenceState(
    channels: List<String>,
    channelGroups: List<String>,
    state: Any,
    uuid: String
).async { result -> }
```

Parameters:
- channels (List<String>, required) — Channels to set state on.
- channelGroups (List<String>, required) — Channel groups to set state on.
- state (Any, required) — JsonObject or serializable POJO.
- uuid (String, required) — UUID to set state for.

#### Get state
```
pubnub.getPresenceState(
    channels: List<String>,
    channelGroups: List<String>,
    uuid: String
).async { result -> }
```

Parameters:
- channels (List<String>, required) — Channels to get state for.
- channelGroups (List<String>, required) — Channel groups to get state for.
- uuid (String, required) — UUID to get state for.

### Sample code
```
1
  

```

### Returns
setPresenceState(): PNSetStateResult?:
- state: JsonElement

getPresenceState(): PNSetStateResult?:
- stateByUUID: Map<String, JsonElement>

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

Last updated on Oct 21, 2025