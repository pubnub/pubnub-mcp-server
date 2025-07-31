# Access Manager v3 – Java SDK  

## Breaking changes in v 9.0.0
Java SDK 9.x merges Java/Kotlin codebases, introduces a new PubNub client constructor, and changes async callbacks and status events. See the migration guide for details.

---

## Grant token (channels / groups / UUIDs)

Requires the **Access Manager** add-on.

Creates a time-limited token (`ttl` 1–43 200 min) with embedded ACL for:
• channels • channelGroups • uuids  
Optional restriction to one client via `authorizedUUID`.

### Permissions
channels  → read, write, get, manage, update, join, delete  
channelGroups  → read, manage  
uuids  → get, update, delete  

### Method
```
`grantToken()  
    .ttl(Integer)  
    .meta(Object)  
    .authorizedUUID(String)  
    .channels(List<ChannelGrant>)  
    .channelGroups(List<ChannelGroupGrant>)  
    .uuids(List<UUIDGrant>)  
`
```
Required: `ttl` and at least one set of resource permissions.

### Returns
```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Sample / other examples
(unchanged example blocks)
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

Error 400 on invalid args (bad RegEx, timestamp, etc.) via `PubNubException`.

---

## Grant token – Spaces & Users

Same semantics as above but for Objects API resources: `spaces` and `users`, restricted by `authorizedUserId`.

Permissions  
space  → read, write, get, manage, update, join, delete  
user  → get, update, delete  

### Method
```
`grantToken()  
    .ttl(Integer)  
    .meta(Object)  
    .authorizedUserId(UserId)  
    .spacesPermissions(List<SpacePermissions>)  
    .usersPermissions(List<UserPermissions>)  
`
```

### Returns / Examples
Identical structure:
```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```
Example blocks:
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

---

## Revoke token

Requires add-on and “Revoke v3 Token” enabled in Admin Portal.

### Method
```
`revokeToken()  
    .token(String token)  
`
```
Returns `PNRevokeTokenResult`.  
Errors: 400, 403, 503.

### Sample
```
`  
`
```

---

## Parse token

### Method
```
`parseToken(String token)  
`
```

### Sample
```
`  
`
```

### Returns
```
`  
`
```

---

## Set token

### Method
```
`setToken(String token)  
`
```

### Sample
```
`  
`
```

No return value.

---

_Last updated: Jul 15 2025_