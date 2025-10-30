# Channel Groups API for JavaScript SDK

Channel groups allow bundling thousands of channels under a single name. You can subscribe to a channel group to receive messages from all channels it contains.

- You can't publish to a channel group. Publish to individual channels.
- Async patterns: Callbacks, Promises, Async/Await. Recommended: Async/Await with try...catch to handle errors.

## Add channels to a channel group

Requires Stream Controller add-on (enable in Admin Portal: https://admin.pubnub.com/).

Adds channels to a channel group.

### Method(s)

Maximum number of channels: 200 per API call.

```
`1pubnub.channelGroups.addChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

Parameters:
- channels (Array<string>): Channels to add.
- channelGroup (string): Target channel group.

### Sample code

Reference code: self-contained snippet with imports, execution, and logging.

#### Add channels

```
1
  

```

```
1
  

```

### Response

```
`1{  
2    error: false,  
3    operation: "PNAddChannelsToGroupOperation",  
4    statusCode: 200  
5}  
`
```

## List channels in a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.channelGroups.listChannels({  
2    channelGroup: string  
3})  
`
```

Parameters:
- channelGroup (string): Channel group to list.

### Sample code

#### List channels

```
1
  

```

### Response

```
// Example of Status  
{  
    error: false,  
    operation: "PNChannelsForGroupOperation",  
    statusCode: 200  
}  

// Example of Response  
{  
    channels: ["ch1", "ch2"]  
}  
```

## Remove channels from a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Removes channels from a channel group.

### Method(s)

```
`1pubnub.channelGroups.removeChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

Parameters:
- channels (Array<string>): Channels to remove.
- channelGroup (string): Channel group to remove from.

### Sample code

#### Remove channels

```
1
  

```

### Response

```
`1{  
2    error: false,  
3    operation: "PNRemoveChannelsFromGroupOperation",  
4    statusCode: 200  
5}  
`
```

## Delete a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Deletes a channel group.

### Method(s)

```
`1pubnub.channelGroups.deleteGroup({  
2    channelGroup: string  
3})  
`
```

Parameters:
- channelGroup (string): Channel group to delete.

### Sample code

#### Delete channel group

```
1
  

```

### Response

```
`1{**2    error: false,  
3    operation: "PNRemoveGroupOperation",  
4    statusCode: 200  
5}  
`
```

Last updated on Sep 3, 2025**