# Message Persistence API – C# SDK (Storage & Playback)

Message Persistence stores every published message (10-ns resolution) in multiple geographic zones.  
Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.  
Retrievable objects: messages, message reactions, files (File-Sharing API).  
Encryption: optional AES-256 per-message.

---

## Request execution pattern (recommended)

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

• SDK throws an exception for invalid parameters.  
• Network/server errors are returned inside `status`.

---

## Fetch History  (requires Message Persistence enabled)

Rules for `start` / `end`:
• `start` only → older than `start`  
• `end` only → `end` and newer  
• both → between `start` and `end` (inclusive of `end`)  
Limits: 100 msgs (single channel) or 25/msg × ≤500 channels. If `IncludeMessageActions=true`, max 25 msgs, single channel only. Iterate with new `start` when more data exists.

### Method

```
`pubnub.FetchHistory()  
        .Channels(string[])  
        .IncludeMeta(bool)  
        .IncludeMessageType(bool)  
        .IncludeCustomMessageType(bool)  
        .IncludeUUID(bool)  
        .IncludeMessageActions(bool)  
        .Reverse(bool)  
        .Start(int)  
        .End(int)  
        .MaximumPerChannel(int)  
        .QueryParam(Dictionarystring, object>)  
`
```

Parameter highlights  
• `Channels` (string[]) – up to 500 channels.  
• `IncludeMeta`, `IncludeMessageType`, `IncludeCustomMessageType`, `IncludeUUID` – booleans, default `true` except `IncludeCustomMessageType` (`false`).  
• `IncludeMessageActions` – boolean, limits call as noted.  
• `Reverse` – `true` returns oldest first.  
• `Start`, `End` – `long` timetokens.  
• `MaximumPerChannel` – int (100/25).  
• `ExecuteAsync` → `PNResult<PNFetchHistoryResult>`.

### Truncated responses  
When internal limits are hit the response contains a `more` object; repeat calls with supplied values.

### Example response

```
`{  
    "Messages":  
        {  
            "my_channel":  
            [{  
                "Timetoken":15717278253295153,  
                "Entry":"sample message",  
                "Meta":"",  
                "Uuid":"user-1",  
                "MessageType":0,  
                "CustomMessageType":"text-message",  
                "Actions":null  
            }]  
        },  
    "More":null  
`
```

### Basic / other usage
(All example blocks preserved)

```
`  
`
```

```
`  
`
```

---

## Delete Messages from History  (secret key & “Delete-From-History” setting required)

Deletes messages for one channel within an optional time window.

### Method

```
`pubnub.DeleteMessages()  
        .Channel(string)  
        .Start(long)  
        .End(long)  
        .QueryParam(Dictionarystring,object>)  
`
```

• `Start` inclusive, `End` exclusive.  
• To delete a single message: `End = publishTimetoken`, `Start = publishTimetoken - 1`.  
• `ExecuteAsync` → `PNResult<PNDeleteMessageResult>` (empty result object).

Code examples (preserved):

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

## Message Counts  (requires Message Persistence enabled)

Returns message count per channel since given timetoken(s). For unlimited-retention keys only last 30 days are considered.

### Method

```
`pubnub.MessageCounts()  
        .Channels(string[])  
        .ChannelsTimetoken(long[])  
        .QueryParam(Dictionarystring, object>)  
`
```

• Provide one `timetoken` for all channels or an array matching channel order.  
• `ExecuteAsync` → `PNResult<PNMessageCountResult>`; `PNMessageCountResult.Channels` is a `Dictionary<string,long>` (0 if none, 10000 if ≥10 000).

Example blocks:

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

## History (deprecated – use FetchHistory)

Historical retrieval for a single channel; same start/end/reverse concepts, max 100 msgs.

### Method

```
`pubnub.History()  
        .Channel(string)  
        .IncludeMeta(bool)  
        .Reverse(bool)  
        .IncludeTimetoken(bool)  
        .Start(long)  
        .End(long)  
        .count(int)  
        .QueryParam(Dictionarystring,object>)  
`
```

`ExecuteAsync` → `PNResult<PNHistoryResult>`.

Code & response samples (preserved):

```
`  
`
```

```
`{  
    "Messages":[  
        {  
            "Timetoken": 0,  
            "Entry": "Pub1"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub2"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub3"  
        }  
    ],  
`
```

```
`  
`
```

```
`{  
    "Messages":[  
        {  
            "Timetoken": 0,  
            "Entry": "Pub3"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub4"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub5"  
        }  
    ],  
`
```

```
`  
`
```

```
`{  
    "Messages":[  
        {  
            "Timetoken": 0,  
            "Entry": "Pub3"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub4"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub5"  
        }  
    ],  
`
```

```
`  
`
```

```
`**`
```

_Last updated  Jun 30 2025_