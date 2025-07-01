# PubNub Kotlin SDK – App Context (Objects)

This condensed reference keeps every method signature, parameter, response model, and important note from the original guide.  
Invoke each Endpoint with `.async {}` or `.sync()`; otherwise, nothing is executed.

---

## Breaking changes (v9.0.0)
Kotlin SDK 9.0.0 unifies Kotlin/Java code bases, changes client instantiation, async callbacks, and status events. See the Java/Kotlin migration guide for details.

---

## Quick reminder – Request execution

```kotlin
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { ex   -> /* handle error   */ }
          .onSuccess { value -> /* handle result */ }
}
```

---

## User (UUID) Metadata

### Get metadata for **all** users
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
* **filter**: expression (see filtering docs)  
* **sort**: `PNKey.ID`, `NAME`, `UPDATED`, `TYPE`, `STATUS` (+ `asc/desc`)  
* **page**: `PNPage` cursor  
* **limit**: default 100  
* **includeCustom / includeCount**: booleans

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
    val updated: PatchValue<String>? = null,
    val eTag: PatchValue<String>? = null,
    val type: PatchValue<String?>? = null,
    val status: PatchValue<String?>? = null
)
```

### Get single user metadata
```kotlin
pubnub.getUUIDMetadata(
    uuid: String? = null,
    includeCustom: Boolean = false
).async { result -> }
```
* **uuid** default = configured `uuid`
* **includeCustom** boolean

(Uses `PNUUIDMetadataResult` and `PNUUIDMetadata` as above.)

### Set user metadata  
*Custom field replaces any existing custom data.*
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
Parameters as named; `ifMatchesEtag` performs optimistic-locking (HTTP 412 if mismatch).

(Uses `PNUUIDMetadataResult` / `PNUUIDMetadata`.)

### Remove user metadata
```kotlin
pubnub.removeUUIDMetadata(
    uuid: String? = null
).async { result -> }
```
```kotlin
data class PNRemoveMetadataResult(private val status: Int)
```

---

## Channel Metadata

### Get metadata for **all** channels
```kotlin
pubnub.getAllChannelMetadata(
    filter: String? = null,
    sort: Collection<PNSortKey<PNKey>> = listOf(),
    page: PNPage? = null,
    limit: Int? = null,
    includeCustom: Boolean = false,
    includeCount: Boolean = false
).async { result -> }
```
Same parameter semantics as user list.

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
    val type: PatchValue<String?>? = null,
    val status: PatchValue<String?>? = null
)
```

### Get single channel metadata
```kotlin
pubnub.getChannelMetadata(
    channel: String,
    includeCustom: Boolean = false
).async { result -> }
```

### Set channel metadata  
*Custom overwrites existing custom data.*
```kotlin
pubnub.setChannelMetadata(
    channel: String,
    includeCustom: Boolean = false,
    name: String? = null,
    description: String? = null,
    custom: Any? = null,
    type: String?,
    status: String?,
    ifMatchesEtag: String?
).async { result -> }
```

### Remove channel metadata
```kotlin
pubnub.removeChannelMetadata(
    channel: String
).async { result -> }
```
```kotlin
data class PNRemoveMetadataResult(private val status: Int)
```

---

## Channel Memberships (User-centric)

### Get channel memberships
```kotlin
pubnub.getMemberships(
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude()
).async { result -> }
```

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
)
```

### Set memberships
```kotlin
pubnub.setMemberships(
    channels: List<ChannelMembershipInput>,
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude()
).async { result -> }
```
`ChannelMembershipInput`:  
* `channel: String`  
* `custom: CustomObject?`  
* `type: String?`  
* `status: String?`

### Remove memberships
```kotlin
pubnub.removeMemberships(
    channels: List<String>,
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude()
).async { result -> }
```

### Manage memberships (set & remove in one call)
```kotlin
pubnub.manageMemberships(
    channelsToSet: List<PNChannelWithCustom>,
    channelsToRemove: List<String>,
    userId: String? = null,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMembershipKey>> = listOf(),
    include: MembershipInclude = MembershipInclude()
).async { result -> }
```

---

## Channel Members (Channel-centric)

### Get channel members
```kotlin
pubnub.getChannelMembers(
    channel: String,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude()
).async { result -> }
```

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
    val type: PatchValue<String?>?
)
```

### Set channel members
```kotlin
pubnub.setChannelMembers(
    channel: String,
    users: List<PNMember.Partial>,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude()
).async { result, status -> /* check status.error */ }
```

### Remove channel members
```kotlin
pubnub.removeChannelMembers(
    userIds: List<String>,
    channel: String,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude()
).async { result -> }
```

### Manage channel members (set & remove)
```kotlin
pubnub.manageChannelMembers(
    channel: String,
    usersToSet: List<PNMember.Partial>,
    userIdsToRemove: List<String>,
    limit: Int? = null,
    page: PNPage? = null,
    filter: String? = null,
    sort: Collection<PNSortKey<PNMemberKey>> = listOf(),
    include: MemberInclude = MemberInclude()
).async { result, status -> /* handle status */ }
```

---

Last updated Jun 2 2025