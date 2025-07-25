# Presence API — C# SDK (Condensed)

Presence requires the Presence add-on to be enabled for your PubNub keys in the Admin Portal.

---

## Request execution

Use `try / catch` to handle SDK exceptions and inspect the `status` object for server/network errors.

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

---

## Here Now

Query current occupancy and (optionally) user state for channels/groups.

Cache TTL: 3 s.

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
• Channels (Array) – target channels  
• ChannelGroups (Array) – target groups  
• IncludeState (bool) – include presence state  
• IncludeUUIDs (bool) – include UUID list  
• QueryParam (Dictionary<string,object>) – custom query params  

### Returns  
`PNResult<PNHereNowResult>`  
• Result – PNHereNowResult  
• Status – PNStatus  

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

### Examples
Get UUID list:
```
`  
`
```
Synchronous:
```
`  
`
```
Return state:
```
`  
`
```
Example response (truncated):
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
Occupancy-only:
```
`  
`
```
Response (truncated):
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
`
```

---

## Where Now

Get the list of channels a UUID is currently subscribed to.

### Method
```
`pubnub.WhereNow()  
        .Uuid(string)  
        .QueryParam(Dictionarystring,object>)  
`
```
Parameters  
• Uuid (string) – target UUID  
• QueryParam (Dictionary<string,object>) – custom query params  

### Returns  
`PNResult<PNWhereNowResult>`  
• Result – PNWhereNowResult  
• Status – PNStatus  

`PNWhereNowResult`  
• Channels (List<string>)  

### Examples
```
`  
`
```
Synchronous:
```
`  
`
```
Other UUID:
```
`  
`
```

---

## User State

Set or get arbitrary key/value state for a UUID on channels or groups.

### Set State

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
• Channels (Array) – channels to set state  
• ChannelGroups (Array) – groups to set state  
• State (Dictionary<string,object>) – key/value pairs  
• Uuid (string) – target UUID  
• QueryParam (Dictionary<string,object>) – custom query params  

Returns: `PNResult<PNSetStateResult>`  
• State (Dictionary<string,object>)  

### Get State

```
`pubnub.GetPresenceState()  
        .Channels(Array)  
        .ChannelGroups(Array)  
        .Uuid(string)  
        .QueryParam(Dictionarystring,object>)  
`
```
Parameters  
• Channels (Array) – channels to fetch state  
• ChannelGroups (Array) – groups to fetch state  
• Uuid (string) – target UUID  
• QueryParam (Dictionary<string,object>) – custom query params  

Returns: `PNResult<PNGetStateResult>`  
• StateByUUID (Dictionary<string,object>)  

### Examples
Set state:
```
`  
`
```
Get state:
```
`  
`
```
Synchronous set:
```
`  
`
```
Synchronous get:
```
`  
`
```
Set for channel group:
```
`  
`
```
Example response:
```
`{**    first  : "Robert",  
    last   : "Plant",  
    age    : 59,  
    region : "UK"  
}  
`
```

_Last updated: Jun 30 2025_