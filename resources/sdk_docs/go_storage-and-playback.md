# Message Persistence API – Go SDK (Storage & Playback)

Message Persistence stores every published message (10-ns resolution) across multiple zones, optionally with AES-256 encryption, for a retention period configured per key (1 day – Unlimited). You can retrieve:
* Messages
* Message reactions
* Files (via File Sharing API)

---

## Fetch history
Requires Message Persistence enabled.

Use `Fetch` to pull messages (optionally actions) from 1–500 channels.  
Start/End usage:  
• only `start` → messages **older** than `start`  
• only `end`   → messages **newer** than/including `end`  
• both          → messages between (inclusive `end`)  
Limits: 100 msgs (single channel) or 25 (multi-channel / when actions =true). If the response is truncated a `more` object is returned—make iterative calls.

### Method
```
`pn.Fetch().  
    Channels(channels).  
    Count(count).  
    Start(start).  
    End(end).  
    IncludeMeta(bool).  
    IncludeMessageType(bool).  
    IncludeUUID(bool).  
    IncludeMessageActions(bool).  
    IncludeCustomMessageType(bool).  
    Reverse(reverse).  
    QueryParam(queryParam).  
    Execute()  
`
```
*Parameter - Type - Default - Description*  
`Channels` *string* n/a – up to 500 channels.  
`Count` *int* 100/25 – max msgs returned (see limits above).  
`Start` *int64* – exclusive slice start.  
`End` *int64* – inclusive slice end.  
`IncludeMeta` *bool* false – include message `meta`.  
`IncludeMessageType` *bool* true.  
`IncludeUUID` *bool* true.  
`IncludeMessageActions` *bool* false – sets single-channel & 25-msg limit.  
`IncludeCustomMessageType` *bool* n/a – return custom type.  
`Reverse` *bool* false – oldest-first traversal.  
`QueryParam` *map[string]string* nil – extra query parameters.

### Sample
```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
...
`
```

### Return fields
`Message` (interface) • `Timetoken` (string) • `Meta` • `MessageType` (number, 4 =file) • `CustomMessageType` (string) • `Uuid` (string) • `MessageActions` (map[string]PNHistoryMessageActionsTypeMap).

`PNHistoryMessageActionsTypeMap` ➝ `ActionsTypeValues` map[string][]PNHistoryMessageActionTypeVal  
`PNHistoryMessageActionTypeVal` ➝ `UUID` (string), `ActionTimetoken` (string)

### Status response
`Error` • `Category` • `Operation` • `StatusCode` • `TLSEnabled` • `UUID` • `AuthKey` • `Origin` • `OriginalResponse` • `Request` • `AffectedChannels` • `AffectedChannelGroups`

---

## Delete messages from history
Requires Message Persistence + “Enable Delete-From-History” (key settings) and initialization with **secret key**.

### Method
```
`pn.DeleteMessages().  
    Channel(channel).  
    Start(start).  
    End(end).  
    QueryParam(queryParam).  
    Execute()  
`
```
Parameters  
`Channel` *string* – channel to delete from.  
`Start` *int64* – inclusive start timetoken.  
`End` *int64* – exclusive end timetoken.  
`QueryParam` *map[string]string* – extra query parameters.

### Sample
```
`res, status, err := pn.DeleteMessages().  
        Channel("ch").  
        Start(int64(15343325214676133)).  
        End(int64(15343325004275466)).  
        Execute()  
`
```

### Delete a single message
```
`res, status, err := pn.DeleteMessages().  
        Channel("ch").  
        Start(int64(15526611838554309)).  
        End(int64(15526611838554310)).  
        Execute()  
`
```

### Status response
Same fields as Fetch history.

---

## Message counts
Requires Message Persistence. For unlimited retention keys, only last 30 days are inspected.

### Method
```
`pn.MessageCounts().  
    Channels(channels).  
    ChannelsTimetoken(channelsTimetoken).  
    QueryParam(queryParam).  
    Execute()  
`
```
Parameters  
`Channels` *[]string* – channels to inspect.  
`ChannelsTimetoken` *[]int64* – one timetoken for all or one-per-channel (length must match).  
`QueryParam` *map[string]string* – extra query parameters.

### Sample
```
`res, status, err := pn.MessageCounts().  
        Channels([]string{"ch1", "ch2"}).  
        ChannelsTimetoken([]int64{1551795013294}).  
        Execute()  
`
```

### Return
`Channels` map[string]int – per-channel count (0–10000).

#### Alternate example
```
`pn.MessageCounts().  
        Channels([]string{ch1, ch2}).  
        ChannelsTimetoken([]int64{1551795013294,155179501329433}).  
        Execute()  
`
```

### Status response
Same fields as Fetch history.

---

## History (deprecated)
Use Fetch history instead.

### Method
```
`pn.History().  
    Channel(string).  
    Reverse(bool).  
    IncludeTimetoken(bool).  
    IncludeMeta(bool).  
    Start(int64).  
    End(int64).  
    Count(int).  
    QueryParam(queryParam).  
    Execute()  
`
```
Parameters  
`Channel` *string* – channel name.  
`Reverse` *bool* false – oldest-first traversal.  
`IncludeTimetoken` *bool* false.  
`IncludeMeta` *bool* false.  
`Start` *int64* – exclusive slice start.  
`End` *int64* – inclusive slice end.  
`Count` *int* 100 – number of messages.  
`QueryParam` *map[string]string* – extra query parameters.

### Sample – last 100 messages
```
`res, status, err := pn.History().  
    Channel("history_channel"). // where to fetch history from  
    Count(). // how many items to fetch  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

### Response types
`PNHistoryResult` ➝ `Messages` []PNHistoryItemResult, `StartTimetoken` int64, `EndTimetoken` int64  
`PNHistoryItemResult` ➝ `Timetoken` int64, `Message` interface{}, `Meta` interface{}

### Additional examples
Retrieve 3 oldest:
```
`res, status, err := pn.History().  
    Channel("my-ch").  
    Count(3).  
    Reverse(true).  
    Execute()  
`
```
```
`for _, v := range res.Messages {  
    fmt.Println(v.Entry)  
}  
`
```

Newer than a timetoken:
```
`res, status, err := pn.History().  
    Channel("my-ch").  
    Start(int64(13847168620721752)).  
    Reverse(true).  
    Execute()  
`
```
```
`for _, v := range res.Messages {  
    fmt.Println(v.Entry)  
}  
`
```

Until a timetoken:
```
`res, status, err := pn.History().  
    Channel("my-ch").  
    Count(100).  
    Start(int64(-1)).  
    End(int64(13847168819178600)).  
    Reverse(true).  
    Execute()  
`
```
```
`for _, v := range res.Messages {  
    fmt.Println(v.Entry)  
}  
`
```

Paging example:
```
`func getAllMessages(startTT int64) {  
    res, _, _ := pn.History().  
        Channel("history_channel").  
        Count(2).  
        Execute()  
  
    msgs := res.Messages  
    start := res.StartTimetoken  
    end := res.EndTimetoken  
  
    if len(msgs) > 0 {  
        fmt.Println(len(msgs))  
        fmt.Println("start " + strconv.Itoa(int(start)))  
        fmt.Println("end " + strconv.Itoa(int(end)))  
    }  
...
`
```

Include timetoken:
```
`res, status, status := pn.History().**    Channel("history_channel").  
    Count(100).  
    IncludeTimetoken(true).  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

_Last updated: Jul 15 2025_