# App Context API – PHP SDK (Objects)

Server-side storage for User & Channel metadata and their memberships.  
Below: signatures, parameters, usage, and result objects for every operation.

---

## User

### Get All User Metadata

```
`getAllUUIDMetadata()  
    ->includeFields(Array[String => Boolean])  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync()  
`
```

Parameters  
• includeFields `totalCount|customFields : bool`  
• filter `String` – [filter grammar](/docs/general/metadata/filtering)  
• sort `id|name|updated` (`asc|desc`)  
• limit `1-100` (default 100)  
• page `['next'|'prev' => String]`

Basic usage

```
`// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-app-context-demo");  
  
`
```
(show all 86 lines)

Result `PNGetAllUUIDMetadataResult`  
• getData() `PNGetUUIDMetadataResult[]`  
• getTotalCount() `int`  
• getPrev()/getNext() `String`

`PNGetUUIDMetadataResult` fields: id, name, externalId, profileUrl, email, custom.

---

### Get User Metadata

```
`getUUIDMetadata()  
    ->uuid(String)  
    ->sync()  
`
```

Parameter *uuid* `String`

```
`$response = $pubnub->getUUIDMetadata()  
    ->uuid("uuid")  
    ->sync();  
`
```

Result `PNGetUUIDMetadataResult` – same field list as above.

---

### Set User Metadata

```
`setUUIDMetadata()  
    ->uuid(String)  
    ->meta(Array | StdClass)  
    ->ifMatchesEtag(String)  
    ->sync()  
`
```

• uuid *required*  
• meta – array|object with: name, externalId, profileUrl, email, custom.  
• ifMatchesEtag – optional concurrency check (HTTP 412 on mismatch).

```
`// using array metadata  
$pubnub->setUUIDMetadata()  
    ->uuid("uuid")  
    ->meta([  
        "name" => "display_name",  
        "externalId" => "external_id",  
        "profileUrl" => "profile_url",  
        "email" => "email_address",  
        "custom" => [ "a" => "aa", "b" => "bb" ]  
    ])  
    ->sync();  
  
`
```
(show all 33 lines)

Result `PNSetUUIDMetadataResult` – same field list.

---

### Remove User Metadata

```
`removeUUIDMetadata()  
    ->uuid(String)  
    ->sync()  
`
```

Returns `true` on success.

---

## Channel

### Get All Channel Metadata

```
`getAllChannelMetadata()  
    ->includeFields(Array[String => Boolean])  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync()  
`
```

Same parameter semantics as “Get All User Metadata”.

```
`$response = $pubnub->getAllChannelMetadata()  
    ->includeFields([ "totalCount" => true, "customFields" => true ])  
    ->sync();  
`
```

Result `PNGetAllChannelMetadataResult`  
• getData() `PNGetChannelMetadataResult[]`, totalCount, prev/next.

`PNGetChannelMetadataResult` fields: id, name, description, custom.

---

### Get / Set / Remove Channel Metadata

Get:

```
`getChannelMetadata()  
    ->channel(String)  
    ->sync()  
`
```

Set:

```
`setChannelMetadata()  
    ->channel(String)  
    ->meta(Array | StdClass)  
    ->ifMatchesEtag(String)  
    ->sync()  
`
```

Remove:

```
`removeChannelMetadata()  
    ->channel(String)  
    ->sync()  
`
```

Set meta fields: name, description, custom.  
Results mirror user-metadata counterparts; remove returns `true`.

Example (set):

```
`// using array metadata  
$pubnub->setChannelMetadata()  
    ->channel("channel")  
    ->meta([  
        "name" => "display_name",  
        "description" => "description_of_channel",  
        "custom" => [ "a" => "aa", "b" => "bb" ]  
    ])  
    ->sync();  
  
// using stdClass metadata  
use stdClass;  
`
```
(show all 29 lines)

---

## Channel Memberships (User-side)

### Get Memberships

```
`getMemberships()  
    ->uuid(String)  
    ->include(PNMembershipIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

Include flags: custom, status, type, total_count, channel, channelCustom, channelType, channelStatus.

```
`$includes = new PNMembershipIncludes();  
$includes->channel()->custom()->status()->type();  
  
$response = $pubnub->getMemberships()  
    ->uuid("uuid")  
    ->includes($includes)  
    ->sync();  
`
```

Result `PNMembershipsResult`: data[], totalCount, prev/next.  
Item → channel metadata, custom, updated, eTag.

---

### Set / Remove Memberships

Set:

```
`setMemberships()  
    ->uuid(String)  
    ->memberships(Array[PNChannelMembership])  
    ->custom(Array | StdClass)  
    ->include(PNMembershipIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

Remove:

```
`removeMemberships()  
    ->uuid(String)  
    ->memberships(Array[PNChannelMembership])  
    ->include(PNMembershipIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

Example (set):

```
`$includes = new PNMembershipIncludes();  
$includes->channel()->channelId()->channelCustom()->channelType()->channelStatus()->custom()->status()->type();  
  
$addMembership = $this->pubnub->setMemberships()  
    ->userId($this->user)  
    ->memberships([  
        new PNChannelMembership($this->channel1, ['BestDish' => 'Pizza'], 'Admin', 'Active'),  
        new PNChannelMembership($this->channel2, ['BestDish' => 'Lasagna'], 'Guest', 'Away'),  
    ])  
    ->include($includes)  
    ->sync();  
`
```

Both operations return `PNMembershipsResult` (same structure as above).

---

### Manage Memberships (bulk)

```
`manageMemberships()  
    ->channel(String)  
    ->setChannels(Array[String])  
    ->removeChannels(Array[String])  
    ->setMemberships(Array[PNChannelMembership])  
    ->removeMemberships(Array[PNChannelMembership])  
    ->custom(Array | StdClass)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

```
`$response = $pubnub->manageMemberships()  
    ->channel("channel")  
    ->setChannels(["channel1", "channel2"])  
    ->removeChannels(["channel3"])  
    ->sync();  
`
```

Returns `PNMembershipsResult`.

---

## Channel Members (Channel-side)

### Get Members

```
`getMembers()  
    ->channel(String)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

Include flags: custom, status, type, total_count, user, userCustom, userType, userStatus.

```
`$includes = new PNMemberIncludes();  
$includes->user()->custom()->status();  
  
$response = $pubnub->getMembers()  
    ->channel("channel")  
    ->includes($includes)  
    ->sync();  
`
```

Result `PNMembersResult`: data[], totalCount, prev/next.

---

### Set / Remove Members

Set:

```
`setMembers()  
    ->channel(String)  
    ->uuids(Array[String | Array])  
    ->custom(Array | StdClass)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

Remove:

```
`removeMembers()  
    ->channel(String)  
    ->members(PNChannelMember[])  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

Example (set):

```
`$includes = new PNMemberIncludes();  
$includes->user()->userId()->userCustom()->userType()->userStatus()->custom()->status()->type();  
  
$addMembers = $this->pubnub->setMembers()  
    ->channel($this->channel)  
    ->members([  
        new PNChannelMember($this->userName1, ['BestDish' => 'Pizza'], 'Svensson', 'Active'),  
        new PNChannelMember($this->userName2, ['BestDish' => 'Lasagna'], 'Baconstrips', 'Retired'),  
    ])  
    ->include($includes)  
    ->sync();  
`
```

Both operations return `PNMembersResult`.

---

### Manage Members (bulk)

```
`manageMembers()  
    ->channel(String)  
    ->setUuids(Array[String])  
    ->removeUuids(Array[String])  
    ->setMembers(Array[PNChannelMember])  
    ->removeMembers(Array[PNChannelMember])  
    ->custom(Array | StdClass)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

```
`$response = $pubnub->manageMembers()  
    ->channel("channel")  
    ->setUuids(["uuid1", "uuid2"])  
    ->removeUuids(["uuid3"])  
    ->sync();  
`
```

Returns `PNMembersResult`.

---

_Last updated: Apr 2 2025_