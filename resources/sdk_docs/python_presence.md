On this page
# Presence API for Python SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

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

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `here_now()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following method(s) in the Python SDK:

```
`pubnub.here_now() \  
    .channels(String|List|Tuple) \  
    .channel_groups(String|List|Tuple) \  
    .include_state(Boolean) \  
    .include_uuids(Boolean)  
`
```

*  requiredParameterDescription`channels`Type: String | List | TupleDefault:  
n/aThe `channels` to get the here now details.`channel_groups`Type: String | List | TupleDefault:  
n/aThe `channel groups` to get the here now details.`include_state`Type: BooleanDefault:  
`False`If `True`, the response will include the presence states of the users for channels/channelGroups.`include_uuids`Type: BooleanDefault:  
`True`If `True`, the response will include the UUIDs of the connected clients.

### Basic Usage[​](#basic-usage)

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
  
def main():  
    # Configuration for PubNub instance  
    pn_config = PNConfiguration()  
    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
  
    # Initialize PubNub client  
    pubnub = PubNub(pn_config)  
  
    # Get here_now details  
`
```
show all 37 lines
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
  
def main():  
    # Configuration for PubNub instance  
    pn_config = PNConfiguration()  
    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
  
    # Initialize PubNub client  
    pubnub = PubNub(pn_config)  
  
    # Get here_now details  
`
```
show all 37 lines

### Returns[​](#returns)

The `here_now()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNHereNowResult`](#pnherenowresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNHereNowResult[​](#pnherenowresult)

FieldTypeDescription`total_channels`IntTotal `channels`.`total_occupancy`IntTotal `occupancy``channels`DictionaryA dictionary with values of [`PNHereNowChannelData`](#pnherenowchanneldata) for each channel.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

FieldTypeDescription`channel_name`String`channel` name.`occupancy`Int`occupancy` of the `channel`.`occupants`ListA list of [`PNHereNowOccupantData`](#pnherenowoccupantdata).

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

FieldTypeDescription`uuid`String`uuid` of the user.`state`Dictionary`state` of the user.

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`envelope = pubnub.here_now() \  
    .channels("my_channel") \  
    .include_uuids(True) \  
    .include_state(True) \  
    .sync()  
`
```

##### Example Response[​](#example-response)

```
`{  
    total_channels: 1,  
    channels: [{  
        channel_name: "my_channel",  
        occupancy: 1,  
        occupants: [{  
            uuid: "myUuid1"  
            state: {  
                "abcd": {  
                    "age": 15  
                }  
            }  
        }]  
    }],  
    total_occupancy: 1  
`
```
show all 16 lines

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to `False`:

```
`envelope = pubnub.here_now() \  
    .channels("my_channel") \  
    .include_uuids(False) \  
    .include_state(False) \  
    .sync()  
`
```

##### Example Response[​](#example-response-1)

```
`{  
    total_channels: 1,  
    channels: [{  
        channel_name: "my_channel",  
        occupancy: 3,  
        occupants: []  
    }],  
    total_occupancy: 3  
}  
`
```

#### Here Now for Channel Groups[​](#here-now-for-channel-groups)

```
`envelope = pubnub.here_now() \  
    .channel_groups(['cg1', 'cg2', 'cg3']) \  
    .include_uuids(True) \  
    .include_state(True) \  
    .sync()  
`
```

##### Example Response[​](#example-response-2)

```
`{  
    total_channels: 1,  
    channels: [  
        {  
            channel_name: "my_channel",  
            occupancy: 1,  
            occupants: [{  
                uuid: "143r34f34t34fq34q34q3",  
                state: None  
            }]  
        },  
        {  
            occupancy: 1,  
            occupants: [{  
                uuid: "123123234t234f34fq3dq",  
`
```
show all 35 lines

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `where_now()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `where_now()` you can use the following method(s) in the Python SDK:

```
`pubnub.where_now() \  
    .uuid(String)  
`
```

*  requiredParameterDescription`uuid`Type: String`uuid` to get info on.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`envelope = pubnub.where_now().sync()  
`
```

### Returns[​](#returns-1)

The `where_now()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNWhereNowResult`](#pnwherenowresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNWhereNowResult[​](#pnwherenowresult)

FieldTypeDescription`channels`ListThe list of `channels` where the `UUID` is present.

### Other Examples[​](#other-examples-1)

#### Obtain information about the current list of channels of some other UUID[​](#obtain-information-about-the-current-list-of-channels-of-some-other-uuid)

- Builder Pattern
- Named Arguments

```
`envelope = pubnub.where_now() \  
    .uuid('some-other-uuid') \  
    .sync()  
`
```

```
`envelope = pubnub.where_now(uuid='some-other-uuid').sync()  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

##### Presence state format

Presence state must be expressed as a `dict`. When calling `set_state`, be sure to supply an initialized `dict` which can be serialized.

### Method(s)[​](#methods-2)

#### Set State[​](#set-state)

```
`pubnub.set_state() \  
    .channels(String|List|Tuple) \  
    .channel_groups(String|List|Tuple) \  
    .state(Dictionary)  
`
```

*  requiredParameterDescription`channels`Type: String | List | Tuple`channels` to set `state`.`channel_groups`Type: String | List | Tuple`channel groups` to set `state`.`state`Type: Dictionary`state` to set.

#### Get State[​](#get-state)

```
`pubnub.get_state() \  
    .channels(String|List|Tuple) \  
    .channel_groups(String|List|Tuple) \  
    .uuid(String)  
`
```

*  requiredParameterDescription`channels`Type: String | List | Tuple`channels` to get `state`.`channel_groups`Type: String | List | Tuple`channel groups` to get `state`.`uuid`Type: String`uuid` to get state from.

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state-1)

- Builder Pattern
- Named Arguments

```
`my_state = {  
    'age': 20  
}  
envelope = pubnub.set_state() \  
    .channels(['ch1', 'ch2', 'ch3']) \  
    .state(my_state) \  
    .sync()  
`
```

```
`envelope = pubnub.set_state(channels=['ch1', 'ch2', 'ch3'], state={'age': 20}).sync()  
`
```

#### Get State[​](#get-state-1)

- Builder Pattern
- Named Arguments

```
`envelope = pubnub.get_state() \  
    .channels(['ch1', 'ch2', 'ch3']) \  
    .uuid('such_uuid') \  
    .sync()  
`
```

```
`envelope = pubnub.get_state(channels=['ch1', 'ch2', 'ch3'], uuid='such_uuid').sync()  
`
```

### Returns[​](#returns-2)

The `set_state()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNSetStateResult`](#pnsetstateresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNSetStateResult[​](#pnsetstateresult)

FieldTypeDescription`state`DictionaryDictionary of UUIDs and the user states.

The `get_state()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetStateResult`](#pngetstateresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNGetStateResult[​](#pngetstateresult)

FieldTypeDescription`channels`DictionaryDictionary of `channels` and the user states.

### Other Examples[​](#other-examples-2)

#### Set state for channels in channel group[​](#set-state-for-channels-in-channel-group)

- Builder Pattern
- Named Arguments

```
`my_state = {  
    'age': 20  
}  
envelope = pubnub.set_state() \  
    .channel_groups(['gr1', 'gr2', 'gr3']) \  
    .state(my_state) \  
    .sync()  
`
```

```
`envelope = pubnub.set_state(channel_groups=['gr1', 'gr2', 'gr3'], state={'age': 20}).sync()  
`
```

The above code would return the following response to the client:

```
`{**    first  : "Robert",  
    last   : "Plant",  
    age    : 59,  
    region : "UK"  
}  
`
```
Last updated on Jun 16, 2025**