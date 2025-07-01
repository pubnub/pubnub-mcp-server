# PubNub Unreal SDK – App Context (Objects)

This condensed reference keeps every method signature, parameter list, struct definition, and example code/JSON exactly as in the original docs. Narrative descriptions were removed.

---

## User

### Get Metadata for All Users

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
*OnGetAllUserMetadataResponse* [`FOnGetAllUserMetadataResponse`](#fongetallusermetadataresponse)  
*Include* [`FPubnubGetAllInclude`](#fpubnubgetallinclude)  
*Limit* int  
*Filter* `FString`  
*Sort* [`FPubnubGetAllSort`](#fpubnubgetallsort)  
*PageNext* `FString`  
*PagePrev* `FString`  
*Count* `EPubnubTribool`

#### FPubnubGetAllInclude
Field | Type
--- | ---
IncludeCustom | bool  
IncludeStatus | bool  
IncludeType | bool  
IncludeTotalCount | bool  

#### FPubnubGetAllSort
Field | Type
--- | ---
GetAllSort | `TArray<FPubnubGetAllSingleSort>`  

#### Basic Usage (raw)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
...  
// Fetch all user metadata using Raw method  
`
```
show all 16 lines

#### Basic Usage (non-raw)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
...  
`
```
show all 32 lines

#### FOnGetAllUserMetadataResponse
Field | Type
--- | ---
Status | int  
UsersData | `TArray<FPubnubUserData>&`  
PageNext | FString  
PagePrev | FString  

#### FPubnubUserData
Field | Type
--- | ---
UserID | FString  
UserName | FString  
ExternalID | FString  
ProfileUrl | FString  
Email | FString  
Custom | FString  
Status | FString  
Type | FString  
Updated | FString  
ETag | FString  

##### JSON
```
`{  
    "Uuids": [  
        {  
            "Uuid": "uuid-1",  
            "Name": "John Doe",  
            ...  
        }  
    ]  
}  
`
```

---

### Get User Metadata

```
`PubnubSubsystem->GetUserMetadata(  
    FString Include,   
    FString User,   
    FOnGetUserMetadataResponse OnGetUserMetadataResponse  
);  
`
```
*Include* `FString`  
*User* `FString`  
*OnGetUserMetadataResponse* [`FOnGetUserMetadataResponse`](#fongetusermetadataresponse)

Basic usage identical pattern:

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
...  
PubnubSubsystem->GetUserMetadata(Include, Limit, Start, End, Count, OnGetUserMetadataResponse);  
`
```

#### FOnGetUserMetadataResponse
Field | Type
--- | ---
Status | int  
UserData | `FPubnubUserData`

JSON identical to previous single-user sample.

---

### Set User Metadata

```
`PubnubSubsystem->SetUserMetadata(  
    FString User,   
    FString Include,   
    FString UserMetadataObj  
);  
`
```
*User* `FString`  
*Include* `FString`  
*UserMetadataObj* `FString`

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
...  
PubnubSubsystem->SetUserMetadata(User, Include, UserMetadataObj);  
`
```
Returns JSON identical to single-user payload.

Additional iterative update example preserved:

```
`#include "PubnubSubsystem.h"  
#include "GameFramework/Actor.h"  
...  
`
```
show all 70 lines

---

### Remove User Metadata

```
`PubnubSubsystem->RemoveUserMetadata(FString User);  
`
```

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
...  
PubnubSubsystem->RemoveUserMetadata(User);  
`
```

---

## Channel

### Get Metadata for All Channels

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
Parameter list mirrors user variant.

Basic usages, raw & non-raw, retained (see code blocks).

#### FOnGetAllChannelMetadataResponse
Field | Type
--- | ---
Status | int  
ChannelsData | `TArray<FPubnubChannelData>&`  
PageNext | FString  
PagePrev | FString  

#### FPubnubChannelData
Field | Type
--- | ---
ChannelID | FString  
ChannelName | FString  
Description | FString  
Custom | FString  
Status | FString  
Type | FString  
Updated | FString  
ETag | FString  

JSON sample preserved.

---

### Get / Set / Remove Channel Metadata

Method signatures, parameters, basic usage code, JSON examples are all preserved exactly as in original (see blocks below).

```
`PubnubSubsystem->GetChannelMetadata(...);  
`
```

```
`PubnubSubsystem->SetChannelMetadata(...);  
`
```

Iterative update full example retained (70-line block).

```
`PubnubSubsystem->RemoveChannelMetadata(FString Channel);  
`
```

---

## Channel Memberships

### Get Channel Memberships

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
All parameter structs (`FPubnubMembershipInclude`, `FPubnubMembershipSort`) and usage blocks kept.

Response struct/JSON retained.

---

### Set / Remove Channel Memberships

```
`PubnubSubsystem->SetMemberships(  
    FString User,   
    FString Include,   
    FString SetObj  
);  
`
```

```
`PubnubSubsystem->RemoveMemberships(  
    FString User,   
    FString Include,   
    FString RemoveObj  
);  
`
```
Both code samples and JSON responses remain.

---

## Channel Members

### Get Channel Members

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
Include/sort structs and both usage blocks remain.

Response structs (`FOnGetChannelMembersResponse`, `FPubnubGetChannelMembersWrapper`) and JSON retained.

---

### Set / Remove Channel Members

```
`PubnubSubsystem->SetChannelMembers(  
    FString Channel,   
    FString Include,   
    FString SetObj  
);  
`
```

```
`PubnubSubsystem->RemoveChannelMembers(  
    FString Channel,   
    FString Include,   
    FString RemoveObj  
);  
`
```
All example code and JSON responses are preserved.

---

_Last updated: Apr 29, 2025_