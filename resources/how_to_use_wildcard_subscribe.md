# How to Use Wildcard Subscribe

## Table of Contents
- [Overview](#overview)
- [Wildcard Subscribe Rules](#wildcard-subscribe-rules)
- [SDK Examples](#sdk-examples)
  - [JavaScript](#javascript)
  - [Swift](#swift)
  - [Objective-C](#objective-c)
  - [Java](#java)
  - [C#](#c-sharp)
  - [Python](#python)

## Overview

Wildcard Subscribe using the pattern `channelName.*` allows you to subscribe to a hierarchical list of channels. Similar to Channel Groups, you can subscribe to multiple channels with a single name declaration. 

For example, when you specify a wildcard channel pattern like `sports.*`, your app will subscribe to all channel names that match that pattern: `sports.cricket`, `sports.lacrosse`, `sports.football`, etc. This list can be virtually infinite in number, with some limitations described in the rules section below.

## Wildcard Subscribe Rules

There are important limits to what you can do with Wildcard Subscribe:

- **Maximum depth**: You're limited to two dots (three levels). For example, you can subscribe to `a.*` or `a.b.*` but not `a.b.c.*`.
- **Pattern ending**: A wildcard pattern must always end with `.*`. The `*` cannot be in the middle of the pattern (e.g., `a.*.c` is not valid).
- **Publishing restriction**: Just like Channel Groups, you cannot publish to a wildcard channel pattern - you must publish to specific channel names.

## SDK Examples

### JavaScript

```javascript
// Subscribe to wildcard channel
const channel = pubnub.channel("alerts.*");
channel.subscription().subscribe();

// Subscribe to multiple wildcard patterns
const channels = pubnub.channelGroup(["alerts.*", "chats.team1.*"]);
channels.subscription().subscribe();
```

### Swift

```swift
// Single wildcard subscription
let subscription = pubnub.channel("alerts.*").subscription()
subscription.subscribe()

// Multiple wildcard subscriptions
let subscriptions = pubnub.channelGroup(["alerts.*", "chats.team1.*"]).subscription()
subscriptions.subscribe()
```

### Objective-C

```objc
// Subscribe to wildcard channels with presence
[self.pubnub subscribeToChannels:@[@"alerts.*", @"chats.team1.*"] 
                    withPresence:YES];
```

### Java

```java
// Subscribe to wildcard channels with presence
pubnub.subscribe()
    .channels(Arrays.asList("alerts.*", "chats.team1.*"))
    .withPresence()
    .execute();
```

### C Sharp

```csharp
// Create subscription set with wildcard channels
SubscriptionSet subscriptionSet = pubnub.Subscription(
    new string[] {"alerts.*", "chats.team1.*"},
    SubscriptionOptions.ReceivePresenceEvents);

subscriptionSet.Subscribe();
```

### Python

```python
# Subscribe to wildcard channels with presence
subscription_set = pubnub.subscription_set(
    channels=["alerts.*", "chats.team1.*"]
)
subscription_set.subscribe(with_presence=True)
```