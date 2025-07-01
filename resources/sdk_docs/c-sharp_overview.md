On this page
# C# API & SDK Docs 7.3.14

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your C# application, covering environments like .NET Framework, .NET Core, Xamarin, etc.

The core PubNub concepts and API usage are consistent across different C# platforms.

##### SDK packages

PubNub provides different NuGet packages optimized for various .NET environments:

- `Pubnub`: For .NET Framework 4.6.1+

- `PubnubPCL`: For .NET Standard 2.0+ (includes .NET Core, Xamarin)

`PubnubUWP`: For Universal Windows Platform
Choose the package that best suits your target platform during installation.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of C#

- A C# development environment (Visual Studio, Visual Studio Code, Rider)

- .NET Framework 4.6.1+ or .NET Core 2.0+ installed

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal.

- Create a new app (or use an existing one).

- Find your publish and subscribe keys in the app's dashboard (use the **demo** keys provided in the examples for now if you just want to test).

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

To integrate PubNub into your project using the [NuGet](https://www.nuget.org/) package manager, choose the command relevant to your project type:

#### .NET CLI[​](#net-cli)

```
`# For .NET Core / .NET Standard / Xamarin  
dotnet add package PubnubPCL  
  
# For .NET Framework 4.6.1+  
dotnet add package Pubnub  
  
# For Universal Windows Platform (UWP)  
dotnet add package PubnubUWP  
`
```

#### Package Manager Console in Visual Studio[​](#package-manager-console-in-visual-studio)

```
`# For .NET Core / .NET Standard / Xamarin  
Install-Package PubnubPCL  
  
# For .NET Framework 4.6.1+  
Install-Package Pubnub  
  
# For Universal Windows Platform (UWP)  
Install-Package PubnubUWP  
`
```

You can also get the source code directly from [GitHub](https://github.com/pubnub/c-sharp).

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

You'll need to initialize the PubNub client with your unique keys to establish a connection to the PubNub network. This is the minimum configuration required to send and receive messages with PubNub in your application.

In a standard C# application (like a console app or backend service), you typically initialize PubNub at the application's entry point or within a dedicated service class.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal

```
`  
`
```

This code configures and initializes PubNub within the `Main` method of a console application.

For more information, refer to the [Configuration](/docs/sdks/c-sharp/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners allow your application to react to incoming messages and other PubNub events in real-time.

Add the `SetupListeners` method to your `App` class. In a console or backend application, listeners might log messages or trigger other business logic.

```
`  
`
```

For more information, refer to the [Listeners](/docs/sdks/c-sharp/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

Subscribing tells PubNub that you want to receive messages published to specific channels.

Add the `SubscribeToChannel` method to your `App` class. We call this in `Main()` after setting up listeners.

```
`  
`
```

### Publish messages[​](#publish-messages)

Publishing sends messages to a specific channel for all subscribed clients to receive.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

Add the `PublishMessageAsync` method to your `App` class. We call this from `Main()` in our example. Using `async/await` is common in C# for I/O operations.

```
`  
`
```

### Run the app[​](#run-the-app)

Now it's time to see your application in action!

1. $1

2. $1

3. $1

4. $1

5. $1

6. $1

Here's the expected output in the console:

```
`PubNub Initialized!  
PubNub Listeners Set Up.  
Subscribed to channel: my_channel  
Message Published! Timetoken: 16788864001234567 // Timetoken will vary  
Connected to PubNub on channel(s): my_channel  
Message Received: Channel=my_channel, Message={"text":"Hello from C# Console!"}  
Parsed Text: Hello from C# Console!  
Press any key to exit...  
`
```

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together.

```
`  
`
```

### Troubleshooting[​](#troubleshooting)

If you don't see the expected output, here are some common issues and how to fix them:

IssuePossible SolutionsNo connection message
- Check your internet connection.
- Verify your publish and subscribe keys are correct (ensure they match the ones in your PubNub Admin Portal if not using "demo").
- Check for firewall restrictions that might block outbound connections to PubNub servers.

Message not received
- Double-check that both publisher and subscriber are using the exact same channel name.
- Verify the message was published successfully (check for publish error logs).
- Ensure the listener callback logic correctly handles incoming messages and logs them.
- Confirm the `Subscribe` call was executed *after* listeners were added.

Build/Compile errors
- Ensure you've installed the correct PubNub NuGet package.
- Check that all necessary `using PubnubApi;` statements are present.
- Verify you're targeting a compatible .NET Framework/Standard version.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub C# application. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Learn about the [Unity Chat SDK](/docs/chat/unity-chat-sdk) for ready-to-use chat features.

- Implement user [Presence](/docs/sdks/c-sharp/api-reference/presence) to show who's online.

- Add typing indicators and read receipts.

- Try out [Presence](/docs/sdks/c-sharp/api-reference/presence) to track online/offline status in detail.

- Implement [Message Persistence](/docs/sdks/c-sharp/api-reference/storage-and-playback) to store and retrieve past messages.

- Use [Access Manager](/docs/sdks/c-sharp/api-reference/access-manager) to secure your channels and grant permissions.

- Explore [Functions](/docs/serverless/functions/overview) to run serverless logic on your messages in-flight.

- Send push notifications via [Mobile Push Notifications](/docs/sdks/c-sharp/api-reference/mobile-push).

- Explore our [C# GitHub repository](https://github.com/pubnub/c-sharp/) for more code samples and the SDK source.

- Check out our [C# SDK reference documentation](/docs/sdks/c-sharp/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Jun 30, 2025**