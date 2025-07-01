On this page
# App Context API for Unreal SDK

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

### Usage in Blueprints and C++

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of User Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

- Blueprint
- C++

##### Method variants

You can also call the `GetAllUserMetadataRaw` variant of this method which takes String values for `Include` and `Sort` instead of the `FPubnubGetAllInclude` and `FPubnubGetAllSort` structs.

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
*  requiredParameterDescription`OnGetAllUserMetadataResponse` *Type: [`FOnGetAllUserMetadataResponse`](#fongetallusermetadataresponse)The callback function used to handle the result in JSON format.`Include`Type: [`FPubnubGetAllInclude`](#fpubnubgetallinclude)A comma-separated list of property names to include in the response.`Limit`Type: intThe maximum number of results to return (default: 100).`Filter`Type: `FString`Expression used to filter the results. Check online documentation to see exact filter formulas.`Sort`Type: [`FPubnubGetAllSort`](#fpubnubgetallsort)Key-value pair of a property to sort by, and a sort direction. For example: `{name: 'asc'}``PageNext`Type: `FString`A string to retrieve the next page of results (if applicable).`PagePrev`Type: `FString`A string to retrieve the previous page of results (if applicable). Ignored if `PageNext` is provided.`Count`Type: `EPubnubTribool` enumWhether to include a total count of users in the response (default: not set).

#### FPubnubGetAllInclude[​](#fpubnubgetallinclude)

FieldTypeDescription`IncludeCustom``bool`Whether to include the membership Custom field.`IncludeStatus``bool`Whether to include the membership Status field.`IncludeType``bool`Whether to include the membership Type field.`IncludeTotalCount``bool`Whether to include the total count.

#### FPubnubGetAllSort[​](#fpubnubgetallsort)

FieldTypeDescription`GetAllSort``TArray<FPubnubGetAllSingleSort>`Array of sorts for Membership related function. The order matters, sorts will be applied from the first index to the last.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Using Raw Method[​](#using-raw-method)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetAllUserMetadataResponse OnGetAllUserMetadataResponse;  
OnGetAllUserMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllUserMetadataResponse);  
  
int Limit = 10; // Limit to 10 objects  
EPubnubTribool Count = PT_False; // Don't include total count  
  
// Fetch all user metadata using Raw method  
`
```
show all 16 lines

##### Using Non-Raw Method[​](#using-non-raw-method)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
FOnGetAllUserMetadataResponse OnGetAllUserMetadataResponse;  
OnGetAllUserMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllUserMetadataResponse);  
  
// Create include and sort parameters  
FPubnubGetAllInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
  
`
```
show all 32 lines

#### Returns[​](#returns)

This method returns the [`FOnGetAllUserMetadataResponse`](#fongetallusermetadataresponse) struct.

##### FOnGetAllUserMetadataResponse[​](#fongetallusermetadataresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`UsersData``TArray<FPubnubUserData>&`Aa array of [`FPubnubUserData`](#fpubnubuserdata) structs which are the users with their associated User metadata.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubUserData[​](#fpubnubuserdata)

  

FieldTypeDescription`UserID``FString`Unique user identifier. If not supplied, then the current user's User is used.`UserName``FString`Display name for the user.`ExternalID``FString`User's identifier in an external system.`ProfileUrl``FString`The URL of the user's profile picture.`Email``FString`The user's email address.`Custom``FString`JSON providing custom data about the user. Values must be scalar only; arrays or objects are not supported.`Status``FString`User status. Max. 50 characters.`Type``FString`User type. Max. 50 characters.`Updated``FString`The date when the user's metadata was last updated.`ETag``FString`Information on the object's content fingerprint.

##### JSON Response[​](#json-response)

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

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified User, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->GetUserMetadata(  
    FString Include,   
    FString User,   
    FOnGetUserMetadataResponse OnGetUserMetadataResponse  
);  
`
```
*  requiredParameterDescription`Include`Type: `FString`A comma delimited string with additional/complex user attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`User`Type: `FString`The metadata ID for which to retrieve the user object. Can't be empty.`OnGetUserMetadataResponse` *Type: [`FOnGetUserMetadataResponse`](#fongetusermetadataresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

#### Basic Usage[​](#basic-usage-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetUserMetadataResponse OnGetUserMetadataResponse;  
OnGetUserMetadataResponse.BindDynamic(this, &AMyActor::OnGetUserMetadataResponse);  
  
FString Include = ""; // No additional attributes  
FString User = "uuid-1";   
  
PubnubSubsystem->GetUserMetadata(Include, Limit, Start, End, Count, OnGetUserMetadataResponse);  
`
```

#### Returns[​](#returns-1)

This method returns the [`FOnGetUserMetadataResponse`](#fongetusermetadataresponse) struct.

##### FOnGetUserMetadataResponse[​](#fongetusermetadataresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`UserData``FPubnubUserData`Aa instance of [`FPubnubUserData`](#fpubnubuserdata) struct which is the user with their associated User metadata.

#### JSON Response[​](#json-response-1)

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

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a User in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-2)

- Blueprint
- C++

```
`PubnubSubsystem->SetUserMetadata(  
    FString User,   
    FString Include,   
    FString UserMetadataObj  
);  
`
```
*  requiredParameterDescription`User`Type: `FString`The metadata ID for which to retrieve the user object. Can't be empty.`Include`Type: `FString`A comma delimited string with additional/complex user attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`UserMetadataObj`Type: `FString`The JSON string with the definition of the User Metadata object to create.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString User = "user123"; // Example User Metadata ID  
FString Include = ""; // No additional attributes  
FString UserMetadataObj = "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\"}"; // Example JSON object  
  
// Call the SetUserMetadata method  
PubnubSubsystem->SetUserMetadata(User, Include, UserMetadataObj);  
`
```

#### Returns[​](#returns-2)

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

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`#include "PubnubSubsystem.h"  
#include "GameFramework/Actor.h"  
#include "Kismet/GameplayStatics.h"  
  
  
UCLASS()  
//Replace MYPROJECT with name of your project  
class MYPROJECT_API AMyActor : public AActor  
{  
    GENERATED_BODY()  
  
protected:  
    virtual void BeginPlay() override;  
  
private:  
`
```
show all 70 lines

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified User ID.

#### Method(s)[​](#methods-3)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveUserMetadata(FString User);  
`
```
*  requiredParameterDescription`User`Type: `FString`The metadata ID to delete from the user object. Can't be empty.

#### Basic Usage[​](#basic-usage-3)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString User = "user123"; // Example User Metadata ID  
  
// Call the RemoveUserMetadata method  
PubnubSubsystem->RemoveUserMetadata(User);  
`
```

#### Returns[​](#returns-3)

This method doesn't have any return value.

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

- Blueprint
- C++

##### Method variants

You can also call the `GetAllChannelMetadataRaw` variant of this method which takes String values for `Include` and `Sort` instead of the `FPubnubGetAllInclude` and `FPubnubGetAllSort` structs.

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
*  requiredParameterDescription`OnGetAllChannelMetadataResponse` *Type: [`FOnGetAllChannelMetadataResponse`](#fongetallchannelmetadataresponse)The callback function used to handle the result.`Include`Type: [`FPubnubGetAllInclude`](#fpubnubgetallinclude)A comma-separated list of property names to include in the response.`Limit`Type: intThe maximum number of results to return (default: 100).`Filter`Type: `FString`Expression used to filter the results. Check online documentation to see exact filter formulas.`Sort`Type: [`FPubnubGetAllSort`](#fpubnubgetallsort)Key-value pair of a property to sort by, and a sort direction. For example: `{name: 'asc'}``PageNext`Type: `FString`A string to retrieve the next page of results (if applicable).`PagePrev`Type: `FString`A string to retrieve the previous page of results (if applicable). Ignored if `PageNext` is provided.

#### Basic Usage[​](#basic-usage-4)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Using Raw Method[​](#using-raw-method-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetAllChannelMetadataResponse OnGetAllChannelMetadataResponse;  
OnGetAllChannelMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllChannelMetadataResponse);  
  
int Limit = 10; // Limit to 10 objects  
EPubnubTribool Count = PT_False; // Don't include total count  
  
// Fetch all channel metadata using Raw method  
`
```
show all 16 lines

##### Using Non-Raw Method[​](#using-non-raw-method-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
FOnGetAllChannelMetadataResponse OnGetAllChannelMetadataResponse;  
OnGetAllChannelMetadataResponse.BindDynamic(this, &AMyActor::OnGetAllChannelMetadataResponse);  
  
// Create include and sort parameters  
FPubnubGetAllInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
  
`
```
show all 32 lines

#### Returns[​](#returns-4)

This method returns the [`FOnGetAllChannelMetadataResponse`](#fongetallchannelmetadataresponse) struct.

##### FOnGetAllChannelMetadataResponse[​](#fongetallchannelmetadataresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`ChannelsData``TArray<FPubnubChannelData>&`Aa array of [`FPubnubChannelData`](#fpubnubchanneldata) structs which are the users with their associated Channel metadata.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubChannelData[​](#fpubnubchanneldata)

  

FieldTypeDescription`ChannelID``FString`ID of the channel.`ChannelName``FString`Name of the channel.`Description``FString`Additional description of the channel.`Custom``FString`JSON providing custom data about the user. Values must be scalar only; arrays or objects are not supported.`Status``FString`Channel status. Max 50 characters.`Type``FString`Channel type. Max 50 characters.`Updated``FString`The date when the channel's metadata was last updated.`ETag``FString`Version identifier of the user's metadata.

##### JSON Response[​](#json-response-2)

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

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

- Blueprint
- C++

```
`PubnubSubsystem->GetChannelMetadata(  
    FString Include,   
    FString Channel,   
    FOnGetChannelMetadataResponse OnGetChannelMetadataResponse  
);  
`
```
*  requiredParameterDescription`Include`Type: `FString`A comma delimited string with additional/complex user attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`Channel`Type: `FString`The channel ID for which to retrieve the channel object. Can't be empty.`OnGetChannelMetadataResponse` *Type: [`FOnGetChannelMetadataResponse`](#fongetchannelmetadataresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

#### Basic Usage[​](#basic-usage-5)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetChannelMetadataResponse OnGetChannelMetadataResponse;  
OnGetChannelMetadataResponse.BindDynamic(this, &AMyActor::OnGetChannelMetadataResponse);  
  
FString Include = ""; // No additional attributes  
FString Channel = "my-channel";   
  
PubnubSubsystem->GetChannelMetadata(Include, Channel, OnGetChannelMetadataResponse);  
`
```

#### Returns[​](#returns-5)

This method returns the [`FOnGetChannelMetadataResponse`](#fongetchannelmetadataresponse) struct.

##### FOnGetChannelMetadataResponse[​](#fongetchannelmetadataresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`ChannelData``FPubnubChannelData`Aa instance of [`FPubnubChannelData`](#fpubnubchanneldata) struct which is the channel with its associated metadata.

##### JSON Response[​](#json-response-3)

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

### Set Channel Metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a channel in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-6)

- Blueprint
- C++

```
`PubnubSubsystem->SetChannelMetadata(  
    FString Channel,   
    FString Include,   
    FString ChannelMetadataObj  
);  
`
```
*  requiredParameterDescription`Channel`Type: `FString`The metadata ID for which to retrieve the channel object. Can't be empty.`Include`Type: `FString`A comma delimited string with additional/complex channel attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`ChannelMetadataObj`Type: `FString`The JSON string with the definition of the Channel metadata object to create.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "myChannel"; // Example Channel Metadata ID  
FString Include = ""; // No additional attributes  
FString ChannelMetadataObj = "{\"name\":\"PubNub channel\",\"description\":\"The channel for announcements\"}"; // Example JSON object  
  
// Call the SetChannelMetadata method  
PubnubSubsystem->SetChannelMetadata(Channel, Include, ChannelMetadataObj);  
`
```

#### Returns[​](#returns-6)

```
`{  
    "Channel": "my-channel",  
    "Name": "PubNub channel",  
    "Description": "The channel for announcements",  
    "Updated": "2020-06-17T16:52:19.562469Z"  
}  
`
```

#### Other Examples[​](#other-examples-1)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata-1)

```
`#include "PubnubSubsystem.h"  
#include "GameFramework/Actor.h"  
#include "Kismet/GameplayStatics.h"  
  
  
UCLASS()  
//Replace MYPROJECT with name of your project  
class MYPROJECT_API AMyActor : public AActor  
{  
    GENERATED_BODY()  
  
protected:  
    virtual void BeginPlay() override;  
  
private:  
`
```
show all 70 lines

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveChannelMetadata(FString Channel);  
`
```
*  requiredParameterDescription`Channel`Type: `FString`The metadata ID to delete from the channel object. Can't be empty.

#### Basic Usage[​](#basic-usage-7)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "myChannel"; // Example Channel Metadata ID  
  
// Call the RemoveChannelMetadata method  
PubnubSubsystem->RemoveChannelMetadata(Channel);  
`
```

#### Returns[​](#returns-7)

This method doesn't have any return value.

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

- Blueprint
- C++

##### Method variants

You can also call the `GetMembershipsRaw` variant of this method which takes String values for `Include` and `Sort` instead of the `FPubnubMembershipInclude` and `FPubnubMembershipSort` structs.

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
*  requiredParameterDescription`User` *Type: `FString`The user ID for whom to retrieve memberships.`OnGetMembershipResponse` *Type: [`FOnGetMembershipsResponse`](#fongetmembershipsresponse)The callback function used to handle the result.`Include`Type: [`FPubnubMembershipInclude`](#fpubnubmembershipinclude)List of property names to include in the response.`Limit`Type: intThe maximum number of results to return (default: 100).`Filter`Type: `FString`Expression used to filter the results. Check online documentation to see exact filter formulas.`Sort`Type: [`FPubnubMembershipSort`](#fpubnubmembershipsort)Key-value pair of a property to sort by, and a sort direction.`PageNext`Type: `FString`A string to retrieve the next page of results (if applicable).`PagePrev`Type: `FString`A string to retrieve the previous page of results (if applicable). Ignored if `PageNext` is provided.

#### Basic Usage[​](#basic-usage-8)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetMembershipsResponse OnGetMembershipResponse;  
OnGetMembershipResponse.BindDynamic(this, &AMyActor::OnGetMembershipResponse);  
  
User UserId = "user-1"  
int Limit = 10; // Limit to 10 objects  
`
```
show all 18 lines

##### Using Non-Raw Method[​](#using-non-raw-method-2)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
FOnGetMembershipsResponse OnGetMembershipResponse;  
OnGetMembershipResponse.BindDynamic(this, &AMyActor::OnGetMembershipResponse);  
  
// Create include and sort parameters  
FPubnubMembershipInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
  
`
```
show all 33 lines

#### Returns[​](#returns-8)

This method returns the [`FOnGetMembershipsResponse`](#fongetmembershipsresponse) struct.

##### FOnGetMembershipsResponse[​](#fongetmembershipsresponse)

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`MembershipsData``TArray<FPubnubGetChannelMembershipsWrapper>&`Aa array of [`FPubnubGetChannelMembershipsWrapper`](#fpubnubgetchannelmembershipswrapper) structs which are the memberships of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubGetChannelMembershipsWrapper[​](#fpubnubgetchannelmembershipswrapper)

  

FieldTypeDescription`Channel`[`FPubnubChannelData`](#fpubnubchanneldata)Contains channel metadata, including unique channel identifier and other relevant information.`Custom``FString`JSON providing custom data about the membership. Values must be scalar only; arrays or objects are not supported.`Status``FString`Status of the membership. Max 50 characters.`Type``FString`Type of the membership. Max 50 characters.`Updated``FString`The date when the channel's membership was last updated.`ETag``FString`Version identifier of the membership metadata.

##### JSON Response[​](#json-response-4)

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

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a User.

#### Method(s)[​](#methods-9)

- Blueprint
- C++

```
`PubnubSubsystem->SetMemberships(  
    FString User,   
    FString Include,   
    FString SetObj  
);  
`
```
*  requiredParameterDescription`User`Type: `FString`The user ID to add/update the memberships. Can't be empty.`Include`Type: `FString`A comma delimited string with additional/complex channel attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`SetObj`Type: `FString`The JSON object that defines the add/update to perform. Can't be empty.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-9)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString User = "user123"; // Example User ID  
FString Include = ""; // No additional attributes  
FString SetObj = "{\"channels\": [{\"channel123\": {\"name\":\"Channel One\"}}]}"; // Example JSON object  
  
// Call the SetMemberships method  
PubnubSubsystem->SetMemberships(User, Include, SetObj);  
`
```

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Returns[​](#returns-9)

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

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a user.

#### Method(s)[​](#methods-10)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveMemberships(  
    FString User,   
    FString Include,   
    FString RemoveObj  
);  
`
```
*  requiredParameterDescription`User`Type: `FString`The user ID to remove the memberships. Can't be empty.`Include`Type: `FString`A comma delimited string with additional/complex channel attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`RemoveObj`Type: `FString`The JSON object with the memberships to remove. Can't be empty.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-10)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString User = "user123"; // Example User ID  
FString Include = ""; // No additional attributes  
FString RemoveObj = "[{\"channel\": {\"id\": \"some-channel-id\"}}, {\"channel\": {\"id\": \"channel-0-id\"}}]"; // Example JSON object  
  
// Call the RemoveMemberships method  
PubnubSubsystem->RemoveMemberships(User, Include, RemoveObj);  
`
```

#### Returns[​](#returns-10)

```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
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

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-11)

- Blueprint
- C++

##### Method variants

You can also call the `GetChannelMembersRaw` variant of this method which takes String values for `Include`, and `Sort` instead of the `FPubnubMemberInclude` and `FPubnubMemberSort` structs.

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
*  requiredParameterDescription`Channel` *Type: `FString`The Channel ID for which to retrieve members.`OnGetMembersResponse` *Type: [`FOnGetChannelMembersResponse`](#fongetchannelmembersresponse)The callback function used to handle the result.`Include`Type: [`FPubnubMemberInclude`](#fpubnubmemberinclude)A comma-separated list of property names to include in the response.`Limit`Type: intThe maximum number of results to return (default: 100).`Filter`Type: `FString`Expression used to filter the results. Check online documentation to see exact filter formulas.`Sort`Type: [`FPubnubMemberSort`](#fpubnubmembersort)Key-value pair of a property to sort by, and a sort direction.`PageNext`Type: `FString`A string to retrieve the next page of results (if applicable).`PagePrev`Type: `FString`A string to retrieve the previous page of results (if applicable). Ignored if `PageNext` is provided.

#### Basic Usage[​](#basic-usage-11)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetChannelMembersResponse OnGetMembersResponse;  
OnGetMembersResponse.BindDynamic(this, &AMyActor::OnGetMembersResponse);  
  
FString Channel = "my-channel";  
int Limit = 10; // Limit to 10 objects  
EPubnubTribool Count = PT_False; // Don't include total count   
  
`
```
show all 17 lines

##### Using Non-Raw Method[​](#using-non-raw-method-3)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
FOnGetChannelMembersResponse OnGetMembersResponse;  
OnGetMembersResponse.BindDynamic(this, &AMyActor::OnGetMembersResponse);  
  
// Create include and sort parameters  
FPubnubMemberInclude Include;  
Include.IncludeCustom = true;  
Include.IncludeStatus = true;  
  
`
```
show all 33 lines

#### Returns[​](#returns-11)

This method returns the [`FOnGetChannelMembersResponse`](#fongetchannelmembersresponse) struct.

##### FOnGetChannelMembersResponse[​](#fongetchannelmembersresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`MembersData``TArray<FPubnubGetChannelMembersWrapper>&`Aa array of [`FPubnubGetChannelMembersWrapper`](#fpubnubgetchannelmemberswrapper) structs which are the members of the channel.`PageNext``FString`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`PagePrev``FString`Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `pageNext` parameter is supplied.

##### FPubnubGetChannelMembersWrapper[​](#fpubnubgetchannelmemberswrapper)

  

FieldTypeDescription`User`[`FPubnubUserlData`](#fpubnubuserdata)Contains user metadata, including unique channel identifier and other relevant information.`Custom``FString`JSON providing custom data about the member. Values must be scalar only; arrays or objects are not supported.`Status``FString`Status of the member. Max 50 characters.`Type``FString`Type of the member. Max 50 characters.`Updated``FString`The date when the channel's member was last updated.`ETag``FString`Version identifier of the member metadata.

##### JSON Response[​](#json-response-5)

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

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-12)

- Blueprint
- C++

```
`PubnubSubsystem->SetChannelMembers(  
    FString Channel,   
    FString Include,   
    FString SetObj  
);  
`
```
*  requiredParameterDescription`Channel`Type: `FString`The channel ID to add/update the members. Can't be empty.`Include`Type: `FString`A comma delimited string with additional/complex channel attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`SetObj`Type: `FString`The JSON object that defines the add/update to perform. Can't be empty.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-12)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "myChannel";  
FString Include = ""; // No additional attributes  
FString SetObj = "[{\"uuid\": {\"id\": \"some-user-id\"}, \"custom\": {\"starred\": true}}, {\"uuid\": {\"id\": \"user-0-id\"}, \"custom\": {\"some_key\": \"some_value\"}}]"; // Example JSON object  
  
// Call the SetChannelMembers method  
PubnubSubsystem->SetChannelMembers(Channel, Include, SetObj);  
`
```

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Returns[​](#returns-12)

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

### Remove Channel Members[​](#remove-channel-members)

Remove members from a channel.

#### Method(s)[​](#methods-13)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveChannelMembers(  
    FString Channel,   
    FString Include,   
    FString RemoveObj  
);  
`
```
*  requiredParameterDescription`Channel`Type: `FString`The channel ID to remove the members. Can't be empty.`Include`Type: `FString`A comma delimited string with additional/complex channel attributes to include in response. Use `""` if you don't want to retrieve additional attributes.`RemoveObj`Type: `FString`The JSON object that defines what to remove. Can't be empty.

#### Basic Usage[​](#basic-usage-13)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "myChannel";  
FString Include = ""; // No additional attributes  
FString RemoveObj = "[{\"uuid\": {\"id\": \"some-user-id\"}}, {\"uuid\": {\"id\": \"user-0-id\"}}]";; // Example JSON object  
  
// Call the RemoveChannelMembers method  
PubnubSubsystem->RemoveChannelMembers(Channel, Include, RemoveObj);  
`
```

#### Returns[​](#returns-13)

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
show all 39 linesLast updated on Apr 29, 2025**