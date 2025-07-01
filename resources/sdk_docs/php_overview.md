# PHP SDK 8.0.2 – Overview (Condensed)

## Prerequisites
• PHP 7.0+  
• Composer (recommended)  
• PubNub account with publish & subscribe keys

## Setup

### Get Keys
Create/locate a keyset in the PubNub Admin Portal; copy the **Publish** and **Subscribe** keys.

### Install SDK (latest version)
```bash
composer init          # if starting a new project
composer require pubnub/pubnub
```

## Steps

### 1. Initialize PubNub
```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

// Create a new configuration instance
$pnConfiguration = new PNConfiguration();

// Set subscribe key (required)
$pnConfiguration->setSubscribeKey("demo"); // Replace with your subscribe key

// Set publish key (only required if publishing)
```
show all 28 lines  

### 2. Set up Event & Status Listeners
```php
use PubNub\Callbacks\SubscribeCallback;
use PubNub\Enums\PNStatusCategory;

class MySubscribeCallback extends SubscribeCallback {
    function status($pubnub, $status) {
        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {
            // This event happens when radio / connectivity is lost
            echo "Unexpected disconnect - network may be down" . PHP_EOL;
        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory) {
            // Connect event. You can do stuff like publish, and know you'll get it
            echo "Connected to PubNub!" . PHP_EOL;
        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory) {
            // Handle message decryption error
```
show all 39 lines  

### 3. Subscribe
```php
// Subscribe to a channel
$pubnub->subscribe()
    ->channels("hello_world")
    ->withPresence(true)  // Optional: subscribe to presence events
    ->execute();
```

### 4. Publish
```php
use PubNub\Exceptions\PubNubServerException;
use PubNub\Exceptions\PubNubException;

// Assuming $pubnub is already initialized

try {
    // Create message data
    $messageData = [
        "text" => "Hello from PHP SDK!",
        "timestamp" => time(),
        "sender" => [
            "name" => "PHP Publisher",
            "id" => $pnConfiguration->getUserId()
```
show all 55 lines  

### 5. Run the App
Open two terminals:

Subscriber:
```bash
php subscribe.php
```
Publisher:
```bash
php publish.php
```

Successful output:
```text
Connected to PubNub!
Received message: {"text":"Hello from PHP SDK!","timestamp":1678912345,"sender":{"name":"PHP Publisher","id":"php-demo"}}
Publisher: php-publisher-demo
Channel: hello_world
Timetoken: 16789123450000000
```

## Complete Example

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
show all 58 lines  

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
show all 66 lines  

## Troubleshooting (quick reference)
• No connection → check keys, internet, firewall  
• Message not received → verify channel, run subscriber first  
• Build errors → ensure Composer install & PHP 7.0+  
• Script exits → web scripts may timeout; use CLI for long-running subscribe

## Next Steps
• Presence, Message Persistence, Access Manager  
• More samples: https://github.com/pubnub/php/tree/master/examples  
• API reference: /docs/sdks/php/api-reference/configuration