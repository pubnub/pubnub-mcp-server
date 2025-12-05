# Mobile Push Notifications API for PHP SDK

Connect PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). To learn more, see Mobile Push Notifications.

## Add a device to a push notifications channel

Requires Mobile Push Notifications add-on. Enable for your key in the Admin Portal.

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
- pushType (required)
  - Type: PNPushType
  - Default: Not set
  - Accepted values: PNPushType.FCM, PNPushType.APNS2
- channels (required)
  - Type: Array
  - Default: n/a
  - Description: Channels to enable for push notifications
- deviceId (required)
  - Type: String
  - Default: n/a
  - Description: Device identifier
- environment
  - Type: String
  - Default: development
  - Description: APNs environment; required for APNS2
- topic
  - Type: String
  - Default: n/a
  - Description: APNs topic (bundle identifier); required for APNS2

### Sample code

#### Add device to channel (FCM)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

#### Add device to channel (APNS2)

```
1
  

```

## List push notifications channels for a device

Requires Mobile Push Notifications add-on. Enable for your key in the Admin Portal.

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
- pushType (required)
  - Type: PNPushType
  - Default: Not set
  - Accepted values: PNPushType.FCM, PNPushType.APNS2
- deviceId (required)
  - Type: String
  - Default: n/a
  - Description: Device token
- environment
  - Type: String
  - Default: development
  - Description: APNs environment; required for APNS2
- topic
  - Type: String
  - Default: n/a
  - Description: APNs topic (bundle identifier); required for APNS2

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

Method:
- getChannels()
  - Type: Array
  - Description: List of channels associated for mobile push notifications

## Remove a device from push notifications channels

Requires Mobile Push Notifications add-on. Enable for your key in the Admin Portal.

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
- pushType (required)
  - Type: PNPushType
  - Default: Not set
  - Accepted values: PNPushType.FCM, PNPushType.APNS2
- channels (required)
  - Type: String|Array
  - Default: n/a
  - Description: Channels to disable for push notifications
- deviceId (required)
  - Type: String
  - Default: n/a
  - Description: Device token
- environment
  - Type: String
  - Default: development
  - Description: APNs environment; required for APNS2
- topic
  - Type: String
  - Default: n/a
  - Description: APNs topic (bundle identifier); required for APNS2

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

Requires Mobile Push Notifications add-on. Enable for your key in the Admin Portal.

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
- pushType (required)
  - Type: PNPushType
  - Default: Not set
  - Accepted values: PNPushType.FCM, PNPushType.APNS2
- deviceId (required)
  - Type: String
  - Default: n/a
  - Description: Device token

### Sample code

#### Remove all push channels from device (FCM)

```
1
  

```

### Response

The sync() method returns a response indicating the success or failure of the operation.

```
1
**
```

Last updated on Nov 6, 2025