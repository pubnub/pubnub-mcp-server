# Channel Groups API – PubNub Kotlin SDK

## Breaking changes in v9.0.0
• Unified Java/Kotlin codebases, new client instantiation, new async callbacks/status events.  
• Applications < 9.0.0 must follow the Java/Kotlin migration guide.

## Key points
• Channel Groups bundle many channels under one name. You can subscribe to—​but **not publish** to—a channel group.  
• All requests return an `Endpoint`; execute with `.sync()` or `.async()`.

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

## Add channels to a group  
Requires Stream Controller add-on.

Maximum 200 channels per call.

```kotlin
`pubnub.addChannelsToChannelGroup(  
    channelGroup: String,  
    channels: List<String>  
).async { result -> }  
`
```

Parameters  
• `channelGroup` (String): target group.  
• `channels` (List<String>): channels to add.

```kotlin
`  
`
```

Return: no payload; check `result.isFailure` / `onFailure`.

---

## List channels in a group  
Requires Stream Controller add-on.

```kotlin
`pubnub.listChannelsForChannelGroup(  
    channelGroup: String  
).async { result -> }  
`
```

Parameter  
• `channelGroup` (String): group name.

```kotlin
`  
`
```

Returns `PNChannelGroupsAllChannelsResult`  
• `channels`: `List<String>`.

---

## Remove channels from a group  
Requires Stream Controller add-on.

```kotlin
`pubnub.removeChannelsFromChannelGroup(  
    channels: List<String>,  
    channelGroup: String  
).async { result -> }  
`
```

Parameters  
• `channels` (List<String>): channels to remove.  
• `channelGroup` (String): source group.

```kotlin
`  
`
```

Return: no payload; evaluate `result`.

---

## Delete a channel group  
Requires Stream Controller add-on.

```kotlin
`pubnub.deleteChannelGroup(  
    channelGroup: String  
).async { result -> }  
`
```

Parameter  
• `channelGroup` (String): group to delete.

```kotlin
`  
`
```

Return: no payload; evaluate `result`.

_Last updated: Jul 15 2025_