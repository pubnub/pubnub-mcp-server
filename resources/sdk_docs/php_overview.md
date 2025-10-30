# PHP API & SDK Docs 8.0.2

Core concepts demonstrated:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview

Get up and running with PubNub in PHP (CLI or web). Connect, subscribe to channels, and publish messages. Notes call out environment-specific considerations where relevant.

## Prerequisites

- PHP 7.0+ (CLI or web server)
- Composer (recommended) or manual dependency management
- PubNub account and keyset
- Basic PHP knowledge

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app and use its keyset.
- Use separate keysets for dev/prod when possible.

### Install the SDK

##### SDK version

Use the latest SDK for features and security.

For a fresh project:

```
`1composer init  
`
```

Add the PubNub PHP SDK (new or existing Composer projects):

```
`1composer require pubnub/pubnub‌  
`
```

## Steps

### Initialize PubNub

```
1  
2
  
3// Include Composer autoloader (adjust path if needed)  
4require_once 'vendor/autoload.php';  
5
  
6use PubNub\PNConfiguration;  
7use PubNub\PubNub;  
8
  
9// Create a new configuration instance  
10$pnConfiguration = new PNConfiguration();  
11
  
12// Set subscribe key (required)  
13$pnConfiguration->setSubscribeKey("demo"); // Replace with your subscribe key  
14
  
15// Set publish key (only required if publishing)  
16$pnConfiguration->setPublishKey("demo"); // Replace with your publish key  
17
  
18// Set UUID (required to connect)  
19$pnConfiguration->setUserId("php-sdk-user-" . uniqid());  
20
  
21// Set up cryptography for message encryption (optional)  
22// $pnConfiguration->setCryptoModule(CryptoModule::aesCbcCryptor("your-cipher-key", true));  
23
  
24// Configure connection timeout in seconds  
25$pnConfiguration->setConnectTimeout(10);  
26
  
27// Create PubNub instance with the configured settings  
28$pubnub = new PubNub($pnConfiguration);  
```

See Configuration docs for more options.

### Set up event listeners

Status listener: connection state and operational events  
Event listener: messages and presence events

```
1  
2
  
3use PubNub\Callbacks\SubscribeCallback;  
4use PubNub\Enums\PNStatusCategory;  
5
  
6class MySubscribeCallback extends SubscribeCallback {  
7    function status($pubnub, $status) {  
8        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {  
9            // This event happens when radio / connectivity is lost  
10            echo "Unexpected disconnect - network may be down" . PHP_EOL;  
11        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory) {  
12            // Connect event. You can do stuff like publish, and know you'll get it  
13            echo "Connected to PubNub!" . PHP_EOL;  
14        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory) {  
15            // Handle message decryption error  
16            echo "Decryption error: " . $status->getException() . PHP_EOL;  
17        }  
18    }   
19
  
20    function message($pubnub, $message) {  
21        // Handle new message stored in message.message  
22        echo "Received message: " . json_encode($message->getMessage()) . PHP_EOL;  
23        echo "Publisher: " . $message->getPublisher() . PHP_EOL;  
24        echo "Channel: " . $message->getChannel() . PHP_EOL;  
25        echo "Timetoken: " . $message->getTimetoken() . PHP_EOL;  
26    }  
27
  
28    function presence($pubnub, $presence) {  
29        // Handle incoming presence data  
30        echo "Presence event: " . $presence->getEvent() . PHP_EOL;  
31        echo "UUID: " . $presence->getUuid() . PHP_EOL;  
32        echo "Channel: " . $presence->getChannel() . PHP_EOL;  
33        echo "Occupancy: " . $presence->getOccupancy() . PHP_EOL;  
34    }  
35}  
36
  
37// Add listener  
38$subscribeCallback = new MySubscribeCallback();  
39$pubnub->addListener($subscribeCallback);  
```

### Create a subscription

```
`1// Subscribe to a channel  
2$pubnub->subscribe()  
3    ->channels("hello_world")  
4    ->withPresence(true)  // Optional: subscribe to presence events  
5    ->execute();  
`
```

Note: subscribe() blocks (long-running). For web apps, consider background processes, SSE/AJAX, or the JavaScript SDK.

### Publish messages

Messages must be JSON-serializable and <= 32 KiB.

```
1  
2
  
3use PubNub\Exceptions\PubNubServerException;  
4use PubNub\Exceptions\PubNubException;  
5
  
6// Assuming $pubnub is already initialized  
7
  
8try {  
9    // Create message data  
10    $messageData = [  
11        "text" => "Hello from PHP SDK!",  
12        "timestamp" => time(),  
13        "sender" => [  
14            "name" => "PHP Publisher",  
15            "id" => $pnConfiguration->getUserId()  
16        ]  
17    ];  
18
  
19    // Publish a message to a channel  
20    $result = $pubnub->publish()  
21        ->channel("hello_world")              // Channel to publish to  
22        ->message($messageData)               // Message content  
23        ->shouldStore(true)                   // Store in history  
24        ->sync();                             // Execute synchronously  
25
  
26    // Display success message  
27    echo "Message published successfully!" . PHP_EOL;  
28    echo "Timetoken: " . $result->getTimetoken() . PHP_EOL;  
29
  
30    // Convert timetoken to readable date  
31    $timestamp = floor($result->getTimetoken() / 10000000);  
32    $readableDate = date('Y-m-d H:i:s', $timestamp);  
33    echo "Published at: " . $readableDate . PHP_EOL;  
34
  
35    // Display published message  
36    echo PHP_EOL . "Published message: " . PHP_EOL;  
37    echo json_encode($messageData, JSON_PRETTY_PRINT) . PHP_EOL;  
38} catch (PubNubServerException $exception) {  
39    // Handle PubNub server-specific errors  
40    echo "Error publishing message: " . $exception->getMessage() . PHP_EOL;  
41
  
42    if (method_exists($exception, 'getServerErrorMessage') && $exception->getServerErrorMessage()) {  
43        echo "Server Error: " . $exception->getServerErrorMessage() . PHP_EOL;  
44    }  
45
  
46    if (method_exists($exception, 'getStatusCode') && $exception->getStatusCode()) {  
47        echo "Status Code: " . $exception->getStatusCode() . PHP_EOL;  
48    }  
49} catch (PubNubException $exception) {  
50    // Handle PubNub-specific errors  
51    echo "PubNub Error: " . $exception->getMessage() . PHP_EOL;  
52} catch (Exception $exception) {  
53    // Handle general exceptions  
54    echo "Error: " . $exception->getMessage() . PHP_EOL;  
55}  
```

### Run the app

Open two terminals.

Subscriber:

```
`php subscribe.php  
`
```

Publisher:

```
`php publish.php  
`
```

Expected output on connect:

```
`Connected to PubNub!  
`
```

Example received message:

```
`Received message: {"text":"Hello from PHP SDK!","timestamp":1678912345,"sender":{"name":"PHP Publisher","id":"php-demo"}}  
Publisher: php-publisher-demo  
Channel: hello_world  
Timetoken: 16789123450000000  
`
```

##### Web environment

For browser real-time updates, use the JavaScript SDK or implement polling/history retrieval.

## Complete example

#### `subscribe.php`

```
1  
2
  
3require_once 'vendor/autoload.php';  
4
  
5use PubNub\PubNub;  
6use PubNub\Enums\PNStatusCategory;  
7use PubNub\Callbacks\SubscribeCallback;  
8use PubNub\PNConfiguration;  
9
  
10// Create configuration  
11$pnConfiguration = new PNConfiguration();  
12$pnConfiguration->setSubscribeKey("demo");  
13$pnConfiguration->setPublishKey("demo");  
14$pnConfiguration->setUserId("php-sdk-subscriber");  
15
  
16// Create PubNub instance  
17$pubnub = new PubNub($pnConfiguration);  
18
  
19class MySubscribeCallback extends SubscribeCallback {  
20    function status($pubnub, $status) {  
21        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {  
22            // This event happens when radio / connectivity is lost  
23            echo "Unexpected disconnect - network may be down" . PHP_EOL;  
24        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory) {  
25            // Connect event. You can do stuff like publish, and know you'll get it  
26            echo "Connected to PubNub!" . PHP_EOL;  
27        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory) {  
28            // Handle message decryption error  
29            echo "Decryption error: " . $status->getException() . PHP_EOL;  
30        }  
31    }   
32
  
33    function message($pubnub, $message) {  
34        // Handle new message stored in message.message  
35        echo "Received message: " . json_encode($message->getMessage()) . PHP_EOL;  
36        echo "Publisher: " . $message->getPublisher() . PHP_EOL;  
37        echo "Channel: " . $message->getChannel() . PHP_EOL;  
38        echo "Timetoken: " . $message->getTimetoken() . PHP_EOL;  
39    }  
40
  
41    function presence($pubnub, $presence) {  
42        // Handle incoming presence data  
43        echo "Presence event: " . $presence->getEvent() . PHP_EOL;  
44        echo "UUID: " . $presence->getUuid() . PHP_EOL;  
45        echo "Channel: " . $presence->getChannel() . PHP_EOL;  
46        echo "Occupancy: " . $presence->getOccupancy() . PHP_EOL;  
47    }  
48}  
49
  
50// Add listener  
51$subscribeCallback = new MySubscribeCallback();  
52$pubnub->addListener($subscribeCallback);  
53
  
54// Subscribe to a channel, this will block execution  
55$pubnub->subscribe()  
56    ->channels("hello_world")  
57    ->withPresence(true)  // Optional: subscribe to presence events  
58    ->execute();  
```

#### `publish.php`

```
1  
2
  
3require_once 'vendor/autoload.php';  
4
  
5use PubNub\PNConfiguration;  
6use PubNub\PubNub;  
7use PubNub\Exceptions\PubNubServerException;  
8use PubNub\Exceptions\PubNubException;  
9
  
10// Create configuration with demo keys  
11$pnConfig = new PNConfiguration();  
12$pnConfig->setSubscribeKey("demo");  
13$pnConfig->setPublishKey("demo");  
14$pnConfig->setUserId("php-publisher-demo");  
15
  
16// Initialize PubNub instance  
17$pubnub = new PubNub($pnConfig);  
18
  
19try {  
20    // Create message data  
21    $messageData = [  
22        "text" => "Hello from PHP SDK!",  
23        "timestamp" => time(),  
24        "sender" => [  
25            "name" => "PHP Publisher",  
26            "id" => "php-demo"  
27        ]  
28    ];  
29
  
30    // Publish a message to a channel  
31    $result = $pubnub->publish()  
32        ->channel("hello_world")              // Channel to publish to  
33        ->message($messageData)               // Message content  
34        ->shouldStore(true)                   // Store in history  
35        ->sync();                             // Execute synchronously  
36
  
37    // Display success message with timetoken  
38    echo "Message published successfully!" . PHP_EOL;  
39    echo "Timetoken: " . $result->getTimetoken() . PHP_EOL;  
40
  
41    // Convert timetoken to readable date  
42    $timestamp = floor($result->getTimetoken() / 10000000);  
43    $readableDate = date('Y-m-d H:i:s', $timestamp);  
44    echo "Published at: " . $readableDate . PHP_EOL;  
45
  
46    // Display published message  
47    echo PHP_EOL . "Published message: " . PHP_EOL;  
48    echo json_encode($messageData, JSON_PRETTY_PRINT) . PHP_EOL;  
49} catch (PubNubServerException $exception) {  
50    // Handle PubNub server-specific errors  
51    echo "Error publishing message: " . $exception->getMessage() . PHP_EOL;  
52
  
53    if (method_exists($exception, 'getServerErrorMessage') && $exception->getServerErrorMessage()) {  
54        echo "Server Error: " . $exception->getServerErrorMessage() . PHP_EOL;  
55    }  
56
  
57    if (method_exists($exception, 'getStatusCode') && $exception->getStatusCode()) {  
58        echo "Status Code: " . $exception->getStatusCode() . PHP_EOL;  
59    }  
60} catch (PubNubException $exception) {  
61    // Handle PubNub-specific errors  
62    echo "PubNub Error: " . $exception->getMessage() . PHP_EOL;  
63} catch (Exception $exception) {  
64    // Handle general exceptions  
65    echo "Error: " . $exception->getMessage() . PHP_EOL;  
66}  
```

### Troubleshooting

- No connection message:
  - Check internet, keys, and firewall.
- Message not received:
  - Verify channel, check publish errors, start subscriber before publishing.
- Build errors:
  - Ensure Composer dependency, PHP 7.0+, and correct imports.
- Script terminates:
  - Web: PHP timeouts; avoid long-running requests.
  - CLI: ensure nothing exits the process.

## Next steps

- Presence
- Message Persistence
- Access Manager
- PHP SDK GitHub repository
- Examples folder
- SDK reference documentation
- Support portal

Last updated on Sep 3, 2025