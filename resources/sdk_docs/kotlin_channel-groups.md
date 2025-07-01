# Channel Groups API – Kotlin SDK

## Breaking changes in v9.0.0
• Unified Kotlin and Java codebases, new client instantiation, updated async callbacks/status events.  
• Applications built with < 9.0.0 must follow the Java/Kotlin migration guide.

## Key points
• Channel groups bundle up to thousands of channels.  
• You can **subscribe** to a group; publishing must target individual channels.  
• All group operations require the **Stream Controller** add-on (enable it in the Admin Portal).  
• Every SDK call returns an `Endpoint`; execute with `.sync()` or `.async()` or nothing happens.

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

## Add Channels to a Group  
Maximum 200 channels per call.

```
`pubnub.addChannelsToChannelGroup(  
    channelGroup: String,  
    channels: ListString>  
).async { result -> }  
`
```

Parameters  
• `channelGroup` (String) – target group.  
• `channels` (List<String>) – channels to add.  

Response: no payload; verify via `result.isFailure` / `onFailure`.

---

## List Channels in a Group

```
`pubnub.listChannelsForChannelGroup(  
    channelGroup: String  
).async { result -> }  
`
```

Parameters  
• `channelGroup` (String) – group name.  

Returns `PNChannelGroupsAllChannelsResult`  
• `channels` (List<String>) – channels contained in the group.

---

## Remove Channels from a Group

```
`pubnub.removeChannelsFromChannelGroup(  
    channels: ListString>,  
    channelGroup: String  
).async { result -> }  
`
```

Parameters  
• `channels` (List<String>) – channels to remove.  
• `channelGroup` (String) – group name.  

Response: none; check result for success/failure.

---

## Delete a Channel Group

```
`pubnub.deleteChannelGroup(  
    channelGroup: String  
).async { result -> }  
`
```

Parameter  
• `channelGroup` (String) – group to delete.  

Response: none; check result for success/failure.

_Last updated: May 28 2025_