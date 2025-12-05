# Channel Groups API for JavaScript SDK

Channel groups bundle many channels under a single name so you can subscribe to all of them at once. You cannot publish to a channel group—publish to individual channels instead.

Supported async patterns: Callbacks, Promises, and Async/Await. Recommended: Async/Await. Error status is returned only on error; use try/catch to handle errors.

## Add channels to a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Adds channels to a channel group. Maximum 200 channels per API call.

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