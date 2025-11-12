# Channel Groups API for JavaScript SDK

Channel groups let you bundle many channels under a named group and subscribe to the group to receive data from all included channels. You can't publish to a channel group—publish to individual channels instead.

All channel group operations require the Stream Controller add-on enabled for your key in the Admin Portal. See the support page for enabling add-on features.

##### Supported and recommended asynchronous patterns

Callbacks, Promises, and Async/Await are supported. Recommended: Async/Await with try...catch to handle errors.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

This function adds channels to a channel group.

##### Maximum number of channels

You can add up to 200 channels to a channel group per API call.

### Method(s)[​](#methods)

Use the following method in the JavaScript SDK:

```
`1pubnub.channelGroups.addChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

Parameters:
- channels (Array<string>): The channels to add.
- channelGroup (string): The target channel group.

### Sample code[​](#sample-code)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add channels[​](#add-channels)

```
1
  

```

```
1
  

```

### Response[​](#response)

```
`1{  
2    error: false,  
3    operation: "PNAddChannelsToGroupOperation",  
4    statusCode: 200  
5}  
`
```

## List channels in a channel group[​](#list-channels-in-a-channel-group)

This function lists all channels in a channel group.

### Method(s)[​](#methods-1)

Use the following method in the JavaScript SDK:

```
`1pubnub.channelGroups.listChannels({  
2    channelGroup: string  
3})  
`
```

Parameters:
- channelGroup (string): The channel group for which to list channels.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
1
  

```

### Response[​](#response-1)

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

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

This function removes channels from a channel group.

### Method(s)[​](#methods-2)

Use the following method in the JavaScript SDK:

```
`1pubnub.channelGroups.removeChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

Parameters:
- channels (Array<string>): The channels to remove.
- channelGroup (string): The channel group to remove channels from.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
1
  

```

### Response[​](#response-2)

```
`1{  
2    error: false,  
3    operation: "PNRemoveChannelsFromGroupOperation",  
4    statusCode: 200  
5}  
`
```

## Delete a channel group[​](#delete-a-channel-group)

This function deletes a channel group.

### Method(s)[​](#methods-3)

Use the following method in the JavaScript SDK:

```
`1pubnub.channelGroups.deleteGroup({  
2    channelGroup: string  
3})  
`
```

Parameters:
- channelGroup (string): The channel group to delete.

### Sample code[​](#sample-code-3)

#### Delete channel group[​](#delete-channel-group)

```
1
  

```

### Response[​](#response-3)

```
`1{**2    error: false,  
3    operation: "PNRemoveGroupOperation",  
4    statusCode: 200  
5}  
`
```

Last updated on Sep 3, 2025**