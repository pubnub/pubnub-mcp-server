# PubNub JavaScript SDK – Publish & Subscribe (Condensed)

This condensed reference keeps every code block, method signature, parameter list, and critical technical detail from the original documentation while removing redundant prose.

---

## Initialization

• `publishKey` required for `publish()`/`fire()`  
• `subscribeKey` required for `subscribe()`  
• TLS: set `ssl: true` at initialization  
• Optional end-to-end encryption: configure `cryptoModule`

---

## Publish

### Limits & Best Practices
• One channel per call, ≤ 32 KiB payload (ideal < 1.8 KiB)  
• Publish serially, confirm success, retry on failure  
• Message queue per subscriber: 100; throttle bursts (≈ 5 msg/s)  
• Do **not** JSON-serialize `message` or `meta`.

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

Parameter notes  
• `message` – any JSON value  
• `channel` – target channel  
• `storeInHistory` (default `true`) – disable to skip persistence  
• `sendByPost` – HTTP POST + compression  
• `ttl` – per-message TTL (hours)  
• `customMessageType` – 3-50 chars, alphanumeric/`-_`, cannot start with `pn_`/`pn-`

### Basic Usage

```
`  
`
```

```
`  
`
```

### Response

```
`type PublishResponse = {  
    timetoken: number  
}  
`
```

### Other Examples

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

`fire()` triggers Functions/Event Handlers only—no replication, no history.

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

### Example

```
`  
`
```

---

## Signal

Payload limit: 64 bytes (contact support to raise).

### Method

```
`pubnub.signal({  
    message: string,  
    channel: string,  
    customMessageType: string,  
}): PromiseSignalResponse>;  
`
```

### Example

```
`  
`
```

### Response

```
`type SignalResponse = {  
    timetoken: number  
}  
`
```

---

## Subscribe

### subscription vs. subscriptionSet
• `subscription` – entity-scoped  
• `subscriptionSet` – client/global scope

### subscriptionOptions
• `receivePresenceEvents` (boolean)  
• `cursor?: { timetoken?: string; region?: number }`

### Create Subscriptions

```
`// entity-based, local-scoped  
const channel = pubnub.channel('channel_1');  
channel.subscription(subscriptionOptions)  
`
```

```
`// client-based, general-scoped  
pubnub.subscriptionSet({  
    channels: string[],  
    channelGroups: string[],  
    subscriptionOptions: subscriptionOptions  
}))  
`
```

### Start Listening

```
`subscription.subscribe()  
subscriptionSet.subscribe()  
`
```

```
`  
`
```

#### Other Examples

```
`  
`
```

```
`  
`
```

---

## Entities (Helpers)

Create a local reference, then call `.subscription()` as needed.

```
`pubnub.channel(string)  
`
```

```
`  
`
```

```
`pubnub.channelGroup(string)  
`
```

```
`  
`
```

```
`pubnub.channelMetadata(string)  
`
```

```
`  
`
```

```
`pubnub.userMetadata(string)  
`
```

```
`  
`
```

---

## Event Listeners

Attach listeners to `subscription`, `subscriptionSet`, or the PubNub client.

```
`  
`
```

### Connection Status Listener (client-only)

```
`  
`
```

```
`  
`
```

---

## Unsubscribe

```
`subscription.unsubscribe()  
  
subscriptionSet.unsubscribe()  
`
```

```
`  
`
```

## Unsubscribe All (client scope)

```
`pubnub.unsubscribeAll()  
`
```

```
`  
`
```

---

All original code blocks are preserved; only explanatory text has been condensed.