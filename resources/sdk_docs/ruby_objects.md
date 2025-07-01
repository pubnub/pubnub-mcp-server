On this page
# App Context API for Ruby SDK

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Ruby SDK:

```
`get_all_uuid_metadata(  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response. Available options: 
- `count` - include how many UUID has been associated with metadata.
- `custom` - include field with additional information from metadata which has been used during `UUID` metadata set requests.
- `type` - include the type of the metadata.
- `status` - include the status of the metadata.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def get_all_uuid_metadata(pubnub)  
  pubnub.get_all_uuid_metadata(  
    limit: 5,  
    include: { custom: true }  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "Error fetching UUID metadata: #{envelope.status[:error]}"  
    else  
      envelope.result[:data][:metadata].each do |uuid_data|  
        puts "UUID: #{uuid_data[:id]}"  
        puts "Name: #{uuid_data[:name]}"  
        puts "Custom: #{uuid_data[:custom]}"  
        puts "Updated: #{uuid_data[:updated]}"  
`
```
show all 35 lines

#### Response[​](#response)

```
`#  
    @result = {  
        :data => {  
            :metadata => [  
                {  
                    :id => "mg",  
                    :name => "magnum",  
                    :externalId => nil,  
                    :profileUrl => nil,  
                    :email => nil,  
                    :custom => { "XXX" => "YYYY" },  
                    :updated => Date>,  
                    :eTag => "Ad2eyIWXwJzBqAE"  
                }  
            ],  
`
```
show all 24 lines

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the Ruby SDK:

```
`get_uuid_metadata(  
    uuid: uuid,  
    include: include,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
Client UUIDIdentifier for which associated `metadata` should be fetched. Default: configured PubNub client `uuid`.`include`Type: ObjectDefault:  
`{ custom: true }`Additional information which should be included in response. Available options: 
- `custom` - include field with additional information from metadata which has been used during `UUID` metadata set requests.
- `type` - include the type of the metadata.
- `status` - include the status of the metadata.

`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-1)

```
`pubnub.get_uuid_metadata(include: { custom: true }) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-1)

```
`#  
    @result = {  
        :data => {  
            :id => "mg",  
            :name => "magnum",  
            :externalId => nil,  
            :profileUrl => nil,  
            :email => nil,  
            :custom => { "XXX" => "YYYY" },  
            :updated => Date>,  
            :eTag => "Ad2eyIWXwJzBqAE"  
        }  
    },  
    @status = {  
        :code => 200  
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

To `Set UUID Metadata` you can use the following method(s) in the Ruby SDK:

```
`set_uuid_metadata(  
    uuid: uuid,  
    metadata: metadata,  
    include: include,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
Client UUIDIdentifier with which new `metadata` should be associated. Default: configured PubNub client `uuid`.`metadata` *Type: ObjectDefault:  
n/aMetadata information which should be associated with `UUID`. **Available options:**  
- `name` - Name which should be stored in `metadata` associated with specified `UUID`.
- `externalId` - External identifier (database, auth service) associated with specified `UUID`.
- `profileUrl` - External URL with information for specified `UUID` representation.
- `custom` - Additional information which should be stored in `metadata` associated with specified `UUID`. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.
- `email` - Email address which should be stored in `metadata` associated with specified `UUID`.
- `type` - Type of the metadata associated with specified `UUID`.
- `status` - Status of the metadata associated with specified `UUID`.

`include`Type: ObjectDefault:  
`{ custom: true }`Additional information which should be included in response.  **Available options:**  
- `custom` - include field with additional information from metadata which has been used during `UUID` metadata set requests.

`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-2)

```
`pubnub.set_uuid_metadata(  
    uuid: 'mg',  
    metadata: { name: 'magnum', custom: { XXX: 'YYYY' } },  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-2)

```
`#  
    @result = {  
        :data => {  
            :id => "mg",  
            :name => "magnum",  
            :externalId => nil,  
            :profileUrl => nil,  
            :email => nil,  
            :custom => { "XXX" => "YYYY" },  
            :updated => Date>,  
            :eTag => "Ad2eyIWXwJzBqAE"  
        }  
    },  
    @status = {  
        :code => 200  
`
```
show all 17 lines

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the Ruby SDK:

```
`remove_uuid_metadata(  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
Client UUIDIdentifier for which associated `metadata` should be removed. Default: configured PubNub client `uuid`.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-3)

```
`pubnub.remove_uuid_metadata(uuid: 'mg') do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-3)

```
`#  
    @status = {  
        :code => 200,  
        :operation => :remove_uuid_metadata,  
        :category => :ack,  
        :error => false,  
        # [...]  
    },  
    # [...]  
>  
`
```

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Ruby SDK:

```
`get_all_channels_metadata(  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  **Available options:**  
- `count` - include how many channels has been associated with metadata.
- `custom` - include field with additional information from metadata which has been used during channel metadata set requests.
- `type` - include the type of the metadata.
- `status` - include the status of the metadata.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-4)

```
`pubnub.get_all_channels_metadata(  
    limit: 5,  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-4)

```
`#  
    @result = {  
        :data => {  
            :metadata => [  
                {  
                    :id => "rb_channel1",  
                    :name => "some_name",  
                    :description => nil,  
                    :custom => { "XXX" => "YYYY" },  
                    :updated => Date>,  
                    :eTag => "AZTUtcvx6NDGLQ"  
                },  
                # {...}  
            ],  
            :totalCount => 2,  
`
```
show all 23 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Ruby SDK:

```
`get_channel_metadata(  
    channel: channel,  
    include: include,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel for which associated `metadata` should be fetched.`include`Type: ObjectDefault:  
`{ custom: true }`Additional information which should be included in response. **Available options:** 
- `custom` - include field with additional information from metadata which has been used during channel metadata set requests.
- `type` - include the type of the metadata.
- `status` - include the status of the metadata.

`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-5)

```
`pubnub.get_channel_metadata(  
    channel: 'channel',  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-5)

```
`#  
    @result = {  
        :data => {  
            :id => "channel",  
            :name => "some_name",  
            :description => nil,  
            :custom => { "XXX" => "YYYY" },  
            :updated => Date>,  
            :eTag => "AZTUtcvx6NDGLQ"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
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

To `Set Channel Metadata` you can use the following method(s) in the Ruby SDK:

```
`set_channel_metadata(  
    channel: channel,  
    metadata: metadata,  
    include: include,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel with which new `metadata` should be associated.`metadata` *Type: ObjectDefault:  
n/aMetadata information which should be associated with `channel`. **Available options:**  
- `name` - Name which should stored in `metadata` associated with specified `channel`.
- `information` - Description which should be stored in `metadata` associated with specified `channel`.
- `custom` - Additional information which should be stored in `metadata` associated with specified `channel`. [App Context filtering language](/docs/general/metadata/filtering) doesn’t support filtering by custom properties.
- `type` - Type of the metadata associated with specified `channel`.
- `status` - Status of the metadata associated with specified `channel`.

`include`Type: ObjectDefault:  
`{ custom: true }`Additional information which should be included in response. **Available options:**  
- `custom` - include field with additional information from metadata which has been used during `UUID` metadata set requests.

`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-6)

```
`pubnub.set_channel_metadata(  
    channel: 'channel',  
    metadata: { name: 'some_name', custom: { XXX: 'YYYY' } }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-6)

```
`#  
    @result = {  
        :data => {  
            :id => "channel",  
            :name => "some_name",  
            :description => nil,  
            :custom => { "XXX" => "YYYY" },  
            :updated => Date>,  
            :eTag => "AZTUtcvx6NDGLQ"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`require 'pubnub'  
require 'json'  
  
pubnub = Pubnub.new(  
  publish_key: 'demo',  
  subscribe_key: 'demo',  
  uuid: 'example'  
)  
  
channel = 'demo_example'  
help_string = HELP  
  To exit type '/exit'  
  To show the current object type '/show'  
  To show this help type '/help'  
HELP  
`
```
show all 89 lines

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Ruby SDK:

```
`remove_channel_metadata(  
    channel: channel,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel with which the `metadata` should be removed.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-7)

```
`pubnub.remove_channel_metadata(channel: 'channel') do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-7)

```
`#  
    @status = {  
        :code => 200,  
        :operation => :remove_channel_metadata,  
        :category => :ack,  
        :error => false,  
        # [...]  
    },  
    # [...]  
>  
`
```

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the Ruby SDK:

```
`get_memberships(  
    uuid: uuid,  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
Client UUIDIdentifier for which memberships in `channels` should be fetched. Default: configured PubNub client `uuid`.`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  Available options:  
- `count` - include how many memberships UUID has.
- `custom` - include field with additional information from metadata which has been associated with UUID during membership add requests.
- `channel_metadata` - include channel's metadata into response (not only name).
- `channel_custom` - include channel's additional information which has been used during channel metadata set requests.
- `status` - include the status of the membership.
- `type` - include the type of the membership.
- `channel_type` - include the type of the channel.
- `channel_status` - include the status of the channel.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-8)

```
`pubnub.get_memberships(  
    uuid: 'mg',  
    include: { count: true, custom: true, channel_metadata: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-8)

```
`#  
    @result = {  
        :data => {  
            :memberships => [  
                {  
                    :channel => {  
                        :id => "channel-identifier1",  
                        :name => "Channel1",  
                        :description => nil,  
                        # {...}  
                    },  
                    :custom => { "membership-custom" => "custom-data-1" },  
                    :updated => Date>,  
                    :eTag => "AYbepevg39XeDA"  
                },  
`
```
show all 26 lines

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Memberships` you can use the following method(s) in the Ruby SDK:

```
`set_memberships(  
    uuid: uuid,  
    channels: channels,  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
Client UUIDIdentifier for which memberships in `channels` should be set. Default: configured PubNub client `uuid`.`channels` *Type: ArrayDefault:  
n/aList of `channels` for which `metadata` associated with each of them in context of `UUID` should be set. Each entry is a dictionary with `channel` and optional fields: 
- `custom` - A dictionary with simple objects: `String` and `Integer`.
- `type` - Type of the metadata associated with specified `membership`.
- `status` - Status of the metadata associated with specified `membership`.

`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  Available options:  
- `count` - include how many memberships UUID has.
- `custom` - include field with additional information from metadata which has been associated with UUID during membership add requests.
- `channel_metadata` - include channel's metadata into response (not only name).
- `channel_custom` - include channel's additional information which has been used during channel metadata set requests.
- `status` - include the status of the membership.
- `type` - include the type of the membership.
- `channel_type` - include the type of the channel.
- `channel_status` - include the status of the channel.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-9)

```
`pubnub.set_memberships(  
    uuid: 'mg',  
    channels: [  
        { channel: 'channel-1' }  
    ],  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-9)

```
`#  
    @result = {  
        :data => {  
            :memberships => [  
                {  
                    :channel => {  
                        :id => "channel-1",  
                        # {...}  
                    },  
                    :custom => nil,  
                    :updated => Date>,  
                    :eTag => "AY39mJKK//C0VA"  
                }  
            ],  
            :totalCount => 1,  
`
```
show all 23 lines

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Memberships` you can use the following method(s) in the Ruby SDK:

```
`remove_memberships(  
    uuid: uuid,  
    channels: channels,  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
Client UUIDIdentifier for which memberships in `channels` should be removed. Default: configured PubNub client `uuid`.`channels` *Type: ArrayDefault:  
n/aList of `channels` from which `UUID` should be removed as `member`.`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  **Available options:**  
- `count` - include how many memberships UUID has.
- `custom` - include field with additional information from metadata which has been associated with UUID during membership add requests.
- `channel_metadata` - include channel's metadata into response (not only name).
- `channel_custom` - include channel's additional information which has been used during channel metadata set requests..

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-10)

```
`pubnub.remove_memberships(  
    uuid: 'mg',  
    channels: [ 'channel-1' ],  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-10)

```
`#  
    @result = {  
        :data => {  
            :memberships => [  
                {  
                    :channel => {  
                        :id => "channel-2",  
                        # {...}  
                    },  
                    :custom => nil,  
                    :updated => Date>,  
                    :eTag => "AY39mJKK//C0VA"  
                }  
            ],  
            :totalCount => 1,  
`
```
show all 23 lines

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-11)

To `Get Channel Members` you can use the following method(s) in the Ruby SDK:

```
`get_channel_members(  
    channel: channel,  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel from which members should be fetched.`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  Available options:  
- `count` - include how many members channel has.
- `custom` - include field with additional information from `metadata` which has been associated with `UUID` during `channel member add` requests.
- `uuid_metadata` - include `UUID's metadata` into response (not only identifier).
- `uuid_custom` - include `UUID's` additional information which has been used during `UUID metadata set` requests.
- `status` - include the status of the member.
- `type` - include the type of the member.
- `uuid_status` - include the status of the UUID.
- `uuid_type` - include the type of the UUID.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-11)

```
`pubnub.get_channel_members(  
    channel: 'channel-1',  
    include: { count: true, custom: true, uuid_metadata: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-11)

```
`#  
    @result = {  
        :data => {  
            :members => [  
                {  
                    :uuid => {  
                        :id => "uuid-identifier1",  
                        :name => "uuid1",  
                        :externalId => nil,  
                        :profileUrl => nil,  
                        :email => nil,  
                        :updated => Date>,  
                        :eTag => "AYfwuq+u+4C01gE",  
                        # {...}  
                    },  
`
```
show all 30 lines

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-12)

To `Set Channel Members` you can use the following method(s) in the Ruby SDK:

```
`set_channel_members(  
    channel: channel,  
    uuids: uuids,  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel for which members should be set.`uuids` *Type: ArrayDefault:  
n/aList of `UUIDs` for which `metadata` associated with each of them in context of `channel` should be set. Each entry is a dictionary with `UUID` and optional fields: 
- `custom` - A dictionary with simple objects: `String` and `Integer`.
- `type` - Type of the metadata associated with specified `UUID`.
- `status` - Status of the metadata associated with specified `UUID`.

`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  Available options:  
- `count` - include how many members channel has.
- `custom` - include field with additional information from `metadata` which has been associated with `UUID` during `channel member add` requests.
- `uuid_metadata` - include `UUID's metadata` into response (not only identifier).
- `uuid_custom` - include `UUID's` additional information which has been used during `UUID metadata set` requests.
- `status` - include the status of the member.
- `type` - include the type of the member.
- `uuid_status` - include the status of the UUID.
- `uuid_type` - include the type of the UUID.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-12)

```
`pubnub.set_channel_members(  
    channel: 'channel',  
    uuids: [  
        { uuid: 'uuid1' }  
    ],  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-12)

```
`#  
    @result = {  
        :data => {  
            :members=>[  
                {  
                    :uuid => {  
                        :id => "mg2",  
                        # {...}  
                    },  
                    :custom => nil,  
                    :updated=>Date>,  
                    :eTag => "AY39mJKK//C0VA"  
                }  
            ],  
            :totalCount => 1,  
`
```
show all 23 lines

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-13)

To `Remove Channel Members` you can use the following method(s) in the Ruby SDK:

```
`remove_channel_members(  
    channel: channel,  
    uuids: uuids,  
    sort: sort,  
    include: include,  
    filter: filter,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel from which members should be removed.`uuids` *Type: ArrayDefault:  
n/aList of `UUIDs` which should be removed from `channel's` list.`sort`Type: ArrayDefault:  
n/aList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction.`include`Type: ObjectDefault:  
`{ count: true }`Additional information which should be included in response.  **Available options:**  
- `count` - include how many members channel has.
- `custom` - include field with additional information from `metadata` which has been associated with `UUID` during `channel member add` requests.
- `uuid_metadata` - include `UUID's metadata` into response (not only identifier).
- `uuid_custom` - include `UUID's` additional information which has been used during `UUID metadata set` requests.

`filter`Type: StringDefault:  
n/aExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [here](/docs/general/metadata/filtering)`start`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: IntegerDefault:  
100Number of objects to return in response. Default is `100`, which is also the maximum value.`http_sync`Type: BooleanDefault:  
falseMethod will be executed `asynchronously` and will return future, to get its `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`). For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameterDefault:  
n/a`Callback` that will be called for each envelope. For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

#### Basic Usage[​](#basic-usage-13)

```
`pubnub.remove_channel_members(  
    channel: 'channel',  
    uuids: [ 'mg1' ],  
    include: { custom: true }  
) do |envelope|  
    puts envelope  
end  
`
```

#### Response[​](#response-13)

```
`#**    @result = {  
        :data => {  
            :members=>[  
                {  
                    :uuid => {  
                        :id => "uuid-identifier",  
                        # {...}  
                    },  
                    :custom => nil,  
                    :updated => Date>,  
                    :eTag => "AY39mJKK//C0VA"  
                }  
            ],  
            :totalCount => 1,  
`
```
show all 23 linesLast updated on Mar 31, 2025**