# Access Manager v3 – Rust SDK (Condensed)

Access Manager lets your server grant, revoke, parse, and set time–limited tokens that embed fine-grained permissions for PubNub resources (channels, channel groups, user objects).  
Access Manager add-on must be enabled in the Admin Portal.

---

## Grant Token

### Method
```rust
pubnub
    .grant_token(ttl_minutes /* usize */)
    .resources(Option<Box<[dyn permissions::Permission]>>)
    .patterns(Option<Box<[dyn permissions::Permission]>>)
    .authorized_user_id(Option<String>)
    .meta(Option<HashMap<String, MetaValue>>)
    .execute()
```

Parameter | Type | Notes
--- | --- | ---
`ttl_minutes` | `usize` | Required, 1–43 200 (minutes).
`resources` | `Option<Box<[dyn permissions::Permission]>>` | Explicit resource list.
`patterns` | `Option<Box<[dyn permissions::Permission]>>` | RegEx permissions.
`authorized_user_id` | `Option<String>` | Restrict token to a single user.
`meta` | `Option<HashMap<String, MetaValue>>` | Scalar values only.

At least one permission must be supplied for a `uuid`, `channel`, or `channel_group`.

### Permissions object
```
permissions::{entity}.{operation}()
```
Entity → operations  
• `channel("name" | "^regex$")` → `read()`, `write()`, `get()`, `manage()`, `update()`, `join()`, `delete()`  
• `channel_group("name")` → `read()`, `manage()`  
• `user_id("id")` → `get()`, `update()`, `delete()`

### Examples (verbatim)

```
`  
`
```

```
`  
`
```

### Basic usage
```
`  
`
```

### Returns
`GrantTokenResult`; use `GrantTokenResult.token` to obtain the string.

### Error responses
`400` on malformed request (invalid TTL, regex, permissions, timestamp, etc.). Error details in `PubNubException`.

---

## Revoke Token

### Method
```rust
pubnub
    .revoke_token(token)
```
`token: Into<String>` – existing v3 token.

### Basic usage
```
`  
`
```

### Returns
Success or error (`400`, `403`, `503`).

Note: Enable “Revoke v3 Token” in Admin Portal before use; supported for tokens with `ttl` ≤ 30 days.

---

## Parse Token

### Method
```rust
pubnub
    .parse_token(&token)
```
`token: &str`

### Basic usage
```rust
pubnub
    .parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")
```

### Returns (truncated example)
```
{
   "version": 2,
   "timestamp": 1629394579,
   "ttl": 15,
   "authorized_uuid": "user1",
   "resources": {
      "uuids": {
         "user1": {
            "read": false,
            "write": false,
            "manage": false,
            "delete": false,
            "get": true,
            "update": true,
            "join": false
```
*(continues)*

Error indicates corrupted token; request a new one.

---

## Set Token

### Method
```rust
pubnub
    .set_token(token);
```
`token: Into<String>`

### Basic usage
```rust
pubnub
    .set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")
```

No return value.

---

_Last updated: Apr 29 2025_