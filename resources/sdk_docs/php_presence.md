On this page
# Presence API for PHP SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `hereNow()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following method(s) in the PHP SDK:

```
`$pubnub->hereNow()  
    ->channels(string|array)  
    ->channelGroups(string|array)  
    ->includeState(boolean)  
    ->includeUuids(boolean)  
    ->sync();  
`
```

*  requiredParameterDescription`channels`Type: String|ArrayDefault:  
n/aThe `channels` to get the `here now` details.`channelGroups`Type: String|ArrayDefault:  
n/aThe `channel groups` to get the `here now` details.`includeState`Type: BooleanDefault:  
`false`If `true`, the response will include the presence states of the users for `channels`/`channelGroups`.`includeUuids`Type: BooleanDefault:  
`true`If `true`, the response will include the `UUIDs` of the connected clients.

### Basic Usage[​](#basic-usage)

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
use PubNub\Exceptions\PubNubException;  
  
// Create configuration with demo keys  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-presence-demo-user");  
`
```
show all 77 lines

### Response[​](#response)

The `hereNow()` operation returns a `PNHereNowResult` which contains the following fields:

MethodDescription`getTotalChannels()`Type: IntegerTotal `Channels`.`getTotalOccupancy()`Type: IntegerTotal `Occupancy`.`getChannels()`Type: ArrayA array with values of `PNHereNowChannelData` for each `channel`. See [PNHereNowChannelData](#pnherenowchanneldata)  for more details.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

MethodDescription`getChannelName()`Type: String`Channel` name.`getOccupancy()`Type: Integer`Occupancy` of the `channel`.`getOccupants()`Type: ArrayA array of `PNHereNowOccupantData`, see [PNHereNowOccupantData](#pnherenowoccupantdata)  for more details.

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

MethodDescription`getUuid()`Type: String`UUID` of the user.`getState()`Type: Array`State` of the user.

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`$result = $pubnub->hereNow()  
                ->channels("my_channel")  
                ->includeUuids(true)  
                ->includeState(true)  
                ->sync();  
`
```

##### Example Response[​](#example-response)

```
`PubNub\Models\Consumer\Presence\PNHereNowResult Object(  
    [totalChannels:protected] => 2  
    [totalOccupancy:protected] => 3  
    [channels:protected] => Array(  
        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
            [channelName:protected] => ch1  
            [occupancy:protected] => 1  
            [occupants:protected] => Array(  
                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
                    [uuid:protected] => user1  
                    [state:protected] =>  
                )  
            )  
        )  
        [1] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
`
```
show all 30 lines

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`$result = $pubnub->hereNow()  
                ->channels("my_channel")  
                ->includeUuids(false)  
                ->includeState(false)  
                ->sync();  
`
```

##### Example Response[​](#example-response-1)

```
`PubNub\Models\Consumer\Presence\PNHereNowResult Object(  
    [totalChannels:protected] => 2  
    [totalOccupancy:protected] => 3  
    [channels:protected] => Array(  
        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
            [channelName:protected] => ch1  
            [occupancy:protected] => 1  
            [occupants:protected] => Array(  
                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
                    [uuid:protected] => user1  
                    [state:protected] =>  
                )  
            )  
        )  
        [1] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
`
```
show all 30 lines

#### Here Now for Channel Groups[​](#here-now-for-channel-groups)

```
`$pubnub->hereNow()  
    ->channelGroups(["cg1", "cg2", "cg3"])  
    ->includeUuids(true)  
    ->includeState(true)  
    ->sync();  
`
```

##### Example Response[​](#example-response-2)

```
`(  
    [totalChannels:protected] => 1  
    [totalOccupancy:protected] => 4  
    [channels:protected] => Array(  
        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
            [channelName:protected] => ch1  
            [occupancy:protected] => 1  
            [occupants:protected] => Array(  
                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
                    [uuid:protected] => 123123234t234f34fq3dq  
                    [state:protected] =>  
                )  
                [1] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
                    [uuid:protected] => 143r34f34t34fq34q34q3  
                    [state:protected] =>  
`
```
show all 28 lines

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `whereNow()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `whereNow()` you can use the following method(s) in the PHP SDK:

```
`$pubnub->whereNow()  
    ->uuid(string)  
    ->sync();  
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
n/a`Uuid` of the user we want to spy on.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`$result = $pubnub->whereNow()  
              ->sync();  
`
```

### Rest Response from Server[​](#rest-response-from-server)

The `whereNow()` function returns a list of channels a `uuid` is subscribed to.

- `channels:["String","String", ... ,"String"]` - List of channels a `uuid` is subscribed to.

#### Example Response[​](#example-response-3)

```
`{  
    "channels": [  
        "lobby",  
        "game01",  
        "chat"  
    ]  
}  
`
```

### Other Examples[​](#other-examples-1)

```
`$result = $pubnub->whereNow()  
                ->uuid("his-uuid")  
                ->sync();  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-2)

**Set State:** [](#set-state-arguments)

```
`$pubnub->setState()  
    ->channels(string|array)  
    ->channelGroups(string|array)  
    ->state(array)  
    ->sync();  
`
```

*  requiredParameterDescription`channels`Type: String|Array`channels` to set `state`.`channelGroups`Type: String|Array`channel groups` to set `state`.`state`Type: Array`State` to set.

#### Get State:** [](#get-state-arguments)[​](#get-state-)

```
`$pubnub->getState()  
    ->channels(string|array)  
    ->channelGroups(string|array)  
    ->uuid(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channels`Type: String|Array`channels` to get `state`.`channelGroups`Type: String|Array`channel groups` to get `state`.`uuid`Type: String`uuid`

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state)

```
`$pubnub->setState()  
    ->channels(["ch1", "ch2", "ch3"])  
    ->state(["age" => 30])  
    ->sync();  
`
```

#### Get State[​](#get-state)

```
`$pubnub->getState()  
    ->channels(["ch1", "ch2", "ch3"])  
    ->sync();  
`
```

### Response[​](#response-1)

The `setState()` operation returns a `PNSetStateResult` which contains the following fields:

MethodDescription`setState()`Type: ArrayArray of `UUIDs` and the user states.

The `getState()` operation returns a `PNGetStateResult` which contains the following fields:

MethodDescription`getChannels()`Type: ArrayArray of `channels` and the user states.

### Other Examples[​](#other-examples-2)

#### Set state for channels in a channel group[​](#set-state-for-channels-in-a-channel-group)

```
`$pubnub->setState()**    ->channelGroups(["gr1", "gr2", "gr3"])  
    ->state(["age" => 30])  
    ->sync();  
`
```
Last updated on Jun 16, 2025**