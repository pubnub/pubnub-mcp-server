# Unity API & SDK Docs v9.3.0

This guide shows how to connect, publish, and receive real-time messages in Unity.

- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview[​](#overview)

PubNub Unity SDK supports:
- Mobile (iOS, Android)
- Desktop (Windows, macOS, Linux)
- WebGL (browser)
- VR/AR

Core API usage is consistent; initialization may vary by platform.

##### WebGL compatibility
Unity WebGL builds are supported. See [WebGL configuration](/docs/sdks/unity/api-reference/configuration#webgl-configuration).

## Prerequisites[​](#prerequisites)

- Unity Editor 2018.4.26f1 or newer
- Basic C# and Unity knowledge
- PubNub account

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup).
- Create an app or use an existing one.
- Copy your publish and subscribe keys from the dashboard.
- Use separate keysets for dev/prod.

### Install the SDK[​](#install-the-sdk)

##### SDK version
Use the latest SDK.

#### Install via Package Manager (recommended)[​](#install-via-package-manager-recommended)

- Unity: Window -> Package Manager -> + -> Add package from git URL
- Paste URL and Add:
```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```
- In Unity menu: PubNub -> Set up templates
- Restart Unity Editor

#### Source code[​](#source-code)

Clone:
```
`git clone https://github.com/pubnub/unity.git  
`
```

## Steps[​](#steps)

### Configure PubNub[​](#configure-pubnub)

- Create config asset: Project tree -> Create -> PubNub -> PubNub Config Asset (scriptable object).
- Open PNConfigAsset and set publish/subscribe keys (others optional).
- Create manager: Create -> PubNub -> PubNub Manager Script.
- Add PnManager component to a GameObject.
- Assign PNConfigAsset to PnManager’s PubNub Configuration field.

##### UserId requirement
Each client needs a unique UserId. Unity SDK can generate one for testing; specify your own in production.

Alternatively configure programmatically:
```
1
  

```
See [Configuration](/docs/sdks/unity/api-reference/configuration).

### Set up event listeners[​](#set-up-event-listeners)

- Status listener: connection/operation state.
- Message listener: incoming messages.
```
1
  

```
See [Listeners](/docs/sdks/unity/api-reference/configuration#event-listeners).

### Create a subscription[​](#create-a-subscription)

1. $1
2. $1
3. $1
```
1
  

```
See [Subscribe](/docs/sdks/unity/api-reference/publish-and-subscribe#subscribe).

### Publish messages[​](#publish-messages)

Publish JSON-serializable data (< 32 KiB) to a channel; all subscribers receive it.
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

No connection
- Check internet connectivity.
- Verify publish/subscribe keys.
- Ensure firewall doesn’t block PubNub.
- Enable SSL if required by network.

Message not received
- Confirm subscription to the correct channel.
- Verify publish succeeded (check errors).
- Allow time for delivery.

Script errors
- Ensure PubNub dependency is added.
- Verify imports.
- Use a compatible Unity version.

WebGL build issues
- Enable WebGL build mode in PNConfigAsset.
- Follow [WebGL configuration](/docs/sdks/unity/api-reference/configuration#webgl-configuration).

## Next steps[​](#next-steps)

- Build a game; implement chat, leaderboards, player position sync.
- Use [Presence](/docs/sdks/unity/api-reference/presence) for online/offline.
- Use [Message Persistence](/docs/sdks/unity/api-reference/storage-and-playback).
- Secure with [Access Manager](/docs/sdks/unity/api-reference/access-manager).
- Try the [PubNub Prix demo](https://www.pubnub.com/demos/unity-pubnubprix/).
- Explore the [GitHub repository](https://github.com/pubnub/unity/).
- Read the [SDK reference](/docs/sdks/unity/api-reference/configuration).
- Visit the [support portal](https://support.pubnub.com/).

Last updated on Sep 3, 2025