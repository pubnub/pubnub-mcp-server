On this page
# Presence API for Unity SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

##### Presence event modes

Presence mode indicates when presence events are triggered for that channel. It can be either:

- Announce Mode

- Interval Mode

The mode is dependant on the occupancy count.  

This setting is controlled through [Admin Portal](https://admin.pubnub.com/). To learn more about this, visit [Presence documentation](/docs/general/presence/presence-events#presence-event-modes).

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `HereNow()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following method(s) in the Unity SDK:

```
`pubnub.HereNow()  
    .Channels(Array)  
    .ChannelGroups(Array)  
    .IncludeState(bool)  
    .IncludeUUIDs(bool)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNHereNowResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channels`Type: ArrayThe `Channels` to get the `here now` details.`ChannelGroups`Type: ArrayThe `ChannelGroups` to get the `here now` details.`IncludeState`Type: boolIf `true`, the response will include the presence states of the users for `Channels`/`ChannelGroups`.`IncludeUUIDs`Type: boolIf `true`, the response will include the `UUIDs` of the connected clients.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNHereNowResult`.`Execute` *Type: `System.Action``System.Action` of type `PNHereNowResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNHereNowResult>>`.

### Basic Usage[​](#basic-usage)

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using System.Collections.Generic;  
using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class HereNowExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized array with test channel IDs  
    [SerializeField] private string[] testChannelIds = { "coolChannel", "coolChannel2" };  
  
    private async void Start() {  
        // Getting a reference to the Pubnub instance  
`
```
show all 53 lines

### Returns[​](#returns)

The `HereNow()` operation returns a `PNResult<PNHereNowResult>` which contains the following properties:

Property NameTypeDescription`Result`PNHereNowResultReturns a `PNHereNowResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNHereNowResult` contains the following properties:

Property NameTypeDescription`TotalChannels`intTotal `Channels`.`TotalOccupancy`intTotal `Occupancy`.`Channels``Dictionary<string, PNHereNowChannelData>`A map with values of `PNHereNowChannelData` for each `channel`. See [PNHereNowChannelData](#pnherenowchanneldata)  for more details.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

Property NameTypeDescription`ChannelName`string`Channel` name.`Occupancy`int`Occupancy` of the `channel`.`Occupants`List`<PNHereNowOccupantData>`A list of `PNHereNowOccupantData`, see [PNHereNowOccupantData](#pnherenowoccupantdata)  for more details.

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

Property NameTypeDescription`Uuid`string`UUIDs` of the user.`State`object`State` of the user.

### Other Examples[​](#other-examples)

#### Get a list of UUIDs subscribed to channel synchronously[​](#get-a-list-of-uuids-subscribed-to-channel-synchronously)

```
`pubnub.HereNow()  
    .Channels(new string[] {  
        "coolChannel",  
        "coolChannel2"  
        })  
    .IncludeUUIDs(true)  
    .Execute(new PNHereNowResultEx(  
        (result, status) => {  
            if (status.Error) {  
                // handle error  
                return;  
            }  
  
            if (result.Channels != null && result.Channels.Count > 0) {  
                foreach (KeyValuePairstring, PNHereNowChannelData> kvp in result.Channels) {  
`
```
show all 32 lines

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`PNResultPNHereNowResult> herenowResponse = await pubnub.HereNow()  
    .Channels(new string[] {  
        // who is present on those channels?  
        "my_channel"  
    })  
    .IncludeState(true) // include state with request (false by default)  
    .IncludeUUIDs(true) // if false, only shows occupancy count  
    .ExecuteAsync();  
  
PNHereNowResult herenowResult = herenowResponse.Result;  
PNStatus status = herenowResponse.Status;  
//handle it  
`
```

#### Example Response[​](#example-response)

```
`{  
    "status" : 200,  
    "message" : "OK",  
    "service" : "Presence",  
    "uuids" : [  
        {  
            "uuid" : "myUUID0"  
        },  
        {  
            "state" : {  
                "abcd" : {  
                    "age" : 15  
                }  
            },  
            "uuid" : "myUUID1"  
`
```
show all 38 lines

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`PNResultPNHereNowResult> herenowResponse = await pubnub.HereNow()  
    .Channels(new string[] {  
            // who is present on those channels?  
        "my_channel"  
    })  
    .IncludeState(false) // include state with request (false by default)  
    .IncludeUUIDs(false) // if false, only shows occupancy count  
    .ExecuteAsync();  
  
PNHereNowResult herenowResult = herenowResponse.Result;  
PNStatus status = herenowResponse.Status;  
//handle it  
`
```

#### Example Response[​](#example-response-1)

```
`{  
    "status": 200,  
    "message": "OK",  
    "payload": {  
        "channels": {  
            "81d8d989-b95f-443c-a726-04fac323b331": {  
                "uuids": [ "70fc1140-22b5-4abc-85b2-ff8c17b24d59" ],  
                "occupancy": 1  
            },  
            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
                "uuids": [ "91363e7f-584b-49cc-822c-52c2c01e5928" ],  
                "occupancy": 1  
            },  
            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
                "uuids": [ "ccfac1dd-b3a5-4afd-9fd9-db11aeb65395" ],  
`
```
show all 23 lines

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `WhereNow()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `WhereNow()` you can use the following method(s) in the Unity SDK:

```
`pubnub.WhereNow()  
    .Uuid(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNWhereNowResult, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid` *Type: string`Uuid`.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: Command`PNCallback` of type `PNWhereNowResult`.`Execute` *Type: `System.Action``System.Action` of type `PNWhereNowResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNWhereNowResult>>`.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`PNResultPNWhereNowResult> wherenowResponse = await pubnub.WhereNow()  
    .ExecuteAsync();  
  
PNWhereNowResult wherenowResult = wherenowResponse.Result;  
PNStatus status = wherenowResponse.Status;  
// returns a pojo with channels  
// channel groups which I am part of.  
`
```

### Returns[​](#returns-1)

The `WhereNow()` operation returns a `PNResult<PNWhereNowResult>` which contain the following properties:

Property NameTypeDescription`Result`PNWhereNowResultReturns a `PNWhereNowResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNWhereNowResult` contains the following properties:

Property NameTypeDescription`Channels`List`<string>`The list of `channels` where the `UUID` is present.

### Other Examples[​](#other-examples-1)

#### Get a list of channels synchronously[​](#get-a-list-of-channels-synchronously)

```
`pubnub.WhereNow()  
    .Execute(new PNWhereNowResultExt(  
        (result, status) => {  
            // returns a pojo with channels  
            // channel groups which I am part of.  
        }  
    ));  
`
```

#### Obtain information about the current list of channels of some other UUID[​](#obtain-information-about-the-current-list-of-channels-of-some-other-uuid)

```
`PNResultPNWhereNowResult> wherenowResponse = await pubnub.WhereNow()  
    .Uuid("some-other-uuid") // uuid of the user we want to spy on.  
    .ExecuteAsync();  
  
PNWhereNowResult wherenowResult = wherenowResponse.Result;  
PNStatus status = wherenowResponse.Status;  
// returns a pojo with channels  
// channel groups which "some-other-uuid" part of.ere_now_example_1  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

The state API is used to set/get key/value pairs specific to a subscriber `Uuid`.

State information is supplied as a Generic Dictionary object(`Dictionary<string, object>`) of key/value pairs.

### Method(s)[​](#methods-2)

#### Set State[​](#set-state)

```
`pubnub.SetPresenceState()  
    .Channels(Array)  
    .ChannelGroups(Array)  
    .State(Dictionarystring, object>)  
    .Uuid(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNSetStateResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channels`Type: Array`Channels` to set `state`.`ChannelGroups`Type: Array`ChannelGroups` to set `state`.`State`Type: Dictionary`<string, object>``State` to set.`Uuid` *Type: string`Uuid``QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNSetStateResult`.`Execute` *Type: `System.Action``System.Action` of type `PNSetStateResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNSetStateResult>>`.

#### Get State[​](#get-state)

```
`pubnub.GetPresenceState()  
    .Channels(Array)  
    .ChannelGroups(Array)  
    .Uuid(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNGetStateResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channels`Type: Array`Channel` name to fetch the `state`.`ChannelGroups`Type: Array`ChannelGroups` name to fetch the `state`.`Uuid` *Type: string`Uuid``QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNGetStateResult`.`Execute` *Type: `System.Action``System.Action` of type `PNGetStateResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNGetStateResult>>`.

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state-1)

```
`Dictionarystring, object> myState = new Dictionarystring, object>();  
myState.Add("age", 20);  
  
PNResultPNSetStateResult> setstateResponse = await pubnub.SetPresenceState()  
    .Channels(new string[] {  
        "ch1",  
        "ch2",  
        "ch3"  
    })  
    .State(myState)  
    .ExecuteAsync();  
  
PNSetStateResult setstateResult = setstateResponse.Result;  
PNStatus status = setstateResponse.Status;  
// handle set state response  
`
```

#### Get State[​](#get-state-1)

```
`PNResultNGetStateResult> getstateResponse = await pubnub.GetPresenceState()  
    .Channels(new string[] {  
        // channels to fetch state for  
        "ch1",  
        "ch2",  
        "ch3"  
    })  
    .ChannelGroups(new string[] {  
        // channel groups to fetch state for  
        "cg1",  
        "cg2",  
        "cg3"  
    })  
    .Uuid("suchUUID") // uuid of user to fetch, or for own uuid  
    .ExecuteAsync();  
`
```
show all 19 lines

### Returns[​](#returns-2)

The `SetPresenceState()` operation returns a `PNResult<PNSetStateResult>` which contains the following properties:

Property NameTypeDescription`Result`PNGetStateResultReturns a `PNSetStateResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNSetStateResult` contains the following property:

Property NameTypeDescription`State`Dictionary`<string, object>`Dictionary of `UUIDs` and the user states.

The `GetPresenceState()` operation returns a `PNResult<PNGetStateResult>` which contains the following properties:

Property NameTypeDescription`Result`PNGetStateResultReturns a `PNGetStateResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNGetStateResult` contains the following property:

Property NameTypeDescription`StateByUUID`Dictionary`<string, object>`Dictionary of `UUIDs` and the user states.

### Other Examples[​](#other-examples-2)

#### Set state synchronously[​](#set-state-synchronously)

```
`Dictionarystring, object> myState = new Dictionarystring, object>();  
myState.Add("age", 20);  
  
pubnub.SetPresenceState()  
    .Channels(new string[] {  
        "ch1",  
        "ch2",  
        "ch3"  
    })  
    .State(myState)  
    .Execute(new PNSetStateResultExt(  
        (result, status) => {  
            // handle set state response  
        }  
    ));  
`
```

#### Get state synchronously[​](#get-state-synchronously)

```
`pubnub.GetPresenceState()  
    .Channels(new string[] {  
        // channels to fetch state for  
        "ch1",  
        "ch2",  
        "ch3"  
    })  
    .ChannelGroups(new string[] {  
        // channel groups to fetch state for  
        "cg1",  
        "cg2",  
        "cg3"  
    })  
    .Uuid("suchUUID") // uuid of user to fetch, or for own uuid  
    .Execute(new PNGetStateResultExt(  
`
```
show all 19 lines

#### Set state for channels in channel group[​](#set-state-for-channels-in-channel-group)

```
`Dictionarystring, object> myState = new Dictionarystring, object>();  
myState.Add("age", 20);  
  
PNResultPNSetStateResult> setstateResponse = await pubnub.SetPresenceState()  
    .ChannelGroups(new string[] {  
        // apply on those channel groups  
        "cg1",  
        "cg2",  
        "cg3"  
    })  
    .Channels(new string[] {  
        // apply on those channels  
        "ch1",  
        "ch2",  
        "ch3"  
`
```
show all 22 lines

The above code would return the following response to the client:

```
`{**    first  : "Robert",  
    last   : "Plant",  
    age    : 59,  
    region : "UK"  
}  
`
```
Last updated on Jun 16, 2025**