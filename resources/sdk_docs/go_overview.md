# Go API & SDK Docs v8.0.0

This guide demonstrates core PubNub concepts in Go:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview

Get started integrating PubNub real-time messaging into Go applications (Go 1.11+). Go’s goroutines and channels support efficient real-time apps. Use this guide to initialize, listen, subscribe, publish, and run a simple app.

## Prerequisites

- Basic Go knowledge
- Go 1.11 or later installed
- A Go IDE or editor
- A PubNub account

## Setup

### Get your PubNub keys

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup).
- Create or select an app.
- Get your publish and subscribe keys from the app dashboard.
- Use separate keysets for development and production when possible.

### Install the SDK

Always use the latest SDK version.

- go get

```
`1go get github.com/pubnub/go/v7  
`
```

If dependencies fail, run go mod tidy.

- go.mod

```
`1require github.com/pubnub/go/v7 v8.0.0  
`
```

Then:

```
`1go mod tidy  
`
```

- Source code

```
`1git clone https://github.com/pubnub/go.git  
`
```

View the [supported platforms](/docs/sdks/go/platform-support).

## Steps

### Initialize PubNub

Create pubnub_example.go and replace demo keys with your app’s publish and subscribe keys.

```
1
  

```

See [Configuration](/docs/sdks/go/api-reference/configuration).

### Set up event listeners

Use channels to handle asynchronous events for status and messages.

```
1
  

```

See [Event listeners](/docs/sdks/go/api-reference/configuration#event-listeners).

### Create a subscription

Subscribe to a channel to receive messages in real-time.

```
1
  

```

### Publish messages

Publish JSON-serializable data (objects, arrays, integers, strings) up to 32 KiB to deliver to all channel subscribers. See [Subscribe](/docs/sdks/go/api-reference/publish-and-subscribe#subscribe).

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
  - Check internet connectivity.
  - Verify publish/subscribe keys.
  - Ensure firewall allows PubNub.
- Message not received:
  - Confirm correct channel subscription.
  - Check for publish errors.
  - Allow time for delivery.
- Build errors:
  - Update Go.
  - Run go mod tidy.
  - Verify imports.

## Next steps

- Set up [Presence](/docs/sdks/go/api-reference/presence)
- Use [Channel Groups](/docs/sdks/go/api-reference/channel-groups)
- Send [Signals](/docs/sdks/go/api-reference/publish-and-subscribe#signal)
- Secure with [Access Manager](/docs/sdks/go/api-reference/access-manager)
- Add [Message Persistence](/docs/sdks/go/api-reference/storage-and-playback)
- Configure [Push Notifications](/docs/sdks/go/api-reference/mobile-push)
- [Build a chat app in Go](https://www.pubnub.com/blog/build-a-chat-app-in-go-using-pubnub/)
- Explore the [GitHub repository](https://github.com/pubnub/go)
- Read the [SDK reference docs](/docs/sdks/go/api-reference/configuration)
- Visit the [support portal](https://support.pubnub.com/)

Last updated on Oct 29, 2025