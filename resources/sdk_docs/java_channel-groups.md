# Channel Groups API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) codebases, introduces a new client instantiation model, and changes async API callbacks and [status events](/docs/sdks/java/status-events). These changes may impact apps built with versions < 9.0.0. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

[Channel groups](/docs/general/channels/subscribe#channel-groups) let you bundle many [channels](/docs/general/channels/overview) under a single name and subscribe to that group to receive messages from all channels it contains.

##### Channel group operations

- You can't publish to a channel group; you can only subscribe to it.
- To publish within a group, publish to individual channels.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Adds channels to a channel group.

### Method(s)[​](#methods)

Maximum number of channels: You can add up to 200 channels to a channel group per API call.

Use the following method in the Java SDK:

```
`1this.pubnub.addChannelsToChannelGroup()  
2    .channelGroup(String)  
3    .channels(Array)  
`
```

Parameters:
- channelGroup (Type: String) – The channel group to add the channels to.
- channels (Type: Array) – The channels to add to the channel group.
- async (Type: Consumer<Result>) – Consumer of a Result of type PNChannelGroupsAddChannelResult.

### Sample code[​](#sample-code)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add channels[​](#add-channels)

```
1
  

```

### Response[​](#response)

The addChannelsToChannelGroup() call doesn’t return actionable data. Check the result object for outcome using result.isFailure() or handle exceptions with result.onFailure(exception -> { }).

## List channels in a channel group[​](#list-channels-in-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

Use the following method in the Java SDK:

```
`1pubnub.listChannelsForChannelGroup()  
2    .channelGroup(String)  
3    .async(result -> { /* check result */ });  
`
```

Parameters:
- channelGroup (Type: String) – The channel group for which to list channels.
- async (Type: Consumer<Result>) – Consumer of a Result of type PNChannelGroupsAllChannelsResult.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
1
  

```

### Returns[​](#returns)

listChannelsForChannelGroup() returns PNChannelGroupsAllChannelsResult with:
- getChannels() (Type: List<String>) – List of channels in the channel group.

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Removes channels from a channel group.

### Method(s)[​](#methods-2)

Use the following method in the Java SDK:

```
`1pubnub.removeChannelsFromChannelGroup()  
2    .channelGroup(String)  
3    .channels(Array)  
`
```

Parameters:
- channels (Type: Array) – The channels to remove from the channel group.
- channelGroup (Type: String) – The channel group from which to remove the channels.
- async (Type: Consumer<Result>) – Consumer of a Result of type PNChannelGroupsRemoveChannelResult.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
1
  

```

### Response[​](#response-1)

The removeChannelsFromChannelGroup() call doesn’t return actionable data. Check the result object using result.isFailure() or handle exceptions with result.onFailure(exception -> { }).

## Delete a channel group[​](#delete-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Deletes a channel group.

### Method(s)[​](#methods-3)

Use the following method in the Java SDK:

```
`1pubnub.deleteChannelGroup()  
2    .channelGroup(String)  
`
```

Parameters:
- channelGroup (Type: String) – The channel group to delete.
- async (Type: Consumer<Result>) – Consumer of a Result of type PNChannelGroupsDeleteGroupResult.

### Sample code[​](#sample-code-3)

#### Delete channel group[​](#delete-channel-group)

```
1
  

```

### Response[​](#response-2)

The deleteChannelGroup() call doesn’t return actionable data. Check the result object using result.isFailure() or handle exceptions with result.onFailure(exception -> { }).

Last updated on Sep 3, 2025