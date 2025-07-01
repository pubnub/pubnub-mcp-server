# Access Manager v3 – Java SDK (≥ 9.0.0)

PubNub Java SDK 9.x merges Java/Kotlin codebases, introduces a new client constructor, and changes async callbacks/status events. See the Java/Kotlin migration guide for upgrade notes.

---

## Grant Token (channels, channel-groups, uuids)

Requires the *Access Manager* add-on.

### Method
```java
grantToken()  
    .ttl(Integer)  
    .meta(Object)  
    .authorizedUUID(String)  
    .channels(ListChannelGrant>)  
    .channelGroups(ListChannelGroupGrant>)  
    .uuids(ListUUIDGrant>)  
```

### Parameters
* **ttl** (*Number*, 1–43 200 min) – required.  
* **meta** (*Object*) – scalar values only.  
* **authorizedUUID** (*String*) – token usable only by this `uuid`.  
* **channels / channelGroups / uuids** (*List* or RegEx pattern) – at least one required.

### Permissions
* channels: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`
* channelGroups: `read`, `manage`
* uuids: `get`, `update`, `delete`

### Basic usage
```
  
```

### Return example
```json
{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}
```

### Additional examples
#### Mixed permissions
```
  
```
#### Read with RegEx
```
  
```
#### Mixed list + RegEx
```
  
```

Error responses: `400` on invalid request (bad RegEx, timestamp, permissions, etc.) – details in `PubNubException`.

---

## Grant Token – Spaces & Users

Requires the *Access Manager* add-on.

### Method
```java
grantToken()  
    .ttl(Integer)  
    .meta(Object)  
    .authorizedUserId(UserId)  
    .spacesPermissions(ListSpacePermissions>)  
    .usersPermissions(ListUserPermissions>)  
```

### Parameters
* **ttl** (*Number*, 1–43 200 min) – required.  
* **meta** (*Object*) – scalar values only.  
* **authorizedUserId** (*UserId*) – token usable only by this user.  
* **spacesPermissions / usersPermissions** – list or RegEx; at least one required.

### Permissions
* space: `read`, `write`, `get`, `manage`, `update`, `join`, `delete`
* user: `get`, `update`, `delete`

### Basic usage
```
  
```

### Return example
```json
{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}
```

### Additional examples
#### Mixed permissions
```
  
```
#### Read with RegEx
```
  
```
#### Mixed list + RegEx
```
  
```

Error responses identical to channel grants.

---

## Revoke Token

Requires the *Access Manager* add-on and *Revoke v3 Token* enabled in the Admin Portal.

### Method
```java
revokeToken()  
    .token(String token)  
```

* **token** (*String*) – previously granted token (ttl ≤ 30 days).

### Basic usage
```
  
```

Returns `PNRevokeTokenResult` on success. Possible errors: `400`, `403`, `503`.

---

## Parse Token

### Method
```java
parseToken(String token)
```
* **token** (*String*) – token to inspect.

### Basic usage
```
  
```

### Return
```
  
```
Errors indicate a damaged/invalid token.

---

## Set Token (client side)

### Method
```java
setToken(String token)
```
* **token** – new auth token.

### Basic usage
```
  
```
Returns `void`.

---

_Last updated : Jun 2 2025_