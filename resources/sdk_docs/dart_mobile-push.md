# Mobile Push Notifications API for Dart SDK

Connect native PubNub publishing to third-party push services: Google Android FCM and Apple iOS APNs. Learn more: Mobile Push Notifications (/docs/general/push/send).

## Add device to channel

Requires Mobile Push Notifications add-on (enable in Admin Portal: https://admin.pubnub.com/).

Enable mobile push notifications for a device on specific channels.

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
- deviceId (String): Device ID to enable push notifications.
- gateway (PushGateway): Push back-end. Values: apns2 (APNs), gcm (FCM), mpns (MPNS).
- channels (Set<String>): Channels to enable.
- topic (String, optional): Required for apns2. Typically the iOS app bundle identifier.
- environment (Environment, optional): apns2 only. APNs environment.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.

### Sample code

#### Add device to channel

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
19    await pubnub.addPushChannels(deviceId, PushGateway.gcm, channels);  
20    print('Device added to channels for FCM.');  
21  } catch (e) {  
22    print('Failed to add device to channels: $e');  
23  }  
24}  

```

### Returns

No actionable data. Throws an exception on error.

## List channels for device

Requires Mobile Push Notifications add-on (enable in Admin Portal).

List all channels where push notifications are enabled for a device.

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
- deviceId (String): Device ID.
- gateway (PushGateway): apns2, gcm, or mpns.
- topic (String, optional): Required for apns2.
- environment (Environment, optional): apns2 only.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.
- start (String, optional): Pagination start (use last channel from previous page).
- count (int, optional): Page size (max 1000, default 500).

### Sample code

#### List channels for device

```
1// for non apns2  
2var result = await pubnub.listPushChannels('A332C23D', PushGateway.gcm);  
3
  
4// for apns2  
5var result = await pubnub.listPushChannels('device-token', PushGateway.apns2,  
6  topic: 'MyAppTopic', environment: Environment.development);  

```

### Returns

ListPushChannelsResult:
- channels (List): Channels associated with mobile push notifications.

## Remove device from channel

Requires Mobile Push Notifications add-on (enable in Admin Portal).

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
- deviceId (String): Device ID to remove from channels.
- gateway (PushGateway): apns2, gcm, or mpns.
- channels (Set<String>): Channels to remove.
- topic (String, optional): Required for apns2.
- environment (Environment, optional): apns2 only.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.

### Sample code

#### Remove device from channel

```
`1// for non apns2  
2var result2 = await pubnub  
3  .removePushChannels('A332C23D', PushGateway.gcm, {'my_channel'});  
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

Requires Mobile Push Notifications add-on (enable in Admin Portal).

Disable mobile push notifications for a device on all channels.

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
- deviceId (String): Device ID to deregister.
- gateway (PushGateway): apns2, gcm, or mpns.
- topic (String, optional): Required for apns2.
- environment (Environment, optional): apns2 only.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Keyset name from keysetStore.

### Sample code

#### Remove all mobile push notifications

```
1// for non apns2  
2var result = await pubnub.removeDevice('deviceId', PushGateway.gcm);  
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
4var result = await device.registerToChannels({'my_channel'}, PushGateway.gcm);  
5
  
6// to remove device from channels  
7var result =  
8  await device.deregisterFromChannels({'my_channel'}, PushGateway.gcm);  
9
**10// to remove all registrations for a device  
11var result = await device.remove(PushGateway.apns2,  
12  topic: 'MyAppTopic', environment: Environment.production);  

```

Last updated on Oct 29, 2025