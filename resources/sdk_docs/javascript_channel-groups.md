On this page
# Channel Groups API for JavaScript SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is done by using the following method(s) in the JavaScript SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pubnub.channelGroups.addChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`The `channel` to add to the channel group.`channelGroup` *Type: stringThe `channelGroup` to add the channels to.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Channels[​](#add-channels-1)

```
`  
`
```

```
`  
`
```

### Response[​](#response)

```
`{  
    error: false,  
    operation: "PNAddChannelsToGroupOperation",  
    statusCode: 200  
}  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the JavaScript SDK:

```
`pubnub.channelGroups.listChannels({  
    channelGroup: string  
})  
`
```

*  requiredParameterDescription`channelGroup` *Type: string`Channel Group` to list the channel(s) of.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`  
`
```

### Response[​](#response-1)

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

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the JavaScript SDK:

```
`pubnub.channelGroups.removeChannels({  
    channels: Arraystring>,  
    channelGroup: string  
})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`The `channel` to remove from the `channel` group.`channelGroup` *Type: stringThe `channelGroup` to remove the channels from.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`  
`
```

### Response[​](#response-2)

```
`{  
    error: false,  
    operation: "PNRemoveChannelsFromGroupOperation",  
    statusCode: 200  
}  
`
```

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the JavaScript SDK:

```
`pubnub.channelGroups.deleteGroup({  
    channelGroup: string  
})  
`
```

*  requiredParameterDescription`channelGroup` *Type: stringThe `channelGroup` to remove.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`  
`
```

### Response[​](#response-3)

```
`{**    error: false,  
    operation: "PNRemoveGroupOperation",  
    statusCode: 200  
}  
`
```
Last updated on Jun 30, 2025**