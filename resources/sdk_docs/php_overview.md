# PHP SDK 8.0.2 – Overview (Condensed)

This page shows the minimum you need to:

1. Install the SDK  
2. Configure a client  
3. Add listeners  
4. Subscribe / Publish  
5. Run a complete example

All code blocks, method signatures, and parameters are unchanged.

---

## Prerequisites
* PHP ≥ 7.0  
* Composer  
* PubNub account (publish & subscribe keys)

---

## 1. Get Keys
Create or open an app in the PubNub Admin Portal, then copy its **Publish** and **Subscribe** keys.

---

## 2. Install SDK
```
composer init
```
```
composer require pubnub/pubnub
```

---

## 3. Initialize PubNub
```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

// Create a new configuration instance
$pnConfiguration = new PNConfiguration();

// Set subscribe key (required)
$pnConfiguration->setSubscribeKey("demo"); // ← replace

// Set publish key (only required if publishing)
```
(See /docs/sdks/php/api-reference/configuration for all options.)

---

## 4. Event & Status Listeners
```php
use PubNub\Callbacks\SubscribeCallback;
use PubNub\Enums\PNStatusCategory;

class MySubscribeCallback extends SubscribeCallback {
    function status($pubnub, $status) {
        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {
            echo "Unexpected disconnect - network may be down" . PHP_EOL;
        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory) {
            echo "Connected to PubNub!" . PHP_EOL;
        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory) {
            // Handle message decryption error
```
(Full listener details: /docs/sdks/php/api-reference/configuration#event-listeners)

---

## 5. Subscribe
```php
// Subscribe to a channel
$pubnub->subscribe()
    ->channels("hello_world")
    ->withPresence(true)  // optional
    ->execute();
```
Subscription is a long-running (blocking) call.

---

## 6. Publish
```php
use PubNub\Exceptions\PubNubServerException;
use PubNub\Exceptions\PubNubException;

// Assuming $pubnub is already initialized
try {
    // Create message data
    $messageData = [
        "text"      => "Hello from PHP SDK!",
        "timestamp" => time(),
        "sender"    => [
            "name" => "PHP Publisher",
            "id"   => $pnConfiguration->getUserId()
```
Messages must be JSON-serializable and < 32 KiB.

---

## 7. Run the App
Terminal 1 – subscriber:
```
php subscribe.php
```
Terminal 2 – publisher:
```
php publish.php
```
Expected output:
```
Connected to PubNub!
Received message: {"text":"Hello from PHP SDK!", ... }
```

---

## 8. Complete Example

### subscribe.php
```php
require_once 'vendor/autoload.php';

use PubNub\PubNub;
use PubNub\Enums\PNStatusCategory;
use PubNub\Callbacks\SubscribeCallback;
use PubNub\PNConfiguration;

// Create configuration
$pnConfiguration = new PNConfiguration();
$pnConfiguration->setSubscribeKey("demo");
$pnConfiguration->setPublishKey("demo");
$pnConfiguration->setUserId("php-sdk-subscriber");
```
(remaining lines unchanged)

### publish.php
```php
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;
use PubNub\Exceptions\PubNubServerException;
use PubNub\Exceptions\PubNubException;

// Create configuration with demo keys
$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setUserId("php-publisher-demo");
```
(remaining lines unchanged)

---

## Troubleshooting (quick list)
* No connection → verify keys, internet, firewall  
* No message → check channel name, ensure subscriber is running  
* Build errors → PHP ≥ 7, correct Composer install/imports  
* Script exits → avoid web time-outs for long subscriptions

---

## Next Steps
Presence, Message Persistence, Access Manager, additional examples and API reference are linked in the original docs.