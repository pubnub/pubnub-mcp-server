# Presence API for JavaScript SDK

Presence tracks online/offline users and per-user custom state. It can report join/leave events, channel occupancy, which channels a UUID is subscribed to, and presence state. See [Presence overview](/docs/general/presence/overview).

##### Supported and recommended asynchronous patterns

JavaScript SDK supports **Callbacks, Promises, and Async/Await**. Samples use **Async/Await**; Async/Await returns status only on error—use `try...catch` to receive error status.

---

## Here now[​](#here-now)

##### Requires Presence

Presence add-on must be enabled for your key in the [Admin Portal](https://admin.pubnub.com/) ([how to enable](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)). For presence events, see [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Returns current channel state: unique UUIDs subscribed and total occupancy.

##### Cache

3-second response cache.

### Method(s)[​](#methods)

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

Parameters (critical behavior):
- `channels: array<string>` — channel names to query. **You must specify either `channels` or `channelGroups`.**
- `channelGroups: array<string>` — channel groups to query. **You must specify either `channels` or `channelGroups`.** Wildcards not supported.
- `includeUUIDs: boolean` (default `true`) — set `false` to omit UUIDs.
- `includeState: boolean` (default `false`) — set `true` to include occupants’ state.
- `limit: number` (default `1000`) — max occupants per channel; range `0-1000`. Use `0` for occupancy counts only (no user details).
- `offset: number` — zero-based pagination index; must be `>= 0`; requires `limit > 0`. Included only when `offset > 0`.

### Sample code[​](#sample-code)

##### Reference code

Self-contained runnable snippet with imports and console logging (used as a reference for other examples).

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
1
  

```

```
1
  

```

### Response[​](#response)

```
`1type hereNowResponse = {  
2    totalChannels: number, // totalChannels = get total of channels  
3    totalOccupancy: number, // totalOccupancy = get total of occupancies  
4    channels: object // channels = get a map with values for each channel with uuids and states for each occupant of the channel  
5}  
`
```

### Other examples[​](#other-examples)

#### Returning state[​](#returning-state)

##### Requires Presence

Presence add-on must be enabled (see above). Presence events: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
1
  

```

##### Example response[​](#example-response)

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

#### Return occupancy only[​](#return-occupancy-only)

##### Requires Presence

Presence add-on must be enabled (see above). Presence events: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

To return only occupancy for a single channel: set `includeUUIDs: false` and `includeState: false`.

```
1
  

```

##### Example response[​](#example-response-1)

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

#### Channel group usage[​](#channel-group-usage)

##### Requires Presence

Presence add-on must be enabled (see above). Presence events: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
1
  

```

##### Example response[​](#example-response-2)

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

#### Sample code with promises[​](#sample-code-with-promises)

##### Requires Presence

Presence add-on must be enabled (see above). Presence events: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
1
  

```

---

## Where now[​](#where-now)

##### Requires Presence

Presence add-on must be enabled for your key (see above). Presence events: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Returns the list of channels a UUID is subscribed to.

##### Timeout events

If the app restarts (or page refreshes) within the heartbeat window, **no timeout event** is generated.

### Method(s)[​](#methods-1)

```
`1pubnub.whereNow({  
2    uuid: string  
3}): PromiseWhereNowResponse>  
`
```

- `uuid: string` (default: `current uuid`) — UUID to return channel list for.

### Sample code[​](#sample-code-1)

Define the `uuid` to query.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
1
  

```

### Response[​](#response-1)

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

---

## User state[​](#user-state)

##### Requires Presence

Presence add-on must be enabled for your key (see above). Presence events: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Set/get dynamic per-user state (for example score, game state, location) on one or more channels while subscribed. State is **not persisted**; it is lost on disconnect. See [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-2)

#### Set state[​](#set-state)

```
`1pubnub.setState({  
2    channels: Arraystring> ,  
3    channelGroups: Arraystring> ,  
4    state: any  
5}): PromiseSetStateResponse>;  
`
```

- `channels: Array` — **either `channels` or `channelGroups` required**; channels to set state on.
- `channelGroups: Array` — **either `channels` or `channelGroups` required**; channel groups to set state on.
- `state: any` — JSON key/value pairs (supported types: int, float, string). **No nested objects.** Keys starting with `pn` are reserved.  
  - If `state` is `undefined`, returns current state for the specified UUID.  
  - Existing keys are overwritten.  
  - Delete a key by setting its value to `null`.

#### Get state[​](#get-state)

```
`1pubnub.getState({  
2    uuid: string,  
3    channels: Arraystring>,   
4    channelGroups: Arraystring>  
5}): PromiseGetStateResponse>;   
`
```

- `uuid: string` (default: `current uuid`) — UUID to query.
- `channels: Array` — **either `channels` or `channelGroups` required**; channels to get state for.
- `channelGroups: Array` — **either `channels` or `channelGroups` required**; channel groups to get state for.

### Sample code[​](#sample-code-2)

#### Set state[​](#set-state-1)

```
1
  

```

#### Get state[​](#get-state-1)

```
1
  

```

### Response[​](#response-2)

#### Set state[​](#set-state-2)

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

#### Get state[​](#get-state-2)

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