# Access Manager v3 API for C# SDK (Condensed)

Access Manager enforces client access to PubNub resources via time-limited tokens with embedded permissions. Tokens can target specific resources, be constrained by RegEx patterns, and include an authorized UUID.

- Supports resource-level permissions for:
  - Channels
  - ChannelGroups
  - Uuids (user metadata)
- Constrain usage to a single client with authorizedUuid.
- Grant multiple, differing permissions in a single request.
- TTL required (1–43,200 minutes).

##### User ID / UUID
User ID may be labeled as UUID/uuid in APIs/responses and holds the value set as userId during initialization.

##### Request execution
Use try/catch. Invalid parameters throw exceptions; server/network failures return error details in the PNStatus.

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
Enable the Access Manager add-on in the Admin Portal.

##### Requires Secret Key authentication
Use a server-side SDK instance initialized with a Secret Key.

Generates an authorization token with TTL, AuthorizedUuid, and resource permissions. Unauthorized or invalid tokens return 403.

- Permissions
- TTL (time to live)
- RegEx patterns
- Authorized UUID

Resource permissions:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

TTL: required; minutes the token remains valid. Min 1, max 43,200 (30 days).

RegEx: allow permissions by pattern per resource type.

AuthorizedUuid: restricts token use to one client UUID; otherwise usable by any UUID.

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

- TTL (int, required): token validity in minutes. Min 1; max 43,200.
- AuthorizedUuid (string): single UUID authorized to use the token.
- Resources (PNTokenResources): channel, channel group, UUID metadata permissions.
- Patterns (PNTokenPatterns): permissions applied to resources matching RegEx.
- Meta (Dictionary<string, object>): extra scalar metadata.
- Execute (PNCallback): PNCallback of type PNAccessManagerTokenResult.
- ExecuteAsync: returns PNResult<PNAccessManagerTokenResult>.

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
Specify permissions for at least one UUID, channel, or group (resource list or RegEx pattern).

### Sample code

##### Reference code

```
1
  

```

### Returns

GrantToken returns PNResult<PNAccessManagerTokenResult>:
- Result (PNAccessManagerTokenResult)
- Status (PNStatus)

PNAccessManagerTokenResult:
- Token (String): token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
1
  

```

### Error responses
Invalid requests return HTTP 400 with details (e.g., RegEx issue, invalid timestamp, incorrect permissions).

## Revoke token

##### Requires Access Manager add-on
Enable in the Admin Portal. Also enable “Revoke v3 Token” on the keyset.

Revokes an existing valid token (previously obtained via GrantToken). Use for tokens with TTL ≤ 30 days; for longer TTLs, contact support.

### Method(s)

```
`1pubnub.RevokeToken()  
2        .Token(string)  
3        .QueryParam(Dictionarystring, object>)  
`
```

- Token (string, required): existing token to revoke.
- Execute (PNCallback): PNCallback of type PNAccessManagerRevokeTokenResult.
- ExecuteAsync: returns PNResult<PNAccessManagerRevokeTokenResult>.

### Sample code

```
1
  

```

### Returns
RevokeToken returns PNResult<PNAccessManagerRevokeTokenResult>:
- Result: empty PNAccessManagerRevokeTokenResult on success.
- Status (PNStatus)

### Error Responses
Possible errors:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

Decodes a token to inspect embedded permissions and TTL.

### Method(s)

```
`1ParseToken(String token)  
`
```

- token (String): token with embedded permissions.

### Sample code

```
1
  

```

### Returns

```
1
  

```

### Error Responses
Errors may indicate a damaged token; request a new one.

## Set token

Client method to set/update the granted authentication token.

### Method(s)

```
`1SetAuthToken(String token)  
`
```

- token (String): token with embedded permissions.

### Sample code

```
1
  

```

### Returns
No return value.

## Grant token - spaces & users (deprecated)

Deprecated. Use GrantToken() instead.

##### Requires Access Manager add-on
Enable in the Admin Portal.

Generates tokens with TTL, AuthorizedUserId, and permissions for Spaces and Users.

Permissions:
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

TTL: required; 1–43,200 minutes.

RegEx: grant by pattern via Patterns.

AuthorizedUserId: restrict token to a single UserId.

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

- TTL (int, required): 1–43,200 minutes.
- AuthorizedUserId (string): single authorized UserId.
- Resources (PNTokenResources)
- Patterns (PNTokenPatterns)
- Meta (Dictionary<string, object>)
- Execute (PNCallback): PNAccessManagerTokenResult.
- ExecuteAsync: PNResult<PNAccessManagerTokenResult>.

PNTokenResources:
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenPatterns:
- Spaces: Dictionary<string, PNTokenAuthValues>
- Users: Dictionary<string, PNTokenAuthValues>

PNTokenAuthValues:
- Read, Write, Manage, Delete, Get, Update, Join (bool)

##### Required key/value mappings
Specify permissions for at least one User or Space (resource list or RegEx pattern).

#### Sample code - spaces & users (deprecated)

```
1
  

```

#### Returns - spaces & users (deprecated)
Returns PNResult<PNAccessManagerTokenResult>:
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

```
1
  

```

##### Grant an authorized client read access to multiple spaces using RegEx - spaces & users (deprecated)

```
1
  

```

##### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call - spaces & users (deprecated)

```
1
  

```

#### Error responses - spaces & users (deprecated)
HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions).