# C# API & SDK Docs 8.0.1

This guide shows how to set up PubNub in C# (.NET Framework, .NET Core, Xamarin, UWP) to connect, publish, and receive real-time messages. Core concepts and API usage are consistent across C# platforms.

##### SDK packages
- Pubnub: .NET Framework 4.6.1+
- PubnubPCL: .NET Standard 2.0+ (includes .NET Core, Xamarin)
- PubnubUWP: Universal Windows Platform

## Prerequisites
- Basic C# knowledge
- C# development environment (Visual Studio, VS Code, Rider)
- .NET Framework 4.6.1+ or .NET Core 2.0+
- PubNub account and keyset

## Setup

### Get your PubNub keys
- Sign in or create an account in the PubNub Admin Portal.
- Create an app and get publish and subscribe keys from the app’s keyset.
- Use separate keysets for development and production.

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
Initialize PubNub with publish and subscribe keys (replace demo keys with your own). Typically done at app startup. See Configuration docs for details.
```
1
  

```

### Set up event listeners
Add listeners to handle messages and events. See Listeners docs for details.
```
1
  

```

### Create a subscription
Subscribe to channels to receive messages. See Subscribe docs for details.
```
1
  

```

### Publish messages
Publish JSON-serializable payloads (objects, arrays, numbers, strings) up to 32 KiB.
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
  - Check internet connectivity.
  - Verify publish and subscribe keys match your Admin Portal keyset.
  - Check firewall rules for outbound traffic to PubNub.

- Message not received
  - Ensure publisher and subscriber use the exact same channel name.
  - Check publish success and error logs.
  - Confirm listener callback handles and logs incoming messages.
  - Subscribe after adding listeners.

- Build/Compile errors
  - Verify correct NuGet package (Pubnub, PubnubPCL, PubnubUWP).
  - Ensure using PubnubApi; is present.
  - Target a compatible .NET version.

## Next steps
- Build chat with the Unity Chat SDK.
- Add typing indicators and read receipts.
- Use Presence to track online/offline state.
- Enable Message Persistence for history.
- Secure channels with Access Manager.
- Run serverless logic with Functions.
- Send Mobile Push Notifications.
- Explore the C# GitHub repo and C# SDK reference.
- Visit the support portal.

Last updated on Sep 3, 2025