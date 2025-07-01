# Presence API (Unity SDK) – Condensed Reference

Presence lets you:
• Detect join/leave events  
• Get occupancy counts & UUID lists  
• Retrieve or set per-user state

Presence event modes (set in Admin Portal): **Announce** or **Interval** (auto-selected by occupancy).

---

## Here Now

Requires Presence add-on (enable in Admin Portal). Server response is cached for 3 s.

### Method
```csharp
pubnub.HereNow()
    .Channels(Array)
    .ChannelGroups(Array)
    .IncludeState(bool)
    .IncludeUUIDs(bool)
    .QueryParam(Dictionary<string,object>)
    .Execute(System.Action<PNHereNowResult, PNStatus>)
```
• Channels / ChannelGroups – targets  
• IncludeState – return user state  
• IncludeUUIDs – return UUID list  
• ExecuteAsync() returns `Task<PNResult<PNHereNowResult>>`

### Sample (async)
```csharp
using System.Collections.Generic;
using PubnubApi;
using PubnubApi.Unity;
using UnityEngine;

public class HereNowExample : MonoBehaviour {
    [SerializeField] private PNManagerBehaviour pubnubManager;
    [SerializeField] private string[] testChannelIds = { "coolChannel", "coolChannel2" };

    private async void Start() {
        // Getting a reference to the Pubnub instance
```
(show all 53 lines)

### Sample (sync)
```csharp
pubnub.HereNow()
    .Channels(new string[] {
        "coolChannel",
        "coolChannel2"
    })
    .IncludeUUIDs(true)
    .Execute(new PNHereNowResultEx(
        (result, status) => {
            if (status.Error) { /* handle */ return; }
            if (result.Channels != null && result.Channels.Count > 0) {
                foreach (KeyValuePair<string, PNHereNowChannelData> kvp in result.Channels) {
```
(show all 32 lines)

### Only State + UUIDs
```csharp
PNResult<PNHereNowResult> herenowResponse = await pubnub.HereNow()
    .Channels(new string[] { "my_channel" })
    .IncludeState(true)
    .IncludeUUIDs(true)
    .ExecuteAsync();

PNHereNowResult herenowResult = herenowResponse.Result;
PNStatus status          = herenowResponse.Status;
```

#### Example JSON
```json
{
  "status":200,
  "message":"OK",
  "service":"Presence",
  "uuids":[
    {"uuid":"myUUID0"},
    {
      "uuid":"myUUID1",
      "state":{"abcd":{"age":15}}
    }
  ]
}
```

### Occupancy Only
```csharp
PNResult<PNHereNowResult> herenowResponse = await pubnub.HereNow()
    .Channels(new string[] { "my_channel" })
    .IncludeState(false)
    .IncludeUUIDs(false)
    .ExecuteAsync();
```

#### Example JSON
```json
{
  "status":200,
  "message":"OK",
  "payload":{
    "channels":{
      "81d8d989-b95f-443c-a726-04fac323b331":{
        "uuids":["70fc1140-22b5-4abc-85b2-ff8c17b24d59"],
        "occupancy":1
      }
      ...  
    }
  }
}
```

### Return Types
* `PNResult<PNHereNowResult>`
* `PNHereNowResult`  
  • TotalChannels (int)  
  • TotalOccupancy (int)  
  • Channels – `Dictionary<string, PNHereNowChannelData>`
* `PNHereNowChannelData`  
  • ChannelName (string)  
  • Occupancy (int)  
  • Occupants – `List<PNHereNowOccupantData>`
* `PNHereNowOccupantData`  
  • Uuid (string)  
  • State (object)

---

## Where Now

Requires Presence add-on.

### Method
```csharp
pubnub.WhereNow()
    .Uuid(string)
    .QueryParam(Dictionary<string,object>)
    .Execute(System.Action<PNWhereNowResult, PNStatus>)
```
• ExecuteAsync() returns `Task<PNResult<PNWhereNowResult>>`

### Sample (async)
```csharp
PNResult<PNWhereNowResult> wherenowResponse = await pubnub.WhereNow()
    .ExecuteAsync();

PNWhereNowResult wherenowResult = wherenowResponse.Result;
PNStatus status = wherenowResponse.Status;
```

### Sample (sync)
```csharp
pubnub.WhereNow()
    .Execute(new PNWhereNowResultExt(
        (result, status) => { /* use result.Channels */ }
    ));
```

### Other UUID
```csharp
PNResult<PNWhereNowResult> wherenowResponse = await pubnub.WhereNow()
    .Uuid("some-other-uuid")
    .ExecuteAsync();
```

### Return Types
* `PNResult<PNWhereNowResult>`
* `PNWhereNowResult`  
  • Channels – `List<string>`

---

## User State (Set / Get Presence State)

Requires Presence add-on. State is `Dictionary<string, object>`.

### Set State – Method
```csharp
pubnub.SetPresenceState()
    .Channels(Array)
    .ChannelGroups(Array)
    .State(Dictionary<string,object>)
    .Uuid(string)
    .QueryParam(Dictionary<string,object>)
    .Execute(System.Action<PNSetStateResult, PNStatus>)
```
(ExecuteAsync returns `Task<PNResult<PNSetStateResult>>`)

### Get State – Method
```csharp
pubnub.GetPresenceState()
    .Channels(Array)
    .ChannelGroups(Array)
    .Uuid(string)
    .QueryParam(Dictionary<string,object>)
    .Execute(System.Action<PNGetStateResult, PNStatus>)
```
(ExecuteAsync returns `Task<PNResult<PNGetStateResult>>`)

### Set State (async)
```csharp
Dictionary<string, object> myState = new Dictionary<string, object>();
myState.Add("age", 20);

PNResult<PNSetStateResult> setstateResponse = await pubnub.SetPresenceState()
    .Channels(new string[] { "ch1", "ch2", "ch3" })
    .State(myState)
    .ExecuteAsync();

PNSetStateResult setstateResult = setstateResponse.Result;
PNStatus status = setstateResponse.Status;
```

### Get State (async)
```csharp
PNResult<PNGetStateResult> getstateResponse = await pubnub.GetPresenceState()
    .Channels(new string[] { "ch1", "ch2", "ch3" })
    .ChannelGroups(new string[] { "cg1", "cg2", "cg3" })
    .Uuid("suchUUID")
    .ExecuteAsync();
```

### Set State (sync)
```csharp
Dictionary<string, object> myState = new Dictionary<string, object>();
myState.Add("age", 20);

pubnub.SetPresenceState()
    .Channels(new string[] { "ch1", "ch2", "ch3" })
    .State(myState)
    .Execute(new PNSetStateResultExt(
        (result, status) => { /* handle */ }
    ));
```

### Get State (sync)
```csharp
pubnub.GetPresenceState()
    .Channels(new string[] { "ch1", "ch2", "ch3" })
    .ChannelGroups(new string[] { "cg1", "cg2", "cg3" })
    .Uuid("suchUUID")
    .Execute(new PNGetStateResultExt(
```
(show all 19 lines)

### Set State on Channel Groups
```csharp
Dictionary<string, object> myState = new Dictionary<string, object>();
myState.Add("age", 20);

PNResult<PNSetStateResult> setstateResponse = await pubnub.SetPresenceState()
    .ChannelGroups(new string[] { "cg1", "cg2", "cg3" })
    .Channels(new string[] { "ch1", "ch2", "ch3" })
```
(show all 22 lines)

Response:
```json
{
  "first":"Robert",
  "last":"Plant",
  "age":59,
  "region":"UK"
}
```

### Return Types
* `PNResult<PNSetStateResult>` / `PNResult<PNGetStateResult>`
* `PNSetStateResult` – `State` (Dictionary)  
* `PNGetStateResult` – `StateByUUID` (Dictionary)

---

_Last updated: Jun 16 2025_