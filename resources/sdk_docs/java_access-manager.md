# Access Manager v3 API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK 9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) SDKs, changes client instantiation, async callbacks, and [status events](/docs/sdks/java/status-events). See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

##### Gradle compatibility
Use Gradle 6.8+ for reliable dependency resolution.

Access Manager v3 lets servers (using a Secret Key) grant time-limited tokens with embedded permissions to PubNub resources:
- For a limited period of time.
- Via resource lists or RegEx patterns.
- In a single request, even with differing permission levels.
- Optional restriction to a single `authorizedUuid` (the client `userId`).

##### User ID / UUID
“User ID” may appear as `UUID/uuid` in APIs/responses but contains the `userId` you set at initialization. See [Access Manager v3](/docs/general/security/access-control).

## Grant token

##### Requires Access Manager add-on
Enable in the [Admin Portal](https://admin.pubnub.com/).

##### Requires Secret Key authentication
Server must be [initialized](/docs/sdks/java/api-reference/configuration) with a Secret Key.

`grantToken()` creates a time-limited token with `ttl`, optional `authorizedUUID`, and permissions for:
- `channels`
- `channelGroups`
- `uuids` (users’ object metadata)

Only the `authorizedUUID` can use the token if set. Unauthorized/invalid usage returns HTTP 403.

Key concepts:
- Permissions mapping:
  - channels: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`
  - channelGroups: `read`, `manage`
  - uuids: `get`, `update`, `delete`
- TTL: required; minutes; min 1, max 43,200 (30 days).
- RegEx: specify permissions using `patterns`.
- Authorized UUID: restrict token to a single client to prevent impersonation.

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

- ttl (required)
  - Type: Number
  - Default: n/a
  - Minutes token is valid. Min 1; Max 43,200.
- meta
  - Type: Object
  - Default: n/a
  - Scalar values only.
- authorizedUUID
  - Type: String
  - Default: n/a
  - Single `uuid` allowed to use the token.
- channels
  - Type: List
  - Default: n/a
  - Channel grants as list or RegEx.
- channelGroups
  - Type: List
  - Default: n/a
  - Channel group grants as list or RegEx.
- uuids
  - Type: List
  - Default: n/a
  - UUID grants as list or RegEx.

##### Required key/value mappings
Specify permissions for at least one `uuid`, `channel`, or `channelGroup` (list or RegEx).

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
Grants `my-authorized-uuid`:
- Read: `channel-a`, `channel-group-b`; Get: `uuid-c`.
- Read/Write: `channel-b`, `channel-c`, `channel-d`; Get/Update: `uuid-d`.
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
Grant `my-authorized-uuid` read access to channels matching `channel-[A-Za-z0-9]`.
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call
Grants `my-authorized-uuid`:
- Read: `channel-a`, `channel-group-b`; Get: `uuid-c`.
- Read/Write: `channel-b`, `channel-c`, `channel-d`; Get/Update: `uuid-d`.
- Read via RegEx: `channel-[A-Za-z0-9]`.
```
1
  

```

### Error responses
HTTP 400 with details for invalid arguments (e.g., RegEx, [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), permissions). Error details under `PubNubException`.

## Grant token - spaces & users

##### Requires Access Manager add-on
Enable in the [Admin Portal](https://admin.pubnub.com/).

`grantToken()` for:
- `spaces`
- `users` (metadata)

Only `authorizedUserId` can use the token if set; others get HTTP 403.

#### Permissions
- space: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`
- user: `get`, `update`, `delete`

#### TTL
Required; minutes; max 43,200 (30 days).

#### RegEx
Use `patterns` to grant by RegEx.

#### Authorized user ID
Set `authorizedUserId` to restrict token to a single `userId`. See [Authorized UUID](/docs/general/security/access-control#authorized-uuid).

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

- ttl (required)
  - Type: Number
  - Default: n/a
  - Minutes token is valid. Min 1; Max 43,200.
- meta
  - Type: Object
  - Default: n/a
  - Scalar values only.
- authorizedUserId
  - Type: UserId
  - Default: n/a
  - Single `userId` authorized to use the token.
- spacesPermissions
  - Type: List<SpacePermissions>
  - Default: n/a
  - Space permissions as list or RegEx patterns.
- usersPermissions
  - Type: List<UserPermissions>
  - Default: n/a
  - User permissions as list or RegEx patterns.

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
Grants `my-authorized-userId`:
- Read: `space-a`; Get: `userId-c`.
- Read/Write: `space-b`, `space-c`, `space-d`; Get/Update: `userId-d`.
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
Grant `my-authorized-userId` read access to `space-[A-Za-z0-9]`.
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
Grants `my-authorized-userId`:
- Read: `space-a` and `userId-c`.
- Read/Write: `space-b`, `space-c`, `space-d`; Get/Update: `userId-d`.
- Read via RegEx: `space-[A-Za-z0-9]`.
```
1
  

```

### Error responses
HTTP 400 with details for invalid arguments (e.g., RegEx, timestamp, permissions). Error details under `PubNubException`.

## Revoke token

##### Requires Access Manager add-on
Enable in the [Admin Portal](https://admin.pubnub.com/).

##### Enable token revoke
In your app’s keyset, enable “Revoke v3 Token” under ACCESS MANAGER.

`revokeToken()` disables a valid token previously obtained via `grantToken()`. Use for tokens with `ttl` ≤ 30 days; for longer, [contact support](mailto:support@pubnub.com/). See [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)
```
`1revokeToken()  
2    .token(String token)  
`
```

- token (required)
  - Type: String
  - Default: n/a
  - Existing token to revoke.

### Sample code
```
1
  

```

### Returns
On success, returns `PNRevokeTokenResult`.

### Error Responses
May return:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token
`parseToken()` decodes a token and returns permissions and `ttl` details (useful for debugging).

### Method(s)
```
`1parseToken(String token)  
`
```

- token (required)
  - Type: String
  - Default: n/a
  - Token to decode.

### Sample code
```
1
  

```

### Returns
```
1
  

```

### Error Responses
Parsing errors may indicate a damaged token; request a new one from the server.

## Set token
`setToken()` updates the client’s authentication token.

### Method(s)
```
`1setToken(String token)  
`
```

- token (required)
  - Type: String
  - Default: n/a
  - Current token with permissions.

### Sample code
```
1
  

```

### Returns
No return value.

Last updated on **Sep 3, 2025**