# Message Persistence (Go SDK)

This condensation keeps every method signature, parameter, code sample, and return/response field from the original documentation while removing narrative repetition.

---

## Fetch History  

Requires Message Persistence enabled.

```go
pn.Fetch().
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
```

Parameters  
* Channels (string, required) – up to 500 channels.  
* Count (int) – 100 (single channel) / 25 (multi-channel or IncludeMessageActions=true).  
* Start (int64) – exclusive start timetoken.  
* End (int64) – inclusive end timetoken.  
* IncludeMeta (bool, default false) – include published meta.  
* IncludeMessageType (bool, default true).  
* IncludeUUID (bool, default true).  
* IncludeMessageActions (bool, default false; limits to 1 channel, 25 msgs).  
* IncludeCustomMessageType (bool).  
* Reverse (bool, default false).  
* QueryParam (map[string]string).

Truncated responses: when MessageActions cause limits to be hit, a `more` object is returned—iterate with adjusted parameters.

### Basic usage

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

### Returns

* Message (interface)  
* Timetoken (string)  
* Meta (interface)  
* MessageType (number, file messages return 4)  
* CustomMessageType (string)  
* Uuid (string)  
* MessageActions (map[string]PNHistoryMessageActionsTypeMap)

`PNHistoryMessageActionsTypeMap`  
* ActionsTypeValues: `map[string][]PNHistoryMessageActionTypeVal`

`PNHistoryMessageActionTypeVal`  
* UUID (string)  
* ActionTimetoken (string)

### Status (common to every call below)

`Error, Category, Operation, StatusCode, TLSEnabled, UUID, AuthKey, Origin, OriginalResponse, Request, AffectedChannels, AffectedChannelGroups`

---

## Delete Messages from History  

Requires Message Persistence enabled + “Delete-From-History” key setting + secret key.

```go
pn.DeleteMessages().
    Channel(channel).
    Start(start).
    End(end).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* Channel (string, required)  
* Start (int64) – inclusive  
* End (int64) – exclusive  
* QueryParam (map[string]string)

### Basic usage

```go
res, status, err := pn.DeleteMessages().
        Channel("ch").
        Start(int64(15343325214676133)).
        End(int64(15343325004275466)).
        Execute()
```

### Delete a specific message

```go
res, status, err := pn.DeleteMessages().
        Channel("ch").
        Start(int64(15526611838554309)). //  timetoken-1
        End(int64(15526611838554310)).   //  publish timetoken
        Execute()
```

---

## Message Counts  

Requires Message Persistence enabled.  
(For unlimited retention keys, counts cover last 30 days.)

```go
pn.MessageCounts().
    Channels(channels).
    ChannelsTimetoken(channelsTimetoken).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* Channels ([]string, required)  
* ChannelsTimetoken ([]int64) – one per channel or single value for all  
* QueryParam (map[string]string)

### Basic usage

```go
res, status, err := pn.MessageCounts().
        Channels([]string{"ch1", "ch2"}).
        ChannelsTimetoken([]int64{1551795013294}).
        Execute()
```

### Other example (per-channel timetokens)

```go
pn.MessageCounts().
        Channels([]string{ch1, ch2}).
        ChannelsTimetoken([]int64{1551795013294,155179501329433}).
        Execute()
```

Returns: `MessageCountsResponse.Channels` → map[channel]count (0-10000).

---

## History (deprecated — use Fetch History)

```go
pn.History().
    Channel(string).
    Reverse(bool).
    IncludeTimetoken(bool).
    IncludeMeta(bool).
    Start(int64).
    End(int64).
    Count(int).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* Channel (string, required)  
* Reverse (bool, default false) – traverse oldest→newest when true.  
* IncludeTimetoken (bool, default false)  
* IncludeMeta (bool, default false)  
* Start (int64) – exclusive  
* End (int64) – inclusive  
* Count (int, default 100)  
* QueryParam (map[string]string)

### Retrieve last 100 messages

```go
res, status, err := pn.History().
    Channel("history_channel").
    Count(100).
    Execute()

fmt.Println(res, status, err)
```

### Three oldest messages (reverse)

```go
res, status, err := pn.History().
    Channel("my-ch").
    Count(3).
    Reverse(true).
    Execute()
```

```go
for _, v := range res.Messages {
    fmt.Println(v.Entry)
}
```

### Messages newer than a timetoken

```go
res, status, err := pn.History().
    Channel("my-ch").
    Start(int64(13847168620721752)).
    Reverse(true).
    Execute()
```

```go
for _, v := range res.Messages {
    fmt.Println(v.Entry)
}
```

### Messages until a timetoken

```go
res, status, err := pn.History().
    Channel("my-ch").
    Count(100).
    Start(int64(-1)).
    End(int64(13847168819178600)).
    Reverse(true).
    Execute()
```

```go
for _, v := range res.Messages {
    fmt.Println(v.Entry)
}
```

### History paging example

```go
func getAllMessages(startTT int64) {
    res, _, _ := pn.History().
        Channel("history_channel").
        Count(2).
        Execute()

    msgs  := res.Messages
    start := res.StartTimetoken
    end   := res.EndTimetoken

    if len(msgs) > 0 {
        fmt.Println(len(msgs))
        fmt.Println("start " + strconv.Itoa(int(start)))
        fmt.Println("end "   + strconv.Itoa(int(end)))
    }
    ...
}
```

### Include timetoken

```go
res, status, err := pn.History().
    Channel("history_channel").
    Count(100).
    IncludeTimetoken(true).
    Execute()

fmt.Println(res, status, err)
```

Returns:  
`PNHistoryResult.Messages []PNHistoryItemResult`, `StartTimetoken`, `EndTimetoken`  
`PNHistoryItemResult` → `Timetoken`, `Message`, `Meta`

---

_Last updated Jun 10 2025_