# App Context API for Go SDK (Objects v2)

App Context provides serverless storage for user (UUID) and channel metadata, plus their membership associations. Updates (set, update, remove) trigger real-time events; re-setting identical data doesn't trigger events.

Refer to the migration guide if upgrading from Objects v1.

## User

### Get metadata for all users

Returns a paginated list of UUID Metadata objects; can include custom data.

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

- Include (type: []pubnub.PNUUIDMetadataInclude) — optional; include additional attributes. Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort — sort by id, name, updated with asc/desc (for example, {name: 'asc'})
- Limit (int) — number of objects; default/max 100
- Count (bool) — include total count; default false
- Start (string) — cursor for forward pagination
- End (string) — cursor for backward pagination
- Filter (string) — filter expression; see filtering docs

#### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

#### Response

The GetAllUUIDMetadata() operation returns a PNGetAllChannelMetadataResponse with:

- Data ([]PNUUID) — see PNUUID
- TotalCount (int)
- Next (string) — cursor for next page
- Prev (string) — cursor for previous page (ignored if Next is provided)

### Get user metadata

Returns metadata for the specified UUID; can include custom data.

#### Method(s)

```
`1pn.PNUUIDMetadataInclude().  
2    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
3    Sort(sort).  
4    ID(string).  
5    Execute()  
`
```

- Include (type: []pubnub.PNUUIDMetadataIncludeCustom) — optional; Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort — sort by id, name, updated with asc/desc
- ID (string) — UUID; defaults to current user's UUID if omitted

#### Sample code

```
1
  

```

#### Response

The GetUUIDMetadata() operation returns a PNGetUUIDMetadataResponse with:

- Data (PNUUID) — see PNUUID

### Set user metadata

Sets metadata for a UUID; can include custom data.

Unsupported partial updates of custom metadata:
- The custom field overwrites existing server value. To merge, read current metadata, update locally, then write back.

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

- Include (type: []pubnub.PNUUIDMetadataInclude) — optional; Available: pubnub.PNUUIDMetadataIncludeCustom
- Sort — sort by id, name, updated with asc/desc
- ID (string) — unique user identifier; defaults to current user's uuid
- Name (string) — display name
- ExternalID (string) — external system identifier
- ProfileURL (string) — profile picture URL
- Email (string)
- Custom (map[string]interface{}) — strings, numbers, booleans; filtering by Custom not supported
- IfMatchETag (string) — conditional update using ETag; mismatches return HTTP 412

API limits: see REST API docs for set-user-metadata.

#### Sample code

```
1
  

```

#### Response

The SetUUIDMetadata() operation returns a PNSetUUIDMetadataResponse with:

- Data (PNUUID) — see PNUUID

#### PNUUID

- ID (string) — unique user identifier; defaults to current user's uuid
- Name (string)
- ExternalID (string)
- ProfileURL (string)
- Email (string)
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — max 50 chars
- Type (string) — max 50 chars

### Remove user metadata

Removes metadata for a specified UUID.

#### Method(s)

```
`1pn.RemoveUUIDMetadata().  
2    ID(string).  
3    Execute()  
`
```

- ID (string) — UUID; defaults to current user's uuid

#### Sample code

```
1
  

```

#### Response

The RemoveUUIDMetadata() operation returns a PNRemoveUUIDMetadataResponse with:

- Data (interface{}) — empty

## Channel

### Get metadata for all channels

Returns a paginated list of Channel Metadata objects; can include custom data.

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

- Include (type: []pubnub.PNChannelMetadataInclude) — optional; Available: pubnub.PNChannelMetadataIncludeCustom
- Sort — sort by id, name, updated with asc/desc
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string) — forward pagination
- End (string) — backward pagination
- Filter (string) — see filtering docs

#### Sample code

```
1
  

```

#### Response

The GetAllChannelMetadata() operation returns a PNGetAllChannelMetadataResponse with:

- Data ([]PNChannel) — see PNChannel
- TotalCount (int)
- Next (string)
- Prev (string)

### Get channel metadata

Returns metadata for the specified channel; can include custom data.

#### Method(s)

```
`1pn.GetChannelMetadata().  
2    Include([]pubnub.PNChannelMetadataInclude).  
3     Sort(sort).  
4     ID(string).  
5     Execute()  
`
```

- Include (type: []pubnub.PNChannelMetadataInclude) — optional; Available: pubnub.PNChannelMetadataIncludeCustom
- Sort — sort by id, name, updated with asc/desc
- ID (string) — UUID; defaults to current user's UUID if omitted

#### Sample code

```
1
  

```

#### Response

The GetChannelMetadata() operation returns a PNGetChannelMetadataResponse with:

- Data (PNChannel) — see PNChannel

### Set channel metadata

Sets channel metadata; can include custom data.

Unsupported partial updates of custom metadata:
- The custom field overwrites existing server value.

API limits: see REST API docs for set-channel-metadata.

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

- Include (type: []pubnub.PNChannelMetadataInclude) — optional; Available: pubnub.PNChannelMetadataIncludeCustom
- Sort — sort by id, name, updated with asc/desc
- ID (string) — unique user identifier; defaults to current user's uuid
- Name (string) — channel name
- Description (string)
- Custom (map[string]interface{}) — strings, numbers, booleans; filtering by Custom not supported
- IfMatchETag (string) — conditional update using ETag; mismatches return HTTP 412

#### Sample code

```
1
  

```

#### Response

The SetChannelMetadata() operation returns a PNSetChannelMetadataResponse with:

- Data (PNChannel) — see PNChannel

#### PNChannel

- ID (string) — unique user identifier; defaults to current user's uuid
- Name (string)
- Description (string)
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — max 50 chars
- Type (string) — max 50 chars

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

- ID (string) — unique user identifier; defaults to current user's uuid

#### Sample code

```
1
  

```

#### Response

The RemoveChannelMetadata() operation returns a PNRemoveChannelMetadataResponse with:

- Data (interface{}) — empty

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

- UUID (string) — user UUID; defaults to current user's UUID
- Include (type: []pubnub.PNMembershipsInclude) — optional; Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort — sort by id, name, updated with asc/desc
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string) — forward pagination
- End (string) — backward pagination
- Filter (string) — see filtering docs

#### Sample code

```
1
  

```

#### Response

The GetMemberships() operation returns a PNGetMembershipsResponse with:

- Data ([]PNMemberships) — see PNMemberships
- TotalCount (int)
- Next (string)
- Prev (string)

#### PNMemberships

- ID (string) — unique user identifier; defaults to current user's uuid
- Channel (PNChannel) — see PNChannel
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — max 50 chars
- Type (string) — max 50 chars

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

- UUID (string) — defaults to current user's UUID
- Set (pubnub.PNMembershipsSet) — items to add; set Channel (PNMembershipsChannel with ID string) and Custom map
- Include (type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort — sort by id, name, updated with asc/desc
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string) — forward pagination
- End (string) — backward pagination

API limits: see REST API docs for set-membership-metadata.

#### Sample code

```
1
  

```

#### Response

The SetMemberships() operation returns a PNSetMembershipsResponse with:

- Data ([]PNMemberships)
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

- UUID (string) — defaults to current user's UUID
- Remove (pubnub.PNMembershipsRemove) — items to remove; set Channel (PNMembershipsChannel with ID string) and optional Custom map
- Include (type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string)
- End (string)

#### Sample code

```
1
  

```

#### Response

The RemoveMemberships() operation returns a PNRemoveMembershipsResponse with:

- Data ([]PNMemberships)
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

- UUID (string) — defaults to current user's Uuid
- Set (pubnub.PNMembershipsSet) — add/update; set Channel (PNMembershipsChannel with ID string) and Custom map
- Remove (pubnub.PNMembershipsRemove) — remove; set Channel (PNMembershipsChannel with ID string)
- Include (type: []pubnub.PNMembershipsInclude) — Available: pubnub.PNMembershipsIncludeCustom, pubnub.PNMembershipsIncludeChannel, pubnub.PNMembershipsIncludeChannelCustom
- Sort — sort by id, name, updated with asc/desc
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string)
- End (string)

#### Sample code

```
1
  

```

#### Response

The ManageMemberships() operation returns a PNManageMembershipsResponse with:

- Data ([]PNMemberships)
- TotalCount (int)
- Next (string)
- Prev (string)

## Channel members

### Get channel members

Returns a list of members in a channel; can include user metadata.

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

- Channel (string) — channel name
- Include (type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort — sort by id, name, updated with asc/desc
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string)
- End (string)
- Filter (string) — see filtering docs

#### Sample code

```
1
  

```

#### Response

The GetChannelMembers() operation returns a PNGetChannelMembersResponse with:

- Data ([]PNChannelMembers) — see PNChannelMembers
- TotalCount (int)
- Next (string)
- Prev (string)

#### PNChannelMembers

- ID (string) — unique user identifier; defaults to current user's uuid
- UUID (PNUUID) — see PNUUID
- Custom (map[string]interface{})
- Updated (string)
- ETag (string)
- Status (string) — max 50 chars
- Type (string) — max 50 chars

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

- Channel (string)
- Set (pubnub.PNChannelMembersSet) — add/update; set UUID (PNChannelMembersUUID with ID string) and Custom map
- Include (type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort — sort by id, name, updated with asc/desc
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string)
- End (string)

API limits: see REST API docs for set-channel-members-metadata.

#### Sample code

```
1
  

```

#### Response

The SetChannelMembers() operation returns a PNSetChannelMembersResponse with:

- Data ([]PNChannelMembers)
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

- Channel (string) — channel name
- Remove (pubnub.PNChannelMembersRemove) — remove; set UUID (PNChannelMembersUUID with ID string)
- Include (type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom
- Sort (Array) — sort by id, name, updated (asc/desc)
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string) — forward pagination
- End (string) — backward pagination
- Filter (string) — optional filtering expression

#### Sample code

```
1
  

```

#### Response

The RemoveChannelMembers() operation returns a PNRemoveChannelMembersResponse with:

- Data ([]PNChannelMembers)
- TotalCount (int)
- Next (string)
- Prev (string)

### Manage channel members

Adds and removes channel members for a channel.

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

- Channel (string)
- Set (pubnub.PNChannelMembersSet) — add/update; set UUID (PNChannelMembersUUID with ID string) and Custom map
- Remove (pubnub.PNChannelMembersRemove) — remove; set UUID (PNChannelMembersUUID with ID string)
- Limit (int) — default/max 100
- Count (bool) — default false
- Start (string)
- End (string)
- Sort — sort by id, name, updated with asc/desc
- Include (type: []pubnub.PNChannelMembersInclude) — Available: pubnub.PNChannelMembersIncludeCustom, pubnub.PNChannelMembersIncludeUUID, pubnub.PNChannelMembersIncludeUUIDCustom

#### Sample code

```
1
  

```

#### Response

The ManageChannelMembers() operation returns a PNManageMembersResponse with:

- Data ([]PNChannelMembers)
- TotalCount (int)
- Next (string)
- Prev (string)