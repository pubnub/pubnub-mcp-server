On this page
# Channel Groups API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Java SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`this.pubnub.addChannelsToChannelGroup()  
    .channelGroup(String)  
    .channels(Array)  
`
```

*  requiredParameterDescription`channelGroup` *Type: StringThe `channelGroup` to add the channels to.`channels` *Type: ArrayThe `channel` to add to the channel group.`async` *Type: `Consumer<Result>``Consumer` of a `Result` of type `PNChannelGroupsAddChannelResult`

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Channels[​](#add-channels-1)

```
`  
`
```

### Response[​](#response)

The `addChannelsToChannelGroup()` does not return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure();` or handling exception `result.onFailure(exception -> { });`.

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Java SDK:

```
`pubnub.listChannelsForChannelGroup()  
    .channelGroup(String)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`channelGroup` *Type: String`Channel group` to fetch the channels.`async` *Type: `Consumer<Result>``Consumer` of a `Result` of type `PNChannelGroupsAllChannelsResult`.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`  
`
```

### Returns[​](#returns)

The `listChannelsForChannelGroup()` operation returns a `PNChannelGroupsAllChannelsResult` which contains the following operations:

MethodDescription`getChannels()`Type: List`<String>`List of `channels` of a `channel group`.

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Java SDK:

```
`pubnub.removeChannelsFromChannelGroup()  
    .channelGroup(String)  
    .channels(Array)  
`
```

*  requiredParameterDescription`channels` *Type: ArrayThe `channels` to remove from the channel group.`channelGroup` *Type: StringSpecifies `channelGroup` to remove the channels from.`async`Type: `Consumer<Result>``Consumer` of a `Result` of type `PNChannelGroupsRemoveChannelResult`.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`  
`
```

### Response[​](#response-1)

The `removeChannelsFromChannelGroup()` does not return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure();` or handling exception `result.onFailure(exception -> { });`.

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Java SDK:

```
`pubnub.deleteChannelGroup()  
    .channelGroup(String)  
`
```

*  requiredParameterDescription`channelGroup` *Type: StringSpecifies `channelGroup` to remove.`async`Type: `Consumer<Result>``Consumer` of a `Result` of type `PNChannelGroupsDeleteGroupResult`.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`  
`
```

### Response[​](#response-2)

The `deleteChannelGroup()` does not return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure();` or handling exception `result.onFailure(exception -> { });`.
Last updated on **May 28, 2025**