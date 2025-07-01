# Message Actions API (Kotlin SDK)

## Breaking changes in v9.0.0
• Kotlin and Java SDKs merged.  
• New client instantiation, new async callbacks, different status events.  
See the Java/Kotlin migration guide for details.

## Request execution
Every SDK call returns an `Endpoint`. **Always finish with `.sync()` or `.async {}`**.

```kotlin
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { ex -> /* error */ }  
          .onSuccess { /* success */ }  
}  
`
```

## Message Actions vs. Reactions
“Message Actions” = generic metadata (receipts, custom data).  
“Message Reactions” = using actions specifically for emoji reactions.  
Same API.

---

## Add Message Action (Requires Message Persistence)

### Method
```kotlin
`pubnub.addMessageAction(  
    channel: String,  
    messageAction: PNMessageAction  
).async { result -> }  
`
```

Parameters  
• `channel` (String) – target channel  
• `messageAction` (PNMessageAction) – see structure below

### Returns
`PNAddMessageActionResult`  
• `type` (String)  
• `value` (String)  
• `uuid` (String) – publisher  
• `actionTimetoken` (String) – action creation time  
• `messageTimetoken` (Long) – original message time

### PNMessageAction
• `type` (String)  
• `value` (String)  
• `messageTimetoken` (Long)

#### Basic usage
```kotlin
`  
`
```

---

## Remove Message Action (Requires Message Persistence)

### Method
```kotlin
`pubnub.removeMessageAction(  
    channel: String,  
    messageTimetoken: Long,  
    actionTimetoken: Long  
).async { result -> }  
`
```

Parameters  
• `channel` (String) – channel name  
• `messageTimetoken` (Long) – original message time  
• `actionTimetoken` (Long) – action time

Returns: empty (success/error only)

#### Basic usage
```kotlin
`  
`
```

---

## Get Message Actions (Requires Message Persistence)

### Method
```kotlin
`pubnub.getMessageActions(  
    channel: String,  
    page: PNBoundedPage  
)  
`
```

Parameters  
• `channel` (String)  
• `page` (PNBoundedPage) – pagination; `limit` <= 100, `start`, `end`

### Returns
List<PNGetMessageActionsResult?>

Each item:  
• `type` (String)  
• `value` (String)  
• `uuid` (String)  
• `actionTimetoken` (String)  
• `messageTimetoken` (Long)  
• `page` (PNBoundedPage) – non-null when more data is available

#### Basic usage
```kotlin
`  
`
```

---

## Other example
```kotlin
`**`
```

_Last updated: Jun 10 2025_