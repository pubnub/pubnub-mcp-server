On this page
# Access Manager v3 API for Go SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to one client with a given `userId`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

For more information about Access Manager v3, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control).

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `GrantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`TTL`), `AuthorizedUUID`, and a set of permissions giving access to one or more resources:

- `Channels`

- `ChannelGroups`

- `UUIDs` (other users' object metadata, such as their names or avatars)

Only this `AuthorizedUUID` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `TTL` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`Channels``read`, `write`, `get`, `manage`, `update`, `join`, `delete``ChannelGroups``read`, `manage``UUIDs``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, define RegEx permissions for a given resource type in the grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized UUID[​](#authorized-uuid)

Setting an `AuthorizedUUID` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `AuthorizedUUID` isn't specified during the grant request, the token can be used by any client with any `UUID`. It's recommended to restrict tokens to a single `AuthorizedUUID` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

```
`pn.GrantToken().  
  UUIDs(map[string]UUIDPermissions).  
  Channels(map[string]ChannelPermissions).  
  ChannelGroups(map[string]GroupPermissions).  
  UUIDsPattern(map[string]UUIDPermissions).  
  ChannelsPattern(map[string]ChannelPermissions).  
  ChannelGroupsPattern(map[string]GroupPermissions).  
  TTL(int).  
  AuthorizedUUID(string).  
  Meta(map[string]interface{}).  
  QueryParam(queryParam).  
  Execute()  
`
```

*  requiredParameterDescription`UUIDs`Type: `map[string]UUIDPermissions`Default:  
n/aMap of uuids to permissions.`Channels`Type: `map[string]ChannelPermissions`Default:  
n/aMap of channel names to permissions.`ChannelGroups`Type: `map[string]GroupPermissions`Default:  
n/aMap of channel group ids to permissions.`UUIDsPattern`Type: `map[string]UUIDPermissions`Default:  
n/aMap of uuid patterns to permissions.`ChannelsPattern`Type: `map[string]ChannelPermissions`Default:  
n/aMap of channel patterns to permissions.`ChannelGroupsPattern`Type: `map[string]GroupPermissions`Default:  
n/aMap of channel group patterns to permissions.`TTL` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`AuthorizedUUID`Type: `String`Default:  
n/aSingle `UUID` which is authorized to use the token to make API requests to PubNub.`Meta`Type: `Object`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one `UUID`, `Channel`, or `ChannelGroup`, either as a resource list or as a pattern (RegEx).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configuration for PubNub with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
	config.SecretKey = "mySecretKey" // Required for grantToken  
`
```
show all 48 lines

### Returns[​](#returns)

```
`PNGrantTokenResponse{  
  Data: PNGrantTokenData{  
      Message: "Success",  
      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI",  
  }  
}  
`
```

### Other Examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

The code below grants `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUUID("my-authorized-uuid").  
        Channels(map[string]pubnub.ChannelPermissions{  
                "channel-a": {  
                        Read: true,  
                },  
                "channel-b": {  
                        Read: true,  
                        Write: true,  
                },  
                "channel-c": {  
                        Read: true,  
                        Write: true,  
                },  
`
```
show all 35 lines

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

The code below grants `my-authorized-uuid` read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUUID("my-authorized-uuid").  
        ChannelsPattern(map[string]pubnub.ChannelPermissions{  
                "^channel-[A-Za-z0-9]*$": {  
                        Read: true,  
                },  
        }).  
        Execute()  
`
```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

The code below grants the `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

- Read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUUID("my-authorized-uuid").  
        Channels(map[string]pubnub.ChannelPermissions{  
                "channel-a": {  
                        Read: true,  
                },  
                "channel-b": {  
                        Read: true,  
                        Write: true,  
                },  
                "channel-c": {  
                        Read: true,  
                        Write: true,  
                },  
`
```
show all 40 lines

### Error responses[​](#error-responses)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions.

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
`pn.GrantToken().  
  UsersPermissions(map[UserId]UserPermissions).  
  SpacesPermissions(map[SpaceId]SpacePermissions).  
  UserPatternsPermissions(map[string]UserPermissions).  
  SpacePatternsPermissions(map[string]SpacePermissions).  
  TTL(int).  
  AuthorizedUserId(UserId).  
  Meta(map[string]interface{}).  
  QueryParam(queryParam).  
  Execute()  
`
```

*  requiredParameterDescription`UsersPermissions`Type: `map[UserId]UserPermissions`Default:  
n/aMap of Users to permissions.`SpacesPermissions`Type: `map[SpaceId]SpacePermissions`Default:  
n/aMap of Spaces to permissions.`UserPatternsPermissions`Type: `map[string]UserPermissions)`Default:  
n/aMap of User patterns to permissions.`SpacePatternsPermissions`Type: `map[string]SpacePermissions`Default:  
n/aMap of Space patterns to permissions.`TTL` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`AuthorizedUserId`Type: `UserId`Default:  
n/aSingle `UserId` which is authorized to use the token to make API requests to PubNub.`Meta`Type: `Object`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one User or Space either as a resource list or as a pattern (RegEx).

### Basic Usage[​](#basic-usage-1)

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUserId("my-authorized-userId").  
        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{  
                "my_spaces": {  
                        Read: true,  
                },  
        }).  
        Execute()  
`
```

### Returns[​](#returns-1)

```
`PNGrantTokenResponse{  
  Data: PNGrantTokenData{  
      Message: "Success",  
      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI",  
  }  
}  
`
```

### Other Examples[​](#other-examples-1)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call-1)

The code below grants `my-authorized-userId`:

- Read access to `space-a`, and get to `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUserId("my-authorized-userId").  
        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{  
                "space-a": {  
                        Read: true,  
                },  
                "space-b": {  
                        Read: true,  
                        Write: true,  
                },  
                "space-c": {  
                        Read: true,  
                        Write: true,  
                },  
`
```
show all 30 lines

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)

The code below grants `my-authorized-userId` read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUserId("my-authorized-userId").  
        SpacePatternsPermissions(map[string]pubnub.SpacePermissions{  
                "^space-[A-Za-z0-9]*$": {  
                        Read: true,  
                },  
        }).  
        Execute()  
`
```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)

The code below grants the `my-authorized-userId`:

- Read access to `space-a` and `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

- Read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`res, status, err := pn.GrantToken().  
        TTL(15).  
        AuthorizedUserId("my-authorized-userId").  
        SpacesPermissions(map[string]pubnub.SpacePermissions{  
                "space-a": {  
                        Read: true,  
                },  
                "space-b": {  
                        Read: true,  
                        Write: true,  
                },  
                "space-c": {  
                        Read: true,  
                        Write: true,  
                },  
`
```
show all 35 lines

### Error responses[​](#error-responses-1)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions.

## Revoke Token[​](#revoke-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Enable token revoke

To revoke tokens, you must first enable this feature on the [Admin Portal](https://admin.pubnub.com/). To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `RevokeToken()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `GrantToken()` method.

Use this method for tokens with `ttl` less than or equal to 30 days. If you need to revoke a token with a longer `ttl`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-2)

```
`pn.RevokeToken().  
        Token(string)  
`
```

*  requiredParameterDescription`Token` *Type: `string`Default:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-2)

```
`res, status, err := pn.RevokeToken().  
        Token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenV").  
        Execute()  
`
```

### Returns[​](#returns-2)

The `RevokeToken()` operation returns an empty `PNRevokeTokenResponse` interface.

### Error Responses[​](#error-responses-2)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `ParseToken()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `TTL` details.

Import the `pubnub` package before you use the `ParseToken()` method:

```
`import (  
        pubnub "github.com/pubnub/go/v5")  
`
```

### Method(s)[​](#methods-3)

```
`pubnub.ParseToken(token string)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-3)

```
`pubnub.ParseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-3)

```
`PNToken{  
  Version: 2,  
  Timestamp: 1619718521,  
  TTL: 15,  
  AuthorizedUUID: "user1",  
  Resources: PNTokenResources{  
    Channels: make[string]ChannelPermissions{  
      Read: true,  
      Write: true,  
      Delete: true,  
      Get: true,  
      Manage: true,  
      Update: true,  
      Join: true,  
    },  
`
```
show all 46 lines

### Error Responses[​](#error-responses-3)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `SetToken()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-4)

```
`pn.SetToken(token string)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-4)

```
`pn.SetToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-4)

This method doesn't return any response value.
Last updated on **Apr 29, 2025**