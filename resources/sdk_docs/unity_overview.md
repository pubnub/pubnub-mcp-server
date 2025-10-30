# Unity API & SDK Docs v9.2.0

This guide demonstrates core PubNub concepts in Unity:
- Setting up a connection
- Sending messages
- Receiving messages in real time

## Overview

Supported Unity platforms:
- Mobile (iOS, Android)
- Desktop (Windows, macOS, Linux)
- WebGL (browser-based)
- VR/AR

Core API usage is consistent across platforms; initialization may vary.

##### WebGL compatibility
The Unity SDK supports WebGL builds. See WebGL configuration: /docs/sdks/unity/api-reference/configuration#webgl-configuration

## Prerequisites

- Unity Editor 2018.4.26f1 or newer
- Basic C# and Unity knowledge
- PubNub account

## Setup

### Get your PubNub keys

- Sign in: https://admin.pubnub.com/#/login or create an account: https://admin.pubnub.com/#/signup
- Create/select an app
- Copy publish and subscribe keys from the dashboard

Use separate keysets for development and production.

### Install the SDK

##### SDK version
Use the latest SDK for features, security, and performance.

#### Install via Package Manager (recommended)

- Unity: Window -> Package Manager
- Click + -> Add package from git URL
- Paste the URL and click Add

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

Editor configuration:
- Project tree: Create -> PubNub -> PubNub Config Asset (PNConfigAsset)
- Open PNConfigAsset and set publish and subscribe keys (others optional)

##### UserId requirement
Each client needs a unique UserId. Unity SDK can generate one for testing; specify a meaningful UserId in production.

Manager setup:
- Create -> PubNub -> PubNub Manager Script
- Add PnManager component to a GameObject
- Assign PNConfigAsset to the PubNub Configuration field in PnManager

Programmatic configuration:

```
1
  

```

See Configuration: /docs/sdks/unity/api-reference/configuration

### Set up event listeners

- Status listener: connection state and operational events
- Message listener: incoming messages

```
1
  

```

Docs: /docs/sdks/unity/api-reference/configuration#event-listeners

### Create a subscription

Subscribe to a channel in three steps:
1. $1
2. $1
3. $1

```
1
  

```

Docs: /docs/sdks/unity/api-reference/publish-and-subscribe#subscribe

### Publish messages

Messages are JSON-serializable (object, array, number, string) and must be < 32 KiB.

```
1
  

```

### Run the app

1. $1
2. $1
3. $1
4. $1

## Complete example

```
1
  

```

### Troubleshooting

No connection
- Check internet
- Verify publish/subscribe keys
- Ensure firewall isn’t blocking PubNub
- Enable SSL if required

Message not received
- Confirm correct channel subscription
- Check for publish errors
- Allow time for delivery

Script errors
- Verify PubNub dependency is added
- Check imports
- Confirm Unity version compatibility

WebGL build issues
- Enable WebGL build mode in PNConfigAsset
- Follow WebGL configuration: /docs/sdks/unity/api-reference/configuration#webgl-configuration

## Next steps

- Implement real-time game features (position sync, chat, leaderboards)
- Explore Presence: /docs/sdks/unity/api-reference/presence
- Message Persistence: /docs/sdks/unity/api-reference/storage-and-playback
- Access Manager: /docs/sdks/unity/api-reference/access-manager
- PubNub Prix demo: https://www.pubnub.com/demos/unity-pubnubprix/
- GitHub samples: https://github.com/pubnub/unity/
- SDK reference: /docs/sdks/unity/api-reference/configuration
- Support: https://support.pubnub.com/

Last updated on Sep 3, 2025