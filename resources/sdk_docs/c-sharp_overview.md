# C# API & SDK Docs 7.3.14 – Overview

This condensed guide shows the minimum you need to:

1. Install the correct NuGet package  
2. Initialize PubNub with your keys  
3. Add listeners, subscribe, and publish  

All code blocks, commands, and critical details are preserved.

---

## SDK Packages

* **Pubnub** – .NET Framework 4.6.1+  
* **PubnubPCL** – .NET Standard 2.0+ (.NET Core, Xamarin)  
* **PubnubUWP** – UWP  

---

## Prerequisites

* C# IDE (Visual Studio / VS Code / Rider)  
* .NET Framework 4.6.1+ or .NET Core 2.0+  
* PubNub publish & subscribe keys  

---

## Get Your PubNub Keys

1. Log in to the [PubNub Admin Portal](https://admin.pubnub.com/).  
2. Create (or open) an app → copy the publish & subscribe keys.  

---

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

### Package Manager Console

```
`# For .NET Core / .NET Standard / Xamarin  
Install-Package PubnubPCL  
  
# For .NET Framework 4.6.1+  
Install-Package Pubnub  
  
# For Universal Windows Platform (UWP)  
Install-Package PubnubUWP  
`
```

Source code: <https://github.com/pubnub/c-sharp>

---

## Initialize PubNub

Replace the demo keys with your own.

```
`  
`
```

---

## Set Up Event Listeners

```
`  
`
```

---

## Subscribe to a Channel

```
`  
`
```

---

## Publish a Message

```
`  
`
```

---

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

---

## Complete Example

```
`  
`
```

---

## Troubleshooting (Quick Checklist)

* No connection → check internet, keys, firewall.  
* No message → same channel name, verify publish success, listeners added before `Subscribe`.  
* Build errors → correct NuGet package, `using PubnubApi;`, compatible .NET version.  

---

Last updated: **Jun 30, 2025**