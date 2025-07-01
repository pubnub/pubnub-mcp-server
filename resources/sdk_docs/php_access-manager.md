# Access Manager v3 – PHP SDK (condensed)

Enforce client access to PubNub resources by issuing, parsing, revoking, and setting JWT-style tokens. Access Manager must be enabled for your keyset.

---

## Grant Token

### Method
```php
$pubnub->grantToken()
    ->ttl($ttl)                       // required, 1–43 200 min
    ->authorizedUuid($uuid)           // optional but recommended
    ->addChannelResources(array $map) // {name => [perm => true]}
    ->addChannelGroupResources(array $map)
    ->addUuidResources(array $map)
    ->addChannelPatterns(array $map)  // RegEx
    ->addChannelGroupPatterns(array $map)
    ->addUuidPatterns(array $map)
    ->meta(array $kv)                 // scalar values only
    ->sync();
```

*You must specify at least one resource or pattern.*

### Permission keys
```
Channels       : read, write, get, manage, update, join, delete
ChannelGroups  : read, manage
Uuids          : get, update, delete
```

### Resource map example
```php
[
    'channel-1' => ['read' => true, 'write' => true],
    'channel-2' => ['read' => true],
    'channel-3' => ['read' => true]
]
```

### Basic usage (excerpt)
```php
// Include Composer autoloader
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

$cfg = new PNConfiguration();
$cfg->setSubscribeKey('demo');
$cfg->setPublishKey('demo');
$cfg->setSecretKey('demo');      // required
$cfg->setUserId('php-token-granter');
```
<!-- show all 51 lines -->

### Return (token string)
```
"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"
```

### Example: mixed permissions
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
    ])
    ->sync();
```
<!-- show all 17 lines -->

### Example: RegEx channels
```php
$pubnub->grantToken()
    ->ttl(15)
    ->authorizedUuid('my-authorized-uuid')
    ->addChannelPatterns([
        '^channel-[A-Za-z0-9]$' => ['read' => true],
    ])
    ->sync();
```

### Example: mixed resources + RegEx
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
        'uuid-c'  => ['get' => true],
        'uuid-d'  => ['get' => true, 'update' => true],
    ])
    ->addChannelPatterns([
        '^channel-[A-Za-z0-9]$' => ['read' => true],
    ])
    ->sync();
```
<!-- show all 19 lines -->

### Error handling
`PubNubServerException` exposes:
```php
getStatusCode();          // int, usually 400
getBody();                // object
getServerErrorMessage();  // string
getServerErrorSource();   // string
getServerErrorDetails();  // object {message, location, locationType}
```

---

## Revoke Token

### Enable
In Admin Portal > Keyset > ACCESS MANAGER: check “Revoke v3 Token”.

### Method
```php
$pubnub->revokeToken($token)->sync();
```

### Example
```php
$pubnub->revokeToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenV")->sync();
```

### Success response (`PNRequestResult`)
```php
getStatus();   // 200
getService();  // "Access Manager"
isError();     // false
getError();    // array|null
getMessage();  // "Success"
```

Possible errors: 400, 403, 503.

---

## Parse Token

### Method
```php
parseToken(string $token)
```

### Example
```php
$parsed = $pubnub
    ->parseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6han...")->toArray();
```
Sample output (truncated):
```
array(7) {
  ["version"]=> int(2)
  ["timestamp"]=> int(1634592012)
  ["ttl"]=> int(15)
  ["resources"]=> array(
      "chan" => ["my-channel" => ["read" => 1]]
  )
  ...
}
```
#### Token helper methods
```
getVersion(), getTimestamp(), getTtl()
getResources(), getPatterns()
getChannelResource($chan), getChannelGroupResource($grp), getUuidResource($uuid)
getChannelPattern($chan),  getChannelGroupPattern($grp), getUuidPattern($uuid)
getMetadata(), getSignature(), getUuid(), toArray()
```

#### Permissions object
```php
$pubnub->parseToken("...")->getChannelResource('my-channel')->hasRead();
```
Methods: `hasRead()`, `hasWrite()`, `hasManage()`, `hasDelete()`, `hasGet()`, `hasUpdate()`, `hasJoin()`.

---

## Set Token

### Method
```php
setToken(string $token)
```

### Example
```php
$pubnub->setToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI");
```
(No return value)

---

_Last updated: Apr 29 2025_