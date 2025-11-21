# C# API & SDK Docs 8.0.3

This guide demonstrates core PubNub concepts in C#:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview[​](#overview)

Works across .NET Framework, .NET Core, Xamarin, UWP. Core PubNub concepts and API usage are consistent across C# platforms.

##### SDK packages
- `Pubnub`: .NET Framework 4.6.1+
- `PubnubPCL`: .NET Standard 2.0+ (includes .NET Core, Xamarin)
- `PubnubUWP`: Universal Windows Platform

## Prerequisites[​](#prerequisites)

- Basic C#
- C# IDE (Visual Studio, VS Code, Rider)
- .NET Framework 4.6.1+ or .NET Core 2.0+
- PubNub account

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

- Sign in or create an account on the PubNub Admin Portal.
- Create an app (or use an existing one).
- Get publish and subscribe keys from the app dashboard.
- Use separate keysets for dev and prod.

### Install the SDK[​](#install-the-sdk)

##### SDK version
Use the latest SDK version.

#### .NET CLI[​](#net-cli)
```
1# For .NET Core / .NET Standard / Xamarin  
2dotnet add package PubnubPCL  
3
  
4# For .NET Framework 4.6.1+  
5dotnet add package Pubnub  
6
  
7# For Universal Windows Platform (UWP)  
8dotnet add package PubnubUWP  

```

#### Package Manager console in Visual Studio[​](#package-manager-console-in-visual-studio)
```
1# For .NET Core / .NET Standard / Xamarin  
2Install-Package PubnubPCL  
3
  
4# For .NET Framework 4.6.1+  
5Install-Package Pubnub  
6
  
7# For Universal Windows Platform (UWP)  
8Install-Package PubnubUWP  

```

#### Source code[​](#source-code)

Clone the GitHub repository:
```
`1git clone https://github.com/pubnub/c-sharp  
`
```

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

Initialize the PubNub client with your publish and subscribe keys. Replace demo keys with your app's keys.
```
1
  

```
See [Configuration](/docs/sdks/c-sharp/api-reference/configuration).

### Set up event listeners[​](#set-up-event-listeners)

Add listeners to handle messages and events.
```
1
  

```
See [Listeners](/docs/sdks/c-sharp/api-reference/configuration#event-listeners).

### Create a subscription[​](#create-a-subscription)

Subscribe to channels to receive messages.
```
1
  

```
See [Subscribe](/docs/sdks/c-sharp/api-reference/publish-and-subscribe#subscribe).

### Publish messages[​](#publish-messages)

Publish JSON-serializable messages (<= 32 KiB).
```
1
  

```

### Run the app[​](#run-the-app)

Expected console output:
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
```
1
  

```

### Troubleshooting[​](#troubleshooting)

No connection message
- Check internet connection.
- Verify publish/subscribe keys.
- Check firewall restrictions.

Message not received
- Ensure publisher and subscriber use the same channel.
- Verify publish success.
- Validate listener callback logic.
- Call Subscribe after adding listeners.

Build/Compile errors
- Install the correct PubNub NuGet package.
- Include using PubnubApi; statements.
- Target a compatible .NET Framework/Standard version.

## Next steps[​](#next-steps)

- Learn about the [Unity Chat SDK](/docs/chat/unity-chat-sdk).
- Add typing indicators and read receipts.
- Try [Presence](/docs/sdks/c-sharp/api-reference/presence).
- Use [Message Persistence](/docs/sdks/c-sharp/api-reference/storage-and-playback).
- Secure channels with [Access Manager](/docs/sdks/c-sharp/api-reference/access-manager).
- Run serverless logic with [Functions](/docs/serverless/functions/overview).
- Send [Mobile Push Notifications](/docs/sdks/c-sharp/api-reference/mobile-push).
- Explore the [C# GitHub repository](https://github.com/pubnub/c-sharp/).
- Read the [C# SDK reference](/docs/sdks/c-sharp/api-reference/configuration).
- Visit the [support portal](https://support.pubnub.com/).

Last updated on Sep 3, 2025