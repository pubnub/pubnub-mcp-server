On this page
# App Context API for Dart SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is set or removed from the database. Clients can receive these events in realtime and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.getAllUUIDMetadata(  
  {bool? includeCustomFields,  
  int? limit,  
  String? start,  
  String? end,  
  bool? includeCount,  
  bool includeStatus,  
  bool includeType,  
  String? filter,  
  SetString>? sort,  
  Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`limit`Type: `int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCount`Type: `bool`Default:  
`true`Request `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Get metadata for all users  
  try {  
    var result = await pubnub.objects.getAllUUIDMetadata(  
`
```
show all 27 lines

#### Response[​](#response)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "id": "uuid-1",  
            "name": "John Doe",  
            "externalId": null,  
            "profileUrl": null,  
            "email": "johndoe@pubnub.com",  
            "custom": null,  
            "updated": "2019-02-20T23:11:20.893755",  
            "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
        },  
        {  
            "id": "uuid-2",  
`
```
show all 27 lines

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.getUUIDMetadata(  
  {String? uuid,  
  Keyset? keyset,  
  String? using,  
  bool? includeCustomFields,  
  bool includeStatus,  
  bool includeType  
  }  
)   
`
```

*  requiredParameterDescription`uuid`Type: `String`Default:  
defaultKeyset UUIDThe UUID to get the metadata for.  
If not supplied, the UUID from configuration will be used.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.

#### Basic Usage[​](#basic-usage-1)

```
`var result = await pubnub.objects.getUUIDMetadata();  
`
```

#### Response[​](#response-1)

```
`{  
    "status": 200,  
    "data": {  
        "id": "uuid-1",  
        "name": "John Doe",  
        "externalId": null,  
        "profileUrl": null,  
        "email": "johndoe@pubnub.com",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
    }  
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

To `Set UUID Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.setUUIDMetadata(  
  UuidMetadataInput uuidMetadataInput,  
  {String? uuid,  
  bool? includeCustomFields,  
  bool includeStatus,  
  bool includeType,  
  String? ifMatchesEtag,  
  Keyset? keyset,  
  String? using}  
)  
  
class UuidMetadataInput {  
  String? name;  
  String? email;  
  dynamic custom;  
`
```
show all 20 lines
*  requiredParameterDescription`uuidMetadataInput` *Type: [`UuidMetadataInput`](https://pub.dev/documentation/pubnub/latest/pubnub/UuidMetadataInput-class.html)Default:  
n/aUUID metadata details. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`uuid`Type: `String`Default:  
defaultKeyset UUIDUUID to set the metadata to.  
If not supplied, the UUID from configuration will be used.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`ifMatchesEtag`Type: String?Default:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`var uuidMetadataInput = UuidMetadataInput(  
    name: 'foo',  
    email: 'foo@example.domain',  
    profileUrl: 'http://sample.com');  
var result = await pubnub.objects.setUUIDMetadata(uuidMetadataInput);  
`
```

#### Response[​](#response-2)

```
`{  
    "status": 200,  
    "data": {  
        "id": "uuid-1",  
        "name": "John Doe",  
        "externalId": null,  
        "profileUrl": null,  
        "email": "johndoe@pubnub.com",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
    }  
}  
`
```

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.removeUUIDMetadata(  
  {String? uuid,  
  Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`uuid`Type: `String`Unique UUID Metadata identifier.  
If not supplied, the UUID from configuration will be used.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-3)

```
`var result = await pubnub.objects.removeUUIDMetadata();  
`
```

#### Response[​](#response-3)

The `removeUUIDMetadata()` returns `RemoveUuidMetadataResult` which does not have actionable data. In case of an error, an exception with error details is thrown.

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.getAllChannelMetadata(  
  {int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeCount,  
  bool includeStatus,  
  bool includeType,  
  String? filter,  
  SetString>? sort,  
  Keyset? keyset,  
  String? using}  
)  
`
```

*  requiredParameterDescription`limit`Type: `int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeCount`Type: `bool`Default:  
`true`Request `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-4)

```
`var result = await pubnub.objects.getAllChannelMetadata();  
`
```

#### Response[​](#response-4)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "id": "my-channel",  
            "name": "My channel",  
            "description": "A channel that is mine",  
            "custom": null,  
            "updated": "2019-02-20T23:11:20.893755",  
            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
        },  
        {  
            "id": "main",  
            "name": "Main channel",  
            "description": "The main channel",  
`
```
show all 27 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.getChannelMetadata(  
  String channelId,  
  {Keyset? keyset,  
  String? using,  
  bool? includeCustomFields  
  bool includeStatus,  
  bool includeType}  
)   
`
```

*  requiredParameterDescription`channelId` *Type: `String`Default:  
n/aChannel name.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.

#### Basic Usage[​](#basic-usage-5)

```
`var channelMetadata = await pubnub.objects.getChannelMetadata('my_channel');  
`
```

#### Response[​](#response-5)

```
`{  
    "status": 200,  
    "data": {  
        "id": "my-channel",  
        "name": "My channel",  
        "description": "A channel that is mine",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
    }  
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

To `Set Channel Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.setChannelMetadata(  
  String channelId,  
  ChannelMetadataInput channelMetadataInput,  
  {bool? includeCustomFields,  
  bool includeStatus,  
  bool includeType,  
  String? ifMatchesEtag,  
  Keyset? keyset,  
  String? using}  
)   
  
class ChannelMetadataInput {  
  String? name;  
  String? description;  
  dynamic custom;  
`
```
show all 18 lines
*  requiredParameterDescription`channelId` *Type: `String`Default:  
n/aChannel name.`channelMetadataInput` *Type: [`ChannelMetadataInput`](https://pub.dev/documentation/pubnub/latest/pubnub/ChannelMetadataInput-class.html)Default:  
n/aChannel metadata details. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`ifMatchesEtag`Type: String?Default:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`var channelMetadataInput = ChannelMetadataInput(  
    name: 'Channel name', description: 'A channel that is mine');  
      
var result = await pubnub.objects  
    .setChannelMetadata('my_channel', channelMetadataInput);  
`
```

#### Response[​](#response-6)

```
`{  
    "status": 200,  
    "data": {  
        "id": "my-channel",  
        "name": "My channel",  
        "description": "A channel that is mine",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
    }  
}  
`
```

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`import 'dart:async';  
import 'package:pubnub/pubnub.dart';  
Futurevoid> main() async {  
  var keyset = Keyset(  
      publishKey: 'demo',  
      subscribeKey: 'demo',  
      userId: const UserId('example'));  
  var pubnub = PubNub(defaultKeyset: keyset);  
  var channel = 'main';  
  var name = 'Main Channel';  
  var description = 'This is the main channel.';  
  var custom = {'users': 10};  
  
  // Setting the basic channel info  
  var channelMetadataInput = ChannelMetadataInput(  
`
```
show all 49 lines

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.removeChannelMetadata(  
  String channelId,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`channelID` *Type: `String`Channel name.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-7)

```
`var result = await pubnub.objects.removeChannelMetadata('my_channel');  
`
```

#### Response[​](#response-7)

The `removeChannelMetadata()` returns `RemoveChannelMetadataResult` which does not have actionable data. In case of an error, an exception with error details is thrown.

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Channel Memberships` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.getMemberships(  
  {String? uuid,  
  int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeChannelFields,  
  bool? includeChannelCustomFields,  
  bool? includeChannelStatus,  
  bool? includeChannelType,  
  bool? includeCount = true,  
  String? filter,  
  SetString>? sort,  
  Keyset? keyset,  
  String? using}  
`
```
show all 16 lines
*  requiredParameterDescription`uuid`Type: `String`Default:  
defaultKeyset UUIDUnique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeChannelFields`Type: `bool`Default:  
`false`Include fields for channels metadata.`includeCustomChannelFields`Type: `bool`Default:  
`false`Include custom fields for channels metadata.`includeChannelStatus`Type: `bool`Default:  
`true`Whether to include the channel `status` object in the response.`includeChannelType`Type: `bool`Default:  
`true`Whether to include the channel `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-8)

```
`  var memberships = await pubnub.objects.getMemberships();  
`
```

#### Response[​](#response-8)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
                "id": "my-channel",  
                "name": "My channel",  
                "description": "A channel that is mine",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Channel Memberships` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.setMemberships(  
  ListMembershipMetadataInput> setMetadata,  
  {String? uuid,  
  int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeChannelFields,  
  bool? includeChannelCustomFields,  
  bool includeChannelStatus,  
  bool includeChannelType,  
  bool includeStatus,  
  bool includeType,  
  bool? includeCount = true,  
  String? filter,  
`
```
show all 24 lines
*  requiredParameterDescription`setMetadata` *Type: `List<MembershipMetadataInput>`Default:  
n/aThe memberships to be set.`uuid`Type: `String`Default:  
defaultKeyset UUIDUnique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeChannelFields`Type: `bool`Default:  
`false`Include fields for channels metadata.`includeCustomChannelFields`Type: `bool`Default:  
`false`Include custom fields for channels metadata.`includeChannelStatus`Type: `bool`Default:  
`true`Whether to include the channel `status` object in the response.`includeChannelType`Type: `bool`Default:  
`true`Whether to include the channel `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-9)

```
`  var setMetadata = [  
    MembershipMetadataInput('my_channel', custom: {'starred': 'false'})  
  ];  
  
  var result = await pubnub.objects  
      .setMemberships(setMetadata, includeChannelFields: true);  
`
```

#### Response[​](#response-9)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
              "id": "my-channel",  
              "name": "My channel",  
              "description": "A channel that is mine",  
              "custom": null,  
              "updated": "2019-02-20T23:11:20.893755",  
              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Channel Memberships` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.removeMemberships(  
  SetString> channelIds,  
  {String? uuid,  
  int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeChannelFields,  
  bool? includeChannelCustomFields,  
  bool includeStatus,  
  bool includeType,  
  bool includeChannelStatus,  
  bool includeChannelType,  
  bool? includeCount = true,  
  String? filter,  
`
```
show all 19 lines
*  requiredParameterDescription`channelIds` *Type: `Set<String>`Default:  
n/aList of channels to remove from membership.`uuid`Type: `String`Default:  
n/aUnique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeChannelFields`Type: `bool`Default:  
`false`Include fields for channels metadata.`includeCustomChannelFields`Type: `bool`Default:  
`false`Include custom fields for channels metadata.`includeChannelStatus`Type: `bool`Default:  
`true`Whether to include the channel `status` object in the response.`includeChannelType`Type: `bool`Default:  
`true`Whether to include the channel `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-10)

```
`  var result = await pubnub.objects.removeMemberships({'my_channel', 'main_channel'});  
  
  // for other uuid  
  var result = await pubnub.objects.removeMemberships({'my_channel'}, uuid: 'uuid1');  
`
```

#### Response[​](#response-10)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
              "id": "my-channel",  
              "name": "My channel",  
              "description": "A channel that is mine",  
              "custom": null,  
              "updated": "2019-02-20T23:11:20.893755",  
              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

### Manage Channel Memberships[​](#manage-channel-memberships)

Manage a user's channel memberships.

#### Method(s)[​](#methods-11)

To `Manage Memberships` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.manageMemberships(  
  ListMembershipMetadataInput> setMetadata,  
  SetString> removeChannelIds,  
  {String? uuid,  
  int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeChannelFields,  
  bool? includeChannelCustomFields,  
  bool includeStatus,  
  bool includeType,  
  bool includeChannelStatus,  
  bool includeChannelType,  
  bool? includeCount,  
`
```
show all 25 lines
*  requiredParameterDescription`setMetadata` *Type: `List<MembershipMetadataInput>`Default:  
n/aThe memberships to be set.`channelIds` *Type: `Set<String>`Default:  
n/aList of channels to remove from membership.`uuid`Type: `String`Default:  
n/aUnique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeChannelFields`Type: `bool`Default:  
`false`Include fields for channels metadata.`includeCustomChannelFields`Type: `bool`Default:  
`false`Include custom fields for channels metadata.`includeChannelStatus`Type: `bool`Default:  
`true`Whether to include the channel `status` object in the response.`includeChannelType`Type: `bool`Default:  
`true`Whether to include the channel `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-11)

```
`  var setMetadata = [  
    MembershipMetadataInput('my_channel', custom: {'starred': 'false'})  
  ];  
  var result =  
      await pubnub.objects.manageMemberships(setMetadata, {'main_channel'});  
`
```

#### Response[​](#response-11)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
              "id": "my-channel",  
              "name": "My channel",  
              "description": "A channel that is mine",  
              "custom": null,  
              "updated": "2019-02-20T23:11:20.893755",  
              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.getChannelMembers(  
  String channelId,  
  {int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeUUIDFields,  
  bool? includeUUIDCustomFields,  
  bool includeStatus,  
  bool includeType,  
  bool includeUUIDStatus,  
  bool includeUUIDType,  
  bool? includeCount = true,  
  String? filter,  
  SetString>? sort,  
`
```
show all 18 lines
*  requiredParameterDescription`channelId`Type: `String`Default:  
n/aChannel name.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeUUIDFields`Type: BooleanDefault:  
`false`Include fields for UUIDs metadata.`includeUUIDCustomFields`Type: BooleanDefault:  
`false`Include custom fields for UUIDs metadata.`includeUUIDStatus`Type: `bool`Default:  
`true`Whether to include the user `status` object in the response.`includeUUIDType`Type: `bool`Default:  
`true`Whether to include the user `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-12)

```
`  var channelMembers = await pubnub.objects.getChannelMembers('my_channel');  
`
```

#### Response[​](#response-12)

```
`{  
  "status": 200,  
  "data": [  
    {  
      "uuid": {  
        "id": "uuid-1",  
        "name": "John Doe",  
        "externalId": null,  
        "profileUrl": null,  
        "email": "someone@pubnub.com",  
        "custom": null,  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
      },  
      "custom": {  
`
```
show all 41 lines

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.setChannelMembers(  
  String channelId,  
  ListChannelMemberMetadataInput> setMetadata,  
  {int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeUUIDFields,  
  bool? includeUUIDCustomFields,  
  bool includeStatus,  
  bool includeType,  
  bool includeUUIDStatus,  
  bool includeUUIDType,  
  bool? includeCount,  
  String? filter,  
`
```
show all 26 lines
*  requiredParameterDescription`channelId` *Type: `String`Default:  
n/aChannel name.`setMetadata` *Type: [`ChannelMemberMetadataInput`](https://pub.dev/documentation/pubnub/latest/pubnub/ChannelMemberMetadataInput-class.html)Default:  
n/aThe metadata to be added.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeUUIDFields`Type: BooleanDefault:  
`false`Include fields for UUIDs metadata.`includeUUIDCustomFields`Type: BooleanDefault:  
`false`Include custom fields for UUIDs metadata.`includeUUIDStatus`Type: `bool`Default:  
`true`Whether to include the user `status` object in the response.`includeUUIDType`Type: `bool`Default:  
`true`Whether to include the user `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-13)

```
`  var setMetadata = [  
    ChannelMemberMetadataInput('myUUID', custom: {'role': 'admin'})  
  ];  
  var result =  
      await pubnub.objects.setChannelMembers('my_channel', setMetadata);  
`
```

#### Response[​](#response-13)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "uuid": {  
                "id": "uuid-1",  
                "name": "John Doe",  
                "externalId": null,  
                "profileUrl": null,  
                "email": "johndoe@pubnub.com",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
            },  
            "custom": {  
`
```
show all 41 lines

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.removeChannelMembers(  
  String channelId,  
  SetString> uuids,  
  {int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeUUIDFields,  
  bool? includeUUIDCustomFields,  
  bool includeStatus,  
  bool includeType,  
  bool includeUUIDStatus,  
  bool includeUUIDType,  
  bool? includeCount,  
  String? filter,  
`
```
show all 19 lines
*  requiredParameterDescription`channelId` *Type: `String`Default:  
n/aChannel name.`uuids` *Type: `Set<String>`Default:  
n/aUUIDs to remove from the channel.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeUUIDFields`Type: BooleanDefault:  
`false`Include fields for UUIDs metadata.`includeUUIDCustomFields`Type: BooleanDefault:  
`false`Include custom fields for UUIDs metadata.`includeUUIDStatus`Type: `bool`Default:  
`true`Whether to include the user `status` object in the response.`includeUUIDType`Type: `bool`Default:  
`true`Whether to include the user `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-14)

```
`  var result = await pubnub.objects  
      .removeChannelMembers('my_channel', {'uuid-1', 'uuid-2'});  
`
```

#### Response[​](#response-14)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "uuid": {  
                "id": "uuid-1",  
                "name": "John Doe",  
                "externalId": null,  
                "profileUrl": null,  
                "email": "johndoe@pubnub.com",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
            },  
            "custom": {  
`
```
show all 41 lines

### Manage Channel Members[​](#manage-channel-members)

Set and Remove channel memberships for a user.

#### Method(s)[​](#methods-15)

To `Manage Channel Members` you can use the following method(s) in the Dart SDK:

```
`pubnub.objects.manageChannelMembers(  
  String channelId,  
  ListChannelMemberMetadataInput> setMetadata,  
  SetString> removeMemberUuids,  
  {int? limit,  
  String? start,  
  String? end,  
  bool? includeCustomFields,  
  bool? includeUUIDFields,  
  bool? includeUUIDCustomFields,  
  bool includeStatus,  
  bool includeType,  
  bool includeUUIDStatus,  
  bool includeUUIDType,  
  bool? includeCount = true,  
`
```
show all 27 lines
*  requiredParameterDescription`channelId` *Type: `String`Default:  
n/aChannel name.`setMetadata` *Type: [`List<ChannelMemberMetadataInput>`](https://pub.dev/documentation/pubnub/latest/pubnub/ChannelMemberMetadataInput-class.html)Default:  
n/aThe metadata to set.`removeMemberUuids` *Type: `Set<String>`Default:  
n/aUUIDs to remove from the channel.`limit`Type: `Int`Default:  
100The number of objects to retrieve at a time.`start`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`includeCustomFields`Type: `bool`Default:  
`false`Whether to include the `Custom` field in the fetch response.`includeUUIDFields`Type: BooleanDefault:  
`false`Include fields for UUIDs metadata.`includeUUIDCustomFields`Type: BooleanDefault:  
`false`Include custom fields for UUIDs metadata.`includeUUIDStatus`Type: `bool`Default:  
`true`Whether to include the user `status` object in the response.`includeUUIDType`Type: `bool`Default:  
`true`Whether to include the user `type` object in the response.`includeStatus`Type: `bool`Default:  
`true`Whether to include the `status` object in the response.`includeType`Type: `bool`Default:  
`true`Whether to include the `type` object in the response.`includeCount`Type: `bool`Default:  
`false`Request `IncludeCount` to be included in paginated response. By default, `includeCount` is omitted.`filter`Type: `String`Default:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `Set<String>`Default:  
n/aList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

#### Basic Usage[​](#basic-usage-15)

```
`  var setMetadata = [  
    ChannelMemberMetadataInput('uuidToSet', custom: {'role': 'admin'})  
  ];  
  var result = await pubnub.objects  
      .manageChannelMembers('my_channel', setMetadata, {'uuidToRemove'});  
`
```

#### Response[​](#response-15)

```
`{**    "status": 200,  
    "data": [  
        {  
            "uuid": {  
                "id": "uuid-1",  
                "name": "John Doe",  
                "externalId": null,  
                "profileUrl": null,  
                "email": "johndoe@pubnub.com",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
            },  
            "custom": {  
`
```
show all 41 linesLast updated on May 27, 2025**