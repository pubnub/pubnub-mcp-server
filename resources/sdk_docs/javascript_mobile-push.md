# Mobile Push Notifications API for JavaScript SDK

Connect PubNub publishing to FCM (Android) and APNs/APNS2 (iOS). See Mobile Push Notifications to learn more.

Supported async patterns: Callbacks, Promises, Async/Await. Recommended: Async/Await; add try...catch to receive error status (status returns only on errors).

Requires Mobile Push Notifications add-on: Enable for your key in the Admin Portal.

## Add a device to a push notifications channel

Enable mobile push notifications on a set of channels.

### Method(s)

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

Parameters:
- channels (required) Type: Array<string> — Channels to enable for push notifications.
- device (required) Type: string — Device token.
- pushGateway (required) Type: string — Accepted: apns2, fcm.
- environment Type: string — Default: development. Accepted: development, production. Required if pushGateway is apns2.
- topic Type: string — APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code

Reference code: self-contained snippet with imports and console logging.

#### Add device to channel

```
1
  

```

```
1
  

```

### Response

```
`1{  
2    error: false,  
3    operation: 'PNPushNotificationEnabledChannelsOperation',  
4    statusCode: 200  
5}  
`
```

## List push notifications channels for a device

Get all channels with push notifications for the specified push token.

### Method(s)

```
`1pubnub.push.listChannels({  
2    device: string,  
3    pushGateway: string,  
4    environment: string,  
5    topic: string  
6})  
`
```

Parameters:
- device (required) Type: string — Device token.
- pushGateway (required) Type: string — Accepted: apns2, fcm.
- environment Type: string — Default: development. Accepted: development, production. Required if pushGateway is apns2.
- topic Type: string — APNs topic (bundle identifier). Required if pushGateway is apns2.
- start Type: string — Start channel for pagination (use last channel from previous page).
- count Type: number — Number of channels to return. Max 1000; default 500.

### Sample code

#### List channels for device

```
1
  

```

### Response

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

## Remove a device from push notifications channels

Disable push notifications on selected channels.

### Method(s)

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

Parameters:
- channels (required) Type: Array<string> — Channels to disable for push notifications.
- device (required) Type: string — Device token.
- pushGateway (required) Type: string — Accepted: apns2, fcm.
- environment Type: string — Default: development. Accepted: development, production. Required if pushGateway is apns2.
- topic Type: string — APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code

#### Remove device from channel

```
1
  

```

### Response

```
`1{  
2    error: false,  
3    operation: 'PNPushNotificationEnabledChannelsOperation',  
4    statusCode: 200  
5}  
`
```

## Remove a device from all push notifications channels

Disable push notifications from all channels registered for the specified push token.

### Method(s)

```
`1pubnub.push.deleteDevice({  
2    device: string,  
3    pushGateway: string,  
4    environment: string,  
5    topic: string  
6})  
`
```

Parameters:
- device (required) Type: string — Device token.
- pushGateway (required) Type: string — Accepted: apns2, fcm.
- environment Type: string — Default: development. Accepted: development, production. Required if pushGateway is apns2.
- topic Type: string — APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Response

```
`1{  
2    error: false,  
3    operation: 'PNPushNotificationEnabledChannelsOperation',  
4    statusCode: 200  
5}  
`
```

## Push notification format configuration

Configure APNs and FCM push notification payloads.

### APNS2Configuration

APNS2 configuration type.

#### Method(s)

```
`1type APNS2Configuration = {  
2    collapseId?: string,  
3    expirationDate?: Date,  
4    targets: ArrayAPNS2Target>  
5}  
`
```

Parameters:
- collapseId Type: string — Collapse identifier (apns-collapse-id).
- expirationDate Type: Date — Expiration (apns-expiration).
- targets (required) Type: Array<APNS2Target> — Delivery targets.

### APNSNotificationPayload

APNSNotificationPayload provides APNs-only options.

#### Properties

- configurations Type: Array<APNSNotificationConfiguration> — HTTP/2 APNs delivery configurations.
- notification Type: Hash — User-visible key-value pairs.
- payload Type: Hash — Platform-specific payload for additional data.
- silent Type: Boolean — If true, omits alert, sound, and badge.

### APNS2Target

APNS2 configuration target type.

#### Method(s)

```
`1type APNS2Target = {  
2    topic: string,  
3    environment?: 'development' | 'production',  
4    excludedDevices?: Arraystring>  
5}  
`
```

Parameters:
- topic (required) Type: string — APNs topic (bundle identifier).
- environment Type: string — Default: development. Accepted: development, production.
- excludedDevices Type: Array<string> — Push tokens to exclude.

### FCMNotificationPayload

FCMNotificationPayload provides FCM-only options.

#### Properties

- notification Type: Hash — User-visible key-value pairs.
- data Type: Hash — Additional key-value data (stringify values). Must not include reserved keys (for example, from, message_type, keys starting with google or gcm).
- silent Type: Boolean — If true, moves notification under data.
- icon Type: String — Icon shown with the notification title.
- tag Type: String — Identifier used to update/replace a prior notification.
- payload Type: Hash — Platform-specific payload for additional data.

### Cross-platform notifications payload

NotificationsPayload helps build multi-platform payloads and access platform-specific builders.

#### Method(s)

Builder fields:
- subtitle Type: string — Additional context for the notification.
- badge Type: number — Badge count for supported platforms.
- sound Type: string — Sound name or file path to play.
- debugging Type: boolean — Include device delivery debug info.
- apns Type: APNSNotificationPayload — APNs-specific builder.
- fcm Type: FCMNotificationPayload — FCM-specific builder.

```
`1PubNub.notificationPayload(  
2    title: string,  
3    body: string  
4)  
`
```

Parameters:
- title Type: string — Title shown in the notification.
- body Type: string — Body text shown under the title.

```
`1buildPayload(  
2    platforms: Arraystring>  
3)  
`
```

Parameters:
- platforms (required) Type: Array<string> — Platforms added to final payload. Available: 
- apns
- apns2
- fcm

#### Sample code

Create notification payload builder with pre-defined notification title and body:

```
1
  

```

```
`1let builder = PubNub.notificationPayload('Chat invitation',  
2                                            'You have been invited to \'quiz\' chat');  
`
```

#### Response

Hash with data, which can be sent with publish method call and trigger remote notifications for specified platforms.

#### Other examples

##### Generate simple notification payload for FCM and APNS

```
1
  

```

##### Generate simple notification payload for FCM and HTTP/2-based APNs (default configuration)

```
1
  

```

##### Generate simple notification payload for FCM and HTTP/2-based APNs (custom configuration)

```
1
  

```

##### Output

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

APNs will attempt re-delivery for inactive devices and give up after 10 seconds from scheduling. collapse_id groups related notifications.

#### Returns

Configured and ready to use NotificationsPayload instance.

Last updated on Nov 24, 2025