# Presence API – Java SDK (v9+)

Presence add-on must be enabled on your PubNub keys.

For migration details from < 9.0.0 see the Java/Kotlin migration guide.

---

## Here Now

Use to list current occupants of channels/channel-groups.

### Method

```
`this.pubnub.hereNow()  
    .channels(Array)  
    .channelGroups(Arrays)  
    .includeState(true)  
    .includeUUIDs(true)  
`
```

Parameters  
• channels (Array) – target channels  
• channelGroups (Arrays) – target groups  
• includeState (Boolean, default false) – return user state  
• includeUUIDs (Boolean, default true) – return UUIDs  
• async (Consumer<Result<PNHereNowResult>>)

### Returns – PNHereNowResult

| Method | Type | Notes |
| --- | --- | --- |
| getTotalChannels() | int | #channels |
| getTotalOccupancy() | int | #occupants |
| getChannels() | Map\<String, PNHereNowChannelData> | per-channel data |

PNHereNowChannelData  
• getChannelName() : String  
• getOccupancy() : int  
• getOccupants() : List\<PNHereNowOccupantData>

PNHereNowOccupantData  
• getUuid() : String  
• getState() : Object

### Examples

#### Basic (UUID list)

```
`  
`
```

#### Return state

```
`  
`
```

#### Occupancy only

```
`  
`
```

#### Channel-group query

```
`  
`
```

---

## Where Now

Lists channels a UUID is currently subscribed to.

### Method

```
`pubnub.whereNow()  
    .uuid(String)  
`
```

Parameter  
• uuid (String) – target UUID  
• async – execute asynchronously

### Returns – PNWhereNowResult

• getChannels() : List\<String>

### Examples

```
`  
`
```

---

## User State

Set/Get ephemeral JSON state associated with a UUID on channels/groups.

### Set State

```
`this.pubnub.setPresenceState()  
    .channels(Array)  
    .channelGroups(Array)  
    .state(HashMap)  
    .uuid(String)  
`
```

Parameters  
• channels (Array) – channels to set state  
• channelGroups (Array) – groups to set state  
• state (HashMap) – key/value JSON state  
• uuid (String) – target UUID  
• async (Consumer<Result<PNSetStateResult>>)

### Get State

```
`this.pubnub.getPresenceState()  
    .channels(Arrays)  
    .channelGroups(Arrays)  
    .uuid(String)  
`
```

Parameters identical to Set State.

### Returns

PNSetStateResult  
• getState() : Map\<String, Object>

PNGetStateResult  
• getStateByUUID() : Map\<String, Object>

### Examples

#### Set

```
`  
`
```

#### Get

```
`  
`
```

#### Set for channel-group

```
`  
`
```

---

Cache: Here Now responses are cached for 3 s.