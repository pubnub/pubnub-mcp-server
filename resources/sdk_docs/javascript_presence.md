# Presence API – JavaScript SDK (condensed)

• Presence add-on must be enabled for your keys.  
• Supports callbacks, promises, and async/await (recommended).  
• Heartbeat window rules apply; no timeout event if the client reconnects before heartbeat expires.  
• hereNow() responses are cached for 3 s.

---

## hereNow()

Returns current occupancy for channels/channel groups.

```
`pubnub.hereNow({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    includeUUIDs: boolean ,  
    includeState: boolean   
}); PromiseHereNowResponse>  
`
```

Parameters  
• channels (Array<string>) – channel list (required if channelGroups absent).  
• channelGroups (Array<string>) – group list (required if channels absent).  
• includeUUIDs (boolean, default true) – omit UUID list when false.  
• includeState (boolean, default false) – include per-UUID state when true.

### Sample code

```
`  
`
```

### Response

```
`type hereNowResponse = {  
    totalChannels: number,  
    totalOccupancy: number,  
    channels: object  
}  
`
```

### Additional examples

Returning state

```
`  
`
```

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

Return occupancy only (set includeUUIDs =false)

```
`  
`
```

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

Channel-group usage

```
`  
`
```

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

Promise-style example

```
`  
`
```

---

## whereNow()

Returns channels to which a UUID is currently subscribed.

```
`pubnub.whereNow({  
    uuid: string  
}): PromiseWhereNowResponse>  
`
```

Parameter  
• uuid (string, default current UUID).

```
`  
`
```

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

---

## User State

Set or retrieve arbitrary JSON state for a UUID on channels/groups (ephemeral; cleared on disconnect).

### setState

```
`pubnub.setState({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    state: any  
}): PromiseSetStateResponse>;  
`
```

• Provide either channels or channelGroups.  
• state: flat key/value pairs (int, float, string). Keys prefixed with `pn` are reserved.

### getState

```
`pubnub.getState({  
    uuid: string,  
    channels: Arraystring>,   
    channelGroups: Arraystring>  
}): PromiseGetStateResponse>;   
`
```

• uuid defaults to current UUID.  
• Provide channels or channelGroups.

#### Examples

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

Set-state response

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

Get-state response

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

_Last updated Jul 15 2025_