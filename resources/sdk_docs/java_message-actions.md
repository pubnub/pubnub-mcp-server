# Message Actions API (Java SDK ≥ 9.0.0)

Message Actions (a.k.a. Message Reactions) let you attach metadata—emoji, receipts, custom data—to any published message. All operations require Message Persistence to be enabled for your key.

> v9.0.0 introduces unified Java/Kotlin codebases, a new client–instantiation pattern, and new async callbacks/status events. For details see the Java/Kotlin migration guide.

---

## Add Message Reaction

### Method

```
`this.pubnub.addMessageAction()  
    .channel(String)  
    .messageAction(PNMessageAction);  
`
```

Parameter | Type | Description
--- | --- | ---
channel | String | Channel to add the message action to.
messageAction | PNMessageAction | Contains type, value, and the original message’s publish timetoken.
async | Consumer<Result> | Consumer of `PNAddMessageActionResult`.

### Returns — PNAddMessageActionResult
Method | Type | Meaning
--- | --- | ---
getType() | String | Action type.
getValue() | String | Action value.
getUuid() | String | Publisher UUID.
getActionTimetoken() | Long | Creation timetoken of this action.
getMessageTimetoken() | Long | Original message timetoken.

### PNMessageAction (builder / setters)
Method | Type | Purpose
--- | --- | ---
setType() | String | Define action type.
setValue() | String | Define action value.
setMessageTimetoken() | Long | Timetoken of message the action refers to.

### Sample

```
`  
`
```

---

## Remove Message Reaction

### Method

```
`this.pubnub.removeMessageAction()  
    .channel(String)  
    .messageTimetoken(Long)  
    .actionTimetoken(Long);  
`
```

Parameter | Type | Description
--- | --- | ---
channel | String | Channel containing the action.
messageTimetoken | Long | Timetoken of the parent message.
actionTimetoken | Long | Timetoken of the action to remove.
async | Consumer<Result> | Consumer of `PNRemoveMessageActionResult`.

### Returns  
No payload (empty result).

### Sample

```
`  
`
```

---

## Get Message Reactions

### Method

```
`this.pubnub.getMessageActions()  
    .channel(String)  
    .start(Long)  
    .end(Long)  
    .limit(Integer);  
`
```

Parameter | Type | Default | Description
--- | --- | --- | ---
channel | String | — | Channel name.
start | Long | — | Return actions with timetoken < start.
end | Long | — | Return actions with timetoken ≥ end.
limit | Integer | 100 | Max 100 actions.
async | Consumer<Result> | — | Consumer of `PNGetMessageActionsResult`.

If results are truncated, a `more` object is returned; use its values for subsequent paged calls.

### Returns — PNGetMessageActionsResult list
Same getters as `PNAddMessageActionResult` (type, value, uuid, actionTimetoken, messageTimetoken).

### Sample

```
`  
`
```

---

## Other Examples

```
`**`
```

_Last updated Jul 15 2025_