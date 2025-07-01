On this page
# Channel Groups API for Swift Native SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Swift SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`func add(  
    channels: [String],  
    to group: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String: [String]], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`channels` *Type: [String]Default:  
n/aList of `channels` to add to the group.`to` *Type: StringDefault:  
n/aThe Channel Group to add the list of channels to.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(group: String, channels: [String]), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success)

A `Tuple` containing the channel-group and the `Array` of channels added.

##### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

#### Add Channels[​](#add-channels-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Swift SDK:

```
`func listChannels(  
    for group: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`for` *Type: StringDefault:  
n/aThe channel group to list channels on.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(group: String, channels: [String]), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-1)

##### Success[​](#success-1)

A `Tuple` containing the channel-group and the `Array` of its channels.

##### Failure[​](#failure-1)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`  
`
```

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Swift SDK:

```
`func remove(  
    channels: [String],  
    from group: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channels` *Type: [String]Default:  
n/aThe list of `channels` to remove from the channel group.`from` *Type: StringDefault:  
n/aThe channel group to remove channels from.`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub Configuration or Network Session.`completion`Type: `((Result<(group: String, channels: [String]), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-2)

##### Success[​](#success-2)

A `Tuple` containing the channel-group and the `Array` of channels removed.

##### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`  
`
```

## List Channel Groups[​](#list-channel-groups)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channel groups.

### Method(s)[​](#methods-3)

`Listing Channel Groups` is accomplished by using the following method(s) in the Swift SDK:

```
`func listChannelGroups(  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: `((Result[String], Error>) -> Void)?`  
)  
`
```

*  requiredParameterDescription`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-3)

##### Success[​](#success-3)

List of all channel-groups.

##### Failure[​](#failure-3)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-3)

#### List Channel Groups[​](#list-channel-groups-1)

```
`  
`
```

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-4)

`Deleting Channel Group` is accomplished by using the following method(s) in the Swift SDK:

```
`func remove(  
    channelGroup: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultString, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channelGroup` *Type: StringDefault:  
n/aThe channel group to delete.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<String, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-4)

##### Success[​](#success-4)

The channel-group that was removed.

##### Failure[​](#failure-4)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-4)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`**`
```
Last updated on Jun 12, 2025**