# Channel Groups API for PHP SDK

Channel groups bundle channels under a named group. You can subscribe to a channel group to receive messages from all its channels. You can't publish to a channel group; publish to individual channels instead.

Note: All operations below require the Stream Controller add-on enabled for your key in the PubNub Admin Portal. See the support page for enabling add-ons.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

Adds channels to a channel group.

- Maximum number of channels: You can add up to 200 channels per API call.

### Method(s)[​](#methods)

```
`1$pubnub->addChannelToChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

Parameters:
- channels (Type: String|Array): The channels to add to the channel group.
- channelGroup (Type: String): The channel group to add the channels to.

### Sample code[​](#sample-code)

#### Add channels[​](#add-channels)

```
1
  

```

### Rest response from server[​](#rest-response-from-server)

```
`1{  
2    "service" : "channel-registry",  
3    "status"  : 200,  
4    "error"   : false,  
5    "message" : "OK"  
6}  
`
```

## List channels in a channel group[​](#list-channels-in-a-channel-group)

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

```
`1$pubnub->listChannelsInChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

Parameters:
- channelGroup (Type: String): The channel group for which to list channels.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
1
  

```

### Rest response from server[​](#rest-response-from-server-1)

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

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

Removes channels from a channel group.

### Method(s)[​](#methods-2)

```
`1$pubnub->removeChannelFromChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

Parameters:
- channels (Type: String|Array): The channels to remove from the channel group.
- channelGroup (Type: String): The channel group from which to remove the channels.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
1
  

```

### Rest response from server[​](#rest-response-from-server-2)

```
`1{  
2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```

## Delete a channel group[​](#delete-a-channel-group)

Deletes a channel group.

### Method(s)[​](#methods-3)

```
`1$pubnub->removeChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

Parameters:
- channelGroup (Type: String): The channel group to remove.

### Sample code[​](#sample-code-3)

#### Delete channel group[​](#delete-channel-group)

```
1
  

```

### Rest response from server[​](#rest-response-from-server-3)

```
`1{**2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```