# Access Manager v3 API for PHP SDK

Access Manager v3 issues time-limited tokens with embedded permissions for PubNub resources:
- Limited TTL
- Resource lists or RegEx patterns
- Mixed permissions per resource in a single request
- Optional authorizedUuid to restrict usage to a single client UUID

For full concepts, see Manage Permissions with Access Manager v3.

## Grant token

##### Requires Access Manager add-on
Enable Access Manager for your keyset in the Admin Portal.

##### Requires Secret Key authentication
Granting must be performed by a server SDK instance initialized with a Secret Key.

The grantToken() method creates a token with ttl, optional authorized_uuid, and permissions for:
- Channels
- ChannelGroups
- Uuids (App Context metadata)

Unauthorized or invalid token use returns 403.

Permissions per resource:
- Channels: read, write, get, manage, update, join, delete
- ChannelGroups: read, manage
- Uuids: get, update, delete

TTL:
- Required; minutes the token remains valid
- Minimum 1, maximum 43,200 (30 days)

Patterns (RegEx):
- Use patterns to grant by regex instead of explicit names.

Authorized UUID:
- Restrict the token to a single UUID via authorizedUuid.

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
- ttl
  - Type: Number; Default: n/a
  - Total minutes the token is valid (min 1; max 43,200).
- authorizedUuid
  - Type: String; Default: n/a
  - UUID authorized to use the token.
- addChannelResources
  - Type: Array; Default: n/a
  - Explicit channel permissions.
- addChannelGroupResources
  - Type: Array; Default: n/a
  - Explicit channel group permissions.
- addUuidResources
  - Type: Array; Default: n/a
  - Explicit UUID permissions.
- addChannelPatterns
  - Type: Array; Default: n/a
  - Channel permissions expressed as RegEx patterns.
- addChannelGroupPatterns
  - Type: Array; Default: n/a
  - Channel group permissions expressed as RegEx patterns.
- addUuidPatterns
  - Type: Array; Default: n/a
  - UUID permissions expressed as RegEx patterns.
- meta
  - Type: Array; Default: n/a
  - Extra metadata for the request. Values must be scalar only.

Resource/permission array format: key = resource name, value = rights. Omit false (default).

```
`1[  
2    'channel-1' => ['read' => true, 'write' => true]  
3    'channel-2' => ['read' => true, 'write' => false]  
4    'channel-3' => ['read' => true]  
5]  
`
```

Required key/value mappings:
- Specify permissions for at least one of: Uuid, Channel, or ChannelGroup, as resources or patterns.

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

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
1
  

```

### Error responses

Invalid requests return HTTP 400 with details in PubNubServerException (e.g., regex issues, invalid timestamp, incorrect permissions).

- getStatusCode() — Int: HTTP status (400)
- getBody() — Object: Entire error body (message, source, details, service, status)
- getServerErrorMessage() — String: Descriptive message (e.g., Invalid ttl)
- getServerErrorSource() — String: Error source
- getServerErrorDetails() — Object: First problem details (message, location, locationType)

## Revoke token

##### Requires Access Manager add-on
Enable Access Manager in the Admin Portal.

##### Enable token revoke
Enable Revoke v3 Token for your keyset in the Admin Portal.

revokeToken() disables a valid token previously obtained via grantToken(). Use for tokens with ttl ≤ 30 days. For longer ttl, contact support.

### Method(s)

```
`1$pubnub->revokeToken($token)  
2    ->sync();  
`
```

Parameters:
- token
  - Type: String; Default: n/a
  - Existing token to revoke.

### Sample code

```
1
  

```

### Returns

Success returns PNRequestResult; failures return PubNubServerException.

PNRequestResult:
- getStatus() — Int: 200
- getService() — String: Access Manager
- isError() — Boolean
- getError() — Array
- getMessage() — String: Success

### Error Responses

Possible errors:
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

parseToken() decodes an existing token and returns embedded permissions and details (useful for debugging).

### Method(s)

```
`1parseToken(String token)  
`
```

Parameters:
- token
  - Type: String; Default: n/a
  - Token to decode.

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

Methods:
- getVersion() — Int: Token version (current: 2)
- getTimestamp() — Int: Issue timestamp
- getTtl() — String: Token TTL in minutes
- getResources() — Array: resources as type => name => permissions
- getPatterns() — Array: patterns as type => name => permissions
- getChannelResource($channel) — Object|null: Permissions for a channel
- getChannelGroupResource($channelGroup) — Object|null: Permissions for a channel group
- getUuidResource($uuid) — Object|null: Permissions for a UUID
- getChannelPattern($channel) — Object|null: Permissions for a channel pattern
- getChannelGroupPattern($channelGroup) — Object|null: Permissions for a channel group pattern
- getUuidPattern($uuid) — Object|null: Permissions for a UUID pattern
- getMetadata() — Array: Metadata set in grant
- getSignature() — String: Server signature
- getUuid() — String: Authorized UUID
- toArray() — Array: Entire token as array

#### Permissions object

Calling getChannelResource(), etc., returns a Permissions object with methods to inspect rights.

```
1
  

```

- hasRead() — boolean: read (Subscribe, History, Presence)
- hasWrite() — boolean: write (Publish)
- hasManage() — boolean: manage (Channel Groups, App Context)
- hasDelete() — boolean: delete (History, App Context)
- hasGet() — boolean: get (App Context)
- hasUpdate() — boolean: update (App Context)
- hasJoin() — boolean: join (App Context)

### Error Responses

If parsing fails, the token may be damaged. Request a new token.

## Set token

setToken() is used by clients to update their current authentication token.

### Method(s)

```
`1setToken(String token)  
`
```

Parameters:
- token
  - Type: String; Default: n/a
  - Token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

Last updated on Nov 6, 2025