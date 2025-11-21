# Access Manager v3 API for Unity SDK

Access Manager enforces client access control to PubNub resources using server-issued, time-limited tokens with embedded permissions. Tokens can target individual resources or RegEx patterns and can bundle different permission levels for multiple resources in a single request. You can restrict a token to a single client via authorizedUuid.

User ID / UUID
- User ID may be referred to as UUID/uuid in APIs and responses but holds the value of the userId set during initialization.

## Grant token

Requires Access Manager add-on
Requires Secret Key authentication (initialize with Secret Key on your keyset).

Generates a time-limited token with:
- TTL (required, in minutes)
- AuthorizedUuid (optional but recommended for security)
- Permissions for:
  - Channels
  - ChannelGroups
  - Uuids (users’ object metadata)

Only AuthorizedUuid can use the token. Unauthorized or invalid tokens result in HTTP 403.

Permissions per resource
- Channels: read, write, get, manage, update, join, delete
- Groups: read, manage
- Uuids: get, update, delete
For mapping to API operations, see Manage Permissions with Access Manager v3.

TTL
- Required; minutes the token remains valid.
- Minimum 1; maximum 43,200 (30 days). No default.

Patterns (RegEx)
- Grant permissions using RegEx patterns for each resource type.

AuthorizedUuid
- Restrict token usage to a specific UUID; otherwise, any UUID can use it.

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
- TTL (int) — Required. Minutes token is valid. Min 1; Max 43,200.
- Meta (Dictionary<string, object>) — Extra scalar-only metadata (no arrays/objects).
- AuthorizedUuid (string) — Single UUID authorized to use the token.
- Resources (PNTokenResources) — Channel, group, and UUID permissions.
- Patterns (PNTokenPatterns) — Permissions applied to resources matching RegEx patterns.
- QueryParam (Dictionary<string, object>) — Additional query string params (debug).
- Execute (System.Action) — Callback with PNAccessManagerTokenResult.
- ExecuteAsync — Returns Task<PNResult<PNAccessManagerTokenResult>>.

PNTokenResources
- Channels: Dictionary<string, PNTokenAuthValues>
- ChannelGroups: Dictionary<string, PNTokenAuthValues>
- Uuids: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns
- Channels: Dictionary<string, PNTokenAuthValues>
- ChannelGroups: Dictionary<string, PNTokenAuthValues>
- Uuids: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues (bool flags)
- Read (Subscribe, History, Presence)
- Write (Publish)
- Manage (Channel Groups, App Context)
- Delete (History, App Context)
- Get (App Context)
- Update (App Context)
- Join (App Context)

Required key/value mappings
- Specify permissions for at least one UUID, channel, or group (resources or patterns).

### Sample code

Reference code (ready to run, includes imports and console logging):

```
1
  

```

### Returns

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult
- Token (string): current token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdY IGOAeTyWGJI"}  
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

HTTP 400 with details for invalid requests (e.g., RegEx, invalid timestamp, or permission issues).

## Revoke token

Requires Access Manager add-on

Enable token revoke in Admin Portal (ACCESS MANAGER → Revoke v3 Token).

RevokeToken() disables a valid token (previously granted). Use for tokens with TTL ≤ 30 days; for longer TTLs, contact support.

### Method(s)

```
`1pubnub.RevokeToken()  
2    .Token(string)  
3    .QueryParam(Dictionarystring, object>)  
4    .Execute(System.ActionPNAccessManagerRevokeTokenResult, PNStatus>)  
`
```

Parameters
- Token (string) — Existing token to revoke.
- QueryParam (Dictionary<string, object>) — Additional query string params (debug).
- Execute (System.Action) — Callback with PNAccessManagerRevokeTokenResult.
- ExecuteAsync — Returns Task<PNResult<PNAccessManagerRevokeTokenResult>>.

### Sample code

```
1
  

```

### Returns

RevokeToken() returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result (PNAccessManagerRevokeTokenResult) — Empty object on success.
- Status (PNStatus)

### Error Responses

- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

ParseToken() decodes a token and returns embedded permissions and details (useful for debugging and TTL checks).

### Method(s)

```
`1ParseToken(String token)  
`
```

Parameter
- token (String) — Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

```
1
  

```

TokenContents
- Resources (TokenResources) — Resource permissions (by sequence).
- Patterns (TokenPatterns) — Permissions expressed as RegEx.
- Meta (Dictionary<string, object>) — Extra scalar-only metadata.
- Signature (string) — HMAC+SHA256 signed with PubNub confidential key.
- Version (int) — Token structure version.
- Timestamp (long) — Server time when token was created.
- TTL (int) — Minutes valid; min 1, max 43,200.
- AuthorizedUUID (string) — Sole UUID authorized to use the token.

TokenResources
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (used in Objects v2 operations)

TokenPatterns
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (used in Objects v2 operations)

TokenAuthValues (bool flags)
- Read, Write, Manage, Delete, Get, Update, Join

### Error Responses

If parsing fails, the token might be damaged; request a new one from the server.

## Set token

SetAuthToken() updates the client's current authentication token.

### Method(s)

```
`1SetAuthToken(String token)  
`
```

Parameter
- token (String) — Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

## Grant token - spaces & users (deprecated)

Requires Access Manager add-on

Generates a token with TTL, AuthorizedUserId, and permissions for:
- Spaces
- Users (user metadata)

Only AuthorizedUserId can use the token. Unauthorized/invalid usage returns HTTP 403.

Permissions - spaces & users
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

TTL - spaces & users
- Required; minutes. Max 43,200 (30 days).

RegEx - spaces & users
- Grant permissions using RegEx patterns.

Authorized user ID - spaces & users
- Restrict token usage to a single AuthorizedUserId.

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
- TTL (int) — Required. Min 1; Max 43,200.
- Meta (Dictionary<string, object>) — Extra scalar-only metadata.
- AuthorizedUserId (string) — Single Uuid authorized to use the token.
- Resources (PNTokenResources)
- Patterns (PNTokenPatterns)
- QueryParam (Dictionary<string, object>)
- Execute (PNCallback) — System.Action of type PNAccessManagerTokenResult.
- ExecuteAsync — Returns Task<PNResult<PNAccessManagerTokenResult>>.

PNTokenResources
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues (bool flags)
- Read, Write, Manage, Delete, Get, Update, Join

Required key/value mappings
- Specify permissions for at least one User or Space (resources or patterns).

### Sample code - spaces & users (deprecated)

```
1
  

```

### Returns - spaces & users (deprecated)

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult
- Token (string): current token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples - spaces & users (deprecated)

Grant an authorized client different levels of access to various resources in a single call

```
1
  

```

Grant an authorized client read access to multiple spaces using RegEx

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call

```
1
  

```

### Error Responses - spaces & users (deprecated)

HTTP 400 with details for missing/incorrect arguments (e.g., RegEx, timestamp, permissions).