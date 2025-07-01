On this page
# Unity API & SDK Docs v9.0.1

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Unity application. PubNub's Unity SDK supports various Unity platforms including:

- Mobile (iOS, Android)

- Desktop (Windows, macOS, Linux)

- WebGL (browser-based games)

- VR/AR (Virtual Reality/Augmented Reality) applications

The core PubNub concepts and API usage remain the same across all these platforms, but initialization may differ slightly depending on your target platform.

##### WebGL compatibility

The PubNub Unity SDK is compatible with Unity WebGL builds. For information on how to configure your project for WebGL, refer to [WebGL configuration](/docs/sdks/unity/api-reference/configuration#webgl-configuration).

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- Unity Editor (2018.4.26f1 or newer)

- Basic understanding of C# and Unity development

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal.

- Create a new app (or use an existing one).

- Find your publish and subscribe keys in the app's dashboard.

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

You can install the PubNub Unity SDK in several ways:

#### Install via Package Manager (Recommended)[​](#install-via-package-manager-recommended)

Open Unity Editor and navigate to **Window -> Package Manager**.

In the Package Manager window, click **+** and select **Add package from git URL**.

Paste the PubNub Unity package link and click **Add**.

```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```

Navigate to **PubNub** in the editor menu bar and click **Set up templates**.

Restart Unity Editor.

#### Get the source code[​](#get-the-source-code)

If you prefer to get the source code directly:

```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```

## Steps[​](#steps)

### Configure PubNub[​](#configure-pubnub)

Unity provides a unique way to configure PubNub through the editor interface without writing code:

In your project tree, right-click any folder, and navigate to **Create -> PubNub -> PubNub Config Asset**. This creates a new scriptable object where you provide your PubNub account information.

Open the newly created `PNConfigAsset` scriptable object and provide your publish and subscribe keys. Other configuration items are optional.

##### UserId requirement

Every PubNub client needs a unique identifier. For testing, the Unity SDK can generate a UserId for you, but in production, you should specify your own meaningful UserId to identify clients.

In your project tree, right-click a folder, and navigate to **Create -> PubNub -> PubNub Manager Script**. This creates a script that will handle PubNub operations.

Drag the `PnManager` script onto any game object in your scene. This adds `PnManager` as a component.

Drag the `PNConfigAsset` onto the **PubNub Configuration** field inside **PnManager (Script)**.

Alternatively, you can configure PubNub programmatically:

```
`// Create a configuration object  
PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "demo"; // Replace with your publish key  
pnConfiguration.SubscribeKey = "demo"; // Replace with your subscribe key  
pnConfiguration.Secure = true; // Enable SSL  
  
// Initialize PubNub with this configuration  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

For more information, refer to the [Configuration](/docs/sdks/unity/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

There are two main types of listeners you'll need to set up:

- Status listener - for connection state changes and operational events

- Message listener - for incoming messages

```
`// Add listeners to handle incoming events  
listener.onStatus += OnPnStatus;  
listener.onMessage += OnPnMessage;  
  
// Status event handler  
void OnPnStatus(Pubnub pn, PNStatus status) {  
    Debug.Log(status.Category == PNStatusCategory.PNConnectedCategory ? "Connected" : "Not connected");  
}  
  
// Message event handler  
void OnPnMessage(Pubnub pn, PNMessageResultobject> result) {  
    Debug.Log($"Message received: {result.Message}");  
}  
`
```

For more information, refer to the [Listeners](/docs/sdks/unity/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages sent to a particular channel, you need to subscribe to it. This is done in three steps:

1. $1

2. $1

3. $1

```
`// Subscribe to a channel using modern API  
Channel channel = pubnub.Channel("TestChannel");  
Subscription subscription = channel.Subscription();  
subscription.Subscribeobject>();  
  
// Or using the legacy API  
pubnub.Subscribestring>().Channels(new[] { "TestChannel" }).Execute();  
`
```

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

```
`// Publish a simple message  
await pubnub.Publish().Channel("TestChannel").Message("Hello World from Unity!").ExecuteAsync();  
  
// Publish a Unity object using the GetJsonSafe extension method for handling circular references  
await pubnub.Publish().Channel("TestChannel").Message(transform.position.GetJsonSafe()).ExecuteAsync();  
  
// Using a callback instead of async/await  
pubnub.Publish()  
    .Channel("TestChannel")  
    .Message("Hello World from Unity!")  
    .Execute((result, status) => {  
        if (!status.Error) {  
            Debug.Log("Message sent successfully!");  
        } else {  
            Debug.LogError("Failed to send message: " + status.ErrorData.Information);  
`
```
show all 17 lines

### Run the app[​](#run-the-app)

To test your Unity application:

1. $1

2. $1

3. $1

4. $1

## Complete example[​](#complete-example)

Here's a complete working example that puts everything together:

```
`using System.Collections.Generic;  
using UnityEngine;  
using Newtonsoft.Json;  
using PubnubApi;  
using PubnubApi.Unity;  
  
public class PNManager : PNManagerBehaviour {  
    // UserId identifies this client.  
    public string userId;  
  
    private async void Awake() {  
        if (string.IsNullOrEmpty(userId)) {  
            // It is recommended to change the UserId to a meaningful value to be able to identify this client.  
            userId = System.Guid.NewGuid().ToString();  
        }  
`
```
show all 51 lines

### Troubleshooting[​](#troubleshooting)

If you don't see the expected output, here are some common issues and how to fix them:

IssuePossible SolutionsNo connection message
- Check your internet connection.
- Verify your publish and subscribe keys are correct.
- Make sure you're not behind a firewall blocking PubNub's connections.
- Check that SSL is enabled if your network requires it.

Message not received
- Double-check that you're subscribed to the correct channel.
- Verify that the message was actually sent (check for any error messages).
- Make sure you're waiting long enough for the message to be delivered.

Script errors
- Ensure you've added the PubNub dependency correctly.
- Make sure all imports are correct.
- Check that you're using a compatible version of Unity.

WebGL build issues
- Make sure you've enabled WebGL build mode in the PNConfigAsset.
- Configure proper WebGL settings following the [WebGL configuration](/docs/sdks/unity/api-reference/configuration#webgl-configuration) guidance.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application with Unity. Here are some exciting things you can explore next:

- Build a game
- Advanced features
- Real examples
- More help

- Implement position sync between players using PubNub.

- Create a chat system for your game.

- Develop leaderboards with real-time updates.

- Try out [Presence](/docs/sdks/unity/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/unity/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/unity/api-reference/access-manager) to secure your channels.

- Check out the [PubNub Prix demo](https://www.pubnub.com/demos/unity-pubnubprix/) for a full Unity game with leaderboards and chat.

- Explore our [GitHub repository](https://github.com/pubnub/unity/) for more code samples.

- Check out our [SDK reference documentation](/docs/sdks/unity/api-reference/configuration) for detailed API information.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Apr 29, 2025**