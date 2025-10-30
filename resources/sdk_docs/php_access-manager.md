# Access Manager v3 API for PHP SDK

Access Manager v3 lets your server (initialized with a Secret Key) grant time-limited tokens with embedded permissions for PubNub resources:
- Resources: Channels, ChannelGroups, Uuids (user metadata)
- Scope: specific resources or RegEx patterns
- Single request can mix permissions across multiple resources
- Optional authorizedUuid locks token usage to a single UUID
- Unauthorized or invalid token requests return 403

For full concepts, see Manage Permissions with Access Manager v3.

## Grant token

Requires Access Manager add-on (enable in Admin Portal).
Requires Secret Key authentication (initialize the SDK with a Secret Key).

The grantToken() method issues a token with:
- ttl (minutes, required; min 1, max 43,200)
- optional authorizedUuid (restrict token to a single client UUID)
- permissions for Channels, ChannelGroups, Uuids (as explicit resources or RegEx patterns)

Permissions by resource type:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

Use patterns for RegEx-based permissions. Meta accepts only scalar values.

You must specify permissions for at least one of: Uuid, Channel, ChannelGroup (resources or patterns).

### Method(s)

```
1$pubnub->grantToken()  
2    ->ttl($ttl)  
3    ->authorizedUuid($uuid)  
4    ->addChannelResources(Array[String => String])  
5    ->addChannelGroupResources(Array[String => String])  
6    ->addUuidResources(Array[String => String])  
7    ->addChannelPatterns(Array[String => String])  
8    ->addChannelGroupPatterns(Array[String => String])  
9    ->addUuidPatterns(Array[String => String])  
10    ->meta(Array[String => String])  
11    ->sync();  
12
  

```

Parameters
- ttl (Number, required): Minutes token is valid. Min 1; max 43,200.
- authorizedUuid (String): Single UUID allowed to use the token.
- addChannelResources (Array): Explicit channel permissions.
- addChannelGroupResources (Array): Explicit channel group permissions.
- addUuidResources (Array): Explicit UUID permissions.
- addChannelPatterns (Array): Channel permissions via RegEx patterns.
- addChannelGroupPatterns (Array): Channel group permissions via RegEx patterns.
- addUuidPatterns (Array): UUID permissions via RegEx patterns.
- meta (Array): Scalar-only metadata included with the request.

Resource permissions array format (omit false rights; false is default):

```
`1[  
2    'channel-1' => ['read' => true, 'write' => true]  
3    'channel-2' => ['read' => true, 'write' => false]  
4    'channel-3' => ['read' => true]  
5]  
`
```

### Sample code

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

```
`1$pubnub->grantToken()  
2    ->ttl(15)  
3    ->authorizedUuid('my-authorized-uuid')  
4    ->addChannelResources([  
5        'channel-a' => ['read' => true],  
6        'channel-b' => ['read' => true, 'write' => true],  
7        'channel-c' => ['read' => true, 'write' => true],  
8        'channel-d' => ['read' => true, 'write' => true],  
9    ])  
10    ->addChannelGroupResources([  
11        'channel-group-b' => ['read' => true],  
12    ])  
13    ->addUuidResources([  
14        'uuid-c' => ['get' => true],  
15        'uuid-d' => ['get' => true, 'update' => true],  
16    ])  
17    ->sync();  
`
```

Grant an authorized client read access to multiple channels using RegEx

```
`1$pubnub->grantToken()  
2    ->ttl(15)  
3    ->authorizedUuid('my-authorized-uuid')  
4    ->addChannelPatterns([  
5        '^channel-[A-Za-z0-9]$' => ['read' => true],  
6    ])  
7    ->sync();  
`
```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
`1$pubnub->grantToken()  
2    ->ttl(15)  
3    ->authorizedUuid('my-authorized-uuid')  
4    ->addChannelResources([  
5        'channel-a' => ['read' => true],  
6        'channel-b' => ['read' => true, 'write' => true],  
7        'channel-c' => ['read' => true, 'write' => true],  
8        'channel-d' => ['read' => true, 'write' => true],  
9    ])  
10    ->addChannelGroupResources([  
11        'channel-group-b' => ['read' => true],  
12    ])  
13    ->addUuidResources([  
14        'uuid-c' => ['get' => true],  
15        'uuid-d' => ['get' => true, 'update' => true],  
16    ])  
17    ->addChannelPatterns([  
18        '^channel-[A-Za-z0-9]$' => ['read' => true],  
19    ])  
`
```

### Error responses

Invalid requests return HTTP 400 with details in PubNubServerException (e.g., invalid ttl, regex, timestamp).
- getStatusCode() Int: Status code (400).
- getBody() Object: Error body (message, source, details, service, status).
- getServerErrorMessage() String: Descriptive message.
- getServerErrorSource() String: Error source.
- getServerErrorDetails() Object: First problem details (message, location, locationType).

## Revoke token

Requires Access Manager add-on. Enable “Revoke v3 Token” in Admin Portal (ACCESS MANAGER section).

revokeToken() disables an existing token previously obtained via grantToken(). Use for tokens with ttl ≤ 30 days; contact support for longer.

### Method(s)

```
`1$pubnub->revokeToken($token)  
2    ->sync();  
`
```

Parameter
- token (String, required): Existing token to revoke.

### Sample code

```
1
  

```

### Returns

Success returns PNRequestResult; failures return PubNubServerException.

PNRequestResult
- getStatus() Int: 200
- getService() String: Access Manager
- isError() Boolean
- getError() Array
- getMessage() String: Success

### Error Responses

May return: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

parseToken() decodes a token and exposes embedded permissions and ttl.

### Method(s)

```
`1parseToken(String token)  
`
```

Parameter
- token (String, required): Token to decode.

### Sample code

```
1
  

```

### Returns

```
1$parsedToken = $pubnub->parseToken( "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
2->toArray();  
3
  
4array(7) {  
5  ["version"]=>  
6  int(2)  
7  ["timestamp"]=>  
8  int(1634592012)  
9  ["ttl"]=>  
10  int(15)  
11  ["resources"]=>  
12  array(1) {  
13    ["chan"]=>  
14    array(1) {  
15      ["my-channel"]=>  
16      array(8) {  
17        ["read"]=>  
18        bool(true)  
19        ["write"]=>  
20        bool(false)  
21        ["manage"]=>  
22        bool(false)  
23        ["delete"]=>  
24        bool(false)  
25        ["create"]=>  
26        bool(false)  
27        ["get"]=>  
28        bool(false)  
29        ["update"]=>  
30        bool(false)  
31        ["join"]=>  
32        bool(false)  
33      }  
34    }  
35  }  
36  ["patterns"]=>  
37  array(0) {  
38  }  
39  ["signature"]=>  
40  string(44) "IBrbsLkRUqxZkN0ZPw8-bV2KxzB1Py-vJ-CaynRUn4Q="  
41  ["uuid"]=>  
42  string(7) "my-uuid"  
43}  
```

Token accessor methods
- getVersion(): Int – Token version (current: 2)
- getTimestamp(): Int – Issued timestamp
- getTtl(): String – Minutes token is valid
- getResources(): Array – resources as type => name => permissions
- getPatterns(): Array – patterns as type => name => permissions
- getChannelResource($channel): Object|null – Permissions for channel
- getChannelGroupResource($channelGroup): Object|null – Permissions for channel group
- getUuidResource($uuid): Object|null – Permissions for UUID
- getChannelPattern($channel): Object|null – Pattern permissions for channel
- getChannelGroupPattern($channelGroup): Object|null – Pattern permissions for channel group
- getUuidPattern($uuid): Object|null – Pattern permissions for UUID
- getMetadata(): Array – Metadata set in grant
- getSignature(): String – Server signature
- getUuid(): String – Authorized UUID
- toArray(): Array – Entire token as array

#### Permissions object

```
`1$pubnub->parseToken( "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
2->getChannelResource('my-channel')  
3->hasRead();  
`
```

Permissions methods
- hasRead(): boolean – read (Subscribe, History, Presence)
- hasWrite(): boolean – write (Publish)
- hasManage(): boolean – manage (Channel Groups, App Context)
- hasDelete(): boolean – delete (History, App Context)
- hasGet(): boolean – get (App Context)
- hasUpdate(): boolean – update (App Context)
- hasJoin(): boolean – join (App Context)

Error Responses
- If parsing fails, the token may be damaged; request a new one.

## Set token

setToken() updates the client’s active authentication token.

### Method(s)

```
`1setToken(String token)  
`
```

Parameter
- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

Last updated on Sep 3, 2025