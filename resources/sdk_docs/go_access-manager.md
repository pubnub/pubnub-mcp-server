# Access Manager v3 API for Go SDK

Access Manager enforces client access controls via server-issued, time-limited tokens with embedded permissions for PubNub resources. Tokens can target specific resources, resource patterns (RegEx), and a single authorized client.

- Supports: TTL, resource lists, RegEx patterns, single authorized UUID/userId, mixed permissions in one request.
- User ID/UUID: Some APIs use UUID but it holds the value of userId set during initialization.
- Requires Access Manager add-on enabled in Admin Portal.

For full concepts, see Manage Permissions with Access Manager v3.

## Grant token

Requires Access Manager add-on and Secret Key authentication (server-side).

Generates a token with TTL, AuthorizedUUID, and permissions for:
- Channels
- ChannelGroups
- UUIDs (user object metadata)

Only AuthorizedUUID can use the token. Unauthorized or invalid token requests return 403.

Permissions by resource type:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- UUIDs: get, update, delete

TTL: required; minutes; min 1, max 43,200 (30 days).  
Patterns: Use RegEx to grant by pattern per resource type.  
Authorized UUID: Restrict token to a specific client to prevent impersonation.

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

*  requiredParameterDescription`UUIDs`Type: `map[string]UUIDPermissions`Default:  
n/aMap of uuids to permissions.`Channels`Type: `map[string]ChannelPermissions`Default:  
n/aMap of channel names to permissions.`ChannelGroups`Type: `map[string]GroupPermissions`Default:  
n/aMap of channel group ids to permissions.`UUIDsPattern`Type: `map[string]UUIDPermissions`Default:  
n/aMap of uuid patterns to permissions.`ChannelsPattern`Type: `map[string]ChannelPermissions`Default:  
n/aMap of channel patterns to permissions.`ChannelGroupsPattern`Type: `map[string]GroupPermissions`Default:  
n/aMap of channel group patterns to permissions.`TTL` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`AuthorizedUUID`Type: `String`Default:  
n/aSingle `UUID` which is authorized to use the token to make API requests to PubNub.`Meta`Type: `Object`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.

##### Required key/value mappings

Specify permissions for at least one UUID, Channel, or ChannelGroup, either as a list or a pattern (RegEx).

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
- Read: channel-a, channel-group-b; get: uuid-c.
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; get: uuid-c.
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.
- Read to channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses

Invalid requests return HTTP 400 with details (e.g., RegEx, invalid timestamp, incorrect permissions).

## Grant token - spaces & users

Requires Access Manager add-on.

Generates a token with ttl, authorizedUserId, and permissions for:
- spaces
- users (user metadata)

Only authorizedUserId can use the token. Unauthorized or invalid token requests return 403.

Permissions by resource type:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL: required; minutes; min 1, max 43,200 (30 days).  
Patterns: Use RegEx via patterns.  
Authorized user ID: Restrict to a single authorizedUserId to prevent impersonation.

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

*  requiredParameterDescription`UsersPermissions`Type: `map[UserId]UserPermissions`Default:  
n/aMap of Users to permissions.`SpacesPermissions`Type: `map[SpaceId]SpacePermissions`Default:  
n/aMap of Spaces to permissions.`UserPatternsPermissions`Type: `map[string]UserPermissions)`Default:  
n/aMap of User patterns to permissions.`SpacePatternsPermissions`Type: `map[string]SpacePermissions`Default:  
n/aMap of Space patterns to permissions.`TTL` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`AuthorizedUserId`Type: `UserId`Default:  
n/aSingle `UserId` which is authorized to use the token to make API requests to PubNub.`Meta`Type: `Object`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.

##### Required key/value mappings

Specify permissions for at least one User or Space as a list or pattern (RegEx).

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
- Read: space-a; get: userId-c.
- Read/write: space-b, space-c, space-d; get/update: userId-d.

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

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call

Grants my-authorized-userId:
- Read: space-a and userId-c.
- Read/write: space-b, space-c, space-d; get/update: userId-d.
- Read to spaces matching space-[A-Za-z0-9].

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

Invalid requests return HTTP 400 with details (e.g., RegEx, invalid timestamp, incorrect permissions).

## Revoke token

Requires Access Manager add-on. Enable Revoke v3 Token in Admin Portal first.

RevokeToken disables a previously granted, valid token and revokes embedded permissions. Use for tokens with ttl ≤ 30 days; for longer TTLs, contact support.

### Method(s)

```
`1pn.RevokeToken().  
2        Token(string)  
`
```

*  requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.

### Sample code

```
1
  

```

### Returns

Returns an empty PNRevokeTokenResponse interface.

### Error Responses

May return: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

Decodes an existing token and returns its embedded permissions and TTL (useful for debugging).

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

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

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

If parsing fails, the token may be damaged; request a new one from the server.

## Set token

Clients use SetToken to update the current authentication token.

### Method(s)

```
`1pn.SetToken(token string)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

Last updated on Oct 29, 2025