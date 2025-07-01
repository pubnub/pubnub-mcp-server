On this page
# Presence API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `hereNow()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following methods in the Kotlin SDK:

```
`pubnub.hereNow(  
    channels: ListString>,  
    channelGroups: ListString>,  
    includeState: Boolean,  
    includeUUIDs: Boolean  
).async { result -> }  
`
```

*  requiredParameterDescription`channels`Type: `List<String>`Default:  
n/aThe `channels` to get the 'here now' details of.`channelGroups`Type: `List<String>`Default:  
n/aThe `channelGroups` to get the 'here now' details of.`includeState`Type: `Boolean`Default:  
`false`If `true`, the response will include the presence states of the users for `channels`/`channelGroups`.`includeUUIDs`Type: `Boolean`Default:  
`true`If true, the response will include the `UUIDs` of the connected clients.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
`  
`
```

### Returns[​](#returns)

The `hereNow()` operation returns a `PNHereNowResult?` which contains the following operations:

MethodDescription`totalChannels`Type: `Int`Total channels`totalOccupancy`Type: `Int`Total occupancy`channels`Type: `Map<String, PNHereNowChannelData>`A map with values of `PNHereNowChannelData` for each channel. See [PNHereNowChannelData](#pnherenowchanneldata) for more details.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

MethodDescription`channelName`Type: `String`Channel name`occupancy`Type: `Int`Occupancy of the channel`occupants`Type: `List<PNHereNowOccupantData>`A list of `PNHereNowOccupantData`, see [PNHereNowOccupantData](#pnherenowoccupantdata) for more details.

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

MethodDescription`uuid`Type: `String`UUID of the user`state`Type: `JsonElement?`State of the user

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`  
`
```

Example response:

```
`.async { result: ResultPNHereNowResult> ->  
    result.onSuccess { res: PNHereNowResult ->  
        res.channels.values.forEach { channelData ->  
            channelData.channelName // ch1  
            channelData.occupancy // 3  
            channelData.occupants.forEach { o ->  
                o.uuid // some_uuid, returned by default  
                o.state // {"data":{"isTyping":true}}, requested  
            }  
        }  
    }.onFailure { e ->  
        // handle error  
        e.message  
        e.statusCode  
        e.pubnubError  
`
```
show all 17 lines

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`  
`
```

Example response:

```
`.async { result: ResultPNHereNowResult> ->  
    result.onSuccess { res: PNHereNowResult ->  
        res.channels.values.forEach { channelData ->  
            channelData.channelName // ch1  
            channelData.occupancy // 3  
        }  
    }.onFailure { e ->  
        // handle error  
        e.message  
        e.statusCode  
        e.pubnubError  
    }  
}  
`
```

#### Here Now for Channel Groups[​](#here-now-for-channel-groups)

```
`  
`
```

Example response:

```
`.async { result: ResultPNHereNowResult> ->  
    result.onSuccess { res: PNHereNowResult ->  
        res.totalOccupancy  
    }.onFailure { e ->  
        // handle error  
        e.message  
        e.statusCode  
        e.pubnubError  
    }  
}  
`
```

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `whereNow()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `whereNow()` you can use the following method(s) in the Kotlin SDK:

```
`pubnub.whereNow(  
    uuid: String  
).async { result -> }  
`
```

*  requiredParameterDescription`uuid`Type: `String`Default:  
n/aUUID of the user to get its current channel subscriptions.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the callback function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`  
`
```

### Returns[​](#returns-1)

The `whereNow()` operation returns a `PNWhereNowResult?` which contains the following operations:

MethodDescription`channels`Type: `List<String>`List of channels where the `uuid` is present.

### Other Examples[​](#other-examples-1)

#### Obtain information about the current list of channels of some other UUID[​](#obtain-information-about-the-current-list-of-channels-of-some-other-uuid)

```
`  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

##### Presence state format

Presence state must be expressed as a JsonObject. When calling `setState`, be sure to supply an initialized JsonObject or POJO which can be serialized to a JsonObject.

### Method(s)[​](#methods-2)

To set the state, call `setPresenceState()` you can use the following method(s) in the Kotlin SDK:

#### Set State[​](#set-state)

```
`pubnub.setPresenceState(  
    channels: ListString>,  
    channelGroups: ListString>,  
    state: Any,  
    uuid: String  
).async { result -> }  
`
```

*  requiredParameterDescription`channels`Type: `List<String>`Default:  
n/aChannels to set state to.`channelGroups`Type: `List<String>`Default:  
n/aChannel groups to set state to.`state`Type: `Any`Default:  
n/aThe state to set.`uuid`Type: `String`Default:  
n/aThe UUID to set state for.

#### Get State[​](#get-state)

```
`pubnub.getPresenceState(  
    channels: ListString>,  
    channelGroups: ListString>,  
    uuid: String  
).async { result -> }  
`
```

To get the state, call `getPresenceState()` you can use the following method(s) in the Kotlin SDK:

*  requiredParameterDescription`channels`Type: `List<String>`Default:  
n/aChannels to get state of.`channelGroups`Type: `List<String>`Default:  
n/aChannel groups to get state of.`uuid`Type: `String`Default:  
n/aThe UUID to get state for.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

The `setPresenceState()` operation returns a `PNSetStateResult?` which contains the following operations:

MethodDescription`state`Type: `JsonElement`The actual state object

The `getPresenceState()` operation returns a `PNSetStateResult?` which contains the following operations:

MethodDescription`stateByUUID`Type: `Map<String, JsonElement>`Map of UUIDs and the user states.

### Other Examples[​](#other-examples-2)

#### Set state for channels in channel group[​](#set-state-for-channels-in-channel-group)

```
`  
`
```

#### Get state for UUID[​](#get-state-for-uuid)

```
`**`
```
Last updated on Jun 16, 2025**