# Mobile Push Notifications API – PubNub Java SDK v9+

Breaking change: SDK v9 unifies Java & Kotlin codebases, introduces a new client constructor, and new async/status handling. See the Java/Kotlin migration guide if you upgrade from < 9.0.0.

Mobile Push Notifications let PubNub publish through FCM, APNs, or APNs 2 without extra server code. All methods below require the Mobile Push Notifications add-on to be enabled for your key in the Admin Portal.

---

## Common Builder Arguments

| Argument                | Type                  | Notes                                                                                                 |
|-------------------------|-----------------------|--------------------------------------------------------------------------------------------------------|
| `pushType`              | `PNPushType`          | `PNPushType.FCM`, `PNPushType.GCM`, `PNPushType.APNS`, `PNPushType.APNS2`                              |
| `deviceId`              | `String`             | Device token                                                                                           |
| `channels`              | `List<String>`        | Channels to add/remove (where applicable)                                                              |
| `topic`                 | `String`             | APNS2 only: usually your iOS bundle identifier                                                         |
| `environment`           | `PNPushEnvironment`   | APNS2 only: `PNPushEnvironment.DEVELOPMENT` or `PRODUCTION`                                            |
| `async`                 | `Consumer<Result<?>>` | Async callback (see specific result types below)                                                       |

---

## 1. Add Device to Channels

```java
pubnub.addPushNotificationsOnChannels()
      .pushType(PNPushType)
      .channels(Arrays.asList("ch1", "ch2"))
      .deviceId(deviceToken)
      .topic("com.myapp.bundle")        // APNS2 only
      .environment(PNPushEnvironment.DEVELOPMENT)  // APNS2 only
      .async(result -> {
          if (result.isSuccess()) { /* added */ }
      });
```

Result type: `PNPushAddChannelResult` (no data—check `isSuccess()`).

---

## 2. List Channels for Device

```java
pubnub.auditPushChannelProvisions()
      .pushType(PNPushType)
      .deviceId(deviceToken)
      .topic("com.myapp.bundle")        // APNS2 only
      .environment(PNPushEnvironment.DEVELOPMENT)  // APNS2 only
      .async(result -> {
          if (result.isSuccess()) {
              List<String> channels = result.getData().getChannels();
          }
      });
```

`PNPushListProvisionsResult` exposes:

```java
List<String> getChannels();
```

---

## 3. Remove Device from Channels

```java
pubnub.removePushNotificationsFromChannels()
      .pushType(PNPushType)
      .channels(Arrays.asList("ch1", "ch2"))
      .deviceId(deviceToken)
      .topic("com.myapp.bundle")        // APNS2 only
      .environment(PNPushEnvironment.DEVELOPMENT)  // APNS2 only
      .async(result -> {
          if (result.isFailure()) {
              result.onFailure(ex -> {/* handle error */});
          }
      });
```

Result type: `PNPushRemoveChannelResult` (no data).

---

## 4. Remove ALL Push Notifications for Device

```java
pubnub.removeAllPushNotificationsFromDeviceWithPushToken()
      .pushType(PNPushType)
      .deviceId(deviceToken)
      .topic("com.myapp.bundle")        // APNS2 only
      .environment(PNPushEnvironment.DEVELOPMENT)  // APNS2 only
      .async(result -> {
          if (result.isFailure()) {
              result.onFailure(ex -> {/* handle error */});
          }
      });
```

Result type: `PNPushRemoveAllChannelsResult` (no data).

---

Last updated: **May 28 2025**