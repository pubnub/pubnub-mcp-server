# Message Actions API – Swift SDK (Condensed)

Message Actions let you attach metadata (reactions, receipts, custom data) to published messages.  
All methods require Message Persistence to be enabled for your key in the Admin Portal.

---

## Add Message Action

```swift
`func addMessageAction(  
    channel: String,  
    type actionType: String,  
    value: String,  
    messageTimetoken: Timetoken,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubMessageAction, Error>) -> Void)?  
)  
`
```

Parameters  
• `channel` (String) – Target channel  
• `actionType` (String) – Action type  
• `value` (String) – Action value  
• `messageTimetoken` (Timetoken) – Parent message timetoken  
• `requestConfig` (RequestConfiguration, optional) – Per-request overrides  
• `completion` (Result<PubNubMessageAction, Error>, optional)

Success: returns the added `PubNubMessageAction`.  
Failure: returns `Error`.

```swift
`public protocol PubNubMessageAction {  
  
  /// The type of action  
  var actionType: String { get }  
  
  /// The value that corresponds to the type  
  var actionValue: String { get }  
  
  /// The `Timetoken` for this specific action  
  var actionTimetoken: Timetoken { get }  
  
  /// The `Timetoken` for the message this action relates to  
  var messageTimetoken: Timetoken { get }  
  
  /// The publisher of the message action  
`
```

Example

```swift
`  
`
```

---

## Remove Message Action

```swift
`func removeMessageActions(  
    channel: String,  
    message timetoken: Timetoken,  
    action actionTimetoken: Timetoken,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?  
)  
`
```

Parameters  
• `channel` (String) – Target channel  
• `timetoken` (Timetoken) – Parent message timetoken  
• `actionTimetoken` (Timetoken) – Action timetoken to remove  
• `requestConfig` (RequestConfiguration, optional)  
• `completion` (Result<(channel, message, action), Error>, optional)

Success: tuple `(channel, message Timetoken, action Timetoken)`  
Failure: `Error`

Example

```swift
`  
`
```

---

## Get Message Actions

Returns actions for a channel, sorted ascending by `actionTimetoken`.  
Large responses may be truncated; use the returned `PubNubBoundedPage` to paginate.

```swift
`func fetchMessageActions(  
    channel: String,  
    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(actions: [PubNubMessageAction], next: PubNubBoundedPage?), Error>) -> Void)?  
)  
`
```

Parameters  
• `channel` (String) – Target channel  
• `page` (PubNubBoundedPage?, default `PubNubBoundedPageBase()`) – Pagination  
• `requestConfig` (RequestConfiguration, optional)  
• `completion` (Result<(actions, nextPage), Error>, optional)

Success: `[PubNubMessageAction]` and optional next page.  
Failure: `Error`.

```swift
`public protocol PubNubMessageAction {  
  
  /// The type of action  
  var actionType: String { get }  
  
  /// The value that corresponds to the type  
  var actionValue: String { get }  
  
  /// The `Timetoken` for this specific action  
  var actionTimetoken: Timetoken { get }  
  
  /// The `Timetoken` for the message this action relates to  
  var messageTimetoken: Timetoken { get }  
  
  /// The publisher of the message action  
`
```

```swift
`public protocol PubNubBoundedPage {  
  
  /// The start value for the next set of remote data  
  var start: Timetoken? { get }  
  
  /// The bounded end value that will be eventually fetched to  
  var end: Timetoken? { get }  
  
  /// The previous limiting value (if any)  
  var limit: Int? { get }  
}  
`
```

Example

```swift
`**`
```

_Last updated Jun 12 2025_