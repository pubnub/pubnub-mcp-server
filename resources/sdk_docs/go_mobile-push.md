# Mobile Push Notifications API for Go SDK

Connect PubNub publishing to third-party push services: Google Android FCM and Apple iOS APNs.

Requires Mobile Push Notifications add-on:
- Enable for your key in the Admin Portal: https://admin.pubnub.com/
- How to enable add-on features: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-
- Learn more: /docs/general/push/send

## Add a device to a push notifications channel

Enable mobile push notifications on a set of channels.

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

Parameters:
- Channels (required): Type []string; Default n/a; Channels to enable for push notifications.
- DeviceIDForPush (required): Type string; Default n/a; Device ID (push token).
- PushType: Type PNPushTypeAPNS2 | PNPushTypeFCM; Default Not set; Accepted: PNPushTypeAPNS2, PNPushTypeFCM.
- Topic: Type string; Default Not set; APNs topic (bundle identifier).
- Environment: Type PNPushEnvironment; Default PNPushEnvironmentDevelopment; Accepted: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam: Type map[string]string; Default n/a; Extra query parameters.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add device to channel (FCM)

```
1
  

```

#### Add device to channel (APNs2)

```
1
  

```

### Returns

No payload. Check status.Error.

## List push notifications channels for a device

Get all channels with push notifications for the specified push token.

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

Parameters:
- DeviceIDForPush (required): Type string; Default n/a; Device ID (push token).
- PushType: Type PNPushTypeAPNS2 | PNPushTypeFCM; Default Not set; Accepted: PNPushTypeAPNS2, PNPushTypeFCM.
- Topic: Type string; Default Not set; APNs topic (bundle identifier).
- Environment: Type PNPushEnvironment; Default PNPushEnvironmentDevelopment; Accepted: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam: Type map[string]string; Default n/a; Extra query parameters.

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

Returns ListPushProvisionsRequestResponse with:
- Channels: Type []string; Channels associated with push notifications.

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

Parameters:
- Channels (required): Type []string; Default n/a; Channels to disable for push notifications.
- DeviceIDForPush (required): Type string; Default n/a; Device ID (push token).
- PushType: Type PNPushTypeAPNS2 | PNPushTypeFCM; Default Not set; Accepted: PNPushTypeAPNS2, PNPushTypeFCM.
- Topic: Type string; Default Not set; APNs topic (bundle identifier).
- Environment: Type PNPushEnvironment; Default PNPushEnvironmentDevelopment; Accepted: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam: Type map[string]string; Default n/a; Extra query parameters.

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

No payload. Check status.Error.

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

Parameters:
- DeviceIDForPush (required): Type string; Default n/a; Device ID (push token).
- PushType: Type PNPushTypeAPNS2 | PNPushTypeFCM; Default Not set; Accepted: PNPushTypeAPNS2, PNPushTypeFCM.
- Topic: Type string; Default Not set; APNs topic (bundle identifier).
- Environment: Type PNPushEnvironment; Default PNPushEnvironmentDevelopment; Accepted: PNPushEnvironmentDevelopment, PNPushEnvironmentProduction.
- QueryParam: Type map[string]string; Default n/a; Extra query parameters.

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

No payload. Check status.Error.

Last updated on Nov 6, 2025