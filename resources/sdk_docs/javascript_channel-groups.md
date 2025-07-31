# Channel Groups API – JavaScript SDK (condensed)

Channel Groups bundle multiple channels under a single name.  
• Subscribe only; you can’t publish to a group.  
• Up to 200 channels can be added per API call.  
• All Channel-Group operations require the **Stream Controller** add-on (enable in the Admin Portal).  
• Async/Await with try…catch is the recommended pattern; callbacks and Promises are also supported.

---

## Add channels to a group
```
`pubnub.channelGroups.addChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```
Parameters  
• channels (Array\<string>): channels to add.  
• channelGroup (string): target group.

Sample code  
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

## List channels in a group
```
`pubnub.channelGroups.listChannels({  
    channelGroup: string  
})  
`
```
Parameter  
• channelGroup (string): group to inspect.

Sample code  
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

## Remove channels from a group
```
`pubnub.channelGroups.removeChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```
Parameters  
• channels (Array\<string>): channels to remove.  
• channelGroup (string): group to remove them from.

Sample code  
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

## Delete a channel group
```
`pubnub.channelGroups.deleteGroup({  
    channelGroup: string  
})  
`
```
Parameter  
• channelGroup (string): group to delete.

Sample code  
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

_Last updated: Jul 15 2025_