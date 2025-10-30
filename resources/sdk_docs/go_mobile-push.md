# Mobile Push Notifications API for Go SDK

Connect native PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

Requires Mobile Push Notifications add-on. Enable in the Admin Portal: https://admin.pubnub.com/. See: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

## Add a device to a push notifications channel[​](#add-a-device-to-a-push-notifications-channel)

Enable mobile push notifications on a set of channels.

### Method(s)[​](#methods)

```
`1pn.AddPushNotificationsOnChannels().  
2        Channels([]string).  
3        DeviceIDForPush(string).  
4        PushType(PNPushTypeFCM|PNPushTypeAPNS2).  
5        Topic(string).  
6        Environment(PNPushEnvironment).  
7        QueryParam(map[string]string).  
8        Execute()  
`
```

Parameters:
- Channels (required)
  - Type: []string
  - Default: n/a
  - Description: Channels to enable for push notifications.
- DeviceIDForPush (required)
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeFCM | PNPushTypeAPNS2 | PNPushTypeGCM | PNPushTypeAPNS
  - Default: Not set
  - Description: Push notification service type.
  - Available values:
    - PNPushTypeFCM — Firebase Cloud Messaging (recommended for Android)
    - PNPushTypeAPNS2 — Apple Push Notification service v2 (recommended for iOS)
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Map of query parameters to append to the API request.

### Sample code[​](#sample-code)

#### Add device to channel (FCM)[​](#add-device-to-channel-fcm)

```
1
  

```

#### Add device to channel (APNs2)[​](#add-device-to-channel-apns2)

```
1
  

```

### Returns[​](#returns)

No payload is returned. Check status.Error on the status object.

## List push notifications channels for a device[​](#list-push-notifications-channels-for-a-device)

Get all channels with push notifications for the specified push token.

### Method(s)[​](#methods-1)

```
`1pn.ListPushProvisions().  
2        DeviceIDForPush(string).  
3        PushType(PNPushTypeFCM|PNPushTypeAPNS2).  
4        Topic(string).  
5        Environment(PNPushEnvironment).  
6        QueryParam(map[string]string).  
7        Execute()  
`
```

Parameters:
- DeviceIDForPush (required)
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeFCM | PNPushTypeAPNS2 | PNPushTypeGCM | PNPushTypeAPNS
  - Default: Not set
  - Description: Push notification service type.
  - Available values:
    - PNPushTypeFCM — Firebase Cloud Messaging (recommended for Android)
    - PNPushTypeAPNS2 — Apple Push Notification service v2 (recommended for iOS)
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Map of query parameters to append to the API request.

### Sample code[​](#sample-code-1)

#### List channels for device (FCM)[​](#list-channels-for-device-fcm)

```
1
  

```

#### List channels for device (APNs2)[​](#list-channels-for-device-apns2)

```
1
  

```

### Returns[​](#returns-1)

Returns ListPushProvisionsRequestResponse with:
- Channels
  - Type: []string
  - Description: Channels associated with push notifications.

## Remove a device from push notifications channels[​](#remove-a-device-from-push-notifications-channels)

Disable push notifications on selected channels.

### Method(s)[​](#methods-2)

```
`1pn.RemovePushNotificationsFromChannels().  
2        Channels([]string).  
3        DeviceIDForPush(string).  
4        PushType(PNPushTypeFCM|PNPushTypeAPNS2).  
5        Topic(string).  
6        Environment(PNPushEnvironment).  
7        QueryParam(map[string]string).  
8        Execute()  
`
```

Parameters:
- Channels (required)
  - Type: []string
  - Default: n/a
  - Description: Channels to disable for push notifications.
- DeviceIDForPush (required)
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeFCM | PNPushTypeAPNS2 | PNPushTypeGCM | PNPushTypeAPNS
  - Default: Not set
  - Description: Push notification service type.
  - Available values:
    - PNPushTypeFCM — Firebase Cloud Messaging (recommended for Android)
    - PNPushTypeAPNS2 — Apple Push Notification service v2 (recommended for iOS)
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Map of query parameters to append to the API request.

### Sample code[​](#sample-code-2)

#### Remove device from channel (FCM)[​](#remove-device-from-channel-fcm)

```
1
  

```

#### Remove device from channel (APNs2)[​](#remove-device-from-channel-apns2)

```
1
  

```

### Returns[​](#returns-2)

No payload is returned. Check status.Error on the status object.

## Remove a device from all push notifications channels[​](#remove-a-device-from-all-push-notifications-channels)

Disable push notifications from all channels registered for the specified push token.

### Method(s)[​](#methods-3)

```
`1pn.RemoveAllPushNotifications().  
2        DeviceIDForPush(string).  
3        PushType(PNPushTypeFCM|PNPushTypeAPNS2).  
4        Topic(string).  
5        Environment(PNPushEnvironment).  
6        QueryParam(map[string]string).  
7        Execute()  
`
```

Parameters:
- DeviceIDForPush (required)
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeFCM | PNPushTypeAPNS2 | PNPushTypeGCM | PNPushTypeAPNS
  - Default: Not set
  - Description: Push notification service type.
  - Available values:
    - PNPushTypeFCM — Firebase Cloud Messaging (recommended for Android)
    - PNPushTypeAPNS2 — Apple Push Notification service v2 (recommended for iOS)
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Map of query parameters to append to the API request.

### Sample code[​](#sample-code-3)

#### Remove all mobile push notifications (FCM)[​](#remove-all-mobile-push-notifications-fcm)

```
1
  

```

#### Remove all mobile push notifications (APNs2)[​](#remove-all-mobile-push-notifications-apns2)

```
1
  

```

### Returns[​](#returns-3)

No payload is returned. Check status.Error on the status object.

Last updated on Oct 29, 2025