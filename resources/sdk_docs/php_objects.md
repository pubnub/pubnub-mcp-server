# App Context API for PHP SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata, and their membership relationships. PubNub emits events when object data is set, updated, or removed. Setting the same data doesn't trigger events.

## User

Manage UUID metadata.

### Get metadata for all users

Get a paginated list of UUID metadata with filtering and sorting.

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

Parameters:
- includeFields() (Array[String => Boolean]): Include additional fields.
  - customFields: Include the Custom object.
  - totalCount: Include total count (default false).
- filter() (String): Filter expression. See filtering.
- sort() (String | Array[String]): Sort by id, name, updated with asc/desc (for example, name:asc).
- limit() (Integer, default 100, max 100): Number of objects to return.
- page() (Array[String => String]): Cursor-based pagination using prev/next tokens.

#### Sample code

```
1
  

```

#### Response

Returns PNGetAllUUIDMetadataResult:
- getData() (Array[PNGetUUIDMetadataResult]): List of UUID metadata.
- getTotalCount() (Integer): Total items in data.
- getPrev() (String): Token for previous page.
- getNext() (String): Token for next page.

Each PNGetUUIDMetadataResult:
- getId() (String): Unique user identifier.
- getName() (String): Display name.
- getExternalId() (String): External system ID.
- getProfileUrl() (String): Profile image URL.
- getEmail() (String): Email address.
- getCustom() (stdClass): Custom fields.

### Get user metadata

Fetch metadata for a single UUID.

#### Method(s)

```
`1getUUIDMetadata()  
2    ->uuid(String)  
3    ->sync()  
`
```

Parameters:
- uuid() (String, required): UUID.

#### Sample code

```
1
  

```

#### Response

Returns PNGetUUIDMetadataResult:
- getId(), getName(), getExternalId(), getProfileUrl(), getEmail(), getCustom() (stdClass).

### Set user metadata

Create or update metadata for a UUID. Use eTag to prevent overwriting concurrent updates.

Note: Custom metadata is fully replaced on set; partial updates are not supported.

#### Method(s)

```
`1setUUIDMetadata()  
2    ->uuid(String)  
3    ->meta(Array | StdClass)  
4    ->ifMatchesEtag(String)  
5    ->sync()  
`
```

Parameters:
- uuid() (String, required): UUID.
- meta() (Array | StdClass, required): UUID metadata to set.
- ifMatchesEtag (String): Conditional update using eTag; returns HTTP 412 on mismatch.

UUID metadata fields:
- name (String): Display name.
- externalId (String): External system ID.
- profileUrl (String): Profile image URL.
- email (String): Email address.
- custom (Array | StdClass): JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNSetUUIDMetadataResult:
- getId(), getName(), getExternalId(), getProfileUrl(), getEmail(), getCustom() (stdClass).

### Remove user metadata

Delete metadata for a UUID.

#### Method(s)

```
`1removeUUIDMetadata()  
2    ->uuid(String)  
3    ->sync()  
`
```

Parameters:
- uuid() (String, required): UUID.

#### Sample code

```
1
  

```

#### Response

Returns boolean true on success; otherwise false.

## Channel

Manage channel metadata.

### Get metadata for all channels

Get a paginated list of channel metadata.

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

Parameters:
- includeFields() (Array[String => Boolean]): Include additional fields.
  - customFields: Include the Custom object.
  - totalCount: Include total count (default false).
- filter() (String): Filter expression. See filtering.
- sort() (String | Array[String]): Sort by id, name, updated with asc/desc (for example, name:asc).
- limit() (Integer, default 100, max 100): Number of objects to return.
- page() (Array[String => String]): Cursor-based pagination using prev/next tokens.

#### Sample code

```
1
  

```

#### Response

Returns PNGetAllChannelMetadataResult:
- getData() (Array[PNGetChannelMetadataResult]).
- getTotalCount() (Integer).
- getPrev() (String).
- getNext() (String).

Each PNGetChannelMetadataResult:
- getId() (String): Channel ID.
- getName() (String): Display name.
- getDescription() (String): Description.
- getCustom() (stdClass): Custom fields.

### Get channel metadata

Fetch metadata for a single channel.

#### Method(s)

```
`1getChannelMetadata()  
2    ->channel(String)  
3    ->sync()  
`
```

Parameters:
- channel() (String, required): Channel ID.

#### Sample code

```
1
  

```

#### Response

Returns PNGetChannelMetadataResult:
- getId(), getName(), getDescription(), getCustom() (stdClass).

### Set channel metadata

Create or update metadata for a channel. Use eTag to prevent overwriting concurrent updates.

Note: Custom metadata is fully replaced on set; partial updates are not supported.

#### Method(s)

```
`1setChannelMetadata()  
2    ->channel(String)  
3    ->meta(Array | StdClass)  
4    ->ifMatchesEtag(String)  
5    ->sync()  
`
```

Parameters:
- channel() (String, required): Channel ID.
- meta() (Array | StdClass, required): Channel metadata to set.
- ifMatchesEtag (String): Conditional update using eTag; returns HTTP 412 on mismatch.

Channel metadata fields:
- name (String): Display name.
- description (String): Description.
- custom (Array | StdClass): JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNSetChannelMetadataResult:
- getId() (String), getName() (String), getDescription() (String), getCustom() (stdClass).

#### Other examples

```
1
  

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

Parameters:
- channel() (String, required): Channel ID.

#### Sample code

```
1
  

```

#### Response

Returns boolean true on success; otherwise false.

## Channel memberships

Manage channels a UUID belongs to.

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

Parameters:
- uuid() (String, required): UUID.
- include() (PNMembershipIncludes): Include additional fields:
  - custom (Boolean, default False): Include Custom object.
  - status (Boolean, default False): Include status.
  - type (Boolean, default False): Include type.
  - total_count (Boolean, default False): Include total count.
  - channel (Boolean, default False): Include channel fields.
  - channelCustom (Boolean, default False): Include channel Custom.
  - channelType (Boolean, default False): Include channel type.
  - channelStatus (Boolean, default False): Include channel status.
- filter() (String): Filter expression. See filtering.
- sort() (String | Array[String]): Sort by id, name, updated with asc/desc.
- limit() (Integer, default 100, max 100).
- page() (Array[String => String]): Cursor-based pagination using prev/next tokens.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult:
- getData() (Array[PNMembershipsResultItem]).
- getTotalCount() (Integer).
- getPrev() (String).
- getNext() (String).

PNMembershipsResultItem:
- getChannel() (PNMembership): Channel metadata.
- getCustom() (String | stdClass): Custom fields.
- getUpdated() (String): Last updated timestamp.
- getETag() (String): ETag.

PNMembership:
- getId() (String), getName() (String), getDescription() (String), getCustom() (stdClass), getUpdated() (String), getETag() (String).

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

Parameters:
- uuid() (String, required): UUID.
- memberships() (Array[PNChannelMembership], required): Memberships to set.
- custom() (Array | StdClass): JSON values (strings, numbers, booleans).
- include() (PNMembershipIncludes): Same include options as Get channel memberships.
- filter(), sort(), limit(), page(): Same as above.
- channels() (Array[String or Array], required): Channels to add; items can be channel ID strings or objects with custom data.

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult (fields as in Get channel memberships).

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

Parameters:
- uuid() (String, required): UUID.
- memberships() (Array[PNChannelMembership], required): Memberships to remove.
- include() (PNMembershipIncludes): Same include options as above.
- filter(), sort(), limit(), page(): Same as above.
- channels() (Array[String], required): Channels to remove.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult (fields as in Get channel memberships).

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

Parameters:
- uuid() (String, required): User identifier whose memberships to manage.
- setMemberships() (Array[PNChannelMembership]): Memberships to add.
- removeMemberships() (Array[PNChannelMembership]): Memberships to remove.
- include() (PNMembershipIncludes): Same include options as above.
- filter(), sort(), limit(), page(): Same as above.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult (fields as in Get channel memberships).

## Channel members

Manage users in a channel.

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

Parameters:
- channel() (String, required): Channel ID.
- include() (PNMemberIncludes): Include additional fields:
  - custom (Boolean, default False), status (Boolean, default False), type (Boolean, default False), total_count (Boolean, default False),
  - user (Boolean, default False), userCustom (Boolean, default False), userType (Boolean, default False), userStatus (Boolean, default False).
- filter() (String): See filtering.
- sort() (String | Array[String]): Sort by id, name, updated with asc/desc.
- limit() (Integer, default 100, max 100).
- page() (Array[String => String]): Cursor-based pagination using prev/next tokens.

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult:
- getData() (Array[PNMembersResultItem]).
- getTotalCount() (Integer).
- getPrev() (String).
- getNext() (String).

PNMembersResultItem:
- getUUID() (PNMember): User metadata.
- getCustom() (String | stdClass): Custom fields.
- getUpdated() (String): Last updated timestamp.
- getETag() (String): ETag.

PNMember (user):
- getId() (String), getName() (String), getExternalId() (String), getProfileUrl() (String), getEmail() (String), getCustom() (stdClass), getUpdated() (String), getETag() (String).

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

Parameters:
- channel() (String, required): Channel ID.
- uuids() (Array[String | Array], required): Members to add; items can be UUID strings or objects with custom.
- custom() (Array | StdClass): Key-value pairs.
- include() (PNMemberIncludes): Same include options as Get channel members.
- filter(), sort(), limit(), page(): Same as above.

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult (fields as in Get channel members).

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

Parameters:
- channel() (String, required): Channel ID.
- members() (PNChannelMember[], required): Members to remove.
- include() (PNMemberIncludes): Same include options as above.
- filter(), sort(), limit(), page(): Same as above.

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult (fields as in Get channel members).

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

Parameters:
- channel() (String, required): Channel ID.
- setUuids() (Array[String]): UUIDs to add.
- removeUuids() (Array[String]): UUIDs to remove.
- setMembers() (Array[PNChannelMember]): Members to add.
- removeMembers() (Array[PNChannelMember]): Members to remove.
- custom() (Array | StdClass): JSON values.
- include() (PNMemberIncludes): Same include options as above.
- filter(), sort(), limit(), page(): Same as above.

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult (fields as in Get channel members).

Last updated on Nov 6, 2025