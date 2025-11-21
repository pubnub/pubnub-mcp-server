# Access Manager v3 API for Rust SDK

Access Manager lets servers grant clients time-limited tokens with embedded permissions to PubNub resources, optionally restricted to a specific authorized_user_id.

- Supports resource lists and regex patterns.
- Multiple resources and different permission levels in one request.
- authorized_user_id restricts token usage to a single userId (UUID).

User ID / UUID: Some APIs use UUID, but it holds the value of the userId set during initialization.

For more on Access Manager v3, see Manage Permissions with Access Manager v3.

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

## Grant token[​](#grant-token)

Requires Access Manager add-on enabled in the Admin Portal and Secret Key authentication (server-side SDK instance initialized with a Secret Key).

grant_token() generates a time-limited token with:
- ttl (minutes; required; 1 to 43,200)
- authorized_user_id (optional)
- embedded permissions for:
  - channel
  - channel_group
  - user_id (users’ object metadata)

Only the authorized_user_id (if set) can use the token. Unauthorized or invalid tokens return HTTP 403.

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- channel_group: read, manage
- user_id: get, update, delete

TTL notes:
- Required argument to grant_token()
- Minutes; max 43,200 (30 days)

Regex patterns:
- Provide via patterns() to grant by pattern.

authorized_user_id:
- Binds token to a single user_id. If omitted, any user_id can use the token.

### Method(s)[​](#methods)

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

Parameters:
- grant_token (required): Type: usize. Token TTL in minutes (1–43,200).
- resources: Type: Option<[Box<dyn permissions::Permission>]>.
- patterns: Type: Option<[Box<dyn permissions::Permission>]>.
- authorized_user_id: Type: Option<String>.
- meta: Type: Option<HashMap<String, MetaValue>> (scalar values only).

Required key/value mappings:
- Specify permissions for at least one uuid, channel, or channel_group (as resources or patterns).

#### permissions Object[​](#permissions-object)

Assign permissions via resources() (specific IDs) or patterns() (regex). Template: permissions::{object}.{permissionType()}.

Objects (examples):
- channel("channel_name") or channel("^onetoone-[a-zA-Z0-9]*$")
- channel_group("channel_group_name") or channel("^room-[a-zA-Z0-9]*$")
- user_id("user_id") or channel("^user-[a-zA-Z0-9]*$")

Permission types:
- channel: read(), write(), get(), manage(), update(), join(), delete()
- channel_groups: read(), manage()
- user_id: get(), update(), delete()

Example: create read permission to channel group channel-group and update/delete to user admin:

```
1
  

```

Example: regex permissions (join, read, write) to channels matching ^room-[a-zA-Z0-9]*$:

```
1
  

```

### Sample code[​](#sample-code)

```
1
  

```

### Returns[​](#returns)

Returns GrantTokenResult. Access the token string via GrantTokenResult.token.

### Other examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

Grants my-authorized-user_id:
- Read: channel-a, channel-group-b; Get: uuid-c
- Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

Grants my-authorized-user_id read access to all channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

Grants my-authorized-user_id:
- Read: channel-a, channel-group-b; Get: uuid-c
- Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d
- Read via regex: channels matching channel-[A-Za-z0-9]

```
1
  

```

### Error responses[​](#error-responses)

Invalid requests return HTTP 400 with details (e.g., regex issues, invalid timestamp, incorrect permissions), under PubNubException.

## Revoke token[​](#revoke-token)

Requires Access Manager add-on. Enable token revoke in Admin Portal (Revoke v3 Token under ACCESS MANAGER).

revoke_token() disables an existing token granted by grant_token(). Use for ttl ≤ 30 days; for longer, contact support.

### Method(s)[​](#methods-1)

```
`1pubnub  
2    .revoke_token(token)  
`
```

Parameters:
- token (required): Type: Into<String>. Existing token.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

Returns success response from PAMv3 or an error.

### Error Responses[​](#error-responses-1)

May return:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token[​](#parse-token)

parse_token() decodes a token to inspect permissions and ttl. Enable features in Cargo.toml:

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

### Method(s)[​](#methods-2)

```
`1pubnub  
2    .parse_token(&token)  
`
```

Parameters:
- token (required): Type: &str.

### Sample code[​](#sample-code-2)

```
`1pubnub  
2    .parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
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

Errors suggest a damaged token; request a new one from the server.

## Set token[​](#set-token)

set_token() updates the client’s authentication token.

### Method(s)[​](#methods-3)

```
`1pubnub  
2    .set_token(token);  
`
```

Parameters:
- token (required): Type: Into<String>.

### Sample code[​](#sample-code-3)

```
`1pubnub  
2    .set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-3)

No return value.

Last updated on Sep 3, 2025