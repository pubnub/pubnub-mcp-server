# Access Manager v3 API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new client instantiation model, and changes async callbacks and emitted status events. Applications built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

##### Gradle compatibility

Use Gradle 6.8+ for proper dependency resolution.

Access Manager (AM) v3 lets servers (using a Secret Key) grant clients time-limited tokens with embedded permissions for resources via lists or RegEx patterns, in a single request. You can restrict a token to a specific client with authorizedUuid.

##### User ID / UUID

User ID may be referred to as UUID/uuid in APIs/responses, but holds the value of the userId set during initialization.

##### Request execution

Most SDK calls return an Endpoint you must execute with .sync() or .async().

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

## Grant token[​](#grant-token)

##### Requires Access Manager add-on

Enable the Access Manager add-on for your key in the Admin Portal.

##### Requires Secret Key authentication

Granting permissions must be performed by an SDK instance initialized with a Secret Key.

grantToken() issues a time-limited token containing ttl, authorizedUUID, and permissions for:
- channels
- channelGroups
- uuids (user metadata)

Only the authorizedUUID (if set) can use the token. Unauthorized or invalid tokens return 403.

Permissions per resource (see Access Manager v3 permissions mapping for API mapping):
ResourcePermissions`channel``read`, `write`, `get`, `manage`, `update`, `join`, `delete``channelGroups``read`, `manage``uuids``get`, `update`, `delete`

ttl is required (minutes), min 1, max 43,200 (30 days). You can define permissions via resource lists or RegEx patterns (patterns). authorizedUUID is recommended to prevent impersonation.

### Method(s)[​](#methods)

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

- ttl (Number, required): total minutes the token is valid; 1–43,200.
- meta (Object): extra request metadata (scalar values only).
- authorizedUUID (String): single uuid authorized to use the token.
- channels (list<Channel>): channel grants or a RegEx pattern.
- channelGroups (list<ChannelGroupGrant>): channel group grants or a RegEx pattern.
- uuids (list<UUIDGrant>): uuid grants or a RegEx pattern.

##### Required key/value mappings

You must specify permissions for at least one uuid, channel, or channelGroup (list or RegEx).

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)

```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

Grants my-authorized-uuid:
- Read access to channel-a, channel-group-b, and get to uuid-c.
- Read/write access to channel-b, channel-c, channel-d, and get/update to uuid-d.

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

Grants my-authorized-uuid:
- Read access to channel-a, channel-group-b, and get to uuid-c.
- Read/write access to channel-b, channel-c, channel-d, and get/update to uuid-d.
- Read access to all channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses[​](#error-responses)

400 with details for invalid requests (e.g., RegEx, timestamp, permissions). Error details under PubNubException.

## Grant token - spaces & users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on

Enable the Access Manager add-on for your key in the Admin Portal.

grantToken() issues a token with ttl, authorizedUserId, and permissions for:
- spaces
- users (user metadata)

Only the authorizedUserId (if set) can use the token. Define permissions via lists or RegEx patterns, in a single call.

Permissions per resource:
ResourcePermissions`space``read`, `write`, `get`, `manage`, `update`, `join`, `delete``user``get`, `update`, `delete`

ttl is required (minutes), min 1, max 43,200. authorizedUserId is recommended.

### Method(s)[​](#methods-1)

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

- ttl (Int, required): total minutes the token is valid; 1–43,200.
- meta (Object): extra request metadata (scalar values only).
- authorizedUserId (UserId): single userId authorized to use the token.
- spacesPermissions (List<SpacePermissions>): Space permissions (list or RegEx).
- usersPermissions (List<UserPermissions>): User permissions (list or RegEx).

##### Required key/value mappings

Specify permissions for at least one User or Space (list or RegEx).

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples[​](#other-examples-1)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call-1)

Grants my-authorized-userId:
- Read access to space-a, and get to userId-c.
- Read/write access to space-b, space-c, space-d, and get/update to userId-d.

```
1
  

```

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)

Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)

Grants my-authorized-userId:
- Read access to space-a and userId-c.
- Read/write access to space-b, space-c, space-d, and get/update to userId-d.
- Read access to spaces matching space-[A-Za-z0-9].

```
1
  

```

### Error responses[​](#error-responses-1)

400 with details for invalid requests (e.g., RegEx, timestamp, permissions). Error details under PubNubException.

## Revoke token[​](#revoke-token)

##### Requires Access Manager add-on

Enable the Access Manager add-on for your key in the Admin Portal.

##### Enable token revoke

Enable Revoke v3 Token in your keyset (Admin Portal). revokeToken() disables an existing token (previously obtained via grantToken()). Use for tokens with ttl ≤ 30 days; for longer ttl, contact support.

### Method(s)[​](#methods-2)

```
`1revokeToken(token: String)  
`
```

- token (String, required): existing token with embedded permissions.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

Returns Unit on success.

### Error Responses[​](#error-responses-2)

May return: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token[​](#parse-token)

parseToken() decodes a token and returns its embedded permissions and ttl (useful for debugging).

### Method(s)[​](#methods-3)

```
`1parseToken(String token)  
`
```

- token (String, required): current token with embedded permissions.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

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

### Error Responses[​](#error-responses-3)

If parsing fails, the token may be damaged; request a new one.

## Set token[​](#set-token)

setToken() updates the client's authentication token.

### Method(s)[​](#methods-4)

```
`1setToken(String token)  
`
```

- token (String, required): current token with embedded permissions.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)

No return value.

Last updated on Sep 3, 2025