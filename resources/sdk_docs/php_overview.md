# PHP API & SDK Docs 9.0.0

This guide shows how to connect to PubNub, subscribe to channels, and publish messages in PHP (works in web and CLI; note environment considerations where relevant).

## Overview[​](#overview)

- Connect to PubNub
- Subscribe to channels
- Publish and receive real-time messages

## Prerequisites[​](#prerequisites)

- PHP 7.0+
- Composer (recommended)
- PubNub account with publish and subscribe keys

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

- Sign in or create an account in the Admin Portal.
- Create an app; use the generated keyset.
- Use separate keysets for dev/prod when possible.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Use the latest SDK.

For a fresh project:

```
`1composer init  
`
```

Install dependency (for new or existing Composer projects):

```
`1composer require pubnub/pubnub‌  
`
```

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

Create a PHP file to initialize the PubNub client:

```
1
  

```

See Configuration for options.

### Set up event listeners[​](#set-up-event-listeners)

Add listeners to handle:
- Status events (connection state, operational events)
- Messages and presence events

```
1
  

```

See Listeners for details.

### Create a subscription[​](#create-a-subscription)

Subscribe to a channel to receive messages:

```
1
  

```

Note: Subscribing is a long-running, blocking operation.
- For web apps, run subscriptions in a separate process, push updates via AJAX/SSE, or use the PubNub JavaScript SDK.

See Subscribe for details.

### Publish messages[​](#publish-messages)

Publish messages to a channel; subscribers receive them.
- Payload: any JSON-serializable data under 32 KiB.

Use the publish() method:

```
1
  

```

### Run the app[​](#run-the-app)

Use separate subscriber and publisher scripts.

In one terminal:

```
`php subscribe.php  
`
```

In another:

```
`php publish.php  
`
```

Expected outputs:

```
`Connected to PubNub!  
`
```

```
`Received message: {"text":"Hello from PHP SDK!","timestamp":1678912345,"sender":{"name":"PHP Publisher","id":"php-demo"}}  
Publisher: php-publisher-demo  
Channel: hello_world  
Timetoken: 16789123450000000  
`
```

##### Web environment

For browser real-time updates: prefer PubNub JavaScript SDK or implement polling/history retrieval.

## Complete example[​](#complete-example)

#### `subscribe.php`[​](#subscribephp)

```
1
  

```

#### `publish.php`[​](#publishphp)

```
1
  

```

### Troubleshooting[​](#troubleshooting)

- No connection:
  - Check internet, keys, firewall rules.
- Message not received:
  - Verify channel names, check publish errors, start subscriber before publishing.
- Build errors:
  - Confirm Composer dependency, PHP 7.0+, correct imports.
- Script terminates:
  - Web: PHP timeouts; avoid long-running processes.
  - CLI: ensure nothing exits the script.

## Next steps[​](#next-steps)

- Presence
- Message Persistence
- Access Manager
- PHP SDK GitHub repository and examples
- SDK reference documentation
- Support portal
- AI assistant

Last updated on Nov 6, 2025