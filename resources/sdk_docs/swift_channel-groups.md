# Channel Groups API – Swift SDK

Note: All channel-group endpoints require the *Stream Controller* add-on (enable in the Admin Portal).  
You can’t publish directly to a channel group—publish to each channel instead.

---

## Add Channels

```swift
func add(
    channels: [String],
    to group: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?
)
```

• Up to 200 channels per call  
• `channels` – list to add  
• `group` – channel-group name  
• `custom` – per-request configuration  
• `completion` – async result  
  – Success: `(group, channels)`  
  – Failure: `Error`

Sample

```
`  
`
```

---

## List Channels

```swift
func listChannels(
    for group: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?
)
```

Parameters/Result:  
• `group` – channel-group name  
• `custom` – per-request configuration  
• `completion` – async result  
  – Success: `(group, channels)`  
  – Failure: `Error`

Sample

```
`  
`
```

---

## Remove Channels

```swift
func remove(
    channels: [String],
    from group: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?
)
```

• `channels` – list to remove  
• `group` – channel-group name  
• `custom` – per-request configuration  
• `completion` – async result  
  – Success: `(group, channels)`  
  – Failure: `Error`

Sample

```
`  
`
```

---

## List Channel Groups

```swift
func listChannelGroups(
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String], Error>) -> Void)?
)
```

• `custom` – per-request configuration  
• `completion` – async result  
  – Success: `[String]` (group names)  
  – Failure: `Error`

Sample

```
`  
`
```

---

## Delete Channel Group

```swift
func remove(
    channelGroup: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<String, Error>) -> Void)?
)
```

• `channelGroup` – name to delete  
• `custom` – per-request configuration  
• `completion` – async result  
  – Success: `String` (deleted group)  
  – Failure: `Error`

Sample

```
`**`
```

_Last updated: Jul 15, 2025_