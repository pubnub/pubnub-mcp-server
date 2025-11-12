# Access Manager v3 API for C# SDK

Access Manager lets you enforce time-bound, token-based permissions on PubNub resources (via explicit lists or RegEx patterns), including granting different permissions to different resources in a single request. You can restrict a token to a single client using the authorizedUuid parameter.

- Permissions apply to:
  - Channels
  - ChannelGroups
  - Uuids (user metadata)
- Token scope:
  - Time-limited (TTL 1–43,200 minutes)
  - Resource lists or RegEx patterns
  - Optional AuthorizedUuid binding

##### User ID / UUID
User ID may appear as UUID/uuid in APIs and responses, and holds the value of userId you set during initialization.

##### Request execution
Use try/catch with the C# SDK. Invalid parameters throw exceptions; server/network errors return details in Status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Grant token[​](#grant-token)

##### Requires Access Manager add-on
Enable Access Manager on your keyset in the Admin Portal.

##### Requires Secret Key authentication
Granting must be done from a server-side SDK instance initialized with a Secret Key.

Generates a time-limited token with:
- TTL (minutes)
- Optional AuthorizedUuid binding
- Permissions for Channels, ChannelGroups, Uuids
- Optional RegEx Patterns

Only the AuthorizedUuid (if set) can use the token. Unauthorized/invalid use returns HTTP 403.

- Permissions: Channels (read, write, get, manage, update, join, delete); ChannelGroups (read, manage); Uuids (get, update, delete). See Manage Permissions with Access Manager v3.
- TTL: required; 1–43,200 minutes (30 days).
- RegEx patterns: apply permissions to matching resources.
- Authorized UUID: restrict token to a single client UUID.

### Method(s)[​](#methods)

```
`1pubnub.GrantToken()  
2      .TTL(int)  
3      .Meta(Dictionarystring, object>)  
4      .AuthorizedUuid(string)  
5      .Resources(PNTokenResources)  
6      .Patterns(PNTokenPatterns)  
7      .QueryParam(Dictionarystring, object>)  
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
Specify permissions for at least one UUID, channel, or group (resource list or RegEx pattern).

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)
`GrantToken()` returns `PNResult<PNAccessManagerTokenResult>`:

PropertyDescription`Result`Type: `PNAccessManagerTokenResult`Returns a `PNAccessManagerTokenResult` object.`Status`Type: `PNStatus`Returns a `PNStatus` object.

`PNAccessManagerTokenResult`:

*  requiredParameterDescription`Token` *Type: `String`Current token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

```
1
  

```

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

```
1
  

```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

```
1
  

```

### Error responses[​](#error-responses)
HTTP 400 for invalid requests (for example, bad RegEx, invalid timestamp, or incorrect permissions).

## Revoke token[​](#revoke-token)

##### Requires Access Manager add-on
Enable Access Manager on your keyset in the Admin Portal.

##### Enable token revoke
Enable “Revoke v3 Token” on the keyset in the Admin Portal before using this method.

Disables an existing token and revokes all embedded permissions. Use for tokens with TTL ≤ 30 days; contact support for longer TTL tokens.

### Method(s)[​](#methods-1)

```
`1pubnub.RevokeToken()  
2        .Token(string)  
3        .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.`Execute`Type: `PNCallback`Default:  
n/a`PNCallback` of type `PNAccessManagerRevokeTokenResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `PNResult<PNAccessManagerRevokeTokenResult>`.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)
`RevokeToken()` returns `PNResult<PNAccessManagerRevokeTokenResult>`:

PropertyDescription`Result`Type: `PNAccessManagerRevokeTokenResult`Returns an empty `PNAccessManagerRevokeTokenResult` object when the token revocation request is successful.`Status`Type: `PNStatus`Returns a `PNStatus` object for operations ending in success or failure.

### Error Responses[​](#error-responses-1)
Possible errors: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token[​](#parse-token)

Decodes a token and returns embedded permissions and TTL details.

### Method(s)[​](#methods-2)

```
`1ParseToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Current token with embedded permissions.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

```
1
  

```

### Error Responses[​](#error-responses-2)
Errors may indicate a damaged token; request a new token.

## Set token[​](#set-token)

Updates the client’s current authentication token.

### Method(s)[​](#methods-3)

```
`1SetAuthToken(String token)  
`
```

*  requiredParameterDescription`token` *Type: `String`Current token with embedded permissions.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)
No return value.

## Grant token - spaces & users (deprecated)[​](#grant-token---spaces--users-deprecated)

##### Deprecated
Use `grantToken()` instead.

##### Requires Access Manager add-on
Enable Access Manager on your keyset in the Admin Portal.

Generates a time-limited token for Spaces and Users (user metadata), with optional AuthorizedUserId binding. Unauthorized/invalid use returns HTTP 403.

##### Permissions - spaces & users (deprecated)[​](#permissions---spaces--users-deprecated)
- Spaces: read, write, get, manage, update, join, delete
- Users: get, update, delete

##### TTL - spaces & users (deprecated)[​](#ttl---spaces--users-deprecated)
TTL required; 1–43,200 minutes (30 days).

##### RegEx - spaces & users (deprecated)[​](#regex---spaces--users-deprecated)
Apply permissions using RegEx patterns.

##### Authorized user ID - spaces & users (deprecated)[​](#authorized-user-id---spaces--users-deprecated)
Bind the token to a single AuthorizedUserId to prevent impersonation.

#### Method(s) - spaces & users (deprecated)[​](#methods---spaces--users-deprecated)

```
`1pubnub.GrantToken()  
2      .TTL(int)  
3      .Meta(Dictionarystring, object>)  
4      .AuthorizedUserId(string)  
5      .Resources(PNTokenResources)  
6      .Patterns(PNTokenPatterns)  
7      .QueryParam(Dictionarystring, object>)  
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
Specify permissions for at least one User or Space (resource list or RegEx pattern).

#### Sample code - spaces & users (deprecated)[​](#sample-code---spaces--users-deprecated)

```
1
  

```

#### Returns - spaces & users (deprecated)[​](#returns---spaces--users-deprecated)
`GrantToken()` returns `PNResult<PNAccessManagerTokenResult>`:

PropertyDescription`Result`Type: `PNAccessManagerTokenResult`Returns a `PNAccessManagerTokenResult` object.`Status`Type: `PNStatus`Returns a `PNStatus` object.

`PNAccessManagerTokenResult`:

*  requiredParameterDescription`Token` *Type: `String`Current token with embedded permissions.

```
`1{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

#### Other examples - spaces & users (deprecated)[​](#other-examples---spaces--users-deprecated)

##### Grant an authorized client different levels of access to various resources in a single call - spaces & users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call---spaces--users-deprecated)

```
1
  

```

##### Grant an authorized client read access to multiple spaces using RegEx - spaces & users (deprecated)[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex---spaces--users-deprecated)

```
1
  

```

##### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call - spaces & users (deprecated)[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call---spaces--users-deprecated)

```
1
  

```

#### Error responses - spaces & users (deprecated)[​](#error-responses---spaces--users-deprecated)
HTTP 400 for invalid requests (for example, bad RegEx, invalid timestamp, or incorrect permissions).

Last updated on **Sep 3, 2025**