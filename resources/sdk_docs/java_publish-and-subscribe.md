# Publish/Subscribe API – Java/Kotlin SDK v9+

This summary keeps every code block, method signature, parameter description, and other technical facts while stripping prose duplicated elsewhere.

---

## Publish

### Method

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
--- | --- | --- | ---
`message`* | Object | — | JSON-serializable payload (DON’T pre-serialize).
`shouldStore` | Boolean | account default | Store in history.
`meta` | Object | not set | Used with filter expressions.
`queryParam` | HashMap<String,String> | not set | Custom analytics params.
`usePOST` | Boolean | false | Use POST instead of GET.
`ttl` | Integer | — | Per-message TTL (Message Persistence).
`customMessageType` | String | — | 3–50 chars, a–z, 0–9, `-`/`_`, cannot start with `pn_`/`pn-`.
`synchronous` | Command | — | Blocking call.
`async` | Consumer<Result> | — | Asynchronous (`PNPublishResult`).

• Requires `publishKey` and a channel entity.  
• Max size 32 KiB (optimal < 1800 B).  
• One channel per call; send serially and check success before next publish.  
• SSL/TLS via `ssl=true`; optional crypto module.  

### Response

`PNPublishResult.getTimetoken() : Long`

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

#### Google GSON / org.json examples

```
`  
`
```

#### Store message for 10 hours

```
`  
`
```

---

## Fire

### Method

```
`Channel channel = pubnub.channel("myChannel");  
  
channel.fire(Object message)  
    .meta(Object)  
    .usePOST(Boolean);  
`
```

Parameter | Type | Default | Notes
--- | --- | --- | ---
`message`* | Object | — | Payload sent only to Functions/Illuminate.
`meta` | Object | not set | Filterable metadata.
`usePOST` | Boolean | false | Use POST.
`synchronous` | Command | — | Blocking.
`async` | Consumer<Result> | — | Returns `PNPublishResult`.

• Requires `publishKey`.  
• Not replicated, not stored in history, not delivered to subscribers.

### Response

`PNPublishResult.getTimetoken()`

### Example

```
`  
`
```

---

## Signal

### Method

```
`Channel channel = pubnub.channel("myChannel");  
  
channel.signal(Object message)  
    .customMessageType(String);  
`
```

Parameter | Type | Notes
--- | --- | ---
`message`* | Object | ≤ 64 B (not stored).
`customMessageType` | String | Same rules as in Publish.
`synchronous` | PNPublishResult | Blocking.
`async` | Consumer<Result> | Async.

• Requires `publishKey`.  
• 64-byte limit, cheaper than messages, no history/push.  
• Use separate channels for signals vs. messages.

### Response

`PNPublishResult.getTimetoken()`

### Example

```
`  
`
```

---

## Subscribe

### Entity-level Subscription

```
`// Entity-based, local-scoped  
  
channel.subscription(SubscriptionOptions options)  
`
```

### Client-level Subscription Set

```
`// client-based, general-scoped  
  
pubnub.subscriptionSetOf(  
    SetString> channels,   
    SetString> channelGroups,   
    SubscriptionOptions options  
)  
`
```

SubscriptionOptions:
* `receivePresenceEvents()`
* `filter(predicate: (PNEvent) -> Boolean)`

#### Subscribe / Subscribe with timetoken

```
`  
`
```

```
`subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Return: none.

##### Example – manage subscription sets

```
`  
`
```

---

## Event Listeners

Add to `Subscription`, `SubscriptionSet`, or client.

### Generic listener

```
`fun addListener(listener: EventListener)  
`
```

### Single-event listener (overwrites previous)

```
`  
`
```

Remove:

```
`subscription.setOnMessage(null);  
`
```

### Connection status listener (client scope)

```
`pubnub.addListener(object : StatusListener() {  
    override fun status(pubnub: PubNub, status: PNStatus) {  
        println("Connection Status: ${status.category}")  
    }  
})  
`
```

---

## Unsubscribe

```
`  
`
```

Return: none.

## Unsubscribe All (client)

```
`pubnub.unsubscribeAll()  
`
```

Return: none.

---

### Breaking Changes (v9)

• Unified Java/Kotlin codebase, new client instantiation, new async callbacks and status events.  
• See Migration Guide for details.

---