# Access Manager v3 API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and status events. Apps using < 9.0.0 may be impacted.
- See Java/Kotlin SDK migration guide.

##### Gradle compatibility
- Use Gradle 6.8+ for proper dependency resolution.

Access Manager v3 lets servers (initialized with a Secret Key) grant time-limited tokens with embedded permissions for PubNub resources using lists or RegEx patterns, optionally restricted to a single authorized client (`authorizedUuid` / `authorizedUserId`).

##### User ID / UUID
- “UUID/uuid” in some APIs is the same value as the `userId` set during initialization.

##### Request execution
- Most SDK calls return an Endpoint. You must call `.sync()` or `.async()` to execute.

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
Enable in Admin Portal.

##### Requires Secret Key authentication
Initialize the server SDK with a Secret Key.

`grantToken()` issues a token with `ttl`, optional `authorizedUUID`, and permissions for:
- channels
- channelGroups
- uuids

Unauthorized or invalid requests return 403.

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- channelGroups: read, manage
- uuids: get, update, delete

TTL
- Required; minutes; min 1, max 43,200 (30 days). No default.

Patterns
- Use RegEx via `patterns` instead of enumerating resources.

Authorized UUID
- Restrict token to one client via `authorizedUUID`. Recommended.

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

- ttl (required)
  - Type: Number
  - Total minutes token is valid; [1..43,200].
- meta
  - Type: Object
  - Extra metadata; scalar values only (no arrays/objects).
- authorizedUUID
  - Type: String
  - Single uuid authorized to use the token.
- channels
  - Type: list<Channel>
  - Channel grants list or RegEx pattern.
- channelGroups
  - Type: list<ChannelGroupGrant>
  - Channel group grants list or RegEx pattern.
- uuids
  - Type: list<UUIDGrant>
  - UUID grants list or RegEx pattern.

##### Required key/value mappings
- Specify permissions for at least one uuid, channel, or channelGroup (list or pattern).

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
- Read: channel-a, channel-group-b; get: uuid-c
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
Grants `my-authorized-uuid` read to channels matching `channel-[A-Za-z0-9]`.

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
Grants `my-authorized-uuid`:
- Read: channel-a, channel-group-b; get: uuid-c
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d
- Read to channels matching `channel-[A-Za-z0-9]`

```
1
  

```

### Error responses
- Invalid requests return 400 with details (e.g., RegEx, timestamp, permissions). Errors under PubNubException.

## Grant token - spaces & users

##### Requires Access Manager add-on
Enable in Admin Portal.

`grantToken()` issues a token with `ttl`, optional `authorizedUserId`, and permissions for:
- spaces
- users

Permissions per resource:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL, patterns, and authorization work as above (use `authorizedUserId`).

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

- ttl (required)
  - Type: Int
  - Total minutes token is valid; [1..43,200].
- meta
  - Type: Object
  - Extra metadata; scalar values only.
- authorizedUserId
  - Type: UserId
  - Single userId authorized to use the token.
- spacesPermissions
  - Type: List<SpacePermissions>
  - Space permissions (list or RegEx patterns).
- usersPermissions
  - Type: List<UserPermissions>
  - User permissions (list or RegEx patterns).

##### Required key/value mappings
- Specify permissions for at least one User or Space (list or pattern).

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
- Read: space-a; get: userId-c
- Read/write: space-b, space-c, space-d; get/update: userId-d

```
1
  

```

#### Grant an authorized client read access to multiple spaces using RegEx
Grants `my-authorized-userId` read to spaces matching `space-[A-Za-z0-9]`.

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call
Grants `my-authorized-userId`:
- Read: space-a and userId-c
- Read/write: space-b, space-c, space-d; get/update: userId-d
- Read to spaces matching `space-[A-Za-z0-9]`

```
1
  

```

### Error responses
- Invalid requests return 400 with details (e.g., RegEx, timestamp, permissions). Errors under PubNubException.

## Revoke token

##### Requires Access Manager add-on
Enable in Admin Portal.

##### Enable token revoke
- In Admin Portal, enable “Revoke v3 Token” on the keyset.

`revokeToken()` disables a previously granted valid token. Use for tokens with ttl ≤ 30 days; contact support for longer ttl.

### Method(s)

```
`1revokeToken(token: String)  
`
```

- token (required)
  - Type: String
  - Existing token to revoke.

### Sample code

```
1
  

```

### Returns
- Unit on success.

### Error Responses
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

`parseToken()` decodes a token and returns its embedded permissions and ttl (useful for debugging).

### Method(s)

```
`1parseToken(String token)  
`
```

- token (required)
  - Type: String
  - Token to decode.

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
- Parsing errors may indicate a damaged token; request a new one.

## Set token

`setToken()` updates the client’s authentication token.

### Method(s)

```
`1setToken(String token)  
`
```

- token (required)
  - Type: String
  - Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns
- No response value.

Last updated on Sep 3, 2025