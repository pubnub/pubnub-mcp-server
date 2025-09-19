# Message Persistence API – Kotlin SDK

## Breaking changes (v9.0.0)
• Unified Kotlin/Java codebase  
• New client-instantiation pattern  
• New async callbacks & status events  
Applications built with < 9.0.0 must migrate (see migration guide).

## Request execution
All SDK methods return an `Endpoint`. Always finish the chain with `.sync()` or `.async()`.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

---

## Batch history (fetchMessages)

Requires Message Persistence (enable in Admin Portal).  
Limits: 100 msgs (single channel) or 25 msgs / channel (≤ 500 channels).

`start` / `end` rules  
• start only → older than `start`  
• end only → `end` and newer  
• both → inclusive slice (`end` included)

### Method
```
`pubnub.fetchMessages(  
    channels: List<String>,  
    page: PNBoundedPage,  
    includeMeta: Boolean,  
    includeMessageAction: Boolean,  
    includeMessageType: Boolean,  
    includeCustomMessageType: Boolean,  
).async { result -> }  
`
```

Parameter | Type | Default | Notes
---|---|---|---
channels* | `List<String>` | – | Channels to fetch
page | `PNBoundedPage` | – | `limit` (100/25), `start` (exclusive), `end` (inclusive)
includeMeta | `Boolean` | `false` | Include metadata
includeMessageActions | `Boolean` | `false` | If `true`, only one channel allowed
includeMessageType | `Boolean` | `true` | Include message type
includeCustomMessageType | `Boolean` | `false` | Include custom type

### Returns
• `channels : HashMap<String, List<PNFetchMessageItem>>`  
• `page : PNBoundedPage` (non-null → more data)

#### PNFetchMessageItem
Field | Type | Notes
---|---|---
message | `JsonElement`
timetoken | `Long`
meta | `JsonElement?`
actions | `Map<String, HashMap<String, List<Action>>>?`
customMessageType | `String`

#### Action
`uuid : String` `actionTimetoken : String`

### Sample code
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

## Delete messages (deleteMessages)

Requires Message Persistence + “Enable Delete-From-History” (Admin Portal) and secret key.

### Method
```
`pubnub.deleteMessages(  
    channels: List<String>,  
    start: Long,  
    end: Long  
).async { result -> }  
`
```

Parameter | Type | Default | Notes
---|---|---|---
channels* | `List<String>` | – | Channels to delete from
start | `Long` | – | Inclusive start timetoken
end | `Long` | – | Exclusive end timetoken

### Sample code
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

## Message counts (messageCounts)

Requires Message Persistence (unlimited retention keys: last 30 days only).

### Method
```
`pubnub.messageCounts(  
    channels: List<String>,  
    channelsTimetoken: List<Long>  
).async { result -> }  
`
```

Parameter | Type | Notes
---|---|---
channels* | `List<String>` | Channels to count
channelsTimetoken* | `List<Long>` | One value for all channels OR one per channel (use `publishTimetoken - 1` for “since message”)

### Returns
`Map<String, Long>` – 0 for empty channels, 10000 if ≥ 10 000.

### Sample / other examples
```
`  
`
```

---

## History (deprecated)

Prefer `fetchMessages()`. Still available for single-channel history.

### Method
```
`pubnub.history(  
    channel: String,  
    reverse: Boolean,  
    includeTimetoken: Boolean,  
    includeMeta: Boolean,  
    start: Long,  
    end: Long,  
    count: Int  
).async { result -> }  
`
```

Parameter | Type | Default | Notes
---|---|---|---
channel* | `String` | – |
reverse | `Boolean` | `false` | `true` = oldest→newest
includeTimetoken | `Boolean` | `false` |
includeMeta | `Boolean` | `false` |
start | `Long` | – | Exclusive
end | `Long` | – | Inclusive
count | `Int` | `100` (max) |

Tip: `reverse` changes which side of the interval is returned first when > `count` messages match.

### Returns
`PNHistoryResult`  
• `messages : List<PNHistoryItemResult>`  
• `startTimetoken : Long`  
• `endTimetoken : Long`

#### PNHistoryItemResult
`timetoken : Long?` `entry : JsonElement` `meta : JsonElement?`

### Examples
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

#### History paging
```
`  
`
```

#### Include timetoken
```
`**`
```

*(Last updated: Jul 15 2025)*