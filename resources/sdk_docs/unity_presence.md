# Presence API for Unity SDK

Presence tracks who is online/offline and stores custom state:
- Join/leave events per channel
- Occupancy (subscribed user count)
- Channels a UUID is subscribed to
- Presence state per user

Presence event modes (configured in Admin Portal):
- Announce Mode
- Interval Mode
Mode depends on occupancy. See Presence Events documentation for behavior.

Requires Presence add-on enabled for your key.

## Here now

Returns current channel state: list of UUIDs and occupancy. 3-second response cache.

### Method(s)

```
`1pubnub.HereNow()  
2    .Channels(Array)  
3    .ChannelGroups(Array)  
4    .IncludeState(bool)  
5    .IncludeUUIDs(bool)  
6    .QueryParam(Dictionarystring,object>)  
7    .Execute(System.ActionPNHereNowResult, PNStatus>)  
`
```

Parameters and options:
- Channels (Array): Channels to query.
- ChannelGroups (Array): Channel groups to query. Wildcards not supported.
- IncludeState (bool): Include user state in response.
- IncludeUUIDs (bool): Include UUIDs in response.
- QueryParam (Dictionary<string, object>): Extra query parameters.
- Execute(System.Action<PNHereNowResult, PNStatus>): Callback execution.
- ExecuteAsync(): Returns Task<PNResult<PNHereNowResult>>.

### Sample code

#### Get a list of UUIDs subscribed to channel

Reference code

```
1
  

```

### Returns

HereNow() returns PNResult<PNHereNowResult>:
- Result: PNHereNowResult
- Status: PNStatus

PNHereNowResult:
- TotalChannels (int)
- TotalOccupancy (int)
- Channels (Dictionary<string, PNHereNowChannelData>)

PNHereNowChannelData:
- ChannelName (string)
- Occupancy (int)
- Occupants (List<PNHereNowOccupantData>)

PNHereNowOccupantData:
- Uuid (string)
- State (object)

### Other examples

#### Get a list of UUIDs subscribed to channel synchronously

```
1
  

```

#### Returning state

```
1
  

```

#### Example response

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
18            "uuid" : "b9eb408c-bcec-4d34-b4c4-fabec057ad0d"  
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

Set IncludeUUIDs to false to return only occupancy for a channel.

```
1
  

```

#### Example response

```
`1{  
2    "status": 200,  
3    "message": "OK",  
4    "payload": {  
5        "channels": {  
6            "81d8d989-b95f-443c-a726-04fac323b331": {  
7                "uuids": [ "70fc1140-22b5-4abc-85b2-ff8c17b24d59" ],  
8                "occupancy": 1  
9            },  
10            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
11                "uuids": [ "91363e7f-584b-49cc-822c-52c2c01e5928" ],  
12                "occupancy": 1  
13            },  
14            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
15                "uuids": [ "ccfac1dd-b3a5-4afd-9fd9-db11aeb65395" ],  
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

## Where now

Returns channels a UUID is subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pubnub.WhereNow()  
2    .Uuid(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNWhereNowResult, PNStatus>)  
`
```

Parameters and options:
- Uuid (string): Target UUID.
- QueryParam (Dictionary<string, object>): Extra query parameters.
- Execute(System.Action<PNWhereNowResult, PNStatus>): Callback execution.
- ExecuteAsync(): Returns Task<PNResult<PNWhereNowResult>>.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

### Returns

WhereNow() returns PNResult<PNWhereNowResult>:
- Result: PNWhereNowResult
- Status: PNStatus

PNWhereNowResult:
- Channels (List<string>): Channels where the UUID is present.

### Other examples

#### Get a list of channels synchronously

```
1
  

```

#### Obtain information about the current list of channels of some other UUID

```
1
  

```

## User state

Set/get key/value pairs for a subscriber UUID. State is a Dictionary<string, object>.

### Method(s)

#### Set state

```
`1pubnub.SetPresenceState()  
2    .Channels(Array)  
3    .ChannelGroups(Array)  
4    .State(Dictionarystring, object>)  
5    .Uuid(string)  
6    .QueryParam(Dictionarystring,object>)  
7    .Execute(System.ActionPNSetStateResult, PNStatus>)  
`
```

Parameters and options:
- Channels (Array): Channels to set state on.
- ChannelGroups (Array): Channel groups to set state on.
- State (Dictionary<string, object>): State to set.
- Uuid (string): Target UUID.
- QueryParam (Dictionary<string, object>): Extra query parameters.
- Execute(System.Action<PNSetStateResult, PNStatus>): Callback execution.
- ExecuteAsync(): Returns Task<PNResult<PNSetStateResult>>.

#### Get state

```
`1pubnub.GetPresenceState()  
2    .Channels(Array)  
3    .ChannelGroups(Array)  
4    .Uuid(string)  
5    .QueryParam(Dictionarystring,object>)  
6    .Execute(System.ActionPNGetStateResult, PNStatus>)  
`
```

Parameters and options:
- Channels (Array): Channels to fetch state for.
- ChannelGroups (Array): Channel groups to fetch state for.
- Uuid (string): Target UUID.
- QueryParam (Dictionary<string, object>): Extra query parameters.
- Execute(System.Action<PNGetStateResult, PNStatus>): Callback execution.
- ExecuteAsync(): Returns Task<PNResult<PNGetStateResult>>.

### Sample code

#### Set state

```
1
  

```

#### Get state

```
1
  

```

### Returns

SetPresenceState() returns PNResult<PNSetStateResult>:
- Result: PNSetStateResult
- Status: PNStatus

PNSetStateResult:
- State (Dictionary<string, object>): Dictionary of UUIDs and user states.

GetPresenceState() returns PNResult<PNGetStateResult>:
- Result: PNGetStateResult
- Status: PNStatus

PNGetStateResult:
- StateByUUID (Dictionary<string, object>): Dictionary of UUIDs and user states.

### Other examples

#### Set state synchronously

```
1
  

```

#### Get state synchronously

```
1
  

```

#### Set state for channels in channel group

```
1
  

```

Response:

```
`1{**2    first  : "Robert",  
3    last   : "Plant",  
4    age    : 59,  
5    region : "UK"  
6}  
`
```