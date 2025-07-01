On this page
# App Context API for Go SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Go SDK:

```
`pn.GetAllUUIDMetadata().  
    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()  
`
```

*  requiredParameterDescription`Include`Type: []pubnub.PNUUIDMetadataIncludeList of additional/complex UUID attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values:**  `pubnub.PNUUIDMetadataIncludeCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Count`Type: boolRequest `Count` to be included in paginated response. By default, `Count` is omitted.`Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.`Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).   In addition to custom attributes, the expressions can refer to attributes on associated entities one level deep (that is, the association and its target entities).

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`package main  
  
import (  
    "fmt"  
    pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
    config := pubnub.NewConfigWithUserId("myUniqueUserId")  
    config.SubscribeKey = "demo"  
    config.PublishKey = "demo"  
    pn := pubnub.NewPubNub(config)  
  
    incl := []pubnub.PNUUIDMetadataInclude{pubnub.PNUUIDMetadataIncludeCustom}  
  
`
```
show all 40 lines

#### Response[​](#response)

The `GetAllUUIDMetadata()` operation returns a `PNGetAllChannelMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNUUIDDetails of type `PNUUID` are [here](#pnuuid)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Go SDK:

```
`pn.PNUUIDMetadataInclude().  
    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
    Sort(sort).  
    ID(string).  
    Execute()  
`
```

*  requiredParameterDescription`Include`Type: []pubnub.PNUUIDMetadataIncludeCustomList of additional/complex UUID attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNUUIDMetadataIncludeCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``ID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.

#### Basic Usage[​](#basic-usage-1)

```
`id := "testuuid"  
incl := []pubnub.PNUUIDMetadataInclude{  
        pubnub.PNUUIDMetadataIncludeCustom,  
    }  
res, status, err := pn.GetUUIDMetadata().  
    UUID(id).  
    Include(incl).  
    Execute()  
fmt.Println(res, status, err)  
`
```

#### Response[​](#response-1)

The `GetUUIDMetadata()` operation returns a `PNGetUUIDMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`PNUUIDDetails of type `PNUUID` are [here](#pnuuid)

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a UUID in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-2)

To `Set UUID Metadata` you can use the following method(s) in the Go SDK:

```
`pn.SetUUIDMetadata().  
    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
    Sort(sort).  
    ID(id).  
    Name(string).  
    ExternalID(string).  
    ProfileURL(string).  
    Email(string).  
    Custom(map[string]interface{}).  
    Execute()  
`
```

*  requiredParameterDescription`Include`Type: []pubnub.PNUUIDMetadataIncludeList of additional/complex UUID attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values:**  `pubnub.PNUUIDMetadataIncludeCustom``ID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.`Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Name` *Type: stringDisplay name for the user.`ExternalID`Type: stringUser's identifier in an external system`ProfileURL`Type: stringThe URL of the user's profile picture`Email`Type: stringThe user's email address.`Custom`Type: map[string]interfaceJSON object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`id := "testuuid"  
name := "name"  
extid := "extid"  
purl := "profileurl"  
email := "email"  
  
custom := make(map[string]interface{})  
custom["a"] = "b"  
custom["c"] = "d"  
  
incl := []pubnub.PNUUIDMetadataInclude{  
        pubnub.PNUUIDMetadataIncludeCustom,  
    }  
  
res, status, err := pn.SetUUIDMetadata()  
`
```
show all 24 lines

#### Response[​](#response-2)

The `SetUUIDMetadata()` operation returns a `PNSetUUIDMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`PNUUIDDetails of type `PNUUID` are [here](#pnuuid)

#### PNUUID[​](#pnuuid)

Property NameTypeDescription`ID`stringUnique user identifier. If not supplied then current user's `uuid` is used.`Name`stringDisplay name for the user.`ExternalID`stringUser's identifier in an external system`ProfileURL`stringThe URL of the user's profile picture`Email`stringThe user's email address.`Custom`map[string]interfaceJSON object of key-value pairs with supported data types.`Updated`stringLast updated date.`ETag`stringThe ETag.

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Go SDK:

```
`pn.RemoveUUIDMetadata().  
    ID(string).  
    Execute()  
`
```

*  requiredParameterDescription`ID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.

#### Basic Usage[​](#basic-usage-3)

```
`id := "testuuid"  
res, status, err := pn.RemoveUUIDMetadata()  
    .UUID(id)  
    .Execute()  
fmt.Println(res, status, err)  
`
```

#### Response[​](#response-3)

The `RemoveUUIDMetadata()` operation returns a `PNRemoveUUIDMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`interfaceReturns an empty interface.

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Go SDK:

```
`pn.GetAllChannelMetadata().  
    Include([]pubnub.PNChannelMetadataInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()  
`
```

*  requiredParameterDescription`Include`Type: []pubnub.PNChannelMetadataIncludeList of additional/complex space attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNChannelMetadataIncludeCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Count`Type: boolRequest `Count` to be included in paginated response. By default, `Count` is omitted.`Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.`Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).   In addition to custom attributes, the expressions can refer to attributes on associated entities one level deep (that is, the association and its target entities).

#### Basic Usage[​](#basic-usage-4)

```
`incl := []pubnub.PNChannelMetadataInclude{  
        pubnub.PNChannelMetadataIncludeCustom,  
    }  
res, status, err := pn.GetAllChannelMetadata()  
    .Include(incl)  
    .Sort(sort)  
    .Limit(100)  
    .Count(true)  
    .Execute()  
fmt.Println(res, status, err)  
`
```

#### Response[​](#response-4)

The `GetAllChannelMetadata()` operation returns a `PNGetAllChannelMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNChannelDetails of type `PNChannel` are [here](#pnchannel)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Go SDK:

```
`pn.GetChannelMetadata().  
    Include([]pubnub.PNChannelMetadataInclude).  
     Sort(sort).  
     ID(string).  
     Execute()  
`
```

*  requiredParameterDescription`Include`Type: []pubnub.PNChannelMetadataIncludeList of additional/complex space attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNChannelMetadataIncludeCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``ID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.

#### Basic Usage[​](#basic-usage-5)

```
`id := "testchannel"  
incl := []pubnub.PNChannelMetadataInclude{  
        pubnub.PNChannelMetadataIncludeCustom,  
    }  
res, status, err := pn.GetChannelMetadata()  
    .Include(incl)  
    .Channel(id)  
    .Execute()  
fmt.Println(res, status, err)  
`
```

#### Response[​](#response-5)

The `GetChannelMetadata()` operation returns a `PNGetChannelMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`PNChannelDetails of type `PNChannel` are [here](#pnchannel)

### Set Channel Metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a Channel in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-6)

To `Set Channel Metadata` you can use the following method(s) in the Go SDK:

```
`pn.SetChannelMetadata().  
    Include([]pubnub.PNChannelMetadataInclude).  
    Sort(sort).  
    ID(string).  
    Name(string).  
    Description(string).  
    Custom(map[string]interface{}).  
    Execute()  
`
```

*  requiredParameterDescription`Include`Type: []pubnub.PNChannelMetadataIncludeList of additional/complex space attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNChannelMetadataIncludeCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``ID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.`Name` *Type: stringName of a channel.`Description`Type: stringDescription of a channel.`Custom`Type: map[string]interfaceMap of string and interface with supported data types. Values must be scalar only; arrays or objects are not supported. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`id := "testchannel"  
name := "name"  
desc := "desc"  
custom := make(map[string]interface{}) custom["a"] = "b" custom["c"] = "d"  
incl := []pubnub.PNChannelMetadataInclude{  
        pubnub.PNChannelMetadataIncludeCustom,  
    }  
res, status, err := pn.SetChannelMetadata()  
    .Include(incl)  
    .Channel(id)  
    .Name(name)  
    .Description(desc)  
    .Custom(custom)  
    .Execute()  
`
```

#### Response[​](#response-6)

The `SetChannelMetadata()` operation returns a `PNSetChannelMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`PNChannelDetails of type `PNChannel` are [here](#pnchannel)

#### PNChannel[​](#pnchannel)

Property NameTypeDescription`ID`stringUnique user identifier. If not supplied then current user's `uuid` is used.`Name`stringDisplay name for the user.`Description`stringDescription of a channel.`Custom`map[string]interfaceMap of string and interface with supported data types. Values must be scalar only; arrays or objects are not supported.`Updated`stringLast updated date.`ETag`stringThe ETag.

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`package main  
  
import (  
	"bufio"  
	"fmt"  
	"os"  
	"strings"  
  
	"github.com/pubnub/go/v7"  
)  
  
func main() {  
	config := pubnub.NewConfig()  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
`
```
show all 119 lines

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Go SDK:

```
`pn.RemoveChannelMetadata().  
    ID(string).  
    Execute()  
`
```

*  requiredParameterDescription`ID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.

#### Basic Usage[​](#basic-usage-7)

```
`id := "testchannel"  
res, status, err := pn.RemoveChannelMetadata().Channel(id).Execute()  
`
```

#### Response[​](#response-7)

The `RemoveChannelMetadata()` operation returns a `PNRemoveChannelMetadataResponse` which contains the following parameters:

Property NameTypeDescription`Data`interfaceReturns an empty interface.

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the Go SDK:

```
`pn.GetMemberships().  
    UUID(string).  
    Include([]pubnub.PNMembershipsInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()  
`
```

*  requiredParameterDescription`UUID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.`Include`Type: []pubnub.PNMembershipsIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNMembershipsIncludeCustom`, `pubnub.PNMembershipsIncludeChannel`, `pubnub.PNMembershipsIncludeChannelCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intNumber of objects to return in response. Default is `100`, which is also the maximum value.`Count`Type: boolRequest `Count` to be included in paginated response. By default, `Count` is omitted.`Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.`Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).   In addition to custom attributes, the expressions can refer to attributes on associated entities one level deep (that is, the association and its target entities).

#### Basic Usage[​](#basic-usage-8)

```
`inclMemberships := []pubnub.PNMembershipsInclude{  
        pubnub.PNMembershipsIncludeCustom,  
        pubnub.PNMembershipsIncludeChannel,  
        pubnub.PNMembershipsIncludeChannelCustom,  
    }  
  
res, status, err := pn.GetMemberships()  
    .UUID("testuuid")  
    .Include(inclMemberships)  
    .Limit(100)  
    .Count(true)  
    .Execute()  
`
```

#### Response[​](#response-8)

The `GetMemberships()` operation returns a `PNGetMembershipsResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNMembershipsDetails of type `PNMemberships` are [here](#pnmemberships)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

#### PNMemberships[​](#pnmemberships)

Property NameTypeDescription`ID`stringUnique user identifier. If not supplied then current user's `uuid` is used.`Channel`PNChannelDetails of type PNChannel are [here](#pnchannel)`Custom`map[string]interfaceMap of string and interface with supported data types.`Updated`stringLast updated date.`ETag`stringThe ETag.

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Memberships` you can use the following method(s) in the Go SDK:

```
`pn.SetMemberships().  
    UUID(string).  
    Set([]pubnub.PNMembershipsSet).  
    Include([]pubnub.PNMembershipsInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()  
`
```

*  requiredParameterDescription`UUID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.`Set`Type: pubnub.PNMembershipsSetStruct of type `pubnub.PNMembershipsSet` to be added for the specified `UUID`. In `PNMembershipsSet` you can set the Channel (of type `PNMembershipsChannel` - consisting of an `ID` of `string` type ) and a `Custom` map.`Include`Type: []pubnub.PNMembershipsIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNMembershipsIncludeCustom`, `pubnub.PNMembershipsIncludeChannel`, `pubnub.PNMembershipsIncludeChannelCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intMaximum number of results to return per page. Default 100.`Count`Type: boolRequest TotalCount to be included in paginated response. Default `false``Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-9)

```
`inclMemberships := []pubnub.PNMembershipsInclude{  
        pubnub.PNMembershipsIncludeCustom,  
        pubnub.PNMembershipsIncludeChannel,  
        pubnub.PNMembershipsIncludeChannelCustom,  
    }  
  
custom := make(map[string]interface{})  
custom["a"] = "b"  
custom["c"] = "d"  
channel := pubnub.PNMembershipsChannel{  
        ID: "testchannel",  
    }  
  
inMem := pubnub.PNMembershipsSet{  
        ID: channel,  
`
```
show all 29 lines

#### Response[​](#response-9)

The `SetMemberships()` operation returns a `PNSetMembershipsResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNMembershipsDetails of type `PNMemberships` are [here](#pnmemberships)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Memberships` you can use the following method(s) in the Go SDK:

```
`pn.RemoveMemberships().  
    UUID(string).  
    Remove([]pubnub.PNMembershipsRemove).  
    Include([]pubnub.PNMembershipsInclude).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()  
`
```

*  requiredParameterDescription`UUID` *Type: stringUnique user identifier. If not supplied then current user's `uuid` is used.`Remove`Type: pubnub.PNMembershipsRemoveStruct of type `pubnub.PNMembershipsRemove` to be added for the specified `UUID`. In `PNMembershipsRemove` you can set the Channel (of type `PNMembershipsChannel` - consisting of an `ID` of `string` type ) and a `Custom` map.`Include`Type: []pubnub.PNMembershipsIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNMembershipsIncludeCustom`, `pubnub.PNMembershipsIncludeChannel`, `pubnub.PNMembershipsIncludeChannelCustom``Limit`Type: intMaximum number of results to return per page. Default 100.`Count`Type: boolRequest TotalCount to be included in paginated response. Default `false``Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.

#### Basic Usage[​](#basic-usage-10)

```
`inclMemberships := []pubnub.PNMembershipsInclude{  
        pubnub.PNMembershipsIncludeCustom,  
        pubnub.PNMembershipsIncludeChannel,  
        pubnub.PNMembershipsIncludeChannelCustom,  
    }  
channel := pubnub.PNMembershipsChannel{  
        ID: "testchannel",  
    }  
    reMem := pubnub.PNMembershipsRemove{  
        ID: channel,  
    }  
    reArrMem := []pubnub.PNMembershipsRemove{  
        reMem,  
    }  
res, status, err := pn.RemoveMemberships()  
`
```
show all 22 lines

#### Response[​](#response-10)

The `RemoveMemberships()` operation returns a `PNRemoveMembershipsResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNMembershipsDetails of type `PNMemberships` are [here](#pnmemberships)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

### Manage Channel Memberships[​](#manage-channel-memberships)

Manage the specified UUID's memberships. You can `Add`, `Remove`, and `Update` a UUID's memberships.

#### Method(s)[​](#methods-11)

To `Manage Memberships` you can use the following method(s) in the Go SDK:

```
`pn.ManageMemberships().  
    UUID(string).  
    Set([]pubnub.PNMembershipsSet).  
    Remove([]pubnub.PNMembershipsRemove).  
    Include([]pubnub.PNMembershipsInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()  
`
```

*  requiredParameterDescription`UUID`Type: stringUnique user identifier. If not supplied then current user's `Uuid` is used.`Set`Type: pubnub.PNMembershipsSetStruct of type `pubnub.PNMembershipsSet` to be added for the specified `UUID`. In `PNMembershipsSet` you can set the `Channel` (of type `PNMembershipsChannel` - consisting of an `ID` of `string` type ) and a `Custom` map.`Remove`Type: pubnub.PNMembershipsRemoveStruct of type `pubnub.PNMembershipsRemove` to be added for the specified UUID. In `PNMembershipsRemove` you can set the `Channel` (of type `PNMembershipsChannel` - consisting of an `ID` of `string` type )`Include`Type: []pubnub.PNMembershipsIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNMembershipsIncludeCustom`, `pubnub.PNMembershipsIncludeChannel`, `pubnub.PNMembershipsIncludeChannelCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intMaximum number of results to return per page. Default 100.`Count`Type: boolRequest TotalCount to be included in paginated response. Default `false``Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.

#### Basic Usage[​](#basic-usage-11)

```
`inclMemberships := []pubnub.PNMembershipsInclude{  
        pubnub.PNMembershipsIncludeCustom,  
        pubnub.PNMembershipsIncludeChannel,  
        pubnub.PNMembershipsIncludeChannelCustom,  
    }  
  
custom := make(map[string]interface{})  
custom["a"] = "b"  
custom["c"] = "d"  
    channel := pubnub.PNMembershipsChannel{  
        ID: "testchannel",  
    }  
  
inMem := pubnub.PNMembershipsSet{  
        ID: channel,  
`
```
show all 30 lines

#### Response[​](#response-11)

The `ManageMemberships()` operation returns a `PNManageMembershipsResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNMembershipsDetails of type `PNMemberships` are [here](#pnmemberships)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the Go SDK:

```
`pn.GetChannelMembers().  
    Channel(string).  
    Include(PNChannelMembersInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`Include`Type: []pubnub.PNChannelMembersIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNChannelMembersIncludeCustom`, `pubnub.PNChannelMembersIncludeUUID`, `pubnub.PNChannelMembersIncludeUUIDCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intMaximum number of results to return per page. Default 100.`Count`Type: boolRequest TotalCount to be included in paginated response. Default `false``Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.`Filter`Type: stringExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is [defined here](/docs/general/metadata/filtering).   In addition to custom attributes, the expressions can refer to attributes on associated entities one level deep (that is, the association and its target entities).

#### Basic Usage[​](#basic-usage-12)

```
`inclSm := []pubnub.PNChannelMembersInclude{  
        pubnub.PNChannelMembersIncludeCustom,  
        pubnub.PNChannelMembersIncludeUUID,  
        pubnub.PNChannelMembersIncludeUUIDCustom,  
    }  
  
res, status, err := pn.GetChannelMembers()  
    .Channel("testchannel")  
    .Include(inclSm)  
    .Limit(100)  
    .Count(true)  
    .Execute()  
fmt.Println(res, status, err)  
`
```

#### Response[​](#response-12)

The `GetChannelMembers()` operation returns a `PNGetChannelMembersResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNChannelMembersDetails of type `PNChannelMembers` are [here](#pnchannelmembers)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

#### PNChannelMembers[​](#pnchannelmembers)

Property NameTypeDescription`ID`stringUnique user identifier. If not supplied then current user's `uuid` is used.`UUID`PNUUIDDetails of type `PNUUID` are [here](#pnuuid)`Custom`map[string]interfaceMap of string and interface with supported data types.`Updated`stringLast updated date.`ETag`stringThe ETag.

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the Go SDK:

```
`pn.SetChannelMembers().  
    Channel(string).  
    Set([]pubnub.PNChannelMembersSet).  
    Include([]pubnub.PNChannelMembersInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel name.`Set`Type: pubnub.PNChannelMembersSetStruct of type `pubnub.PNChannelMembersSet` to be added for the specified space. In `PNChannelMembersSet` you can set the `UUID` (of type `PNChannelMembersUUID` - consisting of an `ID` of `string` type ) and a `Custom` map.`Include`Type: []pubnub.PNChannelMembersIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNChannelMembersIncludeCustom`, `pubnub.PNChannelMembersIncludeUUID`, `pubnub.PNChannelMembersIncludeUUIDCustom``Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Limit`Type: intMaximum number of results to return per page. Default 100.`Count`Type: boolRequest TotalCount to be included in paginated response. Default `false``Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-13)

```
`inclSm := []pubnub.PNChannelMembersInclude{  
        pubnub.PNChannelMembersIncludeCustom,  
        pubnub.PNChannelMembersIncludeUUID,  
        pubnub.PNChannelMembersIncludeUUIDCustom,  
    }  
    custom := make(map[string]interface{})  
    custom["a"] = "b"  
    custom["c"] = "d"  
    uuid := pubnub.PNChannelMembersUUID{  
        ID: "testuuid",  
    }  
inputUUID := pubnub.PNChannelMembersSet{  
        UUID:   uuid,  
        Custom: custom,  
    }  
`
```
show all 28 lines

#### Response[​](#response-13)

The `SetChannelMembers()` operation returns a `PNSetChannelMembersResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNChannelMembersDetails of type `PNChannelMembers` are [here](#pnchannelmembers)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the Go SDK:

```
`pn.RemoveChannelMembers().  
    Channel(string).  
    Remove([]pubnub.PNChannelMembersRemove{}).  
    Include([]pubnub.PNChannelMembersInclude).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel from which members should be fetched.`uuids` *Type: ArrayDefault:  
n/aList of `UUIDs` for which `metadata` associated with each of them in context of `channel` should be set. Each entry is dictionary with `UUID` and optional `custom` fields. `custom` should be dictionary with simple objects: `String` and `Integer`.`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response. Available options: 
- `count`- include how many UUID has been associated with metadata.
- `custom` - include field with additional information from metadata which has been used during `UUID` metadata set requests.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-14)

```
`inclSm := []pubnub.PNChannelMembersInclude{  
        pubnub.PNChannelMembersIncludeCustom,  
        pubnub.PNChannelMembersIncludeUUID,  
        pubnub.PNChannelMembersIncludeUUIDCustom,  
    }  
    uuid := pubnub.PNChannelMembersUUID{  
        ID: "testuuid",  
    }  
    re := pubnub.PNChannelMembersRemove{  
        UUID: uuid,  
    }  
  
    reArr := []pubnub.PNChannelMembersRemove{  
        re,  
    }  
`
```
show all 24 lines

#### Response[​](#response-14)

The `RemoveChannelMembers()` operation returns a `PNRemoveChannelMembersResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNChannelMembersDetails of type `PNChannelMembers` are [here](#pnchannelmembers)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.

### Manage Channel Members[​](#manage-channel-members)

The method Set and Remove channel memberships for a user.

#### Method(s)[​](#methods-15)

To `Manage Channel Members` you can use the following method(s) in the Go SDK:

```
`pn.ManageChannelMembers().  
    Channel(string).  
    Set([]pubnub.PNChannelMembersSet).  
    Remove([]pubnub.PNChannelMembersRemove{}).  
    Include([]pubnub.PNChannelMembersInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringChannel Name.`Set`Type: pubnub.PNChannelMembersSetStruct of type `pubnub.PNChannelMembersSet` to be added for the specified space. In `PNChannelMembersSet` you can set the `UUID` (of type `PNChannelMembersUUID` - consisting of an `ID` of `string` type ) and a `Custom` map.`Remove`Type: pubnub.PNChannelMembersRemoveStruct of type `pubnub.PNChannelMembersRemove` to be removed for the specified space. In `PNChannelMembersRemove` you can set the `UUID` (of type `PNChannelMembersUUID` - consisting of an `ID` of `string` type )`Limit`Type: intMaximum number of results to return per page. Default 100.`Count`Type: boolRequest TotalCount to be included in paginated response. Default `false``Start`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`End`Type: stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Start` parameter is supplied.`Sort`Type: ArrayList of criteria (name of field) which should be used for sorting. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``Include`Type: []pubnub.PNChannelMembersIncludeList of additional/complex attributes to include in response. Omit this parameter if you don't want to retrieve additional attributes. **Available values**   `pubnub.PNChannelMembersIncludeCustom`, `pubnub.PNChannelMembersIncludeUUID`, `pubnub.PNChannelMembersIncludeUUIDCustom`

#### Basic Usage[​](#basic-usage-15)

```
`inclSm := []pubnub.PNChannelMembersInclude{  
        pubnub.PNChannelMembersIncludeCustom,  
        pubnub.PNChannelMembersIncludeUUID,  
        pubnub.PNChannelMembersIncludeUUIDCustom,  
    }  
    custom := make(map[string]interface{})  
    custom["a"] = "b"  
    custom["c"] = "d"  
    uuid := pubnub.PNChannelMembersUUID{  
        ID: "testuuid",  
    }  
inputUUID := pubnub.PNChannelMembersSet{  
        UUID:   uuid,  
        Custom: custom,  
    }  
`
```
show all 29 lines

#### Response[​](#response-15)

The `ManageChannelMembers()` operation returns a `PNManageMembersResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNChannelMembersDetails of type `PNChannelMembers` are [here](#pnchannelmembers)`TotalCount`intTotal count of objects without pagination.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`Prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `Next` parameter is supplied.Last updated on **Mar 31, 2025**