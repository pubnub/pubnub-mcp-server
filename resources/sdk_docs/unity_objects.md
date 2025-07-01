On this page
# App Context API for Unity SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.GetAllUuidMetadata()  
    .IncludeCustom(bool)  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.ActionPNGetAllUuidMetadataResult, PNStatus>)  
`
```

*  requiredParameterDescription`IncludeCustom`Type: boolWhether to fetch `Custom` fields or not.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Execute` *Type: `System.Action``System.Action` of type `PNGetAllUuidMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNGetAllUuidMetadataResult>>`.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class GetAllUuidMetadataExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    private async void Start() {  
        // Getting a reference to the Pubnub instance  
        var pubnub = pubnubManager.pubnub;  
  
        // Fetching all UUID metadata  
        var getAllUuidMetadataResponse = await pubnub.GetAllUuidMetadata()  
`
```
show all 39 lines

#### Response[​](#response)

```
`{  
    "Uuids": [  
        {  
            "Uuid": "uuid-1",  
            "Name": "John Doe",  
            "Email": "jack@twitter.com",  
            "ExternalId": null,  
            "ProfileUrl": null,  
            "Custom": null,  
            "Updated": "2020-06-17T16:28:14.060718Z"  
        },  
        {  
            "Uuid": "uuid-2",  
            "Name": "Bob Cat",  
            "Email": "bobc@example.com",  
`
```
show all 29 lines

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.GetUuidMetadata()  
    .Uuid(string)  
    .IncludeCustom(bool)  
    .Execute(System.ActionPNGetUuidMetadataResult, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid` *Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`IncludeCustom`Type: boolWhether to fetch `Custom` fields or not.`Execute` *Type: `System.Action``System.Action` of type `PNGetUuidMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNGetUuidMetadataResult>>`.

#### Basic Usage[​](#basic-usage-1)

```
`// Get Metadata for UUID set in the pubnub instance  
PNResultPNGetUuidMetadataResult> getUuidMetadataResponse = await pubnub.GetUuidMetadata()  
    .ExecuteAsync();  
PNGetUuidMetadataResult getUuidMetadataResult = getUuidMetadataResponse.Result;  
PNStatus status = getUuidMetadataResponse.Status;  
  
// Get Metadata for a specific UUID  
PNResultPNGetUuidMetadataResult> getUuidMetadataResponse = await pubnub.GetUuidMetadata()  
    .Uuid("my-uuid")  
    .ExecuteAsync();  
PNGetUuidMetadataResult getUuidMetadataResult = getUuidMetadataResponse.Result;  
PNStatus status = getUuidMetadataResponse.Status;  
`
```

#### Response[​](#response-1)

```
`{  
    "Uuid": "uuid-1",  
    "Name": "John Doe",  
    "Email": "jack@twitter.com",  
    "ExternalId": null,  
    "ProfileUrl": null,  
    "Custom": null,  
    "Updated": "2020-06-17T16:28:14.060718Z"  
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

To `Set UUID Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.SetUuidMetadata()  
    .Uuid(string)  
    .Name(string)  
    .Email(string)  
    .ExternalId(string)  
    .ProfileUrl(string)  
    .Custom(Dictionarystring, object>)  
    .IncludeCustom(bool)  
    .IfMatchesEtag(string)  
    .Execute(System.ActionPNSetUuidMetadataResult, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid` *Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`Name` *Type: stringDisplay name for the user.`Email`Type: stringThe user's email address.`ExternalId`Type: stringUser's identifier in an external system.`ProfileUrl`Type: stringThe URL of the user's profile picture.`Custom`Type: Dictionary`<string, object>`JSON object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`IfMatchesEtag`Type: stringThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.`IncludeCustom`Type: boolWhether to fetch `Custom` fields or not.`Execute` *Type: `System.Action``System.Action` of type `PNSetUuidMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNSetUuidMetadataResult>>`.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`// Set Metadata for UUID set in the pubnub instance  
PNResultPNSetUuidMetadataResult> setUuidMetadataResponse = await pubnub.SetUuidMetadata()  
    .Uuid(config.Uuid)  
    .Name("John Doe")  
    .Email("john.doe@user.com")  
    .ExecuteAsync();  
PNSetUuidMetadataResult setUuidMetadataResult = setUuidMetadataResponse.Result;  
PNStatus status = setUuidMetadataResponse.Status;  
`
```

#### Response[​](#response-2)

```
`{  
    "Uuid": "uuid-1",  
    "Name": "John Doe",  
    "Email": "jack@twitter.com",  
    "ExternalId": null,  
    "ProfileUrl": null,  
    "Custom": null,  
    "Updated": "2020-06-17T16:28:14.060718Z"  
}  
`
```

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.RemoveUuidMetadata()  
    .Uuid(string)  
`
```

*  requiredParameterDescription`Uuid` *Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`Execute` *Type: `System.Action``System.Action` of type `PNRemoveUuidMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNRemoveUuidMetadataResult>>`.

#### Basic Usage[​](#basic-usage-3)

```
`// Remove Metadata for UUID set in the pubnub instance  
PNResultPNRemoveUuidMetadataResult> removeUuidMetadataResponse = await pubnub.RemoveUuidMetadata()  
    .ExecuteAsync();  
PNRemoveUuidMetadataResult removeUuidMetadataResult = removeUuidMetadataResponse.Result;  
PNStatus status = removeUuidMetadataResponse.Status;  
`
```

#### Response[​](#response-3)

```
`{}  
`
```

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.GetAllChannelMetadata()  
    .IncludeCustom(bool)  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Filter(string)  
    .Execute(System.ActionPNGetAllChannelMetadataResult, PNStatus>)  
`
```

*  requiredParameterDescription`IncludeCustom`Type: boolWhether to fetch `Custom` fields or not.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Execute` *Type: `System.Action``System.Action` of type `PNGetAllChannelMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNGetAllChannelMetadataResult>>`.

#### Basic Usage[​](#basic-usage-4)

```
`PNResultPNGetAllChannelMetadataResult> getAllChannelMetadataResponse = await pubnub.GetAllChannelMetadata()  
    .IncludeCount(true)  
    .IncludeCustom(true)  
    .ExecuteAsync();  
  
PNGetAllChannelMetadataResult getAllChannelMetadataResult = getAllChannelMetadataResponse.Result;  
PNStatus status2 = getAllChannelMetadataResponse.Status;  
`
```

#### Response[​](#response-4)

```
`{  
    "Channels": [  
        {  
            "Channel": "my-channel",  
            "Name": "My channel",  
            "Description": "A channel that is mine",  
            "Custom": null,  
            "Updated": "2020-06-17T16:52:19.562469Z"  
        },  
        {  
            "Channel": "main",  
            "Name": "Main channel",  
            "Description": "The main channel",  
            "Custom": {  
                "public": true,  
`
```
show all 26 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.GetChannelMetadata()  
    .Channel(string)  
    .IncludeCustom(bool)  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`IncludeCustom`Type: boolWhether to fetch `Custom` fields or not.`Execute` *Type: `System.Action``System.Action` of type `PNGetChannelMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNGetChannelMetadataResult>>`.

#### Basic Usage[​](#basic-usage-5)

```
`// Get Metadata for a specific channel  
PNResultPNGetChannelMetadataResult> getChannelMetadataResponse = await pubnub.GetChannelMetadata()  
    .Channel("my-channel")  
    .IncludeCustom(true)  
    .ExecuteAsync();  
  
PNGetChannelMetadataResult getChannelMetadataResult = getChannelMetadataResponse.Result;  
PNStatus status = getChannelMetadataResponse.Status;  
`
```

#### Response[​](#response-5)

```
`{  
    "Channel": "my-channel",  
    "Name": "My channel",  
    "Description": "A channel that is mine",  
    "Custom": null,  
    "Updated": "2020-06-17T16:52:19.562469Z"  
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

To `Set Channel Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.SetChannelMetadata()  
    .Channel(string)  
    .Name(string)  
    .Description(string)  
    .Custom(Dictionarystring, object>)  
    .IncludeCustom(bool)  
    .IfMatchesEtag(string)  
    .Execute(System.ActionPNSetChannelMetadataResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`Name`Type: stringName of a channel.`Description`Type: stringDescription of a channel.`Custom`Type: Dictionary`<string, object>`Include respective additional fields in the response. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`IncludeCustom`Type: boolWhether to fetch `custom` fields or not.`IfMatchesEtag`Type: stringThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.`Execute` *Type: `System.Action``System.Action` of type `PNSetChannelMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNSetChannelMetadataResult>>`.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`// Set Metadata for a specific channel  
PNResultPNSetChannelMetadataResult> setChannelMetadataResponse = await pubnub.SetChannelMetadata()  
    .Channel("my-channel")  
    .Name("John Doe")  
    .Description("sample description")  
    .Custom(new Dictionarystring, object>() { { "color", "blue" } })  
    .IncludeCustom(true)  
    .ExecuteAsync();  
  
PNSetChannelMetadataResult setChannelMetadataResult = setChannelMetadataResponse.Result;  
PNStatus status = setChannelMetadataResponse.Status;  
`
```

#### Response[​](#response-6)

```
`{  
    "Channel": "my-channel",  
    "Name": "John Doe",  
    "Description": "sample description",  
    "Custom": {  
        "color": "blue"  
    },  
    "Updated": "2020-06-17T16:52:19.562469Z"  
}  
`
```

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`using System.Collections.Generic;  
using PubnubApi;  
using TMPro;  
using UnityEngine;  
using UnityEngine.UI;  
  
public class PubNubChannelMetadataExample : MonoBehaviour {  
  
    //UI input for the channel ID  
    [SerializeField] private TMP_InputField channelInput;  
  
    //UI inputs for new values  
    [SerializeField] private TMP_InputField nameInput;  
    [SerializeField] private TMP_InputField descriptionInput;  
    [SerializeField] private Toggle overwriteToggle;  
`
```
show all 96 lines

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Unity SDK:

```
`pubnub.RemoveChannelMetadata()  
    .Channel(string)  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`Execute` *Type: `System.Action``System.Action` of type `PNRemoveChannelMetadataResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNRemoveChannelMetadataResult>>`.

#### Basic Usage[​](#basic-usage-7)

```
`// Delete Metadata for a specific channel  
PNResultPNRemoveChannelMetadataResult> removeChannelMetadataResponse = await pubnub.RemoveChannelMetadata()  
    .Channel("mychannel")  
    .ExecuteAsync();  
  
PNRemoveChannelMetadataResult removeChannelMetadataResult = removeChannelMetadataResponse.Result;  
PNStatus status = removeChannelMetadataResponse.Status;  
`
```

#### Response[​](#response-7)

```
`{}  
`
```

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the Unity SDK:

```
`pubnub.GetMemberships()  
    .Uuid(string)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Execute(System.ActionPNGetMembershipsResult, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid` *Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`Include`Type: PNMembershipField[]Include respective additional fields in the response.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Execute` *Type: `System.Action``System.Action` of type `PNGetMembershipsResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNGetMembershipsResult>>`.

#### Basic Usage[​](#basic-usage-8)

```
`PNResultPNGetMembershipsResult> getMembershipsResponse = await pubnub.GetMemberships()  
    .Uuid("my-uuid")  
    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })  
    .IncludeCount(true)  
    .Page(new PNPageObject() { Next = "", Prev = "" })  
    .ExecuteAsync();  
  
PNGetMembershipsResult getMembeshipsResult = getMembershipsResponse.Result;  
PNStatus status = getMembershipsResponse.Status;  
`
```

#### Response[​](#response-8)

```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
                "Custom": null,  
                "Updated": "2020-06-17T16:55:44.632042Z"  
            },  
            "Custom": {  
                "starred": false  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
`
```
show all 38 lines

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Memberships` you can use the following method(s) in the Unity SDK:

```
`pubnub.SetMemberships()  
    .Uuid(string)  
    .Channels(ListPNMembership>)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.ActionPNMembershipsResult, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid` *Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`Channels` *Type: [List`<PNMembership>`](#pnmembership)List of `Channels` to add to membership. List can contain strings (channel-name only) or objects (which can include custom data).`Include`Type: PNMembershipField[]Include respective additional fields in the response.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Execute` *Type: `System.Action``System.Action` of type `PNMembershipsResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNMembershipsResult>>`.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### PNMembership[​](#pnmembership)

*  requiredPropertyDescription`Channel` *Type: `string`The name of the channel associated with this membership.`Custom`Type: `Dictionary<string, object>`A dictionary that stores custom metadata related to the membership, allowing for additional context or information.`Status`Type: `string`The status of the membership, for example: "active" or "inactive"`Type`Type: `string`The type of membership for categorization purposes.

#### Basic Usage[​](#basic-usage-9)

```
`ListPNMembership> setMembershipChannelMetadataIdList = new ListPNMembership>();  
if (!string.IsNullOrEmpty(seMembershipChannelMetaId))  
{  
    setMembershipChannelMetadataIdList.Add(new PNMembership() { Channel = "my-channel", Custom = new Dictionarystring, object>() { { "item", "book" } } });  
}  
  
PNResultPNMembershipsResult> setMembershipsResponse = await pubnub.SetMemberships()  
    .Uuid("my-uuid")  
    .Channels(setMembershipChannelMetadataIdList)  
    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })  
    .IncludeCount(true)  
    .ExecuteAsync();  
  
PNMembershipsResult setMembershipsResult = setMembershipsResponse.Result;  
PNStatus status = setMembershipsResponse.Status;  
`
```

#### Response[​](#response-9)

```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
                "Custom": null,  
                "Updated": "2020-06-17T16:55:44.632042Z"  
            },  
            "Custom": {  
                "starred": false  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
`
```
show all 38 lines

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Memberships` you can use the following method(s) in the Unity SDK:

```
`pubnub.RemoveMemberships()  
    .Uuid(string)  
    .Channels(Liststring>)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.ActionPNMembershipsResult, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid`Type: StringUnique user identifier. If not supplied then current user's `Uuid` is used.`Channels` *Type: List`<string>`Channels to remove from membership.`Include`Type: PNMembershipField[]Include respective additional fields in the response.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Execute` *Type: `System.Action``System.Action` of type `PNMembershipsResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNMembershipsResult>>`.

#### Basic Usage[​](#basic-usage-10)

```
`Liststring> removeMembershipList = new Liststring>();  
if (!string.IsNullOrEmpty(removeMembershipChannelMetaId))  
{  
    removeMembershipList.Add("my-channel");  
    removeMembershipList.Add("your-channel");  
}  
  
PNResultPNMembershipsResult> removeMembershipsResponse = await pubnub.RemoveMemberships()  
    .Uuid("uuid")  
    .Channels(removeMembershipList)  
    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })  
    .IncludeCount(true)  
    .ExecuteAsync();  
  
PNMembershipsResult removeMembershipsResult = removeMembershipsResponse.Result;  
`
```
show all 16 lines

#### Response[​](#response-10)

```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
                "Custom": null,  
                "Updated": "2020-06-17T16:55:44.632042Z"  
            },  
            "Custom": {  
                "starred": false  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
`
```
show all 38 lines

### Manage Channel Memberships[​](#manage-channel-memberships)

Set and remove channel memberships for a user.

#### Method(s)[​](#methods-11)

To `Manage Memberships` you can use the following method(s) in the Unity SDK:

```
`pubnub.ManageMemberships()  
    .Uuid(string)  
    .Set(ListPNMembership>)  
    .Remove(Liststring>)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Execute(System.ActionPNMembership, PNStatus>)  
`
```

*  requiredParameterDescription`Uuid` *Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`Set`Type: [List`<PNMembership>`](#pnmembership)Set channel memberships for the user.`Remove`Type: List`<string>`Remove channel memberships for the user.`Include`Type: PNMembershipField[]Include respective additional fields in the response.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Execute` *Type: `System.Action``System.Action` of type `PNMembership`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNMembership>>`.

#### Basic Usage[​](#basic-usage-11)

```
`ListPNMembership> setMembrshipList = new ListPNMembership>();  
setMembrshipList.Add(new PNMembership() { Channel = "ch1", Custom = new Dictionarystring, object>() { { "say","hello" } } });  
setMembrshipList.Add(new PNMembership() { Channel = "ch2", Custom = new Dictionarystring, object>() { { "say", "world" } } });  
setMembrshipList.Add(new PNMembership() { Channel = "ch3", Custom = new Dictionarystring, object>() { { "say", "bye" } } });  
  
Liststring> removeMembrshipList = new Liststring>();  
removeMembrshipList.Add("ch4");  
  
PNResultPNManageMembershipsResult> manageMmbrshipsResponse = await pubnub.ManageMemberships()  
    .Uuid("my-uuid")  
    .Set(setMembrshipList)  
    .Remove(removeMembrshipList)  
    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })  
    .IncludeCount(true)  
    .Page(new PNPageObject() { Next = "", Prev = "" })  
`
```
show all 20 lines

#### Response[​](#response-11)

```
`{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
                "Custom": null,  
                "Updated": "2020-06-17T16:55:44.632042Z"  
            },  
            "Custom": {  
                "starred": false  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
`
```
show all 38 lines

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the Unity SDK:

```
`pubnub.GetChannelMembers()  
    .Channel(string)  
    .Include(PNChannelMemberField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.ActionPNChannelMembersResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`Include`Type: PNChannelMemberField[]Include respective additional fields in the response.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Execute` *Type: `System.Action``System.Action` of type `PNChannelMembersResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelMembersResult>>`.

#### Basic Usage[​](#basic-usage-12)

```
`// Get Members (uuids) for a specific channel  
PNResultPNChannelMembersResult> getChannelMembersResponse = await pubnub.GetChannelMembers()  
    .Channel("my-channel")  
    .Include(new PNChannelMemberField[] { PNChannelMemberField.CUSTOM, PNChannelMemberField.UUID, PNChannelMemberField.UUID_CUSTOM })  
    .IncludeCount(true)  
    .ExecuteAsync();  
  
PNChannelMembersResult getChannelMembersResult = getChannelMembersResponse.Result;  
PNStatus status2 = getChannelMembersResponse.Status;  
`
```

#### Response[​](#response-12)

```
`{  
    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
                "Name": "John Doe",  
                "Email": "jack@twitter.com",  
                "ExternalId": "",  
                "ProfileUrl": "",  
                "Custom": null,  
                "Updated": "2019-02-20T23:11:20.89375"  
            },  
            "Custom": {  
                "role": "admin"  
            },  
`
```
show all 39 lines

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the Unity SDK:

```
`pubnub.SetChannelMembers()  
    .Channel(string)  
    .Uuids(ListPNChannelMember>)  
    .Include(PNChannelMemberField[])  
    .Page(PNPageObject)  
    .Sort(Liststring>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.ActionPNChannelMembersResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: StringChannel name.`Uuids` *Type: List`<PNChannelMember>`List of members to add to the `channel`. List can contain strings (Uuids only) or objects (which can include custom data).`Include`Type: PNChannelMemberField[]Include respective additional fields in the response.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Execute` *Type: `System.Action``System.Action` of type `PNChannelMembersResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelMembersResult>>`.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-13)

```
`// Add Members (UUID) for a specific channel  
ListPNChannelMember> setMemberChannelList = new ListPNChannelMember>();  
if (!string.IsNullOrEmpty(setMemberChUuid))  
{  
    setMemberChannelList.Add(new PNChannelMember() { Uuid = "my-uuid", Custom = new Dictionarystring, object>() { { "planet", "earth" } } });  
}  
PNResultPNChannelMembersResult> setChannelMembersResponse = await pubnub.SetChannelMembers()  
    .Channel(setmemberChMetadataId)  
    .Uuids(setMemberChannelList)  
    .Include(new PNChannelMemberField[] { PNChannelMemberField.CUSTOM, PNChannelMemberField.UUID, PNChannelMemberField.UUID_CUSTOM })  
    .IncludeCount(true)  
    .ExecuteAsync();  
  
PNChannelMembersResult setChannelMembersResult = setChannelMembersResponse.Result;  
PNStatus status2 = setChannelMembersResponse.Status;  
`
```

#### Response[​](#response-13)

```
`{  
    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
                "Name": "John Doe",  
                "Email": "jack@twitter.com",  
                "ExternalId": "",  
                "ProfileUrl": "",  
                "Custom": null,  
                "Updated": "2019-02-20T23:11:20.89375"  
            },  
            "Custom": {  
                "role": "admin"  
            },  
`
```
show all 39 lines

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the Unity SDK:

```
`pubnub.RemoveChannelMembers()  
    .Channel(string)  
    .Uuids(List)  
    .Include(PNChannelMembersInclude[])  
    .IncludeCount(bool)  
    .Page(PnPageObject)  
    .Sort(List)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.ActionPNChannelMembersResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`Uuids` *Type: List`<string>`Members to remove from channel.`Include`Type: PNChannelMemberField[]Include respective additional fields in the response.`IncludeCount`Type: boolRequest `IncludeCount` to be included in paginated response. By default, `IncludeCount` is omitted.`Page`Type: PNPageObjectUse for pagination.`Sort`Type: List`<string>`List of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).`Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Execute` *Type: `System.Action``System.Action` of type `PNChannelMembersResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNChannelMembersResult>>`.

#### Basic Usage[​](#basic-usage-14)

```
`// Remove Members (UUID) for a specific channel  
Liststring> removeChannelMemberList = new Liststring>();  
removeChannelMemberList.Add("my-uuid");  
removeChannelMemberList.Add("your-uuid");  
  
PNResultPNChannelMembersResult> removeChannelMembersResponse = await pubnub.RemoveChannelMembers()  
    .Channel("my-channel")  
    .Uuids(removeChannelMemberList)  
    .Include(new PNChannelMemberField[] { PNChannelMemberField.CUSTOM, PNChannelMemberField.UUID, PNChannelMemberField.UUID_CUSTOM })  
    .IncludeCount(true)  
    .ExecuteAsync();  
  
PNChannelMembersResult removeChannelMembersResult = removeChannelMembersResponse.Result;  
PNStatus status = removeChannelMembersResponse.Status;  
`
```

#### Response[​](#response-14)

```
`{**    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
                "Name": "John Doe",  
                "Email": "jack@twitter.com",  
                "ExternalId": "",  
                "ProfileUrl": "",  
                "Custom": null,  
                "Updated": "2019-02-20T23:11:20.89375"  
            },  
            "Custom": {  
                "role": "admin"  
            },  
`
```
show all 39 linesLast updated on May 6, 2025**