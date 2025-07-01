On this page
# Access Manager v3 API for JavaScript SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to one client with a given `userId`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `grantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorized_uuid`, and a set of permissions giving access to one or more resources:

- `channels`

- `groups` (channel groups)

- `uuids` (other users' object metadata, such as their names or avatars)

Only this `authorized_uuid` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`channel``read`, `write`, `get`, `manage`, `update`, `join`, `delete``group``read`, `manage``uuids``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions under the `patterns` key before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized UUID[​](#authorized-uuid)

Setting an `authorized_uuid` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorized_uuid` isn't specified during the grant request, the token can be used by any client with any `uuid`. It's recommended to restrict tokens to a single `authorized_uuid` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

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

*  requiredParameterDescription`ttl` *Type: `number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`authorized_uuid`Type: `string`Default:  
n/aSingle `uuid` which is authorized to use the token to make API requests to PubNub.`resources`Type: `any`Default:  
n/aObject containing resource permissions.`resources.uuids`Type: `any`Default:  
n/aObject containing `uuid` metadata permissions, for example: `{"uuid-1": {get: true, update: true, delete: true},"uuid-2": {...}}`.`resources.channels`Type: `any`Default:  
n/aObject containing channel permissions, for example: `{"channel-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true},"channel-id-2": {...}}`.`resources.groups`Type: `any`Default:  
n/aObject containing channel group permissions, for example: `{"group-id-1": {read: true, manage: true},"group-id-2": {...}}`.`patterns`Type: `any`Default:  
n/aObject containing permissions to multiple resources specified by a RegEx pattern.`patterns.uuids`Type: `any`Default:  
n/aObject containing `uuid` metadata permissions to apply to all `uuid`s matching the RegEx pattern, for example: `{"uuid-pattern-1": {get: true, update: true, delete: true},"uuid-pattern-2": {...}}`.`patterns.channels`Type: `any`Default:  
n/aObject containing channel permissions to apply to all `channel`s matching the RegEx pattern, for example: `{"channel-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "channel-pattern-2": {...}}`.`patterns.groups`Type: `any`Default:  
n/aObject containing channel group permissions to apply to all channel groups matching the pattern, for example: `{"group-pattern-1": {read: true, manage: true}, "group-pattern-2": {...}}`.`meta`Type: `any`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects aren't supported.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one `uuid`, `channel`, or `group`, either as a resource sequence (`resources`) or as a regular expression (`patterns`).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

```
`  
`
```

### Returns[​](#returns)

```
`"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

### Other Examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

The code below grants `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

```
`  
`
```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

The code below grants `my-authorized-uuid` read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`  
`
```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

The code below grants the `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

- Read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`  
`
```

### Error responses[​](#error-responses)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error in the JSON format.

## Revoke Token[​](#revoke-token)

##### Enable token revoke

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Also, to revoke tokens, you must first enable this feature. To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `revokeToken()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `grantToken()` method.

Use this method for tokens with `ttl` less than or equal to 30 days. If you need to revoke a token with a longer `ttl`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-1)

```
`pubnub.revokeToken(  
    token: string  
);  
`
```

*  requiredParameterDescription`token` *Type: `string`Default:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

When the token revocation request is successful, this method returns a 200 OK.

### Error Responses[​](#error-responses-1)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `parseToken()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `ttl` details.

### Method(s)[​](#methods-2)

```
`pubnub.parseToken(  
    token: string  
)  
`
```

*  requiredParameterDescription`token` *Type: `string`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

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

### Error Responses[​](#error-responses-2)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `setToken()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-3)

```
`pubnub.setToken(  
    token: string  
)  
`
```

*  requiredParameterDescription`token` *Type: `string`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Returns[​](#returns-3)

This method doesn't return any response value.

## Grant Token - Spaces & Users (deprecated)[​](#grant-token---spaces--users-deprecated)

##### Deprecated

This method is deprecated and will be removed in a future version. Please use the `grantToken()` method instead.

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Server only operation

Granting a token requires the SDK to be initialized with a `secretKey` and should only be used on the server. You should not use a `secretKey` in client SDKs such as React Native and Web. For more details on server usage, see [Access Manager](/docs/general/security/access-control#server-side-operations).

The `grantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorizedUserId`, and a set of permissions giving access to one or more resources:

- `spaces`

- `users` (other users' metadata, such as their names or avatars)

Only this `authorizedUserId` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

##### Permissions - Spaces & Users (deprecated)[​](#permissions---spaces--users-deprecated)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`space``read`, `write`, `get`, `manage`, `update`, `join`, `delete``user``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

##### TTL - Spaces & Users (deprecated)[​](#ttl---spaces--users-deprecated)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

##### Recommended ttl value

For security reasons, it's recommended to set `ttl` between `10` and `60`, and create a new token before this `ttl` elapses.

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

##### RegEx - Spaces & Users (deprecated)[​](#regex---spaces--users-deprecated)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions as `patterns` before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

##### Authorized User ID - Spaces & Users (deprecated)[​](#authorized-user-id---spaces--users-deprecated)

Setting an `authorizedUserId` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorizedUserId` isn't specified during the grant request, the token can be used by any client with any `userId`. It's recommended to restrict tokens to a single `authorizedUserId` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

#### Method(s) - Spaces & Users (deprecated)[​](#methods---spaces--users-deprecated)

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

*  requiredParameterDescription`ttl` *Type: `number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`authorizedUserId`Type: `string`Default:  
n/aSingle `userId` which is authorized to use the token to make API requests to PubNub.`resources`Type: `any`Default:  
n/aObject containing resource permissions.`resources.users`Type: `any`Default:  
n/aObject containing User permissions, for example: `{"userId-1": {get: true, update: true, delete: true},"userId-2": {...}}`.`resources.spaces`Type: `any`Default:  
n/aObject containing Space permissions, for example: `{"space-id-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true},"space-id-2": {...}}`.`patterns`Type: `any`Default:  
n/aObject containing permissions to multiple resources specified by a RegEx pattern.`patterns.users`Type: `any`Default:  
n/aObject containing User permissions to apply to all Users matching the RegEx pattern, for example: `{"userId-pattern-1": {get: true, update: true, delete: true},"userId-pattern-2": {...}}`.`patterns.spaces`Type: `any`Default:  
n/aObject containing Space permissions to apply to all Spaces matching the RegEx pattern, for example: `{"space-pattern-1": {read: true, write: true, manage: true, delete: true, get: true, update: true, join: true}, "space-pattern-2": {...}}`.`meta`Type: `any`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects aren't supported.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one `userId` or `space`, either as a resource sequence (`resources`) or as a regular expression (`patterns`).

#### Basic Usage - Spaces & Users (deprecated)[​](#basic-usage---spaces--users-deprecated)

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

#### Returns - Spaces & Users (deprecated)[​](#returns---spaces--users-deprecated)

```
`"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
`
```

#### Other Examples - Spaces & Users (deprecated)[​](#other-examples---spaces--users-deprecated)

##### Grant an authorized client different levels of access to various resources in a single call - Spaces & Users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call---spaces--users-deprecated)

The code below grants `my-authorized-userId`:

- Read access to `space-a`, and get to `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

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

##### Grant an authorized client read access to multiple channels using RegEx - Spaces & Users (deprecated)[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex---spaces--users-deprecated)

The code below grants `my-authorized-userId` read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

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

##### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call - Spaces & Users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call---spaces--users-deprecated)

The code below grants the `my-authorized-userId`:

- Read access to `space-a` and `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

- Read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

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

#### Error responses - Spaces & Users (deprecated)[​](#error-responses---spaces--users-deprecated)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error in the JSON format.
Last updated on **Jun 30, 2025**