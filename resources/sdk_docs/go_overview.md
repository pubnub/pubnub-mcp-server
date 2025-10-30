# Go API & SDK Docs v8.0.0

This guide shows how to connect, publish, and subscribe with PubNub in Go.

## Overview

The Go SDK provides a simple interface to integrate PubNub real-time messaging into Go apps.

## Prerequisites

- Basic Go knowledge
- Go 1.11+
- PubNub account (Admin Portal)

## Setup

### Get your PubNub keys

- Sign in or create an account on the PubNub Admin Portal.
- Create an app and keyset.
- Locate your publish and subscribe keys.
- Use separate keysets for dev/prod when possible.

### Install the SDK

Always use the latest SDK version.

- go get

```
`1go get github.com/pubnub/go/v7  
`
```

If you encounter dependency issues, use:

```
`1go mod tidy  
`
```

- go.mod

```
`1require github.com/pubnub/go/v7 v8.0.0  
`
```

Then run:

```
`1go mod tidy  
`
```

- Source code

```
`1git clone https://github.com/pubnub/go.git  
`
```

See supported platforms: /docs/sdks/go/platform-support

## Steps

### Initialize PubNub

Create pubnub_example.go. Replace demo keys with your publish and subscribe keys.

```
1
  

```

See Configuration: /docs/sdks/go/api-reference/configuration

### Set up event listeners

Use channels to handle async events: status updates and messages.

```
1
  

```

See Event Listeners: /docs/sdks/go/api-reference/configuration#event-listeners

### Create a subscription

Subscribe to a channel to receive real-time messages:

```
1
  

```

### Publish messages

Publish JSON-serializable data (<= 32 KiB) to a channel.

See Subscribe: /docs/sdks/go/api-reference/publish-and-subscribe#subscribe

```
1
  

```

### Run the app

```
`go run pubnub_example.go  
`
```

Expected output:

```
`1PubNub instance initialized  
2Connected to PubNub!  
3Subscribed to channel: my-channel  
4Publishing message: map[sender:go-sdk text:Hello, world!]  
5Publish successful! Timetoken: 16967543908123456  
6Received message: map[sender:go-sdk text:Hello, world!]  
`
```

## Complete example

```
1
  

```

### Troubleshooting

- No connection:
  - Check internet
  - Verify publish/subscribe keys
  - Ensure firewall allows PubNub
- Message not received:
  - Confirm channel subscription
  - Check publish errors
  - Allow time for delivery
- Build errors:
  - Update Go version
  - Run go mod tidy
  - Verify imports

## Next steps

- Presence: /docs/sdks/go/api-reference/presence
- Channel Groups: /docs/sdks/go/api-reference/channel-groups
- Signals: /docs/sdks/go/api-reference/publish-and-subscribe#signal
- Access Manager: /docs/sdks/go/api-reference/access-manager
- Message Persistence: /docs/sdks/go/api-reference/storage-and-playback
- Push Notifications: /docs/sdks/go/api-reference/mobile-push
- Build a chat app in Go: https://www.pubnub.com/blog/build-a-chat-app-in-go-using-pubnub/
- GitHub: https://github.com/pubnub/go
- SDK Reference: /docs/sdks/go/api-reference/configuration
- Support: https://support.pubnub.com/

Last updated on Oct 29, 2025