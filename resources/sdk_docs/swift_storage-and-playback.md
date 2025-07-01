# Message Persistence API – Swift SDK (Storage & Playback)

PubNub stores every published message (AES-256 optional) and timestamps it to 10 ns.  
Retention options: 1 day · 7 days · 30 days · 3 months · 6 months · 1 year · Unlimited.

Available history endpoints:
• Fetch History (messages, reactions, file events)  
• Delete Messages from History  
• Message Counts  

> All methods require Message Persistence to be enabled for the key in the Admin Portal.

---

## Fetch History

Maximum returned: 100 msgs (single channel) / 25 msgs (multi-channel ≤ 500).  
Iterate using the `next` page object when more data is available.

### Method

```swift
func fetchMessageHistory(
    for channels: [String],
    includeActions actions: Bool = false,
    includeMeta: Bool = false,
    includeUUID: Bool = true,
    includeMessageType: Bool = true,
    includeCustomMessageType: Bool = false,
    page: PubNubBoundedPage? = PubNubBoundedPageBase(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(messagesByChannel: [String: [PubNubMessage]],
                           next: PubNubBoundedPage?), Error>) -> Void)?
)
```

Parameters  
• `channels` [String] – up to 500 channels.  
• `includeActions` Bool – include Message Actions; must be single channel when `true`.  
• `includeMeta` Bool – include message `meta`.  
• `includeUUID` Bool – include publisher UUID.  
• `includeMessageType` Bool – include PubNub message type.  
• `includeCustomMessageType` Bool – include custom message type.  
• `page` PubNubBoundedPage – pagination (`limit` ≤ 100 single/25 multi).  
• `custom` RequestConfiguration – per-request config.  
• `completion` – async result.

Truncated responses return a `next` page object; call again with provided bounds.

### Result Types

```swift
public protocol PubNubMessage {
  var payload: JSONCodable { get set }
  var actions: [PubNubMessageAction] { get set }
  var publisher: String? { get set }
  var channel: String { get }
  // …
}

public protocol PubNubBoundedPage {
  var start: Timetoken? { get }
  var end: Timetoken?  { get }
  var limit: Int?     { get }
}
```

### Examples

Retrieve the last message on a channel:

```
`  
`
```

Retrieve messages ≥ specific timetoken:

```
`  
`
```

Retrieve messages < a timetoken:

```
`  
`
```

Last 10 messages on multiple channels:

```
`  
`
```

Messages with metadata:

```
`  
`
```

Messages with Message Action data:

```
`  
`
```

---

## Delete Messages from History

Requires “Enable Delete-From-History” and initialization with the secret key.

### Method

```swift
func deleteMessageHistory(
    from channel: String,
    start: Timetoken? = nil,
    end: Timetoken? = nil,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<Void, Error>) -> Void)?
)
```

Parameters  
• `channel` String – channel to delete from.  
• `start` Timetoken? – inclusive begin of range.  
• `end` Timetoken? – exclusive end of range.  
• `custom` RequestConfiguration – per-request config.  
• `completion` – async result.

### Examples

```
`  
`
```

Delete a specific message:

```
`  
`
```

---

## Message Counts

Returns number of messages published since a given timetoken (30-day window for unlimited retention keys).

### Methods

```swift
func messageCounts(
    channels: [String: Timetoken],
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String: Int], Error>) -> Void)?
)
```

```swift
func messageCounts(
    channels: [String],
    timetoken: Timetoken = 1,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String: Int], Error>) -> Void)?
)
```

Parameters  
• `channels` – map `[channel: timetoken]` or `[channel]`.  
• `timetoken` – single timetoken for all channels (second overload).  
• `custom` – per-request config.  
• `completion` – async result.

### Examples

```
`  
`
```

Counts for multiple channels (same timetoken):

```
`  
`
```

Counts for multiple channels (different timetokens):

```
`**`
```

_Last updated Jun 12 2025_