# Access Manager v3 API for Dart SDK

Access Manager lets servers (initialized with a Secret Key) grant time-limited tokens with embedded permissions for PubNub resources. Permissions can target explicit resource names or RegEx patterns and can combine multiple resource/permission pairs in one request. Tokens can be restricted to a single client via authorized UUID/userId.

Note: User ID is also referred to as UUID/uuid in some APIs and responses, but holds the value of userId set during initialization.

Requires:
- Access Manager add-on enabled in the Admin Portal.
- Secret Key on the server that issues grantToken.

## Grant token

Generates a time-limited token with ACL for:
- channel, channelGroup, uuid
- Permissions: read, write, get, manage, update, join, delete (supported per resource)
- TTL (minutes, required; 1..43,200)
- RegEx patterns for resources
- authorizedUUID to restrict token to one client UUID

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- channelGroup: read, manage
- uuid: get, update, delete

Use RegEx by adding a pattern instead of a name. authorizedUUID limits token use to that UUID; omit to allow any uuid.

### Method(s)

```
pubnub.grantToken(TokenRequest tokenRequest)
```

To create TokenRequest:

```
pubnub.requestToken({
  @required int? ttl,
  Map<String, dynamic>? meta,
  String? authorizedUUID,
  String? using,
  Keyset? keyset
});
```

TokenRequest parameters:
- ttl (Number, required): token validity in minutes, 1..43,200.
- meta (Map<String, dynamic>): scalar values only.
- authorizedUUID (String): single uuid allowed to use the token.
- using (String): keyset name from keysetStore for this call.
- keyset (Keyset): override default keyset.

Required: grant at least one permission for uuid, channel, or channelGroup (via name or pattern).

Add resource permissions:

```
add(ResourceType type,
    {String? name,
    String? pattern,
    bool? create,
    bool? delete,
    bool? manage,
    bool? read,
    bool? write,
    bool? get,
    bool? update,
    bool? join})
```

add parameters:
- type (ResourceType): uuid, channel, channelGroup.
- name (String): resource name (mutually exclusive with pattern).
- pattern (String): resource pattern (mutually exclusive with name).
- read/write/create/manage/delete/get/update/join (Boolean, default false).

### Sample code

```
import 'package:pubnub/pubnub.dart';

void main() async {
  // Create PubNub instance with default keyset.
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      secretKey: 'sec_key',
      userId: UserId('myUniqueUserId')
    ),
  );

  // Prepare the request object for granting a token
  var request = pubnub.requestToken(
    ttl: 15,                    // Time to live in minutes
    authorizedUUID: 'my-authorized-uuid' // Restrict to a specific UUID
  );

  // Add permissions for a channel
  request.add(
    ResourceType.channel,
    name: 'my-channel',
    read: true // Grant read permissions
  );

  // Send the token request
  var token = await pubnub.grantToken(request);
  print('grant token = ${token}');
}
```

### Returns

```
{
    "status": 200,
    "data": {
        "message": "Success",
        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"
    },
    "service" : "Access Manager"
}
```

### Other examples

Grant an authorized client different levels of access to various resources in a single call:

```
var request = pubnub.requestToken(
    ttl: 15, authorizedUUID: 'my-authorized-uuid')
..add(ResourceType.channel, name: 'channel-a', read: true)
..add(ResourceType.channelGroup, name: 'channel-group-b', read: true)
..add(ResourceType.uuid, name: 'uuid-c', get: true)
..add(ResourceType.channel, name: 'channel-b', read: true, write: true)
..add(ResourceType.channel, name: 'channel-c', read: true, write: true)
..add(ResourceType.channel, name: 'channel-d', read: true, write: true)
..add(ResourceType.uuid, name: 'uuid-d', get: true, update: true);

var token = await pubnub.grantToken(request);
print('grant token = $token');
```

Grant an authorized client read access to multiple channels using RegEx:

```
var request = pubnub.requestToken(
    ttl: 15, authorizedUUID: 'my-authorized-uuid')
..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);

var token = await pubnub.grantToken(request);
print('grant token = $token');
```

Grant different levels of access to resources and read access to channels via RegEx in a single call:

```
var request = pubnub.requestToken(
    ttl: 15, authorizedUUID: 'my-authorized-uuid')
..add(ResourceType.channel, name: 'channel-a', read: true)
..add(ResourceType.channelGroup, name: 'channel-group-b', read: true)
..add(ResourceType.uuid, name: 'uuid-c', get: true)
..add(ResourceType.channel, name: 'channel-b', read: true, write: true)
..add(ResourceType.channel, name: 'channel-c', read: true, write: true)
..add(ResourceType.channel, name: 'channel-d', read: true, write: true)
..add(ResourceType.uuid, name: 'uuid-d', get: true, update: true)
..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);

var token = await pubnub.grantToken(request);
print('grant token = $token');
```

### Error responses

HTTP 400 with details for invalid requests (e.g., RegEx issue, invalid timestamp, incorrect permissions). Error details in PubNubException.

## Grant token - spaces & users

Generates a time-limited token with ACL for:
- space, user
- Permissions: read, write, get, manage, update, join, delete (supported per resource)
- TTL (minutes, required; 1..43,200)
- RegEx patterns for resources
- authorizedUserId to restrict token to one client userId

Permissions per resource:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

### Method(s)

```
pubnub.grantToken(TokenRequest tokenRequest)
```

To create TokenRequest:

```
pubnub.requestToken({
  @required int? ttl,
  Map<String, dynamic>? meta,
  String? authorizedUserId,
  String? using,
  Keyset? keyset
});
```

TokenRequest parameters:
- ttl (Number, required): 1..43,200 minutes.
- meta (Map<String, dynamic>): scalar values only.
- authorizedUserId (String): single userId allowed to use the token.
- using (String): keyset name from keysetStore for this call.
- keyset (Keyset): override default keyset.

Required: grant at least one permission for a user or space (via name or pattern).

Add resource permissions:

```
add(ResourceType type,
    {String? name,
    String? pattern,
    bool? create,
    bool? delete,
    bool? manage,
    bool? read,
    bool? write,
    bool? get,
    bool? update,
    bool? join})
```

add parameters:
- type (ResourceType): user or space.
- name (String) or pattern (String).
- read/write/create/manage/delete/get/update/join (Boolean, default false).

### Sample code

```
 // Prepare the request object
var request = pubnub.requestToken(ttl: 15, authorizedUserId: 'my-authorized-userId');
request.add(ResourceType.space, name: 'my-space', read: true);

// Send the token request
var token = await pubnub.grantToken(request);
print('grant token = $token');
```

### Returns

```
{
    "status": 200,
    "data": {
        "message": "Success",
        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"
    },
    "service" : "Access Manager"
}
```

### Other examples

Grant different levels of access to various resources:

```
var request = pubnub.requestToken(
    ttl: 15, authorizedUserId: 'my-authorized-userId')
..add(ResourceType.space, name: 'space-a', read: true)
..add(ResourceType.user, name: 'userId-c', get: true)
..add(ResourceType.space, name: 'space-b', read: true, write: true)
..add(ResourceType.space, name: 'space-c', read: true, write: true)
..add(ResourceType.space, name: 'space-d', read: true, write: true)
..add(ResourceType.user, name: 'userId-d', get: true, update: true);

var token = await pubnub.grantToken(request);
print('grant token = $token');
```

Grant read access to multiple spaces using RegEx:

```
var request = pubnub.requestToken(
    ttl: 15, authorizedUserId: 'my-authorized-userId')
..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);

var token = await pubnub.grantToken(request);
print('grant token = $token');
```

Combine explicit resources and RegEx patterns in one call:

```
var request = pubnub.requestToken(
    ttl: 15, authorizedUserId: 'my-authorized-userId')
..add(ResourceType.space, name: 'space-a', read: true)
..add(ResourceType.user, name: 'userId-c', get: true)
..add(ResourceType.space, name: 'space-b', read: true, write: true)
..add(ResourceType.space, name: 'space-c', read: true, write: true)
..add(ResourceType.space, name: 'space-d', read: true, write: true)
..add(ResourceType.user, name: 'userId-d', get: true, update: true)
..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);

var token = await pubnub.grantToken(request);
print('grant token = $token');
```

### Error responses

HTTP 400 with details for invalid requests (e.g., RegEx issue, invalid timestamp, incorrect permissions). Error details in PubNubException.

## Revoke token

Disable an existing token (previously obtained via grantToken). Use for tokens with ttl ≤ 30 days; contact support for longer TTLs.

Requires:
- Access Manager add-on.
- Revoke v3 Token enabled in Admin Portal (keyset > ACCESS MANAGER).

### Method(s)

```
var result = await pubnub.revokeToken("token");
```

Parameter:
- token (String): existing token to revoke.

### Sample code

```
await pubnub.revokeToken("token");
```

### Returns

Empty PamRevokeTokenResult on success.

### Error Responses

Possible: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

Decode an existing token to inspect embedded permissions and TTL.

### Method(s)

```
parseToken(String token)
```

Parameter:
- token (String): current token.

### Sample code

```
pubnub.parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")
```

### Returns

```
{
   "version":2,
   "timetoken":1629394579,
   "ttl":15,
   "authorizedUUID": "user1",
   "resources":{
      "uuids":{
         "user1":{
            "read":false,
            "write":false,
            "manage":false,
            "delete":false,
            "get":true,
            "update":true,
            "join":false
         }
      },
      "channels":{
         "channel1":{
            "read":true,
            "write":true,
            "manage":false,
            "delete":false,
            "get":false,
            "update":false,
            "join":false
         }
      },
      "groups":{
         "group1":{
            "read":true,
            "write":false,
            "manage":false,
            "delete":false,
            "get":false,
            "update":false,
            "join":false
         }
      }
   },
   "patterns":{
      "uuids":{
         ".*":{
            "read":false,
            "write":false,
            "manage":false,
            "delete":false,
            "get":true,
            "update":false,
            "join":false
         }
      },
      "channels":{
         ".*":{
            "read":true,
            "write":true,
            "manage":false,
            "delete":false,
            "get":false,
            "update":false,
            "join":false
         }
      },
      "groups":{
         ".*":{
            "read":true,
            "write":false,
            "manage":false,
            "delete":false,
            "get":false,
            "update":false,
            "join":false
         }
      }
   },
    "meta": { "token" : "meta" },
    "signature": "QQ9nC2BjEBbf4uwFpf9aBZ1i+0BelhsqWXc="
}
```

### Error Responses

If parsing fails, the token may be damaged; request a new token from the server.

## Set token

Clients call setToken to update the authentication token received from the server.

### Method(s)

```
setToken(String token, {String? using, Keyset? keyset})
```

Parameters:
- token (String): current token.
- using (String): keyset name from keysetStore for this call.
- keyset (Keyset): override default keyset.

### Sample code

```
pubnub.setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")
```

### Returns

No return value.

Last updated on Sep 3, 2025