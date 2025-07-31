# Publish/Subscribe API – Unity SDK (Condensed)

Below is the essential reference for Publish, Fire, Signal, and Subscribe in the PubNub Unity SDK.  
All method signatures, parameters, limits, and sample code are unchanged; explanatory text has been minimized.

---

## Publish

• Requires initialization with `publishKey`.  
• SSL/TLS: set `ssl = true`.  
• Message: any JSON-serializable data; **do NOT pre-serialize** `message` or `meta`.  
• Max size: 32 KiB (optimum < 1800 B).  
• Soft queue limit: 100 msgs per subscriber.  
• Use `GetJsonSafe()` for circular Unity structs (e.g., `Vector3`).  

```csharp
pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
```

Best practice (serial order, retry on failure, throttle ≤ 5 msg/s).

### Method(s)

```csharp
pubnub.Publish()  
    .Message(object)  
    .Channel(string)  
    .ShouldStore(bool)  
    .Meta(Dictionary<string, object>)  
    .UsePOST(bool)  
    .Ttl(int)  
    .QueryParam(Dictionary<string,object>)  
    .CustomMessageType(string)  
    .Execute(System.Action<PNPublishResult, PNStatus>)  
```

*Parameter summary*  
`Message`* (object) – payload  
`Channel`* (string) – destination channel  
`ShouldStore` (bool) – history on/off  
`Meta` (Dictionary<string,object>) – filterable metadata  
`UsePOST` (bool) – POST instead of GET  
`Ttl` (int) – per-message TTL  
`QueryParam` (Dictionary<string,object>) – debug query items  
`CustomMessageType` (string) – business label (3–50 chars)  
`Sync` / `Async` / `Execute` / `ExecuteAsync` variants available.

### Sample code

```
`  
`
```

(Subscribers must first `subscribe` to the same channel.)

### Returns

`PNResult<PNPublishResult>` →  
• `Result.Timetoken` (long)  
• `Status` (PNStatus)

### Other examples

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

Sends messages only to server-side Functions/Illuminate; not stored or delivered to channel subscribers.

### Method(s)

```csharp
pubnub.Fire()  
    .Message(object)  
    .Channel(string)  
    .Meta(Dictionary<string, object>)  
    .UsePOST(bool)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNPublishResult, PNStatus>)  
```

*Parameters identical to Publish (minus storage/TTL).*

### Sample code

```
`  
`
```

---

## Signal

Lightweight (≤ 64 bytes) message to all subscribers.

### Method(s)

```csharp
pubnub.Signal()  
    .Message(object)  
    .Channel(string)  
    .CustomMessageType(string)  
    .Execute(System.Action<PNPublishResult, PNStatus>)  
```

### Sample code

```
`  
`
```

### Response

`Timetoken` (long)

---

## Subscribe

• Requires `subscribeKey`.  
• Provides `Subscription` (entity-scoped) or `SubscriptionSet` (client-scoped).  
• Keep a strong reference to avoid GC.  
• Optional `automaticRetry`.

### Create subscription

```csharp
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);
```

### Create subscription set

```csharp
// client-based, general-scoped  
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(  
   channels: string[],  
   channelGroups: string[],  
   options: SubscriptionOptions  
)
```

`SubscriptionOptions.ReceivePresenceEvents` – include presence.

### Subscribe

```csharp
subscription.Subscribe<object>(SubscriptionCursor cursor)
```

`cursor` → `{ Timetoken: long?; Region: int? }`

### Sample / Other examples

```
`  
`
```

```
`  
`
```

(Returns: none)

---

## Entities (Creation helpers)

```csharp
pubnub.Channel(String)  
pubnub.ChannelGroup(String)  
pubnub.ChannelMetadata(String)  
pubnub.UserMetadata(String)  
```

Sample snippets retained:

```
`  
`
```

---

## Event listeners

Attach to `Subscription`, `SubscriptionSet`, or PubNub client.

```
`  
`
```

```
`  
`
```

Connection status listener (client scope):

```csharp
pubnub.AddListener(listener)
```

```
`  
`
```

(Return: subscription status)

---

## Unsubscribe

```csharp
subscription.Unsubscribe<object>()  
subscriptionSet.Unsubscribe<object>()
```

```
`  
`
```

## Unsubscribe all (client)

```csharp
pubnub.UnsubscribeAll<object>()
```

```
`  
`
```

---

All code blocks and critical technical references remain intact; non-essential prose has been removed.