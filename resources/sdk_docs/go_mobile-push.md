# Mobile Push Notifications API for Go SDK

Connects PubNub publishing to FCM (Firebase Cloud Messaging) and APNs (Apple Push Notification service). See Mobile Push Notifications overview at /docs/general/push/send.

Requires Mobile Push Notifications add-on: enable in Admin Portal.

## Add a device to a push notifications channel

Enable mobile push notifications on specified channels.

### Method(s)

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

### Parameters

- Channels
  - Type: []string
  - Default: n/a
  - Description: Channels to enable for push notifications.
- DeviceIDForPush
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeAPNS2 | PNPushTypeFCM
  - Default: Not set
  - Accepted values: PNPushTypeAPNS2, PNPushTypeFCM
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Query parameters to append to the API request.

### Sample code

#### Add device to channel (FCM)

```
1
  

```

#### Add device to channel (APNs2)

```
1
  

```

### Returns

No payload. Check status.Error on the status object.

## List push notifications channels for a device

Get all channels with push notifications for a specific push token.

### Method(s)

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

### Parameters

- DeviceIDForPush
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeAPNS2 | PNPushTypeFCM
  - Default: Not set
  - Accepted values: PNPushTypeAPNS2, PNPushTypeFCM
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Query parameters to append to the API request.

### Sample code

#### List channels for device (FCM)

```
1
  

```

#### List channels for device (APNs2)

```
1
  

```

### Returns

ListPushProvisionsRequestResponse:
- Channels: []string — Channels associated with push notifications.

## Remove a device from push notifications channels

Disable push notifications on selected channels.

### Method(s)

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

### Parameters

- Channels
  - Type: []string
  - Default: n/a
  - Description: Channels to disable for push notifications.
- DeviceIDForPush
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeAPNS2 | PNPushTypeFCM
  - Default: Not set
  - Accepted values: PNPushTypeAPNS2, PNPushTypeFCM
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Query parameters to append to the API request.

### Sample code

#### Remove device from channel (FCM)

```
1
  

```

#### Remove device from channel (APNs2)

```
1
  

```

### Returns

No payload. Check status.Error on the status object.

## Remove a device from all push notifications channels

Disable push notifications from all channels registered for the specified push token.

### Method(s)

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

### Parameters

- DeviceIDForPush
  - Type: string
  - Default: n/a
  - Description: Device ID (push token).
- PushType
  - Type: PNPushTypeAPNS2 | PNPushTypeFCM
  - Default: Not set
  - Accepted values: PNPushTypeAPNS2, PNPushTypeFCM
- Topic
  - Type: string
  - Default: Not set
  - Description: APNs topic (bundle identifier).
- Environment
  - Type: PNPushEnvironment
  - Default: PNPushEnvironmentDevelopment
  - Accepted values: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction
- QueryParam
  - Type: map[string]string
  - Default: n/a
  - Description: Query parameters to append to the API request.

### Sample code

#### Remove all mobile push notifications (FCM)

```
1
  

```

#### Remove all mobile push notifications (APNs2)

```
1
  

```

### Returns

No payload. Check status.Error on the status object.

Last updated on Nov 6, 2025