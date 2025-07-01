# Access Manager v3 – JavaScript SDK (JavaScript)

This section summarizes the Access-Manager-specific APIs while keeping every original code block, method signature, parameter description, limits, and examples.

---

## grantToken

Server-side only (requires `secretKey`) and the *Access Manager* add-on.

### Method

```
pubnub.grantToken({  
    ttl: number,  
    authorized_uuid: string,  
    resources: any,  
    patterns: any,  
    meta: any  
})  
```

### Parameters

* **ttl** (`number`, 1–43 200 min, required) – token lifetime.  
* **authorized_uuid** (`string`) – single client allowed to use this token.  
* **resources** (`any`) – explicit permissions.  
  * `resources.uuids`, `resources.channels`, `resources.groups`  
* **patterns** (`any`) – RegEx permissions.  
  * `patterns.uuids`, `patterns.channels`, `patterns.groups`  
* **meta** (`any`) – scalar metadata.

Required: at least one permission in either `resources` or `patterns`.

### Permissions matrix

| Resource | Allowed flags |
|----------|---------------|
| channel  | `read`, `write`, `get`, `manage`, `update`, `join`, `delete` |
| group    | `read`, `manage` |
| uuids    | `get`, `update`, `delete` |

### Examples

##### Basic usage

```
  
```

##### Grant an authorized client different levels of access to various resources in a single call

```
  
```

##### Grant an authorized client read access to multiple channels using RegEx

```
  
```

##### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
  
```

### Returns

```
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
```

### Error responses

`400 Bad Request`, `403 Forbidden`, other HTTP errors with JSON body.

---

## revokeToken

Requires *Access Manager* add-on and *Revoke v3 Token* checkbox.

### Method

```
pubnub.revokeToken(  
    token: string  
);  
```

* **token** (`string`, required) – existing token to disable.

### Basic usage

```
  
```

Success: `200 OK`.  
Possible errors: `400`, `403`, `503`.

---

## parseToken

### Method

```
pubnub.parseToken(  
    token: string  
)  
```

* **token** (`string`, required) – token to decode.

### Basic usage

```
  
```

### Returns

```
{  
   "version":2,  
   "timestamp":1629394579,  
   "ttl":15,  
   "authorized_uuid": "user1",  
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
```
show all 76 lines

Error while parsing indicates a damaged token.

---

## setToken

### Method

```
pubnub.setToken(  
    token: string  
)  
```

* **token** (`string`, required).

### Basic usage

```
  
```

No return value.

---

## Deprecated: grantToken – Spaces & Users

Use the modern `grantToken()` instead; identical semantics but with `spaces` & `users`.

### Method

```
pubnub.grantToken({  
    ttl: number,  
    authorizedUserId: string,  
    resources: any,  
    patterns: any,  
    meta: any  
})  
```

Parameters mirror the current API but use `spaces`/`users`.

### Basic usage

```
try {  
    const token = await pubnub.grantToken({  
        ttl: 15,  
        authorizedUserId: "my-authorized-userId",  
        resources: {  
            spaces: {  
                "my-space": {  
                    read: true,  
                },  
            },  
        },  
    });  
} catch (status) {  
    console.log(status);  
}  
```

### Returns

```
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
```

### Additional examples (unchanged)

##### Grant an authorized client different levels of access to various resources in a single call

```
try {  
    const token = await pubnub.grantToken({  
        ttl: 15,  
        authorizedUserId: "my-authorized-userId",  
        resources: {  
            spaces: {  
                "space-a": {  
                    read: true,  
                },  
                "space-b": {  
                    read: true,  
                    write: true,  
                },  
                "space-c": {  
                    read: true,  
```
show all 36 lines

##### Grant an authorized client read access to multiple channels using RegEx

```
try {  
    const token = await pubnub.grantToken({  
        ttl: 15,  
        authorizedUserId: "my-authorized-userId",  
        patterns: {  
            spaces: {  
                "^space-[A-Za-z0-9]$": {  
                    read: true,  
                },  
            },  
        },  
    });  
} catch (status) {  
    console.log(status);  
}  
```

##### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call

```
try {  
    const token = await pubnub.grantToken({  
        ttl: 15,  
        authorizedUserId: "my-authorized-userId",  
        resources: {  
            spaces: {  
                "space-a": {  
                    read: true,  
                },  
                "space-b": {  
                    read: true,  
                    write: true,  
                },  
                "space-c": {  
                    read: true,  
```
show all 43 lines

---

Last updated: **Jun 30 2025**