# Presence API – Kotlin SDK (v9+)

## About v9.0.0
SDK v9 unifies the Java/Kotlin code-base, changes client instantiation, async callbacks, and status events. See the Java/Kotlin migration guide for details.

## General notes
* Presence add-on must be enabled in the Admin Portal for all Presence operations.
* Every Endpoint must be executed with `.sync()` or `.async()`, otherwise it will not run.

```kotlin
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

## hereNow()
Returns current occupants of channels / channel-groups.

Cache TTL: 3 s.

```kotlin
`pubnub.hereNow(  
    channels: List<String>,  
    channelGroups: List<String>,  
    includeState: Boolean,  
    includeUUIDs: Boolean  
).async { result -> }  
`
```

Parameters  
• channels – target channels (List<String>)  
• channelGroups – target groups (List<String>)  
• includeState (Boolean, default false) – return presence state.  
• includeUUIDs (Boolean, default true) – return UUID list.

Returns `PNHereNowResult?`  
• totalChannels : Int  
• totalOccupancy : Int  
• channels : Map<String, PNHereNowChannelData>

`PNHereNowChannelData`  
• channelName : String  
• occupancy : Int  
• occupants : List<PNHereNowOccupantData>

`PNHereNowOccupantData`  
• uuid : String  
• state : JsonElement?

### Examples
Reference snippet (empty placeholder kept):

```kotlin
`  
`
```

Return state:

```kotlin
`.async { result: Result<PNHereNowResult> ->  
    result.onSuccess { res ->  
        res.channels.values.forEach { channelData ->  
            channelData.channelName // ch1  
            channelData.occupancy   // 3  
            channelData.occupants.forEach { o ->  
                o.uuid              // some_uuid  
                o.state             // {"data":{"isTyping":true}}  
            }  
        }  
    }.onFailure { e ->  
        e.message  
        e.statusCode  
        e.pubnubError  
`
```

Occupancy only (set includeUUIDs =false):

```kotlin
`  
`
```

```kotlin
`.async { result: Result<PNHereNowResult> ->  
    result.onSuccess { res ->  
        res.channels.values.forEach { c ->  
            c.channelName // ch1  
            c.occupancy   // 3  
        }  
    }.onFailure { e ->  
        e.message  
        e.statusCode  
        e.pubnubError  
    }  
}  
`
```

Channel-group:

```kotlin
`  
`
```

```kotlin
`.async { result: Result<PNHereNowResult> ->  
    result.onSuccess { res ->  
        res.totalOccupancy  
    }.onFailure { e ->  
        e.message  
        e.statusCode  
        e.pubnubError  
    }  
}  
`
```

---

## whereNow()
Lists channels to which a UUID is currently subscribed.

```kotlin
`pubnub.whereNow(  
    uuid: String  
).async { result -> }  
`
```

Parameter  
• uuid – target UUID (String)

Returns `PNWhereNowResult?`  
• channels : List<String>

Examples:

```kotlin
`  
`
```

```kotlin
`  
`
```

---

## Presence State

Presence state is a transient JsonObject attached to a UUID on specific channels / groups.

### setPresenceState()

```kotlin
`pubnub.setPresenceState(  
    channels: List<String>,  
    channelGroups: List<String>,  
    state: Any,  
    uuid: String  
).async { result -> }  
`
```

Parameters  
• channels – channels to set.  
• channelGroups – groups to set.  
• state – JsonObject/POJO.  
• uuid – target UUID.

Returns `PNSetStateResult?`  
• state : JsonElement

### getPresenceState()

```kotlin
`pubnub.getPresenceState(  
    channels: List<String>,  
    channelGroups: List<String>,  
    uuid: String  
).async { result -> }  
`
```

Parameters identical to `setPresenceState`.

Returns `PNSetStateResult?`  
• stateByUUID : Map<String, JsonElement>

### Samples

```kotlin
`  
`
```

Set state for channels in a group:

```kotlin
`  
`
```

Get state for UUID:

```kotlin
`**`
```

---

_Last updated: Jul 15 2025_