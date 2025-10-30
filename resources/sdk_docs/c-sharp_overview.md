# C# API & SDK Docs 8.0.0

This guide shows how to set up a PubNub "Hello, World" in C# across .NET Framework, .NET Core, Xamarin, and UWP: connect, publish, and receive messages.

## Overview

Core PubNub concepts and API usage are consistent across C# platforms.

##### SDK packages
- Pubnub: For .NET Framework 4.6.1+
- PubnubPCL: For .NET Standard 2.0+ (includes .NET Core, Xamarin)
- PubnubUWP: For Universal Windows Platform

Choose the package for your target platform.

## Prerequisites

- Basic C#
- C# development environment (Visual Studio, VS Code, Rider)
- .NET Framework 4.6.1+ or .NET Core 2.0+
- PubNub account

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app or use an existing one.
- Get your publish and subscribe keys from the app dashboard.

PubNub generates a keyset per app. Use separate keysets for development and production.

### Install the SDK

##### SDK version
Use the latest SDK for features, security, and performance.

#### .NET CLI
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

#### Package Manager console in Visual Studio
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

#### Source code
Clone the GitHub repository:
```
`1git clone https://github.com/pubnub/c-sharp  
`
```

## Steps

### Initialize PubNub

Initialize the client with your publish and subscribe keys (replace demo keys). Typically done in Main or a service class.
```
1
  

```
See Configuration: /docs/sdks/c-sharp/api-reference/configuration

### Set up event listeners

Add listeners to handle messages and events (logging, business logic).
```
1
  

```
See Listeners: /docs/sdks/c-sharp/api-reference/configuration#event-listeners

### Create a subscription

Subscribe to channels to receive messages.
```
1
  

```
See Subscribe: /docs/sdks/c-sharp/api-reference/publish-and-subscribe#subscribe

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
5. $1
6. $1

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

## Complete example
```
1
  

```

### Troubleshooting

No connection message
- Check internet connection.
- Verify publish/subscribe keys match the Admin Portal.
- Check firewall rules for outbound connections to PubNub.

Message not received
- Ensure publisher and subscriber use the exact same channel.
- Verify publish success (check error logs).
- Confirm listener callbacks handle and log incoming messages.
- Subscribe after adding listeners.

Build/Compile errors
- Install the correct PubNub NuGet package.
- Ensure using PubnubApi; is present.
- Target a compatible .NET Framework/Standard version.

## Next steps

- Learn about the Unity Chat SDK: /docs/chat/unity-chat-sdk
- Add typing indicators and read receipts.
- Presence: /docs/sdks/c-sharp/api-reference/presence
- Message Persistence: /docs/sdks/c-sharp/api-reference/storage-and-playback
- Access Manager: /docs/sdks/c-sharp/api-reference/access-manager
- Functions: /docs/serverless/functions/overview
- Mobile Push Notifications: /docs/sdks/c-sharp/api-reference/mobile-push
- C# GitHub repository: https://github.com/pubnub/c-sharp/
- C# SDK reference: /docs/sdks/c-sharp/api-reference/configuration
- Support: https://support.pubnub.com/

Last updated on Sep 3, 2025