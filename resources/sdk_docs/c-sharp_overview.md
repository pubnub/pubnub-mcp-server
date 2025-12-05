# C# API & SDK Docs 8.0.4

Core concepts:
- Setting up a connection
- Sending messages
- Receiving messages in real time

## Overview

Use PubNub in C# across .NET Framework, .NET Core, .NET Standard, Xamarin, and UWP. Core concepts and API usage are consistent across platforms.

##### SDK packages
- Pubnub: .NET Framework 4.6.1+
- PubnubPCL: .NET Standard 2.0+ (includes .NET Core, Xamarin)
- PubnubUWP: Universal Windows Platform

## Prerequisites

- Basic C#
- C# development environment (Visual Studio, Visual Studio Code, Rider)
- .NET Framework 4.6.1+ or .NET Core 2.0+
- PubNub account

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app and locate publish and subscribe keys (use separate keysets per environment if possible).

### Install the SDK

##### SDK version
Use the latest SDK version.

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
Minimum configuration requires publish and subscribe keys. Initialize at app startup (for example, in Main). Replace demo keys with your own.
```
1
  

```
See Configuration: /docs/sdks/c-sharp/api-reference/configuration

### Set up event listeners
Add listeners to react to messages and events.
```
1
  

```
See Event listeners: /docs/sdks/c-sharp/api-reference/configuration#event-listeners

### Create a subscription
Subscribe to channels to receive messages.
```
1
  

```
See Subscribe: /docs/sdks/c-sharp/api-reference/publish-and-subscribe#subscribe

### Publish messages
Publish JSON-serializable payloads (< 32 KiB) to a channel.
```
1
  

```

### Run the app

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

- No connection message
  - Verify internet connectivity.
  - Confirm publish/subscribe keys (match Admin Portal).
  - Check firewall egress to PubNub.
- Message not received
  - Ensure identical channel name on publisher/subscriber.
  - Check publish success and logs.
  - Confirm listener callback processes and logs messages.
  - Subscribe after adding listeners.
- Build/Compile errors
  - Install the correct PubNub NuGet package.
  - Ensure using PubnubApi; is present.
  - Target compatible .NET version.

## Next steps

- Learn about the Unity Chat SDK: /docs/chat/unity-chat-sdk
- Presence: /docs/sdks/c-sharp/api-reference/presence
- Message Persistence: /docs/sdks/c-sharp/api-reference/storage-and-playback
- Access Manager: /docs/sdks/c-sharp/api-reference/access-manager
- Functions: /docs/serverless/functions/overview
- Mobile Push Notifications: /docs/sdks/c-sharp/api-reference/mobile-push
- C# GitHub repository: https://github.com/pubnub/c-sharp/
- C# SDK reference: /docs/sdks/c-sharp/api-reference/configuration
- Support portal: https://support.pubnub.com/

Last updated on Sep 3, 2025