# Mobile Push Notifications API for Swift Native SDK

Connect PubNub publishing to third-party push services: Apple iOS APNs (APNs2) and Google Android FCM.

Prerequisite: Enable the Mobile Push Notifications add-on for your keys in the Admin Portal.

## Add a device to APNs2 channels

Enable APNs2 push notifications on specific channels for a device token and topic.

### Method(s)

```
`1func addAPNSDevicesOnChannels(  
2    _ additions: [String],  
3    device token: Data,  
4    on topic: String,  
5    environment: PubNub.PushEnvironment = .development,  
6    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
7    completion: `((Result[String], Error>) -> Void)?`  
8)  
`
```

Parameters:
- additions: [String] — Channels to add for the device.
- device token: Data — Device token.
- on topic: String — APNs topic (bundle identifier).
- environment: PubNub.PushEnvironment (default: .development) — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Array of channels added for the device token.
- Failure: Error.

### Sample code

#### Adding device to channel

```
1
  

```

## List APNs2 channels for a device

List channels with APNs2 push notifications for a device token and topic.

### Method(s)

```
`1func listAPNSPushChannelRegistrations(  
2    for deviceToken: Data,  
3    on topic: String,  
4    environment: PushEnvironment = .development,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: `((Result[String], Error>) -> Void)?`  
7)  
`
```

Parameters:
- for deviceToken: Data — Device token.
- on topic: String — APNs topic (bundle identifier).
- environment: PubNub.PushEnvironment (default: .development) — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Array of channels for the device token.
- Failure: Error.

### Sample code

#### List APNs2 channels for device

```
1
  

```

## Remove a device from APNs2 channels

Disable APNs2 push notifications on a set of channels.

### Method(s)

```
`1func removeAPNSDevicesOnChannels(  
2    _ removals: [String],  
3    device token: Data,  
4    on topic: String,  
5    environment: PushEnvironment = .development,  
6    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
7    completion: `((Result[String], Error>) -> Void)?`  
8)  
`
```

Parameters:
- removals: [String] — Channels to remove for the device.
- device token: Data — Device token.
- on topic: String — APNs topic (bundle identifier).
- environment: PubNub.PushEnvironment (default: .development) — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Array of channels disabled for the device token.
- Failure: Error.

### Sample code

#### Remove device from channel

```
1
  

```

## Remove a device from all APNs2 channels

Disable APNs2 push notifications from all channels registered for a device token.

### Method(s)

```
`1func removeAllAPNSPushDevice(  
2    for deviceToken: Data,  
3    on topic: String,  
4    environment: PushEnvironment = .development,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((ResultVoid, Error>) -> Void)?  
7)  
`
```

Parameters:
- for deviceToken: Data — Device token used during registration.
- on topic: String — APNs topic (typically the app bundle ID).
- environment: PubNub.PushEnvironment (default: .development) — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<Void, Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Void.
- Failure: Error.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

## Add device to channel (deprecated)

Deprecated; use the APNs2 methods above. For legacy binary APNs interface only.

### Method(s)

```
`1func addPushChannelRegistrations(  
2    _ additions: [String],  
3    for deviceToken: Data,  
4    of pushType: PubNub.PushService = .apns,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: `((Result[String], Error>) -> Void)?`  
7)  
`
```

Parameters:
- additions: [String] — Channels to add.
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService (default: .apns) — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Array of channels added for the device token.
- Failure: Error.

### Sample code

#### Add device to channel

```
1
  

```

## List channels for device (deprecated)

Deprecated; use the APNs2 methods above. For legacy binary APNs interface only.

### Method(s)

```
`1func listPushChannelRegistrations(  
2    for deviceToken: Data,  
3    of pushType: PubNub.PushService = .apns,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: `((Result[String], Error>) -> Void)?`  
6)  
`
```

Parameters:
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService (default: .apns) — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Array of channels for the device token.
- Failure: Error.

### Sample code

#### Listing channels for device

```
1
  

```

## Remove device from channel (deprecated)

Deprecated; use the APNs2 methods above. For legacy binary APNs interface only.

### Method(s)

```
`1removePushChannelRegistrations(  
2    _ removals: [String],  
3    for deviceToken: Data,  
4    of pushType: PubNub.PushService = .apns,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: `((Result[String], Error>) -> Void)?`  
7)  
`
```

Parameters:
- removals: [String] — Channels to remove.
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService (default: .apns) — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Array of channels removed for the device token.
- Failure: Error.

### Sample code

#### Remove device from channel

```
1
  

```

## Remove all mobile push notifications (deprecated)

Deprecated; use the APNs2 methods above. For legacy binary APNs interface only.

### Method(s)

```
`1func removeAllPushChannelRegistrations(  
2    for deviceToken: Data,  
3    of pushType: PubNub.PushService = .apns,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((ResultVoid, Error>) -> Void)?  
6)  
`
```

Parameters:
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService (default: .apns) — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<Void, Error>) -> Void)? (default: nil) — Async result callback.

Completion:
- Success: Void.
- Failure: Error.

### Sample code

#### Remove all mobile push notifications

```
1
**
```