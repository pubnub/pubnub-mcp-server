# Publish / Subscribe – Go SDK (condensed)

This section lists only the essential API signatures, parameters, configuration requirements, and complete example code blocks for Go.  
All original code blocks are included verbatim.

---

## Publish

You must initialise PubNub with a `publishKey`.  
Max message size: 32 KiB (optimal < 1800 bytes).  
Publish serially and wait for a success response before sending the next message.

### Method

```
`pn.Publish().  
    Message(interface{}).  
    Channel(string).  
    ShouldStore(bool).  
    UsePost(bool).  
    Meta(interface{}).  
    QueryParam(queryParam).  
    CustomMessageType(string).  
    Execute()`  
```

Parameter | Type | Default | Notes
---|---|---|---
Message* | interface | — | Payload (JSON-serialisable, do **not** pre-serialise).
Channel* | string | — | Target channel.
ShouldStore | bool | account default | Persist in History.
UsePost | bool | false | Force HTTP POST.
Meta | interface | null | Metadata for filter.
TTL | int | — | Per-message TTL (History).
QueryParam | map[string]string | nil | Extra query string parameters.
CustomMessageType | string | — | 3–50 chars, e.g. `text`, `action`, `poll`.

### Reference code – publish to a channel

```
`package main

import (
    "fmt"
    pubnub "github.com/pubnub/go/v7"
)

func main() {
    config := pubnub.NewConfigWithUserId("myUniqueUserId")
    config.SubscribeKey = "demo"
    config.PublishKey  = "demo"
    pn := pubnub.NewPubNub(config)

    message := []string{"Hello", "there"}
    // …
}`  
```
show all 31 lines

Subscribe to the same channel (console or separate script) before running the publish example.

### Response

`Timestamp` (int) – timetoken of the published message.

### Other publish examples

#### With metadata

```
`res, status, err := pn.Publish().  
    Channel("my-channel").  
    Message([]string{"Hello", "there"}).  
    Meta(map[string]interface{}{"name":"Alex"}).  
    CustomMessageType("text-message").  
    Execute()`  
```

#### Publish array

```
`res, status, err := pn.Publish().  
    Channel("my-channel").  
    Message([]string{"Hello", "there"}).  
    Meta([]string{"1a","2b","3c"}).  
    CustomMessageType("text-message").  
    Execute()`  
```

#### Store for 10 h

```
`res, status, err := pn.Publish().  
    Channel("my-channel").  
    Message("test").  
    ShouldStore(true).  
    TTL(10).  
    CustomMessageType("text-message").  
    Execute()`  
```

#### Push payload helper

```
`aps := pubnub.PNAPSData{
    Alert: "apns alert",
    Badge: 1,
    Sound: "ding",
    Custom: map[string]interface{}{
        "aps_key1": "aps_value1",
        "aps_key2": "aps_value2",
    },
}

apns := pubnub.PNAPNSData{
    APS: aps,
    Custom: map[string]interface{}{
        "apns_key1": "apns_value1",
        "apns_key2": "apns_value2",
`  
```
show all 82 lines

---

## Fire

Sends a message only to server-side Functions & Illuminate; not delivered to subscribers nor stored in History.

### Method

```
`pn.Fire().  
    Message(interface{}).  
    Channel(string).  
    UsePost(bool).  
    Meta(interface{}).  
    QueryParam(queryParam).  
    Execute()`  
```

(Same param rules as Publish, but no `ShouldStore`, `TTL`, or replication.)

### Example

```
`res, status, err := pn.Fire().  
    Channel("my-channel").  
    Message("test").  
    Execute()`  
```

---

## Signal

Lightweight, non-persisted 64-byte messages to subscribers.

### Method

```
`pubnub.Signal().  
    Message(interface{}).  
    Channel(string).  
    CustomMessageType(string).  
    Execute()`  
```

### Example

```
`result, status, err := pubnub.Signal().  
    Message([]string{"Hello","Signals"}).  
    Channel("foo").  
    CustomMessageType("text-message").  
    Execute();`  
```

### Response

`Timestamp` (int) – timetoken of the signal.

---

## Subscribe

Creates/maintains a TCP socket to receive messages, signals, presence, Objects & Message Action events.

### Method

```
`pn.Subscribe().  
    Channels([]string).  
    ChannelGroups([]string).  
    Timetoken(int64).  
    WithPresence(bool).  
    QueryParam(queryParam).  
    Execute()`  
```

Parameter | Type | Notes
---|---|---
Channels | []string | Channels to subscribe (required unless ChannelGroups given).
ChannelGroups | []string | Channel groups to subscribe.
Timetoken | int64 | Resume from specific timetoken.
WithPresence | bool | Also receive presence (`-pnpres`) events.
QueryParam | map[string]string | Extra query parameters.

### Basic subscribe

```
`pn.Subscribe().  
    Channels([]string{"my-channel"}).  
    Execute()`  
```

### Responses (handled via Listener)

• `PNStatus` (connection state & errors)  
• `PNMessage` (Publish & Signal)  
• `PNPresence`  
• `PNUUIDEvent`  
• `PNChannelEvent`  
• `PNMembershipEvent`  
• `PNMessageActionsEvent`

(Fields preserved as in original docs.)

### Other subscribe examples

#### With logging

```
`import (  
    pubnub "github.com/pubnub/go"  
)

config := pubnub.NewConfig()
config.PublishKey  = "demo"
config.SubscribeKey = "demo"

pn := pubnub.NewPubNub(config)

pn.Subscribe().
    Channels([]string{"my-channel"}).
    Execute()`  
```

#### Multiple channels (multiplexing)

```
`pn.Subscribe().  
    Channels([]string{"my-channel1","my-channel2"}).  
    Execute()`  
```

#### Presence

```
`pn.Subscribe().  
    Channels([]string{"my-channel"}).  
    WithPresence(true).  
    Execute()`  
```

Sample presence responses (join/leave/timeout/interval etc.):

```
`if presence.Event == "join"    { … }  
 if presence.Event == "leave"   { … }  
 if presence.Event == "timeout" { … }  
 if presence.Event == "state-change" { … }  
 if presence.Event == "interval" { … }`  
```

Interval with deltas:

```
`if presence.Event == "interval" {  
    presence.Occupancy  
    presence.Join      // []string  
    presence.Timeout   // []string  
    presence.Timestamp  
}`  
```

If > 30 KB, field `here_now_refresh: true` is included instead.

#### Wildcard subscribe

```
`pn.Subscribe().  
    Channels([]string{"foo.*"}).  
    Execute()`  
```

#### Subscribe with state (Presence)

```
`config := pubnub.NewConfig()
config.SubscribeKey = "demo"
config.PublishKey   = "demo"
pn := pubnub.NewPubNub(config)
listener := pubnub.NewListener()
done := make(chan bool)

go func() {
    for {
        // …
    }
}()`  
```
show all 45 lines

#### Channel groups

```
`pn.Subscribe().  
    Channels([]string{"ch1","ch2"}).  
    ChannelGroups([]string{"cg1","cg2"}).  
    Timetoken(int64(1337)).  
    WithPresence(true).  
    Execute()`  
```

Presence on channel groups:

```
`pn.Subscribe().  
    ChannelGroups([]string{"cg1","cg2"}).  
    Timetoken(int64(1337)).  
    WithPresence(true).  
    Execute()`  
```

---

## Unsubscribe

Removes channels/groups from an open subscription.  
Unsubscribing **all** channels resets last timetoken (possible message gaps).

### Method

```
`pn.Unsubscribe().  
    Channels([]string).  
    ChannelGroups([]string).  
    QueryParam(queryParam).  
    Execute()`  
```

### Example – single channel

```
`pn.Unsubscribe().  
    Channels([]string{"my-channel"}).  
    Execute()`  
```

Presence leave event example:

```
`if presence.Event == "leave" {  
    presence.UUID  
    presence.Timestamp  
    presence.Occupancy  
}`  
```

### Other unsubscribe examples

Multiple channels:

```
`pn.Unsubscribe().  
    Channels([]string{"my-channel","my-channel2"}).  
    Execute()`  
```

Channel groups:

```
`pn.Unsubscribe().  
    ChannelGroups([]string{"cg1","cg2"}).  
    Execute()`  
```

---

## Unsubscribe All

```
`pn.UnsubscribeAll()`  
```

Returns: none.

---

_Last updated: Jul 15 2025_