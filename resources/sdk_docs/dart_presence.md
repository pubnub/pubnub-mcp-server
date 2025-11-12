# Presence API for Dart SDK

Requires Presence: Enable the Presence add-on for your key in the Admin Portal.

Presence provides:
- Join/leave events per channel
- Channel occupancy (user count)
- Subscribed channels per user/device
- Presence state per user

Learn more: Presence overview; Presence events.

## Here now

Returns the current state of channels: list of UUIDs and occupancy.

Cache: 3-second response cache.

### Method(s)

```
`1pubnub.hereNow(  
2  {Keyset? keyset,  
3  String? using,  
4  SetString> channels = const {},  
5  SetString> channelGroups = const {},  
6  StateInfo? stateInfo,  
7  int limit,  
8  int offset}  
9)   
`
```

Parameters:
- keyset (Type: Keyset): Override for the default keyset.
- using (Type: String): Keyset name from keysetStore to use.
- channels (Type: Set<String>): Channels to fetch here-now details.
- channelGroups (Type: Set<String>): Channel groups to fetch here-now details. Wildcards not supported.
- stateInfo (Type: StateInfo, Default: false): If true, include presence state for users.
- limit (Type: int, Default: 1000): Max occupants per channel, 0–1000. Use 0 for counts only (no user details).
- offset (Type: int, Default: 0): Zero-based starting index for pagination; requires limit > 0. Use with limit to paginate.

### Sample code

Reference code

#### Get a list of UUIDs subscribed to channel

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Channel to get presence information  
14  String channel = 'my_channel';  
15
  
16  try {  
17    // Get presence information  
18    var result = await pubnub.hereNow(channels: {channel});  
19
  
20    // Print the total occupancy and UUIDs  
21    print('Total Occupancy: ${result.totalOccupancy}');  
22    result.channels[channel]?.uuids.forEach((uuid, info) {  
23      print('UUID: $uuid, State: ${info.state}');  
24    });  
25  } catch (e) {  
26    print('Error retrieving presence information: $e');  
27  }  
28}  
```

### Returns

HereNowResult:
- totalChannels (int): Total channels.
- totalOccupancy (int): Total occupancy.
- channels (Map<String?, ChannelOccupancy>): Per-channel details.
- nextOffset (int?): Offset for next page if not all UUIDs returned; null if none.

ChannelOccupancy:
- channelName (String): Channel name.
- count (int): Channel occupancy.
- uuids (Map<String, OccupantInfo>): Per-UUID info.

OccupantInfo:
- uuid (String): User UUID.
- state (dynamic): User state.

### Other examples

#### Returning state

```
`1var result =  
2    await pubnub.hereNow(channels: {'my_channel'}, stateInfo: StateInfo.all);  
`
```

Example response:

```
`1{  
2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "Presence",  
5    "uuids" : [  
6        {  
7            "uuid" : "myUUID0"  
8        },  
9        {  
10            "state" : {  
11                "abcd" : {  
12                    "age" : 15  
13                }  
14            },  
15            "uuid" : "myUUID1"  
16        },  
17        {  
18            "uuid" : "b9eb408c-bcec-uuid-b4c4-fabec057ad0d"  
19        },  
20        {  
21            "state" : {  
22                "abcd" : {  
23                    "age" : 15  
24                }  
25            },  
26            "uuid" : "myUUID2"  
27        },  
28        {  
29            "state" : {  
30                "abcd" : {  
31                    "age" : 24  
32                }  
33            },  
34            "uuid" : "myUUID9"  
35        }  
36    ],  
37    "occupancy" : 5  
38}  
`
```

#### Return occupancy only

To return only occupancy for a channel, set flags to exclude UUIDs and state.

```
`1var result =  
2    await pubnub.hereNow(channels: {'my_channel'});  
`
```

Example response:

```
`1{  
2    "status": 200,  
3    "message": "OK",  
4    "payload": {  
5        "channels": {  
6            "81d8d989-b95f-443c-a726-04fac323b331": {  
7                "uuids": [ "70fc1140-uuid-4abc-85b2-ff8c17b24d59" ],  
8                "occupancy": 1  
9            },  
10            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
11                "uuids": [ "91363e7f-uuid-49cc-822c-52c2c01e5928" ],  
12                "occupancy": 1  
13            },  
14            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
15                "uuids": [ "ccfac1dd-uuid-4afd-9fd9-db11aeb65395" ],  
16                "occupancy": 1  
17            }  
18        },  
19        "total_channels": 3,  
20        "total_occupancy": 3  
21    },  
22    "service": "Presence"  
23}  
`
```

#### Here now for channel groups

```
`1var result = await pubnub.hereNow(channelGroups: {'cg1'});  
`
```

Example response:

```
`1{  
2    occupancy : 4,  
3    uuids : ['123123234t234f34fuuid', '143r34f34t34fq34quuid', '23f34d3f4rq34r34ruuid', 'w34tcw45t45tcw435uuid']  
4}  
`
```

## Announce heartbeat

A device for the keyset UUID can notify channels and channel groups that it is present.

### Method(s)

```
`1pubnub.announceHeartbeat(  
2  {Keyset? keyset,  
3  String? using,  
4  SetString> channels = const {},  
5  SetString> channelGroups = const {},  
6  int? heartbeat}  
7)   
`
```

Parameters:
- keyset (Type: Keyset): Override for the default keyset.
- using (Type: String): Keyset name from keysetStore.
- channels (Type: Set<String>): Channels to notify.
- channelGroups (Type: Set<String>): Channel groups to notify.
- heartbeat (Type: int): Presence timeout override (default Presence Timeout is 300 seconds).

### Sample code

#### Announce heartbeat to a single channel

```
`1var result = await pubnub.announceHeartbeat(channels: {'my_channel'});  
`
```

#### Announce heartbeat to a channel group

```
`1var result = await pubnub.announceHeartbeat(channelGroups: {'cg1'});  
`
```

### Returns

announceHeartbeat() returns HeartbeatResult (no actionable data).

## Announce leave

Notify channels and channel groups that this device (UUID) has left.

### Method(s)

```
`1pubnub.announceLeave(  
2  {Keyset? keyset,  
3  String? using,  
4  SetString> channels = const {},  
5  SetString> channelGroups = const {}}  
6)   
`
```

Parameters:
- keyset (Type: Keyset): Override for the default keyset.
- using (Type: String): Keyset name from keysetStore.
- channels (Type: Set<String>): Channels to notify.
- channelGroups (Type: Set<String>): Channel groups to notify.

### Sample code

#### Announce leave to a single channel

```
`1var result = await pubnub.announceLeave(channels: {'my_channel'});  
`
```

#### Announce leave to a channel group

```
`1var result = await pubnub.announceLeave(channelGroups: {'cg1'});  
`
```

### Returns

announceLeave() returns LeaveResult:
- action (String): Action name (for example, "leave").

## User state

Clients can set dynamic, non-persisted state (for example, score, typing, location) per channel while subscribed. State is lost on disconnect.

### Method(s)

#### Set state

```
`1pubnub.setState(  
2  dynamic state, {  
3  Keyset? keyset,  
4  String? using,  
5  SetString> channels = const {},  
6  SetString> channelGroups = const {},  
7})  
`
```

Parameters:
- state (Type: dynamic): JSON object to set as state.
- keyset (Type: Keyset): Override for the default keyset.
- using (Type: String): Keyset name from keysetStore.
- channels (Type: Set<String>, Default: {}): Channels to set state on.
- channelGroups (Type: Set<String>, Default: {}): Channel groups to set state on.

#### Get state

```
`1pubnub.getState({  
2  Keyset? keyset,  
3  String? using,  
4  SetString> channels = const {},  
5  SetString> channelGroups = const {}  
6})  
`
```

Parameters:
- keyset (Type: Keyset): Override for the default keyset.
- using (Type: String): Keyset name from keysetStore.
- channels (Type: Set<String>, Default: {}): Channels to fetch state for.
- channelGroups (Type: Set<String>, Default: {}): Channel groups to fetch state for.

### Sample code

#### Set state

```
1var state = {'is_typing': true};  
2
  
3var result = await pubnub.setState(  
4  state,  
5  channels: {'my_channel'}  
6);  
```

#### Get state

```
`1var result = await pubnub.getState(  
2  channels: {'ch1', 'ch2', 'ch3'},  
3  channelGroups: {'cg1', 'cg2'}  
4);  
`
```

### Returns

#### Set state

setState returns SetUserStateResult (success indicator).

#### Get state

getState returns GetUserStateResult:
- stateByUUID() (Type: Map<String, Object>): Map of UUIDs and their states.