On this page
# Message Persistence API for Swift Native SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `includeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/swift/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the Swift SDK:

```
`func fetchMessageHistory(  
    for channels: [String],  
    includeActions actions: Bool = false,  
    includeMeta: Bool = false,  
    includeUUID: Bool = true,  
    includeMessageType: Bool = true,  
    includeCustomMessageType: Bool = false,  
    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(messagesByChannel: [String: [PubNubMessage]], next: PubNubBoundedPage?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`for` *Type: [String]Default:  
n/aThe list of channels to fetch history messages from. Maximum of 500 channels are allowed.`includeActions`Type: BoolDefault:  
`false`If `true` any Message Actions will be included in the response. When set to `true` the method is limited to retrieving history from a single channel.`includeMeta`Type: BoolDefault:  
`false`If `true` the meta properties of messages will be included in the response.`includeUUID`Type: BoolDefault:  
`true`If `true` the user ID of the sender will be included in the response.`includeMessageType`Type: BoolDefault:  
`true`Indicates whether to retrieve messages with PubNub message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeCustomMessageType`Type: BoolDefault:  
`false`Indicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`page`Type: PubNubBoundedPage?Default:  
`PubNubBoundedPageBase()`The paging object used for pagination. It allows you to specify a range of messages to retrieve based on specific time bounds. Set `limit` to control the number of results per page. Maximum value is 100 for a single channel, 25 for multiple channels, and 25 when `includeActions` is `true`.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(messagesByChannel: [String: [PubNubMessage]], next: PubNubBoundedPage?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### Truncated response

If you fetch messages with messages actions, the number of messages in the response may be truncated when internal limits are hit. If the response is truncated, a `next` property will be returned with additional parameters. Send iterative calls to history adjusting the parameters to fetch more messages.

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success)

A `Tuple` of a `Dictionary` of channels mapped to an `Array` their respective `PubNubMessages`, and the next request `PubNubBoundedPage` (if one exists).

```
`public protocol PubNubMessage {  
  
  /// The message sent on the channel  
  var payload: JSONCodable { get set }  
  
  /// Message reactions associated with this message  
  var actions: [PubNubMessageAction] { get set }  
  
  /// Message sender identifier  
  var publisher: String? { get set }  
  
  /// The channel for which the message belongs  
  var channel: String { get }  
  
  /// The channel group or wildcard subscription match (if exists)  
`
```
show all 41 lines

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

##### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last message on a channel:

```
`  
`
```

### Other Examples[​](#other-examples)

#### Retrieve messages newer or equal than a given timetoken[​](#retrieve-messages-newer-or-equal-than-a-given-timetoken)

```
`  
`
```

#### Retrieve messages older than a specific timetoken[​](#retrieve-messages-older-than-a-specific-timetoken)

```
`  
`
```

#### Retrieve the last 10 messages on channelSwift, otherChannel, and myChannel[​](#retrieve-the-last-10-messages-on-channelswift-otherchannel-and-mychannel)

```
`  
`
```

#### Retrieve messages and their metadata[​](#retrieve-messages-and-their-metadata)

```
`  
`
```

#### Retrieve messages and their Message Action data[​](#retrieve-messages-and-their-message-action-data)

```
`  
`
```

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Swift SDK.

```
`func deleteMessageHistory(  
    from channel: String,  
    start: Timetoken? = nil,  
    end: Timetoken? = nil,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultVoid, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`from` *Type: StringDefault:  
n/aThe channel to delete the messages from.`start`Type: Timetoken?Default:  
`nil`Timetoken delimiting the start of time slice (inclusive) to delete messages from.`end`Type: Timetoken?Default:  
`nil`Timetoken delimiting the end of time slice (exclusive) to delete messages from.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<Void, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call

#### Completion Handler Result[​](#completion-handler-result-1)

##### Success[​](#success-1)

A `Void` indicating a success.

##### Failure[​](#failure-1)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Other Examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

```
`  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `timetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

You can use the following method(s) in the Swift SDK:

```
`func messageCounts(  
    channels: [String: Timetoken],  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result[String: Int], Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channels` *Type: [String: Timetoken]Default:  
n/aThe map of channels and the `Timetoken` to get the message count for.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String: Int], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

```
`func messageCounts(  
    channels: [String],  
    timetoken: Timetoken = 1,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result[String: Int], Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channels` *Type: [String]Default:  
n/aThe list of channels to get message counts for.`timetoken`Type: TimetokenDefault:  
`1`The timetoken for all channels in the list to get message counts for.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<[String: Int], Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-2)

##### Success[​](#success-2)

A `Dictionary` of channels mapped to their respective message count.

##### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Other Examples[​](#other-examples-2)

#### Retrieve message counts for multiple channels with the same timetoken 15526611838554310[​](#retrieve-message-counts-for-multiple-channels-with-the-same-timetoken-15526611838554310)

```
`  
`
```

#### Retrieve message counts for multiple channels with different timetokens[​](#retrieve-message-counts-for-multiple-channels-with-different-timetokens)

```
`**`
```
Last updated on Jun 12, 2025**