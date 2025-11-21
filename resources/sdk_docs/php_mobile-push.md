# Mobile Push Notifications API for PHP SDK (Condensed)

Connect native PubNub publishing to third-party push services: Google FCM (Android) and Apple APNs (iOS). See Mobile Push Notifications: /docs/general/push/send

Prerequisites
- Requires Mobile Push Notifications add-on. Enable in Admin Portal: https://admin.pubnub.com/ (How to enable: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).
- APNS2 requires:
  - environment (String, default: development)
  - topic (String, bundle identifier)

## Add a device to a push notifications channel

Enable mobile push notifications on a set of channels.

### Method(s)

```
`1$pubnub->addChannelsToPush()  
2    ->pushType(PNPushType)  
3    ->channels(array)  
4    ->deviceId(string)  
5    ->sync();  
`
```

Parameters
- pushType (PNPushType) Default: Not set. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels (Array) Channels to enable.
- deviceId (String) Device identifier.
- environment (String) Default: development. Required for APNS2.
- topic (String) APNs topic (bundle identifier). Required for APNS2.

### Sample code

#### Add device to channel (FCM)

```
1
  
```

#### Add device to channel (APNS2)

```
1
  
```

## List push notifications channels for a device

List channels that have push notifications enabled for the specified device token.

### Method(s)

```
`1$pubnub->listPushProvisions()  
2    ->pushType(PNPushType)  
3    ->deviceId(string)  
4    ->sync();  
`
```

Parameters
- pushType (PNPushType) Default: Not set. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId (String) Device token.
- environment (String) Default: development. Required for APNS2.
- topic (String) APNs topic (bundle identifier). Required for APNS2.

### Sample code

#### List channels for device

```
1
  
```

#### List channels for Device(APNS2)

```
1
  
```

### Response

- getChannels() Type: Array — List of channels associated to mobile push notifications.

## Remove a device from push notifications channels

Disable mobile push notifications on a set of channels.

### Method(s)

```
`1$pubnub->removeChannelsFromPush()  
2    ->pushType(PNPushType)  
3    ->channels(string|array)  
4    ->deviceId(string)  
5    ->sync();  
`
```

Parameters
- pushType (PNPushType) Default: Not set. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels (String|Array) Channels to disable.
- deviceId (String) Device token.
- environment (String) Default: development. Required for APNS2.
- topic (String) APNs topic (bundle identifier). Required for APNS2.

### Sample code

#### Remove device from channel

```
1
  
```

#### Remove device from Channel(APNS2)

```
1
  
```

## Remove a device from all push notifications channels

Disable mobile push notifications from all channels registered with the specified device token.

### Method(s)

```
`1$pubnub->removeAllPushChannelsForDevice()  
2    ->pushType(PNPushType)  
3    ->deviceId(string)  
4    ->sync();  
`
```

Parameters
- pushType (PNPushType) Default: Not set. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId (String) Device token.

### Sample code

#### Remove all push channels from device (FCM)

```
1
  
```

### Response

The sync() method returns a response indicating success or failure (status code, boolean, or object, depending on implementation).

```
1
**
```

Last updated on Nov 6, 2025**