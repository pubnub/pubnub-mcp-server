# Channel Groups API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async API callbacks, and status events. Review the Java/Kotlin SDK migration guide.

Channel groups let you bundle many channels and subscribe to the group. You can’t publish to a channel group; publish to individual channels.

##### Request execution
Most SDK methods return an Endpoint. You must call .sync() or .async() to execute.

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

## Add channels to a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Adds channels to a channel group.

### Method(s)

Maximum number of channels: 200 per API call.

```
`1pubnub.addChannelsToChannelGroup(  
2    channelGroup: String,  
3    channels: ListString>  
4).async { result -> }  
`
```

Parameters:
- channelGroup (String): Channel group to add channels to.
- channels (List<String>): Channels to add.

### Sample code

```
1
  

```

### Response
No actionable data; check result.isFailure or handle result.onFailure { }.

## List channels in a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.listChannelsForChannelGroup(  
2    channelGroup: String  
3).async { result -> }  
`
```

Parameters:
- channelGroup (String): Channel group to list.

### Sample code

```
1
  

```

### Returns
PNChannelGroupsAllChannelsResult:
- channels (List<String>): Channels in the group.

## Remove channels from a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Removes channels from a channel group.

### Method(s)

```
`1pubnub.removeChannelsFromChannelGroup(  
2    channels: ListString>,  
3    channelGroup: String  
4).async { result -> }  
`
```

Parameters:
- channels (List<String>): Channels to remove.
- channelGroup (String): Group to remove from.

### Sample code

```
1
  

```

### Returns
No actionable data; check result.isFailure or handle result.onFailure { }.

## Delete a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Deletes a channel group.

### Method(s)

```
`1pubnub.deleteChannelGroup(  
2    channelGroup: String  
3).async { result -> }  
`
```

Parameters:
- channelGroup (String): Group to delete.

### Sample code

```
1
  

```

### Returns
No actionable data; check result.isFailure or handle result.onFailure { }.

Last updated on Sep 3, 2025