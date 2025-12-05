# Access Manager v3 API for Unity SDK

Access Manager enforces client access to PubNub resources with time-limited tokens containing embedded permissions. Grants can target:
- Specific resources (channels, groups, UUIDs)
- RegEx-based patterns
- Different permission levels in a single request
- A specific authorized UUID

User ID / UUID
- User ID is also referred to as UUID/uuid in some APIs. It holds the value of the userId set during initialization.

## Grant token

Requires Access Manager add-on
- Enable Access Manager for your key in the Admin Portal.

Requires Secret Key authentication
- Granting must be done with an SDK initialized using a Secret Key.

GrantToken generates a time-limited token with:
- TTL (required)
- AuthorizedUuid (optional but recommended)
- Resource permissions for:
  - Channels
  - ChannelGroups
  - Uuids (Users’ object metadata)

Permissions by resource
- Channels: read, write, get, manage, update, join, delete
- Groups: read, manage
- Uuids: get, update, delete

TTL
- Required, in minutes; min 1, max 43,200 (30 days).

RegEx patterns
- Use Patterns to apply permissions to sets of resources via regular expressions.

Authorized UUID
- Restricts token usage to a single UUID; otherwise token is usable by any client UUID.

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

Parameters
- TTL (int, required): Token validity in minutes. Min 1; max 43,200.
- Meta (Dictionary<string, object>): Scalar-only metadata (no arrays/objects).
- AuthorizedUuid (string): Single UUID allowed to use the token.
- Resources (PNTokenResources): Channel, channel group, and UUID metadata permissions.
- Patterns (PNTokenPatterns): RegEx-based permissions for channels, groups, UUIDs.
- QueryParam (Dictionary<string, object>): Extra query params (debug).
- Execute (System.Action): Callback of type PNAccessManagerTokenResult.
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerTokenResult>>.

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
- Manage (bool): Channel Groups and App Context
- Delete (bool): History and App Context
- Get (bool): App Context
- Update (bool): App Context
- Join (bool): App Context

Required key/value mappings
- You must specify permissions for at least one UUID, channel, or group, via Resources or Patterns.

### Sample code

Reference code
```
1
  

```

### Returns

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult): The token result.
- Status (PNStatus): Operation status.

PNAccessManagerTokenResult
- Token (String): Current token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

Grant an authorized client different levels of access to various resources in a single call
- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d

```
1
  

```

Grant an authorized client read access to multiple channels using RegEx
- Grants my-authorized-uuid Read to channels matching channel-[A-Za-z0-9]

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d
  - Read: channels matching channel-[A-Za-z0-9]

```
1
  

```

### Error responses

- 400 Bad Request: invalid/missing arguments (e.g., RegEx, invalid timestamp, permissions).

## Revoke token

Requires Access Manager add-on
- Enable in Admin Portal.

Enable token revoke
- In Admin Portal, enable “Revoke v3 Token” on the keyset.

RevokeToken disables a valid token obtained from GrantToken. Use for TTL ≤ 30 days (contact support for longer TTL).

### Method(s)

```
`1pubnub.RevokeToken()  
2    .Token(string)  
3    .QueryParam(Dictionarystring, object>)  
4    .Execute(System.ActionPNAccessManagerRevokeTokenResult, PNStatus>)  
`
```

Parameters
- Token (string, required): Existing token to revoke.
- QueryParam (Dictionary<string, object>): Extra query params (debug).
- Execute (System.Action): Callback of type PNAccessManagerRevokeTokenResult.
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerRevokeTokenResult>>.

### Sample code

```
1
  

```

### Returns

RevokeToken() returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result (PNAccessManagerRevokeTokenResult): Empty object on success.
- Status (PNStatus): Operation status.

### Error Responses

- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken decodes a token and returns its embedded permissions and metadata.

### Method(s)

```
`1ParseToken(String token)  
`
```

Parameters
- token (String, required): Token to decode.

### Sample code

```
1
  

```

### Returns

```
1
  

```

TokenContents
- Resources (TokenResources): Resource permissions by sequence.
- Patterns (TokenPatterns): Resource permissions by RegEx.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- Signature (string): HMAC+SHA256 using PubNub signing key.
- Version (int): Token structure version.
- Timestamp (long): Server time when token created.
- TTL (int): Minutes valid; min 1, max 43,200.
- AuthorizedUUID (string): UUID authorized to use the token.

TokenResources
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (used in Objects v2)

TokenPatterns
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (used in Objects v2)

TokenAuthValues
- Read (bool)
- Write (bool)
- Manage (bool)
- Delete (bool)
- Get (bool)
- Update (bool)
- Join (bool)

### Error Responses

- Parsing errors may indicate a damaged token; request a new one from the server.

## Set token

SetAuthToken is used by clients to update the current authentication token.

### Method(s)

```
`1SetAuthToken(String token)  
`
```

Parameters
- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

- No return value.

## Grant token - spaces & users (deprecated)

Requires Access Manager add-on
- Enable Access Manager in Admin Portal.

Deprecated path for Spaces and Users metadata:
- GrantToken with TTL, AuthorizedUserId, and permissions for:
  - Spaces
  - Users (metadata)

Permissions - spaces & users (deprecated)
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

TTL - spaces & users (deprecated)
- Required; min 1, max 43,200 (30 days).

RegEx - spaces & users (deprecated)
- Use Patterns to apply permissions via regular expressions.

Authorized user ID - spaces & users (deprecated)
- AuthorizedUserId restricts token usage to a single userId.

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

Parameters
- TTL (int, required): Minutes valid; min 1; max 43,200.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- AuthorizedUserId (string): Single userId authorized to use the token.
- Resources (PNTokenResources): Spaces and Users permissions.
- Patterns (PNTokenPatterns): RegEx-based permissions for Spaces and Users.
- QueryParam (Dictionary<string, object>): Extra query params (debug).
- Execute (PNCallback/System.Action): Callback of type PNAccessManagerTokenResult.
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerTokenResult>>.

PNTokenResources (deprecated)
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns (deprecated)
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues (deprecated)
- Read (bool)
- Write (bool)
- Manage (bool)
- Delete (bool)
- Get (bool)
- Update (bool)
- Join (bool)

Required key/value mappings
- Specify permissions for at least one User or Space via Resources or Patterns.

### Sample code - spaces & users (deprecated)

```
1
  

```

### Returns - spaces & users (deprecated)

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult
- Token (String)

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples - spaces & users (deprecated)

Grant an authorized client different levels of access to various resources in a single call
- Grants my-authorized-userId:
  - Read: space-a; Get: userId-c
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d

```
1
  

```

Grant an authorized client read access to multiple spaces using RegEx
- Grants my-authorized-userId Read to spaces matching space-[A-Za-z0-9]

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call
- Grants my-authorized-userId:
  - Read: space-a and userId-c
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d
  - Read: spaces matching space-[A-Za-z0-9]

```
1
  

```

### Error Responses - spaces & users (deprecated)

- 400 Bad Request: invalid/missing arguments (RegEx, timestamp, permissions).

Last updated on Sep 3, 2025