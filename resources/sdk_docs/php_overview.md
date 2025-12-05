# PHP API & SDK Docs 9.0.0

This guide walks you through a simple "Hello, World" application that demonstrates the core concepts of PubNub:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview

Get up and running with PubNub in PHP. Connect, subscribe to channels, and publish messages. Examples work in web and CLI environments (notes included when relevant).

## Prerequisites

- PHP 7.0+ (web server or CLI)
- Composer (recommended) or manual dependency management
- PubNub account and keyset

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app or use an existing one.
- Retrieve publish and subscribe keys from the app dashboard.
- Use separate keysets for dev and prod when possible.

### Install the SDK

##### SDK version
Use the latest SDK for features, security, and performance.

Install with Composer.

For a new project:
```
`1composer init  
`
```

Then (for new or existing Composer projects):
```
`1composer require pubnub/pubnub‌  
`
```

## Steps

### Initialize PubNub

Create a PHP file to initialize the PubNub client:
```
1
  

```
See Configuration: /docs/sdks/php/api-reference/configuration

### Set up event listeners

Listeners handle status (connection/operational) and events (messages/presence):
```
1
  

```
See Listeners: /docs/sdks/php/api-reference/configuration#event-listeners

### Create a subscription

Subscribe to a channel to receive messages:
```
1
  

```
Notes:
- Subscription is a long-running, blocking operation.
- For web apps, consider:
  - Running subscriptions in a separate process (log to DB).
  - Using AJAX/server-sent events to push updates.
  - Using the PubNub JavaScript SDK for client-side updates.

See Subscribe: /docs/sdks/php/api-reference/publish-and-subscribe#subscribe

### Publish messages

Publish delivers to all subscribers of the channel. Messages must be JSON-serializable and < 32 KiB.

Use publish():
```
1
  

```

### Run the app

Use two PHP files:

1. $1
2. $1

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

Expected subscriber connection:
```
`Connected to PubNub!  
`
```

After publishing:
```
`Received message: {"text":"Hello from PHP SDK!","timestamp":1678912345,"sender":{"name":"PHP Publisher","id":"php-demo"}}  
Publisher: php-publisher-demo  
Channel: hello_world  
Timetoken: 16789123450000000  
`
```

##### Web environment
For browser real-time updates, prefer the PubNub JavaScript SDK, or use polling/history as an alternative.

## Complete example

Two files:

#### `subscribe.php`
```
1
  

```

#### `publish.php`
```
1
  

```

### Troubleshooting

Issue: No connection message
- Check internet connectivity.
- Verify publish and subscribe keys.
- Confirm no firewall blocks PubNub.

Issue: Message not received
- Verify the subscribed channel.
- Check for publish errors.
- Ensure the subscriber is running before publish.

Issue: Build errors
- Confirm PubNub dependency via Composer.
- Use PHP 7.0+.
- Validate imports.

Issue: Script terminates
- Web: PHP timeouts can occur; use alternatives for long-running processes.
- CLI: Ensure nothing exits the script prematurely.

## Next steps

- Presence: /docs/sdks/php/api-reference/presence
- Message Persistence: /docs/sdks/php/api-reference/storage-and-playback
- Access Manager: /docs/sdks/php/api-reference/access-manager
- PHP SDK GitHub: https://github.com/pubnub/php/
- Examples: https://github.com/pubnub/php/tree/master/examples
- SDK reference: /docs/sdks/php/api-reference/configuration
- Support: https://support.pubnub.com/
- Ask the AI assistant (looking glass icon)

Last updated on Nov 6, 2025