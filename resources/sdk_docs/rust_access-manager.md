# Access Manager v3 API for Rust SDK

Access Manager enforces security controls with tokens that embed permissions for PubNub resources, optionally scoped to a single authorized_user_id.

- Time-limited tokens (ttl).
- Resource lists or regex patterns.
- Multiple resource types and permissions in one request.
- Optional authorized_user_id to bind a token to a single client.

User ID / UUID
- UUID in APIs equals the userId set during SDK initialization.

For more info: Manage Permissions with Access Manager v3.

Add any of the following features to Cargo.toml:

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
- Initialize the server-side SDK with a Secret Key.

grant_token() issues a time-limited authorization token with:
- ttl (required; minutes; min 1, max 43,200/30 days).
- optional authorized_user_id to restrict token usage to one client (user_id).
- permissions for resources: channel, channel_group, user_id.

Clients use the token on each request until ttl expires. Unauthorized/invalid token -> 403.

Permissions and Resources
- channel: read, write, get, manage, update, join, delete
- channel_group: read, manage
- user_id: get, update, delete

TTL
- Required positional argument to grant_token(usize) in Rust.
- No default; range 1–43,200 minutes.

Patterns (RegEx)
- Use patterns() to assign permissions via regex.

Authorized UUID
- Set authorized_user_id to bind token to a single user_id. If omitted, any user_id can use the token.

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

Parameters
- grant_token (required)
  - Type: usize
  - Token TTL in minutes (1–43,200).
- resources
  - Type: Option<[Box<dyn permissions::Permission>]>
  - Individual resource permissions.
- patterns
  - Type: Option<[Box<dyn permissions::Permission>]>
  - Pattern-based permissions (regex).
- authorized_user_id
  - Type: Option<String>
  - Single user_id authorized to use the token.
- meta
  - Type: Option<HashMap<String, MetaValue>>
  - Extra scalar-only metadata.

Required key/value mappings
- Grant must include permissions for at least one uuid, channel, or channel_group (either in resources or patterns).

#### permissions Object

Assign via resources() for concrete IDs or patterns() for regex. Template:
- permissions::{objectToApplyPermissionsFor}.{permissionType()}

objectToApplyPermissionsFor examples:
- channel("channel_name") or channel("^onetoone-[a-zA-Z0-9]*$")
- channel_group("channel_group_name") or channel("^room-[a-zA-Z0-9]*$")
- user_id("user_id") or channel("^user-[a-zA-Z0-9]*$")

permissionType() by entity:
- channel: read(), write(), get(), manage(), update(), join(), delete()
- channel_groups: read(), manage()
- user_id: get(), update(), delete()

Example: assign read to channel group channel-group and update/delete to user admin:

```
1
  

```

Example: regex permissions for join/read/write to channels matching ^room-[a-zA-Z0-9]*$:

```
1
  

```

### Sample code

```
1
  

```

### Returns

- GrantTokenResult with token string at GrantTokenResult.token.

### Other examples

Grant an authorized client different levels of access to various resources in a single call:

```
1
  

```

Grant an authorized client read access to multiple channels using RegEx:

```
1
  

```

Grant an authorized client various resource permissions and regex read in a single call:

```
1
  

```

### Error responses

- HTTP 400 for invalid requests (e.g., regex issues, invalid timestamp, incorrect permissions). Error details under PubNubException.

## Revoke token

Requires Access Manager add-on
- Enable the add-on in the Admin Portal.

Enable token revoke
- In Admin Portal, enable “Revoke v3 Token” in ACCESS MANAGER.

revoke_token() disables a previously granted, valid token (ttl ≤ 30 days). For longer ttl, contact support.

For more information: Revoke permissions.

### Method(s)

```
`1pubnub  
2    .revoke_token(token)  
`
```

Parameters
- token (required)
  - Type: Into<String>
  - Existing token to revoke.

### Sample code

```
1
  

```

### Returns

- Success response from PAMv3 or error with details.

### Error Responses

- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

parse_token() decodes a token and returns its embedded permissions and ttl. Useful for debugging.

Add any of the following features to Cargo.toml:

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

Parameters
- token (required)
  - Type: &str
  - Token string to decode.

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

- Parsing errors suggest a damaged token; request a new token.

## Set token

set_token() is used by clients to update the authentication token provided by the server.

### Method(s)

```
`1pubnub  
2    .set_token(token);  
`
```

Parameters
- token (required)
  - Type: Into<String>
  - Current token string.

### Sample code

```
`1pubnub  
2    .set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns

- No return value.