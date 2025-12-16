# Mobile Push Notifications API for Swift Native SDK

Mobile Push Notifications connects PubNub publishing to third-party push services (Google Android **FCM** and Apple iOS **APNs**).

## Add a device to APNs2 channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Registers/enables **APNs2** push notifications for a device token on the specified channels.

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

**Parameters**
- `_` *(required, [String])*: Channels to add for the device.
- `device token` *(required, Data)*: Device token.
- `on` *(required, String)*: APNs topic (bundle identifier).
- `environment` *(PubNub.PushEnvironment, default `.development`)*: APNs environment.
- `custom requestConfig` *(PubNub.RequestConfiguration, default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async result callback.

**Completion handler result**
- **Success:** `[String]` channels added for the device token.
- **Failure:** `Error`.

### Sample code

##### Reference code
Self-contained runnable snippet with imports and console logging.

#### Adding device to channel

```
1
  

```

---

## List APNs2 channels for a device

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Lists channels with **APNs2** push enabled for the specified device token and topic.

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

**Parameters**
- `for deviceToken` *(required, Data)*: Device token.
- `on topic` *(required, String)*: APNs topic (bundle identifier).
- `environment` *(PubNub.PushEnvironment, default `.development`)*: APNs environment.
- `custom requestConfig` *(PubNub.RequestConfiguration, default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async result callback.

**Completion handler result**
- **Success:** `[String]` channels registered for the device token.
- **Failure:** `Error`.

### Sample code

#### List APNs2 channels for device

```
1
  

```

---

## Remove a device from APNs2 channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Disables **APNs2** push on the specified channels for the device token.

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

**Parameters**
- `_` *(required, [String])*: Channels to remove for the device.
- `device token` *(required, Data)*: Device token.
- `on topic` *(required, String)*: APNs topic (bundle identifier).
- `environment` *(PubNub.PushEnvironment, default `.development`)*: APNs environment.
- `custom requestConfig` *([PubNub.RequestConfiguration](/docs/sdks/swift/api-reference/configuration#request-configuration), default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async result callback.

**Completion handler result**
- **Success:** `[String]` channels disabled for the device token.
- **Failure:** `Error`.

### Sample code

#### Remove device from channel

```
1
  

```

---

## Remove a device from all APNs2 channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Disables **APNs2** push from **all** channels registered for the specified device token.

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

**Parameters**
- `for deviceToken` *(required, Data)*: The device token used during registration.
- `on topic` *(required, String)*: The remote notification topic (typically your app bundle ID).
- `environment` *(PubNub.PushEnvironment, default `.development`)*: APS environment.
- `custom requestConfig` *([PubNub.RequestConfiguration](/docs/sdks/swift/api-reference/configuration#request-configuration), default `PubNub.RequestConfiguration()`)*: Per-request customization of PubNub config/network session (see [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration)).
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async `Result` of the call.

**Completion handler result**
- **Success:** `Void`.
- **Failure:** `Error`.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

---

## Add device to channel (deprecated)

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Deprecated in favor of **APNs2 (HTTP/2)** methods above; use only for legacy **binary APNs** publishing.

#### Method(s)

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

**Parameters**
- `_` *(required, [String])*: Channels to add registration to.
- `for deviceToken` *(required, Data)*: Device token.
- `of pushType` *(PubNub.PushService, default `.apns`)*: Push service type.
- `custom requestConfig` *([PubNub.RequestConfiguration](/docs/sdks/swift/api-reference/configuration#request-configuration), default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async result.

**Completion handler result**
- **Success:** `[String]` channels added for the device token.
- **Failure:** `Error`.

#### Sample code

##### Add device to channel

```
1
  

```

---

## List channels for device (deprecated)

##### Requires Mobile Push Notifications add-on
Requires the add-on enabled in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Deprecated in favor of **APNs2 (HTTP/2)** methods above; use only for legacy **binary APNs** publishing.

#### Method(s)

```
`1func listPushChannelRegistrations(  
2    for deviceToken: Data,  
3    of pushType: PubNub.PushService = .apns,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: `((Result[String], Error>) -> Void)?`  
6)  
`
```

**Parameters**
- `for deviceToken` *(required, Data)*: Device token.
- `of pushType` *(PubNub.PushService, default `.apns`)*: Push service type.
- `custom requestConfig` *([PubNub.RequestConfiguration](/docs/sdks/swift/api-reference/configuration#request-configuration), default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async result callback.

**Completion handler result**
- **Success:** `[String]` channels registered for the device token.
- **Failure:** `Error`.

#### Sample code

##### Listing channels for device

```
1
  

```

---

## Remove device from channel (deprecated)

##### Requires Mobile Push Notifications add-on
Requires the add-on enabled in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Deprecated in favor of **APNs2 (HTTP/2)** methods above; use only for legacy **binary APNs** publishing.

#### Method(s)

To run `Removing Device From Channel` you can use the following method(s) in the Swift SDK:

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

**Parameters**
- `_` *(required, [String])*: Channels to remove registration from.
- `for deviceToken` *(required, Data)*: Device token.
- `of pushType` *(PubNub.PushService, default `.apns`)*: Push service type.
- `custom requestConfig` *([PubNub.RequestConfiguration](/docs/sdks/swift/api-reference/configuration#request-configuration), default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<[String], Error>) -> Void)?`, default `nil`)*: Async result.

**Completion handler result**
- **Success:** `[String]` channels added for notifications on a specific device token.
- **Failure:** `Error`.

#### Sample code

##### Remove device from channel

```
1
  

```

---

## Remove all mobile push notifications (deprecated)

##### Requires Mobile Push Notifications add-on
Requires the add-on enabled in the [Admin Portal](https://admin.pubnub.com/) (see [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).  
Deprecated in favor of **APNs2 (HTTP/2)** methods above; use only for legacy **binary APNs** publishing.

#### Method(s)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Swift SDK:

```
`1func removeAllPushChannelRegistrations(  
2    for deviceToken: Data,  
3    of pushType: PubNub.PushService = .apns,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((ResultVoid, Error>) -> Void)?  
6)  
`
```

**Parameters**
- `for deviceToken` *(required, Data)*: Device token.
- `of pushType` *(PubNub.PushService, default `.apns`)*: Push service type.
- `custom requestConfig` *([PubNub.RequestConfiguration](/docs/sdks/swift/api-reference/configuration#request-configuration), default `PubNub.RequestConfiguration()`)*: Per-request configuration.
- `completion` *(optional, `((Result<Void, Error>) -> Void)?`, default `nil`)*: Async result.

**Completion handler result**
- **Success:** `Void`.
- **Failure:** `Error`.

#### Sample code

##### Remove all mobile push notifications

```
1
**
```