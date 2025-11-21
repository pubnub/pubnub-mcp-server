# Channel Groups API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, asynchronous API callbacks, and emitted status events. See the Java/Kotlin SDK migration guide for details.

[Channel groups] allow bundling many channels under one name to subscribe to them collectively. You can’t publish to a channel group; publish to individual channels instead.

##### Channel group operations

You can only subscribe to a channel group. Publish to each channel individually.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See the support page for enabling add-ons.

Adds channels to a channel group.

### Method(s)[​](#methods)

Use the following method in the Java SDK:

##### Maximum number of channels

You can add up to 200 channels to a channel group per API call.

```
`1this.pubnub.addChannelsToChannelGroup()  
2    .channelGroup(String)  
3    .channels(Array)  
`
```

- channelGroup: String — channel group to add channels to.
- channels: Array — channels to add.
- async: Consumer<Result> — Consumer of a Result of type PNChannelGroupsAddChannelResult.

### Sample code[​](#sample-code)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add channels[​](#add-channels)

```
1
  

```

### Response[​](#response)

addChannelsToChannelGroup() doesn’t return actionable data. Check result state with result.isFailure() or handle errors with result.onFailure(exception -> { }).

## List channels in a channel group[​](#list-channels-in-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See the support page for enabling add-ons.

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

Use the following method in the Java SDK:

```
`1pubnub.listChannelsForChannelGroup()  
2    .channelGroup(String)  
3    .async(result -> { /* check result */ });  
`
```

- channelGroup: String — channel group to list.
- async: Consumer<Result> — Consumer of a Result of type PNChannelGroupsAllChannelsResult.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
1
  

```

### Returns[​](#returns)

PNChannelGroupsAllChannelsResult:
- getChannels(): List<String> — channels in the group.

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See the support page for enabling add-ons.

Removes channels from a channel group.

### Method(s)[​](#methods-2)

Use the following method in the Java SDK:

```
`1pubnub.removeChannelsFromChannelGroup()  
2    .channelGroup(String)  
3    .channels(Array)  
`
```

- channels: Array — channels to remove.
- channelGroup: String — channel group from which to remove channels.
- async: Consumer<Result> — Consumer of a Result of type PNChannelGroupsRemoveChannelResult.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
1
  

```

### Response[​](#response-1)

removeChannelsFromChannelGroup() doesn’t return actionable data. Check result with result.isFailure() or handle errors with result.onFailure(exception -> { }).

## Delete a channel group[​](#delete-a-channel-group)

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal. See the support page for enabling add-ons.

Deletes a channel group.

### Method(s)[​](#methods-3)

Use the following method in the Java SDK:

```
`1pubnub.deleteChannelGroup()  
2    .channelGroup(String)  
`
```

- channelGroup: String — group to delete.
- async: Consumer<Result> — Consumer of a Result of type PNChannelGroupsDeleteGroupResult.

### Sample code[​](#sample-code-3)

#### Delete channel group[​](#delete-channel-group)

```
1
  

```

### Response[​](#response-2)

deleteChannelGroup() doesn’t return actionable data. Check result with result.isFailure() or handle errors with result.onFailure(exception -> { }).

Last updated on Sep 3, 2025