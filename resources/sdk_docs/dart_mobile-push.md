# Mobile Push Notifications API for Dart SDK

Connect PubNub publishing to native push services: Google FCM and Apple APNs. Requires the Mobile Push Notifications add-on enabled for your key in the Admin Portal: https://admin.pubnub.com/ (How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

## Add device to channel

Enable mobile push notifications on a set of channels.

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
- gateway (PushGateway): Backend for push. Values: apns2 (APNs), fcm (FCM).
- channels (Set<String>): Channels to enable mobile push notifications for.
- topic (String, APNs only): Notifications topic (typically the app bundle identifier). Required when gateway = apns2.
- environment (Environment, APNs only): Environment (development or production) for apns2 registrations.
- keyset (Keyset): Override the default PubNub keyset.
- using (String): Name of the keyset in keysetStore to use for this call.

### Sample code

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

No actionable data. Throws an exception on error.

## List channels for device

List channels where push notifications are enabled for a device (push token).

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
- deviceId (String): Device ID (push token).
- gateway (PushGateway): Backend for push. Values: apns2, fcm.
- topic (String, APNs only): Topic (bundle identifier). Required when pushType/gateway = apns2.
- environment (Environment, APNs only): APNs environment.
- keyset (Keyset): Override default keyset.
- using (String): Name of the keyset in keysetStore to use for this call.
- start (String): Starting channel for pagination; use the last channel from the previous page.
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

ListPushChannelsResult:
- channels (List): Channels registered for mobile push notifications.

## Remove device from channel

Disable mobile push notifications on the provided channels.

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
- deviceId (String): Device ID to remove from channels.
- gateway (PushGateway): apns2 or fcm.
- channels (Set<String>): Channels to remove.
- topic (String, APNs only): Topic; required when gateway = apns2.
- environment (Environment, APNs only): APNs environment.
- keyset (Keyset): Override default keyset.
- using (String): Keyset name in keysetStore to use.

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

No actionable data. Throws an exception on error.

## Remove all mobile push notifications

Disable mobile push notifications from all channels for the device.

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
- deviceId (String): Device ID to remove.
- gateway (PushGateway): apns2 or fcm.
- topic (String, APNs only): Topic; required when gateway = apns2.
- environment (Environment, APNs only): APNs environment.
- keyset (Keyset): Override default keyset.
- using (String): Keyset name in keysetStore to use.

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

No actionable data. Throws an exception on error.

### Other examples

#### Short syntax

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

Last updated on Nov 6, 2025**