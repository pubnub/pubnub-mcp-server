# Message Actions API for Swift Native SDK

Use message actions to add/remove metadata on published messages (for example, receipts and reactions). Subscribe to a channel to receive message action events in real time, or fetch past message actions from Message Persistence, independently or alongside original messages.

##### Reactions
“Message Reactions” is the use of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions
- Message Actions: Low-level API to attach metadata (read receipts, delivery confirmations, custom data).
- Message Reactions: The same API used for emoji/social reactions in PubNub Core and Chat SDKs.

## Add message action

##### Requires Message Persistence
Requires Message Persistence to be enabled for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)
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

Parameters:
- channel
  - Type: String
  - Default: n/a
  - Description: Channel name to add the message action to.
- type
  - Type: String
  - Default: n/a
  - Description: Message action type.
- value
  - Type: String
  - Default: n/a
  - Description: Message action value.
- messageTimetoken
  - Type: Timetoken
  - Default: n/a
  - Description: Timetoken of the target message.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request configuration. See Request Configuration.
- completion
  - Type: ((Result<PubNubMessageAction, Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

### Completion handler result

#### Success
The PubNubMessageAction that was added.

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

#### Failure
An Error describing the failure.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

## Remove message action

##### Requires Message Persistence
Requires Message Persistence to be enabled for your key in the Admin Portal.

Remove a previously added action from a published message.

### Method(s)
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

Parameters:
- channel
  - Type: String
  - Default: n/a
  - Description: Channel name to remove the message action from.
- message
  - Type: Timetoken
  - Default: n/a
  - Description: Timetoken of the target message.
- action
  - Type: Timetoken
  - Default: n/a
  - Description: Timetoken of the message action to remove.
- custom
  - Type: RequestConfiguration
  - Default: RequestConfiguration()
  - Description: Per-request configuration.
- completion
  - Type: ((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

#### Completion handler result

#### Success
A Tuple containing the channel, message Timetoken, and action Timetoken of the action that was removed.

#### Failure
An Error describing the failure.

### Sample code

```
1
  

```

## Get message actions

##### Requires Message Persistence
Requires Message Persistence to be enabled for your key in the Admin Portal.

Get a list of message actions in a channel. Actions are sorted by action timetoken in ascending order.

##### Truncated response
When internal limits are hit, the response may be truncated and include a more property with additional parameters. Send iterative calls (adjusting parameters) to fetch more actions.

### Method(s)
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

Parameters:
- channel
  - Type: String
  - Default: n/a
  - Description: Channel name to list message actions for.
- page
  - Type: PubNubBoundedPage?
  - Default: PubNubBoundedPageBase()
  - Description: Paging object to specify time bounds; provides start, end, and limit.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request configuration.
- completion
  - Type: ((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

#### Completion handler result

#### Success
An Array of PubNubMessageAction for the request channel, and the next request PubNubBoundedPage (if one exists).

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

#### Failure
An Error describing the failure.

### Sample code

```
1
**
```

Last updated on Sep 3, 2025**