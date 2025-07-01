# Access Manager v3 – Kotlin SDK  

## Breaking changes (SDK 9.0.0)  
• Unified Java/Kotlin codebase, new client instantiation, changed async callbacks and status events.  
• See migration guide if upgrading from < 9.0.0.  

## Request execution (all endpoints)  
You must call `.sync()` or `.async()` on the returned `Endpoint` object:  
```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

---

## Grant Token  (channels / channel-groups / UUIDs)  
Requires the *Access Manager* add-on.

### Method  
```
`grantToken(  
  ttl: Integer,           // 1 – 43 200 minutes (required)  
  meta: Any,              // optional scalar values only  
  authorizedUUID: String, // restricts token to one uuid  
  channels: List<ChannelGrant>,  
  channelGroups: List<ChannelGroupGrant>,  
  uuids: List<UUIDGrant>  
)  
`
```

### Parameters (at least one resource or pattern is mandatory)  
• ttl – token lifetime in minutes.  
• meta – optional scalar metadata.  
• authorizedUUID – single uuid that can use this token.  
• channels / channelGroups / uuids – lists or RegEx patterns with permission sets.  

Supported permissions  
• Channels: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• Channel-groups: `read`, `manage`  
• UUIDs: `get`, `update`, `delete`  

TTL max: 30 days (43 200 min).  
Patterns: provide RegEx in `patterns` object.  

### Return  
```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Examples  
```
`  
`
```  
```
`  
`
```  
```
`  
`
```

### Error responses  
HTTP 400 with `PubNubException` if arguments (permissions, RegEx, timestamp, etc.) are invalid.  

---

## Grant Token – Spaces & Users  
Same add-on requirement.

### Method  
```
`grantToken(  
  ttl: Int,  
  meta: Any?,  
  authorizedUserId: UserId?,  
  spacesPermissions: List<SpacePermissions>,  
  usersPermissions: List<UserPermissions>  
)  
`
```

### Parameters  
• ttl, meta, authorizedUserId analogous to above.  
• spacesPermissions / usersPermissions – lists or RegEx patterns.  

Permissions  
• Spaces: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• Users:  `get`, `update`, `delete`  

### Return  
```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Examples  
```
`  
`
```  
```
`  
`
```  
```
`  
`
```

### Error responses  
HTTP 400 with `PubNubException` for the same error types.  

---

## Revoke Token  
Requires *Access Manager* and “Revoke v3 Token” enabled in Admin Portal.  

### Method  
```
`revokeToken(token: String)  
`
```

• token – an existing v3 token (ttl ≤ 30 days).  
Returns `Unit` on success.  
Errors: 400, 403, 503.  

### Usage  
```
`  
`
```

---

## Parse Token  
### Method  
```
`parseToken(String token)  
`
```

### Usage  
```
`  
`
```

### Return (truncated sample)  
```
`{  
   "version":2,  
   "timestamp":1629394579,  
   "ttl":15,  
   "authorized_uuid":"user1",  
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

Error indicates damaged token; request a new one.  

---

## Set Token  
### Method  
```
`setToken(String token)  
`
```

### Usage  
```
`  
`
```

Does not return a value.