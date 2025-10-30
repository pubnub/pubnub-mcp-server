# Presence API for JavaScript SDK

Presence tracks who is online/offline and stores custom state information:
- Joins/leaves on channels
- Channel occupancy (user count)
- Channels a UUID is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. For presence event streams, see Presence Events. Recommended async pattern: Async/Await with try...catch for error statuses.

## Here now

Requires Presence

Returns current channel state: list of UUIDs subscribed and total occupancy. Cache: 3-second response caching.

### Method(s)

```
`1pubnub.hereNow({  
2    channels: Arraystring> ,  
3    channelGroups: Arraystring> ,  
4    includeUUIDs: boolean ,  
5    includeState: boolean ,  
6    limit: number  
7}); PromiseHereNowResponse>  
`
```

Parameters:
- channels (array<string>) — Specify channels to return occupancy. Required if channelGroups not provided.
- channelGroups (array<string>) — Channel Groups to query (no wildcards). Required if channels not provided.
- includeUUIDs (boolean, default: true) — Set false to omit UUIDs.
- includeState (boolean, default: false) — Set true to include subscriber state.
- limit (number, default: 1000) — Max occupants per channel (up to 1000).

### Sample code

#### Reference code

```
1
  

```

#### Get a list of UUIDs subscribed to channel

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

Requires Presence

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

Requires Presence

Specify a single channel with includeUUIDs and includeState set to false to return only occupancy.

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

Requires Presence

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

Requires Presence

```
1
  

```

## Where now

Requires Presence

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

Requires Presence

Clients can set dynamic custom state (e.g., score, location) on channels while subscribed. State is not persisted; it’s lost on disconnect.

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
- channels (Array) — Channels to set state. Provide either channels or channelGroups.
- channelGroups (Array) — Channel Groups to set state. Provide either channels or channelGroups.
- state (any) — JSON key/value pairs with supported types: int, float, string. No nested objects. Keys starting with pn are reserved. If undefined, returns current state for the specified uuid. Existing keys are overwritten. Delete a key by setting its value to null.

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
- uuid (String, default: current uuid) — Subscriber UUID to get state for.
- channels (Array) — Channels to get state. Provide either channels or channelGroups.
- channelGroups (Array) — Channel Groups to get state. Provide either channels or channelGroups.

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