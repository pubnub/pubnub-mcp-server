# Channel Groups API for PHP SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) let you bundle many [channels](/docs/general/channels/overview) into a named group you can subscribe to. You can't publish to a channel group—publish to individual channels instead.

## Add channels to a channel group

Requires Stream Controller add-on: Enable the Stream Controller add-on for your key in the PubNub [Admin Portal](https://admin.pubnub.com/). See [support instructions](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Maximum number of channels: You can add up to 200 channels per API call.

### Method(s)

```
`1$pubnub->addChannelToChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

Parameters:
- channels (String|Array): Channels to add to the group.
- channelGroup (String): Target channel group name.

### Sample code

#### Add channels

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Rest response from server

```
`1{  
2    "service" : "channel-registry",  
3    "status"  : 200,  
4    "error"   : false,  
5    "message" : "OK"  
6}  
`
```

## List channels in a channel group

Requires Stream Controller add-on: Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See [support instructions](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

### Method(s)

```
`1$pubnub->listChannelsInChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

Parameters:
- channelGroup (String): The channel group to inspect.

### Sample code

#### List channels

```
`1$pubnub->listChannelsInChannelGroup()  
2    ->channelGroup("cg1")  
3    ->sync();  
`
```

### Rest response from server

```
`1{  
2    "status" : 200,  
3    "payload" : {  
4        "channels" : ["hi"],  
5        "group" : "abcd"  
6    },  
7    "service" : "channel-registry",  
8    "error" : False  
9}  
`
```

## Remove channels from a channel group

Requires Stream Controller add-on: Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See [support instructions](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

### Method(s)

```
`1$pubnub->removeChannelFromChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

Parameters:
- channels (String|Array): Channels to remove.
- channelGroup (String): Channel group to remove from.

### Sample code

#### Remove channels

```
`1$pubnub->removeChannelFromChannelGroup()  
2    ->channels("son")  
3    ->channelGroup("family")  
4    ->sync();  
`
```

### Rest response from server

```
`1{  
2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```

## Delete a channel group

Requires Stream Controller add-on: Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See [support instructions](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

### Method(s)

```
`1$pubnub->removeChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

Parameters:
- channelGroup (String): The channel group to remove.

### Sample code

#### Delete channel group

```
`1$pubnub->removeChannelGroup()  
2    ->channelGroup("family")  
3    ->sync();  
`
```

### Rest response from server

```
`1{**2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```

Last updated on Sep 3, 2025**