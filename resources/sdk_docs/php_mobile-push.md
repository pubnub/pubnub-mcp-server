On this page
# Mobile Push Notifications API for PHP SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

## Add Device to Channel[​](#add-device-to-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the PHP SDK:

```
`$pubnub->addChannelsToPush()  
    ->pushType(PNPushType)  
    ->channels(array)  
    ->deviceId(string)  
    ->sync();  
`
```

*  requiredParameterDescription`pushType` *Type: PNPushTypeDefault:  
`Not set`Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.`channels` *Type: ArrayDefault:  
n/aAdd mobile push notifications on the specified channels.`deviceId` *Type: StringDefault:  
n/aDevice ID.`environment`Type: StringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` set to `apns2`).`topic`Type: StringDefault:  
n/aNotifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `pushGateway` set to `apns2`.

### Basic Usage[​](#basic-usage)

#### Add Device to Channel[​](#add-device-to-channel-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Enums\PNPushType;  
use PubNub\Exceptions\PubNubServerException;  
  
// Create configuration with demo keys  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-push-demo-user");  
`
```
show all 60 lines

#### Add Device to Channel (APNS2)[​](#add-device-to-channel-apns2)

```
`use PubNub\Enums\PNPushType;  
  
$pubnub->addChannelsToPush()  
    ->pushType(PNPushType::APNS2)  
    ->channels(["ch1", "ch2", "ch3"])  
    ->deviceId("deviceId")  
    ->environment("production")  
    ->topic("bundle-identifier")  
    ->sync();  
`
```

## List Channels For Device[​](#list-channels-for-device)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the PHP SDK:

```
`$pubnub->listPushProvisions()  
    ->pushType(PNPushType)  
    ->deviceId(string)  
    ->sync();  
`
```

*  requiredParameterDescription`pushType` *Type: PNPushTypeDefault:  
`Not set`Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.`deviceId` *Type: StringDefault:  
n/aDevice ID.`environment`Type: StringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` set to `apns2`).`topic`Type: StringDefault:  
n/aNotifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `pushGateway` set to `apns2`.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`$pubnub->arrayPushProvisions()  
    ->pushType(PNPushType::FCM)  
    ->deviceId("deviceId")  
    ->sync();  
`
```

#### List Channels For Device(APNS2)[​](#list-channels-for-deviceapns2)

```
`$pubnub->arrayPushProvisions()  
    ->pushType(PNPushType::APNS2)  
    ->deviceId("deviceId")  
    ->topic("myapptopic")  
    ->environment("production")  
    ->sync();  
`
```

### Response[​](#response)

MethodDescription`getChannels()`Type: ArrayList of `channels` associated for mobile push notifications.

## Remove Device From Channel[​](#remove-device-from-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels. If `nil` will be passed as channels then client will remove mobile push notifications from all channels which associated with `pushToken`.

### Method(s)[​](#methods-2)

To run `Removing Device From Channel` you can use the following method(s) in the PHP SDK:

```
`$pubnub->removeChannelsFromPush()  
    ->pushType(PNPushType)  
    ->channels(string|array)  
    ->deviceId(string)  
    ->sync();  
`
```

*  requiredParameterDescription`pushType` *Type: PNPushTypeDefault:  
`Not set`Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.`channels` *Type: String|ArrayDefault:  
n/aRemove mobile push notifications from the specified channels.`deviceId` *Type: StringDefault:  
n/aDevice ID.`environment`Type: StringDefault:  
`development`Environment within which device should manage list of channels with enabled notifications (works only if `pushGateway` set to `apns2`).`topic`Type: StringDefault:  
n/aNotifications topic name (usually it is bundle identifier of application for Apple platform). Required only if `pushGateway` set to `apns2`.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`use PubNub\Enums\PNPushType;  
  
$pubnub->removeChannelsFromPush()  
    ->pushType(PNPushType::FCM)  
    ->channels(["ch1", "ch2", "ch3"])  
    ->deviceId("deviceId")  
    ->sync();  
`
```

#### Remove Device From Channel(APNS2)[​](#remove-device-from-channelapns2)

```
`use PubNub\Enums\PNPushType;  
  
$pubnub->removeChannelsFromPush()  
    ->pushType(PNPushType::APNS2)  
    ->channels(["ch1", "ch2", "ch3"])  
    ->deviceId("deviceId")  
    ->topic("myapptopic")  
    ->environment("production")  
    ->sync();  
`
```

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified push token.

### Method(s)[​](#methods-3)

To run `Remove all push channels from device`, you can use the following method(s) in the PHP SDK:

```
`$pubnub->removeAllPushChannelsForDevice()  
    ->pushType(PNPushType)  
    ->deviceId(string)  
    ->sync();  
`
```

*  requiredParameterDescription`pushType` *Type: PNPushTypeDefault:  
`Not set`Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.`deviceId` *Type: StringDefault:  
n/aDevice ID.

### Basic Usage[​](#basic-usage-3)

#### Remove all push channels from device[​](#remove-all-push-channels-from-device)

```
`use PubNub\Enums\PNPushType;  
  
// For APNs2  
$pubnub->removeAllPushChannelsForDevice()  
    ->pushType(PNPushType::APNS2)  
    ->deviceId("yourDeviceId")  
    ->sync();  
  
// For FCM  
$pubnub->removeAllPushChannelsForDevice()  
    ->pushType(PNPushType::FCM)  
    ->deviceId("yourDeviceId")  
    ->sync();  
`
```

### Response[​](#response-1)

The `sync()` method returns a response indicating the success or failure of the operation. This could be a status code, boolean, or detailed object, depending on the implementation.

```
`$response = $pubnub->removeAllPushChannelsForDevice()**    ->pushType(PNPushType::APNS2)  
    ->deviceId("yourDeviceId")  
    ->sync();  
  
if ($response->isSuccessful()) {  
    echo "Successfully removed all push channels from device.";  
} else {  
    echo "Failed to remove push channels. Error: " . $response->getError();  
}  
`
```
Last updated on Apr 2, 2025**