# C# API & SDK Docs 7.3.15 (Overview)

This condensed overview keeps all critical technical details, method signatures, parameters, and every original code block.

## SDK Packages
* `Pubnub` – .NET Framework 4.6.1+
* `PubnubPCL` – .NET Standard 2.0+ (.NET Core, Xamarin, etc.)
* `PubnubUWP` – Universal Windows Platform

## Prerequisites
* C# development environment (VS 2019/2022, VS Code, Rider, etc.)
* .NET Framework 4.6.1+ or .NET Core 2.0+
* Valid PubNub publish & subscribe keys

## Get PubNub Keys
1. Sign in / create account on the PubNub Admin Portal.  
2. Create (or select) an app to obtain **publish** & **subscribe** keys.  
   • For production, create separate keysets for each environment.

## Install the SDK

### .NET CLI

```
`# For .NET Core / .NET Standard / Xamarin  
dotnet add package PubnubPCL  
  
# For .NET Framework 4.6.1+  
dotnet add package Pubnub  
  
# For Universal Windows Platform (UWP)  
dotnet add package PubnubUWP  
`
```

### Package Manager Console in Visual Studio

```
`# For .NET Core / .NET Standard / Xamarin  
Install-Package PubnubPCL  
  
# For .NET Framework 4.6.1+  
Install-Package Pubnub  
  
# For Universal Windows Platform (UWP)  
Install-Package PubnubUWP  
`
```

Latest releases are also on GitHub: <https://github.com/pubnub/c-sharp>

## Initialize PubNub

```
`  
`
```

• Configure `PNConfiguration` with your publish/subscribe keys, then instantiate `Pubnub`.  
• Initialize once (for example, in `Main` or a service class).

## Set Up Event Listeners

```
`  
`
```

• Attach a listener to receive messages, presence events, and status updates.  
• Add listeners before subscribing.

## Subscribe to Channels

```
`  
`
```

• Call `Subscribe()` (or `Subscribe<string>()`) with one or more channel names.

## Publish Messages (≤ 32 KiB, JSON-serializable)

```
`  
`
```

• Use `await pubnub.Publish().Channel("my_channel").Message(obj).ExecuteAsync();`

## Expected Console Output

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

## Complete Example

```
`  
`
```

## Troubleshooting

• No connection → check internet, keys, firewall.  
• Message not received → verify same channel, publish success, listener added before subscribe.  
• Build errors → confirm correct NuGet package, `using PubnubApi;`, and target framework version.

## Next Steps

Explore:
* Presence, Message Persistence, Access Manager
* Functions, Mobile Push, Unity Chat SDK
* Full C# API reference & samples on GitHub  
* Community support via Discord & support portal

_Last updated Jul 15 2025_