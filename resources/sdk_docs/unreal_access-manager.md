# Access Manager v3 API for Unreal SDK

Access Manager issues time-limited tokens with embedded permissions for PubNub resources:
- Time-bound via TTL.
- Granted per resource lists or RegEx patterns.
- Multiple resources/permission levels in a single request.
- Optional restriction to a single client via authorizedUuid (value of userId).

User ID / UUID
- UUID in APIs equals the userId set during initialization.

Use via Blueprints or C++.

C++ setup
- Add dependency to PubnubLibrary in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

- Example subsystem usage:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

- Example call:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

## Grant token

Requires Access Manager add-on
Requires Secret Key authentication

Generates an authorization token with TTL, AuthorizedUser, and permissions across:
- Channels
- ChannelGroups
- Uuids (users' object metadata)

Only the AuthorizedUser can use the token. Unauthorized or invalid token returns 403.

Permissions
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete
For mapping, see Manage Permissions with Access Manager v3.

TTL
- Required, minutes, max 43,200 (30 days).
- Recommended: 10–60 minutes.
- Renew before expiration.

RegEx
- Grant by patterns per resource type.

Authorized User ID
- Restrict token to a single client. If not set, any userId can use the token.

### Method(s)

```
`1PubnubSubsystem->GrantToken(  
2  int Ttl,   
3  FString AuthorizedUser,   
4  const FPubnubGrantTokenPermissions& Permissions,   
5  FOnGrantTokenResponse OnGrantTokenResponse,   
6  FString Meta = ""  
7);  
`
```

Parameters
- Ttl (int): Time-To-Live in minutes.
- AuthorizedUser (FString): The userId authorized by this grant.
- Permissions (const FPubnubGrantTokenPermissions&): Permissions for resources.
- OnGrantTokenResponse (FOnGrantTokenResponse): Result delegate; alternatively FOnGrantTokenResponseNative for lambda.
- Meta (FString): Optional metadata embedded in token.

#### FPubnubGrantTokenPermissions

- Channels (TArray<FChannelGrant>): Exact channel names → resources.channels.
- ChannelGroups (TArray<FChannelGroupGrant>): Exact group names → resources.groups.
- Users (TArray<FUserGrant>): Exact user IDs → resources.uuids.
- ChannelPatterns (TArray<FChannelGrant>): RegEx patterns → patterns.channels.
- ChannelGroupPatterns (TArray<FChannelGroupGrant>): RegEx patterns → patterns.groups.
- UserPatterns (TArray<FUserGrant>): RegEx patterns → patterns.uuids.

#### FChannelGrant

- Channel (FString): Channel ID (for Channels) or RegEx (for ChannelPatterns).
- Permissions (FPubnubChannelPermissions): Permissions for the channel/pattern.

#### FChannelGroupGrant

- ChannelGroup (FString): Group name (for ChannelGroups) or RegEx (for ChannelGroupPatterns).
- Permissions (FPubnubChannelGroupPermissions): Permissions for the group/pattern.

#### FUserGrant

- User (FString): User ID (for Users) or RegEx (for UserPatterns).
- Permissions (FPubnubUserPermissions): Permissions for the user/pattern.

#### FPubnubChannelPermissions

- Read (bool): Subscribe, History, Presence.
- Write (bool): Publish.
- Delete (bool): History and App Context.
- Get (bool): App Context.
- Update (bool): App Context.
- Manage (bool): Channel Groups and App Context.
- Join (bool): App Context.

#### FPubnubChannelGroupPermissions

- Read (bool): Presence and history for the group.
- Manage (bool): Modify group members.

#### FPubnubUserPermissions

- Delete (bool): Delete user metadata.
- Get (bool): Retrieve user metadata.
- Update (bool): Update user metadata.

Valid grant usage
- Same permission across multiple objects:

```
`1// permission1 as applied to all channels  
2Channels = {channel1, channel2, channel3}  
3Permisions = {permission1}   
`
```

- Different permissions per object (index-aligned arrays):

```
`1// the indexes in the Channels array correspond to the indexes in the Permissions array  
2// so channel1 gets permission1, channel2 permission2, etc  
3Channels = {channel1, channel2, channel3}  
4Permisions = {permission1, permission2, permission3}  
`
```

- Invalid (mismatched counts):

```
`1// this throws an error as the permissions don't match the objects  
2Channels = {channe1, channel2, channel3}  
3Permisions = {permission1, permission2}  
`
```

### Sample code

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

Void; result via FOnGrantTokenResponse.

#### FOnGrantTokenResponse

- Result (FPubnubOperationResult): Operation result.
- Token (FString): Granted token.

#### FOnGrantTokenResponseNative

- Result (const FPubnubOperationResult&): Operation result.
- Token (FString): Granted token.

### Error responses

HTTP 400 with missing/incorrect argument details (e.g., RegEx issue, invalid timestamp, incorrect permissions).

## Revoke token

Requires Access Manager add-on

Enable token revoke in Admin Portal (Revoke v3 Token checkbox on keyset).

Disables a valid token previously obtained via GrantToken(). Use for tokens with TTL ≤ 30 days (contact support for longer TTL).

### Method(s)

```
`1PubnubSubsystem->RevokeToken(  
2  FString Token,   
3  FOnRevokeTokenResponse OnRevokeTokenResponse  
4);  
`
```

Parameters
- Token (FString): Existing token to revoke.
- OnRevokeTokenResponse (FOnRevokeTokenResponse): Result delegate; alternatively FOnRevokeTokenResponseNative for lambda.

### Sample code

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

Void; result via FOnRevokeTokenResponse.

#### FOnRevokeTokenResponse

- Result (FPubnubOperationResult): Operation result.

#### FOnRevokeTokenResponseNative

- Result (const FPubnubOperationResult&): Operation result.

### Other Examples

#### Revoke a token with lambda

##### Actor.h
  

```
1
  

```

##### Actor.cpp
  

```
1
  

```

#### Revoke a token with result struct

##### Actor.h
  

```
1
  

```

##### Actor.cpp
  

```
1
  

```

### Error responses

May return:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

Decodes a token and returns embedded permissions (useful for debugging TTL and permissions).

### Method(s)

```
`1PubnubSubsystem->ParseToken(FString Token);  
`
```

Parameters
- Token (FString): Existing token.

### Sample code

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

```
`1{  
2  "Version": 2,  
3  "Timestamp": 1752200000,  
4  "TTL": 30,  
5  "Resources": {  
6    "Channels": {  
7      "my_first_channel": {  
8        "Read": true,  
9        "Write": false,  
10        "Manage": true,  
11        "Delete": true,  
12        "Get": false,  
13        "Update": true,  
14        "Join": true  
15      }  
16    },  
17    "Uuids": {  
18      "my_first_user": {  
19        "Delete": true,  
20        "Get": false,  
21        "Update": true  
22      }  
23    }  
24  },  
25  "Patterns": {  
26    "ChannelGroups": {  
27      ".*": {  
28        "Read": true,  
29        "Manage": false  
30      }  
31    }  
32  }  
33}  
`
```
show all 33 lines

### Error responses

If parsing fails, the token may be damaged; request a new token from the server.

## Set token

Client-side method to set/update the authentication token.

### Method(s)

```
`1PubnubSubsystem->SetAuthToken(FString Token);  
`
```

Parameters
- Token (FString): Existing token.

### Sample code

#### Actor.h
  

```
1
  

```

#### Actor.cpp
  

```
1
  

```

### Returns

No return value.

Last updated on Sep 3, 2025