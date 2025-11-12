# Access Manager v3 API for Go SDK

Access Manager lets servers (initialized with a Secret Key) grant time-limited tokens with embedded permissions for PubNub resources:
- Channels, Channel Groups, UUIDs (user object metadata)
- By lists or RegEx patterns
- With different permissions per resource in one request
- Optional Authorized UUID to bind token to a single client

Unauthorized or invalid tokens return HTTP 403.

##### User ID / UUID
“User ID” may be referred to as UUID/uuid in some APIs/responses and holds the value of userId set during initialization.

For full concepts, see Manage Permissions with Access Manager v3.

## Grant token[​](#grant-token)

##### Requires Access Manager add-on
Enable Access Manager on your key in the Admin Portal.

##### Requires Secret Key authentication
Call grant from a server SDK instance initialized with a Secret Key.

The `GrantToken()` method issues a token with:
- TTL (minutes, required; 1–43,200)
- AuthorizedUUID (optional; restricts usage to a single client UUID)
- Permissions over Channels, ChannelGroups, UUIDs
- Optional RegEx patterns for each resource type

Permissions per resource type:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- UUIDs: get, update, delete

### Method(s)[​](#methods)

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

- UUIDs  
  Type: map[string]UUIDPermissions  
  Map of uuids to permissions.
- Channels  
  Type: map[string]ChannelPermissions  
  Map of channel names to permissions.
- ChannelGroups  
  Type: map[string]GroupPermissions  
  Map of channel group ids to permissions.
- UUIDsPattern  
  Type: map[string]UUIDPermissions  
  Map of uuid patterns to permissions.
- ChannelsPattern  
  Type: map[string]ChannelPermissions  
  Map of channel patterns to permissions.
- ChannelGroupsPattern  
  Type: map[string]GroupPermissions  
  Map of channel group patterns to permissions.
- TTL  (required)  
  Type: Number  
  Total minutes the token is valid. Min 1; Max 43,200 (30 days).
- AuthorizedUUID  
  Type: String  
  Single UUID authorized to use the token.
- Meta  
  Type: Object  
  Extra scalar metadata to publish with the request (no arrays/objects).

##### Required key/value mappings
Specify permissions for at least one UUID, Channel, or ChannelGroup (list or RegEx pattern).

### Sample code[​](#sample-code)

##### Reference code
```
1
  

```

### Returns[​](#returns)

```
`1PNGrantTokenResponse{  
2  Data: PNGrantTokenData{  
3      Message: "Success",  
4      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI",  
5  }  
6}  
`
```

### Other examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

Grants my-authorized-uuid:
- Read to channel-a, channel-group-b; get to uuid-c
- Read/write to channel-b, channel-c, channel-d; get/update to uuid-d

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

Grants my-authorized-uuid:
- Read to channel-a, channel-group-b; get to uuid-c
- Read/write to channel-b, channel-c, channel-d; get/update to uuid-d
- Read to channels matching channel-[A-Za-z0-9]

```
1
  

```

### Error responses[​](#error-responses)
HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions).

## Grant token - spaces & users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on
Enable Access Manager on your key in the Admin Portal.

The `grantToken()` method issues a token with:
- TTL (minutes, required; 1–43,200)
- AuthorizedUserId (optional; restricts usage to a single client)
- Permissions over spaces and users
- Optional RegEx patterns

Permissions:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

### Method(s)[​](#methods-1)

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

- UsersPermissions  
  Type: map[UserId]UserPermissions  
  Map of Users to permissions.
- SpacesPermissions  
  Type: map[SpaceId]SpacePermissions  
  Map of Spaces to permissions.
- UserPatternsPermissions  
  Type: map[string]UserPermissions)  
  Map of User patterns to permissions.
- SpacePatternsPermissions  
  Type: map[string]SpacePermissions  
  Map of Space patterns to permissions.
- TTL  (required)  
  Type: Number  
  Total minutes the token is valid. Min 1; Max 43,200 (30 days).
- AuthorizedUserId  
  Type: UserId  
  Single UserId authorized to use the token.
- Meta  
  Type: Object  
  Extra scalar metadata to publish with the request (no arrays/objects).

##### Required key/value mappings
Specify permissions for at least one User or Space (list or RegEx pattern).

### Sample code[​](#sample-code-1)

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

### Returns[​](#returns-1)

```
`1PNGrantTokenResponse{  
2  Data: PNGrantTokenData{  
3      Message: "Success",  
4      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI",  
5  }  
6}  
`
```

### Other examples[​](#other-examples-1)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call-1)

Grants my-authorized-userId:
- Read to space-a; get to userId-c
- Read/write to space-b, space-c, space-d; get/update to userId-d

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

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)

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

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)

Grants my-authorized-userId:
- Read to space-a and userId-c
- Read/write to space-b, space-c, space-d; get/update to userId-d
- Read to spaces matching space-[A-Za-z0-9]

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

### Error responses[​](#error-responses-1)
HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions).

## Revoke token[​](#revoke-token)

##### Requires Access Manager add-on
Enable Access Manager on your key in the Admin Portal.

##### Enable token revoke
In the Admin Portal, enable Revoke v3 Token for your keyset.

`RevokeToken()` disables an existing valid token previously obtained by `GrantToken()`. Use for tokens with TTL ≤ 30 days; for longer TTLs, contact support.

### Method(s)[​](#methods-2)

```
`1pn.RevokeToken().  
2        Token(string)  
`
```

- Token  (required)  
  Type: string  
  Existing token with embedded permissions.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)
Returns an empty PNRevokeTokenResponse interface.

### Error Responses[​](#error-responses-2)
May return: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token[​](#parse-token)

`ParseToken()` decodes a token and returns embedded permissions and details (e.g., TTL). Useful for debugging.

Import:
```
`1import (  
2        pubnub "github.com/pubnub/go/v5")  
`
```

### Method(s)[​](#methods-3)

```
`1pubnub.ParseToken(token string)  
`
```

- token  (required)  
  Type: String  
  Current token with embedded permissions.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

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

### Error Responses[​](#error-responses-3)
If parsing fails, the token may be damaged; request a new token from the server.

## Set token[​](#set-token)

`SetToken()` is used by clients to set/update the authentication token granted by the server.

### Method(s)[​](#methods-4)

```
`1pn.SetToken(token string)  
`
```

- token  (required)  
  Type: String  
  Current token with embedded permissions.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)
No return value.

Last updated on Oct 29, 2025