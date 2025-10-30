# Presence API for Kotlin SDK

Presence lets you track online/offline status and store custom state. It shows:
- Join/leave events per channel
- Occupancy (number of subscribed users)
- Channels a user/device is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. For receiving presence events, see Presence Events.

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDK codebases, introduces a new PubNub client instantiation, and changes async callbacks and emitted status events. See Java/Kotlin SDK migration guide.

##### Request execution
Most method calls return an Endpoint. You must call .sync() or .async() to execute.

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

Requires Presence. Returns current channel state: list of UUIDs subscribed and total occupancy. Response is cached for 3 seconds.

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
- channels (List<String>, default emptyList()): Channels to query.
- channelGroups (List<String>, default emptyList()): Channel groups to query. Wildcards not supported.
- includeState (Boolean, default false): Include presence state of users.
- includeUUIDs (Boolean, default true): Include UUIDs of connected clients.
- limit (Int, default 1000): Max occupants per channel. Valid: 0–1000. 0 returns occupancy only (no UUIDs).
- offset (Int?, default null): Zero-based starting index for pagination. Requires limit > 0. Non-negative.

### Sample code

##### Reference code
Self-contained snippet with console logging.

#### Get a list of UUIDs subscribed to channel

```
1
  
```

### Returns

hereNow() returns PNHereNowResult? with:
- totalChannels (Int): Total channels.
- totalOccupancy (Int): Total occupants.
- channels (Map<String, PNHereNowChannelData>): Per-channel data.

PNHereNowChannelData:
- channelName (String)
- occupancy (Int)
- occupants (List<PNHereNowOccupantData>)

PNHereNowOccupantData:
- uuid (String)
- state (JsonElement?)

### Other examples

#### Returning state

Requires Presence.

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

Requires Presence. Return only occupancy by setting UUIDs to false.

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

Requires Presence. Returns list of channels a UUID is subscribed to.

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
- uuid (String): UUID to query.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  
```

### Returns

whereNow() returns PNWhereNowResult? with:
- channels (List<String>): Channels where the uuid is present.

### Other examples

#### Obtain information about the current list of channels of some other UUID

```
1
  
```

## User state

Requires Presence. Clients can set dynamic custom state (e.g., score, location) per channel while subscribed. State isn’t persisted and is lost on disconnect. See Presence State.

##### Presence state format
State must be a JsonObject (or POJO serializable to JsonObject). Supply an initialized JsonObject when calling setState.

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
- channels (List<String>): Channels to set state on.
- channelGroups (List<String>): Channel groups to set state on.
- state (Any): State to set.
- uuid (String): UUID to set state for.

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
- channels (List<String>): Channels to get state from.
- channelGroups (List<String>): Channel groups to get state from.
- uuid (String): UUID to get state for.

### Sample code

```
1
  
```

### Returns

setPresenceState() returns PNSetStateResult? with:
- state (JsonElement): The state object.

getPresenceState() returns PNSetStateResult? with:
- stateByUUID (Map<String, JsonElement>): UUID-to-state map.

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