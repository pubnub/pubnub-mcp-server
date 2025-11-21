# Message Actions API for Swift Native SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Subscribe to channels to receive real-time message action events. You can also fetch past message actions independently or when fetching original messages.

##### Reactions
"Message Reactions" is a specific use of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions
- Message Actions: Low-level API to add arbitrary metadata to messages (read receipts, delivery confirmations, custom data).
- Message Reactions: Using Message Actions specifically for emoji/social reactions. In PubNub Core and Chat SDKs, the same underlying API may be referred to as Message Reactions.

## Add message action

##### Requires Message Persistence
Message Persistence must be enabled for your key in the Admin Portal.

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
- channel (String): Channel name to add the message action to.
- type (String): Message action type.
- value (String): Message action value.
- messageTimetoken (Timetoken): Timetoken of the target message.
- custom (PubNub.RequestConfiguration, default: PubNub.RequestConfiguration()): Per-request configuration.
- completion ((Result<PubNubMessageAction, Error>) -> Void)?: Async result callback.

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

```
1
  

```

## Remove message action

##### Requires Message Persistence
Message Persistence must be enabled for your key in the Admin Portal.

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
- channel (String): Channel name to remove the message action from.
- message (Timetoken): Timetoken of the target message.
- action (Timetoken): Timetoken of the message action to remove.
- custom (RequestConfiguration, default: RequestConfiguration()): Per-request configuration.
- completion ((Result<(channel: String, message: Timetoken, action: Timetoken), Error>) -> Void)?: Async result callback.

#### Completion handler result

#### Success
A tuple containing the channel, message Timetoken, and action Timetoken of the action that was removed.

#### Failure
An Error describing the failure.

### Sample code

```
1
  

```

## Get message actions

##### Requires Message Persistence
Message Persistence must be enabled for your key in the Admin Portal.

Get a list of message actions in a channel. Actions are sorted by action timetoken in ascending order.

##### Truncated response
Responses may be truncated when internal limits are hit. If truncated, a more property is returned with additional parameters; use iterative calls, adjusting parameters to fetch more actions.

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
- channel (String): Channel name to list message actions for.
- page (PubNubBoundedPage?, default: PubNubBoundedPageBase()): Paging object with start, end, and limit.
- custom (PubNub.RequestConfiguration, default: PubNub.RequestConfiguration()): Per-request configuration.
- completion ((Result<(actions: [PubNubMessageAction], next: PubNubBoundedPage?), Error>) -> Void)?: Async result callback.

#### Completion handler result

#### Success
An array of PubNubMessageAction for the request channel, and the next request PubNubBoundedPage (if one exists).

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