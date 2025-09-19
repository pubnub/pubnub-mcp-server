# Presence API for JavaScript SDK

Presence lets you track online/offline users, occupancy, subscriptions, and per-user presence state.

- All methods require the Presence add-on to be enabled for your key in the Admin Portal.
- To receive presence events, see Presence Events.
- Supported async patterns: callbacks, promises, async/await. Recommended: async/await with try...catch for error handling.

## Here now

Returns the current state of one or more channels: list of UUIDs and occupancy.

Cache: 3-second response cache time.

### Methods

```
`pubnub.hereNow({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    includeUUIDs: boolean ,  
    includeState: boolean   
}); PromiseHereNowResponse>  
`
```

Parameters:
- channels (array<string>) — Required if channelGroups not provided. Channels to return occupancy for.
- channelGroups (array<string>) — Required if channels not provided. Channel Groups to return occupancy for. Wildcards not supported.
- includeUUIDs (boolean, default: true) — If false, UUID list is not returned.
- includeState (boolean, default: false) — If true, returns subscriber state.

### Sample code

Reference code

```
`  
`
```

Get a list of UUIDs subscribed to channel

```
`  
`
```

### Response

```
`type hereNowResponse = {  
    totalChannels: number, // totalChannels = get total of channels  
    totalOccupancy: number, // totalOccupancy = get total of occupancies  
    channels: object // channels = get a map with values for each channel with uuids and states for each occupant of the channel  
}  
`
```

### Other examples

Returning state

```
`  
`
```

Example response

```
`// Example of Status  
{  
    "error": false,  
    "operation": "PNHereNowOperation",  
    "statusCode": 200  
}  
  
// Example of Response  
{  
    "totalChannels": 1,  
    "totalOccupancy": 3,  
    "channels": {  
        "my_channel": {  
            "occupants": [  
                {  
`
```
show all 35 lines

Return occupancy only

You can return only occupancy for a single channel by specifying the channel and setting includeUUIDs and includeState to false:

```
`  
`
```

Example response

```
`// Example of Status  
{  
    "error": false,  
    "operation": "PNHereNowOperation",  
    "statusCode": 200  
}  
  
// Example of Response  
{  
    "totalChannels": 1,  
    "totalOccupancy": 3,  
    "channels": {  
        "my_channel": {  
            "occupants": [],  
            "name": "my_channel",  
`
```
show all 19 lines

Channel group usage

```
`  
`
```

Example response

```
`// Example of Status  
{  
    "error": false,  
    "operation": "PNHereNowOperation",  
    "statusCode": 200  
}  
  
// Example of Response  
{  
    "totalChannels": 2,  
    "totalOccupancy": 3,  
    "channels": {  
        "my_channel_1": {  
            "occupants": [  
                {  
`
```
show all 38 lines

Sample code with promises

```
`  
`
```

## Where now

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Methods

```
`pubnub.whereNow({  
    uuid: string  
}): PromiseWhereNowResponse>  
`
```

Parameters:
- uuid (string, default: current uuid) — UUID to return channel list for.

### Sample code

Get a list of channels a UUID is subscribed to

```
`  
`
```

### Response

```
`// Example of Status  
{  
    error: false,  
    operation: "PNWhereNowOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    "channels": ["ch1", "ch2"]  
}  
`
```

## User state

Clients can set dynamic custom state (for example, typing, score, location) on channels while subscribed. State is not persisted and is lost on disconnect. See Presence State for details.

### Methods

Set state

```
`pubnub.setState({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    state: any  
}): PromiseSetStateResponse>;  
`
```

Parameters:
- channels (Array) — Provide channels (or channelGroups). Channels to set the state.
- channelGroups (Array) — Provide channelGroups (or channels). Channel Groups to set the state.
- state (any) — JSON object with key/value pairs. Supported types: int, float, string. No nested objects. Keys starting with pn are reserved. If undefined, returns current state for the specified uuid. Existing keys are overwritten; delete keys by setting value to null.

Get state

```
`pubnub.getState({  
    uuid: string,  
    channels: Arraystring>,   
    channelGroups: Arraystring>  
}): PromiseGetStateResponse>;   
`
```

Parameters:
- uuid (string, default: current uuid) — Subscriber UUID to get state for.
- channels (Array) — Provide channels (or channelGroups). Channels to get state.
- channelGroups (Array) — Provide channelGroups (or channels). Channel Groups to get state.

### Sample code

Set state

```
`  
`
```

Get state

```
`  
`
```

### Response

Set state

```
`// Example of Status  
{  
    error: false,  
    operation: "PNSetStateOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    state: {  
        me: 'typing'  
    }  
}  
`
```

Get state

```
`// Example of Status**{  
    error: false,  
    operation: "PNGetStateOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    channels: {  
        ch1: {  
            me: 'typing'  
        }  
    }  
}  
`
```