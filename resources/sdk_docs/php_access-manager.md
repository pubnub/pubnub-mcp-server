On this page
# Access Manager v3 API for PHP SDK

Access Manager v3 allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to only one client with a given `Uuid`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

For more information about Access Manager v3, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control).

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `grantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorizedUuid`, and a set of permissions giving access to one or more resources:

- `Channels`

- `ChannelGroups`

- `Uuids` (other users' object metadata, such as their names or avatars)

Only this `authorizedUuid` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`Channels``read`, `write`, `get`, `manage`, `update`, `join`, `delete``ChannelGroups``read`, `manage``Uuids``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions as `patterns` before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized UUID[​](#authorized-uuid)

Setting an `authorizedUuid` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorizedUuid` isn't specified during the grant request, the token can be used by any client with any `Uuid`. It's recommended to restrict tokens to a single `authorizedUuid` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

```
`$pubnub->grantToken()  
    ->ttl($ttl)  
    ->authorizedUuid($uuid)  
    ->addChannelResources(Array[String => String])  
    ->addChannelGroupResources(Array[String => String])  
    ->addUuidResources(Array[String => String])  
    ->addChannelPatterns(Array[String => String])  
    ->addChannelGroupPatterns(Array[String => String])  
    ->addUuidPatterns(Array[String => String])  
    ->meta(Array[String => String])  
    ->sync();  
  
`
```

*  requiredParameterDescription`ttl` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`authorizedUuid`Type: `String`Default:  
n/aSingle UUID which is authorized to use the token to make API requests to PubNub.`addChannelResources`Type: `Array`Default:  
n/aArray containing explicit channels resource permissions.`addChannelGroupResources`Type: `Array`Default:  
n/aArray containing explicit channel groups resource permissions.`addUuidResources`Type: `Array`Default:  
n/aArray containing explicit UUID resource permissions.`addChannelPatterns`Type: `Array`Default:  
n/aArray containing channels permissions expressed as a RegEx pattern.`addChannelGroupPatterns`Type: `Array`Default:  
n/aArray containing channel groups permissions expressed as a RegEx pattern.`addUuidPatterns`Type: `Array`Default:  
n/aArray containing UUID permissions expressed as a RegEx pattern.`meta`Type: `Array`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects aren't supported.

An array for resource/permission should contain the resource name as the key and an array of rights as a value. You don't need to specify the `false` permissions as that's the default value for all rights.

```
`[  
    'channel-1' => ['read' => true, 'write' => true]  
    'channel-2' => ['read' => true, 'write' => false]  
    'channel-3' => ['read' => true]  
]  
`
```

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one `Uuid`, `Channel`, or `ChannelGroup`, either as a resource list or as a pattern (RegEx).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
  
// Create configuration  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setSecretKey("demo"); // Required for Access Manager operations  
$pnConfig->setUserId("php-token-granter");  
`
```
show all 51 lines

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
`$pubnub->grantToken()  
    ->ttl(15)  
    ->authorizedUuid('my-authorized-uuid')  
    ->addChannelResources([  
        'channel-a' => ['read' => true],  
        'channel-b' => ['read' => true, 'write' => true],  
        'channel-c' => ['read' => true, 'write' => true],  
        'channel-d' => ['read' => true, 'write' => true],  
    ])  
    ->addChannelGroupResources([  
        'channel-group-b' => ['read' => true],  
    ])  
    ->addUuidResources([  
        'uuid-c' => ['get' => true],  
        'uuid-d' => ['get' => true, 'update' => true],  
`
```
show all 17 lines

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

The code below grants `my-authorized-uuid` read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`$pubnub->grantToken()  
    ->ttl(15)  
    ->authorizedUuid('my-authorized-uuid')  
    ->addChannelPatterns([  
        '^channel-[A-Za-z0-9]$' => ['read' => true],  
    ])  
    ->sync();  
`
```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

The code below grants the `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

- Read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`$pubnub->grantToken()  
    ->ttl(15)  
    ->authorizedUuid('my-authorized-uuid')  
    ->addChannelResources([  
        'channel-a' => ['read' => true],  
        'channel-b' => ['read' => true, 'write' => true],  
        'channel-c' => ['read' => true, 'write' => true],  
        'channel-d' => ['read' => true, 'write' => true],  
    ])  
    ->addChannelGroupResources([  
        'channel-group-b' => ['read' => true],  
    ])  
    ->addUuidResources([  
        'uuid-c' => ['get' => true],  
        'uuid-d' => ['get' => true, 'update' => true],  
`
```
show all 19 lines

### Error responses[​](#error-responses)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error in `PubNubServerException`.

MethodDescription`getStatusCode()`Type: `Int`Status code `400` that is returned by the server by default.`getBody()`Type: `Object`Entire body of the error returned by the server. The body contains such fields as `message`, `source`, `details`, `service`, and `status`.`getServerErrorMessage()`Type: `String`Descriptive error message, such as `Invalid ttl`.`getServerErrorSource()`Type: `String`Source of the error.`getServerErrorDetails()`Type: `Object`Details of the first encountered problem. This object contains these public properties: `message`, `location`, and `locationType`.

## Revoke Token[​](#revoke-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Enable token revoke

To revoke tokens, you must first enable this feature on the [Admin Portal](https://admin.pubnub.com/). To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `revokeToken()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `grantToken()` method.

Use this method for tokens with `ttl` less than or equal to 30 days. If you need to revoke a token with a longer `ttl`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-1)

```
`$pubnub->revokeToken($token)  
    ->sync();  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-1)

```
`$pubnub->revokeToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenV")  
    ->sync();  
`
```

### Returns[​](#returns-1)

When the token revocation request is successful, this method returns a `PNRequestResult`. When the request fails, it returns `PubNubServerException`.

#### PNRequestResult[​](#pnrequestresult)

MethodDescription`getStatus()`Type: `Int`Server response status `200`.`getService()`Type: `String`Service to which the request was made. In this case, `Access Manager`.`isError()`Type: `Boolean`Whether the response is an error message.`getError()`Type: `Array`Error returned by the server.`getMessage()`Type: `String`Message returned by the server on successful request. In this case, `Success`.

### Error Responses[​](#error-responses-1)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `parseToken()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `ttl` details.

### Method(s)[​](#methods-2)

```
`parseToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-2)

```
`$pubnub->parseToken( "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");  
`
```

### Returns[​](#returns-2)

```
`$parsedToken = $pubnub->parseToken( "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
->toArray();  
  
array(7) {  
  ["version"]=>  
  int(2)  
  ["timestamp"]=>  
  int(1634592012)  
  ["ttl"]=>  
  int(15)  
  ["resources"]=>  
  array(1) {  
    ["chan"]=>  
    array(1) {  
      ["my-channel"]=>  
`
```
show all 43 lines
MethodParameterReturn typeDescription`getVersion()`none`Int`Token version. The current version is `2`.`getTimestamp()`none`Int`Timestamp of the issued token.`getTtl()`none`String`Total number of minutes for which the token is valid.`getResources()`none`Array`List of all resources included in the token in the following format: `type => name => permissions``getPatterns()`none`Array`List of all patterns included in the token in the following format: `type => name => permissions``getChannelResource($channel)``String``Object`Instance of the `Permissions` object for a specific channel. It returns `null` if no permissions are defined.`getChannelGroupResource($channelGroup)``String``Object`Instance of the `Permissions` object for a specific channel group. It returns `null` if no permissions are defined.`getUuidResource($uuid)``String``Object`Instance of the `Permissions` object for a specific UUID. It returns `null` if no permissions are defined.`getChannelPattern($channel)``String``Object`Instance of the `Permissions` object for a specific channel. It returns `null` if no permissions are defined.`getChannelGroupPattern($channelGroup)``String``Object`Instance of the `Permissions` object for a specific channel group. It returns `null` if no permissions are defined.`getUuidPattern($uuid)``String``Object`Instance of the `Permissions` object for a specific UUID. It returns `null` if no permissions are defined.`getMetadata()`none`Array`Array of metadata set in the grant token request.`getSignature()`none`String`Signature generated by the server.`getUuid()`none`String`Authorized UUID`toArray()`none`Array`Entire token in an array format

#### Permissions object[​](#permissions-object)

Calling `getChannelResource()` returns an instance of the `Permissions` object. This object has a series of methods to access specific rights.

```
`$pubnub->parseToken( "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
->getChannelResource('my-channel')  
->hasRead();  
`
```

MethodReturn typeDescription`hasRead()``boolean``read` rights that apply to Subscribe, History, and Presence.`hasWrite()``boolean``write` rights that apply to Publish.`hasManage()``boolean``manage` rights that apply to channel groups and App Context.`hasDelete()``boolean``delete` rights that apply to History and App Context.`hasGet()``boolean``get` rights that apply to App Context (formerly Objects v2).`hasUpdate()``boolean``update` rights that apply to App Context (formerly Objects v2).`hasJoin()``boolean``join` rights that apply to App Context (formerly Objects v2).

For example, calling `hasRead()` returns `true`.

### Error Responses[​](#error-responses-2)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `setToken()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-3)

```
`setToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-3)

```
`$pubnub->setToken(  
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
);  
`
```

### Returns[​](#returns-3)

This method doesn't return any response value.
Last updated on **Apr 29, 2025**