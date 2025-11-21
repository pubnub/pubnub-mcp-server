# App Context API for PHP SDK

App Context (Objects v2) provides serverless storage for user and channel metadata and their memberships. Clients can subscribe to real-time events when data is set, updated, or removed.

## User

Manage UUID metadata: list, fetch, set, and remove.

### Get metadata for all users

Get a paginated list of UUID metadata.

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
- includeFields(Array[String => Boolean]): Include additional fields. Set customFields to include Custom; totalCount to include total count (default false).
- filter(String): Filter expression. See filtering.
- sort(String | Array[String]): Sort by id, name, updated with asc/desc (for example, name:asc).
- limit(Integer): Number of objects to return. Default/Max: 100.
- page(Array[String => String]): Cursor pagination using prev/next tokens.

#### Sample code

```
1
  

```

#### Response

Returns PNGetAllUUIDMetadataResult:
- getData(): Array[PNGetUUIDMetadataResult]
- getTotalCount(): Integer
- getPrev(): String
- getNext(): String

PNGetUUIDMetadataResult fields:
- getId(): String
- getName(): String
- getExternalId(): String
- getProfileUrl(): String
- getEmail(): String
- getCustom(): stdClass

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
- uuid(String) required: UUID.

#### Sample code

```
1
  

```

#### Response

Returns PNGetUUIDMetadataResult:
- getId(): String
- getName(): String
- getExternalId(): String
- getProfileUrl(): String
- getEmail(): String
- getCustom(): stdClass

### Set user metadata

Create or update metadata for a UUID. Custom overwrites the stored value; partial updates of custom are not supported. Use eTag to prevent overwriting concurrent changes.

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
- uuid(String) required: UUID.
- meta(Array | StdClass) required: UUID metadata to set.
- ifMatchesEtag(String): Apply update only if eTag matches; otherwise HTTP 412.

UUID metadata fields:
- name (String, optional)
- externalId (String, optional)
- profileUrl (String, optional)
- email (String, optional)
- custom (Array or StdClass, optional). Filtering by custom isn’t supported.

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNSetUUIDMetadataResult:
- getId(): String
- getName(): String
- getExternalId(): String
- getProfileUrl(): String
- getEmail(): String
- getCustom(): stdClass

### Remove user metadata

Delete metadata for the specified UUID.

#### Method(s)

```
`1removeUUIDMetadata()  
2    ->uuid(String)  
3    ->sync()  
`
```

Parameters:
- uuid(String) required: UUID.

#### Sample code

```
1
  

```

#### Response

Boolean: true on success; otherwise false.

## Channel

Manage channel metadata: list, fetch, set, and remove.

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
- includeFields(Array[String => Boolean]): Include additional fields. Set customFields to include Custom; totalCount to include total count (default false).
- filter(String): Filter expression. See filtering.
- sort(String | Array[String]): Sort by id, name, updated with asc/desc (for example, name:asc).
- limit(Integer): Number of objects to return. Default/Max: 100.
- page(Array[String => String]): Cursor pagination using prev/next tokens.

#### Sample code

```
1
  

```

#### Response

Returns PNGetAllChannelMetadataResult:
- getData(): Array[PNGetChannelMetadataResult]
- getTotalCount(): Integer
- getPrev(): String
- getNext(): String

PNGetChannelMetadataResult fields:
- getId(): String
- getName(): String
- getDescription(): String
- getCustom(): stdClass

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
- channel(String) required: Unique channel identifier.

#### Sample code

```
1
  

```

#### Response

Returns PNGetChannelMetadataResult:
- getId(): String
- getName(): String
- getDescription(): String
- getCustom(): stdClass

### Set channel metadata

Create or update metadata for a channel. Custom overwrites the stored value; partial updates of custom are not supported. Use eTag to prevent overwriting concurrent changes.

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
- channel(String) required: Unique channel identifier.
- meta(Array | StdClass) required: Channel metadata to set.
- ifMatchesEtag(String): Apply update only if eTag matches; otherwise HTTP 412.

Channel metadata fields:
- name (String, optional)
- description (String, optional)
- custom (Array or StdClass, optional). Filtering by custom isn’t supported.

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNSetChannelMetadataResult:
- getId(): String
- getName(): String
- getDescription(): String
- getCustom(): stdClass

#### Other examples

```
1
  

```

##### Update existing channel metadata

```
1
  

```

### Remove channel metadata

Delete metadata for the specified channel.

#### Method(s)

```
`1removeChannelMetadata()  
2    ->channel(String)  
3    ->sync()  
`
```

Parameters:
- channel(String) required: Unique channel identifier.

#### Sample code

```
1
  

```

#### Response

Boolean: true on success; otherwise false.

## Channel memberships

Manage channels a UUID belongs to: list, set, remove, and manage in bulk.

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
- uuid(String) required: UUID.
- include(PNMembershipIncludes):
  - custom (Boolean, default False)
  - status (Boolean, default False)
  - type (Boolean, default False)
  - total_count (Boolean, default False)
  - channel (Boolean, default False)
  - channelCustom (Boolean, default False)
  - channelType (Boolean, default False)
  - channelStatus (Boolean, default False)
- filter(String): Filter expression. See filtering.
- sort(String | Array[String]): Sort by id, name, updated with asc/desc.
- limit(Integer): Default/Max: 100.
- page(Array[String => String]): Cursor pagination with prev/next.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult:
- getData(): Array[PNMembershipsResultItem]
- getTotalCount(): Integer
- getPrev(): String
- getNext(): String

PNMembershipsResultItem fields:
- getChannel(): PNMembership
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

PNMembership fields:
- getId(): String
- getName(): String
- getDescription(): String
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

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
- uuid(String) required: UUID.
- memberships(Array[PNChannelMembership]) required: Memberships to set.
- custom(Array | StdClass): Custom JSON values.
- include(PNMembershipIncludes): Same flags as Get channel memberships.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max: 100.
- page(Array[String => String])
- channels(Array[String or Array]) required: Channels to add (string channel IDs or objects with custom).

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult with the same structure as Get channel memberships.

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
- uuid(String) required: UUID.
- memberships(Array[PNChannelMembership]) required: Memberships to remove.
- include(PNMembershipIncludes): Same flags as Get channel memberships.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max: 100.
- page(Array[String => String])
- channels(Array[String]) required: Channel IDs to remove.

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult with the same structure as Get channel memberships.

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
- uuid(String) required: Unique user identifier.
- setMemberships(Array[PNChannelMembership]): Memberships to add.
- removeMemberships(Array[PNChannelMembership]): Memberships to remove.
- include(PNMembershipIncludes): Same flags as Get channel memberships.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max: 100.
- page(Array[String => String])

#### Sample code

```
1
  

```

#### Response

Returns PNMembershipsResult with the same structure as Get channel memberships.

## Channel members

Manage users in a channel: list, set, remove, and manage in bulk.

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
- channel(String) required: Unique channel identifier.
- include(PNMemberIncludes):
  - custom (Boolean, default False)
  - status (Boolean, default False)
  - type (Boolean, default False)
  - total_count (Boolean, default False)
  - user (Boolean, default False)
  - userCustom (Boolean, default False)
  - userType (Boolean, default False)
  - userStatus (Boolean, default False)
- filter(String)
- sort(String | Array[String]): Sort by id, name, updated with asc/desc.
- limit(Integer): Default/Max: 100.
- page(Array[String => String])

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult:
- getData(): Array[PNMembersResultItem]
- getTotalCount(): Integer
- getPrev(): String
- getNext(): String

PNMembersResultItem fields:
- getUUID(): PNMember
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

PNMember fields:
- getId(): String
- getName(): String
- getExternalId(): String
- getProfileUrl(): String
- getEmail(): String
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

### Set channel members

Add users to a channel.

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
- channel(String) required: Unique channel identifier.
- uuids(Array[String | Array]) required: Members to add (UUID strings or objects with custom).
- custom(Array | StdClass): Key-value pairs.
- include(PNMemberIncludes): Same flags as Get channel members.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max: 100.
- page(Array[String => String])

API limits: See REST API docs.

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult with the same structure as Get channel members.

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
- channel(String) required: Unique channel identifier.
- members(PNChannelMember[]) required: Members to remove.
- include(PNMemberIncludes): Same flags as Get channel members.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max: 100.
- page(Array[String => String])

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult with the same structure as Get channel members.

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
- channel(String) required: Unique channel identifier.
- setUuids(Array[String]): UUIDs to add.
- removeUuids(Array[String]): UUIDs to remove.
- setMembers(Array[PNChannelMember]): Members to add.
- removeMembers(Array[PNChannelMember]): Members to remove.
- custom(Array | StdClass): Custom JSON values.
- include(PNMemberIncludes): Same flags as Get channel members.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max: 100.
- page(Array[String => String])

#### Sample code

```
1
  

```

#### Response

Returns PNMembersResult with the same structure as Get channel members.