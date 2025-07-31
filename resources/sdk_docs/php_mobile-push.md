# Mobile Push Notifications API – PHP SDK (mobile-push)

Prerequisite  
• Mobile Push Notifications add-on must be enabled for your keys in the Admin Portal.

PNPushType values  
• `PNPushType::GCM` (FCM)  
• `PNPushType::APNS2`

---

## Add device to channel

Enables push notifications for a device on the specified channels.

```php
$pubnub->addChannelsToPush()
    ->pushType(PNPushType)
    ->channels(array)
    ->deviceId(string)
    ->sync();
```

Parameters  
• pushType (PNPushType) – required  
• channels (array) – channels to enable  
• deviceId (string) – device token/ID  
• environment (string, default "development") – APNS2 only  
• topic (string) – APNS2 only

Reference snippet

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

APNS2 example

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

---

## List channels for device

Returns all channels with push enabled for the specified device.

```php
$pubnub->listPushProvisions()
    ->pushType(PNPushType)
    ->deviceId(string)
    ->sync();
```

Parameters  
• pushType (PNPushType) – required  
• deviceId (string) – required  
• environment / topic – APNS2 only (same as above)

Samples

```
`$pubnub->arrayPushProvisions()  
    ->pushType(PNPushType::FCM)  
    ->deviceId("deviceId")  
    ->sync();  
`
```

```
`$pubnub->arrayPushProvisions()  
    ->pushType(PNPushType::APNS2)  
    ->deviceId("deviceId")  
    ->topic("myapptopic")  
    ->environment("production")  
    ->sync();  
`
```

Response method  
• `getChannels(): array` – list of channels

---

## Remove device from channel(s)

Disables push notifications for the device on the specified channels (or all if no channel list supplied).

```php
$pubnub->removeChannelsFromPush()
    ->pushType(PNPushType)
    ->channels(string|array)   // optional
    ->deviceId(string)
    ->sync();
```

Parameters identical to “Add device”.

FCM example

```
`use PubNub\Enums\PNPushType;  
  
$pubnub->removeChannelsFromPush()  
    ->pushType(PNPushType::FCM)  
    ->channels(["ch1", "ch2", "ch3"])  
    ->deviceId("deviceId")  
    ->sync();  
`
```

APNS2 example

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

---

## Remove all mobile push notifications

Removes the device from every push-enabled channel.

```php
$pubnub->removeAllPushChannelsForDevice()
    ->pushType(PNPushType)
    ->deviceId(string)
    ->sync();
```

Sample

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

Response example

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

_Last updated Jul 15 2025_