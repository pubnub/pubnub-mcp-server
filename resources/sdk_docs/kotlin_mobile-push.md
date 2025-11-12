# Mobile Push Notifications API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new PubNub client instantiation approach, and changes asynchronous API callbacks and emitted status events. These changes affect apps built with versions < 9.0.0.

See: Java/Kotlin SDK migration guide (/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide)

The Mobile Push Notifications feature connects PubNub publishing to Google Android FCM and Apple iOS APNs (APNS2). Learn more: /docs/general/push/send

##### Request execution

Most method calls return an Endpoint. You must call .sync() or .async() to execute.

```
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

Enable Mobile Push Notifications for your key in the Admin Portal (https://admin.pubnub.com/).

Enable mobile push notifications on a set of channels.

### Method(s)

```
pubnub.addPushNotificationsOnChannels(
    pushType: PNPushType,
    channels: List<String>,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Parameters:
- pushType (PNPushType): Push type. Accepted: PNPushType.FCM, PNPushType.APNS2.
- channels (List<String>): Channels to enable.
- deviceId (String): Device push token.
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): APNs environment. Accepted: PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

```

```

### Returns

No payload. Check result.isFailure or handle via result.onFailure { ... }.

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal (https://admin.pubnub.com/).

Get all channels with push notifications for the specified push token.

### Method(s)

```
pubnub.auditPushChannelProvisions(
    pushType: PNPushType,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Parameters:
- pushType (PNPushType): PNPushType.FCM, PNPushType.APNS2.
- deviceId (String): Device push token.
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### List channels for device

```

```

### Returns

PNPushListProvisionsResult? with:
- channels (List<String>): Channels associated with the push token.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal (https://admin.pubnub.com/).

Disable push notifications on selected channels.

### Method(s)

```
pubnub.removePushNotificationsFromChannels(
    pushType: PNPushType,
    channels: List<String>,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Parameters:
- pushType (PNPushType): PNPushType.FCM, PNPushType.APNS2.
- channels (List<String>): Channels to disable.
- deviceId (String): Device push token.
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### Remove device from channel

```

```

### Returns

No payload. Check result.isFailure or handle via result.onFailure { ... }.

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the Admin Portal (https://admin.pubnub.com/).

Disable push notifications from all channels registered for the specified push token.

### Method(s)

```
pubnub.removeAllPushNotificationsFromDeviceWithPushToken(
    pushType: PNPushType,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Parameters:
- pushType (PNPushType): PNPushType.FCM, PNPushType.APNS2.
- deviceId (String): Device push token.
- topic (String): APNs topic (bundle identifier). Required for APNS2.
- environment (PNPushEnvironment): PNPushEnvironment.DEVELOPMENT, PNPushEnvironment.PRODUCTION. Required for APNS2.

### Sample code

#### Remove all mobile push notifications

```

```

### Returns

No payload. Check result.isFailure or handle via result.onFailure { ... }.

Last updated on Oct 21, 2025