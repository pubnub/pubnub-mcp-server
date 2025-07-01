# Channel Groups – Swift SDK

Channel groups bundle many channels under one name.  
All operations below require the **Stream Controller** add-on (enable in the Admin Portal).  
You can **subscribe** to a channel group but **cannot publish** to it.

---

## Add Channels to a Group
Maximum 200 channels per call.
```swift
func add(
    channels: [String],
    to group: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?
)
```
Parameters  
• `channels` \[String] – List of channels to add (required).  
• `to` String – Channel-group name (required).  
• `custom` PubNub.RequestConfiguration – Per-request config (optional).  
• `completion` – Async `Result`; default `nil`.

Completion result  
• Success: `(group, channels)` tuple.  
• Failure: `Error`.

Reference code
```
`  
`
```

---

## List Channels in a Group
```swift
func listChannels(
    for group: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?
)
```
Parameters  
• `for` String – Channel-group name (required).  
• `custom` PubNub.RequestConfiguration (optional).  
• `completion` – Async `Result`; default `nil`.

Completion result  
• Success: `(group, channels)` tuple.  
• Failure: `Error`.

Reference code
```
`  
`
```

---

## Remove Channels from a Group
```swift
func remove(
    channels: [String],
    from group: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?
)
```
Parameters  
• `channels` \[String] – Channels to remove (required).  
• `from` String – Channel-group name (required).  
• `custom` PubNub.RequestConfiguration (optional).  
• `completion` – Async `Result`; default `nil`.

Completion result  
• Success: `(group, channels)` tuple.  
• Failure: `Error`.

Reference code
```
`  
`
```

---

## List All Channel Groups
```swift
func listChannelGroups(
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String], Error>) -> Void)?
)
```
Parameters  
• `custom` PubNub.RequestConfiguration (optional).  
• `completion` – Async `Result`; default `nil`.

Completion result  
• Success: `[String]` (all group names).  
• Failure: `Error`.

Reference code
```
`  
`
```

---

## Delete a Channel Group
```swift
func remove(
    channelGroup: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<String, Error>) -> Void)?
)
```
Parameters  
• `channelGroup` String – Group name to delete (required).  
• `custom` PubNub.RequestConfiguration (optional).  
• `completion` – Async `Result`; default `nil`.

Completion result  
• Success: `String` (deleted group).  
• Failure: `Error`.

Reference code
```
`**`
```

_Last updated: Jun 12 2025_