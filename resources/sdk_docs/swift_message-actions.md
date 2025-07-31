# Message Actions API – Swift SDK (condensed)

All Message Actions methods require **Message Persistence** to be enabled on your PubNub keys.

## Message Actions vs. Message Reactions
“Message Reactions” is simply Message Actions used for emoji/social reactions—the API is identical.

---

## Add Message Reaction

### Method
```
`func addMessageAction(  
    channel: String,  
    type actionType: String,  
    value: String,  
    messageTimetoken: Timetoken,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubMessageAction, Error>) -> Void)?  
)`
```

### Parameters  
* `channel` (String) – target channel  
* `actionType` (String) – message-action type  
* `value` (String) – message-action value  
* `messageTimetoken` (Timetoken) – timetoken of the parent message  
* `custom` (PubNub.RequestConfiguration) – per-request config (optional)  
* `completion` (Result<PubNubMessageAction, Error>) – async result (optional)

### Completion  
Success: returns the added `PubNubMessageAction`.  
Failure: `Error`.

```
`public protocol PubNubMessageAction {  
  var actionType: String { get }  
  var actionValue: String { get }  
  var actionTimetoken: Timetoken { get }  
  var messageTimetoken: Timetoken { get }  
  /// ...  
}`
```

Sample:
```
`  
`
```

---

## Remove Message Reaction

### Method
```
`func removeMessageActions(  
    channel: String,  
    message timetoken: Timetoken,  
    action actionTimetoken: Timetoken,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?  
)`
```

### Parameters  
* `channel` (String) – target channel  
* `message` (Timetoken) – parent message timetoken  
* `action` (Timetoken) – action timetoken to remove  
* `custom` (RequestConfiguration) – per-request config (optional)  
* `completion` (Result<(channel,message,action), Error>) – async result (optional)

Completion  
• Success: tuple `(channel, message, action)` for the removed action.  
• Failure: `Error`.

```
`  
`
```

---

## Get Message Reactions

Returns actions ordered by action timetoken (asc). Responses may be truncated; use the returned `more` parameters to paginate.

### Method
```
`func fetchMessageActions(  
    channel: String,  
    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(actions: [PubNubMessageAction], next: PubNubBoundedPage?), Error>) -> Void)?  
)`
```

### Parameters  
* `channel` (String) – target channel  
* `page` (PubNubBoundedPage?) – time-bounded pagination (optional)  
* `custom` (PubNub.RequestConfiguration) – per-request config (optional)  
* `completion` (Result<(actions,next), Error>) – async result (optional)

### Completion  
Success: `[PubNubMessageAction]` plus next `PubNubBoundedPage?`.  
Failure: `Error`.

```
`public protocol PubNubBoundedPage {  
  var start: Timetoken? { get }  
  var end: Timetoken? { get }  
  var limit: Int? { get }  
}`
```

```
`**`
```

_Last updated: Jul 15 2025_