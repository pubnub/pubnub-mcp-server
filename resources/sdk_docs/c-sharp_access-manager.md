# Access Manager v3 API for C# SDK (Condensed)

Access Manager issues time-limited tokens with embedded permissions for PubNub resources. Tokens can target specific resources or RegEx patterns and can be restricted to a single client via AuthorizedUuid.

- Supports limiting access duration (TTL).
- Supports resource lists and RegEx patterns.
- Supports mixed permissions per resource in one request.
- authorizedUuid restricts token use to a single userId (UUID).

User ID / UUID
- Some APIs refer to userId as UUID/uuid. UUID value equals the userId set during initialization.

Request execution
- Use try/catch. SDK throws exceptions on invalid parameters; server/network errors are in PNStatus.

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

Requires:
- Access Manager add-on enabled in Admin Portal.
- Server-side Secret Key initialization.

Generates a token with:
- TTL (minutes, required).
- AuthorizedUuid (optional but recommended to bind token to one client).
- Permissions over resources:
  - Channels
  - ChannelGroups
  - Uuids (objects metadata)

Unauthorized/invalid tokens return 403.

Permissions per resource:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

TTL
- Required; minutes the token is valid.
- Min 1, max 43,200 (30 days).

RegEx patterns
- Set permissions by matching resource names with patterns.

AuthorizedUuid
- Restrict token use to a single client UUID. If omitted, token can be used by any UUID.

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

Parameters
- TTL (int, required): Token lifetime in minutes. Min 1, max 43,200.
- AuthorizedUuid (string): UUID authorized to use this token.
- Resources (PNTokenResources): Channel, channel group, and UUID permissions.
- Patterns (PNTokenPatterns): RegEx-based permissions for channels, channel groups, and UUIDs.
- Meta (Dictionary<string, object>): Scalar-only metadata (no arrays/objects).
- Execute (PNCallback): PNCallback of type PNAccessManagerTokenResult.
- ExecuteAsync: Returns PNResult<PNAccessManagerTokenResult>.

PNTokenResources
- Channels: Dictionary<string, PNTokenAuthValues>
- ChannelGroups: Dictionary<string, PNTokenAuthValues>
- Uuids: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns
- Channels: Dictionary<string, PNTokenAuthValues>
- ChannelGroups: Dictionary<string, PNTokenAuthValues>
- Uuids: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues
- Read (bool): Subscribe, History, Presence
- Write (bool): Publish
- Manage (bool): Channel Groups, App Context
- Delete (bool): History, App Context
- Get (bool): App Context
- Update (bool): App Context
- Join (bool): App Context

Required key/value mappings
- Specify at least one permission on a UUID, channel, or group via Resources or Patterns.

### Sample code

Reference code

```
1
  

```

### Returns

GrantToken returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult): Token data.
- Status (PNStatus): Operation status.

PNAccessManagerTokenResult
- Token (String): Current token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

Grant an authorized client different levels of access to various resources in a single call

```
1
  

```

Grant an authorized client read access to multiple channels using RegEx

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
1
  

```

### Error responses

400 Bad Request with a message indicating invalid/missing arguments (e.g., RegEx errors, invalid timestamp, or permissions).

## Revoke token

Requirements:
- Access Manager add-on enabled.
- Revoke v3 Token enabled in Admin Portal (ACCESS MANAGER section).

RevokeToken disables a previously granted token. Only valid tokens from GrantToken can be revoked. Supported for TTL ≤ 30 days; contact support for longer TTLs.

### Method(s)

```
`1pubnub.RevokeToken()  
2        .Token(string)  
3        .QueryParam(Dictionarystring, object>)  
`
```

Parameters
- Token (string, required): Existing token to revoke.
- Execute (PNCallback): PNCallback of type PNAccessManagerRevokeTokenResult.
- ExecuteAsync: Returns PNResult<PNAccessManagerRevokeTokenResult>.

### Sample code

```
1
  

```

### Returns

RevokeToken returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result: Empty object on success.
- Status (PNStatus): Status for success/failure.

### Error Responses
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken decodes a token to inspect embedded permissions and TTL. Useful for debugging.

### Method(s)

```
`1ParseToken(String token)  
`
```

Parameters
- token (String, required): Token with embedded permissions.

### Sample code

```
1
  

```

### Returns

```
1
  

```

### Error Responses

If parsing fails, the token may be damaged; request a new token.

## Set token

SetAuthToken updates the client's current authentication token.

### Method(s)

```
`1SetAuthToken(String token)  
`
```

Parameters
- token (String, required)

### Sample code

```
1
  

```

### Returns

No return value.

## Grant token - spaces & users (deprecated)

Deprecated: Use GrantToken() with channels/channel groups/uuids.

Requirements:
- Access Manager add-on enabled.

Generates token with TTL, AuthorizedUserId, and permissions for:
- Spaces
- Users (user metadata)

Permissions
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

TTL
- Required; min 1, max 43,200 minutes.

RegEx
- Use Patterns to apply permissions by pattern.

Authorized user ID
- AuthorizedUserId restricts token to a single userId.

### Method(s) - spaces & users (deprecated)

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

Parameters
- TTL (int, required): Min 1, max 43,200.
- AuthorizedUserId (string): Single userId authorized to use token.
- Resources (PNTokenResources): Spaces and Users permissions.
- Patterns (PNTokenPatterns): RegEx permissions for Spaces and Users.
- Meta (Dictionary<string, object>): Scalars only.
- Execute (PNCallback): PNAccessManagerTokenResult.
- ExecuteAsync: Returns PNResult<PNAccessManagerTokenResult>.

PNTokenResources
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues
- Read, Write, Manage, Delete, Get, Update, Join (bool)

Required key/value mappings
- Specify at least one permission on a Space or User via Resources or Patterns.

### Sample code - spaces & users (deprecated)

```
1
  

```

### Returns - spaces & users (deprecated)

GrantToken returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult
- Token (String)

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples - spaces & users (deprecated)

Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)

```
1
  

```

Grant an authorized client read access to multiple spaces using RegEx - spaces & users (deprecated)

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call - spaces & users (deprecated)

```
1
  

```

### Error responses - spaces & users (deprecated)

400 Bad Request with diagnostic message for invalid/missing arguments (e.g., RegEx, invalid timestamp, incorrect permissions).

Last updated on Sep 3, 2025