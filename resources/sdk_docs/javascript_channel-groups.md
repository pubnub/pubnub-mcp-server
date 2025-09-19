# Channel Groups API for JavaScript SDK

Channel groups let you bundle thousands of channels into a named group you can subscribe to. You can’t publish to a channel group—only subscribe. To publish, send messages to individual channels.

Supported async patterns: Callbacks, Promises, and Async/Await (recommended). Use try...catch to receive error status.

## Add channels to a channel group

Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the PubNub Admin Portal. See support page for enabling add-on features.

Adds channels to a channel group.

### Method(s)

Maximum number of channels

You can add up to 200 channels per API call.

```
`pubnub.channelGroups.addChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```

Parameters:
- channels (Array<string>): Channels to add to the group.
- channelGroup (string): Target channel group.

### Sample code

#### Add channels

```
`  
`
```

```
`  
`
```

### Response

```
`{  
    error: false,  
    operation: "PNAddChannelsToGroupOperation",  
    statusCode: 200  
}  
`
```

## List channels in a channel group

Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See support page for enabling add-on features.

Lists all channels in a channel group.

### Method(s)

```
`pubnub.channelGroups.listChannels({  
    channelGroup: string  
})  
`
```

Parameters:
- channelGroup (string): Channel group to list.

### Sample code

#### List channels

```
`  
`
```

### Response

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

## Remove channels from a channel group

Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See support page for enabling add-on features.

Removes channels from a channel group.

### Method(s)

```
`pubnub.channelGroups.removeChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```

Parameters:
- channels (Array<string>): Channels to remove.
- channelGroup (string): Channel group to remove from.

### Sample code

#### Remove channels

```
`  
`
```

### Response

```
`{  
    error: false,  
    operation: "PNRemoveChannelsFromGroupOperation",  
    statusCode: 200  
}  
`
```

## Delete a channel group

Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See support page for enabling add-on features.

Deletes a channel group.

### Method(s)

```
`pubnub.channelGroups.deleteGroup({  
    channelGroup: string  
})  
`
```

Parameters:
- channelGroup (string): Channel group to delete.

### Sample code

#### Delete channel group

```
`  
`
```

### Response

```
`{**    error: false,  
    operation: "PNRemoveGroupOperation",  
    statusCode: 200  
}  
`
```

Last updated on Sep 3, 2025**