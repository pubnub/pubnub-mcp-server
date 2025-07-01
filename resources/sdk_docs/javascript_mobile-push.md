On this page
# Mobile Push Notifications API for JavaScript SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

## Add Device to Channel[​](#add-device-to-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on the provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.push.addChannels({  
    channels: Arraystring>,  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`Default:  
n/aSpecifies `channel` to associate with mobile push notifications.`device` *Type: stringDefault:  
n/aThe `device` ID to associate with mobile push notifications.`pushGateway` *Type: stringDefault:  
n/a`apns2` or `gcm`.`environment`Type: stringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` is set to `apns2`). Values: `development` or `production`.`topic`Type: stringDefault:  
n/aNotifications topic name (usually it is bundle identifier of applicationfor Apple platform). *Required only if `pushGateway` is set to `apns2`.*

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Device to Channel[​](#add-device-to-channel-1)

```
`  
`
```

```
`  
`
```

### Response[​](#response)

```
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
```

## List Channels For Device[​](#list-channels-for-device)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.push.listChannels({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

*  requiredParameterDescription`device` *Type: stringDefault:  
n/aThe `device` ID to associate with mobile push notifications.`pushGateway` *Type: stringDefault:  
n/a`apns2` or `gcm`.`environment`Type: stringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` is set to `apns2`). Values: `development` or `production`.`topic`Type: stringDefault:  
n/aNotifications topic name (usually it is bundle identifier of applicationfor Apple platform). *Required only if `pushGateway` is set to `apns2`.*`start`Type: stringDefault:  
n/aStarting channel for pagination. Use the last channel from the previous page request.`count`Type: numberDefault:  
n/aNumber of channels to return for pagination. Max of 1000 tokens at a time. Defaults to 500.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`  
`
```

### Response[​](#response-1)

```
`// Example of status  
{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
  
// Example of response  
{  
    channels: [ 'a', 'b' ]  
}  
`
```

## Remove Device From Channel[​](#remove-device-from-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels.

### Method(s)[​](#methods-2)

To run `Removing Device From Channel`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.push.removeChannels({  
    channels: Arraystring>,  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`Default:  
n/aSpecifies `channel` to associate with mobile push notifications.`device` *Type: stringDefault:  
n/aThe `device` ID to associate with mobile push notifications.`pushGateway` *Type: stringDefault:  
n/a`apns2` or `gcm`.`environment`Type: stringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` is set to `apns2`). Values: `development` or `production`.`topic`Type: stringDefault:  
n/aNotifications topic name (usually it is bundle identifier of applicationfor Apple platform). *Required only if `pushGateway` is set to `apns2`.*

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`  
`
```

### Response[​](#response-2)

```
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
```

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-3)

To run `Remove all mobile push notifications`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.push.deleteDevice({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

*  requiredParameterDescription`device` *Type: stringDefault:  
n/aThe `device` ID to associate with mobile push notifications.`pushGateway` *Type: stringDefault:  
n/a`apns2` or `gcm`.`environment`Type: stringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` is set to `apns2`). Values: `development` or `production`.`topic`Type: stringDefault:  
n/aNotifications topic name (usually a bundle identifier of an application for the Apple platform). Required only if `pushGateway` is set to `apns2`.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`  
`
```

### Response[​](#response-3)

```
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
```

## Push Notification Format Configuration[​](#push-notification-format-configuration)

Push notifications enforce specific message format requirements. Use these methods to configure your APNs and FCM mobile push notifications.

### APNS2Configuration[​](#apns2configuration)

`APNS2` configuration type.

#### Method(s)[​](#methods-4)

```
`type APNS2Configuration = {  
    collapseId?: string,  
    expirationDate?: Date,  
    targets: ArrayAPNS2Target>  
}  
`
```

*  requiredParameterDescription`collapseId`Type: stringNotification group / collapse identifier. Value will be used in APNS POST request as `apns-collapse-id` header value.`expirationDate`Type: DateDate till which APNS will try to deliver notification to target device. Value will be used in APNS POST request as `apns-expiration` header value.`targets` *Type: Array< [APNS2Target](#apns2target)>List of topics which should receive this notification.

### APNSNotificationPayload[​](#apnsnotificationpayload)

`APNSNotificationPayload` instance provides access to options specific only to mobile push notifications sent with APNs.

#### Properties[​](#properties)

ParameterDescription`configurations`Type: Array< [APNSNotificationConfiguration](#apns2configuration)>List of HTTP/2-based APNs delivery configurations.`notification`Type: HashHash with parameters which specify user-visible key-value pairs.`payload`Type: HashPlatform specific notification payload. In addition to data required to make notification visual presentation it can be used to pass additional information which should be sent to remote device.`silent`Type: BooleanWhether operation system should handle notification layout by default or not. `alert`, `sound` and `badge` will be removed from resulting payload if set to `true`.

### APNS2Target[​](#apns2target)

`APNS2` configuration target type.

#### Method(s)[​](#methods-5)

```
`type APNS2Target = {  
    topic: string,  
    environment?: 'development' | 'production',  
    excludedDevices?: Arraystring>  
}  
`
```

*  requiredParameterDescription`topic` *Type: stringDefault:  
n/aNotifications topic name (usually it is bundle identifier of applicationfor Apple platform). *Required only if `pushGateway` is set to `apns2`.*`environment`Type: stringDefault:  
`development`Environment within which registered devices to which notifications should be delivered. Available: 
- `development`
- `production`

`excludedDevices` *Type: ArrayDefault:  
n/aList of devices (their push tokens) to which this notification shouldn't be delivered.

### FCMNotificationPayload[​](#fcmnotificationpayload)

`FCMNotificationPayload` instance provides access to options specific only to mobile push notifications sent with **FCM**.

#### Properties[​](#properties-1)

ParameterDescription`notification`Type: HashHash with parameters which specify user-visible key-value pairs.`data`Type: HashCustom key-value object with additional information which will be passed to device along with displayable notification information. All object and scalar type value should be converted to strings before passing to this object. Keys shouldn't match: `from`, `message_type` or start with `google` or `gcm`. Also as key can't be used any word defined in [this table](https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support)`silent`Type: BooleanWhether operation system should handle notification layout by default or not. `notification` key with it's content will be moved from root level under `data` key.`icon`Type: StringIcon which should be shown on the left from notification title instead of application icon.`tag`Type: StringUnique notification identifier which can be used to publish update notifications (they will previous notification with same `tag`).`payload`Type: HashPlatform specific notification payload. In addition to data required to make notification visual presentation it can be used to pass additional information which should be sent to remote device.

### NotificationsPayload[​](#notificationspayload)

`NotificationsPayload` instance provides convenient method and properties which allow to setup notification for multiple platforms without getting into details how they should be formatted.  

Builder instance contain additional set of properties which allow to fine tune payloads for particular platforms and even access to *RAW* payload dictionaries.

#### Method(s)[​](#methods-6)

ParameterDescription`subtitle`Type: stringAdditional information which may explain reason why this notification has been delivered.`badge`Type: numberNumber which should be shown in space designated by platform (for example atop of application icon).`sound`Type: stringPath to file with sound or name of system sound which should be played upon notification receive.`debugging`Type: booleanWhether PubNub service should provide debug information about devices which received created notifications payload.`apns`Type: [APNSNotificationPayload](#apnsnotificationpayload)Access to APNS specific notification builder.`fcm`Type: [FCMNotificationPayload](#fcmnotificationpayload)Access to FCM specific notification builder.

```
`PubNub.notificationPayload(  
    title: string,  
    body: string  
)  
`
```

*  requiredParameterDescription`title`Type: stringShort text which should be shown at the top of notification instead of application name.`body`Type: stringMessage which should be shown in notification body (under title line).

```
`buildPayload(  
    platforms: Arraystring>  
)  
`
```

*  requiredParameterDescription`platforms` *Type: Array`<string>`List of platforms for which payload should be added to final dictionary. Available: 
- `apns`
- `apns2`
- `fcm`

#### Basic Usage[​](#basic-usage-4)

Create notification payload builder with pre-defined notification title and body:

```
`  
`
```

```
`let builder = PubNub.notificationPayload('Chat invitation',  
                                            'You have been invited to \'quiz\' chat');  
`
```

#### Response[​](#response-4)

Hash with data, which can be sent with publish method call and trigger remote notifications for specified platforms.

#### Other Examples[​](#other-examples)

##### Generate simple notification payload for FCM and APNS[​](#generate-simple-notification-payload-for-fcm-and-apns)

```
`  
`
```

##### Generate simple notification payload for FCM and HTTP/2-based APNs (default configuration)[​](#generate-simple-notification-payload-for-fcm-and-http2-based-apns-default-configuration)

```
`  
`
```

##### Generate simple notification payload for FCM and HTTP/2-based APNs (custom configuration)[​](#generate-simple-notification-payload-for-fcm-and-http2-based-apns-custom-configuration)

```
`  
`
```

##### Output[​](#output)

```
`{  
    "pn_apns": {  
        "aps": {  
            "alert": {  
                "body": "Chat invitation",  
                "title": "You have been invited to 'quiz' chat"  
            }  
        },  
        "pn_push": [  
            {  
                "collapse_id": "invitations",  
                "expiration": "2019-11-28T22:06:09.163Z",  
                "targets": [  
                    {  
                        "environment": "development",  
`
```
show all 29 lines

Example above show how to create notification payload which APNS will try to redeliver few times (if devices not active) and give up after **10** seconds since moment when it has been scheduled.

Additionally this invitation notification will be grouped along with other invitation notifications (using provided `collapse_id` as group identifier) and shown as one in notification center.

#### Returns[​](#returns)

Configured and ready to use [`NotificationsPayload`](#notificationspayload) instance.
Last updated on **Jun 30, 2025**