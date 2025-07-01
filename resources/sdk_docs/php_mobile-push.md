# Mobile Push Notifications API – PHP SDK (Mobile-Push)

Enables PubNub to work with APNs (v1/APNS2) and FCM/FCM (legacy GCM).  
All methods require the **Mobile Push Notifications** add-on to be enabled for the key.

---

## Add Device to Channel

Enables push notifications for a device on specific channels.

### Method

```
`$pubnub->addChannelsToPush()  
    ->pushType(PNPushType)          // PNPushType::FCM | PNPushType::APNS2  
    ->channels(array)               // ["ch1", …] (required)  
    ->deviceId(string)              // push token / device ID (required)  
    ->environment("development")    // APNS2 only: "development" | "production"  
    ->topic("bundle-identifier")     // APNS2 only (required for APNS2)  
    ->sync();`  
```

### Examples

Reference (truncated):

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

APNS2:

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

## List Channels for Device

Returns all channels on which the specified device receives push notifications.

### Method

```
`$pubnub->listPushProvisions()  
    ->pushType(PNPushType)          // PNPushType::FCM | PNPushType::APNS2  
    ->deviceId(string)              // push token / device ID (required)  
    ->environment("development")    // APNS2 only  
    ->topic("bundle-identifier")     // APNS2 only (required)  
    ->sync();`  
```

### Examples

FCM:

```
`$pubnub->arrayPushProvisions()  
    ->pushType(PNPushType::FCM)  
    ->deviceId("deviceId")  
    ->sync();  
`
```

APNS2:

```
`$pubnub->arrayPushProvisions()  
    ->pushType(PNPushType::APNS2)  
    ->deviceId("deviceId")  
    ->topic("myapptopic")  
    ->environment("production")  
    ->sync();  
`
```

### Response

`getChannels()` → `array` of subscribed channels.

---

## Remove Device from Channel

Disables push notifications for a device on one or more channels (or all channels when `channels` is omitted).

### Method

```
`$pubnub->removeChannelsFromPush()  
    ->pushType(PNPushType)          // PNPushType::FCM | PNPushType::APNS2  
    ->channels(string|array|null)   // ["ch1", …] | null  
    ->deviceId(string)              // push token / device ID (required)  
    ->environment("development")    // APNS2 only  
    ->topic("bundle-identifier")     // APNS2 only (required)  
    ->sync();`  
```

### Examples

FCM:

```
`use PubNub\Enums\PNPushType;  
  
$pubnub->removeChannelsFromPush()  
    ->pushType(PNPushType::FCM)  
    ->channels(["ch1", "ch2", "ch3"])  
    ->deviceId("deviceId")  
    ->sync();  
`
```

APNS2:

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

## Remove All Mobile Push Notifications for Device

Removes the device from every push-enabled channel.

### Method

```
`$pubnub->removeAllPushChannelsForDevice()  
    ->pushType(PNPushType)          // PNPushType::FCM | PNPushType::APNS2  
    ->deviceId(string)              // push token / device ID (required)  
    ->sync();`  
```

### Example

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

### Response

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

_Last updated Apr 2, 2025_