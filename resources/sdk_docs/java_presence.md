On this page
# Presence API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Presence enables you to track the online and offline status of users and devices in real time, and store custom state information. Presence provides authoritative information on:

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

To call `Here Now` you can use the following method(s) in the Java SDK:

```
`this.pubnub.hereNow()  
    .channels(Array)  
    .channelGroups(Arrays)  
    .includeState(true)  
    .includeUUIDs(true)  
`
```

*  requiredParameterDescription`channels`Type: ArrayDefault:  
n/aThe `channels` to get the `here now` details.`channelGroups`Type: ArraysDefault:  
n/aThe `channelGroups` to get the `here now` details.`includeState`Type: BooleanDefault:  
`false`If `true`, the response will include the presence states of the users for `channels`/`channelGroups``includeUUIDs`Type: BooleanDefault:  
`true`If `true`, the response will include the `UUIDs` of the connected clients.`async` *Type: `Consumer<Result>`Default:  
n/a`Consumer` of a `Result` of type `PNHereNowResult`

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
`  
`
```

### Returns[​](#returns)

The `hereNow()` operation returns a `PNHereNowResult` which contains the following operations:

MethodDescription`getTotalChannels()`Type: IntTotal `Channels`.`getTotalOccupancy()`Type: IntTotal `Occupancy`.`getChannels()`Type: Map`<String, PNHereNowChannelData>`A map with values of `PNHereNowChannelData` for each `channel`. See [PNHereNowChannelData](#pnherenowchanneldata)  for more details.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

MethodDescription`getChannelName()`Type: String`Channel` name.`getOccupancy()`Type: Int`Occupancy` of the `channel`.`getOccupants()`Type: List`<PNHereNowOccupantData>`A list of `PNHereNowOccupantData`, see [PNHereNowOccupantData](#pnherenowoccupantdata)  for more details.

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

MethodDescription`getUuid()`Type: String`UUIDs` of the user.`getState()`Type: Object`State` of the user.

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`  
`
```

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`  
`
```

#### Here Now for Channel Groups[​](#here-now-for-channel-groups)

```
`  
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

To call `whereNow()` you can use the following method(s) in the Java SDK:

```
`pubnub.whereNow()  
    .uuid(String)  
`
```

*  requiredParameterDescription`uuid`Type: String`Uuid` of the user we want to spy on.`async` *Type: CommandExecute as `async`.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`  
`
```

### Returns[​](#returns-1)

The `whereNow()` operation returns a `PNWhereNowResult` which contains the following operations:

MethodDescription`getChannels()`Type: List`<String>`The list of `channels` where the `UUID` is present.

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

#### Set State[​](#set-state)

```
`this.pubnub.setPresenceState()  
    .channels(Array)  
    .channelGroups(Array)  
    .state(HashMap)  
    .uuid(String)  
`
```

*  requiredParameterDescription`channels`Type: Array`Channels` to set `state`.`channelGroups`Type: Array`ChannelGroups` to set `state`.`state`Type: HashMap`State` to set.`uuid`Type: StringSet `state` for specific `UUID`.`async` *Type: `Consumer<Result>``Consumer` of a `Result` of type `PNSetStateResult`.

#### Get State[​](#get-state)

```
`this.pubnub.getPresenceState()  
    .channels(Arrays)  
    .channelGroups(Arrays)  
    .uuid(String)  
`
```

*  requiredParameterDescription`channels`Type: Arrays`Channel` name to fetch the `state`.`channelGroups`Type: Arrays`ChannelGroups` name to fetch the `state`.`uuid`Type: String`UUID``async` *Type: `Consumer<Result>``Consumer` of a `Result` of type `PNGetStateResult`.

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

### Returns[​](#returns-2)

The `setPresenceState()` operation returns a `PNSetStateResult` which contains the following operations:

MethodDescription`getState()`Type: Map`<String, Object>`Map of `UUIDs` and the user states.

The `getPresenceState()` operation returns a `PNGetStateResult` which contains the following operations:

MethodDescription`getStateByUUID()`Type: Map`<String, Object>`Map of `UUIDs` and the user states.

### Other Examples[​](#other-examples-2)

#### Set state for channels in channel group[​](#set-state-for-channels-in-channel-group)

```
`  
`
```

The above code would return the following response to the client:

```
`**`
```
Last updated on Jun 16, 2025**