# Access Manager v3 API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin and Java SDKs unified; new PubNub client instantiation; updated async callbacks and emitted status events.
- Migration details: Java/Kotlin SDK migration guide.

##### Gradle compatibility
- Use Gradle 6.8+ for reliable dependency resolution.

Access Manager v3 lets servers (initialized with a Secret Key) grant clients time-limited tokens with embedded permissions for PubNub resources:
- Time-limited access (TTL up to 43,200 minutes).
- Resource lists or RegEx patterns.
- Mixed permissions in a single request (e.g., read channel1, write channel2).
- Restrict a token to a single client via authorizedUuid/authorizedUserId.

##### User ID / UUID
- User ID may be called UUID/uuid in APIs and responses; it holds the value of userId set during initialization.

For core concepts, see Manage Permissions with Access Manager v3.

##### Request execution
Most SDK methods return an Endpoint. You must call .sync() or .async() to execute.

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

## Grant token

##### Requires Access Manager add-on
Enable Access Manager for your key in the Admin Portal.

##### Requires Secret Key authentication
Use a server-side SDK instance initialized with a Secret Key.

The grantToken() method issues a token with:
- ttl (minutes, required, 1–43,200).
- authorizedUUID (recommended for single-client enforcement).
- Permissions for:
  - channels
  - channelGroups
  - uuids (users’ object metadata)

Unauthorized or invalid tokens return 403.

- Permissions: channels (read, write, get, manage, update, join, delete), channelGroups (read, manage), uuids (get, update, delete).
- TTL: required; max 43,200 minutes (30 days).
- Patterns: define permissions using RegEx via patterns.
- Authorized UUID: restrict token to one uuid to prevent impersonation.

### Method(s)

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

- ttl (Number, required): Minutes token is valid. Min 1, max 43,200.
- meta (Object): Scalar-only metadata; arrays/objects not supported.
- authorizedUUID (String): Single uuid allowed to use the token.
- channels (list<Channel>): Channel grants as list or RegEx pattern.
- channelGroups (list<ChannelGroupGrant>): Channel group grants as list or RegEx pattern.
- uuids (list<UUIDGrant>): UUID grants as list or RegEx pattern.

##### Required key/value mappings
Specify permissions for at least one uuid, channel, or channelGroup (list or RegEx).

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
- Read via RegEx: channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses
400 Bad Request with details (e.g., invalid RegEx, timestamp, or permissions). Errors returned as a string under PubNubException.

## Grant token - spaces & users

##### Requires Access Manager add-on
Enable in Admin Portal.

grantToken() issues a token with:
- ttl (required), authorizedUserId, and permissions for:
  - spaces
  - users (user metadata)
- Supports lists and RegEx patterns; mixed permissions in one call.
- Only authorizedUserId can use the token. Unauthorized/invalid returns 403.

- Permissions: space (read, write, get, manage, update, join, delete), user (get, update, delete).
- TTL: required; max 43,200 minutes.
- Patterns: grant via RegEx.
- Authorized user ID: restrict to a single userId to prevent impersonation.

### Method(s)

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

- ttl (Int, required): Minutes valid. Min 1, max 43,200.
- meta (Object): Scalar-only metadata.
- authorizedUserId (UserId): Single userId allowed to use the token.
- spacesPermissions (List<SpacePermissions>): List of permissions or RegEx patterns.
- usersPermissions (List<UserPermissions>): List of permissions or RegEx patterns.

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
Grants my-authorized-userId:
- Read: space-a; get: userId-c.
- Read/write: space-b, space-c, space-d; get/update: userId-d.

```
1
  

```

#### Grant an authorized client read access to multiple spaces using RegEx
Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call
Grants my-authorized-userId:
- Read: space-a and userId-c.
- Read/write: space-b, space-c, space-d; get/update: userId-d.
- Read via RegEx: spaces matching space-[A-Za-z0-9].

```
1
  

```

### Error responses
400 Bad Request with details (e.g., invalid RegEx, timestamp, or permissions). Errors returned as a string under PubNubException.

## Revoke token

##### Requires Access Manager add-on
Enable in Admin Portal.

##### Enable token revoke
Turn on “Revoke v3 Token” in your keyset (ACCESS MANAGER section) before using revokeToken().

revokeToken() disables an existing token granted via grantToken(). Use for tokens with ttl ≤ 30 days; for longer TTL, contact support.

### Method(s)

```
`1revokeToken(token: String)  
`
```

- token (String, required): Existing token with embedded permissions.

### Sample code

```
1
  

```

### Returns
Returns Unit on success.

### Error Responses
Possible: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

parseToken() decodes a token and returns its embedded permissions and TTL. Useful for debugging.

### Method(s)

```
`1parseToken(String token)  
`
```

- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

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

### Error Responses
If parsing fails, the token may be damaged; request a new one from your server.

## Set token

setToken() updates the client’s authentication token.

### Method(s)

```
`1setToken(String token)  
`
```

- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns
No return value.

Last updated on Sep 3, 2025