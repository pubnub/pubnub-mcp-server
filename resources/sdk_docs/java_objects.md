On this page
# App Context API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.getAllUUIDMetadata()  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .includeTotalCount(Boolean)  
    .includeCustom(Boolean)  
`
```

*  requiredParameterDescription`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: String?Default:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`.`includeTotalCount`Type: BooleanDefault:  
`false`Request `totalCount` to be included in paginated response, which is omitted by default.`includeCustom`Type: BooleanDefault:  
`false`Whether to include the `custom` object in the fetch response.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

#### Response[​](#response)

```
`public class PNGetAllUUIDMetadataResult extends EntityArrayEnvelopePNUUIDMetadata> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNUUIDMetadata> data;  
    PNPage nextPage() {  
        return PNPage.next(next);  
    }  
    PNPage previousPage() {  
        return PNPage.previous(prev);  
    }  
}  
  
public class PNUUIDMetadata extends PNObject {  
`
```
show all 24 lines

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.getUUIDMetadata()  
    .uuid(String)  
    .includeCustom(Boolean)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.`includeCustom`Type: BooleanDefault:  
`false`Whether to include the custom object in the fetch response.

#### Basic Usage[​](#basic-usage-1)

```
`  
`
```

#### Response[​](#response-1)

```
`public class PNGetUUIDMetadataResult extends EntityEnvelopePNUUIDMetadata> {  
    int status;  
    PNUUIDMetadata data;  
}  
  
public class PNUUIDMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String email;  
    String externalId;  
    String profileUrl;  
}  
`
```

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a UUID in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-2)

To `Set UUID Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.setUUIDMetadata()  
    .uuid(String)  
    .name(String)  
    .externalId(String)  
    .profileUrl(String)  
    .email(String)  
    .custom(MapString, Object>)  
    .includeCustom(true)  
    .ifMatchesEtag(String)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.`name`Type: StringDefault:  
n/aDisplay name for the user.`externalId`Type: StringDefault:  
n/aUser's identifier in an external system.`profileUrl`Type: StringDefault:  
n/aThe URL of the user's profile picture.`email`Type: StringDefault:  
n/aThe user's email address.`custom`Type: AnyDefault:  
n/aAny object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`includeCustom`Type: BooleanDefault:  
`false`Whether to include the `custom` object in the fetch response.`ifMatchesEtag`Type: StringDefault:  
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
`public class PNSetUUIDMetadataResult extends EntityEnvelopePNUUIDMetadata> {  
    protected int status;  
    protected PNUUIDMetadata data;  
}  
  
public class PNUUIDMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String email;  
    String externalId;  
    String profileUrl;  
}  
`
```

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.removeUUIDMetadata()  
    .uuid(String)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.

#### Basic Usage[​](#basic-usage-3)

```
`  
`
```

#### Response[​](#response-3)

```
`public class PNRemoveUUIDMetadataResult extends EntityEnvelopeJsonElement> {  
    int status;  
    JsonElement data;  
}  
`
```

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.getAllChannelsMetadata(  
        .limit(Integer)  
        .page(PNPage)  
        .filter(String)  
        .sort(ListPNSortKey>)  
        .includeTotalCount(Boolean)  
        .includeCustom(Boolean)  
`
```

*  requiredParameterDescription`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE) or PNSortKey.asc(PNSortKey.Key.STATUS)`.`includeTotalCount`Type: BooleanDefault:  
`false`Request `totalCount` to be included in paginated response, which is omitted by default.`includeCustom`Type: BooleanDefault:  
`false`Whether to include the `custom` object in the fetch response.

#### Basic Usage[​](#basic-usage-4)

```
`  
`
```

#### Response[​](#response-4)

```
`public class PNGetAllChannelsMetadataResult extends EntityArrayEnvelopePNChannelMetadata> {  
    int status;  
    ListPNChannelMetadata> data;  
    Integer totalCount;  
    String next;  
    String prev;  
}  
  
public class PNChannelMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String description;  
`
```
show all 16 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.getChannelMetadata()  
    .channel(String)  
    .includeCustom(Boolean)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.`includeCustom`Type: BooleanDefault:  
`false`Whether to include the custom object in the fetch response.

#### Basic Usage[​](#basic-usage-5)

```
`  
`
```

#### Response[​](#response-5)

```
`public class PNGetChannelMetadataResult extends EntityEnvelopePNChannelMetadata> {  
    protected int status;  
    protected PNChannelMetadata data;  
}  
  
public class PNChannelMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String description;  
}  
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

To `Set Channel Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.setChannelMetadata()  
    .channel(String)  
    .name(String)  
    .description(String)  
    .custom(MapString, Object>)  
    .includeCustom(Boolean)  
    .ifMatchesEtag(String)  
  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.`name`Type: StringDefault:  
n/aName for the channel.`description`Type: StringDefault:  
n/aDescription of a channel.`custom`Type: Map`<String, Object>`Default:  
n/aAny object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`includeCustom`Type: BooleanDefault:  
`false`Whether to include the `custom` object in the fetch response.`ifMatchesEtag`Type: StringDefault:  
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
`public class PNSetChannelMetadataResult extends EntityEnvelopePNChannelMetadata> {  
    protected int status;  
    protected PNChannelMetadata data;  
}  
  
public class PNChannelMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String description;  
}  
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

To `Remove Channel Metadata` you can use the following method(s) in the Java SDK:

```
`pubnub.removeChannelMetadata()  
    .channel(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.

#### Basic Usage[​](#basic-usage-7)

```
`  
`
```

#### Response[​](#response-7)

```
`public class PNRemoveChannelMetadataResult extends EntityEnvelopeJsonElement> {  
    int status;  
    protected JsonElement data;  
}  
`
```

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the Java SDK:

```
`pubnub.getMemberships()  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`userId`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: P`NSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`.`include`Type: `MembershipInclude`Default:  
All parameters set to `false`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-8)

```
`  
`
```

#### Response[​](#response-8)

```
`public class PNGetMembershipsResult extends EntityArrayEnvelopePNMembership> {  
    protected Integer totalCount;  
    protected String next;  
    protected String prev;  
    protected int status;  
    protected ListPNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

#### Basic Usage with Pagination[​](#basic-usage-with-pagination)

```
`  
`
```

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a User.

#### Method(s)[​](#methods-9)

To `Set Memberships` you can use the following method(s) in the Java SDK:

```
`pubnub.setMemberships(CollectionPNChannelMembership>)  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`channelMemberships` *Type: List`<PNChannelMembership>`Default:  
n/aCollection of [PNChannelMembership](#pnchannelmembership)  to add to membership.`userId`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
N/AThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`.`include`Type: `MembershipInclude`Default:  
All parameters set to `false`Object holding the configuration for whether to include additional data in the response.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### PNChannelMembership[​](#pnchannelmembership)

`PNChannelMembership` is a utility class that uses the builder pattern to construct a channel membership with additional custom data.

*  requiredParameterDescription`channel` *Type: `ChannelId`The name of the channel associated with this membership.`custom`Type: `Object`A dictionary that stores custom metadata related to the membership, allowing for additional context or information.`status`Type: `String`The status of the membership, for example: "active" or "inactive"`type`Type: `String`The type of membership for categorization purposes.

#### Basic Usage[​](#basic-usage-9)

```
`  
`
```

#### Response[​](#response-9)

```
`public class PNSetMembershipResult extends EntityArrayEnvelopePNMembership> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a User.

#### Method(s)[​](#methods-10)

To `Remove Memberships` you can use the following method(s) in the Java SDK:

```
`pubnub.removeMemberships(CollectionPNChannelMembership>)  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`channelMemberships` *Type: List`<PNChannelMembership>`Default:  
n/aCollection of [PNChannelMembership](#pnchannelmembership)  to add to membership.`userId`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`.`include`Type: `MembershipInclude`Default:  
All parameters set to `false`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-10)

```
`  
`
```

#### Response[​](#response-10)

```
`public class PNRemoveMembershipResults extends EntityArrayEnvelopePNMembership> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

### Manage Channel Memberships[​](#manage-channel-memberships)

Manage a user's channel memberships.

#### Method(s)[​](#methods-11)

To `Manage Memberships` you can use the following method(s) in the Java SDK:

```
`pubnub.manageMemberships(CollectionPNChannelMembership>, CollectionString>)  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`set` *Type: `Collection<PNChannelMembership>`Default:  
n/aList of members [PNChannelMembership](#pnchannelmembership)  to add to channel.`remove` *Type: `Collection<Stirng>`Default:  
n/aList of members channelIds  to remove from channel.`userId`Type: StringDefault:  
`pubnub.getConfiguration().getUserId().getValue()`Unique User Metadata identifier. If not supplied, then userId from configuration will be used.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)``include`Type: `MembershipInclude`Default:  
All parameters set to `false`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-11)

```
`  
`
```

#### Response[​](#response-11)

```
`public class PNManageMembershipResult extends EntityArrayEnvelopePNMembership> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the Java SDK:

```
`pubnub.getChannelMembers(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MemberInclude)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`.`include`Type: `MemberInclude`Default:  
All parameters set to `false`.Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-12)

```
`  
`
```

#### Response[​](#response-12)

```
`public class PNRemoveMembershipResults extends EntityArrayEnvelopePNMembers> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the Java SDK:

```
`pubnub.setChannelMembers(String, CollectionPNUser>)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MemberInclude)  
    .async(result -> { /* check result */ });  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.`channelMembers` *Type: [`Collection<PNUser>`](#pnuser)Default:  
n/aList of members to add to channel.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)``include`Type: `MemberInclude`Default:  
All parameters set to `false`.Object holding the configuration for whether to include additional data in the response.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### PNUser[​](#pnuser)

`PNUser` is a utility class that utilizes the builder pattern to facilitate the construction of a user object with additional customization options. This class allows users to define custom metadata, a status, and a type for a user.

*  requiredPropertyDescription`userId` *Type: `String`The unique identifier for the user. This field cannot be null or empty.`custom`Type: `Object`A dictionary-like object that stores custom metadata related to the user, which provides additional context or information.`status`Type: `String`The status of the user, which can be any string such as `active` or `inactive`.`type`Type: `String`The categorization type of the user, allowing for differentiation between user types.

#### Basic Usage[​](#basic-usage-13)

```
`  
`
```

#### Response[​](#response-13)

```
`public class PNSetChannelMembersResult extends EntityArrayEnvelopePNMembers> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the Java SDK:

```
`pubnub.removeChannelMembers(String, ListString>)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .includeTotalCount(Boolean)  
    .includeCustom(Boolean)  
    .includeUUID(PNUUIDDetailsLevel)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.`channelMembers` *Type: Collection`<String>`Default:  
n/aList of member userIds to remove from channel.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)``include`Type: `MemberInclude`Default:  
All parameters set to `false`Object defining options to include additional data in the response.

#### Basic Usage[​](#basic-usage-14)

```
`  
`
```

#### Response[​](#response-14)

```
`public class PNRemoveChannelMembersResult extends EntityArrayEnvelopePNMembers> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```

### Manage Channel Members[​](#manage-channel-members)

The method Set and Remove channel memberships for a user.

#### Method(s)[​](#methods-15)

To `Manage Channel Members` you can use the following method(s) in the Java SDK:

```
`pubnub.manageChannelMembers(String, CollectionPNUser>, CollectionString>)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(ListPNSortKey>)  
    .include(MemberInclude)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name.`set` *Type: [Collection`<PNUser>`](#pnuser)Default:  
n/aList of members to add to channel.`remove` *Type: Collection`<String>`Default:  
n/aList of userIds to remove from channel.`limit`Type: IntegerDefault:  
`100`The maximum number of objects to retrieve at a time.`page`Type: PNPageDefault:  
n/aThe paging object used for pagination.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: List`<PNSortKey>`Default:  
`listOf()`List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`.`include`Type: `MemberInclude`Default:  
All parameters set to `false`Object holding the configuration for whether to include additional data in the response.

#### Basic Usage[​](#basic-usage-15)

```
`  
`
```

#### Response[​](#response-15)

```
`public class PNManageChannelMembersResult extends EntityArrayEnvelopePNMembers> {**    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    ListPNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
`
```
Last updated on May 28, 2025**