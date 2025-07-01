On this page
# Channel Groups API for Python SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

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

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Python SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pubnub.add_channel_to_channel_group() \  
    .channels(String|List|Tuple) \  
    .channel_group(String)  
`
```

*  requiredParameterDescription`channels` *Type: String | List | TupleThe `channel` to add to the `channel_group`.`channel_group` *Type: StringThe `channel_group` to add the `channels` to.

### Basic Usage[​](#basic-usage)

#### Add Channels[​](#add-channels-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
  
def add_channels_to_group(pubnub: PubNub):  
    try:  
        pubnub.add_channel_to_channel_group() \  
            .channels(["ch1", "ch2"]) \  
            .channel_group("cg1") \  
            .sync()  
        print("Channels added to channel group successfully.")  
    except PubNubException as e:  
        print(f"Error: {e}")  
`
```
show all 33 lines
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
  
def add_channels_to_group(pubnub: PubNub):  
    try:  
        pubnub.add_channel_to_channel_group(  
            channels=["ch1", "ch2"],  
            channel_group="cg1"  
        ).sync()  
        print("Channels added to channel group successfully.")  
    except PubNubException as e:  
        print(f"Error: {e}")  
`
```
show all 34 lines

### Returns[​](#returns)

The `add_channel_to_channel_group()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNChannelGroupsAddChannelResult`](#pnchannelgroupsaddchannelresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNChannelGroupsAddChannelResult[​](#pnchannelgroupsaddchannelresult)

```
`Channel successfully added  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Python SDK:

```
`pubnub.list_channels_in_channel_group() \  
    .channel_group(String)  
`
```

*  requiredParameterDescription`channel_group` *Type: StringThe `channel group` to fetch channels.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

- Builder Pattern
- Named Arguments

```
`result = pubnub.list_channels_in_channel_group() \  
    .channel_group("cg1") \  
    .sync()  
`
```

```
`result = pubnub.list_channels_in_channel_group(channel_group="cg1").sync()  
`
```

### Returns[​](#returns-1)

The `list_channels_in_channel_group()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNChannelGroupsListResult`](#pnchannelgroupslistresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNChannelGroupsListResult[​](#pnchannelgroupslistresult)

FieldTypeDescription`channels`DictionaryA list of channels in a channel group.

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Python SDK:

```
`pubnub.remove_channel_from_channel_group() \  
    .channels(String|List|Tuple) \  
    .channel_group(String)  
`
```

*  requiredParameterDescription`channels` *Type: String | List | TupleThe `channels` to remove from the channel group.`channel_group` *Type: StringSpecifies `channel_group` to remove the `channels` from.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

- Builder Pattern
- Named Arguments

```
`pubnub.remove_channel_from_channel_group() \  
    .channels(["son", "daughter"]) \  
    .channel_group("channel_group") \  
    .sync()  
`
```

```
`pubnub.remove_channel_from_channel_group(channels=["ch1", "ch2"], channel_group="cg1").sync()  
`
```

### Returns[​](#returns-2)

The `remove_channel_from_channel_group()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNChannelGroupsRemoveChannelResult`](#pnchannelgroupsremovechannelresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNChannelGroupsRemoveChannelResult[​](#pnchannelgroupsremovechannelresult)

```
`Channel successfully removed  
`
```

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Python SDK:

```
`pubnub.remove_channel_group(channel_group)  
`
```

*  requiredParameterDescription`channel_group` *Type: StringThe `channel group` to remove.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

- Builder Pattern
- Named Arguments

```
`pubnub.remove_channel_group() \  
    .channel_group("cg1") \  
    .sync()  
`
```

```
`pubnub.remove_channel_group(channel_group="cg1").sync()  
`
```

### Returns[​](#returns-3)

The `remove_channel_group()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNChannelGroupsRemoveGroupResult`](#pnchannelgroupsremovegroupresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNChannelGroupsRemoveGroupResult[​](#pnchannelgroupsremovegroupresult)

```
`Group successfully removed**`
```
Last updated on Apr 29, 2025**