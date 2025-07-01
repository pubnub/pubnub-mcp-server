On this page
# App Context API for JavaScript SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.getAllUUIDMetadata({  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: BooleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: BooleanDefault:  
`false`Whether to fetch `custom` fields or not.`filter`Type: stringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{name: 'asc'}``limit`Type: numberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

```
`  
`
```

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

To `Get UUID Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.getUUIDMetadata({  
    uuid: string,  
    include: any  
})  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
current `uuid`Unique user identifier. If not supplied then current user's `uuid` is used.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `customFields`Type: BooleanDefault:  
`true`Whether to fetch `custom` fields or not.

#### Basic Usage[​](#basic-usage-1)

```
`  
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

To `Set UUID Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.setUUIDMetadata({  
    uuid: string,  
    data: any,  
    include: any,  
    ifMatchesEtag: string  
})  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
current `uuid`Unique user identifier. If not supplied then current user's `uuid` is used.`data` *Type: anyDefault:  
n/aJSON object with uuid metadata to set.   `name`Type: stringDefault:  
n/aDisplay name for the user.   `externalId`Type: stringDefault:  
n/aUser's identifier in an external system   `profileUrl`Type: stringDefault:  
n/aThe URL of the user's profile picture   `email`Type: stringDefault:  
n/aThe user's email address.   `custom`Type: anyDefault:  
n/aJSON providing custom data about the user. Values must be scalar only; arrays or objects are not supported. [Filtering App Context data](/docs/general/metadata/filtering) through the `custom` property is not recommended in SDKs.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `customFields`Type: booleanDefault:  
`true`Whether to fetch `custom` fields or not.`ifMatchesEtag`Type: stringDefault:  
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

To `Remove UUID Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.removeUUIDMetadata({  
    uuid: string  
})  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
current `uuid`Unique user identifier. If not supplied then current user's `uuid` is used.

#### Basic Usage[​](#basic-usage-3)

```
`  
`
```

#### Response[​](#response-3)

```
`{  
    "status": 0,  
    "data": {}  
}  
`
```

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.getAllChannelMetadata({  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: BooleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: BooleanDefault:  
`false`Whether to fetch `custom` fields or not.`filter`Type: stringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{name: 'asc'}``limit`Type: numberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

#### Basic Usage[​](#basic-usage-4)

```
`  
`
```

#### Response[​](#response-4)

```
`{  
    "status": 200,  
    "data": [  
        {  
            "id": "team.blue",  
            "name": "Blue Team",  
            "description": "The channel for Blue team and no other teams.",  
            "custom": null,  
            "updated": "2019-02-20T23:11:20.893755",  
            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
        },  
        {  
            "id": "team.red",  
            "name": "Red Team",  
            "description": "The channel for Red team and no other teams.",  
`
```
show all 35 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.getChannelMetadata({  
    channel: string,  
    include: any  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel name.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `customFields`Type: BooleanDefault:  
`true`Whether to fetch `custom` fields or not.

#### Basic Usage[​](#basic-usage-5)

```
`  
`
```

#### Response[​](#response-5)

```
`{  
    "status": 200,  
    "data": {  
        "id": "team.blue",  
        "name": "Blue Team",  
        "description": "The channel for Blue team and no other teams.",  
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

To `Set Channel Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.setChannelMetadata({  
    channel: string,  
    data: any,  
    include: any,  
    ifMatchesEtag: string  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel name.`data` *Type: anyDefault:  
n/aJSON object with channel metadata to set.   `name`Type: stringDefault:  
n/aName of a channel.   `description`Type: stringDefault:  
n/aDescription of a channel.   `custom`Type: anyDefault:  
n/aJSON providing custom data about the channel. Values must be scalar only; arrays or objects are not supported. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `customFields`Type: booleanDefault:  
`true`Whether to fetch `custom` fields or not.`ifMatchesEtag`Type: stringDefault:  
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
`{  
    "status": 200,  
    "data": {  
        "id": "team.red",  
        "name": "Red Team",  
        "description": "The channel for Blue team and no other teams.",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
    }  
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

To `Remove Channel Metadata`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.removeChannelMetadata({  
    channel: string  
})  
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
`{  
    "status": 0,  
    "data": {}  
}  
`
```

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.getMemberships({  
    uuid: string,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
current `uuid`Unique user identifier. If not supplied then current user's `uuid` is used.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: booleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: booleanDefault:  
`false`Whether to include `custom` fields in the response.   `channelFields`Type: booleanDefault:  
`false`Whether to include fields for channel metadata in the response.   `customChannelFields`Type: booleanDefault:  
`false`Whether to include custom fields for channel metadata in the response.   `statusField`Type: booleanDefault:  
`false`Whether to include the membership's status field in the response.   `channelStatusField`Type: booleanDefault:  
`false`Whether to include the channel's status field in the response.   `channelTypeField`Type: booleanDefault:  
`false`Whether to include channel's type fields in the response.`filter`Type: stringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are `updated`, `status`, `type`, `channel.id`, `channel.name`, `channel.updated`, `channel.status` and, `channel.type`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{channel.name: 'asc'}``limit`Type: numberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

#### Basic Usage[​](#basic-usage-8)

```
`  
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

To `Set Memberships`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.setMemberships({  
    uuid: string,  
    channels: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
current `uuid`Unique user identifier. If not supplied then current user's `uuid` is used.`channels` *Type: Array`<string>`Default:  
n/aArray of `channels` to add to membership.   
   
 Array can contain strings (channel-name only) or objects which can include custom data, like status or type, for example: `{ id: "my-channel-3", custom: { owner: "PubNubUser" }, type: "regular_membership", status: "active" }`.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: booleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: booleanDefault:  
`false`Whether to include `custom` fields in the response.   `statusField`Type: booleanDefault:  
`false`Whether to include the membership's status field in the response.   `typeField`Type: booleanDefault:  
`false`Whether to include the membership's type field in the response.   `channelFields`Type: booleanDefault:  
`false`Whether to include fields for channel metadata in the response.   `customChannelFields`Type: booleanDefault:  
`false`Whether to include custom fields for channel metadata in the response.   `channelStatusField`Type: booleanDefault:  
`false`Whether to include the channel's status field in the response.   `channelTypeField`Type: booleanDefault:  
`false`Whether to include channel's type fields in the response.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are `updated`, `status`, `type`, `channel.id`, `channel.name`, `channel.updated`, `channel.status` and, `channel.type`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{channel.name: 'asc'}``limit`Type: NumberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-9)

```
`  
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

To `Remove Memberships`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.removeMemberships({  
    uuid: string,  
    channels: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
current `uuid`Unique user identifier. If not supplied then current user's `uuid` is used.`channels` *Type: Array`<string>`Default:  
n/aChannels to remove from membership.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: booleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: booleanDefault:  
`false`Whether to fetch `custom` fields or not.   `channelFields`Type: booleanDefault:  
`false`Include fields for channels metadata.   `customChannelFields`Type: booleanDefault:  
`false`Include custom fields for channels metadata.`filter`Type: stringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are `updated`, `channel.id`, `channel.name`, and `channel.updated`. Use `asc` or `desc` to specify sort direction., or specify `null` to take the default sort direction (ascending). For example: `{channel.name: 'asc'}``limit`Type: NumberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

#### Basic Usage[​](#basic-usage-10)

```
`  
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

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-11)

To `Get Channel Members`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.getChannelMembers({  
    channel: string,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel name.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: booleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: booleanDefault:  
`false`Whether to fetch `custom` fields   `UUIDFields`Type: booleanDefault:  
`false`Whether to include fields for UUIDs metadata.   `customUUIDFields`Type: booleanDefault:  
`false`Whether to include custom fields for UUIDs metadata.   `statusField`Type: booleanDefault:  
`false`Whether to include the member's status field in the response.   `UUIDStatusField`Type: booleanDefault:  
`false`Whether to include the member's status field in the response.   `UUIDTypeField`Type: booleanDefault:  
`false`Whether to include member's type fields in the response.`filter`Type: StringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are: `updated`, `status`, `type`, `uuid.id`, `uuid.name`, `uuid.updated`, `uuid.status`, and `uuid.type`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{uuid.name: 'asc'}``limit`Type: numberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

#### Basic Usage[​](#basic-usage-11)

```
`  
`
```

#### Response[​](#response-11)

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
        "email": "jack@twitter.com",  
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

#### Method(s)[​](#methods-12)

To `Set Channel Members`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.setChannelMembers({  
    channel: string,  
    uuids: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel name.`uuids` *Type: ArrayDefault:  
n/aArray of members to add to the `channel`. Array can contain strings (uuid only) or objects which can include custom data, for example: `{ id: "uuid-3", custom: { role: "Super Admin" } }`.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: booleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: booleanDefault:  
`false`Whether to fetch `custom` fields.   `statusField`Type: booleanDefault:  
`false`Whether to include the member's custom status field in the response.   `typeField`Type: booleanDefault:  
`false`Whether to include the member's custom type field in the response.   `UUIDFields`Type: booleanDefault:  
`false`Whether to include fields for UUID's metadata.   `customUUIDFields`Type: booleanDefault:  
`false`Whether to include custom fields for UUIDs metadata.   `UUIDStatusField`Type: booleanDefault:  
`false`Whether to include the member's status field in the response.   `UUIDTypeField`Type: booleanDefault:  
`false`Whether to include the member's type field in the response.`filter`Type: stringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are: `updated`, `status`, `type`, `uuid.id`, `uuid.name`, `uuid.updated`, `uuid.status`, and `uuid.type`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{uuid.name: 'asc'}``limit`Type: numberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-12)

```
`  
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

#### Method(s)[​](#methods-13)

To `Remove Channel Members`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.objects.removeChannelMembers({  
    channel: string,  
    uuids: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel name.`uuids` *Type: String[]Default:  
n/aMembers to remove from channel.`include`Type: anyDefault:  
n/aInclude respective additional fields in the response.   `totalCount`Type: booleanDefault:  
`false`Request `totalCount` to be included in paginated response. By default, `totalCount` is omitted.   `customFields`Type: booleanDefault:  
`false`Whether to fetch `custom` fields or not.   `UUIDFields`Type: booleanDefault:  
`false`Include fields for UUIDs metadata.   `customUUIDFields`Type: booleanDefault:  
`false`Include custom fields for UUIDs metadata.`filter`Type: stringDefault:  
n/aExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`sort`Type: anyDefault:  
n/aKey-value pair of a property to sort by, and a sort direction. Available options are `updated`, `uuid.id`, `uuid.name`, and `uuid.updated`. Use `asc` or `desc` to specify sort direction, or specify `null` to take the default sort direction (ascending). For example: `{uuid.name: 'asc'}``limit`Type: numberDefault:  
`100`Number of objects to return in response. Default is `100`, which is also the maximum value.`page`Type: anyDefault:  
n/aUse for pagination.   `next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.   `prev`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `next` parameter is supplied.

#### Basic Usage[​](#basic-usage-13)

```
`  
`
```

#### Response[​](#response-13)

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
show all 41 linesLast updated on Jun 30, 2025**