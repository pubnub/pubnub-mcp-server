# Access Manager v3 API for PHP SDK

Access Manager v3 issues time-limited tokens with embedded permissions to specific PubNub resources. Tokens can:
- Grant access for a defined TTL (minutes).
- Target resources by lists or RegEx patterns.
- Include per-resource permission levels in a single request.
- Optionally lock usage to a single authorizedUuid.

Resources:
- Channels
- ChannelGroups
- Uuids (App Context user metadata)

Requires:
- Access Manager add-on enabled on the keyset.
- Server-side use with Secret Key (for grant/revoke).

For permissions mapping and concepts, see Manage Permissions with Access Manager v3.

## Grant token

Generates a signed token with TTL, optional authorizedUuid, and permissions for resources and/or patterns. Unauthorized/invalid usage returns 403. TTL is required, min 1, max 43,200 minutes (30 days). Patterns allow assigning permissions via RegEx. authorizedUuid restricts token to a single client UUID.

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
- ttl (Number, required): Minutes the token is valid. Min 1, max 43,200.
- authorizedUuid (String): UUID allowed to use the token.
- addChannelResources (Array): Explicit channel permissions.
- addChannelGroupResources (Array): Explicit channel group permissions.
- addUuidResources (Array): Explicit UUID permissions.
- addChannelPatterns (Array): Channel permissions via RegEx pattern.
- addChannelGroupPatterns (Array): Channel group permissions via RegEx pattern.
- addUuidPatterns (Array): UUID permissions via RegEx pattern.
- meta (Array): Extra scalar metadata; arrays/objects not supported.

Resource permissions:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

Resource/permission array uses resource name as key and rights map as value. Omit false rights (default false).

```
`1[  
2    'channel-1' => ['read' => true, 'write' => true]  
3    'channel-2' => ['read' => true, 'write' => false]  
4    'channel-3' => ['read' => true]  
5]  
`
```

Required: Provide permissions for at least one Uuid, Channel, or ChannelGroup, either as explicit resources or patterns.

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

#### Grant an authorized client different levels of access to various resources in a single call

- my-authorized-uuid gets:
  - Read: channel-a, channel-group-b; Get: uuid-c.
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

- my-authorized-uuid gets Read on channels matching channel-[A-Za-z0-9].

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

- my-authorized-uuid gets:
  - Read: channel-a, channel-group-b; Get: uuid-c.
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.
  - Read: channels matching channel-[A-Za-z0-9].

```
1
  

```

### Error responses

Invalid requests return HTTP 400 with details in PubNubServerException. Possible causes: invalid RegEx, invalid timestamp, incorrect permissions.

PubNubServerException:
- getStatusCode(): Int — HTTP status (400).
- getBody(): Object — Error body (message, source, details, service, status).
- getServerErrorMessage(): String — Message, e.g., Invalid ttl.
- getServerErrorSource(): String — Error source.
- getServerErrorDetails(): Object — First problem details (message, location, locationType).

## Revoke token

Disables an existing token previously obtained via grantToken.

Requirements:
- Access Manager add-on enabled.
- Enable Revoke v3 Token in Admin Portal (keyset > ACCESS MANAGER).

Use for tokens with TTL ≤ 30 days. For longer TTL, contact support.

### Method(s)

```
`1$pubnub->revokeToken($token)  
2    ->sync();  
`
```

Parameters:
- token (String, required): Existing token to revoke.

### Sample code

```
1
  

```

### Returns

On success: PNRequestResult. On failure: PubNubServerException.

PNRequestResult:
- getStatus(): Int — 200.
- getService(): String — Access Manager.
- isError(): Boolean
- getError(): Array
- getMessage(): String — Success.

### Error Responses

- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

Decodes a token and returns embedded permissions and metadata. Useful for debugging TTL and permissions.

### Method(s)

```
`1parseToken(String token)  
`
```

Parameters:
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

Token accessor methods:
- getVersion(): Int — Token version (current: 2).
- getTimestamp(): Int — Issued timestamp.
- getTtl(): String — Minutes valid.
- getResources(): Array — type => name => permissions.
- getPatterns(): Array — type => name => permissions.
- getChannelResource($channel: String): Object|null — Permissions for a channel.
- getChannelGroupResource($channelGroup: String): Object|null — Permissions for a channel group.
- getUuidResource($uuid: String): Object|null — Permissions for a UUID.
- getChannelPattern($channel: String): Object|null — Pattern permissions for a channel.
- getChannelGroupPattern($channelGroup: String): Object|null — Pattern permissions for a channel group.
- getUuidPattern($uuid: String): Object|null — Pattern permissions for a UUID.
- getMetadata(): Array — Metadata set in grant.
- getSignature(): String — Server signature.
- getUuid(): String — Authorized UUID.
- toArray(): Array — Entire token as array.

#### Permissions object

Calling getChannelResource() returns a Permissions object with methods:

```
1
  

```

- hasRead(): boolean — read (Subscribe, History, Presence).
- hasWrite(): boolean — write (Publish).
- hasManage(): boolean — manage (channel groups, App Context).
- hasDelete(): boolean — delete (History, App Context).
- hasGet(): boolean — get (App Context).
- hasUpdate(): boolean — update (App Context).
- hasJoin(): boolean — join (App Context).

### Error Responses

Token parse errors indicate a damaged token; request a new one.

## Set token

Clients set/update the current authentication token received from server.

### Method(s)

```
`1setToken(String token)  
`
```

Parameters:
- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.