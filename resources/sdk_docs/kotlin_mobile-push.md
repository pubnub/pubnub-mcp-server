# Mobile Push Notifications API – Kotlin SDK (≥ v9.0.0)

PubNub Kotlin SDK 9.x merges Kotlin & Java codebases, introduces a new client builder, and changes async callbacks/status events (see Migration Guide).  
Every Endpoint must be executed via `.sync()` or `.async()` – otherwise nothing happens.

```kotlin
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

The following operations require the “Mobile Push Notifications” add-on to be enabled in the Admin Portal.

---

## Add device to channel

```kotlin
`pubnub.addPushNotificationsOnChannels(  
    pushType: PNPushType.FCM,              // or PNPushType.APNS2  
    channels: List<String>,               // channels to enable  
    deviceId: String,                     // FCM/APNs device token  
    topic: String,                        // APNS2 only: app bundle ID  
    environment: PNPushEnvironment        // APNS2 only: .PRODUCTION / .DEVELOPMENT  
).async { result -> }  
`
```

Parameters  
• pushType – PNPushType.FCM | PNPushType.APNS2  
• channels – List of channel names to enable  
• deviceId – Device token  
• topic – Required when `pushType == APNS2`  
• environment – Required when `pushType == APNS2`

Returns  
No payload. Check `result.isFailure` / `onFailure`.

Sample  

```kotlin
`  
`
```

---

## List channels for device

```kotlin
`pubnub.auditPushChannelProvisions(  
    pushType: PNPushType,  
    deviceId: String,  
    topic: String,              // APNS2 only  
    environment: PNPushEnvironment // APNS2 only  
).async { result, status }  
`
```

Returns `PNPushListProvisionsResult?`  
• channels – `List<String>` with all channels that have push enabled for the token.

Sample  

```kotlin
`  
`
```

---

## Remove device from channel

```kotlin
`pubnub.removePushNotificationsFromChannels(  
    pushType: PNPushType,  
    channels: List<String>,  
    deviceId: String,  
    topic: String,  
    environment: PNPushEnvironment  
).async { result -> }  
`
```

Same parameters as “Add device to channel”.  
Returns void – inspect `result`.

Sample  

```kotlin
`  
`
```

---

## Remove all mobile push notifications (token)

```kotlin
`pubnub.removeAllPushNotificationsFromDeviceWithPushToken(  
    pushType: PNPushType,  
    deviceId: String,  
    topic: String,  
    environment: PNPushEnvironment  
).async { result -> }  
`
```

Disables push on **all** channels for the token.  
Returns void – inspect `result`.

Sample  

```kotlin
`  
`
```

_Last updated: Jul 15 2025_