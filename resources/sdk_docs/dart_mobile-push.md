On this page
# Mobile Push Notifications API for Dart SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

## Add Device to Channel[​](#add-device-to-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the Dart SDK:

```
`pubnub.addPushChannels(  
  String deviceId,  
  PushGateway gateway,  
  SetString> channels,  
  {String? topic,  
  Environment? environment,  
  Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`deviceId` *Type: `String`ID of the device to add mobile push notifications on.`gateway` *Type: `PushGateway`Enums for the back-end to use for push. Available values: `apns2` for APNs, `gcm` for FCM, and `mpns` for MPNS.`channels` *Type: `Set<String>`Channels to add mobile push notifications for.`topic`Type: `String`Notifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `gateway` set to `apns2`.`environment`Type: `Environment`Environment within which device should manage list of channels with enabled notifications (works only if `gateway` set to `apns2`).`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Device to Channel[​](#add-device-to-channel-1)

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Details for adding a device to push notifications  
  String deviceId = 'A332C23D';  
  SetString> channels = {'my_channel'};  
`
```
show all 24 lines

### Returns[​](#returns)

The `addPushChannels()` does not return actionable data. In case of an error, an exception with error details is thrown.

## List Channels For Device[​](#list-channels-for-device)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the Dart SDK:

```
`pubnub.listPushChannels(  
  String deviceId,  
  PushGateway gateway,  
  {String? topic,  
  Environment? environment,  
  Keyset? keyset,  
  String? using,  
  String? start,  
  int? count  
  }  
)   
`
```

*  requiredParameterDescription`deviceId` *Type: `String`ID of the device to add mobile push notifications on.`gateway` *Type: `PushGateway`The back-end to use for push. Available values: `apns2` for APNs, `gcm` for FCM, and `mpns` for MPNS.`topic`Type: `String`Notifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `pushType` set to `apns2`.`environment`Type: `Environment`Environment within which device should manage list of channels with enabled notifications (works only if `gateway` set to `apns2`).`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.`start`Type: `String`Starting channel for pagination. Use the last channel from the previous page request.`count`Type: `int`Number of channels to return for pagination. Max of 1000 tokens at a time. Defaults to 500.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`// for non apns2  
var result = await pubnub.listPushChannels('A332C23D', PushGateway.gcm);  
  
// for apns2  
var result = await pubnub.listPushChannels('device-token', PushGateway.apns2,  
  topic: 'MyAppTopic', environment: Environment.development);  
`
```

### Returns[​](#returns-1)

The `listPushChannels()` operation returns a `ListPushChannelsResult` which contains the following operations:

MethodDescription`channels`Type: `List`List of `channels` associated for mobile push notifications.

## Remove Device From Channel[​](#remove-device-from-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels.

### Method(s)[​](#methods-2)

To Removing Device From Channel you can use the following method(s) in the Dart SDK:

```
`pubnub.removePushChannels(  
  String deviceId,  
  PushGateway gateway,  
  SetString> channels,  
  {String? topic,  
  Environment? environment,  
  Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`deviceId` *Type: `String`ID of the device to remove mobile push notifications from.`gateway` *Type: `PushGateway`Enums for the back-end to use for push. Available values: `apns2` for APNs, `gcm` for FCM, and `mpns` for MPNS.`channels` *Type: `Set<String>`The channels to remove.`topic`Type: `String`Notifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `gateway` set to `apns2`.`environment`Type: `Environment`Environment within which device should manage list of channels with enabled notifications (works only if `gateway` set to `apns2`).`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`// for non apns2  
var result2 = await pubnub  
  .removePushChannels('A332C23D', PushGateway.gcm, {'my_channel'});  
      
// for apns2  
var result = await pubnub.removePushChannels(  
  'device-token', PushGateway.apns2, {'my_channel'},  
  topic: 'MyAppTopic', environment: Environment.development);  
`
```

### Returns[​](#returns-2)

The `removePushChannels()` doesn't return actionable data. In case of an error, an exception with error details is thrown.

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-3)

To `Remove all mobile push notifications` you can use the following method(s) in the Dart SDK:

```
`pubnub.removeDevice(  
  String deviceId,  
  PushGateway gateway,  
  {String? topic,  
  Environment? environment,  
  Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`deviceId` *Type: `String`ID of the device to remove mobile push notifications from.`gateway` *Type: `PushGateway`Enums for the back-end to use for push. Available values: `apns2` for APNs, `gcm` for FCM, and `mpns` for MPNS.`topic`Type: `String`Notifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `gateway` set to `apns2`.`environment`Type: `Environment`Environment within which device should manage list of channels with enabled notifications (works only if `gateway` set to `apns2`).`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`// for non apns2  
var result = await pubnub.removeDevice('deviceId', PushGateway.gcm);  
  
// for apns2  
var result = await pubnub.removeDevice('device-token', PushGateway.apns2,  
  topic: 'MyAppTopic', environment: Environment.development);  
`
```

### Returns[​](#returns-3)

The `removeDevice()` does not return actionable data. In case of an error, an exception with error details is thrown.

### Other Examples[​](#other-examples)

#### Short Syntax[​](#short-syntax)

```
`var device = pubnub.device('A332C23D');**  
// to register device for channels  
var result = await device.registerToChannels({'my_channel'}, PushGateway.gcm);  
  
// to remove device from channels  
var result =  
  await device.deregisterFromChannels({'my_channel'}, PushGateway.gcm);  
  
// to remove all registrations for a device  
var result = await device.remove(PushGateway.apns2,  
  topic: 'MyAppTopic', environment: Environment.production);  
`
```
Last updated on Mar 31, 2025**