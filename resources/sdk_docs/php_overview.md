On this page
# PHP API & SDK Docs 8.0.2

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your PHP application. We'll create a simple application that demonstrates how to connect to PubNub, subscribe to channels, and publish messages.

The code examples will work in both web environments and command-line scripts, with notes indicating any environment-specific considerations when relevant.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of PHP (v7.0 or newer recommended)

- PHP installed on your system (either on a web server or as CLI)

- Composer (recommended) or the ability to manually manage dependencies

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal.

- Create a new app (or use an existing one).

- Find your publish and subscribe keys in the app's dashboard.

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

Install the PHP SDK using Composer.

For a fresh project (no existing code), run the following command in the project directory.

```
`composer init  
`
```

Then, run this command (for both the existing Composer projects and the newly initiated ones).

```
`composer require pubnub/pubnub‌  
`
```

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

Create a PHP file to initialize the PubNub client:

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
// Create a new configuration instance  
$pnConfiguration = new PNConfiguration();  
  
// Set subscribe key (required)  
$pnConfiguration->setSubscribeKey("demo"); // Replace with your subscribe key  
  
// Set publish key (only required if publishing)  
`
```
show all 28 lines

For more information, refer to the [Configuration](/docs/sdks/php/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

There are two main types of listeners you'll need to set up:

- Status listener - for connection state changes and operational events

- Event listener - for messages and presence events

Set up listeners to handle events and messages:

```
`  
  
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
`
```
show all 39 lines

For more information, refer to the [Listeners](/docs/sdks/php/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages, you need to subscribe to a channel:

```
`// Subscribe to a channel  
$pubnub->subscribe()  
    ->channels("hello_world")  
    ->withPresence(true)  // Optional: subscribe to presence events  
    ->execute();  
`
```

This operation will block execution since the subscription is a long-running operation.

For web applications, you might want to:

- Run subscriptions in a separate process that logs to a database.

- Use AJAX or server-sent events to push updates to the client.

- Consider using the PubNub JavaScript SDK for client-side real-time updates.

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

To send messages, use the `publish()` method:

```
`  
  
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
`
```
show all 55 lines

### Run the app[​](#run-the-app)

For the best experience with PHP, we recommend setting up two separate files:

1. $1

2. $1

To run your PHP application:

Open two terminal windows or sessions

In the first terminal, run the subscriber script:

```
`php subscribe.php  
`
```

In the second terminal, run the publisher script:

```
`php publish.php  
`
```

When running the subscriber, you should see a connection message:

```
`Connected to PubNub!  
`
```

After publishing a message, you should see output similar to:

```
`Received message: {"text":"Hello from PHP SDK!","timestamp":1678912345,"sender":{"name":"PHP Publisher","id":"php-demo"}}  
Publisher: php-publisher-demo  
Channel: hello_world  
Timetoken: 16789123450000000  
`
```

##### Web environment

If you're working in a web environment, you'll likely need a different approach for subscriptions. Consider using the PubNub JavaScript SDK for real-time browser updates, or implement a polling mechanism to retrieve messages from history.

## Complete example[​](#complete-example)

Here's a complete working example that puts everything together using two separate PHP files.

#### `subscribe.php`[​](#subscribephp)

```
`  
  
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
  
`
```
show all 58 lines

#### `publish.php`[​](#publishphp)

```
`  
  
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
  
`
```
show all 66 lines

### Troubleshooting[​](#troubleshooting)

If you don't see the expected output, here are some common issues and how to fix them:

IssuePossible SolutionsNo connection message
- Check your internet connection.
- Verify your publish and subscribe keys are correct.
- Make sure you're not behind a firewall blocking PubNub's connections.

Message not received
- Double-check that you're subscribed to the correct channel.
- Verify that the message was actually sent (check for any error messages).
- Make sure the subscriber is running before publishing messages.

Build errors
- Ensure you've added the PubNub dependency correctly via Composer.
- Check that you're using PHP 7.0 or higher.
- Make sure all imports are correct.

Script terminates
- For web environments, PHP scripts may timeout. Consider alternative approaches for long-running processes.
- For CLI scripts, make sure nothing is causing the script to exit.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application with PHP. Here are some exciting things you can explore next:

- Advanced features
- Real examples
- More help

- Try out [Presence](/docs/sdks/php/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/php/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/php/api-reference/access-manager) to secure your channels.

- Explore our [PHP SDK GitHub repository](https://github.com/pubnub/php/) for more code samples.

- Look at [examples folder](https://github.com/pubnub/php/tree/master/examples) for sample implementations.

- Check out our [SDK reference documentation](/docs/sdks/php/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Apr 29, 2025**