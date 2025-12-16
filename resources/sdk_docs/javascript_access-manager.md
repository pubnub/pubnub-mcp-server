# Access Manager v3 API for JavaScript SDK

Access Manager enforces client access controls in PubNub using **time-limited tokens** with embedded permissions for specific resources, optionally restricted to a single client via `authorized_uuid` (token usable only by that `userId`/UUID). Tokens can grant different permission levels across multiple resources in **one request**, including via **resource lists** or **RegEx patterns**.

**User ID / UUID:** `UUID`/`uuid` in APIs maps to the `userId` set during initialization.

**Async patterns:** Callbacks, Promises, Async/Await supported; examples use Async/Await. Add `try...catch` to capture error status.

---

## Grant token[​](#grant-token)

**Requires Access Manager add-on** enabled for the keyset in Admin Portal.

**Requires Secret Key authentication (server-side):** Use an SDK instance initialized with a **Secret Key**. Do not use Secret Key in client apps.

`grantToken()` generates a token embedding:
- `ttl` (minutes, required; max **43,200** = 30 days; min **1**; no default)
- optional `authorized_uuid` (restrict token to one client)
- permissions for `channels`, `groups`, `uuids`
- optional `patterns` (RegEx-based permissions)
- optional scalar-only `meta`

**Permission keys (by resource type):**
- `channel`: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`
- `group`: `read`, `manage`
- `uuids`: `get`, `update`, `delete`

**Required mapping:** You must specify permissions for at least one `uuid`, `channel`, or `group` via `resources` or `patterns`.

### Method(s)[​](#methods)

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

**Parameters**
- `ttl` *(required)*: `number` — minutes token is valid; min `1`, max `43,200`.
- `authorized_uuid`: `string` — single `uuid` allowed to use token.
- `resources`: `any` — explicit resource permissions:
  - `resources.uuids`: `any` — e.g. `{"uuid-1": {get: true, update: true, delete: true}, ...}`
  - `resources.channels`: `any` — e.g. `{"channel-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, ...}`
  - `resources.groups`: `any` — e.g. `{"group-id-1": {read: true, manage: true}, ...}`
- `patterns`: `any` — RegEx-based permissions:
  - `patterns.uuids`: `any` — e.g. `{"uuid-pattern-1": {get: true, update: true, delete: true}, ...}`
  - `patterns.channels`: `any` — e.g. `{"channel-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, ...}`
  - `patterns.groups`: `any` — e.g. `{"group-pattern-1": {read: true, manage: true}, ...}`
- `meta`: `any` — scalar-only metadata (no arrays/objects).

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

```
1
  

```

### Returns[​](#returns)

```
`1"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

### Other examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

Grants `my-authorized-uuid`:
- Read: `channel-a`, `channel-group-b`; Get: `uuid-c`
- Read/Write: `channel-b`, `channel-c`, `channel-d`; Get/Update: `uuid-d`

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

Grants `my-authorized-uuid` read access to channels matching `channel-[A-Za-z0-9]`.

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

Combines explicit resources + RegEx channel access in one token grant.

```
1
  

```

### Error responses[​](#error-responses)

Invalid grant requests return **`400`** with JSON details (e.g., missing/incorrect args, RegEx issues, timestamp issues, invalid permissions). Unauthorized/invalid token usage returns **`403`**.

---

## Revoke token[​](#revoke-token)

**Requires Access Manager add-on** and **token revoke enabled** (Admin Portal → keyset → *ACCESS MANAGER* → check **Revoke v3 Token**).

`revokeToken()` disables an existing token (must be a valid token from `grantToken()`), revoking all embedded permissions.

- Intended for tokens with `ttl` **≤ 30 days**; longer TTL revocation requires support.

### Method(s)[​](#methods-1)

```
`1pubnub.revokeToken(  
2    token: string  
3);  
`
```

**Parameter**
- `token` *(required)*: `string` — existing token to revoke.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

Success returns **200 OK**.

### Error Responses[​](#error-responses-1)

Possible errors: **`400`**, **`403`**, **`503`**.

---

## Parse token[​](#parse-token)

`parseToken()` decodes a token and returns its embedded permission object (useful for debugging, checking permissions and `ttl`).

### Method(s)[​](#methods-2)

```
`1pubnub.parseToken(  
2    token: string  
3)  
`
```

**Parameter**
- `token` *(required)*: `string` — token to decode.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

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

### Error Responses[​](#error-responses-2)

Parsing errors may indicate a damaged token; request a new token from the server.

---

## Set token[​](#set-token)

`setToken()` is used by clients to set/update the current auth token provided by the server.

### Method(s)[​](#methods-3)

```
`1pubnub.setToken(  
2    token: string  
3)  
`
```

**Parameter**
- `token` *(required)*: `string` — current token with embedded permissions.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

No return value.

---

## Grant token - spaces & users (deprecated)[​](#grant-token---spaces--users-deprecated)

**Deprecated:** will be removed; use `grantToken()` (channels/groups/uuids) instead.

**Requires Access Manager add-on.**  
**Server-only:** requires initialization with `secretKey`.

Generates token for:
- `spaces`
- `users`

Only `authorizedUserId` can use the token; invalid/unauthorized usage returns `403`.

**Deprecated permission keys:**
- `space`: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`
- `user`: `get`, `update`, `delete`

**TTL:** required; min `1`, max `43,200` (30 days). Recommended `10`–`60` for security.  
**RegEx:** supported via `patterns`.  
**Required mapping:** specify at least one `userId` or `space` via `resources` or `patterns`.

#### Method(s) - spaces & users (deprecated)[​](#methods---spaces--users-deprecated)

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

#### Sample code - spaces & users (deprecated)[​](#sample-code---spaces--users-deprecated)

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

#### Returns - spaces & users (deprecated)[​](#returns---spaces--users-deprecated)

```
`1"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

#### Other examples - spaces & users (deprecated)[​](#other-examples---spaces--users-deprecated)

##### Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call---spaces--users-deprecated)

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

##### Grant an authorized client read access to multiple channels using RegEx - spaces & users (deprecated)[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex---spaces--users-deprecated)

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

##### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call - spaces & users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call---spaces--users-deprecated)

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

#### Error responses - spaces & users (deprecated)[​](#error-responses---spaces--users-deprecated)

Invalid requests return **`400`** with JSON details (e.g., RegEx/timestamp/permission issues).