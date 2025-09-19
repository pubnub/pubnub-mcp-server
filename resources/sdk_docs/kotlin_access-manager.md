# Access Manager v3 API – Kotlin SDK

## Breaking changes (≥ 9.0.0)
• Unified Kotlin/Java codebase, new PubNub client initialization, updated async callbacks/status events.  
• See the migration guide for details.

## Request execution
Every SDK method returns an `Endpoint`. Always finish with `.sync()` or `.async()`:

```
`val channel = pubnub.channel("channelName")
  
channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle successful method result
    }
}`
```

---

## Grant token  *(channels / channel-groups / UUIDs)*

```
`grantToken(
  ttl: Integer,
  meta: Any,
  authorizedUUID: String,
  channels: List<ChannelGrant>,
  channelGroups: List<ChannelGroupGrant>,
  uuids: List<UUIDGrant>
)`
```

Parameter | Type | Notes
----------|------|------
ttl* | Number | 1-43 200 minutes (required)
meta | Object | Scalar values only
authorizedUUID | String | Token usable only by this UUID
channels | List\<ChannelGrant> | Grants or RegEx patterns
channelGroups | List\<ChannelGroupGrant> | Grants or RegEx patterns
uuids | List\<UUIDGrant> | Grants or RegEx patterns

Permissions per resource  
• channel → `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• channelGroup → `read`, `manage`  
• uuid → `get`, `update`, `delete`

Notes  
• At least one channel, channelGroup, or uuid grant/pattern is required.  
• Max `ttl` = 30 days.  
• RegEx patterns allowed via `patterns` object.  
• Restrict tokens with `authorizedUUID` whenever possible.

### Sample code
```
`
`
```

### Returns
```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}`
```

### Other examples
*Grant different levels of access in one call*
```
`
`
```

*Grant read access to multiple channels using RegEx*
```
`
`
```

*Mix explicit grants and RegEx patterns*
```
`
`
```

Error responses: HTTP 400 with `PubNubException` (invalid RegEx, timestamp, permissions, etc.).

---

## Grant token – *spaces & users* (Objects API)

```
`grantToken(
  ttl: Int,
  meta: Any?,
  authorizedUserId: UserId?,
  spacesPermissions: List<SpacePermissions>,
  usersPermissions: List<UserPermissions>
)`
```

Parameter | Type | Notes
----------|------|------
ttl* | Int | 1-43 200 minutes
meta | Object | Scalar values only
authorizedUserId | UserId | Single user allowed to use token
spacesPermissions | List\<SpacePermissions> | Grants or RegEx
usersPermissions | List\<UserPermissions> | Grants or RegEx

Permissions per resource  
• space → `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• user → `get`, `update`, `delete`

All other rules (ttl, RegEx, single authorized user) match the channel-based grant.

### Sample code
```
`
`
```

### Returns
```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}`
```

### Other examples
*Different access levels*
```
`
`
```
*Read access via RegEx*
```
`
`
```
*Mixed explicit & RegEx grants*
```
`
`
```

---

## Revoke token

```
`revokeToken(token: String)`
```

• Token revoke must be enabled in the Admin Portal.  
• Works for tokens with `ttl` ≤ 30 days.

### Sample code
```
`
`
```

Returns: `Unit` on success.  
Errors: 400, 403, 503.

---

## Parse token

```
`parseToken(String token)`
```

### Sample code
```
`
`
```

### Returns
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
*(truncated)*

Error: damaged token → request a new one.

---

## Set token

```
`setToken(String token)`
```

### Sample code
```
`
`
```

Updates the client’s current token; no return value.

---

Last updated **Jul 15 2025**