# Access Manager v3 API for Java SDK

##### Breaking changes in v9.0.0
- Java 9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, async callbacks, and status events.
- See Java/Kotlin SDK migration guide for details.

##### Gradle compatibility
- Use Gradle 6.8+ for proper dependency resolution.

Access Manager v3 lets servers (initialized with a Secret Key) grant clients time-limited tokens with embedded permissions for specific PubNub resources:
- Channels, channel groups, and UUIDs (user object metadata)
- Or Spaces and Users (metadata) in the Spaces/Users model
- Permissions can be granted via lists or RegEx patterns, and restricted to a single authorized client.

##### User ID / UUID
- User ID is also referred to as UUID/uuid in some APIs and responses, but carries the value of userId set during initialization.

For more information, see Manage Permissions with Access Manager v3.

## Grant token[​](#grant-token)

##### Requires Access Manager add-on
Enable in the Admin Portal.

##### Requires Secret Key authentication
Initialize the server SDK with a Secret Key.

Generates a time-limited token with ttl, optional authorizedUUID, and permissions for:
- channels
- channelGroups
- uuids

Only the authorizedUUID (if set) can use the token. Unauthorized/invalid requests return 403.

Permissions:
- channels: read, write, get, manage, update, join, delete
- channelGroups: read, manage
- uuids: get, update, delete

TTL:
- Required; minutes the token remains valid
- Min 1, Max 43,200 (30 days); no default

RegEx:
- Use patterns to specify permissions by pattern (set as patterns before grant)

Authorized UUID:
- Restrict token usage to a specific uuid to prevent impersonation

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
- ttl (Number, required): Minutes token is valid; min 1, max 43,200
- meta (Object): Extra metadata; scalar values only (no arrays/objects)
- authorizedUUID (String): Single uuid authorized to use the token
- channels (List): Channel grants as a list or RegEx pattern
- channelGroups (List): Channel group grants as a list or RegEx pattern
- uuids (List): UUID grants as a list or RegEx pattern

##### Required key/value mappings
- Specify permissions for at least one uuid, channel, or channelGroup (list or RegEx).

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

- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; get: uuid-c
  - Read/write: channel-b, channel-c, channel-d; get/update: uuid-d

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

- Grants my-authorized-uuid read access to all channels matching channel-[A-Za-z0-9]

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)

- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; get: uuid-c
  - Read/write: channel-b, channel-c, channel-d; get/update: uuid-d
  - Read via RegEx: channels matching channel-[A-Za-z0-9]

```
1
  

```

### Error responses[​](#error-responses)
- 400 with descriptive message for invalid requests (e.g., RegEx, timestamp, permissions). Details returned as string under PubNubException.

## Grant token - spaces & users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on
Enable in the Admin Portal.

Generates a time-limited token with ttl, optional authorizedUserId, and permissions for:
- spaces
- users (user metadata)

Only the authorizedUserId (if set) can use the token. Unauthorized/invalid requests return 403.

#### Permissions[​](#permissions)
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

#### TTL[​](#ttl)
- Required; minutes; min 1, max 43,200; no default

#### RegEx[​](#regex)
- Use patterns to specify permissions by pattern (set as patterns before grant)

#### Authorized user ID[​](#authorized-user-id)
- Restrict token usage to a single userId to prevent impersonation

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
- ttl (Number, required): Minutes token is valid; min 1, max 43,200
- meta (Object): Extra metadata; scalar values only
- authorizedUserId (UserId): Single userId authorized to use the token
- spacesPermissions (List<SpacePermissions>): Space permissions via list or RegEx patterns
- usersPermissions (List<UserPermissions>): User permissions via list or RegEx patterns

##### Required key/value mappings
- Specify permissions for at least one User or Space (list or RegEx).

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

- Grants my-authorized-userId:
  - Read: space-a; get: userId-c
  - Read/write: space-b, space-c, space-d; get/update: userId-d

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex-1)

- Grants my-authorized-userId read access to all channels matching space-[A-Za-z0-9]

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

- Grants my-authorized-userId:
  - Read: space-a and userId-c
  - Read/write: space-b, space-c, space-d; get/update: userId-d
  - Read via RegEx: channels matching space-[A-Za-z0-9]

```
1
  

```

### Error responses[​](#error-responses-1)
- 400 with descriptive message for invalid requests (e.g., RegEx, timestamp, permissions). Details returned as string under PubNubException.

## Revoke token[​](#revoke-token)

##### Requires Access Manager add-on
Enable in the Admin Portal.

##### Enable token revoke
- In Admin Portal, enable Revoke v3 Token on the keyset.

Disables an existing token (granted via grantToken()). Use for tokens with ttl ≤ 30 days; contact support for longer ttls.

### Method(s)[​](#methods-2)

```
`1revokeToken()  
2    .token(String token)  
`
```

Parameters:
- token (String): Existing token with embedded permissions

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)
- Returns PNRevokeTokenResult on success.

### Error Responses[​](#error-responses-2)
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token[​](#parse-token)

Decodes a token and returns its embedded permissions and ttl. Useful for debugging.

### Method(s)[​](#methods-3)

```
`1parseToken(String token)  
`
```

Parameters:
- token (String): Current token with embedded permissions

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

```
1
  

```

### Error Responses[​](#error-responses-3)
- Errors may indicate a damaged token; request a new one from the server.

## Set token[​](#set-token)

Used by client devices to update the current authentication token.

### Method(s)[​](#methods-4)

```
`1setToken(String token)  
`
```

Parameters:
- token (String): Current token with embedded permissions

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)
- No response value.

Last updated on Sep 3, 2025