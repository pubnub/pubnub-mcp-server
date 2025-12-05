# Message Persistence API for Swift Native SDK

Message Persistence provides real-time access to stored, timestamped messages. Storage can be AES-256 encrypted and is replicated across availability zones. Configure message retention in the Admin Portal (options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited). You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Ordering rules:
- start only: returns messages older than start.
- end only: returns messages from end and newer.
- start and end: returns messages between bounds (inclusive of end).

Limits:
- Up to 100 messages on a single channel.
- Up to 25 per channel on as many as 500 channels.
- Page using the start timetoken returned in next.

### Method(s)

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

Parameters:
- for (required)
  - Type: [String]
  - Description: Channels to fetch from. Max 500.
- includeActions
  - Type: Bool
  - Default: false
  - Description: Include message actions. When true, limited to a single channel.
- includeMeta
  - Type: Bool
  - Default: false
  - Description: Include message meta.
- includeUUID
  - Type: Bool
  - Default: true
  - Description: Include sender user ID.
- includeMessageType
  - Type: Bool
  - Default: true
  - Description: Include PubNub message type.
- includeCustomMessageType
  - Type: Bool
  - Default: false
  - Description: Include custom message type.
- page
  - Type: PubNubBoundedPage?
  - Default: PubNubBoundedPageBase()
  - Description: Pagination bounds. Set limit (max 100 single channel; 25 multiple channels; 25 when includeActions is true).
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request config (transport/session overrides).
- completion
  - Type: ((Result<(messagesByChannel: [String: [PubNubMessage]], next: PubNubBoundedPage?), Error>) -> Void)?
  - Default: nil
  - Description: Async result.

Truncated response:
- If truncated, a next cursor is returned; repeat calls with updated page parameters.

#### Completion handler result

Success:
- A dictionary mapping channels to message arrays, plus next page cursor when available.

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

Failure:
- Error describing the failure.

### Sample code

Reference code (self-contained). Retrieve the last message on a channel:

```
1
  

```

### Other examples

Retrieve messages newer or equal than a given timetoken:

```
1
  

```

Retrieve messages older than a specific timetoken:

```
1
  

```

Retrieve the last 10 messages on channelSwift, otherChannel, and myChannel:

```
1
  

```

Retrieve messages and their metadata:

```
1
  

```

Retrieve messages and their message action data:

```
1
  

```

## Delete messages from history

Requires Message Persistence enabled. Also requires Delete-From-History enabled in key settings and initialization with a secret key.

Removes messages from a specific channel’s history, optionally bounded by start/end timetokens.

### Method(s)

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

Parameters:
- from (required)
  - Type: String
  - Description: Channel to delete messages from.
- start
  - Type: Timetoken?
  - Default: nil
  - Description: Inclusive start timetoken.
- end
  - Type: Timetoken?
  - Default: nil
  - Description: Exclusive end timetoken.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request config.
- completion
  - Type: ((Result<Void, Error>) -> Void)?
  - Default: nil
  - Description: Async result.

#### Completion handler result

Success:
- Void

Failure:
- Error describing the failure.

### Sample code

```
1
  

```

### Other examples

Delete specific message from history:

```
1
  

```

## Message counts

Requires Message Persistence enabled. Returns the number of messages with timetoken ≥ the provided value.

Unlimited message retention note:
- For keys with unlimited retention, counts only include messages from the last 30 days.

### Method(s)

```
`1func messageCounts(  
2    channels: [String: Timetoken],  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((Result[String: Int], Error>) -> Void)?  
5)  
`
```

Parameters:
- channels (required)
  - Type: [String: Timetoken]
  - Description: Map of channels to per-channel timetokens.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request config.
- completion
  - Type: ((Result<[String: Int], Error>) -> Void)?
  - Default: nil
  - Description: Async result.

```
`1func messageCounts(  
2    channels: [String],  
3    timetoken: Timetoken = 1,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((Result[String: Int], Error>) -> Void)?  
6)  
`
```

Parameters:
- channels (required)
  - Type: [String]
  - Description: Channels to get counts for.
- timetoken
  - Type: Timetoken
  - Default: 1
  - Description: Shared timetoken for all channels.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request config.
- completion
  - Type: ((Result<[String: Int], Error>) -> Void)?
  - Default: nil
  - Description: Async result.

#### Completion handler result

Success:
- Dictionary mapping channel to message count.

Failure:
- Error describing the failure.

### Sample code

```
1
  

```

### Other examples

Retrieve message counts for multiple channels with the same timetoken 15526611838554310:

```
1
  

```

Retrieve message counts for multiple channels with different timetokens:

```
1
**
```

Last updated on Sep 3, 2025**