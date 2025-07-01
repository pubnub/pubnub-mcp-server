On this page
# App Context API for PHP SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the PHP SDK:

```
`getAllUUIDMetadata()  
    ->includeFields(Array[String => Boolean])  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync()  
`
```

*  requiredParameterDescription`includeFields()`Type: Array[String => Boolean]Default:  
n/aInclude respective additional fields in the response. Key value array where keys are one of `totalCount` or `customFields` and value is a boolean. Set `customFields` to fetch `custom` fields or not. Set `totalCount` to request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
  
// Create configuration with demo keys  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-app-context-demo");  
  
`
```
show all 86 lines

#### Response[​](#response)

The `getAllUUIDMetadata()` operation returns a `PNGetAllUUIDMetadataResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNGetUUIDMetadataResult]List of uuid metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNGetUUIDMetadataResult` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the PHP SDK:

```
`getUUIDMetadata()  
    ->uuid(String)  
    ->sync()  
`
```

*  requiredParameterDescription`uuid()` *Type: StringDefault:  
n/aUnique user identifier

#### Basic Usage[​](#basic-usage-1)

```
`$response = $pubnub->getUUIDMetadata()  
    ->uuid("uuid")  
    ->sync();  
`
```

#### Response[​](#response-1)

The `getUUIDMetadata()` operation returns a `PNGetUUIDMetadataResult` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a UUID in the database, including the custom data object for each.

#### Method(s)[​](#methods-2)

To `Set UUID Metadata` you can use the following method(s) in the PHP SDK:

```
`setUUIDMetadata()  
    ->uuid(String)  
    ->meta(Array | StdClass)  
    ->ifMatchesEtag(String)  
    ->sync()  
`
```

*  requiredParameterDescription`uuid()` *Type: StringDefault:  
n/aUnique user identifier`meta()` *Type: Array or StdClassDefault:  
n/aUUID metadata to set.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

UUID metadata contains the following fields:

FieldTypeRequiredDescription`name`StringOptionalDisplay name for the user.`externalId`StringOptionalUser's identifier in an external system.`profileUrl`StringOptionalThe URL of the user's profile picture.`email`StringOptionalThe user's email address.`custom`Array or StdClassOptionalObject containing your custom fields. [App Context filtering language](/docs/general/metadata/filtering) doesn't support filtering by custom properties.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`// using array metadata  
$pubnub->setUUIDMetadata()  
    ->uuid("uuid")  
    ->meta([  
        "name" => "display_name",  
        "externalId" => "external_id",  
        "profileUrl" => "profile_url",  
        "email" => "email_address",  
        "custom" => [  
            "a" => "aa",  
            "b" => "bb"  
        ]  
    ])  
    ->sync();  
  
`
```
show all 33 lines

#### Response[​](#response-2)

The `setUUIDMetadata()` operation returns a `PNSetUUIDMetadataResult` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the PHP SDK:

```
`removeUUIDMetadata()  
    ->uuid(String)  
    ->sync()  
`
```

*  requiredParameterDescription`uuid()` *Type: StringDefault:  
n/aUnique user identifier

#### Basic Usage[​](#basic-usage-3)

```
`$response = $pubnub->removeUUIDMetadata()  
    ->uuid("uuid")  
    ->sync();  
`
```

#### Response[​](#response-3)

Returns a boolean, `true` for success otherwise `false`

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the PHP SDK:

```
`getAllChannelMetadata()  
    ->includeFields(Array[String => Boolean])  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync()  
`
```

*  requiredParameterDescription`includeFields()`Type: Array[String => Boolean]Default:  
n/aInclude respective additional fields in the response. Key value array where keys are one of `totalCount` or `customFields` and value is a boolean. Set `customFields` to fetch `custom` fields or not. Set `totalCount` to request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage-4)

```
`$response = $pubnub->getAllChannelMetadata()  
    ->includeFields([ "totalCount" => true, "customFields" => true ])  
    ->sync();  
`
```

#### Response[​](#response-4)

The `getAllChannelMetadata()` operation returns a `PNGetAllChannelMetadataResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNGetChannelMetadataResult]List of channel metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNGetChannelMetadataResult` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channel`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the PHP SDK:

```
`getChannelMetadata()  
    ->channel(String)  
    ->sync()  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier

#### Basic Usage[​](#basic-usage-5)

```
`$response = $pubnub->getChannelMetadata()  
    ->channel("channel")  
    ->sync();  
`
```

#### Response[​](#response-5)

The `getChannelMetadata()` operation returns a `PNGetChannelMetadataResult` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channel`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields

### Set Channel Metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a Channel in the database, including the custom data object for each.

#### Method(s)[​](#methods-6)

To `Set Channel Metadata` you can use the following method(s) in the PHP SDK:

```
`setChannelMetadata()  
    ->channel(String)  
    ->meta(Array | StdClass)  
    ->ifMatchesEtag(String)  
    ->sync()  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier`meta()` *Type: Array or StdClassDefault:  
n/aChannel metadata to set.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

Channel metadata contains the following fields

FieldTypeRequiredDescription`name`StringOptionalDisplay name for the channel.`description`StringOptionalDescription of a channel.`custom`Array or StdClassOptionalObject containing your custom fields. [App Context filtering language](/docs/general/metadata/filtering) doesn't support filtering by custom properties.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`// using array metadata  
$pubnub->setChannelMetadata()  
    ->channel("channel")  
    ->meta([  
        "name" => "display_name",  
        "description" => "description_of_channel",  
        "custom" => [  
            "a" => "aa",  
            "b" => "bb"  
        ]  
    ])  
    ->sync();  
  
// using stdClass metadata  
use stdClass;  
`
```
show all 29 lines

#### Response[​](#response-6)

The `setChannelMetadata()` operation returns a `PNSetChannelMetadataResult` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channels`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`  
  
set_time_limit(0);  
  
require('vendor/autoload.php');  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
$pnconf->setPublishKey("demo");  
$pnconf->setSubscribeKey("demo");  
$pnconf->setUuid("example");  
  
$pubnub = new PubNub($pnconf);  
`
```
show all 91 lines

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the PHP SDK:

```
`removeChannelMetadata()  
    ->channel(String)  
    ->sync()  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier

#### Basic Usage[​](#basic-usage-7)

```
`$response = $pubnub->removeChannelMetadata()  
    ->channel("channel")  
    ->sync();  
`
```

#### Response[​](#response-7)

Returns a boolean, `true` for success otherwise `false`

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the PHP SDK:

```
`getMemberships()  
    ->uuid(String)  
    ->include(PNMembershipIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`uuid()` *Type: StringDefault:  
n/aUnique user identifier`include()`Type: `PNMembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel ID information should be included in the response. → `channelCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channelType`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channelStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage-8)

```
`$includes = new PNMembershipIncludes();  
$includes->channel()->custom()->status()->type();  
  
$response = $pubnub->getMemberships()  
    ->uuid("uuid")  
    ->includes($includes)  
    ->sync();  
`
```

#### Response[​](#response-8)

The `getMemberships()` operation returns a `PNMembershipsResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembershipsResultItem]List of membership metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembershipsResultItem` which contains the following fields:

ParameterDescription`getChannel()`Type: PNMembershipChannel metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMembership` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channel`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Memberships` you can use the following method(s) in the PHP SDK:

```
`setMemberships()  
    ->uuid(String)  
    ->memberships(Array[PNChannelMembership])  
    ->custom(Array | StdClass)  
    ->include(PNMembershipIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`uuid()` *Type: StringDefault:  
n/aUnique user identifier`memberships()` *Type: Array[PNChannelMembership]Default:  
n/aArray of memberships to set.`custom()` *Type: Array or StdClassDefault:  
n/aObject of key-value pairs with supported data types.`include()`Type: `PNMembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel ID information should be included in the response. → `channelCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channelType`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channelStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.`channels()` *Type: Array[String or Array]Default:  
n/aArray of channels to add to membership. Array can contain strings (channel-name only) or objects (which can include custom data).

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-9)

```
`$includes = new PNMembershipIncludes();  
$includes->channel()->channelId()->channelCustom()->channelType()->channelStatus()->custom()->status()->type();  
  
$addMembership = $this->pubnub->setMemberships()  
    ->userId($this->user)  
    ->memberships([  
        new PNChannelMembership($this->channel1, ['BestDish' => 'Pizza'], 'Admin', 'Active'),  
        new PNChannelMembership($this->channel2, ['BestDish' => 'Lasagna'], 'Guest', 'Away'),  
    ])  
    ->include($includes)  
    ->sync();  
`
```

#### Response[​](#response-9)

The `setMemberships()` operation returns a `PNMembershipsResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembershipsResultItem]List of membership metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembershipsResultItem` which contains the following fields:

ParameterDescription`getChannel()`Type: PNMembershipChannel metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMembership` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channel`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Memberships` you can use the following method(s) in the PHP SDK:

```
`removeMemberships()  
    ->uuid(String)  
    ->memberships(Array[PNChannelMembership])  
    ->include(PNMembershipIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`uuid()` *Type: StringDefault:  
n/aUnique user identifier.`memberships()` *Type: Array[PNChannelMembership]Default:  
n/aArray of memberships to remove.`include()`Type: `PNMembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel ID information should be included in the response. → `channelCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channelType`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channelStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.`channels()` *Type: Array[String]Default:  
n/aArray of channels to remove from membership.

#### Basic Usage[​](#basic-usage-10)

```
`$includes = new PNMembershipIncludes();  
$includes->channel()->channelId()->channelCustom()->channelType()->channelStatus()->custom()->status()->type();  
  
$removeMembership = $this->pubnub->removeMemberships()  
    ->userId($this->user)  
    ->memberships([  
        new PNChannelMembership($this->channel1, ['BestDish' => 'Pizza'], 'Admin', 'Active'),  
        new PNChannelMembership($this->channel2, ['BestDish' => 'Lasagna'], 'Guest', 'Away'),  
    ])  
    ->include($includes)  
    ->sync();  
`
```

#### Response[​](#response-10)

The `removeMemberships()` operation returns a `PNMembershipsResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembershipsResultItem]List of membership metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembershipsResultItem` which contains the following fields:

ParameterDescription`getChannel()`Type: PNMembershipChannel metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMembership` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channel`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

### Manage Channel Memberships[​](#manage-channel-memberships)

Manage the members of a channel.

To `Manage Channel Memberships` you can use the following method(s) in the PHP SDK:

```
`manageMembers()  
    ->channel(String)  
    ->setChannels(Array[String])  
    ->removeChannels(Array[String])  
    ->setMemberships(Array[PNChannelMembership])  
    ->removeMemberships(Array[PNChannelMembership])  
    ->custom(Array | StdClass)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier`setChannels()` *Type: Array[String]Default:  
n/aArray of channels to add to the channel.`removeChannels()` *Type: Array[String]Default:  
n/aArray of channels to remove from the channel.`setMemberships()` *Type: Array[PNChannelMembership]Default:  
n/aArray of `PNChannelMembership` objects to add to the channel.`removeMemberships()` *Type: Array[PNChannelMembership]Default:  
n/aArray of `PNChannelMembership` objects to remove from the channel.`custom()` *Type: Array or StdClassDefault:  
n/aObject of key-value pairs with supported data types.`include()`Type: `PNMembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel ID information should be included in the response. → `channelCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channelType`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channelStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage-11)

```
`$response = $pubnub->manageMemberships()  
    ->channel("channel")  
    ->setChannels(["channel1", "channel2"])  
    ->removeChannels(["channel3"])  
    ->sync();  
`
```

#### Response[​](#response-11)

The `manageMemberships()` operation returns a `PNMembershipsResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembershipsResultItem]List of membership metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembershipsResultItem` which contains the following fields:

ParameterDescription`getChannel()`Type: PNMembershipChannel metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMembership` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique channel identifier`getName()`Type: StringDisplay name for the channel`getDescription()`Type: StringDescription of a channel`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-11)

To `Get Channel Members` you can use the following method(s) in the PHP SDK:

```
`getMembers()  
    ->channel(String)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier`include()`Type: `PNMemberIncludes`Default:  
n/aThe additional information to include in the member response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `userCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `userType`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `userStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage-12)

```
`$includes = new PNMemberIncludes();  
$includes->user()->custom()->status();  
  
$response = $pubnub->getMembers()  
    ->channel("channel")  
    ->includes($includes)  
    ->sync();  
`
```

#### Response[​](#response-12)

The `getMembers()` operation returns a `PNMembersResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembersResultItem]List of member metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembersResultItem` which contains the following fields:

ParameterDescription`getUUID()`Type: PNMemberUUID metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMember` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-12)

To `Set Channel Members` you can use the following method(s) in the PHP SDK:

```
`setMembers()  
    ->channel(String)  
    ->uuids(Array[String | Array])  
    ->custom(Array | StdClass)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier`uuids()` *Type: Array[String or Array]Default:  
n/aArray of members to add to the channel. Array can contain strings (uuid only) or arrays/objects (which can include custom data).`custom()` *Type: Array or StdClassDefault:  
n/aObject of key-value pairs with supported data types.`include()`Type: `PNMemberIncludes`Default:  
n/aThe additional information to include in the member response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `userCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `userType`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `userStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-13)

```
`$includes = new PNMemberIncludes();  
$includes->user()->userId()->userCustom()->userType()->userStatus()->custom()->status()->type();  
  
$addMembers = $this->pubnub->setMembers()  
    ->channel($this->channel)  
    ->members([  
        new PNChannelMember($this->userName1, ['BestDish' => 'Pizza'], 'Svensson', 'Active'),  
        new PNChannelMember($this->userName2, ['BestDish' => 'Lasagna'], 'Baconstrips', 'Retired'),  
    ])  
    ->include($includes)  
    ->sync();  
`
```

#### Response[​](#response-13)

The `setMembers()` operation returns a `PNMembersResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembersResultItem]List of member metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembersResultItem` which contains the following fields:

ParameterDescription`getUUID()`Type: PNMemberUUID metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMember` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-13)

To `Remove Channel Members` you can use the following method(s) in the PHP SDK:

```
`removeMembers()  
    ->channel(String)  
    ->members(PNChannelMember[])  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier`members()` *Type: PNChannelMember[]Default:  
n/aArray of members to remove from the channel`include()`Type: `PNMemberIncludes`Default:  
n/aThe additional information to include in the member response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `userCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `userType`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `userStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage-14)

```
`$includes = new PNMemberIncludes();  
$includes->user()->userId()->userCustom()->userType()->userStatus()->custom()->status()->type();  
  
$removeMembers = $this->pubnub->removeMembers()  
    ->channel($this->channel)  
    ->members([  
        new PNChannelMember($this->userName1, ['BestDish' => 'Pizza'], 'Svensson', 'Active'),  
        new PNChannelMember($this->userName2, ['BestDish' => 'Lasagna'], 'Baconstrips', 'Retired'),  
    ])  
    ->include($includes)  
    ->sync();  
`
```

#### Response[​](#response-14)

The `removeMembers()` operation returns a `PNMembersResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembersResultItem]List of member metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembersResultItem` which contains the following fields:

ParameterDescription`getUUID()`Type: PNMemberUUID metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMember` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

### Manage Channel Members[​](#manage-channel-members)

Manage the members of a channel.

To `Manage Channel Members` you can use the following method(s) in the PHP SDK:

```
`manageMembers()  
    ->channel(String)  
    ->setUuids(Array[String])  
    ->removeUuids(Array[String])  
    ->setMembers(Array[PNChannelMember])  
    ->removeMembers(Array[PNChannelMember])  
    ->custom(Array | StdClass)  
    ->include(PNMemberIncludes)  
    ->filter(String)  
    ->sort(String | Array[String])  
    ->limit(Integer)  
    ->page(Array[String => String])  
    ->sync();  
`
```

*  requiredParameterDescription`channel()` *Type: StringDefault:  
n/aUnique channel identifier`setUuids()` *Type: Array[String]Default:  
n/aArray of uuids to add to the channel.`removeUuids()` *Type: Array[String]Default:  
n/aArray of uuids to remove from the channel.`setMembers()` *Type: Array[PNChannelMember]Default:  
n/aArray of `PNChannelMember` objects to add to the channel.`removeMembers()` *Type: Array[PNChannelMember]Default:  
n/aArray of `PNChannelMember` objects to remove from the channel.`custom()` *Type: Array or StdClassDefault:  
n/aObject of key-value pairs with supported data types.`include()`Type: `PNMemberIncludes`Default:  
n/aThe additional information to include in the member response. → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `userCustom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `userType`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `userStatus`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.`filter()`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort()`Type: String or Array[String]Default:  
n/aString or Array of String property names to sort by, and an optional sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or omit to take the default sort direction (ascending). For example: `name:asc``limit()`Type: integerDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page()`Type: Array[String => String]Default:  
n/aUse for pagination. Key value array where keys are one of `next` or `prev` and value is a random string returned from the server, indicating a specific position in a data set. Set `prev` to a previously-returned string for fetching the previous page. Set `next` to a previously-returned string for fetching the next page.

#### Basic Usage[​](#basic-usage-15)

```
`$response = $pubnub->manageMembers()  
    ->channel("channel")  
    ->setUuids(["uuid1", "uuid2"])  
    ->removeUuids(["uuid3"])  
    ->sync();  
`
```

#### Response[​](#response-15)

The `manageMembers()` operation returns a `PNMembersResult` which contains the following fields:

ParameterDescription`getData()`Type: Array[PNMembersResultItem]List of member metadata results`getTotalCount()`Type: IntegerNumber of items returned in the data`getPrev()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`getNext()`Type: StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

Data is an array of `PNMembersResultItem` which contains the following fields:

ParameterDescription`getUUID()`Type: PNMemberUUID metadata`getCustom()`Type: StringstdClass object containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tag

Channel is a `PNMember` which contains the following fields:

ParameterDescription`getId()`Type: StringUnique user identifier`getName()`Type: StringDisplay name for the user`getExternalId()`Type: StringUser's identifier in an external system`getProfileUrl()`Type: StringThe URL of the user's profile picture`getEmail()`Type: StringThe user's email address`getCustom()`Type: stdClassObject containing your custom fields`getUpdated()`Type: StringThe last updated date and time`getETag()`Type: StringThe entity tagLast updated on **Apr 2, 2025**