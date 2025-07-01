On this page
# Channel Groups API for Unity SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Unity SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pubnub.AddChannelsToChannelGroup()  
    .ChannelGroup(string)  
    .Channels(Array)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNChannelGroupsAddChannelResult, PNStatus>);  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringThe `ChannelGroup` to add the channels to.`Channels` *Type: ArrayThe `Channels` to add to the channel group.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsAddChannelResult`.`Execute` *Type: `System.Action``System.Action` of type `PNChannelGroupsAddChannelResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelGroupsAddChannelResult>>`.

### Basic Usage[​](#basic-usage)

#### Adding Channels[​](#adding-channels)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class AddChannelsToGroupExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized string for the channel group ID  
    [SerializeField] private string channelGroupId = "cg1";  
  
    // An editor-serialized array for the channels to add  
    [SerializeField] private string[] channelsToAdd = { "ch1", "ch2", "ch3" };  
  
`
```
show all 34 lines

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

`Listing Channels` is accomplished by using the following method(s) in the Unity SDK:

```
`pubnub.ListChannelsForChannelGroup()  
    .ChannelGroup(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNChannelGroupsAllChannelsResult, PNStatus>);  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: string`Channel group` to fetch the channels.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsAllChannelsResult`.`Execute` *Type: `System.Action``System.Action` of type `PNChannelGroupsAllChannelsResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelGroupsAllChannelsResult>>`.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`PNResultPNChannelGroupsAllChannelsResult> cgListChResponse = await pubnub.ListChannelsForChannelGroup()  
    .ChannelGroup("cg1")  
    .ExecuteAsync();  
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

`Removing Channels` is accomplished by using the following method(s) in the Unity SDK:

```
`pubnub.RemoveChannelsFromChannelGroup()  
    .ChannelGroup(string)  
    .Channels(Array)  
    .QueryParam(Dictionarystring,object>)  
    .Execute((result, status) => {});  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringSpecifies `ChannelGroup` to remove the channels from.`Channels` *Type: ArrayThe `Channels` to remove from the channel group.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsRemoveChannelResult`.`Execute` *Type: `System.Action``System.Action` of type `PNChannelGroupsRemoveChannelResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelGroupsRemoveChannelResult>>`.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`PNResultPNChannelGroupsRemoveChannelResult> rmChFromCgResponse = await pubnub.RemoveChannelsFromChannelGroup()  
    .ChannelGroup("family")  
    .Channels(new string[] {  
        "son"  
    })  
    .Execute((result, status) => {});  
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

`Deleting Channel Group` is accomplished by using the following method(s) in the Unity SDK:

```
`pubnub.DeleteChannelGroup()  
    .ChannelGroup(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNChannelGroupsDeleteGroupResult, PNStatus>);  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringSpecifies `ChannelGroup` to remove.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNChannelGroupsDeleteGroupResult`.`Execute` *Type: `System.Action``System.Action` of type `PNChannelGroupsDeleteGroupResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelGroupsDeleteGroupResult>>`.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`PNResultPNChannelGroupsDeleteGroupResult> delCgResponse = await pubnub.DeleteChannelGroup()  
    .ChannelGroup("family")  
    .ExecuteAsync();  
`
```

### Returns[​](#returns-3)

The `DeleteChannelGroup()` operation returns a `PNResult<PNChannelGroupsDeleteGroupResult>` which contains the following properties:

Property NameTypeDescription`Status`intHTTP response status code.`Error`boolThis is `true` if an error occurred in the execution of the operation.

```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```
Last updated on May 6, 2025**