# Message Persistence API for Swift Native SDK

Message Persistence provides real-time access to stored messages, timestamped to ~10 ns and replicated across regions. You can enable AES-256 encryption for stored messages. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (using the File Sharing API)

## Fetch history

Requires Message Persistence to be enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Ordering and range:
- start only: returns messages older than start.
- end only: returns messages from end and newer.
- start and end: returns messages between them (inclusive of end).

Limits and paging:
- Up to 100 messages from a single channel, or 25 per channel across up to 500 channels.
- Page by iteratively updating the start timetoken.

### Method(s)

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

Parameters:
- for [String] (required): Channels to fetch from. Max 500 channels.
- includeActions Bool = false: If true, includes Message Actions. When true, limited to a single channel.
- includeMeta Bool = false: If true, includes message meta.
- includeUUID Bool = true: If true, includes sender user ID.
- includeMessageType Bool = true: Include PubNub message type. See Retrieving Messages.
- includeCustomMessageType Bool = false: Include custom message type. See Retrieving Messages.
- page PubNubBoundedPage? = PubNubBoundedPageBase(): Paging and limits. limit max: 100 (single channel), 25 (multiple channels), and 25 when includeActions is true.
- custom PubNub.RequestConfiguration = PubNub.RequestConfiguration(): Per-request configuration override.
- completion ((Result<(messagesByChannel: [String: [PubNubMessage]], next: PubNubBoundedPage?), Error>) -> Void)? = nil

Truncated response:
- If truncated, a next page cursor is returned. Make iterative calls adjusting parameters.

#### Completion handler result

Success:
- Dictionary of channels mapped to message lists and a next page cursor (when available).

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

Reference code

Retrieve the last message on a channel:

```
1
  
```

### Other examples

#### Retrieve messages newer or equal than a given timetoken

```
1
  
```

#### Retrieve messages older than a specific timetoken

```
1
  
```

#### Retrieve the last 10 messages on channelSwift, otherChannel, and myChannel

```
1
  
```

#### Retrieve messages and their metadata

```
1
  
```

#### Retrieve messages and their message action data

```
1
  
```

## Delete messages from history

Requires Message Persistence to be enabled for your key in the Admin Portal.

Removes messages from the history of a specific channel.

Required setting:
- Enable Delete-From-History in key settings and initialize with a secret key.

### Method(s)

To Delete Messages from History use:

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
- from String (required): Channel to delete from.
- start Timetoken? = nil: Start of time slice (inclusive).
- end Timetoken? = nil: End of time slice (exclusive).
- custom PubNub.RequestConfiguration = PubNub.RequestConfiguration(): Per-request configuration override.
- completion ((Result<Void, Error>) -> Void)? = nil

#### Completion handler result

Success:
- Void indicating success.

Failure:
- Error describing the failure.

### Sample code

```
1
  
```

### Other examples

#### Delete specific message from history

```
1
  
```

## Message counts

Requires Message Persistence to be enabled for your key in the Admin Portal.

Returns the number of messages published since a given timetoken (counts messages with timetoken ≥ provided value).

Unlimited message retention:
- For keys with unlimited retention, this method considers only messages published in the last 30 days.

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
- channels [String: Timetoken] (required): Map of channels to timetokens.
- custom PubNub.RequestConfiguration = PubNub.RequestConfiguration(): Per-request configuration override.
- completion ((Result<[String: Int], Error>) -> Void)? = nil

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
- channels [String] (required): Channels to get counts for.
- timetoken Timetoken = 1: Timetoken used for all channels.
- custom PubNub.RequestConfiguration = PubNub.RequestConfiguration(): Per-request configuration override.
- completion ((Result<[String: Int], Error>) -> Void)? = nil

#### Completion handler result

Success:
- Dictionary of channels mapped to their message count.

Failure:
- Error describing the failure.

### Sample code

```
1
  
```

### Other examples

#### Retrieve message counts for multiple channels with the same timetoken 15526611838554310

```
1
  
```

#### Retrieve message counts for multiple channels with different timetokens

```
1
**
```