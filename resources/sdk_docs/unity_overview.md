# Unity API & SDK Docs v9.1.0 – Overview (condensed)

## Supported targets
• Mobile (iOS, Android)  
• Desktop (Windows, macOS, Linux)  
• WebGL (see WebGL configuration)  
• VR/AR  

## Prerequisites
• Unity 2018.4.26f1 or newer  
• C# / Unity basics  
• PubNub account (publish & subscribe keys)  

## Setup

### 1. Get PubNub keys
Admin Portal → create app → copy Publish/Subscribe keys.  
Use separate keysets for dev / prod.

### 2. Install SDK (latest version)

Package Manager (recommended):  
Window → Package Manager → “+” → Add package from git URL → paste:

```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```

Restart Unity, then PubNub → Set up templates.

Source code alternative (same URL):

```
`https://github.com/pubnub/unity.git?path=/PubNubUnity/Assets/PubNub  
`
```

## Configure PubNub

Editor workflow:  
1. Project tree → Create → PubNub → PubNub Config Asset (`PNConfigAsset`)  
2. Enter Publish/Subscribe keys, optionally set other fields.  
3. Ensure every client has a unique UserId (auto-generated for tests; specify in production).  
4. Create PubNub Manager Script → add to GameObject → drag `PNConfigAsset` into “PubNub Configuration”.

Programmatic alternative:

```
`  
`
```

## Event Listeners

Add both listener types to handle SDK callbacks:

```
`  
`
```

• Status Listener – connection / operation events  
• Message Listener – real-time messages  

## Subscribe

Three-step subscription flow:

1. Create listener  
2. Add channels  
3. Call Subscribe

```
`  
`
```

## Publish

Send ≤ 32 KiB JSON-serializable payloads to a channel:

```
`  
`
```

## Run

1. Enter Play mode or build to target platform  
2. Observe Status callback (connected)  
3. Publish a message → received in Message callback  
4. Verify console output / in-game UI  

## Complete example

```
`  
`
```

## Troubleshooting (quick)

• No connection → check Internet, keys, firewall, SSL.  
• Message not received → verify channel, publish success, allow time.  
• Script errors → confirm SDK import & Unity version.  
• WebGL issues → enable WebGL mode in `PNConfigAsset`, follow WebGL configuration docs.  

## Next steps

Presence, Storage, Access Manager, real-time chat, leaderboards, GitHub samples, support portal, AI assistant.

_Last updated Jul 15 2025_