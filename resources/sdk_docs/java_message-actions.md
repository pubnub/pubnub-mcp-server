# Message Actions API – Java SDK (v9+)

*Requires Message Persistence to be enabled in the Admin Portal.*

v9.0.0 unified Java/Kotlin SDKs, changed client instantiation, async callbacks, and status events. See the migration guide for upgrading from < 9.0.0.

Message Actions let you attach arbitrary metadata (reactions, receipts, etc.) to existing messages and receive those events in real time or via history.

---

## Add Message Action

### Method

```
`this.pubnub.addMessageAction()  
    .channel(String)  
    .messageAction(PNMessageAction);  
`
```

### Parameters

* `channel` (String) – target channel.  
* `messageAction` (PNMessageAction) – object with `type`, `value`, and the original message’s publish `timetoken`.  
* `async` (Consumer<Result>) – callback returns `PNAddMessageActionResult`.

### Basic usage

```
`  
`
```

### Result (`PNAddMessageActionResult`)

* `getType()` → String – action type  
* `getValue()` → String – action value  
* `getUuid()` → String – publisher UUID  
* `getActionTimetoken()` → Long – action creation timetoken  
* `getMessageTimetoken()` → Long – original message timetoken  

#### PNMessageAction setters

* `setType(String)`  
* `setValue(String)`  
* `setMessageTimetoken(Long)`

---

## Remove Message Action

### Method

```
`this.pubnub.removeMessageAction()  
    .channel(String)  
    .messageTimetoken(Long)  
    .actionTimetoken(Long);  
`
```

### Parameters

* `channel` (String) – channel name  
* `messageTimetoken` (Long) – original message timetoken  
* `actionTimetoken` (Long) – timetoken of the action to remove  
* `async` (Consumer<Result>) – callback returns `PNRemoveMessageActionResult` (empty payload)

### Basic usage

```
`  
`
```

*No data is returned.*

---

## Get Message Actions

Returns actions ordered by `actionTimetoken` ascending. Responses may be truncated; when `more` is returned, re-query with provided values.

### Method

```
`this.pubnub.getMessageActions()  
    .channel(String)  
    .start(Long)  
    .end(Long)  
    .limit(Integer);  
`
```

### Parameters

* `channel` (String) – required  
* `start` (Long) – return actions with `timetoken` < start  
* `end` (Long) – return actions with `timetoken` ≥ end  
* `limit` (Integer, default/max 100) – number of actions  
* `async` (Consumer<Result>) – callback returns `PNGetMessageActionsResult`

### Basic usage

```
`  
`
```

### Result (`PNGetMessageActionsResult`)

* `getType()` → String  
* `getValue()` → String  
* `getUuid()` → String  
* `getActionTimetoken()` → Long  
* `getMessageTimetoken()` → Long  

---

### Other Example – Fetch Messages with paging

```
`**`
```

_Last updated: Jun 10, 2025_