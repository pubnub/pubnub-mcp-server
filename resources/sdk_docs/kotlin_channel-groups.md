# Channel Groups API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin and Java SDKs share a unified codebase.
- New PubNub client instantiation.
- Asynchronous API callbacks and emitted status events changed.
- Migration guide: https://www.pubnub.com/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide

Channel groups let you subscribe to many channels at once. You cannot publish to a channel group; publish to individual channels instead.

##### Request execution
Most methods return an Endpoint you must execute. Call .sync() or .async() or the operation won't run.

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
Enable Stream Controller for your key in the Admin Portal: https://admin.pubnub.com/ (How-to: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

Adds channels to a channel group.

### Method(s)
Maximum number of channels per call: 200.

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
No actionable data is returned. Check result.isFailure or handle via result.onFailure { exception -> }.

## List channels in a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal: https://admin.pubnub.com/ (How-to: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

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
- channels: List<String> — channels in the group.

## Remove channels from a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal: https://admin.pubnub.com/ (How-to: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

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
- channelGroup (String): Channel group to remove from.

### Sample code

```
1
  
```

### Returns
No actionable data is returned. Check result.isFailure or handle via result.onFailure { exception -> }.

## Delete a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal: https://admin.pubnub.com/ (How-to: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

Deletes a channel group.

### Method(s)

```
`1pubnub.deleteChannelGroup(  
2    channelGroup: String  
3).async { result -> }  
`
```

Parameters:
- channelGroup (String): Channel group to delete.

### Sample code

```
1
  
```

### Returns
No actionable data is returned. Check result.isFailure or handle via result.onFailure { exception -> }.

Last updated on Sep 3, 2025