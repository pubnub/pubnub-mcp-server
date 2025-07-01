On this page
# Message Actions API for Swift Native SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Swift SDK:

```
`func addMessageAction(  
    channel: String,  
    type actionType: String,  
    value: String,  
    messageTimetoken: Timetoken,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubMessageAction, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe name of the channel`type` *Type: StringDefault:  
n/aThe Message Action's type`value` *Type: StringDefault:  
n/aThe Message Action's value`messageTimetoken` *Type: TimetokenDefault:  
n/aThe publish timetoken of a parent message.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<PubNubMessageAction, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

### Completion Handler Result[​](#completion-handler-result)

#### Success[​](#success)

The `PubNubMessageAction` that was added.

```
`public protocol PubNubMessageAction {  
  
  /// The type of action  
  var actionType: String { get }  
  
  /// The value that corresponds to the type  
  var actionValue: String { get }  
  
  /// The `Timetoken` for this specific action  
  var actionTimetoken: Timetoken { get }  
  
  /// The `Timetoken` for the message this action relates to  
  var messageTimetoken: Timetoken { get }  
  
  /// The publisher of the message action  
`
```
show all 20 lines

#### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published message.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the Swift SDK:

```
`func removeMessageActions(  
    channel: String,  
    message timetoken: Timetoken,  
    action actionTimetoken: Timetoken,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe name of the channel.`message` *Type: TimetokenDefault:  
n/aThe publish timetoken of a parent message.`action` *Type: TimetokenDefault:  
n/aThe action timetoken of a message action to be removed.`custom`Type: `RequestConfiguration`Default:  
`RequestConfiguration()`An object that allows for per-request customization of PubNub Configuration or Network Session`completion`Type: `((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call

#### Completion Handler Result[​](#completion-handler-result-1)

#### Success[​](#success-1)

A `Tuple` containing the channel, message `Timetoken`, and action `Timetoken` of the action that was removed.

#### Failure[​](#failure-1)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

##### Truncated response

Number of message actions in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to Message Persistence adjusting the parameters to fetch more message actions.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the Swift SDK:

```
`func fetchMessageActions(  
    channel: String,  
    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(actions: [PubNubMessageAction], next: PubNubBoundedPage?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe name of the channel.`page`Type: PubNubBoundedPage?Default:  
`PubNubBoundedPageBase()`The paging object used for pagination. It allows you to specify a range of messages to retrieve based on specific time bounds.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-2)

#### Success[​](#success-2)

An `Array` of `PubNubMessageAction` for the request channel, and the next request `PubNubBoundedPage` (if one exists).

```
`public protocol PubNubMessageAction {  
  
  /// The type of action  
  var actionType: String { get }  
  
  /// The value that corresponds to the type  
  var actionValue: String { get }  
  
  /// The `Timetoken` for this specific action  
  var actionTimetoken: Timetoken { get }  
  
  /// The `Timetoken` for the message this action relates to  
  var messageTimetoken: Timetoken { get }  
  
  /// The publisher of the message action  
`
```
show all 20 lines

```
`public protocol PubNubBoundedPage {  
  
  /// The start value for the next set of remote data  
  var start: Timetoken? { get }  
  
  /// The bounded end value that will be eventually fetched to  
  var end: Timetoken? { get }  
  
  /// The previous limiting value (if any)  
  var limit: Int? { get }  
}  
`
```

#### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-2)

```
`**`
```
Last updated on Jun 12, 2025**