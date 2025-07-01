On this page
# Mobile Push Notifications API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## Add Device to Channel[​](#add-device-to-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.addPushNotificationsOnChannels(  
    pushType: PNPushType.FCM,  
    channels: ListString>,  
    deviceId: String,  
    topic: String,  
    environment: PNPushEnvironment  
).async { result -> }  
`
```

*  requiredParameterDescription`pushType` *Type: `PNPushType`Accepted values: `PNPushType.FCM`, `PNPushType.APNS2`.`channels` *Type: `List<String>`Add mobile push notifications on the specified channels.`deviceId` *Type: `String`The device ID (token) to associate with mobile push notifications.`topic`Type: `String`Notifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `pushType` set to `APNS2`.`environment`Type: `PNPushEnvironment`Environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `APNS2`).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

The `addPushNotificationsOnChannels()` does not return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure` or handling exception `result.onFailure(exception -> { })`.

## List Channels For Device[​](#list-channels-for-device)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.auditPushChannelProvisions(  
    pushType: PNPushType,  
    deviceId: String,  
    topic: String,  
    environment: PNPushEnvironment  
).async { result, status }  
`
```

*  requiredParameterDescription`pushType` *Type: `PNPushType`Accepted values: `PNPushType.FCM`, `PNPushType.APNS2`.`deviceId` *Type: `String`The device ID (token) to associate with mobile push notifications.`topic`Type: `String`Notifications topic name (usually the application bundle identifier for Apple platform). Required only if `pushType` set to `APNS2`.`environment`Type: `PNPushEnvironment`Environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `APNS2`).

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`  
`
```

### Returns[​](#returns-1)

The `auditPushChannelProvisions()` operation returns a `PNPushListProvisionsResult?` which contains the following operations:

MethodDescription`channels`Type: `List<String>`List of `channels` associated for mobile push notifications.

## Remove Device From Channel[​](#remove-device-from-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels.

### Method(s)[​](#methods-2)

To Removing Device From Channel you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removePushNotificationsFromChannels(  
    pushType: PNPushType,  
    channels: ListString>,  
    deviceId: String,  
    topic: String,  
    environment: PNPushEnvironment  
).async { result -> }  
`
```

*  requiredParameterDescription`pushType` *Type: `PNPushType`Accepted values: `PNPushType.FCM`, `PNPushType.APNS2`.`channels` *Type: `List<String>`Remove mobile push notifications from the specified channels.`deviceId` *Type: `String`The device ID (token) to associate with mobile push notifications.`topic`Type: `String`Notifications topic name (usually the application bundle identifier for Apple platform). Required only if `pushType` set to `APNS2`.`environment`Type: `PNPushEnvironment`Environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `APNS2`).

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`  
`
```

### Returns[​](#returns-2)

The `removePushNotificationsFromChannels()` does not return actionable data, be sure to check result object on the outcome of the operation by checking the `result.isFailure` or handling exception `result.onFailure(exception -> { })`.

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-3)

To `Remove all mobile push notifications` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removeAllPushNotificationsFromDeviceWithPushToken(  
    pushType: PNPushType,  
    deviceId: String,  
    topic: String,  
    environment: PNPushEnvironment  
).async { result -> }  
`
```

*  requiredParameterDescription`pushType` *Type: `PNPushType`Accepted values: `PNPushType.FCM`, `PNPushType.APNS2`.`deviceId` *Type: `String`The device ID (token) to associate with mobile push notifications.`topic`Type: `String`Notifications topic name (usually the application bundle identifier for Apple platform). Required only if `pushType` set to `APNS2`.`environment`Type: `PNPushEnvironment`Environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `APNS2`).

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`  
`
```

### Returns[​](#returns-3)

The `removeAllPushNotificationsFromDeviceWithPushToken()` does not return actionable data, be sure to check the status object on the outcome of the operation by checking the be sure to check result object on the outcome of the operation by checking the `result.isFailure` or handling exception `result.onFailure(exception -> { })`.
Last updated on **May 28, 2025**