# App Context API for Unreal SDK (Condensed)

App Context is serverless storage for user, channel, and membership metadata with real-time events on set/update/remove. Setting data to the same existing value doesn't trigger an event.

Use via Blueprints or C++:
- Blueprints: start with the Pubnub Subsystem node.
- C++: add dependency and access subsystem.

Add module dependency in Source/YourProject/YourProject.Build.cs:
```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access the subsystem in C++:
```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example call:
```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

## User

### Get metadata for all users

Retrieve user metadata in pages. Optionally include Custom and other fields.

#### Method(s)

Method variants
- GetAllUserMetadataRaw: uses String Include/Sort instead of FPubnubGetAllInclude/FPubnubGetAllSort.

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

Parameters
- OnGetAllUserMetadataResponse: Type FOnGetAllUserMetadataResponse. Delegate for result. Native alternative: FOnGetAllUserMetadataResponseNative (lambda).
- Include: Type FPubnubGetAllInclude. Fields to include.
- Limit: int. Default/Max: 100.
- Filter: FString. See filtering.
- Sort: Type FPubnubGetAllSort. Sort by id, name, updated with asc/desc.
- PageNext: FString. Cursor for next page.
- PagePrev: FString. Cursor for previous page (ignored if PageNext provided).
- Count: EPubnubTribool. Whether to include total count (default: not set).

#### FPubnubGetAllInclude

Field | Type | Description
- IncludeCustom | bool | Include Custom object.
- IncludeStatus | bool | Include membership Status.
- IncludeType | bool | Include membership Type.
- IncludeTotalCount | bool | Include total count.

#### FPubnubGetAllSort

Field | Type | Description
- GetAllSort | TArray<FPubnubGetAllSingleSort> | Ordered sort criteria.

#### Sample code

Reference code
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

Other examples

Reference code

Get metadata for all users with additional settings

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for all users with all includes

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for all users with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for all users raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

#### Returns

Void; result via FOnGetAllUserMetadataResponse.

##### FOnGetAllUserMetadataResponse

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- UsersData | const TArray<FPubnubUserData>& | Array of users with metadata.
- PageNext | FString | Cursor for forward pagination.
- PagePrev | FString | Cursor for backward pagination (ignored if PageNext is supplied).

##### FPubnubUserData

Field | Type | Description
- UserID | FString | UUID. Defaults to current user’s UUID if not supplied.
- UserName | FString | Display name.
- ExternalID | FString | External system ID.
- ProfileUrl | FString | Profile image URL.
- Email | FString | Email.
- Custom | FString | Custom JSON (strings, numbers, booleans). Filtering by Custom not supported.
- Status | FString | Max 50 chars.
- Type | FString | Max 50 chars.
- Updated | FString | Last update date.
- ETag | FString | Content fingerprint.

#### FOnGetAllUserMetadataResponseNative

Same as FOnGetAllUserMetadataResponse but with const refs:
- Result: const FPubnubOperationResult&
- UsersData: const TArray<FPubnubUserData>&
- PageNext, PagePrev: FString

### Get user metadata - UserMetadata entity

Available in entities
- UserMetadata

Requires App Context add-on

Retrieve metadata for a user. Optionally include Custom.

#### Method(s)
```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->GetUserMetadata(  
4    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

Parameters
- OnGetUserMetadataResponse: Type FOnGetUserMetadataResponse. Native: FOnGetUserMetadataResponseNative.
- Include: Type FPubnubGetMetadataInclude.

#### Sample code

Reference code
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

Void; result via FOnGetUserMetadataResponse.

Other examples

Reference code

Get user metadata with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Get user metadata - PubNub client

Retrieve metadata for a user. Optionally include Custom.

#### Method(s)
```
`1PubnubSubsystem->GetUserMetadata(  
2    FString User,   
3    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
4    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
5);  
`
```

Parameters
- User: FString. Metadata ID (required).
- OnGetUserMetadataResponse: FOnGetUserMetadataResponse. Native: FOnGetUserMetadataResponseNative.
- Include: FPubnubGetMetadataInclude.

#### Sample code

Reference code
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

Void; result via FOnGetUserMetadataResponse.

##### FOnGetUserMetadataResponse

- Result: FPubnubOperationResult
- UserData: FPubnubUserData

##### FOnGetUserMetadataResponseNative

- Result: const FPubnubOperationResult&
- UserData: const FPubnubUserData&

Other examples

Reference code

Get metadata for a user with all includes

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for a user with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for a user raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set user metadata with additional settings

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set user metadata with result struct

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove user metadata with result struct

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Set user metadata - UserMetadata entity

Available in entities
- UserMetadata

Requires App Context add-on

Unsupported partial updates of custom metadata
- Custom payload overwrites existing Custom. To append, first read current value, merge client-side, then set.

Set metadata for a user (optionally include Custom).

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

Parameters
- UserMetadata: FPubnubUserData. Object to create/update.
- FOnSetUserMetadataResponse: Delegate for result. Native: FOnSetUserMetadataResponseNative.
- Include: FPubnubGetMetadataInclude.

API limits
- See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### Sample code

Reference code
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

Other examples

Reference code

Set user metadata with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set user metadata with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Set user metadata - PubNub client

Unsupported partial updates of custom metadata
- Custom payload overwrites existing Custom. To append, first read, merge, then set.

Set metadata for a user.

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

Parameters
- User: FString. Metadata ID (required).
- UserMetadata: FPubnubUserData. Object to create/update.
- FOnSetUserMetadataResponse: Delegate. Native: FOnSetUserMetadataResponseNative.
- Include: FPubnubGetMetadataInclude.

API limits: See /docs/sdks/rest-api/set-user-metadata

#### FPubnubGetMetadataInclude

Field | Type | Description
- IncludeCustom | bool | Include Custom.
- IncludeStatus | bool | Include Status.
- IncludeType | bool | Include Type.

#### FOnSetUserMetadataResponse

- Result: FPubnubOperationResult
- UserData: FPubnubUserData

#### FOnSetUserMetadataResponseNative

- Result: const FPubnubOperationResult&
- UserData: const FPubnubUserData&

#### Sample code

Reference code
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

Other examples

Reference code

Set metadata for a user with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set metadata for a user with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set metadata for a user raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Iteratively update existing metadata

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Remove user metadata - UserMetadata entity

Available in entities
- UserMetadata

Requires App Context add-on

Remove metadata for a user UUID.

#### Method(s)
```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->RemoveUserMetadata(  
4    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
5);  

```

Parameters
- OnRemoveUserMetadataResponse: FOnRemoveUserMetadataResponse. Native: FOnRemoveUserMetadataResponseNative.

#### Sample code

Reference code
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

Void; result via FOnRemoveUserMetadataResponse.

Other examples

Reference code

Remove user metadata with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove user metadata with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Remove user metadata - PubNub client

Remove metadata for a user UUID.

#### Method(s)
```
`1PubnubSubsystem->RemoveUserMetadata(  
2    FString User,  
3    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
4);  
`
```

Parameters
- User: FString (required).
- OnRemoveUserMetadataResponse: FOnRemoveUserMetadataResponse. Native: FOnRemoveUserMetadataResponseNative.

#### Sample code

Reference code
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

Void; result via FOnRemoveUserMetadataResponse.

##### FOnRemoveUserMetadataResponse

- Result: FPubnubOperationResult

##### FOnRemoveUserMetadataResponseNative

- Result: const FPubnubOperationResult&

Other examples

Reference code

Remove metadata for a user with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove metadata for a user with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

## Channel

### Get metadata for all channels

Retrieve channel metadata in pages. Optionally include Custom.

#### Method(s)

Method variants
- GetAllChannelMetadataRaw: uses String Include/Sort instead of FPubnubGetAllInclude/FPubnubGetAllSort.

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

Parameters
- OnGetAllChannelMetadataResponse: FOnGetAllChannelMetadataResponse. Native: FOnGetAllChannelMetadataResponseNative.
- Include: FPubnubGetAllInclude.
- Limit: int (default/max 100).
- Filter: FString.
- Sort: FPubnubGetAllSort.
- PageNext, PagePrev: FString.

#### Sample code

Reference code
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

Void; result via FOnGetAllChannelMetadataResponse.

##### FOnGetAllChannelMetadataResponse

- Result: const FPubnubOperationResult&
- ChannelsData: const TArray<FPubnubChannelData>&
- PageNext: FString
- PagePrev: FString

##### FPubnubChannelData

Field | Type | Description
- ChannelID | FString | Channel ID.
- ChannelName | FString | Channel name.
- Description | FString | Description.
- Custom | FString | Custom JSON (no filtering).
- Status | FString | Max 50 chars.
- Type | FString | Max 50 chars.
- Updated | FString | Last update date.
- ETag | FString | Version identifier.

##### FOnGetAllChannelMetadataResponseNative

Same fields as above with const refs.

Other examples

Reference code

Get metadata for all channels with settings

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for all channels with all includes

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for all channels with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for all channels raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Get channel metadata - ChannelMetadata entity

Available in entities
- ChannelMetadata

Requires App Context add-on

Retrieve metadata for a channel. Optionally include Custom.

#### Method(s)
```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->GetChannelMetadata(  
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

Parameters
- OnGetChannelMetadataResponse: FOnGetChannelMetadataResponse. Native: FOnGetChannelMetadataResponseNative.
- Include: FPubnubGetMetadataInclude.

#### Sample code

Reference code
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

Void; result via FOnGetChannelMetadataResponse.

Other examples

Reference code

Get channel metadata with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Get channel metadata - PubNub client

Retrieve metadata for a channel. Optionally include Custom.

#### Method(s)
```
`1PubnubSubsystem->GetChannelMetadata(  
2    FString Include,   
3    FString Channel,   
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse  
5);  
`
```

Parameters
- Include: FString (comma-delimited). Use "" for none.
- Channel: FString (required).
- OnGetChannelMetadataResponse: FOnGetChannelMetadataResponse. Native: FOnGetChannelMetadataResponseNative.

#### Sample code

Reference code
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

Void; result via FOnGetChannelMetadataResponse.

##### FOnGetChannelMetadataResponse

- Result: FPubnubOperationResult
- ChannelData: FPubnubChannelData

##### FOnGetChannelMetadataResponseNative

- Result: const FPubnubOperationResult&
- ChannelData: const FPubnubChannelData&

Other examples

Reference code

Get metadata for a channel with all includes

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for a channel with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get metadata for a channel raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set channel metadata with additional settings

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set channel metadata with result struct

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove channel metadata with result struct

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Set channel metadata - ChannelMetadata entity

Available in entities
- ChannelMetadata

Requires App Context add-on

Unsupported partial updates of custom metadata
- Custom payload overwrites existing Custom. To append, read-merge-set.

Set metadata for a channel.

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

Parameters
- ChannelMetadata: FPubnubChannelData.
- FOnSetChannelMetadataResponse: Delegate. Native: FOnSetChannelMetadataResponseNative.
- Include: FPubnubGetMetadataInclude.

API limits: See /docs/sdks/rest-api/set-channel-metadata

#### Sample code

Reference code
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

Other examples

Reference code

Set channel metadata with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set channel metadata with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Set channel metadata - PubNub client

Unsupported partial updates of custom metadata
- Custom payload overwrites existing Custom. To append, read-merge-set.

Set channel metadata.

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

Parameters
- Channel: FString (required).
- ChannelMetadata: FPubnubChannelData.
- FOnSetChannelMetadataResponse: Delegate. Native: FOnSetChannelMetadataResponseNative.
- Include: FPubnubGetMetadataInclude.

API limits: See /docs/sdks/rest-api/set-channel-metadata

#### FOnSetChannelMetadataResponse

- Result: FPubnubOperationResult
- ChannelData: FPubnubChannelData

#### FOnSetChannelMetadataResponseNative

- Result: const FPubnubOperationResult&
- ChannelData: const FPubnubChannelData&

#### Sample code

Reference code
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

Other examples

Reference code

Set metadata for a channel with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set metadata for a channel with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set metadata for a channel raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Iteratively update existing metadata

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Remove channel metadata - ChannelMetadata entity

Available in entities
- ChannelMetadata

Requires App Context add-on

Remove metadata for a channel.

#### Method(s)
```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->RemoveChannelMetadata(  
4    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
5);  

```

Parameters
- OnRemoveChannelMetadataResponse: FOnRemoveChannelMetadataResponse. Native: FOnRemoveChannelMetadataResponseNative.

#### Sample code

Reference code
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

Void; result via FOnRemoveChannelMetadataResponse.

Other examples

Reference code

Remove channel metadata with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove channel metadata with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Remove channel metadata - PubNub client

Remove metadata for a channel.

#### Method(s)
```
`1PubnubSubsystem->RemoveChannelMetadata(  
2    FString Channel,   
3    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
4);  
`
```

Parameters
- Channel: FString (required).
- OnRemoveChannelMetadataResponse: FOnRemoveChannelMetadataResponse. Native: FOnRemoveChannelMetadataResponseNative.

#### Sample code

Reference code
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

Void; result via FOnRemoveChannelMetadataResponse.

##### FOnRemoveChannelMetadataResponse

- Result: FPubnubOperationResult

##### FOnRemoveChannelMetadataResponseNative

- Result: const FPubnubOperationResult&

Other examples

Reference code

Remove metadata for a channel with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove metadata for a channel with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

## Channel memberships

### Get channel memberships

List channel memberships for a user (not subscriptions).

#### Method(s)

Method variants
- GetMembershipsRaw: uses String Include/Sort instead of FPubnubMembershipInclude/FPubnubMembershipSort.

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

Parameters
- User: FString (required).
- OnGetMembershipsResponse: FOnGetMembershipsResponse. Native: FOnGetMembershipsResponseNative.
- Include: FPubnubMembershipInclude.
- Limit, Filter, Sort, PageNext, PagePrev: as standard pagination.

#### FPubnubMembershipInclude

- IncludeCustom (bool)
- IncludeStatus (bool)
- IncludeType (bool)
- IncludeChannel (bool) Include FPubnubChannelData.
- IncludeChannelCustom (bool)
- IncludeChannelStatus (bool)
- IncludeChannelType (bool)
- IncludeTotalCount (bool)

#### FPubnubMembershipSort

- MembershipSort: TArray<FPubnubMembershipSingleSort>

#### FPubnubMembershipSingleSort

- SortType: EPubnubMembershipSortType (default EPubnubMembershipSortType::PMST_ChannelID)
- SortOrder: bool (false asc, true desc)

#### EPubnubMembershipSortType

- PMST_ChannelID, PMST_ChannelName, PMST_ChannelUpdated, PMST_ChannelStatus, PMST_ChannelType, PMST_Updated, PMST_Status, PMST_Type

#### Sample code

Reference code
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

Void; result via FOnGetMembershipsResponse.

##### FOnGetMembershipsResponse

- MembershipsData: TArray<FPubnubMembershipData>&
- PageNext: FString
- PagePrev: FString

##### FPubnubMembershipData

- Channel: FPubnubChannelData
- Custom: FString
- Status: FString (max 50)
- Type: FString (max 50)
- Updated: FString
- ETag: FString

##### FOnGetMembershipsResponseNative

- Result: const FPubnubOperationResult&
- MembershipsData: const TArray<FPubnubMembershipData>&
- PageNext, PagePrev: FString

Other examples

Reference code

Get memberships for a user with settings

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get memberships for a user with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get memberships for a user with raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Set channel memberships

Set memberships for a user.

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

Parameters
- User: FString (required).
- Channels: TArray<FPubnubMembershipInputData> (required).
- FOnSetMembershipsResponse: Delegate. Native: FOnSetMembershipsResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev.

API limits: See /docs/sdks/rest-api/set-user-metadata

#### FPubnubMembershipInputData

- Channel: FString (required)
- Custom: FString
- Status: FString
- Type: FString

#### FOnSetMembershipsResponse

- Result: FPubnubOperationResult
- MembershipsData: TArray<FPubnubMembershipData>&
- PageNext, PagePrev: FString

#### FOnSetMembershipsResponseNative

- Result: const FPubnubOperationResult&
- MembershipsData: const TArray<FPubnubMembershipData>&
- PageNext, PagePrev: FString

#### Sample code

Reference code
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

API limits: See /docs/sdks/rest-api/set-membership-metadata

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

Other examples

Reference code

Set memberships for a user with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set memberships for a user with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set memberships for a user with raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Remove Channel Memberships

Remove memberships for a user.

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

Parameters
- User: FString (required).
- Channels: TArray<FString> (required).
- FOnRemoveMembershipsResponse: Delegate. Native: FOnRemoveMembershipsResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev.

API limits: See /docs/sdks/rest-api/set-user-metadata

#### Sample code

Reference code
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

Void; result via FOnRemoveMembershipsResponse.

##### FOnRemoveMembershipsResponse

- Result: FPubnubOperationResult
- MembershipsData: TArray<FPubnubMembershipData>&
- PageNext, PagePrev: FString

##### FOnRemoveMembershipsResponseNative

- Result: const FPubnubOperationResult&
- MembershipsData: const TArray<FPubnubMembershipData>&
- PageNext, PagePrev: FString

Other examples

Reference code

Remove memberships for a user with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove memberships for a user with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove memberships for a user with raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

## Channel members

### Get channel members

List members in a channel (includes user metadata if stored).

#### Method(s)

Method variants
- GetChannelMembersRaw: uses String Include/Sort instead of FPubnubMemberInclude/FPubnubMemberSort.

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

Parameters
- Channel: FString (required).
- OnGetChannelMembersResponse: Delegate. Native: FOnGetChannelMembersResponseNative.
- Include: FPubnubMemberInclude.
- Limit, Filter, Sort, PageNext, PagePrev.

#### FPubnubMemberInclude

- IncludeCustom (bool)
- IncludeStatus (bool)
- IncludeType (bool)
- IncludeUUID (bool) Include user data.
- IncludeUUIDCustom (bool)
- IncludeUUIDStatus (bool)
- IncludeUUIDType (bool)
- IncludeTotalCount (bool)

#### FPubnubMemberSort

- MemberSort: TArray<FPubnubMemberSingleSort>

#### FPubnubMemberSingleSort

- SortType: EPubnubMemberSortType (default EPubnubMemberSortType::PMeST_UserID)
- SortOrder: bool (false asc, true desc)

#### EPubnubMemberSortType

- PMeST_UserID, PMeST_UserName, PMeST_UserUpdated, PMeST_UserStatus, PMeST_UserType, PMeST_Updated, PMeST_Status, PMeST_Type

#### Sample code

Reference code
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

Void; result via FOnGetChannelMembersResponse.

##### FOnGetChannelMembersResponse

- Result: FPubnubOperationResult
- MembersData: TArray<FPubnubChannelMemberData>&
- PageNext, PagePrev: FString

##### FPubnubChannelMemberData

- User: FPubnubUserData
- Custom: FString
- Status: FString (max 50)
- Type: FString (max 50)
- Updated: FString
- ETag: FString

##### FOnGetChannelMembersResponseNative

- Result: const FPubnubOperationResult&
- MembersData: const TArray<FPubnubChannelMemberData>&
- PageNext, PagePrev: FString

Other examples

Reference code

Get channel members with settings

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get channel members with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Get channel members raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

### Set channel members

Set members in a channel.

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

Parameters
- Channel: FString (required).
- Users: TArray<FPubnubChannelMemberInputData> (required).
- FOnSetChannelMembersResponse: Delegate. Native: FOnSetChannelMembersResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev.

API limits: See /docs/sdks/rest-api/set-user-metadata

#### FPubnubChannelMemberInputData

- User: FString (required)
- Custom: FString
- Status: FString
- Type: FString

#### FOnSetChannelMembersResponse

- Result: FPubnubOperationResult
- MembersData: TArray<FPubnubChannelMemberData>&
- PageNext, PagePrev: FString

#### FOnSetChannelMembersResponseNative

- Result: const FPubnubOperationResult&
- MembersData: const TArray<FPubnubChannelMemberData>&
- PageNext, PagePrev: FString

#### Sample code

Reference code
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

API limits: See /docs/sdks/rest-api/set-channel-members-metadata

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

Other examples

Reference code

Set channel members with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set channel members with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Set channel members raw

Actor.h
```
1
  

```

Actor.cpp
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

Parameters
- Channel: FString (required).
- Users: TArray<FString> (required).
- FOnRemoveChannelMembersResponse: Delegate. Native: FOnRemoveChannelMembersResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev.

#### Sample code

Reference code
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

Void; result via FOnRemoveChannelMembersResponse.

##### FOnRemoveChannelMembersResponse

- Result: FPubnubOperationResult
- MembersData: TArray<FPubnubChannelMemberData>&
- PageNext, PagePrev: FString

##### FOnRemoveChannelMembersResponseNative

- Result: const FPubnubOperationResult&
- MembersData: const TArray<FPubnubChannelMemberData>&
- PageNext, PagePrev: FString

Other examples

Reference code

Remove channel members with result

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove channel members with lambda

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

Remove channel members raw

Actor.h
```
1
  

```

Actor.cpp
```
1
  

```

## Complete example

Reference code

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