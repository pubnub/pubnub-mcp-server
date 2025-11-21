# Access Manager v3 API for C# SDK

Access Manager secures client access to PubNub resources by issuing time-limited tokens with embedded permissions. Grants can target:
- Specific resources (Channels, ChannelGroups, Uuids)
- Resource patterns (RegEx)
- A specific authorized client (AuthorizedUuid)
- Different permissions for different resources in one request

You can restrict a token to a single client using the authorizedUuid parameter. Only that userId (UUID) can use the token.

##### User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and responses, and holds the value of userId set during initialization.

##### Request execution
Use try/catch with the C# SDK. Invalid parameter errors throw exceptions; server/network errors return details in PNStatus.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  
```

## Grant token

##### Requires Access Manager add-on
Enable Access Manager for your key in the Admin Portal.

##### Requires Secret Key authentication
Call from a server using a PubNub instance initialized with a Secret Key.

GrantToken() issues a token with:
- TTL (minutes, required; 1–43,200)
- AuthorizedUuid (optional; restricts token to a single UUID)
- Permissions for resources:
  - Channels
  - ChannelGroups
  - Uuids (user object metadata)

Unauthorized or invalid-token requests return HTTP 403.

Permissions per resource type:
ResourcePermissions`Channels``read`, `write`, `get`, `manage`, `update`, `join`, `delete``ChannelGroups``read`, `manage``Uuids``get`, `update`, `delete`

For mapping to API operations, see Manage Permissions with Access Manager v3.

TTL: Validity in minutes (required, max 43,200). After expiry, clients must obtain a new token.

RegEx patterns: Apply permissions via patterns for channels/channel groups/UUIDs.

AuthorizedUuid: Restrict token usage to one client to prevent impersonation.

### Method(s)
```
`1pubnub.GrantToken()  
2      .TTL(int)  
3      .Meta(Dictionarystring, object>)  
4      .AuthorizedUuid(string)  
5      .Resources(PNTokenResources)  
6      .Patterns(PNTokenPatterns)  
7      .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- TTL (int, required): Minutes the token is valid (1–43,200).
- AuthorizedUuid (string): UUID authorized to use the token.
- Resources (PNTokenResources): Permissions by specific resource.
- Patterns (PNTokenPatterns): Permissions applied by RegEx pattern.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- Execute (PNCallback): PNCallback of type PNAccessManagerTokenResult.
- ExecuteAsync: Returns PNResult<PNAccessManagerTokenResult>.

PNTokenResources:
- Channels: Dictionary<string, PNTokenAuthValues>
- ChannelGroups: Dictionary<string, PNTokenAuthValues>
- Uuids: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns:
- Channels: Dictionary<string, PNTokenAuthValues>
- ChannelGroups: Dictionary<string, PNTokenAuthValues>
- Uuids: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues:
- Read (bool): Subscribe, History, Presence
- Write (bool): Publish
- Manage (bool): Channel Groups, App Context
- Delete (bool): History, App Context
- Get (bool): App Context
- Update (bool): App Context
- Join (bool): App Context

##### Required key/value mappings
You must specify permissions for at least one UUID, channel, or group, as a resource list or RegEx pattern.

### Sample code
##### Reference code
```
1
  
```

### Returns
GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult:
- Token (String)

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call
Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; Get: uuid-c
- Read/Write: channel-b/c/d; Get/Update: uuid-d
```
1
  
```

#### Grant an authorized client read access to multiple channels using RegEx
Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].
```
1
  
```

#### Grant different levels of access to resources and read access via RegEx in one call
Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; Get: uuid-c
- Read/Write: channel-b/c/d; Get/Update: uuid-d
- Read (RegEx): channel-[A-Za-z0-9]
```
1
  
```

### Error responses
Invalid requests return HTTP 400 with details (e.g., RegEx issue, invalid timestamp, or incorrect permissions).

## Revoke token

##### Requires Access Manager add-on
Enable the add-on in Admin Portal.

##### Enable token revoke
In your app’s keyset, enable Revoke v3 Token under ACCESS MANAGER.

RevokeToken() disables an existing token (previously issued by GrantToken()) and revokes its permissions.
- Use for tokens with TTL ≤ 30 days. For longer TTLs, contact support.

### Method(s)
```
`1pubnub.RevokeToken()  
2        .Token(string)  
3        .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- Token (string, required): Existing token to revoke.
- Execute (PNCallback): PNCallback of type PNAccessManagerRevokeTokenResult.
- ExecuteAsync: Returns PNResult<PNAccessManagerRevokeTokenResult>.

### Sample code
```
1
  
```

### Returns
RevokeToken() returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result: empty PNAccessManagerRevokeTokenResult on success
- Status (PNStatus)

### Error Responses
May return:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken() decodes a token to inspect embedded permissions and TTL.

### Method(s)
```
`1ParseToken(String token)  
`
```

Parameters:
- token (String): Current token with embedded permissions.

### Sample code
```
1
  
```

### Returns
```
1
  
```

### Error Responses
Errors may indicate a damaged token; request a new one from the server.

## Set token

SetAuthToken() is used by clients to update the authentication token granted by the server.

### Method(s)
```
`1SetAuthToken(String token)  
`
```

Parameters:
- token (String): Current token with embedded permissions.

### Sample code
```
1
  
```

### Returns
No return value.

## Grant token - spaces & users (deprecated)

##### Deprecated
Use grantToken() instead.

##### Requires Access Manager add-on
Enable the add-on in Admin Portal.

GrantToken() issues a token with:
- TTL (required; 1–43,200)
- AuthorizedUserId (optional)
- Permissions for:
  - Spaces
  - Users (user metadata)

Unauthorized or invalid-token requests return HTTP 403.

##### Permissions - spaces & users (deprecated)
ResourcePermissions`Spaces``read`, `write`, `get`, `manage`, `update`, `join`, `delete``Users``get`, `update`, `delete`

##### TTL - spaces & users (deprecated)
TTL is required; max 43,200 minutes.

##### RegEx - spaces & users (deprecated)
Use Patterns to apply permissions by RegEx.

##### Authorized user ID - spaces & users (deprecated)
AuthorizedUserId restricts token usage to one client.

#### Method(s) - spaces & users (deprecated)
```
`1pubnub.GrantToken()  
2      .TTL(int)  
3      .Meta(Dictionarystring, object>)  
4      .AuthorizedUserId(string)  
5      .Resources(PNTokenResources)  
6      .Patterns(PNTokenPatterns)  
7      .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- TTL (int, required): 1–43,200 minutes.
- AuthorizedUserId (string): Authorized user ID.
- Resources (PNTokenResources): Space/User permissions.
- Patterns (PNTokenPatterns): RegEx-based permissions.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- Execute (PNCallback): PNCallback of type PNAccessManagerTokenResult.
- ExecuteAsync: Returns PNResult<PNAccessManagerTokenResult>.

PNTokenResources:
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns:
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues:
- Read, Write, Manage, Delete, Get, Update, Join (bool)

##### Required key/value mappings
Specify permissions for at least one User or Space via resource list or RegEx pattern.

#### Sample code - spaces & users (deprecated)
```
1
  
```

#### Returns - spaces & users (deprecated)
GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult:
- Token (String)
```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

#### Other examples - spaces & users (deprecated)

##### Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)
Grants my-authorized-userId:
- Read: space-a; Get: userId-c
- Read/Write: space-b/c/d; Get/Update: userId-d
```
1
  
```

##### Grant an authorized client read access to multiple spaces using RegEx - spaces & users (deprecated)
Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].
```
1
  
```

##### Grant different levels of access to resources and read via RegEx in one call - spaces & users (deprecated)
Grants my-authorized-userId:
- Read: space-a and userId-c
- Read/Write: space-b/c/d; Get/Update: userId-d
- Read (RegEx): space-[A-Za-z0-9]
```
1
  
```

#### Error responses - spaces & users (deprecated)
Invalid requests return HTTP 400 with details (e.g., RegEx issue, invalid timestamp, incorrect permissions).

Last updated on Sep 3, 2025