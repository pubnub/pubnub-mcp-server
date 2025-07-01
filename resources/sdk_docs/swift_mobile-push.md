On this page
# Mobile Push Notifications API for Swift Native SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

## Add Device to APNs2 Channels[​](#add-device-to-apns2-channels)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable APNs2 mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to APNs2 Channel` you can use the following method(s) in the Swift SDK:

```
`func addAPNSDevicesOnChannels(  
    _ additions: [String],  
    device token: Data,  
    on topic: String,  
    environment: PubNub.PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`_` *Type: DataDefault:  
n/aThe list of channels to add the device registration to.`device` *Type: DataDefault:  
n/aThe device to add/remove from the channels.`on` *Type: StringDefault:  
n/aThe topic of the remote notification (which is typically the bundle ID for your app).`environment` *Type: `PubNub.PushEnvironment`Default:  
`.development`The APS environment to register the device.`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub Configuration or Network Session.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success)

An `Array` of channels added for notifications on a specific device token.

##### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Adding Device to Channel[​](#adding-device-to-channel)

```
`  
`
```

## List APNs2 Channels For Device[​](#list-apns2-channels-for-device)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which APNs2 push notification has been enabled using specified device token and topic.

### Method(s)[​](#methods-1)

To run `Listing APNs2 Channels For Device` you can use the following method(s) in the Swift SDK:

```
`func listAPNSPushChannelRegistrations(  
    for deviceToken: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`for` *Type: DataDefault:  
n/aThe device token used during registration.`on` *Type: StringDefault:  
n/aThe topic of the remote notification (which is typically the bundle ID for your app).`environment` *Type: PubNub.PushEnvironmentDefault:  
`.development`The APS environment to register the device.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-1)

##### Success[​](#success-1)

An `Array` of channels added for notifications on a specific device token.

##### Failure[​](#failure-1)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-1)

#### List APNs2 Channels For Device[​](#list-apns2-channels-for-device-1)

```
`  
`
```

## Remove Device From APNs2 Channel[​](#remove-device-from-apns2-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels.

### Method(s)[​](#methods-2)

To run `Removing Device From APNs2 Channel` you can use the following method(s) in the Swift SDK:

```
`func removeAPNSDevicesOnChannels(  
    _ removals: [String],  
    device token: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`_` *Type: DataDefault:  
n/aThe list of channels to disable registration.`device` *Type: DataDefault:  
n/aThe device to add/remove from the channels.`on` *Type: StringDefault:  
n/aThe topic of the remote notification (which is typically the bundle ID for your app).`environment` *Type: PubNub.PushEnvironmentDefault:  
`.development`The APS environment to register the device.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-2)

##### Success[​](#success-2)

An `Array` of channels disabled from notifications on a specific device token.

##### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel)

```
`  
`
```

## Remove all APNs2 mobile push notifications[​](#remove-all-apns2-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable APNs2 mobile push notifications from all channels which is registered with specified pushToken.

### Method(s)[​](#methods-3)

To run `Remove all APNs2 mobile push notifications` you can use the following method(s) in the Swift SDK:

```
`func removeAllAPNSPushDevice(  
    for deviceToken: Data,  
    on topic: String,  
    environment: PushEnvironment = .development,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`for` *Type: DataDefault:  
n/aThe device token used during registration.`on` *Type: StringDefault:  
n/aThe topic of the remote notification (which is typically the bundle ID for your app).`environment` *Type: PubNub.PushEnvironmentDefault:  
`.development`The APS environment to register the device.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-3)

##### Success[​](#success-3)

A `Void`indicating a success.

##### Failure[​](#failure-3)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

```
`  
`
```

## Add Device to Channel (deprecated)[​](#add-device-to-channel-deprecated)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels. This method is deprecated in favor of the corresponding HTTP/2-based APNs method above. Use only for legacy binary APNs interface publishing.

#### Method(s)[​](#methods-4)

To run `Adding Device to Channel` you can use the following method(s) in the Swift SDK:

```
`func addPushChannelRegistrations(  
    _ additions: [String],  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`_` *Type: [String]Default:  
n/aThe list of channels to add the device registration to.`for` *Type: DataDefault:  
n/aA device token to identify the device for registration changes.`of` *Type: PubNub.PushServiceDefault:  
`.apns`The type of Remote Notification service used to send the notifications.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### Completion Handler Result[​](#completion-handler-result-4)

###### Success[​](#success-4)

An `Array` of channels added for notifications on a specific device token.

###### Failure[​](#failure-4)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-4)

##### Add Device to Channel[​](#add-device-to-channel)

```
`  
`
```

## List Channels For Device (deprecated)[​](#list-channels-for-device-deprecated)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified `pushToken`. This method is deprecated in favor of the corresponding HTTP/2-based APNs method above. Use only for legacy binary APNs interface publishing.

#### Method(s)[​](#methods-5)

To run `Listing Channels For Device` you can use the following method(s) in the Swift SDK:

```
`func listPushChannelRegistrations(  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`for` *Type: DataDefault:  
n/aA device token to identify the device for registration changes.`of` *Type: PubNub.PushServiceDefault:  
`.apns`The type of Remote Notification service used to send the notifications.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### Completion Handler Result[​](#completion-handler-result-5)

###### Success[​](#success-5)

An `Array` of channels added for notifications on a specific device token.

###### Failure[​](#failure-5)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-5)

##### Listing Channels For Device[​](#listing-channels-for-device)

```
`  
`
```

## Remove Device From Channel (deprecated)[​](#remove-device-from-channel-deprecated)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels. This method is deprecated in favor of the corresponding HTTP/2-based APNs method above. Use only for legacy binary APNs interface publishing.

#### Method(s)[​](#methods-6)

To run `Removing Device From Channel` you can use the following method(s) in the Swift SDK:

```
`removePushChannelRegistrations(  
    _ removals: [String],  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`_` *Type: [String]Default:  
n/aThe list of channels to remove the device registration from.`for` *Type: DataDefault:  
n/aA device token to identify the device for registration changes.`of` *Type: PubNub.PushServiceDefault:  
`.apns`The type of Remote Notification service used to send the notifications.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### Completion Handler Result[​](#completion-handler-result-6)

###### Success[​](#success-6)

An `Array` of channels added for notifications on a specific device token.

###### Failure[​](#failure-6)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-6)

##### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`  
`
```

## Remove all mobile push notifications (deprecated)[​](#remove-all-mobile-push-notifications-deprecated)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified `pushToken`. This method is deprecated in favor of the corresponding HTTP/2-based APNs method above. Use only for legacy binary APNs interface publishing.

#### Method(s)[​](#methods-7)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Swift SDK:

```
`func removeAllPushChannelRegistrations(  
    for deviceToken: Data,  
    of pushType: PubNub.PushService = .apns,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`for` *Type: DataDefault:  
n/aA device token to identify the device for registration changes.`of` *Type: PubNub.PushServiceDefault:  
`.apns`The type of Remote Notification service used to send the notifications.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<Void, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### Completion Handler Result[​](#completion-handler-result-7)

###### Success[​](#success-7)

A `Void` indicating a success.

###### Failure[​](#failure-7)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-7)

##### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`**`
```
Last updated on Jun 12, 2025**