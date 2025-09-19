# Access Manager v3 – PHP SDK (Access-Manager section)

Access Manager v3 issues time-limited tokens that embed fine-grained permissions for channels, channel groups and UUID metadata. All server-side operations (grant / revoke) require:  
• Access Manager add-on enabled in the Admin Portal  
• Secret Key configured in `PNConfiguration`.

----------------------------------------------------
## Permissions

Resource → Valid rights  
• Channels – `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• ChannelGroups – `read`, `manage`  
• Uuids – `get`, `update`, `delete`

----------------------------------------------------
## grantToken()

```
$pubnub->grantToken()  
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
```

Parameter (type)       | Notes  
-----------------------|--------------------------------------------------  
ttl (int) *required*   | Minutes, 1–43 200 (30 days).  
authorizedUuid (string)| Bind token to one client UUID.  
addChannelResources    | `['chan' => ['read'=>true, 'write'=>true]]`  
addChannelGroupResources| Same shape for channel groups.  
addUuidResources       | Same shape for UUID metadata.  
add*Patterns           | Same shapes, keys are RegEx patterns.  
meta (array)           | Scalars only.

• You must specify at least one resource or pattern.  
• Unlisted rights default to `false`.

Example resource array:

```
[
    'channel-1' => ['read' => true, 'write' => true],
    'channel-2' => ['read' => true],
    'channel-3' => ['read' => true]
]
```

### Sample configuration

```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;
use PubNub\Exceptions\PubNubServerException;

$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setSecretKey("demo");          // Required
$pnConfig->setUserId("php-token-granter");
```

### Return

```
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"
```

### Grant examples

Different rights on many resources:

```php
$pubnub->grantToken()
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
    ]);
```

Grant read to channels via RegEx:

```php
$pubnub->grantToken()
    ->ttl(15)
    ->authorizedUuid('my-authorized-uuid')
    ->addChannelPatterns([
        '^channel-[A-Za-z0-9]$' => ['read' => true],
    ])
    ->sync();
```

Mixed explicit resources and RegEx:

```php
$pubnub->grantToken()
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
    ]);
```

### Errors

`PubNubServerException` (status 400) exposes:  
`getStatusCode()`, `getBody()`, `getServerErrorMessage()`, `getServerErrorSource()`, `getServerErrorDetails()`.

----------------------------------------------------
## revokeToken()

Token revoke must be enabled in the Admin Portal.

```
$pubnub->revokeToken($token)
    ->sync();
```

Parameter | Description  
----------|------------  
token (string) *required* | Previously granted token (TTL ≤ 30 days).

Sample:

```php
$pubnub->revokeToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenV")
    ->sync();
```

Return on success: `PNRequestResult` (`getStatus()`, `getMessage()`, etc.).  
Possible errors: 400, 403, 503.

----------------------------------------------------
## parseToken()

```
parseToken(String token)
```

Sample:

```php
$pubnub->parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");
```

Returns a `PNToken` object:

Method | Return | Purpose
-------|--------|--------
getVersion()            | int    | Token version (current = 2)  
getTimestamp()          | int    | Issue time (epoch sec)  
getTtl()                | int    | Minutes to live  
getResources() / getPatterns() | array | `type => name => permissions`  
getChannelResource($ch) | Permissions|null | Rights for channel  
getChannelGroupResource($cg) | Permissions|null | Rights for group  
getUuidResource($uuid)  | Permissions|null | Rights for UUID  
getChannelPattern($re) / getChannelGroupPattern($re) / getUuidPattern($re) | Permissions|null  
getMetadata()           | array  | Custom metadata  
getSignature()          | string | Server signature  
getUuid()               | string | Authorized UUID  
toArray()               | array  | Entire token decoded

Permissions helper object:

```php
$pubnub->parseToken("token")
    ->getChannelResource('my-channel')
    ->hasRead();
```

Methods: `hasRead()`, `hasWrite()`, `hasManage()`, `hasDelete()`, `hasGet()`, `hasUpdate()`, `hasJoin()` (all boolean).

----------------------------------------------------
## setToken()

```
setToken(String token)
```

Sample:

```php
$pubnub->setToken(
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"
);
```

No return value.

----------------------------------------------------
Last updated Jul 15, 2025