# Mobile Push Notifications API for Dart SDK

Connect PubNub publishing to third-party push services: Google Android FCM and Apple iOS APNs. Learn more: Mobile Push Notifications (/docs/general/push/send).

Prerequisite: Enable the Mobile Push Notifications add-on for your key in the Admin Portal (https://admin.pubnub.com/).

## Add device to channel

Enable mobile push notifications for a device on specified channels.

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
- deviceId (String): Device ID/token to enable notifications on.
- gateway (PushGateway): Backend to use; values: apns2, fcm.
- channels (Set<String>): Channels to enable notifications for.
- topic (String, optional): Required when gateway = apns2. Typically the iOS app bundle identifier.
- environment (Environment, optional): Applies only to apns2 (development or production).
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.

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

Get all channels where push is enabled for the specified device token.

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
- deviceId (String): Device ID/token to query.
- gateway (PushGateway): Backend; values: apns2, fcm.
- topic (String, optional): Required when gateway = apns2.
- environment (Environment, optional): Applies only to apns2.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.
- start (String, optional): Pagination start (use last channel from previous page).
- count (int, optional): Page size (max 1000, default 500).

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
- channels (List): Channels associated with the device for mobile push notifications.

## Remove device from channel

Disable mobile push notifications for a device on specific channels.

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
- deviceId (String): Device ID/token to remove from channels.
- gateway (PushGateway): Backend; values: apns2, fcm.
- channels (Set<String>): Channels to remove.
- topic (String, optional): Required when gateway = apns2.
- environment (Environment, optional): Applies only to apns2.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.

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

Disable mobile push notifications for a device across all channels.

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
- deviceId (String): Device ID/token to deregister.
- gateway (PushGateway): Backend; values: apns2, fcm.
- topic (String, optional): Required when gateway = apns2.
- environment (Environment, optional): Applies only to apns2.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.

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