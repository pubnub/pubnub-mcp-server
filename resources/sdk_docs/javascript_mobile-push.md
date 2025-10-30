# Mobile Push Notifications API for JavaScript SDK

Connect PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). Learn more: Mobile Push Notifications.

Supported async patterns: Callbacks, Promises, and Async/Await (recommended). Use try...catch with Async/Await to capture errors.

Requires Mobile Push Notifications add-on for your keys. Enable in the Admin Portal.

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
- channels (Array<string>, required): Channels to enable for push notifications.
- device (string, required): Device token.
- pushGateway (string, required): Accepted values: apns2, gcm.
- environment (string, required for apns2; default: development): APNs environment. Accepted values: development, production.
- topic (string, required for apns2): APNs topic (bundle identifier).

### Sample code

Reference code (self-contained snippet demonstrating imports, usage, and console logging):

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
- device (string, required): Device token.
- pushGateway (string, required): Accepted values: apns2, gcm.
- environment (string, required for apns2; default: development): APNs environment. Accepted values: development, production.
- topic (string, required for apns2): APNs topic (bundle identifier).
- start (string, optional): Start channel for pagination (use last channel from previous page).
- count (number, optional; default 500, max 1000): Number of channels to return.

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
- channels (Array<string>, required): Channels to disable for push notifications.
- device (string, required): Device token.
- pushGateway (string, required): Accepted values: apns2, gcm.
- environment (string, required for apns2; default: development): APNs environment. Accepted values: development, production.
- topic (string, required for apns2): APNs topic (bundle identifier).

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
- device (string, required): Device token.
- pushGateway (string, required): Accepted values: apns2, gcm.
- environment (string, required for apns2; default: development): APNs environment. Accepted values: development, production.
- topic (string, required for apns2): APNs topic (bundle identifier).

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

Configure APNs and FCM payload formats.

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
- collapseId (string, optional): Collapse identifier (apns-collapse-id).
- expirationDate (Date, optional): Expiration (apns-expiration).
- targets (Array<APNS2Target>, required): Delivery targets.

### APNSNotificationPayload

APNs-only options.

#### Properties

- configurations (Array<APNSNotificationConfiguration>): HTTP/2 APNs delivery configurations.
- notification (Hash): User-visible key-value pairs.
- payload (Hash): Platform-specific payload for additional data.
- silent (Boolean): If true, omits alert, sound, and badge.

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
- topic (string, required): APNs topic (bundle identifier).
- environment (string, optional; default: development): Accepted values: development, production.
- excludedDevices (Array<string>, optional): Push tokens to exclude.

### FCMNotificationPayload

FCM-only options.

#### Properties

- notification (Hash): User-visible key-value pairs.
- data (Hash): Additional key-value data (stringify values). Must not include reserved keys (for example: from, message_type, keys starting with google or gcm).
- silent (Boolean): If true, moves notification under data.
- icon (String): Icon shown with the notification title.
- tag (String): Identifier used to update/replace a prior notification.
- payload (Hash): Platform-specific payload for additional data.

### Cross-platform notifications payload

NotificationsPayload helps build multi-platform payloads and access platform-specific builders.

#### Method(s)

Properties:
- subtitle (string): Additional context.
- badge (number): Badge count.
- sound (string): Sound name/file path.
- debugging (boolean): Include device delivery debug info.
- apns (APNSNotificationPayload): APNs-specific builder.
- fcm (FCMNotificationPayload): FCM-specific builder.

```
`1PubNub.notificationPayload(  
2    title: string,  
3    body: string  
4)  
`
```

Parameters:
- title (string, required): Notification title.
- body (string, required): Notification body.

```
`1buildPayload(  
2    platforms: Arraystring>  
3)  
`
```

Parameters:
- platforms (Array<string>, required): Platforms to include:
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

Hash with data to send with a publish call to trigger remote notifications for specified platforms.

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

The example configures APNS to redeliver for up to 10 seconds and groups invitation notifications via collapse_id.

#### Returns

Configured and ready to use NotificationsPayload instance.

Last updated on Sep 3, 2025