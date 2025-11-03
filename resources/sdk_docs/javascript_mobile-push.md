# Mobile Push Notifications API for JavaScript SDK

Connect PubNub publishing to push services:
- APNs (Apple Push Notification service)
- FCM (Firebase Cloud Messaging)

Learn more: [Mobile Push Notifications](/docs/general/push/send)

##### Supported and recommended asynchronous patterns
- PubNub supports Callbacks, Promises, and Async/Await (recommended).
- Use try...catch with Async/Await to handle errors.

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on
Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Enable push notifications on a set of channels.

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
- channels (required) — Type: Array<string> — Channels to enable.
- device (required) — Type: string — Device token.
- pushGateway (required) — Type: string — Accepted: apns2, gcm.
- environment — Type: string — Default: development — Accepted: development, production. Required if pushGateway = apns2.
- topic — Type: string — APNs topic (bundle identifier). Required if pushGateway = apns2.

### Sample code

##### Reference code

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

##### Requires Mobile Push Notifications add-on
Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Get all channels with push notifications for a given push token.

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
- device (required) — Type: string — Device token.
- pushGateway (required) — Type: string — Accepted: apns2, gcm.
- environment — Type: string — Default: development — Accepted: development, production. Required if pushGateway = apns2.
- topic — Type: string — APNs topic (bundle identifier). Required if pushGateway = apns2.
- start — Type: string — Start channel for pagination (use last channel from previous page).
- count — Type: number — Number of channels to return. Max 1000; default 500.

### Sample code

#### List channels for device

```
1
  
```

### Response

```
// Example of status  
{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  

// Example of response  
{  
    channels: [ 'a', 'b' ]  
}  
```

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on
Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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
- channels (required) — Type: Array<string> — Channels to disable.
- device (required) — Type: string — Device token.
- pushGateway (required) — Type: string — Accepted: apns2, gcm.
- environment — Type: string — Default: development — Accepted: development, production. Required if pushGateway = apns2.
- topic — Type: string — APNs topic (bundle identifier). Required if pushGateway = apns2.

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

##### Requires Mobile Push Notifications add-on
Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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
- device (required) — Type: string — Device token.
- pushGateway (required) — Type: string — Accepted: apns2, gcm.
- environment — Type: string — Default: development — Accepted: development, production. Required if pushGateway = apns2.
- topic — Type: string — APNs topic (bundle identifier). Required if pushGateway = apns2.

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

Configure message formats for APNs and FCM.

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
- collapseId — Type: string — Collapse identifier (apns-collapse-id).
- expirationDate — Type: Date — Expiration (apns-expiration).
- targets (required) — Type: Array<APNS2Target> — Delivery targets.

### APNSNotificationPayload

APNs-only options.

#### Properties
- configurations — Type: Array<APNSNotificationConfiguration> — HTTP/2 APNs delivery configurations.
- notification — Type: Hash — User-visible key-value pairs.
- payload — Type: Hash — Platform-specific payload for additional data.
- silent — Type: Boolean — If true, omits alert, sound, and badge.

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
- topic (required) — Type: string — APNs topic (bundle identifier).
- environment — Type: string — Default: development — Accepted: development, production.
- excludedDevices — Type: Array<string> — Push tokens to exclude.

### FCMNotificationPayload

FCM-only options.

#### Properties
- notification — Type: Hash — User-visible key-value pairs.
- data — Type: Hash — Additional key-value data (stringify values). Must not include reserved keys (for example, from, message_type, keys starting with google or gcm).
- silent — Type: Boolean — If true, moves notification under data.
- icon — Type: String — Icon shown with the notification title.
- tag — Type: String — Identifier to update/replace a prior notification.
- payload — Type: Hash — Platform-specific payload for additional data.

### Cross-platform notifications payload

NotificationsPayload builds multi-platform payloads and platform-specific builders.

#### Method(s)

Parameters:
- subtitle — Type: string — Additional context.
- badge — Type: number — Badge count.
- sound — Type: string — Sound name or file path.
- debugging — Type: boolean — Include device delivery debug info.
- apns — Type: APNSNotificationPayload — APNs-specific builder.
- fcm — Type: FCMNotificationPayload — FCM-specific builder.

```
`1PubNub.notificationPayload(  
2    title: string,  
3    body: string  
4)  
`
```

Parameters:
- title — Type: string — Notification title.
- body — Type: string — Body text.

```
`1buildPayload(  
2    platforms: Arraystring>  
3)  
`
```

Parameters:
- platforms (required) — Type: Array<string> — Add payload for:
  - apns
  - apns2
  - fcm

#### Sample code

Create notification payload builder with pre-defined title and body:

```
1
  
```

```
`1let builder = PubNub.notificationPayload('Chat invitation',  
2                                            'You have been invited to \'quiz\' chat');  
`
```

#### Response
Hash suitable for publish, triggering remote notifications for specified platforms.

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

APNs will try redelivery for inactive devices and give up after 10 seconds (per expiration). Notifications with the same collapse_id are grouped.

#### Returns
Configured and ready to use NotificationsPayload instance.

Last updated on Sep 3, 2025