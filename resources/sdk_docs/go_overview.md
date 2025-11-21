# Go API & SDK Docs v8.1.0

This guide shows how to set up PubNub in a Go app to send and receive real-time messages.

## Overview

Use the Go SDK to integrate PubNub real-time messaging into your Go applications.

## Prerequisites

- Basic Go knowledge
- Go 1.11+
- Go IDE or text editor
- PubNub account and keyset

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app and keyset.
- Retrieve publish and subscribe keys. Use separate keysets for dev/prod.

### Install the SDK

##### SDK version

Use the latest SDK version.

- go get

```
`1go get github.com/pubnub/go/v7  
`
```

If you encounter dependency issues, use the `go mod tidy` command.

- go.mod

```
`1require github.com/pubnub/go/v7 v8.1.0  
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

See supported platforms for compatibility.

## Steps

### Initialize PubNub

Create pubnub_example.go and replace demo keys with your publish and subscribe keys:

```
1
  

```

See Configuration docs for more options.

### Set up event listeners

Use channels to handle async events:

```
1
  

```

See Listeners docs for details.

### Create a subscription

Subscribe to channels to receive messages in real-time:

```
1
  

```

### Publish messages

Publish JSON-serializable data up to 32 KiB:

```
1
  

```

See Subscribe docs for usage details.

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

- No connection
  - Check internet connection.
  - Verify publish and subscribe keys.
  - Ensure firewall isn’t blocking PubNub.
- Message not received
  - Confirm subscribed channel name.
  - Check for publish errors.
  - Allow time for delivery.
- Build errors
  - Update Go version.
  - Run go mod tidy.
  - Verify imports.

## Next steps

- Presence
- Channel groups
- Signals
- Access Manager
- Message Persistence
- Push Notifications
- Build a chat app in Go
- Explore GitHub samples
- SDK reference documentation
- Support portal
- Ask the AI assistant

Last updated on Oct 29, 2025