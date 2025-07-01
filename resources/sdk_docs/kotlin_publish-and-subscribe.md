# Publish/Subscribe API – Kotlin SDK (v9+)

> All code blocks, method signatures, parameters, and limits are kept exactly as in the original doc.  
> Call `.sync()` or `.async{}` on every Endpoint (or nothing happens).

##### Breaking changes in 9.0.0  
Single Kotlin/Java code-base, new client instantiation, new async callbacks & status events. See migration guide.

---

## Publish

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

```
`val channel = pubnub.channel("channelName")  
  
channel.publish(  
    message: Any,  
    shouldStore: Boolean,  
    meta: Any,  
    queryParam: MapString, String>,  
    usePost: Boolean,  
    ttl: Integer,  
    customMessageType: String  
).async { result -> /* check result */ }  
`
```

Essentials  
• Requires `publishKey`; channel must exist; one channel per call.  
• Message: any JSON-serializable value (don’t pre-serialize).  
• Max size 32 KiB (optimal < 1 800 B).  
• Optional `customMessageType` (3-50 alphanum, `-`, `_`, not starting with `pn_`/`pn-`).  
• `shouldStore` + `ttl` rules:  
  1) store + ttl 0 → no expiry;  
  2) store + ttl X → expire after X h (unless unlimited retention);  
  3) not store → ttl ignored.  
• Soft in-memory queue limit 100 msgs per subscriber.

Response: `PNPublishResult?.timetoken : Long`

Examples
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

---

## Fire

```
`val channel = pubnub.channel("channelName")  
  
channel.fire(  
    message: Any,  
    meta: Any,  
    usePost: Boolean,  
).async { result -> /* check result */ }  
`
```

Essentials  
• Requires `publishKey`; channel must exist.  
• Triggers Functions/Illuminate only; **not** delivered to subscribers, not stored in history.

Response: `PNPublishResult?.timetoken : Long`

```
`  
`
```

---

## Signal

```
`val channel = pubnub.channel("myChannel")  
  
channel.signal(  
    message: Any,  
    customMessageType: String  
).async { result -> }  
`
```

Essentials  
• Requires `publishKey`.  
• Payload ≤ 64 B; not persisted; cheaper than message; cannot trigger push.  
• Use separate channels for signals vs. messages.

Response: `PNPublishResult?.timetoken : Long`

```
`  
`
```

---

## Subscribe

### Entity-level subscription

```
`// Entity-based, local-scoped  
  
// Specify the channel for subscription  
val myChannel = pubnub.channel("channelName")  
  
// Create subscription options, if any  
val options = SubscriptionOptions.receivePresenceEvents()  
  
// Return a Subscription object that is used to establish the subscription  
val subscription = myChannel.subscription(options)  
  
// Activate the subscription to start receiving events  
subscription.subscribe()  
`
```

### Client-level subscription set

```
`// client-based, general-scoped  
  
pubnub.subscriptionSetOf(  
    channels: SetString>,  
    channelGroups: SetString>,  
    options: SubscriptionOptions  
)  
`
```

`SubscriptionOptions`  
• `receivePresenceEvents()` – deliver presence.  
• `filter { PNEvent -> Boolean }` – custom event filter.

Subscribe with timetoken:

```
`subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

Returns: none (events delivered via listeners).

---

## Event Listeners

Add generic listener:

```
`fun addListener(listener: EventListener)  
`
```
```
`  
`
```

Assign per-event listener / remove:

```
`  
`
```
```
`  
`
```

Connection status (client-scope):

```
`pubnub.addListener(object : StatusListener() {  
    override fun status(pubnub: PubNub, status: PNStatus) {  
        // Handle connection status updates  
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

## Unsubscribe All (client scope)

```
`  
`
```
```
`  
`
```

---