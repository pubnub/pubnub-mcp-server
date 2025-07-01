# Channel Groups API – JavaScript SDK (condensed)

Channel groups bundle many channels under one name.  
• You can **subscribe** to a group but **cannot publish** to it (publish to individual channels instead).  
• Async patterns: Callbacks, Promises, and **Async/Await** (recommended). Use `try…catch` to handle errors.

All Channel-Group operations **require the Stream Controller add-on** to be enabled for your PubNub keys.

---

## Add Channels to a Group
Maximum 200 channels per call.
``` 
`pubnub.channelGroups.addChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```
Parameters  
• `channels` Array\<string> – channels to add  
• `channelGroup` string – target group

Example
```
`  
`
```
```
`  
`
```
Response
```
`{  
    error: false,  
    operation: "PNAddChannelsToGroupOperation",  
    statusCode: 200  
}  
`
```

---

## List Channels in a Group
``` 
`pubnub.channelGroups.listChannels({  
    channelGroup: string  
})  
`
```
Parameter  
• `channelGroup` string – group to inspect

Example
```
`  
`
```
Response
```
`// Example of Status  
{  
    error: false,  
    operation: "PNChannelsForGroupOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    channels: ["ch1", "ch2"]  
}  
`
```

---

## Remove Channels from a Group
``` 
`pubnub.channelGroups.removeChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```
Parameters  
• `channels` Array\<string> – channels to remove  
• `channelGroup` string – source group

Example
```
`  
`
```
Response
```
`{  
    error: false,  
    operation: "PNRemoveChannelsFromGroupOperation",  
    statusCode: 200  
}  
`
```

---

## Delete an Entire Channel Group
``` 
`pubnub.channelGroups.deleteGroup({  
    channelGroup: string  
})  
`
```
Parameter  
• `channelGroup` string – group to delete

Example
```
`  
`
```
Response
```
`{**    error: false,  
    operation: "PNRemoveGroupOperation",  
    statusCode: 200  
}  
`
```

_Last updated: Jun 30 2025_