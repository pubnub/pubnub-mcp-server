# Message Persistence API (Unity SDK) — Condensed Guide

Message Persistence stores every published message (timestamped to 10 ns) in multiple geographic zones. Messages can be AES-256 encrypted.  
Retention options per key: **1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited**.  
Retrievable objects: **Messages, Message Reactions, Files** (via File Sharing API).

---

## Fetch History

Requires **Message Persistence** to be enabled on the key.

• `start` only → messages older than `start`  
• `end` only → messages from `end` and newer  
• Both → inclusive range (`end` inclusive)  
Limits: **100 msgs / 1 channel** or **25 msgs / up to 500 channels**. If `IncludeMessageActions=true`, limit is 1 channel / 25 msgs. Call iteratively, adjusting `start`, to page through history.  
If actions cause internal truncation a `more` object is returned (use its values to continue).

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
• **Channels** *(string[ ])* – up to 500 channels (required).  
• Include* flags – toggle presence of `meta`, `uuid`, `messageType`, `customMessageType`, `message actions`.  
• **Reverse** *(bool)* – `true` returns oldest → newest.  
• **Start / End** *(long)* – time slice (exclusive / inclusive).  
• **MaximumPerChannel** *(int)* – 100 (single) / 25 (multi/actions).  
• **Execute**/`ExecuteAsync` return `PNFetchHistoryResult`.

### Sample code (placeholder)

```
`  
`
```

### Returns

`PNFetchHistoryResult`  
• `Messages : Dictionary<string, List<PNHistoryItemResult>>`  
• `More : MoreInfo` (pagination)

Example:

```
`{  
    "Messages":{  
        "my_channel":[{  
            "Timetoken":15717278253295153,  
            "Entry":"sample message",  
            "Meta":"",  
            "Uuid":"user-1",  
            "MessageType":null,  
            "Actions":null  
        }]  
    },  
    "More":null  
}  
`
```

### Other example (placeholder)

```
`  
`
```

---

## Delete Messages from History

Requires **Message Persistence** and **Enable Delete-From-History** toggle in Admin Portal.

### Method

```
`pubnub.DeleteMessages()  
    .Channel(string)  
    .Start(long)  
    .End(long)  
    .QueryParam(Dictionarystring,object>)  
`
```

• **Channel** *(string)* – required.  
• **Start (inclusive)** / **End (exclusive)** *(long)* – time slice.  
• Returns empty `PNDeleteMessageResult` via `Execute` / `ExecuteAsync`.

### Sample code (placeholder)

```
`  
`
```

#### Delete within timeframe (placeholder)

```
`  
`
```

#### Delete specific message (publish timetoken T)

```
`  
`
```

Use `Start = T-1`, `End = T`.

---

## Message Counts

Counts messages per channel since provided timetoken.  
For **Unlimited retention** keys, only last 30 days are considered.

### Method

```
`pubnub.MessageCounts()  
    .Channels(string[])  
    .ChannelsTimetoken(long[])  
    .QueryParam(Dictionarystring, object>)  
`
```

• **Channels** *(string[ ])* – target channels.  
• **ChannelsTimetoken** *(long[ ])* – one value for all channels or array of equal length.  
• Returns `PNMessageCountResult` (`Channels : Dictionary<string,long>`; 0 if none, 10000 if ≥10 000).

### Sample code (placeholder)

```
`  
`
```

#### Single-channel example (placeholder)

```
`  
`
```

#### Different timetokens per channel (placeholder)

```
`**`
```

---

_Last updated: Jul 15 2025_