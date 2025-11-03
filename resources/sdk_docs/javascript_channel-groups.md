# Channel Groups API for JavaScript SDK

Channel groups bundle thousands of channels under a single name. You can only subscribe to a channel group; publishing must be done to individual channels.

Supported async patterns: Callbacks, Promises, Async/Await (recommended). Use try...catch with Async/Await to handle errors.

## Add channels to a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Adds channels to a channel group.

- Maximum number of channels per call: 200.

### Method(s)

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

Reference code

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

Requires Stream Controller add-on.

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
1// Example of Status  
2{  
3    error: false,  
4    operation: "PNChannelsForGroupOperation",  
5    statusCode: 200  
6}  
7
  
8// Example of Response  
9{  
10    channels: ["ch1", "ch2"]  
11}  

```

## Remove channels from a channel group

Requires Stream Controller add-on.

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
- channelGroup (string): Source channel group.

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

Requires Stream Controller add-on.

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