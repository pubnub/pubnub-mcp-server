# Access Manager v3 API for Kotlin SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and emitted status events. These changes affect apps built with versions < 9.0.0. See Java/Kotlin SDK migration guide.

##### Gradle compatibility
Use Gradle 6.8+ for proper dependency resolution.

Access Manager v3 lets servers (using a Secret Key) grant clients time-limited tokens with embedded permissions for specific PubNub resources via lists or RegEx patterns, in a single request. You can restrict a token to a single client with authorizedUuid.

##### User ID / UUID
User ID may be referred to as UUID/uuid in APIs/responses but holds the value of userId set during initialization.

##### Request execution
Most SDK method invocations return an Endpoint. You must call .sync() or .async() to execute.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## Grant token[​](#grant-token)

##### Requires Access Manager add-on
Enable the Access Manager add-on for your key in the Admin Portal.

##### Requires Secret Key authentication
Use a PubNub instance initialized with a Secret Key.

grantToken() generates a time-limited token with ttl, authorizedUUID, and permissions for:
- channels
- channelGroups
- uuids (users’ object metadata)

Only authorizedUUID (if provided) can use the token. Invalid/unauthorized tokens return 403. Permissions can be applied by explicit lists or RegEx patterns. ttl is required (1–43,200 minutes).

Permissions by resource:
- channel: read, write, get, manage, update, join, delete
- channelGroups: read, manage
- uuids: get, update, delete

For permission mappings, TTL, RegEx, and authorized UUID guidance, see Manage Permissions with Access Manager v3.

### Method(s)[​](#methods)
```
`1grantToken(  
2  ttl: Integer,  
3  meta: Any,  
4  authorizedUUID: String,  
5  channels: ListChannelGrant>  
6  channelGroups: ListChannelGroupGrant>  
7  uuids: ListUUIDGrant>)  
`
```

Parameters:
- ttl (required) Type: Number, Default: n/a — Minutes the token is valid; min 1, max 43,200.
- meta Type: Object, Default: n/a — Scalar-only metadata; arrays/objects not supported.
- authorizedUUID Type: String, Default: n/a — Single uuid authorized to use the token.
- channels Type: list<Channel>, Default: n/a — Channel grants list or RegEx pattern.
- channelGroups Type: list<ChannelGroupGrant>, Default: n/a — Channel group grants list or RegEx pattern.
- uuids Type: list<UUIDGrant>, Default: n/a — UUID grants list or RegEx pattern.

##### Required key/value mappings
Specify permissions for at least one uuid, channel, or channelGroup, either as a list or a pattern (RegEx).

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
Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; get: uuid-c.
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)
Grants my-authorized-uuid read to channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)
Grants my-authorized-uuid:
- Read: channel-a, channel-group-b; get: uuid-c.
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.
- Read: channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses[​](#error-responses)
Invalid requests return 400 with details (e.g., RegEx, timestamp, permissions). Error details under PubNubException.

## Grant token - spaces & users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on
Enable the Access Manager add-on for your key in the Admin Portal.

grantToken() generates a token with ttl, authorizedUserId, and permissions for:
- spaces
- users (user metadata)

Only authorizedUserId (if provided) can use the token. Supports lists and RegEx patterns. ttl is required (1–43,200 minutes).

Permissions by resource:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

### Method(s)[​](#methods-1)
```
`1grantToken(  
2  ttl: Int,  
3  meta: Any?,  
4  authorizedUserId: UserId?,  
5  spacesPermissions: ListSpacePermissions>,  
6  usersPermissions: ListUserPermissions>,  
7)  
`
```

Parameters:
- ttl (required) Type: Int, Default: n/a — Minutes the token is valid; min 1, max 43,200.
- meta Type: Object, Default: n/a — Scalar-only metadata; arrays/objects not supported.
- authorizedUserId Type: UserId, Default: n/a — Single userId authorized to use the token.
- spacesPermissions Type: List<SpacePermissions>, Default: n/a — Space permissions list or RegEx patterns.
- usersPermissions Type: List<UserPermissions>, Default: n/a — User permissions list or RegEx patterns.

##### Required key/value mappings
Specify permissions for at least one User or Space, either as a list or a pattern (RegEx).

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
Grants my-authorized-userId:
- Read: space-a; get: userId-c.
- Read/write: space-b, space-c, space-d; get/update: userId-d.

```
1
  

```

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)
Grants my-authorized-userId read to spaces matching space-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)
Grants my-authorized-userId:
- Read: space-a and userId-c.
- Read/write: space-b, space-c, space-d; get/update: userId-d.
- Read: spaces matching space-[A-Za-z0-9].

```
1
  

```

### Error responses[​](#error-responses-1)
Invalid requests return 400 with details (e.g., RegEx, timestamp, permissions). Error details under PubNubException.

## Revoke token[​](#revoke-token)

##### Requires Access Manager add-on
Enable the Access Manager add-on for your key in the Admin Portal.

##### Enable token revoke
In the Admin Portal, enable Revoke v3 Token under ACCESS MANAGER.

revokeToken() disables an existing token and revokes its permissions. Only valid tokens obtained via grantToken() can be revoked. Use for ttl ≤ 30 days; for longer tokens, contact support.

### Method(s)[​](#methods-2)
```
`1revokeToken(token: String)  
`
```

Parameters:
- token (required) Type: String, Default: n/a — Existing token with embedded permissions.

### Sample code[​](#sample-code-2)
```
1
  

```

### Returns[​](#returns-2)
On success, returns Unit.

### Error Responses[​](#error-responses-2)
Possible errors: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token[​](#parse-token)

parseToken() decodes a token to reveal embedded permissions and ttl. Useful for debugging.

### Method(s)[​](#methods-3)
```
`1parseToken(String token)  
`
```

Parameters:
- token (required) Type: String, Default: n/a — Current token with embedded permissions.

### Sample code[​](#sample-code-3)
```
1
  

```

### Returns[​](#returns-3)
```
`1{  
2   "version":2,  
3   "timestamp":1629394579,  
4   "ttl":15,  
5   "authorized_uuid": "user1",  
6   "resources":{  
7      "uuids":{  
8         "user1":{  
9            "read":false,  
10            "write":false,  
11            "manage":false,  
12            "delete":false,  
13            "get":true,  
14            "update":true,  
15            "join":false  
16         }  
17      },  
18      "channels":{  
19         "channel1":{  
20            "read":true,  
21            "write":true,  
22            "manage":false,  
23            "delete":false,  
24            "get":false,  
25            "update":false,  
26            "join":false  
27         }  
28      },  
29      "groups":{  
30         "group1":{  
31            "read":true,  
32            "write":false,  
33            "manage":false,  
34            "delete":false,  
35            "get":false,  
36            "update":false,  
37            "join":false  
38         }  
39      }  
40   },  
41   "patterns":{  
42      "uuids":{  
43         ".*":{  
44            "read":false,  
45            "write":false,  
46            "manage":false,  
47            "delete":false,  
48            "get":true,  
49            "update":false,  
50            "join":false  
51         }  
52      },  
53      "channels":{  
54         ".*":{  
55            "read":true,  
56            "write":true,  
57            "manage":false,  
58            "delete":false,  
59            "get":false,  
60            "update":false,  
61            "join":false  
62         }  
63      },  
64      "groups":{  
65         ".*":{  
66            "read":true,  
67            "write":false,  
68            "manage":false,  
69            "delete":false,  
70            "get":false,  
71            "update":false,  
72            "join":false  
73         }  
74      }  
75   }  
76}  
`
```

### Error Responses[​](#error-responses-3)
Parse errors may indicate a damaged token; request a new one.

## Set token[​](#set-token)

setToken() is used by clients to update the auth token granted by the server.

### Method(s)[​](#methods-4)
```
`1setToken(String token)  
`
```

Parameters:
- token (required) Type: String, Default: n/a — Current token with embedded permissions.

### Sample code[​](#sample-code-4)
```
1
  

```

### Returns[​](#returns-4)
No return value.

Last updated on Sep 3, 2025