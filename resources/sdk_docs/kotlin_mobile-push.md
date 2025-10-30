# Mobile Push Notifications API for Kotlin SDK

##### Breaking changes in v9.0.0

Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and emitted status events. See the Java/Kotlin SDK migration guide and status events docs.

The Mobile Push Notifications feature bridges PubNub publishing to third-party push services: Google FCM and Apple APNs.

##### Request execution

Most methods return an Endpoint. You must call .sync() or .async() to execute.

```kotlin
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle successful method result
    }
}
```

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on

Enable in the Admin Portal. See enable add-on features.

Enable push notifications on a set of channels.

### Method(s)

```kotlin
pubnub.addPushNotificationsOnChannels(
    pushType: PNPushType,
    channels: List<String>,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

- pushType Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels Type: List<String>. Channels to enable.
- deviceId Type: String. Device ID (push token).
- topic Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run.

```kotlin

```

### Returns

No payload. Check result.isFailure or handle via result.onFailure { ... }.

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on

Enable in the Admin Portal. See enable add-on features.

Get all channels with push notifications for the specified push token.

### Method(s)

```kotlin
pubnub.auditPushChannelProvisions(
    pushType: PNPushType,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result, status }
```

- pushType Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId Type: String. Device ID (push token).
- topic Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### List channels for device

```kotlin

```

### Returns

Returns PNPushListProvisionsResult? with:

- channels Type: List<String>. Channels associated with push notifications.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on

Enable in the Admin Portal. See enable add-on features.

Disable push notifications on selected channels.

### Method(s)

```kotlin
pubnub.removePushNotificationsFromChannels(
    pushType: PNPushType,
    channels: List<String>,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

- pushType Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels Type: List<String>. Channels to disable.
- deviceId Type: String. Device ID (push token).
- topic Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### Remove device from channel

```kotlin

```

### Returns

No payload. Check result.isFailure or handle via result.onFailure { ... }.

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on

Enable in the Admin Portal. See enable add-on features.

Disable push notifications from all channels registered for the specified push token.

### Method(s)

```kotlin
pubnub.removeAllPushNotificationsFromDeviceWithPushToken(
    pushType: PNPushType,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

- pushType Type: PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- deviceId Type: String. Device ID (push token).
- topic Type: String. APNs topic (bundle identifier). Required for APNS2.
- environment Type: PNPushEnvironment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### Remove all mobile push notifications

```kotlin

```

### Returns

No payload. Check result.isFailure or handle via result.onFailure { ... }.

Last updated on Oct 21, 2025