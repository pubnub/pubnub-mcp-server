# Publish/Subscribe API for Unreal SDK (Condensed)

Use PubNub via Blueprints or C++.

- Blueprints: Start with the Pubnub Subsystem node.
- C++: Add PubnubLibrary dependency, compile, and use as a Game Instance Subsystem.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

General publish/subscribe notes:
- Initialize with publishKey (to publish) and subscribeKey (to subscribe).
- TLS/SSL supported; message encryption available.
- Messages: JSON-serializable (objects, arrays, ints, strings; UTF-8 strings). Do not pre-serialize message/meta; SDK handles it.
- Message size: max 32 KiB (includes escaped chars + channel). Aim <1,800 bytes.
- Throughput: soft limit; in-memory queue ~100 messages. Publish serially, verify success, retry on failure, throttle bursts (e.g., ≤5 msg/s).

For conceptual details, see Connection Management and Publish Messages.

## Publish - Channel entity

Available in entities: Channel

`PublishMessage()` publishes to all subscribers on the channel.

Key points:
- Requires publishKey initialization.
- Create a Channel entity to publish.
- Not required to be subscribed to publish.
- Cannot publish to multiple channels simultaneously.
- Optional CustomMessageType (e.g., text, action, poll).
- Best practices: publish serially, check success `[1,"Sent","..."]`, retry on `[0,"...","<timetoken>"]`, keep queue under 100.

### Method(s)

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
- Message (FString, required): literal or JSON string.
- OnPublishMessageResponse (FOnPublishMessageResponse): delegate; native alternative FOnPublishMessageResponseNative.
- PublishSettings (FPubnubPublishSettings): config.

#### FPubnubPublishSettings

- StoreInHistory (bool): store for History API, default true.
- Ttl (int): hours; falls back to key retention if unset.
- MetaData (FString): JSON for filtering.
- PublishMethod (EPubnubPublishMethod): 
  - PPM_SendViaGET
  - PPM_SendViaPOST
  - PPM_UsePATCH
  - PPM_SendViaPOSTwithGZIP
  - PPM_UsePATCHwithGZIP
  - PPM_UseDELETE
- Replicate (bool): true = deliver to subscribers; false = Functions-only.
- CustomMessageType (FString): 3–50 chars, case-sensitive, alphanumeric, dashes/underscores allowed; cannot start with special chars or pn_/pn- (e.g., text, action, poll).

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

Void; result via FOnPublishMessageResponse.

#### FOnPublishMessageResponse

- Result: FPubnubOperationResult
- PublishedMessage: FPubnubMessageData

#### FPubnubMessageData

- Message: FString
- Channel: FString
- UserID: FString
- Timetoken: FString
- Metadata: FString
- MessageType: EPubnubMessageType
- CustomMessageType: FString
- MatchOrGroup: FString
- region: int
- flags: int

#### EPubnubMessageType

- PMT_Signal
- PMT_Published
- PMT_Action
- PMT_Objects
- PMT_Files

#### FOnPublishMessageResponseNative

- Result: const FPubnubOperationResult&
- PublishedMessage: const FPubnubMessageData&

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

`PublishMessage()` publishes to all subscribers on a channel.

Key points:
- Requires publishKey.
- Not required to be subscribed.
- Cannot publish to multiple channels simultaneously.
- Same security, message format, size, rate, CustomMessageType, and best practices as above.

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
- Channel (FString, required): channel ID.
- Message (FString, required): literal or JSON string.
- OnPublishMessageResponse: FOnPublishMessageResponse; native: FOnPublishMessageResponseNative.
- PublishSettings: FPubnubPublishSettings.

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

`Signal()` sends a low-cost, non-persistent update to all channel subscribers.

Key points:
- Requires publishKey.
- Create a Channel entity to signal.
- Payload limit: 64 bytes (payload only). Contact support to increase.
- Signals vs Messages:
  - Payload: 64B vs 32KB
  - Cost: signals cheaper
  - Persistence: signals not stored; messages can be
  - Push notifications: signals cannot; messages can
  - Use cases: signals for non-critical/fast updates (e.g., geolocation)
  - Metadata: signals do not support metadata; messages do
- Channel separation: send signals and messages on separate channels.

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
- Message (FString, required)
- OnSignalResponse: FOnSignalResponse; native: FOnSignalResponseNative
- SignalSettings: FPubnubSignalSettings

#### FPubnubSignalSettings

- CustomMessageType (FString): 3–50 chars, case-sensitive, alphanumeric, dashes/underscores allowed; cannot start with special chars or pn_/pn- (e.g., text, action, poll).

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

- Result: FPubnubOperationResult
- SignalMessage: FPubnubMessageData

#### FOnSignalResponseNative

- Result: const FPubnubOperationResult&
- SignalMessage: const FPubnubMessageData&

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

Not recommended; use the entity-based Signal approach above.

Key points: same prerequisites and limits as entity-based Signal; maintain channel separation.

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
- OnSignalResponse: FOnSignalResponse; native: FOnSignalResponseNative
- SignalSettings: FPubnubSignalSettings

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

Opens a TCP socket and listens for messages/events on selected entities. Set SubscribeKey during initialization.

Entities:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

After Subscribe(), the client receives messages. Auto-reconnect is handled by the PubNub subsystem.

### Subscription scope

- Subscription: created from an entity; scoped to that entity.
- SubscriptionSet: created from PubnubSubsystem; scoped to the client; can include multiple subscriptions.

Single event listener point per Subscription/SubscriptionSet. See Event listeners.

### Create a subscription

Lifecycle: Subscription lives independently of the entity.

Use entity-level subscriptions to handle channel-specific events.

```
1// Create entity  
2UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
3
  
4// Create subscription from entity  
5UPubnubSubscription* Subscription = ChannelEntity->CreateSubscription();  

```

Parameters:
- SubscribeSettings: FPubnubSubscribeSettings

#### FPubnubSubscribeSettings

- ReceivePresenceEvents (bool): include presence events.

### Create a subscription set

Lifecycle: independent of entities.

Use for handling events similarly across channels.

#### From channel or channel group names

```
`1PubnubSubsystem->CreateSubscriptionSet(Channels, ChannelGroups, SubscriptionSettings);  
`
```

Parameters:
- Channels: TArray<FString>
- ChannelGroups: TArray<FString>
- SubscriptionSettings: FPubnubSubscribeSettings

#### From entities

```
`1PubnubSubsystem->CreateSubscriptionSetFromEntities(Entities, SubscriptionSettings);  
`
```

Parameters:
- Entities (TArray<UPubnubBaseEntity*>)
- SubscriptionSettings: FPubnubSubscribeSettings

### Method(s)

Shared by Subscription and SubscriptionSet:
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

Receive messages from a specific time.

```
1// Subscribe with timetoken  
2FPubnubSubscriptionCursor Cursor;  
3Cursor.Timetoken = "15640261328790011";  
4
  
5Subscription->Subscribe(Cursor);  

```

##### FPubnubSubscriptionCursor

- Timetoken (FString, required)
- Region (int, optional; auto-set)

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

Receive messages/events via listeners attached to Subscription or SubscriptionSet.

### Add listeners

General or specific event listeners supported.

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

Client scope (PubnubSubsystem only).

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

Emits subscription status updates based on network connection state. See SDK Connection Lifecycle.

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

Stop updates from all listeners and remove associated entities.

Client scope (PubnubSubsystem only).

### Method(s)

```
`1PubnubSubsystem->UnsubscribeFromAll(FOnSubscribeOperationResponse OnUnsubscribeFromAllResponse);  
`
```

Parameters:
- OnUnsubscribeFromAllResponse: FOnSubscribeOperationResponse; native: FOnSubscribeOperationResponseNative

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

None