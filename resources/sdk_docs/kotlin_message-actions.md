# Message Actions API for Kotlin SDK

## Breaking changes in v9.0.0
v9.0.0 unifies Kotlin and Java SDKs, introduces a new client instantiation model, and changes async callbacks/status events. Review the Java/Kotlin SDK migration guide before upgrading.

## Request execution
All API calls return an Endpoint; invoke `.sync()` or `.async()` to execute.

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

## Message Actions vs. Message Reactions
Message Actions is the low-level API for attaching metadata (receipts, custom data, etc.). When used for emoji/social reactions, it’s referred to as Message Reactions.

---

## Add Message Reaction  
Requires Message Persistence to be enabled.

### Method
```
`pubnub.addMessageAction(  
    channel: String,  
    messageAction: PNMessageAction  
).async { result -> }  
`
```

### Parameters  
• `channel: String` – Target channel.  
• `messageAction: PNMessageAction` – Contains `type`, `value`, and original message `messageTimetoken`.

### Returns (`PNAddMessageActionResult`)
• `type: String` – Action type.  
• `value: String` – Action value.  
• `uuid: String` – Publisher UUID.  
• `actionTimetoken: String` – Action creation timetoken.  
• `messageTimetoken: Long` – Original message timetoken.

### PNMessageAction
• `type: String`  
• `value: String`  
• `messageTimetoken: Long`

##### Sample code
```
`  
`
```

---

## Remove Message Reaction  
Requires Message Persistence.

### Method
```
`pubnub.removeMessageAction(  
    channel: String,  
    messageTimetoken: Long,  
    actionTimetoken: Long  
).async { result -> }  
`
```

### Parameters  
• `channel: String` – Channel name.  
• `messageTimetoken: Long` – Original message timetoken.  
• `actionTimetoken: Long` – Timetoken of the action to remove.

### Returns  
No actionable data (empty response).

##### Sample code
```
`  
`
```

---

## Get Message Reactions  
Requires Message Persistence.

### Method
```
`pubnub.getMessageActions(  
    channel: String,  
    page: PNBoundedPage  
)`  
```

### Parameters  
• `channel: String` – Channel to query.  
• `page: PNBoundedPage` – Pagination object (`limit` ≤ 100, `start`, `end`).

### Returns (`PNGetMessageActionsResult?`)
• `type: String`  
• `value: String`  
• `uuid: String`  
• `actionTimetoken: String`  
• `messageTimetoken: Long`  
• `page: PNBoundedPage?` – Indicates additional data availability.

##### Sample code
```
`  
`
```

---

## Other examples

#### Fetch messages with paging
```
`**`
```

_Last updated: Jul 15, 2025_