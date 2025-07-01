# Publish/Subscribe API – Unity SDK (Condensed)

This section keeps all essential configuration requirements, method signatures, parameters, and complete code blocks while omitting redundant narrative text.

---

## Publish

• Initialize PubNub with both `publishKey` and `subscribeKey`.  
• One channel per call; publisher ≠ subscriber; SSL via `ssl=true`; optional message encryption.  
• Payload: any JSON-serializable value; **do not pre-serialize** `message` or `meta`.  
• Max size 32 KiB (optimal < 1 800 bytes) – otherwise `Message Too Large`.  
• Message queue soft-limit: 100; throttle bursts (≈ ≤ 5 msg/s).  
• Use `GetJsonSafe()` for objects with circular references.  
• Optional `CustomMessageType` (3-50 alphanum, case-sensitive, cannot start with `pn_` or `pn-`).  

### Best-practice flow  
1. Publish serially. 2. Check success `[1,"Sent",... ]`. 3. Retry on failure `[0,"...",<timetoken>]`.

### Method(s)

```
`pubnub.Publish()  
    .Message(object)            // required  
    .Channel(string)            // required  
    .ShouldStore(bool)          // overrides key-level history  
    .Meta(Dictionary<string,object>)  
    .UsePOST(bool)  
    .Ttl(int)                   // per-message TTL (hours)  
    .QueryParam(Dictionary<string,object>)  
    .CustomMessageType(string)  
    .Execute(System.Action<PNPublishResult, PNStatus>)  
`
```

Returns `PNResult<PNPublishResult>` → `Result.Timetoken` (long) and `Status`.

### Code blocks (unaltered)

```
`pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
`
```

```
`using PubnubApi.Unity;  
using UnityEngine;  
  
public class PubnubBasicUsageExample : MonoBehaviour {  
  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
    [SerializeField] private string testChannelId = "test_channel_id";  
  
    private async void Start() {  
        var pubnub = pubnubManager.pubnub;  
`
```
*show all 33 lines*

```
`//Publishing Dictionary  
Dictionary<string, float> position = new Dictionary<string, float>();  
position.Add("lat", 32F);  
position.Add("lng", 32F);  
  
Debug.Log("before pub: " + pubnub.JsonPluggableLibrary.SerializeToJsonString(position));  
  
pubnub.Publish()  
    .Message(position)  
    .Channel("my_channel")  
    .CustomMessageType("text-message")  
    .Execute(new PNPublishResultExt(  
        (result, status) => {  
            Debug.Log("pub timetoken: " + result.Timetoken.ToString());  
            Debug.Log("pub status code : " + status.StatusCode.ToString());  
`
```
*show all 17 lines*

```
`string[] arrayMessage = new string[] {  
    "hello",  
    "there"  
};  
  
pubnub.Publish()  
    .Message(arrayMessage.ToList())  
    .Channel("suchChannel")  
    .ShouldStore(true)  
    .Meta("")  
    .UsePOST(true)  
    .CustomMessageType("text-message")  
    .Execute((result, status) => {  
            // handle publish result, status always present, result if successful  
            // status.Error to see if error happened  
`
```
*show all 17 lines*

```
`PNPublishResult res = pubnub.Publish()  
    .Channel("coolChannel")  
    .Message("test")  
    .ShouldStore(true)  
    .Ttl(10)  
    .CustomMessageType("text-message")  
    .Sync();  
`
```

```
`public class MobilePayload  
{  
    public Dictionary<string, object> pn_apns;  
    public Dictionary<string, object> pn_gcm;  
    public Dictionary<string, object> full_game;  
}  
  
Dictionary<string, object> apnsData = new Dictionary<string, object>();  
apnsData.Add("aps", new Dictionary<string, object>() {  
    { "alert", "Game update 49ers touchdown" },  
    { "badge", 2 }  
});  
apnsData.Add("teams", new string[] { "49ers", "raiders" });  
apnsData.Add("score", new int[] { 7, 0 });  
`
```
*show all 54 lines*

---

## Fire

Used to invoke Functions/Illuminate without broadcasting or history storage.

### Method(s)

```
`pubnub.Fire()  
    .Message(object)            // required  
    .Channel(string)            // required  
    .Meta(Dictionary<string,object>)  
    .UsePOST(bool)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNPublishResult, PNStatus>)  
`
```

### Example

```
`string[] arrMessage = new string[] {  
    "hello",  
    "there"  
};  
  
pubnub.Fire()  
    .Message(arrMessage.ToList())  
    .Channel(channel)  
    .UsePOST(true)  
    .Execute((result, status) => {  
            if (status.Error) {  
                Debug.Log("error happened while publishing: " + pubnub.JsonPluggableLibrary.SerializeToJsonString(status));  
            } else {  
                Debug.Log("publish worked! timetoken: " + result.Timetoken.ToString());  
`
```
*show all 18 lines*

---

## Signal

Lightweight 64-byte payloads to all subscribers (no storage).

### Method(s)

```
`pubnub.Signal()  
    .Message(object)            // required  
    .Channel(string)            // required  
    .CustomMessageType(string)  
    .Execute(System.Action<PNPublishResult, PNStatus>)  
`
```

### Example

```
`Dictionary<string, string> myMessage = new Dictionary<string, string>();  
myMessage.Add("msg", "Hello Signals");  
  
pubnub.Signal()  
    .Message(myMessage)  
    .Channel("foo")  
    .CustomMessageType("text-message")  
    .Execute((result, status) => {  
        if (status.Error) {  
            Debug.Log(status.ErrorData.Information);  
        } else {  
            Debug.Log(result.Timetoken);  
        }  
    });  
`
```

Response field: `Timetoken` (long).

---

## Subscribe

Requires `subscribeKey`. Creates a TCP socket and streams events.

### Entities & Creation

```
`pubnub.Channel("name")`            // Channel  
`pubnub.ChannelGroup("name")`       // Channel Group  
`pubnub.UserMetadata("id")`         // User metadata  
`pubnub.ChannelMetadata("id")`      // Channel metadata  
```

### Subscription / SubscriptionSet

```
`// entity-based  
Channel firstChannel = pubnub.Channel("first");  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  
  
// client-based  
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(  
   channels: string[],  
   channelGroups: string[],  
   options: SubscriptionOptions  
)  
```

`SubscriptionOptions.ReceivePresenceEvents` – include presence updates.

### Start streaming

```
`subscription.Subscribe<object>(SubscriptionCursor cursor)`  
```

#### Examples

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription();  
subscription1.Subscribe<object>();  
  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
);  
subscriptionSet.Subscribe<object>();  
```

```
`// Combine two existing subscriptions into a set  
Subscription subscription1 = pubnub.Channel("channelName").Subscription();  
Subscription subscription2 = pubnub.ChannelGroup("channelGroupName").Subscription();  
SubscriptionSet subscriptionSet = subscription1.Add(subscription2);  
subscriptionSet.Subscribe<object>();  
```

---

## Event listeners

Attach to `Subscription`, `SubscriptionSet`, or client for connection status.

```
`// Event-specific listener  
Subscription subscription1 = pubnub.Channel("channelName").Subscription();  
subscription1.OnMessage = (Pubnub pn, PNMessageResult<object> evt) => {  
 Console.WriteLine($"Message received {evt.Message}");  
};  
subscription1.Subscribe<object>();  
  
// Generic listener  
SubscribeCallbackExt listener = new SubscribeCallbackExt(  
 delegate (Pubnub pn, PNMessageResult<object> msg) {  
  Console.WriteLine($"received message {msg.Message}");  
 }  
);  
pubnub.AddListener(listener);  
```

Connection status listener:

```
`SubscribeCallbackExt eventListener = new SubscribeCallbackExt(  
 delegate (Pubnub pn, PNStatus e) {  
  Console.WriteLine("Status event");  
 }  
);  
pubnub.AddListener(eventListener);  
```

---

## Unsubscribe

```
`subscription.Unsubscribe<object>();  
subscriptionSet.Unsubscribe<object>();  
```

Example:

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription();  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
);  
subscription1.Subscribe<object>();  
subscriptionSet.Subscribe<object>();  
  
subscription1.Unsubscribe<object>();  
subscriptionSet.Unsubscribe<object>();  
```

---

## Unsubscribe All (client-wide)

```
`pubnub.UnsubscribeAll<object>();  
```

Example:

```
`Subscription subscription1 = pubnub.Channel("channelName").Subscription();  
SubscriptionSet subscriptionSet = pubnub.Subscription(  
    new string[] {"channel1", "channel2"},  
    new string[] {"channel_group_1", "channel_group_2"},  
    SubscriptionOptions.ReceivePresenceEvents  
);  
subscription1.Subscribe<object>();  
subscriptionSet.Subscribe<object>();  
  
pubnub.UnsubscribeAll<object>();  
```

---