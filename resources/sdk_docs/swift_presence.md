On this page
# Presence API for Swift Native SDK

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

To call `Here Now` you can use the following method(s) in the Swift SDK:

```
`func hereNow(  
    on channels: [String],  
    and groups: [String] = [],  
    includeUUIDs: Bool = true,  
    includeState: Bool = false,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result[String: PubNubPresence], Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`on` *Type: [String]Default:  
n/aThe list of `channels` to return occupancy results from.`and`Type: [String]Default:  
`[]`The list of `channel groups` for which will return occupancy results from.`includeUUIDs`Type: BoolDefault:  
`true`Setting `uuid` to `false` disables the return of UUIDs.`includeState`Type: BoolDefault:  
`false`Setting this flag to `true` will return the subscribe state information as well.`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub Configuration or Network Session.`completion`Type: `((Result<[String: PubNubPresence], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success)

A `Dictionary` of channels mapped to their respective `PubNubPresence`

```
`public protocol PubNubPresence {  
  
    /// The channel identifier  
    var channel: String { get }  
  
    /// The total number of UUIDs present on the channel  
    var occupancy: Int { get set }  
  
    /// The known UUIDs present on the channel  
    ///  
    /// The `count` of this Array may differ from the `occupancy` field  
    var occupants: [String] { get set }  
  
    /// The Dictionary of UUIDs mapped to their respective presence state data  
    var occupantsState: [String: JSONCodable] { get set }  
`
```
show all 16 lines

##### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Other Examples[​](#other-examples)

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`  
`
```

#### Channel Group Usage[​](#channel-group-usage)

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

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `whereNow()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `whereNow()` you can use the following method(s) in the Swift SDK:

```
`func whereNow(  
    for uuid: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String: [String]], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`for` *Type: StringDefault:  
n/aSpecifies the `UUID` to return channel list for.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String: [String]], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-1)

##### Success[​](#success-1)

A `Dictionary` of UUIDs mapped to their respective `Array` of channels they have presence on.

##### Failure[​](#failure-1)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

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

### Method(s)[​](#methods-2)

#### Set State[​](#set-state)

```
`func setPresence(  
    state: [String: JSONCodableScalar],  
    on channels: [String],  
    and groups: [String] = [],  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultJSONCodable, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`state` *Type: [String: JSONCodableScalar]Default:  
n/aThe `state` Dictionary to store. Nesting of Dictionary values isn't permitted, and key names beginning with prefix `pn` are reserved. Setting the `state` will overwrite the previous values set. Clearing out the `state` involves passing in an empty Dictionary.`on`Type: [String]Default:  
n/aThe list of channel to set the state on. Pass an empty array to not set.`and`Type: [String]Default:  
n/aThe list of channel groups to set the state on.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<JSONCodable, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-2)

##### Success[​](#success-2)

The presence State set as a `JSONCodable`.

##### Failure[​](#failure-2)

An `Error` describing the failure.

#### Get State[​](#get-state)

```
`func getPresenceState(  
    for uuid: String,  
    on channels: [String],  
    and groups: [String] = [],  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`for` *Type: StringDefault:  
n/aThe UUID to retrieve the state for.`on`Type: [String]Default:  
n/aThe list of channel to get the state on. Pass an empty array to not get.`and`Type: [String]Default:  
[]The list of channel groups to get the state on. Pass an empty array to not get.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-3)

##### Success[​](#success-3)

A `Tuple` containing the UUID that set the State and a `Dictionary` of channels mapped to their respective State.

##### Failure[​](#failure-3)

An `Error` describing the failure.

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

### Other Examples[​](#other-examples-1)

#### Converting the response to a JSON Dictionary[​](#converting-the-response-to-a-json-dictionary)

```
`  
`
```

#### Converting the response to a custom object[​](#converting-the-response-to-a-custom-object)

```
`**`
```
Last updated on Jun 16, 2025**