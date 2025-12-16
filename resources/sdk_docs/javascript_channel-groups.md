# Channel Groups API for JavaScript SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) bundle thousands of [channels](/docs/general/channels/overview) under a single group name for subscription.

##### Channel group operations
- You **can’t publish** to a channel group—only **subscribe** to it.
- To publish “within” a group, publish to each channel individually.

##### Supported and recommended asynchronous patterns
Supports **Callbacks, Promises, and Async/Await**. Recommended: **Async/Await**. With Async/Await, status is returned only on error—use `try...catch` to receive error status.

---

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

##### Requires Stream Controller add-on
Requires *Stream Controller* enabled for your key in the PubNub [Admin Portal](https://admin.pubnub.com/). See: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-

Adds channels to a channel group.

### Method(s)[​](#methods)

##### Maximum number of channels
Up to **200 channels per API call**.

```
`1pubnub.channelGroups.addChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`The channels to add to the channel group.`channelGroup` *Type: stringThe channel group to add the channels to.

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

---

## List channels in a channel group[​](#list-channels-in-a-channel-group)

##### Requires Stream Controller add-on
Requires *Stream Controller* enabled in the [Admin Portal](https://admin.pubnub.com/). See support link above.

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

```
`1pubnub.channelGroups.listChannels({  
2    channelGroup: string  
3})  
`
```

*  requiredParameterDescription`channelGroup` *Type: stringThe channel group for which to list channels.

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

---

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

##### Requires Stream Controller add-on
Requires *Stream Controller* enabled in the [Admin Portal](https://admin.pubnub.com/). See support link above.

Removes channels from a channel group.

### Method(s)[​](#methods-2)

```
`1pubnub.channelGroups.removeChannels({  
2    channels: Arraystring>,  
3    channelGroup: string  
4})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`The channels to remove from the channel group.`channelGroup` *Type: stringThe channel group from which to remove the channels.

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

---

## Delete a channel group[​](#delete-a-channel-group)

##### Requires Stream Controller add-on
Requires *Stream Controller* enabled in the [Admin Portal](https://admin.pubnub.com/). See support link above.

Deletes a channel group.

### Method(s)[​](#methods-3)

```
`1pubnub.channelGroups.deleteGroup({  
2    channelGroup: string  
3})  
`
```

*  requiredParameterDescription`channelGroup` *Type: stringThe channel group to delete.

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