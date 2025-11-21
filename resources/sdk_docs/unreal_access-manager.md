# Access Manager v3 API for Unreal SDK

Access Manager enforces client access to PubNub resources via time-limited tokens with embedded permissions. Tokens can:
- Apply for a limited period (TTL).
- Target specific resources via lists or RegEx patterns.
- Carry different permissions for different resources in a single grant.
- Be restricted to a single client using the authorizedUuid/AuthorizedUser.

User ID / UUID
- User ID is also referred to as UUID/uuid in some APIs; it holds the value of userId set during initialization.

You can use PubNub via Blueprints or C++.

In Blueprints, the whole SDK is managed by a subsystem, so start by calling the Pubnub Subsystem node.

In a C++ project, add a dependency to PubnubLibrary:

In your IDE, navigate to Source/_{YourProject}_/_{YourProject}_.Build.cs and add a dependency to PubnubLibrary.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run the project.

In C++, use the PubNub SDK via Game Instance Subsystem:

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

### Usage in Blueprints and C++

## Grant token

Requires Access Manager add-on
- Enable Access Manager for your key in the Admin Portal.

Requires Secret Key authentication
- Use a server/admin instance initialized with a Secret Key.

GrantToken generates a time-limited token defining TTL, AuthorizedUser, and permissions for resources:
- Channels
- ChannelGroups
- Uuids (users’ object metadata)

Only the AuthorizedUser can use the token. Unauthorized or invalid token requests return 403.

Permissions supported per resource:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete
For operation mapping, see Manage Permissions with Access Manager v3.

TTL
- Required; minutes until expiration. Max 43,200 (30 days).
- Recommended: 10–60 minutes; refresh before expiry.

RegEx
- Define permissions using resource name patterns with regular expressions.

Authorized User ID
- Restrict tokens to a single AuthorizedUser to prevent impersonation. If not set, any User ID can use the token.

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

- Ttl (int): TTL in minutes.
- AuthorizedUser (FString): The authorized User ID.
- Permissions (const FPubnubGrantTokenPermissions&): Permissions for resources.
- OnGrantTokenResponse (FOnGrantTokenResponse): Result delegate. You can also use FOnGrantTokenResponseNative for a lambda.
- Meta (FString): Additional metadata included in the token.

#### FPubnubGrantTokenPermissions

- Channels (TArray<FChannelGrant>): Exact channel names and permissions (resources.channels).
- ChannelGroups (TArray<FChannelGroupGrant>): Exact channel group names and permissions (resources.groups).
- Users (TArray<FUserGrant>): Exact user IDs and permissions (resources.uuids).
- ChannelPatterns (TArray<FChannelGrant>): Channel regex patterns and permissions (patterns.channels).
- ChannelGroupPatterns (TArray<FChannelGroupGrant>): Channel group regex patterns and permissions (patterns.groups).
- UserPatterns (TArray<FUserGrant>): User ID regex patterns and permissions (patterns.uuids).

#### FChannelGrant

- Channel (FString): Channel ID (for Channels) or regex pattern (for ChannelPatterns).
- Permissions (FPubnubChannelPermissions): Permissions for the channel/pattern.

#### FChannelGroupGrant

- ChannelGroup (FString): Channel group name (for ChannelGroups) or regex pattern (for ChannelGroupPatterns).
- Permissions (FPubnubChannelGroupPermissions): Permissions for the group/pattern.

#### FUserGrant

- User (FString): User ID (for Users) or regex pattern (for UserPatterns).
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

- Read (bool): Presence and history access for the group.
- Manage (bool): Modify members of the group.

#### FPubnubUserPermissions

- Delete (bool): Delete user metadata.
- Get (bool): Retrieve user metadata.
- Update (bool): Update user metadata.

Specify permissions for at least one user, channel, or group (via list or pattern). You can:

Apply the same permission to multiple objects:

```
`1// permission1 as applied to all channels  
2Channels = {channel1, channel2, channel3}  
3Permisions = {permission1}   
`
```

Apply different permissions to multiple objects:

```
`1// the indexes in the Channels array correspond to the indexes in the Permissions array  
2// so channel1 gets permission1, channel2 permission2, etc  
3Channels = {channel1, channel2, channel3}  
4Permisions = {permission1, permission2, permission3}  
`
```

If counts mismatch, an error is thrown:

```
`1// this throws an error as the permissions don't match the objects  
2Channels = {channe1, channel2, channel3}  
3Permisions = {permission1, permission2}  
`
```

### Sample code

Reference code
- Set up your Unreal project and follow the ACTION REQUIRED lines before running.

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

This function is void; the delegate returns FOnGrantTokenResponse.

#### FOnGrantTokenResponse

- Result (FPubnubOperationResult): Operation result.
- Token (FString): Granted token.

#### FOnGrantTokenResponseNative

- Result (const FPubnubOperationResult&): Operation result.
- Token (FString): Granted token.

### Other examples

Reference code
- Set up your Unreal project and follow the ACTION REQUIRED lines before running.

#### Grant an authorized client different levels of access to various resources in a single call

Grants my-authorized-user:
- Read: channel-a, channel-group-b; Get: user-c.
- Read/Write: channel-b, channel-c, channel-d; Get/Update: user-d.

#### Actor.h

  

```
1
  

```

#### Actor.cpp

  

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

Grants my-authorized-user read access to channels matching channel-[A-Za-z0-9].

#### Actor.h

  

```
1
  

```

#### Actor.cpp

  

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

Grants my-authorized-user:
- Read: channel-a, channel-group-b; Get: user-c.
- Read/Write: channel-b, channel-c, channel-d; Get/Update: user-d.
- Read: channels matching channel-[A-Za-z0-9].

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

### Error responses

Invalid requests return HTTP 400 with a message (e.g., RegEx issue, invalid timestamp, incorrect permissions).

## Revoke token

Requires Access Manager add-on
- Enable Access Manager for your key in the Admin Portal.

Enable token revoke
- In the Admin Portal, enable Revoke v3 Token in the ACCESS MANAGER section.

RevokeToken disables an existing valid token previously obtained using GrantToken. Use for TTL ≤ 30 days; for longer TTL, contact support. See Revoke permissions.

### Method(s)

```
`1PubnubSubsystem->RevokeToken(  
2  FString Token,   
3  FOnRevokeTokenResponse OnRevokeTokenResponse  
4);  
`
```

- Token (FString): Existing token with embedded permissions.
- OnRevokeTokenResponse (FOnRevokeTokenResponse): Result delegate. You can also use FOnRevokeTokenResponseNative for a lambda.

### Sample code

Reference code
- Set up your Unreal project and follow the ACTION REQUIRED lines before running.

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

This function is void; the delegate returns FOnRevokeTokenResponse.

#### FOnRevokeTokenResponse

- Result (FPubnubOperationResult): Operation result.

#### FOnRevokeTokenResponseNative

- Result (const FPubnubOperationResult&): Operation result.

### Other Examples

Reference code
- Set up your Unreal project and follow the ACTION REQUIRED lines before running.

#### Revoke a token with lambda

You can use a lambda function to handle the response:

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

#### Revoke a token with result struct

You can use the result struct to handle the response:

##### Actor.h

  

```
1
  

```

##### Actor.cpp

  

```
1
  

```

### Error responses

Errors may include:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken decodes an existing token and returns its embedded permissions and TTL.

### Method(s)

```
`1PubnubSubsystem->ParseToken(FString Token);  
`
```

- Token (FString): Existing token with embedded permissions.

### Sample code

Reference code
- Set up your Unreal project and follow the ACTION REQUIRED lines before running.

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

If parsing fails, the token may be damaged; request a new one from the server.

## Set token

SetAuthToken updates the client’s authentication token.

### Method(s)

```
`1PubnubSubsystem->SetAuthToken(FString Token);  
`
```

- Token (FString): Existing token with embedded permissions.

### Sample code

Reference code
- Set up your Unreal project and follow the ACTION REQUIRED lines before running.

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

This method doesn't return any response value.

Last updated on Sep 3, 2025