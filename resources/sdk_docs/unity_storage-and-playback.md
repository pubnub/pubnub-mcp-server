# Message Persistence API (Unity SDK)

• Store messages 1 day – Unlimited (configurable per key).  
• AES-256 encryption supported.  
• Requires “Message Persistence” add-on enabled in the Admin Portal.

---

## Fetch History  

Fetch messages (and optionally message actions) for one or more channels.

### Method

```csharp
pubnub.FetchHistory()  
    .Channels(string[])  
    .IncludeMeta(bool)  
    .IncludeMessageType(bool)  
    .IncludeCustomMessageType(bool)  
    .IncludeUUID(bool)  
    .IncludeMessageActions(bool)  
    .Reverse(bool)  
    .Start(long)  
    .End(long)  
    .MaximumPerChannel(int)  
    .QueryParam(Dictionary<string, object>)  
    .Execute(System.Action<PNFetchHistoryResult>)  
    .ExecuteAsync() // returns Task<PNResult<PNFetchHistoryResult>>
```

### Parameters (key points)

* Channels (string[]) – up to 500.  
* IncludeMeta / IncludeUUID / IncludeMessageType / IncludeCustomMessageType (bool) – toggle extra fields.  
* IncludeMessageActions (bool) – limits to 1 channel & 25 msgs.  
* Start / End (long timetokens) – time range; see rules below.  
* Reverse (bool) – oldest → newest.  
* MaximumPerChannel – default/limit: 100 (single), 25 (multi or IncludeMessageActions = true).  
* QueryParam – extra URL params.

Timetoken rules:  
• `start` only ⇒ older than `start`.  
• `end` only ⇒ `end` and newer.  
• both ⇒ inclusive range (`end` included).

### Basic usage

```csharp
using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  

public class FetchLastMessageExample : MonoBehaviour {
    [SerializeField] PNManagerBehaviour pubnubManager;
    [SerializeField] string channelId = "my_channel";

    async void Start() {
        var pubnub = pubnubManager.pubnub;
        var res = await pubnub.FetchHistory()
            .Channels(new[] { channelId })
            .MaximumPerChannel(1)
            .ExecuteAsync();

        Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(res.Result));
    }
}
```

Retrieve last 25 messages synchronously:

```csharp
pubnub.FetchHistory()  
    .Channels(new[] { "my_channel" })  
    .IncludeMeta(true)  
    .MaximumPerChannel(25)  
    .Execute((result, status) => { /* … */ });
```

### Return type

`PNFetchHistoryResult`  
• Messages → Dictionary<string, List<PNHistoryItemResult>>  
   – Timetoken, Entry, Meta, Uuid, MessageType, CustomMessageType, Actions  
• More → { Start, End, Limit } (present when response is truncated)

```json
{
  "Messages": {
    "my_channel": [{
      "Timetoken": 15717278253295153,
      "Entry": "sample message",
      "Meta": "",
      "Uuid": "user-1",
      "MessageType": null,
      "Actions": null
    }]
  },
  "More": null
}
```

---

## Delete Messages from History  

Remove messages on a channel (requires “Enable Delete-From-History” checkbox in portal).

### Method

```csharp
pubnub.DeleteMessages()  
    .Channel(string)  
    .Start(long)  
    .End(long)  
    .QueryParam(Dictionary<string, object>)  
    .Execute(System.Action<PNDeleteMessageResult>)  
    .ExecuteAsync() // returns Task<PNResult<PNDeleteMessageResult>>
```

* Channel – single channel.  
* Start (inclusive) / End (exclusive) – timetoken range.

### Basic usage

```csharp
var resp = await pubnub.DeleteMessages()
    .Channel("history_channel")
    .Start(15088506076921021)
    .End(15088532035597390)
    .ExecuteAsync();

if (resp.Status?.Error == true)
    Debug.Log(resp.Status.ErrorData.Information);
```

### Examples

Delete in time frame (callback):

```csharp
pubnub.DeleteMessages()
    .Channel("history_channel")
    .Start(15088506076921021)
    .End(15088532035597390)
    .Execute((result, status) => { /* … */ });
```

Delete a specific message (publish timetoken = 15526611838554310):

```csharp
await pubnub.DeleteMessages()
    .Channel("history_channel")
    .Start(15526611838554309)   // timetoken - 1
    .End(15526611838554310)     // exact timetoken
    .ExecuteAsync();
```

Return: empty `PNDeleteMessageResult`.

---

## Message Counts  

Count messages published after provided timetoken(s).  
(For unlimited retention keys, only last 30 days considered.)

### Method

```csharp
pubnub.MessageCounts()  
    .Channels(string[])  
    .ChannelsTimetoken(long[])  
    .QueryParam(Dictionary<string, object>)  
    .Execute(System.Action<PNMessageCountResult>)  
    .ExecuteAsync() // returns Task<PNResult<PNMessageCountResult>>
```

* Channels – list of channels.  
* ChannelsTimetoken – single timetoken for all or one per channel (must match length).

### Basic usage

```csharp
var resp = await pubnub.MessageCounts()
    .Channels(new[] { "message_count_channel" })
    .ChannelsTimetoken(new long[] { 15088506076921021 })
    .ExecuteAsync();

Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(resp.Result));
```

### Examples

Single channel (callback):

```csharp
pubnub.MessageCounts()
    .Channels(new[] { "message_count_channel" })
    .ChannelsTimetoken(new long[] { 15088506076921021 })
    .Execute((result, status) => { /* … */ });
```

Multiple channels, different timetokens:

```csharp
var resp = await pubnub.MessageCounts()
    .Channels(new[] { "message_count_channel", "message_count_channel2" })
    .ChannelsTimetoken(new long[] { 15088506076921021, 15088506076921131 })
    .ExecuteAsync();
```

### Return type

`PNMessageCountResult`  
• Channels → Dictionary<string, long> (0–10000, 10000 means ≥10 k).

---

Last updated Jun 10 2025