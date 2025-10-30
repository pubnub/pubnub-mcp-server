# Access Manager v3 API for Rust SDK

Access Manager enforces client access to PubNub resources using time-limited tokens with embedded permissions. Tokens can target:
- Specific resources or RegEx patterns.
- Multiple resources with different permission levels in one request.
- A single authorized client via authorized_user_id.

User ID / UUID
- User ID is also referred to as UUID/uuid in some APIs and responses but holds the value of the userId parameter set during initialization.

For details, see Manage Permissions with Access Manager v3.

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
- Enable Access Manager for your key in the Admin Portal.

Requires Secret Key authentication
- Use a server-side SDK instance initialized with a Secret Key.

grant_token() generates a time-limited authorization token defining ttl, authorized_user_id, and permissions on resources:
- channel
- channel_group
- user_id (other users’ object metadata)

Unauthorized or invalid token usage returns 403.

Key capabilities:
- Permissions
- TTL (time to live)
- RegEx patterns
- Authorized UUID

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- channel_group: read, manage
- user_id: get, update, delete

TTL
- Pass ttl as the required argument to grant_token(); minutes; min 1, max 43,200 (30 days); no default.

Patterns
- Use RegEx via patterns() to grant by pattern.

Authorized UUID
- Set authorized_user_id to bind token to a single user_id; otherwise any user_id can use it.

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
  - Token time-to-live in minutes. Min 1; max 43,200.
- resources
  - Type: Option<[Box<dyn permissions::Permission>]>
  - List of permissions for specific resources.
- patterns
  - Type: Option<[Box<dyn permissions::Permission>]>
  - List of permissions defined by RegEx patterns.
- authorized_user_id
  - Type: Option<String>
  - Single user_id authorized to use the token.
- meta
  - Type: Option<HashMap<String, MetaValue>>
  - Extra scalar-only metadata.

Required key/value mappings
- You must specify permissions for at least one uuid, channel, or channel_group (via resources or patterns).

#### permissions Object

Assign permissions with resources() (specific items) or patterns() (RegEx). Template:
- permissions::{objectToApplyPermissionsFor}.{permissionType()}

Targets:
- channel("channel_name") or channel("^onetoone-[a-zA-Z0-9]*$")
- channel_group("channel_group_name") or channel("^room-[a-zA-Z0-9]*$")
- user_id("user_id") or channel("^user-[a-zA-Z0-9]*$")

Permission types:
- channel: read(), write(), get(), manage(), update(), join(), delete()
- channel_groups: read(), manage()
- user_id: get(), update(), delete()

The following code creates two permission objects. The first creates a read permission to a channel group with the ID of channel-group, while the second creates an update and delete permissions to a User with the ID of admin.

```
1
  

```

You can also use a RegEx pattern. The following code creates a join, read, and write permissions to all channels whose IDs match the of ^room-[a-zA-Z0-9]*$ RegEx.

```
1
  

```

### Sample code

```
1
  

```

### Returns

Returns GrantTokenResult. Access the token string via GrantTokenResult.token.

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

The code below grants my-authorized-user_id:
- Read access to channel-a, channel-group-b, and get to uuid-c.
- Read/write access to channel-b, channel-c, channel-d, and get/update to uuid-d.

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

The code below grants my-authorized-user_id read access to all channels that match the channel-[A-Za-z0-9] RegEx pattern.

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

The code below grants the my-authorized-user_id:
- Read access to channel-a, channel-group-b, and get to uuid-c.
- Read/write access to channel-b, channel-c, channel-d, and get/update to uuid-d.
- Read access to all channels that match the channel-[A-Za-z0-9] RegEx pattern.

```
1
  

```

### Error responses

Invalid requests return HTTP 400 with details (e.g., RegEx issues, invalid timestamp, incorrect permissions) under PubNubException.

## Revoke token

Requires Access Manager add-on
- Enable Access Manager for your key in the Admin Portal.

Enable token revoke
- In Admin Portal, enable Revoke v3 Token in the ACCESS MANAGER section.

revoke_token() disables an existing token granted via grant_token(). Use for ttl ≤ 30 days; for longer ttl, contact support.

### Method(s)

```
`1pubnub  
2    .revoke_token(token)  
`
```

- token (required)
  - Type: Into<String>
  - Existing token with embedded permissions.

### Sample code

```
1
  

```

### Returns

Returns a success response with a token from the PAMv3 service or an error.

### Error Responses

May return:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

parse_token() decodes an existing token and returns its embedded permissions and ttl. Useful for debugging.

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
  - Current token with embedded permissions.

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

If parsing fails, the token may be damaged; request a new token from the server.

## Set token

set_token() is used by clients to update the authentication token granted by the server.

### Method(s)

```
`1pubnub  
2    .set_token(token);  
`
```

- token (required)
  - Type: Into<String>
  - Current token with embedded permissions.

### Sample code

```
`1pubnub  
2    .set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns

This method doesn't return any response value.

Last updated on Sep 3, 2025