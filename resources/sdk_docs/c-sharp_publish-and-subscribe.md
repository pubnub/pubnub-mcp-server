# Publish/Subscribe – C# SDK (Condensed)

## Request Execution

Use try/catch to handle parameter errors (exception) and transport/API errors (`PNStatus`).

```csharp
try  
{  
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  

    Console.WriteLine($"Server status : {publishResponse.Status.StatusCode}");  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed: {ex.Message}");  
}  
```

---

## Publish

• Requires `publishKey`.  
• One channel per call.  
• Max payload ≈ 32 KiB (optimum < 1.8 KB).  
• Throughput limited by subscriber capacity (in-memory queue = 100).  
• Optional SSL/TLS and message encryption.  
• Do **not** pre-serialize `message` / `meta`.

### Method

```csharp
pubnub.Publish()  
      .Message(object)                  // required  
      .Channel(string)                  // required  
      .ShouldStore(bool)                // override history setting  
      .Meta(Dictionary<string,object>)  // for filter expressions  
      .UsePOST(bool)                    // default: GET  
      .Ttl(int)                         // per-message TTL  
      .QueryParam(Dictionary<string,object>)  
      .CustomMessageType(string)        // 3-50 chars: text, action, …  
```

### Return

`Task<PNResult<PNPublishResult>>` →  
• `PNPublishResult.Timetoken : long`  
• `PNStatus` (HTTP code, error info)

### Code Samples
```
`  
`
```

---

## Fire

Sends payload only to Functions/Illuminate Event Handlers (no replication, history, or delivery to subscribers).

### Method

```csharp
pubnub.Fire()  
      .Message(object)                  // required  
      .Channel(string)                  // required  
      .Meta(Dictionary<string,object>)  
      .UsePOST(bool)  
      .QueryParam(Dictionary<string,object>)  
```

### Code Sample
```
`  
`
```

---

## Signal

Lightweight (≤ 64 B payload) broadcast to channel subscribers.

### Method

```csharp
pubnub.Signal()  
      .Message(object)                  // required  
      .Channel(string)                  // required  
      .CustomMessageType(string)  
```

### Response

`Timetoken : long`

### Code Sample
```
`  
`
```

---

## Subscribe

Requires `subscribeKey`. Opens streaming TCP socket for messages/events.

### Create Subscription (single entity)

```csharp
// entity-scoped
Channel firstChannel = pubnub.Channel("first");
Subscription sub = firstChannel.Subscription(SubscriptionOptions options);
```

### Create Subscription Set (multi-entity)

```csharp
// client-scoped
SubscriptionSet set = pubnub.SubscriptionSet(
    channels: string[], 
    channelGroups: string[], 
    options: SubscriptionOptions
);
```

Keep strong references to `Subscription` / `SubscriptionSet`.

#### SubscriptionOptions

`ReceivePresenceEvents` – deliver presence updates.

### Subscribe Method

```csharp
subscription.Subscribe<object>(SubscriptionCursor cursor)
```
`cursor` = `{ Timetoken?: long; Region?: int }` (best-effort replay).

### Code Samples
```
`  
`
```
```
`  
`
```

No return value.

---

## Entities

Create local representations to build subscriptions.

```csharp
pubnub.Channel(string)
pubnub.ChannelGroup(string)
pubnub.ChannelMetadata(string)
pubnub.UserMetadata(string)
```
Samples
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

## Event Listeners

Attach to `Subscription`, `SubscriptionSet`, or client.

```
`  
`
```

Add connection status listener:

```csharp
pubnub.AddListener(listener)
```
Sample
```
`  
`
```

---

## Unsubscribe

```csharp
subscription.Unsubscribe<object>()
subscriptionSet.Unsubscribe<object>()
```
Sample
```
`  
`
```

---

## Unsubscribe All (client-wide)

```csharp
pubnub.UnsubscribeAll<object>()
```
Sample
```
`  
`
```

---

(All original code blocks retained verbatim.)