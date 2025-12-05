# Channel Groups API for PHP SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) let you bundle thousands of [channels](/docs/general/channels/overview) into a named group you can subscribe to.

##### Channel group operations
- You can't publish to a channel group—only subscribe to it. Publish to each channel individually within the group.

## Prerequisites
- Requires Stream Controller add-on. Enable it for your key in the PubNub [Admin Portal](https://admin.pubnub.com/) and see the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

## Add channels to a channel group

Adds channels to a channel group.

### Method(s)

`Adding Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->addChannelToChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

- channels (String|Array): The channels to add to the channel group.
- channelGroup (String): The channel group to add the channels to.

##### Maximum number of channels
- You can add up to 200 channels to a channel group per API call.

### Sample code

#### Add channels

##### Reference code

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

Lists all channels in a channel group.

### Method(s)

`Listing Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->listChannelsInChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

- channelGroup (String): The channel group for which to list channels.

### Sample code

#### List channels

```
1
  

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

Removes channels from a channel group.

### Method(s)

`Removing Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->removeChannelFromChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

- channels (String|Array): The channels to remove from the channel group.
- channelGroup (String): The channel group from which to remove the channels.

### Sample code

#### Remove channels

```
1
  

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

Deletes a channel group.

### Method(s)

`Deleting Channel Group` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->removeChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

- channelGroup (String): The channel group to remove.

### Sample code

#### Delete channel group

```
1
  

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

Last updated on Nov 6, 2025**