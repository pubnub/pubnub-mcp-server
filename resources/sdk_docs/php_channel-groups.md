# Channel Groups API for PHP SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) bundle many [channels](/docs/general/channels/overview) into a named group. You can subscribe to a channel group to receive messages from all channels it contains.

##### Channel group operations
- You can't publish to a channel group—only subscribe.
- To publish, send messages to individual channels.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the PubNub [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Adds channels to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the PHP SDK:

##### Maximum number of channels
You can add up to 200 channels to a channel group per API call.

```
`1$pubnub->addChannelToChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

Parameters:
- channels — Type: String|Array — Channels to add to the channel group.
- channelGroup — Type: String — Target channel group.

### Sample code[​](#sample-code)

#### Add channels[​](#add-channels)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

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

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->listChannelsInChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

Parameters:
- channelGroup — Type: String — Channel group to list channels for.

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

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Removes channels from a channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->removeChannelFromChannelGroup()  
2    ->channels(string|array)  
3    ->channelGroup(string)  
4    ->sync();  
`
```

Parameters:
- channels — Type: String|Array — Channels to remove from the channel group.
- channelGroup — Type: String — Channel group to remove channels from.

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

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Deletes a channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the PHP SDK:

```
`1$pubnub->removeChannelGroup()  
2    ->channelGroup(string)  
3    ->sync();  
`
```

Parameters:
- channelGroup — Type: String — Channel group to remove.

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