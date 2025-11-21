# Channel Groups API for JavaScript SDK

Channel groups bundle many channels under one name. You can subscribe to a channel group to receive messages from its member channels. You cannot publish to a channel group; publish to individual channels instead.

##### Supported asynchronous patterns
Callbacks, Promises, and Async/Await are supported. Async/Await is recommended. Add try...catch to receive error status.

## Add channels to a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal.

Adds channels to a channel group.

### Method(s)

```
`1pubnub.channelGroups.addChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

Parameters:
- channels: Array<string> — The channels to add to the channel group.
- channelGroup: string — The channel group to add the channels to.

##### Maximum number of channels
Up to 200 channels per API call.

### Sample code

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

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal.

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.channelGroups.listChannels({  
2    channelGroup: string  
3})  
`
```

Parameters:
- channelGroup: string — The channel group for which to list channels.

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

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal.

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
- channels: Array<string> — The channels to remove from the channel group.
- channelGroup: string — The channel group from which to remove the channels.

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

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal.

Deletes a channel group.

### Method(s)

```
`1pubnub.channelGroups.deleteGroup({  
2    channelGroup: string  
3})  
`
```

Parameters:
- channelGroup: string — The channel group to delete.

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