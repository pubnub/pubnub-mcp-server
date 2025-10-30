# App Context API for Unreal SDK

App Context provides serverless storage for user and channel metadata and their membership associations. Events are triggered when object data is created, updated, or removed. Clients can receive these events in real time. No event is triggered if you set identical data.

You can use the SDK via Blueprints or in C++.

- In Blueprints, use the Pubnub Subsystem node.
- In C++, add dependency to PubnubLibrary, compile, and use the Game Instance Subsystem.

Add C++ dependency in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access subsystem in C++:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Call SDK functions, for example:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

## User[​](#user)

### Get metadata for all users[​](#get-metadata-for-all-users)

Retrieve user metadata in pages. Includes Custom if requested.

#### Method(s)[​](#methods)

##### Method variants

You can also call the `GetAllUserMetadataRaw` variant which takes String values for Include and Sort instead of FPubnubGetAllInclude and FPubnubGetAllSort.

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

- OnGetAllUserMetadataResponse Type: FOnGetAllUserMetadataResponse. Delegate for result. You can also use FOnGetAllUserMetadataResponseNative (lambda).
- Include Type: FPubnubGetAllInclude. Properties to include in response.
- Limit Type: int. Number of objects (Default/Max: 100).
- Filter Type: FString. Filter expression.
- Sort Type: FPubnubGetAllSort. Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- PageNext Type: FString. Cursor for next page.
- PagePrev Type: FString. Cursor for previous page (ignored if PageNext provided).
- Count Type: EPubnubTribool. Whether to include total count.

#### FPubnubGetAllInclude[​](#fpubnubgetallinclude)

FieldTypeDescription`IncludeCustom``bool`Whether to include the Custom object in the response.`IncludeStatus``bool`Whether to include the membership Status field.`IncludeType``bool`Whether to include the membership Type field.`IncludeTotalCount``bool`Whether to include the total count.

#### FPubnubGetAllSort[​](#fpubnubgetallsort)

FieldTypeDescription`GetAllSort``TArray<FPubnubGetAllSingleSort>`Array of sorts for Membership related function. The order matters, sorts will be applied from the first index to the last.

#### Sample code[​](#sample-code)

- C++
- Blueprint

#### Actor.h[​](#actorh)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp)
  

```
1
  

```

##### Other examples[​](#other-examples)

###### Get metadata for all users with additional settings[​](#get-metadata-for-all-users-with-additional-settings)

###### Actor.h[​](#actorh-1)

```
1
  

```

###### Actor.cpp[​](#actorcpp-1)

```
1
  

```

###### Get metadata for all users with all includes[​](#get-metadata-for-all-users-with-all-includes)

###### Actor.h[​](#actorh-2)

```
1
  

```

###### Actor.cpp[​](#actorcpp-2)

```
1
  

```

###### Get metadata for all users with lambda[​](#get-metadata-for-all-users-with-lambda)

###### Actor.h[​](#actorh-3)

```
1
  

```

###### Actor.cpp[​](#actorcpp-3)

```
1
  

```

###### Get metadata for all users raw[​](#get-metadata-for-all-users-raw)

###### Actor.h[​](#actorh-4)

```
1
  

```

###### Actor.cpp[​](#actorcpp-4)

```
1
  

```

#### Returns[​](#returns)

Void. Delegate returns FOnGetAllUserMetadataResponse.

##### FOnGetAllUserMetadataResponse[​](#fongetallusermetadataresponse)

  

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`UsersData`[`const TArray<FPubnubUserData>&`](#fpubnubuserdata)Aa array of [`FPubnubUserData`](#fpubnubuserdata) structs which are the users with their associated User metadata.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubUserData[​](#fpubnubuserdata)

  

FieldTypeDescription`UserID``FString`UUID. If not supplied, the current user's UUID is used.`UserName``FString`Display name for the user.`ExternalID``FString`User's identifier in an external system.`ProfileUrl``FString`The URL of the user's profile picture.`Email``FString`The user's email address.`Custom``FString`Custom JSON values. Can be strings, numbers, or booleans. Filtering by Custom isn’t supported.`Status``FString`User status. Max. 50 characters.`Type``FString`User type. Max. 50 characters.`Updated``FString`The date when the user's metadata was last updated.`ETag``FString`Information on the object's content fingerprint.

#### FOnGetAllUserMetadataResponseNative[​](#fongetallusermetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`UsersData`[`const TArray<FPubnubUserData>&`](#fpubnubuserdata)Aa array of [`FPubnubUserData`](#fpubnubuserdata) structs which are the users with their associated User metadata.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

### Get user metadata - UserMetadata entity[​](#get-user-metadata---usermetadata-entity)

Available in entities: UserMetadata. Requires App Context add-on.

Retrieve metadata for a user. Include Custom if needed.

#### Method(s)[​](#methods-1)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->GetUserMetadata(  
4    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

- OnGetUserMetadataResponse Type: FOnGetUserMetadataResponse. Delegate for result. You can also use FOnGetUserMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude. Properties to include.

#### Sample code[​](#sample-code-1)

- C++

#### Actor.h[​](#actorh-5)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-5)
  

```
1
  

```

#### Returns[​](#returns-1)

Void. Delegate returns FOnGetUserMetadataResponse.

#### Other examples[​](#other-examples-1)

##### Get user metadata with lambda[​](#get-user-metadata-with-lambda)

###### Actor.h[​](#actorh-6)

```
1
  

```

###### Actor.cpp[​](#actorcpp-6)

```
1
  

```

### Get user metadata - PubNub client[​](#get-user-metadata---pubnub-client)

Retrieve metadata for a user. Include Custom if needed.

#### Method(s)[​](#methods-2)

```
`1PubnubSubsystem->GetUserMetadata(  
2    FString User,   
3    FOnGetUserMetadataResponse OnGetUserMetadataResponse,  
4    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
5);  
`
```

- User Type: FString. Metadata ID to retrieve (required).
- OnGetUserMetadataResponse Type: FOnGetUserMetadataResponse. Delegate for result. You can also use FOnGetUserMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude.

#### Sample code[​](#sample-code-2)

- C++
- Blueprint

#### Actor.h[​](#actorh-7)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-7)
  

```
1
  

```

#### Returns[​](#returns-2)

Void. Delegate returns FOnGetUserMetadataResponse.

##### FOnGetUserMetadataResponse[​](#fongetusermetadataresponse)

  

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`UserData`[`FPubnubUserData`](#fpubnubuserdata)Aa instance of [`FPubnubUserData`](#fpubnubuserdata) struct which is the user with their associated User metadata.

##### FOnGetUserMetadataResponseNative[​](#fongetusermetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`UserData`[`const FPubnubUserData&`](#fpubnubuserdata)Aa instance of [`FPubnubUserData`](#fpubnubuserdata) struct which is the user with their associated User metadata.

#### Other examples[​](#other-examples-2)

##### Get metadata for a user with all includes[​](#get-metadata-for-a-user-with-all-includes)

###### Actor.h[​](#actorh-8)

```
1
  

```

###### Actor.cpp[​](#actorcpp-8)

```
1
  

```

##### Get metadata for a user with lambda[​](#get-metadata-for-a-user-with-lambda)

###### Actor.h[​](#actorh-9)

```
1
  

```

###### Actor.cpp[​](#actorcpp-9)

```
1
  

```

##### Get metadata for a user raw[​](#get-metadata-for-a-user-raw)

###### Actor.h[​](#actorh-10)

```
1
  

```

###### Actor.cpp[​](#actorcpp-10)

```
1
  

```

##### Set user metadata with additional settings[​](#set-user-metadata-with-additional-settings)

###### Actor.h[​](#actorh-11)

```
1
  

```

###### Actor.cpp[​](#actorcpp-11)

```
1
  

```

##### Set user metadata with result struct[​](#set-user-metadata-with-result-struct)

###### Actor.h[​](#actorh-12)

```
1
  

```

###### Actor.cpp[​](#actorcpp-12)

```
1
  

```

##### Remove user metadata with result struct[​](#remove-user-metadata-with-result-struct)

###### Actor.h[​](#actorh-13)

```
1
  

```

###### Actor.cpp[​](#actorcpp-13)

```
1
  

```

### Set user metadata - UserMetadata entity[​](#set-user-metadata---usermetadata-entity)

Available in entities: UserMetadata. Requires App Context add-on.

Unsupported partial updates of custom metadata
- The custom metadata value always overwrites the stored value. To add new custom data to existing:
1. $1
2. $1
3. $1

Set user metadata. Optionally include Custom.

#### Method(s)[​](#methods-3)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->SetUserMetadata(  
4    FPubnubUserData UserMetadata,  
5    FOnSetUserMetadataResponse OnSetUserMetadataResponse,  
6    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
7);  

```

- UserMetadata Type: FPubnubUserData. The user metadata object to create.
- FOnSetUserMetadataResponse Type: FOnSetUserMetadataResponse. Delegate for result. You can also use FOnSetUserMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### Sample code[​](#sample-code-3)

- C++

#### Actor.h[​](#actorh-14)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-14)
  

```
1
  

```

#### Returns[​](#returns-3)

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

#### Other examples[​](#other-examples-3)

##### Set user metadata with result[​](#set-user-metadata-with-result)

###### Actor.h[​](#actorh-15)

```
1
  

```

###### Actor.cpp[​](#actorcpp-15)

```
1
  

```

##### Set user metadata with lambda[​](#set-user-metadata-with-lambda)

###### Actor.h[​](#actorh-16)

```
1
  

```

###### Actor.cpp[​](#actorcpp-16)

```
1
  

```

### Set user metadata - PubNub client[​](#set-user-metadata---pubnub-client)

Unsupported partial updates of custom metadata
- The custom metadata value always overwrites the stored value. To add new custom data to existing:
1. $1
2. $1
3. $1

Set user metadata. Optionally include Custom.

#### Method(s)[​](#methods-4)

```
`1PubnubSubsystem->SetUserMetadata(  
2    FString User,    
3    FPubnubUserData UserMetadata,  
4    FOnSetUserMetadataResponse OnSetUserMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  
`
```

- User Type: FString. Metadata ID (required).
- UserMetadata Type: FPubnubUserData.
- FOnSetUserMetadataResponse Type: FOnSetUserMetadataResponse. Delegate for result. You can also use FOnSetUserMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### FPubnubGetMetadataInclude[​](#fpubnubgetmetadatainclude)

FieldTypeDescription`IncludeCustom``bool`Whether to include the object's Custom field.`IncludeStatus``bool`Whether to include the object's Status field.`IncludeType``bool`Whether to include the object's Type field.

#### FOnSetUserMetadataResponse[​](#fonsetusermetadataresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`UserData`[`FPubnubUserData`](#fpubnubuserdata)The user metadata object that was created.

#### FOnSetUserMetadataResponseNative[​](#fonsetusermetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`UserData`[`const FPubnubUserData&`](#fpubnubuserdata)The user metadata object that was created.

#### Sample code[​](#sample-code-4)

- C++
- Blueprint

#### Actor.h[​](#actorh-17)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-17)
  

```
1
  

```

#### Returns[​](#returns-4)

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

#### Other examples[​](#other-examples-4)

##### Set metadata for a user with result[​](#set-metadata-for-a-user-with-result)

###### Actor.h[​](#actorh-18)

```
1
  

```

###### Actor.cpp[​](#actorcpp-18)

```
1
  

```

##### Set metadata for a user with lambda[​](#set-metadata-for-a-user-with-lambda)

###### Actor.h[​](#actorh-19)

```
1
  

```

###### Actor.cpp[​](#actorcpp-19)

```
1
  

```

##### Set metadata for a user raw[​](#set-metadata-for-a-user-raw)

###### Actor.h[​](#actorh-20)

```
1
  

```

###### Actor.cpp[​](#actorcpp-20)

```
1
  

```

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

###### Actor.h[​](#actorh-21)

```
1
  

```

###### Actor.cpp[​](#actorcpp-21)

```
1
  

```

### Remove user metadata - UserMetadata entity[​](#remove-user-metadata---usermetadata-entity)

Available in entities: UserMetadata. Requires App Context add-on.

Remove metadata for a user UUID.

#### Method(s)[​](#methods-5)

```
1UPubnubUserMetadataEntity* UserMetadataEntity = PubnubSubsystem->CreateUserMetadataEntity("user-id");  
2
  
3UserMetadataEntity->RemoveUserMetadata(  
4    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
5);  

```

- OnRemoveUserMetadataResponse Type: FOnRemoveUserMetadataResponse. Delegate for result. You can also use FOnRemoveUserMetadataResponseNative (lambda).

#### Sample code[​](#sample-code-5)

- C++

#### Actor.h[​](#actorh-22)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-22)
  

```
1
  

```

#### Returns[​](#returns-5)

Void. Delegate returns FOnRemoveUserMetadataResponse.

#### Other examples[​](#other-examples-5)

##### Remove user metadata with result[​](#remove-user-metadata-with-result)

###### Actor.h[​](#actorh-23)

```
1
  

```

###### Actor.cpp[​](#actorcpp-23)

```
1
  

```

##### Remove user metadata with lambda[​](#remove-user-metadata-with-lambda)

###### Actor.h[​](#actorh-24)

```
1
  

```

###### Actor.cpp[​](#actorcpp-24)

```
1
  

```

### Remove user metadata - PubNub client[​](#remove-user-metadata---pubnub-client)

Remove metadata for a user UUID.

#### Method(s)[​](#methods-6)

```
`1PubnubSubsystem->RemoveUserMetadata(  
2    FString User,  
3    FOnRemoveUserMetadataResponse OnRemoveUserMetadataResponse  
4);  
`
```

- User Type: FString. Metadata ID to delete (required).
- OnRemoveUserMetadataResponse Type: FOnRemoveUserMetadataResponse. Delegate for result. You can also use FOnRemoveUserMetadataResponseNative (lambda).

#### Sample code[​](#sample-code-6)

- C++
- Blueprint

#### Actor.h[​](#actorh-25)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-25)
  

```
1
  

```

#### Returns[​](#returns-6)

Void. Delegate returns FOnRemoveUserMetadataResponse.

##### FOnRemoveUserMetadataResponse[​](#fonremoveusermetadataresponse)

  

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.

##### FOnRemoveUserMetadataResponseNative[​](#fonremoveusermetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.

#### Other examples[​](#other-examples-6)

##### Remove metadata for a user with result[​](#remove-metadata-for-a-user-with-result)

###### Actor.h[​](#actorh-26)

```
1
  

```

###### Actor.cpp[​](#actorcpp-26)

```
1
  

```

##### Remove metadata for a user with lambda[​](#remove-metadata-for-a-user-with-lambda)

###### Actor.h[​](#actorh-27)

```
1
  

```

###### Actor.cpp[​](#actorcpp-27)

```
1
  

```

## Channel[​](#channel)

### Get metadata for all channels[​](#get-metadata-for-all-channels)

Retrieve channel metadata in pages. Includes Custom if requested.

#### Method(s)[​](#methods-7)

##### Method variants

You can also call the `GetAllChannelMetadataRaw` variant which takes String values for Include and Sort instead of FPubnubGetAllInclude and FPubnubGetAllSort.

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

- OnGetAllChannelMetadataResponse Type: FOnGetAllChannelMetadataResponse. Delegate for result. You can also use FOnGetAllChannelMetadataResponseNative (lambda).
- Include Type: FPubnubGetAllInclude.
- Limit Type: int (Default/Max: 100).
- Filter Type: FString.
- Sort Type: FPubnubGetAllSort.
- PageNext Type: FString.
- PagePrev Type: FString.

#### Sample code[​](#sample-code-7)

- C++
- Blueprint

#### Actor.h[​](#actorh-28)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-28)
  

```
1
  

```

#### Returns[​](#returns-7)

Void. Delegate returns FOnGetAllChannelMetadataResponse.

##### FOnGetAllChannelMetadataResponse[​](#fongetallchannelmetadataresponse)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`ChannelsData`[`const TArray<FPubnubChannelData>&`](#fpubnubchanneldata)Aa array of [`FPubnubChannelData`](#fpubnubchanneldata) structs which are the users with their associated Channel metadata.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubChannelData[​](#fpubnubchanneldata)

FieldTypeDescription`ChannelID``FString`ID of the channel.`ChannelName``FString`Name of the channel.`Description``FString`Additional description of the channel.`Custom``FString`Custom JSON values. Can be strings, numbers, or booleans. Filtering by Custom isn’t supported.`Status``FString`Channel status. Max 50 characters.`Type``FString`Channel type. Max 50 characters.`Updated``FString`The date when the channel's metadata was last updated.`ETag``FString`Version identifier of the user's metadata.

##### FOnGetAllChannelMetadataResponseNative[​](#fongetallchannelmetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`ChannelsData`[`const TArray<FPubnubChannelData>&`](#fpubnubchanneldata)Aa array of [`FPubnubChannelData`](#fpubnubchanneldata) structs which are the users with their associated Channel metadata.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Other examples[​](#other-examples-7)

##### Get metadata for all channels with settings[​](#get-metadata-for-all-channels-with-settings)

###### Actor.h[​](#actorh-29)

```
1
  

```

###### Actor.cpp[​](#actorcpp-29)

```
1
  

```

##### Get metadata for all channels with all includes[​](#get-metadata-for-all-channels-with-all-includes)

###### Actor.h[​](#actorh-30)

```
1
  

```

###### Actor.cpp[​](#actorcpp-30)

```
1
  

```

##### Get metadata for all channels with lambda[​](#get-metadata-for-all-channels-with-lambda)

###### Actor.h[​](#actorh-31)

```
1
  

```

###### Actor.cpp[​](#actorcpp-31)

```
1
  

```

##### Get metadata for all channels raw[​](#get-metadata-for-all-channels-raw)

###### Actor.h[​](#actorh-32)

```
1
  

```

###### Actor.cpp[​](#actorcpp-32)

```
1
  

```

### Get channel metadata - ChannelMetadata entity[​](#get-channel-metadata---channelmetadata-entity)

Available in entities: ChannelMetadata. Requires App Context add-on.

Retrieve metadata for a channel. Include Custom if needed.

#### Method(s)[​](#methods-8)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->GetChannelMetadata(  
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse,  
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  

```

- OnGetChannelMetadataResponse Type: FOnGetChannelMetadataResponse. Delegate for result. You can also use FOnGetChannelMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude.

#### Sample code[​](#sample-code-8)

- C++

#### Actor.h[​](#actorh-33)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-33)
  

```
1
  

```

#### Returns[​](#returns-8)

Void. Delegate returns FOnGetChannelMetadataResponse.

#### Other examples[​](#other-examples-8)

##### Get channel metadata with lambda[​](#get-channel-metadata-with-lambda)

###### Actor.h[​](#actorh-34)

```
1
  

```

###### Actor.cpp[​](#actorcpp-34)

```
1
  

```

### Get channel metadata - PubNub client[​](#get-channel-metadata---pubnub-client)

Retrieve metadata for a channel. Include Custom if needed.

#### Method(s)[​](#methods-9)

```
`1PubnubSubsystem->GetChannelMetadata(  
2    FString Include,   
3    FString Channel,   
4    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse  
5);  
`
```

- Include Type: FString. Comma-delimited list of attributes to include. Use "" to include none.
- Channel Type: FString. Channel ID (required).
- OnGetChannelMetadataResponse Type: FOnGetChannelMetadataResponse. Delegate for result. You can also use FOnGetChannelMetadataResponseNative (lambda).

#### Sample code[​](#sample-code-9)

- C++
- Blueprint

#### Actor.h[​](#actorh-35)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-35)
  

```
1
  

```

#### Returns[​](#returns-9)

Void. Delegate returns FOnGetChannelMetadataResponse.

##### FOnGetChannelMetadataResponse[​](#fongetchannelmetadataresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`ChannelData`[`FPubnubChannelData`](#fpubnubchanneldata)Aa instance of [`FPubnubChannelData`](#fpubnubchanneldata) struct which is the channel with its associated metadata.

##### FOnGetChannelMetadataResponseNative[​](#fongetchannelmetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`ChannelData`[`const FPubnubChannelData&`](#fpubnubchanneldata)Aa instance of [`FPubnubChannelData`](#fpubnubchanneldata) struct which is the channel with its associated metadata.

#### Other examples[​](#other-examples-9)

##### Get metadata for a channel with all includes[​](#get-metadata-for-a-channel-with-all-includes)

###### Actor.h[​](#actorh-36)

```
1
  

```

###### Actor.cpp[​](#actorcpp-36)

```
1
  

```

##### Get metadata for a channel with lambda[​](#get-metadata-for-a-channel-with-lambda)

###### Actor.h[​](#actorh-37)

```
1
  

```

###### Actor.cpp[​](#actorcpp-37)

```
1
  

```

##### Get metadata for a channel raw[​](#get-metadata-for-a-channel-raw)

###### Actor.h[​](#actorh-38)

```
1
  

```

###### Actor.cpp[​](#actorcpp-38)

```
1
  

```

##### Set channel metadata with additional settings[​](#set-channel-metadata-with-additional-settings)

###### Actor.h[​](#actorh-39)

```
1
  

```

###### Actor.cpp[​](#actorcpp-39)

```
1
  

```

##### Set channel metadata with result struct[​](#set-channel-metadata-with-result-struct)

###### Actor.h[​](#actorh-40)

```
1
  

```

###### Actor.cpp[​](#actorcpp-40)

```
1
  

```

##### Remove channel metadata with result struct[​](#remove-channel-metadata-with-result-struct)

###### Actor.h[​](#actorh-41)

```
1
  

```

###### Actor.cpp[​](#actorcpp-41)

```
1
  

```

### Set channel metadata - ChannelMetadata entity[​](#set-channel-metadata---channelmetadata-entity)

Available in entities: ChannelMetadata. Requires App Context add-on.

Unsupported partial updates of custom metadata
- The custom metadata value always overwrites the stored value. To add new custom data to existing:
1. $1
2. $1
3. $1

Set channel metadata. Optionally include Custom.

#### Method(s)[​](#methods-10)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->SetChannelMetadata(  
4    FPubnubChannelData ChannelMetadata,   
5    FOnSetChannelMetadataResponse OnSetChannelMetadataResponse,   
6    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
7);  

```

- ChannelMetadata Type: FPubnubChannelData.
- FOnSetChannelMetadataResponse Type: FOnSetChannelMetadataResponse. Delegate for result. You can also use FOnSetChannelMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-channel-metadata

#### Sample code[​](#sample-code-10)

- C++

#### Actor.h[​](#actorh-42)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-42)
  

```
1
  

```

#### Returns[​](#returns-10)

```
`1{  
2    "Channel": "my-channel",  
3    "Name": "PubNub channel",  
4    "Description": "The channel for announcements",  
5    "Updated": "2020-06-17T16:52:19.562469Z"  
6}  
`
```

#### Other examples[​](#other-examples-10)

##### Set channel metadata with result[​](#set-channel-metadata-with-result)

###### Actor.h[​](#actorh-43)

```
1
  

```

###### Actor.cpp[​](#actorcpp-43)

```
1
  

```

##### Set channel metadata with lambda[​](#set-channel-metadata-with-lambda)

###### Actor.h[​](#actorh-44)

```
1
  

```

###### Actor.cpp[​](#actorcpp-44)

```
1
  

```

### Set channel metadata - PubNub client[​](#set-channel-metadata---pubnub-client)

Unsupported partial updates of custom metadata
- The custom metadata value always overwrites the stored value. To add new custom data to existing:
1. $1
2. $1
3. $1

Set channel metadata. Optionally include Custom.

#### Method(s)[​](#methods-11)

```
`1PubnubSubsystem->SetChannelMetadata(  
2    FString Channel,   
3    FPubnubChannelData ChannelMetadata,   
4    FOnSetChannelMetadataResponse OnSetChannelMetadataResponse,   
5    FPubnubGetMetadataInclude Include = FPubnubGetMetadataInclude()  
6);  
`
```

- Channel Type: FString. Channel ID (required).
- ChannelMetadata Type: FPubnubChannelData.
- FOnSetChannelMetadataResponse Type: FOnSetChannelMetadataResponse. Delegate for result. You can also use FOnSetChannelMetadataResponseNative (lambda).
- Include Type: FPubnubGetMetadataInclude.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-channel-metadata

#### FOnSetChannelMetadataResponse[​](#fonsetchannelmetadataresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`ChannelData`[`FPubnubChannelData`](#fpubnubchanneldata)The channel metadata object that was created.

#### FOnSetChannelMetadataResponseNative[​](#fonsetchannelmetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`ChannelData`[`const FPubnubChannelData&`](#fpubnubchanneldata)The channel metadata object that was created.

#### Sample code[​](#sample-code-11)

- C++
- Blueprint

#### Actor.h[​](#actorh-45)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-45)
  

```
1
  

```

#### Returns[​](#returns-11)

```
`1{  
2    "Channel": "my-channel",  
3    "Name": "PubNub channel",  
4    "Description": "The channel for announcements",  
5    "Updated": "2020-06-17T16:52:19.562469Z"  
6}  
`
```

#### Other examples[​](#other-examples-11)

##### Set metadata for a channel with result[​](#set-metadata-for-a-channel-with-result)

###### Actor.h[​](#actorh-46)

```
1
  

```

###### Actor.cpp[​](#actorcpp-46)

```
1
  

```

##### Set metadata for a channel with lambda[​](#set-metadata-for-a-channel-with-lambda)

###### Actor.h[​](#actorh-47)

```
1
  

```

###### Actor.cpp[​](#actorcpp-47)

```
1
  

```

##### Set metadata for a channel raw[​](#set-metadata-for-a-channel-raw)

###### Actor.h[​](#actorh-48)

```
1
  

```

###### Actor.cpp[​](#actorcpp-48)

```
1
  

```

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata-1)

###### Actor.h[​](#actorh-49)

```
1
  

```

###### Actor.cpp[​](#actorcpp-49)

```
1
  

```

### Remove channel metadata - ChannelMetadata entity[​](#remove-channel-metadata---channelmetadata-entity)

Available in entities: ChannelMetadata. Requires App Context add-on.

Remove metadata for a channel.

#### Method(s)[​](#methods-12)

```
1UPubnubChannelMetadataEntity* ChannelMetadataEntity = PubnubSubsystem->CreateChannelMetadataEntity("channel-id");  
2
  
3ChannelMetadataEntity->RemoveChannelMetadata(  
4    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
5);  

```

- OnRemoveChannelMetadataResponse Type: FOnRemoveChannelMetadataResponse. Delegate for result. You can also use FOnRemoveChannelMetadataResponseNative (lambda).

#### Sample code[​](#sample-code-12)

- C++

#### Actor.h[​](#actorh-50)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-50)
  

```
1
  

```

#### Returns[​](#returns-12)

Void. Delegate returns FOnRemoveChannelMetadataResponse.

#### Other examples[​](#other-examples-12)

##### Remove channel metadata with result[​](#remove-channel-metadata-with-result)

###### Actor.h[​](#actorh-51)

```
1
  

```

###### Actor.cpp[​](#actorcpp-51)

```
1
  

```

##### Remove channel metadata with lambda[​](#remove-channel-metadata-with-lambda)

###### Actor.h[​](#actorh-52)

```
1
  

```

###### Actor.cpp[​](#actorcpp-52)

```
1
  

```

### Remove channel metadata - PubNub client[​](#remove-channel-metadata---pubnub-client)

Remove metadata for a channel.

#### Method(s)[​](#methods-13)

```
`1PubnubSubsystem->RemoveChannelMetadata(  
2    FString Channel,   
3    FOnRemoveChannelMetadataResponse OnRemoveChannelMetadataResponse  
4);  
`
```

- Channel Type: FString. Metadata ID to delete (required).
- OnRemoveChannelMetadataResponse Type: FOnRemoveChannelMetadataResponse. Delegate for result. You can also use FOnRemoveChannelMetadataResponseNative (lambda).

#### Sample code[​](#sample-code-13)

- C++
- Blueprint

#### Actor.h[​](#actorh-53)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-53)
  

```
1
  

```

#### Returns[​](#returns-13)

Void. Delegate returns FOnRemoveChannelMetadataResponse.

##### FOnRemoveChannelMetadataResponse[​](#fonremovechannelmetadataresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.

##### FOnRemoveChannelMetadataResponseNative[​](#fonremovechannelmetadataresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.

#### Other examples[​](#other-examples-13)

##### Remove metadata for a channel with result[​](#remove-metadata-for-a-channel-with-result)

###### Actor.h[​](#actorh-54)

```
1
  

```

###### Actor.cpp[​](#actorcpp-54)

```
1
  

```

##### Remove metadata for a channel with lambda[​](#remove-metadata-for-a-channel-with-lambda)

###### Actor.h[​](#actorh-55)

```
1
  

```

###### Actor.cpp[​](#actorcpp-55)

```
1
  

```

## Channel memberships[​](#channel-memberships)

### Get channel memberships[​](#get-channel-memberships)

Return a list of channel memberships for a user (not subscriptions).

#### Method(s)[​](#methods-14)

##### Method variants

You can also call the `GetMembershipsRaw` variant which takes String values for Include and Sort instead of FPubnubMembershipInclude and FPubnubMembershipSort.

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

- User Type: FString. User UUID (required).
- OnGetMembershipsResponse Type: FOnGetMembershipsResponse. Delegate for result. You can also use FOnGetMembershipsResponseNative (lambda).
- Include Type: FPubnubMembershipInclude.
- Limit Type: int (Default/Max: 100).
- Filter Type: FString.
- Sort Type: FPubnubMembershipSort.
- PageNext Type: FString.
- PagePrev Type: FString.

#### FPubnubMembershipInclude[​](#fpubnubmembershipinclude)

Field NameTypeDefault ValueDescription`IncludeCustom`boolfalseWhether to include the membership's `Custom` field.`IncludeStatus`boolfalseWhether to include the membership's `Status` field.`IncludeType`boolfalseWhether to include the membership's `Type` field.`IncludeChannel`boolfalseWhether to include the membership's Channel data field (in form of FPubnubChannelData).`IncludeChannelCustom`boolfalseWhether to include the membership's Channel Custom field.`IncludeChannelStatus`boolfalseWhether to include the membership's Channel Status field`IncludeChannelType`boolfalseWhether to include the membership's Channel Type field`IncludeTotalCount`boolfalseWhether to include the total count of memberships

#### FPubnubMembershipSort[​](#fpubnubmembershipsort)

Field NameTypeDescription`MembershipSort``TArray<FPubnubMembershipSingleSort>`Array of sort criteria used in Membership-related functions. Order matters (applied in sequence).

#### FPubnubMembershipSingleSort[​](#fpubnubmembershipsinglesort)

Field NameTypeDefaultDescriptionSortType[`EPubnubMembershipSortType`](#epubnubmembershipsorttype)`EPubnubMembershipSortType::PMST_ChannelID`Field to sort by in the Membership contextSortOrderboolfalseAscending when false, descending when true

#### EPubnubMembershipSortType[​](#epubnubmembershipsorttype)

Enum ValueDisplay NameDescription`PMST_ChannelID``ChannelID`Sort by Channel ID`PMST_ChannelName``ChannelName`Sort by Channel Name`PMST_ChannelUpdated``ChannelUpdated`Sort by last update to the Channel`PMST_ChannelStatus``ChannelStatus`Sort by Channel Status`PMST_ChannelType``ChannelType`Sort by Channel Type`PMST_Updated``Updated`Sort by Membership update timestamp`PMST_Status``Status`Sort by Membership status`PMST_Type``Type`Sort by Membership type

#### Sample code[​](#sample-code-14)

- C++
- Blueprint

#### Actor.h[​](#actorh-56)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-56)
  

```
1
  

```

#### Returns[​](#returns-14)

Void. Delegate returns FOnGetMembershipsResponse.

##### FOnGetMembershipsResponse[​](#fongetmembershipsresponse)

  

FieldTypeDescription`MembershipsData``TArray<FPubnubMembershipData>&`Aa array of [`FPubnubMembershipData`](#fpubnubmembershipdata) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubMembershipData[​](#fpubnubmembershipdata)

  

FieldTypeDescription`Channel`[`FPubnubChannelData`](#fpubnubchanneldata)Contains channel metadata, including unique channel identifier and other relevant information.`Custom``FString`Custom JSON values. Can be strings, numbers, or booleans. Filtering by Custom isn’t supported.`Status``FString`Status of the membership. Max 50 characters.`Type``FString`Type of the membership. Max 50 characters.`Updated``FString`The date when the channel's membership was last updated.`ETag``FString`Version identifier of the membership metadata.

##### FOnGetMembershipsResponseNative[​](#fongetmembershipsresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembershipsData`[`const TArray<FPubnubMembershipData>&`](#fpubnubmembershipdata)Aa array of [`FPubnubMembershipData`](#fpubnubmembershipdata) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Other examples[​](#other-examples-14)

##### Get memberships for a user with settings[​](#get-memberships-for-a-user-with-settings)

###### Actor.h[​](#actorh-57)

```
1
  

```

###### Actor.cpp[​](#actorcpp-57)

```
1
  

```

##### Get memberships for a user with lambda[​](#get-memberships-for-a-user-with-lambda)

###### Actor.h[​](#actorh-58)

```
1
  

```

###### Actor.cpp[​](#actorcpp-58)

```
1
  

```

##### Get memberships for a user with raw[​](#get-memberships-for-a-user-with-raw)

###### Actor.h[​](#actorh-59)

```
1
  

```

###### Actor.cpp[​](#actorcpp-59)

```
1
  

```

### Set channel memberships[​](#set-channel-memberships)

Set channel memberships for a user.

#### Method(s)[​](#methods-15)

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

- User Type: FString. User UUID (required).
- Channels Type: TArray<FPubnubMembershipInputData>. Memberships to add/update (required).
- FOnSetMembershipsResponse Type: FOnSetMembershipsResponse. Delegate for result. You can also use FOnSetMembershipsResponseNative (lambda).
- Include Type: FPubnubMembershipInclude.
- Limit Type: int.
- Filter Type: FString.
- Sort Type: FPubnubMembershipSort.
- PageNext Type: FString.
- PagePrev Type: FString.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### FPubnubMembershipInputData[​](#fpubnubmembershipinputdata)

FieldTypeDescription`Channel``FString`The channel ID to add/update the membership. Can't be empty.`Custom``FString`The custom data to add/update the membership.`Status``FString`The status of the membership.`Type``FString`The type of the membership.

#### FOnSetMembershipsResponse[​](#fonsetmembershipsresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembershipsData``TArray<FPubnubMembershipData>&`An array of [`FPubnubMembershipData`](#fpubnubmembershipdata) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### FOnSetMembershipsResponseNative[​](#fonsetmembershipsresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembershipsData``const TArray<FPubnubMembershipData>&`An array of [`FPubnubMembershipData`](#fpubnubmembershipdata) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Sample code[​](#sample-code-15)

- C++
- Blueprint

#### Actor.h[​](#actorh-60)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-60)
  

```
1
  

```

##### API limits

See REST API docs: /docs/sdks/rest-api/set-membership-metadata

#### Returns[​](#returns-15)

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
show all 38 lines

#### Other examples[​](#other-examples-15)

##### Set memberships for a user with result[​](#set-memberships-for-a-user-with-result)

###### Actor.h[​](#actorh-61)

```
1
  

```

###### Actor.cpp[​](#actorcpp-61)

```
1
  

```

##### Set memberships for a user with lambda[​](#set-memberships-for-a-user-with-lambda)

###### Actor.h[​](#actorh-62)

```
1
  

```

###### Actor.cpp[​](#actorcpp-62)

```
1
  

```

##### Set memberships for a user with raw[​](#set-memberships-for-a-user-with-raw)

###### Actor.h[​](#actorh-63)

```
1
  

```

###### Actor.cpp[​](#actorcpp-63)

```
1
  

```

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a user.

#### Method(s)[​](#methods-16)

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

- User Type: FString (required).
- Channels Type: TArray<FString> (required).
- FOnRemoveMembershipsResponse Type: FOnRemoveMembershipsResponse. Delegate for result. You can also use FOnRemoveMembershipsResponseNative (lambda).
- Include Type: FPubnubMembershipInclude.
- Limit Type: int.
- Filter Type: FString.
- Sort Type: FPubnubMembershipSort.
- PageNext Type: FString.
- PagePrev Type: FString.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### Sample code[​](#sample-code-16)

- C++
- Blueprint

#### Actor.h[​](#actorh-64)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-64)
  

```
1
  

```

#### Returns[​](#returns-16)

Void. Delegate returns FOnRemoveMembershipsResponse.

##### FOnRemoveMembershipsResponse[​](#fonremovemembershipsresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembershipsData``TArray<FPubnubMembershipData>&`An array of [`FPubnubMembershipData`](#fpubnubmembershipdata) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FOnRemoveMembershipsResponseNative[​](#fonremovemembershipsresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembershipsData``const TArray<FPubnubMembershipData>&`An array of [`FPubnubMembershipData`](#fpubnubmembershipdata) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Other examples[​](#other-examples-16)

##### Remove memberships for a user with result[​](#remove-memberships-for-a-user-with-result)

###### Actor.h[​](#actorh-65)

```
1
  

```

###### Actor.cpp[​](#actorcpp-65)

```
1
  

```

##### Remove memberships for a user with lambda[​](#remove-memberships-for-a-user-with-lambda)

###### Actor.h[​](#actorh-66)

```
1
  

```

###### Actor.cpp[​](#actorcpp-66)

```
1
  

```

##### Remove memberships for a user with raw[​](#remove-memberships-for-a-user-with-raw)

###### Actor.h[​](#actorh-67)

```
1
  

```

###### Actor.cpp[​](#actorcpp-67)

```
1
  

```

## Channel members[​](#channel-members)

### Get channel members[​](#get-channel-members)

Return a list of members in a channel. Includes user metadata when available.

#### Method(s)[​](#methods-17)

##### Method variants

You can also call the `GetChannelMembersRaw` variant which takes String values for Include and Sort instead of FPubnubMemberInclude and FPubnubMemberSort.

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

- Channel Type: FString (required).
- OnGetChannelMembersResponse Type: FOnGetChannelMembersResponse. Delegate for result. You can also use FOnGetChannelMembersResponseNative (lambda).
- Include Type: FPubnubMemberInclude.
- Limit Type: int (Default/Max: 100).
- Filter Type: FString.
- Sort Type: FPubnubMemberSort.
- PageNext Type: FString.
- PagePrev Type: FString.

#### FPubnubMemberInclude[​](#fpubnubmemberinclude)

Field NameTypeDefaultDescription`IncludeCustom`boolfalseWhether to include the member's `Custom` field`IncludeStatus`boolfalseWhether to include the member's `Status` field`IncludeType`boolfalseWhether to include the member's `Type` field`IncludeUUID`boolfalseWhether to include the member's User data (FPubnubUUIDMetadata)`IncludeUUIDCustom`boolfalseWhether to include the member's User Custom field`IncludeUUIDStatus`boolfalseWhether to include the member's User Status field`IncludeUUIDType`boolfalseWhether to include the member's User Type field`IncludeTotalCount`boolfalseWhether to include the total count of paginated records

#### FPubnubMemberSort[​](#fpubnubmembersort)

Field NameTypeDescription`MemberSort``TArray<FPubnubMemberSingleSort>`Array of sort criteria used in Member-related functions. Order matters (applied in sequence).

#### FPubnubMemberSingleSort[​](#fpubnubmembersinglesort)

Field NameTypeDefaultDescriptionSortType[`EPubnubMemberSortType`](#epubnubmembersorttype)`EPubnubMemberSortType::PMeST_UserID`Field to sort by in the Member contextSortOrderboolfalseAscending when false, descending when true

#### EPubnubMemberSortType[​](#epubnubmembersorttype)

Enum ValueDisplay NameDescription`PMeST_UserID``UserID`Sort by Member's User ID`PMeST_UserName``UserName`Sort by Member's User Name`PMeST_UserUpdated``UserUpdated`Sort by when the User was updated`PMeST_UserStatus``UserStatus`Sort by User Status`PMeST_UserType``UserType`Sort by User Type`PMeST_Updated``Updated`Sort by Member record update timestamp`PMeST_Status``Status`Sort by Member Status`PMeST_Type``Type`Sort by Member Type

#### Sample code[​](#sample-code-17)

- C++
- Blueprint

#### Actor.h[​](#actorh-68)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-68)
  

```
1
  

```

#### Returns[​](#returns-17)

Void. Delegate returns FOnGetChannelMembersResponse.

##### FOnGetChannelMembersResponse[​](#fongetchannelmembersresponse)

  

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembersData``TArray<FPubnubChannelMemberData>&`Aa array of [`FPubnubChannelMemberData`](#fpubnubchannelmemberdata) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubChannelMemberData[​](#fpubnubchannelmemberdata)

FieldTypeDescription`User`[`FPubnubUserData`](#fpubnubuserdata)Contains user metadata, including unique channel identifier and other relevant information.`Custom``FString`Custom JSON values. Can be strings, numbers, or booleans. Filtering by Custom isn’t supported.`Status``FString`Status of the member. Max 50 characters.`Type``FString`Type of the member. Max 50 characters.`Updated``FString`The date when the channel's member was last updated.`ETag``FString`Version identifier of the member metadata.

##### FOnGetChannelMembersResponseNative[​](#fongetchannelmembersresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembersData`[`const TArray<FPubnubChannelMemberData>&`](#fpubnubchannelmemberdata)Aa array of [`FPubnubChannelMemberData`](#fpubnubchannelmemberdata) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Other examples[​](#other-examples-17)

##### Get channel members with settings[​](#get-channel-members-with-settings)

###### Actor.h[​](#actorh-69)

```
1
  

```

###### Actor.cpp[​](#actorcpp-69)

```
1
  

```

##### Get channel members with lambda[​](#get-channel-members-with-lambda)

###### Actor.h[​](#actorh-70)

```
1
  

```

###### Actor.cpp[​](#actorcpp-70)

```
1
  

```

##### Get channel members raw[​](#get-channel-members-raw)

###### Actor.h[​](#actorh-71)

```
1
  

```

###### Actor.cpp[​](#actorcpp-71)

```
1
  

```

### Set channel members[​](#set-channel-members)

Set members in a channel.

#### Method(s)[​](#methods-18)

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

- Channel Type: FString (required).
- Users Type: TArray<FPubnubChannelMemberInputData> (required).
- FOnSetChannelMembersResponse Type: FOnSetChannelMembersResponse. Delegate for result. You can also use FOnSetChannelMembersResponseNative (lambda).
- Include Type: FPubnubMemberInclude.
- Limit Type: int.
- Filter Type: FString.
- Sort Type: FPubnubMemberSort.
- PageNext Type: FString.
- PagePrev Type: FString.

##### API limits

See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### FPubnubChannelMemberInputData[​](#fpubnubchannelmemberinputdata)

FieldTypeDescription`User``FString`The user UUID to add/update the membership. Can't be empty.`Custom``FString`The custom data to add/update the membership.`Status``FString`The status of the membership.`Type``FString`The type of the membership.

#### FOnSetChannelMembersResponse[​](#fonsetchannelmembersresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembersData``TArray<FPubnubChannelMemberData>&`An array of [`FPubnubChannelMemberData`](#fpubnubchannelmemberdata) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### FOnSetChannelMembersResponseNative[​](#fonsetchannelmembersresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembersData``const TArray<FPubnubChannelMemberData>&`An array of [`FPubnubChannelMemberData`](#fpubnubchannelmemberdata) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Sample code[​](#sample-code-18)

- C++
- Blueprint

#### Actor.h[​](#actorh-72)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-72)
  

```
1
  

```

##### API limits

See REST API docs: /docs/sdks/rest-api/set-channel-members-metadata

#### Returns[​](#returns-18)

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
show all 39 lines

#### Other examples[​](#other-examples-18)

##### Set channel members with result[​](#set-channel-members-with-result)

###### Actor.h[​](#actorh-73)

```
1
  

```

###### Actor.cpp[​](#actorcpp-73)

```
1
  

```

##### Set channel members with lambda[​](#set-channel-members-with-lambda)

###### Actor.h[​](#actorh-74)

```
1
  

```

###### Actor.cpp[​](#actorcpp-74)

```
1
  

```

##### Set channel members raw[​](#set-channel-members-raw)

###### Actor.h[​](#actorh-75)

```
1
  

```

###### Actor.cpp[​](#actorcpp-75)

```
1
  

```

### Remove Channel Members[​](#remove-channel-members)

Remove members from a channel.

#### Method(s)[​](#methods-19)

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

- Channel Type: FString (required).
- Users Type: TArray<FString>. User UUIDs to remove (required).
- FOnRemoveChannelMembersResponse Type: FOnRemoveChannelMembersResponse. Delegate for result. You can also use FOnRemoveChannelMembersResponseNative (lambda).
- Include Type: FPubnubMemberInclude.
- Limit Type: int.
- Filter Type: FString.
- Sort Type: FPubnubMemberSort.
- PageNext Type: FString.
- PagePrev Type: FString.

#### Sample code[​](#sample-code-19)

- C++
- Blueprint

#### Actor.h[​](#actorh-76)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-76)
  

```
1
  

```

#### Returns[​](#returns-19)

Void. Delegate returns FOnRemoveChannelMembersResponse.

##### FOnRemoveChannelMembersResponse[​](#fonremovechannelmembersresponse)

FieldTypeDescription`Result`[`FPubnubOperationResult`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembersData``TArray<FPubnubChannelMemberData>&`An array of [`FPubnubChannelMemberData`](#fpubnubchannelmemberdata) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FOnRemoveChannelMembersResponseNative[​](#fonremovechannelmembersresponsenative)

FieldTypeDescription`Result`[`const FPubnubOperationResult&`](/docs/sdks/unreal/api-reference/configuration#operation-result)The result of the operation.`MembersData``const TArray<FPubnubChannelMemberData>&`An array of [`FPubnubChannelMemberData`](#fpubnubchannelmemberdata) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

#### Other examples[​](#other-examples-19)

##### Remove channel members with result[​](#remove-channel-members-with-result)

###### Actor.h[​](#actorh-77)

```
1
  

```

###### Actor.cpp[​](#actorcpp-77)

```
1
  

```

##### Remove channel members with lambda[​](#remove-channel-members-with-lambda)

###### Actor.h[​](#actorh-78)

```
1
  

```

###### Actor.cpp[​](#actorcpp-78)

```
1
  

```

##### Remove channel members raw[​](#remove-channel-members-raw)

###### Actor.h[​](#actorh-79)

```
1
  

```

###### Actor.cpp[​](#actorcpp-79)

```
1
  

```

## Complete example[​](#complete-example)

#### ASample_AppContextFull.h[​](#asample_appcontextfullh)

```
1
  

```

#### ASample_AppContextFull.cpp[​](#asample_appcontextfullcpp)

```
1
**
```
Last updated on Sep 11, 2025**