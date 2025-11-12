# Mobile Push Notifications API for Dart SDK

Connect PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). See Mobile Push Notifications for details.

Requires Mobile Push Notifications add-on: Enable in the Admin Portal. See the support page for enabling add-ons.

Supported gateways: PushGateway.fcm (FCM) and PushGateway.apns2 (APNs). For APNs2, topic is required and environment is optional (development or production).

## Add device to channel

Enable mobile push notifications on the provided set of channels.

### Method(s)

```
`1pubnub.addPushChannels(  
2  String deviceId,  
3  PushGateway gateway,  
4  SetString> channels,  
5  {String? topic,  
6  Environment? environment,  
7  Keyset? keyset,  
8  String? using}  
9)   
`
```

Parameters:
- deviceId (String): ID of the device to add mobile push notifications on.
- gateway (PushGateway): Backend to use for push. Values: apns2, fcm.
- channels (Set<String>): Channels to enable.
- topic (String, APNs2 only): Notifications topic (typically app bundle identifier).
- environment (Environment, APNs2 only): APNs environment for managing device channel registrations.
- keyset (Keyset): Override the default keyset configuration.
- using (String): Keyset name from keysetStore to use for this call.

### Sample code

Reference code:

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Details for adding a device to push notifications  
14  String deviceId = 'A332C23D';  
15  SetString> channels = {'my_channel'};  
16    
17  // Adding device to channel using FCM  
18  try {  
19    await pubnub.addPushChannels(deviceId, PushGateway.fcm, channels);  
20    print('Device added to channels for FCM.');  
21  } catch (e) {  
22    print('Failed to add device to channels: $e');  
23  }  
24}  

```

### Returns

Does not return actionable data. Throws an exception on error.

## List channels for device

Request all channels with push notifications enabled for the specified device token.

### Method(s)

```
`1pubnub.listPushChannels(  
2  String deviceId,  
3  PushGateway gateway,  
4  {String? topic,  
5  Environment? environment,  
6  Keyset? keyset,  
7  String? using,  
8  String? start,  
9  int? count  
10  }  
11)   
`
```

Parameters:
- deviceId (String): Device ID to query.
- gateway (PushGateway): Backend to use for push. Values: apns2, fcm.
- topic (String, APNs2 only): Notifications topic.
- environment (Environment, APNs2 only): APNs environment context.
- keyset (Keyset): Override the default keyset configuration.
- using (String): Keyset name from keysetStore.
- start (String): Starting channel for pagination (use last channel from previous page).
- count (int): Number of channels to return (max 1000, default 500).

### Sample code

```
1// for non apns2  
2var result = await pubnub.listPushChannels('A332C23D', PushGateway.fcm);  
3
  
4// for apns2  
5var result = await pubnub.listPushChannels('device-token', PushGateway.apns2,  
6  topic: 'MyAppTopic', environment: Environment.development);  

```

### Returns

Returns ListPushChannelsResult with:
- channels (List): Channels associated for mobile push notifications.

## Remove device from channel

Disable mobile push notifications on the provided set of channels.

### Method(s)

```
`1pubnub.removePushChannels(  
2  String deviceId,  
3  PushGateway gateway,  
4  SetString> channels,  
5  {String? topic,  
6  Environment? environment,  
7  Keyset? keyset,  
8  String? using}  
9)   
`
```

Parameters:
- deviceId (String): Device ID to remove mobile push notifications from.
- gateway (PushGateway): Backend to use for push. Values: apns2, fcm.
- channels (Set<String>): Channels to remove.
- topic (String, APNs2 only): Notifications topic.
- environment (Environment, APNs2 only): APNs environment context.
- keyset (Keyset): Override the default keyset configuration.
- using (String): Keyset name from keysetStore.

### Sample code

```
`1// for non apns2  
2var result2 = await pubnub  
3  .removePushChannels('A332C23D', PushGateway.fcm, {'my_channel'});  
4      
5// for apns2  
6var result = await pubnub.removePushChannels(  
7  'device-token', PushGateway.apns2, {'my_channel'},  
8  topic: 'MyAppTopic', environment: Environment.development);  
`
```

### Returns

Does not return actionable data. Throws an exception on error.

## Remove all mobile push notifications

Disable mobile push notifications from all channels registered with the specified device token.

### Method(s)

```
`1pubnub.removeDevice(  
2  String deviceId,  
3  PushGateway gateway,  
4  {String? topic,  
5  Environment? environment,  
6  Keyset? keyset,  
7  String? using}  
8)   
`
```

Parameters:
- deviceId (String): Device ID to clear all mobile push registrations from.
- gateway (PushGateway): Backend to use for push. Values: apns2, fcm.
- topic (String, APNs2 only): Notifications topic.
- environment (Environment, APNs2 only): APNs environment context.
- keyset (Keyset): Override the default keyset configuration.
- using (String): Keyset name from keysetStore.

### Sample code

```
1// for non apns2  
2var result = await pubnub.removeDevice('deviceId', PushGateway.fcm);  
3
  
4// for apns2  
5var result = await pubnub.removeDevice('device-token', PushGateway.apns2,  
6  topic: 'MyAppTopic', environment: Environment.development);  

```

### Returns

Does not return actionable data. Throws an exception on error.

## Other examples

### Short syntax

```
1var device = pubnub.device('A332C23D');  
2
  
3// to register device for channels  
4var result = await device.registerToChannels({'my_channel'}, PushGateway.fcm);  
5
  
6// to remove device from channels  
7var result =  
8  await device.deregisterFromChannels({'my_channel'}, PushGateway.fcm);  
9
**10// to remove all registrations for a device  
11var result = await device.remove(PushGateway.apns2,  
12  topic: 'MyAppTopic', environment: Environment.production);  

```