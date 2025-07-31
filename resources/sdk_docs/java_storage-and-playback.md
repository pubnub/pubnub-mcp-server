# Message Persistence API (Java SDK)

> PubNub Java SDK v9.0.0 introduces a unified Java/Kotlin code-base, new client instantiation, and new async/status APIs. Review the migration guide before upgrading.

Message Persistence stores every published message (AES-256 encrypted in transit/at rest) for a retention period you configure (1 day → Unlimited). It supports:

* Messages  
* Message reactions  
* Files (File Sharing API)

---

## Fetch history

Requires: Message Persistence enabled on the key.

Timetoken rules  
• `start` only → older than `start`  
• `end` only → from `end` and newer  
• both → between `start` and `end` (inclusive of `end`)  
Limits: 100 msgs (single channel) or 25 msgs (multi-channel / with actions). Iterate by updating `start` to page. If `includeMessageActions=true`, the response can be truncated; a `more` object tells you how to continue.

### Method

```
`this.pubnub.fetchMessages()  
    .channels(ListString>)  
    .maximumPerChannel(Integer)  
    .start(Long)  
    .end(Long)  
    .includeMessageActions(Boolean)  
    .includeMeta(Boolean)  
    .includeMessageType(Boolean)  
    .includeCustomMessageType(Boolean)  
    .includeUUID(Boolean)  
`
```

Parameters  
• **channels (List<String>) required** – up to 500 channels  
• maximumPerChannel (Integer, default 100/25)  
• start (Long) – exclusive  
• end (Long) – inclusive  
• includeMessageActions (Boolean, default false)  
• includeMeta (Boolean, default false)  
• includeMessageType (Boolean, default true)  
• includeCustomMessageType (Boolean, default false)  
• includeUUID (Boolean, default true)  
• async (Consumer<PNFetchMessagesResult>)

Returns `PNFetchMessagesResult` list  
• getMessage() • getMeta() • getTimetoken() • getActionTimetoken() • getActions() • getMessageType() • getCustomMessageType() • getUuid()

#### Sample code
```
`  
`
```

#### Paging example
```
`  
`
```

---

## Delete messages from history

Pre-requisites  
1. Message Persistence enabled.  
2. “Enable Delete-From-History” ticked in Admin Portal.  
3. Client initialized with secret key.

### Method
```
`this.pubnub.deleteMessages()  
    .channels(Array)  
    .start(Long)  
    .end(Long)  
`
```

Parameters  
• **channels (Array<String>) required**  
• start (Long, inclusive)  
• end (Long, exclusive)  
• async (Consumer<PNDeleteMessagesResult>)

#### Sample
```
`  
`
```

#### Delete a specific message
```
`  
`
```

---

## Message counts

Counts messages with `timetoken ≥ channelsTimetoken`. Unlimited‐retention keys count only last 30 days.

### Method
```
`this.pubnub.messageCounts()  
    .channels(Array)  
    .channelsTimetoken(Array)  
`
```

Parameters  
• **channels (Array<String>) required**  
• **channelsTimetoken (Array<Long>) required** – one value for all channels or one per channel  
• async (Consumer<PNMessageCountResult>)

Returns `PNMessageCountResult`  
• getChannels() → Map<String,Long> (0 if none, 10000 if ≥10 k)

#### Sample
```
`  
`
```

#### Different timetoken per channel
```
`  
`
```

---

## History (deprecated—use Fetch History)

### Method
```
`this.pubnub.history()  
    .channel(String)  
    .reverse(Boolean)  
    .includeTimetoken(Boolean)  
    .includeMeta(Boolean)  
    .start(Long)  
    .end(Long)  
    .count(Integer);  
`
```

Parameters  
• **channel (String) required**  
• reverse (Boolean, default false) – `true` starts from oldest  
• includeTimetoken (Boolean, default false)  
• includeMeta (Boolean, default false)  
• start (Long, exclusive)  
• end (Long, inclusive)  
• count (Integer, default 100, max 100)  
• async (Consumer<PNHistoryResult>)

reverse note: results are always ascending; `reverse` controls which end of >100-msg interval is fetched first.

Returns `PNHistoryResult`  
• getMessages() → List<PNHistoryItemResult>  
• getStartTimetoken() • getEndTimetoken()

`PNHistoryItemResult`  
• getTimetoken() • getEntry()

#### Samples
```
`  
`
```

#### Three oldest messages
```
`  
`
```

#### Page newer than timetoken
```
`  
`
```

#### Page until timetoken
```
`  
`
```

#### History paging helper
```
`  
`
```

#### Include timetoken
```
`**`
```

---

_Last updated: Jul 15 2025_