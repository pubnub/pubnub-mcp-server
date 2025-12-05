# Go API & SDK Docs v8.1.0

Build a "Hello, World" real-time app in Go with PubNub:
- Initialize the SDK
- Subscribe and listen for events
- Publish and receive messages

## Overview

Use the PubNub Go SDK to add real-time messaging to Go apps (web services, CLI, backends). Go’s goroutines and channels support efficient concurrency.

## Prerequisites

- Go 1.11+
- PubNub account and keyset
- Basic Go knowledge and a Go IDE/editor

## Setup

### Get your PubNub keys

- Sign in or create an account on the PubNub Admin Portal.
- Create an app; use the generated publish and subscribe keys (use separate keysets for dev/prod).

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
`1require github.com/pubnub/go/v7 v8.1.0  
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

See supported platforms for compatibility.

## Steps

### Initialize PubNub

Create pubnub_example.go with minimum config. Replace demo keys with your app’s publish and subscribe keys.

```
1
  

```

See Configuration for details.

### Set up event listeners

Use channels to handle async events (status updates, incoming messages).

```
1
  

```

See Event Listeners for details.

### Create a subscription

Subscribe to a channel to receive real-time messages.

```
1
  

```

### Publish messages

Publish JSON-serializable data (objects, arrays, numbers, strings) up to 32 KiB to deliver to all subscribers.

See Subscribe for more info.

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

- No connection message:
  - Check internet, verify keys, ensure no firewall blocks PubNub
- Message not received:
  - Confirm channel subscription, check publish errors, wait for delivery
- Build errors:
  - Update Go, run go mod tidy, verify imports

## Next steps

- Presence
- Channel groups
- Signals
- Access Manager
- Message Persistence
- Push Notifications
- Build a chat app in Go
- GitHub repo for samples
- SDK reference documentation
- Support portal

Last updated on Oct 29, 2025