# Message Persistence API – Swift SDK (Storage & Playback)

Message Persistence stores every published message (AES-256 optional) for 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or unlimited retention (configured per key).

Enable “Message Persistence” in the Admin Portal before using any of the APIs below.

---

## Fetch History

• Requires Message Persistence  
• `includeActions` = true limits the call to a single channel.  
• Limits: 100 msgs (single channel) or 25 msgs (multi-channel/up to 500).  
• Pagination: use the returned `next` (PubNubBoundedPage) to continue.  
• Timetoken rules:  
  – `start` only → messages older than `start`  
  – `end` only  → messages newer than or equal to `end`  
  – both         → between (inclusive of `end`)

### Method

```
`func fetchMessageHistory(  
    for channels: [String],  
    includeActions actions: Bool = false,  
    includeMeta: Bool = false,  
    includeUUID: Bool = true,  
    includeMessageType: Bool = true,  
    includeCustomMessageType: Bool = false,  
    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(messagesByChannel: [String: [PubNubMessage]], next: PubNubBoundedPage?), Error>) -> Void)?  
)  
`
```

Parameters  
• `for` [String] - channels (max 500).  
• `includeActions` Bool (default false) – include message actions.  
• `includeMeta` Bool (false) – include message metadata.  
• `includeUUID` Bool (true) – include sender ID.  
• `includeMessageType` Bool (true) – include PubNub message type.  
• `includeCustomMessageType` Bool (false) – include custom message type.  
• `page` PubNubBoundedPage? – pagination (`limit` ≤ 100, or 25 for multi-channel / includeActions).  
• `custom` PubNub.RequestConfiguration – per-call overrides.  
• `completion` Result<(messagesByChannel:[String:[PubNubMessage]], next:PubNubBoundedPage?)>.

#### Success Types

```
`public protocol PubNubMessage {  
  var payload: JSONCodable { get set }  
  var actions: [PubNubMessageAction] { get set }  
  var publisher: String? { get set }  
  var channel: String { get }  
  var subscription: String? { get }  
  var timetoken: Timetoken { get }  
  var messageType: PubNubMessageType? { get set }  
  var customMessageType: String? { get set }  
  var metadata: JSONCodable? { get set }  
}`  
```

```
`public protocol PubNubBoundedPage {  
  var start: Timetoken? { get }  
  var end: Timetoken?  { get }  
  var limit: Int?      { get }  
}`  
```

#### Failure

`Error`

### Sample code

```
`  
`
```

### Other examples

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
`  
`
```

---

## Delete Messages from History

• Requires Message Persistence enabled and “Delete-From-History” setting ON (Admin Portal).  
• Secret key required for initialization.

### Method

```
`func deleteMessageHistory(  
    from channel: String,  
    start: Timetoken? = nil,  
    end: Timetoken? = nil,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result<Void, Error>) -> Void)?  
)  
`
```

Parameters  
• `from` String – channel.  
• `start` Timetoken? – inclusive start (default nil).  
• `end` Timetoken? – exclusive end (default nil).  
• `custom` PubNub.RequestConfiguration.  
• `completion` Result<Void,Error>.

### Sample code

```
`  
`
```

### Other examples

```
`  
`
```

---

## Message Counts

Returns the number of messages published since a specified timetoken.  
For unlimited retention keys, only the last 30 days are evaluated.

### Methods

```
`func messageCounts(  
    channels: [String: Timetoken],  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result<[String: Int], Error>) -> Void)?  
)  
`
```

```
`func messageCounts(  
    channels: [String],  
    timetoken: Timetoken = 1,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result<[String: Int], Error>) -> Void)?  
)  
`
```

Parameters (both variants)  
• `channels` – list or map of channels.  
• `timetoken` / values in map – starting timetoken(s).  
• `custom` – PubNub.RequestConfiguration.  
• `completion` – Result<[String:Int],Error>.

#### Success

Dictionary `[channel: messageCount]`

#### Failure

`Error`

### Sample code

```
`  
`
```

### Other examples

```
`  
`
```
```
`**`
```

_Last updated Jul 15 2025_