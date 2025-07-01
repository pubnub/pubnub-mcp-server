# Message Persistence API – Unreal SDK (Storage & Playback)

Message Persistence stores every published message (AES-256 optional) for 1 day, 7 days, 30 days, 3 / 6 months, 1 year, or Unlimited, and timestamps them to 10 ns.  
Feature must be enabled in the Admin Portal.

---

## Fetch History

Returns up to 100 messages for a single channel or 25 messages across multiple channels (≤ 500).  
Timetoken rules:  
• Start only → messages older than Start  
• End only → messages End and newer  
• Start + End → messages between Start and End (End inclusive)

### Method

```cpp
PubnubSubsystem->FetchHistory(
    FString                    Channel,
    FOnFetchHistoryResponse    OnFetchHistoryResponse,
    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()
);
```

### FPubnubFetchHistorySettings

| Field | Type | Notes |
|-------|------|-------|
| MaxPerChannel | int | Default/max 100 (1 ch), 25 (multi-ch or IncludeMessageActions) |
| Reverse | bool | true = oldest → newest |
| Start / End | FString | Timetoken range (Start exclusive, End inclusive) |
| IncludeMeta | bool | Return meta payload |
| IncludeMessageType | bool | Return message type |
| IncludeUserID | bool | Return publisher uuid |
| IncludeMessageActions | bool | true → single channel, ≤ 25 msgs |
| IncludeCustomMessageType | bool | Return custom message type |

### Response Structs

```cpp
struct FOnFetchHistoryResponse {
    bool                               Error;
    int                                Status;          // HTTP status
    FString                            ErrorMessage;
    TArray<FPubnubHistoryMessageData>  Messages;
};

struct FPubnubHistoryMessageData {
    FString                             Message;
    FString                             UserID;
    FString                             Timetoken;
    FString                             Meta;
    FString                             MessageType;
    FString                             CustomMessageType;
    TArray<FPubnubMessageActionData>    MessageActions;
};

struct FPubnubMessageActionData {
    FString Type;
    FString Value;
    FString UserID;
    FString ActionTimetoken;
    FString MessageTimetoken;
};
```

### Basic Usage (C++)

MyGameMode.h
```cpp
// Requires PubnubSDK configured in plugin settings and "PubnubLibrary" dependency.
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "MyGameMode.generated.h"

UCLASS()                      // Replace MYPROJECT with project name
class MYPROJECT_API AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    void FetchHistoryExample();
};
```

MyGameMode.cpp (excerpt)
```cpp
#include "MyGameMode.h"
#include "PubnubSubsystem.h"
#include "Kismet/GameplayStatics.h"

void AMyGameMode::FetchHistoryExample()
{
    UGameInstance*    GI = UGameplayStatics::GetGameInstance(this);
    UPubnubSubsystem* PN = GI->GetSubsystem<UPubnubSubsystem>();

    PN->SetUserID("my_user_id");
    FString Channel = "randomChannel";

    FPubnubFetchHistorySettings Settings;
    Settings.IncludeMeta = true;
    Settings.MaxPerChannel = 50;

    FOnFetchHistoryResponse Callback;
    Callback.BindDynamic(this, &AMyGameMode::OnHistory);

    PN->FetchHistory(Channel, Callback, Settings);
}
```

### JSON Example

```json
{
  "status": 200,
  "error": false,
  "error_message": "",
  "channels": {
    "myChannel": [
      {
        "message": { "text": "This is a realtime message_1!" },
        "timetoken": "17181114089437121"
      },
      {
        "message": { "text": "This is a realtime message_2!" },
        "timetoken": "17181114123456789"
      }
    ]
  }
}
```

If response is truncated, the payload contains a `more` object; make iterative calls using its parameters.

---

## Message Counts

Returns the number of messages on one or more channels with Timetoken ≥ specified value.  
For Unlimited retention keys, only the last 30 days are considered.

### Method

```cpp
PubnubSubsystem->MessageCounts(
    FString            Channel,
    FString            Timetoken,
    FOnPubnubResponse  OnMessageCountsResponse
);
```

### Basic Usage

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance*    GI = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PN = GI->GetSubsystem<UPubnubSubsystem>();

FString   Channel   = "randomChannel";
FString   Timetoken = FString::FromInt(FDateTime::UtcNow().ToUnixTimestamp());

FOnPubnubResponse CountsCallback;
CountsCallback.BindDynamic(this, &AMyActor::OnCounts);

PN->MessageCounts(Channel, Timetoken, CountsCallback);
```

### Return

```text
5
```

(Example: 5 messages since the supplied Timetoken)

---

Last updated: Jun 10 2025