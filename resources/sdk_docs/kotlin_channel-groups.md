On this page
# Channel Groups API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Methods[​](#methods)

Adding Channels is accomplished by using the following method(s) in the Kotlin SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pubnub.addChannelsToChannelGroup(  
    channelGroup: String,  
    channels: ListString>  
).async { result -> }  
`
```

*  requiredParameterDescription`channelGroup` *Type: `String`The channel group to add the channels to.`channels` *Type: `List<String>`The channels to add to the channel group.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Response[​](#response)

The `addChannelsToChannelGroup()` doesn't return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure` or handling exception `result.onFailure(exception -> { })`.

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Methods[​](#methods-1)

Listing channels is accomplished by using the following method(s) in the Kotlin SDK:

```
`pubnub.listChannelsForChannelGroup(  
    channelGroup: String  
).async { result -> }  
`
```

*  requiredParameterDescription`channelGroup` *Type: `String`Channel group to fetch the belonging channels

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns)

The `listChannelsForChannelGroup()` operation returns a `PNChannelGroupsAllChannelsResult` which contains the following operations:

MethodDescription`channels`Type: `List<String>`List of `channels` of a `channel group`.

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Kotlin SDK:

```
`pubnub.removeChannelsFromChannelGroup(  
    channels: ListString>,  
    channelGroup: String  
).async { result -> }  
`
```

*  requiredParameterDescription`channels` *Type: `List<String>`The channels to remove from the channel group`channelGroup` *Type: `String`The channel group to remove channels from

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-1)

The `removeChannelsFromChannelGroup()` doesn't return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure` or handling exception `result.onFailure(exception -> { })`.

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Kotlin SDK:

```
`pubnub.deleteChannelGroup(  
    channelGroup: String  
).async { result -> }  
`
```

*  requiredParameterDescription`channelGroup` *Type: `String`The channel group to remove

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Returns[​](#returns-2)

The `deleteChannelGroup()` doesn't return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure` or handling exception `result.onFailure(exception -> { })`.
Last updated on **May 28, 2025**