# Mobile Push Notifications API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, and updates asynchronous callbacks and emitted status events. See the Java/Kotlin SDK migration guide for details:
- https://www.pubnub.com/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide

The Mobile Push Notifications feature connects native PubNub publishing to third-party push services (Google Android FCM and Apple iOS APNs). Learn more: https://www.pubnub.com/docs/general/push/send

Requires Mobile Push Notifications add-on. Enable in Admin Portal: https://admin.pubnub.com/ (How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on

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
- pushType (PNPushType): Push type. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels (List<String>): Channels to enable for push notifications.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): APNs environment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of a Result of type PNPushAddChannelResult.

### Sample code

##### Reference code
Self-contained example with imports and console logging.

#### Add device to channel

```
1
  

```

### Returns
No payload. Check result.isSuccess() on the result object.

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on

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
- pushType (PNPushType): Push type. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): APNs environment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of a Result of type PNPushListProvisionsResult.

### Sample code

#### List channels for device

```
1
  

```

### Returns
PNPushListProvisionsResult with:
- getChannels() -> List<String>: Channels associated with push notifications.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on

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
- pushType (PNPushType): Push type. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels (List<String>): Channels to disable for push notifications.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): APNs environment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of a Result of type PNPushRemoveChannelResult.

### Sample code

#### Remove device from channel

```
1
  

```

### Returns
No payload. Check result.isFailure() on error or handle via result.onFailure(...).

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on

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
- pushType (PNPushType): Push type. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId (String): Device ID (push token).
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): APNs environment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Consumer<Result>): Consumer of a Result of type PNPushRemoveAllChannelsResult.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Returns
No payload. Check result.isFailure() on error or handle via result.onFailure(...).

Last updated on Oct 21, 2025