# Mobile Push Notifications API for Swift Native SDK

Connect native PubNub publishing to third-party push services: Apple iOS APNs (HTTP/2) and Google Android FCM. Learn more: [Mobile Push Notifications](/docs/general/push/send).

Prerequisites
- Requires Mobile Push Notifications add-on enabled for your key in the Admin Portal: https://admin.pubnub.com/
- APNs2 requires an APNs topic (your app’s bundle identifier) and environment (.development or .production).
- Optional per-request configuration via PubNub.RequestConfiguration.

## Add a device to APNs2 channels

Enable APNs2 push notifications on a set of channels for a device token and topic.

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
- additions: [String] — Channels to add for the device.
- device token: Data — Device token.
- on topic: String — APNs topic (bundle identifier).
- environment: PubNub.PushEnvironment = .development — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? = nil — Async result callback.

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

Parameters
- for deviceToken: Data — Device token.
- on topic: String — APNs topic (bundle identifier).
- environment: PubNub.PushEnvironment = .development — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
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

Parameters
- removals: [String] — Channels to remove for the device.
- device token: Data — Device token.
- on topic: String — APNs topic (bundle identifier).
- environment: PubNub.PushEnvironment = .development — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Array of channels disabled for the device token.
- Failure: Error describing the failure.

### Sample code

#### Remove device from channel

```
1
  

```

## Remove a device from all APNs2 channels

Disable APNs2 push notifications from all channels registered for the specified device token.

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
- for deviceToken: Data — The device token used during registration.
- on topic: String — APNs topic (typically your app bundle ID).
- environment: PubNub.PushEnvironment = .development — APNs environment.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<Void, Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Void indicating success.
- Failure: Error describing the failure.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

## Add device to channel (deprecated)

Enable mobile push notifications on provided channels using legacy binary APNs interface. Prefer the APNs2 methods above.

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
- additions: [String] — Channels to add the device registration to.
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService = .apns — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
- Failure: Error describing the failure.

### Sample code

#### Add device to channel

```
1
  

```

## List channels for device (deprecated)

Request all channels with push enabled for the specified device token using legacy binary APNs interface. Prefer the APNs2 methods above.

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
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService = .apns — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
- Failure: Error describing the failure.

### Sample code

#### Listing channels for device

```
1
  

```

## Remove device from channel (deprecated)

Disable mobile push notifications on provided channels using legacy binary APNs interface. Prefer the APNs2 methods above.

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
- removals: [String] — Channels to remove the device registration from.
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService = .apns — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<[String], Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Array of channels added for the device token.
- Failure: Error describing the failure.

### Sample code

#### Remove device from channel

```
1
  

```

## Remove all mobile push notifications (deprecated)

Disable mobile push notifications from all channels registered with the specified device token using legacy binary APNs interface. Prefer the APNs2 methods above.

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
- for deviceToken: Data — Device token.
- of pushType: PubNub.PushService = .apns — Remote Notification service type.
- custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration.
- completion: ((Result<Void, Error>) -> Void)? = nil — Async result callback.

#### Completion handler result

- Success: Void indicating success.
- Failure: Error describing the failure.

### Sample code

#### Remove all mobile push notifications

```
1
**
```

Last updated on Oct 29, 2025**