# Access Manager v3 API for JavaScript SDK

Access Manager issues time-limited tokens with embedded permissions for PubNub resources. Tokens can:
- Apply to channels, channel groups, and UUIDs.
- Be limited by TTL, regex patterns, and an authorized UUID.
- Grant different permissions to different resources in a single request.

- To bind a token to one client, include authorizedUuid in the grant request. Only that userId/UUID can use the token.

##### User ID / UUID
User ID may also appear as UUID/uuid in some APIs; it carries the value of userId set at initialization.

##### Supported asynchronous patterns
Use Async/Await with try...catch (recommended). Callbacks and Promises are also supported.

## Grant token
##### Requires Access Manager add-on
Enable Access Manager on your keyset in the Admin Portal.

##### Requires Secret Key authentication
Granting must be performed server-side with an SDK instance initialized with a Secret Key.

Generates an authorization token with:
- ttl (minutes, required),
- authorized_uuid (optional, recommended for impersonation prevention),
- resource and/or pattern permissions.

Resources:
- channels
- groups (channel groups)
- uuids (user object metadata)

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- group: read, manage
- uuids: get, update, delete

TTL:
- Required, minutes; min 1, max 43,200 (30 days). After expiry, clients must obtain a new token.

Patterns (regex):
- Specify permissions under patterns to match multiple resources.

Authorized UUID:
- If set, only that uuid can use the token; otherwise any uuid can.

### Method(s)
```
`1pubnub.grantToken({  
2    ttl: number,  
3    authorized_uuid: string,  
4    resources: any,  
5    patterns: any,  
6    meta: any  
7})  
`
```

Parameters
- ttl (number, required): Minutes token is valid. Min 1, max 43,200.
- authorized_uuid (string): UUID authorized to use this token.
- resources (any): Resource permissions.
  - resources.uuids (any): UUID metadata permissions, e.g. {"uuid-1": {get: true, update: true, delete: true},"uuid-2": {...}}.
  - resources.channels (any): Channel permissions, e.g. {"channel-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true},"channel-id-2": {...}}.
  - resources.groups (any): Channel group permissions, e.g. {"group-id-1": {read: true, manage: true},"group-id-2": {...}}.
- patterns (any): Regex-based permissions.
  - patterns.uuids (any): Apply to UUIDs matching regex, e.g. {"uuid-pattern-1": {get: true, update: true, delete: true},"uuid-pattern-2": {...}}.
  - patterns.channels (any): Apply to channels matching regex, e.g. {"channel-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-pattern-2": {...}}.
  - patterns.groups (any): Apply to groups matching regex, e.g. {"group-pattern-1": {read: true, manage: true}, "group-pattern-2": {...}}.
- meta (any): Scalar-only extra metadata (no arrays/objects).

##### Required key/value mappings
Provide at least one permission for a uuid, channel, or group via resources or patterns.

### Sample code
##### Reference code
```
1
  

```

```
1
  

```

### Returns
```
`1"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

### Other examples
#### Grant an authorized client different levels of access to various resources in a single call
- my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c.
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.
```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx
- my-authorized-uuid:
  - Read: all channels matching channel-[A-Za-z0-9].
```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
- my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c.
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.
  - Read: all channels matching channel-[A-Za-z0-9].
```
1
  

```

### Error responses
400 Bad Request with JSON details (e.g., invalid regex, timestamp, or permissions).

## Revoke token
##### Enable token revoke
Enable Access Manager and the Revoke v3 Token option on the keyset.

Disables a previously granted valid token (ttl ≤ 30 days; contact support for longer).

### Method(s)
```
`1pubnub.revokeToken(  
2    token: string  
3);  
`
```

Parameters
- token (string, required): Existing token.

### Sample code
```
1
  

```

### Returns
200 OK on success.

### Error Responses
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token
Decodes an existing token and returns embedded permissions and details (including ttl).

### Method(s)
```
`1pubnub.parseToken(  
2    token: string  
3)  
`
```

Parameters
- token (string, required): Current token.

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
Parsing errors typically indicate a damaged token; request a new one from the server.

## Set token
Clients update the current authentication token.

### Method(s)
```
`1pubnub.setToken(  
2    token: string  
3)  
`
```

Parameters
- token (string, required): Current token.

### Sample code
```
1
  

```

### Returns
No return value.

## Grant token - spaces & users (deprecated)
##### Deprecated
Use grantToken() with channels, groups, and uuids instead.

##### Requires Access Manager add-on
Enable on your keyset.

##### Server only operation
Requires secretKey; do not use secretKey in client SDKs.

Generates a token with:
- ttl (required),
- authorizedUserId,
- resources/patterns for spaces and users.

Permissions (deprecated resources):
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL:
- Required; max 43,200 minutes. Recommended 10–60 minutes.

Regex:
- Use patterns for permission-by-pattern.

Authorized user ID:
- If set, only that userId can use the token.

#### Method(s) - spaces & users (deprecated)
```
`1pubnub.grantToken({  
2    ttl: number,  
3    authorizedUserId: string,  
4    resources: any,  
5    patterns: any,  
6    meta: any  
7})  
`
```

Parameters
- ttl (number, required): Minutes token is valid. Min 1, max 43,200.
- authorizedUserId (string): Authorized userId.
- resources (any):
  - resources.users: e.g. {"userId-1": {get: true, update: true, delete: true},"userId-2": {...}}.
  - resources.spaces: e.g. {"space-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true},"space-id-2": {...}}.
- patterns (any):
  - patterns.users: e.g. {"userId-pattern-1": {get: true, update: true, delete: true},"userId-pattern-2": {...}}.
  - patterns.spaces: e.g. {"space-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-pattern-2": {...}}.
- meta (any): Scalar-only metadata.

##### Required key/value mappings
Provide at least one permission for a userId or space via resources or patterns.

#### Sample code - spaces & users (deprecated)
```
`1try {  
2    const token = await pubnub.grantToken({  
3        ttl: 15,  
4        authorizedUserId: "my-authorized-userId",  
5        resources: {  
6            spaces: {  
7                "my-space": {  
8                    read: true,  
9                },  
10            },  
11        },  
12    });  
13} catch (status) {  
14    console.log(status);  
15}  
`
```

#### Returns - spaces & users (deprecated)
```
`1"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

#### Other examples - spaces & users (deprecated)
##### Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)
- my-authorized-userId:
  - Read: space-a; Get: userId-c.
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d.
```
`1try {  
2    const token = await pubnub.grantToken({  
3        ttl: 15,  
4        authorizedUserId: "my-authorized-userId",  
5        resources: {  
6            spaces: {  
7                "space-a": {  
8                    read: true,  
9                },  
10                "space-b": {  
11                    read: true,  
12                    write: true,  
13                },  
14                "space-c": {  
15                    read: true,  
16                    write: true,  
17                },  
18                "space-d": {  
19                    read: true,  
20                    write: true,  
21                },  
22            },  
23            users: {  
24                "userId-c": {  
25                    get: true,  
26                },  
27                "userId-d": {  
28                    get: true,  
29                    update: true,  
30                },  
31            },  
32        },  
33    });  
34} catch (status) {  
35    console.log(status);  
36}  
`
```

##### Grant an authorized client read access to multiple channels using RegEx - spaces & users (deprecated)
- my-authorized-userId:
  - Read: all spaces matching ^space-[A-Za-z0-9]$.
```
`1try {  
2    const token = await pubnub.grantToken({  
3        ttl: 15,  
4        authorizedUserId: "my-authorized-userId",  
5        patterns: {  
6            spaces: {  
7                "^space-[A-Za-z0-9]$": {  
8                    read: true,  
9                },  
10            },  
11        },  
12    });  
13} catch (status) {  
14    console.log(status);  
15}  
`
```

##### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call - spaces & users (deprecated)
- my-authorized-userId:
  - Read: space-a and userId-c.
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d.
  - Read: all spaces matching ^space-[A-Za-z0-9]$.
```
`1try {  
2    const token = await pubnub.grantToken({  
3        ttl: 15,  
4        authorizedUserId: "my-authorized-userId",  
5        resources: {  
6            spaces: {  
7                "space-a": {  
8                    read: true,  
9                },  
10                "space-b": {  
11                    read: true,  
12                    write: true,  
13                },  
14                "space-c": {  
15                    read: true,  
16                    write: true,  
17                },  
18                "space-d": {  
19                    read: true,  
20                    write: true,  
21                },  
22            },  
23            users: {  
24                "userId-c": {  
25                    get: true,  
26                },  
27                "userId-d": {  
28                    get: true,  
29                    update: true,  
30                },  
31            },  
32        },  
33        patterns: {  
34            spaces: {  
35                "^space-[A-Za-z0-9]$": {  
36                    read: true  
37                },  
38            },  
39        },  
40    });  
41} catch (status) {  
42    console.log(status);  
43}  
`
```

#### Error responses - spaces & users (deprecated)
400 Bad Request with JSON details (e.g., invalid regex, timestamp, or permissions).