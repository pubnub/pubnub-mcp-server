# App Context API for Unreal SDK (Condensed)

Serverless storage for user and channel metadata and their memberships. Real-time events are emitted when metadata is set, updated, or removed. Setting data to an unchanged value doesn't trigger events.

Use via Blueprints (Pubnub Subsystem) or C++ (Game Instance Subsystem).

- Add C++ dependency (Source/YourProject/YourProject.Build.cs):

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

- Access subsystem in C++:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

- Example:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

## User

### Get metadata for all users

Retrieve user metadata with pagination. Supports include, filter, sort.

#### Method(s)

##### Method variants
GetAllUserMetadataRaw uses String Include/Sort instead of FPubnubGetAllInclude/FPubnubGetAllSort.

```
`1PubnubSubsystem->GetAllUserMetadata(  
2    FOnGetAllUserMetadataResponse OnGetAllUserMetadataResponse,   
3    FPubnubGetAllInclude Include = FPubnubGetAllInclude(),   
4    int Limit = 100,   
5    FString Filter = "",   
6    FPubnubGetAllSort Sort = FPubnubGetAllSort(),   
7    FString PageNext = "",   
8    FString PagePrev = ""  
9);  
`
```

Parameters:
- OnGetAllUserMetadataResponse: FOnGetAllUserMetadataResponse (or FOnGetAllUserMetadataResponseNative)
- Include: FPubnubGetAllInclude
- Limit: int (default/max 100)
- Filter: FString
- Sort: FPubnubGetAllSort
- PageNext: FString
- PagePrev: FString (ignored if PageNext provided)
- Count: EPubnubTribool (include total count)

#### FPubnubGetAllInclude
- IncludeCustom: bool
- IncludeStatus: bool
- IncludeType: bool
- IncludeTotalCount: bool

#### FPubnubGetAllSort
- GetAllSort: TArray<FPubnubGetAllSingleSort> (applied in order)

#### Sample code

##### Reference code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

##### Other examples

###### Get metadata for all users with additional settings

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

###### Get metadata for all users with all includes

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

###### Get metadata for all users with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

###### Get metadata for all users raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

#### Returns

Delegate returns FOnGetAllUserMetadataResponse.

##### FOnGetAllUserMetadataResponse
- Result: FPubnubOperationResult
- UsersData: const TArray<FPubnubUserData>&
- PageNext: FString
- PagePrev: FString

##### FPubnubUserData
- UserID: FString
- UserName: FString
- ExternalID: FString
- ProfileUrl: FString
- Email: FString
- Custom: FString (JSON)
- Status: FString (<= 50 chars)
- Type: FString (<= 50 chars)
- Updated: FString
- ETag: FString

#### FOnGetAllUserMetadataResponseNative
- Result: const FPubnubOperationResult&
- UsersData: const TArray<FPubnubUserData>&
- PageNext: FString
- PagePrev: FString

### Get user metadata - UserMetadata entity

Requires App Context add-on.

Retrieve metadata for a user, with optional includes.

#### Method(s)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->GetUserMetadata(  
4    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

Parameters:
- OnGetUserMetadataResponse: FOnGetUserMetadataResponse (or FOnGetUserMetadataResponseNative)
- Include: FPubnubGetMetadataInclude

#### Sample code

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetUserMetadataResponse.

#### Other examples

##### Get user metadata with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Get user metadata - PubNub client

Retrieve metadata for a user, with optional includes.

#### Method(s)

```
`1PubnubSubsystem->GetUserMetadata(  
2    FString User,   
3    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
4    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
5);  
`
```

Parameters:
- User: FString (required)
- OnGetUserMetadataResponse: FOnGetUserMetadataResponse (or FOnGetUserMetadataResponseNative)
- Include: FPubnubGetMetadataInclude

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetUserMetadataResponse.

##### FOnGetUserMetadataResponse
- Result: FPubnubOperationResult
- UserData: FPubnubUserData

##### FOnGetUserMetadataResponseNative
- Result: const FPubnubOperationResult&
- UserData: const FPubnubUserData&

#### Other examples

##### Get metadata for a user with all includes

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for a user with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for a user raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set user metadata with additional settings

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set user metadata with result struct

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove user metadata with result struct

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Set user metadata - UserMetadata entity

Requires App Context add-on.

Note: Custom metadata overwrites existing value (no partial update). To merge, read-modify-write.

Set user metadata with optional includes.

#### Method(s)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->SetUserMetadata(  
4    FPubnubUserData UserMetadata,  
5    FOnSetUserMetadataResponse OnSetUserMetadataResponse,  
6    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
7);  

```

Parameters:
- UserMetadata: FPubnubUserData
- FOnSetUserMetadataResponse: FOnSetUserMetadataResponse (or FOnSetUserMetadataResponseNative)
- Include: FPubnubGetMetadataInclude

API limits: See REST API docs (set-user-metadata).

#### Sample code

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

```
`1{  
2    "Uuid": "uuid-1",  
3    "Name": "John Doe",  
4    "Email": "john.doe@pubnub.com",  
5    "ExternalId": "",  
6    "ProfileUrl": "",  
7    "Custom": "",  
8    "Updated": "2020-06-17T16:28:14.060718Z"  
9}  
`
```

#### Other examples

##### Set user metadata with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set user metadata with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Set user metadata - PubNub client

Note: Custom metadata overwrites existing value (no partial update). To merge, read-modify-write.

Set user metadata with optional includes.

#### Method(s)

```
`1PubnubSubsystem->SetUserMetadata(  
2    FString User,    
3    FPubnubUserData UserMetadata,  
4    FOnSetUserMetadataResponse OnSetUserMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  
`
```

Parameters:
- User: FString (required)
- UserMetadata: FPubnubUserData
- FOnSetUserMetadataResponse: FOnSetUserMetadataResponse (or FOnSetUserMetadataResponseNative)
- Include: FPubnubGetMetadataInclude

API limits: See REST API docs (set-user-metadata).

#### FPubnubGetMetadataInclude
- IncludeCustom: bool
- IncludeStatus: bool
- IncludeType: bool

#### FOnSetUserMetadataResponse
- Result: FPubnubOperationResult
- UserData: FPubnubUserData

#### FOnSetUserMetadataResponseNative
- Result: const FPubnubOperationResult&
- UserData: const FPubnubUserData&

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

```
`1{  
2    "Uuid": "uuid-1",  
3    "Name": "John Doe",  
4    "Email": "john.doe@pubnub.com",  
5    "ExternalId": "",  
6    "ProfileUrl": "",  
7    "Custom": "",  
8    "Updated": "2020-06-17T16:28:14.060718Z"  
9}  
`
```

#### Other examples

##### Set metadata for a user with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set metadata for a user with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set metadata for a user raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Iteratively update existing metadata

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Remove user metadata - UserMetadata entity

Requires App Context add-on.

Remove user metadata for a UUID.

#### Method(s)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->RemoveUserMetadata(  
4    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
5);  

```

Parameters:
- OnRemoveUserMetadataResponse: FOnRemoveUserMetadataResponse (or FOnRemoveUserMetadataResponseNative)

#### Sample code

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnRemoveUserMetadataResponse.

#### Other examples

##### Remove user metadata with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove user metadata with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Remove user metadata - PubNub client

Remove user metadata for a UUID.

#### Method(s)

```
`1PubnubSubsystem->RemoveUserMetadata(  
2    FString User,  
3    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
4);  
`
```

Parameters:
- User: FString (required)
- OnRemoveUserMetadataResponse: FOnRemoveUserMetadataResponse (or FOnRemoveUserMetadataResponseNative)

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnRemoveUserMetadataResponse.

##### FOnRemoveUserMetadataResponse
- Result: FPubnubOperationResult

##### FOnRemoveUserMetadataResponseNative
- Result: const FPubnubOperationResult&

#### Other examples

##### Remove metadata for a user with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove metadata for a user with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

## Channel

### Get metadata for all channels

Retrieve channel metadata with pagination. Supports include, filter, sort.

#### Method(s)

##### Method variants
GetAllChannelMetadataRaw uses String Include/Sort instead of FPubnubGetAllInclude/FPubnubGetAllSort.

```
`1PubnubSubsystem->GetAllChannelMetadata(  
2    FOnGetAllChannelMetadataResponse OnGetAllChannelMetadataResponse,   
3    FPubnubGetAllInclude Include = FPubnubGetAllInclude(),   
4    int Limit = 100,   
5    FString Filter = "",   
6    FPubnubGetAllSort Sort = FPubnubGetAllSort(),   
7    FString PageNext = "",   
8    FString PagePrev = ""  
9);  
`
```

Parameters:
- OnGetAllChannelMetadataResponse: FOnGetAllChannelMetadataResponse (or FOnGetAllChannelMetadataResponseNative)
- Include: FPubnubGetAllInclude
- Limit: int (default/max 100)
- Filter: FString
- Sort: FPubnubGetAllSort
- PageNext: FString
- PagePrev: FString

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetAllChannelMetadataResponse.

##### FOnGetAllChannelMetadataResponse
- Result: const FPubnubOperationResult&
- ChannelsData: const TArray<FPubnubChannelData>&
- PageNext: FString
- PagePrev: FString

##### FPubnubChannelData
- ChannelID: FString
- ChannelName: FString
- Description: FString
- Custom: FString (JSON)
- Status: FString (<= 50 chars)
- Type: FString (<= 50 chars)
- Updated: FString
- ETag: FString

##### FOnGetAllChannelMetadataResponseNative
- Result: const FPubnubOperationResult&
- ChannelsData: const TArray<FPubnubChannelData>&
- PageNext: FString
- PagePrev: FString

#### Other examples

##### Get metadata for all channels with settings

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for all channels with all includes

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for all channels with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for all channels raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Get channel metadata - ChannelMetadata entity

Requires App Context add-on.

Retrieve metadata for a channel, with optional includes.

#### Method(s)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->GetChannelMetadata(  
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

Parameters:
- OnGetChannelMetadataResponse: FOnGetChannelMetadataResponse (or FOnGetChannelMetadataResponseNative)
- Include: FPubnubGetMetadataInclude

#### Sample code

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetChannelMetadataResponse.

#### Other examples

##### Get channel metadata with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Get channel metadata - PubNub client

Retrieve metadata for a channel, with optional includes.

#### Method(s)

```
`1PubnubSubsystem->GetChannelMetadata(  
2    FString Include,   
3    FString Channel,   
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse  
5);  
`
```

Parameters:
- Include: FString (comma-delimited) or "" for none
- Channel: FString (required)
- OnGetChannelMetadataResponse: FOnGetChannelMetadataResponse (or FOnGetChannelMetadataResponseNative)

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetChannelMetadataResponse.

##### FOnGetChannelMetadataResponse
- Result: FPubnubOperationResult
- ChannelData: FPubnubChannelData

##### FOnGetChannelMetadataResponseNative
- Result: const FPubnubOperationResult&
- ChannelData: const FPubnubChannelData&

#### Other examples

##### Get metadata for a channel with all includes

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for a channel with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get metadata for a channel raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set channel metadata with additional settings

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set channel metadata with result struct

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove channel metadata with result struct

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Set channel metadata - ChannelMetadata entity

Requires App Context add-on.

Note: Custom metadata overwrites existing value (no partial update). To merge, read-modify-write.

Set channel metadata with optional includes.

#### Method(s)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->SetChannelMetadata(  
4    FPubnubChannelData ChannelMetadata,   
5    FOnSetChannelMetadataResponse OnSetChannelMetadataResponse,   
6    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
7);  

```

Parameters:
- ChannelMetadata: FPubnubChannelData
- FOnSetChannelMetadataResponse: FOnSetChannelMetadataResponse (or FOnSetChannelMetadataResponseNative)
- Include: FPubnubGetMetadataInclude

API limits: See REST API docs (set-channel-metadata).

#### Sample code

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

```
`1{  
2    "Channel": "my-channel",  
3    "Name": "PubNub channel",  
4    "Description": "The channel for announcements",  
5    "Updated": "2020-06-17T16:52:19.562469Z"  
6}  
`
```

#### Other examples

##### Set channel metadata with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set channel metadata with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Set channel metadata - PubNub client

Note: Custom metadata overwrites existing value (no partial update). To merge, read-modify-write.

Set channel metadata with optional includes.

#### Method(s)

```
`1PubnubSubsystem->SetChannelMetadata(  
2    FString Channel,   
3    FPubnubChannelData ChannelMetadata,   
4    FOnSetChannelMetadataResponse OnSetChannelMetadataResponse,   
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  
`
```

Parameters:
- Channel: FString (required)
- ChannelMetadata: FPubnubChannelData
- FOnSetChannelMetadataResponse: FOnSetChannelMetadataResponse (or Native)
- Include: FPubnubGetMetadataInclude

API limits: See REST API docs (set-channel-metadata).

#### FOnSetChannelMetadataResponse
- Result: FPubnubOperationResult
- ChannelData: FPubnubChannelData

#### FOnSetChannelMetadataResponseNative
- Result: const FPubnubOperationResult&
- ChannelData: const FPubnubChannelData&

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

```
`1{  
2    "Channel": "my-channel",  
3    "Name": "PubNub channel",  
4    "Description": "The channel for announcements",  
5    "Updated": "2020-06-17T16:52:19.562469Z"  
6}  
`
```

#### Other examples

##### Set metadata for a channel with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set metadata for a channel with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set metadata for a channel raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Iteratively update existing metadata

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Remove channel metadata - ChannelMetadata entity

Requires App Context add-on.

Remove metadata for a specific channel.

#### Method(s)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->RemoveChannelMetadata(  
4    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
5);  

```

Parameters:
- OnRemoveChannelMetadataResponse: FOnRemoveChannelMetadataResponse (or Native)

#### Sample code

- C++

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnRemoveChannelMetadataResponse.

#### Other examples

##### Remove channel metadata with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove channel metadata with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Remove channel metadata - PubNub client

Remove metadata for a specific channel.

#### Method(s)

```
`1PubnubSubsystem->RemoveChannelMetadata(  
2    FString Channel,   
3    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
4);  
`
```

Parameters:
- Channel: FString (required)
- OnRemoveChannelMetadataResponse: FOnRemoveChannelMetadataResponse (or Native)

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnRemoveChannelMetadataResponse.

##### FOnRemoveChannelMetadataResponse
- Result: FPubnubOperationResult

##### FOnRemoveChannelMetadataResponseNative
- Result: const FPubnubOperationResult&

#### Other examples

##### Remove metadata for a channel with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove metadata for a channel with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

## Channel memberships

### Get channel memberships

List channel memberships for a user (not subscriptions).

#### Method(s)

##### Method variants
GetMembershipsRaw uses String Include/Sort instead of FPubnubMembershipInclude/FPubnubMembershipSort.

```
`1PubnubSubsystem->GetMemberships(  
2    FString User,   
3    FOnGetMembershipsResponse OnGetMembershipsResponse,   
4    FPubnubMembershipInclude Include = FPubnubMembershipInclude(),   
5    int Limit = 100,   
6    FString Filter = "",   
7    FPubnubMembershipSort Sort = FPubnubMembershipSort(),   
8    FString PageNext = "",   
9    FString PagePrev = ""  
10);  
`
```

Parameters:
- User: FString (required)
- OnGetMembershipsResponse: FOnGetMembershipsResponse (or Native)
- Include: FPubnubMembershipInclude
- Limit: int (default/max 100)
- Filter: FString
- Sort: FPubnubMembershipSort
- PageNext: FString
- PagePrev: FString

#### FPubnubMembershipInclude
- IncludeCustom: bool
- IncludeStatus: bool
- IncludeType: bool
- IncludeChannel: bool (FPubnubChannelData)
- IncludeChannelCustom: bool
- IncludeChannelStatus: bool
- IncludeChannelType: bool
- IncludeTotalCount: bool

#### FPubnubMembershipSort
- MembershipSort: TArray<FPubnubMembershipSingleSort>

#### FPubnubMembershipSingleSort
- SortType: EPubnubMembershipSortType (default PMST_ChannelID)
- SortOrder: bool (false asc, true desc)

#### EPubnubMembershipSortType
- PMST_ChannelID, PMST_ChannelName, PMST_ChannelUpdated, PMST_ChannelStatus, PMST_ChannelType, PMST_Updated, PMST_Status, PMST_Type

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetMembershipsResponse.

##### FOnGetMembershipsResponse
- MembershipsData: TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

##### FPubnubMembershipData
- Channel: FPubnubChannelData
- Custom: FString (JSON)
- Status: FString (<= 50 chars)
- Type: FString (<= 50 chars)
- Updated: FString
- ETag: FString

##### FOnGetMembershipsResponseNative
- Result: const FPubnubOperationResult&
- MembershipsData: const TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

#### Other examples

##### Get memberships for a user with settings

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get memberships for a user with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get memberships for a user with raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Set channel memberships

Add/update channel memberships for a user.

#### Method(s)

```
`1PubnubSubsystem->SetMemberships(  
2    FString User,   
3    TArrayFPubnubMembershipInputData> Channels,   
4    FOnSetMembershipsResponse OnSetMembershipsResponse,   
5    FPubnubMembershipInclude Include = FPubnubMembershipInclude(),   
6    int Limit = 100,   
7    FString Filter = "",   
8    FPubnubMembershipSort Sort = FPubnubMembershipSort(),   
9    FString PageNext = "",   
10    FString PagePrev = "");  
`
```

Parameters:
- User: FString (required)
- Channels: TArray<FPubnubMembershipInputData> (required)
- FOnSetMembershipsResponse: FOnSetMembershipsResponse (or Native)
- Include: FPubnubMembershipInclude
- Limit: int
- Filter: FString
- Sort: FPubnubMembershipSort
- PageNext: FString
- PagePrev: FString

API limits: See REST API docs (set-user-metadata).

#### FPubnubMembershipInputData
- Channel: FString (required)
- Custom: FString
- Status: FString
- Type: FString

#### FOnSetMembershipsResponse
- Result: FPubnubOperationResult
- MembershipsData: TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

#### FOnSetMembershipsResponseNative
- Result: const FPubnubOperationResult&
- MembershipsData: const TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

API limits: See REST API docs (set-membership-metadata).

#### Returns

```
`1{  
2    "Memberships": [  
3        {  
4            "ChannelMetadata": {  
5                "Channel": "my-channel",  
6                "Name": "My channel",  
7                "Description": "A channel that is mine",  
8                "Custom": "",  
9                "Updated": "2020-06-17T16:55:44.632042Z"  
10            },  
11            "Custom": {  
12                "starred": false  
13            },  
14            "Updated": "2020-06-17T17:05:25.987964Z"  
15        },  
16        {  
17            "ChannelMetadata": {  
18                "Channel": "main",  
19                "Name": "Main channel",  
20                "Description": "The main channel",  
21                "Custom": {  
22                    "public": true,  
23                    "motd": "Always check your spelling!"  
24                },  
25                "Updated": "2020-06-17T16:55:44.632042Z"  
26            },  
27            "Custom": {  
28                "item": "book"  
29            },  
30            "Updated": "2020-06-17T17:05:25.987964Z"  
31        }  
32    ],  
33    "TotalCount": 2,  
34    "Page": {  
35        "Next": "MQ",  
36        "Prev": ""  
37    }  
38}  
`
```

#### Other examples

##### Set memberships for a user with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set memberships for a user with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set memberships for a user with raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Remove Channel Memberships

Remove channel memberships for a user.

#### Method(s)

```
`1PubnubSubsystem->RemoveMemberships(  
2    FString User,   
3    TArrayFString> Channels,   
4    FOnRemoveMembershipsResponse OnRemoveMembershipsResponse,   
5    FPubnubMembershipInclude Include = FPubnubMembershipInclude(),   
6    int Limit = 100,   
7    FString Filter = "",   
8    FPubnubMembershipSort Sort = FPubnubMembershipSort(),   
9    FString PageNext = "",   
10    FString PagePrev = ""  
11);  
`
```

Parameters:
- User: FString (required)
- Channels: TArray<FString> (required)
- FOnRemoveMembershipsResponse: FOnRemoveMembershipsResponse (or Native)
- Include: FPubnubMembershipInclude
- Limit: int
- Filter: FString
- Sort: FPubnubMembershipSort
- PageNext: FString
- PagePrev: FString

API limits: See REST API docs (set-user-metadata).

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnRemoveMembershipsResponse.

##### FOnRemoveMembershipsResponse
- Result: FPubnubOperationResult
- MembershipsData: TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

##### FOnRemoveMembershipsResponseNative
- Result: const FPubnubOperationResult&
- MembershipsData: const TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

#### Other examples

##### Remove memberships for a user with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove memberships for a user with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove memberships for a user with raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

## Channel members

### Get channel members

List members in a channel; can include user metadata.

#### Method(s)

##### Method variants
GetChannelMembersRaw uses String Include/Sort instead of FPubnubMemberInclude/FPubnubMemberSort.

```
`1PubnubSubsystem->GetChannelMembers(  
2    FString Channel,   
3    FOnGetChannelMembersResponse OnGetChannelMembersResponse,   
4    FPubnubMemberInclude Include = FPubnubMemberInclude(),   
5    int Limit = 100,   
6    FString Filter = "",   
7    FPubnubMemberSort Sort = FPubnubMemberSort(),   
8    FString PageNext = "",   
9    FString PagePrev = ""  
10);  
`
```

Parameters:
- Channel: FString (required)
- OnGetChannelMembersResponse: FOnGetChannelMembersResponse (or Native)
- Include: FPubnubMemberInclude
- Limit: int (default/max 100)
- Filter: FString
- Sort: FPubnubMemberSort
- PageNext: FString
- PagePrev: FString

#### FPubnubMemberInclude
- IncludeCustom: bool
- IncludeStatus: bool
- IncludeType: bool
- IncludeUUID: bool (User data)
- IncludeUUIDCustom: bool
- IncludeUUIDStatus: bool
- IncludeUUIDType: bool
- IncludeTotalCount: bool

#### FPubnubMemberSort
- MemberSort: TArray<FPubnubMemberSingleSort>

#### FPubnubMemberSingleSort
- SortType: EPubnubMemberSortType (default PMeST_UserID)
- SortOrder: bool (false asc, true desc)

#### EPubnubMemberSortType
- PMeST_UserID, PMeST_UserName, PMeST_UserUpdated, PMeST_UserStatus, PMeST_UserType, PMeST_Updated, PMeST_Status, PMeST_Type

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnGetChannelMembersResponse.

##### FOnGetChannelMembersResponse
- Result: FPubnubOperationResult
- MembersData: TArray<FPubnubChannelMemberData>&
- PageNext: FString
- PagePrev: FString

##### FPubnubChannelMemberData
- User: FPubnubUserData
- Custom: FString (JSON)
- Status: FString (<= 50 chars)
- Type: FString (<= 50 chars)
- Updated: FString
- ETag: FString

##### FOnGetChannelMembersResponseNative
- Result: const FPubnubOperationResult&
- MembersData: const TArray<FPubnubChannelMemberData>&
- PageNext: FString
- PagePrev: FString

#### Other examples

##### Get channel members with settings

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get channel members with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Get channel members raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Set channel members

Add/update members in a channel.

#### Method(s)

```
`1PubnubSubsystem->SetChannelMembers(  
2    FString Channel,   
3    TArrayFPubnubChannelMemberInputData> Users,   
4    FOnSetChannelMembersResponse OnSetChannelMembersResponse,   
5    FPubnubMemberInclude Include = FPubnubMemberInclude(),   
6    int Limit = 100,   
7    FString Filter = "",   
8    FPubnubMemberSort Sort = FPubnubMemberSort(),   
9    FString PageNext = "",   
10    FString PagePrev = ""  
11);  
`
```

Parameters:
- Channel: FString (required)
- Users: TArray<FPubnubChannelMemberInputData> (required)
- FOnSetChannelMembersResponse: FOnSetChannelMembersResponse (or Native)
- Include: FPubnubMemberInclude
- Limit: int
- Filter: FString
- Sort: FPubnubMemberSort
- PageNext: FString
- PagePrev: FString

API limits: See REST API docs (set-channel-members-metadata).

#### FPubnubChannelMemberInputData
- User: FString (required)
- Custom: FString
- Status: FString
- Type: FString

#### FOnSetChannelMembersResponse
- Result: FPubnubOperationResult
- MembersData: TArray<FPubnubChannelMemberData>&
- PageNext: FString
- PagePrev: FString

#### FOnSetChannelMembersResponseNative
- Result: const FPubnubOperationResult&
- MembersData: const TArray<FPubnubChannelMemberData>&
- PageNext: FString
- PagePrev: FString

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

```
`1{  
2    "ChannelMembers": [  
3        {  
4            "UuidMetadata": {  
5                "Uuid": "uuid-1",  
6                "Name": "John Doe",  
7                "Email": "john.doe@pubnub.com",  
8                "ExternalId": "",  
9                "ProfileUrl": "",  
10                "Custom": "",  
11                "Updated": "2019-02-20T23:11:20.89375"  
12            },  
13            "Custom": {  
14                "role": "admin"  
15            },  
16            "Updated": "2020-06-17T17:05:25.987964Z"  
17        },  
18        {  
19            "UuidMetadata": {  
20                "Uuid": "uuid-2",  
21                "Name": "Bob Cat",  
22                "Email": "bobc@example.com",  
23                "ExternalId": "",  
24                "ProfileUrl": "",  
25                "Custom": {  
26                    "phone": "999-999-9999"  
27                },  
28                "Updated": "2019-02-20T23:11:20.89375"  
29            },  
30            "Custom": "",  
31            "Updated": "2020-06-17T17:05:25.987964Z"  
32        }  
33    ],  
34    "TotalCount": 2,  
35    "Page": {  
36        "Next": "MQ",  
37        "Prev": ""  
38    }  
39}  
`
```

#### Other examples

##### Set channel members with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set channel members with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Set channel members raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

### Remove Channel Members

Remove members from a channel.

#### Method(s)

```
`1PubnubSubsystem->RemoveChannelMembers(  
2    FString Channel,   
3    TArrayFString> Users,   
4    FOnRemoveChannelMembersResponse OnRemoveChannelMembersResponse,   
5    FPubnubMemberInclude Include = FPubnubMemberInclude(),   
6    int Limit = 100,   
7    FString Filter = "",   
8    FPubnubMemberSort Sort = FPubnubMemberSort(),   
9    FString PageNext = "",   
10    FString PagePrev = ""  
11);  
`
```

Parameters:
- Channel: FString (required)
- Users: TArray<FString> (required)
- FOnRemoveChannelMembersResponse: FOnRemoveChannelMembersResponse (or Native)
- Include: FPubnubMemberInclude
- Limit: int
- Filter: FString
- Sort: FPubnubMemberSort
- PageNext: FString
- PagePrev: FString

#### Sample code

- C++
- Blueprint

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

#### Returns

Delegate returns FOnRemoveChannelMembersResponse.

##### FOnRemoveChannelMembersResponse
- Result: FPubnubOperationResult
- MembersData: TArray<FPubnubChannelMemberData>&
- PageNext: FString
- PagePrev: FString

##### FOnRemoveChannelMembersResponseNative
- Result: const FPubnubOperationResult&
- MembersData: const TArray<FPubnubChannelMemberData>&
- PageNext: FString
- PagePrev: FString

#### Other examples

##### Remove channel members with result

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove channel members with lambda

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

##### Remove channel members raw

###### Actor.h

```
1
  

```

###### Actor.cpp

```
1
  

```

## Complete example

#### ASample_AppContextFull.h

```
1
  

```

#### ASample_AppContextFull.cpp

```
1
**
```
Last updated on Sep 11, 2025**