# Access Manager v3 API for Unreal SDK

Access Manager enforces client access security for PubNub resources by granting time-limited tokens with embedded permissions to specific resources:
- For a limited period (TTL).
- Via resource lists or regex patterns.
- In a single request with differing permission levels.

You can add the authorizedUuid parameter to restrict the token to a single client userId.

##### User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and responses but holds the value of the userId parameter set during initialization.

You can use PubNub via Blueprints or C++.

In Blueprints, use the Pubnub Subsystem node.

In C++, add a dependency to PubnubLibrary:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run.

In C++, use PubNub as a Game Instance Subsystem:

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

## Grant token

##### Requires Access Manager add-on
Enable Access Manager on your key in the Admin Portal.

##### Requires Secret Key authentication
Initialize the admin SDK instance with a Secret Key.

GrantToken generates a time-limited authorization token with:
- TTL
- AuthorizedUser
- Permissions for: Channels, ChannelGroups, Uuids

Only the AuthorizedUser can use the token until TTL expires; unauthorized/invalid requests return 403.

Permissions per resource:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

TTL:
- Required; minutes until permissions expire.
- Max 43,200 (30 days).
- Recommended 10–60.

Regex:
- Specify permissions using regex patterns for resources.

Authorized User ID:
- Restrict tokens to a single AuthorizedUser to prevent impersonation.

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

- Ttl Type: int. Token TTL in minutes.
- AuthorizedUser Type: FString. Authorized User ID for this token.
- Permissions Type: const FPubnubGrantTokenPermissions&. Permissions to apply.
- OnGrantTokenResponse Type: FOnGrantTokenResponse. Delegate for result. You can also use FOnGrantTokenResponseNative for a lambda.
- Meta Type: FString. Additional metadata included in the token.

#### FPubnubGrantTokenPermissions
- Channels Type: TArray<FChannelGrant>. Applied to resources.channels.
- ChannelGroups Type: TArray<FChannelGroupGrant>. Applied to resources.groups.
- Users Type: TArray<FUserGrant>. Applied to resources.uuids.
- ChannelPatterns Type: TArray<FChannelGrant>. Applied to patterns.channels.
- ChannelGroupPatterns Type: TArray<FChannelGroupGrant>. Applied to patterns.groups.
- UserPatterns Type: TArray<FUserGrant>. Applied to patterns.uuids.

#### FChannelGrant
- Channel FString. Exact channel or regex pattern (depending on field).
- Permissions FPubnubChannelPermissions.

#### FChannelGroupGrant
- ChannelGroup FString. Exact group or regex pattern (depending on field).
- Permissions FPubnubChannelGroupPermissions.

#### FUserGrant
- User FString. Exact user ID or regex pattern (depending on field).
- Permissions FPubnubUserPermissions.

#### FPubnubChannelPermissions
- Read bool. Subscribe, History, Presence.
- Write bool. Publish.
- Delete bool. History, App Context.
- Get bool. App Context.
- Update bool. App Context.
- Manage bool. Channel Groups, App Context.
- Join bool. App Context.

#### FPubnubChannelGroupPermissions
- Read bool. Presence and history access for the group.
- Manage bool. Modify group members.

#### FPubnubUserPermissions
- Delete bool. Delete user metadata.
- Get bool. Retrieve user metadata.
- Update bool. Update user metadata.

Specify permissions for at least one user, channel, or group (by list or regex).

Apply the same permission to multiple objects:
```
`1// permission1 as applied to all channels  
2Channels = {channel1, channel2, channel3}  
3Permisions = {permission1}   
`
```

Apply different permissions to multiple objects (array index aligned):
```
`1// the indexes in the Channels array correspond to the indexes in the Permissions array  
2// so channel1 gets permission1, channel2 permission2, etc  
3Channels = {channel1, channel2, channel3}  
4Permisions = {permission1, permission2, permission3}  
`
```

Mismatched counts throw an error:
```
`1// this throws an error as the permissions don't match the objects  
2Channels = {channe1, channel2, channel3}  
3Permisions = {permission1, permission2}  
`
```

### Sample code

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

### Returns
Void; response via FOnGrantTokenResponse.

#### FOnGrantTokenResponse
- Result FPubnubOperationResult. Operation result.
- Token FString. Granted token.

#### FOnGrantTokenResponseNative
- Result const FPubnubOperationResult&. Operation result.
- Token FString. Granted token.

### Other examples

##### Reference code

#### Grant an authorized client different levels of access to various resources in a single call
Grants my-authorized-user:
- Read: channel-a, channel-group-b; get: user-c.
- Read/write: channel-b, channel-c, channel-d; get/update: user-d.

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
Grants my-authorized-user read on channels matching channel-[A-Za-z0-9].

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
- Read: channel-a, channel-group-b; get: user-c.
- Read/write: channel-b, channel-c, channel-d; get/update: user-d.
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
400 with details for invalid request (e.g., regex issue, invalid timestamp, incorrect permissions).

## Revoke token

##### Requires Access Manager add-on
Enable Access Manager on your key.

##### Enable token revoke
Enable Revoke v3 Token in the Admin Portal.

RevokeToken disables an existing token previously obtained via GrantToken. Use for tokens with TTL ≤ 30 days; for longer TTLs, contact support.

### Method(s)

```
`1PubnubSubsystem->RevokeToken(  
2  FString Token,   
3  FOnRevokeTokenResponse OnRevokeTokenResponse  
4);  
`
```

- Token Type: FString. Existing token to revoke.
- OnRevokeTokenResponse Type: FOnRevokeTokenResponse. Delegate for result. You can also use FOnRevokeTokenResponseNative for a lambda.

### Sample code

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

### Returns
Void; response via FOnRevokeTokenResponse.

#### FOnRevokeTokenResponse
- Result FPubnubOperationResult. Operation result.

#### FOnRevokeTokenResponseNative
- Result const FPubnubOperationResult&. Operation result.

### Other Examples

##### Reference code

#### Revoke a token with lambda
You can use a lambda to handle the response:

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
May return:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken decodes a token and returns embedded permissions and TTL details.

### Method(s)

```
`1PubnubSubsystem->ParseToken(FString Token);  
`
```

- Token Type: FString. Existing token with embedded permissions.

### Sample code

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
Parsing errors may indicate a damaged token; request a new one.

## Set token

SetAuthToken is used by clients to update their authentication token.

### Method(s)

```
`1PubnubSubsystem->SetAuthToken(FString Token);  
`
```

- Token Type: FString. Existing token with embedded permissions.

### Sample code

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

### Returns
No return value.

Last updated on Sep 3, 2025