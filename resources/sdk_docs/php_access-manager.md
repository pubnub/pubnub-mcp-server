# Access Manager v3 API for PHP SDK

Access Manager v3 lets your server (initialized with a Secret Key) grant clients time-limited tokens with embedded permissions for PubNub resources:
- Time-bounded (TTL)
- By explicit resource lists or RegEx patterns
- Multiple resources and differing permissions in a single request
- Optional restriction to a single authorizedUuid

Resources supported:
- Channels
- ChannelGroups
- Uuids (users' object metadata)

Unauthorized or invalid token requests return HTTP 403.

For feature enablement, use the Admin Portal.

## Grant token

Requires:
- Access Manager add-on enabled in Admin Portal.
- Secret Key authentication on the server SDK instance.

Generates a token with TTL, optional authorizedUuid, and permissions on resources or patterns.

Permissions by resource:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

TTL:
- Required; minutes the token is valid
- Min 1; max 43,200 (30 days)

Patterns:
- Use RegEx via patterns for permission grants by pattern.

authorizedUuid:
- If set, only this UUID can use the token; otherwise any UUID can use it.

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

Parameters:
- ttl (Number; required): Minutes token is valid. Min 1; max 43,200. No default.
- authorizedUuid (String; optional): Single UUID authorized to use this token.
- addChannelResources (Array; optional): Explicit channel permissions.
- addChannelGroupResources (Array; optional): Explicit channel group permissions.
- addUuidResources (Array; optional): Explicit UUID permissions.
- addChannelPatterns (Array; optional): Channel permissions as RegEx patterns.
- addChannelGroupPatterns (Array; optional): Channel group permissions as RegEx patterns.
- addUuidPatterns (Array; optional): UUID permissions as RegEx patterns.
- meta (Array; optional): Extra scalar-only metadata to publish with request.

Resource/permission array format: key is resource name; value is array of rights set to true (unspecified defaults to false).

```
`1[  
2    'channel-1' => ['read' => true, 'write' => true]  
3    'channel-2' => ['read' => true, 'write' => false]  
4    'channel-3' => ['read' => true]  
5]  
`
```

Required:
- Specify at least one resource or pattern on Uuid, Channel, or ChannelGroup.

### Sample code

Reference code

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

- Read: channel-a, channel-group-b; get: uuid-c
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

Grants read on channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant different levels and RegEx read access in one call

- Read: channel-a, channel-group-b; get: uuid-c
- Read/write: channel-b, channel-c, channel-d; get/update: uuid-d
- RegEx read: channels matching channel-[A-Za-z0-9]

```
1
  

```

### Error responses

Invalid requests return HTTP 400 with details (e.g., invalid RegEx, invalid timestamp, incorrect permissions) via PubNubServerException.

Methods:
- getStatusCode(): Int — status code (400)
- getBody(): Object — full error body (message, source, details, service, status)
- getServerErrorMessage(): String — e.g., Invalid ttl
- getServerErrorSource(): String — error source
- getServerErrorDetails(): Object — first issue details: message, location, locationType

## Revoke token

Requires:
- Access Manager add-on enabled.
- Revoke v3 Token enabled in Admin Portal (ACCESS MANAGER section).

Revokes an existing valid token obtained via grantToken(). Supported for ttl ≤ 30 days; for longer, contact support.

### Method(s)

```
`1$pubnub->revokeToken($token)  
2    ->sync();  
`
```

Parameters:
- token (String; required): Existing token to revoke.

### Sample code

```
1
  

```

### Returns

On success: PNRequestResult. On failure: PubNubServerException.

PNRequestResult methods:
- getStatus(): Int — 200
- getService(): String — Access Manager
- isError(): Boolean
- getError(): Array
- getMessage(): String — Success

### Error Responses

Possible errors: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

Decodes a token and returns embedded permissions and metadata; useful for debugging TTL and resource permissions.

### Method(s)

```
`1parseToken(String token)  
`
```

Parameters:
- token (String; required): Token to parse.

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
Method list:
- getVersion(): Int — token version (current: 2)
- getTimestamp(): Int — issued timestamp
- getTtl(): String — minutes valid
- getResources(): Array — resources: type => name => permissions
- getPatterns(): Array — patterns: type => name => permissions
- getChannelResource($channel: String): Object|null — Permissions for channel
- getChannelGroupResource($channelGroup: String): Object|null — Permissions for channel group
- getUuidResource($uuid: String): Object|null — Permissions for UUID
- getChannelPattern($channel: String): Object|null — Permissions for channel pattern
- getChannelGroupPattern($channelGroup: String): Object|null — Permissions for channel group pattern
- getUuidPattern($uuid: String): Object|null — Permissions for UUID pattern
- getMetadata(): Array — metadata from grant
- getSignature(): String — server signature
- getUuid(): String — authorized UUID
- toArray(): Array — full token as array

#### Permissions object

Calling getChannelResource() (etc.) returns a Permissions object with right-check helpers.

```
1
  

```

Methods:
- hasRead(): boolean — Subscribe, History, Presence
- hasWrite(): boolean — Publish
- hasManage(): boolean — Channel groups, App Context
- hasDelete(): boolean — History, App Context
- hasGet(): boolean — App Context
- hasUpdate(): boolean — App Context
- hasJoin(): boolean — App Context

### Error Responses

If parsing fails, the token may be damaged. Request a new one.

## Set token

Clients use setToken() to update the authentication token granted by the server.

### Method(s)

```
`1setToken(String token)  
`
```

Parameters:
- token (String; required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

Last updated on Nov 6, 2025