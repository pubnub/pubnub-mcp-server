# PubNub Kotlin SDK • App Context API (Objects)

This condensed guide keeps every code block, method signature, parameter, and response model while stripping redundant text. Execute every Endpoint with `.sync()` or `.async()`.

---

## Request execution

```kotlin
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle successful method result
    }
}
```

---

## User

### Get metadata for all users
```kotlin
pubnub.getAllUUIDMetadata(
    filter: String? = null,
    sort: Collection<PNSortKey<PNKey>> = listOf(),
    page: PNPage? = null,
    limit: Int? = null,
    includeCustom: Boolean = false,
    includeCount: Boolean = false
).async { result -> }
```
* requiredParameterDescription`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNKey.ID`, `PNKey.NAME`, `PNKey.UPDATED`, `PNKey.TYPE`, `PNKey.STATUS`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNKey.STATUS)` , `PNSortKey.desc(PNKey.TYPE)``page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeCount`Type: `Boolean`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNUUIDMetadataArrayResult(
    val status: Int,
    val data: Collection<PNUUIDMetadata>,
    val totalCount: Int?,
    val next: PNPage?,
    val prev: PNPage?
)

data class PNUUIDMetadata(
    val id: String,
    val name: PatchValue<String?>? = null,
    val externalId: PatchValue<String?>? = null,
    val profileUrl: PatchValue<String?>? = null,
    val email: PatchValue<String?>? = null,
    val custom: PatchValue<Map<String, Any?>?>? = null,
```
show all 20 lines

---

### Get user metadata
```kotlin
pubnub.getUUIDMetadata(
    uuid: String? = null,
    includeCustom: Boolean = false
).async { result -> }
```
* requiredParameterDescription`uuid`Type: `String`Default:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNUUIDMetadataResult(
    val status: Int,
    val data: PNUUIDMetadata?
)

data class PNUUIDMetadata(
    val id: String,
    val name: PatchValue<String?>? = null,
    val externalId: PatchValue<String?>? = null,
    val profileUrl: PatchValue<String?>? = null,
    val email: PatchValue<String?>? = null,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: PatchValue<String>? = null,
    val eTag: PatchValue<String>? = null,
    val type: PatchValue<String?>? = null,
```
show all 17 lines

---

### Set user metadata
```kotlin
pubnub.setUUIDMetadata(
    uuid: String? = null,
    includeCustom: Boolean = false,
    name: String? = null,
    externalId: String? = null,
    profileUrl: String? = null,
    email: String? = null,
    custom: Any? = null,
    type: String?,
    status: String?,
    ifMatchesEtag: String?
).async { result -> }
```
* requiredParameterDescription`uuid`Type: `String`Default:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.`name`Type: `String?`Default:  
`null`Display name for the user.`externalId`Type: `String?`Default:  
`null`User's identifier in an external system`profileUrl`Type: `String?`Default:  
`null`The URL of the user's profile picture`email`Type: `String?`Default:  
`null`The user's email address.`type`Type: `String?`Default:  
`null`The custom type of the user.`status`Type: `String?`Default:  
`null`The custom type of the user.`custom`Type: `Any?`Default:  
`null`Any object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNUUIDMetadataResult(
    val status: Int,
    val data: PNUUIDMetadata?
)

data class PNUUIDMetadata(
    val id: String,
    val name: PatchValue<String?>? = null,
    val externalId: PatchValue<String?>? = null,
    val profileUrl: PatchValue<String?>? = null,
    val email: PatchValue<String?>? = null,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: PatchValue<String>? = null,
    val eTag: PatchValue<String>? = null,
    val type: PatchValue<String?>? = null,
```
show all 17 lines

---

### Remove user metadata
```kotlin
pubnub.removeUUIDMetadata(
    uuid: String? = null
).async { result -> }
```
* requiredParameterDescription`uuid`Type: `String`Default:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNRemoveMetadataResult(private val status: Int)
```

---

## Channel

### Get metadata for all channels
```kotlin
pubnub.getAllChannelMetadata(
    filter: String? = null,
    sort: Collection<PNSortKey<PNKey>> = listOf(),
    page: PNPage? = null,
    limit: Int? = null,
    includeCustom: Boolean = false,
    includeCount: Boolean = false,
).async { result -> }
```
* requiredParameterDescription`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNKey.ID`, `PNKey.NAME`, `PNKey.UPDATED`, `PNKey.TYPE`, `PNKey.STATUS`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNKey.STATUS)` , `PNSortKey.desc(PNKey.TYPE)``page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeCount`Type: `Boolean`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMetadataArrayResult(
    val status: Int,
    val data: Collection<PNChannelMetadata>,
    val totalCount: Int?,
    val next: PNPage?,
    val prev: PNPage?
)

data class PNChannelMetadata(
    val id: String,
    val name: PatchValue<String?>? = null,
    val description: PatchValue<String?>? = null,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: PatchValue<String>? = null,
    val eTag: PatchValue<String>? = null,
```
show all 18 lines

---

### Get channel metadata
```kotlin
pubnub.getChannelMetadata(
    channel: String,
    includeCustom: Boolean = false
).async { result -> }
```
* requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMetadataResult(
    val status: Int,
    val data: PNChannelMetadata?
)

data class PNChannelMetadata(
    val id: String,
    val name: PatchValue<String?>? = null,
    val description: PatchValue<String?>? = null,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: PatchValue<String>? = null,
    val eTag: PatchValue<String>? = null,
    val type: PatchValue<String?>? = null,
    val status: PatchValue<String?>? = null,
)
```

---

### Set channel metadata
```kotlin
pubnub.setChannelMetadata(
    channel: String,
    includeCustom: Boolean = false,
    name: String? = null,
    description: String? = null,
    custom: Any? = null
    type: String?,
    status: String?,
    ifMatchesEtag: String?
).async { result -> }
```
* requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.`name`Type: `String?`Default:  
`null`Name for the channel.`description`Type: `String?`Default:  
`null`Description of a channel.`type`Type: `String?`Default:  
`null`The custom type of the channel.`status`Type: `String?`Default:  
`null`The custom type of the channel.`custom`Type: `Any?`Default:  
`null`Any object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMetadataResult(
    val status: Int,
    val data: PNChannelMetadata?
)

data class PNChannelMetadata(
    val id: String,
    val name: PatchValue<String?>? = null,
    val description: PatchValue<String?>? = null,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: PatchValue<String>? = null,
    val eTag: PatchValue<String>? = null,
    val type: PatchValue<String?>? = null,
    val status: PatchValue<String?>? = null,
)
```

##### Iteratively update existing metadata
```
  
```

---

### Remove channel metadata
```kotlin
pubnub.removeChannelMetadata(
    channel: String
).async { result -> }
```
* requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNRemoveMetadataResult(private val status: Int)
```

---

## Channel memberships

### Get channel memberships
```kotlin
pubnub.getMemberships(
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude(),
).async { result -> }
```
* requiredParameterDescription`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMembershipKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMembershipKey.CHANNEL_ID`, `PNMembershipKey.CHANNEL_NAME`, `PNMembershipKey.CHANNEL_UPDATED`, `PNMembershipKey.CHANNEL_STATUS`, `PNMembershipKey.CHANNEL_TYPE`, `PNMembershipKey.UPDATED`, `PNMembershipKey.STATUS` and  `PNMembershipKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMembershipKey.TYPE)` or `PNSortKey.PNDesc(PNMembershipKey.STATUS)`.`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`Object holding the configuration for whether to include additional data in the response.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMembershipArrayResult(
    val status: Int,
    val data: Collection<PNChannelMembership>,
    val totalCount: Int?,
    val next: PNPage?,
    val prev: PNPage?
)

data class PNChannelMembership(
    val channel: PNChannelMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>? = null,
    val type: PatchValue<String?>? = null
```
show all 16 lines

---

### Set channel memberships
```kotlin
pubnub.setMemberships(
    channels: List<ChannelMembershipInput>,
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude(),
).async { result -> }
```
* requiredParameterDescription`channels`Type: [`List<ChannelMembershipInput>`](#channelmembershipinput)Default:  
n/aList of [`ChannelMembershipInput`](#channelmembershipinput) to add to membership with optional custom metadata, like status or type.`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned.`sort`Type: `Collection<PNSortKey<PNMembershipKey>>`Default:  
`listOf()`Use `PNSortKey.PNAsc`/`PNDesc`.`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`Include additional data.

#### ChannelMembershipInput
* requiredParameterDescription`channel`Type: `String`The channel to add the membership to.`custom`Type: `CustomObject`Additional information about the membership.`type`Type: `String`The string description of the type of the membership.`status`Type: `String`The string description of the status of the membership.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMembershipArrayResult(
    val status: Int,
    val data: Collection<PNChannelMembership>,
    val totalCount: Int?,
    val next: PNPage?,
    val prev: PNPage?
)

data class PNChannelMembership(
    val channel: PNChannelMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>? = null,
    val type: PatchValue<String?>? = null,
```
show all 16 lines

---

### Remove channel memberships
```kotlin
pubnub.removeMemberships(
    channels: List<String>,
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude(),
).async { result -> }
```
* requiredParameterDescription`channels`Type: `List<String>`Default:  
n/aList of channels to remove from membership.`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`filter`Type: `String?`Default:  
`null`Expression used to filter the results.`sort`Type: `Collection<PNSortKey<PNMembershipKey>>,`Default:  
`listOf()`Sort keys.`page`Type: `PNPage?`Default:  
`null``limit`Type: `Int`Default:  
100`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMembershipArrayResult(
    val status: Int,
    val data: Collection<PNChannelMembership>,
    val totalCount: Int?,
    val next: PNPage?,
    val prev: PNPage?
)

data class PNChannelMembership(
    val channel: PNChannelMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>? = null,
    val type: PatchValue<String?>? = null,
```
show all 16 lines

---

### Manage channel memberships
```kotlin
pubnub.manageMemberships(
    channelsToSet: List<PNChannelWithCustom>,
    channelsToRemove: List<String>,
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude(),
).async { result -> }
```
* requiredParameterDescription`channelsToSet`Type: `List<PNChannelWithCustom>`Default:  
n/aList of `PNChannelWithCustom` to add to membership.`channelsToRemove`Type: `List<String>`Default:  
n/aList of channels to remove from membership.`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  

#### Sample code
```
  
```

#### Response
```kotlin
data class PNChannelMembershipArrayResult(
    val status: Int,
    val data: Collection<PNChannelMembership>,
    val totalCount: Int?,
    val next: PNPage?,
    val prev: PNPage?
)

data class PNChannelMembership(
    val channel: PNChannelMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>? = null,
    val type: PatchValue<String?>? = null,
```
show all 16 lines

---

## Channel members

### Get channel members
```kotlin
pubnub.getChannelMembers(
    channel: String,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude(),
).async { result -> }
```
* requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`limit`Type: `Int`Default:  
100`page`Type: `PNPage?`Default:  
`null``filter`Type: `String?`Default:  
`null``sort`Type: `Collection<PNSortKey<PNMemberKey>>`Default:  
`listOf()` etc.`include`Type: `MemberInclude`Default:  
`MemberInclude()`

#### Sample code
```
  
```

#### Response
```kotlin
data class PNMemberArrayResult(
    val status: Int,
    val data: Collection<PNMember>,
    val totalCount: Int?,
    val next: PNPage.PNNext?,
    val prev: PNPage.PNPrev?
)

data class PNMember(
    val uuid: PNUUIDMetadata?,
    val custom: Any? = null,
    val updated: Instant,
    val eTag: String
)
```

---

### Set channel members
```kotlin
pubnub.setChannelMembers(
    channel: String,
    users: List<PNMember.Partial>,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude(),
).async { result, status ->
    if (status.error) {
        // handle error
    } else if (result != null) {
        // handle result
    }
}
```
* requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel name.`users`Type: `List<PNMember.Partial>`Default:  
n/aList of members `PNMember.Partial` to add to channel.`limit`Type: `Int`Default:  
100 ... (list continues as above).

#### Sample code
```
  
```

#### Response
```kotlin
data class PNMemberArrayResult(
    val status: Int,
    val data: Collection<PNMember>,
    val totalCount: Int?,
    val next: PNPage.PNNext?,
    val prev: PNPage.PNPrev?
)

data class PNMember(
    val uuid: PNUUIDMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>?,
    val type: PatchValue<String?>?,
```
show all 16 lines

---

### Remove channel members
```kotlin
pubnub.removeChannelMembers(
    userIds: List<String>,
    channel: String,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude(),
).async { result -> }
```
* requiredParameterDescription`userIds`Type: `List<String>`Default:  
n/aList of members userIDs to remove from channel.`channel`Type: `String`Default:  
n/aChannel name.`limit`Type: `Int`Default:  
100 ... etc.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNMemberArrayResult(
    val status: Int,
    val data: Collection<PNMember>,
    val totalCount: Int?,
    val next: PNPage.PNNext?,
    val prev: PNPage.PNPrev?
)

data class PNMember(
    val uuid: PNUUIDMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>?,
    val type: PatchValue<String?>?,
```
show all 16 lines

---

### Manage channel members
```kotlin
pubnub.manageChannelMembers(
    channel: String,
    usersToSet: List<PNMember.Partial>,
    userIdsToRemove: List<String>,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude(),
).async { result, status ->
    if (status.error) {
        // Handle error
    } else if (result != null) {
        // Handle successful result
    }
```
show all 16 lines
* requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`usersToSet`Type: `List<PNMember.Partial>`Default:  
n/aList of members `PNMember.Partial` to add to the channel with optional custom metadata.`userIdsToRemove`Type: `List<String>`Default:  
n/aList of members userIds to remove from the channel.`limit`Type: `Int?`Default:  
100 ... etc.

#### Sample code
```
  
```

#### Response
```kotlin
data class PNMemberArrayResult(**    val status: Int,
    val data: Collection<PNMember>,
    val totalCount: Int?,
    val next: PNPage.PNNext?,
    val prev: PNPage.PNPrev?
)

data class PNMember(
    val uuid: PNUUIDMetadata,
    val custom: PatchValue<Map<String, Any?>?>? = null,
    val updated: String,
    val eTag: String,
    val status: PatchValue<String?>?,
    val type: PatchValue<String?>?,
```
show all 16 lines

---

_Last updated Jul 15 2025_