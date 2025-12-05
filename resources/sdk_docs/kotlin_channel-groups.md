# Channel Groups API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and [Java](/docs/sdks/java) SDKs, changes PubNub client instantiation, async callbacks, and [status events](/docs/sdks/kotlin/status-events). See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

[Channel groups](/docs/general/channels/subscribe#channel-groups) bundle many [channels](/docs/general/channels/overview) under a named group you can subscribe to.

##### Channel group operations
- You can't publish to a channel group—only subscribe.
- To publish, send to each channel individually.

##### Request execution
Most methods return an Endpoint. You must call .sync() or .async() to execute.

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
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/).

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
- channelGroup (String): Target channel group.
- channels (List<String>): Channels to add.

### Sample code
##### Reference code
```
1
  

```

### Response
No actionable data returned. Check result.isFailure or handle in result.onFailure { exception -> ... }.

## List channels in a channel group

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/).

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
- channels: List<String> — Channels in the group.

## Remove channels from a channel group

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/).

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
- channelGroup (String): Target channel group.

### Sample code
```
1
  

```

### Returns
No actionable data returned. Check result.isFailure or handle in result.onFailure { exception -> ... }.

## Delete a channel group

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/).

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
No actionable data returned. Check result.isFailure or handle in result.onFailure { exception -> ... }.