# Access Manager v3 API for Unity SDK

Access Manager lets servers grant clients time-limited tokens with embedded permissions for PubNub resources:
- Channels, Channel Groups, and UUIDs (user metadata).
- Via direct lists or RegEx patterns.
- With per-resource permission levels in a single request.
- Optional restriction to a single client via authorizedUuid.

User ID / UUID
- User ID is also referred to as UUID/uuid in some APIs and responses but holds the value of the userId you set during initialization.

## Grant token

Requires Access Manager add-on and Secret Key authentication (initialize with Secret Key in the Admin Portal keyset).

Generates a token with TTL, AuthorizedUuid, and resource permissions. Only the AuthorizedUuid can use the token. Unauthorized/invalid token requests return 403.

Supported permissions by resource:
- channels: read, write, get, manage, update, join, delete
- groups: read, manage
- uuids: get, update, delete

TTL
- Required; minutes until expiration.
- Min 1, max 43,200 (30 days).
- No default.

Patterns
- Use RegEx patterns to grant permissions without listing each resource.

AuthorizedUuid
- Restricts token usage to a specific UUID. If omitted, any client can use the token.

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
- TTL (int): Required. Total minutes token is valid (1–43,200).
- Meta (Dictionary<string, object>): Scalar values only.
- AuthorizedUuid (string): UUID allowed to use the token.
- Resources (PNTokenResources): Channel, channel group, and UUID metadata permissions.
- Patterns (PNTokenPatterns): RegEx-based permissions for channels, channel groups, and UUID metadata.
- QueryParam (Dictionary<string, object>): Additional query params for debugging.
- Execute (System.Action): Callback for PNAccessManagerTokenResult.
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
- Read (bool): Subscribe, History, Presence.
- Write (bool): Publish.
- Manage (bool): Channel Groups, App Context.
- Delete (bool): History, App Context.
- Get (bool): App Context.
- Update (bool): App Context.
- Join (bool): App Context.

Required key/value mappings
- Specify permissions for at least one UUID, channel, or group (via resources or patterns).

### Sample code

Reference code

```
1
  

```

### Returns

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult): Contains the token.
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
  - Read: channel-a, channel-group-b; get: uuid-c.
  - Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.

```
1
  

```

Grant an authorized client read access to multiple channels using RegEx

- Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; get: uuid-c.
  - Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.
  - Read: all channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses
- 400 Bad Request for invalid arguments (e.g., RegEx, invalid timestamp, incorrect permissions).

## Revoke token

Requires Access Manager add-on. Enable Revoke v3 Token in Admin Portal (keyset). Revokes an existing valid token (from GrantToken). Use for tokens with TTL ≤ 30 days; contact support for longer TTLs.

### Method(s)

```
`1pubnub.RevokeToken()  
2    .Token(string)  
3    .QueryParam(Dictionarystring, object>)  
4    .Execute(System.ActionPNAccessManagerRevokeTokenResult, PNStatus>)  
`
```

Parameters
- Token (string): Existing token.
- QueryParam (Dictionary<string, object>): Additional query params.
- Execute (System.Action): Callback for PNAccessManagerRevokeTokenResult.
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerRevokeTokenResult>>.

### Sample code

```
1
  

```

### Returns

RevokeToken() returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result (PNAccessManagerRevokeTokenResult): Empty on success.
- Status (PNStatus): Operation status.

### Error Responses
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

Decodes a token and returns embedded permissions and details (useful for debugging).

### Method(s)

```
`1ParseToken(String token)  
`
```

Parameter
- token (String): Current token.

### Sample code

```
1
  

```

### Returns

```
1
  

```

TokenContents
- Resources (TokenResources): Resource permissions (list).
- Patterns (TokenPatterns): RegEx-based resource permissions.
- Meta (Dictionary<string, object>): Scalar-only metadata.
- Signature (string): HMAC+SHA256 signed with PubNub confidential signing key.
- Version (int): Token structure version.
- Timestamp (long): Creation time (server-generated).
- TTL (int): Minutes valid (1–43,200).
- AuthorizedUUID (string): UUID authorized to use the token.

TokenResources
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (Objects v2)

TokenPatterns
- Channels: Dictionary<string, TokenAuthValues>
- Groups: Dictionary<string, TokenAuthValues>
- UUIDs: Dictionary<string, TokenAuthValues> (Objects v2)

TokenAuthValues
- Read (bool)
- Write (bool)
- Manage (bool)
- Delete (bool)
- Get (bool)
- Update (bool)
- Join (bool)

### Error Responses
- Parsing errors may indicate a damaged token; request a new one.

## Set token

Updates the client’s authentication token.

### Method(s)

```
`1SetAuthToken(String token)  
`
```

Parameter
- token (String): Current token.

### Sample code

```
1
  

```

### Returns
- No return value.

## Grant token - spaces & users (deprecated)

Deprecated resources: Spaces and Users. Same token flow: TTL, AuthorizedUserId, resource permissions. Only AuthorizedUserId can use the token.

Permissions
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

TTL
- Required; 1–43,200 minutes.

RegEx
- Use patterns via Patterns before grant.

Authorized user ID
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
- TTL (int): Required (1–43,200).
- Meta (Dictionary<string, object>): Scalar-only metadata.
- AuthorizedUserId (string): Authorized user ID.
- Resources (PNTokenResources): Space and User permissions.
- Patterns (PNTokenPatterns): RegEx-based Space and User permissions.
- QueryParam (Dictionary<string, object>): Debug params.
- Execute (PNCallback/System.Action): Callback for PNAccessManagerTokenResult.
- ExecuteAsync: Returns Task<PNResult<PNAccessManagerTokenResult>>.

PNTokenResources
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues
- Read (bool)
- Write (bool)
- Manage (bool)
- Delete (bool)
- Get (bool)
- Update (bool)
- Join (bool)

Required key/value mappings
- Specify permissions for at least one User or Space (resources or patterns).

### Sample code - spaces & users (deprecated)

```
1
  

```

### Returns - spaces & users (deprecated)

GrantToken() returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult): Contains the token.
- Status (PNStatus): Operation status.

PNAccessManagerTokenResult
- Token (String)

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples - spaces & users (deprecated)

Grant an authorized client different levels of access to various resources in a single call

- Grants my-authorized-userId:
  - Read: space-a; get: userId-c.
  - Read/write: space-b, space-c, space-d; get/update: userId-d.

```
1
  

```

Grant an authorized client read access to multiple spaces using RegEx

- Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call

- Grants my-authorized-userId:
  - Read: space-a and userId-c.
  - Read/write: space-b, space-c, space-d; get/update: userId-d.
  - Read: all spaces matching space-[A-Za-z0-9].

```
1
  

```

### Error Responses - spaces & users (deprecated)
- 400 Bad Request for invalid arguments (e.g., RegEx, timestamp, permissions).

Last updated on Sep 3, 2025