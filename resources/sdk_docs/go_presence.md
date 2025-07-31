# Presence API – Go SDK (Condensed)

Presence requires the Presence add-on to be enabled for your keys. Response cache: 3 s (Here Now only).

---

## Here Now

Retrieve current occupancy, UUIDs, and optional state for channels or channel groups.

### Method

```
`pn.HereNow().  
    Channels([]string).  
    ChannelGroups([]string).  
    IncludeState(bool).  
    IncludeUUIDs(bool).  
    QueryParam(queryParam).  
    Execute()  
`
```

Parameters  
• Channels []string – target channels  
• ChannelGroups []string – target channel groups  
• IncludeState bool (default false) – return user state  
• IncludeUUIDs bool (default true) – return UUID list  
• QueryParam map[string]string – extra query params

### Response (`PNHereNowResult`)
• TotalChannels int  
• TotalOccupancy int  
• Channels []HereNowChannelData  

HereNowChannelData  
• ChannelName string  
• Occupancy int  
• Occupants []HereNowOccupantsData  

HereNowOccupantsData  
• UUID string  
• State map[string]interface{}

### Code & Examples  
(all blocks preserved verbatim)

```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
`
```

```
`res, status, err := pn.HereNow().  
    Channels([]string{"my-channel-1"}). // who is present on those channels?  
    IncludeUUIDs(true). // if false, only shows occupancy count  
    IncludeState(true). // include state with request (false by default)  
    Execute()  
`
```

```
`for _, v := range res.Channels {  
    fmt.Println(v.ChannelName) // my_channel  
    fmt.Println(v.Occupancy) // 3  
    fmt.Println(v.Occupants) // members of a channel  
  
    for _, v := range v.Occupants {  
        fmt.Println(v.UUID) // some_uuid;  
        fmt.Println(v.State) // channel member state, if applicable  
    }  
}  
`
```

```
`res, status, err := pn.HereNow().  
    Channels([]string{"my-channel-1"}). // who is present on those channels?  
    IncludeUUIDs(false). // if false, only shows occupancy count  
    IncludeState(false). // include state with request (false by default)  
    Execute()  
`
```

```
`for _, v := range res.Channels {  
    fmt.Println(v.ChannelName) // my_channel  
    fmt.Println(v.Occupancy) // 3  
}  
`
```

```
`res, status, err := pn.HereNow().  
    ChannelGroups([]string{"cg1", "cg2", "cg3"}). // who is present on channel groups?  
    IncludeUUIDs(true). // if false, only shows occupancy count  
    IncludeState(true). // include state with request (false by default)  
    Execute()  
`
```

```
`res.TotalOccupancy // 12  
`
```

---

## Where Now

List channels to which a UUID is currently subscribed.

### Method

```
`pn.WhereNow().  
    UUID(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

Parameters  
• UUID string – target UUID (omitting uses client UUID)  
• QueryParam map[string]string

### Response
`PNWhereNowResult`  
• Channels []string

### Examples

```
`res, status, err := pn.WhereNow().  
    UUID("username-uuid"). // uuid of the user we want to spy on  
    Execute()  
`
```

```
`res, status, err := pn.WhereNow().Execute()  
`
```

---

## User State

Set or retrieve custom presence state on channels or channel groups.

### Set State

```
`pn.SetState().  
    Channels([]string).  
    ChannelGroups([]string).  
    State(map[string]interface{}).  
    UUID(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

### Get State

```
`pn.GetState().  
    Channels([]string).  
    ChannelGroups([]string).  
    UUID(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

Set parameters  
• Channels, ChannelGroups – targets  
• State map[string]interface{} – state to set  
• UUID string – target UUID  
• QueryParam map[string]string

Get parameters  
• Channels, ChannelGroups – targets  
• UUID string  
• QueryParam map[string]string

Responses  
• `PNSetStateResult` → State interface{}  
• `PNGetStateResult` → State map[string]interface{}

### Examples

```
`res, status, err := pn.SetState().  
    Channels([]string{"ch"}).  
    State(map[string]interface{}{  
        "is_typing": true,  
    }).  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

```
`res, status, err := pn.GetState().  
    Channels([]string{"ch1", "ch2", "ch3"}).  
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).  
    UUID("suchUUID").  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

```
`myState := map[string]interface{}{  
    "age": 20,  
}  
  
pn.SetState().  
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).  
    Channels([]string{"ch1", "ch2", "ch3"}).  
    State(myState).  
    Execute()  
`
```

```
`if presence.Event == "state-change" {  
    res, status, err := pn.GetState().  
        Channels([]string{"ch1"}).  
        UUID("is_typing").  
        Execute()  
    fmt.Println(res, status, err)  
}  
`
```

---

## Heartbeat Without Subscription

Manually send presence heartbeats (join/leave) without subscribing.

### Method

```
`pn.Presence().  
    Connected(bool).  
    Channels([]‌string).  
    ChannelGroups([]string).  
    Execute()  
`
```

Parameters  
• Connected bool – true = join, false = leave  
• Channels []string  
• ChannelGroups []string

### Examples

```
`pn.Presence().  
    Connected(true).  
    Channels([]‌string{"my-channel"}).  
    ChannelGroups([]string{"my-channel-group"}).  
    Execute()  
`
```

```
`pn.Presence().  
    Connected(true).  
    Channels([]‌string{"my-channel"}).  
    ChannelGroups([]string{"my-channel-group"}).  
    Execute()  
`
```

```
`pn.Presence().**    Connected(false).  
    Channels([]‌string{"my-channel"}).  
    ChannelGroups([]string{"my-channel-group"}).  
    Execute()  
`
```

---

Last updated Jul 15 2025