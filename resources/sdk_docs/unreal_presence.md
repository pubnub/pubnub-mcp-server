# Presence API – Unreal SDK (Condensed)

Prerequisite: Presence add-on must be enabled for your key in the Admin Portal.

---

## List Users from Channel

3 s server-side cache.

```cpp
PubnubSubsystem->ListUsersFromChannel(  
    FString Channel,   
    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
);  
```

* Channel (FString) – channel to query.  
* ListUsersFromChannelResponse (FOnListUsersFromChannelResponse) – callback.  
* ListUsersFromChannelSettings – optional:

```cpp
struct FPubnubListUsersFromChannelSettings {
  FString ChannelGroups;   // comma-delimited group names (ignored if empty)
  bool     DisableUserID = true;  // omit UUID list if true
  bool     State        = false;  // include user state if true
};
```

Return type:

```cpp
struct FOnListUsersFromChannelResponse {
  int    Status;   // HTTP code
  FString Message;
  FPubnubListUsersFromChannelWrapper Data;
};

struct FPubnubListUsersFromChannelWrapper {
  int Occupancy;
  TMap<FString, FString> UuidsState; // uuid -> state
};
```

JSON example:

```json
{
  "status": 200,
  "message": "OK",
  "occupancy": 2,
  "uuids": [{"uuid": "uuid-1"},{"uuid": "uuid-2"}],
  "service": "Presence"
}
```

Basic usage:

```cpp
// NOTE: This example requires correct PubnubSDK configuration ...
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "MyGameMode.generated.h"

UCLASS()
class MYPROJECT_API AMyGameMode : public AGameModeBase
```
(show all 24 lines)

```cpp
#include "MyGameMode.h"
#include "PubnubSubsystem.h"
#include "Kismet/GameplayStatics.h"

void AMyGameMode::ListUsersFromChannelExample()
{
  UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
  UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

  PubnubSubsystem->SetUserID("my_user_id");
  FString Channel = "randomChannel";
```
(show all 40 lines)

Occupancy-only variant (DisableUserID = false):

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FString Channel = "randomChannel";

FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings;
```
(show all 21 lines)

---

## List User Subscribed Channels

```cpp
PubnubSubsystem->ListUserSubscribedChannels(  
    FString UserID,   
    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
);  
```

* UserID (FString) – target UUID.  
* ListUserSubscribedChannelsResponse – callback.

Return type:

```cpp
struct FOnListUsersSubscribedChannelsResponse {
  int Status;
  FString Message;
  TArray<FString> Channels;
};
```

JSON example:

```json
{
  "status": 200,
  "message": "OK",
  "payload": { "channels": ["my_channel"] },
  "service": "Presence"
}
```

Example:

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FString UserId = "myUserId";

FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse;
ListUserSubscribedChannelsResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);

PubnubSubsystem->ListUserSubscribedChannels(UserId, ListUserSubscribedChannelsResponse);
```

---

## User State

### Set State

```cpp
PubnubSubsystem->SetState(  
    FString Channel,   
    FString StateJson,   
    FPubnubSetStateSettings SetStateSettings = FPubnubSetStateSettings()  
);  
```

```cpp
struct FPubnubSetStateSettings {
  FString ChannelGroups; // comma list
  FString UserID;        // override UUID
  bool    HeartBeat = false; // set state + /heartbeat
};
```

### Get State

```cpp
PubnubSubsystem->GetState(  
    FString Channel,   
    FString ChannelGroup,   
    FString UserID,   
    FOnPubnubResponse OnGetStateResponse  
);  
```

Example – Set:

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FString Channel = "exampleChannel";
FString StateJson = "{\"mood\": \"happy\"}";

FPubnubSetStateSettings SetStateSettings;
SetStateSettings.ChannelGroups = "group1,group2";
SetStateSettings.UserID = "user123";
SetStateSettings.HeartBeat = true;
```
(show all 17 lines)

Example – Get:

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FString Channel = "exampleChannel";
FString ChannelGroup = "";
FString UserID = "user123";

FOnPubnubResponse OnGetStateResponse;
OnGetStateResponse.BindDynamic(this, &AMyActor::OnGetStateResponse);
```
(show all 17 lines)

GetState JSON:

```json
{
  "status": 200,
  "message": "OK",
  "payload": { "happy": "true" },
  "service": "Presence"
}
```

---

## Heartbeat

```cpp
PubnubSubsystem->Heartbeat(  
    FString Channel,   
    FString ChannelGroup  
);  
```

* Channel – target channel.  
* ChannelGroup – target group.

Example:

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FString Channel = "exampleChannel";
FString ChannelGroup = "exampleGroup";

PubnubSubsystem->Heartbeat(Channel, ChannelGroup);
```

(Heartbeat has no return payload.)

---

_Last updated: Jun 16 2025_