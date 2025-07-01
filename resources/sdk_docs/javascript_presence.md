On this page
# Presence API for JavaScript SDK

Presence enables you to track the online and offline status of users and devices in real-time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

To learn more about Presence as a feature, visit [Presence Overview](/docs/general/presence/overview).

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `hereNow()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.hereNow({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    includeUUIDs: boolean ,  
    includeState: boolean   
}); PromiseHereNowResponse>  
`
```

*  requiredParameterDescription`channels`Type: array`<string>`Default:  
n/aSpecifies the `channel` name to return occupancy results.   
   
 You must specify either `channels` or `channelGroups`.`channelGroups`Type: array`<string>`Default:  
n/aThe `channel group` for which here now information should be received.    
   
 You must specify either `channels` or `channelGroups`.`includeUUIDs`Type: booleanDefault:  
`true`Setting `uuid` to `false` disables the return of uuids.`includeState`Type: booleanDefault:  
`false`Setting state to `true` enables the return of subscriber state information.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
`  
`
```

```
`  
`
```

### Response[​](#response)

```
`type hereNowResponse = {  
    totalChannels: number, // totalChannels = get total of channels  
    totalOccupancy: number, // totalOccupancy = get total of occupancies  
    channels: object // channels = get a map with values for each channel with uuids and states for each occupant of the channel  
}  
`
```

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`  
`
```

##### Example Response[​](#example-response)

```
`// Example of Status  
{  
    "error": false,  
    "operation": "PNHereNowOperation",  
    "statusCode": 200  
}  
  
// Example of Response  
{  
    "totalChannels": 1,  
    "totalOccupancy": 3,  
    "channels": {  
        "my_channel": {  
            "occupants": [  
                {  
`
```
show all 35 lines

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`  
`
```

##### Example Response[​](#example-response-1)

```
`// Example of Status  
{  
    "error": false,  
    "operation": "PNHereNowOperation",  
    "statusCode": 200  
}  
  
// Example of Response  
{  
    "totalChannels": 1,  
    "totalOccupancy": 3,  
    "channels": {  
        "my_channel": {  
            "occupants": [],  
            "name": "my_channel",  
`
```
show all 19 lines

#### Channel Group Usage[​](#channel-group-usage)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`  
`
```

##### Example Response[​](#example-response-2)

```
`// Example of Status  
{  
    "error": false,  
    "operation": "PNHereNowOperation",  
    "statusCode": 200  
}  
  
// Example of Response  
{  
    "totalChannels": 2,  
    "totalOccupancy": 3,  
    "channels": {  
        "my_channel_1": {  
            "occupants": [  
                {  
`
```
show all 38 lines

#### Basic usage with Promises[​](#basic-usage-with-promises)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`  
`
```

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `whereNow` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `whereNow`, you can use the following method(s) in the JavaScript SDK:

```
`pubnub.whereNow({  
    uuid: string  
}): PromiseWhereNowResponse>  
`
```

*  requiredParameterDescription`uuid`Type: stringDefault:  
`current uuid`Specifies the `uuid` to return channel list for.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`  
`
```

### Response[​](#response-1)

```
`// Example of Status  
{  
    error: false,  
    operation: "PNWhereNowOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    "channels": ["ch1", "ch2"]  
}  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-2)

#### Set State[​](#set-state)

```
`pubnub.setState({  
    channels: Arraystring> ,  
    channelGroups: Arraystring> ,  
    state: any  
}): PromiseSetStateResponse>;  
`
```

*  requiredParameterDescription`channels`Type: ArrayEither `channels` or `channelGroups` should be provided, Specifies the `channels` to set the state.`channelGroups`Type: ArrayEither `channels` or `channelGroups` should be provided, Specifies the Channel Group to set the state`state`Type: anyJSON object of key/value pairs with supported data-types of int, float and string. Nesting of key/values is not permitted and key names beginning with prefix `pn` are reserved.   
If the state parameter is undefined, the current state for the specified `uuid` will be returned. If a specified key already exists for the `uuid` it will be over-written with the new value. Key values can be deleted by setting the particular value to `null`.

#### Get State[​](#get-state)

```
`pubnub.getState({  
    uuid: string,  
    channels: Arraystring>,   
    channelGroups: Arraystring>  
}): PromiseGetStateResponse>;   
`
```

*  requiredParameterDescription`uuid`Type: StringDefault:  
`current uuid`The subscriber `uuid` to get the current state.`channels`Type: ArrayDefault:  
n/aEither `channels` or `channelGroups` should be provided, Specifies the `channels` to get the state.`channelGroups`Type: ArrayDefault:  
n/aEither `channels` or `channelGroups` should be provided, Specifies the Channel Group to get the state.

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state-1)

```
`  
`
```

#### Get State[​](#get-state-1)

```
`  
`
```

### Response[​](#response-2)

#### Set State[​](#set-state-2)

```
`// Example of Status  
{  
    error: false,  
    operation: "PNSetStateOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    state: {  
        me: 'typing'  
    }  
}  
`
```

#### Get State[​](#get-state-2)

```
`// Example of Status**{  
    error: false,  
    operation: "PNGetStateOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    channels: {  
        ch1: {  
            me: 'typing'  
        }  
    }  
}  
`
```
Last updated on Jun 30, 2025**