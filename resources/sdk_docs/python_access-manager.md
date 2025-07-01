On this page
# Access Manager v3 API for Python SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [`authorizedUuid`](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to one client with a given `userId`. Once specified, only this `authorizedUuid` will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

## Grant Token[​](#grant-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `grant_token()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorized_uuid`, and a set of permissions giving access to one or more resources:

- `channels`

- `groups`

- `uuids` (other users' object metadata, such as their names or avatars)

Only this `authorized_uuid` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

#### Permissions[​](#permissions)

The grant request allows your server to securely grant your clients access to the resources within the PubNub Platform. There is a limited set of operations the clients can perform on every resource:

ResourcePermissions`channels``read`, `write`, `get`, `manage`, `update`, `join`, `delete``groups``read`, `manage``uuids``get`, `update`, `delete`

For permissions and API operations mapping, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control#permissions).

#### TTL[​](#ttl)

The `ttl` (time to live) parameter is the number of minutes before the granted permissions expire. The client will require a new token to be granted before expiration to ensure continued access. `ttl` is a required parameter for every grant call and there is no default value set for it. The max value for `ttl` is 43,200 (30 days).

For more details, see [TTL in Access Manager v3](/docs/general/security/access-control#ttl).

#### RegEx[​](#regex)

If you prefer to specify permissions by setting patterns, rather than listing all resources one by one, you can use regular expressions. To do this, set RegEx permissions as `pattern` before making a grant request.

For more details, see [RegEx in Access Manager v3](/docs/general/security/access-control#regex).

#### Authorized UUID[​](#authorized-uuid)

Setting an `authorized_uuid` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorized_uuid` isn't specified during the grant request, the token can be used by any client with any `uuid`. It's recommended to restrict tokens to a single `authorized_uuid` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods)

```
`grant_token() \  
    .ttl(int) \  
    .meta(Dictionary) \  
    .authorized_uuid(str) \  
    .channels(listChannel>) \  
    .groups(listGroup>) \  
    .uuids(listUUID>)  
`
```

*  requiredParameterDescription`ttl` *Type: `Number`Default:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`meta`Type: `Dictionary`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.`authorized_uuid`Type: `Str`Default:  
n/aSingle `uuid` which is authorized to use the token to make API requests to PubNub.`channels`Type: `list<Channel>`Default:  
n/aAll channel grants provided either as a list or a RegEx pattern.`groups`Type: `list<Group>`Default:  
n/aAll channel group grants provided either as a list or a RegEx pattern.`uuids`Type: `list<UUID>`Default:  
n/aAll uuid grants provided either as a list or a RegEx pattern.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one `uuid`, `channel`, or `group`, either as a resource list or as a pattern (RegEx).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.v3.channel import Channel  
from pubnub.exceptions import PubNubException  
  
  
def grant_pubnub_token(pubnub: PubNub) -> str:  
    envelope = pubnub.grant_token() \  
        .channels([  
            Channel.id('readonly-channel').read(),  
            Channel.id('readwrite-channel').read().write(),  
        ]) \  
        .authorized_uuid("my-authorized-uuid") \  
        .ttl(15) \  
`
```
show all 43 lines
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.v3.channel import Channel  
from pubnub.exceptions import PubNubException  
  
  
def grant_pubnub_token(pubnub: PubNub) -> str:  
    grant = pubnub.grant_token(  
        channels=[  
            Channel.id('readonly-channel').read(),  
            Channel.id('readwrite-channel').read().write(),  
        ],  
        authorized_user_id="my-authorized-uuid",  
        ttl=15  
`
```
show all 44 lines

### Returns[​](#returns)

```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other Examples[​](#other-examples)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call)

The code below grants `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

```
`from pubnub.models.consumer.v3.channel import Channel  
from pubnub.models.consumer.v3.group import Group  
from pubnub.models.consumer.v3.uuid import UUID  
  
channels = [  
    Channel.id("channel-a").read(),  
    Channel.id("channel-b").read().write(),  
    Channel.id("channel-c").read().write(),  
    Channel.id("channel-d").read().write()  
]  
groups = [  
    Group.id("channel-group-b").read()  
]  
uuids = [  
    UUID.id("uuid-c").get(),  
`
```
show all 25 lines

#### Grant an authorized client read access to multiple channels using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-channels-using-regex)

The code below grants `my-authorized-uuid` read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`envelope = pubnub.grant_token() \  
    .channels(Channel.pattern("channel-[A-Za-z0-9]").read()) \  
    .authorized_uuid("my-authorized-uuid") \  
    .ttl(15) \  
    .sync()  
`
```

#### Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-channels-using-regex-in-a-single-call)

The code below grants the `my-authorized-uuid`:

- Read access to `channel-a`, `channel-group-b`, and get to `uuid-c`.

- Read/write access to `channel-b`, `channel-c`, `channel-d`, and get/update to `uuid-d`.

- Read access to all channels that match the `channel-[A-Za-z0-9]` RegEx pattern.

```
`from pubnub.models.consumer.v3.channel import Channel  
from pubnub.models.consumer.v3.group import Group  
from pubnub.models.consumer.v3.uuid import UUID  
  
channels = [  
    Channel.id("channel-a").read(),  
    Channel.pattern("channel-[A-Za-z0-9]").read(),  
    Channel.id("channel-b").read().write(),  
    Channel.id("channel-c").read().write(),  
    Channel.id("channel-d").read().write()  
]  
groups = [  
    Group.id("channel-group-b").read()  
]  
uuids = [  
`
```
show all 25 lines

### Error responses[​](#error-responses)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error in the `envelope` object.

## Grant Token - Spaces & Users[​](#grant-token---spaces--users)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

The `grantToken()` method generates a time-limited authorization token with an embedded access control list. The token defines time to live (`ttl`), `authorized_user`, and a set of permissions giving access to one or more resources:

- `spaces`

- `users` (other users' metadata, such as their names or avatars)

Only this `authorized_user` will be able to use the token with the defined permissions. The authorized client will send the token to PubNub with each request until the token's `ttl` expires. Any unauthorized request or a request made with an invalid token will return a `403` with a respective error message.

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

Setting an `authorized_user` in the token helps you specify which client device should use this token in every request to PubNub. This will ensure that all requests to PubNub are authorized before PubNub processes them. If `authorized_user` isn't specified during the grant request, the token can be used by any client with any `userId`. It's recommended to restrict tokens to a single `authorized_user` to prevent impersonation.

For more details, see [Authorized UUID in Access Manager v3](/docs/general/security/access-control#authorized-uuid).

### Method(s)[​](#methods-1)

```
`grant_token() \  
    .ttl(Integer) \  
    .meta(Dictionary) \  
    .authorized_user(String) \  
    .spaces(listSpace>) \  
    .users(listUser>)  
`
```

*  requiredParameterDescription`ttl` *Type: IntegerDefault:  
n/aTotal number of minutes for which the token is valid. 
- The minimum allowed value is `1`.
- The maximum is `43,200` minutes (30 days).

`meta`Type: `Dictionary`Default:  
n/aExtra metadata to be published with the request. Values must be scalar only; arrays or objects are not supported.`authorized_user`Type: StringDefault:  
n/aSingle `user_id` which is authorized to use the token to make API requests to PubNub.`spaces`Type: `list<Space>`Default:  
n/aAll Space permissions provided as a list of individual permissions or RegEx patterns.`users`Type: `list<User>`Default:  
n/aAll User permissions provided as a list of individual permissions or RegEx patterns.

##### Required key/value mappings

For a successful grant request, you must specify permissions for at least one User or Space, either as a resource list or as a pattern (RegEx).

### Basic Usage[​](#basic-usage-1)

- Builder Pattern
- Named Arguments

```
`envelope = pubnub.grant_token() \  
    .authorized_user('some_user_id')\  
    .spaces([  
        Space().id('some_space_id').read().write(),  
        Space().pattern('some_*').read().write()  
    ]) \  
    .ttl(60) \  
    .sync()  
`
```

```
`grant = pubnub.grant_token(spaces=[Space().id('some_space_id').read().write(), Space().pattern('some_*').read().write()],  
                           authorized_uuid="my-authorized-uuid",  
                           ttl=60) \  
    .sync()  
  
print(f'Token granted: {grant.result.get_token()}')  
`
```

### Returns[​](#returns-1)

```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other Examples[​](#other-examples-1)

#### Grant an authorized client different levels of access to various resources in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-in-a-single-call-1)

The code below grants `my-authorized-userId`:

- Read access to `space-a`, and get to `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

```
`from pubnub.models.consumer.v3.space import Space  
from pubnub.models.consumer.v3.user import User  
  
spaces = [  
    Space.id("space-a").read(),  
    Space.id("space-b").read().write(),  
    Space.id("space-c").read().write(),  
    Space.id("space-d").read().write()  
]  
users = [  
    User.id("userId-c").get(),  
    User.id("userId-d").get().update()  
]  
envelope = pubnub.grant_token()  
    .spaces(spaces)  
`
```
show all 19 lines

#### Grant an authorized client read access to multiple spaces using RegEx[​](#grant-an-authorized-client-read-access-to-multiple-spaces-using-regex)

The code below grants `my-authorized-userId` read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`envelope = pubnub.grant_token()  
    .spaces(Space.pattern("space-[A-Za-z0-9]").read())  
    .ttl(15)  
    .authorized_user("my-authorized-userId")  
    .sync()  
`
```

#### Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call[​](#grant-an-authorized-client-different-levels-of-access-to-various-resources-and-read-access-to-spaces-using-regex-in-a-single-call)

The code below grants the `my-authorized-userId`:

- Read access to `space-a` and `userId-c`.

- Read/write access to `space-b`, `space-c`, `space-d`, and get/update to `userId-d`.

- Read access to all channels that match the `space-[A-Za-z0-9]` RegEx pattern.

```
`from pubnub.models.consumer.v3.space import Space  
from pubnub.models.consumer.v3.user import User  
  
channels = [  
    Space.id("space-a").read(),  
    Space.pattern("space-[A-Za-z0-9]").read(),  
    Space.id("space-b").read().write(),  
    Space.id("space-c").read().write(),  
    Space.id("space-d").read().write()  
]  
users = [  
    User.id("user-c").get(),  
    User.id("user-d").get().update()  
]  
envelope = pubnub.grant_token()  
`
```
show all 21 lines

### Error responses[​](#error-responses-1)

If you submit an invalid request, the server returns the `400` error status code with a descriptive message informing which of the provided arguments is missing or incorrect. These can include, for example, issues with a RegEx, a [timestamp](https://support.pubnub.com/hc/en-us/articles/360051973331-Why-do-I-get-Invalid-Timestamp-when-I-try-to-grant-permission-using-Access-Manager-), or permissions. The server returns the details of the error in the `envelope` object.

## Revoke Token[​](#revoke-token)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Enable token revoke

To revoke tokens, you must first enable this feature on the [Admin Portal](https://admin.pubnub.com/). To do that, navigate to your app's keyset and mark the *Revoke v3 Token* checkbox in the *ACCESS MANAGER* section.

The `revoke_token()` method allows you to disable an existing token and revoke all permissions embedded within. You can only revoke a valid token previously obtained using the `grant_token()` method.

Use this method for tokens with `ttl` less than or equal to 30 days. If you need to revoke a token with a longer `ttl`, [contact support](mailto:support@pubnub.com).

For more information, refer to [Revoke permissions](/docs/general/security/access-control#revoke-permissions).

### Method(s)[​](#methods-2)

```
`revoke_token(String)  
`
```

*  requiredParameterDescription`token` *Type: StringDefault:  
n/aExisting token with embedded permissions.

### Basic Usage[​](#basic-usage-2)

```
`pubnub.revoke_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-2)

The `revoke_token()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNRevokeTokenResult`](#pnrevoketokenresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNRevokeTokenResult[​](#pnrevoketokenresult)

```
`Revoke token success with status: 200  
`
```

### Error Responses[​](#error-responses-2)

If you submit an invalid request, the server returns an error status code with a descriptive message informing which of the provided arguments is missing or incorrect. Depending on the root cause, this operation may return the following errors:

- `400 Bad Request`

- `403 Forbidden`

- `503 Service Unavailable`

## Parse Token[​](#parse-token)

The `parse_token()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `ttl` details.

### Method(s)[​](#methods-3)

```
`parse_token(String)  
`
```

*  requiredParameterDescription`token` *Type: StringDefault:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-3)

```
`pubnub.parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-3)

```
`{  
   "version":2,  
   "timestamp":1629394579,  
   "ttl":15,  
   "authorized_uuid": "user1",  
   "resources":{  
      "uuids":{  
         "user1":{  
            "read": False,  
            "write": False,  
            "manage": False,  
            "delete": False,  
            "get": True,  
            "update": True,  
            "join": False  
`
```
show all 76 lines

### Error Responses[​](#error-responses-3)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `set_token()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-4)

```
`set_token(String)  
`
```

*  requiredParameterDescription`token` *Type: StringDefault:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-4)

```
`pubnub.set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns[​](#returns-4)

This method doesn't return any response value.
Last updated on **Apr 29, 2025**