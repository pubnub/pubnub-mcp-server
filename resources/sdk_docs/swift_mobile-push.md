# Mobile Push Notifications API for Swift Native SDK

Connect PubNub publishing to third-party push services: Apple iOS APNs (HTTP/2) and Google Android FCM.

Prerequisite: Enable the Mobile Push Notifications add-on for your key in the Admin Portal. See how to enable add-on features.

To learn more, read about Mobile Push Notifications.

## Add a device to APNs2 channels

Enable APNs2 push notifications for a set of channels.

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
- additions (_) — Type: [String], Default: n/a. Channels to add for the device.
- device (token) — Type: Data, Default: n/a. Device token.
- on (topic) — Type: String, Default: n/a. APNs topic (bundle identifier).
- environment — Type: PubNub.PushEnvironment, Default: .development. APNs environment.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
- Failure: Error describing the failure.

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
- for (deviceToken) — Type: Data, Default: n/a. Device token.
- on (topic) — Type: String, Default: n/a. APNs topic (bundle identifier).
- environment — Type: PubNub.PushEnvironment, Default: .development. APNs environment.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Array of channels registered for the device token.
- Failure: Error describing the failure.

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
- removals (_) — Type: [String], Default: n/a. Channels to remove for the device.
- device (token) — Type: Data, Default: n/a. Device token.
- on (topic) — Type: String, Default: n/a. APNs topic (bundle identifier).
- environment — Type: PubNub.PushEnvironment, Default: .development. APNs environment.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Array of channels disabled for the device token.
- Failure: Error describing the failure.

### Sample code

#### Remove device from channel

```
1
  

```

## Remove a device from all APNs2 channels

Disable APNs2 push notifications from all channels registered for the device token.

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
- for (deviceToken) — Type: Data, Default: n/a. Device token used during registration.
- on (topic) — Type: String, Default: n/a. Topic of the remote notification (typically the app bundle ID).
- environment — Type: PubNub.PushEnvironment, Default: .development. APNs environment.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<Void, Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Void indicating success.
- Failure: Error describing the failure.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

## Add device to channel (deprecated)

Enable push notifications on provided channels for legacy binary APNs interface. Use APNs2 methods above instead.

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
- additions (_) — Type: [String], Default: n/a. Channels to add the device registration to.
- for (deviceToken) — Type: Data, Default: n/a. Device token.
- of (pushType) — Type: PubNub.PushService, Default: .apns. Remote Notification service type.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
- Failure: Error describing the failure.

### Sample code

#### Add device to channel

```
1
  

```

## List channels for device (deprecated)

Request all channels with push enabled for the specified device token for legacy binary APNs interface. Use APNs2 methods above instead.

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
- for (deviceToken) — Type: Data, Default: n/a. Device token.
- of (pushType) — Type: PubNub.PushService, Default: .apns. Remote Notification service type.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
- Failure: Error describing the failure.

### Sample code

#### Listing channels for device

```
1
  

```

## Remove device from channel (deprecated)

Disable push notifications on provided channels for legacy binary APNs interface. Use APNs2 methods above instead.

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
- removals (_) — Type: [String], Default: n/a. Channels to remove the device registration from.
- for (deviceToken) — Type: Data, Default: n/a. Device token.
- of (pushType) — Type: PubNub.PushService, Default: .apns. Remote Notification service type.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Array of channels updated for the device token.
- Failure: Error describing the failure.

### Sample code

#### Remove device from channel

```
1
  

```

## Remove all mobile push notifications (deprecated)

Disable push notifications from all channels registered with the specified device token for legacy binary APNs interface. Use APNs2 methods above instead.

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
- for (deviceToken) — Type: Data, Default: n/a. Device token.
- of (pushType) — Type: PubNub.PushService, Default: .apns. Remote Notification service type.
- custom (requestConfig) — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<Void, Error>) -> Void)?, Default: nil. Async result callback.

#### Completion handler result

- Success: Void indicating success.
- Failure: Error describing the failure.

### Sample code

#### Remove all mobile push notifications

```
1
**
```