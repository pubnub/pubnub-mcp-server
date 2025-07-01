On this page
# App Context API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getAllUUIDMetadata(  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNKey>> = listOf(),  
    page: PNPage? = null,  
    limit: Int? = null,  
    includeCustom: Boolean = false,  
    includeCount: Boolean = false  
).async { result -> }  
`
```

*  requiredParameterDescription`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNKey.ID`, `PNKey.NAME`, `PNKey.UPDATED`, `PNKey.TYPE`, `PNKey.STATUS`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNKey.STATUS)` , `PNSortKey.desc(PNKey.TYPE)``page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeCount`Type: `Boolean`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

#### Response[​](#response)

```
`data class PNUUIDMetadataArrayResult(  
    val status: Int,  
    val data: CollectionPNUUIDMetadata>,  
    val totalCount: Int?,  
    val next: PNPage?,  
    val prev: PNPage?  
)  
  
data class PNUUIDMetadata(  
    val id: String,  
    val name: PatchValueString?>? = null,  
    val externalId: PatchValueString?>? = null,  
    val profileUrl: PatchValueString?>? = null,  
    val email: PatchValueString?>? = null,  
    val custom: PatchValueMapString, Any?>?>? = null,  
`
```
show all 20 lines

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getUUIDMetadata(  
    uuid: String? = null,  
    includeCustom: Boolean = false  
).async { result -> }  
`
```

*  requiredParameterDescription`uuid`Type: `String`Default:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.

#### Basic Usage[​](#basic-usage-1)

```
`  
`
```

#### Response[​](#response-1)

```
`data class PNUUIDMetadataResult(  
    val status: Int,  
    val data: PNUUIDMetadata?  
)  
  
data class PNUUIDMetadata(  
    val id: String,  
    val name: PatchValueString?>? = null,  
    val externalId: PatchValueString?>? = null,  
    val profileUrl: PatchValueString?>? = null,  
    val email: PatchValueString?>? = null,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: PatchValueString>? = null,  
    val eTag: PatchValueString>? = null,  
    val type: PatchValueString?>? = null,  
`
```
show all 17 lines

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a UUID in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-2)

To `Set UUID Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.setUUIDMetadata(  
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
`
```

*  requiredParameterDescription`uuid`Type: `String`Default:  
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

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`  
`
```

#### Response[​](#response-2)

```
`data class PNUUIDMetadataResult(  
    val status: Int,  
    val data: PNUUIDMetadata?  
)  
  
data class PNUUIDMetadata(  
    val id: String,  
    val name: PatchValueString?>? = null,  
    val externalId: PatchValueString?>? = null,  
    val profileUrl: PatchValueString?>? = null,  
    val email: PatchValueString?>? = null,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: PatchValueString>? = null,  
    val eTag: PatchValueString>? = null,  
    val type: PatchValueString?>? = null,  
`
```
show all 17 lines

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removeUUIDMetadata(  
    uuid: String? = null  
).async { result -> }  
`
```

*  requiredParameterDescription`uuid`Type: `String`Default:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.

#### Basic Usage[​](#basic-usage-3)

```
`  
`
```

#### Response[​](#response-3)

```
`data class PNRemoveMetadataResult(private val status: Int)  
`
```

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getAllChannelMetadata(  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNKey>> = listOf(),  
    page: PNPage? = null,  
    limit: Int? = null,  
    includeCustom: Boolean = false,  
    includeCount: Boolean = false,  
).async { result -> }  
`
```

*  requiredParameterDescription`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNKey.ID`, `PNKey.NAME`, `PNKey.UPDATED`, `PNKey.TYPE`, `PNKey.STATUS`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNKey.STATUS)` , `PNSortKey.desc(PNKey.TYPE)``page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeCount`Type: `Boolean`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.

#### Basic Usage[​](#basic-usage-4)

```
`  
`
```

#### Response[​](#response-4)

```
`data class PNChannelMetadataArrayResult(  
    val status: Int,  
    val data: CollectionPNChannelMetadata>,  
    val totalCount: Int?,  
    val next: PNPage?,  
    val prev: PNPage?  
)  
  
data class PNChannelMetadata(  
    val id: String,  
    val name: PatchValueString?>? = null,  
    val description: PatchValueString?>? = null,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: PatchValueString>? = null,  
    val eTag: PatchValueString>? = null,  
`
```
show all 18 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getChannelMetadata(  
    channel: String,  
    includeCustom: Boolean = false  
).async { result -> }  
`
```

*  requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.

#### Basic Usage[​](#basic-usage-5)

```
`  
`
```

#### Response[​](#response-5)

```
`data class PNChannelMetadataResult(  
    val status: Int,  
    val data: PNChannelMetadata?  
)  
  
data class PNChannelMetadata(  
    val id: String,  
    val name: PatchValueString?>? = null,  
    val description: PatchValueString?>? = null,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: PatchValueString>? = null,  
    val eTag: PatchValueString>? = null,  
    val type: PatchValueString?>? = null,  
    val status: PatchValueString?>? = null,  
)  
`
```

### Set Channel Metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a Channel in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-6)

To `Set Channel Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.setChannelMetadata(  
    channel: String,  
    includeCustom: Boolean = false,  
    name: String? = null,  
    description: String? = null,  
    custom: Any? = null  
    type: String?,  
    status: String?,  
    ifMatchesEtag: String?  
).async { result -> }  
`
```

*  requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`includeCustom`Type: `Boolean`Default:  
`false`Whether to include the custom field in the fetch response.`name`Type: `String?`Default:  
`null`Name for the channel.`description`Type: `String?`Default:  
`null`Description of a channel.`type`Type: `String?`Default:  
`null`The custom type of the channel.`status`Type: `String?`Default:  
`null`The custom type of the channel.`custom`Type: `Any?`Default:  
`null`Any object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`  
`
```

#### Response[​](#response-6)

```
`data class PNChannelMetadataResult(  
    val status: Int,  
    val data: PNChannelMetadata?  
)  
  
data class PNChannelMetadata(  
    val id: String,  
    val name: PatchValueString?>? = null,  
    val description: PatchValueString?>? = null,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: PatchValueString>? = null,  
    val eTag: PatchValueString>? = null,  
    val type: PatchValueString?>? = null,  
    val status: PatchValueString?>? = null,  
)  
`
```

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`  
`
```

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removeChannelMetadata(  
    channel: String  
).async { result -> }  
`
```

*  requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.

#### Basic Usage[​](#basic-usage-7)

```
`  
`
```

#### Response[​](#response-7)

```
`data class PNRemoveMetadataResult(private val status: Int)  
`
```

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Channel Memberships` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getMemberships(  
    userId: String? = null,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMembershipKey>> = listOf(),  
    include: MembershipInclude = MembershipInclude(),  
).async { result -> }  
`
```

*  requiredParameterDescription`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMembershipKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMembershipKey.CHANNEL_ID`, `PNMembershipKey.CHANNEL_NAME`, `PNMembershipKey.CHANNEL_UPDATED`, `PNMembershipKey.CHANNEL_STATUS`, `PNMembershipKey.CHANNEL_TYPE`, `PNMembershipKey.UPDATED`, `PNMembershipKey.STATUS` and  `PNMembershipKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMembershipKey.TYPE)` or `PNSortKey.PNDesc(PNMembershipKey.STATUS)`.`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-8)

```
`  
`
```

#### Response[​](#response-8)

```
`data class PNChannelMembershipArrayResult(  
    val status: Int,  
    val data: CollectionPNChannelMembership>,  
    val totalCount: Int?,  
    val next: PNPage?,  
    val prev: PNPage?  
)  
  
data class PNChannelMembership(  
    val channel: PNChannelMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>? = null,  
    val type: PatchValueString?>? = null  
`
```
show all 16 lines

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a User.

#### Method(s)[​](#methods-9)

To `Set Channel Memberships` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.setMemberships(  
    channels: ListChannelMembershipInput>,  
    userId: String? = null,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMembershipKey>>, = listOf(),  
    include: MembershipInclude = MembershipInclude(),  
).async { result -> }  
`
```

*  requiredParameterDescription`channels`Type: [`List<ChannelMembershipInput>`](#channelmembershipinput)Default:  
n/aList of [`ChannelMembershipInput`](#channelmembershipinput) to add to membership with optional custom metadata, like status or type.`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMembershipKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMembershipKey.CHANNEL_ID`, `PNMembershipKey.CHANNEL_NAME`, `PNMembershipKey.CHANNEL_UPDATED`, `PNMembershipKey.CHANNEL_STATUS`, `PNMembershipKey.CHANNEL_TYPE`, `PNMembershipKey.UPDATED`, `PNMembershipKey.STATUS` and  `PNMembershipKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMembershipKey.TYPE)` or `PNSortKey.PNDesc(PNMembershipKey.STATUS)`.`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`Object holding the configuration for whether to include additional data in the response.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### ChannelMembershipInput[​](#channelmembershipinput)

*  requiredParameterDescription`channel`Type: `String`The channel to add the membership to.`custom`Type: `CustomObject`Additional information about the membership.`type`Type: `String`The string description of the type of the membership.`status`Type: `String`The string description of the status of the membership.

#### Basic Usage[​](#basic-usage-9)

```
`  
`
```

#### Response[​](#response-9)

```
`data class PNChannelMembershipArrayResult(  
    val status: Int,  
    val data: CollectionPNChannelMembership>,  
    val totalCount: Int?,  
    val next: PNPage?,  
    val prev: PNPage?  
)  
  
data class PNChannelMembership(  
    val channel: PNChannelMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>? = null,  
    val type: PatchValueString?>? = null,  
`
```
show all 16 lines

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a User.

#### Method(s)[​](#methods-10)

To `Remove Channel Memberships` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removeMemberships(  
    channels: ListString>,  
    userId: String? = null,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMembershipKey>>, = listOf(),  
    include: MembershipInclude = MembershipInclude(),  
).async { result -> }  
`
```

*  requiredParameterDescription`channels`Type: `List<String>`Default:  
n/aList of channels to remove from membership.`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMembershipKey>>,`Default:  
`listOf()`List of properties to sort by. Available options are `PNMembershipKey.CHANNEL_ID`, `PNMembershipKey.CHANNEL_NAME`, `PNMembershipKey.CHANNEL_UPDATED`, `PNMembershipKey.CHANNEL_STATUS`, `PNMembershipKey.CHANNEL_TYPE`, `PNMembershipKey.UPDATED`, `PNMembershipKey.STATUS` and  `PNMembershipKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMembershipKey.TYPE)` or `PNSortKey.PNDesc(PNMembershipKey.STATUS)`.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-10)

```
`  
`
```

#### Response[​](#response-10)

```
`data class PNChannelMembershipArrayResult(  
    val status: Int,  
    val data: CollectionPNChannelMembership>,  
    val totalCount: Int?,  
    val next: PNPage?,  
    val prev: PNPage?  
)  
  
data class PNChannelMembership(  
    val channel: PNChannelMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>? = null,  
    val type: PatchValueString?>? = null,  
`
```
show all 16 lines

### Manage Channel Memberships[​](#manage-channel-memberships)

Manage a user's channel memberships.

#### Method(s)[​](#methods-11)

To `Manage Memberships` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.manageMemberships(  
    channelsToSet: ListPNChannelWithCustom>,  
    channelsToRemove: ListString>,  
    userId: String? = null,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMembershipKey>>, = listOf(),  
    include: MembershipInclude = MembershipInclude(),  
).async { result -> }  
`
```

*  requiredParameterDescription`channelsToSet`Type: `List<PNChannelWithCustom>`Default:  
n/aList of `PNChannelWithCustom` to add to membership.`channelsToRemove`Type: `List<String>`Default:  
n/aList of channels to remove from membership.`userId`Type: `String`Default:  
`pubnub.configuration.userId.value`Unique User Metadata identifier.  
If not supplied, then userId from configuration will be used.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMembershipKey>>,`Default:  
`listOf()`List of properties to sort by. Available options are `PNMembershipKey.CHANNEL_ID`, `PNMembershipKey.CHANNEL_NAME`, `PNMembershipKey.CHANNEL_UPDATED`, `PNMembershipKey.CHANNEL_STATUS`, `PNMembershipKey.CHANNEL_TYPE`, `PNMembershipKey.UPDATED`, `PNMembershipKey.STATUS` and  `PNMembershipKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMembershipKey.TYPE)` or `PNSortKey.PNDesc(PNMembershipKey.STATUS)`.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`include`Type: `MembershipInclude`Default:  
`MembershipInclude()`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-11)

```
`  
`
```

#### Response[​](#response-11)

```
`data class PNChannelMembershipArrayResult(  
    val status: Int,  
    val data: CollectionPNChannelMembership>,  
    val totalCount: Int?,  
    val next: PNPage?,  
    val prev: PNPage?  
)  
  
data class PNChannelMembership(  
    val channel: PNChannelMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>? = null,  
    val type: PatchValueString?>? = null,  
`
```
show all 16 lines

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getChannelMembers(  
    channel: String,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
    include: MemberInclude = MemberInclude(),  
).async { result -> }  
`
```

*  requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMemberKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMemberKey.UUID_ID`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_UPDATED`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_TYPE`, `PNMemberKey.UPDATED`,`PNMemberKey.STATUS`, `PNMemberKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMemberKey.TYPE)` or `PNSortKey.PNDesc(PNMemberKey.STATUS)`.`include`Type: `MemberInclude`Default:  
`MemberInclude()`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-12)

```
`  
`
```

#### Response[​](#response-12)

```
`data class PNMemberArrayResult(  
    val status: Int,  
    val data: CollectionPNMember>,  
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
`
```

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.setChannelMembers(  
    channel: String,  
    users: ListPNMember.Partial>,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
    include: MemberInclude = MemberInclude(),  
).async { result, status ->  
    if (status.error) {  
        // handle error  
    } else if (result != null) {  
        // handle result  
    }  
}  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel name.`users`Type: `List<PNMember.Partial>`Default:  
n/aList of members `PNMember.Partial` to add to channel.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMemberKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMemberKey.UUID_ID`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_UPDATED`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_TYPE`, `PNMemberKey.UPDATED`,`PNMemberKey.STATUS`, `PNMemberKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMemberKey.TYPE)` or `PNSortKey.PNDesc(PNMemberKey.STATUS)`.`include`Type: `MemberInclude`Default:  
`MemberInclude()`Object holding the configuration for whether to include additional data in the response.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-13)

```
`  
`
```

#### Response[​](#response-13)

```
`data class PNMemberArrayResult(  
    val status: Int,  
    val data: CollectionPNMember>,  
    val totalCount: Int?,  
    val next: PNPage.PNNext?,  
    val prev: PNPage.PNPrev?  
)  
  
data class PNMember(  
    val uuid: PNUUIDMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>?,  
    val type: PatchValueString?>?,  
`
```
show all 16 lines

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removeChannelMembers(  
    userIds: ListString>,  
    channel: String,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
    include: MemberInclude = MemberInclude(),  
).async { result -> }  
`
```

*  requiredParameterDescription`userIds`Type: `List<String>`Default:  
n/aList of members userIDs to remove from channel.`channel`Type: `String`Default:  
n/aChannel name.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMemberKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMemberKey.UUID_ID`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_UPDATED`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_TYPE`, `PNMemberKey.UPDATED`,`PNMemberKey.STATUS`, `PNMemberKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMemberKey.TYPE)` or `PNSortKey.PNDesc(PNMemberKey.STATUS)`.`include`Type: `MemberInclude`Default:  
`MemberInclude()`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-14)

```
`  
`
```

#### Response[​](#response-14)

```
`data class PNMemberArrayResult(  
    val status: Int,  
    val data: CollectionPNMember>,  
    val totalCount: Int?,  
    val next: PNPage.PNNext?,  
    val prev: PNPage.PNPrev?  
)  
  
data class PNMember(  
    val uuid: PNUUIDMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>?,  
    val type: PatchValueString?>?,  
`
```
show all 16 lines

### Manage Channel Members[​](#manage-channel-members)

Set and Remove channel memberships for a user.

#### Method(s)[​](#methods-15)

To `Manage Channel Members` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.manageChannelMembers(  
    channel: String,  
    usersToSet: ListPNMember.Partial>,  
    userIdsToRemove: ListString>,  
    limit: Int? = null,  
    page: PNPage? = null,  
    filter: String? = null,  
    sort: CollectionPNSortKeyPNMemberKey>> = listOf(),  
    include: MemberInclude = MemberInclude(),  
).async { result, status ->  
    if (status.error) {  
        // Handle error  
    } else if (result != null) {  
        // Handle successful result  
    }  
`
```
show all 16 lines
*  requiredParameterDescription`channel`Type: `String`Default:  
n/aChannel name.`usersToSet`Type: `List<PNMember.Partial>`Default:  
n/aList of members `PNMember.Partial` to add to the channel with optional custom metadata.`userIdsToRemove`Type: `List<String>`Default:  
n/aList of members userIds to remove from the channel.`limit`Type: `Int?`Default:  
100The number of objects to retrieve at a time.`page`Type: `PNPage?`Default:  
`null`The paging object used for pagination.`filter`Type: `String?`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Collection<PNSortKey<PNMemberKey>>`Default:  
`listOf()`List of properties to sort by. Available options are `PNMemberKey.UUID_ID`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_UPDATED`, `PNMemberKey.UUID_NAME`,`PNMemberKey.UUID_TYPE`, `PNMemberKey.UPDATED`,`PNMemberKey.STATUS`, `PNMemberKey.TYPE`. Use `PNSortKey.PNAsc` or `PNSortKey.PNDesc` to specify sort direction. For example: `PNSortKey.PNAsc(PNMemberKey.TYPE)` or `PNSortKey.PNDesc(PNMemberKey.STATUS)`.`include`Type: `MemberInclude`Default:  
`MemberInclude()`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-15)

```
`  
`
```

#### Response[​](#response-15)

```
`data class PNMemberArrayResult(**    val status: Int,  
    val data: CollectionPNMember>,  
    val totalCount: Int?,  
    val next: PNPage.PNNext?,  
    val prev: PNPage.PNPrev?  
)  
  
data class PNMember(  
    val uuid: PNUUIDMetadata,  
    val custom: PatchValueMapString, Any?>?>? = null,  
    val updated: String,  
    val eTag: String,  
    val status: PatchValueString?>?,  
    val type: PatchValueString?>?,  
`
```
show all 16 linesLast updated on Jun 2, 2025**