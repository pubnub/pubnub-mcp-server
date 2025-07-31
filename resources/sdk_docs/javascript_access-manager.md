# Access Manager v3 – JavaScript SDK (Condensed)

Access Manager lets a server issue time-limited JWT tokens embedding fine-grained permissions to PubNub resources (channels, channel groups, UUID metadata).  
Optionally restrict a token to a single client with `authorized_uuid`.

Supported async styles: Callbacks, Promises, **Async/Await (recommended)** – add `try…catch` to capture errors.

---

## Permissions
```
Resource   Allowed permissions
channel    read write get manage update join delete
group      read manage
uuid       get  update delete
```
At least one permission for a `uuid`, `channel`, or `group` (via `resources` or `patterns`) is required.

---

## grantToken()

Requires Access Manager add-on.

```js
pubnub.grantToken({
  ttl: number,                 // 1–43 200 min (30 days), required
  authorized_uuid: string,     // restricts token to this uuid (optional but recommended)
  resources: {                 // explicit resource lists
    uuids:    { "<uuid>":    { get:true, update:true, delete:true } },
    channels: { "<channel>": { read:true, write:true, manage:true, delete:true,
                               get:true, update:true, join:true } },
    groups:   { "<group>":   { read:true, manage:true } }
  },
  patterns:  {                 // regex patterns (optional)
    uuids:    { "<re>": {...} }, channels:{ "<re>": {...} }, groups:{ "<re>": {...} }
  },
  meta: any                    // scalar values only
});
```

#### Sample code (reference)
```
`  
`
```

#### Return (token string)
```
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"
```

### Additional examples
1. Different permissions to multiple resources in one call
```
`  
`
```
2. Read access to channels matched by RegEx
```
`  
`
```
3. Combination of explicit resources + RegEx
```
`  
`
```

### Errors  
Invalid requests return `400` with JSON details (e.g., bad RegEx, timestamp, permissions).

---

## revokeToken()

Enable *Revoke v3 Token* checkbox first.

```js
pubnub.revokeToken(token: string);
```
• Succeeds → HTTP 200  
• Possible errors: 400, 403, 503

```
`  
`
```

---

## parseToken()

```js
pubnub.parseToken(token: string);
```

```
`{  
   "version":2,
   "timestamp":1629394579,
   "ttl":15,
   "authorized_uuid":"user1",
   "resources":{ … }
`
```
Error implies damaged token.

```
`  
`
```

---

## setToken()

```js
pubnub.setToken(token: string);
```
No return value.

```
`  
`
```

---

## Deprecated: Spaces & Users

Replaced by Channels/UUIDs; will be removed in a future release.

```js
pubnub.grantToken({
  ttl: number,                 // 1–43 200 min
  authorizedUserId: string,
  resources: {
    spaces: { "<space>": { read write get manage update join delete } },
    users:  { "<user>":  { get update delete } }
  },
  patterns:{ … },
  meta:any
});
```

### Examples
*Single-call multiple permissions*
```
`try {  
    const token = await pubnub.grantToken({  
        ttl: 15,  
        authorizedUserId: "my-authorized-userId",  
        resources: {  
            spaces: {  
                "space-a": { read: true },  
                "space-b": { read: true, write: true },  
                "space-c": { read: true,  
`
```
*Regex*
```
`try {  
    const token = await pubnub.grantToken({  
        ttl: 15,  
        authorizedUserId: "my-authorized-userId",  
        patterns: {  
            spaces: { "^space-[A-Za-z0-9]$": { read: true } }  
        }  
    });  
} catch (status) { console.log(status); }  
`
```

Return and error semantics identical to main `grantToken`.

---

_Last updated: Jul 15 2025_