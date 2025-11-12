# PHP API & SDK Docs 9.0.0

Quick start to connect, subscribe, and publish with PubNub in PHP (web or CLI).

## Overview

Create a simple PHP app to:
- Initialize PubNub
- Subscribe to channels
- Publish and receive real-time messages

## Prerequisites

- PHP 7.0+
- Composer (recommended) or manual dependency management
- PubNub account with publish and subscribe keys
- PHP runtime (web server or CLI)

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app and use its keyset (publish and subscribe keys).
- Use separate keysets for development and production.

### Install the SDK

Always use the latest SDK version.

For a new Composer project:

```
`1composer init  
`
```

Add the PubNub PHP SDK:

```
`1composer require pubnub/pubnub‌  
`
```

## Steps

### Initialize PubNub

Create a PHP file and initialize the client.

```
1
  

```

See Configuration: /docs/sdks/php/api-reference/configuration

### Set up event listeners

Use listeners to handle connection status and incoming events/messages.

- Status listener: connection state and operational events
- Event listener: messages and presence events

```
1
  

```

See Listeners: /docs/sdks/php/api-reference/configuration#event-listeners

### Create a subscription

Subscribe to a channel to receive messages.

```
1
  

```

Notes:
- Subscription is long-running and blocks execution.
- For web apps, consider:
  - Running subscriptions in a separate process that logs to a database.
  - Using AJAX or server-sent events to push updates to the client.
  - Using the PubNub JavaScript SDK for browser real-time updates.

See Subscribe: /docs/sdks/php/api-reference/publish-and-subscribe#subscribe

### Publish messages

Publish delivers a message to all subscribers of a channel.

- Messages must be JSON-serializable (objects, arrays, integers, strings)
- Max size: 32 KiB

Use the publish() method:

```
1
  

```

## Run the app

Use two files: subscribe.php and publish.php.

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

Web environment: For browser real-time updates, prefer the PubNub JavaScript SDK or a polling/history-based approach.

## Complete example

### subscribe.php

```
1
  

```

### publish.php

```
1
  

```

## Troubleshooting

No connection message:
- Check internet connectivity.
- Verify publish/subscribe keys.
- Ensure firewall isn’t blocking PubNub.

Message not received:
- Confirm correct channel.
- Check for publish errors.
- Start subscriber before publishing.

Build errors:
- Confirm Composer dependency is installed.
- Use PHP 7.0+.
- Verify imports.

Script terminates:
- Web: PHP may timeout; use alternative long-running patterns.
- CLI: Ensure nothing exits the script unexpectedly.

## Next steps

- Presence: /docs/sdks/php/api-reference/presence
- Message Persistence: /docs/sdks/php/api-reference/storage-and-playback
- Access Manager: /docs/sdks/php/api-reference/access-manager
- PHP SDK repo: https://github.com/pubnub/php/
- Examples: https://github.com/pubnub/php/tree/master/examples
- SDK reference: /docs/sdks/php/api-reference/configuration
- Support: https://support.pubnub.com/

Last updated on Nov 6, 2025