# Publish/Subscribe API – JavaScript SDK (Condensed)

##### Supported async patterns  
Callbacks, Promises, Async/Await (recommended).

---

## Publish

`publish()` delivers a JSON-serializable `message` (≤ 32 KiB, optimal < 1800 B) to all subscribers of a single `channel`.  
Requirements & notes:  
• Initialize with a `publishKey`.  
• SSL/TLS via `ssl:true`; optional payload encryption.  
• One channel per publish; send serially and check success (`[1,"Sent", "..."]`).  
• In-memory queue = 100 messages—throttle bursts (≈ ≤ 5 msg/s).  
• Optional `customMessageType` (3-50 alphanum, `-`/`_` allowed, not `pn_`/`pn-`).  
• Do NOT pre-serialize `message`/`meta`.

### Method
```
`pubnub.publish({  
    message: any,  
    channel: string,  
    meta: any,  
    storeInHistory: boolean,  
    sendByPost: boolean,  
    ttl: number,  
    customMessageType: string  
}): PromisePublishResponse>;  
`
```
Parameter highlights  
• `storeInHistory` (default `true`).  
• `sendByPost` (default `false`) uses compressed HTTP POST.  
• `ttl` – Message Persistence TTL (hours).  

### Response
```
`type PublishResponse = {  
    timetoken: number  
}  
`
```

### Code samples (kept verbatim)
#### Publish a message to a channel
```
`  
`
```
```
`  
`
```
(Subscribe beforehand to see the message.)

Other examples:
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

`fire()` sends a message only to Functions Event Handlers / Illuminate; it is NOT replicated nor stored in history.

### Method
```
`fire({  
    Object message,  
    String channel,  
    Boolean sendByPost,  
    Object meta  
})  
`
```

### Sample
```
`  
`
```

---

## Signal

Lightweight messages (payload ≤ 64 B by default) to all channel subscribers.

### Method
```
`pubnub.signal({  
    message: string,  
    channel: string,  
    customMessageType: string,  
}): PromiseSignalResponse>;  
`
```

### Response
```
`type SignalResponse = {  
    timetoken: number  
}  
`
```

### Sample
```
`  
`
```

---

## Subscribe

Requires `subscribeKey`. Creates a TCP socket and listens for messages/events.

Subscription types  
• `subscription` – entity-scoped.  
• `subscriptionSet` – client-scoped.

Cursor (best-effort replay): `{ timetoken?: string; region?: number }`.

### Create subscription
```
`// entity-based, local-scoped  
const channel = pubnub.channel('channel_1');  
channel.subscription(subscriptionOptions)  
`
```

### Create subscription set
```
`// client-based, general-scoped  
pubnub.subscriptionSet({  
    channels: string[],  
    channelGroups: string[],  
    subscriptionOptions: subscriptionOptions  
}))  
`
```

### Subscribe
```
`subscription.subscribe()  
subscriptionSet.subscribe()  
`
```
Returns: void.

### Examples
```
`  
`
```
```
`  
`
```

---

## Entities

Factory methods (local only):
```
`pubnub.channel(string)  
`
```
```
`pubnub.channelGroup(string)  
`
```
```
`pubnub.channelMetadata(string)  
`
```
```
`pubnub.userMetadata(string)  
`
```

Samples:
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

## Event listeners

Attach with `addListener()` to `subscription`, `subscriptionSet`, or client (connection status).

```
`  
`
```
```
`  
`
```

Connection-status listener (client only):
```
`  
`
```
```
`  
`
```
Returns: subscription status object.

---

## Unsubscribe

Stop updates for a subscription or set:
```
`subscription.unsubscribe()  
  
subscriptionSet.unsubscribe()  
`
```
Sample:
```
`  
`
```

---

## Unsubscribe all (client scope)

```
`pubnub.unsubscribeAll()  
`
```
Sample:
```
`  
`
```

---

(End of condensed documentation – all original code blocks preserved.)