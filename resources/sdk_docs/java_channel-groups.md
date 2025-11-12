# Channel Groups API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new client instantiation approach, and changes asynchronous API callbacks and emitted status events. Applications built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Channel groups let you bundle many channels under a single group name. You can only subscribe to a channel group; publishing must be done to individual channels.

##### Channel group operations
- You can't publish to a channel group. Only subscribe to it.
- Requires Stream Controller add-on enabled for your key in the Admin Portal for all operations below.

## Add channels to a channel group

Requires Stream Controller add-on. Adds channels to a channel group.

##### Maximum number of channels
You can add up to 200 channels to a channel group per API call.

### Method(s)
```
this.pubnub.addChannelsToChannelGroup()
    .channelGroup(String)
    .channels(Array)
```

Parameters:
- channelGroup (String): The channel group to add the channels to.
- channels (Array): The channels to add to the channel group.
- async (Consumer<Result>): Consumer of a Result of type PNChannelGroupsAddChannelResult.

### Sample code
##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add channels
```

```

### Response
addChannelsToChannelGroup() does not return actionable data. Check the result using result.isFailure() or handle errors with result.onFailure(exception -> { }).

## List channels in a channel group

Requires Stream Controller add-on. Lists all channels in a channel group.

### Method(s)
```
pubnub.listChannelsForChannelGroup()
    .channelGroup(String)
    .async(result -> { /* check result */ });
```

Parameters:
- channelGroup (String): The channel group for which to list channels.
- async (Consumer<Result>): Consumer of a Result of type PNChannelGroupsAllChannelsResult.

### Sample code
#### List channels
```

```

### Returns
PNChannelGroupsAllChannelsResult:
- getChannels() (List<String>): List of channels in the channel group.

## Remove channels from a channel group

Requires Stream Controller add-on. Removes channels from a channel group.

### Method(s)
```
pubnub.removeChannelsFromChannelGroup()
    .channelGroup(String)
    .channels(Array)
```

Parameters:
- channels (Array): The channels to remove from the channel group.
- channelGroup (String): The channel group from which to remove the channels.
- async (Consumer<Result>): Consumer of a Result of type PNChannelGroupsRemoveChannelResult.

### Sample code
#### Remove channels
```

```

### Response
removeChannelsFromChannelGroup() does not return actionable data. Check the result using result.isFailure() or handle errors with result.onFailure(exception -> { }).

## Delete a channel group

Requires Stream Controller add-on. Deletes a channel group.

### Method(s)
```
pubnub.deleteChannelGroup()
    .channelGroup(String)
```

Parameters:
- channelGroup (String): The channel group to delete.
- async (Consumer<Result>): Consumer of a Result of type PNChannelGroupsDeleteGroupResult.

### Sample code
#### Delete channel group
```

```

### Response
deleteChannelGroup() does not return actionable data. Check the result using result.isFailure() or handle errors with result.onFailure(exception -> { }).

Last updated on Sep 3, 2025