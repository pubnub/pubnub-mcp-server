# Unity API & SDK Docs v9.3.0

This guide demonstrates core PubNub concepts in Unity:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview[​](#overview)

PubNub's Unity SDK supports:
- Mobile (iOS, Android)
- Desktop (Windows, macOS, Linux)
- WebGL (browser-based games)
- VR/AR

Initialization may differ by platform; core API usage is consistent.

##### WebGL compatibility
The SDK supports Unity WebGL builds. See WebGL configuration: /docs/sdks/unity/api-reference/configuration#webgl-configuration.

## Prerequisites[​](#prerequisites)

- Unity Editor (2018.4.26f1 or newer)
- Basic C# and Unity knowledge
- PubNub account

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

- Sign in: https://admin.pubnub.com/#/login or create an account: https://admin.pubnub.com/#/signup
- Create an app or use an existing one.
- Copy your publish and subscribe keys from the app dashboard.
- Use separate keysets for development and production.

### Install the SDK[​](#install-the-sdk)

##### SDK version
Use the latest SDK version.

#### Install via Package Manager (recommended)[​](#install-via-package-manager-recommended)

- Unity: Window -> Package Manager -> + -> Add package from git URL
- Paste and Add:

```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```

- In the editor menu: PubNub -> Set up templates
- Restart Unity Editor.

#### Source code[​](#source-code)

Clone the GitHub repository:

```
`git clone https://github.com/pubnub/unity.git  
`
```

## Steps[​](#steps)

### Configure PubNub[​](#configure-pubnub)

Editor-based configuration:
- Right-click in Project -> Create -> PubNub -> PubNub Config Asset (scriptable object).
- Open PNConfigAsset and set publish and subscribe keys (other options optional).

##### UserId requirement
Every client needs a unique UserId. Unity SDK can generate one for testing; specify your own in production.

- Create manager: Right-click -> Create -> PubNub -> PubNub Manager Script.
- Add PnManager to a GameObject.
- Assign PNConfigAsset to the PubNub Configuration field in PnManager (Script).

Programmatic configuration (alternative):

```
1
  

```

See Configuration docs: /docs/sdks/unity/api-reference/configuration.

### Set up event listeners[​](#set-up-event-listeners)

- Status listener: connection and operational events
- Message listener: incoming messages

```
1
  

```

Docs: /docs/sdks/unity/api-reference/configuration#event-listeners

### Create a subscription[​](#create-a-subscription)

Subscribe in three steps:
1. $1
2. $1
3. $1

```
1
  

```

Docs: /docs/sdks/unity/api-reference/publish-and-subscribe#subscribe

### Publish messages[​](#publish-messages)

Messages are JSON-serializable (objects, arrays, integers, strings) up to 32 KiB.

```
1
  

```

### Run the app[​](#run-the-app)

1. $1
2. $1
3. $1
4. $1

## Complete example[​](#complete-example)

```
1
  

```

### Troubleshooting[​](#troubleshooting)

No connection message:
- Check internet.
- Verify publish/subscribe keys.
- Ensure firewall isn’t blocking PubNub.
- Enable SSL if required by your network.

Message not received:
- Confirm you subscribed to the correct channel.
- Verify publish success (check for errors).
- Allow time for delivery.

Script errors:
- Confirm PubNub dependency is added.
- Verify imports.
- Use a compatible Unity version.

WebGL build issues:
- Enable WebGL build mode in PNConfigAsset.
- Follow WebGL configuration: /docs/sdks/unity/api-reference/configuration#webgl-configuration

## Next steps[​](#next-steps)

- Build a game; implement position sync, chat, leaderboards with real-time updates.
- Presence: /docs/sdks/unity/api-reference/presence
- Message Persistence: /docs/sdks/unity/api-reference/storage-and-playback
- Access Manager: /docs/sdks/unity/api-reference/access-manager
- PubNub Prix demo: https://www.pubnub.com/demos/unity-pubnubprix/
- GitHub samples: https://github.com/pubnub/unity/
- SDK reference: /docs/sdks/unity/api-reference/configuration
- Support: https://support.pubnub.com/
- Use the AI assistant in the docs.

Last updated on Sep 3, 2025