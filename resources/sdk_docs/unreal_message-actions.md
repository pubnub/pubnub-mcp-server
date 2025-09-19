# Message Actions API – Unreal SDK (Condensed)

Message Actions let you attach, fetch, and delete metadata (reactions, receipts, etc.) on previously-published messages.  
Feature requires **Message Persistence** to be enabled for your key.

---

## Add Message Reaction (`AddMessageAction`)

### Method  
Blueprint / C++

```cpp
`PubnubSubsystem->AddMessageAction(  
    FString Channel,   
    FString MessageTimeToken,   
    EPubnubActionType ActionType,    
    FString Value,  
    FOnAddMessageActionsResponse OnAddMessageActionResponse  
);  
`
```

### Parameters  
• `Channel` (FString) – Target channel.  
• `MessageTimeToken` (FString) – Timetoken of the message to annotate.  
• `ActionType` (EPubnubActionType):  
  - `pbactypReaction`, `pbactypReceipt`, `pbactypCustom`, `pbactypEdited`, `pbactypDeleted`  
• `Value` (FString) – Payload describing the action.  
• `OnAddMessageActionResponse` (FOnAddMessageActionsResponse) – Result callback.

### Return Struct: `FOnAddMessageActionsResponse`  
• `MessageActionTimetoken` (FString) – Timetoken when the action was added.

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
  
void AMyGameMode::AddMessageReactionExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
	FString MessageTimeToken = "5610547826969050";  
`
```

---

## Remove Message Reaction (`RemoveMessageAction`)

### Method  
Blueprint / C++

```cpp
`PubnubSubsystem->RemoveMessageAction(  
    FString Channel,   
    FString MessageTimeToken,   
    FString ActionTimeToken  
);  
`
```

### Parameters  
• `Channel` (FString) – Channel of the action.  
• `MessageTimeToken` (FString) – Timetoken of the original message.  
• `ActionTimeToken` (FString) – Timetoken of the action to remove.

(No return payload)

### Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString MessageTimeToken = "5610547826969050";  
FString MessageTimeToken = "15610547826970050";  
  
// Add the message action  
PubnubSubsystem->RemoveMessageAction(Channel, MessageTimeToken, ActionTimeToken);  
`
```

---

## Get Message Reactions (`GetMessageActions`)

Returns a paginated, ascending list of actions for a channel.

### Method  
Blueprint / C++

```cpp
`PubnubSubsystem->GetMessageActions(  
    FString Channel,   
    FString Start,   
    FString End,   
    int SizeLimit,   
    FOnGetMessageActionsResponse OnGetMessageActionsResponse  
);  
`
```

### Parameters  
• `Channel` (FString) – Channel to query.  
• `Start` (FString) – Cursor for next page (use `""` for none).  
• `End` (FString) – Cursor for previous page (ignored if `Start` set).  
• `SizeLimit` (int) – 1-100 (0 = default 100).  
• `OnGetMessageActionsResponse` (FOnGetMessageActionsResponse) – Result callback.

### Return Struct: `FOnGetMessageActionsResponse`  
• `Status` (int) – HTTP status.  
• `MessageActions` (TArray<FPubnubMessageActionData>&) – Array of actions.

#### Example JSON
```json
`{  
  "status": 200,   
  "data": [{  
    "messageTimetoken": "17198286823798098",   
    "type": "reaction",   
    "uuid": "User1",   
    "value": "happy",   
    "actionTimetoken": "17198286996058878"  
  }]  
}  
`
```

### Sample
```cpp
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetMessageActionsResponse OnGetMessageActionsResponse;  
OnGetMessageActionsResponse.BindDynamic(this, &AMyActor::OnGetMessageActionsResponse);  
  
FString Channel = "randomChannel";  
FString Start = "";  
FString End = "";  
  
`
```

---

## History with Message Reactions
Use the common Fetch History API with `include_message_actions=true` to retrieve messages alongside their actions.