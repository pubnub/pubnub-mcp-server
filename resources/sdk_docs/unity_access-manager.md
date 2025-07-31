# Access Manager v3 – Unity SDK (condensed)

Access Manager issues time-limited tokens with embedded permissions for PubNub resources (channels, channel groups, UUID metadata). Requires the **Access Manager** add-on.

---

## GrantToken

Generate a token with resource or RegEx-based permissions.

```csharp
pubnub.GrantToken()
    .TTL(int)                         // Required: 1–43 200 min
    .Meta(Dictionary<string,object>)  // Scalar values only
    .AuthorizedUuid(string)           // Restrict token to one UUID
    .Resources(PNTokenResources)      // Explicit resources
    .Patterns(PNTokenPatterns)        // RegEx resources
    .QueryParam(Dictionary<string,object>)
    .Execute(Action<PNAccessManagerTokenResult, PNStatus>)
    .ExecuteAsync()                   // Task<PNResult<PNAccessManagerTokenResult>>
```

### Permissions per resource  
Channels | ChannelGroups | UUIDs  
`read, write, get, manage, update, join, delete` | `read, manage` | `get, update, delete`

### Data types

*PNTokenResources / PNTokenPatterns*  
• `Channels`, `ChannelGroups`, `Uuids` → `Dictionary<string, PNTokenAuthValues>`

*PNTokenAuthValues*  
`Read`, `Write`, `Manage`, `Delete`, `Get`, `Update`, `Join` (bool)

### Return

`PNResult<PNAccessManagerTokenResult>` → `Result.Token` (string), `Status`.

```json
{ "Token":"p0thisAkFl043rhDdH..." }
```

### Errors  
`400 Bad Request`, `403 Forbidden`, `503 Service Unavailable`.

#### Sample code
```
  
```

---

## RevokeToken

Disable an issued token (Revoke v3 Token must be enabled).

```csharp
pubnub.RevokeToken()
    .Token(string)                    // Required
    .QueryParam(Dictionary<string,object>)
    .Execute(Action<PNAccessManagerRevokeTokenResult, PNStatus>)
    .ExecuteAsync()                   // Task<PNResult<PNAccessManagerRevokeTokenResult>>
```

Returns empty `PNAccessManagerRevokeTokenResult` + `PNStatus`.

#### Sample code
```
  
```

---

## ParseToken

Decode a token to inspect its contents.

```csharp
ParseToken(string token)
```

`TokenContents`  
• `Resources`, `Patterns` (see PNTokenResources structure)  
• `Meta`, `Signature`, `Version`, `Timestamp`, `TTL`, `AuthorizedUUID`.

`TokenAuthValues` booleans as above.

#### Sample code
```
  
```

---

## SetAuthToken

Apply/refresh a token on the client.

```csharp
SetAuthToken(string token)
```

(No return value)

#### Sample code
```
  
```

---

## Deprecated: Spaces & Users

Deprecated variants use `Spaces`/`Users` instead of Channels/UUIDs. Method signature mirrors current `GrantToken()` but with:

```csharp
pubnub.GrantToken()
    .TTL(int)
    .Meta(Dictionary<string,object>)
    .AuthorizedUserId(string)
    .Resources(PNTokenResources)   // Spaces, Users
    .Patterns(PNTokenPatterns)     // Spaces, Users
    .Execute(Action<PNAccessManagerTokenResult, PNStatus>)
```

`PNTokenResources / Patterns`  
• `Spaces`, `Users` → `Dictionary<string, PNTokenAuthValues>`

Permissions (Spaces | Users):  
`read, write, get, manage, update, join, delete` | `get, update, delete`

#### Sample / other examples
```
  
```

---

### General notes

1. `TTL` mandatory (minutes, max 30 days).  
2. Specify at least one resource or pattern.  
3. `AuthorizedUuid` (or deprecated `AuthorizedUserId`) is recommended for single-client tokens.  
4. RegEx patterns grant permissions to matching resources.

_Last updated: Jul 15 2025_