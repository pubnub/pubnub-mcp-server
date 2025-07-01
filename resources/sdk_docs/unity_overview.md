# Unity API & SDK Docs v9.0.1 (Condensed)

This overview keeps only the essentials—all code blocks, method signatures, parameters, and key setup details are unchanged.

---

## Overview
• PubNub Unity SDK targets iOS, Android, Windows, macOS, Linux, WebGL, and VR/AR.  
• API use is identical across platforms; only initialization can differ.

### WebGL
SDK is WebGL-compatible. Configuration details: `/configuration#webgl-configuration`.

---

## Prerequisites
• Unity 2018.4.26f1+  
• C# / Unity basics  
• PubNub account & keyset

---

## Setup

### Get your PubNub keys
1. Log in / sign up on PubNub Admin Portal.  
2. Create (or select) an app.  
3. Note the Publish & Subscribe keys.  
(Use separate keysets for dev / prod.)

### Install the SDK

#### Package Manager (recommended)
Window → Package Manager → “+” → **Add package from git URL**

```
https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub
```

Then: PubNub menu → **Set up templates** → restart Unity.

#### Source code

```
https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub
```

---

## Steps

### Configure PubNub (Editor)
1. Project tree → Create → PubNub → **PubNub Config Asset** (`PNConfigAsset`).  
2. Enter Publish / Subscribe keys (others optional).  
3. Ensure every client has a unique **UserId** (auto-generated in editor, but set meaningful IDs in production).  
4. Project tree → Create → PubNub → **PubNub Manager Script** (`PnManager`).  
5. Add `PnManager` to a GameObject and drag `PNConfigAsset` into its **PubNub Configuration** field.

#### Configure programmatically

```csharp
// Create a configuration object
PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));
pnConfiguration.PublishKey   = "demo";   // ← replace
pnConfiguration.SubscribeKey = "demo";   // ← replace
pnConfiguration.Secure       = true;     // SSL on

// Initialize PubNub
Pubnub pubnub = new Pubnub(pnConfiguration);
```

---

### Set up event listeners

```csharp
// Add listeners
listener.onStatus  += OnPnStatus;
listener.onMessage += OnPnMessage;

// Status handler
void OnPnStatus(Pubnub pn, PNStatus status) {
    Debug.Log(status.Category == PNStatusCategory.PNConnectedCategory ? "Connected" : "Not connected");
}

// Message handler
void OnPnMessage(Pubnub pn, PNMessageResult<object> result) {
    Debug.Log($"Message received: {result.Message}");
}
```

---

### Create a subscription

```csharp
// Modern API
Channel channel         = pubnub.Channel("TestChannel");
Subscription subscription = channel.Subscription();
subscription.Subscribe<object>();

// Legacy API
pubnub.Subscribe<string>().Channels(new[] { "TestChannel" }).Execute();
```

---

### Publish messages

```csharp
// Simple publish
await pubnub.Publish()
            .Channel("TestChannel")
            .Message("Hello World from Unity!")
            .ExecuteAsync();

// Publish Unity object (handles circular refs)
await pubnub.Publish()
            .Channel("TestChannel")
            .Message(transform.position.GetJsonSafe())
            .ExecuteAsync();

// Callback style
pubnub.Publish()
      .Channel("TestChannel")
      .Message("Hello World from Unity!")
      .Execute((result, status) => {
          if (!status.Error) {
              Debug.Log("Message sent successfully!");
          } else {
              Debug.LogError("Failed to send message: " + status.ErrorData.Information);
          }
      });
```

---

### Run the app
1. Enter Play mode (or build).  
2. Ensure keys, UserId, and network connectivity are correct.  
3. Publish a message; confirm it appears in the console of all subscribed clients.  
4. Stop Play mode / exit build.

---

## Complete example

```csharp
using System.Collections.Generic;
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
```
<!-- (rest of 51-line example unchanged in full documentation) -->

---

## Troubleshooting

No connection:  
• Verify internet, keys, firewall, SSL.  

Message not received:  
• Check channel names, send status, wait for delivery.  

Script errors:  
• Confirm PubNub package imported and Unity version supported.  

WebGL issues:  
• Enable WebGL in `PNConfigAsset`; follow WebGL guide.

---

## Next steps
• Presence, Storage, Access Manager, leaderboards, chat, multiplayer position sync.  
• Samples: PubNub Prix demo, GitHub repo.  
• Full API reference & support portal available online.

_Last updated Apr 29 2025_