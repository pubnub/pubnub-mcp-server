# Presence API – PubNub Java SDK (v9+)

> Requires the Presence add-on to be enabled in the Admin Portal.  
> SDK 9.x introduces a unified Java/Kotlin codebase and updated async APIs (see migration guide).

---

## Here Now

Returns current occupancy, UUIDs, and/or state for channels or channel groups.  
Server response is cached for 3 s.

### Method

```java
this.pubnub.hereNow()  
    .channels(Array)  
    .channelGroups(Arrays)  
    .includeState(true)  
    .includeUUIDs(true)  
```

Parameter | Type | Default | Notes
---|---|---|---
channels | Array | – | Channels to inspect
channelGroups | Arrays | – | Channel groups to inspect
includeState | Boolean | false | Return user state
includeUUIDs | Boolean | true | Return UUID list
async | Consumer<Result> | – | `Result<PNHereNowResult>`

### Sample code

#### Get a list of UUIDs subscribed to a channel
```
`  
`
```

### Return value – `PNHereNowResult`

Method | Type | Description
---|---|---
getTotalChannels() | int | Number of channels
getTotalOccupancy() | int | Total occupants
getChannels() | Map\<String, PNHereNowChannelData\> | Per-channel data

#### PNHereNowChannelData
Method | Type | Description
---|---|---
getChannelName() | String | Channel name
getOccupancy() | int | Occupancy
getOccupants() | List\<PNHereNowOccupantData\> | Occupants list

#### PNHereNowOccupantData
Method | Type | Description
---|---|---
getUuid() | String | UUID
getState() | Object | User state

### Other examples

#### Returning state
```
`  
`
```

#### Return occupancy only
```
`  
`
```

#### Here now for channel groups
```
`  
`
```

---

## Where Now

Lists channels to which a given UUID is currently subscribed.

### Method

```java
pubnub.whereNow()  
    .uuid(String)  
```

Parameter | Type | Notes
---|---|---
uuid | String | Target UUID
async | Command | Execute asynchronously

### Sample code

#### Get channels for a UUID
```
`  
`
```

### Return value – `PNWhereNowResult`

Method | Type | Description
---|---|---
getChannels() | List\<String\> | Channels where the UUID is present

#### Other example
```
`  
`
```

---

## User State

Set or retrieve arbitrary JSON-serializable state per UUID on channels/channel groups.  
State is transient and lost on disconnect.

### Data format

Supply a pre-initialized `JsonObject` or serializable POJO to `state`.

### Methods

#### Set state
```java
this.pubnub.setPresenceState()  
    .channels(Array)  
    .channelGroups(Array)  
    .state(HashMap)  
    .uuid(String)  
```

Parameter | Type | Notes
---|---|---
channels | Array | Target channels
channelGroups | Array | Target channel groups
state | HashMap | State to set
uuid | String | Apply to specific UUID
async | Consumer<Result> | `Result<PNSetStateResult>`

#### Get state
```java
this.pubnub.getPresenceState()  
    .channels(Arrays)  
    .channelGroups(Arrays)  
    .uuid(String)  
```

Parameter | Type | Notes
---|---|---
channels | Arrays | Channels to query
channelGroups | Arrays | Channel groups to query
uuid | String | Target UUID
async | Consumer<Result> | `Result<PNGetStateResult>`

### Sample code

#### Set state
```
`  
`
```

#### Get state
```
`  
`
```

### Return values

1. `PNSetStateResult`
   • `getState()` → Map\<String, Object\> – state per UUID  
2. `PNGetStateResult`
   • `getStateByUUID()` → Map\<String, Object\> – state per UUID

### Other example

#### Set state for channels in a channel group
```
`  
`
```

```
`**`
```

_Last updated: Jul 15 2025_