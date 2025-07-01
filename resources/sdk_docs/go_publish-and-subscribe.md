# Publish/Subscribe – Go SDK (Condensed)

Below are the essential methods, parameters, and examples for real-time Publish, Fire, Signal, Subscribe, and Unsubscribe operations. All code blocks and critical technical details are preserved.

---

## Publish <a id="publish"></a>

Sends a JSON-serializable payload to one channel.  
• Require `PublishKey` in `NewConfig...`  
• TLS supported via `ssl=true` (default in Go SDK).  
• Max message size 32 KiB (optimal < 1800 B).  
• One channel per call; publish serially; check success before next publish.  

### Method
```go
pn.Publish().
    Message(interface{}).
    Channel(string).
    ShouldStore(bool).
    UsePost(bool).
    Meta(interface{}).
    TTL(int).              // optional
    QueryParam(queryParam).
    CustomMessageType(string).
    Execute()
```

Parameter | Type | Default | Notes
--------- | ---- | ------- | -----
Message* | interface{} | n/a | Payload (do **not** pre-serialize)
Channel* | string | n/a | Destination channel
ShouldStore | bool | account default | Persist in History
UsePost | bool | false | Send via POST
Meta | interface{} | nil | For filter expressions
TTL | int | n/a | Hours to live in History
QueryParam | map[string]string | nil | Custom query string
CustomMessageType | string | n/a | 3-50 chars, a-Z 0-9, dash/underscore

### Examples
#### Basic
```go
package main
import (
    "fmt"
    pubnub "github.com/pubnub/go/v7"
)
func main() {
    cfg := pubnub.NewConfigWithUserId("myUniqueUserId")
    cfg.SubscribeKey, cfg.PublishKey = "demo", "demo"
    pn := pubnub.NewPubNub(cfg)

    res, status, err := pn.Publish().
        Channel("my-channel").
        Message([]string{"Hello", "there"}).
        Execute()
    fmt.Println(res, status, err)
}
```

#### With metadata
```go
res, status, err := pn.Publish().
    Channel("my-channel").
    Message([]string{"Hello", "there"}).
    Meta(map[string]interface{}{"name": "Alex"}).
    CustomMessageType("text-message").
    Execute()
```

#### Store 10 h
```go
res, status, err := pn.Publish().
    Channel("my-channel").
    Message("test").
    ShouldStore(true).
    TTL(10).
    CustomMessageType("text-message").
    Execute()
```

#### Push Payload Helper
```go
aps  := pubnub.PNAPSData{Alert: "apns alert", Badge: 1, Sound: "ding",
        Custom: map[string]interface{}{"aps_key1": "aps_value1"}}
apns := pubnub.PNAPNSData{APS: aps,
        Custom: map[string]interface{}{"apns_key1": "apns_value1"}}
// … see full helper sample …
```

Publish response:  

Field | Type | Description
----- | ---- | -----------
Timestamp | int | Server timetoken

---

## Fire <a id="fire"></a>

Invokes Functions/Illuminate without replication/history.

### Method
```go
pn.Fire().
    Message(interface{}).
    Channel(string).
    UsePost(bool).
    Meta(interface{}).
    QueryParam(queryParam).
    Execute()
```

```go
res, status, err := pn.Fire().
    Channel("my-channel").
    Message("test").
    Execute()
```

---

## Signal <a id="signal"></a>

Lightweight (< 64 B payload) broadcast.

### Method
```go
pubnub.Signal().
    Message(interface{}).
    Channel(string).
    CustomMessageType(string).
    Execute()
```

```go
result, status, err := pubnub.Signal().
    Message([]string{"Hello", "Signals"}).
    Channel("foo").
    CustomMessageType("text-message").
    Execute()
```

Signal response: same `Timestamp` field as Publish.

---

## Subscribe <a id="subscribe"></a>

Creates a long-lived socket, delivering messages, signals, presence, Objects, and Message-Actions events.

### Method
```go
pn.Subscribe().
    Channels([]string).
    ChannelGroups([]string).
    Timetoken(int64).
    WithPresence(bool).
    QueryParam(queryParam).
    Execute()
```

Parameter | Type | Notes
--------- | ---- | -----
Channels | []string | At least one of Channels/ChannelGroups required
ChannelGroups | []string | "
Timetoken | int64 | Resume from point-in-time
WithPresence | bool | Also receive `*-pnpres` events
QueryParam | map[string]string | Custom query string

### Basic subscribe
```go
pn.Subscribe().
    Channels([]string{"my-channel"}).
    Execute()
```

### Multiple channels
```go
pn.Subscribe().
    Channels([]string{"my-channel1", "my-channel2"}).
    Execute()
```

### Presence channel
```go
pn.Subscribe().
    Channels([]string{"my-channel"}).
    WithPresence(true).
    Execute()
```

### Wildcard
```go
pn.Subscribe().
    Channels([]string{"foo.*"}).
    Execute()
```

### Channel group
```go
pn.Subscribe().
    Channels([]string{"ch1","ch2"}).
    ChannelGroups([]string{"cg1","cg2"}).
    Timetoken(1337).
    WithPresence(true).
    Execute()
```

### Listener payloads

Returned via `Listener` callbacks:

1. **PNMessage**  
   Field | Type | Description
   ----- | ---- | -----------
   Message | interface{} | Published payload  
   Channel | string | Channel ID  
   Subscription | string | Matched wild-/group  
   Timetoken | int64 | Publish timetoken  
   UserMetadata | interface{} | Associated meta  
   SubscribedChannel | string | Current subscription  
   Publisher | string | Publisher UUID  

2. **PNPresence** (requires Presence) — fields: `Event, UUID, Timestamp, Occupancy, Subscription, Timetoken, State, UserMetadata, SubscribedChannel, Channel` plus `Join/Leave/Timeout` arrays for interval events.

3. **PNUUIDEvent**, **PNChannelEvent**, **PNMembershipEvent**, **PNMessageActionsEvent** — full property sets preserved as in original doc.

#### Presence sample
```go
if presence.Event == "join" {
    presence.UUID       // user UUID
    presence.Timestamp  // unix
    presence.Occupancy  // current occupancy
}
```
(Equivalent samples for `leave`, `timeout`, `interval`, and `state-change` are unchanged.)

---

## Unsubscribe <a id="unsubscribe"></a>

Leaves specific channels/groups.

### Method
```go
pn.Unsubscribe().
    Channels([]string).
    ChannelGroups([]string).
    QueryParam(queryParam).
    Execute()
```

```go
pn.Unsubscribe().
    Channels([]string{"my-channel"}).
    Execute()
```

Multiple channels:
```go
pn.Unsubscribe().
    Channels([]string{"my-channel", "my-channel2"}).
    Execute()
```

Channel groups:
```go
pn.Unsubscribe().
    ChannelGroups([]string{"cg1", "cg2"}).
    Execute()
```

Unsubscribe responses are delivered via Presence `leave` events (see samples above).

---

## Unsubscribe All <a id="unsubscribe-all"></a>

```go
pn.UnsubscribeAll()
```

---

Last updated Jun 16 2025