# Mobile Push Notifications API – Swift SDK (mobile-push)

Requires Mobile Push Notifications add-on (enable in Admin Portal).

---

## APNs2 (HTTP/2) – Recommended

### Add Device to APNs2 Channels
```swift
`func addAPNSDevicesOnChannels(  
    _ additions: [String],  
    device token: Data,  
    on topic: String,  
    environment: PubNub.PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)`  
```
Parameters  
• additions `[String]` – channels to enable.  
• device `Data` – device token.  
• on `String` – APNs topic (bundle ID).  
• environment `PubNub.PushEnvironment` (default `.development`).  
• custom `PubNub.RequestConfiguration` (default `PubNub.RequestConfiguration()`).  
• completion `((Result<[String], Error>) -> Void)?`.

Result  
• Success: `[String]` channels enabled.  
• Failure: `Error`.

Example
```
`  
`
```

---

### List APNs2 Channels for Device
```swift
`func listAPNSPushChannelRegistrations(  
    for deviceToken: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)`  
```
Parameters  
• for `Data` – device token.  
• on `String` – APNs topic.  
• environment `PubNub.PushEnvironment` (default `.development`).  
• custom `PubNub.RequestConfiguration`.  
• completion `((Result<[String], Error>) -> Void)?`.

Result  
• Success: `[String]` channels.  
• Failure: `Error`.

Example
```
`  
`
```

---

### Remove Device from APNs2 Channels
```swift
`func removeAPNSDevicesOnChannels(  
    _ removals: [String],  
    device token: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)`  
```
Parameters  
• removals `[String]` – channels to disable.  
• device `Data` – device token.  
• on `String` – APNs topic.  
• environment `PubNub.PushEnvironment` (default `.development`).  
• custom `PubNub.RequestConfiguration`.  
• completion `((Result<[String], Error>) -> Void)?`.

Result  
• Success: `[String]` channels disabled.  
• Failure: `Error`.

Example
```
`  
`
```

---

### Remove Device from ALL APNs2 Channels
```swift
`func removeAllAPNSPushDevice(  
    for deviceToken: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)`  
```
Parameters  
• for `Data` – device token.  
• on `String` – APNs topic.  
• environment `PubNub.PushEnvironment` (default `.development`).  
• custom `PubNub.RequestConfiguration`.  
• completion `((Result<Void, Error>) -> Void)?`.

Result  
• Success: `Void`.  
• Failure: `Error`.

Example
```
`  
`
```

---

## Legacy Binary APNs (Deprecated)

### Add Device to Channels
```swift
`func addPushChannelRegistrations(  
    _ additions: [String],  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)`  
```
Parameters: additions `[String]`, for `Data`, of `PubNub.PushService` (default `.apns`), custom config, completion.

Example
```
`  
`
```

---

### List Channels for Device
```swift
`func listPushChannelRegistrations(  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)`  
```
Parameters: for `Data`, of `PubNub.PushService` (default `.apns`), custom config, completion.

Example
```
`  
`
```

---

### Remove Device from Channels
```swift
`removePushChannelRegistrations(  
    _ removals: [String],  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)`  
```
Parameters: removals `[String]`, for `Data`, of `PubNub.PushService`, custom config, completion.

Example
```
`  
`
```

---

### Remove Device from ALL Channels
```swift
`func removeAllPushChannelRegistrations(  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)`  
```
Parameters: for `Data`, of `PubNub.PushService`, custom config, completion.

Example
```
`**`
```

_Last updated: Jun 12, 2025_