# Publish/Subscribe API – C# SDK (Condensed)

##### Request execution
```csharp
try
{
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    PNStatus status = publishResponse.Status;
    Console.WriteLine("Server status code : " + status.StatusCode);
}
catch (Exception ex)
{
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");
}
```

---

## Publish
* Initialize with `publishKey`.  
* SSL/TLS: enable by setting `ssl = true` at initialization.  
* Payload: any JSON-serializable object; do **not** pre-serialize `message` or `meta`.  
* Max size: 32 KiB (optimum < 1800 bytes).  
* One channel per call; publish serially; queue limit 100 messages.  

### Method(s)
```csharp
pubnub.Publish()
      .Message(object)                 // required
      .Channel(string)                 // required
      .ShouldStore(bool)
      .Meta(Dictionary<string,object>)
      .UsePOST(bool)
      .Ttl(int)
      .QueryParam(Dictionary<string,object>)
      .CustomMessageType(string)
```

Parameter | Type | Notes
---|---|---
Message | object | Payload
Channel | string | Destination channel
ShouldStore | bool | Overrides key history setting
Meta | Dictionary<string,object> | For filter expressions
UsePOST | bool | Force POST
Ttl | int | Message TTL in storage
QueryParam | Dictionary<string,object> | Extra URL params
CustomMessageType | string | 3–50 chars, a–z A–Z 0–9, `_` or `-`

Execution helpers (deprecated → use `Execute/ExecuteAsync`):
`Sync`, `Async`.

### Returns
`PNResult<PNPublishResult>`  
`PNPublishResult.Timetoken : long`

### Basic usage
```csharp

```

#### Other examples
```csharp  // synchronous publish

```
```csharp  // publish with metadata

```
```csharp  // store message for 10 hours

```
```csharp  // FCM/APNS payload

```

---

## Fire
Sends data only to Functions Event Handlers; not replicated or stored.

### Method(s)
```csharp
pubnub.Fire()
      .Message(object)                 // required
      .Channel(string)                 // required
      .Meta(Dictionary<string,object>)
      .UsePOST(bool)
      .QueryParam(Dictionary<string,object>)
```

### Basic usage
```csharp

```

---

## Signal
Lightweight 64-byte messages to subscribers.

### Method(s)
```csharp
pubnub.Signal()
      .Message(object)                 // required
      .Channel(string)                 // required
      .CustomMessageType(string)
```

### Basic usage
```csharp

```

### Response
`Timetoken : long`

---

## Subscribe
Opens a socket and streams messages/events.

* Requires `subscribeKey`.
* Use entity-level `Subscription` or client-level `SubscriptionSet`.
* Keep a strong reference to subscriptions.

### Create a subscription
```csharp
// entity-based
Channel firstChannel = pubnub.Channel("first");
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);
```

### Create a subscription set
```csharp
// client-based
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(
    channels: string[],
    channelGroups: string[],
    options: SubscriptionOptions
);
```

`SubscriptionOptions.ReceivePresenceEvents`

### Subscribe method
```csharp
subscription.Subscribe<object>(SubscriptionCursor cursor)
```
`cursor` = `{ Timetoken : long?; Region : int? }`

#### Basic usage
```csharp

```

#### Combine two subscriptions into a set
```csharp

```

(Returns: none)

---

## Entities
Factory helpers (local objects):
```csharp
pubnub.Channel(string)           // Channel
pubnub.ChannelGroup(string)      // ChannelGroup
pubnub.ChannelMetadata(string)   // ChannelMetadata
pubnub.UserMetadata(string)      // UserMetadata
```
```csharp
pubnub.Channel("channelName");
pubnub.ChannelGroup("channelGroupName");
pubnub.ChannelMetadata("channelMetadata");
pubnub.UserMetadata("userMetadata");
```

---

## Event listeners
Attach to `Subscription`, `SubscriptionSet`, or PubNub client.

Method | Signature
---|---
Add generic listener | *(implementation specific)*
Add connection status listener | `pubnub.AddListener(listener)`

```csharp

```

---

## Unsubscribe
```csharp
subscription.Unsubscribe<object>();
subscriptionSet.Unsubscribe<object>();
```

## Unsubscribe All  (client scope)
```csharp
pubnub.UnsubscribeAll<object>();
```

(Returns: none)