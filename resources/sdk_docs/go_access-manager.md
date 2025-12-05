# Access Manager v3 API for Go SDK

Access Manager issues time-limited tokens with embedded permissions to PubNub resources:
- Limited time period (TTL).
- Resource lists or RegEx patterns.
- Multiple, differing permissions in one request.
- Optional restriction to a single authorized client via authorized UUID/UserId.

User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and server responses but holds the value of the userId parameter you set during initialization.

For details, see Manage Permissions with Access Manager v3.

## Grant token[​](#grant-token)

Requires Access Manager add-on
This method requires that the Access Manager add-on is enabled for your key in the Admin Portal.

Requires Secret Key authentication
Use a server-side SDK instance initialized with a Secret Key.

GrantToken() generates a token (with TTL, AuthorizedUUID, permissions) for:
- Channels
- ChannelGroups
- UUIDs

Only the AuthorizedUUID can use the token. Unauthorized or invalid usage returns 403.

Permissions and resources:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- UUIDs: get, update, delete

TTL
- Required; minutes the token is valid.
- Minimum 1; maximum 43,200 (30 days).

RegEx
Use patterns to grant permissions by resource type.

Authorized UUID
Restricts token usage to a single UUID to prevent impersonation.

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

* requiredParameterDescription`UUIDs`Type: `map[string]UUIDPermissions`Default:  
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

Required key/value mappings
You must specify permissions for at least one UUID, Channel, or ChannelGroup (list or RegEx).

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

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

```
1
  

```

### Error responses[​](#error-responses)
HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions).

## Grant token - spaces & users[​](#grant-token---spaces--users)

Requires Access Manager add-on
This method requires that the Access Manager add-on is enabled for your key in the Admin Portal.

grantToken() generates a token (with ttl, authorizedUserId, permissions) for:
- spaces
- users

Only the authorizedUserId can use the token. Unauthorized or invalid usage returns 403.

Permissions and resources:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL
- Required; minutes the token is valid.
- Minimum 1; maximum 43,200 (30 days).

RegEx
Use patterns to grant permissions by resource type.

Authorized user ID
Restricts token usage to a single userId to prevent impersonation.

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

* requiredParameterDescription`UsersPermissions`Type: `map[UserId]UserPermissions`Default:  
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

Required key/value mappings
Specify permissions for at least one User or Space (list or RegEx).

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
show all 30 lines

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)

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
show all 35 lines

### Error responses[​](#error-responses-1)
HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions).

## Revoke token[​](#revoke-token)

Requires Access Manager add-on
Enable token revoke in Admin Portal (Revoke v3 Token).

RevokeToken() disables a valid token previously obtained via GrantToken(). Use for tokens with ttl ≤ 30 days; for longer, contact support.

### Method(s)[​](#methods-2)

```
`1pn.RevokeToken().  
2        Token(string)  
`
```

* requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)
Empty PNRevokeTokenResponse.

### Error Responses[​](#error-responses-2)
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token[​](#parse-token)

ParseToken() decodes a token and returns permissions and TTL. Useful for debugging.

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

* requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

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

SetToken() updates the client’s current token.

### Method(s)[​](#methods-4)

```
`1pn.SetToken(token string)  
`
```

* requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)
No return value.

Last updated on Oct 29, 2025