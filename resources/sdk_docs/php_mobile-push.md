# Mobile Push Notifications API for PHP SDK

Connects PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

To learn more, read about Mobile Push Notifications: /docs/general/push/send

## Add a device to a push notifications channel

Requires Mobile Push Notifications add-on. Enable in the Admin Portal: https://admin.pubnub.com/ (How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

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

Parameters:
- pushType (Type: PNPushType, Default: Not set, Accepted: PNPushType.GCM, PNPushType.APNS2)
- channels (Type: Array, Required) Channels to enable for push notifications
- deviceId (Type: String, Required) Device identifier
- environment (Type: String, Default: development) APNs environment; required for APNS2
- topic (Type: String) APNs topic (bundle identifier); required for APNS2

### Sample code

#### Add device to channel (FCM)

##### Reference code

```
1
  

```

#### Add device to channel (APNS2)

```
1
  

```

## List push notifications channels for a device

Requires Mobile Push Notifications add-on. Enable in the Admin Portal: https://admin.pubnub.com/ (How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

List channels that have push notifications enabled for the specified device token.

### Method(s)

```
`1$pubnub->listPushProvisions()  
2    ->pushType(PNPushType)  
3    ->deviceId(string)  
4    ->sync();  
`
```

Parameters:
- pushType (Type: PNPushType, Default: Not set, Accepted: PNPushType.GCM, PNPushType.APNS2)
- deviceId (Type: String, Required) Device token
- environment (Type: String, Default: development) APNs environment; required for APNS2
- topic (Type: String) APNs topic (bundle identifier); required for APNS2

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

- getChannels() (Type: Array) List of channels associated for mobile push notifications.

## Remove a device from push notifications channels

Requires Mobile Push Notifications add-on. Enable in the Admin Portal: https://admin.pubnub.com/ (How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

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

Parameters:
- pushType (Type: PNPushType, Default: Not set, Accepted: PNPushType.GCM, PNPushType.APNS2)
- channels (Type: String|Array, Required) Channels to disable for push notifications
- deviceId (Type: String, Required) Device token
- environment (Type: String, Default: development) APNs environment; required for APNS2
- topic (Type: String) APNs topic (bundle identifier); required for APNS2

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

Requires Mobile Push Notifications add-on. Enable in the Admin Portal: https://admin.pubnub.com/ (How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

Disable mobile push notifications from all channels registered with the specified device token.

### Method(s)

```
`1$pubnub->removeAllPushChannelsForDevice()  
2    ->pushType(PNPushType)  
3    ->deviceId(string)  
4    ->sync();  
`
```

Parameters:
- pushType (Type: PNPushType, Default: Not set, Accepted: PNPushType.GCM, PNPushType.APNS2)
- deviceId (Type: String, Required) Device token

### Sample code

#### Remove all push channels from device (FCM)

```
1
  

```

### Response

The sync() method returns a response indicating the success or failure of the operation.

```
1$response = $pubnub->removeAllPushChannelsForDevice()  
2    ->pushType(PNPushType::APNS2)  
3    ->deviceId("yourDeviceId")  
4    ->sync();  
5
**6if ($response->isSuccessful()) {  
7    echo "Successfully removed all push channels from device.";  
8} else {  
9    echo "Failed to remove push channels. Error: " . $response->getError();  
10}  

```

Last updated on Oct 29, 2025**