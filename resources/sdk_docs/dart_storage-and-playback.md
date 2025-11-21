# Message Persistence API for Dart SDK

Message Persistence provides real-time access to stored messages (timestamped to 10 ns) across multiple regions with optional AES-256 encryption. Storage duration is controlled by your retention policy: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Batch history

Requires Message Persistence (enable in Admin Portal).

Fetches historical messages from multiple channels. You can:
- Search from newest or oldest end (reverse).
- Page using start or end timetoken.
- Retrieve a slice using both start and end.
- Limit results using count.

Limits:
- Up to 100 messages on a single channel.
- Up to 25 per channel across a maximum of 500 channels when includeMessageActions is true.
- Use start and end to page through further results.

Start & End parameter usage:
- Only start: returns messages older than start (values < start).
- Only end: returns messages from end and newer (values >= end).
- Both: returns between start and end (inclusive of end).
- You will still receive a maximum per request; page using start to traverse all matching messages.

### Method(s)

```
`1pubnub.batch.fetchMessages(  
2  SetString> channels,  
3  {Keyset? keyset,  
4  String? using,  
5  int? count,  
6  Timetoken? start,  
7  Timetoken? end,  
8  bool? reverse,  
9  bool? includeMeta,  
10  bool includeMessageActions = false,  
11  bool includeMessageType = true,  
12  bool includeCustomMessageType,  
13  bool includeUUID = true}  
14)   
`
```

Parameters:
- channels (Set<String>) required: Channels to fetch history from.
- keyset (Keyset): Override default keyset.
- using (String): Keyset name from keysetStore to use.
- count (int): Messages per channel. If includeMessageActions is false, default and max is 100; otherwise 25.
- start (Timetoken): Start of range (exclusive). Return values will be less than start.
- end (Timetoken): End of range (inclusive). Return values will be greater than or equal to end.
- reverse (bool, default false): true to traverse oldest first.
- includeMeta (bool, default false): Include message metadata.
- includeMessageActions (bool, default false): Include message actions. If true, limited to one channel.
- includeMessageType (bool, default true): Include internal message type.
- includeCustomMessageType (bool, default false): Include custom message type.
- includeUUID (bool): Include sender UUID.

For more information, refer to Retrieving Messages.

### Sample code

Retrieve the last 25 messages on a channel:

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create a PubNub instance with the default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Channels to fetch history from  
14  SetString> channels = {'my_channel'};  
15
  
16  try {  
17    // Fetch the last 25 messages  
18    var result = await pubnub.batch.fetchMessages(channels, count: 25);  
19
  
20    // Print the fetched messages  
21    result.channels.forEach((channel, messages) {  
22      print('Channel: $channel');  
23      for (var entry in messages) {  
24        print('Message: ${entry.message}, Timetoken: ${entry.timetoken}');  
25      }  
26    });  
27  } catch (e) {  
28    print('Error fetching message history: $e');  
29  }  
30}  

```

### Returns

fetchMessages() returns:
- channels (Map<String, List<BatchHistoryResultEntry>>): Map of channels to entries.

BatchHistoryResultEntry:
- message (dynamic): Message content.
- timetoken (Timetoken): Message timetoken.
- uuid (String): Sender UUID.
- actions (Map<String, dynamic>?): Message actions when includeMessageActions is true; otherwise null.
- messageType (MessageType): Internal message type.
- customMessageType (String?): Custom message type; null if not set.
- meta (Map<String, dynamic>): Message metadata when includeMeta is true; otherwise null.
- error (PubNubException?): Decryption error for the message, if any.

### Other examples

Paging history Responses

```
1  var messages = BatchHistoryResultEntry>[];  
2  var channel = 'my_channel';  
3  var loopResult, start, count;  
4  do {  
5    loopResult =  
6        await pubnub.batch.fetchMessages({channel}, start: start, count: count);  
7
  
8    messages.addAll((loopResult as BatchHistoryResult).channels[channel]!);  
9
  
10    if ((loopResult).more != null) {  
11      var more = loopResult.more as MoreHistory;  
12      start = Timetoken(BigInt.parse(more.start));  
13      count = more.count;  
14    }  
15  } while (loopResult.more != null);  

```

## Delete messages from history

Requires Message Persistence (enable in Admin Portal).

Removes messages from a specific channel’s history.

Required setting:
- In Admin Portal, enable “Delete-From-History” for your key.
- Requires initialization with secret key.

### Method(s)

```
`1pubnub.delete()   
`
```

Parameters:
- channels (List<String>): Channels to delete from.
- start (Long): Start timetoken (inclusive).
- end (Long): End timetoken (exclusive).

### Sample code

```
`1await pubnub  
2  .channel('channel-name')  
3  .messages(  
4    from: Timetoken(BigInt.parse('123345')),  
5    to: Timetoken(BigInt.parse('123538293')),  
6  )  
7  .delete();  
`
```

### Other examples

#### Delete specific message from history

Use the publish timetoken in End and timetoken +/- 1 in Start.

```
`1await pubnub  
2  .channel('channel-name')  
3  .messages(  
4    from: Timetoken(BigInt.parse('15526611838554309')),  
5    to: Timetoken(BigInt.parse('15526611838554310')),  
6  )  
7  .delete();  
`
```

## Message counts

Requires Message Persistence (enable in Admin Portal).

Returns the number of messages published on one or more channels since a given time. Count includes messages with timetoken >= the provided value.

Unlimited message retention:
- For keys with unlimited retention, counts include only messages from the last 7 days.

### Method(s)

```
`1pubnub.batch.countMessages(  
2  dynamic channels,  
3  {Keyset? keyset,   
4  String? using,   
5  Timetoken? timetoken}  
6)  
`
```

Parameters:
- channels (Map<String, Timetoken> or Set<String>): Set of channels, or a map of channel to timetoken.
- keyset (Keyset): Override default keyset.
- using (String): Keyset name from keysetStore.
- timetoken (Timetoken): Required when channels is a Set.

### Sample code

```
`1var result = await pubnub.batch.countMessages({'my_channel'},  
2    timetoken: Timetoken(BigInt.from(13406746780720711)));  
`
```

### Returns

CountMessagesResult:
- channels (Map<String, int>): Channel names to message counts.

## History (deprecated)

Requires Message Persistence (enable in Admin Portal).

Fetches historical messages of a channel with ordering and pagination controls.

Start & End parameter usage:
- Only start: messages older than and up to start.
- Only end: messages from end and newer.
- Both: between start and end (inclusive on end).
- Max 100 messages per call; iterate by adjusting start to page.

### Method(s)

```
1pubnub.channel(String).history(  
2  {ChannelHistoryOrder order = ChannelHistoryOrder.descending,  
3  int chunkSize = 100}  
4)  
5
  
6// OR  
7
  
8pubnub.channel(String).messages()  

```

Parameters:
- order (ChannelHistoryOrder, default ChannelHistoryOrder.descending): Message order by timetoken.
- chunkSize (int): Number of returned messages.

Channel history order:
- ascending: Ascending by timetoken.
- descending: Descending by timetoken.
- values: Constant list of enum values.

### Sample code

Retrieve the last 100 messages on a channel:

```
`1var history = pubnub.channel('my_channel').history(chunkSize: 100);  
`
```

### Returns

PaginatedChannelHistory:
- chunkSize (int): Max messages fetched per more().
- endTimetoken (Timetoken): Upper boundary of fetched timetokens.
- hasMore (bool): True if more messages are available. Before first more call, always true.
- messages (List<BaseMessage>): Messages; empty before first more call.
- order (ChannelHistoryOrder): Order used.
- startTimetoken (Long): Lower boundary of fetched timetokens.

Methods:
- more -> Future<FetchHistoryResult>: Fetch more messages and store in messages.
- reset -> void: Reset history to the beginning.

Base message:
- content (dynamic): Message content.
- message (dynamic): Alias for content.
- originalMessage (dynamic): Original JSON message from server.
- publishedAt (Timetoken): Server acceptance timetoken.
- timetoken (Timetoken): Alias.

### Other examples

Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
`1var history = pubnub  
2    .channel('my_channel')  
3    .history(order: ChannelHistoryOrder.ascending, chunkSize: 3)  
`
```

Response

```
`1{  
2    "messages":[  
3        {  
4            "Timetoken": 0,  
5            "message": "Pub1"  
6        },  
7        {  
8            "Timetoken": 0,  
9            "message": "Pub2"  
10        },  
11        {  
12            "Timetoken": 0,  
13            "message": "Pub3"  
14        }  
15    ],  
16    "startTimeToken": 13406746729185766,  
17    "endTimeToken": 13406746780720711  
18}  
`
```

History paging example

```
`1var history = pubnub.channel('asdf').history(chunkSize: 100, order: ChannelHistoryOrder.descending);**2// To fetch next page:  
3await history.more();  
4// To access messages:  
5print(history.messages);  
`
```