# Message Persistence API for Dart SDK

Message Persistence provides real-time access to stored, timestamped messages (10 ns precision) across multiple zones/regions. Messages can be encrypted with AES-256. Configure message retention (1 day to Unlimited) in the Admin Portal. You can retrieve messages, message reactions, and files.

## Batch history

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages from multiple channels, optionally including message actions. Control order and pagination with start/end timetokens.

- Search newest-first or oldest-first.
- Page using start OR end timetoken, or slice using both start AND end.
- Limit results with count.
- Limits: up to 100 messages on a single channel; or 25 per channel across max 500 channels. Use start/end to page further.

Start & End usage:
- start only: returns messages older than start.
- end only: returns messages from end and newer.
- both: returns messages between them (inclusive of end).
- You still receive a max of 100 (or 25 with actions/multi-channel). Page by adjusting start.

### Method(s)

To run fetchMessages() use:

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
- channels (required) Type: Set<String> Specifies channels to return history from.
- keyset Type: Keyset Override default keyset.
- using Type: String Keyset name from keysetStore to use.
- count Type: int Number of messages per channel. If includeMessageActions is false: default/max 100; otherwise 25.
- start Type: Timetoken Start of time slice (exclusive). Returned values will be less than start.
- end Type: Timetoken End of time slice (inclusive). Returned values will be greater than or equal to end.
- reverse Type: bool Default false. true traverses oldest-first.
- includeMeta Type: bool Default false. Include message metadata.
- includeMessageActions Type: bool Default false. If true, limited to one channel and returns actions.
- includeMessageType Type: bool Default true. Include message type.
- includeCustomMessageType Type: bool Default false. Include custom message type.
- includeUUID Type: bool Include message sender's UUID.

For more information, refer to Retrieving Messages.

### Sample code

Reference code

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

fetchMessages() returns a map of channels and a List<BatchHistoryResultEntry>:

- channels Type: Map<String, List<BatchHistoryResultEntry>> Map of channels to lists of BatchHistoryResultEntry.

#### BatchHistoryResultEntry

- message Type: dynamic Message content.
- timetoken Type: Timetoken Message timetoken (always returned).
- uuid Type: String Sender UUID.
- actions Type: Map<String, dynamic>? Message actions if includeMessageActions was true; otherwise null.
- messageType Type: MessageType Internal message type.
- customMessageType Type: String? Custom message type or null.
- meta Type: Map<String, dynamic> Message metadata if includeMeta was true; otherwise null.
- error Type: PubNubException? Error if message decryption failed.

### Other examples

#### Paging history Responses

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

Removes messages from a channel’s history.

Required setting: Enable Delete-From-History for the key in Admin Portal. Requires initialization with secret key.

### Method(s)

To deleteMessages() use:

```
`1pubnub.delete()   
`
```

Parameters:
- channels Type: List<String> Channels to delete from.
- start Type: Long Start timetoken (inclusive).
- end Type: Long End timetoken (exclusive).

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

Provide the publish timetoken in End and timetoken +/- 1 in Start. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.

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

Returns the number of messages published on channels since a given time. Count is the number of messages with timetoken >= the provided value in channelsTimetoken.

Unlimited message retention: counts consider only messages from the last 7 days.

### Method(s)

To run messageCounts() use:

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
- channels Type: Map<String, Timetoken> or Set<String> Channel set or map of channel→timetoken.
- keyset Type: Keyset Override default keyset.
- using Type: String Keyset name from keysetStore.
- timetoken Type: Timetoken Required when channels is a Set<String>.

### Sample code

```
`1var result = await pubnub.batch.countMessages({'my_channel'},  
2    timetoken: Timetoken(BigInt.from(13406746780720711)));  
`
```

### Returns

CountMessagesResult:
- channels Map<String, int> Channel names with message count.

## History (deprecated)

Requires Message Persistence enabled.

Fetch historical messages of a channel with ordering and pagination controls.

- Newest-first by default (reverse=false).
- Oldest-first with reverse=true.
- Page with start or end timetoken, or slice with both.
- Limit messages with count.

Start & End usage:
- start only: older than and up to start.
- end only: end and newer.
- both: between them (inclusive of end).
- Max 100 per call; page by adjusting start.

#### Method(s)

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
- order Type: ChannelHistoryOrder Default ChannelHistoryOrder.descending.
- chunkSize Type: int Number of returned messages.

#### Channel history order

- ascending Type: const ChannelHistoryOrder Ascending by timetoken.
- descending Type: const ChannelHistoryOrder Descending by timetoken.
- values Type: const List<ChannelHistoryOrder> Enum values list.

#### Sample code

Retrieve the last 100 messages on a channel:

```
`1var history = pubnub.channel('my_channel').history(chunkSize: 100);  
`
```

#### Returns

history() returns PaginatedChannelHistory:

- chunkSize Type: int Max number of fetched messages when calling more().
- endTimetoken Type: Timetoken Upper boundary of fetched messages.
- hasMore Type: bool True if more messages can be fetched. Before first more call, always true.
- messages Type: List<BaseMessage> Readonly; empty before first more() call.
- order Type: ChannelHistoryOrder Ordering.
- startTimetoken Type: Long Lower boundary of fetched messages.

PaginatedChannelHistory methods:
- more Returns Future<FetchHistoryResult> Fetch more messages; stored in messages.
- reset Returns void Reset to beginning.

#### Base message

- content Type: dynamic Message content.
- message Type: dynamic Alias for content.
- originalMessage Type: dynamic Original JSON message.
- publishedAt Type: Timetoken Server-accepted timetoken.
- timetoken Type: Timetoken Alias for timetoken.

#### Other examples

##### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
`1var history = pubnub  
2    .channel('my_channel')  
3    .history(order: ChannelHistoryOrder.ascending, chunkSize: 3)  
`
```

###### Response

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

##### History paging example

```
`1var history = pubnub.channel('asdf').history(chunkSize: 100, order: ChannelHistoryOrder.descending);**2// To fetch next page:  
3await history.more();  
4// To access messages:  
5print(history.messages);  
`
```