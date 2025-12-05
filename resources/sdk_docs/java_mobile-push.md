# Mobile Push Notifications API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java/Kotlin SDKs, changes client instantiation, async callbacks, and emitted status events. See:
- Java/Kotlin SDK migration guide
- Status events

The Mobile Push Notifications feature connects PubNub publishing to Google Android FCM and Apple iOS APNs. Learn more: Mobile Push Notifications.

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on
Enable the add-on in the Admin Portal. How to enable add-on features.

Enable mobile push notifications on a set of channels.

### Method(s)
```
`1pubnub.addPushNotificationsOnChannels()  
2    .pushType(PNPushType)  
3    .channels(ListString>)  
4    .deviceId(String)  
5    .topic(String)  
6    .environment(PNPushEnvironment)  
`
```

Parameters:
- pushType — Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels — Type: List<String>. Channels to enable.
- deviceId — Type: String. Device ID (push token).
- topic — Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment — Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async — Type: Consumer<Result>. Consumer of a Result of type PNPushAddChannelResult.

### Sample code

##### Reference code
Use this as a runnable reference with necessary imports and console logging.

#### Add device to channel
```
1
  
```

### Returns
No payload. Check result.isSuccess().

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on
Enable the add-on in the Admin Portal. How to enable add-on features.

Get all channels with push notifications for the specified push token.

### Method(s)
```
`1pubnub.auditPushChannelProvisions()  
2    .pushType(PNPushType)  
3    .deviceId(String)  
4    .topic(String)  
5    .environment(PNPushEnvironment)  
`
```

Parameters:
- pushType — Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId — Type: String. Device ID (push token).
- topic — Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment — Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async — Type: Consumer<Result>. Consumer of a Result of type PNPushListProvisionsResult.

### Sample code

#### List channels for device
```
1
  
```

### Returns
PNPushListProvisionsResult:
- getChannels() — Type: List<String>. Channels associated with push notifications.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on
Enable the add-on in the Admin Portal. How to enable add-on features.

Disable push notifications on selected channels.

### Method(s)
```
`1pubnub.removePushNotificationsFromChannels()  
2    .pushType(PNPushType)  
3    .deviceId(String)  
4    .topic(String)  
5    .environment(PNPushEnvironment)  
`
```

Parameters:
- pushType — Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels — Type: List<String>. Channels to disable.
- deviceId — Type: String. Device ID (push token).
- topic — Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment — Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async — Type: Consumer<Result>. Consumer of a Result of type PNPushRemoveChannelResult.

### Sample code

#### Remove device from channel
```
1
  
```

### Returns
No payload. Check result.isFailure() on error or handle exceptions via result.onFailure(...).

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on
Enable the add-on in the Admin Portal. How to enable add-on features.

Disable push notifications from all channels registered for the specified push token.

### Method(s)
```
`1pubnub.removeAllPushNotificationsFromDeviceWithPushToken()  
2    .pushType(PNPushType)  
3    .deviceId(String)  
4    .topic(String)  
5    .environment(PNPushEnvironment)  
`
```

Parameters:
- pushType — Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId — Type: String. Device ID (push token).
- topic — Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment — Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async — Type: Consumer<Result>. Consumer of a Result of type PNPushRemoveAllChannelsResult.

### Sample code

#### Remove all mobile push notifications
```
1
  
```

### Returns
No payload. Check result.isFailure() on error or handle exceptions via result.onFailure(...).

Last updated on Oct 21, 2025