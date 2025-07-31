# Presence API – C# SDK (condensed)

Presence lets you query real-time occupancy, channel lists per UUID, and set/get custom state.

---

## General request pattern
Use `try / catch` around any SDK call:

```  
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

`status` contains server/network errors; parameter errors throw an exception.

---

## Here Now  (requires Presence add-on)
Returns current occupancy and (optionally) state for channels/channel groups.  
Response is cached for 3 s.

### Method
```  
`pubnub.HereNow()  
        .Channels(Array)  
        .ChannelGroups(Array)  
        .IncludeState(bool)  
        .IncludeUUIDs(bool)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• Channels (Array) – target channels.  
• ChannelGroups (Array) – target channel groups.  
• IncludeState (bool) – include user state.  
• IncludeUUIDs (bool) – include UUID list.  
• QueryParam (Dictionary<string,object>) – extra query string pairs.  

Execution  
• `ExecuteAsync()` → `PNResult<PNHereNowResult>`  
(legacy `Async/Execute` callbacks are deprecated).

### Return objects
`PNHereNowResult`  
• TotalChannels (int)  
• TotalOccupancy (int)  
• Channels (Dictionary<string, PNHereNowChannelData>)

`PNHereNowChannelData`  
• ChannelName (string)  
• Occupancy (int)  
• Occupants (List<PNHereNowOccupantData>)

`PNHereNowOccupantData`  
• Uuid (string)  
• State (object)

### Sample
```  
`  
`
```

### Example response
```  
`{  
    "status" : 200,  
    "message" : "OK",  
    "service" : "Presence",  
    "uuids" : [  
        { "uuid" : "myUUID0" },  
        { "state" : { "abcd" : { "age" : 15 } }, "uuid" : "myUUID1" }  
`
```
(show all 38 lines)

### Occupancy-only
```  
`  
`
```
Example:
```  
`{  
    "status": 200,  
    "message": "OK",  
    "payload": {  
        "channels": {  
            "81d8d989-b95f-443c-a726-04fac323b331": {  
                "uuids": [ "70fc1140-22b5-4abc-85b2-ff8c17b24d59" ],  
                "occupancy": 1  
            },  
            ...  
`
```
(show all 23 lines)

---

## Where Now  (requires Presence add-on)
Lists channels currently joined by a UUID.

### Method
```  
`pubnub.WhereNow()  
        .Uuid(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• Uuid (string) – target UUID.  
• QueryParam (Dictionary<string,object>) – additional query pairs.  

Execution  
• `ExecuteAsync()` → `PNResult<PNWhereNowResult>`

Return `PNWhereNowResult`  
• Channels (List<string>)

### Sample
```  
`  
`
```

---

## User State  (requires Presence add-on)
Key/value pairs (Dictionary<string,object>) scoped to a UUID.

### Set state
```  
`pubnub.SetPresenceState()  
        .Channels(Array)  
        .ChannelGroups(Array)  
        .State(Dictionarystring, object>)  
        .Uuid(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• Channels / ChannelGroups (Array) – targets.  
• State (Dictionary<string,object>) – data to set.  
• Uuid (string) – UUID to update.  
• QueryParam – extra query pairs.  

Execution  
• `ExecuteAsync()` → `PNResult<PNSetStateResult>`

`PNSetStateResult`  
• State (Dictionary<string,object>)

### Get state
```  
`pubnub.GetPresenceState()  
        .Channels(Array)  
        .ChannelGroups(Array)  
        .Uuid(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Execution  
• `ExecuteAsync()` → `PNResult<PNGetStateResult>`

`PNGetStateResult`  
• StateByUUID (Dictionary<string,object>)

### Samples
```  
`  
`
```

### Sample response
```  
`{**    first  : "Robert",  
    last   : "Plant",  
    age    : 59,  
    region : "UK"  
}  
`
```

_Last updated: Jul 15 2025_