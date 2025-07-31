# Mobile Push Notifications API – Dart SDK (condensed)

Mobile Push Notifications let PubNub publish directly to FCM (Android) and APNs (iOS).  
Requires the *Mobile Push Notifications* add-on enabled for your key in the Admin Portal.

---

## Add device to channels

```dart
pubnub.addPushChannels(
  String deviceId,
  PushGateway gateway,
  Set<String> channels, {
  String? topic,           // APNs2 only
  Environment? environment,// APNs2 only
  Keyset? keyset,
  String? using
})
```

Parameters  
• `deviceId` String – Device token / FCM registration ID  
• `gateway` PushGateway – `apns2`, `gcm`, `mpns`  
• `channels` Set<String> – Channels to enable  
• `topic` String – APNs bundle ID (APNs2 only)  
• `environment` Environment – `production` | `development` (APNs2 only)  
• `keyset`, `using` – Optional keyset overrides  

Returns: void (throws on error)

Sample

```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  final pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey:  'demo',
      userId:      UserId('myUniqueUserId'),
    ),
  );

  await pubnub.addPushChannels(
    'A332C23D',
    PushGateway.gcm,
    {'my_channel'},
  );
}
```

---

## List channels for device

```dart
pubnub.listPushChannels(
  String deviceId,
  PushGateway gateway, {
  String? topic,           // APNs2 only
  Environment? environment,// APNs2 only
  Keyset? keyset,
  String? using,
  String? start,           // pagination
  int?    count            // max 1000, default 500
})
```

Returns: `ListPushChannelsResult`  
• `channels` List<String>

Sample

```dart
// FCM
var res = await pubnub.listPushChannels('A332C23D', PushGateway.gcm);

// APNs2
var res = await pubnub.listPushChannels(
  'device-token',
  PushGateway.apns2,
  topic: 'MyAppTopic',
  environment: Environment.development,
);
```

---

## Remove device from channels

```dart
pubnub.removePushChannels(
  String deviceId,
  PushGateway gateway,
  Set<String> channels, {
  String? topic,           // APNs2 only
  Environment? environment,// APNs2 only
  Keyset? keyset,
  String? using
})
```

Returns: void (throws on error)

Sample

```dart
// FCM
await pubnub.removePushChannels(
  'A332C23D',
  PushGateway.gcm,
  {'my_channel'},
);

// APNs2
await pubnub.removePushChannels(
  'device-token',
  PushGateway.apns2,
  {'my_channel'},
  topic: 'MyAppTopic',
  environment: Environment.development,
);
```

---

## Remove all mobile push registrations for device

```dart
pubnub.removeDevice(
  String deviceId,
  PushGateway gateway, {
  String? topic,           // APNs2 only
  Environment? environment,// APNs2 only
  Keyset? keyset,
  String? using
})
```

Returns: void (throws on error)

Sample

```dart
// FCM
await pubnub.removeDevice('deviceId', PushGateway.gcm);

// APNs2
await pubnub.removeDevice(
  'device-token',
  PushGateway.apns2,
  topic: 'MyAppTopic',
  environment: Environment.development,
);
```

---

## Alternative short syntax

```dart
var device = pubnub.device('A332C23D');

// Register
await device.registerToChannels({'my_channel'}, PushGateway.gcm);

// Deregister specific channels
await device.deregisterFromChannels({'my_channel'}, PushGateway.gcm);

// Remove all registrations
await device.remove(
  PushGateway.apns2,
  topic: 'MyAppTopic',
  environment: Environment.production,
);
```

_Last updated: Jul 15 2025_