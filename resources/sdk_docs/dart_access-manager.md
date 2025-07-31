# PubNub Dart SDK – Access Manager v3 (Condensed)

## Grant token (channels, channelGroups, UUIDs)

Requires Access Manager add-on.

### Method
```
`pubnub.grantToken(TokenRequest tokenRequest)  
`
```

Create a `TokenRequest`:
```
`pubnub.requestToken({  
  @required int? ttl,  
  MapString, dynamic>? meta,  
  String? authorizedUUID,  
  String? using,  
  Keyset? keyset  
});  
`
```

Use `.add()` to attach permissions:
```
`add(ResourceType type,  
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
`
```

Key points  
• `ttl` 1-43 200 min (required)  
• At least one permission on `uuid`, `channel`, or `channelGroup` (by `name` or RegEx `pattern`).  
• Recommended: set `authorizedUUID` to bind the token to a single client.

Permissions per resource  
```
channel:       read write get manage update join delete  
channelGroup:  read        manage                   
uuid:                         get        update      delete
```

#### Reference snippet
```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',   
      publishKey: 'demo',   
      secretKey: 'sec_key'  
      userId: UserId('myUniqueUserId')  
    ),  
  );  
  
  // Prepare the request object for granting a token  
  var request = pubnub.requestToken(  
`
```
*show all 30 lines*

### Returns
```
`{  
    "status": 200,  
    "data": {  
        "message": "Success",  
        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
    },  
    "service" : "Access Manager"  
}  
`
```

#### Examples  

Different levels in one call
```
`var request = pubnub.requestToken(  
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
`
```

Read via RegEx
```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

Combined list + RegEx
```
`var request = pubnub.requestToken(  
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
`
```

---

## Grant token (spaces & users)

Same flow, but resources are `space`, `user`.

### Method
```
`pubnub.grantToken(TokenRequest tokenRequest)  
`
```
Create request:
```
`pubnub.requestToken({  
  @required int? ttl,  
  MapString, dynamic>? meta,  
  String? authorizedUserId,  
  String? using,  
  Keyset? keyset  
});  
`
```
Attach permissions (same `.add()` signature).

Permissions per resource  
```
space: read write get manage update join delete  
user:                        get        update      delete
```

Sample
```
`// Prepare the request object  
var request = pubnub.requestToken(ttl: 15, authorizedUserId: 'my-authorized-userId');  
request.add(ResourceType.space, name: 'my-space', read: true);  
  
// Send the token request  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

Examples (list, RegEx, combined) are preserved below.

Different levels
```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUserId: 'my-authorized-userId')  
..add(ResourceType.space, name: 'space-a', read: true)  
..add(ResourceType.user, name: 'userId-c', get: true)  
..add(ResourceType.space, name: 'space-b', read: true, write: true)  
..add(ResourceType.space, name: 'space-c', read: true, write: true)  
..add(ResourceType.space, name: 'space-d', read: true, write: true)  
..add(ResourceType.user, name: 'userId-d', get: true, update: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

RegEx
```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUserId: 'my-authorized-userId')  
..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

Combined
```
`var request = pubnub.requestToken(  
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
`
```

### Returns
```
`{  
    "status": 200,  
    "data": {  
        "message": "Success",  
        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
    },  
    "service" : "Access Manager"  
}  
`
```

---

## Revoke token

Enable “Revoke v3 Token” in Admin Portal.

### Method
```
`var result = await pubnub.revokeToken("token");  
`
```
Parameter: `token` (String) – existing token to disable.

### Sample
```
`await pubnub.revokeToken("token");  
`
```
Successful call returns `PamRevokeTokenResult` (empty).

---

## Parse token

### Method
```
`parseToken(String token)  
`
```

### Sample
```
`pubnub.parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns (truncated)
```
`{  
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
`
```
*show all 78 lines*

---

## Set token

### Method
```
`setToken(String token, {String? using, Keyset? keyset})  
`
```

### Sample
```
`pubnub.setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```
(No return value.)

---

### Common error responses
• `400 Bad Request`  
• `403 Forbidden`  
• `503 Service Unavailable` (revoke)  

Last updated **Jul 15 2025**