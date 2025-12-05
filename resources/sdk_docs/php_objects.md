# App Context API for PHP SDK

App Context (Objects v2) stores user (UUID) and channel metadata and their relationships. Changes to objects (set, update, remove) emit real-time events. Setting identical data doesn't trigger events. For upgrading from Objects v1, see the migration guide.

## User

Manage UUID metadata: list, fetch, set, remove.

### Get metadata for all users

Get a paginated list of UUID metadata with optional filtering/sorting.

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

Parameters
- includeFields(Array[String => Boolean]): Include additional fields.
  - customFields: include Custom object.
  - totalCount: include total count (default false).
- filter(String): Filter expression. See filtering.
- sort(String | Array[String]): Sort by id, name, updated, with asc/desc (for example, name:asc).
- limit(Integer): Number of objects. Default/Max: 100.
- page(Array[String => String]): Cursor-based pagination with prev/next tokens.

#### Sample code
```
1
  

```

#### Response
Returns PNGetAllUUIDMetadataResult:
- getData(): Array[PNGetUUIDMetadataResult]
- getTotalCount(): Integer
- getPrev(): String (prev page cursor)
- getNext(): String (next page cursor)

PNGetUUIDMetadataResult items:
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

Parameters
- uuid(String) required: UUID.

#### Sample code
```
1
  

```

#### Response
Returns PNGetUUIDMetadataResult (fields as above).

### Set user metadata

Create or update metadata for a UUID. Use eTag for concurrency control.

Unsupported partial updates of custom metadata
- Custom passed to this method replaces server-side custom entirely.

#### Method(s)
```
`1setUUIDMetadata()  
2    ->uuid(String)  
3    ->meta(Array | StdClass)  
4    ->ifMatchesEtag(String)  
5    ->sync()  
`
```

Parameters
- uuid(String) required: UUID.
- meta(Array | StdClass) required: UUID metadata to set.
- ifMatchesEtag(String): Supply eTag from a prior get to avoid overwriting concurrent changes. If different, server returns HTTP 412.

UUID metadata fields
- name (String)
- externalId (String)
- profileUrl (String)
- email (String)
- custom (Array | StdClass): JSON values (strings, numbers, booleans). Filtering by custom isn’t supported.

API limits
- See REST API docs for parameter limits.

#### Sample code
```
1
  

```

#### Response
Returns PNSetUUIDMetadataResult:
- getId(), getName(), getExternalId(), getProfileUrl(), getEmail(), getCustom()

### Remove user metadata

Delete metadata for a UUID.

#### Method(s)
```
`1removeUUIDMetadata()  
2    ->uuid(String)  
3    ->sync()  
`
```

Parameters
- uuid(String) required: UUID.

#### Sample code
```
1
  

```

#### Response
- Boolean: true on success, otherwise false.

## Channel

Manage channel metadata: list, fetch, set, remove.

### Get metadata for all channels

Paginated list with optional filtering/sorting.

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

Parameters
- includeFields(Array[String => Boolean]):
  - customFields: include Custom object.
  - totalCount: include total count (default false).
- filter(String): See filtering.
- sort(String | Array[String]): id, name, updated with asc/desc.
- limit(Integer): Default/Max 100.
- page(Array[String => String]): Cursor prev/next.

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

PNGetChannelMetadataResult items:
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

Parameters
- channel(String) required: Unique channel identifier.

#### Sample code
```
1
  

```

#### Response
Returns PNGetChannelMetadataResult (fields as above).

### Set channel metadata

Create or update metadata for a channel. Use eTag for concurrency control.

Unsupported partial updates of custom metadata
- Custom passed replaces server-side custom entirely.

#### Method(s)
```
`1setChannelMetadata()  
2    ->channel(String)  
3    ->meta(Array | StdClass)  
4    ->ifMatchesEtag(String)  
5    ->sync()  
`
```

Parameters
- channel(String) required
- meta(Array | StdClass) required: Channel metadata to set.
- ifMatchesEtag(String): Use eTag to avoid overwriting concurrent changes (HTTP 412 on mismatch).

Channel metadata fields
- name (String)
- description (String)
- custom (Array | StdClass): JSON values (strings, numbers, booleans). Filtering by custom isn’t supported.

API limits
- See REST API docs for parameter limits.

#### Sample code
```
1
  

```

#### Response
Returns PNSetChannelMetadataResult:
- getId(), getName(), getDescription(), getCustom()

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

Parameters
- channel(String) required

#### Sample code
```
1
  

```

#### Response
- Boolean: true on success, otherwise false.

## Channel memberships

Manage channels a UUID belongs to.

### Get channel memberships

List channel memberships for a UUID (not subscriptions).

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

Parameters
- uuid(String) required
- include(PNMembershipIncludes):
  - custom (Boolean, default false)
  - status (Boolean, default false)
  - type (Boolean, default false)
  - total_count (Boolean, default false)
  - channel (Boolean, default false)
  - channelCustom (Boolean, default false)
  - channelType (Boolean, default false)
  - channelStatus (Boolean, default false)
- filter(String): See filtering.
- sort(String | Array[String]): id, name, updated with asc/desc.
- limit(Integer): Default/Max 100.
- page(Array[String => String]): Cursor prev/next.

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

PNMembershipsResultItem:
- getChannel(): PNMembership
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

PNMembership (channel):
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

Parameters
- uuid(String) required
- memberships(Array[PNChannelMembership]) required
- custom(Array | StdClass): JSON values (strings, numbers, booleans).
- include(PNMembershipIncludes): Same as getMemberships.
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max 100
- page(Array[String => String])
- channels(Array[String or Array]): Channels to add (strings or objects with custom). 

API limits
- See REST API docs for parameter limits.

#### Sample code
```
1
  

```

#### Response
Returns PNMembershipsResult (same schema as getMemberships).

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

Parameters
- uuid(String) required
- memberships(Array[PNChannelMembership]) required
- include(PNMembershipIncludes)
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max 100
- page(Array[String => String])
- channels(Array[String]): Channels to remove.

#### Sample code
```
1
  

```

#### Response
Returns PNMembershipsResult (same schema as getMemberships).

### Manage channel memberships

Add and remove memberships in one request.

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

Parameters
- uuid(String) required: User whose memberships to manage.
- setMemberships(Array[PNChannelMembership])
- removeMemberships(Array[PNChannelMembership])
- include(PNMembershipIncludes)
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max 100
- page(Array[String => String])

#### Sample code
```
1
  

```

#### Response
Returns PNMembershipsResult (same schema as getMemberships).

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

Parameters
- channel(String) required
- include(PNMemberIncludes):
  - custom, status, type, total_count (Boolean, default false)
  - user, userCustom, userType, userStatus (Boolean, default false)
- filter(String): See filtering.
- sort(String | Array[String]): id, name, updated with asc/desc.
- limit(Integer): Default/Max 100.
- page(Array[String => String]): Cursor prev/next.

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

PNMembersResultItem:
- getUUID(): PNMember
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

PNMember (user):
- getId(): String
- getName(): String
- getExternalId(): String
- getProfileUrl(): String
- getEmail(): String
- getCustom(): stdClass
- getUpdated(): String
- getETag(): String

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

Parameters
- channel(String) required
- uuids(Array[String | Array]) required: Strings (UUID only) or objects (can include custom).
- custom(Array | StdClass) required: Key-value pairs with supported types.
- include(PNMemberIncludes)
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max 100
- page(Array[String => String])

API limits
- See REST API docs for parameter limits.

#### Sample code
```
1
  

```

#### Response
Returns PNMembersResult (same schema as get channel members).

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

Parameters
- channel(String) required
- members(PNChannelMember[]) required
- include(PNMemberIncludes)
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max 100
- page(Array[String => String])

#### Sample code
```
1
  

```

#### Response
Returns PNMembersResult (same schema as get channel members).

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

Parameters
- channel(String) required
- setUuids(Array[String])
- removeUuids(Array[String])
- setMembers(Array[PNChannelMember])
- removeMembers(Array[PNChannelMember])
- custom(Array | StdClass): JSON values.
- include(PNMemberIncludes)
- filter(String)
- sort(String | Array[String])
- limit(Integer): Default/Max 100
- page(Array[String => String])

#### Sample code
```
1
  

```

#### Response
Returns PNMembersResult (same schema as get channel members).