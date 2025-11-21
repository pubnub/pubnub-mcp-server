# Presence API for JavaScript SDK

Presence lets you track who is online/offline and store custom state. Presence shows:
- Join/leave events
- Channel occupancy counts
- Channels a UUID (user/device) is subscribed to
- Presence state

Requires Presence add-on enabled for your key in the Admin Portal. See Presence overview and Presence Events for details.

Supported async patterns: Callbacks, Promises, Async/Await (recommended). Use try...catch to receive error status.

## Here now

Returns the current state of one or more channels, including UUIDs and occupancy counts.

Cache: 3-second response cache time.

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
- channels (array<string>) — Required if channelGroups not provided. Channels to return occupancy results for.
- channelGroups (array<string>) — Required if channels not provided. Channel Groups to query. Wildcards not supported.
- includeUUIDs (boolean, default: true) — If false, UUIDs are not returned.
- includeState (boolean, default: false) — If true, subscriber state is returned.
- limit (number, default: 1000) — Max occupants per channel. Range 0–1000. Use 0 for occupancy-only without user details.
- offset (number) — Zero-based starting index for pagination. Requires limit > 0. Included only when offset > 0.

### Sample code

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

You can return only occupancy for a single channel by specifying the channel and setting includeUUIDs and includeState to false:

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

```
1
  

```

## Where now

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pubnub.whereNow({  
2    uuid: string  
3}): PromiseWhereNowResponse>  
`
```

Parameters:
- uuid (string, default: current uuid) — UUID to return channel list for.

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

Clients can set a dynamic custom state (for example, score, game state, location) on one or more channels while subscribed. State is not persisted and is lost on disconnect. See Presence State for details.

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
- channels (Array) — Either channels or channelGroups must be provided. Channels to set the state.
- channelGroups (Array) — Either channels or channelGroups must be provided. Channel Groups to set the state.
- state (any) — JSON object of key/value pairs. Supported data types: int, float, string. No nested key/values. Keys starting with pn are reserved. If undefined, returns current state for the specified uuid. Existing keys are overwritten. Set value to null to delete a key.

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
- uuid (String, default: current uuid) — Subscriber UUID to get current state.
- channels (Array) — Either channels or channelGroups must be provided. Channels to get the state.
- channelGroups (Array) — Either channels or channelGroups must be provided. Channel Groups to get the state.

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

Last updated on Nov 10, 2025