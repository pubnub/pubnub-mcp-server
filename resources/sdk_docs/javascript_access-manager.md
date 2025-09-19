# Access Manager v3 API for JavaScript SDK

Access Manager lets servers grant time-limited tokens with embedded permissions for PubNub resources:

- Time-bound access (ttl).
- Resource lists or RegEx patterns.
- Multiple resources/permission levels in one request.
- Optional authorized UUID restriction via authorizedUuid to bind the token to a specific userId/UUID.

User ID / UUID
- Some APIs/responses refer to UUID/uuid; this equals the userId set during initialization.

Supported and recommended asynchronous patterns
- Callbacks, Promises, Async/Await supported. Use Async/Await with try...catch to receive error status.

## Grant token

Requires Access Manager add-on
- Enable Access Manager on your keyset in the Admin Portal.

Requires Secret Key authentication
- Perform grants on a server with an SDK instance initialized with a Secret Key.

The grantToken() method creates a token with ttl, authorized_uuid, and permissions for:
- channels
- groups (channel groups)
- uuids (user metadata)

Only authorized_uuid (if set) can use the token. Unauthorized/invalid usage returns 403. Permissions expire after ttl.

Permissions per resource:
- channel: read, write, get, manage, update, join, delete
- group: read, manage
- uuids: get, update, delete

TTL
- Required. Minutes (1–43,200). No default. Max 30 days.

RegEx patterns
- Specify under patterns to apply permissions via regular expressions.

Authorized UUID
- authorized_uuid binds the token to a single client UUID. If omitted, any UUID can use the token.

### Method(s)

```
`pubnub.grantToken({  
    ttl: number,  
    authorized_uuid: string,  
    resources: any,  
    patterns: any,  
    meta: any  
})  
`
```

- ttl (number, required): Total minutes token is valid. Min 1, max 43,200.
- authorized_uuid (string): Single uuid allowed to use the token.
- resources (any): Object of explicit resource permissions.
  - resources.uuids (any): {"uuid-1": {get, update, delete}, ...}
  - resources.channels (any): {"channel-id-1": {read, write, manage, delete, get, update, join}, ...}
  - resources.groups (any): {"group-id-1": {read, manage}, ...}
- patterns (any): Permissions applied to resource name patterns (RegEx).
  - patterns.uuids (any): {"uuid-pattern-1": {get, update, delete}, ...}
  - patterns.channels (any): {"channel-pattern-1": {read, write, manage, delete, get, update, join}, ...}
  - patterns.groups (any): {"group-pattern-1": {read, manage}, ...}
- meta (any): Extra scalar metadata (no arrays/objects).

Required key/value mappings
- Provide at least one permission for a uuid, channel, or group via resources or patterns.

### Sample code

Reference code

```
`  
`
```

```
`  
`
```

### Returns

```
`"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

### Other examples

#### Grant an authorized client different levels of access to various resources in a single call

- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c.
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.

```
`  
`
```

#### Grant an authorized client read access to multiple channels using RegEx

- Grants my-authorized-uuid read access to channels matching channel-[A-Za-z0-9].

```
`  
`
```

#### Grant mixed resource access plus RegEx channel access in a single call

- Grants my-authorized-uuid:
  - Read: channel-a, channel-group-b; Get: uuid-c.
  - Read/Write: channel-b, channel-c, channel-d; Get/Update: uuid-d.
  - Read to channels matching channel-[A-Za-z0-9].

```
`  
`
```

### Error responses

- 400 Bad Request with details for invalid args (e.g., RegEx, timestamp, permissions).

## Revoke token

Enable token revoke
- Enable Revoke v3 Token on the keyset in the Admin Portal. Requires Access Manager.

revokeToken() disables a previously granted token and revokes its permissions.
- Use for tokens with ttl ≤ 30 days. For longer ttl, contact support.

### Method(s)

```
`pubnub.revokeToken(  
    token: string  
);  
`
```

- token (string, required): Existing token to revoke.

### Sample code

```
`  
`
```

### Returns

- 200 OK on success.

### Error Responses

- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

parseToken() decodes a token and returns its embedded permissions and ttl.

### Method(s)

```
`pubnub.parseToken(  
    token: string  
)  
`
```

- token (string, required): Current token with embedded permissions.

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
`
```
show all 76 lines

### Error Responses

- If parsing fails, the token may be damaged. Request a new one.

## Set token

setToken() is used by clients to apply/update the token granted by the server.

### Method(s)

```
`pubnub.setToken(  
    token: string  
)  
`
```

- token (string, required): Current token with embedded permissions.

### Sample code

```
`  
`
```

### Returns

- No return value.

## Grant token - spaces & users (deprecated)

Deprecated
- Use grantToken() instead.

Requires Access Manager add-on
- Enable on your keyset in the Admin Portal.

Server only operation
- Requires secretKey; do not use secretKey in client apps.

Generates a token with ttl, authorizedUserId, and permissions for:
- spaces
- users (user metadata)

Only authorizedUserId (if set) can use the token.

Permissions - spaces & users (deprecated)
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL - spaces & users (deprecated)
- Required. Minutes (1–43,200). Recommended 10–60.

RegEx - spaces & users (deprecated)
- Use patterns to apply permissions via regular expressions.

Authorized user ID - spaces & users (deprecated)
- authorizedUserId binds the token to a single userId. If omitted, any userId can use the token.

### Method(s) - spaces & users (deprecated)

```
`pubnub.grantToken({  
    ttl: number,  
    authorizedUserId: string,  
    resources: any,  
    patterns: any,  
    meta: any  
})  
`
```

- ttl (number, required): 1–43,200 minutes.
- authorizedUserId (string): Single userId allowed to use the token.
- resources.users (any): {"userId-1": {get, update, delete}, ...}
- resources.spaces (any): {"space-id-1": {read, write, manage, delete, get, update, join}, ...}
- patterns.users (any): {"userId-pattern-1": {get, update, delete}, ...}
- patterns.spaces (any): {"space-pattern-1": {read, write, manage, delete, get, update, join}, ...}
- meta (any): Scalar-only metadata.

Required key/value mappings
- Provide at least one permission for a userId or space via resources or patterns.

### Sample code - spaces & users (deprecated)

```
`try {  
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
`
```

### Returns - spaces & users (deprecated)

```
`"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

### Other examples - spaces & users (deprecated)

Grant an authorized client different levels of access in a single call

- Grants my-authorized-userId:
  - Read: space-a; Get: userId-c.
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d.

```
`try {  
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
`
```
show all 36 lines

Grant read access to multiple spaces using RegEx - spaces & users (deprecated)

- Grants my-authorized-userId read access to spaces matching space-[A-Za-z0-9].

```
`try {  
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
`
```

Grant mixed resource access plus RegEx space access in a single call - spaces & users (deprecated)

- Grants my-authorized-userId:
  - Read: space-a and userId-c.
  - Read/Write: space-b, space-c, space-d; Get/Update: userId-d.
  - Read to spaces matching space-[A-Za-z0-9].

```
`try {  
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
`
```
show all 43 lines

### Error responses - spaces & users (deprecated)

- 400 Bad Request with details for invalid args (e.g., RegEx, timestamp, permissions).