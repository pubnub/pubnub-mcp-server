# Publish/Subscribe API – Unreal SDK (condensed)

The sections below keep every code block, method signature, parameter list, and all critical limits/requirements while removing redundant prose.

---

## Publish

Real-time (<30 ms) message fan-out to all channel subscribers.

Essentials  
• Initialize PubNub with a `publishKey`.  
• Not required to be subscribed to publish.  
• One channel per call (no multi-channel publish).  
• Payload: any JSON-serializable type; **don’t pre-serialize** `message`/`meta`.  
• Max size: **32 KiB** (optimum <1.8 KB) → oversize ⇒ *Message Too Large*.  
• Message queue per subscriber: 100; publish next message only after success response.  
• Optional `CustomMessageType` (3-50 chars, `[A-Za-z0-9_-]`, not starting with `pn_`/`pn-`).  
• Suggested throttle: ≤5 msgs/s.

### Method(s)

- Blueprint  
- C++

```
PubnubSubsystem->PublishMessage(  
    FString Channel,  
    FString Message,   
    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
);  
```

#### Parameters

* `Message`  (FString, required) – payload.  
* `Channel`  (FString, required) – destination channel.  
* `PublishSettings` (FPubnubPublishSettings) – publish options.

#### FPubnubPublishSettings

* `StoreInHistory` (bool, default true) – make message retrievable via History API.  
* `MetaData` (FString) – JSON metadata for filtering.  
* `PublishMethod` (EPubnubPublishMethod):  
  • `PPM_SendViaGET` • `PPM_SendViaPOST` • `PPM_UsePATCH`  
  • `PPM_SendViaPOSTwithGZIP` • `PPM_UsePATCHwithGZIP` • `PPM_UseDELETE`  
* `Replicate` (bool) – replicate to all subscribers (`true`) or Functions only (`false`).  
* `CustomMessageType` (FString) – user label, e.g., `text`, `action`, `poll`.

### Basic Usage

#### Publish a message to a channel

##### MyGameMode.h
```
`// NOTE: This example requires correct PubnubSDK configuration in plugins settings and adding "PubnubLibrary" to PublicDependencyModuleNames in your build.cs  
// More info in the documentation: https://www.pubnub.com/docs/sdks/unreal/api-reference/configuration  
  
#pragma once  
  
#include "CoreMinimal.h"  
#include "GameFramework/GameModeBase.h"  
#include "MyGameMode.generated.h"  
  
/**  
 *   
 */  
UCLASS()  
//Replace MYPROJECT with name of your project  
class MYPROJECT_API AMyGameMode : public AGameModeBase  
`
```

##### MyGameMode.cpp
```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::PublishMessageExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
	FString Message = "{ \"text\" : \"This is my message\" }";  
`
```

Subscribe to `randomChannel` (see Subscribe section) before running the example.

### Other Example – POST with GZIP
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString Message = "{ \"text\" : \"This is my message\" }";  
  
// Create the publish settings  
FPubnubPublishSettings PublishSettings;  
PublishSettings.PublishMethod = EPubnubPublishMethod::PPM_SendViaPOSTwithGZIP;  
  
// Publish the message using the specified publish settings  
PubnubSubsystem->PublishMessage(Channel, Message, PublishSettings);  
`
```

Return: none.

---

## Signal

Lightweight message (< 64 bytes payload) to all channel subscribers.

### Method(s)

```
PubnubSubsystem->Signal(  
    FString Channel,   
    FString Message,  
    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
);  
```

#### Parameters

* `Message` (FString, required) – payload.  
* `Channel` (FString, required) – destination.  
* `SignalSettings` (FPubnubSignalSettings).

#### FPubnubSignalSettings

* `CustomMessageType` (same rules as Publish).

### Basic Usage
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString Message = "{ \"text\" : \"This is my signal\" }";  
  
// Create the signal settings  
FPubnubSignalSettings SignalSettings;  
PublishSettings.CustomMessageType = "text-message";  
  
// Send the signal  
PubnubSubsystem->Signal(Channel, Message, SignalSettings);  
`
```

Return: none.

---

## Subscribe

Creates an open socket and streams messages/events.

Key points  
• Requires `subscribeKey` set at initialization.  
• New subscriber receives only messages published **after** `Subscribe` completes.  
• Add event listeners **before** subscribing.  
• Presence: enable add-on and set `ReceivePresenceEvents` or subscribe to `<channel>-pnpres`.  
• Wildcard subscribe (`a.*`) needs Stream Controller add-on (one level only).  
• Unsubscribing from **all** channels resets timetoken (possible message gaps).

### Method(s)

```
 // subscribe to a channel  
 PubnubSubsystem->SubscribeToChannel(FString Channel, FPubnubSubscriptionSettinngs SubscriptionSettings);  
 // subscribe to a channel group  
 PubnubSubsystem->SubscribeToGroup(FString GroupName, FPubnubSubscriptionSettinngs SubscriptionSettings);  
```

#### Parameters

* `Channel` (FString) – channel ID.  
* `GroupName` (FString) – channel group.  
* `SubscriptionSettings` (FPubnubSubscriptionSettings).

#### FPubnubSubscriptionSettings

* `ReceivePresenceEvents` (bool) – include presence events.

### Basic Usage
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Subscribe  
PubnubSubsystem->SubscribeToChannel(Channel, SubscriptionSettings);  
`
```

#### Presence Subscribe Example
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Create the subscription settings  
FPubnubSubscriptionSettings SubscriptionSettings;  
SubscriptionSettings.ReceivePresenceEvents = true;  
  
// Subscribe  
PubnubSubsystem->SubscribeToChannel(Channel, SubscriptionSettings);  
`
```

#### Wildcard Subscribe Example
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "foo.*";  
  
// Subscribe  
PubnubSubsystem->Subscribe(Channel);  
`
```

Return: none (messages provided via listener).

---

## Unsubscribe

### Method(s)
```
 // unsubscribe from a channel  
 PubnubSubsystem->UnsubscribeFromChannel(FString Channel);  
 // unsubscribe from a channel group  
 PubnubSubsystem->UnsubscribeFromGroup(FString GroupName);  
```

### Basic Usage
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChannelGroupName = "randomChannelGroup";  
  
// Subscribe  
PubnubSubsystem->Subscribe(Channel);  
PubnubSubsystem->SubscribeToGroup(ChannelGroupName);  
  
// Unsubscribe  
PubnubSubsystem->UnsubscribeFromChannel(Channel);  
`
```

Return: none.

---

## Unsubscribe All

### Method(s)
```
PubnubSubsystem->UnsubscribeFromAll();  
```

### Basic Usage
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChannelGroupName = "randomChannelGroup";  
  
// Subscribe  
PubnubSubsystem->Subscribe(Channel);  
PubnubSubsystem->SubscribeToGroup(ChannelGroupName);  
  
// Unsubscribe all  
PubnubSubsystem->UnsubscribeFromAll();  
`
```

Return: none.

---

_Last updated: Jun 16 2025_