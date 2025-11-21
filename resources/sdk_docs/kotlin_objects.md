# App Context API for Kotlin SDK

App Context (formerly Objects v2) stores metadata for users, channels, and memberships. PubNub emits events on set, update, or removal.

##### Breaking changes in v9.0.0
- Unified Kotlin and Java SDKs, new client instantiation, updated async callbacks and status events.
- See migration guides: Java/Kotlin SDK migration and Objects v2 migration.

##### Request execution
Most methods return an Endpoint. Call .sync() or .async() to execute.

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

Returns a paginated list of UUID Metadata.

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
- filter: String? = null - Filter expression; see filtering.
- sort: Collection<PNSortKey<PNKey>> = listOf() - Sort by ID, NAME, UPDATED, TYPE, STATUS (asc/desc; for example, PNSortKey.asc(PNKey.STATUS)).
- page: PNPage? = null - Cursor-based pagination.
- limit: Int? (Default/Max 100) - Number of objects to return.
- includeCustom: Boolean = false - Include custom object.
- includeCount: Boolean = false - Include total count.

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

Returns metadata for a UUID.

#### Method(s)
```
`1pubnub.getUUIDMetadata(  
2    uuid: String? = null,  
3    includeCustom: Boolean = false  
4).async { result -> }  
`
```
- uuid: String = pubnub.configuration.uuid - Unique identifier; defaults to configuration UUID.
- includeCustom: Boolean = false - Include custom object.

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

Custom metadata overwrites existing data. To add or change a subset, read current, merge locally, then write back.

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
- uuid: String = pubnub.configuration.uuid - Unique identifier; defaults to configuration UUID.
- includeCustom: Boolean = false - Include custom in response.
- name: String? - Display name.
- externalId: String? - External system ID.
- profileUrl: String? - Profile picture URL.
- email: String? - Email address.
- type: String? - Custom type.
- status: String? - Custom status.
- custom: Any? - Key-value pairs. Filtering by custom is not supported.
- ifMatchesEtag: String? - Conditional update using eTag; mismatches return HTTP 412.

##### API limits
See REST API docs: set user metadata.

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

#### Method(s)
```
`1pubnub.removeUUIDMetadata(  
2    uuid: String? = null  
3).async { result -> }  
`
```
- uuid: String = pubnub.configuration.uuid - Unique identifier; defaults to configuration UUID.

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

Returns a paginated list of Channel Metadata.

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
- filter: String? = null - Filter expression; see filtering.
- sort: Collection<PNSortKey<PNKey>> = listOf() - Sort by PNKey.ID, NAME, UPDATED, TYPE, STATUS; use PNSortKey.asc/desc.
- page: PNPage? = null - Pagination object.
- limit: Int? (Default 100) - Number of objects per page.
- includeCustom: Boolean = false - Include custom in response.
- includeCount: Boolean = false - Include total count.

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

#### Method(s)
```
`1pubnub.getChannelMetadata(  
2    channel: String,  
3    includeCustom: Boolean = false  
4).async { result -> }  
`
```
- channel: String - Channel name.
- includeCustom: Boolean = false - Include custom in response.

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

Custom metadata overwrites existing data. To add or change a subset, read current, merge locally, then write back.

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
- channel: String - Channel name.
- includeCustom: Boolean = false - Include custom in response.
- name: String? - Channel name.
- description: String? - Channel description.
- type: String? - Custom type.
- status: String? - Custom status.
- custom: Any? - Custom JSON values (strings/numbers/booleans). Filtering by custom isn’t supported.
- ifMatchesEtag: String? - Conditional update using eTag; mismatches throw HTTP 412.

##### API limits
See REST API docs: set channel metadata.

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

#### Method(s)
```
`1pubnub.removeChannelMetadata(  
2    channel: String  
3).async { result -> }  
`
```
- channel: String - Channel name.

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
- userId: String = pubnub.configuration.userId.value - Defaults to configuration userId.
- limit: Int? (Default 100) - Number per page.
- page: PNPage? = null - Pagination object.
- filter: String? = null - Filter expression; see filtering.
- sort: Collection<PNSortKey<PNMembershipKey>> = listOf() - Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE; use PNSortKey.PNAsc/PNDesc.
- include: MembershipInclude = MembershipInclude() - Include additional data.

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
- channels: List<ChannelMembershipInput> - Memberships to add with optional custom metadata (status/type).
- userId: String = pubnub.configuration.userId.value - Defaults to configuration userId.
- limit: Int? (Default 100) - Number per page.
- page: PNPage? = null - Pagination.
- filter: String? = null - Filter expression.
- sort: Collection<PNSortKey<PNMembershipKey>> = listOf() - Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE; asc/desc.
- include: MembershipInclude = MembershipInclude() - Include additional data.

##### API limits
See REST API docs: set membership metadata.

#### ChannelMembershipInput
- channel: String - Channel to add.
- custom: CustomObject - Additional metadata.
- type: String - Membership type.
- status: String - Membership status.

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
- channels: List<String> - Channels to remove.
- userId: String = pubnub.configuration.userId.value - Defaults to configuration userId.
- filter: String? = null - Filter expression.
- sort: Collection<PNSortKey<PNMembershipKey>> = listOf() - Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE; asc/desc.
- page: PNPage? = null - Cursor-based pagination.
- limit: Int? (Default/Max 100) - Number per page.
- include: MembershipInclude = MembershipInclude() - Include additional fields.

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
- channelsToSet: List<PNChannelWithCustom> - Memberships to add/update.
- channelsToRemove: List<String> - Channels to remove.
- userId: String = pubnub.configuration.userId.value - Defaults to configuration userId.
- filter, sort, page, limit, include - Same semantics as above.

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

Returns a list of members in a channel (with user metadata when available).

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
- channel: String - Channel name.
- limit: Int? (Default 100)
- page: PNPage? = null
- filter: String? = null - Filter expression; see filtering.
- sort: Collection<PNSortKey<PNMemberKey>> = listOf() - Sort by UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE; asc/desc.
- include: MemberInclude = MemberInclude() - Include additional data.

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
- channel: String - Channel name.
- users: List<PNMember.Partial> - Members to add.
- limit, page, filter, sort, include - Same semantics as above.

##### API limits
See REST API docs: set channel members metadata.

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
- userIds: List<String> - Members to remove.
- channel: String - Channel name.
- limit, page, filter, sort, include - Same semantics as above.

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

Set and remove channel members for a channel.

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
- channel: String - Channel name.
- usersToSet: List<PNMember.Partial> - Members to add with optional custom metadata.
- userIdsToRemove: List<String> - Members to remove.
- limit: Int? (Default 100)
- page: PNPage? = null
- filter: String? = null
- sort: Collection<PNSortKey<PNMemberKey>> = listOf() - Sort by UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE; asc/desc.
- include: MemberInclude = MemberInclude()

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