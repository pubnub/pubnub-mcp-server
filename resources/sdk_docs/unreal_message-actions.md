# Message Actions API – Unreal SDK (condensed)

Add or remove metadata (reactions, receipts, custom data, etc.) on published messages.  
Requires Message Persistence to be enabled on your PubNub keys.

### Terminology
• Message Actions – low-level API for attaching any metadata.  
• Message Reactions – same API when used specifically for emoji/social reactions.

---

## Add Message Action

### Method(s)

```
`PubnubSubsystem->AddMessageAction(  
    FString Channel,   
    FString MessageTimeToken,   
    EPubnubActionType ActionType,    
    FString Value,  
    FOnAddMessageActionsResponse OnAddMessageActionResponse  
);  
`
```

Parameter | Type | Notes
---|---|---
Channel | FString | Target channel.
MessageTimeToken | FString | Timetoken of the message to annotate.
ActionType | EPubnubActionType | pbactypReaction • pbactypReceipt • pbactypCustom • pbactypEdited • pbactypDeleted
Value | FString | Action payload.
OnAddMessageActionResponse | FOnAddMessageActionsResponse | Result callback.

### Example (C++)

#### MyGameMode.h
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

#### MyGameMode.cpp
```
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

### Returns

`FOnAddMessageActionsResponse`

Field | Type | Description
---|---|---
MessageActionTimetoken | FString | Timetoken indicating when the action was added.

---

## Remove Message Action

### Method(s)

```
`PubnubSubsystem->RemoveMessageAction(  
    FString Channel,   
    FString MessageTimeToken,   
    FString ActionTimeToken  
);  
`
```

Parameter | Type | Notes
---|---|---
Channel | FString | Channel containing the message.
MessageTimeToken | FString | Timetoken of the original message.
ActionTimeToken | FString | Timetoken of the action to remove.

### Example
```
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

Returns: none.

---

## Get Message Actions

Returns actions sorted by `actionTimetoken` (ascending).  
Paginate using `start`/`end`; response may include `more` cursor when truncated.

### Method(s)

```
`PubnubSubsystem->GetMessageActions(  
    FString Channel,   
    FString Start,   
    FString End,   
    int SizeLimit,   
    FOnGetMessageActionsResponse OnGetMessageActionsResponse  
);  
`
```

Parameter | Type | Notes
---|---|---
Channel | FString | Channel to query.
Start | FString | Cursor for next page (`""` if unused).
End | FString | Cursor for previous page (`""` if unused).
SizeLimit | int | 1-100 (0 ➜ default 100).
OnGetMessageActionsResponse | FOnGetMessageActionsResponse | Result callback.

### Example
```
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

### Returns

`FOnGetMessageActionsResponse`

Field | Type | Description
---|---|---
Status | int | HTTP response code.
MessageActions | TArray<FPubnubMessageActionData>& | List of actions.

#### Sample JSON
```
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

---

## History with Message Actions

When fetching history, you can include message actions.  
Refer to Fetch History docs for details.

_Last updated: Jun 10 2025_