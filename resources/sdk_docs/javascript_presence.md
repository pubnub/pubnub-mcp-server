# Presence API – JavaScript SDK (condensed)

Presence lets you:
• Detect users joining/leaving channels  
• Query channel occupancy and user state  
• List channels a UUID is on  
• Set/Get per-user state  

Async style: callbacks, Promises, or **async/await** (recommended). Use `try … catch` for errors.

---

## Here Now

Returns current occupancy and optional state for channels or channel groups.  
Response cached for 3 s.

### Method

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
• channels – array<string> (required if `channelGroups` omitted)  
• channelGroups – array<string> (required if `channels` omitted)  
• includeUUIDs – boolean, default `true`  
• includeState – boolean, default `false`

### Basic usage

```
`  
`
```

### Response type

```
`type hereNowResponse = {  
    totalChannels: number,  
    totalOccupancy: number,  
    channels: object  
}  
`
```

### Additional examples
Returning State

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

Return Occupancy Only

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

Channel Group query

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

Promises variant

```
`  
`
```

---

## Where Now

Lists channels a UUID is currently subscribed to.

### Method

```
`pubnub.whereNow({  
    uuid: string  
}): PromiseWhereNowResponse>  
`
```

Parameter  
• uuid – string, defaults to current client UUID.

### Example

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

Set or retrieve custom state for one or more channels / channel groups.

### Set State

```
`pubnub.setState({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    state: any  
}): PromiseSetStateResponse>;  
`
```

• channels / channelGroups – one required  
• state – JSON (flat key/value; ints, floats, strings)

### Get State

```
`pubnub.getState({  
    uuid: string,  
    channels: Arraystring>,   
    channelGroups: Arraystring>  
}): PromiseGetStateResponse>;   
`
```

### Examples

Set State

```
`  
`
```

Get State

```
`  
`
```

Set State Response

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

Get State Response

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

_Last updated Jun 30 2025_