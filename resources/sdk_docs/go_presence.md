# Presence API – Go SDK  
Presence add-on must be enabled for your keys.

---

## Here Now  
Real-time list of occupants (optional state) for channels / groups.  
Cache: 3 s.

### Method
```go
pn.HereNow().
    Channels([]string).
    ChannelGroups([]string).
    IncludeState(bool).
    IncludeUUIDs(bool).
    QueryParam(map[string]string).
    Execute()
```
Parameters  
• Channels – channels to query  
• ChannelGroups – channel groups to query  
• IncludeState (default false) – include presence state  
• IncludeUUIDs (default true) – include UUID list  
• QueryParam – extra query string parameters

### Basic usage – list UUIDs
```go
package main

import (
    "fmt"
    "log"

    pubnub "github.com/pubnub/go/v7"
)

func main() {
    // Configure the PubNub instance with demo keys
    config := pubnub.NewConfigWithUserId("myUniqueUserId")
    config.SubscribeKey = "demo"
    config.PublishKey  = "demo"

    ...
}
```
(show all 44 lines)

### Other examples

Return state
```go
res, status, err := pn.HereNow().
    Channels([]string{"my-channel-1"}). // who is present?
    IncludeUUIDs(true).                 // if false: only occupancy
    IncludeState(true).                 // include state
    Execute()
```

Example response
```go
for _, v := range res.Channels {
    fmt.Println(v.ChannelName)   // my_channel
    fmt.Println(v.Occupancy)     // 3
    for _, occ := range v.Occupants {
        fmt.Println(occ.UUID)    // some_uuid
        fmt.Println(occ.State)   // member state
    }
}
```

Occupancy only
```go
res, status, err := pn.HereNow().
    Channels([]string{"my-channel-1"}).
    IncludeUUIDs(false).
    IncludeState(false).
    Execute()
```
```go
for _, v := range res.Channels {
    fmt.Println(v.ChannelName) // my_channel
    fmt.Println(v.Occupancy)   // 3
}
```

Channel groups
```go
res, status, err := pn.HereNow().
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).
    IncludeUUIDs(true).
    IncludeState(true).
    Execute()
```
```go
res.TotalOccupancy // 12
```

### Response objects

PNHereNowResult  
• TotalChannels int  
• TotalOccupancy int  
• Channels []HereNowChannelData  

HereNowChannelData  
• ChannelName string  
• Occupancy   int  
• Occupants   []HereNowOccupantsData  

HereNowOccupantsData  
• UUID  string  
• State map[string]interface{}

---

## Where Now  
List channels to which a UUID is currently subscribed.

### Method
```go
pn.WhereNow().
    UUID(string).
    QueryParam(map[string]string).
    Execute()
```
Parameters  
• UUID – target UUID (defaults to current instance)  
• QueryParam – extra query string parameters

### Usage
```go
res, status, err := pn.WhereNow().
    UUID("username-uuid").
    Execute()
```
Without UUID:
```go
res, status, err := pn.WhereNow().Execute()
```

### Response  
PNWhereNowResult  
• Channels []string

---

## User State  
Set / get arbitrary state key–values per UUID on channels / groups. State is not persisted.

### Set State
```go
pn.SetState().
    Channels([]string).
    ChannelGroups([]string).
    State(map[string]interface{}).
    UUID(string).
    QueryParam(map[string]string).
    Execute()
```

### Get State
```go
pn.GetState().
    Channels([]string).
    ChannelGroups([]string).
    UUID(string).
    QueryParam(map[string]string).
    Execute()
```

### Examples

Set state
```go
res, status, err := pn.SetState().
    Channels([]string{"ch"}).
    State(map[string]interface{}{"is_typing": true}).
    Execute()
fmt.Println(res, status, err)
```

Get state
```go
res, status, err := pn.GetState().
    Channels([]string{"ch1", "ch2", "ch3"}).
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).
    UUID("suchUUID").
    Execute()
fmt.Println(res, status, err)
```

Set state for group
```go
myState := map[string]interface{}{"age": 20}

pn.SetState().
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).
    Channels([]string{"ch1", "ch2", "ch3"}).
    State(myState).
    Execute()
```
```go
if presence.Event == "state-change" {
    res, status, err := pn.GetState().
        Channels([]string{"ch1"}).
        UUID("is_typing").
        Execute()
    fmt.Println(res, status, err)
}
```

### Response objects  
PNSetStateResult  – State interface{}  
PNGetStateResult – State map[string]interface{}

---

## Heartbeat Without Subscription  
Send join/leave heartbeats without subscribing.

### Method
```go
pn.Presence().
    Connected(bool).
    Channels([]string).
    ChannelGroups([]string).
    Execute()
```
Parameters  
• Connected bool – true = join, false = leave  
• Channels []string – target channels  
• ChannelGroups []string – target channel groups

### Usage
```go
pn.Presence().
    Connected(true).
    Channels([]string{"my-channel"}).
    ChannelGroups([]string{"my-channel-group"}).
    Execute()
```

Start heartbeat
```go
pn.Presence().
    Connected(true).
    Channels([]string{"my-channel"}).
    ChannelGroups([]string{"my-channel-group"}).
    Execute()
```

Stop heartbeat
```go
pn.Presence().
    Connected(false).
    Channels([]string{"my-channel"}).
    ChannelGroups([]string{"my-channel-group"}).
    Execute()
```

_Last updated: Jun 16 2025_