# App Context API for Go SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. Events are triggered when object data is set, updated, or removed. Making a request to set identical data doesn't trigger an event. Clients can subscribe to these events to update UIs in real time. To upgrade from Objects v1, see the migration guide.

## User

### Get metadata for all users

Returns a paginated list of UUID Metadata objects, optionally including the custom data object.

#### Method(s)

```
`1pn.GetAllUUIDMetadata().  
2    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
3    Sort(sort).  
4    Limit(int).  
5    Count(bool).  
6    Start(string).  
7    End(string).  
8    Filter(string).  
9    Execute()  
`
```

- Include Type: []pubnub.PNUUIDMetadataInclude — Include additional UUID attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.
- Filter Type: string — Filter expression. See filtering.

#### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

#### Response

GetAllUUIDMetadata() returns PNGetAllChannelMetadataResponse:
- Data []PNUUID — See PNUUID.
- TotalCount int — Total objects without pagination.
- Next string — Cursor for forward pagination.
- Prev string — Cursor for backward pagination (ignored if Next is supplied).

### Get user metadata

Returns metadata for the specified UUID, optionally including the custom data object.

#### Method(s)

```
`1pn.PNUUIDMetadataInclude().  
2    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
3    Sort(sort).  
4    ID(string).  
5    Execute()  
`
```

- Include Type: []pubnub.PNUUIDMetadataIncludeCustom — Additional UUID attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- ID Type: string — UUID. If omitted, uses current user UUID.

#### Sample code

```
1
  

```

#### Response

GetUUIDMetadata() returns PNGetUUIDMetadataResponse:
- Data PNUUID — See PNUUID.

### Set user metadata

The custom metadata parameter overwrites existing server-side custom metadata (partial updates aren't supported).

#### Method(s)

```
`1pn.SetUUIDMetadata().  
2    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
3    Sort(sort).  
4    ID(id).  
5    Name(string).  
6    ExternalID(string).  
7    ProfileURL(string).  
8    Email(string).  
9    Custom(map[string]interface{}).  
10    IfMatchETag(string).  
11    Execute()  
`
```

- Include Type: []pubnub.PNUUIDMetadataInclude — Additional attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- ID Type: string — Unique user identifier; defaults to current user's uuid.
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Name Type: string — Display name.
- ExternalID Type: string — External system identifier.
- ProfileURL Type: string — Profile picture URL.
- Email Type: string — Email address.
- Custom Type: map[string]interface{} — Custom JSON values (strings, numbers, booleans). Filtering by Custom isn't supported.
- IfMatchETag Type: string — Provide eTag to ensure conditional update; mismatches return HTTP 412.

##### API limits

For parameter length limits, see REST API docs.

#### Sample code

```
1
  

```

#### Response

SetUUIDMetadata() returns PNSetUUIDMetadataResponse:
- Data PNUUID — See PNUUID.

#### PNUUID

- ID string — Unique user identifier; defaults to current user's uuid.
- Name string — Display name.
- ExternalID string
- ProfileURL string
- Email string
- Custom map[string]interface
- Updated string — Last updated date.
- ETag string
- Status string — Max 50 chars.
- Type string — Max 50 chars.

### Remove user metadata

Removes metadata for a specified UUID.

#### Method(s)

```
`1pn.RemoveUUIDMetadata().  
2    ID(string).  
3    Execute()  
`
```

- ID Type: string — UUID; defaults to current user's uuid.

#### Sample code

```
1
  

```

#### Response

RemoveUUIDMetadata() returns PNRemoveUUIDMetadataResponse:
- Data interface — Empty.

## Channel

### Get metadata for all channels

Returns a paginated list of Channel Metadata objects, optionally including the custom data object.

#### Method(s)

```
`1pn.GetAllChannelMetadata().  
2    Include([]pubnub.PNChannelMetadataInclude).  
3    Sort(sort).  
4    Limit(int).  
5    Count(bool).  
6    Start(string).  
7    End(string).  
8    Filter(string).  
9    Execute()  
`
```

- Include Type: []pubnub.PNChannelMetadataInclude — Additional attributes. Available: pubnub.PNChannelMetadataIncludeCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.
- Filter Type: string — Filter expression. See filtering.

#### Sample code

```
1
  

```

#### Response

GetAllChannelMetadata() returns PNGetAllChannelMetadataResponse:
- Data []PNChannel — See PNChannel.
- TotalCount int
- Next string
- Prev string

### Get channel metadata

Returns metadata for the specified channel, optionally including the custom data object.

#### Method(s)

```
`1pn.GetChannelMetadata().  
2    Include([]pubnub.PNChannelMetadataInclude).  
3     Sort(sort).  
4     ID(string).  
5     Execute()  
`
```

- Include Type: []pubnub.PNChannelMetadataInclude — Additional attributes. Available: pubnub.PNChannelMetadataIncludeCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- ID Type: string — UUID. If not supplied, current user's UUID is used.

#### Sample code

```
1
  

```

#### Response

GetChannelMetadata() returns PNGetChannelMetadataResponse:
- Data PNChannel — See PNChannel.

### Set channel metadata

Custom metadata overwrites existing server-side custom metadata (partial updates aren't supported).

#### Method(s)

```
`1pn.SetChannelMetadata().  
2    Include([]pubnub.PNChannelMetadataInclude).  
3    Sort(sort).  
4    ID(string).  
5    Name(string).  
6    Description(string).  
7    Custom(map[string]interface{}).  
8    IfMatchETag(string).  
9    Execute()  
`
```

- Include Type: []pubnub.PNChannelMetadataInclude — Additional attributes. Available: pubnub.PNChannelMetadataIncludeCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- ID Type: string — Unique user identifier; defaults to current user's uuid.
- Name Type: string — Channel name.
- Description Type: string
- Custom Type: map[string]interface — Custom JSON values. Filtering by Custom isn't supported.
- IfMatchETag Type: string — Conditional update with eTag; mismatches return HTTP 412.

##### API limits

For parameter length limits, see REST API docs.

#### Sample code

```
1
  

```

#### Response

SetChannelMetadata() returns PNSetChannelMetadataResponse:
- Data PNChannel — See PNChannel.

#### PNChannel

- ID string — Unique user identifier; defaults to current user's uuid.
- Name string
- Description string
- Custom map[string]interface
- Updated string — Last updated date.
- ETag string
- Status string — Max 50 chars.
- Type string — Max 50 chars.

#### Other examples

##### Iteratively update existing user metadata

```
1
  

```

##### Iteratively update existing channel metadata

```
1
  

```

### Remove channel metadata

Removes the metadata from a specified channel.

#### Method(s)

```
`1pn.RemoveChannelMetadata().  
2    ID(string).  
3    Execute()  
`
```

- ID Type: string — Unique user identifier; defaults to current user's uuid.

#### Sample code

```
1
  

```

#### Response

RemoveChannelMetadata() returns PNRemoveChannelMetadataResponse:
- Data interface — Empty.

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user (not subscriptions).

#### Method(s)

```
`1pn.GetMemberships().  
2    UUID(string).  
3    Include([]pubnub.PNMembershipsInclude).  
4    Sort(sort).  
5    Limit(int).  
6    Count(bool).  
7    Start(string).  
8    End(string).  
9    Filter(string).  
10    Execute()  
`
```

- UUID Type: string — If omitted, uses current user's UUID.
- Include Type: []pubnub.PNMembershipsInclude — Additional attributes. Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.
- Filter Type: string — Filter expression. See filtering.

#### Sample code

```
1
  

```

#### Response

GetMemberships() returns PNGetMembershipsResponse:
- Data []PNMemberships — See PNMemberships.
- TotalCount int
- Next string
- Prev string

#### PNMemberships

- ID string — Unique user identifier; defaults to current user's uuid.
- Channel PNChannel — See PNChannel.
- Custom map[string]interface
- Updated string — Last updated date.
- ETag string
- Status string — Max 50 chars.
- Type string — Max 50 chars.

### Set channel memberships

Set channel memberships for a UUID.

#### Method(s)

```
`1pn.SetMemberships().  
2    UUID(string).  
3    Set([]pubnub.PNMembershipsSet).  
4    Include([]pubnub.PNMembershipsInclude).  
5    Sort(sort).  
6    Limit(int).  
7    Count(bool).  
8    Start(string).  
9    End(string).  
10    Execute()  
`
```

- UUID Type: string — If omitted, uses current user's UUID.
- Set Type: pubnub.PNMembershipsSet — Items to add for UUID. PNMembershipsSet allows Channel (PNMembershipsChannel with ID string) and Custom map.
- Include Type: []pubnub.PNMembershipsInclude — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.

##### API limits

For parameter length limits, see REST API docs.

#### Sample code

```
1
  

```

#### Response

SetMemberships() returns PNSetMembershipsResponse:
- Data []PNMemberships — See PNMemberships.
- TotalCount int
- Next string
- Prev string

### Remove channel memberships

Remove channel memberships for a UUID.

#### Method(s)

```
`1pn.RemoveMemberships().  
2    UUID(string).  
3    Remove([]pubnub.PNMembershipsRemove).  
4    Include([]pubnub.PNMembershipsInclude).  
5    Limit(int).  
6    Count(bool).  
7    Start(string).  
8    End(string).  
9    Execute()  
`
```

- UUID Type: string — If omitted, uses current user's UUID.
- Remove Type: pubnub.PNMembershipsRemove — Items to remove for UUID. PNMembershipsRemove allows Channel (PNMembershipsChannel with ID string) and Custom map.
- Include Type: []pubnub.PNMembershipsInclude — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.

#### Sample code

```
1
  

```

#### Response

RemoveMemberships() returns PNRemoveMembershipsResponse:
- Data []PNMemberships — See PNMemberships.
- TotalCount int
- Next string
- Prev string

### Manage channel memberships

Manage a UUID's memberships: Add (Set), Remove, and Update.

#### Method(s)

```
`1pn.ManageMemberships().  
2    UUID(string).  
3    Set([]pubnub.PNMembershipsSet).  
4    Remove([]pubnub.PNMembershipsRemove).  
5    Include([]pubnub.PNMembershipsInclude).  
6    Sort(sort).  
7    Limit(int).  
8    Count(bool).  
9    Start(string).  
10    End(string).  
11    Execute()  
`
```

- UUID Type: string — Unique user identifier; defaults to current user's Uuid.
- Set Type: pubnub.PNMembershipsSet — Provide Channel (PNMembershipsChannel with ID string) and Custom map.
- Remove Type: pubnub.PNMembershipsRemove — Provide Channel (PNMembershipsChannel with ID string).
- Include Type: []pubnub.PNMembershipsInclude — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.

#### Sample code

```
1
  

```

#### Response

ManageMemberships() returns PNManageMembershipsResponse:
- Data []PNMemberships — See PNMemberships.
- TotalCount int
- Next string
- Prev string

## Channel members

### Get channel members

Returns a list of members in a channel. Includes user metadata for members with stored metadata.

#### Method(s)

```
`1pn.GetChannelMembers().  
2    Channel(string).  
3    Include(PNChannelMembersInclude).  
4    Sort(sort).  
5    Limit(int).  
6    Count(bool).  
7    Start(string).  
8    End(string).  
9    Filter(string).  
10    Execute()  
`
```

- Channel Type: string — Channel name.
- Include Type: []pubnub.PNChannelMembersInclude — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.
- Filter Type: string — Filter expression. See filtering.

#### Sample code

```
1
  

```

#### Response

GetChannelMembers() returns PNGetChannelMembersResponse:
- Data []PNChannelMembers — See PNChannelMembers.
- TotalCount int
- Next string
- Prev string

#### PNChannelMembers

- ID string — Unique user identifier; defaults to current user's uuid.
- UUID PNUUID — See PNUUID.
- Custom map[string]interface
- Updated string — Last updated date.
- ETag string
- Status string — Max 50 chars.
- Type string — Max 50 chars.

### Set channel members

Sets members in a channel.

#### Method(s)

```
`1pn.SetChannelMembers().  
2    Channel(string).  
3    Set([]pubnub.PNChannelMembersSet).  
4    Include([]pubnub.PNChannelMembersInclude).  
5    Sort(sort).  
6    Limit(int).  
7    Count(bool).  
8    Start(string).  
9    End(string).  
10    Execute()  
`
```

- Channel Type: string — Channel name.
- Set Type: pubnub.PNChannelMembersSet — For the channel, set UUID (PNChannelMembersUUID with ID string) and Custom map.
- Include Type: []pubnub.PNChannelMembersInclude — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.

##### API limits

For parameter length limits, see REST API docs.

#### Sample code

```
1
  

```

#### Response

SetChannelMembers() returns PNSetChannelMembersResponse:
- Data []PNChannelMembers — See PNChannelMembers.
- TotalCount int
- Next string
- Prev string

### Remove channel members

Remove members from a channel.

#### Method(s)

```
`1pn.RemoveChannelMembers().  
2    Channel(string).  
3    Remove([]pubnub.PNChannelMembersRemove{}).  
4    Include([]pubnub.PNChannelMembersInclude).  
5    Limit(int).  
6    Count(bool).  
7    Start(string).  
8    End(string).  
9    Execute()  
`
```

- channel Type: String — Name of channel from which members should be fetched.
- uuids Type: Array — List of UUIDs; each entry has UUID and optional custom (strings/integers).
- sort Type: Array — Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- include Type: Object — Default: { count: true }. Options:
  - count — include how many UUIDs are associated.
  - custom — include additional metadata fields used during UUID metadata set.
- filter Type: String — Filter expression. See filtering.
- start Type: String — Cursor for forward pagination.
- end Type: String — Cursor for backward pagination (ignored if start supplied).
- limit Type: Integer — Default/Max: 100.
- http_sync Type: Boolean — Default: false. Async by default; true returns envelopes synchronously.
- callback Type: Lambda — Callback per envelope (async returns future; call value to block).

#### Sample code

```
1
  

```

#### Response

RemoveChannelMembers() returns PNRemoveChannelMembersResponse:
- Data []PNChannelMembers — See PNChannelMembers.
- TotalCount int
- Next string
- Prev string

### Manage channel members

Set and Remove channel memberships for a user within a channel.

#### Method(s)

```
`1pn.ManageChannelMembers().  
2    Channel(string).  
3    Set([]pubnub.PNChannelMembersSet).  
4    Remove([]pubnub.PNChannelMembersRemove{}).  
5    Include([]pubnub.PNChannelMembersInclude).  
6    Sort(sort).  
7    Limit(int).  
8    Count(bool).  
9    Start(string).  
10    End(string).  
11    Execute()  
`
```

- Channel Type: string — Channel Name.
- Set Type: pubnub.PNChannelMembersSet — Add UUID (PNChannelMembersUUID with ID string) and Custom map.
- Remove Type: pubnub.PNChannelMembersRemove — Remove UUID (PNChannelMembersUUID with ID string).
- Limit Type: int — Default/Max: 100.
- Count Type: bool — Include total count. Default: false.
- Start Type: string — Cursor-based pagination.
- End Type: string — Cursor-based pagination.
- Sort Type: Array — Sort by id, name, updated with asc/desc.
- Include Type: []pubnub.PNChannelMembersInclude — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom

#### Sample code

```
1
  

```

#### Response

ManageChannelMembers() returns PNManageMembersResponse:
- Data []PNChannelMembers — See PNChannelMembers.
- TotalCount int
- Next string
- Prev string