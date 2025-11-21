# Unity API & SDK Docs v9.3.0

This guide walks you through a simple "Hello, World" application that demonstrates the core concepts of PubNub:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview

Get up and running with PubNub in your Unity application. Supported platforms:
- Mobile (iOS, Android)
- Desktop (Windows, macOS, Linux)
- WebGL (browser-based games)
- VR/AR (Virtual Reality/Augmented Reality)

Core concepts and APIs are consistent across platforms; initialization may vary per target.

##### WebGL compatibility
The PubNub Unity SDK supports Unity WebGL builds. See WebGL configuration for setup details.

## Prerequisites
- Unity Editor (2018.4.26f1 or newer)
- Basic C# and Unity knowledge
- PubNub account

## Setup

### Get your PubNub keys
- Sign in or create an account on the PubNub Admin Portal.
- Create an app or use an existing one.
- Retrieve your publish and subscribe keys from the app dashboard.
- Use separate keysets for development and production.

### Install the SDK

##### SDK version
Use the latest SDK to access new features and fixes.

#### Install via Package Manager (recommended)
- Unity: Window -> Package Manager
- Click + -> Add package from git URL
- Paste the package link -> Add

```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```

- Editor menu: PubNub -> Set up templates
- Restart Unity Editor

#### Source code
Clone the GitHub repository:

```
`git clone https://github.com/pubnub/unity.git  
`
```

## Steps

### Configure PubNub
- Project tree: Create -> PubNub -> PubNub Config Asset (scriptable object)
- Open PNConfigAsset and set publish and subscribe keys (others optional)

##### UserId requirement
Every client needs a unique UserId. Unity SDK can generate one for testing; set a meaningful UserId in production.

- Project tree: Create -> PubNub -> PubNub Manager Script
- Add PnManager as a component to any scene GameObject
- Assign PNConfigAsset to PubNub Configuration in PnManager (Script)

Alternatively, configure programmatically:

```
1
  
```

See Configuration for more details.

### Set up event listeners
Implement listeners to react to events and messages:
- Status listener: connection state and operational events
- Message listener: incoming messages

```
1
  
```

See Listeners for details.

### Create a subscription
Subscribe to channels to receive messages:
1. $1
2. $1
3. $1

```
1
  
```

See Subscribe for details.

### Publish messages
Publish JSON-serializable data (objects, arrays, integers, strings) up to 32 KiB.

```
1
  
```

### Run the app
1. $1
2. $1
3. $1
4. $1

## Complete example
Here's a complete working example:

```
1
  
```

### Troubleshooting

No connection message
- Verify internet connection and correct keys
- Check firewall or proxy rules
- Enable SSL if required by the network

Message not received
- Confirm subscription to the correct channel
- Check for publish errors
- Allow time for delivery

Script errors
- Ensure PubNub dependency is added
- Verify imports
- Use a compatible Unity version

WebGL build issues
- Enable WebGL build mode in PNConfigAsset
- Follow WebGL configuration guidance

## Next steps
- Build a game
- Advanced features
- Real examples
- More help

- Implement player position sync.
- Create a chat system.
- Develop real-time leaderboards.
- Try Presence to track online/offline status.
- Use Message Persistence to store/retrieve messages.
- Use Access Manager to secure channels.
- Explore the PubNub Prix demo (leaderboards and chat).
- Browse the GitHub repository for samples.
- Read the SDK reference documentation for detailed APIs.
- Visit the support portal.
- Ask the AI assistant for help.

Last updated on Sep 3, 2025