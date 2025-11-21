# Access Manager v3 API for Go SDK

Access Manager lets servers grant clients time-limited tokens with embedded permissions to PubNub resources:
- Limited TTL.
- Resource lists or RegEx patterns.
- Mixed permissions in one request (for example, read on channel1 and write on channel2).
- Restrictable to a single Authorized UUID/User ID.

You can add the authorizedUuid parameter to restrict a token to a single client userId.

##### User ID / UUID
User ID may be referred to as UUID/uuid in some APIs and responses but holds the value of the userId set during initialization.

## Grant token

##### Requires Access Manager add-on
Enable Access Manager for your key in the Admin Portal.

##### Requires Secret Key authentication
Grant from a server SDK instance initialized with a Secret Key.

Generates a time-limited token defining TTL, AuthorizedUUID, and permissions on:
- Channels
- ChannelGroups
- UUIDs

Unauthorized or invalid usage returns HTTP 403.

Supported permissions:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- UUIDs: get, update, delete

TTL:
- Required, minutes, min 1, max 43,200 (30 days).

RegEx:
- Grant by patterns for each resource type.

AuthorizedUUID:
- If set, only that UUID may use the token; otherwise any UUID can.

### Method(s)

```
`1pn.GrantToken().  
2  UUIDs(map[string]UUIDPermissions).  
3  Channels(map[string]ChannelPermissions).  
4  ChannelGroups(map[string]GroupPermissions).  
5  UUIDsPattern(map[string]UUIDPermissions).  
6  ChannelsPattern(map[string]ChannelPermissions).  
7  ChannelGroupsPattern(map[string]GroupPermissions).  
8  TTL(int).  
9  AuthorizedUUID(string).  
10  Meta(map[string]interface{}).  
11  QueryParam(queryParam).  
12  Execute()  
`
```

- UUIDs (map[string]UUIDPermissions): Map of UUIDs to permissions.
- Channels (map[string]ChannelPermissions): Map of channels to permissions.
- ChannelGroups (map[string]GroupPermissions): Map of channel groups to permissions.
- UUIDsPattern (map[string]UUIDPermissions): Map of UUID RegEx patterns to permissions.
- ChannelsPattern (map[string]ChannelPermissions): Map of channel RegEx patterns to permissions.
- ChannelGroupsPattern (map[string]GroupPermissions): Map of channel group RegEx patterns to permissions.
- TTL (Number, required): Minutes token is valid. Min 1, max 43,200.
- AuthorizedUUID (String): Single UUID allowed to use the token.
- Meta (Object): Scalar values only; arrays/objects not supported.

##### Required key/value mappings
Specify at least one UUID, Channel, or ChannelGroup (list or pattern).

### Sample code

```
1
  
```

### Returns

```
`1PNGrantTokenResponse{  
2  Data: PNGrantTokenData{  
3      Message: "Success",  
4      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI",  
5  }  
6}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; Get: uuid-c.
- Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.

```
1
  
```

#### Grant an authorized client read access to multiple channels using RegEx

Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].

```
1
  
```

#### Grant different levels of access and RegEx channel read in one call

Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; Get: uuid-c.
- Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.
- Read: channels matching channel-[A-Za-z0-9].

```
1
  
```

### Error responses
HTTP 400 on invalid input (for example, invalid RegEx, invalid timestamp, incorrect permissions).

## Grant token - spaces & users

##### Requires Access Manager add-on
Enable Access Manager for your key in the Admin Portal.

Generates a time-limited token defining ttl, authorizedUserId, and permissions on:
- spaces
- users

Unauthorized or invalid usage returns HTTP 403.

Supported permissions:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL:
- Required, minutes, min 1, max 43,200.

RegEx:
- Grant by patterns for each resource type.

authorizedUserId:
- If set, only that userId may use the token.

### Method(s)

```
`1pn.GrantToken().  
2  UsersPermissions(map[UserId]UserPermissions).  
3  SpacesPermissions(map[SpaceId]SpacePermissions).  
4  UserPatternsPermissions(map[string]UserPermissions).  
5  SpacePatternsPermissions(map[string]SpacePermissions).  
6  TTL(int).  
7  AuthorizedUserId(UserId).  
8  Meta(map[string]interface{}).  
9  QueryParam(queryParam).  
10  Execute()  
`
```

- UsersPermissions (map[UserId]UserPermissions): Map of Users to permissions.
- SpacesPermissions (map[SpaceId]SpacePermissions): Map of Spaces to permissions.
- UserPatternsPermissions (map[string]UserPermissions): Map of User patterns to permissions.
- SpacePatternsPermissions (map[string]SpacePermissions): Map of Space patterns to permissions.
- TTL (Number, required): Minutes token is valid. Min 1, max 43,200.
- AuthorizedUserId (UserId): Single userId allowed to use the token.
- Meta (Object): Scalar values only; arrays/objects not supported.

##### Required key/value mappings
Specify at least one User or Space (list or pattern).

### Sample code

```
`1res, status, err := pn.GrantToken().  
2        TTL(15).  
3        AuthorizedUserId("my-authorized-userId").  
4        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{  
5                "my_spaces": {  
6                        Read: true,  
7                },  
8        }).  
9        Execute()  
`
```

### Returns

```
`1PNGrantTokenResponse{  
2  Data: PNGrantTokenData{  
3      Message: "Success",  
4      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI",  
5  }  
6}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

Grants my-authorized-userId:
- Read: space-a; Get: userId-c.
- Read/Write: space-b, space-c, space-d; Get/Update: userId-d.

```
`1res, status, err := pn.GrantToken().  
2        TTL(15).  
3        AuthorizedUserId("my-authorized-userId").  
4        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{  
5                "space-a": {  
6                        Read: true,  
7                },  
8                "space-b": {  
9                        Read: true,  
10                        Write: true,  
11                },  
12                "space-c": {  
13                        Read: true,  
14                        Write: true,  
15                },  
16                "space-d": {  
17                        Read: true,  
18                        Write: true,  
19                },  
20        }).  
21        UsersPermissions(map[UserId]pubnub.UserPermissions{  
22                "userId-c": {  
23                        Get: true,  
24                },  
25                "userId-d": {  
26                        Get: true,  
27                        Update: true,  
28                },  
29        }).  
30        Execute()  
`
```

#### Grant an authorized client read access to multiple spaces using RegEx

Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].

```
`1res, status, err := pn.GrantToken().  
2        TTL(15).  
3        AuthorizedUserId("my-authorized-userId").  
4        SpacePatternsPermissions(map[string]pubnub.SpacePermissions{  
5                "^space-[A-Za-z0-9]*$": {  
6                        Read: true,  
7                },  
8        }).  
9        Execute()  
`
```

#### Grant different levels of access and RegEx space read in one call

Grants my-authorized-userId:
- Read: space-a and userId-c.
- Read/Write: space-b, space-c, space-d; Get/Update: userId-d.
- Read: spaces matching space-[A-Za-z0-9].

```
`1res, status, err := pn.GrantToken().  
2        TTL(15).  
3        AuthorizedUserId("my-authorized-userId").  
4        SpacesPermissions(map[string]pubnub.SpacePermissions{  
5                "space-a": {  
6                        Read: true,  
7                },  
8                "space-b": {  
9                        Read: true,  
10                        Write: true,  
11                },  
12                "space-c": {  
13                        Read: true,  
14                        Write: true,  
15                },  
16                "space-d": {  
17                        Read: true,  
18                        Write: true,  
19                },  
20        }).  
21        UsersPermissions(map[string]pubnub.UserPermissions{  
22                "userId-c": {  
23                        Get: true,  
24                },  
25                "userId-d": {  
26                        Get: true,  
27                        Update: true,  
28                },  
29        }).  
30        SpacePatternsPermissions(map[string]pubnub.SpacePermissions{  
31                "^space-[A-Za-z0-9]*$": {  
32                        Read: true,  
33                },  
34        }).  
35        Execute()  
`
```

### Error responses
HTTP 400 on invalid input (for example, invalid RegEx, invalid timestamp, incorrect permissions).

## Revoke token

##### Requires Access Manager add-on
Enable Access Manager and then enable Revoke v3 Token in the keyset’s ACCESS MANAGER section.

RevokeToken disables an existing token previously obtained via GrantToken. Use for tokens with ttl ≤ 30 days; contact support for longer TTLs.

### Method(s)

```
`1pn.RevokeToken().  
2        Token(string)  
`
```

- Token (string, required): Existing token with embedded permissions.

### Sample code

```
1
  
```

### Returns
Empty PNRevokeTokenResponse.

### Error Responses
May return: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

ParseToken decodes a token and returns embedded permissions and TTL; useful for debugging.

Import:

```
`1import (  
2        pubnub "github.com/pubnub/go/v5")  
`
```

### Method(s)

```
`1pubnub.ParseToken(token string)  
`
```

- token (String, required): Token with embedded permissions.

### Sample code

```
1
  
```

### Returns

```
`1PNToken{  
2  Version: 2,  
3  Timestamp: 1619718521,  
4  TTL: 15,  
5  AuthorizedUUID: "user1",  
6  Resources: PNTokenResources{  
7    Channels: make[string]ChannelPermissions{  
8      Read: true,  
9      Write: true,  
10      Delete: true,  
11      Get: true,  
12      Manage: true,  
13      Update: true,  
14      Join: true,  
15    },  
16    ChannelGroups: make[string]GroupPermissions{  
17      Read: true,  
18      Manage: true,  
19    },  
20    UUIDs: make[string]UUIDPermissions{  
21      Get: true,  
22      Update: true,  
23      Delete: true,  
24    },  
25  },  
26  Patterns: PNTokenResources{  
27    Channels: make[string]ChannelPermissions{  
28      Read: true,  
29      Write: true,  
30      Delete: true,  
31      Get: true,  
32      Manage: true,  
33      Update: true,  
34      Join: true  
35    },  
36    ChannelGroups: make[string]GroupPermissions{  
37      Read: true,  
38      Manage: true,  
39    },  
40    UUIDs: make[string]UUIDPermissions{  
41      Get: true,  
42      Update: true,  
43      Delete: true,  
44    },  
45  },  
46}  
`
```

### Error Responses
Parsing errors may indicate a damaged token; request a new one.

## Set token

SetToken updates the client’s current authentication token.

### Method(s)

```
`1pn.SetToken(token string)  
`
```

- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  
```

### Returns
No return value.

Last updated on Oct 29, 2025