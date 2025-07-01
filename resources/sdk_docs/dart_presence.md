On this page
# Presence API for Dart SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `hereNow()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following methods in the Dart SDK:

```
`pubnub.hereNow(  
  {Keyset? keyset,  
  String? using,  
  SetString> channels = const {},  
  SetString> channelGroups = const {},  
  StateInfo? stateInfo}  
)   
`
```

*  requiredParameterDescription`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`channels`Type: `Set<String>`Default:  
n/aThe `channels` to get the 'here now' details of.`channelGroups`Type: `Set<String>`Default:  
n/aThe `channelGroups` to get the 'here now' details of.`stateInfo`Type: `StateInfo`Default:  
`false`If `true`, the response will include the presence states of the users for `channels`/`channelGroups`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Channel to get presence information  
  String channel = 'my_channel';  
  
`
```
show all 28 lines

### Returns[​](#returns)

The `hereNow()` operation returns a `HereNowResult` which contains the following operations:

Property NameTypeDescription`totalChannels``int`Total channels.`totalOccupancy``int`Total occupancy.`channels``Map<String?, ChannelOccupancy>`A map with values of `ChannelOccupancy` for each channel. See [ChannelOccupancy](#channeloccupancy) for more details.

#### ChannelOccupancy[​](#channeloccupancy)

Property NameTypeDescription`channelName``String`Channel name.`count``int`Occupancy of the channel.`uuids``Map<String, OccupantInfo>`A map of `OccupantInfo`, see [OccupantInfo](#occupantinfo) for more details.

#### OccupantInfo[​](#occupantinfo)

Property NameTypeDescription`uuid``String`UUID of the user.`state``dynamic`State of the user.

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`var result =  
    await pubnub.hereNow(channels: {'my_channel'}, stateInfo: StateInfo.all);  
`
```

Example response:

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
`var result =  
    await pubnub.hereNow(channels: {'my_channel'});  
`
```

Example response:

```
`{  
    "status": 200,  
    "message": "OK",  
    "payload": {  
        "channels": {  
            "81d8d989-b95f-443c-a726-04fac323b331": {  
                "uuids": [ "70fc1140-uuid-4abc-85b2-ff8c17b24d59" ],  
                "occupancy": 1  
            },  
            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
                "uuids": [ "91363e7f-uuid-49cc-822c-52c2c01e5928" ],  
                "occupancy": 1  
            },  
            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
                "uuids": [ "ccfac1dd-uuid-4afd-9fd9-db11aeb65395" ],  
`
```
show all 23 lines

#### Here Now for Channel Groups[​](#here-now-for-channel-groups)

```
`var result = await pubnub.hereNow(channelGroups: {'cg1'});  
`
```

Example response:

```
`{  
    occupancy : 4,  
    uuids : ['123123234t234f34fuuid', '143r34f34t34fq34quuid', '23f34d3f4rq34r34ruuid', 'w34tcw45t45tcw435uuid']  
}  
`
```

## Announce Heartbeat[​](#announce-heartbeat)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

A device linked to the UUID in the keyset can notify `channels` and `channelGroups` about its presence.

### Method(s)[​](#methods-1)

To call `Announce Heartbeat` you can use the following methods in the Dart SDK:

```
`pubnub.announceHeartbeat(  
  {Keyset? keyset,  
  String? using,  
  SetString> channels = const {},  
  SetString> channelGroups = const {},  
  int? heartbeat}  
)   
`
```

*  requiredParameterDescription`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`channels`Type: `Set<String>`Default:  
n/aThe `channels` to notify.`channelGroups`Type: `Set<String>`Default:  
n/aThe `channelGroups` to notify.`heartbeat`Type: `int`Default:  
n/aIt is used to set the presence timeout period. It overrides the default value of 300 for Presence Timeout.

### Basic Usage[​](#basic-usage-1)

#### Announce heartbeat to a single channel[​](#announce-heartbeat-to-a-single-channel)

```
`var result = await pubnub.announceHeartbeat(channels: {'my_channel'});  
`
```

#### Announce heartbeat to a channel group[​](#announce-heartbeat-to-a-channel-group)

```
`var result = await pubnub.announceHeartbeat(channelGroups: {'cg1'});  
`
```

### Returns[​](#returns-1)

The `announceHeartbeat()` operation  returns a `HeartbeatResult` object which does not have actionable data.

## Announce Leave[​](#announce-leave)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

A device linked to the UUID in the keyset can notify `channels` and `channelGroups` that it has left (is no longer present).

### Method(s)[​](#methods-2)

To call `Announce Leave` you can use the following methods in the Dart SDK:

```
`pubnub.announceLeave(  
  {Keyset? keyset,  
  String? using,  
  SetString> channels = const {},  
  SetString> channelGroups = const {}}  
)   
`
```

*  requiredParameterDescription`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.`channels`Type: `Set<String>`The `channels` to notify.`channelGroups`Type: `Set<String>`The `channelGroups` to notify.

### Basic Usage[​](#basic-usage-2)

#### Announce leave to a single channel[​](#announce-leave-to-a-single-channel)

```
`var result = await pubnub.announceLeave(channels: {'my_channel'});  
`
```

#### Announce leave to a channel group[​](#announce-leave-to-a-channel-group)

```
`var result = await pubnub.announceLeave(channelGroups: {'cg1'});  
`
```

### Returns[​](#returns-2)

The `announceLeave()` operation  returns a `LeaveResult` object which has following property.

Property NameTypeDescription`action``String`Action name, for example `leave`.

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-3)

#### Set State[​](#set-state)

To call `Set State` you can use the following method in the Dart SDK:

```
`pubnub.setState(  
  dynamic state, {  
  Keyset? keyset,  
  String? using,  
  SetString> channels = const {},  
  SetString> channelGroups = const {},  
})  
`
```

*  requiredParameterDescription`state` *Type: `dynamic`Default:  
n/aThe `state` as a JSON object to set for the specified channels or channel groups.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`channels`Type: `Set<String>`Default:  
`{}`Set of `channels` to set the `state`.`channelGroups`Type: `Set<String>`Default:  
`{}`Set of `channelGroups` to set the `state`.

#### Get State[​](#get-state)

To call `Get State` you can use the following method in the Dart SDK:

```
`pubnub.getState({  
  Keyset? keyset,  
  String? using,  
  SetString> channels = const {},  
  SetString> channelGroups = const {}  
})  
`
```

*  requiredParameterDescription`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`channels`Type: `Set<String>`Default:  
`{}`Set of `channels` to fetch the `state`.`channelGroups`Type: `Set<String>`Default:  
`{}`Set of `channelGroups` to fetch the `state`.

### Basic Usage[​](#basic-usage-3)

#### Set state[​](#set-state-1)

```
`var state = {'is_typing': true};  
  
var result = await pubnub.setState(  
  state,  
  channels: {'my_channel'}  
);  
`
```

#### Get state[​](#get-state-1)

```
`var result = await pubnub.getState(  
  channels: {'ch1', 'ch2', 'ch3'},  
  channelGroups: {'cg1', 'cg2'}  
);  
`
```

### Returns[​](#returns-3)

#### Set state[​](#set-state-2)

The `setState` operation returns a `SetUserStateResult` object which indicates the success of the operation.

#### Get state[​](#get-state-2)

The `getState` operation returns a `GetUserStateResult` object which contains the following operations:

MethodDescription`stateByUUID()`Type: `Map<String, Object>`Map of `UUIDs` and their associated user states.Last updated on **Jun 16, 2025**