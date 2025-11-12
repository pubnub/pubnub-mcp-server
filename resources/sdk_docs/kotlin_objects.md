# App Context API for Kotlin SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub emits real-time events on set, update, or removal of object data.

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin/Java SDKs, changes client instantiation, async callbacks, and emitted status events. See:
- Java/Kotlin SDK migration guide: /docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide
- Objects v1 to App Context migration: /docs/general/resources/migration-guides/objects-v2-migration

##### Request execution
Most SDK methods return an Endpoint. You must call .sync() or .async() to execute the request.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## User

### Get metadata for all users

Returns a paginated list of UUID Metadata objects.

#### Method(s)
```
`1pubnub.getAllUUIDMetadata(  
2    filter: String? = null,  
3    sort: CollectionPNSortKeyPNKey>> = listOf(),  
4    page: PNPage? = null,  
5    limit: Int? = null,  
6    includeCustom: Boolean = false,  
7    includeCount: Boolean = false  
8).async { result -> }  
`
```

#### Parameters
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNKey>> (default listOf()) — Sort by ID, NAME, UPDATED, TYPE, STATUS with asc/desc (for example, PNSortKey.asc(PNKey.STATUS)).
- page: PNPage? (default null) — Cursor-based pagination.
- limit: Int? (default 100) — Max 100.
- includeCustom: Boolean (default false) — Include custom object.
- includeCount: Boolean (default false) — Include total count in response.

#### Sample code
```
1
  

```

#### Response
```
1data class PNUUIDMetadataArrayResult(  
2    val status: Int,  
3    val data: CollectionPNUUIDMetadata>,  
4    val totalCount: Int?,  
5    val next: PNPage?,  
6    val prev: PNPage?  
7)  
8
  
9data class PNUUIDMetadata(  
10    val id: String,  
11    val name: PatchValueString?>? = null,  
12    val externalId: PatchValueString?>? = null,  
13    val profileUrl: PatchValueString?>? = null,  
14    val email: PatchValueString?>? = null,  
15    val custom: PatchValueMapString, Any?>?>? = null,  
16    val updated: PatchValueString>? = null,  
17    val eTag: PatchValueString>? = null,  
18    val type: PatchValueString?>? = null,  
19    val status: PatchValueString?>? = null,  
20)  
```

### Get user metadata

Returns metadata for the specified UUID.

#### Method(s)
```
`1pubnub.getUUIDMetadata(  
2    uuid: String? = null,  
3    includeCustom: Boolean = false  
4).async { result -> }  
`
```

#### Parameters
- uuid: String? (default pubnub.configuration.uuid) — Unique UUID. If not supplied, uses configuration UUID.
- includeCustom: Boolean (default false) — Include custom object.

#### Sample code
```
1
  

```

#### Response
```
1data class PNUUIDMetadataResult(  
2    val status: Int,  
3    val data: PNUUIDMetadata?  
4)  
5
  
6data class PNUUIDMetadata(  
7    val id: String,  
8    val name: PatchValueString?>? = null,  
9    val externalId: PatchValueString?>? = null,  
10    val profileUrl: PatchValueString?>? = null,  
11    val email: PatchValueString?>? = null,  
12    val custom: PatchValueMapString, Any?>?>? = null,  
13    val updated: PatchValueString>? = null,  
14    val eTag: PatchValueString>? = null,  
15    val type: PatchValueString?>? = null,  
16    val status: PatchValueString?>? = null,  
17)  
```

### Set user metadata

Sets metadata for a UUID.

Unsupported partial updates of custom metadata:
- The custom object is fully overwritten on set.

#### Method(s)
```
`1pubnub.setUUIDMetadata(  
2    uuid: String? = null,  
3    includeCustom: Boolean = false,  
4    name: String? = null,  
5    externalId: String? = null,  
6    profileUrl: String? = null,  
7    email: String? = null,  
8    custom: Any? = null,  
9    type: String?,  
10    status: String?,  
11    ifMatchesEtag: String?  
12).async { result -> }  
`
```

#### Parameters
- uuid: String? (default pubnub.configuration.uuid) — Unique UUID. If not supplied, uses configuration UUID.
- includeCustom: Boolean (default false) — Include custom field in fetch response.
- name: String? (default null) — Display name.
- externalId: String? (default null) — External system identifier.
- profileUrl: String? (default null) — Profile picture URL.
- email: String? (default null) — Email address.
- type: String? (default null) — Custom type.
- status: String? (default null) — Custom status.
- custom: Any? (default null) — Key-value pairs. Filtering by custom isn’t supported.
- ifMatchesEtag: String? — Use eTag to ensure updates only apply if unchanged; mismatches return HTTP 412.

##### API limits
See /docs/sdks/rest-api/set-user-metadata.

#### Sample code
```
1
  

```

#### Response
```
1data class PNUUIDMetadataResult(  
2    val status: Int,  
3    val data: PNUUIDMetadata?  
4)  
5
  
6data class PNUUIDMetadata(  
7    val id: String,  
8    val name: PatchValueString?>? = null,  
9    val externalId: PatchValueString?>? = null,  
10    val profileUrl: PatchValueString?>? = null,  
11    val email: PatchValueString?>? = null,  
12    val custom: PatchValueMapString, Any?>?>? = null,  
13    val updated: PatchValueString>? = null,  
14    val eTag: PatchValueString>? = null,  
15    val type: PatchValueString?>? = null,  
16    val status: PatchValueString?>? = null,  
17)  
```

### Remove user metadata

Removes metadata for a UUID.

#### Method(s)
```
`1pubnub.removeUUIDMetadata(  
2    uuid: String? = null  
3).async { result -> }  
`
```

#### Parameters
- uuid: String? (default pubnub.configuration.uuid) — Unique UUID. If not supplied, uses configuration UUID.

#### Sample code
```
1
  

```

#### Response
```
`1data class PNRemoveMetadataResult(private val status: Int)  
`
```

## Channel

### Get metadata for all channels

Returns a paginated list of Channel Metadata objects.

#### Method(s)
```
`1pubnub.getAllChannelMetadata(  
2    filter: String? = null,  
3    sort: CollectionPNSortKeyPNKey>> = listOf(),  
4    page: PNPage? = null,  
5    limit: Int? = null,  
6    includeCustom: Boolean = false,  
7    includeCount: Boolean = false,  
8).async { result -> }  
`
```

#### Parameters
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNKey>> (default listOf()) — Sort by PNKey.ID, NAME, UPDATED, TYPE, STATUS. Use PNSortKey.asc/desc.
- page: PNPage? (default null) — Pagination object.
- limit: Int? (default 100) — Number to retrieve.
- includeCustom: Boolean (default false) — Include custom field.
- includeCount: Boolean (default false) — IncludeCount in response.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMetadataArrayResult(  
2    val status: Int,  
3    val data: CollectionPNChannelMetadata>,  
4    val totalCount: Int?,  
5    val next: PNPage?,  
6    val prev: PNPage?  
7)  
8
  
9data class PNChannelMetadata(  
10    val id: String,  
11    val name: PatchValueString?>? = null,  
12    val description: PatchValueString?>? = null,  
13    val custom: PatchValueMapString, Any?>?>? = null,  
14    val updated: PatchValueString>? = null,  
15    val eTag: PatchValueString>? = null,  
16    val type: PatchValueString?>? = null,  
17    val status: PatchValueString?>? = null,  
18)  
```

### Get channel metadata

Returns metadata for the specified channel.

#### Method(s)
```
`1pubnub.getChannelMetadata(  
2    channel: String,  
3    includeCustom: Boolean = false  
4).async { result -> }  
`
```

#### Parameters
- channel: String — Channel name.
- includeCustom: Boolean (default false) — Include custom field.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMetadataResult(  
2    val status: Int,  
3    val data: PNChannelMetadata?  
4)  
5
  
6data class PNChannelMetadata(  
7    val id: String,  
8    val name: PatchValueString?>? = null,  
9    val description: PatchValueString?>? = null,  
10    val custom: PatchValueMapString, Any?>?>? = null,  
11    val updated: PatchValueString>? = null,  
12    val eTag: PatchValueString>? = null,  
13    val type: PatchValueString?>? = null,  
14    val status: PatchValueString?>? = null,  
15)  
```

### Set channel metadata

Sets metadata for a channel.

Unsupported partial updates of custom metadata:
- The custom object is fully overwritten on set.

#### Method(s)
```
`1pubnub.setChannelMetadata(  
2    channel: String,  
3    includeCustom: Boolean = false,  
4    name: String? = null,  
5    description: String? = null,  
6    custom: Any? = null  
7    type: String?,  
8    status: String?,  
9    ifMatchesEtag: String?  
10).async { result -> }  
`
```

#### Parameters
- channel: String — Channel name.
- includeCustom: Boolean (default false) — Include custom field in fetch response.
- name: String? (default null) — Channel name.
- description: String? (default null) — Channel description.
- type: String? (default null) — Custom type.
- status: String? (default null) — Custom status.
- custom: Any? (default null) — Custom JSON values (strings, numbers, booleans). Filtering by custom isn’t supported.
- ifMatchesEtag: String? — Ensure updates only if unchanged; mismatches throw HTTP 412.

##### API limits
See /docs/sdks/rest-api/set-channel-metadata.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMetadataResult(  
2    val status: Int,  
3    val data: PNChannelMetadata?  
4)  
5
  
6data class PNChannelMetadata(  
7    val id: String,  
8    val name: PatchValueString?>? = null,  
9    val description: PatchValueString?>? = null,  
10    val custom: PatchValueMapString, Any?>?>? = null,  
11    val updated: PatchValueString>? = null,  
12    val eTag: PatchValueString>? = null,  
13    val type: PatchValueString?>? = null,  
14    val status: PatchValueString?>? = null,  
15)  
```

#### Other examples

##### Iteratively update existing metadata
```
1
  

```

### Remove channel metadata

Removes the metadata from a specified channel.

#### Method(s)
```
`1pubnub.removeChannelMetadata(  
2    channel: String  
3).async { result -> }  
`
```

#### Parameters
- channel: String — Channel name.

#### Sample code
```
1
  

```

#### Response
```
`1data class PNRemoveMetadataResult(private val status: Int)  
`
```

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user (not subscriptions).

#### Method(s)
```
`1pubnub.getMemberships(  
2    userId: String? = null,  
3    limit: Int? = null,  
4    page: PNPage? = null,  
5    filter: String? = null,  
6    sort: CollectionPNSortKeyPNMembershipKey>> = listOf(),  
7    include: MembershipInclude = MembershipInclude(),  
8).async { result -> }  
`
```

#### Parameters
- userId: String? (default pubnub.configuration.userId.value) — Unique User Metadata identifier. If not supplied, uses configuration userId.
- limit: Int? (default 100) — Number to retrieve.
- page: PNPage? (default null) — Pagination.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMembershipKey>> (default listOf()) — Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE with asc/desc (for example, PNSortKey.PNAsc(PNMembershipKey.TYPE)).
- include: MembershipInclude (default MembershipInclude()) — Include additional data.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMembershipArrayResult(  
2    val status: Int,  
3    val data: CollectionPNChannelMembership>,  
4    val totalCount: Int?,  
5    val next: PNPage?,  
6    val prev: PNPage?  
7)  
8
  
9data class PNChannelMembership(  
10    val channel: PNChannelMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>? = null,  
15    val type: PatchValueString?>? = null  
16)  
```

### Set channel memberships

Sets channel memberships for a user.

#### Method(s)
```
`1pubnub.setMemberships(  
2    channels: ListChannelMembershipInput>,  
3    userId: String? = null,  
4    limit: Int? = null,  
5    page: PNPage? = null,  
6    filter: String? = null,  
7    sort: CollectionPNSortKeyPNMembershipKey>>, = listOf(),  
8    include: MembershipInclude = MembershipInclude(),  
9).async { result -> }  
`
```

#### Parameters
- channels: List<ChannelMembershipInput> — Channels to add with optional custom metadata (status/type).
- userId: String? (default pubnub.configuration.userId.value) — Unique User Metadata identifier. If not supplied, uses configuration userId.
- limit: Int? (default 100) — Number to retrieve.
- page: PNPage? (default null) — Pagination.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMembershipKey>> (default listOf()) — Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE. Use PNSortKey.PNAsc/PNDesc.
- include: MembershipInclude (default MembershipInclude()) — Include additional data.

##### API limits
See /docs/sdks/rest-api/set-membership-metadata.

#### ChannelMembershipInput
- channel: String — Channel to add.
- custom: CustomObject — Additional membership info.
- type: String — Type of membership.
- status: String — Status of membership.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMembershipArrayResult(  
2    val status: Int,  
3    val data: CollectionPNChannelMembership>,  
4    val totalCount: Int?,  
5    val next: PNPage?,  
6    val prev: PNPage?  
7)  
8
  
9data class PNChannelMembership(  
10    val channel: PNChannelMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>? = null,  
15    val type: PatchValueString?>? = null,  
16)  
```

### Remove channel memberships

Removes channel memberships for a user.

#### Method(s)
```
`1pubnub.removeMemberships(  
2    channels: ListString>,  
3    userId: String? = null,  
4    limit: Int? = null,  
5    page: PNPage? = null,  
6    filter: String? = null,  
7    sort: CollectionPNSortKeyPNMembershipKey>>, = listOf(),  
8    include: MembershipInclude = MembershipInclude(),  
9).async { result -> }  
`
```

#### Parameters
- channels: List<String> — Channels to remove.
- userId: String? (default pubnub.configuration.userId.value) — Unique User Metadata identifier. If not supplied, uses configuration userId.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMembershipKey>> (default listOf()) — Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE with asc/desc (for example, PNSortKey.PNAsc(PNMembershipKey.TYPE)).
- page: PNPage? (default null) — Cursor-based pagination.
- limit: Int? (default 100) — Max 100.
- include: MembershipInclude (default MembershipInclude()) — Include additional fields.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMembershipArrayResult(  
2    val status: Int,  
3    val data: CollectionPNChannelMembership>,  
4    val totalCount: Int?,  
5    val next: PNPage?,  
6    val prev: PNPage?  
7)  
8
  
9data class PNChannelMembership(  
10    val channel: PNChannelMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>? = null,  
15    val type: PatchValueString?>? = null,  
16)  
```

### Manage channel memberships

Adds and removes memberships for a user in a single call.

#### Method(s)
```
`1pubnub.manageMemberships(  
2    channelsToSet: ListPNChannelWithCustom>,  
3    channelsToRemove: ListString>,  
4    userId: String? = null,  
5    limit: Int? = null,  
6    page: PNPage? = null,  
7    filter: String? = null,  
8    sort: CollectionPNSortKeyPNMembershipKey>>, = listOf(),  
9    include: MembershipInclude = MembershipInclude(),  
10).async { result -> }  
`
```

#### Parameters
- channelsToSet: List<PNChannelWithCustom> — Channels to add with custom.
- channelsToRemove: List<String> — Channels to remove.
- userId: String? (default pubnub.configuration.userId.value) — Unique User Metadata identifier. If not supplied, uses configuration userId.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMembershipKey>> (default listOf()) — Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE. Use PNSortKey.PNAsc/PNDesc.
- page: PNPage? (default null) — Pagination.
- limit: Int? (default 100) — Number to retrieve.
- include: MembershipInclude (default MembershipInclude()) — Include additional data.

#### Sample code
```
1
  

```

#### Response
```
1data class PNChannelMembershipArrayResult(  
2    val status: Int,  
3    val data: CollectionPNChannelMembership>,  
4    val totalCount: Int?,  
5    val next: PNPage?,  
6    val prev: PNPage?  
7)  
8
  
9data class PNChannelMembership(  
10    val channel: PNChannelMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>? = null,  
15    val type: PatchValueString?>? = null,  
16)  
```

## Channel members

### Get channel members

Returns a list of members in a channel. Includes user metadata for members with stored metadata.

#### Method(s)
```
`1pubnub.getChannelMembers(  
2    channel: String,  
3    limit: Int? = null,  
4    page: PNPage? = null,  
5    filter: String? = null,  
6    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
7    include: MemberInclude = MemberInclude(),  
8).async { result -> }  
`
```

#### Parameters
- channel: String — Channel name.
- limit: Int? (default 100) — Number to retrieve.
- page: PNPage? (default null) — Pagination.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMemberKey>> (default listOf()) — Sort by PNMemberKey.UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE. Use PNSortKey.PNAsc/PNDesc.
- include: MemberInclude (default MemberInclude()) — Include additional data.

#### Sample code
```
1
  

```

#### Response
```
1data class PNMemberArrayResult(  
2    val status: Int,  
3    val data: CollectionPNMember>,  
4    val totalCount: Int?,  
5    val next: PNPage.PNNext?,  
6    val prev: PNPage.PNPrev?  
7)  
8
  
9data class PNMember(  
10    val uuid: PNUUIDMetadata?,  
11    val custom: Any? = null,  
12    val updated: Instant,  
13    val eTag: String  
14)  
```

### Set channel members

Sets members in a channel.

#### Method(s)
```
`1pubnub.setChannelMembers(  
2    channel: String,  
3    users: ListPNMember.Partial>,  
4    limit: Int? = null,  
5    page: PNPage? = null,  
6    filter: String? = null,  
7    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
8    include: MemberInclude = MemberInclude(),  
9).async { result, status ->  
10    if (status.error) {  
11        // handle error  
12    } else if (result != null) {  
13        // handle result  
14    }  
15}  
`
```

#### Parameters
- channel: String — Channel name.
- users: List<PNMember.Partial> — Members to add to channel.
- limit: Int? (default 100) — Number to retrieve.
- page: PNPage? (default null) — Pagination.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMemberKey>> (default listOf()) — Sort by PNMemberKey.UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE. Use PNSortKey.PNAsc/PNDesc.
- include: MemberInclude (default MemberInclude()) — Include additional data.

##### API limits
See /docs/sdks/rest-api/set-channel-members-metadata.

#### Sample code
```
1
  

```

#### Response
```
1data class PNMemberArrayResult(  
2    val status: Int,  
3    val data: CollectionPNMember>,  
4    val totalCount: Int?,  
5    val next: PNPage.PNNext?,  
6    val prev: PNPage.PNPrev?  
7)  
8
  
9data class PNMember(  
10    val uuid: PNUUIDMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>?,  
15    val type: PatchValueString?>?,  
16)  
```

### Remove channel members

Removes members from a channel.

#### Method(s)
```
`1pubnub.removeChannelMembers(  
2    userIds: ListString>,  
3    channel: String,  
4    limit: Int? = null,  
5    page: PNPage? = null,  
6    filter: String? = null,  
7    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
8    include: MemberInclude = MemberInclude(),  
9).async { result -> }  
`
```

#### Parameters
- userIds: List<String> — Member userIds to remove.
- channel: String — Channel name.
- limit: Int? (default 100) — Number to retrieve.
- page: PNPage? (default null) — Pagination.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMemberKey>> (default listOf()) — Sort by PNMemberKey.UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE. Use PNSortKey.PNAsc/PNDesc.
- include: MemberInclude (default MemberInclude()) — Include additional data.

#### Sample code
```
1
  

```

#### Response
```
1data class PNMemberArrayResult(  
2    val status: Int,  
3    val data: CollectionPNMember>,  
4    val totalCount: Int?,  
5    val next: PNPage.PNNext?,  
6    val prev: PNPage.PNPrev?  
7)  
8
  
9data class PNMember(  
10    val uuid: PNUUIDMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>?,  
15    val type: PatchValueString?>?,  
16)  
```

### Manage channel members

Sets and removes channel members in a single call.

#### Method(s)
```
`1pubnub.manageChannelMembers(  
2    channel: String,  
3    usersToSet: ListPNMember.Partial>,  
4    userIdsToRemove: ListString>,  
5    limit: Int? = null,  
6    page: PNPage? = null,  
7    filter: String? = null,  
8    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
9    include: MemberInclude = MemberInclude(),  
10).async { result, status ->  
11    if (status.error) {  
12        // Handle error  
13    } else if (result != null) {  
14        // Handle successful result  
15    }  
16}  
`
```

#### Parameters
- channel: String — Channel name.
- usersToSet: List<PNMember.Partial> — Members to add with optional custom metadata.
- userIdsToRemove: List<String> — Members to remove.
- limit: Int? (default 100) — Number to retrieve.
- page: PNPage? (default null) — Pagination.
- filter: String? (default null) — Filter expression. See /docs/general/metadata/filtering.
- sort: Collection<PNSortKey<PNMemberKey>> (default listOf()) — Sort by PNMemberKey.UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE. Use PNSortKey.PNAsc/PNDesc.
- include: MemberInclude (default MemberInclude()) — Include additional data.

#### Sample code
```
1
  

```

#### Response
```
1data class PNMemberArrayResult(  
2    val status: Int,  
3    val data: CollectionPNMember>,  
4    val totalCount: Int?,  
5    val next: PNPage.PNNext?,  
6    val prev: PNPage.PNPrev?  
7)  
8
**9data class PNMember(  
10    val uuid: PNUUIDMetadata,  
11    val custom: PatchValueMapString, Any?>?>? = null,  
12    val updated: String,  
13    val eTag: String,  
14    val status: PatchValueString?>?,  
15    val type: PatchValueString?>?,  
16)  
```