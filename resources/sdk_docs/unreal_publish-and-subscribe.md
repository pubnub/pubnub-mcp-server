# Publish/Subscribe API for Unreal SDK (Condensed)

Use PubNub via Blueprints (Pubnub Subsystem) or C++.

- Blueprints: Start with the Pubnub Subsystem node.
- C++: Add PubnubLibrary dependency and use PubNub as a Game Instance Subsystem.

Add dependency in Source/_{YourProject}_/_{YourProject}_.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access subsystem and use:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

For conceptual guidance, see Connection Management and Publish Messages.

## Publish - Channel entity

Available in entities: Channel

`PublishMessage()` sends a message to all subscribers of a channel.

Key requirements and limits:
- Initialize with publishKey.
- Create a Channel entity to publish to.
- You don’t need to be subscribed to publish; cannot publish to multiple channels simultaneously.
- Transport security via TLS/SSL during initialization; optional encryption.
- Message data: Any JSON-serializable data. Avoid special classes/functions. UTF‑8 strings.
- Don’t JSON serialize message/meta; SDK serializes automatically.
- Max message size: 32 KiB (includes channel name and escaped chars). Aim <1,800 bytes for best performance. Exceeding returns Message Too Large.
- Soft throughput limit; in-memory subscriber queue is 100 messages. Publish as bandwidth allows but throttle bursts.
- Optional CustomMessageType (for business categorization): e.g., text, action, poll.

Best practices:
- Publish serially; verify success ([1,"Sent","136074940..."]); on failure ([0,"blah","<timetoken>"]) retry.
- Keep in-memory queue under 100; throttle (e.g., ≤5 msg/s).

### Method(s)

Create a Channel entity first:

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->PublishMessage(  
4    FString Message,  
5    FOnPublishMessageResponse OnPublishMessageResponse,  
6    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
7);  

```

Parameters:
- Message (FString, required): Literal or JSON-formatted string.
- OnPublishMessageResponse (FOnPublishMessageResponse): Delegate for result. Native: FOnPublishMessageResponseNative.
- PublishSettings (FPubnubPublishSettings): Publish configuration.

#### FPubnubPublishSettings
- StoreInHistory (bool): Whether to store for History API. Default true.
- Ttl (int): Time-to-live (hours). Uses key’s default if not set.
- MetaData (FString): JSON object for filtering.
- PublishMethod (EPubnubPublishMethod): 
  - PPM_SendViaGET
  - PPM_SendViaPOST
  - PPM_UsePATCH
  - PPM_SendViaPOSTwithGZIP
  - PPM_UsePATCHwithGZIP
  - PPM_UseDELETE
- Replicate (bool): If true, message is replicated to subscribers; if false, to Functions only.
- CustomMessageType (FString): 3–50 chars, alphanumeric plus - and _. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

##### Reference code

#### Publish a message to a channel

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

Subscribe to the same channel before running the publish example.

### Returns

Void; result via FOnPublishMessageResponse.

#### FOnPublishMessageResponse
- Result (FPubnubOperationResult): Operation result.
- PublishedMessage (FPubnubMessageData): Operation data.

#### FPubnubMessageData
- Message (FString): The message.
- Channel (FString): Published channel.
- UserID (FString): Publisher info.
- Timetoken (FString): Publish timetoken.
- Metadata (FString): Published metadata.
- MessageType (EPubnubMessageType): Signal, Published, etc.
- CustomMessageType (FString): User-provided type.
- MatchOrGroup (FString): Subscription match or group.
- region (int), flags (int).

#### EPubnubMessageType
- PMT_Signal
- PMT_Published
- PMT_Action
- PMT_Objects
- PMT_Files

#### FOnPublishMessageResponseNative
- Result (const FPubnubOperationResult&)
- PublishedMessage (const FPubnubMessageData&)

### Other examples

##### Reference code

#### Publish a message with settings

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

#### Publish a message with result

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

## Publish - PubNub client

`PublishMessage()` sends a message to all subscribers of a channel.

Requirements and limits (same as Channel entity publish):
- Initialize with publishKey.
- Not required to be subscribed; cannot publish to multiple channels simultaneously.
- TLS/SSL; optional encryption.
- JSON-serializable message; don’t JSON serialize inputs.
- Max 32 KiB; soft throughput; optional CustomMessageType; follow best practices above.

### Method(s)

```
`1PubnubSubsystem->PublishMessage(  
2    FString Channel,  
3    FString Message,   
4    FOnPublishMessageResponse OnPublishMessageResponse,  
5    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
6);  
`
```

Parameters:
- Channel (FString, required): Channel ID.
- Message (FString, required): Literal or JSON-formatted string.
- OnPublishMessageResponse (FOnPublishMessageResponse): Delegate; native FOnPublishMessageResponseNative.
- PublishSettings (FPubnubPublishSettings)

### Sample code

##### Reference code

#### Publish a message to a channel

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

Void; result via FOnPublishMessageResponse.

### Other examples

##### Reference code

#### Publish a message with settings

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

#### Publish a message with result

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

## Signal - Channel entity

Available in entities: Channel

`Signal()` sends a signal to all channel subscribers.

Requirements and limits:
- Initialize with publishKey.
- Create a Channel entity to signal on.
- Payload limit: 64 bytes (payload only). Contact support for higher limits.

Signals vs. Messages:
- Payload size: Signals 64B; Messages 32KB
- Cost: Signals cheaper
- Persistence: Signals cannot be stored; Messages can
- Push notifications: Signals cannot trigger; Messages can
- Use cases: Signals for non-critical streams (e.g., geolocation); Messages for general use
- Metadata: Signals don’t support metadata; Messages do

Channel separation: Use separate channels for signals and messages.

### Method(s)

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->Signal(  
4    FString Message,  
5    FOnSignalResponse OnSignalResponse,  
6    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
7);  

```

Parameters:
- Message (FString, required): Literal or JSON-formatted string.
- OnSignalResponse (FOnSignalResponse): Delegate; native FOnSignalResponseNative.
- SignalSettings (FPubnubSignalSettings)

#### FPubnubSignalSettings
- CustomMessageType (FString): Same constraints as publish. Examples: text, action, poll.

### Sample code

##### Reference code

#### Signal a message to a channel

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

Result via FOnSignalResponse.

#### FOnSignalResponse
- Result (FPubnubOperationResult)
- SignalMessage (FPubnubMessageData)

#### FOnSignalResponseNative
- Result (const FPubnubOperationResult&)
- SignalMessage (const FPubnubMessageData&)

### Other examples

##### Reference code

#### Signal with custom message type

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

## Signal - PubNub client

Not recommended; prefer entity-based Signal.

`Signal()` sends a signal to all channel subscribers.

Requirements and limits:
- Initialize with publishKey.
- Payload limit: 64 bytes (payload only). Contact support for higher limits.
- Signals vs. Messages: same differences as above.
- Channel separation recommended.

### Method(s)

```
`1PubnubSubsystem->Signal(  
2    FString Channel,   
3    FString Message,  
4    FOnSignalResponse OnSignalResponse,  
5    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
6);  
`
```

Parameters:
- Channel (FString, required)
- Message (FString, required)
- OnSignalResponse (FOnSignalResponse); native FOnSignalResponseNative
- SignalSettings (FPubnubSignalSettings)

### Sample code

##### Reference code

#### Signal a message to a channel

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

Void; result via FOnSignalResponse.

### Other examples

#### Signal with custom message type

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

## Subscribe

Opens a TCP socket and listens for messages/events. Set SubscribeKey during initialization.

Entities:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

Subscription scope:
- Subscription: Scoped to an entity (e.g., one channel).
- SubscriptionSet: Scoped to the client (PubnubSubsystem); includes one or more subscriptions.

Event listeners deliver messages, signals, presence, objects, message actions.

### Create a subscription

Lifecycle: Subscription lives independently of the entity.

```
1// Create entity  
2UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
3
  
4// Create subscription from entity  
5UPubnubSubscription* Subscription = ChannelEntity->CreateSubscription();  

```

Parameters:
- SubscribeSettings (FPubnubSubscribeSettings)

#### FPubnubSubscribeSettings
- ReceivePresenceEvents (bool): Subscribe to presence events.

### Create a subscription set

Lifecycle: Independent of entities.

Use for aggregating events across multiple entities.

#### From channel or channel group names

```
`1PubnubSubsystem->CreateSubscriptionSet(Channels, ChannelGroups, SubscriptionSettings);  
`
```

Parameters:
- Channels (TArray<FString>)
- ChannelGroups (TArray<FString>)
- SubscriptionSettings (FPubnubSubscribeSettings)

#### From entities

```
`1PubnubSubsystem->CreateSubscriptionSetFromEntities(Entities, SubscriptionSettings);  
`
```

Parameters:
- Entities (TArray<UPubnubBaseEntity*>)
- SubscriptionSettings (FPubnubSubscribeSettings)

### Method(s)

- Subscribe
- Subscribe with timetoken

#### Subscribe

```
`1// Subscribe to start receiving messages  
2Subscription->Subscribe();  
3// Subscribe to all entities in the set  
4SubscriptionSet->Subscribe();  
`
```

#### Sample code

##### Reference code

##### Subscribe to a channel

- C++

###### Actor.h
  

```
1
  

```

###### Actor.cpp
  

```
1
  

```

#### Subscribe with timetoken

```
1// Subscribe with timetoken  
2FPubnubSubscriptionCursor Cursor;  
3Cursor.Timetoken = "15640261328790011";  
4
  
5Subscription->Subscribe(Cursor);  

```

##### FPubnubSubscriptionCursor
- Timetoken (FString, required): Start point.
- Region (int, optional): Usually auto-set.

#### Add subscriptions

```
`1// Add individual subscription to set  
2UPubnubSubscription* NewSubscription = ChannelEntity->CreateSubscription();  
3SubscriptionSet->AddSubscription(NewSubscription);  
`
```

#### Remove subscriptions

```
`1// Remove subscription from set  
2SubscriptionSet->RemoveSubscription(NewSubscription);  
`
```

#### Merge subscription sets

```
`1// Merge subscription sets  
2SubscriptionSet1->AddSubscriptionSet(SubscriptionSet2);  
`
```

#### Remove subscription sets

```
`1// Remove subscription set from another set  
2SubscriptionSet1->RemoveSubscriptionSet(SubscriptionSet2);  
`
```

### Other examples

#### Subscribe to a channel group

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Subscribe to channel metadata

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Subscribe to user metadata

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Create subscription set from names

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Create subscription set from entities

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Manage subscriptions in a set

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Merge subscription sets

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## Event listeners

Attach listeners to Subscription or SubscriptionSet to receive messages, signals, presence, object events, and message actions.

### Add listeners

Catch-all: OnAnyEventReceived.

#### Handle multiple event types

```
1// Add message listener  
2Subscription->OnPubnubMessage.AddDynamic(this, &AMyActor::OnMessageReceived);  
3
  
4// Add signal listener  
5Subscription->OnPubnubSignal.AddDynamic(this, &AMyActor::OnSignalReceived);  
6
  
7// Add presence event listener  
8Subscription->OnPubnubPresenceEvent.AddDynamic(this, &AMyActor::OnPresenceEventReceived);  
9
  
10// Add object event listener  
11Subscription->OnPubnubObjectEvent.AddDynamic(this, &AMyActor::OnObjectEventReceived);  
12
  
13// Add message action listener  
14Subscription->OnPubnubMessageAction.AddDynamic(this, &AMyActor::OnMessageActionReceived);  
15
  
16// Add universal listener (catches all event types)  
17Subscription->FOnPubnubAnyMessageType.AddDynamic(this, &AMyActor::OnAnyEventReceived);  

```
show all 17 lines

#### Handle one event type with native callbacks

```
1// Add native callback listeners  
2Subscription->OnPubnubMessageNative.AddLambda([](const FPubnubMessageData& Message) {  
3    UE_LOG(LogTemp, Log, TEXT("Message received: %s"), *Message.Message);  
4});  
5
  
6Subscription->OnPubnubSignalNative.AddLambda([](const FPubnubMessageData& Signal) {  
7    UE_LOG(LogTemp, Log, TEXT("Signal received: %s"), *Signal.Message);  
8});  

```

#### Remove event listener

```
1// Remove specific listener  
2Subscription->OnPubnubMessage.RemoveDynamic(this, &AMyActor::OnMessageReceived);  
3
  
4// Remove all listeners for a specific event type  
5Subscription->OnPubnubMessage.RemoveAll(this);  

```

### Add connection status listener

Client scope only (PubNub object).

#### Method(s)

```
`1// Add subscription status listener  
2PubnubSubsystem->OnSubscriptionStatusChanged.AddDynamic(this, &AMyActor::OnSubscriptionStatusChanged);  
`
```

#### Sample code

- C++

#### Actor.h
  

```
1
  

```
  

#### Actor.cpp
  

```
1
  

```

### Other examples

##### Reference code

#### Subscribe with all event listeners

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Add message listener with lambda

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Add error listener

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Add error listener with lambda

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Returns

Emits subscription status updates depending on client network connection. See SDK Connection Lifecycle.

#### Other examples

##### Add connection status listener with lambda

```
`1// Add subscription status listener with lambda  
2PubnubSubsystem->OnSubscriptionStatusChangedNative.AddLambda([](EPubnubSubscriptionStatus Status) {  
3    UE_LOG(LogTemp, Log, TEXT("Subscription status changed: %d"), (int32)Status);  
4});  
`
```

## Unsubscribe

Stop receiving updates from a Subscription or SubscriptionSet.

### Method(s)

```
1// Unsubscribe from a subscription  
2Subscription->Unsubscribe();  
3
  
4// Unsubscribe from a subscription set  
5SubscriptionSet->Unsubscribe();  

```

### Sample code

#### Unsubscribe from a subscription

```
`1// Unsubscribe from a subscription  
2Subscription->Unsubscribe();  
`
```

#### Unsubscribe from a subscription set

```
`1// Unsubscribe from all entities in the set  
2SubscriptionSet->Unsubscribe();  
`
```

### Returns

None

## Unsubscribe all

Stop receiving updates from all listeners and remove associated entities.

Client scope only (PubNubSubsystem).

### Method(s)

```
`1PubnubSubsystem->UnsubscribeFromAll(FOnSubscribeOperationResponse OnUnsubscribeFromAllResponse);  
`
```

- OnUnsubscribeFromAllResponse (FOnSubscribeOperationResponse): Delegate; native FOnSubscribeOperationResponseNative supported.

### Sample code

##### Reference code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

No return value.