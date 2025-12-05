# App Context API for Go SDK

App Context (Objects v2) stores metadata for users (UUIDs), channels, and their relationships (memberships/members). PubNub emits events when object data is set, updated, or removed. Setting identical data doesn’t trigger an event.

## User

### Get metadata for all users

Returns a paginated list of UUID metadata.

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

Parameters:
- Include (Type: []pubnub.PNUUIDMetadataInclude) — Additional attributes. Available: pubnub.PNUUIDMetadataIncludeCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Include total count; default false.
- Start (Type: string) — Cursor for forward pagination.
- End (Type: string) — Cursor for backward pagination.
- Filter (Type: string) — Filter expression. See filtering (/docs/general/metadata/filtering).

#### Sample code

```
1
  
```

#### Response

PNGetAllChannelMetadataResponse:
- Data ([]PNUUID) — See PNUUID.
- TotalCount (int)
- Next (string)
- Prev (string)

### Get user metadata

Returns metadata for the specified UUID.

#### Method(s)

```
`1pn.PNUUIDMetadataInclude().  
2    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
3    Sort(sort).  
4    ID(string).  
5    Execute()  
`
```

Parameters:
- Include (Type: []pubnub.PNUUIDMetadataInclude) — Available: pubnub.PNUUIDMetadataIncludeCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- ID (Type: string) — UUID; defaults to current user’s UUID.

#### Sample code

```
1
  
```

#### Response

PNGetUUIDMetadataResponse:
- Data (PNUUID) — See PNUUID.

### Set user metadata

Sets metadata for a UUID.

Unsupported partial updates of custom metadata:
- The custom field is fully overwritten. To append/modify, read current metadata, merge your changes client-side, then write back.

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

Parameters:
- Include (Type: []pubnub.PNUUIDMetadataInclude) — Available: pubnub.PNUUIDMetadataIncludeCustom.
- ID (Type: string) — UUID; defaults to current user’s UUID.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- Name (Type: string) — Display name.
- ExternalID (Type: string)
- ProfileURL (Type: string)
- Email (Type: string)
- Custom (Type: map[string]interface{}) — Strings, numbers, booleans. Filtering by Custom isn’t supported.
- IfMatchETag (Type: string) — Conditional update using eTag; mismatches return HTTP 412.

API limits:
- See REST API docs: /docs/sdks/rest-api/set-user-metadata

#### Sample code

```
1
  
```

#### Response

PNSetUUIDMetadataResponse:
- Data (PNUUID) — See PNUUID.

#### PNUUID

- ID (string) — UUID; defaults to current user’s uuid.
- Name (string)
- ExternalID (string)
- ProfileURL (string)
- Email (string)
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — Max 50 chars.
- Type (string) — Max 50 chars.

### Remove user metadata

Removes metadata for a UUID.

#### Method(s)

```
`1pn.RemoveUUIDMetadata().  
2    ID(string).  
3    Execute()  
`
```

Parameters:
- ID (Type: string) — UUID; defaults to current user’s UUID.

#### Sample code

```
1
  
```

#### Response

PNRemoveUUIDMetadataResponse:
- Data (interface) — Empty.

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata.

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

Parameters:
- Include (Type: []pubnub.PNChannelMetadataInclude) — Available: pubnub.PNChannelMetadataIncludeCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string) — Forward pagination.
- End (Type: string) — Backward pagination.
- Filter (Type: string) — See filtering (/docs/general/metadata/filtering).

#### Sample code

```
1
  
```

#### Response

PNGetAllChannelMetadataResponse:
- Data ([]PNChannel) — See PNChannel.
- TotalCount (int)
- Next (string)
- Prev (string)

### Get channel metadata

Returns metadata for a channel.

#### Method(s)

```
`1pn.GetChannelMetadata().  
2    Include([]pubnub.PNChannelMetadataInclude).  
3     Sort(sort).  
4     ID(string).  
5     Execute()  
`
```

Parameters:
- Include (Type: []pubnub.PNChannelMetadataInclude) — Available: pubnub.PNChannelMetadataIncludeCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- ID (Type: string) — Channel ID.

#### Sample code

```
1
  
```

#### Response

PNGetChannelMetadataResponse:
- Data (PNChannel) — See PNChannel.

### Set channel metadata

Sets metadata for a channel.

Unsupported partial updates of custom metadata:
- The custom field is fully overwritten. To modify, read current, merge client-side, then write.

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

Parameters:
- Include (Type: []pubnub.PNChannelMetadataInclude) — Available: pubnub.PNChannelMetadataIncludeCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- ID (Type: string) — Channel ID.
- Name (Type: string)
- Description (Type: string)
- Custom (Type: map[string]interface{}) — Strings, numbers, booleans. Filtering by Custom isn’t supported.
- IfMatchETag (Type: string) — Conditional update using eTag; HTTP 412 on mismatch.

API limits:
- See REST API docs: /docs/sdks/rest-api/set-channel-metadata

#### Sample code

```
1
  
```

#### Response

PNSetChannelMetadataResponse:
- Data (PNChannel) — See PNChannel.

#### PNChannel

- ID (string)
- Name (string)
- Description (string)
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — Max 50 chars.
- Type (string) — Max 50 chars.

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

Removes metadata for a channel.

#### Method(s)

```
`1pn.RemoveChannelMetadata().  
2    ID(string).  
3    Execute()  
`
```

Parameters:
- ID (Type: string) — Channel ID.

#### Sample code

```
1
  
```

#### Response

PNRemoveChannelMetadataResponse:
- Data (interface) — Empty.

## Channel memberships

### Get channel memberships

Lists channel memberships for a user (not subscriptions).

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

Parameters:
- UUID (Type: string) — Defaults to current user’s UUID.
- Include (Type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)
- Filter (Type: string) — See filtering (/docs/general/metadata/filtering).

#### Sample code

```
1
  
```

#### Response

PNGetMembershipsResponse:
- Data ([]PNMemberships) — See PNMemberships.
- TotalCount (int)
- Next (string)
- Prev (string)

#### PNMemberships

- ID (string)
- Channel (PNChannel) — See PNChannel.
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — Max 50 chars.
- Type (string) — Max 50 chars.

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

Parameters:
- UUID (Type: string) — Defaults to current user’s UUID.
- Set (Type: []pubnub.PNMembershipsSet) — Each item includes Channel (PNMembershipsChannel with ID string) and Custom (map).
- Include (Type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom.
- Sort (Type: Array)
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)

API limits:
- See REST API docs: /docs/sdks/rest-api/set-membership-metadata

#### Sample code

```
1
  
```

#### Response

PNSetMembershipsResponse:
- Data ([]PNMemberships) — See PNMemberships.
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

Parameters:
- UUID (Type: string) — Defaults to current user’s UUID.
- Remove (Type: []pubnub.PNMembershipsRemove) — Each item includes Channel (PNMembershipsChannel with ID string).
- Include (Type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom.
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)

#### Sample code

```
1
  
```

#### Response

PNRemoveMembershipsResponse:
- Data ([]PNMemberships) — See PNMemberships.
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

Parameters:
- UUID (Type: string) — Defaults to current user’s UUID.
- Set (Type: []pubnub.PNMembershipsSet) — Channel (ID string) and Custom (map).
- Remove (Type: []pubnub.PNMembershipsRemove) — Channel (ID string).
- Include (Type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom.
- Sort (Type: Array)
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)

#### Sample code

```
1
  
```

#### Response

PNManageMembershipsResponse:
- Data ([]PNMemberships) — See PNMemberships.
- TotalCount (int)
- Next (string)
- Prev (string)

## Channel members

### Get channel members

Lists members in a channel; includes user metadata if present.

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

Parameters:
- Channel (Type: string)
- Include (Type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom.
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)
- Filter (Type: string) — See filtering (/docs/general/metadata/filtering).

#### Sample code

```
1
  
```

#### Response

PNGetChannelMembersResponse:
- Data ([]PNChannelMembers) — See PNChannelMembers.
- TotalCount (int)
- Next (string)
- Prev (string)

#### PNChannelMembers

- ID (string)
- UUID (PNUUID) — See PNUUID.
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — Max 50 chars.
- Type (string) — Max 50 chars.

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

Parameters:
- Channel (Type: string)
- Set (Type: []pubnub.PNChannelMembersSet) — Each item includes UUID (PNChannelMembersUUID with ID string) and Custom (map).
- Include (Type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom.
- Sort (Type: Array)
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)

API limits:
- See REST API docs: /docs/sdks/rest-api/set-channel-members-metadata

#### Sample code

```
1
  
```

#### Response

PNSetChannelMembersResponse:
- Data ([]PNChannelMembers) — See PNChannelMembers.
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

Parameters:
- Channel (Type: string)
- Remove (Type: []pubnub.PNChannelMembersRemove) — Each item includes UUID (PNChannelMembersUUID with ID string).
- Include (Type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom.
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)

#### Sample code

```
1
  
```

#### Response

PNRemoveChannelMembersResponse:
- Data ([]PNChannelMembers) — See PNChannelMembers.
- TotalCount (int)
- Next (string)
- Prev (string)

### Manage channel members

Sets and removes channel members in one request.

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

Parameters:
- Channel (Type: string)
- Set (Type: []pubnub.PNChannelMembersSet) — UUID (ID string) and Custom (map).
- Remove (Type: []pubnub.PNChannelMembersRemove) — UUID (ID string).
- Limit (Type: int) — Default/Max: 100.
- Count (Type: bool) — Default false.
- Start (Type: string)
- End (Type: string)
- Sort (Type: Array) — Sort by id, name, updated with asc/desc.
- Include (Type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom.

#### Sample code

```
1
  
```

#### Response

PNManageMembersResponse:
- Data ([]PNChannelMembers) — See PNChannelMembers.
- TotalCount (int)
- Next (string)
- Prev (string)