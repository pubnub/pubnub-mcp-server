# Message Actions API for Swift Native SDK

Use **message actions** to add/remove metadata on published messages (for example, receipts and reactions). Subscribe to a channel to receive message action events in real time; you can also fetch historical message actions via Message Persistence.

##### Reactions

“Message Reactions” is a specific use of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions

- **Message Actions**: low-level, flexible metadata on messages (read receipts, delivery confirmations, custom data).
- **Message Reactions**: the same API when used specifically for emoji/social reactions (terminology differs across PubNub Core/Chat SDKs).

## Add message action[​](#add-message-action)

##### Requires Message Persistence

Message Persistence must be enabled for your key in the Admin Portal.

Add an action to a published message. Response includes the added action.

### Method(s)[​](#methods)

Use this Swift method:

```
`1func addMessageAction(  
2    channel: String,  
3    type actionType: String,  
4    value: String,  
5    messageTimetoken: Timetoken,  
6    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
7    completion: ((ResultPubNubMessageAction, Error>) -> Void)?  
8)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name to add the message action to.`type` *Type: StringDefault:  
n/aMessage action type.`value` *Type: StringDefault:  
n/aMessage action value.`messageTimetoken` *Type: TimetokenDefault:  
n/aTimetoken of the target message.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`Per-request configuration. See [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration).`completion`Type: `((Result<PubNubMessageAction, Error>) -> Void)?`Default:  
`nil`Async result of the call.

### Completion handler result[​](#completion-handler-result)

#### Success[​](#success)

Returns the added `PubNubMessageAction`.

```
1public protocol PubNubMessageAction {  
2
  
3  /// The type of action  
4  var actionType: String { get }  
5
  
6  /// The value that corresponds to the type  
7  var actionValue: String { get }  
8
  
9  /// The `Timetoken` for this specific action  
10  var actionTimetoken: Timetoken { get }  
11
  
12  /// The `Timetoken` for the message this action relates to  
13  var messageTimetoken: Timetoken { get }  
14
  
15  /// The publisher of the message action  
16  var publisher: String { get }  
17
  
18  /// The channel the action (and message) were sent on  
19  var channel: String { get }  
20}  

```
show all 20 lines

#### Failure[​](#failure)

Returns an `Error`.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence

Message Persistence must be enabled for your key in the Admin Portal.

Remove a previously added action from a published message.

### Method(s)[​](#methods-1)

Use this Swift method:

```
`1func removeMessageActions(  
2    channel: String,  
3    message timetoken: Timetoken,  
4    action actionTimetoken: Timetoken,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((Result(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?  
7)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name to remove the message action from.`message` *Type: TimetokenDefault:  
n/aTimetoken of the target message.`action` *Type: TimetokenDefault:  
n/aTimetoken of the message action to remove.`custom`Type: `RequestConfiguration`Default:  
`RequestConfiguration()`Per-request configuration.`completion`Type: `((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?`Default:  
`nil`Async result of the call.

#### Completion handler result[​](#completion-handler-result-1)

#### Success[​](#success-1)

Returns a `Tuple` `(channel: String, message: Timetoken, action: Timetoken)` for the removed action.

#### Failure[​](#failure-1)

Returns an `Error`.

### Sample code[​](#sample-code-1)

```
1
  

```

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence

Message Persistence must be enabled for your key in the Admin Portal.

Fetch message actions for a channel. Actions are sorted by **action timetoken ascending**.

##### Truncated response

Responses may be truncated due to internal limits. If truncated, a `more` property is returned with additional parameters; make iterative calls (adjusting parameters) to fetch more actions.

### Method(s)[​](#methods-2)

Use this Swift method:

```
`1func fetchMessageActions(  
2    channel: String,  
3    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((Result(actions: [PubNubMessageAction], next: PubNubBoundedPage?), Error>) -> Void)?  
6)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel name to list message actions for.`page`Type: PubNubBoundedPage?Default:  
`PubNubBoundedPageBase()`Paging object to specify time bounds; provides `start`, `end`, and `limit`.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`Per-request configuration.`completion`Type: `((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?`Default:  
`nil`Async result of the call.

#### Completion handler result[​](#completion-handler-result-2)

#### Success[​](#success-2)

Returns:
- `[PubNubMessageAction]` for the channel
- `next: PubNubBoundedPage?` if more results are available

```
1public protocol PubNubMessageAction {  
2
  
3  /// The type of action  
4  var actionType: String { get }  
5
  
6  /// The value that corresponds to the type  
7  var actionValue: String { get }  
8
  
9  /// The `Timetoken` for this specific action  
10  var actionTimetoken: Timetoken { get }  
11
  
12  /// The `Timetoken` for the message this action relates to  
13  var messageTimetoken: Timetoken { get }  
14
  
15  /// The publisher of the message action  
16  var publisher: String { get }  
17
  
18  /// The channel the action (and message) were sent on  
19  var channel: String { get }  
20}  

```
show all 20 lines

```
1public protocol PubNubBoundedPage {  
2
  
3  /// The start value for the next set of remote data  
4  var start: Timetoken? { get }  
5
  
6  /// The bounded end value that will be eventually fetched to  
7  var end: Timetoken? { get }  
8
  
9  /// The previous limiting value (if any)  
10  var limit: Int? { get }  
11}  

```

#### Failure[​](#failure-2)

Returns an `Error`.

### Sample code[​](#sample-code-2)

```
1
**
```

Last updated on Sep 3, 2025**