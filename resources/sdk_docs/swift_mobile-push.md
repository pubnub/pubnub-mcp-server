# Mobile Push Notifications API – Swift SDK (mobile-push)

Mobile Push Notifications let you register Apple APNs (HTTP/2) or legacy APNs/FCM tokens directly with PubNub—no extra server required.  
The Mobile Push Notifications add-on must be enabled for your PubNub keys (Admin Portal).

---

## APNs2 (HTTP/2) – Recommended

### Add device to APNs2 channels

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
* `_ additions` [String] – channels to enable.  
* `device token` Data – APNs device token.  
* `on topic` String – APNs topic (bundle ID).  
* `environment` PubNub.PushEnvironment (.development | .production).  
* `custom requestConfig` PubNub.RequestConfiguration – per-request overrides.  
* `completion` ((Result<[String],Error>) -> Void)? – async result.

Success → `[String]` channels enabled.  
Failure → `Error`.

Sample

```
`  
`
```

---

### List APNs2 channels for device

```swift
`func listAPNSPushChannelRegistrations(  
    for deviceToken: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)` 
```

Same parameter meanings as above (replace `_ additions` with `for deviceToken`).  
Success → `[String]` channels registered; Failure → `Error`.

Sample

```
`  
`
```

---

### Remove device from APNs2 channels

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

`_ removals` – channels to disable.  
Other parameters/return identical to Add.

Sample

```
`  
`
```

---

### Remove device from all APNs2 channels

```swift
`func removeAllAPNSPushDevice(  
    for deviceToken: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)` 
```

Success → `Void`; Failure → `Error`.

Sample

```
`  
`
```

---

## Legacy Binary APNs / FCM (Deprecated)

Use only when the newer APNs2 interface isn’t possible.

### Add device to channels

```swift
`func addPushChannelRegistrations(  
    _ additions: [String],  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)` 
```

Sample

```
`  
`
```

---

### List channels for device

```swift
`func listPushChannelRegistrations(  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)` 
```

Sample

```
`  
`
```

---

### Remove device from channels

```swift
`removePushChannelRegistrations(  
    _ removals: [String],  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)` 
```

Sample

```
`  
`
```

---

### Remove device from all channels

```swift
`func removeAllPushChannelRegistrations(  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)` 
```

Sample

```
`**`
```

_Last updated: Jul 15 2025_