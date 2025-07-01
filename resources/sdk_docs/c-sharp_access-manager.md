On this page
# Access Manager v3 API for C# SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to one client with a given `userId`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

##### Request execution

We recommend using `try` and `catch` statements when working with the C# SDK.

If there's an issue with the provided API parameter values, like missing a required parameter, the SDK throws an exception. However, if there is a server-side API execution issue or a network problem, the error details are contained within the `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `GrantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`TTL`), `AuthorizedUuid`, and a set of permissions giving access to one or more resources:

- `Channels`

- `ChannelGroups`

- `Uuids` (other users' object metadata, such as their names or avatars)

Only this `AuthorizedUuid` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `TTL` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`Channels``read`, `write`, `get`, `manage`, `update`, `join`, `delete``ChannelGroups``read`, `manage``Uuids``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, define RegEx permissions for a given resource type in the grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized UUID[​](#authorized-uuid)

Setting an `AuthorizedUuid` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `AuthorizedUuid` isn't specified during the grant request, the token can be used by any client with any UUID. It's recommended to restrict tokens to a single `AuthorizedUuid` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

```
`pubnub.GrantToken()  
      .TTL(int)  
      .Meta(Dictionarystring, object>)  
      .AuthorizedUuid(string)  
      .Resources(PNTokenResources)  
      .Patterns(PNTokenPatterns)  
      .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`TTL` *Type: `int`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`AuthorizedUuid`Type: `string`Default:  
n/aSingle `Uuid` which is authorized to use the token to make API requests to PubNub.`Resources`Type: `PNTokenResources`Default:  
n/aObject containing channel, channel group, and UUID metadata permissions.`Patterns`Type: `PNTokenPatterns`Default:  
n/aObject containing permissions to apply to all channel, channel group, and UUID metadata matching the RegEx pattern.`Meta`Type: Dictionary`<string, object>`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects aren't supported.`Execute`Type: `PNCallback`Default:  
n/a`PNCallback` of type `PNAccessManagerTokenResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `PNResult<PNAccessManagerTokenResult>`.

`PNTokenResources` contains the following properties:

*  requiredParameterDescription`Channels`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing channel permissions.`ChannelGroups`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing channel group permissions.`Uuids`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing UUID metadata permissions.

`PNTokenPatterns` contains the following properties:

*  requiredParameterDescription`Channels`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing permissions to apply to all channels matching the RegEx pattern.`ChannelGroups`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing permissions to apply to all channel groups matching the RegEx pattern.`Uuids`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing permissions to apply to all UUID metadata matching the RegEx pattern.

`PNTokenAuthValues` contains the following properties:

Property NameTypeDescription`Read``bool`Read permission. Applies to Subscribe, History, and Presence.`Write``bool`Write permission. Applies to Publish.`Manage``bool`Manage permission. Applies to Channel Groups and App Context.`Delete``bool`Delete permission. Applies to History and App Context.`Get``bool`Get permission. Applies to App Context.`Update``bool`Update permission. Applies to App Context.`Join``bool`Join permission. Applies to App Context.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one UUID, channel, or group, either as a resource list or as a pattern (RegEx).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

The `GrantToken()` operation returns `PNResult<PNAccessManagerTokenResult>` which contains the following properties:

PropertyDescription`Result`Type: `PNAccessManagerTokenResult`Returns a `PNAccessManagerTokenResult` object.`Status`Type: `PNStatus`Returns a `PNStatus` object.

`PNAccessManagerTokenResult` contains the following properties:

*  requiredParameterDescription`Token` *Type: `String`Current token with embedded permissions.

```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
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

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions.

## Revoke Token[​](#revoke-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Enable token revoke

To revoke tokens, you must first enable this feature on the [Admin Portal](https://admin.pubnub.com/). To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `RevokeToken()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `GrantToken()` method.

Use this method for tokens with `TTL` less than or equal to 30 days. If you need to revoke a token with a longer `TTL`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-1)

```
`pubnub.RevokeToken()  
        .Token(string)  
        .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.`Execute`Type: `PNCallback`Default:  
n/a`PNCallback` of type `PNAccessManagerRevokeTokenResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `PNResult<PNAccessManagerRevokeTokenResult>`.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

The `RevokeToken()` operation returns `PNResult<PNAccessManagerRevokeTokenResult>` which contains the following properties:

PropertyDescription`Result`Type: `PNAccessManagerRevokeTokenResult`Returns an empty `PNAccessManagerRevokeTokenResult` object when the token revocation request is successful.`Status`Type: `PNStatus`Returns a `PNStatus` object for operations ending in success or failure.

### Error Responses[​](#error-responses-1)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `ParseToken()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `TTL` details.

### Method(s)[​](#methods-2)

```
`ParseToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Current token with embedded permissions.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

```
`  
`
```

### Error Responses[​](#error-responses-2)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `SetAuthToken()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-3)

```
`SetAuthToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Current token with embedded permissions.

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

The `GrantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`TTL`), `AuthorizedUserId`, and a set of permissions giving access to one or more resources:

- `Spaces`

- `Users` (other users' metadata, such as their names or avatars)

Only this `AuthorizedUserId` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `TTL` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

##### Permissions - Spaces & Users (deprecated)[​](#permissions---spaces--users-deprecated)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`Spaces``read`, `write`, `get`, `manage`, `update`, `join`, `delete``Users``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

##### TTL - Spaces & Users (deprecated)[​](#ttl---spaces--users-deprecated)

The `TTL` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

##### RegEx - Spaces & Users (deprecated)[​](#regex---spaces--users-deprecated)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions as `Patterns` before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

##### Authorized User ID - Spaces & Users (deprecated)[​](#authorized-user-id---spaces--users-deprecated)

Setting an `AuthorizedUserId` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `AuthorizedUserId` isn't specified during the grant request, the token can be used by any client with any `UserId`. It's recommended to restrict tokens to a single `AuthorizedUserId` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

#### Method(s) - Spaces & Users (deprecated)[​](#methods---spaces--users-deprecated)

```
`pubnub.GrantToken()  
      .TTL(int)  
      .Meta(Dictionarystring, object>)  
      .AuthorizedUserId(string)  
      .Resources(PNTokenResources)  
      .Patterns(PNTokenPatterns)  
      .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`TTL` *Type: `int`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`AuthorizedUserId`Type: `string`Default:  
n/aSingle `Uuid` which is authorized to use the token to make API requests to PubNub.`Resources`Type: `PNTokenResources`Default:  
n/aObject containing channel, channel group, and UUID metadata permissions.`Patterns`Type: `PNTokenPatterns`Default:  
n/aObject containing permissions to apply to all channel, channel group, and UUID metadata matching the RegEx pattern.`Meta`Type: Dictionary`<string, object>`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects aren't supported.`Execute`Type: `PNCallback`Default:  
n/a`PNCallback` of type `PNAccessManagerTokenResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `PNResult<PNAccessManagerTokenResult>`.

`PNTokenResources` contains the following properties:

*  requiredParameterDescription`Spaces`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing Space permissions.`Users`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing User metadata permissions.

`PNTokenPatterns` contains the following properties:

*  requiredParameterDescription`Spaces`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing permissions to apply to all Spaces matching the RegEx pattern.`Users`Type: `Dictionary<string, PNTokenAuthValues>`Default:  
n/aDictionary object containing permissions to apply to all User metadata matching the RegEx pattern.

`PNTokenAuthValues` contains the following properties:

Property NameTypeDescription`Read``bool`Read permission.`Write``bool`Write permission.`Manage``bool`Manage permission.`Delete``bool`Delete permission.`Get``bool`Get permission.`Update``bool`Update permission.`Join``bool`Join permission.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one User or Space either as a resource list or as a pattern (RegEx).

#### Basic Usage - Spaces & Users (deprecated)[​](#basic-usage---spaces--users-deprecated)

```
`  
`
```

#### Returns - Spaces & Users (deprecated)[​](#returns---spaces--users-deprecated)

The `GrantToken()` operation returns `PNResult<PNAccessManagerTokenResult>` which contains the following properties:

PropertyDescription`Result`Type: `PNAccessManagerTokenResult`Returns a `PNAccessManagerTokenResult` object.`Status`Type: `PNStatus`Returns a `PNStatus` object.

`PNAccessManagerTokenResult` contains the following properties:

*  requiredParameterDescription`Token` *Type: `String`Current token with embedded permissions.

```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

#### Other Examples - Spaces & Users (deprecated)[​](#other-examples---spaces--users-deprecated)

##### Grant an authorized client different levels of access to various resources in a single call - Spaces & Users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call---spaces--users-deprecated)

The code below grants `my-authorized-userId`:

- Read access to `space-a`, and get to `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

```
`  
`
```

##### Grant an authorized client read access to multiple spaces using RegEx - Spaces & Users (deprecated)[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex---spaces--users-deprecated)

The code below grants `my-authorized-userId` read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`  
`
```

##### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call - Spaces & Users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call---spaces--users-deprecated)

The code below grants the `my-authorized-userId`:

- Read access to `space-a` and `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

- Read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`  
`
```

#### Error responses - Spaces & Users (deprecated)[​](#error-responses---spaces--users-deprecated)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions.
Last updated on **Jun 30, 2025**