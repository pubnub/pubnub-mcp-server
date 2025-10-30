# Mobile Push Notifications API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java/Kotlin SDKs, changes PubNub client instantiation, and updates asynchronous callbacks and emitted status events. See the Java/Kotlin SDK migration guide for details.

The Mobile Push Notifications feature connects PubNub to FCM (Android) and APNs (iOS). Learn more: Mobile Push Notifications.

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

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

- pushType (PNPushType): Push type; PNPushType.FCM, PNPushType.APNS2.
- channels (List<String>): Channels to enable.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): APNs environment; PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of PNPushAddChannelResult.

### Sample code

#### Add device to channel

```
1
  

```

### Returns
No payload. Check result.isSuccess().

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

Get all channels with push notifications for a push token.

### Method(s)

```
`1pubnub.auditPushChannelProvisions()  
2    .pushType(PNPushType)  
3    .deviceId(String)  
4    .topic(String)  
5    .environment(PNPushEnvironment)  
`
```

- pushType (PNPushType): PNPushType.FCM, PNPushType.APNS2.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of PNPushListProvisionsResult.

### Sample code

#### List channels for device

```
1
  

```

### Returns
PNPushListProvisionsResult:
- getChannels(): List<String> of channels.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

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

- pushType (PNPushType): PNPushType.FCM, PNPushType.APNS2.
- channels (List<String>): Channels to disable.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of PNPushRemoveChannelResult.

### Sample code

#### Remove device from channel

```
1
  

```

### Returns
No payload. Check result.isFailure() on error or handle exceptions via result.onFailure(...).

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

Disable push notifications from all channels for the specified push token.

### Method(s)

```
`1pubnub.removeAllPushNotificationsFromDeviceWithPushToken()  
2    .pushType(PNPushType)  
3    .deviceId(String)  
4    .topic(String)  
5    .environment(PNPushEnvironment)  
`
```

- pushType (PNPushType): PNPushType.FCM, PNPushType.APNS2.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of PNPushRemoveAllChannelsResult.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Returns
No payload. Check result.isFailure() on error or handle exceptions via result.onFailure(...).

Last updated on Oct 21, 2025