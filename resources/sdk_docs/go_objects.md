# App Context API for Go SDK

App Context (Objects v2) provides serverless storage for user and channel metadata and their memberships. PubNub triggers events when object data is set, updated, or removed. Setting the same data that already exists doesn't trigger an event.

## User

### Get metadata for all users

Returns a paginated list of UUID metadata, optionally including custom data.

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

#### Parameters
- Include (Type: []pubnub.PNUUIDMetadataInclude): Include additional UUID attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Limit (Type: int): Number of objects to return. Default/Max: 100.
- Count (Type: bool): Include total count. Default: false.
- Start (Type: string): Cursor for forward pagination.
- End (Type: string): Cursor for backward pagination.
- Filter (Type: string): Filter expression. See filtering.

#### Sample code
```
1
  

```

#### Response
Operation: GetAllUUIDMetadata() → PNGetAllChannelMetadataResponse
- Data ([]PNUUID): See PNUUID
- TotalCount (int)
- Next (string): Cursor for next page.
- Prev (string): Cursor for previous page (ignored if Next is supplied).

### Get user metadata

Returns metadata for the specified UUID, optionally including custom data.

#### Method(s)
```
`1pn.PNUUIDMetadataInclude().  
2    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
3    Sort(sort).  
4    ID(string).  
5    Execute()  
`
```

#### Parameters
- Include (Type: []pubnub.PNUUIDMetadataIncludeCustom): Additional UUID attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- ID (Type: string): Target UUID. If not supplied, uses the current user's UUID.

#### Sample code
```
1
  

```

#### Response
Operation: GetUUIDMetadata() → PNGetUUIDMetadataResponse
- Data (PNUUID): See PNUUID

### Set user metadata

Sets metadata for a UUID, optionally including custom data.

Note: Custom metadata updates overwrite stored values; partial updates of custom are not supported.

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

#### Parameters
- Include (Type: []pubnub.PNUUIDMetadataInclude): Additional UUID attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- ID (Type: string): Unique user identifier. If not supplied, current user's uuid is used.
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Name (Type: string): Display name.
- ExternalID (Type: string): External system identifier.
- ProfileURL (Type: string): Profile picture URL.
- Email (Type: string)
- Custom (Type: map[string]interface{}): Strings, numbers, booleans. Filtering by Custom isn't supported.
- IfMatchETag (Type: string): ETag for conditional updates; mismatch returns HTTP 412.

API limits: See REST API docs for set-user-metadata.

#### Sample code
```
1
  

```

#### Response
Operation: SetUUIDMetadata() → PNSetUUIDMetadataResponse
- Data (PNUUID): See PNUUID

#### PNUUID
- ID (string): Unique user identifier (defaults to current user's uuid).
- Name (string)
- ExternalID (string)
- ProfileURL (string)
- Email (string)
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string): Max 50 chars.
- Type (string): Max 50 chars.

### Remove user metadata

Removes metadata for a specified UUID.

#### Method(s)
```
`1pn.RemoveUUIDMetadata().  
2    ID(string).  
3    Execute()  
`
```

#### Parameters
- ID (Type: string): Unique user identifier. Defaults to current user's uuid if not supplied.

#### Sample code
```
1
  

```

#### Response
Operation: RemoveUUIDMetadata() → PNRemoveUUIDMetadataResponse
- Data (interface): Empty.

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata, optionally including custom data.

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

#### Parameters
- Include (Type: []pubnub.PNChannelMetadataInclude): Additional attributes. Available: pubnub.PNChannelMetadataIncludeCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Limit (Type: int): Default/Max 100.
- Count (Type: bool): Include total count. Default: false.
- Start (Type: string): Forward pagination cursor.
- End (Type: string): Backward pagination cursor.
- Filter (Type: string): See filtering.

#### Sample code
```
1
  

```

#### Response
Operation: GetAllChannelMetadata() → PNGetAllChannelMetadataResponse
- Data ([]PNChannel): See PNChannel
- TotalCount (int)
- Next (string)
- Prev (string)

### Get channel metadata

Returns metadata for the specified channel.

#### Method(s)
```
`1pn.GetChannelMetadata().  
2    Include([]pubnub.PNChannelMetadataInclude).  
3     Sort(sort).  
4     ID(string).  
5     Execute()  
`
```

#### Parameters
- Include (Type: []pubnub.PNChannelMetadataInclude): Available: pubnub.PNChannelMetadataIncludeCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- ID (Type: string): Channel ID.

#### Sample code
```
1
  

```

#### Response
Operation: GetChannelMetadata() → PNGetChannelMetadataResponse
- Data (PNChannel): See PNChannel

### Set channel metadata

Sets metadata for a channel, optionally including custom data.

Note: Custom metadata updates overwrite stored values; partial updates of custom are not supported.

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

#### Parameters
- Include (Type: []pubnub.PNChannelMetadataInclude): Available: pubnub.PNChannelMetadataIncludeCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- ID (Type: string): Channel ID.
- Name (Type: string): Channel name.
- Description (Type: string)
- Custom (Type: map[string]interface{}): Strings, numbers, booleans. Filtering by Custom isn't supported.
- IfMatchETag (Type: string): ETag for conditional updates; mismatch returns HTTP 412.

API limits: See REST API docs for set-channel-metadata.

#### Sample code
```
1
  

```

#### Response
Operation: SetChannelMetadata() → PNSetChannelMetadataResponse
- Data (PNChannel): See PNChannel

#### PNChannel
- ID (string)
- Name (string)
- Description (string)
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string): Max 50 chars.
- Type (string): Max 50 chars.

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

Removes metadata for a specified channel.

#### Method(s)
```
`1pn.RemoveChannelMetadata().  
2    ID(string).  
3    Execute()  
`
```

#### Parameters
- ID (Type: string): Channel ID.

#### Sample code
```
1
  

```

#### Response
Operation: RemoveChannelMetadata() → PNRemoveChannelMetadataResponse
- Data (interface): Empty.

## Channel memberships

Memberships are the channels a user belongs to.

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

#### Parameters
- UUID (Type: string): Target UUID (defaults to current user's).
- Include (Type: []pubnub.PNMembershipsInclude): Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Limit (Type: int): Default/Max 100.
- Count (Type: bool): Include total count. Default: false.
- Start (Type: string): Forward pagination cursor.
- End (Type: string): Backward pagination cursor.
- Filter (Type: string): See filtering.

#### Sample code
```
1
  

```

#### Response
Operation: GetMemberships() → PNGetMembershipsResponse
- Data ([]PNMemberships): See PNMemberships
- TotalCount (int)
- Next (string)
- Prev (string)

#### PNMemberships
- ID (string)
- Channel (PNChannel): See PNChannel
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string): Max 50 chars.
- Type (string): Max 50 chars.

### Set channel memberships

Sets channel memberships for a UUID.

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

#### Parameters
- UUID (Type: string): Target UUID (defaults to current user's).
- Set (Type: pubnub.PNMembershipsSet): Each item includes Channel (PNMembershipsChannel with ID string) and Custom map.
- Include (Type: []pubnub.PNMembershipsInclude): Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Limit (Type: int): Default/Max 100.
- Count (Type: bool)
- Start (Type: string)
- End (Type: string)

API limits: See REST API docs for set-membership-metadata.

#### Sample code
```
1
  

```

#### Response
Operation: SetMemberships() → PNSetMembershipsResponse
- Data ([]PNMemberships): See PNMemberships
- TotalCount (int)
- Next (string)
- Prev (string)

### Remove channel memberships

Removes channel memberships for a UUID.

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

#### Parameters
- UUID (Type: string): Target UUID (defaults to current user's).
- Remove (Type: pubnub.PNMembershipsRemove): Each item includes Channel (PNMembershipsChannel with ID string) and a Custom map.
- Include (Type: []pubnub.PNMembershipsInclude): Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Limit (Type: int): Default/Max 100.
- Count (Type: bool)
- Start (Type: string)
- End (Type: string)

#### Sample code
```
1
  

```

#### Response
Operation: RemoveMemberships() → PNRemoveMembershipsResponse
- Data ([]PNMemberships): See PNMemberships
- TotalCount (int)
- Next (string)
- Prev (string)

### Manage channel memberships

Add, remove, and update memberships for a UUID.

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

#### Parameters
- UUID (Type: string): Unique user identifier (defaults to current user's Uuid).
- Set (Type: pubnub.PNMembershipsSet): Channel (PNMembershipsChannel with ID string) and Custom map.
- Remove (Type: pubnub.PNMembershipsRemove): Channel (PNMembershipsChannel with ID string).
- Include (Type: []pubnub.PNMembershipsInclude): Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Limit (Type: int): Default/Max 100.
- Count (Type: bool)
- Start (Type: string)
- End (Type: string)

#### Sample code
```
1
  

```

#### Response
Operation: ManageMemberships() → PNManageMembershipsResponse
- Data ([]PNMemberships): See PNMemberships
- TotalCount (int)
- Next (string)
- Prev (string)

## Channel members

Members are users within a specific channel.

### Get channel members

Returns a list of users who are members of a channel. Can include user metadata.

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

#### Parameters
- Channel (Type: string): Channel name.
- Include (Type: []pubnub.PNChannelMembersInclude): Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Limit (Type: int): Default/Max 100.
- Count (Type: bool): Include total count. Default: false.
- Start (Type: string)
- End (Type: string)
- Filter (Type: string): See filtering.

#### Sample code
```
1
  

```

#### Response
Operation: GetChannelMembers() → PNGetChannelMembersResponse
- Data ([]PNChannelMembers): See PNChannelMembers
- TotalCount (int)
- Next (string)
- Prev (string)

#### PNChannelMembers
- ID (string)
- UUID (PNUUID): See PNUUID
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string): Max 50 chars.
- Type (string): Max 50 chars.

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

#### Parameters
- Channel (Type: string): Channel name.
- Set (Type: pubnub.PNChannelMembersSet): Each item includes UUID (PNChannelMembersUUID with ID string) and Custom map.
- Include (Type: []pubnub.PNChannelMembersInclude): Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Limit (Type: int): Default/Max 100.
- Count (Type: bool)
- Start (Type: string)
- End (Type: string)

API limits: See REST API docs for set-channel-members-metadata.

#### Sample code
```
1
  

```

#### Response
Operation: SetChannelMembers() → PNSetChannelMembersResponse
- Data ([]PNChannelMembers): See PNChannelMembers
- TotalCount (int)
- Next (string)
- Prev (string)

### Remove channel members

Removes members from a channel.

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

#### Parameters
- channel (Type: String): Name of channel.
- uuids (Type: Array): List of UUID entries with UUID and optional custom (strings/integers).
- sort (Type: Array): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- include (Type: Object): Additional info; { count: true } by default. Options: count, custom.
- filter (Type: String): Expression to filter results. See filtering.
- start (Type: String): Forward pagination cursor.
- end (Type: String): Backward pagination cursor (ignored if start supplied).
- limit (Type: Integer): Default/Max 100.
- http_sync (Type: Boolean): Async by default; if true, returns envelopes synchronously.
- callback (Type: Lambda): Callback per envelope for async usage.

#### Sample code
```
1
  

```

#### Response
Operation: RemoveChannelMembers() → PNRemoveChannelMembersResponse
- Data ([]PNChannelMembers): See PNChannelMembers
- TotalCount (int)
- Next (string)
- Prev (string)

### Manage channel members

Sets and removes channel members for a channel.

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

#### Parameters
- Channel (Type: string): Channel name.
- Set (Type: pubnub.PNChannelMembersSet): UUID (PNChannelMembersUUID with ID string) and Custom map.
- Remove (Type: pubnub.PNChannelMembersRemove): UUID (PNChannelMembersUUID with ID string).
- Limit (Type: int): Default/Max 100.
- Count (Type: bool)
- Start (Type: string)
- End (Type: string)
- Sort (Type: Array): Sort by id, name, updated with asc/desc.
- Include (Type: []pubnub.PNChannelMembersInclude): Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom

#### Sample code
```
1
  

```

#### Response
Operation: ManageChannelMembers() → PNManageMembersResponse
- Data ([]PNChannelMembers): See PNChannelMembers
- TotalCount (int)
- Next (string)
- Prev (string)