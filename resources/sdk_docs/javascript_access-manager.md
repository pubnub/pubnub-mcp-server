# Access Manager v3 API for JavaScript SDK

Access Manager issues time-limited tokens with embedded ACLs that control client access to PubNub resources:
- Limit by TTL.
- Grant by explicit resources or RegEx patterns.
- Combine multiple resource permissions in one grant (for example, read to channel1 and write to channel2).
- Optionally bind to a single client using authorizedUuid/userId.

User ID / UUID
- userId is also referred to as UUID/uuid in some APIs and server responses, and holds the value of the userId parameter set during initialization.

Supported async patterns
- Callbacks, Promises, and Async/Await are supported. Async/Await is recommended; add try...catch to handle errors.

## Grant token

Requires Access Manager add-on
- Enable Access Manager in the Admin Portal.

Requires Secret Key authentication
- Run grantToken from a server using an SDK instance initialized with a Secret Key.

Generates a token with ttl, authorized_uuid, and permissions over:
- channels
- groups (channel groups)
- uuids (users’ object metadata)

Only the authorized_uuid (if set) can use the token; unauthorized or invalid tokens return 403.

Permissions
- channels: read, write, get, manage, update, join, delete
- groups: read, manage
- uuids: get, update, delete
For mapping to API operations, see Manage Permissions with Access Manager v3.

TTL
- Required; minutes the token is valid. Min 1, max 43,200 (30 days). After expiry, issue a new token.

RegEx patterns
- Use patterns to grant by regular expression (under patterns).

Authorized UUID
- Restrict token usage to a specific authorized_uuid to prevent impersonation.

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
- ttl (number, required, Default: n/a): Token lifetime in minutes. Min 1, Max 43,200.
- authorized_uuid (string, Default: n/a): UUID authorized to use the token.
- resources (any, Default: n/a): Resource permissions object.
  - resources.uuids (any): UUID metadata permissions, for example: {"uuid-1": {get: true, update: true, delete: true}, "uuid-2": {...}}.
  - resources.channels (any): Channel permissions, for example: {"channel-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-id-2": {...}}.
  - resources.groups (any): Channel group permissions, for example: {"group-id-1": {read: true, manage: true}, "group-id-2": {...}}.
- patterns (any, Default: n/a): RegEx-based permissions object.
  - patterns.uuids (any): UUID metadata permissions by pattern, for example: {"uuid-pattern-1": {get: true, update: true, delete: true}, "uuid-pattern-2": {...}}.
  - patterns.channels (any): Channel permissions by pattern, for example: {"channel-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-pattern-2": {...}}.
  - patterns.groups (any): Channel group permissions by pattern, for example: {"group-pattern-1": {read: true, manage: true}, "group-pattern-2": {...}}.
- meta (any, Default: n/a): Extra scalar metadata to include with the request (no objects/arrays).

Required key/value mappings
- Grant must include at least one permission for a uuid, channel, or group, either in resources or patterns.

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
- my-authorized-uuid: read on channel-a and channel-group-b; get on uuid-c. Read/write on channel-b/channel-c/channel-d; get/update on uuid-d.

```
1
  
```

#### Grant an authorized client read access to multiple channels using RegEx
- my-authorized-uuid: read on channels matching channel-[A-Za-z0-9].

```
1
  
```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
- my-authorized-uuid: combine specific resource permissions and RegEx-based channel read access.

```
1
  
```

### Error responses
- 400 Bad Request with JSON details for invalid regex, timestamp, or permissions.

## Revoke token

Enable token revoke
- Access Manager must be enabled. In the keyset, enable Revoke v3 Token.

Disables an existing token issued via grantToken. Use for tokens with ttl ≤ 30 days; for longer tokens, contact support.

### Method(s)

```
`1pubnub.revokeToken(  
2    token: string  
3);  
`
```

Parameters
- token (string, required, Default: n/a): Existing token to revoke.

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

Decodes a token and returns its permissions and metadata. Useful for debugging or checking ttl.

### Method(s)

```
`1pubnub.parseToken(  
2    token: string  
3)  
`
```

Parameters
- token (string, required, Default: n/a): Token to decode.

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

Clients set/update the server-granted token to authenticate subsequent SDK operations.

### Method(s)

```
`1pubnub.setToken(  
2    token: string  
3)  
`
```

Parameters
- token (string, required, Default: n/a): Current token with embedded permissions.

### Sample code

```
1
  
```

### Returns
- No return value.

## Grant token - spaces & users (deprecated)

Deprecated
- Use grantToken() with channels/groups/uuids instead.

Requires Access Manager add-on
- Enable in Admin Portal.

Server only operation
- Requires secretKey; do not use secretKey in client SDKs.

Generates a token with ttl, authorizedUserId, and permissions over:
- spaces
- users (user metadata)

Only the authorizedUserId (if set) can use the token; invalid/unauthorized usage returns 403.

Permissions - spaces & users (deprecated)
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL - spaces & users (deprecated)
- Required; min 1, max 43,200. Recommended 10–60 minutes for security.

RegEx - spaces & users (deprecated)
- Use patterns to grant by regular expression.

Authorized user ID - spaces & users (deprecated)
- Restrict usage with authorizedUserId to prevent impersonation.

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
- ttl (number, required, Default: n/a): Token lifetime in minutes. Min 1, Max 43,200.
- authorizedUserId (string, Default: n/a): userId authorized to use the token.
- resources (any, Default: n/a): Resource permissions object.
  - resources.users (any): User permissions, e.g. {"userId-1": {get: true, update: true, delete: true}, "userId-2": {...}}.
  - resources.spaces (any): Space permissions, e.g. {"space-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-id-2": {...}}.
- patterns (any, Default: n/a): RegEx-based permissions.
  - patterns.users (any): User permissions by pattern, e.g. {"userId-pattern-1": {get: true, update: true, delete: true}, "userId-pattern-2": {...}}.
  - patterns.spaces (any): Space permissions by pattern, e.g. {"space-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-pattern-2": {...}}.
- meta (any, Default: n/a): Extra scalar metadata (no objects/arrays).

Required key/value mappings
- Include at least one permission for a userId or space in resources or patterns.

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

##### Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)

- my-authorized-userId: read to space-a and get to userId-c; read/write to space-b/space-c/space-d; get/update to userId-d.

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

- my-authorized-userId: read on spaces matching ^space-[A-Za-z0-9]$.

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

- Combine explicit resource and RegEx-based space permissions.

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
- 400 Bad Request with JSON details for invalid regex, timestamp, or permissions.

Last updated on Sep 3, 2025