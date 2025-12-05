# Channel Groups API for Java SDK

##### Breaking changes in v9.0.0

Java SDK v9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) SDKs, changes PubNub client instantiation, and updates async API callbacks and emitted [status events](/docs/sdks/java/status-events). See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

[Channel groups](/docs/general/channels/subscribe#channel-groups) bundle many [channels](/docs/general/channels/overview) under a single name for subscription.

##### Channel group operations

- You can't publish to a channel group—only subscribe. To publish, publish to individual channels.
- Requires Stream Controller add-on: All methods below require the Stream Controller add-on enabled for your key in the PubNub [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

## Add channels to a channel group

Adds channels to a channel group.

### Method(s)

Maximum number of channels: Up to 200 channels per API call.

```
`1this.pubnub.addChannelsToChannelGroup()  
2    .channelGroup(String)  
3    .channels(Array)  
`
```

Parameters:
- channelGroup (Type: String) — The channel group to add the channels to.
- channels (Type: Array) — The channels to add to the channel group.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNChannelGroupsAddChannelResult.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add channels

```
1
  

```

### Response

addChannelsToChannelGroup() doesn't return actionable data. Check operation outcome with result.isFailure() or handle exceptions via result.onFailure(exception -> { }).

## List channels in a channel group

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.listChannelsForChannelGroup()  
2    .channelGroup(String)  
3    .async(result -> { /* check result */ });  
`
```

Parameters:
- channelGroup (Type: String) — The channel group for which to list channels.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNChannelGroupsAllChannelsResult.

### Sample code

#### List channels

```
1
  

```

### Returns

PNChannelGroupsAllChannelsResult with:
- getChannels() (Type: List<String>) — List of channels in the channel group.

## Remove channels from a channel group

Removes channels from a channel group.

### Method(s)

```
`1pubnub.removeChannelsFromChannelGroup()  
2    .channelGroup(String)  
3    .channels(Array)  
`
```

Parameters:
- channels (Type: Array) — The channels to remove from the channel group.
- channelGroup (Type: String) — The channel group from which to remove the channels.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNChannelGroupsRemoveChannelResult.

### Sample code

#### Remove channels

```
1
  

```

### Response

removeChannelsFromChannelGroup() doesn't return actionable data. Check operation outcome with result.isFailure() or handle exceptions via result.onFailure(exception -> { }).

## Delete a channel group

Deletes a channel group.

### Method(s)

```
`1pubnub.deleteChannelGroup()  
2    .channelGroup(String)  
`
```

Parameters:
- channelGroup (Type: String) — The channel group to delete.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNChannelGroupsDeleteGroupResult.

### Sample code

#### Delete channel group

```
1
  

```

### Response

deleteChannelGroup() doesn't return actionable data. Check operation outcome with result.isFailure() or handle exceptions via result.onFailure(exception -> { }).

Last updated on Sep 3, 2025