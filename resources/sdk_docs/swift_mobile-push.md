# Mobile Push Notifications API for Swift Native SDK (Condensed)

Connect PubNub publishing to APNs (Apple Push Notification service) and FCM for mobile push.

Prerequisite
- Requires Mobile Push Notifications add-on enabled for your key in the Admin Portal: https://admin.pubnub.com/
- Learn more: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-
- Overview: /docs/general/push/send

## Add a device to APNs2 channels

Enable APNs2 mobile push notifications on a set of channels.

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

Parameters
- _: Type: Data, Default: n/a — Channels to add for the device.
- device: Type: Data, Default: n/a — Device token.
- on: Type: String, Default: n/a — APNs topic (bundle identifier).
- environment: Type: PubNub.PushEnvironment, Default: .development — APNs environment.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Array of channels added for the device token.
- Failure: Error.

### Sample code

#### Adding device to channel
```
1
  
```

## List APNs2 channels for a device

List channels with APNs2 push enabled for a device token and topic.

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

Parameters
- for: Type: Data, Default: n/a — Device token.
- on: Type: String, Default: n/a — APNs topic (bundle identifier).
- environment: Type: PubNub.PushEnvironment, Default: .development — APNs environment.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Array of channels for the device token.
- Failure: Error.

### Sample code

#### List APNs2 channels for device
```
1
  
```

## Remove a device from APNs2 channels

Disable APNs2 mobile push notifications on a set of channels.

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

Parameters
- _: Type: Data, Default: n/a — Channels to remove for the device.
- device: Type: Data, Default: n/a — Device token.
- on: Type: String, Default: n/a — APNs topic (bundle identifier).
- environment: Type: PubNub.PushEnvironment, Default: .development — APNs environment.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Array of channels disabled for the device token.
- Failure: Error.

### Sample code

#### Remove device from channel
```
1
  
```

## Remove a device from all APNs2 channels

Disable APNs2 push notifications for all channels registered to the device token.

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

Parameters
- for: Type: Data, Default: n/a — The device token used during registration.
- on: Type: String, Default: n/a — APNs topic (typically the app bundle ID).
- environment: Type: PubNub.PushEnvironment, Default: .development — APS environment.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration (see: /docs/sdks/swift/api-reference/configuration#request-configuration).
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Void.
- Failure: Error.

### Sample code

#### Remove all mobile push notifications
```
1
  
```

## Add device to channel (deprecated)

Enable mobile push notifications on channels (legacy binary APNs). Prefer APNs2 methods.

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

Parameters
- _: Type: [String], Default: n/a — Channels to add.
- for: Type: Data, Default: n/a — Device token.
- of: Type: PubNub.PushService, Default: .apns — Remote Notification service type.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Array of channels added for the device token.
- Failure: Error.

### Sample code

#### Add device to channel
```
1
  
```

## List channels for device (deprecated)

List channels with push enabled for the device token (legacy binary APNs). Prefer APNs2 methods.

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

Parameters
- for: Type: Data, Default: n/a — Device token.
- of: Type: PubNub.PushService, Default: .apns — Remote Notification service type.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Array of channels for the device token.
- Failure: Error.

### Sample code

#### Listing channels for device
```
1
  
```

## Remove device from channel (deprecated)

Disable mobile push notifications on specified channels (legacy binary APNs). Prefer APNs2 methods.

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

Parameters
- _: Type: [String], Default: n/a — Channels to remove.
- for: Type: Data, Default: n/a — Device token.
- of: Type: PubNub.PushService, Default: .apns — Remote Notification service type.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<[String], Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Array of channels removed for the device token.
- Failure: Error.

### Sample code

#### Remove device from channel
```
1
  
```

## Remove all mobile push notifications (deprecated)

Disable mobile push notifications from all channels registered with the device token (legacy binary APNs). Prefer APNs2 methods.

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

Parameters
- for: Type: Data, Default: n/a — Device token.
- of: Type: PubNub.PushService, Default: .apns — Remote Notification service type.
- custom: Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration() — Per-request configuration.
- completion: Type: ((Result<Void, Error>) -> Void)?, Default: nil — Async result callback.

Completion handler result
- Success: Void.
- Failure: Error.

### Sample code

#### Remove all mobile push notifications
```
1
**
```

Last updated on Oct 29, 2025**