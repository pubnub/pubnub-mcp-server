# Access Manager v3 API for Unreal SDK

Access Manager (AM) lets servers grant time-limited tokens with embedded permissions for PubNub resources:
- Limited duration (TTL)
- Resource lists or RegEx patterns
- Multiple resources/permission levels in a single request
- Restrict to a single client via authorized user ID

You can add the authorizedUuid parameter to the grant request to restrict the token usage to one client (User ID/UUID). Only that authorized user can use the token.

User ID / UUID
- Some APIs refer to User ID as UUID/uuid. It holds the value of the userId set during initialization.

Usage in Blueprints and C++
- In Blueprints, use the Pubnub Subsystem node.
- In C++, add PubnubLibrary dependency and use the Game Instance Subsystem.

In your IDE, navigate to Source/YourProject/YourProject.Build.cs and add:
```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```
Compile and run.

Use the subsystem:
```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example:
```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

## Grant token

Requires:
- Access Manager add-on enabled on the keyset (Admin Portal).
- Server-side (administrator) initialization with a Secret Key.

GrantToken() issues a time-limited token with TTL, AuthorizedUser, and permissions over:
- Channels
- ChannelGroups
- Uuids (users’ object metadata)

Only the AuthorizedUser can use the token. Unauthorized/invalid use returns HTTP 403.

Permissions per resource:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

TTL:
- Required, in minutes; max 43,200 (30 days)
- Recommended: 10–60 minutes
- Client must obtain a new token before TTL expires

RegEx:
- You can grant permissions using patterns for channels, channel groups, and users.

Authorized User ID:
- Restrict tokens to a specific client device/user to prevent impersonation. If not set, any user can use the token.

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

Parameters:
- Ttl (int): Time-To-Live in minutes.
- AuthorizedUser (FString): Authorized User ID for the token.
- Permissions (const FPubnubGrantTokenPermissions&): Permissions for resources.
- OnGrantTokenResponse (FOnGrantTokenResponse): Delegate callback. You can also use FOnGrantTokenResponseNative (lambda).
- Meta (FString): Optional metadata included in the token.

#### FPubnubGrantTokenPermissions
- Channels (TArray<FChannelGrant>): Exact channel names and permissions (resources.channels).
- ChannelGroups (TArray<FChannelGroupGrant>): Exact channel group names and permissions (resources.groups).
- Users (TArray<FUserGrant>): Exact user IDs and permissions (resources.uuids).
- ChannelPatterns (TArray<FChannelGrant>): Channel name RegEx patterns and permissions (patterns.channels).
- ChannelGroupPatterns (TArray<FChannelGroupGrant>): Channel group RegEx patterns and permissions (patterns.groups).
- UserPatterns (TArray<FUserGrant>): User ID RegEx patterns and permissions (patterns.uuids).

#### FChannelGrant
- Channel (FString): Channel ID (for Channels) or RegEx (for ChannelPatterns).
- Permissions (FPubnubChannelPermissions)

#### FChannelGroupGrant
- ChannelGroup (FString): Channel Group name (for ChannelGroups) or RegEx (for ChannelGroupPatterns).
- Permissions (FPubnubChannelGroupPermissions)

#### FUserGrant
- User (FString): User ID (for Users) or RegEx (for UserPatterns).
- Permissions (FPubnubUserPermissions)

#### FPubnubChannelPermissions
- Read (bool): Subscribe, History, Presence
- Write (bool): Publish
- Delete (bool): History, App Context
- Get (bool): App Context
- Update (bool): App Context
- Manage (bool): Channel Groups, App Context
- Join (bool): App Context

#### FPubnubChannelGroupPermissions
- Read (bool): Presence and history for the group
- Manage (bool): Modify group membership

#### FPubnubUserPermissions
- Delete (bool): Delete user metadata
- Get (bool): Retrieve user metadata
- Update (bool): Update user metadata

Grant input rules:
- You must specify permissions for at least one user, channel, or group (list or pattern).
- Apply the same permission to multiple objects:
```
`1// permission1 as applied to all channels  
2Channels = {channel1, channel2, channel3}  
3Permisions = {permission1}   
`
```
- Apply different permissions per object (index-aligned):
```
`1// the indexes in the Channels array correspond to the indexes in the Permissions array  
2// so channel1 gets permission1, channel2 permission2, etc  
3Channels = {channel1, channel2, channel3}  
4Permisions = {permission1, permission2, permission3}  
`
```
- Mismatched counts throw an error:
```
`1// this throws an error as the permissions don't match the objects  
2Channels = {channe1, channel2, channel3}  
3Permisions = {permission1, permission2}  
`
```

### Sample code

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

### Returns
Void; result provided via FOnGrantTokenResponse.

#### FOnGrantTokenResponse
- Result (FPubnubOperationResult)
- Token (FString)

#### FOnGrantTokenResponseNative
- Result (const FPubnubOperationResult&)
- Token (FString)

### Other examples

Reference code

#### Grant an authorized client different levels of access to various resources in a single call
- Grants my-authorized-user:
  - Read: channel-a, channel-group-b; Get: user-c
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: user-d

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
- Grants my-authorized-user read access to channels matching channel-[A-Za-z0-9]

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
- Grants my-authorized-user:
  - Read: channel-a, channel-group-b; Get: user-c
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: user-d
  - Read: channels matching channel-[A-Za-z0-9]

##### Actor.h
```
1
  

```

##### Actor.cpp
```
1
  

```

### Error responses
HTTP 400 with descriptive message (e.g., RegEx issue, invalid timestamp, incorrect permissions).

## Revoke token

Requirements:
- Access Manager add-on enabled.
- Enable Revoke v3 Token in Admin Portal (ACCESS MANAGER section).

RevokeToken() disables an existing token (previously obtained via GrantToken). Use for tokens with TTL ≤ 30 days; for longer TTL, contact support.

### Method(s)
```
`1PubnubSubsystem->RevokeToken(  
2  FString Token,   
3  FOnRevokeTokenResponse OnRevokeTokenResponse  
4);  
`
```

Parameters:
- Token (FString): Token to revoke.
- OnRevokeTokenResponse (FOnRevokeTokenResponse): Delegate callback. You can also use FOnRevokeTokenResponseNative (lambda).

### Sample code

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

### Returns
Void; result provided via FOnRevokeTokenResponse.

#### FOnRevokeTokenResponse
- Result (FPubnubOperationResult)

#### FOnRevokeTokenResponseNative
- Result (const FPubnubOperationResult&)

### Other Examples

Reference code

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
Possible errors:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken() decodes an existing token and returns its embedded permissions and TTL for debugging.

### Method(s)
```
`1PubnubSubsystem->ParseToken(FString Token);  
`
```

Parameters:
- Token (FString): Existing token.

### Sample code

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

### Error responses
If parsing fails, the token may be damaged; obtain a new token from the server.

## Set token

SetAuthToken() updates the client’s authentication token.

### Method(s)
```
`1PubnubSubsystem->SetAuthToken(FString Token);  
`
```

Parameters:
- Token (FString): Existing token.

### Sample code

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

### Returns
No return value.

Last updated on Sep 3, 2025