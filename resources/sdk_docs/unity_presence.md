# Presence API – Unity SDK (Condensed)

Presence lets you:

* Detect joins/leaves and channel occupancy.
* Query current occupants (`HereNow`), channels for a UUID (`WhereNow`), and manage custom per-UUID state.

Presence must be enabled for your key in the Admin Portal.

---

## Presence Event Modes
* Announce Mode
* Interval Mode  
Configured per channel in the Admin Portal.  
Occupancy count determines which mode fires.

---

## Here Now

Returns current occupants and occupancy of channels/channel groups.

*3 s server-side cache.*

### Method
```csharp
`pubnub.HereNow()  
    .Channels(Array)  
    .ChannelGroups(Array)  
    .IncludeState(bool)  
    .IncludeUUIDs(bool)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNHereNowResult, PNStatus>)  
`
```

Parameters  
* Channels – array of channel names.  
* ChannelGroups – array of group names.  
* IncludeState – include per-user state.  
* IncludeUUIDs – include UUID list.  
* QueryParam – extra query-string values.  
* Execute / ExecuteAsync – callback / Task.

### Sample code
```csharp
`  
`
```

### Returns
`PNResult<PNHereNowResult>`  

PNHereNowResult fields:  
* TotalChannels (int)  
* TotalOccupancy (int)  
* Channels – `Dictionary<string, PNHereNowChannelData>`

PNHereNowChannelData:  
* ChannelName (string)  
* Occupancy (int)  
* Occupants – `List<PNHereNowOccupantData>`

PNHereNowOccupantData:  
* Uuid (string)  
* State (object)

### Example response
```json
`{  
    "status" : 200,  
    "message" : "OK",  
    "service" : "Presence",  
    "uuids" : [  
        { "uuid" : "myUUID0" },  
        {  
            "state" : { "abcd" : { "age" : 15 } },  
            "uuid" : "myUUID1"  
`
```

### Occupancy-only example
```csharp
`  
`
```

```json
`{  
    "status": 200,  
    "message": "OK",  
    "payload": {  
        "channels": {  
            "81d8d989-b95f-443c-a726-04fac323b331": {  
                "uuids": [ "70fc1140-22b5-4abc-85b2-ff8c17b24d59" ],  
                "occupancy": 1  
            },  
            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
                "uuids": [ "91363e7f-584b-49cc-822c-52c2c01e5928" ],  
                "occupancy": 1  
            },  
            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
                "uuids": [ "ccfac1dd-b3a5-4afd-9fd9-db11aeb65395" ],  
`
```

---

## Where Now

Returns channels a given UUID is currently subscribed to.

### Method
```csharp
`pubnub.WhereNow()  
    .Uuid(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNWhereNowResult, PNStatus>)  
`
```

Parameters  
* Uuid – target UUID.  
* QueryParam – optional query-string pairs.  
* Execute / ExecuteAsync – callback / Task.

### Sample code
```csharp
`  
`
```

### Returns
`PNResult<PNWhereNowResult>`  

PNWhereNowResult:  
* Channels – `List<string>`

---

## User State (Set / Get)

Key–value pairs attached to a UUID.

### Set State
```csharp
`pubnub.SetPresenceState()  
    .Channels(Array)  
    .ChannelGroups(Array)  
    .State(Dictionarystring, object>)  
    .Uuid(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNSetStateResult, PNStatus>)  
`
```

### Get State
```csharp
`pubnub.GetPresenceState()  
    .Channels(Array)  
    .ChannelGroups(Array)  
    .Uuid(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNGetStateResult, PNStatus>)  
`
```

Shared parameters  
* Channels / ChannelGroups – targets.  
* State (set only) – `Dictionary<string,object>`.  
* Uuid – target UUID (defaults to client UUID).  
* QueryParam – extra query-string pairs.  
* Execute / ExecuteAsync – callback / Task.

### Sample code
```csharp
`  
`
```

```csharp
`  
`
```

### Returns
Set: `PNResult<PNSetStateResult>` → `State` (Dictionary)  
Get: `PNResult<PNGetStateResult>` → `StateByUUID` (Dictionary)

### Example state payload
```json
`{**    first  : "Robert",  
    last   : "Plant",  
    age    : 59,  
    region : "UK"  
}  
`
```

_Last updated : Jul 15 2025_