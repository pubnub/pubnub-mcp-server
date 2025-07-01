On this page
# App Context API for Python SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

## User[​](#user)

### Get Metadata for all Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.get_all_uuid_metadata() \  
    .limit(Integer) \  
    .page(PNPage Object) \  
    .filter(String) \  
    .sort(ListPNSortKey>) \  
    .include_total_count(Boolean) \  
    .include_custom(Boolean) \  
    .include_status(Boolean) \  
    .include_type(Boolean)  
`
```

*  requiredParameterDescription`limit`Type: IntegerDefault:  
N/AThe maximum number of objects to retrieve at a time.`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination.`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `List<PNSortKey>`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}`.`include_total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default.`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response.`include_status`Type: BooleanDefault:  
`True`Whether to include the `status` field in the fetch response. Setting this to `False` will prevent this value from being returned.`include_type`Type: BooleanDefault:  
`True`Whether to include the `type` field in the fetch response. Setting this to `False` will prevent this value from being returned.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

Synchronous:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
from pubnub.exceptions import PubNubException  
  
  
def get_all_uuid_metadata(pubnub: PubNub):  
    try:  
        result = pubnub.get_all_uuid_metadata() \  
            .include_custom(True) \  
            .limit(10) \  
            .include_total_count(True) \  
            .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
            .page(None) \  
`
```

show all 43 linesAsynchronous:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
  
  
def callback(response, status):  
    if status.is_error():  
        print(f"Error: {status.error_data}")  
    else:  
        for uuid_data in response.data:  
            print(f"UUID: {uuid_data["id"]}")  
            print(f"Name: {uuid_data["name"]}")  
            print(f"Custom: {uuid_data["custom"]}")  
  
`
```

show all 43 linesSynchronous:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
from pubnub.exceptions import PubNubException  
  
  
def get_all_uuid_metadata(pubnub: PubNub):  
    try:  
        metadata = pubnub.get_all_uuid_metadata(  
            limit=10,  
            include_custom=True,  
            include_total_count=True,  
            sort_keys=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]  
        ).sync()  
`
```

show all 41 linesAsynchronous:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
  
  
def callback(response, status):  
    if status.is_error():  
        print(f"Error: {status.error_data}")  
    else:  
        for uuid_data in response.data:  
            print(f"UUID: {uuid_data["id"]}")  
            print(f"Name: {uuid_data["name"]}")  
            print(f"Custom: {uuid_data["custom"]}")  
  
`
```
show all 41 lines

##### Returns[​](#returns)

The `get_all_uuid_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetAllUUIDMetadataResult`](#pngetalluuidmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNGetAllUUIDMetadataResult[​](#pngetalluuidmetadataresult)

Property NameTypeDescription`data`[]List of dictionaries containing UUID metadata`status`PNStatusStatus of the operation

Each element in `data` contains a dictionary with UUID metadata.

KeyDescription`id`UUID`name`Name associated with UUID object`externalId`External ID associated with UUID object`profileUrl`Profile URL associated with UUID object`email`Email address associated with UUID object`custom`Custom object associated with UUID object in form of dictionary containing string to string pairs`status`User status value`type`User type value

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including its custom data object.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.get_uuid_metadata() \  
        .uuid(String) \  
        .include_custom(Boolean)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response.`include_status`Type: BooleanDefault:  
`True`Whether to include the `status` field in the fetch response, which is included by default.`include_type`Type: BooleanDefault:  
`True`Whether to include the `type` field in the fetch response, which is included by default.

#### Basic Usage[​](#basic-usage-1)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.get_uuid_metadata() \  
    .include_custom(True) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_uuid_metadata() \  
    .include_custom(True) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`metadata = pubnub.get_uuid_metadata(include_custom=True).sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
metadata = pubnub.get_uuid_metadata(include_custom=True).pn_async(callback)  
`
```

##### Returns[​](#returns-1)

The `get_uuid_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetUUIDMetadataResult`](#pngetuuidmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNGetUUIDMetadataResult[​](#pngetuuidmetadataresult)

operation returns a `PNGetUUIDMetadataResult` which contains the following properties:

Property NameTypeDescription`data`Dictionary containing UUID metadata`status`PNStatusStatus of the operation

Where each element in `data` contains a dictionary with UUID metadata.

KeyDescription`id`UUID`name`Name associated with UUID object`externalId`External ID associated with UUID object`profileUrl`Profile URL associated with UUID object`email`Email address associated with UUID object`status`Status value associated with UUID object`type`Type value associated with UUID object`custom`Custom object associated with UUID object in form of dictionary containing string to string pairs

### Set User Metadata[​](#set-user-metadata)

Set metadata for a UUID in the database, optionally including its custom data object.

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

#### Method(s)[​](#methods-2)

To `Set UUID Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.set_uuid_metadata() \  
    .uuid(String) \  
    .set_name(String) \  
    .set_status(String) \  
    .set_type(String) \  
    .external_id(String) \  
    .profile_url(String) \  
    .email(String) \  
    .custom(Dictionary) \  
    .include_custom(Boolean) \  
    .include_status(Boolean) \  
    .include_type(Boolean) \  
    .if_matches_etag(String)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`set_name`Type: StringDefault:  
N/ADisplay name for the user.`set_status`Type: StringDefault:  
N/AUser status. Max. 50 characters.`set_type`Type: StringDefault:  
N/AUser type. Max. 50 characters.`external_id`Type: StringDefault:  
N/AUser's identifier in an external system.`profile_url`Type: StringDefault:  
N/AThe URL of the user's profile picture.`email`Type: StringDefault:  
N/AThe user's email address.`custom`Type: `Any`Default:  
N/AAny object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response.`include_status`Type: BooleanDefault:  
`False`Whether to include the `status` object in the fetch response.`include_type`Type: BooleanDefault:  
`False`Whether to include the `type` object in the fetch response.`if_matches_etag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.set_uuid_metadata() \  
    .include_custom(True) \  
    .uuid("Some UUID") \  
    .set_name("Some Name") \  
    .set_status("Active") \  
    .set_type("User") \  
    .email("test@example.com") \  
    .profile_url("http://example.com") \  
    .external_id("1234567890") \  
    .custom({"key1": "val1", "key2": "val2"}) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.set_uuid_metadata() \  
    .include_custom(True) \  
    .uuid("Some UUID") \  
    .set_name("Some Name") \  
    .set_status("Active") \  
    .set_type("User") \  
    .email("test@example.com") \  
    .profile_url("http://example.com") \  
    .external_id("1234567890") \  
    .custom({"key1": "val1", "key2": "val2"}) \  
    pn_async(callback)  
`
```

Synchronous:

```
`pubnub.set_uuid_metadata(uuid="Some UUID",  
                         name="Some Name",  
                         status="Active", type="User",  
                         email="test@example.com",  
                         profile_url="http://example.com",  
                         external_id="1234567890",  
                         custom={"key1": "val1", "key2": "val2"}) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.set_uuid_metadata(uuid="Some UUID",  
                         name="Some Name",  
                         status="Active", type="User",  
                         email="test@example.com",  
                         profile_url="http://example.com",  
                         external_id="1234567890",  
                         custom={"key1": "val1", "key2": "val2"}) \  
    .pn_async(callback)  
`
```

##### Returns[​](#returns-2)

The `set_uuid_metadata()` returns a `PNSetUUIDMetadataResult` which contains the following properties:

Property NameTypeDescription`data`Dictionary containing UUID metadata`status`PNStatusStatus of the operation

Where each element in `data` contains a dictionary with UUID metadata.

KeyDescription`id`UUID`name`Name associated with UUID object`externalId`External ID associated with UUID object`profileUrl`Profile URL associated with UUID object`email`Email address associated with UUID object`status`User status`type`User type`custom`Custom object associated with UUID object in form of dictionary containing string to string pairs

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.remove_uuid_metadata() \  
    .uuid(String)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.

#### Basic Usage[​](#basic-usage-3)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.remove_uuid_metadata() \  
        .uuid("Some UUID").sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_uuid_metadata() \  
        .uuid("Some UUID").pn_async(callback)  
`
```

```
`pubnub.remove_uuid_metadata(uuid="Some UUID").sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_uuid_metadata(uuid="Some UUID").pn_async(callback)  
`
```

##### Returns[​](#returns-3)

The `remove_uuid_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNRemoveUUIDMetadataResult`](#pnremoveuuidmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNRemoveUUIDMetadataResult[​](#pnremoveuuidmetadataresult)

Property NameTypeDescription`status`PNStatusStatus of the operation

## Channel[​](#channel)

### Get Metadata for all Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.get_all_channel_metadata() \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(PNSortKey) \  
    .include_total_count(Boolean) \  
    .include_custom(Boolean) \  
    .include_status(Boolean) \  
    .include_type(Boolean)  
`
```

*  requiredParameterDescription`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time.`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination.`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `[PNSortKey]`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}`.`include_total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default.`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response.`include_status`Type: BooleanDefault:  
`True`Whether to include the `status` field in the fetch response. Setting this to `False` will prevent this value from being returned.`include_type`Type: BooleanDefault:  
`True`Whether to include the `type` field in the fetch response. Setting this to `False` will prevent this value from being returned.

#### Basic Usage[​](#basic-usage-4)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.get_all_channel_metadata() \  
    .include_custom(True) \  
    .limit(10) \  
    .include_total_count(True) \  
    .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
    .page(None) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_all_channel_metadata() \  
    .include_custom(True) \  
    .limit(10) \  
    .include_total_count(True) \  
    .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
    .page(None) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`metadata = pubnub.get_all_channel_metadata(limit=10,  
                                           include_custom=True,  
                                           include_total_count=True,  
                                           sort=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_all_channel_metadata(limit=10,  
                                include_custom=True,  
                                include_total_count=True,  
                                sort=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]) \  
    .pn_async(callback)  
`
```

#### Returns[​](#returns-4)

The `get_all_channel_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetAllChannelMetadataResult`](#pngetallchannelmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNGetAllChannelMetadataResult[​](#pngetallchannelmetadataresult)

Property NameTypeDescription`data`[]List of dictionaries containing channel metadata`status`PNStatusStatus of the operation

Where each element in `data` contains a dictionary with channel metadata.

KeyDescription`id`Channel metadata ID`name`Name associated with channel metadata object`description`Description associated with channel metadata object`status`Channel status value`type`Channel type value`custom`Custom object associated with channel metadata object in form of dictionary containing string to string pairs

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified channel, optionally including its custom data object.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.get_channel_metadata() \  
    .channel(String) \  
    .include_custom(Boolean) \  
    .include_status(Boolean) \  
    .include_type(Boolean)  
`
```

*  requiredParameterDescription`channel`Type: `str`Default:  
n/aChannel name`include_custom`Type: `bool`Default:  
`False`Whether to include the `custom` object in the fetch response.`include_status`Type: BooleanDefault:  
`True`Whether to include the `status` field in the fetch response. Setting this to `False` will prevent this value from being returned.`include_type`Type: BooleanDefault:  
`True`Whether to include the `type` field in the fetch response. Setting this to `False` will prevent this value from being returned.

#### Basic Usage[​](#basic-usage-5)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.get_channel_metadata() \  
    .include_custom(True) \  
    .channel("channel") \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_channel_metadata() \  
    .include_custom(True) \  
    .channel("channel") \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.get_channel_metadata(channel="channel", include_custom=True).sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_channel_metadata(channel="channel", include_custom=True).pn_async(callback)  
`
```

##### Returns[​](#returns-5)

The `get_channel_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetChannelMetadataResult`](#pngetchannelmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNGetChannelMetadataResult[​](#pngetchannelmetadataresult)

Property NameTypeDescription`data`Dictionary containing channel metadata`status`PNStatusStatus of the operation

Where each element in `data` contains a dictionary with channel metadata.

KeyDescription`id`Channel metadata ID`name`Name associated with channel metadata object`description`Description associated with channel metadata object`status`Channel status value`type`Channel type value`custom`Custom object associated with channel metadata object in form of dictionary containing string to string pairs

### Set Channel Metadata[​](#set-channel-metadata)

Set metadata for a channel in the database, optionally including its custom data object.

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

#### Method(s)[​](#methods-6)

To `Set Channel Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.set_channel_metadata() \  
    .channel(String) \  
    .set_name(String) \  
    .set_status(String) \  
    .set_type(String) \  
    .description(String) \  
    .custom(Dictionary) \  
    .include_custom(Boolean) \  
    .include_status(Boolean) \  
    .include_type(Boolean) \  
    .if_matches_etag(String)  
`
```

*  requiredParameterDescription`channel`Type: StringDefault:  
n/aChannel ID.`set_name`Type: StringDefault:  
N/AName of the channel.`set_status`Type: StringDefault:  
N/AChannel status. Max. 50 characters.`set_type`Type: StringDefault:  
N/AChannel type. Max. 50 characters.`description`Type: StringDefault:  
N/ADescription of a channel.`custom`Type: `Map<String, Object>`Default:  
N/AAny object of key-value pairs with supported data types. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response.`include_status`Type: BooleanDefault:  
`False`Whether to include the `status` object in the fetch response.`include_type`Type: BooleanDefault:  
`False`Whether to include the `type` object in the fetch response.`if_matches_etag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.set_channel_metadata() \  
    .include_custom(True) \  
    .channel("channel id") \  
    .set_name("Channel Name") \  
    .set_status("Archived") \  
    .set_type("Archived") \  
    .description("Description") \  
    .custom({ "key1": "val1", "key2": "val2" }) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.set_channel_metadata() \  
    .include_custom(True) \  
    .channel("channel id") \  
    .set_name("Channel Name") \  
    .set_status("Archived") \  
    .set_type("Archived") \  
    .description("Description") \  
    .custom({ "key1": "val1", "key2": "val2" }) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.set_channel_metadata(channel="channel id",  
                            name="Channel Name",  
                            status="Archived",  
                            type="Archived",  
                            description="Description",  
                            custom={ "key1": "val1", "key2": "val2" },  
                            include_custom=True) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.set_channel_metadata(channel="channel id",  
                            name="Channel Name",  
                            status="Archived",  
                            type="Archived",  
                            description="Description",  
                            custom={ "key1": "val1", "key2": "val2" },  
                            include_custom=True) \  
    .pn_async(callback)  
`
```

##### Returns[​](#returns-6)

The `set_channel_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNSetChannelMetadataResult`](#pnsetchannelmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNSetChannelMetadataResult[​](#pnsetchannelmetadataresult)

Property NameTypeDescription`data`Dictionary containing channel metadata`status`PNStatusStatus of the operation

Where each element in `data` contains a dictionary with channel metadata.

KeyDescription`id`channel metadata id`name`Name associated with channel metadata object`description`Description associated with channel metadata object`status`Channels status value`type`Channels type value`custom`Custom object associated with channel metadata object in form of dictionary containing string to string pairs

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`  
`
```

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Python SDK:

```
`pubnub.remove_channel_metadata() \  
    .channel(String)  
`
```

*  requiredParameterDescription`channel`Type: StringDefault:  
n/aChannel name

#### Basic Usage[​](#basic-usage-7)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.remove_channel_metadata() \  
    .channel("channel id") \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_channel_metadata() \  
    .channel("channel id") \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.remove_channel_metadata(channel="channel id").sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_channel_metadata(channel="channel id").pn_async(callback)  
`
```

##### Returns[​](#returns-7)

The `remove_channel_metadata()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNRemoveChannelMetadataResult`](#pnremovechannelmetadataresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNRemoveChannelMetadataResult[​](#pnremovechannelmetadataresult)

Property NameTypeDescription`status`PNStatusStatus of the operation

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Channel Memberships` you can use the following method(s) in the Python SDK:

```
`pubnub.get_memberships() \  
    .uuid(String) \  
    .limit(Integer) \  
    .page(PNPage Object) \  
    .filter(String) \  
    .sort(* PNSortKey Object) \  
    .include(MembershipIncludes)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: `MembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel information should be included in the response. → `channel_custom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channel_type`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channel_status`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.

#### Basic Usage[​](#basic-usage-8)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.get_memberships() \  
    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
    .uuid("Some UUID").sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_memberships() \  
    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
    .uuid("Some UUID").pn_async(callback)  
`
```

Synchronous:

```
`pubnub.get_memberships(uuid="Some UUID",  
                       include=MembershipIncludes(custom=True, channel=True, channel_custom=True))  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_memberships(uuid="Some UUID",  
                       include=.MembershipIncludes(custom=True, channel=True, channel_custom=True))  
    .pn_async(callback)  
`
```

##### Returns[​](#returns-8)

The `get_memberships()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetMembershipsResult`](#pngetmembershipsresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNGetMembershipsResult[​](#pngetmembershipsresult)

Property NameTypeDescription`data`List of dictionaries containing memberships metadata`status`PNStatusStatus of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`channel`Dictionary containing channel metadata (id, name, description, custom)`custom`Custom object associated with membership in form of dictionary containing string to string pairs

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Channel Memberships` you can use the following method(s) in the Python SDK:

```
`pubnub.set_memberships() \  
    .channel_memberships([PNChannelMembership]) \  
    .uuid(String) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSort Object) \  
    .include(MembershipIncludes)  
`
```

*  requiredParameterDescription`channelMemberships`Type: `[PNChannelMembership]`Default:  
n/aCollection of [`PNChannelMembership`](#pnchannelmembership-class) to add to membership`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: `MembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel information should be included in the response. → `channel_custom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channel_type`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channel_status`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-9)

- Builder Pattern
- Named Arguments

Synchronous:

```
`some_channel = "somechannel"  
some_channel_with_custom = "somechannel_with_custom"  
  
pubnub.set_channel_metadata() \  
    .channel(some_channel) \  
    .set_name("some name") \  
    .sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2",  
}  
  
pubnub.set_channel_metadata() \  
    .channel(some_channel_with_custom) \  
`
```

show all 34 linesAsynchronous:

```
`def callback(response, status):  
    pass  
  
some_channel = "somechannel"  
some_channel_with_custom = "somechannel_with_custom"  
  
pubnub.set_channel_metadata() \  
    .channel(some_channel) \  
    .set_name("some name") \  
    .sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2"  
}  
`
```

show all 37 linesSynchronous:

```
`some_channel = "somechannel"  
some_channel_with_custom = "somechannel_with_custom"  
  
pubnub.set_channel_metadata(channel=some_channel, name="some name").sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2",  
}  
  
pubnub.set_channel_metadata(channel=some_channel_with_custom,  
                            name="some name with custom",  
                            custom=custom_1) \  
    .sync()  
  
`
```

show all 29 linesAsynchronous:

```
`def callback(response, status):  
    pass  
  
some_channel = "somechannel"  
some_channel_with_custom = "somechannel_with_custom"  
  
pubnub.set_channel_metadata(channel=some_channel, name="some name").pn_async(callback)  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2"  
}  
  
pubnub.set_channel_metadata(channel=some_channel_with_custom,  
                            name="some name with custom",  
`
```
show all 32 lines

##### Returns[​](#returns-9)

The `set_memberships()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNSetMembershipsResult`](#pnsetmembershipsresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNSetMembershipsResult[​](#pnsetmembershipsresult)

Property NameTypeDescription`data`List of dictionaries containing memberships metadata`status`PNStatusStatus of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`channel`Dictionary containing channel metadata (id, name, description, custom)`custom`Custom object associated with membership in form of dictionary containing string to string pairs

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Channel Memberships` you can use the following method(s) in the Python SDK:

```
`pubnub.remove_memberships() \  
    .channel_memberships([PNChannelMembership]) \  
    .uuid(String) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSort) \  
    .include_total_count(Boolean) \  
    .include_custom(Boolean) \  
    .include_channel(Integer)  
`
```

*  requiredParameterDescription`channel_memberships`Type: `[PNChannelMembership]`Default:  
n/aList of channels (as [`PNChannelMembership`](#pnchannelmembership-class)) to remove from membership.`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time.`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination.`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include_total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response.`include_channel`Type: IntegerDefault:  
N/AThe level of channel details to return in the membership. Possible values are defined as constants in `ChannelIncludeEndpoint`: `ChannelIncludeEndpoint.CHANNEL` and `ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM`

#### Basic Usage[​](#basic-usage-10)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.remove_memberships() \  
    .uuid("some_uuid") \  
    .channel_memberships([PNChannelMembership.channel(some_channel)]) \  
    .include_custom(True) \  
    .include_channel(ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_memberships() \  
    .uuid("some_uuid") \  
    .channel_memberships([PNChannelMembership.channel(some_channel)]) \  
    .include_custom(True) \  
    .include_channel(ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.remove_memberships(uuid="some_uuid",  
                          channel_memberships=[PNChannelMembership.channel(some_channel)],  
                          include_channel=ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM  
                          include_custom=True) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_memberships(uuid="some_uuid",  
                          channel_memberships=[PNChannelMembership.channel(some_channel)],  
                          include_channel=ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM  
                          include_custom=True) \  
    .pn_async(callback)  
`
```

##### Returns[​](#returns-10)

The `remove_memberships()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNRemoveMembershipsResult`](#pnremovemembershipsresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNRemoveMembershipsResult[​](#pnremovemembershipsresult)

Property NameTypeDescription`data`List of dictionaries containing memberships metadata`status``PNStatus`Status of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`channel`Dictionary containing channel metadata (id, name, description, custom)`custom`Custom object associated with membership in form of dictionary containing string to string pairs

### Manage Channel Memberships[​](#manage-channel-memberships)

Manage a user's channel memberships.

#### Method(s)[​](#methods-11)

To `Manage Channel Memberships` you can use the following method(s) in the Python SDK:

```
`pubnub.manage_memberships() \  
    .uuid(String) \  
    .set([PNChannelMembership>]) \  
    .remove([PNChannelMembership]) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSortKey) \  
    .include(MembershipIncludes)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`pubnub.configuration.uuid`Unique UUID Metadata identifier.  
If not supplied, then UUID from configuration will be used.`set`Type: `[PNChannelMembership]`Default:  
n/aList of members [`PNChannelMembership`](#pnchannelmembership-class) to add to channel`remove`Type: `[PNChannelMembership]`Default:  
n/aList of members [`PNChannelMembership`](#pnchannelmembership-class) to remove from channel`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
`null`The paging object used for pagination`filter`Type: StringDefault:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: `MembershipIncludes`Default:  
n/aThe additional information to include in the membership response. → `total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `channel`Type: BooleanDefault:  
`False`Indicates whether the channel information should be included in the response. → `channel_custom`Type: BooleanDefault:  
`False`Indicates whether custom data for the channel should be included in the response. → `channel_type`Type: BooleanDefault:  
`False`Indicates whether the type of the channel should be included in the response. → `channel_status`Type: BooleanDefault:  
`False`Indicates whether the status of the channel should be included in the response.

#### Basic Usage[​](#basic-usage-11)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.manage_memberships() \  
    .uuid("some_uuid") \  
    .set([PNChannelMembership.channel(some_channel)]) \  
    .remove([PNChannelMembership.channel(some_channel_with_custom)]) \  
    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.manage_memberships() \  
    .uuid("some_uuid") \  
    .set([PNChannelMembership.channel(some_channel)]) \  
    .remove([PNChannelMembership.channel(some_channel_with_custom)]) \  
    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.manage_memberships(uuid="some_uuid",  
                          set=[PNChannelMembership.channel(some_channel)],  
                          remove=[PNChannelMembership.channel(some_channel_with_custom)],  
                          include=MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.manage_memberships(uuid="some_uuid",  
                          set=[PNChannelMembership.channel(some_channel)],  
                          remove=[PNChannelMembership.channel(some_channel_with_custom)],  
                          include=MembershipIncludes(custom=True, channel=True, channel_custom=True))  
    .pn_async(callback)  
`
```

##### Returns[​](#returns-11)

The `manage_memberships()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNManageMembershipsResult`](#pnmanagemembershipsresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNManageMembershipsResult[​](#pnmanagemembershipsresult)

Property NameTypeDescription`data`List of dictionaries containing memberships metadata`status``PNStatus`Status of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`channel`Dictionary containing channel metadata (id, name, description, custom)`custom`Custom object associated with membership in form of dictionary containing string to string pairs

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the Python SDK:

```
`pubnub.get_channel_members() \  
    .channel(String) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSortKey) \  
    .include(MemberIncludes)  
`
```

*  requiredParameterDescription`channel`Type: StringDefault:  
n/aChannel name`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: `MemberIncludes`Default:  
n/aThe additional information to include in the member response. → `total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `user_custom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `user_type`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `user_status`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.

#### Basic Usage[​](#basic-usage-12)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.get_channel_members() \  
    .channel("channel") \  
    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_channel_members() \  
    .channel("channel") \  
    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.get_channel_members(channel="channel",  
                           include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.get_channel_members(channel="channel",  
                           include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .pn_async(callback)  
`
```

#### Returns[​](#returns-12)

The `get_channel_members()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNManageMembershipsResult`](#pngetchannelmembersresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNGetChannelMembersResult[​](#pngetchannelmembersresult)

Property NameTypeDescription`data`[]List of dictionaries containing channel members metadata`status`PNStatusStatus of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`uuid`Dictionary containing UUID metadata (id, name, email, externalId, profileUrl, custom)`custom`Custom object associated with channel member in form of dictionary containing string to string pairs

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the Python SDK:

```
`pubnub.set_channel_members() \  
    .channel(String) \  
    .uuids([PNUUID object]) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSortKey) \  
    .include(MemberIncludes)  
`
```

*  requiredParameterDescription`channel`Type: StringDefault:  
n/aChannel name`uuids`Type: `[PNUUID]`Default:  
n/aList of members [`PNUUID`](#pnuuid-class) to add to channel`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
`null`The paging object used for pagination`filter`Type: StringDefault:  
`null`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: `MemberIncludes`Default:  
n/aThe additional information to include in the member response. → `total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `user_custom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `user_type`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `user_status`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-13)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.set_uuid_metadata() \  
    .uuid("some_uuid") \  
    .set_name("some name") \  
    .sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2"  
}  
  
pubnub.set_uuid_metadata() \  
    .uuid("some_uuid_with_custom") \  
    .set_name("some name with custom") \  
    .custom(custom_1) \  
    .sync()  
`
```

show all 26 linesAsynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.set_uuid_metadata() \  
    .uuid("some_uuid") \  
    .set_name("some name") \  
    .sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2"  
}  
  
pubnub.set_uuid_metadata() \  
    .uuid("some_uuid_with_custom") \  
`
```

show all 29 linesSynchronous:

```
`pubnub.set_uuid_metadata(uuid=some_uuid, name="some name").sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2"  
}  
  
pubnub.set_uuid_metadata(uuid=some_uuid_with_custom,  
                         name="some name with custom",  
                         custom=custom_1) \  
    .sync()  
  
uuids_to_set = [  
    PNUUID.uuid(some_uuid),  
    PNUUID.uuid_with_custom(some_uuid_with_custom, custom_2)  
`
```

show all 21 linesAsynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.set_uuid_metadata(uuid=some_uuid, name="some name").sync().sync()  
  
custom_1 = {  
    "key3": "val1",  
    "key4": "val2"  
}  
  
pubnub.set_uuid_metadata(uuid=some_uuid_with_custom,  
                         name="some name with custom",  
                         custom=custom_1) \  
    .sync()  
  
`
```
show all 24 lines

#### Returns[​](#returns-13)

The `set_channel_members()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNSetChannelMembersResult`](#pnsetchannelmembersresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNSetChannelMembersResult[​](#pnsetchannelmembersresult)

Property NameTypeDescription`data`[]List of dictionaries containing channel members metadata`status``PNStatus`Status of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`uuid`Dictionary containing UUID metadata (id, name, email, externalId, profileUrl, custom)`custom`Custom object associated with channel member in form of dictionary containing string to string pairs

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the Python SDK:

```
`pubnub.remove_channel_members() \  
    .channel(String) \  
    .uuids([PNUUID]) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSortKey) \  
    .include_total_count(Boolean) \  
    .include_custom(Boolean) \  
    .includeUUID(Integer)  
`
```

*  requiredParameterDescription`channel`Type: StringDefault:  
n/aChannel name`uuids`Type: `[PNUUID]`Default:  
n/aList of members (as [`PNUUID`](#pnuuid-class)) to remove from channel`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include_total_count`Type: BooleanDefault:  
`False`Request `include_total_count` to be included in paginated response, which is omitted by default`include_custom`Type: BooleanDefault:  
`False`Whether to include the `custom` object in the fetch response`include_uuid`Type: IntegerDefault:  
N/AThe level of uuid metadata details to return in the channel member. Possible values are defined as constants in `UUIDIncludeEndpoint`: `UUIDIncludeEndpoint.UUID` and `UUIDIncludeEndpoint.UUID_WITH_CUSTOM`

#### Basic Usage[​](#basic-usage-14)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.remove_channel_members() \  
    .channel("channel id") \  
    .uuids([PNUUID.uuid(some_uuid)]) \  
    .include_custom(True) \  
    .include_uuid(UUIDIncludeEndpoint.UUID_WITH_CUSTOM) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_channel_members() \  
    .channel("channel id") \  
    .uuids([PNUUID.uuid(some_uuid)]) \  
    .include_custom(True) \  
    .include_uuid(UUIDIncludeEndpoint.UUID_WITH_CUSTOM).pn_async(callback)  
`
```

Synchronous:

```
`pubnub.remove_channel_members(channel="channel id",  
                              uuids=[PNUUID.uuid(some_uuid)],  
                              include_custom=True,  
                              include_uuid=UUIDIncludeEndpoint.UUID_WITH_CUSTOM) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.remove_channel_members(channel="channel id",  
                              uuids=[PNUUID.uuid(some_uuid)],  
                              include_custom=True,  
                              include_uuid=UUIDIncludeEndpoint.UUID_WITH_CUSTOM) \  
    .pn_async(callback)  
  
`
```

#### Returns[​](#returns-14)

The `remove_channel_members()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNRemoveChannelMembersResult`](#pnremovechannelmembersresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNRemoveChannelMembersResult[​](#pnremovechannelmembersresult)

Property NameTypeDescription`data`[]List of dictionaries containing channel members metadata`status``PNStatus`Status of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`uuid`Dictionary containing UUID metadata (id, name, email, externalId, profileUrl, custom)`custom`Custom object associated with channel member in form of dictionary containing string to string pairs

### Manage Channel Members[​](#manage-channel-members)

Manage the members of a channel.

#### Method(s)[​](#methods-15)

To `Manage Channel Members` you can use the following method(s) in the Python SDK:

```
`pubnub.manage_channel_members() \  
    .channel(String) \  
    .set([PNUUID]) \  
    .remove([PNUUID]) \  
    .limit(Integer) \  
    .page(PNPage) \  
    .filter(String) \  
    .sort(* PNSortKey) \  
    .include(MemberIncludes)  
`
```

*  requiredParameterDescription`channel`Type: StringDefault:  
n/aChannel name`set`Type: `[PNUUID]`Default:  
n/aList of members [`PNUUID`](#pnuuid-class) to add to channel`remove`Type: `[PNUUID]`Default:  
n/aList of members [`PNUUID`](#pnuuid-class) to remove from channel`limit`Type: IntegerDefault:  
100The maximum number of objects to retrieve at a time`page`Type: `PNPage`Default:  
N/AThe paging object used for pagination`filter`Type: StringDefault:  
N/AExpression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: `PNSortKey`Default:  
N/AList of properties to sort by. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``include`Type: `MemberIncludes`Default:  
n/aThe additional information to include in the member response. → `total_count`Type: BooleanDefault:  
`False`Request `totalCount` to be included in paginated response, which is omitted by default → `custom`Type: BooleanDefault:  
`False`Indicates whether custom data should be included in the response. → `status`Type: BooleanDefault:  
`False`Indicates whether the status should be included in the response. → `type`Type: BooleanDefault:  
`False`Indicates whether the type should be included in the response. → `total_count`Type: BooleanDefault:  
`False`Indicates whether the total count should be included in the response. → `user`Type: BooleanDefault:  
`False`Indicates whether the user ID information should be included in the response. → `user_custom`Type: BooleanDefault:  
`False`Indicates whether custom data for the user should be included in the response. → `user_type`Type: BooleanDefault:  
`False`Indicates whether the type of the user should be included in the response. → `user_status`Type: BooleanDefault:  
`False`Indicates whether the status of the user should be included in the response.

#### Basic Usage[​](#basic-usage-15)

- Builder Pattern
- Named Arguments

Synchronous:

```
`pubnub.manage_channel_members() \  
    .channel("channel id") \  
    .set([PNUUID.uuid(some_uuid)]) \  
    .remove([PNUUID.uuid(some_uuid_with_custom)]) \  
    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.manage_channel_members() \  
    .channel("channel id") \  
    .set([PNUUID.uuid(some_uuid)]) \  
    .remove([PNUUID.uuid(some_uuid_with_custom)]) \  
    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .pn_async(callback)  
`
```

Synchronous:

```
`pubnub.manage_channel_members(channel="channel id",  
                              set=[PNUUID.uuid(some_uuid)],  
                              remove=[PNUUID.uuid(some_uuid_with_custom)],  
                              include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .sync()  
`
```

Asynchronous:

```
`def callback(response, status):  
    pass  
  
pubnub.manage_channel_members(channel="channel id",  
                              set=[PNUUID.uuid(some_uuid)],  
                              remove=[PNUUID.uuid(some_uuid_with_custom)],  
                              include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
    .pn_async(callback)  
`
```

#### Returns[​](#returns-15)

The `manage_channel_members()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNManageChannelMembersResult`](#pnmanagechannelmembersresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

##### PNManageChannelMembersResult[​](#pnmanagechannelmembersresult)

Property NameTypeDescription`data`[]List of dictionaries containing channel members metadata`status``PNStatus`Status of the operation`total_count``int`Total count of results (if `include_total_count` was set)`prev``PNPage.Previous`PNPage instance to be used if further requests`next``PNPage.Next`PNPage instance to be used if further requests

Where each element in `data` contains a dictionary with membership metadata.

KeyDescription`uuid`Dictionary containing UUID metadata (id, name, email, externalId, profileUrl, custom)`custom`Custom object associated with channel member in form of dictionary containing string to string pairs

## PNChannelMembership class[​](#pnchannelmembership-class)

`PNChannelMembership` is a utility class that exposes two factory methods: `channel(channel)` constructs a channel membership, and `channel_with_custom(channelId, custom)` constructs a channel membership with additional custom metadata.

```
`class PNChannelMembership:  
    __metaclass__ = ABCMeta  
  
    def __init__(self, channel):  
        self._channel = channel  
  
    @staticmethod  
    def channel(channel):  
        return JustChannel(channel)  
  
    @staticmethod  
    def channel_with_custom(channel, custom):  
        return ChannelWithCustom(channel, custom)  
  
  
`
```
show all 24 lines

## PNUUID class[​](#pnuuid-class)

`PNUUID` is a utility class that exposes two factory methods: `uuid(uuid)` constructs a UUID, and `uuid_with_custom(channel_id, custom)` constructs a UUID with additional custom metadata.

```
`class PNUUID:**    __metaclass__ = ABCMeta  
  
    def __init__(self, uuid):  
        self._uuid = uuid  
  
    @staticmethod  
    def uuid(uuid):  
        return JustUUID(uuid)  
  
    @staticmethod  
    def uuid_with_custom(uuid, custom):  
        return UUIDWithCustom(uuid, custom)  
  
  
`
```
show all 24 linesLast updated on Apr 29, 2025**