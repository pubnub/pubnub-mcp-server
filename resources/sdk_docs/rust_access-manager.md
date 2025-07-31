# Access Manager v3 – Rust SDK (Condensed)

Enables server-side creation, revocation, parsing, and client-side setting of PAM v3 tokens.

---

## Grant Token

Generates a time-limited token that embeds permissions for channels, channel groups, and user IDs.

• TTL (`1-43 200` min) required  
• Optional: `authorized_user_id`, resource lists, regex patterns, `meta` map  
• At least one permission must be supplied

### Permissions per resource
* channel – read, write, get, manage, update, join, delete  
* channel_group – read, manage  
* user_id – get, update, delete  

### Method
```
`pubnub  
    .grant_token(usize)  
    .resources(Option[Boxpermissions::Permission>]>)  
    .patterns(Option[Boxpermissions::Permission>]>)  
    .authorized_user_id(OptionString>)  
    .meta(OptionHashMapString, MetaValue>>)  
    .execute()  
`
```

Parameter | Type | Notes
--- | --- | ---
grant_token | usize | TTL (minutes), 1–43 200
resources | Option\<[Box\<dyn permissions::Permission\>]\> | Explicit resource list
patterns | Option\<[Box\<dyn permissions::Permission\>]\> | Regex resource list
authorized_user_id | Option\<String\> | Restricts token to one client
meta | Option\<HashMap\<String, MetaValue\>\> | Scalar values only

### Permission object template
```
permissions::{object}. {permission_type}()
```
object:  
• channel("chat") / channel("^onetoone-[A-Za-z0-9]+$")  
• channel_group("group") / channel_group("^room-[A-Za-z0-9]+$")  
• user_id("user1") / user_id("^user-[A-Za-z0-9]+$")

permission_type: as listed in table above.

### Examples
Permission objects:
```
`  
`
```
Regex permission:
```
`  
`
```
Complete grant:
```
`  
`
```
Grant with different resources:
```
`  
`
```
Grant via regex:
```
`  
`
```
Grant mixed with regex:
```
`  
`
```

Return: `GrantTokenResult` (`.token` contains string token).

Error: `400` on invalid input (regex, timestamp, permissions, etc.).

---

## Revoke Token

Disables an existing token (≤ 30 day TTL). Feature must be enabled in Admin Portal.

### Method
```
`pubnub  
    .revoke_token(token)  
`
```

Parameter | Type
--- | ---
token | Into\<String>

Sample:
```
`  
`
```

Returns success or error (`400`, `403`, `503`).

---

## Parse Token

Decodes a token for debugging.

### Method
```
`pubnub  
    .parse_token(&token)  
`
```

Sample:
```
`pubnub  
    .parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

Example response:
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
Errors indicate damaged token; request a new one.

---

## Set Token

Client updates current token.

### Method
```
`pubnub  
    .set_token(token);  
`
```

Parameter | Type
--- | ---
token | Into\<String>

Sample:
```
`pubnub  
    .set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```
No return value.

---

Last updated: **Jul 15 2025**