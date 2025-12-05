# Access Manager v3 API for JavaScript SDK

Access Manager issues time-limited tokens with embedded permissions for PubNub resources:
- Scope by resource lists or RegEx patterns.
- Multiple resources and permission levels in a single request.
- Optionally restrict token usage to a specific authorized client (authorizedUuid/userId).

User ID / UUID
- User ID is referred to as UUID/uuid in some APIs and responses; its value equals the userId set at initialization.

Asynchronous patterns
- Supports Callbacks, Promises, Async/Await. Recommended: Async/Await with try...catch to receive error status.

## Grant token

Requires:
- Access Manager add-on enabled in Admin Portal.
- Secret Key authentication on server-side SDK instance.

Generates a time-limited token with TTL (minutes), authorized_uuid, and permissions over:
- channels
- groups (channel groups)
- uuids (users’ object metadata)

Permissions by resource:
- channel: read, write, get, manage, update, join, delete
- group: read, manage
- uuids: get, update, delete

Notes:
- ttl is required, in minutes: min 1, max 43,200 (30 days).
- Use patterns to define permissions by RegEx.
- authorized_uuid restricts token usage to a single client; if omitted, any uuid can use the token.

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
- ttl (number, required): minutes token is valid; 1–43,200.
- authorized_uuid (string): single uuid authorized to use the token.
- resources (object): explicit resource permissions.
  - resources.uuids (object): e.g., {"uuid-1": {get: true, update: true, delete: true}, "uuid-2": {...}}.
  - resources.channels (object): e.g., {"channel-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-id-2": {...}}.
  - resources.groups (object): e.g., {"group-id-1": {read: true, manage: true}, "group-id-2": {...}}.
- patterns (object): RegEx-based permissions.
  - patterns.uuids (object): e.g., {"uuid-pattern-1": {get: true, update: true, delete: true}, "uuid-pattern-2": {...}}.
  - patterns.channels (object): e.g., {"channel-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-pattern-2": {...}}.
  - patterns.groups (object): e.g., {"group-pattern-1": {read: true, manage: true}, "group-pattern-2": {...}}.
- meta (any): scalar-only extra metadata; arrays/objects not supported.

Required key/value mappings
- Provide permissions for at least one uuid, channel, or group via resources or patterns.

### Sample code

Reference code

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

Grant an authorized client different levels of access to various resources in a single call

- Grants my-authorized-uuid:
  - Read to channel-a, channel-group-b, and get to uuid-c.
  - Read/write to channel-b, channel-c, channel-d, and get/update to uuid-d.

```
1
  

```

Grant an authorized client read access to multiple channels using RegEx

- Grants my-authorized-uuid read on channels matching channel-[A-Za-z0-9].

```
1
  

```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

- Grants my-authorized-uuid:
  - Read to channel-a, channel-group-b, and get to uuid-c.
  - Read/write to channel-b, channel-c, channel-d, and get/update to uuid-d.
  - Read to channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses

- 400 Bad Request with details (e.g., RegEx, timestamp, permissions issues).

## Revoke token

Requirements:
- Access Manager add-on enabled.
- Revoke v3 Token enabled in keyset (Admin Portal > ACCESS MANAGER).
- Use for tokens with ttl ≤ 30 days; contact support for longer.

Disables an existing token granted via grantToken().

### Method(s)

```
`1pubnub.revokeToken(  
2    token: string  
3);  
`
```

Parameters
- token (string, required): existing token to revoke.

### Sample code

```
1
  

```

### Returns

- 200 OK on success.

### Error Responses

- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

Decodes a token and returns its embedded permissions and TTL. Useful for debugging.

### Method(s)

```
`1pubnub.parseToken(  
2    token: string  
3)  
`
```

Parameters
- token (string, required): token to decode.

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

- Parsing errors may indicate a damaged token; request a new one from the server.

## Set token

Clients use this to update the current authentication token.

### Method(s)

```
`1pubnub.setToken(  
2    token: string  
3)  
`
```

Parameters
- token (string, required): token with embedded permissions.

### Sample code

```
1
  

```

### Returns

- No response value.

## Grant token - spaces & users (deprecated)

Deprecated: Use grantToken() (channels, groups, uuids). This variant targets spaces and users and will be removed in a future version.

Requirements:
- Access Manager add-on enabled.
- Server-only: requires secretKey; never use in client SDKs.

Generates a token with ttl, authorizedUserId, and permissions over:
- spaces
- users (user metadata)

Permissions:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL: required; 1–43,200 minutes.

RegEx: define permissions under patterns.

Authorized user ID: authorizedUserId restricts token usage to one client.

### Method(s) - spaces & users (deprecated)

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
- ttl (number, required): 1–43,200 minutes.
- authorizedUserId (string): single userId authorized to use the token.
- resources.users (object): e.g., {"userId-1": {get: true, update: true, delete: true}, "userId-2": {...}}.
- resources.spaces (object): e.g., {"space-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-id-2": {...}}.
- patterns.users (object): e.g., {"userId-pattern-1": {get: true, update: true, delete: true}, "userId-pattern-2": {...}}.
- patterns.spaces (object): e.g., {"space-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-pattern-2": {...}}.
- meta (any): scalar-only metadata.

Required key/value mappings
- Provide permissions for at least one userId or space via resources or patterns.

### Sample code - spaces & users (deprecated)

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

### Returns - spaces & users (deprecated)

```
`1"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

### Other examples - spaces & users (deprecated)

Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)

- Grants my-authorized-userId:
  - Read access to space-a, and get to userId-c.
  - Read/write to space-b, space-c, space-d, and get/update to userId-d.

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

Grant an authorized client read access to multiple channels using RegEx - spaces & users (deprecated)

- Grants my-authorized-userId read access to spaces matching ^space-[A-Za-z0-9]$.

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

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call - spaces & users (deprecated)

- Grants my-authorized-userId:
  - Read access to space-a and userId-c.
  - Read/write access to space-b, space-c, space-d, and get/update to userId-d.
  - Read access to spaces matching ^space-[A-Za-z0-9]$.

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

- 400 Bad Request with details (e.g., RegEx, timestamp, permissions issues).

Last updated on Sep 3, 2025