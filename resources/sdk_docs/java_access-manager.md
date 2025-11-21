# Access Manager v3 API for Java SDK

##### Breaking changes in v9.0.0
- Unified Java/Kotlin codebases, new PubNub client instantiation, changed async callbacks and status events. May impact apps built with versions < 9.0.0.
- See Java/Kotlin SDK migration guide.

##### Gradle compatibility
- Use Gradle 6.8+ for reliable dependency resolution.

Access Manager v3 lets servers (initialized with a Secret Key) grant clients time-limited tokens with embedded permissions to specific PubNub resources:
- Duration-limited (TTL).
- By resource lists or RegEx patterns.
- Mixed permission levels in a single request.
- Restrictable to a single client via authorized UUID/userId.

You can add authorizedUuid to grant requests to bind a token to a single userId.

##### User ID / UUID
User ID is also referred to as UUID/uuid in some APIs/responses but holds the value of userId set during initialization.

For overall concepts, see Manage Permissions with Access Manager v3.

## Grant token

##### Requires Access Manager add-on
Enable in the Admin Portal.

##### Requires Secret Key authentication
Use a server-side SDK instance initialized with a Secret Key.

The grantToken() call issues a token with TTL, an optional authorizedUUID, and permissions for:
- channels
- channelGroups
- uuids (users’ object metadata)

Unauthorized/invalid token use returns HTTP 403.

Permissions per resource:
- channels: read, write, get, manage, update, join, delete
- channelGroups: read, manage
- uuids: get, update, delete

TTL:
- Required. Minutes the token remains valid.
- Min 1, max 43,200 (30 days). No default.

RegEx:
- Use patterns to grant by resource name pattern. Provide under patterns.

Authorized UUID:
- Set authorizedUUID to bind the token to a single uuid. If omitted, any uuid can use the token.

### Method(s)
```
`1grantToken()  
2    .ttl(Integer)  
3    .meta(Object)  
4    .authorizedUUID(String)  
5    .channels(ListChannelGrant>)  
6    .channelGroups(ListChannelGroupGrant>)  
7    .uuids(ListUUIDGrant>)  
`
```

Parameters:
- ttl (Number, required): Minutes the token is valid. Min 1, max 43,200.
- meta (Object): Extra metadata. Scalar values only (no arrays/objects).
- authorizedUUID (String): Single uuid authorized to use the token.
- channels (List): Channel grants as a list or RegEx pattern.
- channelGroups (List): Channel group grants as a list or RegEx pattern.
- uuids (List): UUID grants as a list or RegEx pattern.

##### Required key/value mappings
Specify permissions for at least one uuid, channel, or channelGroup (list or RegEx pattern).

### Sample code
```
1
  

```

### Returns
```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call
- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; get: uuid-c.
  - Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
- Grants my-authorized-uuid read to channels matching channel-[A-Za-z0-9].
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call
- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; get: uuid-c.
  - Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.
  - Read: channels matching channel-[A-Za-z0-9].
```
1
  

```

### Error responses
- HTTP 400 with details (e.g., invalid RegEx, timestamp, or permissions), returned under PubNubException.

## Grant token - spaces & users

##### Requires Access Manager add-on
Enable in the Admin Portal.

grantToken() issues a token with TTL, optional authorizedUserId, and permissions for:
- spaces
- users (metadata)

Unauthorized/invalid token use returns HTTP 403.

#### Permissions
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

#### TTL
- Required; minutes until expiration. Max 43,200 (30 days).

#### RegEx
- Provide permissions by patterns via patterns.

#### Authorized user ID
- Set authorizedUserId to bind a token to a single userId. If omitted, any userId can use.

### Method(s)
```
`1grantToken()  
2    .ttl(Integer)  
3    .meta(Object)  
4    .authorizedUserId(UserId)  
5    .spacesPermissions(ListSpacePermissions>)  
6    .usersPermissions(ListUserPermissions>)  
`
```

Parameters:
- ttl (Number, required): Minutes the token is valid. Min 1, max 43,200.
- meta (Object): Extra metadata. Scalar values only.
- authorizedUserId (UserId): Single userId authorized to use the token.
- spacesPermissions (List<SpacePermissions>): Space permissions as a list or RegEx patterns.
- usersPermissions (List<UserPermissions>): User permissions as a list or RegEx patterns.

##### Required key/value mappings
Specify permissions for at least one User or Space (list or RegEx).

### Sample code
```
1
  

```

### Returns
```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call
- Grants my-authorized-userId:
  - Read: space-a; get: userId-c.
  - Read/write: space-b, space-c, space-d; get/update: userId-d.
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
- Grants my-authorized-userId read to spaces matching space-[A-Za-z0-9].
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
- Grants my-authorized-userId:
  - Read: space-a; get: userId-c.
  - Read/write: space-b, space-c, space-d; get/update: userId-d.
  - Read: spaces matching space-[A-Za-z0-9].
```
1
  

```

### Error responses
- HTTP 400 with details (e.g., invalid RegEx, timestamp, or permissions), returned under PubNubException.

## Revoke token

##### Requires Access Manager add-on
Enable in the Admin Portal.

##### Enable token revoke
In Admin Portal, enable "Revoke v3 Token" under ACCESS MANAGER.

revokeToken() disables an existing token (previously issued via grantToken()). Use for tokens with ttl ≤ 30 days; for longer TTLs, contact support.

### Method(s)
```
`1revokeToken()  
2    .token(String token)  
`
```

Parameters:
- token (String, required): Existing token to revoke.

### Sample code
```
1
  

```

### Returns
- PNRevokeTokenResult on success.

### Error Responses
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

parseToken() decodes a token and returns its embedded permissions and TTL. Useful for debugging.

### Method(s)
```
`1parseToken(String token)  
`
```

Parameters:
- token (String, required): Token to parse.

### Sample code
```
1
  

```

### Returns
```
1
  

```

### Error Responses
- If parsing fails, the token may be damaged. Request a new token from the server.

## Set token

setToken() updates the authentication token on the client device.

### Method(s)
```
`1setToken(String token)  
`
```

Parameters:
- token (String, required): Current token with embedded permissions.

### Sample code
```
1
  

```

### Returns
- No response value.

Last updated on Sep 3, 2025