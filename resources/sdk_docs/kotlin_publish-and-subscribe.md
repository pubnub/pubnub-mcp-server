# Publish/Subscribe API – Kotlin SDK (v 9+)  
This condensed guide keeps every code block, method signature, parameter list, and all critical limits/configuration settings.  
For pre-9 projects see the Java/Kotlin migration guide—v9 introduces a unified client, new instantiation, and new async callbacks/status events.

---

## Request execution (`.sync()` / `.async()`)  

You **must** call `sync()` or `async { … }` on every Endpoint.

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

---

## Publish  

Requirements  
• `publishKey` in client config  
• Single channel only (create it via `pubnub.channel(name)`)  
• Message ≤ 32 KiB (optimum < 1800 B)  
• JSON-serializable payload (no pre-serialization)  
• Optional end-to-end TLS (`ssl=true`) and client-side encryption  
• Optional `customMessageType` (3–50 chars, no `pn_`, `pn-`)  

Best practice: serialize publishes, ensure `[1,"Sent",…]` before next send, throttle bursts, keep queue < 100.

### Method

```
`val channel = pubnub.channel("channelName")  
  
channel.publish(  
    message: Any,                       // required payload  
    shouldStore: Boolean = accountDefault,  
    meta: Any? = null,                 // filtering metadata  
    queryParam: Map<String, String>? = null,  
    usePost: Boolean = false,  
    ttl: Int? = null,                  // hours; see rules below  
    customMessageType: String? = null  
).async { result -> /* check result */ }  
`
```

TTL rules  
1. `shouldStore=true` & `ttl=0` → stored, no expiry  
2. `shouldStore=true` & `ttl=X` → expiry X h (ignored if unlimited retention)  
3. `shouldStore=false` → `ttl` ignored  
4. Unset `ttl` → key-level default expiry.

### Response  
`PNPublishResult?.timetoken : Long`

### Examples  

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

## Fire (Functions/Illuminate only)  

• Same `publishKey` & channel requirements  
• **Not** replicated, persisted, or delivered to subscribers

### Method  

```
`val channel = pubnub.channel("channelName")  
  
channel.fire(  
    message: Any,  
    meta: Any? = null,  
    usePost: Boolean = false,  
).async { result -> /* check result */ }  
`
```

### Response  
`PNPublishResult?.timetoken : Long`

```
`  
`
```

---

## Signal  

Fast, lightweight 64-byte payload; never persisted, cheaper than messages. Keep signals on separate channels from messages.

### Method  

```
`val channel = pubnub.channel("myChannel")  
  
channel.signal(  
    message: Any,  
    customMessageType: String? = null  
).async { result -> }  
`
```

### Response  
`PNPublishResult?.timetoken : Long`

```
`  
`
```

---

## Subscribe  

Requires `subscribeKey`. Two scopes:  

1. `Subscription` – entity-local  
2. `SubscriptionSet` – client-wide

### Create a Subscription  

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

### Create a SubscriptionSet  

```
`// client-based, general-scoped  
  
pubnub.subscriptionSetOf(  
    channels: Set<String>,            // can be empty  
    channelGroups: Set<String>,       // can be empty  
    options: SubscriptionOptions      // default = EmptyOptions  
)  
`
```

#### SubscriptionOptions helpers  
• `receivePresenceEvents()` – include presence updates  
• `filter { PNEvent -> Boolean }` – custom filter

#### Subscribe with timetoken  

```
`subscriptionSet.subscribe(SubscriptionCursor(timetoken = yourTimeToken))  
`
```

---

## Event listeners  

Attach to `Subscription`, `SubscriptionSet`, or (status only) `PubNub`.

Add generic listener:

```
`fun addListener(listener: EventListener)  
`
```

Add connection-status listener (PubNub-scope):

```
`pubnub.addListener(object : StatusListener() {  
    override fun status(pubnub: PubNub, status: PNStatus) {  
        // Handle connection status updates  
        println("Connection Status: ${status.category}")  
    }  
})  
`
```

Sample placeholders:

```
`  
`
```

```
`  
`
```

To remove a specific event listener, assign `null` to that handler.

---

## Unsubscribe  

```
`  
`
```

## Unsubscribe all (PubNub-scope)  

```
`  
`
```

No return values.

---

All original code blocks are preserved verbatim above.