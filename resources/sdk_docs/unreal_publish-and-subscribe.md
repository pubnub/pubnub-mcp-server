# PubNub Unreal SDK – Publish / Subscribe (Condensed)

This short reference keeps every method signature, struct definition, enum, parameter, limit, and code example from the original docs. Redundant prose has been removed.

---

## Publish

Requirements & limits  
• App must be initialized with a `publishKey`  
• Sender needn’t be subscribed to the channel  
• One channel per call (no multi-channel publish)  
• Payload: any JSON-serializable type; **don’t pre-serialize** `message` or `meta`  
• Max size = 32 KiB (URI + channel + escaped JSON). Optimal < 1800 bytes  
• Publish serially: next message only after success. Memory queue = 100 messages  
• Throttle bursts (≈ ≤ 5 msg/s) to avoid drops

### Method

```
`PubnubSubsystem->PublishMessage(  
    FString Channel,  
    FString Message,   
    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
);  
`
```

### FPubnubPublishSettings

* StoreInHistory (bool, default true) – include in storage/History API  
* MetaData (FString) – JSON object used by server-side filters  
* PublishMethod (EPubnubPublishMethod)  
  - `PPM_SendViaGET`  
  - `PPM_SendViaPOST`  
  - `PPM_UsePATCH`  
  - `PPM_SendViaPOSTwithGZIP`  
  - `PPM_UsePATCHwithGZIP`  
  - `PPM_UseDELETE`  
* Replicate (bool) – false ⇒ only Functions receive the message  
* CustomMessageType (FString 3-50 chars, a-z A-Z 0-9 - _) – e.g. `text`, `action`

### Examples

#### Minimal publish

```
`// NOTE: This example requires correct PubnubSDK configuration …  
  
#pragma once  
…  
class MYPROJECT_API AMyGameMode : public AGameModeBase  
`
```

```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::PublishMessageExample()  
{  
    UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
    UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
    PubnubSubsystem->SetUserID("my_user_id");  
  
    FString Channel = "randomChannel";  
    FString Message = "{ \"text\" : \"This is my message\" }";  
`
```

#### POST + GZIP

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString Message = "{ \"text\" : \"This is my message\" }";  
  
FPubnubPublishSettings PublishSettings;  
PublishSettings.PublishMethod = EPubnubPublishMethod::PPM_SendViaPOSTwithGZIP;  
  
PubnubSubsystem->PublishMessage(Channel, Message, PublishSettings);  
`
```

(Return: none. Check listener for ACK: `[1,"Sent", "<timetoken>"]`)

---

## Signal

• Same semantics as Publish, but payload limit **64 bytes** (payload only)  

### Method

```
`PubnubSubsystem->Signal(  
    FString Channel,   
    FString Message,  
    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
);  
`
```

### FPubnubSignalSettings

* CustomMessageType (FString) – same rules as above

### Example

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString Message = "{ \"text\" : \"This is my signal\" }";  
  
FPubnubSignalSettings SignalSettings;  
PublishSettings.CustomMessageType = "text-message";  
  
PubnubSubsystem->Signal(Channel, Message, SignalSettings);  
`
```

(Return: none)

---

## Subscribe

Key points  
• Requires `subscribeKey` at initialization  
• Opens a long-lived socket; receive via event listeners  
• Add listeners *before* calling subscribe  
• Unsubscribing from **all** channels resets the timetoken (possible gaps)

### Methods

```
`// subscribe to a channel  
PubnubSubsystem->SubscribeToChannel(FString Channel, FPubnubSubscriptionSettinngs SubscriptionSettings);  
// subscribe to a channel group  
PubnubSubsystem->SubscribeToGroup(FString GroupName, FPubnubSubscriptionSettinngs SubscriptionSettings);  
`
```

### FPubnubSubscriptionSettings

* ReceivePresenceEvents (bool) – true ⇒ presence events for this channel

### Basic subscribe

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
PubnubSubsystem->SubscribeToChannel(Channel, SubscriptionSettings);  
`
```

### Presence subscribe (Presence add-on required)

```
`…  
FPubnubSubscriptionSettings SubscriptionSettings;  
SubscriptionSettings.ReceivePresenceEvents = true;  
  
PubnubSubsystem->SubscribeToChannel(Channel, SubscriptionSettings);  
`
```

### Wildcard subscribe (Stream Controller add-on)

```
`…  
FString Channel = "foo.*";  
PubnubSubsystem->Subscribe(Channel);  
`
```

(Return: none – events arrive through listener)

---

## Unsubscribe

### Methods

```
`// unsubscribe from a channel  
PubnubSubsystem->UnsubscribeFromChannel(FString Channel);  
// unsubscribe from a channel group  
PubnubSubsystem->UnsubscribeFromGroup(FString GroupName);  
`
```

### Sample

```
`…  
PubnubSubsystem->Subscribe(Channel);  
PubnubSubsystem->SubscribeToGroup(ChannelGroupName);  
PubnubSubsystem->UnsubscribeFromChannel(Channel);  
`
```

(Return: none)

---

## Unsubscribe All

### Method

```
`PubnubSubsystem->UnsubscribeFromAll();  
`
```

### Sample

```
`…  
PubnubSubsystem->Subscribe(Channel);  
PubnubSubsystem->SubscribeToGroup(ChannelGroupName);  
PubnubSubsystem->UnsubscribeFromAll();  
`
```

(Return: none)

_Last updated: Jul 15 2025_