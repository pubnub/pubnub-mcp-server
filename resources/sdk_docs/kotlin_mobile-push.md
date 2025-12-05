# Mobile Push Notifications API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, updates client instantiation, and changes asynchronous callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

The Mobile Push Notifications feature connects PubNub publishing to FCM (Android) and APNs (iOS). Learn more about Mobile Push Notifications.

##### Request execution

Most method invocations return an Endpoint you must execute with .sync() or .async(), otherwise the operation will not be performed.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  

```

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal.

Enable mobile push notifications on a set of channels.

### Method(s)

```
`1pubnub.addPushNotificationsOnChannels(  
2    pushType: PNPushType.FCM,  
3    channels: ListString>,  
4    deviceId: String,  
5    topic: String,  
6    environment: PNPushEnvironment  
7).async { result -> }  
`
```

Parameters:
- pushType: PNPushType — Push notification type. Accepted values: PNPushType.FCM, PNPushType.APNS2.
- channels: List<String> — Channels to enable for push notifications.
- deviceId: String — Device ID (push token).
- topic: String — APNs topic (bundle identifier). Required for APNS2.
- environment: PNPushEnvironment — APNs environment. Accepted values: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

```
1
  

```

### Returns

No payload is returned. Check result.isFailure on error or handle exceptions via result.onFailure { ... }.

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal.

Get all channels with push notifications for the specified push token.

### Method(s)

```
`1pubnub.auditPushChannelProvisions(  
2    pushType: PNPushType,  
3    deviceId: String,  
4    topic: String,  
5    environment: PNPushEnvironment  
6).async { result, status }  
`
```

Parameters:
- pushType: PNPushType — Push notification type. Accepted values: PNPushType.FCM, PNPushType.APNS2.
- deviceId: String — Device ID (push token).
- topic: String — APNs topic (bundle identifier). Required for APNS2.
- environment: PNPushEnvironment — APNs environment. Accepted values: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### List channels for device

```
1
  

```

### Returns

Returns PNPushListProvisionsResult? with:
- channels — Type: List<String>. Channels associated with push notifications.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal.

Disable push notifications on selected channels.

### Method(s)

```
`1pubnub.removePushNotificationsFromChannels(  
2    pushType: PNPushType,  
3    channels: ListString>,  
4    deviceId: String,  
5    topic: String,  
6    environment: PNPushEnvironment  
7).async { result -> }  
`
```

Parameters:
- pushType: PNPushType — Push notification type. Accepted values: PNPushType.FCM, PNPushType.APNS2.
- channels: List<String> — Channels to disable for push notifications.
- deviceId: String — Device ID (push token).
- topic: String — APNs topic (bundle identifier). Required for APNS2.
- environment: PNPushEnvironment — APNs environment. Accepted values: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### Remove device from channel

```
1
  

```

### Returns

No payload is returned. Check result.isFailure on error or handle exceptions via result.onFailure { ... }.

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal.

Disable push notifications from all channels registered for the specified push token.

### Method(s)

```
`1pubnub.removeAllPushNotificationsFromDeviceWithPushToken(  
2    pushType: PNPushType,  
3    deviceId: String,  
4    topic: String,  
5    environment: PNPushEnvironment  
6).async { result -> }  
`
```

Parameters:
- pushType: PNPushType — Push notification type. Accepted values: PNPushType.FCM, PNPushType.APNS2.
- deviceId: String — Device ID (push token).
- topic: String — APNs topic (bundle identifier). Required for APNS2.
- environment: PNPushEnvironment — APNs environment. Accepted values: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Returns

No payload is returned. Check result.isFailure on error or handle exceptions via result.onFailure { ... }.

Last updated on Oct 21, 2025