# Presence API – Unreal SDK (Condensed)

Presence lets you query occupancy, user state, and send heartbeats. All methods require the Presence add-on to be enabled for your keys.

---

## 1. List users from channel

• 3 s response cache  
• Returns occupancy and (optionally) UUIDs and state.

#### Method
```cpp
`PubnubSubsystem->ListUsersFromChannel(  
    FString Channel,   
    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
);  
`
```

#### Parameters
* Channel (FString) – channel to query  
* ListUsersFromChannelResponse (FOnListUsersFromChannelResponse) – callback  
* ListUsersFromChannelSettings – optional

`FPubnubListUsersFromChannelSettings`  
* ChannelGroups (FString) – comma-delimited groups  
* DisableUserID (bool, default true) – omit UUIDs when true  
* State (bool, default false) – include state when true

#### Return (FOnListUsersFromChannelResponse)
* Status (int) – HTTP code  
* Message (FString) – status text  
* Data (FPubnubListUsersFromChannelWrapper)

`FPubnubListUsersFromChannelWrapper`  
* Occupancy (int) – number of users  
* UuidsState (TMap<FString,FString>) – UUID → state map

#### JSON example
```json
`{  
  "status": 200,   
  "message": "OK",   
  "occupancy": 2,   
  "uuids": [  
    {"uuid": "uuid-1"},   
    {"uuid": "uuid-2"}  
  ],   
  "service": "Presence"  
}  
`
```

#### Sample code
MyGameMode.h
```cpp
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

MyGameMode.cpp
```cpp
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::ListUsersFromChannelExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
  
`
```

Return occupancy only
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FPubnubListUsersFromChannelSettings ListUsersFromChannelResponse;  
ListUsersFromChannelResponse.BindDynamic(this, &AMyActor::ListUsersFromChannelResponse);  
  
// Create the list users settings  
FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings;  
`
```

---

## 2. List user subscribed channels

#### Method
```cpp
`PubnubSubsystem->ListUserSubscribedChannels(  
    FString UserID,   
    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
);  
`
```

#### Parameters  
* UserID (FString) – target user  
* ListUserSubscribedChannelsResponse (FOnListUsersSubscribedChannelsResponse) – callback

#### Return (FOnListUsersSubscribedChannelsResponse)
* Status (int)  
* Message (FString)  
* Channels (TArray<FString>&)

#### JSON example
```json
`{  
  "status": 200,   
  "message": "OK",   
  "payload": {  
    "channels": ["my_channel"]  
  },   
  "service": "Presence"  
}  
`
```

#### Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString UserId = "myUserId";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnListUsersSubscribedChannelsResponse ListUsersFromChannelResponse;  
ListUserSubscribedChannelsResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);  
  
// List users from the channel using the specified settings  
PubnubSubsystem->ListUserSubscribedChannels(UserId, ListUserSubscribedChannelsResponse);  
`
```

---

## 3. User state

### 3.1 Set state
```cpp
`PubnubSubsystem->SetState(  
    FString Channel,   
    FString StateJson,   
    FPubnubSetStateSettings SetStateSettings = FPubnubSetStateSettings()  
);  
`
```
Parameters  
* Channel (FString) – target channel  
* StateJson (FString) – JSON state  
* SetStateSettings – optional

`FPubnubSetStateSettings`  
* ChannelGroups (FString)  
* UserID (FString) – defaults to current user  
* HeartBeat (bool) – also send heartbeat

Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "exampleChannel";  
FString StateJson = "{\"mood\": \"happy\"}";   
  
// Create the set state settings  
FPubnubSetStateSettings SetStateSettings;  
SetStateSettings.ChannelGroups = "group1,group2"; // Example channel groups  
SetStateSettings.UserID = "user123"; // Example user ID  
SetStateSettings.HeartBeat = true; // Set state and make a heartbeat call  
  
`
```

### 3.2 Get state
```cpp
`PubnubSubsystem->GetState(  
    FString Channel,   
    FString ChannelGroup,   
    FString UserID,   
    FOnPubnubResponse OnGetStateResponse  
);  
`
```
Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "exampleChannel";  
FString ChannelGroup = "";  
FString UserID = "user123";  
  
// Create the response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnGetStateResponse;  
OnGetStateResponse.BindDynamic(this, &AMyActor::OnGetStateResponse);  
  
`
```

GetState JSON
```json
`{  
  "status": 200,   
  "message": "OK",   
  "payload": {  
    "happy": "true"  
  },   
  "service": "Presence"  
}  
`
```

---

## 4. Heartbeat

Sends presence heartbeat to channels/groups (even if not subscribed).

#### Method
```cpp
`PubnubSubsystem->Heartbeat(  
    FString Channel,   
    FString ChannelGroup  
);  
`
```

Parameters  
* Channel (FString)  
* ChannelGroup (FString)

Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "exampleChannel";  
FString ChannelGroup = "exampleGroup";  
  
// Send the heartbeat to the specified channel and channel group  
PubnubSubsystem->Heartbeat(Channel, ChannelGroup);  
`
```

---

_Last updated Jul 15 2025_