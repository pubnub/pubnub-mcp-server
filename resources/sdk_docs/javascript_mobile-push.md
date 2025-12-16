# Mobile Push Notifications API for JavaScript SDK

Mobile Push Notifications connects PubNub publishing to third-party push services:
- Google Android **FCM** (Firebase Cloud Messaging)
- Apple iOS **APNs** (Apple Push Notification service)

See also: [Mobile Push Notifications](/docs/general/push/send).

##### Supported and recommended asynchronous patterns

Supports **Callbacks, Promises, Async/Await**. Recommended: **Async/Await**. This pattern returns a status only on detecting an error; use `try...catch` to capture error status.

---

## Add a device to a push notifications channel[​](#add-a-device-to-a-push-notifications-channel)

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Enable mobile push notifications on a set of channels.

### Method(s)[​](#methods)

```
`1pubnub.push.addChannels({  
2    channels: Arraystring>,  
3    device: string,  
4    pushGateway: string,  
5    environment: string,  
6    topic: string  
7})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`Default:  
n/aChannels to enable for push notifications.`device` *Type: stringDefault:  
n/aDevice token.`pushGateway` *Type: stringDefault:  
n/aAccepted values: `apns2`, `fcm`.`environment`Type: stringDefault:  
`development`APNs environment. Accepted values: `development`, `production`. Required if `pushGateway` is `apns2`.`topic`Type: stringDefault:  
n/aAPNs topic (bundle identifier). Required if `pushGateway` is `apns2`.

### Sample code[​](#sample-code)

##### Reference code

#### Add device to channel[​](#add-device-to-channel)

```
1
  

```

```
1
  

```

### Response[​](#response)

```
`1{  
2    error: false,  
3    operation: 'PNPushNotificationEnabledChannelsOperation',  
4    statusCode: 200  
5}  
`
```

---

## List push notifications channels for a device[​](#list-push-notifications-channels-for-a-device)

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Get all channels with push notifications for the specified push token.

### Method(s)[​](#methods-1)

```
`1pubnub.push.listChannels({  
2    device: string,  
3    pushGateway: string,  
4    environment: string,  
5    topic: string  
6})  
`
```

*  requiredParameterDescription`device` *Type: stringDefault:  
n/aDevice token.`pushGateway` *Type: stringDefault:  
n/aAccepted values: `apns2`, `fcm`.`environment`Type: stringDefault:  
`development`APNs environment. Accepted values: `development`, `production`. Required if `pushGateway` is `apns2`.`topic`Type: stringDefault:  
n/aAPNs topic (bundle identifier). Required if `pushGateway` is `apns2`.`start`Type: stringDefault:  
n/aStart channel for pagination. Use the last channel from the previous page.`count`Type: numberDefault:  
n/aNumber of channels to return. Maximum 1000; default 500.

### Sample code[​](#sample-code-1)

#### List channels for device[​](#list-channels-for-device)

```
1
  

```

### Response[​](#response-1)

```
1// Example of status  
2{  
3    error: false,  
4    operation: 'PNPushNotificationEnabledChannelsOperation',  
5    statusCode: 200  
6}  
7
  
8// Example of response  
9{  
10    channels: [ 'a', 'b' ]  
11}  

```

---

## Remove a device from push notifications channels[​](#remove-a-device-from-push-notifications-channels)

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Disable push notifications on selected channels.

### Method(s)[​](#methods-2)

```
`1pubnub.push.removeChannels({  
2    channels: Arraystring>,  
3    device: string,  
4    pushGateway: string,  
5    environment: string,  
6    topic: string  
7})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`Default:  
n/aChannels to disable for push notifications.`device` *Type: stringDefault:  
n/aDevice token.`pushGateway` *Type: stringDefault:  
n/aAccepted values: `apns2`, `fcm`.`environment`Type: stringDefault:  
`development`APNs environment. Accepted values: `development`, `production`. Required if `pushGateway` is `apns2`.`topic`Type: stringDefault:  
n/aAPNs topic (bundle identifier). Required if `pushGateway` is `apns2`.

### Sample code[​](#sample-code-2)

#### Remove device from channel[​](#remove-device-from-channel)

```
1
  

```

### Response[​](#response-2)

```
`1{  
2    error: false,  
3    operation: 'PNPushNotificationEnabledChannelsOperation',  
4    statusCode: 200  
5}  
`
```

---

## Remove a device from all push notifications channels[​](#remove-a-device-from-all-push-notifications-channels)

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Disable push notifications from all channels registered for the specified push token.

### Method(s)[​](#methods-3)

```
`1pubnub.push.deleteDevice({  
2    device: string,  
3    pushGateway: string,  
4    environment: string,  
5    topic: string  
6})  
`
```

*  requiredParameterDescription`device` *Type: stringDefault:  
n/aDevice token.`pushGateway` *Type: stringDefault:  
n/aAccepted values: `apns2`, `fcm`.`environment`Type: stringDefault:  
`development`APNs environment. Accepted values: `development`, `production`. Required if `pushGateway` is `apns2`.`topic`Type: stringDefault:  
n/aAPNs topic (bundle identifier). Required if `pushGateway` is `apns2`.

### Sample code[​](#sample-code-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

```
1
  

```

### Response[​](#response-3)

```
`1{  
2    error: false,  
3    operation: 'PNPushNotificationEnabledChannelsOperation',  
4    statusCode: 200  
5}  
`
```

---

## Push notification format configuration[​](#push-notification-format-configuration)

Push notifications require specific message formats. Use these types/builders to configure APNs and FCM payloads.

### APNS2Configuration[​](#apns2configuration)

`APNS2` configuration type.

#### Method(s)[​](#methods-4)

```
`1type APNS2Configuration = {  
2    collapseId?: string,  
3    expirationDate?: Date,  
4    targets: ArrayAPNS2Target>  
5}  
`
```

*  requiredParameterDescription`collapseId`Type: stringCollapse identifier (`apns-collapse-id`).`expirationDate`Type: DateExpiration (`apns-expiration`).`targets` *Type: Array< [APNS2Target](#apns2target)>Delivery targets.

### APNSNotificationPayload[​](#apnsnotificationpayload)

APNs-only options.

#### Properties[​](#properties)

ParameterDescription`configurations`Type: Array< [APNSNotificationConfiguration](#apns2configuration)>HTTP/2 APNs delivery configurations.`notification`Type: HashUser-visible key-value pairs.`payload`Type: HashPlatform-specific payload for additional data.`silent`Type: BooleanIf true, omits `alert`, `sound`, and `badge`.

### APNS2Target[​](#apns2target)

`APNS2` configuration target type.

#### Method(s)[​](#methods-5)

```
`1type APNS2Target = {  
2    topic: string,  
3    environment?: 'development' | 'production',  
4    excludedDevices?: Arraystring>  
5}  
`
```

*  requiredParameterDescription`topic` *Type: stringDefault:  
n/aAPNs topic (bundle identifier).`environment`Type: stringDefault:  
`development`Accepted values: `development`, `production`.`excludedDevices` *Type: ArrayDefault:  
n/aPush tokens to exclude.

### FCMNotificationPayload[​](#fcmnotificationpayload)

FCM-only options.

#### Properties[​](#properties-1)

ParameterDescription`notification`Type: HashUser-visible key-value pairs.`data`Type: HashAdditional key-value data (stringify values). Must not include reserved keys (for example, `from`, `message_type`, keys starting with `google` or `gcm`). See the Firebase table.`silent`Type: BooleanIf true, moves `notification` under `data`.`icon`Type: StringIcon shown with the notification title.`tag`Type: StringIdentifier used to update/replace a prior notification.`payload`Type: HashPlatform-specific payload for additional data.

### Cross-platform notifications payload[​](#cross-platform-notifications-payload)

`NotificationsPayload` builds multi-platform payloads and exposes platform-specific builders.

#### Method(s)[​](#methods-6)

ParameterDescription`subtitle`Type: stringAdditional context for the notification.`badge`Type: numberBadge count for supported platforms.`sound`Type: stringSound name or file path to play.`debugging`Type: booleanInclude device delivery debug info.`apns`Type: [APNSNotificationPayload](#apnsnotificationpayload)APNs-specific builder.`fcm`Type: [FCMNotificationPayload](#fcmnotificationpayload)FCM-specific builder.

```
`1PubNub.notificationPayload(  
2    title: string,  
3    body: string  
4)  
`
```

*  requiredParameterDescription`title`Type: stringTitle shown in the notification.`body`Type: stringBody text shown under the title.

```
`1buildPayload(  
2    platforms: Arraystring>  
3)  
`
```

*  requiredParameterDescription`platforms` *Type: Array`<string>`List of platforms for which payload should be added to final dictionary. Available: 
- `apns`
- `apns2`
- `fcm`

#### Sample code[​](#sample-code-4)

Create notification payload builder with pre-defined notification title and body:

```
1
  

```

```
`1let builder = PubNub.notificationPayload('Chat invitation',  
2                                            'You have been invited to \'quiz\' chat');  
`
```

#### Response[​](#response-4)

Hash data suitable for sending via `publish`, triggering remote notifications for selected platforms.

#### Other examples[​](#other-examples)

##### Generate simple notification payload for FCM and APNS[​](#generate-simple-notification-payload-for-fcm-and-apns)

```
1
  

```

##### Generate simple notification payload for FCM and HTTP/2-based APNs (default configuration)[​](#generate-simple-notification-payload-for-fcm-and-http2-based-apns-default-configuration)

```
1
  

```

##### Generate simple notification payload for FCM and HTTP/2-based APNs (custom configuration)[​](#generate-simple-notification-payload-for-fcm-and-http2-based-apns-custom-configuration)

```
1
  

```

##### Output[​](#output)

```
`1{  
2    "pn_apns": {  
3        "aps": {  
4            "alert": {  
5                "body": "Chat invitation",  
6                "title": "You have been invited to 'quiz' chat"  
7            }  
8        },  
9        "pn_push": [  
10            {  
11                "collapse_id": "invitations",  
12                "expiration": "2019-11-28T22:06:09.163Z",  
13                "targets": [  
14                    {  
15                        "environment": "development",  
16                        "topic": "com.meetings.chat.app"  
17                    }  
18                ],  
19                "version": "v2"  
20            }  
21        ]  
22    },  
23    "pn_fcm": {  
24        "notification": {  
25            "body": "You have been invited to 'quiz' chat",  
26            "title": "Chat invitation"  
27        }  
28    }  
29}  
`
```

Example output illustrates APNs redelivery attempts and expiration (give up after **10** seconds), and grouping via `collapse_id`.

#### Returns[​](#returns)

Configured [`NotificationsPayload`](#notificationspayload) instance.

Last updated on **Nov 24, 2025**