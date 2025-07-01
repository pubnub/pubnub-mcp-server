# Message Persistence API – Java SDK

## Breaking changes in v9.0.0
v9.0.0 merges Java and Kotlin SDKs, changes client instantiation, async callbacks, and status events. See the Java/Kotlin migration guide for details.

---

## Fetch History

##### Requires Message Persistence enabled for the key.

Retrieves up to 100 messages for one channel or 25 messages for multiple channels (≤ 500).  
If both `start` and `end` are supplied, results are inclusive of `end`.  
If `includeMessageActions(true)` is used, the call is limited to one channel and 25 messages.  
A truncated response returns a `more` property—repeat the call with the new values to obtain remaining data.

### Method(s)
```
`this.pubnub.fetchMessages()  
    .channels(List<String>)  
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

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| **channels** | List\<String> | n/a | Required. Max 500. |
| maximumPerChannel | Integer | 100 \| 25 | 100 for single channel; 25 otherwise or when `includeMessageActions=true`. |
| start | Long | n/a | Exclusive lower bound. |
| end | Long | n/a | Inclusive upper bound. |
| includeMessageActions | Boolean | false | Retrieves message actions. |
| includeMeta | Boolean | false | Includes message metadata. |
| includeMessageType | Boolean | true | Includes message type. |
| includeCustomMessageType | Boolean | false | Includes custom message type. |
| includeUUID | Boolean | true | Includes publisher UUID. |
| async | Consumer\<Result> | n/a | Returns `PNFetchMessagesResult`. |

### Basic Usage
```
`  
`
```

### Returns (`PNFetchMessagesResult`)
| Method | Type | Description |
|--------|------|-------------|
| getMessage() | JsonElement | Message content. |
| getMeta() | JsonElement | Metadata (if requested). |
| getTimetoken() | Long | Publish timetoken. |
| getActionTimetoken() | Long | Message-action creation time. |
| getActions() | HashMap | Message actions (if requested). |
| getMessageType() | Integer | 0-message, 1-signal, 2-object, 3-action, 4-files. |
| getCustomMessageType() | String | Custom message type. |
| getUuid() | String | Publisher UUID. |

#### Paging History Responses
```
`  
`
```

---

## Delete Messages from History

Requires Message Persistence and “Enable Delete-From-History” setting. Requires secret key.

### Method(s)
```
`this.pubnub.deleteMessages()  
    .channels(Array)  
    .start(Long)  
    .end(Long)  
`
```

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| **channels** | Array | n/a | Required. |
| start | Long | n/a | Inclusive lower bound. |
| end | Long | n/a | Exclusive upper bound. |
| async | Consumer\<Result> | n/a | Returns `PNDeleteMessagesResult`. |

### Basic Usage
```
`  
`
```

#### Delete specific message from history
```
`  
`
```

---

## Message Counts

##### Requires Message Persistence enabled for the key (last 30 days for unlimited retention).

### Method(s)
```
`this.pubnub.messageCounts()  
    .channels(Array)  
    .channelsTimetoken(Array)  
`
```

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| **channels** | Array | n/a | Required. |
| **channelsTimetoken** | Array | n/a | One timetoken for all channels or one per channel. |
| async | Consumer\<Result> | n/a | Returns `PNMessageCountResult`. |

### Basic Usage
```
`  
`
```

### Returns (`PNMessageCountResult`)
| Method | Type | Description |
|--------|------|-------------|
| getChannels() | Map\<String, Long> | Message count per channel (0–10000). |

#### Retrieve count of messages using different timetokens for each channel
```
`  
`
```

---

## History (deprecated)

Use Fetch History instead. Still available:

### Method(s)
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

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| **channel** | String | n/a | Required. |
| reverse | Boolean | false | If true, traverse timeline from oldest. |
| includeTimetoken | Boolean | false | Include message timetokens. |
| includeMeta | Boolean | false | Include metadata. |
| start | Long | n/a | Exclusive lower bound. |
| end | Long | n/a | Inclusive upper bound. |
| count | Integer | 100 | Max 100. |
| async | Consumer\<Result> | n/a | Returns `PNHistoryResult`. |

### Basic Usage – last 100 messages
```
`  
`
```

### Returns (`PNHistoryResult`)
| Method | Type | Description |
|--------|------|-------------|
| getMessages() | List\<PNHistoryItemResult> | Historical messages. |
| getStartTimetoken() | Long | Start timetoken. |
| getEndTimetoken() | Long | End timetoken. |

#### PNHistoryItemResult
| Method | Type | Description |
|--------|------|-------------|
| getTimetoken() | Long | Message timetoken. |
| getEntry() | JsonElement | Message body. |

### Additional Examples
Paging, reverse traversal, and timetoken filters:
```
`  
`
```

---

_Last updated on Jun 10 2025_