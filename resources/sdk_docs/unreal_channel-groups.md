# Channel Groups – Unreal SDK
Channel Groups let you subscribe to many channels with a single name. You cannot publish to a group (publish to the individual channels instead).

All operations below require the **Stream Controller** add-on to be enabled for your key.

---

## Add channels to a group
Maximum 200 channels per call.

```cpp
`PubnubSubsystem->AddChannelToGroup(  
    FString Channel,   
    FString ChannelGroup  
);  
`
```

Parameters  
• `Channel` (FString) – Channel to add.  
• `ChannelGroup` (FString) – Target group.  

Returns: void

### Sample  
#### MyGameMode.h
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

#### MyGameMode.cpp
```cpp
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::AddChannelToGroupExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
	FString ChannelGroup = "myChannelGroup";  
`
```

---

## List channels in a group
```cpp
`PubnubSubsystem->ListChannelsFromGroup(  
    FString ChannelGroup,   
    FOnListChannelsFromGroupResponse OnListChannelsResponse  
);  
`
```

Parameters  
• `ChannelGroup` (FString) – Group to inspect.  
• `OnListChannelsResponse` (FOnListChannelsFromGroupResponse) – Result callback.

Returns: `FOnListChannelsFromGroupResponse`

### FOnListChannelsFromGroupResponse
| Field    | Type                | Description                               |
|----------|---------------------|-------------------------------------------|
| Error    | bool                | True if the request failed.              |
| Status   | int                 | HTTP status code.                        |
| Channels | TArray\<FString\>& | Channel names contained in the group.    |

#### JSON example
```json
`{  
  "error":false,  
  "payload":{  
    "channels":[],  
    "group":"my_channel"  
  },  
  "service":"channel-registry",  
  "status":200  
}  
`
```

### Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChannelGroup = "myChannelGroup";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnListChannelsFromGroupResponse OnListChannelsResponse;  
OnListChannelsResponse.BindDynamic(this, &AMyActor::OnListChannelsResponse);  
  
// Add channel to channel group  
`
```

---

## Remove a channel from a group
```cpp
`PubnubSubsystem->RemoveChannelFromGroup(  
    FString Channel,   
    FString ChannelGroup  
);  
`
```

Parameters  
• `ChannelGroup` (FString) – Group to modify.  
• `Channel` (FString) – Channel to remove.

Returns: void

### Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChanelGroup = "myChannelGroup";  
  
// Remove channel from channel group  
PubnubSubsystem->RemoveChannelFromGroup(Channel, ChannelGroup);  
`
```

---

## Delete a channel group
```cpp
`PubnubSubsystem->RemoveChannelGroup(  
    String ChannelGroup  
);  
`
```

Parameter  
• `ChannelGroup` (FString) – Group to delete.

Returns: void

### Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString ChanelGroup = "myChannelGroup";  
  
// Remove channel group  
PubnubSubsystem->RemoveChannelGroup(ChannelGroup);  
`
```

_Last updated: Jul 15 2025_