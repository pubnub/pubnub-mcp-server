# Mobile Push Notifications API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For details, see the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Mobile Push Notifications connect PubNub publishing with Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). Learn more in [Mobile Push Notifications](/docs/general/push/send).

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

## Add a device to a push notifications channel

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
- pushType (Type: PNPushType) — Push type: PNPushType.FCM (Firebase Cloud Messaging), PNPushType.APNS2 (Apple Push Notification service v2).
- channels (Type: List<String>) — Channels to enable for push notifications.
- deviceId (Type: String) — Device ID (push token).
- topic (Type: String) — APNs topic (bundle identifier). Required for APNS2.
- environment (Type: PNPushEnvironment) — APNs environment. Values: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNPushAddChannelResult.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add device to channel

```
1
  
```

### Returns

No payload is returned. Check result.isSuccess() on the result object.

## List push notifications channels for a device

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
- pushType (Type: PNPushType) — PNPushType.FCM, PNPushType.APNS2.
- deviceId (Type: String) — Device ID (push token).
- topic (Type: String) — APNs topic (bundle identifier). Required for APNS2.
- environment (Type: PNPushEnvironment) — PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNPushListProvisionsResult.

### Sample code

#### List channels for device

```
1
  
```

### Returns

Returns PNPushListProvisionsResult with:
- getChannels() (Type: List<String>) — Channels associated with push notifications.

## Remove a device from push notifications channels

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
- pushType (Type: PNPushType) — PNPushType.FCM, PNPushType.APNS2.
- channels (Type: List<String>) — Channels to disable for push notifications.
- deviceId (Type: String) — Device ID (push token).
- topic (Type: String) — APNs topic (bundle identifier). Required for APNS2.
- environment (Type: PNPushEnvironment) — PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNPushRemoveChannelResult.

### Sample code

#### Remove device from channel

```
1
  
```

### Returns

No payload is returned. Check result.isFailure() on error or handle exceptions via result.onFailure(...).

## Remove a device from all push notifications channels

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
- pushType (Type: PNPushType) — PNPushType.FCM, PNPushType.APNS2.
- deviceId (Type: String) — Device ID (push token).
- topic (Type: String) — APNs topic (bundle identifier). Required for APNS2.
- environment (Type: PNPushEnvironment) — PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.
- async (Type: Consumer<Result>) — Consumer of a Result of type PNPushRemoveAllChannelsResult.

### Sample code

#### Remove all mobile push notifications

```
1
  
```

### Returns

No payload is returned. Check result.isFailure() on error or handle exceptions via result.onFailure(...).

Last updated on Oct 21, 2025