# Access Manager v3 – Dart SDK (condensed)

Access Manager lets your server issue, revoke, inspect, and set time-limited permission tokens.

Prerequisites  
• Access Manager add-on enabled in the Admin Portal  
• Secret key on the server side  

---

## Grant Token (channels / groups / UUIDs)

### Method
```
`pubnub.grantToken(TokenRequest tokenRequest)  
`
```

### Build `TokenRequest`
```
`pubnub.requestToken({  
  @required int? ttl,  
  Map<String, dynamic>? meta,  
  String? authorizedUUID,  
  String? using,  
  Keyset? keyset  
});  
`
```

* ttl – 1-43 200 min (required)  
* meta – scalar values only  
* authorizedUUID – lock token to one client  
* using / keyset – pick keyset

### Add permissions
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
Types: `uuid`, `channel`, `channelGroup`. Provide `name` _or_ `pattern`. All flags default to `false`.

Channel perms: read, write, get, manage, update, join, delete  
ChannelGroup: read, manage  uuid: get, update, delete  

### Reference snippet
```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',   
      publishKey: 'demo',   
      secretKey: 'sec_key'  
      userId: UserId('myUniqueUserId')  
    ),  
  );  
  
  var request = pubnub.requestToken(  
`
```
show all 30 lines

### Successful response
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

### Additional examples  
All original examples retained:

* Different levels in one call  
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

* RegEx read channels  
```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

* Mixed explicit + RegEx  
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

Error: `400` with `PubNubException`.

---

## Grant Token (Spaces & Users)

Exactly the same flow but resources are `space` / `user` and parameter is `authorizedUserId`.

### Build request
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
Add permissions (`ResourceType.space` or `ResourceType.user`) with the same `add()` signature.

### Basic example
```
`var request = pubnub.requestToken(ttl: 15, authorizedUserId: 'my-authorized-userId');  
request.add(ResourceType.space, name: 'my-space', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

### More examples (all preserved)
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

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUserId: 'my-authorized-userId')  
..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

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

Errors: `400`.

---

## Revoke Token

Enable *Revoke v3 Token* in the Admin Portal.

### Method
```
`var result = await pubnub.revokeToken("token");  
`
```

### Usage
```
`await pubnub.revokeToken("token");  
`
```
Returns empty `PamRevokeTokenResult`. Errors: 400, 403, 503.

---

## Parse Token
```
`parseToken(String token)  
`
```

### Example
```
`pubnub.parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Decoded format (truncated)
```
`{  
   "version":2,  
   "timetoken":1629394579,  
   "ttl":15,  
   "authorizedUUID":"user1",  
   "resources":{…}  
`
```
show all 78 lines

---

## Set Token
```
`setToken(String token, {String? using, Keyset? keyset})  
`
```

### Usage
```
`pubnub.setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```
No return value.

---

_Last updated Apr 29 2025_