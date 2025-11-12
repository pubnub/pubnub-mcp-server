# Presence API for JavaScript SDK

Presence tracks online/offline users and lets you store custom state. Presence shows:
- Joins/leaves
- Occupancy (user count per channel)
- Channels a UUID is subscribed to
- Presence state per user

To learn more, see Presence overview and Presence Events.

Supported async patterns: Callbacks, Promises, and Async/Await (recommended). With Async/Await, add try...catch to receive error status.

## Here now

Requires Presence add-on enabled in Admin Portal. Returns current state of channels, including UUID list and occupancy. Cache: 3 seconds.

For presence events, see Presence Events.

### Method(s)

```
`1pubnub.hereNow({  
2    channels: Arraystring> ,  
3    channelGroups: Arraystring> ,  
4    includeUUIDs: boolean ,  
5    includeState: boolean ,  
6    limit: number ,  
7    offset: number  
8}); PromiseHereNowResponse>  
`
```

Parameters:
- channels (array<string>): Channel names to return occupancy results. Required if channelGroups not provided.
- channelGroups (array<string>): Channel Groups to query. Required if channels not provided. Wildcards not supported.
- includeUUIDs (boolean, default: true): Set to false to omit UUIDs in the response.
- includeState (boolean, default: false): Set to true to include subscriber state.
- limit (number, default: 1000): Max occupants per channel; range 0–1000. Use 0 for occupancy-only without user details.
- offset (number): Zero-based starting index for pagination; requires limit > 0. Only sent when offset > 0.

### Sample code

Reference code: Self-contained snippet with imports and console logging.

#### Get a list of UUIDs subscribed to channel

```
1
  

```

```
1
  

```

### Response

```
`1type hereNowResponse = {  
2    totalChannels: number, // totalChannels = get total of channels  
3    totalOccupancy: number, // totalOccupancy = get total of occupancies  
4    channels: object // channels = get a map with values for each channel with uuids and states for each occupant of the channel  
5}  
`
```

### Other examples

#### Returning state

Requires Presence add-on enabled.

```
1
  

```

##### Example response

```
1// Example of Status  
2{  
3    "error": false,  
4    "operation": "PNHereNowOperation",  
5    "statusCode": 200  
6}  
7
  
8// Example of Response  
9{  
10    "totalChannels": 1,  
11    "totalOccupancy": 3,  
12    "channels": {  
13        "my_channel": {  
14            "occupants": [  
15                {  
16                    "uuid": "User 1"  
17                },  
18                {  
19                    "state": {  
20                        "age": 18  
21                    },  
22                    "uuid": "User 2"  
23                },  
24                {  
25                    "state": {  
26                        "age": 24  
27                    },  
28                    "uuid": "User 3"  
29                }  
30            ],  
31            "name": "my_channel",  
32            "occupancy": 3  
33        }  
34    }  
35}  

```

#### Return occupancy only

Requires Presence add-on enabled.

Set includeUUIDs and includeState to false to return occupancy only:

```
1
  

```

##### Example response

```
1// Example of Status  
2{  
3    "error": false,  
4    "operation": "PNHereNowOperation",  
5    "statusCode": 200  
6}  
7
  
8// Example of Response  
9{  
10    "totalChannels": 1,  
11    "totalOccupancy": 3,  
12    "channels": {  
13        "my_channel": {  
14            "occupants": [],  
15            "name": "my_channel",  
16            "occupancy": 3  
17        }  
18    }  
19}  

```

#### Channel group usage

Requires Presence add-on enabled.

```
1
  

```

##### Example response

```
1// Example of Status  
2{  
3    "error": false,  
4    "operation": "PNHereNowOperation",  
5    "statusCode": 200  
6}  
7
  
8// Example of Response  
9{  
10    "totalChannels": 2,  
11    "totalOccupancy": 3,  
12    "channels": {  
13        "my_channel_1": {  
14            "occupants": [  
15                {  
16                    "state": null,  
17                    "uuid": "User1"  
18                },  
19                {  
20                    "state": null,  
21                    "uuid": "User3"  
22                }  
23            ],  
24            "name": "my_channel_1",  
25            "occupancy": 2  
26        },  
27        "my_channel_2": {  
28            "occupants": [  
29                {  
30                    "state": null,  
31                    "uuid": "User2"  
32                }  
33            ],  
34            "name": "my_channel_2",  
35            "occupancy": 1  
36        }  
37    }  
38}  

```

#### Sample code with promises

Requires Presence add-on enabled.

```
1
  

```

## Where now

Requires Presence add-on enabled. Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

To call whereNow:

```
`1pubnub.whereNow({  
2    uuid: string  
3}): PromiseWhereNowResponse>  
`
```

Parameter:
- uuid (string, default: current uuid): UUID to return channel list for.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

### Response

```
1// Example of Status  
2{  
3    error: false,  
4    operation: "PNWhereNowOperation",  
5    statusCode: 200  
6}  
7
  
8// Example of Response  
9{  
10    "channels": ["ch1", "ch2"]  
11}  

```

## User state

Requires Presence add-on enabled. Clients can set dynamic custom state (score, game state, location) per channel while subscribed. State isn’t persisted and is lost when disconnected. See Presence State.

### Method(s)

#### Set state

```
`1pubnub.setState({  
2    channels: Arraystring> ,  
3    channelGroups: Arraystring> ,  
4    state: any  
5}): PromiseSetStateResponse>;  
`
```

Parameters:
- channels (Array): Channels to set state. Provide either channels or channelGroups.
- channelGroups (Array): Channel Groups to set state. Provide either channels or channelGroups.
- state (any): JSON object of key/value pairs (int, float, string). No nested objects. Keys starting with pn are reserved. If state is undefined, current state for the UUID is returned. Existing keys are overwritten; set value to null to delete.

#### Get state

```
`1pubnub.getState({  
2    uuid: string,  
3    channels: Arraystring>,   
4    channelGroups: Arraystring>  
5}): PromiseGetStateResponse>;   
`
```

Parameters:
- uuid (string, default: current uuid): Subscriber UUID to get state for.
- channels (Array): Channels to get state. Provide either channels or channelGroups.
- channelGroups (Array): Channel Groups to get state. Provide either channels or channelGroups.

### Sample code

#### Set state

```
1
  

```

#### Get state

```
1
  

```

### Response

#### Set state

```
1// Example of Status  
2{  
3    error: false,  
4    operation: "PNSetStateOperation",  
5    statusCode: 200  
6}  
7
  
8// Example of Response  
9{  
10    state: {  
11        me: 'typing'  
12    }  
13}  

```

#### Get state

```
1// Example of Status  
2{  
3    error: false,  
4    operation: "PNGetStateOperation",  
5    statusCode: 200  
6}  
7
**8// Example of Response  
9{  
10    channels: {  
11        ch1: {  
12            me: 'typing'  
13        }  
14    }  
15}  

```