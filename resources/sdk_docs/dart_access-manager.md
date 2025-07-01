On this page
# Access Manager v3 API for Dart SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to one client with a given `userId`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `grantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorizedUUID`, and a set of permissions giving access to one or more resources:

- `channel`

- `channelGroup`

- `uuid` (other users' object metadata, such as their names or avatars)

Only this `authorizedUUID` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`channel``read`, `write`, `get`, `manage`, `update`, `join`, `delete``channelGroup``read`, `manage``uuid``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions as `patterns` before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized UUID[​](#authorized-uuid)

Setting an `authorizedUUID` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorizedUUID` isn't specified during the grant request, the token can be used by any client with any `uuid`. It's recommended to restrict tokens to a single `authorizedUUID` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

```
`pubnub.grantToken(TokenRequest tokenRequest)  
`
```

To create `TokenRequest`:

```
`pubnub.requestToken({  
  @required int? ttl,  
  MapString, dynamic>? meta,  
  String? authorizedUUID,  
  String? using,  
  Keyset? keyset  
});  
`
```

The `TokenRequest` object has the following parameters:

*  requiredParameterDescription`ttl` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`meta`Type: `Map<String, dynamic>`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.`authorizedUUID`Type: StringDefault:  
n/aSingle `uuid` which is authorized to use the token to make API requests to PubNub.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one `uuid`, `channel`, or `channelGroup`, either as a resource list or as a pattern (RegEx).

Use `add()` on `TokenRequest` to add resource or resource pattern permissions:

```
`add(ResourceType type,  
      {String? name,  
      String? pattern,  
      bool? create,  
      bool? delete,  
      bool? manage,  
      bool? read,  
      bool? write,  
      bool? get,  
      bool? update,  
      bool? join})  
`
```

*  requiredParameterDescription`type`Type: `ResourceType`Default:  
n/aSpecify a resource type. It can be `uuid`, `channel`, or `channelGroup` (other value types are deprecated in App Context (formerly Objects v2) API).`name`Type: `String`Default:  
n/aSpecify a resource name, like `uuid-a`. Provide either `name` or `pattern` to specify permissions.`pattern`Type: `String`Default:  
n/aSpecify a resource pattern, like `channel-[A-Za-z0-9]`. Provide either `name` or `pattern` to specify permissions.`write`Type: `Boolean`Default:  
`false`Write permission`read`Type: `Boolean`Default:  
`false`Read permission`create`Type: `Boolean`Default:  
`false`Create permission`manage`Type: `Boolean`Default:  
`false`Manage permission`delete`Type: `Boolean`Default:  
`false`Delete permission`get`Type: `Boolean`Default:  
`false`Get permission`update`Type: `Boolean`Default:  
`false`Update permission`join`Type: `Boolean`Default:  
`false`Join permission

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',   
      publishKey: 'demo',   
      secretKey: 'sec_key'  
      userId: UserId('myUniqueUserId')  
    ),  
  );  
  
  // Prepare the request object for granting a token  
  var request = pubnub.requestToken(  
`
```
show all 30 lines

### Returns[​](#returns)

```
`{  
    "status": 200,  
    "data": {  
        "message": "Success",  
        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
    },  
    "service" : "Access Manager"  
}  
`
```

### Other Examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

The code below grants `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
..add(ResourceType.channel, name: 'channel-a', read: true)  
..add(ResourceType.channelGroup, name: 'channel-group-b', read: true)  
..add(ResourceType.uuid, name: 'uuid-c', get: true)  
..add(ResourceType.channel, name: 'channel-b', read: true, write: true)  
..add(ResourceType.channel, name: 'channel-c', read: true, write: true)  
..add(ResourceType.channel, name: 'channel-d', read: true, write: true)  
..add(ResourceType.uuid, name: 'uuid-d', get: true, update: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

The code below grants `my-authorized-uuid` read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

The code below grants the `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

- Read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUUID: 'my-authorized-uuid')  
..add(ResourceType.channel, name: 'channel-a', read: true)  
..add(ResourceType.channelGroup, name: 'channel-group-b', read: true)  
..add(ResourceType.uuid, name: 'uuid-c', get: true)  
..add(ResourceType.channel, name: 'channel-b', read: true, write: true)  
..add(ResourceType.channel, name: 'channel-c', read: true, write: true)  
..add(ResourceType.channel, name: 'channel-d', read: true, write: true)  
..add(ResourceType.uuid, name: 'uuid-d', get: true, update: true)  
..add(ResourceType.channel, pattern: 'channel-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

### Error responses[​](#error-responses)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error under the `PubNubException` object.

## Grant Token - Spaces & Users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `grantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorizedUserId`, and a set of permissions giving access to one or more resources:

- `spaces`

- `users` (other users' metadata, such as their names or avatars)

Only this `authorizedUserId` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions-1)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`space``read`, `write`, `get`, `manage`, `update`, `join`, `delete``user``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl-1)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex-1)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions as `patterns` before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized User ID[​](#authorized-user-id)

Setting an `authorizedUserId` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorizedUserId` isn't specified during the grant request, the token can be used by any client with any `userId`. It's recommended to restrict tokens to a single `authorizedUserId` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods-1)

```
`pubnub.grantToken(TokenRequest tokenRequest)  
`
```

To create `TokenRequest`:

```
`pubnub.requestToken({  
  @required int? ttl,  
  MapString, dynamic>? meta,  
  String? authorizedUserId,  
  String? using,  
  Keyset? keyset  
});  
`
```

The `TokenRequest` object has the following parameters:

*  requiredParameterDescription`ttl` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`meta`Type: `Map<String, dynamic>`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.`authorizedUserId`Type: StringDefault:  
n/aSingle `userId` which is authorized to use the token to make API requests to PubNub.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one User or Space, either as a resource list or as a pattern (RegEx).

Use `add()` on `TokenRequest` to add resource or resource pattern permissions:

```
`add(ResourceType type,  
      {String? name,  
      String? pattern,  
      bool? create,  
      bool? delete,  
      bool? manage,  
      bool? read,  
      bool? write,  
      bool? get,  
      bool? update,  
      bool? join})  
`
```

*  requiredParameterDescription`type`Type: `ResourceType`Default:  
n/aSpecify a resource type. It can be `user` or `space`.`name`Type: `String`Default:  
n/aSpecify a resource name, like `userId-a`. Provide either `name` or `pattern` to specify permissions.`pattern`Type: `String`Default:  
n/aSpecify a resource pattern, like `space-[A-Za-z0-9]`. Provide either `name` or `pattern` to specify permissions.`write`Type: `Boolean`Default:  
`false`Write permission`read`Type: `Boolean`Default:  
`false`Read permission`create`Type: `Boolean`Default:  
`false`Create permission`manage`Type: `Boolean`Default:  
`false`Manage permission`delete`Type: `Boolean`Default:  
`false`Delete permission`get`Type: `Boolean`Default:  
`false`Get permission`update`Type: `Boolean`Default:  
`false`Update permission`join`Type: `Boolean`Default:  
`false`Join permission

### Basic Usage[​](#basic-usage-1)

```
`// Prepare the request object  
var request = pubnub.requestToken(ttl: 15, authorizedUserId: 'my-authorized-userId');  
request.add(ResourceType.space, name: 'my-space', read: true);  
  
// Send the token request  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

### Returns[​](#returns-1)

```
`{  
    "status": 200,  
    "data": {  
        "message": "Success",  
        "token": "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
    },  
    "service" : "Access Manager"  
}  
`
```

### Other Examples[​](#other-examples-1)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call-1)

The code below grants `my-authorized-userId`:

- Read access to `space-a` and get to `space-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUserId: 'my-authorized-userId')  
..add(ResourceType.space, name: 'space-a', read: true)  
..add(ResourceType.user, name: 'userId-c', get: true)  
..add(ResourceType.space, name: 'space-b', read: true, write: true)  
..add(ResourceType.space, name: 'space-c', read: true, write: true)  
..add(ResourceType.space, name: 'space-d', read: true, write: true)  
..add(ResourceType.user, name: 'userId-d', get: true, update: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)

The code below grants `my-authorized-userId` read access to all spaces that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUserId: 'my-authorized-userId')  
..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)

The code below grants the `my-authorized-userId`:

- Read access to `space-a` and get to `user-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

- Read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`var request = pubnub.requestToken(  
    ttl: 15, authorizedUserId: 'my-authorized-userId')  
..add(ResourceType.space, name: 'space-a', read: true)  
..add(ResourceType.user, name: 'userId-c', get: true)  
..add(ResourceType.space, name: 'space-b', read: true, write: true)  
..add(ResourceType.space, name: 'space-c', read: true, write: true)  
..add(ResourceType.space, name: 'space-d', read: true, write: true)  
..add(ResourceType.user, name: 'userId-d', get: true, update: true)  
..add(ResourceType.space, pattern: 'space-[A-Za-z0-9]', read: true);  
  
var token = await pubnub.grantToken(request);  
print('grant token = $token');  
`
```

### Error responses[​](#error-responses-1)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error under the `PubNubException` object.

## Revoke Token[​](#revoke-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Enable token revoke

To revoke tokens, you must first enable this feature on the [Admin Portal](https://admin.pubnub.com/). To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `revokeToken()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `grantToken()` method.

Use this method for tokens with `ttl` less than or equal to 30 days. If you need to revoke a token with a longer `ttl`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-2)

```
`var result = await pubnub.revokeToken("token");  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-2)

```
`await pubnub.revokeToken("token");  
`
```

### Returns[​](#returns-2)

When the token revocation request is successful, this method returns an empty `PamRevokeTokenResult`.

### Error Responses[​](#error-responses-2)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `parseToken()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `ttl` details.

### Method(s)[​](#methods-3)

```
`parseToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-3)

```
`pubnub.parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-3)

```
`{  
   "version":2,  
   "timetoken":1629394579,  
   "ttl":15,  
   "authorizedUUID": "user1",  
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
show all 78 lines

### Error Responses[​](#error-responses-3)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `setToken()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-4)

```
`setToken(String token, {String? using, Keyset? keyset})  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.

### Basic Usage[​](#basic-usage-4)

```
`pubnub.setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-4)

This method doesn't return any response value.
Last updated on **Apr 29, 2025**