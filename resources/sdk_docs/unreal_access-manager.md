On this page
# Access Manager v3 API for Unreal SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to one client with a given `userId`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

### Usage in Blueprints and C++

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `GrantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`TTL`), `AuthorizedUuid`, and a set of permissions giving access to one or more resources:

- `Channels`

- `ChannelGroups`

- `Uuids` (other users' object metadata, such as their names or avatars)

Only this `AuthorizedUuid` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `TTL` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

- Permissions
- TTL
- RegEx
- Authorized User ID

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:
ResourcePermissions`Channels``read`, `write`, `get`, `manage`, `update`, `join`, `delete``ChannelGroups``read`, `manage``Uuids``get`, `update`, `delete`
For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

##### Recommended ttl value

For security reasons, it's recommended to set `ttl` between `10` and `60`, and create a new token before this `ttl` elapses.

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, define RegEx permissions for a given resource type in the grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

Setting an `AuthorizedUuid` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `AuthorizedUuid` isn't specified during the grant request, the token can be used by any client with any User ID. It's recommended to restrict tokens to a single `AuthorizedUuid` to prevent impersonation.

For more details, see [Authorized User ID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

- Blueprint
- C++

```
`PubnubSubsystem->GrantToken(  
    FString PermissionObject,   
    FOnPubnubResponse OnGrantTokenResponse  
);  
  
`
```
*  requiredParameterDescription`PermissionObject` *Type: `FString`JSON object containing channel, channel group, and User metadata permissions and patterns. You can use the `GrantTokenStructureToJsonString` method to create a valid JSON from [`FPubnubGrantTokenStructure`](#fpubnubgranttokenstructure) struct.`OnGrantTokenResponse` *Type: `FOnPubnubResponse`The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.
#### FPubnubGrantTokenStructure[​](#fpubnubgranttokenstructure)
*  requiredParameterDescription`TTLMinutes`Type: `int`Default:  
n/aTime-To-Live (TTL) in minutes for the granted token.`AuthorizedUser`Type: `FString`Default:  
n/aThe User ID that is authorized by this grant.`Channels`Type: `TArray<FString>`Default:  
Empty ArrayList of channel names included in this grant.`ChannelPermissions`Type: `TArray<FPubnubChannelPermissions>`Default:  
Empty ArrayPermissions applied to the listed channels.`ChannelGroups`Type: `TArray<FString>`Default:  
Empty ArrayList of channel group names included in this grant.`ChannelGroupPermissions`Type: `TArray<FPubnubChannelGroupPermissions>`Default:  
Empty ArrayPermissions applied to the listed channel groups.`Users`Type: `TArray<FString>`Default:  
Empty ArrayList of Users included in this grant.`UserPermissions`Type: `TArray<FPubnubUserPermissions>`Default:  
Empty ArrayPermissions applied to the listed Users.`ChannelPatterns`Type: `TArray<FString>`Default:  
Empty ArrayList of channel name patterns included in this grant.`ChannelPatternPermissions`Type: `TArray<FPubnubChannelPermissions>`Default:  
Empty ArrayPermissions applied to the listed channel name patterns.`ChannelGroupPatterns`Type: `TArray<FString>`Default:  
Empty ArrayList of channel group name patterns included in this grant.`ChannelGroupPatternPermissions`Type: `TArray<FPubnubChannelGroupPermissions>`Default:  
Empty ArrayPermissions applied to the listed channel group name patterns.`UserPatterns`Type: `TArray<FString>`Default:  
Empty ArrayList of User name patterns included in this grant.`UserPatternPermissions`Type: `TArray<FPubnubUserPermissions>`Default:  
Empty ArrayPermissions applied to the listed User name patterns.
##### FPubnubChannelPermissions[​](#fpubnubchannelpermissions)

`FPubnubChannelPermissions` contains the following properties:
*  requiredParameterDescription`Read`Type: `bool`Default:  
`false`Read permission. Applies to Subscribe, History, and Presence.`Write`Type: `bool`Default:  
`false`Write permission. Applies to Publish.`Delete`Type: `bool`Default:  
`false`Delete permission. Applies to History and App Context.`Get`Type: `bool`Default:  
`false`Get permission. Applies to App Context.`Update`Type: `bool`Default:  
`false`Update permission. Applies to App Context.`Manage`Type: `bool`Default:  
`false`Manage permission. Applies to Channel Groups and App Context.`Join`Type: `bool`Default:  
`false`Join permission. Applies to App Context.
##### FPubnubChannelGroupPermissions[​](#fpubnubchannelgrouppermissions)

`FPubnubChannelGroupPermissions` contains the following properties:
*  requiredParameterDescription`Read`Type: `bool`Default:  
`false`Read permission. Applies to presence and history access for the group.`Manage`Type: `bool`Default:  
`false`Manage permission. Applies to modifying members of the group.
##### FPubnubUserPermissions[​](#fpubnubuserpermissions)

`FPubnubUserPermissions` contains the following properties:
*  requiredParameterDescription`Delete`Type: `bool`Default:  
`false`Delete permission. Allows deletion of user metadata.`Get`Type: `bool`Default:  
`false`Get permission. Allows retrieval of user metadata.`Update`Type: `bool`Default:  
`false`Update permission. Allows updating of user metadata.

For a successful grant request, you must specify permissions for at least one User, channel, or group, either as a resource list or as a pattern (RegEx). You can specify the permissions in the following ways:

apply the same permission to multiple objects

```
`// permission1 as applied to all channels  
Channels = {channel1, channel2, channel3}  
Permisions = {permission1}   
`
```

apply different permissions to multiple objects

```
`// the indexes in the Channels array correspond to the indexes in the Permissions array  
// so channel1 gets permission1, channel2 permission2, etc  
Channels = {channel1, channel2, channel3}  
Permisions = {permission1, permission2, permission3}  
`
```

If you provide more than one permission to multiple objects, an error will be thrown.

```
`// this throws an error as the permissions don't match the objects  
Channels = {channe1, channel2, channel3}  
Permisions = {permission1, permission2}  
`
```

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### MyGameMode.h[​](#mygamemodeh)

```
`//NOTE: This example requires corrent PubnubSDK configuration in plugins settings and adding "PubnubLibrary" to PublicDependencyModuleNames in your build.cs  
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
`
```
show all 25 lines

#### MyGameMode.cpp[​](#mygamemodecpp)

```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::GrantTokenExample()  
{  
	//Get PubnubSubsystem as any other subsystem  
	UGameInstance* GI =  UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GI->GetSubsystemUPubnubSubsystem>();  
  
	//Make sure to set user ID, it's required for every Pubnub operation  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	bool IsSuccess;  
	FPubnubGrantTokenStructure GrantTokenStructure;	  
`
```
show all 46 lines

### Returns[​](#returns)

```
`p0F2AkF0GmaCRihDdHRsGQWgQ3Jasdasdhhbm5lbC1hAUNncnCgQ3NwY6BDdXNyoER1dWlkoENwYXSlRGNoYW6gQ2dycKas123d3BjoEN1c3KgRHV1aWSgRG1ldGGgQ3NpZ1ggN-gMhU1oAQwot7NbSW4P2KTb1mx-iQzxxH37vkQes_8=  
`
```

### Other Examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

The code below grants `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnGrantTokenResponse;  
OnGrantTokenResponse.BindDynamic((this, &AMyActor::OnListUsersFromChannelResponse););  
  
// Create a permissions object  
FPubnubGrantTokenStructure grantToken;  
grantToken.AuthorizedUser = "my-authorized-uuid";  
grantToken.TTLMinutes = 1440;  
`
```
show all 59 lines

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

The code below grants `my-authorized-uuid` read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnGrantTokenResponse;  
OnGrantTokenResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);  
  
// Create a permissions object  
FPubnubGrantTokenStructure grantToken;  
grantToken.AuthorizedUser = "my-authorized-uuid";  
grantToken.TTLMinutes = 1440;  
`
```
show all 26 lines

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

The code below grants the `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

- Read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnGrantTokenResponse;  
OnGrantTokenResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);  
  
// Create a permissions object  
FFPubnubGrantTokenStructure grantToken;  
grantToken.AuthorizedUser = "my-authorized-uuid";  
grantToken.TTLMinutes = 1440;  
`
```
show all 64 lines

### Error responses[​](#error-responses)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions.

## Revoke Token[​](#revoke-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Enable token revoke

To revoke tokens, you must first enable this feature on the [Admin Portal](https://admin.pubnub.com/). To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `RevokeToken()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `GrantToken()` method.

Use this method for tokens with `TTL` less than or equal to 30 days. If you need to revoke a token with a longer `TTL`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->RevokeToken(FString Token);  
`
```
*  requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
PubnubSubsystem->RevokeToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");  
`
```

### Returns[​](#returns-1)

This method doesn't have any return value.

### Error Responses[​](#error-responses-1)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `ParseToken()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `TTL` details.

### Method(s)[​](#methods-2)

- Blueprint
- C++

```
`PubnubSubsystem->ParseToken(  
  FString Token,   
  FOnPubnubResponse OnParseTokenResponse  
);  
`
```
*  requiredParameterDescription`Token` *Type: `string`Existing token with embedded permissions.`OnParseTokenResponse` *Type: `FOnPubnubResponse`The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

### Basic Usage[​](#basic-usage-2)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnParseTokenResponse;  
OnParseTokenResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);  
  
FString Token = "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI";  
  
PubnubSubsystem->ParseToken(Token, OnParseTokenResponse);  
`
```

### Returns[​](#returns-2)

```
`{  
   "Version":2,  
   "Timestamp":1619718521,  
   "TTL":15,  
   "AuthorizedUuid":"my_uuid",  
   "Resources":{  
      "Uuids":{  
        "uuid-id":{  
            "Read":true,  
            "Write":true,  
            "Manage":true,  
            "Delete":true,  
            "Get":true,  
            "Update":true,  
            "Join":true  
`
```
show all 76 lines

### Error Responses[​](#error-responses-2)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `SetAuthToken()` method is used by the client devices to update the authentication token granted by the server.

- Blueprint
- C++

```
`PubnubSubsystem->SetAuthToken(FString Token);  
`
```
*  requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-3)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
PubnubSubsystem->SetAuthToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");  
`
```

### Returns[​](#returns-3)

This method doesn't return any response value.
Last updated on **Mar 26, 2025**