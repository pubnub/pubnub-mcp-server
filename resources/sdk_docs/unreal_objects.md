# App Context API for Unreal SDK

App Context provides serverless storage for user and channel metadata and their membership associations. PubNub emits events when object data is set, updated, or removed; setting identical data doesn't trigger events. Use via Blueprints or C++.

In Blueprints, use the Pubnub Subsystem node. In C++, add dependency and access via Game Instance Subsystem.

Add PubnubLibrary dependency in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access the subsystem:

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

Retrieve user metadata in pages (optional custom object).

#### Method(s)

##### Method variants
You can also call the `GetAllUserMetadataRaw` variant of this method which takes String values for `Include` and `Sort` instead of the `FPubnubGetAllInclude` and `FPubnubGetAllSort` structs.

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

- OnGetAllUserMetadataResponse Type: FOnGetAllUserMetadataResponse. Delegate for result. Native lambda callback: FOnGetAllUserMetadataResponseNative.
- Include Type: FPubnubGetAllInclude. Properties to include.
- Limit Type: int. Default/Max 100.
- Filter Type: FString. Filter expression.
- Sort Type: FPubnubGetAllSort. Sort by id, name, updated with asc/desc.
- PageNext Type: FString. Next page cursor.
- PagePrev Type: FString. Previous page cursor. Ignored if PageNext provided.
- Count Type: EPubnubTribool. Include total count (default: not set).

#### FPubnubGetAllInclude

Field | Type | Description
- IncludeCustom | bool | Include Custom object.
- IncludeStatus | bool | Include membership Status field.
- IncludeType | bool | Include membership Type field.
- IncludeTotalCount | bool | Include total count.

#### FPubnubGetAllSort

Field | Type | Description
- GetAllSort | TArray<FPubnubGetAllSingleSort> | Array of sorts (applied in order).

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- UsersData | const TArray<FPubnubUserData>& | User metadata list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor (ignored if pageNext supplied).

##### FPubnubUserData

Field | Type | Description
- UserID | FString | UUID (defaults to current user UUID if not supplied).
- UserName | FString | Display name.
- ExternalID | FString | External system ID.
- ProfileUrl | FString | Profile picture URL.
- Email | FString | Email.
- Custom | FString | Custom JSON (strings, numbers, booleans). Filtering by Custom not supported.
- Status | FString | Max 50 chars.
- Type | FString | Max 50 chars.
- Updated | FString | Last updated timestamp.
- ETag | FString | Content fingerprint.

#### FOnGetAllUserMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- UsersData | const TArray<FPubnubUserData>& | User metadata list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor (ignored if pageNext supplied).

### Get user metadata - UserMetadata entity

Available in entities: UserMetadata

Requires App Context add-on

Retrieve metadata for a user (optional custom).

#### Method(s)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->GetUserMetadata(  
4    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

- OnGetUserMetadataResponse Type: FOnGetUserMetadataResponse. Native: FOnGetUserMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude. Properties to include.

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

Retrieve metadata for a user (optional custom).

#### Method(s)

```
`1PubnubSubsystem->GetUserMetadata(  
2    FString User,   
3    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
4    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
5);  
`
```

- User Type: FString. Metadata ID (non-empty).
- OnGetUserMetadataResponse Type: FOnGetUserMetadataResponse. Native: FOnGetUserMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude.

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- UserData | FPubnubUserData | User metadata.

##### FOnGetUserMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- UserData | const FPubnubUserData& | User metadata.

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

Available in entities: UserMetadata

Requires App Context add-on

Unsupported partial updates of custom metadata
- The custom metadata value overwrites existing server value. To add new custom data iteratively, you must:
1. $1
2. $1
3. $1

Set metadata for a user (optional custom).

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

- UserMetadata Type: FPubnubUserData. Object to create/update.
- FOnSetUserMetadataResponse Type: FOnSetUserMetadataResponse. Native: FOnSetUserMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-user-metadata.

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

Unsupported partial updates of custom metadata
- The custom metadata value overwrites existing server value. To add new custom data iteratively, you must:
1. $1
2. $1
3. $1

Set metadata for a user (optional custom).

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

- User Type: FString. Metadata ID (non-empty).
- UserMetadata Type: FPubnubUserData. Object to create/update.
- FOnSetUserMetadataResponse Type: FOnSetUserMetadataResponse. Native: FOnSetUserMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-user-metadata.

#### FPubnubGetMetadataInclude

Field | Type | Description
- IncludeCustom | bool | Include Custom field.
- IncludeStatus | bool | Include Status field.
- IncludeType | bool | Include Type field.

#### FOnSetUserMetadataResponse

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- UserData | FPubnubUserData | Created/updated user object.

#### FOnSetUserMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- UserData | const FPubnubUserData& | Created/updated user object.

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

Available in entities: UserMetadata

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

- OnRemoveUserMetadataResponse Type: FOnRemoveUserMetadataResponse. Native: FOnRemoveUserMetadataResponseNative.

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

Remove metadata for a user UUID.

#### Method(s)

```
`1PubnubSubsystem->RemoveUserMetadata(  
2    FString User,  
3    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
4);  
`
```

- User Type: FString. Metadata ID (non-empty).
- OnRemoveUserMetadataResponse Type: FOnRemoveUserMetadataResponse. Native: FOnRemoveUserMetadataResponseNative.

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.

##### FOnRemoveUserMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.

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

Retrieve channel metadata in pages (optional custom).

#### Method(s)

##### Method variants
You can also call the `GetAllChannelMetadataRaw` variant of this method which takes String values for `Include` and `Sort` instead of the `FPubnubGetAllInclude` and `FPubnubGetAllSort` structs.

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

- OnGetAllChannelMetadataResponse Type: FOnGetAllChannelMetadataResponse. Native: FOnGetAllChannelMetadataResponseNative.
- Include Type: FPubnubGetAllInclude.
- Limit Type: int. Default/Max 100.
- Filter Type: FString.
- Sort Type: FPubnubGetAllSort.
- PageNext Type: FString.
- PagePrev Type: FString.

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

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- ChannelsData | const TArray<FPubnubChannelData>& | Channel metadata list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor (ignored if pageNext supplied).

##### FPubnubChannelData

Field | Type | Description
- ChannelID | FString | Channel ID.
- ChannelName | FString | Channel name.
- Description | FString | Channel description.
- Custom | FString | Custom JSON (strings, numbers, booleans). Filtering by Custom not supported.
- Status | FString | Max 50 chars.
- Type | FString | Max 50 chars.
- Updated | FString | Last updated timestamp.
- ETag | FString | Version identifier.

##### FOnGetAllChannelMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- ChannelsData | const TArray<FPubnubChannelData>& | Channel metadata list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor (ignored if pageNext supplied).

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

Available in entities: ChannelMetadata

Requires App Context add-on

Retrieve metadata for a channel (optional custom).

#### Method(s)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->GetChannelMetadata(  
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

- OnGetChannelMetadataResponse Type: FOnGetChannelMetadataResponse. Native: FOnGetChannelMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude.

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

Retrieve metadata for a channel (optional custom).

#### Method(s)

```
`1PubnubSubsystem->GetChannelMetadata(  
2    FString Include,   
3    FString Channel,   
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse  
5);  
`
```

- Include Type: FString. Comma-delimited include string (use "" for none).
- Channel Type: FString. Channel ID (non-empty).
- OnGetChannelMetadataResponse Type: FOnGetChannelMetadataResponse. Native: FOnGetChannelMetadataResponseNative.

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- ChannelData | FPubnubChannelData | Channel metadata.

##### FOnGetChannelMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- ChannelData | const FPubnubChannelData& | Channel metadata.

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

Available in entities: ChannelMetadata

Requires App Context add-on

Unsupported partial updates of custom metadata
- The custom metadata value overwrites existing server value. To add new custom data iteratively, you must:
1. $1
2. $1
3. $1

Set metadata for a channel (optional custom).

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

- ChannelMetadata Type: FPubnubChannelData. Object to create/update.
- FOnSetChannelMetadataResponse Type: FOnSetChannelMetadataResponse. Native: FOnSetChannelMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-channel-metadata.

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

Unsupported partial updates of custom metadata
- The custom metadata value overwrites existing server value. To add new custom data iteratively, you must:
1. $1
2. $1
3. $1

Set metadata for a channel (optional custom).

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

- Channel Type: FString. Channel ID (non-empty).
- ChannelMetadata Type: FPubnubChannelData. Object to create/update.
- FOnSetChannelMetadataResponse Type: FOnSetChannelMetadataResponse. Native: FOnSetChannelMetadataResponseNative.
- Include Type: FPubnubGetMetadataInclude.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-channel-metadata.

#### FOnSetChannelMetadataResponse

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- ChannelData | FPubnubChannelData | Created/updated channel object.

#### FOnSetChannelMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- ChannelData | const FPubnubChannelData& | Created/updated channel object.

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

Available in entities: ChannelMetadata

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

- OnRemoveChannelMetadataResponse Type: FOnRemoveChannelMetadataResponse. Native: FOnRemoveChannelMetadataResponseNative.

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

Remove metadata for a channel.

#### Method(s)

```
`1PubnubSubsystem->RemoveChannelMetadata(  
2    FString Channel,   
3    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
4);  
`
```

- Channel Type: FString. Channel ID (non-empty).
- OnRemoveChannelMetadataResponse Type: FOnRemoveChannelMetadataResponse. Native: FOnRemoveChannelMetadataResponseNative.

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.

##### FOnRemoveChannelMetadataResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.

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

List of channel memberships for a user (not subscriptions).

#### Method(s)

##### Method variants
You can also call the `GetMembershipsRaw` variant of this method which takes String values for `Include` and `Sort` instead of the `FPubnubMembershipInclude` and `FPubnubMembershipSort` structs.

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

- User Type: FString. User UUID.
- OnGetMembershipsResponse Type: FOnGetMembershipsResponse. Native: FOnGetMembershipsResponseNative.
- Include Type: FPubnubMembershipInclude.
- Limit Type: int. Default/Max 100.
- Filter Type: FString.
- Sort Type: FPubnubMembershipSort.
- PageNext Type: FString.
- PagePrev Type: FString.

#### FPubnubMembershipInclude

Field Name | Type | Default | Description
- IncludeCustom | bool | false | Include membership Custom.
- IncludeStatus | bool | false | Include membership Status.
- IncludeType | bool | false | Include membership Type.
- IncludeChannel | bool | false | Include Channel data (FPubnubChannelData).
- IncludeChannelCustom | bool | false | Include Channel Custom.
- IncludeChannelStatus | bool | false | Include Channel Status.
- IncludeChannelType | bool | false | Include Channel Type.
- IncludeTotalCount | bool | false | Include total count.

#### FPubnubMembershipSort

Field Name | Type | Description
- MembershipSort | TArray<FPubnubMembershipSingleSort> | Sort criteria, applied in order.

#### FPubnubMembershipSingleSort

Field Name | Type | Default | Description
- SortType | EPubnubMembershipSortType | EPubnubMembershipSortType::PMST_ChannelID | Field to sort by.
- SortOrder | bool | false | Ascending when false, descending when true.

#### EPubnubMembershipSortType

- PMST_ChannelID (ChannelID): Sort by Channel ID
- PMST_ChannelName (ChannelName): Sort by Channel Name
- PMST_ChannelUpdated (ChannelUpdated): Sort by Channel last update
- PMST_ChannelStatus (ChannelStatus): Sort by Channel Status
- PMST_ChannelType (ChannelType): Sort by Channel Type
- PMST_Updated (Updated): Sort by Membership update timestamp
- PMST_Status (Status): Sort by Membership status
- PMST_Type (Type): Sort by Membership type

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

Field | Type | Description
- MembershipsData | TArray<FPubnubMembershipData>& | Membership list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor (ignored if pageNext supplied).

##### FPubnubMembershipData

Field | Type | Description
- Channel | FPubnubChannelData | Channel metadata.
- Custom | FString | Custom JSON (strings, numbers, booleans). Filtering by Custom not supported.
- Status | FString | Max 50 chars.
- Type | FString | Max 50 chars.
- Updated | FString | Last update timestamp.
- ETag | FString | Version identifier.

##### FOnGetMembershipsResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- MembershipsData | const TArray<FPubnubMembershipData>& | Membership list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

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

Set channel memberships for a user.

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

- User Type: FString. User UUID (non-empty).
- Channels Type: TArray<FPubnubMembershipInputData>. Memberships to add/update (non-empty).
- FOnSetMembershipsResponse Type: FOnSetMembershipsResponse. Native: FOnSetMembershipsResponseNative.
- Include Type: FPubnubMembershipInclude.
- Limit Type: int.
- Filter Type: FString.
- Sort Type: FPubnubMembershipSort.
- PageNext Type: FString.
- PagePrev Type: FString.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-user-metadata.

#### FPubnubMembershipInputData

Field | Type | Description
- Channel | FString | Channel ID (non-empty).
- Custom | FString | Custom data.
- Status | FString | Membership status.
- Type | FString | Membership type.

#### FOnSetMembershipsResponse

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- MembershipsData | TArray<FPubnubMembershipData>& | Membership list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

#### FOnSetMembershipsResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- MembershipsData | const TArray<FPubnubMembershipData>& | Membership list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

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

##### API limits
See REST API docs: /docs/sdks/rest-api/set-membership-metadata.

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

- User Type: FString. User UUID (non-empty).
- Channels Type: TArray<FString>. Channel IDs to remove (non-empty).
- FOnRemoveMembershipsResponse Type: FOnRemoveMembershipsResponse. Native: FOnRemoveMembershipsResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev as above.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-user-metadata.

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- MembershipsData | TArray<FPubnubMembershipData>& | Membership list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

##### FOnRemoveMembershipsResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- MembershipsData | const TArray<FPubnubMembershipData>& | Membership list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

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

List of members in a channel (includes user metadata if stored).

#### Method(s)

##### Method variants
You can also call the `GetChannelMembersRaw` variant of this method which takes String values for `Include`, and `Sort` instead of the `FPubnubMemberInclude` and `FPubnubMemberSort` structs.

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

- Channel Type: FString. Channel ID.
- OnGetChannelMembersResponse Type: FOnGetChannelMembersResponse. Native: FOnGetChannelMembersResponseNative.
- Include Type: FPubnubMemberInclude.
- Limit Type: int. Default/Max 100.
- Filter Type: FString.
- Sort Type: FPubnubMemberSort.
- PageNext Type: FString.
- PagePrev Type: FString.

#### FPubnubMemberInclude

Field Name | Type | Default | Description
- IncludeCustom | bool | false | Include member Custom.
- IncludeStatus | bool | false | Include member Status.
- IncludeType | bool | false | Include member Type.
- IncludeUUID | bool | false | Include user data.
- IncludeUUIDCustom | bool | false | Include user Custom.
- IncludeUUIDStatus | bool | false | Include user Status.
- IncludeUUIDType | bool | false | Include user Type.
- IncludeTotalCount | bool | false | Include total count.

#### FPubnubMemberSort

Field Name | Type | Description
- MemberSort | TArray<FPubnubMemberSingleSort> | Sort criteria, applied in order.

#### FPubnubMemberSingleSort

Field Name | Type | Default | Description
- SortType | EPubnubMemberSortType | EPubnubMemberSortType::PMeST_UserID | Field to sort by.
- SortOrder | bool | false | Ascending when false, descending when true.

#### EPubnubMemberSortType

- PMeST_UserID (UserID): Sort by user ID
- PMeST_UserName (UserName): Sort by user name
- PMeST_UserUpdated (UserUpdated): Sort by user update timestamp
- PMeST_UserStatus (UserStatus): Sort by user status
- PMeST_UserType (UserType): Sort by user type
- PMeST_Updated (Updated): Sort by member update timestamp
- PMeST_Status (Status): Sort by member status
- PMeST_Type (Type): Sort by member type

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- MembersData | TArray<FPubnubChannelMemberData>& | Member list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

##### FPubnubChannelMemberData

Field | Type | Description
- User | FPubnubUserData | User metadata.
- Custom | FString | Custom JSON (strings, numbers, booleans). Filtering by Custom not supported.
- Status | FString | Max 50 chars.
- Type | FString | Max 50 chars.
- Updated | FString | Last update timestamp.
- ETag | FString | Version identifier.

##### FOnGetChannelMembersResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- MembersData | const TArray<FPubnubChannelMemberData>& | Member list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

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

- Channel Type: FString. Channel ID (non-empty).
- Users Type: TArray<FPubnubChannelMemberInputData>. Members to add/update (non-empty).
- FOnSetChannelMembersResponse Type: FOnSetChannelMembersResponse. Native: FOnSetChannelMembersResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev as above.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-user-metadata.

#### FPubnubChannelMemberInputData

Field | Type | Description
- User | FString | User UUID (non-empty).
- Custom | FString | Custom data.
- Status | FString | Membership status.
- Type | FString | Membership type.

#### FOnSetChannelMembersResponse

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- MembersData | TArray<FPubnubChannelMemberData>& | Member list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

#### FOnSetChannelMembersResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- MembersData | const TArray<FPubnubChannelMemberData>& | Member list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

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

##### API limits
See REST API docs: /docs/sdks/rest-api/set-channel-members-metadata.

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

- Channel Type: FString. Channel ID (non-empty).
- Users Type: TArray<FString>. User UUIDs (non-empty).
- FOnRemoveChannelMembersResponse Type: FOnRemoveChannelMembersResponse. Native: FOnRemoveChannelMembersResponseNative.
- Include, Limit, Filter, Sort, PageNext, PagePrev as above.

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

Field | Type | Description
- Result | FPubnubOperationResult | Operation result.
- MembersData | TArray<FPubnubChannelMemberData>& | Member list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

##### FOnRemoveChannelMembersResponseNative

Field | Type | Description
- Result | const FPubnubOperationResult& | Operation result.
- MembersData | const TArray<FPubnubChannelMemberData>& | Member list.
- PageNext | FString | Next page cursor.
- PagePrev | FString | Previous page cursor.

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