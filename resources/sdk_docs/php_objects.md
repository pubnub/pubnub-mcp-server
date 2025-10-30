# App Context API for PHP SDK

App Context (Objects v2) provides storage for user and channel metadata and their memberships. Events are triggered when data is set, updated, or removed.

## User

Manage UUID metadata: list, fetch, set, and remove.

### Get metadata for all users

Get a paginated list of UUID metadata with optional filters, sorting, and includes.

#### Method(s)

```
`1getAllUUIDMetadata()  
2    ->includeFields(Array[String => Boolean])  
3    ->filter(String)  
4    ->sort(String | Array[String])  
5    ->limit(Integer)  
6    ->page(Array[String => String])  
7    ->sync()  
`
```

`includeFields()` Type: Array[String => Boolean] Default: n/a Whether to include additional fields. Set `customFields` to include the Custom object. Set `totalCount` to include the total count in the paginated response (default is false).
`filter()` Type: String Default: n/a Filter expression. See filtering.
`sort()` Type: String or Array[String] Default: n/a Sort by `id`, `name`, `updated` with `asc`/`desc` (for example, `name:asc`).
`limit()` Type: integer Default: `100` Number of objects to return. Default/Max: 100.
`page()` Type: Array[String => String] Default: n/a Cursor-based pagination. Use `prev` and `next` tokens returned by the server.

#### Sample code

##### Reference code
```
1
  

```

#### Response

Returns `PNGetAllUUIDMetadataResult`:

- `getData()` Type: Array[PNGetUUIDMetadataResult] List of uuid metadata results
- `getTotalCount()` Type: Integer Number of items returned
- `getPrev()` Type: String Backward pagination token
- `getNext()` Type: String Forward pagination token

Each `PNGetUUIDMetadataResult`:

- `getId()` Type: String Unique user identifier
- `getName()` Type: String Display name
- `getExternalId()` Type: String External system ID
- `getProfileUrl()` Type: String Profile picture URL
- `getEmail()` Type: String Email address
- `getCustom()` Type: stdClass Custom fields

### Get user metadata

Fetch metadata for a single UUID.

#### Method(s)

```
`1getUUIDMetadata()  
2    ->uuid(String)  
3    ->sync()  
`
```

`uuid()` Type: String Default: n/a UUID

#### Sample code

```
1
  

```

#### Response

Returns `PNGetUUIDMetadataResult`:

- `getId()` String
- `getName()` String
- `getExternalId()` String
- `getProfileUrl()` String
- `getEmail()` String
- `getCustom()` stdClass

### Set user metadata

Create or update metadata for a UUID. Use `ifMatchesEtag` to avoid overwriting concurrent updates.

Unsupported partial updates of custom metadata: The `custom` value overwrites the stored value. To add to existing custom data: fetch current, merge locally, then set.

#### Method(s)

```
`1setUUIDMetadata()  
2    ->uuid(String)  
3    ->meta(Array | StdClass)  
4    ->ifMatchesEtag(String)  
5    ->sync()  
`
```

`uuid()` Type: String Default: n/a UUID  
`meta()` Type: Array or StdClass Default: n/a UUID metadata to set.  
`ifMatchesEtag` Type: String Default: n/a Use eTag from a get call; if mismatched, server returns HTTP 412.

UUID metadata fields:
- `name` String Optional
- `externalId` String Optional
- `profileUrl` String Optional
- `email` String Optional
- `custom` Array or StdClass Optional (strings, numbers, booleans; filtering by Custom not supported)

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns `PNSetUUIDMetadataResult`:

- `getId()` String
- `getName()` String
- `getExternalId()` String
- `getProfileUrl()` String
- `getEmail()` String
- `getCustom()` stdClass

### Remove user metadata

Delete metadata for a UUID.

#### Method(s)

```
`1removeUUIDMetadata()  
2    ->uuid(String)  
3    ->sync()  
`
```

`uuid()` Type: String Default: n/a UUID

#### Sample code

```
1
  

```

#### Response

Returns boolean: `true` on success, otherwise `false`.

## Channel

Manage channel metadata: list, fetch, set, and remove.

### Get metadata for all channels

Get a paginated list of channel metadata with optional filters, sorting, and includes.

#### Method(s)

```
`1getAllChannelMetadata()  
2    ->includeFields(Array[String => Boolean])  
3    ->filter(String)  
4    ->sort(String | Array[String])  
5    ->limit(Integer)  
6    ->page(Array[String => String])  
7    ->sync()  
`
```

`includeFields()` Type: Array[String => Boolean] Default: n/a Set `customFields` to include Custom; set `totalCount` to include item count.
`filter()` Type: String Default: n/a Filter expression. See filtering.
`sort()` Type: String or Array[String] Default: n/a Sort by `id`, `name`, `updated` with `asc`/`desc`.
`limit()` Type: integer Default: `100` Default/Max: 100.
`page()` Type: Array[String => String] Default: n/a Use `prev`/`next` tokens.

#### Sample code

```
1
  

```

#### Response

Returns `PNGetAllChannelMetadataResult`:

- `getData()` Type: Array[PNGetChannelMetadataResult]
- `getTotalCount()` Type: Integer
- `getPrev()` Type: String
- `getNext()` Type: String

Each `PNGetChannelMetadataResult`:

- `getId()` String Unique channel identifier
- `getName()` String Display name
- `getDescription()` String Description
- `getCustom()` stdClass Custom fields

### Get channel metadata

Fetch metadata for a single channel.

#### Method(s)

```
`1getChannelMetadata()  
2    ->channel(String)  
3    ->sync()  
`
```

`channel()` Type: String Default: n/a Unique channel identifier

#### Sample code

```
1
  

```

#### Response

Returns `PNGetChannelMetadataResult`:

- `getId()` String
- `getName()` String
- `getDescription()` String
- `getCustom()` stdClass

### Set channel metadata

Create or update metadata for a channel. Use `ifMatchesEtag` to avoid overwriting concurrent updates.

Unsupported partial updates of custom metadata: `custom` value fully overwrites stored value.

#### Method(s)

```
`1setChannelMetadata()  
2    ->channel(String)  
3    ->meta(Array | StdClass)  
4    ->ifMatchesEtag(String)  
5    ->sync()  
`
```

`channel()` Type: String Default: n/a Unique channel identifier  
`meta()` Type: Array or StdClass Default: n/a Channel metadata to set.  
`ifMatchesEtag` Type: String Default: n/a Use eTag from a get call; on mismatch server returns HTTP 412.

Channel metadata fields:
- `name` String Optional
- `description` String Optional
- `custom` Array or StdClass Optional (strings, numbers, booleans; filtering by Custom not supported)

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns `PNSetChannelMetadataResult`:

- `getId()` String
- `getName()` String
- `getDescription()` String
- `getCustom()` stdClass

#### Other examples

```
`1    // Writing the updated object back to the server  
2    $pubnub->setChannelMetadata()  
3        ->channel($channel)  
4        ->meta([  
5            "name" => $response->getName(),  
6            "description" => $response->getDescription(),  
7            "custom" => $custom,  
8        ])  
9        ->sync();  
10    print("Object has been updated.\n");  
`
```

##### Update existing channel metadata

```
1
  

```

### Remove channel metadata

Delete metadata for a channel.

#### Method(s)

```
`1removeChannelMetadata()  
2    ->channel(String)  
3    ->sync()  
`
```

`channel()` Type: String Default: n/a Unique channel identifier

#### Sample code

```
1
  

```

#### Response

Returns boolean: `true` on success, otherwise `false`.

## Channel memberships

Manage the channels a UUID belongs to: list, set, remove, and manage in bulk.

### Get channel memberships

List channel memberships for a UUID.

#### Method(s)

```
`1getMemberships()  
2    ->uuid(String)  
3    ->include(PNMembershipIncludes)  
4    ->filter(String)  
5    ->sort(String | Array[String])  
6    ->limit(Integer)  
7    ->page(Array[String => String])  
8    ->sync();  
`
```

`uuid()` Type: String Default: n/a UUID  
`include()` Type: `PNMembershipIncludes` Default: n/a  
→ `custom` Boolean Default: `False` Include Custom object  
→ `status` Boolean Default: `False` Include status  
→ `type` Boolean Default: `False` Include type  
→ `total_count` Boolean Default: `False` Include total count  
→ `channel` Boolean Default: `False` Include channel fields  
→ `channelCustom` Boolean Default: `False` Include channel Custom  
→ `channelType` Boolean Default: `False` Include channel type  
→ `channelStatus` Boolean Default: `False` Include channel status  
`filter()` Type: String Default: n/a Filter expression  
`sort()` Type: String or Array[String] Default: n/a Sort by `id`, `name`, `updated` with `asc`/`desc`  
`limit()` Type: integer Default: `100` Default/Max: 100  
`page()` Type: Array[String => String] Default: n/a Use `prev`/`next` tokens

#### Sample code

```
1
  

```

#### Response

Returns `PNMembershipsResult`:

- `getData()` Type: Array[PNMembershipsResultItem]
- `getTotalCount()` Type: Integer
- `getPrev()` Type: String
- `getNext()` Type: String

Each `PNMembershipsResultItem`:

- `getChannel()` Type: PNMembership Channel metadata
- `getCustom()` Type: String stdClass with custom fields
- `getUpdated()` Type: String Last updated timestamp
- `getETag()` Type: String Entity tag

`PNMembership` (channel):

- `getId()` String
- `getName()` String
- `getDescription()` String
- `getCustom()` stdClass
- `getUpdated()` String
- `getETag()` String

### Set channel memberships

Replace or add memberships for a UUID.

#### Method(s)

```
`1setMemberships()  
2    ->uuid(String)  
3    ->memberships(Array[PNChannelMembership])  
4    ->custom(Array | StdClass)  
5    ->include(PNMembershipIncludes)  
6    ->filter(String)  
7    ->sort(String | Array[String])  
8    ->limit(Integer)  
9    ->page(Array[String => String])  
10    ->sync();  
`
```

`uuid()` Type: String Default: n/a UUID  
`memberships()` Type: Array[PNChannelMembership] Default: n/a Memberships to set  
`custom()` Type: Array or StdClass Default: n/a Custom JSON values (strings, numbers, booleans)  
`include()` Type: `PNMembershipIncludes` Default: n/a (same include options as above)  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a  
`channels()` Type: Array[String or Array] Default: n/a Channels to add (string channel ID or object with custom data)

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns `PNMembershipsResult` (same structure as Get channel memberships).

### Remove channel memberships

Remove memberships for a UUID.

#### Method(s)

```
`1removeMemberships()  
2    ->uuid(String)  
3    ->memberships(Array[PNChannelMembership])  
4    ->include(PNMembershipIncludes)  
5    ->filter(String)  
6    ->sort(String | Array[String])  
7    ->limit(Integer)  
8    ->page(Array[String => String])  
9    ->sync();  
`
```

`uuid()` Type: String Default: n/a UUID  
`memberships()` Type: Array[PNChannelMembership] Default: n/a Memberships to remove  
`include()` Type: `PNMembershipIncludes` Default: n/a (same include options as above)  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a  
`channels()` Type: Array[String] Default: n/a Channels to remove

#### Sample code

```
1
  

```

#### Response

Returns `PNMembershipsResult` (same structure as Get channel memberships).

### Manage channel memberships

Add and remove memberships for a UUID in one request.

#### Method(s)

```
`1manageMemberships()  
2    ->uuid(String)  
3    ->setMemberships(Array[PNChannelMembership])  
4    ->removeMemberships(Array[PNChannelMembership])  
5    ->include(PNMembershipIncludes)  
6    ->filter(String)  
7    ->sort(String | Array[String])  
8    ->limit(Integer)  
9    ->page(Array[String => String])  
10    ->sync();  
`
```

`uuid()` Type: String Default: n/a Unique user identifier  
`setMemberships()` Type: Array[PNChannelMembership] Default: n/a Memberships to add  
`removeMemberships()` Type: Array[PNChannelMembership] Default: n/a Memberships to remove  
`include()` Type: `PNMembershipIncludes` Default: n/a (same include options as above)  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a

#### Sample code

```
1
  

```

#### Response

Returns `PNMembershipsResult` (same structure as Get channel memberships).

## Channel members

Manage the users in a channel: list, set, remove, and manage in bulk.

### Get channel members

List users in a channel.

#### Method(s)

```
`1getMembers()  
2    ->channel(String)  
3    ->include(PNMemberIncludes)  
4    ->filter(String)  
5    ->sort(String | Array[String])  
6    ->limit(Integer)  
7    ->page(Array[String => String])  
8    ->sync();  
`
```

`channel()` Type: String Default: n/a Unique channel identifier  
`include()` Type: `PNMemberIncludes` Default: n/a  
→ `custom` Boolean Default: `False`  
→ `status` Boolean Default: `False`  
→ `type` Boolean Default: `False`  
→ `total_count` Boolean Default: `False`  
→ `user` Boolean Default: `False`  
→ `userCustom` Boolean Default: `False`  
→ `userType` Boolean Default: `False`  
→ `userStatus` Boolean Default: `False`  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a

#### Sample code

```
1
  

```

#### Response

Returns `PNMembersResult`:

- `getData()` Type: Array[PNMembersResultItem]
- `getTotalCount()` Type: Integer
- `getPrev()` Type: String
- `getNext()` Type: String

Each `PNMembersResultItem`:

- `getUUID()` Type: PNMember UUID metadata
- `getCustom()` Type: String stdClass with custom fields
- `getUpdated()` Type: String
- `getETag()` Type: String

`PNMember` (user):

- `getId()` String
- `getName()` String
- `getExternalId()` String
- `getProfileUrl()` String
- `getEmail()` String
- `getCustom()` stdClass
- `getUpdated()` String
- `getETag()` String

### Set channel members

Set users in a channel.

#### Method(s)

```
`1setMembers()  
2    ->channel(String)  
3    ->uuids(Array[String | Array])  
4    ->custom(Array | StdClass)  
5    ->include(PNMemberIncludes)  
6    ->filter(String)  
7    ->sort(String | Array[String])  
8    ->limit(Integer)  
9    ->page(Array[String => String])  
10    ->sync();  
`
```

`channel()` Type: String Default: n/a  
`uuids()` Type: Array[String or Array] Default: n/a Members to add (string UUID or object with custom)  
`custom()` Type: Array or StdClass Default: n/a Key-value pairs  
`include()` Type: `PNMemberIncludes` Default: n/a (same include options as above)  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns `PNMembersResult` (same structure as Get channel members).

### Remove channel members

Remove users from a channel.

#### Method(s)

```
`1removeMembers()  
2    ->channel(String)  
3    ->members(PNChannelMember[])  
4    ->include(PNMemberIncludes)  
5    ->filter(String)  
6    ->sort(String | Array[String])  
7    ->limit(Integer)  
8    ->page(Array[String => String])  
9    ->sync();  
`
```

`channel()` Type: String Default: n/a  
`members()` Type: PNChannelMember[] Default: n/a Members to remove  
`include()` Type: `PNMemberIncludes` Default: n/a (same include options as above)  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a

#### Sample code

```
1
  

```

#### Response

Returns `PNMembersResult` (same structure as Get channel members).

### Manage channel members

Add and remove users in a channel in one request.

#### Method(s)

```
`1manageMembers()  
2    ->channel(String)  
3    ->setUuids(Array[String])  
4    ->removeUuids(Array[String])  
5    ->setMembers(Array[PNChannelMember])  
6    ->removeMembers(Array[PNChannelMember])  
7    ->custom(Array | StdClass)  
8    ->include(PNMemberIncludes)  
9    ->filter(String)  
10    ->sort(String | Array[String])  
11    ->limit(Integer)  
12    ->page(Array[String => String])  
13    ->sync();  
`
```

`channel()` Type: String Default: n/a Unique channel identifier  
`setUuids()` Type: Array[String] Default: n/a UUIDs to add  
`removeUuids()` Type: Array[String] Default: n/a UUIDs to remove  
`setMembers()` Type: Array[PNChannelMember] Default: n/a Members to add  
`removeMembers()` Type: Array[PNChannelMember] Default: n/a Members to remove  
`custom()` Type: Array or StdClass Default: n/a Custom JSON values  
`include()` Type: `PNMemberIncludes` Default: n/a (same include options as above)  
`filter()` Type: String Default: n/a  
`sort()` Type: String or Array[String] Default: n/a  
`limit()` Type: integer Default: `100`  
`page()` Type: Array[String => String] Default: n/a

#### Sample code

```
1
  

```

#### Response

Returns `PNMembersResult` (same structure as Get channel members).