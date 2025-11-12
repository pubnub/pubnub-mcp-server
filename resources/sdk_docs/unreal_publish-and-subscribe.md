# Publish/Subscribe API for Unreal SDK

Use PubNub via Blueprints or C++.

In Blueprints, start with the Pubnub Subsystem node.

In C++, add a dependency to PubnubLibrary:

In your IDE, navigate to `Source/_{YourProject}_/_{YourProject}_.Build.cs` and add a dependency to `PubnubLibrary`.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run the project.

In C++, use the PubNub SDK as any other Game Instance Subsystem.

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Call SDK functions from `PubnubSubsystem`, for example:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

PubNub delivers messages worldwide in less than 30 ms. Send a message to one recipient or broadcast to thousands of subscribers.

For conceptual details, see Connection Management and Publish Messages.

## Publish - Channel entity[​](#publish---channel-entity)

Available in entities
- Channel

`PublishMessage()` sends a message to all channel subscribers.

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - Create a Channel entity to publish to.
  - Publishing does not require subscription.
  - Can't publish to multiple channels simultaneously.
- Security
  - Use TLS/SSL during initialization. You can also encrypt messages.
- Message data
  - Payload must be JSON-serializable (objects, arrays, numbers, strings). Avoid special classes/functions. UTF‑8 strings supported.
  - Don't JSON serialize
    - Do not pre-serialize `message` or `meta`. Pass full objects; SDK serializes automatically.
- Size
  - Max message size: 32 KiB (includes escaped characters and channel name). Target < 1,800 bytes for best performance.
  - Messages over limit return `Message Too Large`.
- Publish rate
  - Publish as fast as bandwidth allows; soft throughput limits apply (in-memory queue ~100).
- Custom message type
  - Optional `CustomMessageType` (for example, `text`, `action`, `poll`).
- Best practices
  - Publish serially; verify success code (e.g., `[1,"Sent","136074940..."]`).
  - Publish next message only after success; on failure (`[0,"blah","<timetoken>"]`), retry.
  - Keep queue under 100; throttle bursts (e.g., <= 5 msgs/sec).

### Method(s)[​](#methods)

Create a Channel entity, then publish:

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->PublishMessage(  
4    FString Message,  
5    FOnPublishMessageResponse OnPublishMessageResponse,  
6    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
7);  

```

- Parameters
  - Message (required) Type: FString — String or JSON-formatted string with serialized data.
  - OnPublishMessageResponse Type: FOnPublishMessageResponse — Result delegate. Native callback: FOnPublishMessageResponseNative.
  - PublishSettings Type: FPubnubPublishSettings — Publish configuration.

#### FPubnubPublishSettings[​](#fpubnubpublishsettings)

- StoreInHistory Type: bool — Store message for History (default true).
- Ttl Type: int — TTL in hours; defaults to key’s retention period.
- MetaData Type: FString — JSON object for message filtering.
- PublishMethod Type: EPubnubPublishMethod — HTTP method:
  - PPM_SendViaGET
  - PPM_SendViaPOST
  - PPM_UsePATCH
  - PPM_SendViaPOSTwithGZIP
  - PPM_UsePATCHwithGZIP
  - PPM_UseDELETE
- Replicate Type: bool — If true, replicates to subscribers; if false, only Functions receive.
- CustomMessageType Type: FString — 3–50 char case-sensitive alphanumeric label; dashes and underscores allowed; cannot start with special chars or with pn_ / pn-. Examples: text, action, poll.

### Sample code[​](#sample-code)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

- C++

#### Actor.h[​](#actorh)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp)
  

```
1
  

```

Before running the publish example, subscribe to the same channel.

### Returns[​](#returns)

Void; result provided via FOnPublishMessageResponse.

#### FOnPublishMessageResponse[​](#fonpublishmessageresponse)

- Result FPubnubOperationResult — Operation result.
- PublishedMessage FPubnubMessageData — Operation result data.

#### FPubnubMessageData[​](#fpubnubmessagedata)

- Message FString — The message.
- Channel FString — Published channel.
- UserID FString — Publisher info.
- Timetoken FString — Publish timetoken.
- Metadata FString — Message metadata, as published.
- MessageType EPubnubMessageType — Message type (signal, published, etc.).
- CustomMessageType FString — User-provided type.
- MatchOrGroup FString — Subscription match or channel group.
- region int — Region (usually not relevant).
- flags int — Flags.

#### EPubnubMessageType[​](#epubnubmessagetype)

- PMT_Signal — Received as signal.
- PMT_Published — Published message.
- PMT_Action — Message action.
- PMT_Objects — Objects-related.
- PMT_Files — Files-related.

#### FOnPublishMessageResponseNative[​](#fonpublishmessageresponsenative)

- Result const FPubnubOperationResult& — Operation result.
- PublishedMessage const FPubnubMessageData& — Operation result data.

### Other examples[​](#other-examples)

#### Publish a message with settings[​](#publish-a-message-with-settings)

##### Actor.h[​](#actorh-1)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-1)

  

```
1
  

```

#### Publish a message with result[​](#publish-a-message-with-result)

##### Actor.h[​](#actorh-2)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-2)

  

```
1
  

```

## Publish - PubNub client[​](#publish---pubnub-client)

`PublishMessage()` sends a message to all channel subscribers. Same constraints as entity-based publish (keys, JSON, size limits, rate limits, custom types, best practices).

### Method(s)[​](#methods-1)

```
`1PubnubSubsystem->PublishMessage(  
2    FString Channel,  
3    FString Message,   
4    FOnPublishMessageResponse OnPublishMessageResponse,  
5    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
6);  
`
```

- Parameters
  - Channel (required) Type: FString — Channel ID to send to.
  - Message (required) Type: FString — String or JSON-formatted string.
  - OnPublishMessageResponse Type: FOnPublishMessageResponse — Result delegate. Native: FOnPublishMessageResponseNative.
  - PublishSettings Type: FPubnubPublishSettings — Configuration.

### Sample code[​](#sample-code-1)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel-1)

- C++
- Blueprint

#### Actor.h[​](#actorh-3)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-3)
  

```
1
  

```

### Returns[​](#returns-1)

Void; result via FOnPublishMessageResponse.

### Other examples[​](#other-examples-1)

#### Publish a message with settings[​](#publish-a-message-with-settings-1)

##### Actor.h[​](#actorh-4)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-4)

  

```
1
  

```

#### Publish a message with result[​](#publish-a-message-with-result-1)

##### Actor.h[​](#actorh-5)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-5)

  

```
1
  

```

## Signal - Channel entity[​](#signal---channel-entity)

Available in entities
- Channel

`Signal()` sends a lightweight signal to all subscribers.

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - Create the Channel entity to signal to.
  - Payload size limit: 64 bytes (payload only). For larger payloads, contact support.
- Signal vs. Message
  - Payload size: Signal 64B; Message up to 32KB.
  - Cost: Signals cost less.
  - Persistence: Signals not persisted; Messages can be persisted.
  - Push notifications: Signals cannot; Messages can.
  - Use cases: Signals for non-critical data (e.g., geolocation); Messages for broader use.
  - Metadata: Signals do not support; Messages do.
- Channel separation
  - Send signals and messages on separate channels for better recovery.

### Method(s)[​](#methods-2)

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->Signal(  
4    FString Message,  
5    FOnSignalResponse OnSignalResponse,  
6    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
7);  

```

- Parameters
  - Message (required) Type: FString — String or JSON-formatted string.
  - OnSignalResponse Type: FOnSignalResponse — Result delegate. Native: FOnSignalResponseNative.
  - SignalSettings Type: FPubnubSignalSettings — Signal configuration.

#### FPubnubSignalSettings[​](#fpubnubsignalsettings)

- CustomMessageType Type: FString — 3–50 char case-sensitive alphanumeric label; dashes/underscores allowed; cannot start with special chars or pn_ / pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

- C++

#### Actor.h[​](#actorh-6)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-6)
  

```
1
  

```

### Returns[​](#returns-2)

Result via FOnSignalResponse.

#### FOnSignalResponse[​](#fonsignalresponse)

- Result FPubnubOperationResult — Operation result.
- SignalMessage FPubnubMessageData — Operation result data.

#### FOnSignalResponseNative[​](#fonsignalresponsenative)

- Result const FPubnubOperationResult& — Operation result.
- SignalMessage const FPubnubMessageData& — Operation result data.

### Other examples[​](#other-examples-2)

#### Signal with custom message type[​](#signal-with-custom-message-type)

##### Actor.h[​](#actorh-7)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-7)

  

```
1
  

```

## Signal - PubNub client[​](#signal---pubnub-client)

Not recommended; prefer entity-based Signal.

`Signal()` sends a signal to all subscribers of a channel. Payload limit 64 bytes (payload only).

- Prerequisites and limitations
  - Initialize with `publishKey`.
  - Payload limit: 64 bytes.
- Signal vs. Message
  - Same characteristics as above (size, cost, persistence, push, use cases, metadata).
- Channel separation
  - Keep signals and messages on separate channels.

### Method(s)[​](#methods-3)

```
`1PubnubSubsystem->Signal(  
2    FString Channel,   
3    FString Message,  
4    FOnSignalResponse OnSignalResponse,  
5    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
6);  
`
```

- Parameters
  - Channel (required) Type: FString — Channel ID to send to.
  - Message (required) Type: FString — String or JSON-formatted string.
  - OnSignalResponse Type: FOnSignalResponse — Result delegate. Native: FOnSignalResponseNative.
  - SignalSettings Type: FPubnubSignalSettings — Configuration.

### Sample code[​](#sample-code-3)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel-1)

- C++
- Blueprint

#### Actor.h[​](#actorh-8)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-8)
  

```
1
  

```

### Returns[​](#returns-3)

Void; result via FOnSignalResponse.

### Other examples[​](#other-examples-3)

#### Signal with custom message type[​](#signal-with-custom-message-type-1)

##### Actor.h[​](#actorh-9)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-9)

  

```
1
  

```

## Subscribe[​](#subscribe)

Subscribe opens a TCP socket and listens for messages and events. Set `SubscribeKey` during initialization.

Conceptual overview
- Subscriptions deliver messages/events via listeners.
- Subscribe using PubNub client or entities:
  - Channel
  - ChannelGroup
  - UserMetadata
  - ChannelMetadata

After `Subscribe()`, client receives new messages. Configure reconnection on the subsystem.

### Subscription scope[​](#subscription-scope)

- Subscription — created from an entity; scoped to that entity.
- SubscriptionSet — created from PubNub client; scoped to client; can include multiple subscriptions.

### Create a subscription[​](#create-a-subscription)

Managing subscription lifecycle
- Subscription lives independently from entity and must be managed separately.

```
1// Create entity  
2UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
3
  
4// Create subscription from entity  
5UPubnubSubscription* Subscription = ChannelEntity->CreateSubscription();  

```

- Parameters
  - SubscribeSettings Type: FPubnubSubscribeSettings — Subscription configuration.

#### FPubnubSubscribeSettings[​](#fpubnubsubscribesettings)

- ReceivePresenceEvents Type: bool — Subscribe to presence events.

### Create a subscription set[​](#create-a-subscription-set)

Managing subscription lifecycle
- Subscription object lives independently from entity.

A SubscriptionSet lets you receive messages/events for all entities in the set.

#### From channel or channel group names[​](#from-channel-or-channel-group-names)

```
`1PubnubSubsystem->CreateSubscriptionSet(Channels, ChannelGroups, SubscriptionSettings);  
`
```

- Parameters
  - Channels Type: TArray<FString> — Channel names.
  - ChannelGroups Type: TArray<FString> — Channel group names.
  - SubscriptionSettings Type: FPubnubSubscribeSettings — Configuration.

#### From entities[​](#from-entities)

```
`1PubnubSubsystem->CreateSubscriptionSetFromEntities(Entities, SubscriptionSettings);  
`
```

- Parameters
  - Entities (required) Type: TArray<UPubnubBaseEntity*> — Entities to include.
  - SubscriptionSettings Type: FPubnubSubscribeSettings — Configuration.

### Method(s)[​](#methods-4)

Subscription and SubscriptionSet share the same methods:

#### Subscribe[​](#subscribe-1)

```
`1// Subscribe to start receiving messages  
2Subscription->Subscribe();  
3// Subscribe to all entities in the set  
4SubscriptionSet->Subscribe();  
`
```

#### Sample code[​](#sample-code-4)

##### Subscribe to a channel[​](#subscribe-to-a-channel)

- C++

###### Actor.h[​](#actorh-10)
  

```
1
  

```

###### Actor.cpp[​](#actorcpp-10)
  

```
1
  

```

#### Subscribe with timetoken[​](#subscribe-with-timetoken)

Receive messages from a specific timetoken.

```
1// Subscribe with timetoken  
2FPubnubSubscriptionCursor Cursor;  
3Cursor.Timetoken = "15640261328790011";  
4
  
5Subscription->Subscribe(Cursor);  

```

##### FPubnubSubscriptionCursor[​](#fpubnubsubscriptioncursor)

| Parameter  Type | Required | Description |
| :---------- | :-------- | :------- | :------ |
| `Timetoken` | `FString` | Yes      | Timetoken from which messages should be retrieved.  |
| `Region`    | `int`     | No  | Region of the messages. Set automatically; typically not required to set.   |

#### Add subscriptions[​](#add-subscriptions)

```
`1// Add individual subscription to set  
2UPubnubSubscription* NewSubscription = ChannelEntity->CreateSubscription();  
3SubscriptionSet->AddSubscription(NewSubscription);  
`
```

#### Remove subscriptions[​](#remove-subscriptions)

```
`1// Remove subscription from set  
2SubscriptionSet->RemoveSubscription(NewSubscription);  
`
```

#### Merge subscription sets[​](#merge-subscription-sets)

```
`1// Merge subscription sets  
2SubscriptionSet1->AddSubscriptionSet(SubscriptionSet2);  
`
```

#### Remove subscription sets[​](#remove-subscription-sets)

```
`1// Remove subscription set from another set  
2SubscriptionSet1->RemoveSubscriptionSet(SubscriptionSet2);  
`
```

### Other examples[​](#other-examples-4)

#### Subscribe to a channel group[​](#subscribe-to-a-channel-group)

##### Actor.h[​](#actorh-11)

```
1
  

```

##### Actor.cpp[​](#actorcpp-11)

```
1
  

```

#### Subscribe to channel metadata[​](#subscribe-to-channel-metadata)

##### Actor.h[​](#actorh-12)

```
1
  

```

##### Actor.cpp[​](#actorcpp-12)

```
1
  

```

#### Subscribe to user metadata[​](#subscribe-to-user-metadata)

##### Actor.h[​](#actorh-13)

```
1
  

```

##### Actor.cpp[​](#actorcpp-13)

```
1
  

```

#### Create subscription set from names[​](#create-subscription-set-from-names)

##### Actor.h[​](#actorh-14)

```
1
  

```

##### Actor.cpp[​](#actorcpp-14)

```
1
  

```

#### Create subscription set from entities[​](#create-subscription-set-from-entities)

##### Actor.h[​](#actorh-15)

```
1
  

```

##### Actor.cpp[​](#actorcpp-15)

```
1
  

```

#### Manage subscriptions in a set[​](#manage-subscriptions-in-a-set)

##### Actor.h[​](#actorh-16)

```
1
  

```

##### Actor.cpp[​](#actorcpp-16)

```
1
  

```

#### Merge subscription sets[​](#merge-subscription-sets-1)

##### Actor.h[​](#actorh-17)

```
1
  

```

##### Actor.cpp[​](#actorcpp-17)

```
1
  

```

## Event listeners[​](#event-listeners)

Attach listeners to Subscription or SubscriptionSet to receive messages, signals, and events. A single listener can catch all types.

### Add listeners[​](#add-listeners)

#### Handle multiple event types[​](#handle-multiple-event-types)

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

#### Handle one event type with native callbacks[​](#handle-one-event-type-with-native-callbacks)

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

#### Remove event listener[​](#remove-event-listener)

```
1// Remove specific listener  
2Subscription->OnPubnubMessage.RemoveDynamic(this, &AMyActor::OnMessageReceived);  
3
  
4// Remove all listeners for a specific event type  
5Subscription->OnPubnubMessage.RemoveAll(this);  

```

### Add connection status listener[​](#add-connection-status-listener)

Client scope — available only on PubNub object.

#### Method(s)[​](#methods-5)

```
`1// Add subscription status listener  
2PubnubSubsystem->OnSubscriptionStatusChanged.AddDynamic(this, &AMyActor::OnSubscriptionStatusChanged);  
`
```

#### Sample code[​](#sample-code-5)

- C++

#### Actor.h[​](#actorh-18)
  

```
1
  

```
  

#### Actor.cpp[​](#actorcpp-18)
  

```
1
  

```

### Other examples[​](#other-examples-5)

#### Subscribe with all event listeners[​](#subscribe-with-all-event-listeners)

##### Actor.h[​](#actorh-19)

```
1
  

```

##### Actor.cpp[​](#actorcpp-19)

```
1
  

```

#### Add message listener with lambda[​](#add-message-listener-with-lambda)

##### Actor.h[​](#actorh-20)

```
1
  

```

##### Actor.cpp[​](#actorcpp-20)

```
1
  

```

#### Add error listener[​](#add-error-listener)

##### Actor.h[​](#actorh-21)

```
1
  

```

##### Actor.cpp[​](#actorcpp-21)

```
1
  

```

#### Add error listener with lambda[​](#add-error-listener-with-lambda)

##### Actor.h[​](#actorh-22)

```
1
  

```

##### Actor.cpp[​](#actorcpp-22)

```
1
  

```

#### Returns[​](#returns-4)

Emits subscription status updates depending on network connection.

#### Other examples[​](#other-examples-6)

##### Add connection status listener with lambda[​](#add-connection-status-listener-with-lambda)

```
`1// Add subscription status listener with lambda  
2PubnubSubsystem->OnSubscriptionStatusChangedNative.AddLambda([](EPubnubSubscriptionStatus Status) {  
3    UE_LOG(LogTemp, Log, TEXT("Subscription status changed: %d"), (int32)Status);  
4});  
`
```

## Unsubscribe[​](#unsubscribe)

Stop receiving real-time updates from a Subscription or SubscriptionSet.

### Method(s)[​](#methods-6)

```
1// Unsubscribe from a subscription  
2Subscription->Unsubscribe();  
3
  
4// Unsubscribe from a subscription set  
5SubscriptionSet->Unsubscribe();  

```

### Sample code[​](#sample-code-6)

#### Unsubscribe from a subscription[​](#unsubscribe-from-a-subscription)

```
`1// Unsubscribe from a subscription  
2Subscription->Unsubscribe();  
`
```

#### Unsubscribe from a subscription set[​](#unsubscribe-from-a-subscription-set)

```
`1// Unsubscribe from all entities in the set  
2SubscriptionSet->Unsubscribe();  
`
```

### Returns[​](#returns-5)

None

## Unsubscribe all[​](#unsubscribe-all)

Stop receiving real-time updates from all listeners and remove their associated entities.

Client scope — only on PubNubSubsystem.

### Method(s)[​](#methods-7)

```
`1PubnubSubsystem->UnsubscribeFromAll(FOnSubscribeOperationResponse OnUnsubscribeFromAllResponse);  
`
```

- Parameters
  - OnUnsubscribeFromAllResponse Type: FOnSubscribeOperationResponse — Result delegate. Native: FOnSubscribeOperationResponseNative.

### Sample code[​](#sample-code-7)

- C++
- Blueprint

#### Actor.h[​](#actorh-23)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-23)
  

```
1
  

```

### Returns[​](#returns-6)

No return value.