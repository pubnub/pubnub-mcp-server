# Access Manager v3 – Unreal SDK (Condensed)

Access Manager v3 issues time-limited tokens with embedded permissions for PubNub resources (Channels, Channel Groups, Uuids).  
Requires the **Access Manager** add-on (enable in Admin Portal).

---

## Grant Token

Generates a token with:

* TTL (minutes, 1–43 200; recommended 10–60)  
* Optional `AuthorizedUuid` (restricts token to one user)  
* Resource permissions (lists or RegEx patterns)

### Method (Blueprint / C++)

```cpp
PubnubSubsystem->GrantToken(
    FString PermissionObject,          // JSON created from FPubnubGrantTokenStructure
    FOnPubnubResponse OnGrantTokenResponse
);
```

### FPubnubGrantTokenStructure

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| TTLMinutes | int | n/a | Required |
| AuthorizedUser | FString | n/a | Optional |
| Channels | TArray<FString> | [] | |
| ChannelPermissions | TArray<FPubnubChannelPermissions> | [] | |
| ChannelGroups | TArray<FString> | [] | |
| ChannelGroupPermissions | TArray<FPubnubChannelGroupPermissions> | [] | |
| Users | TArray<FString> | [] | |
| UserPermissions | TArray<FPubnubUserPermissions> | [] | |
| ChannelPatterns | TArray<FString> | [] | |
| ChannelPatternPermissions | TArray<FPubnubChannelPermissions> | [] | |
| ChannelGroupPatterns | TArray<FString> | [] | |
| ChannelGroupPatternPermissions | TArray<FPubnubChannelGroupPermissions> | [] | |
| UserPatterns | TArray<FString> | [] | |
| UserPatternPermissions | TArray<FPubnubUserPermissions> | [] | |

#### FPubnubChannelPermissions

```txt
Read   // Subscribe, History, Presence
Write  // Publish
Delete // History, App Context
Get    // App Context
Update // App Context
Manage // Channel Groups, App Context
Join   // App Context
```

#### FPubnubChannelGroupPermissions

```txt
Read   // Presence & History
Manage // Modify group members
```

#### FPubnubUserPermissions

```txt
Delete
Get
Update
```

### Array Rules

Apply one permission set to many objects:

```cpp
// permission1 applies to all channels
Channels = {channel1, channel2, channel3}
Permissions = {permission1}
```

Index-matched permissions:

```cpp
// channel1→permission1, channel2→permission2, …
Channels    = {channel1, channel2, channel3}
Permissions = {permission1, permission2, permission3}
```

Mismatch counts → error:

```cpp
// ERROR: counts differ
Channels    = {channel1, channel2, channel3}
Permissions = {permission1, permission2}
```

### Basic Usage

#### MyGameMode.h

```cpp
// NOTE: configure PubNub plugin & add "PubnubLibrary" to build.cs

#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "MyGameMode.generated.h"

UCLASS()
class MYPROJECT_API AMyGameMode : public AGameModeBase
```
*show all 25 lines*

#### MyGameMode.cpp

```cpp
#include "MyGameMode.h"
#include "PubnubSubsystem.h"
#include "Kismet/GameplayStatics.h"

void AMyGameMode::GrantTokenExample()
{
    UGameInstance* GI =  UGameplayStatics::GetGameInstance(this);
    UPubnubSubsystem* PubnubSubsystem = GI->GetSubsystem<UPubnubSubsystem>();

    PubnubSubsystem->SetUserID("my_user_id");

    bool IsSuccess;
    FPubnubGrantTokenStructure GrantTokenStructure;
```
*show all 46 lines*

### Returns

```txt
p0F2AkF0GmaCRihDdHRsGQWgQ3Jasdasdhhbm5lbC1hAUNncnCgQ3NwY6BDdXNyoER1dWlkoENwYXSlRGNoYW6gQ2dycKas123d3BjoEN1c3KgRHV1aWSgRG1ldGGgQ3NpZ1ggN-gMhU1oAQwot7NbSW4P2KTb1mx-iQzxxH37vkQes_8=
```

### Example: multiple resources in one call

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FOnPubnubResponse OnGrantTokenResponse;
OnGrantTokenResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);

FPubnubGrantTokenStructure grantToken;
grantToken.AuthorizedUser = "my-authorized-uuid";
grantToken.TTLMinutes     = 1440;
```
*show all 59 lines*

### Example: RegEx read access

```cpp
FPubnubGrantTokenStructure grantToken;
grantToken.AuthorizedUser = "my-authorized-uuid";
grantToken.TTLMinutes     = 1440;
```
*show all 26 lines*

### Example: resources + RegEx in one call

```cpp
FFPubnubGrantTokenStructure grantToken;
grantToken.AuthorizedUser = "my-authorized-uuid";
grantToken.TTLMinutes     = 1440;
```
*show all 64 lines*

### Error Responses

* `400 Bad Request` — invalid args/RegEx/timestamp/permissions  
* `403 Forbidden`  
* `503 Service Unavailable`

---

## Revoke Token

Disables an existing token (TTL ≤ 30 days).  
Requires Access Manager add-on and **Revoke v3 Token** enabled in Admin Portal.

### Method

```cpp
PubnubSubsystem->RevokeToken(FString Token);
```

### Basic Usage

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

PubnubSubsystem->RevokeToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");
```

(No return value)

Error codes: `400`, `403`, `503`

---

## Parse Token

Decodes a token and returns its permission object.

### Method

```cpp
PubnubSubsystem->ParseToken(
  FString Token,
  FOnPubnubResponse OnParseTokenResponse
);
```

### Basic Usage

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

FOnPubnubResponse OnParseTokenResponse;
OnParseTokenResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);

FString Token = "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI";

PubnubSubsystem->ParseToken(Token, OnParseTokenResponse);
```

### Returns (truncated)

```json
{
  "Version": 2,
  "Timestamp": 1619718521,
  "TTL": 15,
  "AuthorizedUuid": "my_uuid",
  "Resources": {
    "Uuids": {
      "uuid-id": {
        "Read": true,
        "Write": true,
        "Manage": true,
        "Delete": true,
        "Get": true,
        "Update": true,
        "Join": true
```
*show all 76 lines*

Error: damaged token → request new one.

---

## Set Token

Updates the client’s current auth token.

### Method

```cpp
PubnubSubsystem->SetAuthToken(FString Token);
```

### Basic Usage

```cpp
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();

PubnubSubsystem->SetAuthToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");
```

(No return value)

---

_Last updated: Mar 26 2025_