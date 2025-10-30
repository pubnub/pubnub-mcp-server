# Access Manager v3 API for Dart SDK

Access Manager lets servers (using a PubNub instance initialized with a Secret Key) grant clients time-limited tokens with embedded permissions to specific resources, via explicit lists or RegEx patterns, and optionally restricted to a single client identity.

- Permissions are embedded per resource.
- TTL is required (1–43,200 minutes).
- Resources can be listed or matched with RegEx patterns.
- Tokens can be restricted to an authorized identity.

Add the authorizedUuid parameter to restrict a token to one client UUID. Only this authorizedUUID can use the token to make requests.

##### User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and responses but holds the value of the userId parameter set during initialization.

## Grant token

Requirements:
- Access Manager add-on enabled for your keyset.
- Server-side usage with Secret Key authentication.

Generates a time-limited authorization token defining ttl, authorizedUUID, and permissions on resources.

Resource permissions:
- channel: read, write, get, manage, update, join, delete
- channelGroup: read, manage
- uuid: get, update, delete

TTL: Required; 1–43,200 minutes (no default). Clients need new tokens before expiration.

RegEx patterns: Use patterns to grant by pattern instead of listing resources.

Authorized UUID: Set authorizedUUID to restrict token usage to a single uuid; otherwise any uuid can use it.

### Method(s)

```
`1pubnub.grantToken(TokenRequest tokenRequest)  
`
```

To create TokenRequest:

```
`1pubnub.requestToken({  
2  @required int? ttl,  
3  MapString, dynamic>? meta,  
4  String? authorizedUUID,  
5  String? using,  
6  Keyset? keyset  
7});  
`
```

TokenRequest parameters:
- ttl Number (required): Minutes token is valid (1–43,200).
- meta Map<String, dynamic>: Scalar-only metadata.
- authorizedUUID String: Single uuid authorized to use the token.
- using String: Keyset name from keysetStore.
- keyset Keyset: Override default keyset.

Required key/value mappings:
- Specify permissions for at least one uuid, channel, or channelGroup (by name or pattern).

Use add() on TokenRequest to add resource or pattern permissions:

```
`1add(ResourceType type,  
2      {String? name,  
3      String? pattern,  
4      bool? create,  
5      bool? delete,  
6      bool? manage,  
7      bool? read,  
8      bool? write,  
9      bool? get,  
10      bool? update,  
11      bool? join})  
`
```

add() parameters:
- type ResourceType: uuid, channel, or channelGroup.
- name String: Resource name (provide either name or pattern).
- pattern String: Resource pattern (provide either name or pattern).
- write, read, create, manage, delete, get, update, join: Boolean, default false.

### Sample code

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',   
8      publishKey: 'demo',   
9      secretKey: 'sec_key'  
10      userId: UserId('myUniqueUserId')  
11    ),  
12  );  
13
  
14  // Prepare the request object for granting a token  
15  var request = pubnub.requestToken(  
16    ttl: 15,                    // Time to live in minutes  
17    authorizedUUID: 'my-authorized-uuid' // Restrict to a specific UUID  
18  );  
19
  
20  // Add permissions for a channel  
21  request.add(  
22    ResourceType.channel,   
23    name: 'my-channel',   
24    read: true // Grant read permissions  
25  );  
26
  
27  // Send the token request  
28  var token = await pubnub.grantToken(request);  
29  print('grant token = ${token}');  
30}  

```

### Returns

```
`1{  
2    "status": 200,  
3    "data": {  
4        "message": "Success",  
5        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
6    },  
7    "service" : "Access Manager"  
8}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

- Grants my-authorized-uuid read to channel-a, channel-group-b, get to uuid-c; read/write to channel-b/c/d; get/update to uuid-d.

```
1var request = pubnub.requestToken(  
2    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
3..add(ResourceType.channel, name: 'channel-a', read: true)  
4..add(ResourceType.channelGroup, name: 'channel-group-b', read: true)  
5..add(ResourceType.uuid, name: 'uuid-c', get: true)  
6..add(ResourceType.channel, name: 'channel-b', read: true, write: true)  
7..add(ResourceType.channel, name: 'channel-c', read: true, write: true)  
8..add(ResourceType.channel, name: 'channel-d', read: true, write: true)  
9..add(ResourceType.uuid, name: 'uuid-d', get: true, update: true);  
10
  
11var token = await pubnub.grantToken(request);  
12print('grant token = $token');  

```

#### Grant an authorized client read access to multiple channels using RegEx

```
1var request = pubnub.requestToken(  
2    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
3..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);  
4
  
5var token = await pubnub.grantToken(request);  
6print('grant token = $token');  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
1var request = pubnub.requestToken(  
2    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
3..add(ResourceType.channel, name: 'channel-a', read: true)  
4..add(ResourceType.channelGroup, name: 'channel-group-b', read: true)  
5..add(ResourceType.uuid, name: 'uuid-c', get: true)  
6..add(ResourceType.channel, name: 'channel-b', read: true, write: true)  
7..add(ResourceType.channel, name: 'channel-c', read: true, write: true)  
8..add(ResourceType.channel, name: 'channel-d', read: true, write: true)  
9..add(ResourceType.uuid, name: 'uuid-d', get: true, update: true)  
10..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);  
11
  
12var token = await pubnub.grantToken(request);  
13print('grant token = $token');  

```

### Error responses

HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions). Error details under PubNubException.

## Grant token - spaces & users

Requirements:
- Access Manager add-on enabled.

Generates a time-limited token with ttl, authorizedUserId, and permissions on:
- spaces
- users

Only authorizedUserId can use the token. Unauthorized or invalid tokens return 403.

Resource permissions:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL: Required; 1–43,200 minutes.

RegEx patterns: Set as patterns before granting.

Authorized user ID: Set authorizedUserId to restrict token usage to a single userId.

### Method(s)

```
`1pubnub.grantToken(TokenRequest tokenRequest)  
`
```

To create TokenRequest:

```
`1pubnub.requestToken({  
2  @required int? ttl,  
3  MapString, dynamic>? meta,  
4  String? authorizedUserId,  
5  String? using,  
6  Keyset? keyset  
7});  
`
```

TokenRequest parameters:
- ttl Number (required): Minutes token is valid (1–43,200).
- meta Map<String, dynamic>: Scalar-only metadata.
- authorizedUserId String: Single userId authorized to use the token.
- using String: Keyset name from keysetStore.
- keyset Keyset: Override default keyset.

Required key/value mappings:
- Specify permissions for at least one User or Space (by name or pattern).

Use add() on TokenRequest to add resource or pattern permissions:

```
`1add(ResourceType type,  
2      {String? name,  
3      String? pattern,  
4      bool? create,  
5      bool? delete,  
6      bool? manage,  
7      bool? read,  
8      bool? write,  
9      bool? get,  
10      bool? update,  
11      bool? join})  
`
```

add() parameters:
- type ResourceType: user or space.
- name or pattern: Provide one.
- Permissions flags: Default false.

### Sample code

```
1// Prepare the request object  
2var request = pubnub.requestToken(ttl: 15, authorizedUserId: 'my-authorized-userId');  
3request.add(ResourceType.space, name: 'my-space', read: true);  
4
  
5// Send the token request  
6var token = await pubnub.grantToken(request);  
7print('grant token = $token');  

```

### Returns

```
`1{  
2    "status": 200,  
3    "data": {  
4        "message": "Success",  
5        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
6    },  
7    "service" : "Access Manager"  
8}  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

```
1var request = pubnub.requestToken(  
2    ttl: 15, authorizedUserId: 'my-authorized-userId')  
3..add(ResourceType.space, name: 'space-a', read: true)  
4..add(ResourceType.user, name: 'userId-c', get: true)  
5..add(ResourceType.space, name: 'space-b', read: true, write: true)  
6..add(ResourceType.space, name: 'space-c', read: true, write: true)  
7..add(ResourceType.space, name: 'space-d', read: true, write: true)  
8..add(ResourceType.user, name: 'userId-d', get: true, update: true);  
9
  
10var token = await pubnub.grantToken(request);  
11print('grant token = $token');  

```

#### Grant an authorized client read access to multiple spaces using RegEx

```
1var request = pubnub.requestToken(  
2    ttl: 15, authorizedUserId: 'my-authorized-userId')  
3..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);  
4
  
5var token = await pubnub.grantToken(request);  
6print('grant token = $token');  

```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call

```
1var request = pubnub.requestToken(  
2    ttl: 15, authorizedUserId: 'my-authorized-userId')  
3..add(ResourceType.space, name: 'space-a', read: true)  
4..add(ResourceType.user, name: 'userId-c', get: true)  
5..add(ResourceType.space, name: 'space-b', read: true, write: true)  
6..add(ResourceType.space, name: 'space-c', read: true, write: true)  
7..add(ResourceType.space, name: 'space-d', read: true, write: true)  
8..add(ResourceType.user, name: 'userId-d', get: true, update: true)  
9..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);  
10
  
11var token = await pubnub.grantToken(request);  
12print('grant token = $token');  

```

### Error responses

HTTP 400 for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions). Error details under PubNubException.

## Revoke token

Requirements:
- Access Manager add-on enabled.
- Enable token revoke in Admin Portal (Revoke v3 Token).
- Only valid tokens previously obtained via grantToken().
- Use for tokens with ttl ≤ 30 days; contact support for longer.

### Method(s)

```
`1var result = await pubnub.revokeToken("token");  
`
```

- token String (required): Existing token.

### Sample code

```
`1await pubnub.revokeToken("token");  
`
```

### Returns
Empty PamRevokeTokenResult on success.

### Error Responses
May return 400 Bad Request, 403 Forbidden, or 503 Service Unavailable.

## Parse token

Decodes a token and returns its embedded permissions and details (for debugging).

### Method(s)

```
`1parseToken(String token)  
`
```

- token String (required): Current token.

### Sample code

```
`1pubnub.parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns

```
`1{  
2   "version":2,  
3   "timetoken":1629394579,  
4   "ttl":15,  
5   "authorizedUUID": "user1",  
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
75   },   
76    "meta": { "token" : "meta" },  
77    "signature": "QQ9nC2BjEBbf4uwFpf9aBZ1i+0BelhsqWXc="  
78}  
`
```

### Error Responses
Token parse errors may indicate a damaged token; request a new one.

## Set token

Clients use setToken() to update their current authentication token.

### Method(s)

```
`1setToken(String token, {String? using, Keyset? keyset})  
`
```

- token String (required): Current token.
- using String: Keyset name from keysetStore.
- keyset Keyset: Override default keyset.

### Sample code

```
`1pubnub.setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns
No return value.

Last updated on Sep 3, 2025