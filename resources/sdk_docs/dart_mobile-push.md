# Mobile Push Notifications – PubNub Dart SDK (Concise Reference)

> All operations below require the **Mobile Push Notifications** add-on to be enabled for the keyset.

---

## Add Device to Channel

### Method
```dart
pubnub.addPushChannels(
  String deviceId,
  PushGateway gateway,
  Set<String> channels, {
  String? topic,
  Environment? environment,
  Keyset? keyset,
  String? using,
})
```

Parameters  
• `deviceId` (String) – Target device ID  
• `gateway` (PushGateway) – `apns2`, `gcm`, or `mpns`  
• `channels` (Set<String>) – Channels to enable  
• `topic` (String) – iOS bundle ID (APNs2 only)  
• `environment` (Environment) – `development` / `production` (APNs2 only)  
• `keyset` (Keyset) – Override default keyset  
• `using` (String) – Named keyset from `keysetStore`

Returns – void (throws on error)

#### Example
```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      userId: UserId('myUniqueUserId'),
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

## List Channels for Device

### Method
```dart
pubnub.listPushChannels(
  String deviceId,
  PushGateway gateway, {
  String? topic,
  Environment? environment,
  Keyset? keyset,
  String? using,
  String? start,
  int? count,
})
```

Parameters  
• `deviceId`, `gateway`, `topic`, `environment`, `keyset`, `using` – same meaning as above  
• `start` (String) – Pagination cursor (last channel from previous page)  
• `count` (int) – Page size (1-1000, default 500)

Returns – `ListPushChannelsResult`  
• `channels` (List<String>) – Channels with push enabled

#### Example
```dart
// non-APNs2
var result = await pubnub.listPushChannels('A332C23D', PushGateway.gcm);

// APNs2
var result = await pubnub.listPushChannels(
  'device-token',
  PushGateway.apns2,
  topic: 'MyAppTopic',
  environment: Environment.development,
);
```

---

## Remove Device From Channel

### Method
```dart
pubnub.removePushChannels(
  String deviceId,
  PushGateway gateway,
  Set<String> channels, {
  String? topic,
  Environment? environment,
  Keyset? keyset,
  String? using,
})
```

Parameters – same as *Add Device to Channel*

Returns – void (throws on error)

#### Example
```dart
// non-APNs2
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

## Remove All Mobile Push Notifications (Device Deregistration)

### Method
```dart
pubnub.removeDevice(
  String deviceId,
  PushGateway gateway, {
  String? topic,
  Environment? environment,
  Keyset? keyset,
  String? using,
})
```

Parameters – same as above  
Returns – void (throws on error)

#### Example
```dart
// non-APNs2
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

## Short Syntax Helpers
```dart
var device = pubnub.device('A332C23D');

// register device
await device.registerToChannels({'my_channel'}, PushGateway.gcm);

// remove from channels
await device.deregisterFromChannels({'my_channel'}, PushGateway.gcm);

// remove all registrations
await device.remove(
  PushGateway.apns2,
  topic: 'MyAppTopic',
  environment: Environment.production,
);
```

_Last updated: Mar 31 2025_