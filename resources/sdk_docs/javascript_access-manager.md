# Access Manager v3 API for JavaScript SDK

Access Manager issues time-limited tokens with embedded permissions for PubNub resources.

- Restrict by TTL, resource lists, or RegEx patterns.
- Optionally restrict to a single client via authorizedUuid.
- Supports mixed permissions per resource in one grant.

User ID / UUID
- userId equals UUID value used in some APIs/responses.

Supported async patterns
- Callbacks, Promises, Async/Await supported; use Async/Await with try...catch to capture errors.

## Grant token

Requires Access Manager add-on enabled in Admin Portal.

Requires Secret Key authentication
- Initialize the server-side SDK with a Secret Key to grant tokens.

Generates a token with ttl, optional authorized_uuid, and permissions for:
- channels
- groups (channel groups)
- uuids (user object metadata)

Only authorized_uuid (if specified) can use the token. Unauthorized/invalid tokens result in 403.

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- group: read, manage
- uuids: get, update, delete

TTL
- Required, minutes.
- Min 1, max 43,200 (30 days).

RegEx patterns
- Use patterns to grant by RegEx.

Authorized UUID
- Set authorized_uuid to bind a token to a specific client; omit to allow any uuid.

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

- ttl (number, required): Minutes token is valid. Min 1, max 43,200.
- authorized_uuid (string): Single uuid allowed to use the token.
- resources (any): Resource permissions object.
  - resources.uuids (any): Example: {"uuid-1": {get: true, update: true, delete: true},"uuid-2": {...}}.
  - resources.channels (any): Example: {"channel-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true},"channel-id-2": {...}}.
  - resources.groups (any): Example: {"group-id-1": {read: true, manage: true},"group-id-2": {...}}.
- patterns (any): Permissions by RegEx pattern.
  - patterns.uuids (any): Example: {"uuid-pattern-1": {get: true, update: true, delete: true},"uuid-pattern-2": {...}}.
  - patterns.channels (any): Example: {"channel-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-pattern-2": {...}}.
  - patterns.groups (any): Example: {"group-pattern-1": {read: true, manage: true}, "group-pattern-2": {...}}.
- meta (any): Scalar-only metadata (no arrays/objects).

Required key/value mappings
- Specify at least one permission for a uuid, channel, or group via resources or patterns.

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
  - Read: channel-a, channel-group-b; Get: uuid-c
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d
```
1
  

```

Grant an authorized client read access to multiple channels using RegEx
- Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].
```
1
  

```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d
  - Read: channels matching channel-[A-Za-z0-9]
```
1
  

```

### Error responses
- Invalid requests return 400 with details (e.g., RegEx, timestamp, permissions) in JSON.

## Revoke token

Enable token revoke
- Access Manager must be enabled; enable Revoke v3 Token in keyset settings.

Disables an existing token previously obtained via grantToken(). Use for ttl ≤ 30 days; for longer TTL, contact support.

### Method(s)
```
`1pubnub.revokeToken(  
2    token: string  
3);  
`
```

- token (string, required): Existing token.

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

Decodes a token and returns embedded permissions; useful for debugging and checking ttl.

### Method(s)
```
`1pubnub.parseToken(  
2    token: string  
3)  
`
```

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
- Parsing errors may indicate a damaged token; request a new token from the server.

## Set token

Client-side method to set/update the current auth token.

### Method(s)
```
`1pubnub.setToken(  
2    token: string  
3)  
`
```

- token (string, required): Current token.

### Sample code
```
1
  

```

### Returns
- No return value.

## Grant token - spaces & users (deprecated)

Deprecated: Use grantToken() with channels, groups, uuids.

Requires Access Manager add-on. Server-only with secretKey; don’t use secretKey in client SDKs.

Generates a token with ttl, authorizedUserId, permissions for:
- spaces
- users (user metadata)

Permissions (deprecated):
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL (deprecated)
- Required; max 43,200. Recommended 10–60 minutes.

RegEx (deprecated)
- Use patterns to grant by RegEx.

Authorized user ID (deprecated)
- Bind token to authorizedUserId to prevent impersonation.

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

- ttl (number, required): Min 1, max 43,200.
- authorizedUserId (string): Single userId allowed.
- resources (any):
  - resources.users (any): {"userId-1": {get: true, update: true, delete: true},"userId-2": {...}}.
  - resources.spaces (any): {"space-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true},"space-id-2": {...}}.
- patterns (any):
  - patterns.users (any): {"userId-pattern-1": {get: true, update: true, delete: true},"userId-pattern-2": {...}}.
  - patterns.spaces (any): {"space-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-pattern-2": {...}}.
- meta (any): Scalar-only metadata.

Required key/value mappings
- Specify at least one permission for a userId or space via resources or patterns.

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
  - Read: space-a; Get: userId-c
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d
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
- Grants my-authorized-userId read on spaces matching ^space-[A-Za-z0-9]$.
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
  - Read: space-a and userId-c
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d
  - Read: spaces matching ^space-[A-Za-z0-9]$
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

Error responses - spaces & users (deprecated)
- Invalid requests return 400 with JSON details.

Last updated on Sep 3, 2025