# Message Persistence API for Swift Native SDK

Message Persistence provides access to stored message history (timestamped to 10ns). Storage duration is controlled by your account retention policy (1 day → Unlimited). Stored messages can be AES-256 encrypted (see Message Persistence docs).

You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history[​](#fetch-history)

##### Requires Message Persistence
Must be enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use `includeActions` to include Message Actions (reactions).

**Time bounds behavior**
- `start` only (no `end`): returns messages **older than** `start`.
- `end` only (no `start`): returns messages from `end` **and newer**.
- `start` + `end`: returns messages **between** those timetokens (**inclusive of `end`**).

**Limits / paging**
- Up to **100** messages for a single channel.
- Up to **25 per channel** for up to **500** channels.
- To page, iteratively update the `start` timetoken.
- If response is truncated, `next` is returned; make iterative calls using it.

### Method(s)[​](#methods)

Use the following method(s) in the Swift SDK:

```
`1func fetchMessageHistory(  
2    for channels: [String],  
3    includeActions actions: Bool = false,  
4    includeMeta: Bool = false,  
5    includeUUID: Bool = true,  
6    includeMessageType: Bool = true,  
7    includeCustomMessageType: Bool = false,  
8    page: PubNubBoundedPage? = PubNubBoundedPageBase(),  
9    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
10    completion: ((Result(messagesByChannel: [String: [PubNubMessage]], next: PubNubBoundedPage?), Error>) -> Void)?  
11)  
`
```

**Parameters**
- `for` (required) `[String]`: channels to fetch from (max **500**).
- `includeActions` `Bool` (default `false`): include Message Actions. If `true`, limited to **single channel** history.
- `includeMeta` `Bool` (default `false`): include message `meta`.
- `includeUUID` `Bool` (default `true`): include sender user ID.
- `includeMessageType` `Bool` (default `true`): include PubNub message type.
- `includeCustomMessageType` `Bool` (default `false`): include custom message type.
- `page` `PubNubBoundedPage?` (default `PubNubBoundedPageBase()`): paging/time bounds; set `limit` (max **100** single channel; **25** multi-channel; **25** when `includeActions == true`).
- `custom` `PubNub.RequestConfiguration` (default `PubNub.RequestConfiguration()`): per-request configuration.
- `completion`: `Result` containing `(messagesByChannel, next)` or `Error`.

#### Completion handler result[​](#completion-handler-result)

##### Success[​](#success)
Returns:
- `messagesByChannel: [String: [PubNubMessage]]`
- `next: PubNubBoundedPage?` (when more data is available)

```
1public protocol PubNubMessage {  
2
  
3  /// The message sent on the channel  
4  var payload: JSONCodable { get set }  
5
  
6  /// Message reactions associated with this message  
7  var actions: [PubNubMessageAction] { get set }  
8
  
9  /// Message sender identifier  
10  var publisher: String? { get set }  
11
  
12  /// The channel for which the message belongs  
13  var channel: String { get }  
14
  
15  /// The channel group or wildcard subscription match (if exists)  
16  var subscription: String? { get }  
17
  
18  /// Timetoken for the message  
19  var published: Timetoken { get set }  
20
  
21  /// Meta information for the message  
22  var metadata: JSONCodable? { get set }  
23
  
24  /// The type of message that was received  
25  var messageType: PubNubMessageType { get set }  
26
  
27  /// A user-provided custom message type  
28  var customMessageType: String? { get set }  
29
  
30  /// Message actions associated with this message  
31  var actions: [PubNubMessageAction] { get set }  
32
  
33  /// The channel for which the message belongs  
34  var channel: String { get }  
35
  
36  /// Timetoken for the message  
37  var published: Timetoken { get set }  
38
  
39  /// Meta information for the message  
40  var metadata: JSONCodable? { get set }  
41}  

```
show all 41 lines

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

##### Failure[​](#failure)
Returns an `Error`.

### Sample code[​](#sample-code)

##### Reference code
Retrieve the last message on a channel:

```
1
  

```

### Other examples[​](#other-examples)

#### Retrieve messages newer or equal than a given `timetoken`[​](#retrieve-messages-newer-or-equal-than-a-given-timetoken)

```
1
  

```

#### Retrieve messages older than a specific `timetoken`[​](#retrieve-messages-older-than-a-specific-timetoken)

```
1
  

```

#### Retrieve the last 10 messages on channelSwift, otherChannel, and myChannel[​](#retrieve-the-last-10-messages-on-channelswift-otherchannel-and-mychannel)

```
1
  

```

#### Retrieve messages and their metadata[​](#retrieve-messages-and-their-metadata)

```
1
  

```

#### Retrieve messages and their message action data[​](#retrieve-messages-and-their-message-action-data)

```
1
  

```

## Delete messages from history[​](#delete-messages-from-history)

##### Requires Message Persistence
Must be enabled for your key in the Admin Portal.

Removes messages from a channel’s history.

##### Required setting
Enable **Delete-From-History** in key settings and initialize with a **secret key**.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Swift SDK.

```
`1func deleteMessageHistory(  
2    from channel: String,  
3    start: Timetoken? = nil,  
4    end: Timetoken? = nil,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((ResultVoid, Error>) -> Void)?  
7)  
`
```

**Parameters**
- `from` (required) `String`: channel to delete from.
- `start` `Timetoken?` (default `nil`): start timetoken (**inclusive**).
- `end` `Timetoken?` (default `nil`): end timetoken (**exclusive**).
- `custom` `PubNub.RequestConfiguration` (default `PubNub.RequestConfiguration()`): per-request configuration.
- `completion` `((Result<Void, Error>) -> Void)?` (default `nil`).

#### Completion handler result[​](#completion-handler-result-1)

##### Success[​](#success-1)
Returns `Void`.

##### Failure[​](#failure-1)
Returns an `Error`.

### Sample code[​](#sample-code-1)

```
1
  

```

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

```
1
  

```

## Message counts[​](#message-counts)

##### Requires Message Persistence
Must be enabled for your key in the Admin Portal.

Returns number of messages published since the given time (counts messages with timetoken **≥** provided value).

##### Unlimited message retention
If unlimited retention is enabled, counts only consider messages from the **last 30 days**.

### Method(s)[​](#methods-2)

You can use the following method(s) in the Swift SDK:

```
`1func messageCounts(  
2    channels: [String: Timetoken],  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((Result[String: Int], Error>) -> Void)?  
5)  
`
```

**Parameters**
- `channels` (required) `[String: Timetoken]`: per-channel timetoken.
- `custom` `PubNub.RequestConfiguration` (default `PubNub.RequestConfiguration()`).
- `completion` `((Result<[String: Int], Error>) -> Void)?` (default `nil`).

```
`1func messageCounts(  
2    channels: [String],  
3    timetoken: Timetoken = 1,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((Result[String: Int], Error>) -> Void)?  
6)  
`
```

**Parameters**
- `channels` (required) `[String]`: channels to count.
- `timetoken` `Timetoken` (default `1`): shared timetoken for all channels.
- `custom` `PubNub.RequestConfiguration` (default `PubNub.RequestConfiguration()`).
- `completion` `((Result<[String: Int], Error>) -> Void)?` (default `nil`).

#### Completion handler result[​](#completion-handler-result-2)

##### Success[​](#success-2)
Returns `[String: Int]` mapping channels to message counts.

##### Failure[​](#failure-2)
Returns an `Error`.

### Sample code[​](#sample-code-2)

```
1
  

```

### Other examples[​](#other-examples-2)

#### Retrieve message counts for multiple channels with the same `timetoken` 15526611838554310[​](#retrieve-message-counts-for-multiple-channels-with-the-same-timetoken-15526611838554310)

```
1
  

```

#### Retrieve message counts for multiple channels with different timetokens[​](#retrieve-message-counts-for-multiple-channels-with-different-timetokens)

```
1
**
```