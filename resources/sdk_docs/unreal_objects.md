# App Context API – Unreal SDK (Objects)

This condensed reference keeps every code block, method signature, struct, field definition, and example from the original page while stripping redundant prose.

---

## User

### Get metadata for all users
Returns a paginated list of `User` metadata.

```
`PubnubSubsystem->GetAllUserMetadata(  
    FOnGetAllUserMetadataResponse OnGetAllUserMetadataResponse,   
    FPubnubGetAllInclude Include = FPubnubGetAllInclude(),   
    int Limit = 100,   
    FString Filter = "",   
    FPubnubGetAllSort Sort = FPubnubGetAllSort(),   
    FString PageNext = "",   
    FString PagePrev = ""  
);  
`
```
*Parameters*  
`OnGetAllUserMetadataResponse` [`FOnGetAllUserMetadataResponse`](#fongetallusermetadataresponse)  
`Include` [`FPubnubGetAllInclude`](#fpubnubgetallinclude)  
`Limit` int (default 100)  
`Filter` `FString`  
`Sort` [`FPubnubGetAllSort`](#fpubnubgetallsort)  
`PageNext | PagePrev` `FString`  
`Count` `EPubnubTribool`

#### FPubnubGetAllInclude
Field | Type | Description
--- | --- | ---
IncludeCustom | bool | Include Custom
IncludeStatus | bool | Include Status
IncludeType | bool | Include Type
IncludeTotalCount | bool | Include total count

#### FPubnubGetAllSort
Field | Type | Description
--- | --- | ---
GetAllSort | `TArray<FPubnubGetAllSingleSort>` | Sort order

#### Sample – raw
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetAllUserMetadataResponse OnGetAllUserMetadataResponse;  
OnGetAllUserMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllUserMetadataResponse);  
int Limit = 10;  
EPubnubTribool Count = PT_False;  
// Fetch all user metadata using Raw method  
`
```
show all 16 lines  

#### Sample – non-raw
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetAllUserMetadataResponse OnGetAllUserMetadataResponse;  
OnGetAllUserMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllUserMetadataResponse);  
FPubnubGetAllInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
`
```
show all 32 lines  

#### Response structs
##### FOnGetAllUserMetadataResponse
Field | Type | Description
--- | --- | ---
Status | int | HTTP status
UsersData | `TArray<FPubnubUserData>&` | User list
PageNext | FString | Next page
PagePrev | FString | Previous page

##### FPubnubUserData
`UserID, UserName, ExternalID, ProfileUrl, Email, Custom, Status, Type, Updated, ETag` – all `FString`.

##### Example JSON
```
`{  
    "Uuids": [  
        {  
            "Uuid": "uuid-1",  
            "Name": "John Doe",  
            "Email": "john.doe@pubnub.com",  
            "ExternalId": "",  
            "ProfileUrl": "",  
            "Custom": "",  
            "Updated": "2020-06-17T16:28:14.060718Z"  
        },  
        {  
            "Uuid": "uuid-2",  
            "Name": "Bob Cat",  
            "Email": "bobc@example.com",  
`
```
show all 29 lines  

---

### Get user metadata
```
`PubnubSubsystem->GetUserMetadata(  
    FString Include,   
    FString User,   
    FOnGetUserMetadataResponse OnGetUserMetadataResponse  
);  
`
```
*Parameters* `Include` `FString`, `User` `FString`, `OnGetUserMetadataResponse` [`FOnGetUserMetadataResponse`](#fongetusermetadataresponse)

Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetUserMetadataResponse OnGetUserMetadataResponse;  
OnGetUserMetadataResponse.BindDynamic(this, &AMyActor::OnGetUserMetadataResponse);  
FString Include = "";  
FString User = "uuid-1";   
PubnubSubsystem->GetUserMetadata(Include, Limit, Start, End, Count, OnGetUserMetadataResponse);  
`
```

JSON:
```
`{  
    "Uuid": "uuid-1",  
    "Name": "John Doe",  
    "Email": "john.doe@pubnub.com",  
    "ExternalId": "",  
    "ProfileUrl": "",  
    "Custom": "",  
    "Updated": "2020-06-17T16:28:14.060718Z"  
}  
`
```

---

### Set user metadata
```
`PubnubSubsystem->SetUserMetadata(  
    FString User,   
    FString Include,   
    FString UserMetadataObj  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString User = "user123";  
FString Include = "";  
FString UserMetadataObj = "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\"}";  
PubnubSubsystem->SetUserMetadata(User, Include, UserMetadataObj);  
`
```
Return JSON identical to Get user metadata.

##### Iterative update example
```
`#include "PubnubSubsystem.h"  
#include "GameFramework/Actor.h"  
#include "Kismet/GameplayStatics.h"  
UCLASS()  
class MYPROJECT_API AMyActor : public AActor  
{  
    GENERATED_BODY()  
protected:  
    virtual void BeginPlay() override;  
private:  
`
```
show all 70 lines  

---

### Remove user metadata
```
`PubnubSubsystem->RemoveUserMetadata(FString User);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString User = "user123";  
PubnubSubsystem->RemoveUserMetadata(User);  
`
```

---

## Channel

### Get metadata for all channels
```
`PubnubSubsystem->GetAllChannelMetadata(  
    FOnGetAllChannelMetadataResponse OnGetAllChannelMetadataResponse,   
    FPubnubGetAllInclude Include = FPubnubGetAllInclude(),   
    int Limit = 100,   
    FString Filter = "",   
    FPubnubGetAllSort Sort = FPubnubGetAllSort(),   
    FString PageNext = "",   
    FString PagePrev = ""  
);  
`
```

Raw sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetAllChannelMetadataResponse OnGetAllChannelMetadataResponse;  
OnGetAllChannelMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllChannelMetadataResponse);  
int Limit = 10;  
EPubnubTribool Count = PT_False;  
// Fetch all channel metadata using Raw method  
`
```
show all 16 lines  

Non-raw:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetAllChannelMetadataResponse OnGetAllChannelMetadataResponse;  
OnGetAllChannelMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllChannelMetadataResponse);  
FPubnubGetAllInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
`
```
show all 32 lines  

JSON:
```
`{  
    "Channels": [  
        {  
            "Channel": "my-channel",  
            "Name": "My channel",  
            "Description": "A channel that is mine",  
            "Custom": "",  
            "Updated": "2020-06-17T16:52:19.562469Z"  
        },  
        {  
            "Channel": "main",  
            "Name": "Main channel",  
            "Description": "The main channel",  
            "Custom": {  
                "public": true,  
`
```
show all 26 lines  

---

### Get channel metadata
```
`PubnubSubsystem->GetChannelMetadata(  
    FString Include,   
    FString Channel,   
    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetChannelMetadataResponse OnGetChannelMetadataResponse;  
OnGetChannelMetadataResponse.BindDynamic(this, &AMyActor::OnGetChannelMetadataResponse);  
FString Include = "";  
FString Channel = "my-channel";   
PubnubSubsystem->GetChannelMetadata(Include, Channel, OnGetChannelMetadataResponse);  
`
```
JSON:
```
`{  
    "Channel": "my-channel",  
    "Name": "My channel",  
    "Description": "A channel that is mine",  
    "Custom": "",  
    "Updated": "2020-06-17T16:52:19.562469Z"  
}  
`
```

---

### Set channel metadata
```
`PubnubSubsystem->SetChannelMetadata(  
    FString Channel,   
    FString Include,   
    FString ChannelMetadataObj  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString Channel = "myChannel";  
FString Include = "";  
FString ChannelMetadataObj = "{\"name\":\"PubNub channel\",\"description\":\"The channel for announcements\"}";  
PubnubSubsystem->SetChannelMetadata(Channel, Include, ChannelMetadataObj);  
`
```
Return JSON:
```
`{  
    "Channel": "my-channel",  
    "Name": "PubNub channel",  
    "Description": "The channel for announcements",  
    "Updated": "2020-06-17T16:52:19.562469Z"  
}  
`
```

Iterative example:
```
`#include "PubnubSubsystem.h"  
#include "GameFramework/Actor.h"  
#include "Kismet/GameplayStatics.h"  
UCLASS()  
class MYPROJECT_API AMyActor : public AActor  
{  
    GENERATED_BODY()  
protected:  
    virtual void BeginPlay() override;  
private:  
`
```
show all 70 lines  

---

### Remove channel metadata
```
`PubnubSubsystem->RemoveChannelMetadata(FString Channel);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString Channel = "myChannel";  
PubnubSubsystem->RemoveChannelMetadata(Channel);  
`
```

---

## Channel memberships

### Get channel memberships
```
`PubnubSubsystem->GetMemberships(  
    FString User,   
    FOnGetMembershipsResponse OnGetMembershipResponse,   
    FPubnubMembershipInclude Include = FPubnubMembershipInclude(),   
    int Limit = 100,   
    FString Filter = "",   
    FPubnubMembershipSort Sort = FPubnubMembershipSort(),   
    FString PageNext = "",   
    FString PagePrev = ""  
);  
`
```
Raw sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString Channel = "randomChannel";  
FOnGetMembershipsResponse OnGetMembershipResponse;  
OnGetMembershipResponse.BindDynamic(this, &AMyActor::OnGetMembershipResponse);  
User UserId = "user-1"  
int Limit = 10;  
`
```
show all 18 lines  

Non-raw:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetMembershipsResponse OnGetMembershipResponse;  
OnGetMembershipResponse.BindDynamic(this, &AMyActor::OnGetMembershipResponse);  
FPubnubMembershipInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
`
```
show all 33 lines  

JSON:
```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
                "Custom": "",  
                "Updated": "2020-06-17T16:55:44.632042Z"  
            },  
            "Custom": {  
                "starred": false  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
`
```
show all 38 lines  

---

### Set channel memberships
```
`PubnubSubsystem->SetMemberships(  
    FString User,   
    FString Include,   
    FString SetObj  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString User = "user123";  
FString Include = "";  
FString SetObj = "{\"channels\": [{\"channel123\": {\"name\":\"Channel One\"}}]}";  
PubnubSubsystem->SetMemberships(User, Include, SetObj);  
`
```
Return JSON identical to Get channel memberships.

---

### Remove channel memberships
```
`PubnubSubsystem->RemoveMemberships(  
    FString User,   
    FString Include,   
    FString RemoveObj  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString User = "user123";  
FString Include = "";  
FString RemoveObj = "[{\"channel\": {\"id\": \"some-channel-id\"}}, {\"channel\": {\"id\": \"channel-0-id\"}}]";  
PubnubSubsystem->RemoveMemberships(User, Include, RemoveObj);  
`
```
JSON:
```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "my channel",  
                "Description": "A channel that is mine",  
                "Custom": "",  
                "Updated": "2019-02-20T23:11:20.89375"  
            },  
            "Custom": {  
                "role": "admin"  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
`
```
show all 36 lines  

---

## Channel members

### Get channel members
```
`PubnubSubsystem->GetChannelMembers(  
    FString Channel,   
    FOnGetChannelMembersResponse OnGetMembersResponse,   
    FPubnubMemberInclude Include = FPubnubMemberInclude(),   
    int Limit = 100,   
    FString Filter = "",   
    FPubnubMemberSort Sort = FPubnubMemberSort(),   
    FString PageNext = "",   
    FString PagePrev = ""  
);  
`
```
Raw sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetChannelMembersResponse OnGetMembersResponse;  
OnGetMembersResponse.BindDynamic(this, &AMyActor::OnGetMembersResponse);  
FString Channel = "my-channel";  
int Limit = 10;  
EPubnubTribool Count = PT_False;  
`
```
show all 17 lines  

Non-raw:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FOnGetChannelMembersResponse OnGetMembersResponse;  
OnGetMembersResponse.BindDynamic(this, &AMyActor::OnGetMembersResponse);  
FPubnubMemberInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
`
```
show all 33 lines  

JSON:
```
`{  
    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
                "Name": "John Doe",  
                "Email": "john.doe@pubnub.com",  
                "ExternalId": "",  
                "ProfileUrl": "",  
                "Custom": "",  
                "Updated": "2019-02-20T23:11:20.89375"  
            },  
            "Custom": {  
                "role": "admin"  
            },  
`
```
show all 39 lines  

---

### Set channel members
```
`PubnubSubsystem->SetChannelMembers(  
    FString Channel,   
    FString Include,   
    FString SetObj  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString Channel = "myChannel";  
FString Include = "";  
FString SetObj = "[{\"uuid\": {\"id\": \"some-user-id\"}, \"custom\": {\"starred\": true}}, {\"uuid\": {\"id\": \"user-0-id\"}, \"custom\": {\"some_key\": \"some_value\"}}]";  
PubnubSubsystem->SetChannelMembers(Channel, Include, SetObj);  
`
```
Return JSON identical to Get channel members.

---

### Remove channel members
```
`PubnubSubsystem->RemoveChannelMembers(  
    FString Channel,   
    FString Include,   
    FString RemoveObj  
);  
`
```
Sample:
```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
FString Channel = "myChannel";  
FString Include = "";  
FString RemoveObj = "[{\"uuid\": {\"id\": \"some-user-id\"}}, {\"uuid\": {\"id\": \"user-0-id\"}}]";;  
PubnubSubsystem->RemoveChannelMembers(Channel, Include, RemoveObj);  
`
```
JSON:
```
`{**    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
                "Name": "John Doe",  
                "Email": "john.doe@pubnub.com",  
                "ExternalId": "",  
                "ProfileUrl": "",  
                "Custom": "",  
                "Updated": "2019-02-20T23:11:20.89375"  
            },  
            "Custom": {  
                "role": "admin"  
            },  
`
```
show all 39 lines  

---

_Last updated Jul 15 2025_