# PubNub PHP SDK – App Context (Objects v2)

This condensed guide lists every App Context/Objects v2 operation, its method‐chain signature, parameters (type & purpose), response objects, and ALL original code blocks.

---

## Users (UUID Metadata)

### Get all UUID metadata  
Returns a paginated list of UUID metadata objects.

```php
getAllUUIDMetadata()
    ->includeFields(Array[String => Boolean])
    ->filter(String)
    ->sort(String | Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync()
```

* includeFields – `{ totalCount?:bool, customFields?:bool }`
* filter – filtering expression  
* sort – `"id" | "name" | "updated"` (+ `asc|desc`)
* limit – default/maximum `100`
* page – `{ next?:string, prev?:string }`

Sample:

```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;
use PubNub\Exceptions\PubNubServerException;

// Create configuration with demo keys
$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setUserId("php-app-context-demo");
```

Response `PNGetAllUUIDMetadataResult`  
`getData(): PNGetUUIDMetadataResult[]`, `getTotalCount():int`, `getPrev():string`, `getNext():string`  
Each `PNGetUUIDMetadataResult` exposes `getId()`, `getName()`, `getExternalId()`, `getProfileUrl()`, `getEmail()`, `getCustom()`.

---

### Get single UUID metadata

```php
getUUIDMetadata()
    ->uuid(String)
    ->sync()
```

```php
$response = $pubnub->getUUIDMetadata()
    ->uuid("uuid")
    ->sync();
```

Returns `PNGetUUIDMetadataResult` (same fields as above).

---

### Set UUID metadata

```php
setUUIDMetadata()
    ->uuid(String)
    ->meta(Array | StdClass)
    ->ifMatchesEtag(String)
    ->sync()
```

* meta fields: `name`, `externalId`, `profileUrl`, `email`, `custom`.

```php
// using array metadata
$pubnub->setUUIDMetadata()
    ->uuid("uuid")
    ->meta([
        "name"       => "display_name",
        "externalId" => "external_id",
        "profileUrl" => "profile_url",
        "email"      => "email_address",
        "custom"     => [ "a"=>"aa", "b"=>"bb" ]
    ])
    ->sync();
```

Returns `PNSetUUIDMetadataResult` (same getters).

---

### Remove UUID metadata

```php
removeUUIDMetadata()
    ->uuid(String)
    ->sync()
```

```php
$response = $pubnub->removeUUIDMetadata()
    ->uuid("uuid")
    ->sync();
```

Returns `true` on success.

---

## Channels (Channel Metadata)

### Get all channel metadata

```php
getAllChannelMetadata()
    ->includeFields(Array[String => Boolean])
    ->filter(String)
    ->sort(String | Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync()
```

```php
$response = $pubnub->getAllChannelMetadata()
    ->includeFields([ "totalCount" => true, "customFields" => true ])
    ->sync();
```

Returns `PNGetAllChannelMetadataResult`  
(each `PNGetChannelMetadataResult` → `getId()`, `getName()`, `getDescription()`, `getCustom()`).

---

### Get single channel metadata

```php
getChannelMetadata()
    ->channel(String)
    ->sync()
```

```php
$response = $pubnub->getChannelMetadata()
    ->channel("channel")
    ->sync();
```

Response: `PNGetChannelMetadataResult`.

---

### Set channel metadata

```php
setChannelMetadata()
    ->channel(String)
    ->meta(Array | StdClass)
    ->ifMatchesEtag(String)
    ->sync()
```

Allowed meta: `name`, `description`, `custom`.

```php
// using array metadata
$pubnub->setChannelMetadata()
    ->channel("channel")
    ->meta([
        "name"        => "display_name",
        "description" => "description_of_channel",
        "custom"      => [ "a"=>"aa", "b"=>"bb" ]
    ])
    ->sync();

// using stdClass metadata
use stdClass;
```

Returns `PNSetChannelMetadataResult`.

Other example (iterative update):

```php
set_time_limit(0);
require('vendor/autoload.php');

use PubNub\PNConfiguration;
use PubNub\PubNub;

$pnconf = new PNConfiguration();
$pnconf->setPublishKey("demo");
$pnconf->setSubscribeKey("demo");
$pnconf->setUuid("example");

$pubnub = new PubNub($pnconf);
```

---

### Remove channel metadata

```php
removeChannelMetadata()
    ->channel(String)
    ->sync()
```

```php
$response = $pubnub->removeChannelMetadata()
    ->channel("channel")
    ->sync();
```

Returns `true` on success.

---

## Channel Memberships (channels a user belongs to)

### Get memberships

```php
getMemberships()
    ->uuid(String)
    ->include(PNMembershipIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$includes = new PNMembershipIncludes();
$includes->channel()->custom()->status()->type();

$response = $pubnub->getMemberships()
    ->uuid("uuid")
    ->includes($includes)
    ->sync();
```

Returns `PNMembershipsResult` (memberships list + paging).

---

### Set memberships

```php
setMemberships()
    ->uuid(String)
    ->memberships(Array[PNChannelMembership])
    ->custom(Array | StdClass)
    ->include(PNMembershipIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$includes = new PNMembershipIncludes();
$includes->channel()->channelId()->channelCustom()->channelType()
        ->channelStatus()->custom()->status()->type();

$addMembership = $this->pubnub->setMemberships()
    ->userId($this->user)
    ->memberships([
        new PNChannelMembership($this->channel1,['BestDish'=>'Pizza'],'Admin','Active'),
        new PNChannelMembership($this->channel2,['BestDish'=>'Lasagna'],'Guest','Away'),
    ])
    ->include($includes)
    ->sync();
```

Returns `PNMembershipsResult`.

---

### Remove memberships

```php
removeMemberships()
    ->uuid(String)
    ->memberships(Array[PNChannelMembership])
    ->include(PNMembershipIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$includes = new PNMembershipIncludes();
$includes->channel()->channelId()->channelCustom()->channelType()
        ->channelStatus()->custom()->status()->type();

$removeMembership = $this->pubnub->removeMemberships()
    ->userId($this->user)
    ->memberships([
        new PNChannelMembership($this->channel1,['BestDish'=>'Pizza'],'Admin','Active'),
        new PNChannelMembership($this->channel2,['BestDish'=>'Lasagna'],'Guest','Away'),
    ])
    ->include($includes)
    ->sync();
```

Returns `PNMembershipsResult`.

---

### Manage memberships (add/remove in one call)

```php
manageMemberships()
    ->channel(String)
    ->setChannels(Array[String])
    ->removeChannels(Array[String])
    ->setMemberships(Array[PNChannelMembership])
    ->removeMemberships(Array[PNChannelMembership])
    ->custom(Array | StdClass)
    ->include(PNMemberIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$response = $pubnub->manageMemberships()
    ->channel("channel")
    ->setChannels(["channel1","channel2"])
    ->removeChannels(["channel3"])
    ->sync();
```

Returns `PNMembershipsResult`.

---

## Channel Members (users in a channel)

### Get members

```php
getMembers()
    ->channel(String)
    ->include(PNMemberIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$includes = new PNMemberIncludes();
$includes->user()->custom()->status();

$response = $pubnub->getMembers()
    ->channel("channel")
    ->includes($includes)
    ->sync();
```

Returns `PNMembersResult`.

---

### Set members

```php
setMembers()
    ->channel(String)
    ->uuids(Array[String | Array])
    ->custom(Array | StdClass)
    ->include(PNMemberIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$includes = new PNMemberIncludes();
$includes->user()->userId()->userCustom()->userType()
        ->userStatus()->custom()->status()->type();

$addMembers = $this->pubnub->setMembers()
    ->channel($this->channel)
    ->members([
        new PNChannelMember($this->userName1,['BestDish'=>'Pizza'],'Svensson','Active'),
        new PNChannelMember($this->userName2,['BestDish'=>'Lasagna'],'Baconstrips','Retired'),
    ])
    ->include($includes)
    ->sync();
```

Returns `PNMembersResult`.

---

### Remove members

```php
removeMembers()
    ->channel(String)
    ->members(PNChannelMember[])
    ->include(PNMemberIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$includes = new PNMemberIncludes();
$includes->user()->userId()->userCustom()->userType()
        ->userStatus()->custom()->status()->type();

$removeMembers = $this->pubnub->removeMembers()
    ->channel($this->channel)
    ->members([
        new PNChannelMember($this->userName1,['BestDish'=>'Pizza'],'Svensson','Active'),
        new PNChannelMember($this->userName2,['BestDish'=>'Lasagna'],'Baconstrips','Retired'),
    ])
    ->include($includes)
    ->sync();
```

Returns `PNMembersResult`.

---

### Manage members (add/remove in one call)

```php
manageMembers()
    ->channel(String)
    ->setUuids(Array[String])
    ->removeUuids(Array[String])
    ->setMembers(Array[PNChannelMember])
    ->removeMembers(Array[PNChannelMember])
    ->custom(Array | StdClass)
    ->include(PNMemberIncludes)
    ->filter(String)
    ->sort(String|Array[String])
    ->limit(Integer)
    ->page(Array[String => String])
    ->sync();
```

```php
$response = $pubnub->manageMembers()
    ->channel("channel")
    ->setUuids(["uuid1","uuid2"])
    ->removeUuids(["uuid3"])
    ->sync();
```

Returns `PNMembersResult`.

---

_Last updated: Jul 15 2025_