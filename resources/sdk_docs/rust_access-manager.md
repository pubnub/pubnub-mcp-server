# Access Manager v3 API for Rust SDK

Access Manager enforces security for client access to PubNub resources by issuing time-limited tokens with embedded permissions. Tokens can:
- Expire after a specified TTL (minutes).
- Use resource lists or RegEx patterns.
- Grant mixed permission levels in one request.
- Optionally restrict usage to a single authorized_user_id.

User ID / UUID
- User ID is also referred to as UUID in some APIs and responses and holds the value of the userId parameter set during initialization.

For more information, see Manage Permissions with Access Manager v3.

Add any of the following features to Cargo.toml to use this API:

```
`[dependencies]  
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# Access Manager  
pubnub = { version = "0.7.0", features = ["access"] }  
`
```

For a list of all features, refer to Available features.

### Available in features
fullaccess

## Grant token

Requires Access Manager add-on
- Enable the Access Manager add-on in the Admin Portal.

Requires Secret Key authentication
- Initialize the SDK with a Secret Key to grant permissions.

grant_token() generates a token with TTL, optional authorized_user_id, and permissions for these resource types:
- channel
- channel_group
- user_id (users’ object metadata)

Notes:
- Only the authorized_user_id (if set) can use the token.
- Clients must include the token with each request until TTL expiry.
- Invalid/unauthorized requests return 403.

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- channel_group: read, manage
- user_id: get, update, delete

TTL:
- Required and passed as the grant_token() argument (minutes).
- Min: 1, Max: 43,200 (30 days). No default.

Patterns (RegEx):
- Use patterns() for pattern-based permissions.

Authorized UUID:
- Set authorized_user_id to bind a token to a single user_id.

### Method(s)

```
`1pubnub  
2    .grant_token(usize)  
3    .resources(Option[Boxpermissions::Permission>]>)  
4    .patterns(Option[Boxpermissions::Permission>]>)  
5    .authorized_user_id(OptionString>)  
6    .meta(OptionHashMapString, MetaValue>>)  
7    .execute()  
`
```

- grant_token (required)
  - Type: usize
  - TTL in minutes (1–43,200)
- resources
  - Type: Option<[Box<dyn permissions::Permission>]>
  - Individual resource permissions
- patterns
  - Type: Option<[Box<dyn permissions::Permission>]>
  - RegEx-based permissions
- authorized_user_id
  - Type: Option<String>
  - Single user_id allowed to use the token
- meta
  - Type: Option<HashMap<String, MetaValue>>
  - Scalar values only

Required key/value mappings
- Specify permissions for at least one uuid, channel, or channel_group via resources or patterns.

#### permissions Object

Assign via resources() (explicit list) or patterns() (regex). Template:
- permissions::{objectToApplyPermissionsFor}.{permissionType()}

Object targets:
- channel("channel_name") or channel("^onetoone-[a-zA-Z0-9]*$")
- channel_group("channel_group_name") or channel("^room-[a-zA-Z0-9]*$")
- user_id("user_id") or channel("^user-[a-zA-Z0-9]*$")

Permission types:
- channel: read(), write(), get(), manage(), update(), join(), delete()
- channel_groups: read(), manage()
- user_id: get(), update(), delete()

Example: create a read permission for channel group channel-group and update/delete for user admin:

```
1
  

```

Example: use RegEx to allow join, read, write for channels matching ^room-[a-zA-Z0-9]*$:

```
1
  

```

### Sample code

```
1
  

```

### Returns

- Returns GrantTokenResult. Get the token string from GrantTokenResult.token.

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

Grants my-authorized-user_id:
- Read: channel-a, channel-group-b; get: uuid-c.
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

Grants my-authorized-user_id read access to channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

Grants my-authorized-user_id:
- Read: channel-a, channel-group-b; get: uuid-c.
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d.
- Read to channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses

- HTTP 400 with details for invalid requests (e.g., regex issues, invalid timestamp, incorrect permissions). Errors appear under PubNubException.

## Revoke token

Requires Access Manager add-on
- Enable the Access Manager add-on in the Admin Portal.

Enable token revoke
- In the Admin Portal, enable Revoke v3 Token under ACCESS MANAGER.

revoke_token() disables an existing valid token granted via grant_token().

- Use for tokens with TTL ≤ 30 days. For longer TTL, contact support.

### Method(s)

```
`1pubnub  
2    .revoke_token(token)  
`
```

- token (required)
  - Type: Into<String>
  - Existing token

### Sample code

```
1
  

```

### Returns

- Success response from PAMv3 service or an error.

### Error Responses

- Possible: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

parse_token() decodes a token and returns embedded permissions and TTL. Useful for debugging.

Add any of the following features to Cargo.toml to use this API:

```
`[dependencies]  
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# Parse Token  
pubnub = { version = "0.7.0", features = ["parse_token"] }  
`
```

For a list of all features, refer to Available features.

### Available in features
fullparse_token

### Method(s)

```
`1pubnub  
2    .parse_token(&token)  
`
```

- token (required)
  - Type: &str

### Sample code

```
`1pubnub  
2    .parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
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

- If parsing fails, the token may be damaged; request a new one from the server.

## Set token

set_token() updates the client’s current authentication token.

### Method(s)

```
`1pubnub  
2    .set_token(token);  
`
```

- token (required)
  - Type: Into<String>

### Sample code

```
`1pubnub  
2    .set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns

- No return value.

Last updated on Sep 3, 2025