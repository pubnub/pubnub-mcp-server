# App Context API for Kotlin SDK

App Context (formerly Objects v2) stores metadata for users, channels, and memberships, and emits real-time events on set/update/remove. Setting the same data again doesn't trigger an event.

##### Breaking changes in v9.0.0
- Unified Java/Kotlin codebase, new PubNub client instantiation, updated async callbacks and status events.
- Migration guides: Java/Kotlin SDK and Objects v2 migration.

##### Request execution
- Most SDK methods return Endpoint. You must execute with .sync() or .async().

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
Returns a paginated list of UUID Metadata, optionally including custom.

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
- filter (String?, default null): Filter expression. See filtering docs.
- sort (Collection<PNSortKey<PNKey>>, default listOf()): Sort by ID, NAME, UPDATED, TYPE, STATUS with asc/desc (for example, PNSortKey.asc(PNKey.STATUS)).
- page (PNPage?, default null): Cursor-based pagination.
- limit (Int?, default 100): Number of objects to return. Default/Max 100.
- includeCustom (Boolean, default false): Include Custom object.
- includeCount (Boolean, default false): Include total count in paginated response.

#### Sample code
##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

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
Returns metadata for a specified UUID, optionally including custom.

#### Method(s)
```
`1pubnub.getUUIDMetadata(  
2    uuid: String? = null,  
3    includeCustom: Boolean = false  
4).async { result -> }  
`
```
- uuid (String?, default pubnub.configuration.uuid): UUID identifier; uses configured UUID if omitted.
- includeCustom (Boolean, default false): Include Custom object.

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
Set metadata for a UUID, optionally including custom.

Unsupported partial updates of custom metadata:
- Custom is overwritten on set. To append/merge, fetch existing metadata, merge client-side, then set.

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
- uuid (String?, default pubnub.configuration.uuid): UUID identifier; uses configured UUID if omitted.
- includeCustom (Boolean, default false): Include custom in fetch response.
- name (String?): Display name.
- externalId (String?): External system identifier.
- profileUrl (String?): Profile picture URL.
- email (String?): Email address.
- type (String?): Custom type of the user.
- status (String?): Custom status of the user.
- custom (Any?): Key-value pairs (strings, numbers, booleans). Filtering by custom not supported.
- ifMatchesEtag (String?): Use eTag for conditional update; server returns HTTP 412 on mismatch.

API limits: See REST API docs for maximum parameter lengths.

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
Removes metadata for a specified UUID.

#### Method(s)
```
`1pubnub.removeUUIDMetadata(  
2    uuid: String? = null  
3).async { result -> }  
`
```
- uuid (String?, default pubnub.configuration.uuid): UUID identifier; uses configured UUID if omitted.

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
Returns a paginated list of Channel Metadata, optionally including custom.

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
- filter (String?, default null): Filter expression. See filtering docs.
- sort (Collection<PNSortKey<PNKey>>, default listOf()): Sort by ID, NAME, UPDATED, TYPE, STATUS (use PNSortKey.asc/desc).
- page (PNPage?, default null): Pagination.
- limit (Int?, default 100): Object count (Default/Max 100).
- includeCustom (Boolean, default false): Include Custom field.
- includeCount (Boolean, default false): Include total count.

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
Returns metadata for a specified channel, optionally including custom.

#### Method(s)
```
`1pubnub.getChannelMetadata(  
2    channel: String,  
3    includeCustom: Boolean = false  
4).async { result -> }  
`
```
- channel (String): Channel name.
- includeCustom (Boolean, default false): Include custom in response.

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
Set metadata for a channel, optionally including custom.

Unsupported partial updates of custom metadata:
- Custom is overwritten on set. Fetch-merge-update if you need to append.

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
- channel (String): Channel name.
- includeCustom (Boolean, default false): Include custom in response.
- name (String?): Channel name.
- description (String?): Channel description.
- type (String?): Custom type.
- status (String?): Custom status.
- custom (Any?): Custom JSON (strings, numbers, booleans). Filtering by custom isn’t supported.
- ifMatchesEtag (String?): Conditional update using eTag; HTTP 412 if mismatch.

API limits: See REST API docs for maximum parameter lengths.

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
Removes metadata for a specified channel.

#### Method(s)
```
`1pubnub.removeChannelMetadata(  
2    channel: String  
3).async { result -> }  
`
```
- channel (String): Channel name.

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
- userId (String?, default pubnub.configuration.userId.value): User Metadata identifier; uses configured userId if omitted.
- limit (Int?, default 100): Object count per page.
- page (PNPage?, default null): Pagination.
- filter (String?, default null): Filter expression.
- sort (Collection<PNSortKey<PNMembershipKey>>, default listOf()): Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE (PNSortKey.PNAsc/PNDesc).
- include (MembershipInclude, default MembershipInclude()): Include additional data.

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
Set memberships for a user.

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
- channels (List<ChannelMembershipInput>): Memberships to add with optional custom/status/type.
- userId (String?, default pubnub.configuration.userId.value): User identifier; uses configured userId if omitted.
- limit (Int?, default 100), page (PNPage?, default null), filter (String?, default null).
- sort (Collection<PNSortKey<PNMembershipKey>>, default listOf()): Sort by CHANNEL_ID, CHANNEL_NAME, CHANNEL_UPDATED, CHANNEL_STATUS, CHANNEL_TYPE, UPDATED, STATUS, TYPE.
- include (MembershipInclude, default MembershipInclude()).

API limits: See REST API docs for maximum parameter lengths.

#### ChannelMembershipInput
- channel (String): Channel ID.
- custom (CustomObject): Additional info.
- type (String): Membership type.
- status (String): Membership status.

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
Remove memberships for a user.

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
- channels (List<String>): Channel IDs to remove.
- userId (String?, default pubnub.configuration.userId.value): User identifier; uses configured userId if omitted.
- filter (String?, default null), sort (Collection<PNSortKey<PNMembershipKey>>, default listOf()), page (PNPage?, default null), limit (Int?, default 100), include (MembershipInclude).

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
Add and remove memberships for a user in one call.

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
- channelsToSet (List<PNChannelWithCustom>): Channels to add with optional custom.
- channelsToRemove (List<String>): Channels to remove.
- userId (String?, default pubnub.configuration.userId.value): User identifier.
- filter (String?, default null), sort (Collection<PNSortKey<PNMembershipKey>>, default listOf()), page (PNPage?, default null), limit (Int?, default 100), include (MembershipInclude).

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
Returns a list of members in a channel, including user metadata when present.

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
- channel (String): Channel name.
- limit (Int?, default 100), page (PNPage?, default null), filter (String?, default null).
- sort (Collection<PNSortKey<PNMemberKey>>, default listOf()): Sort by UUID_ID, UUID_NAME, UUID_UPDATED, UUID_NAME, UUID_TYPE, UPDATED, STATUS, TYPE.
- include (MemberInclude, default MemberInclude()).

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
Set members in a channel.

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
- channel (String): Channel name.
- users (List<PNMember.Partial>): Members to add (optional custom).
- limit (Int?, default 100), page (PNPage?, default null), filter (String?, default null).
- sort (Collection<PNSortKey<PNMemberKey>>, default listOf()).
- include (MemberInclude, default MemberInclude()).

API limits: See REST API docs for maximum parameter lengths.

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
Remove members from a channel.

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
- userIds (List<String>): Member user IDs to remove.
- channel (String): Channel name.
- limit (Int?, default 100), page (PNPage?, default null), filter (String?, default null), sort (Collection<PNSortKey<PNMemberKey>>, default listOf()), include (MemberInclude).

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
Set and remove channel members for a channel in one call.

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
- channel (String): Channel name.
- usersToSet (List<PNMember.Partial>): Members to add with optional custom.
- userIdsToRemove (List<String>): Members to remove.
- limit (Int?, default 100), page (PNPage?, default null), filter (String?, default null), sort (Collection<PNSortKey<PNMemberKey>>, default listOf()), include (MemberInclude).

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

Last updated on Sep 3, 2025**