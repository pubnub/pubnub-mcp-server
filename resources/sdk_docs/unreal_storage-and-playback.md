# Message Persistence API – Unreal SDK (Storage & Playback)

Message Persistence stores every published message (timestamp precision: 10 ns) across multiple zones. Retention is account-level: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. Messages can be AES-256 encrypted at rest.

Retrievable objects:
* Messages
* Message reactions
* Files (via File Sharing API)

---

## Fetch History

Required: Message Persistence enabled.

Timetoken rules  
• `Start` only → older than `Start`  
• `End` only → `End` and newer  
• Both → between `Start` and `End` (inclusive of `End`)  

Limits  
• Single channel: ≤100 messages  
• Multiple channels (≤500): ≤25 each  
• `IncludeMessageActions=true`: one channel, ≤25 messages  
Iterate with updated `Start` to page more data.

### Method

Blueprint / C++

```
PubnubSubsystem->FetchHistory(  
    FString Channel,   
    FOnFetchHistoryResponse OnFetchHistoryResponse,   
    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()  
);  
```

Parameter | Type | Notes
---|---|---
Channel | FString | Target channel(s)
OnFetchHistoryResponse | FOnFetchHistoryResponse | Result callback
FetchHistorySettings | FPubnubFetchHistorySettings | Optional config

#### FPubnubFetchHistorySettings

Field | Type | Default / Limits
---|---|---
MaxPerChannel | int | 100 single / 25 multi / 25 with actions
Reverse | bool | false (oldest → newest if true)
Start | FString | Exclusive start timetoken
End | FString | Inclusive end timetoken
IncludeMeta | bool | false
IncludeMessageType | bool | false
IncludeUserID | bool | false
IncludeMessageActions | bool | false
IncludeCustomMessageType | bool | false

### Sample code (reference)

#### MyGameMode.h
```
// NOTE: This example requires correct PubnubSDK configuration in plugins settings and adding "PubnubLibrary" to PublicDependencyModuleNames in your build.cs  
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
```
*show all 24 lines*

#### MyGameMode.cpp
```
#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::FetchHistoryExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
  
```
*show all 40 lines*

Truncated responses containing actions include a `more` object; repeat calls with updated parameters to fetch remaining messages.

### Returns

`FOnFetchHistoryResponse`

Field | Type | Description
---|---|---
Error | bool | Operation failed
Status | int | HTTP status
ErrorMessage | FString | Error details
Messages | TArray<FPubnubHistoryMessageData>& | Historical messages

`FPubnubHistoryMessageData`

Field | Type | Description
---|---|---
Message | FString | Message text
UserID | FString | Publisher uuid
Timetoken | FString | Sent time
Meta | FString | Metadata
MessageType | FString | System type
CustomMessageType | FString | Custom type
MessageActions | TArray<FPubnubMessageActionData> | Associated actions

`FPubnubMessageActionData`

Field | Type | Description
---|---|---
Type | FString | Action type
Value | FString | Action value
UserID | FString | Actor uuid
ActionTimetoken | FString | Action time
MessageTimetoken | FString | Related message time

#### Example JSON
```
{  
  "status": 200,  
  "error": false,  
  "error_message": "",  
  "channels": {  
    "myChannel": [  
      {  
        "message": {  
          "text": "This is a realtime message_1!"  
        },  
        "timetoken": "17181114089437121"  
      },  
      {  
        "message": {  
          "text": "This is a realtime message_2!"  
```
*show all 33 lines*

---

## Message Counts

Required: Message Persistence enabled.  
For Unlimited retention, counts consider only last 30 days.

### Method

Blueprint / C++

```
PubnubSubsystem->MessageCounts(  
    FString Channel,   
    FString Timetoken,   
    FOnPubnubResponse OnMessageCountsResponse)  
```

Parameter | Type | Notes
---|---|---
Channel | FString | Channel list
Timetoken | FString | Earliest time to count from
OnMessageCountsResponse | FOnPubnubResponse | Result callback

### Sample code
```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FDateTime TimeStamp = FDateTime::Now();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnMessageCountsResponse;  
OnMessageCountsResponse.BindDynamic(this, &AMyActor::OnMessageCountsResponse);  
  
PubnubSubsystem->MessageCounts(Channel, TimeStamp, OnMessageCountsResponse);  
```

### Returns
Integer — number of messages since `Timetoken`

```
5**
```

_Last updated: Jul 15 2025_