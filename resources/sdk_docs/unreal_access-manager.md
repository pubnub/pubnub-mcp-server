# Access Manager v3 – Unreal SDK (Condensed)

Access Manager v3 issues time-limited tokens embedding fine-grained permissions for specific PubNub resources (channels, channel groups, users). Tokens may:

* Limit access duration (`ttl`)
* Target explicit resources lists or RegEx patterns
* Be bound to a single client (`AuthorizedUuid`)

---

## Grant token

Requires the **Access Manager** add-on.

### Method (Blueprint / C++)

```cpp
PubnubSubsystem->GrantToken(
    FString PermissionObject,
    FOnPubnubResponse OnGrantTokenResponse
);
```

Parameter | Type | Notes
--- | --- | ---
`PermissionObject` | `FString` | JSON produced from `FPubnubGrantTokenStructure`
`OnGrantTokenResponse` | `FOnPubnubResponse` | Result callback

### FPubnubGrantTokenStructure

Field | Type | Default | Description
--- | --- | --- | ---
`TTLMinutes` | `int` | — | Required. 1–43 200 (recommend 10–60)
`AuthorizedUser` | `FString` | — | Bound client UUID
`Channels` | `TArray<FString>` | `[]` | Resource list
`ChannelPermissions` | `TArray<FPubnubChannelPermissions>` | `[]` | Per-channel perms
`ChannelGroups` | `TArray<FString>` | `[]` | —
`ChannelGroupPermissions` | `TArray<FPubnubChannelGroupPermissions>` | `[]` | —
`Users` | `TArray<FString>` | `[]` | —
`UserPermissions` | `TArray<FPubnubUserPermissions>` | `[]` | —
`ChannelPatterns` | `TArray<FString>` | `[]` | RegEx patterns
`ChannelPatternPermissions` | `TArray<FPubnubChannelPermissions>` | `[]` | —
`ChannelGroupPatterns` | `TArray<FString>` | `[]` | —
`ChannelGroupPatternPermissions` | `TArray<FPubnubChannelGroupPermissions>` | `[]` | —
`UserPatterns` | `TArray<FString>` | `[]` | —
`UserPatternPermissions` | `TArray<FPubnubUserPermissions>` | `[]` | —

### Permission structs

#### FPubnubChannelPermissions
```cpp
bool Read   = false; // Subscribe/History/Presence
bool Write  = false; // Publish
bool Delete = false; // History/App Context
bool Get    = false; // App Context
bool Update = false; // App Context
bool Manage = false; // Channel Groups/App Context
bool Join   = false; // App Context
```

#### FPubnubChannelGroupPermissions
```cpp
bool Read   = false; // Presence/History
bool Manage = false; // Modify group members
```

#### FPubnubUserPermissions
```cpp
bool Delete = false; // Delete metadata
bool Get    = false; // Retrieve metadata
bool Update = false; // Update metadata
```

### Array mapping rules

* One permission set may apply to many objects  
  ```cpp
  Channels = {channel1, channel2};
  ChannelPermissions = {perm1};
  ```
* Different permissions per object use matching indexes  
  ```cpp
  Channels = {channel1, channel2};
  ChannelPermissions = {perm1, perm2};
  ```
* Mismatched counts throw an error.

### Sample code

All original examples are retained below exactly as provided.

#### Reference code – MyGameMode.h
```cpp
//NOTE: This example requires corrent PubnubSDK configuration in plugins settings and adding "PubnubLibrary" to PublicDependencyModuleNames in your build.cs
//More info in the documentation: https://www.pubnub.com/docs/sdks/unreal/api-reference/configuration  

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
(show all 25 lines)

#### MyGameMode.cpp
```cpp
#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  

void AMyGameMode::GrantTokenExample()  
{  
    //Get PubnubSubsystem as any other subsystem  
    UGameInstance* GI =  UGameplayStatics::GetGameInstance(this);  
    UPubnubSubsystem* PubnubSubsystem = GI->GetSubsystem<UPubnubSubsystem>();  

    //Make sure to set user ID, it's required for every Pubnub operation  
    PubnubSubsystem->SetUserID("my_user_id");  

    bool IsSuccess;  
    FPubnubGrantTokenStructure GrantTokenStructure;      
```
(show all 46 lines)

##### Returns
```
p0F2AkF0GmaCRihDdHRsGQWgQ3Jasdasdhhbm5lbC1hAUNncnCgQ3NwY6BDdXNyoER1dWlkoENwYXSlRGNoYW6gQ2dycKas123d3BjoEN1c3KgRHV1aWSgRG1ldGGgQ3NpZ1ggN-gMhU1oAQwot7NbSW4P2KTb1mx-iQzxxH37vkQes_8=
```

#### Other examples

All original example blocks are preserved:

* Grant an authorized client different levels of access to various resources in a single call  
* Grant an authorized client read access to multiple channels using RegEx  
* Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call  

(Full code blocks unchanged.)

### Error responses
`400` with descriptive message (e.g., bad RegEx, timestamp, permissions).

---

## Revoke token

Requires Access Manager add-on and “Revoke v3 Token” enabled in Admin Portal.

### Method

```cpp
PubnubSubsystem->RevokeToken(FString Token);
```

Parameter | Type | Notes
--- | --- | ---
`Token` | `string` | Token previously obtained via GrantToken

No return value. Errors: `400`, `403`, `503`.

Sample code preserved.

---

## Parse token

### Method

```cpp
PubnubSubsystem->ParseToken(
  FString Token,
  FOnPubnubResponse OnParseTokenResponse
);
```

Parameter | Type | Notes
--- | --- | ---
`Token` | `string` | Existing token
`OnParseTokenResponse` | `FOnPubnubResponse` | Result callback

Sample code & full JSON response retained.

Error indicates damaged token.

---

## Set token

Client-side token update.

### Method

```cpp
PubnubSubsystem->SetAuthToken(FString Token);
```

Parameter | Type | Notes
--- | --- | ---
`Token` | `string` | Token with embedded permissions

No return value. Sample code preserved.

---

_Last updated Jul 15 2025_