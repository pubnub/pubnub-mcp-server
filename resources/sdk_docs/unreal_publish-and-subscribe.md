# Publish/Subscribe API for Unreal SDK

Use PubNub via Blueprints (Pubnub Subsystem node) or C++.

Add C++ dependency in Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access subsystem in C++:

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

## Publish - Channel entity

Available in entities: Channel

`PublishMessage()` sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize with publishKey.
  - Create a Channel entity to publish to.
  - Subscription to the channel is not required to publish.
  - Cannot publish to multiple channels simultaneously.
- Security
  - Use TLS/SSL during initialization; encryption supported.
- Message data
  - JSON-serializable data (objects, arrays, integers, strings). UTF‑8 strings.
  - Don't JSON serialize the message or meta; SDK handles serialization.
- Size
  - Max 32 KiB (includes escaped chars and channel). Aim under ~1,800 bytes.
- Publish rate
  - Soft throughput limit; in-memory subscriber queue of 100 messages.
- Custom message type
  - Optional CustomMessageType (for example: text, action, poll).
- Best practices
  - Publish serially; verify success; retry on failure.
  - Keep queue under 100; throttle bursts (e.g., ≤5 msg/s).

### Method(s)

To publish to a channel, first create a Channel entity.

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
- Message (FString): Message to publish; literal or JSON-formatted string.
- OnPublishMessageResponse (FOnPublishMessageResponse): Delegate for result. Also supports FOnPublishMessageResponseNative.
- PublishSettings (FPubnubPublishSettings): Publish configuration.

#### FPubnubPublishSettings

- StoreInHistory (bool): Store message for History API. Default true.
- Ttl (int): Time-to-live in hours; defaults to key’s retention if not set.
- MetaData (FString): JSON object for additional metadata (for filtering).
- PublishMethod (EPubnubPublishMethod): HTTP method:
  - PPM_SendViaGET
  - PPM_SendViaPOST
  - PPM_UsePATCH
  - PPM_SendViaPOSTwithGZIP
  - PPM_UsePATCHwithGZIP
  - PPM_UseDELETE
- Replicate (bool): If true, deliver to all subscribers; if false, to Functions only.
- CustomMessageType (FString): 3–50 chars, case-sensitive, alphanumeric, allows - and _. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

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

Before running, subscribe to the same channel.

### Returns

Void; result provided via FOnPublishMessageResponse delegate.

#### FOnPublishMessageResponse

- Result (FPubnubOperationResult): Operation result.
- PublishedMessage (FPubnubMessageData): Result payload.

#### FPubnubMessageData

- Message (FString): The message.
- Channel (FString): Target channel.
- UserID (FString): Publisher info.
- Timetoken (FString): Publish timetoken.
- Metadata (FString): Published metadata.
- MessageType (EPubnubMessageType): Signal, published, etc.
- CustomMessageType (FString): User-provided type.
- MatchOrGroup (FString): Subscription match or group.
- region (int): Message region.
- flags (int): Message flags.

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

`PublishMessage()` sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize with publishKey.
  - No need to be subscribed.
  - Cannot publish to multiple channels simultaneously.
- Security, message data, size, rate, custom type, best practices: same as Channel entity publish.

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
- Channel (FString): Channel ID.
- Message (FString): Literal or JSON-formatted string.
- OnPublishMessageResponse (FOnPublishMessageResponse): Delegate for result. Also supports FOnPublishMessageResponseNative.
- PublishSettings (FPubnubPublishSettings): Publish configuration.

### Sample code

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

- Prerequisites and limitations
  - Initialize with publishKey.
  - Create a Channel entity to signal to.
  - Payload size limited to 64 bytes (payload only). Contact support for higher.
- Signal vs. Message (key differences)
  - Payload size: 64B vs 32KB
  - Cost: signals cheaper
  - Persistence: signals not stored; messages can be persisted
  - Push: signals can’t trigger push; messages can
  - Use cases: signals for non-critical (e.g., geolocation)
  - Metadata: signals don’t support; messages do
- Channel separation: use separate channels for signals vs messages.

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
- Message (FString): Literal or JSON-formatted string.
- OnSignalResponse (FOnSignalResponse): Delegate for result. Also supports FOnSignalResponseNative.
- SignalSettings (FPubnubSignalSettings): Signal configuration.

#### FPubnubSignalSettings

- CustomMessageType (FString): 3–50 chars, case-sensitive, alphanumeric, allows - and _. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

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

Delegate returns FOnSignalResponse.

#### FOnSignalResponse

- Result (FPubnubOperationResult)
- SignalMessage (FPubnubMessageData)

#### FOnSignalResponseNative

- Result (const FPubnubOperationResult&)
- SignalMessage (const FPubnubMessageData&)

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

## Signal - PubNub client

Not recommended; use entity-based Signal.

`Signal()` sends a signal to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize with publishKey.
  - 64-byte payload limit (payload only).

- Signal vs. Message: see above.
- Channel separation: use separate channels.

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
- Channel (FString): Channel ID.
- Message (FString): Literal or JSON-formatted string.
- OnSignalResponse (FOnSignalResponse): Delegate for result. Also supports FOnSignalResponseNative.
- SignalSettings (FPubnubSignalSettings): Signal configuration.

### Sample code

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

### Subscription scope

- Subscription: created from an entity; scoped to that entity.
- SubscriptionSet: created from the client; scoped to client; can include multiple subscriptions.

### Create a subscription

Subscription’s lifecycle is independent of the entity.

```
1// Create entity  
2UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
3
  
4// Create subscription from entity  
5UPubnubSubscription* Subscription = ChannelEntity->CreateSubscription();  

```

Parameters:
- SubscribeSettings (FPubnubSubscribeSettings): Subscription configuration.

#### FPubnubSubscribeSettings

- ReceivePresenceEvents (bool): Subscribe to presence events.

### Create a subscription set

SubscriptionSet lifecycle is independent.

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

- Timetoken (FString, required): Start time.
- Region (int, optional): Set automatically.

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

Attach listeners to Subscription or SubscriptionSet to receive messages, signals, presence, objects, and message actions.

### Add listeners

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

Client scope: Only on PubnubSubsystem.

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

Emits various subscription statuses (see SDK Connection Lifecycle docs).

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

Client scope: Only on PubnubSubsystem.

### Method(s)

```
`1PubnubSubsystem->UnsubscribeFromAll(FOnSubscribeOperationResponse OnUnsubscribeFromAllResponse);  
`
```

Parameters:
- OnUnsubscribeFromAllResponse (FOnSubscribeOperationResponse): Delegate for result. Also supports FOnSubscribeOperationResponseNative.

### Sample code

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