# Mobile Push Notifications API for JavaScript SDK

Connect PubNub publishing to Google Android FCM and Apple iOS APNs. Learn more: Mobile Push Notifications.

Supported and recommended asynchronous patterns
- Async patterns: Callbacks, Promises, Async/Await (recommended). Async/Await returns a status only on error; use try...catch to receive error statuses.

## Add a device to a push notifications channel[​](#add-a-device-to-a-push-notifications-channel)

Requires Mobile Push Notifications add-on
- Enable in the Admin Portal.

Enable mobile push notifications on specific channels.

### Method(s)[​](#methods)

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

Parameters
- channels (required): Type Array<string>; Channels to enable for push notifications.
- device (required): Type string; Device token.
- pushGateway (required): Type string; Accepted: apns2, gcm.
- environment: Type string; Default development; Accepted: development, production. Required if pushGateway is apns2.
- topic: Type string; APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code[​](#sample-code)

Reference code

#### Add device to channel[​](#add-device-to-channel)

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

## List push notifications channels for a device[​](#list-push-notifications-channels-for-a-device)

Requires Mobile Push Notifications add-on
- Enable in the Admin Portal.

Get all channels with push notifications for a push token.

### Method(s)[​](#methods-1)

```
`pubnub.push.listChannels({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

Parameters
- device (required): Type string; Device token.
- pushGateway (required): Type string; Accepted: apns2, gcm.
- environment: Type string; Default development; Accepted: development, production. Required if pushGateway is apns2.
- topic: Type string; APNs topic (bundle identifier). Required if pushGateway is apns2.
- start: Type string; Start channel for pagination (use last channel from previous page).
- count: Type number; Number of channels to return. Max 1000; default 500.

### Sample code[​](#sample-code-1)

#### List channels for device[​](#list-channels-for-device)

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

## Remove a device from push notifications channels[​](#remove-a-device-from-push-notifications-channels)

Requires Mobile Push Notifications add-on
- Enable in the Admin Portal.

Disable push notifications on selected channels.

### Method(s)[​](#methods-2)

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

Parameters
- channels (required): Type Array<string>; Channels to disable for push notifications.
- device (required): Type string; Device token.
- pushGateway (required): Type string; Accepted: apns2, gcm.
- environment: Type string; Default development; Accepted: development, production. Required if pushGateway is apns2.
- topic: Type string; APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code[​](#sample-code-2)

#### Remove device from channel[​](#remove-device-from-channel)

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

## Remove a device from all push notifications channels[​](#remove-a-device-from-all-push-notifications-channels)

Requires Mobile Push Notifications add-on
- Enable in the Admin Portal.

Disable push notifications from all channels registered for the specified push token.

### Method(s)[​](#methods-3)

```
`pubnub.push.deleteDevice({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

Parameters
- device (required): Type string; Device token.
- pushGateway (required): Type string; Accepted: apns2, gcm.
- environment: Type string; Default development; Accepted: development, production. Required if pushGateway is apns2.
- topic: Type string; APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code[​](#sample-code-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

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

## Push notification format configuration[​](#push-notification-format-configuration)

Configure message formats for APNs and FCM.

### APNS2Configuration[​](#apns2configuration)

APNS2 configuration type.

#### Method(s)[​](#methods-4)

```
`type APNS2Configuration = {  
    collapseId?: string,  
    expirationDate?: Date,  
    targets: ArrayAPNS2Target>  
}  
`
```

Parameters
- collapseId: Type string; apns-collapse-id.
- expirationDate: Type Date; apns-expiration.
- targets (required): Type Array<APNS2Target>; Delivery targets.

### APNSNotificationPayload[​](#apnsnotificationpayload)

APNs-only options.

#### Properties[​](#properties)

- configurations: Type Array<APNSNotificationConfiguration>; HTTP/2 APNs delivery configurations.
- notification: Type Hash; User-visible key-value pairs.
- payload: Type Hash; Platform-specific payload for additional data.
- silent: Type Boolean; If true, omits alert, sound, and badge.

### APNS2Target[​](#apns2target)

APNS2 configuration target type.

#### Method(s)[​](#methods-5)

```
`type APNS2Target = {  
    topic: string,  
    environment?: 'development' | 'production',  
    excludedDevices?: Arraystring>  
}  
`
```

Parameters
- topic (required): Type string; APNs topic (bundle identifier).
- environment: Type string; Default development; Accepted: development, production.
- excludedDevices (required): Type Array; Push tokens to exclude.

### FCMNotificationPayload[​](#fcmnotificationpayload)

FCM-only options.

#### Properties[​](#properties-1)

- notification: Type Hash; User-visible key-value pairs.
- data: Type Hash; Additional key-value data (stringify values). Must not include reserved keys (for example, from, message_type, keys starting with google or gcm).
- silent: Type Boolean; If true, moves notification under data.
- icon: Type String; Icon shown with the notification title.
- tag: Type String; Identifier used to update/replace a prior notification.
- payload: Type Hash; Platform-specific payload for additional data.

### Cross-platform notifications payload[​](#cross-platform-notifications-payload)

Build multi-platform payloads and access platform-specific builders.

#### Method(s)[​](#methods-6)

- subtitle: Type string; Additional context for the notification.
- badge: Type number; Badge count.
- sound: Type string; Sound name or file path to play.
- debugging: Type boolean; Include device delivery debug info.
- apns: Type APNSNotificationPayload; APNs-specific builder.
- fcm: Type FCMNotificationPayload; FCM-specific builder.

```
`PubNub.notificationPayload(  
    title: string,  
    body: string  
)  
`
```

Parameters
- title: Type string; Notification title.
- body: Type string; Body text.

```
`buildPayload(  
    platforms: Arraystring>  
)  
`
```

Parameters
- platforms (required): Type Array<string>; Platforms to include: apns, apns2, fcm.

#### Sample code[​](#sample-code-4)

Create notification payload builder with predefined title and body:

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

Hash with data sendable via publish to trigger remote notifications for specified platforms.

#### Other examples[​](#other-examples)

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

APNS will attempt redelivery for inactive devices until expiration (example shows 10 seconds). collapse_id groups related notifications into one in the notification center.

#### Returns[​](#returns)

Configured and ready to use NotificationsPayload instance.

Last updated on Sep 3, 2025