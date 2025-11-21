# Mobile Push Notifications API for JavaScript SDK

Connects PubNub publishing to mobile push services:
- Apple iOS APNs (HTTP/2)
- Google Android FCM

Requires Mobile Push Notifications add-on. Enable for your key in the Admin Portal.

##### Supported asynchronous patterns
Use Async/Await (recommended) with try...catch to receive error statuses. Callbacks and Promises are also supported.

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
- channels (Array<string>) Required. Channels to enable for push notifications.
- device (string) Required. Device token.
- pushGateway (string) Required. Accepted values: apns2, gcm.
- environment (string) Default: development. APNs environment. Accepted values: development, production. Required if pushGateway is apns2.
- topic (string) APNs topic (bundle identifier). Required if pushGateway is apns2.

### Sample code

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

Retrieve all channels with push notifications for a given device token.

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
- device (string) Required. Device token.
- pushGateway (string) Required. Accepted values: apns2, gcm.
- environment (string) Default: development. APNs environment. Accepted values: development, production. Required if pushGateway is apns2.
- topic (string) APNs topic (bundle identifier). Required if pushGateway is apns2.
- start (string) Start channel for pagination (use last channel from previous page).
- count (number) Number of channels to return. Max 1000; default 500.

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
- channels (Array<string>) Required. Channels to disable for push notifications.
- device (string) Required. Device token.
- pushGateway (string) Required. Accepted values: apns2, gcm.
- environment (string) Default: development. APNs environment. Accepted values: development, production. Required if pushGateway is apns2.
- topic (string) APNs topic (bundle identifier). Required if pushGateway is apns2.

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

Disable push notifications from all channels for a device token.

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
- device (string) Required. Device token.
- pushGateway (string) Required. Accepted values: apns2, gcm.
- environment (string) Default: development. APNs environment. Accepted values: development, production. Required if pushGateway is apns2.
- topic (string) APNs topic (bundle identifier). Required if pushGateway is apns2.

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

Configure APNs and FCM payloads.

### APNS2Configuration

Type for APNS2 configuration.

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
- collapseId (string) Collapse identifier (apns-collapse-id).
- expirationDate (Date) Expiration (apns-expiration).
- targets (Array<APNS2Target>) Required. Delivery targets.

### APNSNotificationPayload

APNs-only options.

#### Properties

- configurations (Array<APNSNotificationConfiguration>) HTTP/2 APNs delivery configurations.
- notification (Hash) User-visible key-value pairs.
- payload (Hash) Platform-specific payload for additional data.
- silent (Boolean) If true, omits alert, sound, and badge.

### APNS2Target

Type for APNS2 target.

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
- topic (string) Required. APNs topic (bundle identifier).
- environment (string) Default: development. Accepted values: development, production.
- excludedDevices (Array<string>) Push tokens to exclude.

### FCMNotificationPayload

FCM-only options.

#### Properties

- notification (Hash) User-visible key-value pairs.
- data (Hash) Additional key-value data (stringify values). Must not include reserved keys (for example, from, message_type, keys starting with google or gcm). See the Firebase table.
- silent (Boolean) If true, moves notification under data.
- icon (String) Icon shown with the notification title.
- tag (String) Identifier to update/replace a prior notification.
- payload (Hash) Platform-specific payload for additional data.

### Cross-platform notifications payload

Build multi-platform payloads and access platform-specific builders.

#### Method(s)

Properties:
- subtitle (string) Additional context for the notification.
- badge (number) Badge count for supported platforms.
- sound (string) Sound name or file path to play.
- debugging (boolean) Include device delivery debug info.
- apns ([APNSNotificationPayload](#apnsnotificationpayload)) APNs-specific builder.
- fcm ([FCMNotificationPayload](#fcmnotificationpayload)) FCM-specific builder.

```
`1PubNub.notificationPayload(  
2    title: string,  
3    body: string  
4)  
`
```

Parameters:
- title (string) Title shown in the notification.
- body (string) Body text shown under the title.

```
`1buildPayload(  
2    platforms: Arraystring>  
3)  
`
```

Parameters:
- platforms (Array<string>) Required. Platforms to include in the final payload. Available: apns, apns2, fcm.

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

Hash with data to publish to trigger remote notifications for specified platforms.

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

Example shows APNs redelivery attempts with a 10-second expiration and grouping via collapse_id.

#### Returns

Configured and ready to use NotificationsPayload instance.

Last updated on Sep 3, 2025