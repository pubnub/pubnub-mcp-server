# Access Manager v3 API for Dart SDK

Access Manager issues time-limited tokens with embedded permissions for PubNub resources. Tokens can target specific resources or RegEx patterns and be restricted to a single client via authorized UUID/User ID.

- Resource types: channels, channel groups, UUIDs; or spaces and users (App Context)
- Permissions by resource (channels/uuid/groups):
  - channel: read, write, get, manage, update, join, delete
  - channelGroup: read, manage
  - uuid: get, update, delete
- Permissions by resource (spaces/users):
  - space: read, write, get, manage, update, join, delete
  - user: get, update, delete
- TTL: required; minutes until expiration, min 1, max 43,200 (30 days)
- Patterns: use RegEx patterns for permissions
- Authorized client: restrict tokens via authorizedUUID or authorizedUserId

##### User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and responses, but holds the value of the userId you set during initialization.

## Grant token

##### Requires Access Manager add-on
Enable the Access Manager add-on in the Admin Portal.

##### Requires Secret Key authentication
Granting must be done by a server SDK instance initialized with a Secret Key.

The `grantToken()` method generates a token defining TTL, optional authorizedUUID, and permissions for channels, channel groups, and UUIDs. If authorizedUUID is omitted, any client UUID can use the token.

### Method(s)

```
`1pubnub.grantToken(TokenRequest tokenRequest)  
`
```

To create `TokenRequest`:

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
- ttl (Number, required): minutes token is valid; min 1, max 43,200.
- meta (Map<String, dynamic>): scalar-only metadata sent with request.
- authorizedUUID (String): single uuid authorized to use the token.
- using (String): keyset name from keysetStore for this call.
- keyset (Keyset): override default keyset.

##### Required key/value mappings
Specify permissions for at least one uuid, channel, or channelGroup (by name or pattern).

Use `add()` on `TokenRequest`:

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

- type (ResourceType): uuid, channel, or channelGroup.
- name (String): resource name (provide either name or pattern).
- pattern (String): RegEx pattern (provide either name or pattern).
- Permissions (Boolean; default false): write, read, create, manage, delete, get, update, join.

### Sample code

##### Reference code

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
show all 30 lines

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
HTTP 400 on invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions). Error details under PubNubException.

## Grant token - spaces & users

##### Requires Access Manager add-on
Enable the Access Manager add-on in the Admin Portal.

`grantToken()` generates a token defining TTL, optional authorizedUserId, and permissions for spaces and users. If authorizedUserId is omitted, any client userId can use the token.

### Method(s)

```
`1pubnub.grantToken(TokenRequest tokenRequest)  
`
```

To create `TokenRequest`:

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
- ttl (Number, required): minutes token is valid; min 1, max 43,200.
- meta (Map<String, dynamic>): scalar-only metadata sent with request.
- authorizedUserId (String): single userId authorized to use the token.
- using (String): keyset name from keysetStore for this call.
- keyset (Keyset): override default keyset.

##### Required key/value mappings
Specify permissions for at least one User or Space (by name or pattern).

Use `add()` on `TokenRequest`:

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

- type (ResourceType): user or space.
- name (String) or pattern (String): specify resource or RegEx.
- Permissions (Boolean; default false): write, read, create, manage, delete, get, update, join.

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
HTTP 400 on invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions). Error details under PubNubException.

## Revoke token

##### Requires Access Manager add-on
Enable in Admin Portal.

##### Enable token revoke
In your app’s keyset, check “Revoke v3 Token” in the ACCESS MANAGER section.

Revokes an existing token previously obtained with grantToken(). Use for tokens with ttl ≤ 30 days.

### Method(s)

```
`1var result = await pubnub.revokeToken("token");  
`
```

- token (String, required): existing token to revoke.

### Sample code

```
`1await pubnub.revokeToken("token");  
`
```

### Returns
Returns an empty PamRevokeTokenResult on success.

### Error Responses
May return: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

Decodes a token to inspect embedded permissions and TTL.

### Method(s)

```
`1parseToken(String token)  
`
```

- token (String, required): token to decode.

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
Parsing errors may indicate a damaged token; request a new one.

## Set token

Client method to update the current authentication token.

### Method(s)

```
`1setToken(String token, {String? using, Keyset? keyset})  
`
```

- token (String, required): token with permissions.
- using (String): keyset name from keysetStore for this call.
- keyset (Keyset): override default keyset.

### Sample code

```
`1pubnub.setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns
No return value.