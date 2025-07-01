# Mobile Push Notifications API (Kotlin SDK ≥ 9.0.0)

## Breaking changes in v9.0.0
The Kotlin and Java SDKs share a unified codebase. Client instantiation, async callbacks, and status events changed. See the Java/Kotlin SDK migration guide for details.

## Request execution
Endpoint objects must be executed with `.sync()` or `.async()`:

```kotlin
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle success
    }
}
```

## Mobile Push Notifications

• Requires the “Mobile Push Notifications” add-on enabled for your PubNub keys.  
• Supports `PNPushType.FCM` and `PNPushType.APNS2`.

---

### Add Device to Channel

```kotlin
pubnub.addPushNotificationsOnChannels(
    pushType: PNPushType.FCM,
    channels: List<String>,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Parameters  
• `pushType` – `PNPushType.FCM` or `PNPushType.APNS2`  
• `channels` – list of channels to enable notifications on  
• `deviceId` – device token  
• `topic` – bundle identifier (APNS2 only)  
• `environment` – `PNPushEnvironment` (APNS2 only)

Returns: no data; check `result.isFailure` or `result.onFailure { … }`.

```kotlin

```

---

### List Channels for Device

```kotlin
pubnub.auditPushChannelProvisions(
    pushType: PNPushType,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result, status -> }
```

Parameters as above (`deviceId`, `topic`, `environment`).

Returns: `PNPushListProvisionsResult?`  
• `channels : List<String>` – channels with push enabled.

```kotlin

```

---

### Remove Device from Channel

```kotlin
pubnub.removePushNotificationsFromChannels(
    pushType: PNPushType,
    channels: List<String>,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Same parameters as “Add Device”.  
Returns: no data; inspect `result`.

```kotlin

```

---

### Remove All Mobile Push Notifications

```kotlin
pubnub.removeAllPushNotificationsFromDeviceWithPushToken(
    pushType: PNPushType,
    deviceId: String,
    topic: String,
    environment: PNPushEnvironment
).async { result -> }
```

Disables push on all channels for the token.  
Returns: no data; inspect `result`.

```kotlin

```

_Last updated: May 28 2025_