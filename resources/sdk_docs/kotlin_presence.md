# Presence API – Kotlin SDK v9+

Requires PubNub “Presence” add-on to be enabled for your keys.

## v9.0.0 NOTE  
SDK was unified with the Java implementation. Instantiation, async callbacks, and status events changed. See the Java/Kotlin migration guide for details.

## Request execution  
Every endpoint returns an `Endpoint` object. Always finish the call with `.sync()` or `.async { … }` or nothing happens.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

---

## Here Now

Returns current occupants and occupancy for channels and/or channel groups. Response is cached for 3 s.

### Method

```
`pubnub.hereNow(  
    channels: ListString>,  
    channelGroups: ListString>,  
    includeState: Boolean,      // default false  
    includeUUIDs: Boolean       // default true  
).async { result -> }  
`
```

Parameter summary  
• `channels` `List<String>` – channels to query  
• `channelGroups` `List<String>` – channel groups to query  
• `includeState` `Boolean` – add user state to the response  
• `includeUUIDs` `Boolean` – add occupant UUIDs to the response  

### Return type

`PNHereNowResult`  
• `totalChannels : Int`  
• `totalOccupancy : Int`  
• `channels : Map<String, PNHereNowChannelData>`

`PNHereNowChannelData`  
• `channelName : String`  
• `occupancy : Int`  
• `occupants : List<PNHereNowOccupantData>`

`PNHereNowOccupantData`  
• `uuid : String`  
• `state : JsonElement?`

### Examples

#### Basic
```
`  
`
```

#### Returning State
```
`  
`
```

Example response
```
`.async { result: ResultPNHereNowResult> ->  
    result.onSuccess { res: PNHereNowResult ->  
        res.channels.values.forEach { channelData ->  
            channelData.channelName // ch1  
            channelData.occupancy // 3  
            channelData.occupants.forEach { o ->  
                o.uuid // some_uuid  
                o.state // {"data":{"isTyping":true}}  
            }  
        }  
    }.onFailure { e ->  
        // handle error  
        e.message  
        e.statusCode  
        e.pubnubError  
`
```

#### Occupancy-only
```
`  
`
```

Example response
```
`.async { result: ResultPNHereNowResult> ->  
    result.onSuccess { res: PNHereNowResult ->  
        res.channels.values.forEach { channelData ->  
            channelData.channelName // ch1  
            channelData.occupancy // 3  
        }  
    }.onFailure { e ->  
        // handle error  
    }  
}  
`
```

#### Channel Groups
```
`  
`
```

Example response
```
`.async { result: ResultPNHereNowResult> ->  
    result.onSuccess { res: PNHereNowResult ->  
        res.totalOccupancy  
    }.onFailure { e ->  
        // handle error  
    }  
}  
`
```

---

## Where Now

Returns the list of channels a UUID is currently occupying (no timeout event if reconnect occurs inside the heartbeat window).

### Method

```
`pubnub.whereNow(  
    uuid: String  
).async { result -> }  
`
```

Parameter  
• `uuid` `String` – target UUID.

### Return type

`PNWhereNowResult`  
• `channels : List<String>`

### Examples

```
`  
`
```

```
`  
`
```

---

## User State

Set or get custom JSON state (not persisted) for a UUID on specific channels/groups.

State must be a valid `JsonObject` or serializable POJO.

### Set State

```
`pubnub.setPresenceState(  
    channels: ListString>,  
    channelGroups: ListString>,  
    state: Any,                // JsonObject / POJO  
    uuid: String               // target UUID  
).async { result -> }  
`
```

### Get State

```
`pubnub.getPresenceState(  
    channels: ListString>,  
    channelGroups: ListString>,  
    uuid: String  
).async { result -> }  
`
```

Parameters  
• `channels` `List<String>` – target channels  
• `channelGroups` `List<String>` – target channel groups  
• `state` `Any` – state to set (setState only)  
• `uuid` `String` – target UUID  

### Return types

`PNSetStateResult` from both calls  
• `state : JsonElement` (set)  
• `stateByUUID : Map<String, JsonElement>` (get)

### Examples
```
`  
`
```

```
`  
`
```

```
`**`
```

*(Last updated: Jun 16 2025)*