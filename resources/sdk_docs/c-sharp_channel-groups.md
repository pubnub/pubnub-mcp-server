On this page
# Channel Groups API for C# SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

##### Request execution

We recommend using `try` and `catch` statements when working with the C# SDK.

If there's an issue with the provided API parameter values, like missing a required parameter, the SDK throws an exception. However, if there is a server-side API execution issue or a network problem, the error details are contained within the `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the C# SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pubnub.AddChannelsToChannelGroup()  
        .ChannelGroup(string)  
        .Channels(Array)  
        .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringThe `ChannelGroup` to add the channels to.`Channels` *Type: ArrayThe `Channels` to add to the channel group.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsAddChannelResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallback`PNCallback` of type `PNChannelGroupsAddChannelResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNChannelGroupsAddChannelResult>`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Channels[​](#add-channels-1)

```
`  
`
```

### Returns[​](#returns)

The `AddChannelsToChannelGroup()` operation returns a `PNResult<PNChannelGroupsAddChannelResult>` which contains the following properties:

Property NameTypeDescription`Result`PNChannelGroupsAddChannelResultReturns a `PNChannelGroupsAddChannelResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNChannelGroupsAddChannelResult` contains the following properties:

Property NameTypeDescription`PNChannelGroupsAddChannelResult`ObjectReturns empty object.`PNStatus`ObjectReturns status of request if error occurred or not.

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the C# SDK:

```
`pubnub.ListChannelsForChannelGroup()  
        .ChannelGroup(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: string`Channel group` to fetch the channels.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsAllChannelsResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallback`PNCallback` of type `PNChannelGroupsAllChannelsResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNChannelGroupsAllChannelsResult>`.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`  
`
```

### Returns[​](#returns-1)

The `ListChannelsForChannelGroup()` operation returns a `PNChannelGroupsAllChannelsResult` which contains the following properties:

Property NameTypeDescription`Result`PNChannelGroupsAllChannelsResultReturns a `PNChannelGroupsAllChannelsResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNChannelGroupsAllChannelsResult` contains the following property:

Property NameTypeDescription`Channels`List`<string>`List of `channels` of a `channel group`.

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the C# SDK:

```
`pubnub.RemoveChannelsFromChannelGroup()  
        .ChannelGroup(string)  
        .Channels(Array)  
        .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringSpecifies `ChannelGroup` to remove the channels from.`Channels` *Type: ArrayThe `Channels` to remove from the channel group.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsRemoveChannelResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallback`PNCallback` of type `PNChannelGroupsRemoveChannelResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNChannelGroupsRemoveChannelResult>`.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`  
`
```

### Returns[​](#returns-2)

The `RemoveChannelsFromChannelGroup()` operation returns a `PNChannelGroupsAddChannelResult` which contains the following properties:

Property NameTypeDescription`Result`PNChannelGroupsRemoveChannelResultReturns a `PNChannelGroupsRemoveChannelResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNChannelGroupsRemoveChannelResult` contains the following property:

Property NameTypeDescription`PNChannelGroupsRemoveChannelResult`ObjectReturns empty object.

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the C# SDK:

```
`pubnub.DeleteChannelGroup()  
        .ChannelGroup(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringSpecifies `ChannelGroup` to remove.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsDeleteGroupResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallback`PNCallback` of type `PNChannelGroupsDeleteGroupResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNChannelGroupsAllChannelsResult>`.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`  
`
```

### Response[​](#response)

```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```
Last updated on Jun 30, 2025**