# Channel Groups API for Kotlin SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, and updates asynchronous API callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

Channel groups allow bundling many channels under a single group name. You can subscribe to a channel group; you cannot publish to a channel group. To publish, publish to individual channels.

##### Channel group operations
- You can't publish to a channel group. Only subscribe to it. Publish to each channel individually.

##### Request execution
Most method invocations return an Endpoint object. You must call .sync() or .async() to execute the request.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

All Channel Group APIs require the Stream Controller add-on to be enabled for your key in the Admin Portal.

## Add channels to a channel group

##### Requires Stream Controller add-on
This function adds channels to a channel group.

### Method(s)
Use the following method in the Kotlin SDK:

```
`1pubnub.addChannelsToChannelGroup(  
2    channelGroup: String,  
3    channels: ListString>  
4).async { result -> }  
`
```

Parameters:
- channelGroup: String — The channel group to add the channels to.
- channels: List<String> — The channels to add to the channel group.

##### Maximum number of channels
- Up to 200 channels per API call.

### Sample code

```
1
  
```

### Response
No actionable data is returned. Check result.isFailure or handle exceptions via result.onFailure { }.

## List channels in a channel group

##### Requires Stream Controller add-on
This function lists all channels in a channel group.

### Method(s)
Use the following method in the Kotlin SDK:

```
`1pubnub.listChannelsForChannelGroup(  
2    channelGroup: String  
3).async { result -> }  
`
```

Parameters:
- channelGroup: String — The channel group for which to list channels.

### Sample code

```
1
  
```

### Returns
- PNChannelGroupsAllChannelsResult:
  - channels: List<String> — Channels in the channel group.

## Remove channels from a channel group

##### Requires Stream Controller add-on
This function removes channels from a channel group.

### Method(s)
Use the following method in the Kotlin SDK:

```
`1pubnub.removeChannelsFromChannelGroup(  
2    channels: ListString>,  
3    channelGroup: String  
4).async { result -> }  
`
```

Parameters:
- channels: List<String> — The channels to remove from the channel group.
- channelGroup: String — The channel group from which to remove channels.

### Sample code

```
1
  
```

### Returns
No actionable data is returned. Check result.isFailure or handle exceptions via result.onFailure { }.

## Delete a channel group

##### Requires Stream Controller add-on
This function deletes a channel group.

### Method(s)
Use the following method in the Kotlin SDK:

```
`1pubnub.deleteChannelGroup(  
2    channelGroup: String  
3).async { result -> }  
`
```

Parameters:
- channelGroup: String — The channel group to delete.

### Sample code

```
1
  
```

### Returns
No actionable data is returned. Check result.isFailure or handle exceptions via result.onFailure { }.

Last updated on Sep 3, 2025