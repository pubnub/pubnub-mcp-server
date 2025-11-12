# Access Manager v3 API for Java SDK

##### Breaking changes in v9.0.0
Java SDK 9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) SDKs, changes client instantiation, asynchronous API callbacks, and [status events](/docs/sdks/java/status-events). Apps using < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

##### Gradle compatibility
Use Gradle 6.8+ for correct dependency resolution.

Access Manager v3 lets your servers (initialized with a Secret Key) grant clients time-limited tokens with embedded permissions for PubNub resources via lists or RegEx patterns, in a single request. You can restrict a token to a single client with `authorizedUuid`/`authorizedUserId`.

##### User ID / UUID
“User ID” is also referred to as UUID/uuid in some APIs/responses and holds the value of `userId` set during initialization.

For Access Manager v3 concepts, see [Manage Permissions with Access Manager v3](/docs/general/security/access-control).

## Grant token[​](#grant-token)

##### Requires Access Manager add-on
Enable the Access Manager add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

##### Requires Secret Key authentication
Use a server-side SDK instance [initialized](/docs/sdks/java/api-reference/configuration) with a Secret Key.

`grantToken()` issues a time-limited token defining `ttl`, optional `authorizedUUID`, and permissions to resources:
- channels
- channelGroups
- uuids (other users’ object metadata)

Only the `authorizedUUID` (if set) can use the token. Clients must include the token in each request until it expires. Unauthorized/invalid tokens return 403.

Essential behavior:
- Permissions per resource:
  - channels: read, write, get, manage, update, join, delete
  - channelGroups: read, manage
  - uuids: get, update, delete
- TTL: required; minutes; min 1, max 43,200 (30 days); no default. See [TTL](/docs/general/security/access-control#ttl).
- RegEx: set permissions as `patterns` to match multiple resources. See [RegEx](/docs/general/security/access-control#regex).
- Authorized UUID: restrict a token to a single client UUID. See [Authorized UUID](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)
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
- ttl (required)
  - Type: Number
  - Default: n/a
  - Minutes the token is valid. Min 1; Max 43,200 (30 days).
- meta
  - Type: Object
  - Default: n/a
  - Extra metadata sent with the request. Values must be scalar only; arrays/objects not supported.
- authorizedUUID
  - Type: String
  - Default: n/a
  - Single uuid authorized to use the token.
- channels
  - Type: List
  - Default: n/a
  - Channel grants (list or RegEx pattern).
- channelGroups
  - Type: List
  - Default: n/a
  - Channel group grants (list or RegEx pattern).
- uuids
  - Type: List
  - Default: n/a
  - UUID grants (list or RegEx pattern).

##### Required key/value mappings
Specify permissions for at least one uuid, channel, or channelGroup (list or RegEx).

### Sample code[​](#sample-code)
##### Reference code
```
1
  

```

### Returns[​](#returns)
```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)
Grants `my-authorized-uuid`:
- Read: channel-a, channel-group-b; Get: uuid-c
- Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)
Grants `my-authorized-uuid` read access to channels matching `channel-[A-Za-z0-9]`.
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)
Grants `my-authorized-uuid`:
- Read: channel-a, channel-group-b; Get: uuid-c
- Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d
- Read: channels matching `channel-[A-Za-z0-9]`
```
1
  

```

### Error responses[​](#error-responses)
Invalid requests return 400 with details (e.g., RegEx, [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions). Error details are returned under `PubNubException`.

## Grant token - spaces & users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on
Enable the Access Manager add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

`grantToken()` issues a time-limited token defining `ttl`, optional `authorizedUserId`, and permissions to:
- spaces
- users (other users’ metadata)

Only the `authorizedUserId` (if set) can use the token. Unauthorized/invalid tokens return 403.

#### Permissions[​](#permissions)
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

See [Permissions mapping](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)
Required; minutes; no default; max 43,200 (30 days). See [TTL](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)
Use patterns via `patterns` to match multiple resources. See [RegEx](/docs/general/security/access-control#regex).

#### Authorized user ID[​](#authorized-user-id)
Set `authorizedUserId` to bind the token to one client device. If omitted, any `userId` can use the token. See [Authorized UUID](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods-1)
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
- ttl (required)
  - Type: Number
  - Default: n/a
  - Minutes the token is valid. Min 1; Max 43,200 (30 days).
- meta
  - Type: Object
  - Default: n/a
  - Extra metadata sent with the request. Scalar values only.
- authorizedUserId
  - Type: UserId
  - Default: n/a
  - Single userId authorized to use the token.
- spacesPermissions
  - Type: List<SpacePermissions>
  - Default: n/a
  - Space permissions (list or RegEx patterns).
- usersPermissions
  - Type: List<UserPermissions>
  - Default: n/a
  - User permissions (list or RegEx patterns).

##### Required key/value mappings
Specify permissions for at least one User or Space (list or RegEx).

### Sample code[​](#sample-code-1)
```
1
  

```

### Returns[​](#returns-1)
```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples[​](#other-examples-1)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call-1)
Grants `my-authorized-userId`:
- Read: space-a; Get: userId-c
- Read/Write: space-b, space-c, space-d; Get/Update: userId-d
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex-1)
Grants `my-authorized-userId` read access to spaces matching `space-[A-Za-z0-9]`.
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)
Grants `my-authorized-userId`:
- Read: space-a and userId-c
- Read/Write: space-b, space-c, space-d; Get/Update: userId-d
- Read: spaces matching `space-[A-Za-z0-9]`
```
1
  

```

### Error responses[​](#error-responses-1)
Invalid requests return 400 with details (e.g., RegEx, [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions). Error details are returned under `PubNubException`.

## Revoke token[​](#revoke-token)

##### Requires Access Manager add-on
Enable the Access Manager add-on for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

##### Enable token revoke
In the [Admin Portal](https://admin.pubnub.com/), enable “Revoke v3 Token” in your keyset’s ACCESS MANAGER section.

`revokeToken()` disables an existing token and revokes embedded permissions. Only valid tokens granted via `grantToken()` can be revoked. Use for tokens with `ttl` ≤ 30 days; for longer `ttl` contact support.

See [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-2)
```
`1revokeToken()  
2    .token(String token)  
`
```

Parameters:
- token (required)
  - Type: String
  - Default: n/a
  - Existing token with embedded permissions.

### Sample code[​](#sample-code-2)
```
1
  

```

### Returns[​](#returns-2)
Returns `PNRevokeTokenResult` on success.

### Error Responses[​](#error-responses-2)
Possible errors:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token[​](#parse-token)

`parseToken()` decodes a token and returns the embedded permissions and details (e.g., `ttl`). Useful for debugging.

### Method(s)[​](#methods-3)
```
`1parseToken(String token)  
`
```

Parameters:
- token (required)
  - Type: String
  - Default: n/a
  - Current token with embedded permissions.

### Sample code[​](#sample-code-3)
```
1
  

```

### Returns[​](#returns-3)
```
1
  

```

### Error Responses[​](#error-responses-3)
Parsing errors may indicate a damaged token; request a new one from the server.

## Set token[​](#set-token)

`setToken()` lets a client device update its authentication token granted by the server.

### Method(s)[​](#methods-4)
```
`1setToken(String token)  
`
```

Parameters:
- token (required)
  - Type: String
  - Default: n/a
  - Current token with embedded permissions.

### Sample code[​](#sample-code-4)
```
1
  

```

### Returns[​](#returns-4)
No return value.

Last updated on Sep 3, 2025