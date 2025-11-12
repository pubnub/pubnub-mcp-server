# Access Manager v3 API for Unity SDK (Condensed)

Access Manager secures client access to PubNub resources by issuing time-limited tokens with embedded permissions. Tokens can target individual resources or RegEx patterns and can restrict use to a specific client UUID.

- Supports: per-resource permissions, single-call mixed permissions, TTL, RegEx patterns, authorized UUID binding.
- Resources: Channels, Channel Groups, UUIDs (user metadata).
- User ID / UUID: Some APIs refer to UUID/uuid; its value is the userId you set during initialization.

## Grant token

Requires:
- Access Manager add-on enabled in Admin Portal.
- Secret Key initialization for the granting server SDK instance.

Generates a token with TTL, AuthorizedUuid, and permissions for Channels, ChannelGroups, and Uuids. Only the AuthorizedUuid (if set) can use the token. Unauthorized or invalid token requests return 403.

Permissions by resource:
- Channels: read, write, get, manage, update, join, delete
- Groups: read, manage
- Uuids: get, update, delete

TTL:
- Required for every grant.
- Minutes; min 1, max 43,200 (30 days); no default.

RegEx patterns:
- Use Patterns to apply permissions to resources matching a RegEx.

Authorized UUID:
- Restricts token to a single client UUID; recommended to prevent impersonation.

### Method(s)

```
`1pubnub.GrantToken()  
2    .TTL(int)  
3    .Meta(Dictionarystring, object>)  
4    .AuthorizedUuid(string)  
5    .Resources(PNTokenResources)  
6    .Patterns(PNTokenPatterns)  
7    .QueryParam(Dictionarystring,object>)  
8    .Execute(System.ActionPNAccessManagerTokenResult, PNStatus>)  
`
```

Parameters:
- TTL (int, required): Minutes token is valid. Min 1, max 43,200.
- Meta (Dictionary<string, object>): Scalar-only metadata; no arrays/objects.
- AuthorizedUuid (string): Single UUID allowed to use the token.
- Resources (PNTokenResources): Explicit permissions for channels, channel groups, UUID metadata.
- Patterns (PNTokenPatterns): RegEx-based permissions for channels, channel groups, UUID metadata.
- QueryParam (Dictionary<string, object>): Extra query params for debugging.
- Execute (System.Action of PNAccessManagerTokenResult, PNStatus).
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerTokenResult>>.

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

Required:
- Provide at least one permission mapping for a UUID, channel, or group (resources or patterns).

### Sample code

Reference code:
```
1
  

```

### Returns

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult): Contains:
  - Token (String): Current token with embedded permissions.
```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```
- Status (PNStatus)

### Other examples

Grant an authorized client different levels of access to various resources in a single call:
- Grants my-authorized-uuid:
  - Read access to channel-a, channel-group-b, and get to uuid-c.
  - Read/write access to channel-b, channel-c, channel-d, and get/update to uuid-d.
```
1
  

```

Grant an authorized client read access to multiple channels using RegEx:
- Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].
```
1
  

```

Grant different access to various resources and read RegEx channels in a single call:
- Grants my-authorized-uuid:
  - Read access to channel-a, channel-group-b, and get to uuid-c.
  - Read/write access to channel-b, channel-c, channel-d, and get/update to uuid-d.
  - Read access to channels matching channel-[A-Za-z0-9].
```
1
  

```

### Error responses

Invalid requests return HTTP 400 with details (e.g., RegEx issue, invalid timestamp, incorrect permissions).

## Revoke token

Requires:
- Access Manager add-on enabled.
- Revoke v3 Token enabled in Admin Portal (ACCESS MANAGER section).

RevokeToken() disables an existing token previously obtained with GrantToken(). Use for tokens with TTL ≤ 30 days; for longer TTL, contact support.

### Method(s)

```
`1pubnub.RevokeToken()  
2    .Token(string)  
3    .QueryParam(Dictionarystring, object>)  
4    .Execute(System.ActionPNAccessManagerRevokeTokenResult, PNStatus>)  
`
```

Parameters:
- Token (string, required): Existing token to revoke.
- QueryParam (Dictionary<string, object>): Debug query params.
- Execute (System.Action of PNAccessManagerRevokeTokenResult).
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerRevokeTokenResult>>.

### Sample code

```
1
  

```

### Returns

RevokeToken() returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result: Empty PNAccessManagerRevokeTokenResult on success.
- Status: PNStatus

### Error Responses

Possible errors:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken() decodes a token to inspect embedded permissions and TTL for debugging.

### Method(s)

```
`1ParseToken(String token)  
`
```

Parameter:
- token (String, required): Token to decode.

### Sample code

```
1
  

```

### Returns

```
1
  

```

TokenContents:
- Resources (TokenResources): Explicit resource permissions.
- Patterns (TokenPatterns): RegEx-based permissions.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- Signature (string): HMAC+SHA256, signed by PubNub.
- Version (int): Token structure version.
- Timestamp (long): Token creation time (server-generated).
- TTL (int): Minutes valid; min 1, max 43,200.
- AuthorizedUUID (string): Single UUID authorized to use the token.

TokenResources:
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (Objects v2)

TokenPatterns:
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (Objects v2)

TokenAuthValues:
- Read (bool), Write (bool), Manage (bool), Delete (bool), Get (bool), Update (bool), Join (bool)

### Error Responses

Parsing errors may indicate a damaged token; request a new one from the server.

## Set token

SetAuthToken() is used by clients to update the authentication token received from the server.

### Method(s)

```
`1SetAuthToken(String token)  
`
```

Parameter:
- token (String, required): Token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

## Grant token - spaces & users (deprecated)

Deprecated resources: Spaces and Users (metadata). Use Channels/Groups/UUIDs (above). Requires Access Manager add-on.

GrantToken() creates a token with TTL, AuthorizedUserId, and permissions for Spaces and Users.

Permissions:
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

TTL:
- Required; minutes; max 43,200.

RegEx:
- Use Patterns for RegEx-based permissions.

Authorized user ID:
- Restrict token to a single AuthorizedUserId to prevent impersonation.

### Method(s) - spaces & users (deprecated)

```
`1pubnub.GrantToken()  
2    .TTL(int)  
3    .Meta(Dictionarystring, object>)  
4    .AuthorizedUserId(string)  
5    .Resources(PNTokenResources)  
6    .Patterns(PNTokenPatterns)  
7    .QueryParam(Dictionarystring,object>)  
8    .Execute(System.ActionPNAccessManagerTokenResult, PNStatus>)  
`
```

Parameters:
- TTL (int, required): Minutes; min 1, max 43,200.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- AuthorizedUserId (string): Single user authorized to use token.
- Resources (PNTokenResources): Space and User permissions.
- Patterns (PNTokenPatterns): RegEx-based Space/User permissions.
- QueryParam (Dictionary<string, object>): Debug query params.
- Execute (PNCallback/System.Action of PNAccessManagerTokenResult).
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerTokenResult>>.

PNTokenResources:
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns:
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues:
- Read, Write, Manage, Delete, Get, Update, Join (bools)

Required:
- Provide at least one Space or User permission (resource or pattern).

### Sample code - spaces & users (deprecated)

```
1
  

```

### Returns - spaces & users (deprecated)

Returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult): Contains Token (String)
```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```
- Status (PNStatus)

### Other examples - spaces & users (deprecated)

Grant mixed access in a single call:
- Grants my-authorized-userId:
  - Read access to space-a and get to userId-c.
  - Read/write access to space-b, space-c, space-d, and get/update to userId-d.
```
1
  

```

Grant read access to multiple spaces using RegEx:
- Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].
```
1
  

```

Grant mixed access and RegEx-based read in one call:
- Grants my-authorized-userId:
  - Read access to space-a and userId-c.
  - Read/write access to space-b, space-c, space-d, and get/update to userId-d.
  - Read access to spaces matching space-[A-Za-z0-9].
```
1
  

```

### Error Responses - spaces & users (deprecated)

Invalid requests return 400 with details (e.g., RegEx, timestamp, permissions).

Last updated on Sep 3, 2025