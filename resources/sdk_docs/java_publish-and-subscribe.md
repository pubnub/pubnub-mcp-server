# Publish/Subscribe API – Java/Kotlin SDK (v9)

This condensed guide keeps every code block, method signature, parameter list, and essential limits/options while removing redundant prose.

---

## Publish

Sends a JSON-serializable payload to all subscribers of a single channel.  
Requirements: `publishKey`, a `Channel` entity, max size 32 KiB (ideal < 1800 B).

```
`Channel channel = pubnub.channel("myChannel");  
  
channel.publish(Object message)  
    .shouldStore(Boolean)  
    .meta(Object)  
    .queryParam(HashMap)  
    .usePOST(Boolean)  
    .ttl(Integer);  
    .customMessageType(String)  
`
```

Parameter | Type | Default | Notes
---|---|---|---
message* | Object | — | Do NOT pre-serialize.
shouldStore | Boolean | account setting | History toggle.
meta | Object | — | For server-side filtering.
queryParam | HashMap<String,String> | — | Extra analytics params.
usePOST | Boolean | false | HTTP verb override.
ttl | Integer | — | Per-message persistence TTL (hours).
customMessageType | String | — | 3-50 chars; no `pn_`, `pn-`.

Best practice: publish serially, check success, retry on failure, keep <100 queued messages.

### Examples

#### Publish a message
```
`  
`
```

#### Publish with metadata
```
`  
`
```

#### GSON / org.json payloads, TTL example – unchanged code blocks:
```
`  
`
```
```
`  
`
```
```
`  
`
```
```
`  
`
```
```
`  
`
```

### Response

`PNPublishResult.getTimetoken(): Long`

---

## Fire

Triggers Functions/Illuminate only (no replication, history, or subscriber delivery).

```
`Channel channel = pubnub.channel("myChannel");  
  
channel.fire(Object message)  
    .meta(Object)  
    .usePOST(Boolean);  
`
```

Parameter | Type | Default
---|---|---
message* | Object | —
meta | Object | —
usePOST | Boolean | false

#### Usage
```
`  
`
```

Response identical to `publish()`.

---

## Signal

Lightweight (≤ 64 B) broadcast; cheaper, no history, no push.

```
`Channel channel = pubnub.channel("myChannel");  
  
channel.signal(Object message)  
    .customMessageType(String);  
`
```

Parameter | Type | Notes
---|---|---
message* | Object | Serialized automatically.
customMessageType | String | Same rules as in `publish()`.

#### Usage
```
`  
`
```

Response: `PNPublishResult.getTimetoken()`.

---

## Subscribe

Requires `subscribeKey`. Use entity-scoped `Subscription` or client-scoped `SubscriptionSet`.

### Entity subscription

```
`// Entity-based, local-scoped  
  
channel.subscription(SubscriptionOptions options)  
`
```

### Client subscription set

```
`// client-based, general-scoped  
  
pubnub.subscriptionSetOf(  
    SetString> channels,   
    SetString> channelGroups,   
    SubscriptionOptions options  
)  
`
```

`SubscriptionOptions`  
• `receivePresenceEvents()`  
• `filter(predicate: (PNEvent) -> Boolean)`

#### Basic usages & examples (all original blocks retained)

```
`  
`
```
```
`  
`
```
```
`  
`
```
```
`subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```
```
`  
`
```

---

## Event listeners

Attach to `Subscription`, `SubscriptionSet`, or `PubNub` (status only).

Handle multiple events:
```
`fun addListener(listener: EventListener)  
`
```
```
`  
`
```

Handle single event type:
```
`  
`
```

Remove listener:
```
`subscription.setOnMessage(null);  
`
```

Connection status listener:
```
`pubnub.addListener(object : StatusListener() {  
    override fun status(pubnub: PubNub, status: PNStatus) {  
        println("Connection Status: ${status.category}")  
    }  
})  
`
```
```
`  
`
```

---

## Unsubscribe

```
`  
`
```

```
`  
`
```

## Unsubscribe All (client-scope)

```
`pubnub.unsubscribeAll()  
`
```

```
`  
`
```

---