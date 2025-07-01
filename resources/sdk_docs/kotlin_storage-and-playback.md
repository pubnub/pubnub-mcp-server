# Message Persistence API – Kotlin SDK

> PubNub Kotlin SDK ≥ 9.0.0 merges Kotlin/Java code-bases, changes client instantiation, callbacks, and status events. See the Java/Kotlin migration guide if upgrading from < 9.0.0.

Message Persistence lets you store and retrieve messages, actions, and files for 1 day – Unlimited. All methods return an `Endpoint`; ALWAYS finish with `.sync()` or `.async()`.

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

## Batch History - `fetchMessages()`

Requires Message Persistence.

``` 
`pubnub.fetchMessages(  
    channels: ListString>,  
    page: PNBoundedPage,  
    includeMeta: Boolean,  
    includeMessageAction: Boolean,  
    includeMessageType: Boolean,  
    includeCustomMessageType: Boolean,  
).async { result -> }  
`
```

Parameter | Type | Default | Notes
--------- | ---- | ------- | -----
channels* | `List<String>` | — | Up to 500 channels (100 msgs max on 1 channel, 25 msgs/channel on multi-channel).
page* | `PNBoundedPage` | — | `limit`, `start`, `end`.
includeMeta | `Boolean` | `false` | Include message metadata.
includeMessageAction | `Boolean` | `false` | If `true`, only one channel allowed.
includeMessageType | `Boolean` | `true` | Include `messageType`.
includeCustomMessageType | `Boolean` | `false` | Include custom type.

Return:
* `channels : HashMap<String, List<PNFetchMessageItem>>`
* `page : PNBoundedPage?` (pass to next call to page)

`PNFetchMessageItem`  
• `message : JsonElement`  
• `timetoken : Long`  
• `meta : JsonElement?`  
• `actions : Map<String, HashMap<String, List<Action>>>?`  
• `customMessageType : String`

`Action` → `uuid : String`, `actionTimetoken : String`

``` 
`  
`
```

Paging example:

``` 
`  
`
```

---

## Delete Messages - `deleteMessages()`

Requires Message Persistence, secret key, and “Enable Delete-From-History” in Admin Portal.

``` 
`pubnub.deleteMessages(  
    channels:P ListString>,  
    start: Long,  
    end: Long  
).async { result -> }  
`
```

Parameter | Type | Notes
--------- | ---- | -----
channels* | `List<String>` | Channels to purge.
start* | `Long` | Inclusive start timetoken.
end* | `Long` | Exclusive end timetoken.

``` 
`  
`
```

Delete a single message (publish TT = `15526611838554310`):

``` 
`  
`
```

---

## Message Counts - `messageCounts()`

Requires Message Persistence. For Unlimited retention, only last 30 days are counted.

``` 
`pubnub.messageCounts(  
    channels: ListString>,  
    channelsTimetoken: ListLong>  
).async { result -> }  
`
```

Parameter | Type | Notes
--------- | ---- | -----
channels* | `List<String>` | Channels to query.
channelsTimetoken* | `List<Long>` | One TT for all channels, or one-to-one mapping.

Return: `Map<String, Long>` (0–10 000 per channel).

``` 
`  
`
```

---

## History (deprecated) - `history()`

Use `fetchMessages()` instead.

``` 
`pubnub.history(  
    channel: String,  
    reverse: Boolean,  
    includeTimetoken: Boolean,  
    includeMeta: Boolean,  
    start: Long,  
    end: Long,  
    count: Int  
).async { result ->  }  
`
```

Parameter | Type | Default | Notes
--------- | ---- | ------- | -----
channel* | `String` | — | Single channel only.
reverse | `Boolean` | `false` | `true` = oldest→newest.
includeTimetoken | `Boolean` | `false` |
includeMeta | `Boolean` | `false` |
start | `Long` | — | Exclusive.
end | `Long` | — | Inclusive.
count | `Int` | `100` | Max 100.

Return `PNHistoryResult`  
• `messages : List<PNHistoryItemResult>`  
• `startTimetoken : Long`  
• `endTimetoken : Long`

`PNHistoryItemResult` → `timetoken : Long?`, `entry : JsonElement`, `meta : JsonElement?`

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
``` 
`**`
```

_Last updated Jun 10 2025_