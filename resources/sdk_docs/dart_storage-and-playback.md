# Message Persistence API for Dart SDK

Message Persistence gives real-time access to stored, timestamped messages. Data is replicated across availability zones and can be encrypted with AES-256. Retention policy options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Batch history

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from multiple channels; optionally include message actions. Control ordering and range:
- Search newest-first or oldest-first.
- Page with start OR end timetoken.
- Retrieve a slice by providing both start AND end.
- Limit results with count.

Limits: up to 100 messages on a single channel, or 25 per channel across up to 500 channels. Use start/end to page.

Start & End parameter usage:
- Only start: returns messages older than start.
- Only end: returns messages from end and newer.
- Both: returns messages between start and end (inclusive of end).
- Max 100 (or 25 for multiple channels) per call; paginate with iterative calls adjusting start.

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

Parameters
- required channels Type: Set<String> Default: n/a — Channels to return history messages from.
- keyset Type: Keyset Default: n/a — Override for the PubNub default keyset.
- using Type: String Default: n/a — Keyset name from keysetStore for this call.
- count Type: int Default: n/a — Number of messages to return per channel. If includeMessageActions is false, default/maximum is 100; otherwise 25.
- start Type: Timetoken Default: n/a — Start of range (exclusive).
- end Type: Timetoken Default: n/a — End of range (inclusive).
- reverse Type: bool Default: false — true starts with oldest first.
- includeMeta Type: bool Default: false — Include message metadata.
- includeMessageActions Type: bool Default: false — If true, retrieves messages with actions; limited to one channel only.
- includeMessageType Type: bool Default: true — Include message type.
- includeCustomMessageType Type: bool Default: false — Include custom message type. For more information, refer to Retrieving Messages.
- includeUUID Type: bool Default: n/a — Include message sender UUID.

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

Property Description
- channels Type: Map<String, List<BatchHistoryResultEntry>> — Map of channels to lists of BatchHistoryResultEntry.

#### BatchHistoryResultEntry

Method Description
- message Type: dynamic — Message content.
- timetoken Type: Timetoken — Timetoken of the message. Always returned by default.
- uuid Type: String — Sender UUID.
- actions Type: Map<String, dynamic>? — Message actions if includeMessageActions=true; otherwise null.
- messageType Type: MessageType — Internal message type.
- customMessageType Type: String? — Custom type of the message; null if empty.
- meta Type: Map<String, dynamic> — Message metadata if includeMeta=true; otherwise null.
- error Type: PubNubException? — Exception if decryption failed for the message.

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

Requires Message Persistence enabled for your key in the Admin Portal.

Removes messages from a channel’s history.

Required setting: In the Admin Portal, enable “Delete-From-History” for the key. Requires initialization with secret key.

### Method(s)

To deleteMessages() use:

```
`1pubnub.delete()   
`
```

Parameters
- channels Type: List<String> — Channels to delete messages from.
- start Type: Long — Start timetoken (inclusive).
- end Type: Long — End timetoken (exclusive).

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

Pass the publish timetoken in End and timetoken +/- 1 in Start.

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

Requires Message Persistence enabled for your key in the Admin Portal.

Returns the number of messages on one or more channels since a given time. Count is for history messages with timetoken >= the provided value in channelsTimetoken.

Unlimited message retention: For keys with unlimited retention enabled, this method counts only messages from the last 7 days.

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

Parameters
- channels Type: Map<String, Timetoken> or Set<String> — Either a set of channels, or a map of channel to timetoken.
- keyset Type: Keyset — Override default keyset.
- using Type: String — Keyset name from keysetStore.
- timetoken Type: Timetoken — Required when channels is a Set of channel names.

### Sample code

```
`1var result = await pubnub.batch.countMessages({'my_channel'},  
2    timetoken: Timetoken(BigInt.from(13406746780720711)));  
`
```

### Returns

Returns a CountMessagesResult:

Property Name Type Description
- channels Map<String, int> — Channel names with message count.

## History (deprecated)

Requires Message Persistence enabled for your key in the Admin Portal.

Fetches historical messages of a channel with ordering, paging, and count limits.

Start & End parameter usage:
- Only start: messages older than and up to start.
- Only end: messages matching end and newer.
- Both: messages between start and end (end inclusive).
- Max 100 per call; paginate by adjusting start.

#### Method(s)

To run history() use:

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

Parameters
- order Type: ChannelHistoryOrder Default: ChannelHistoryOrder.descending — Order based on timetoken.
- chunkSize Type: int Default: false — Number of returned messages.

#### Channel history order

Parameter Description
- ascending Type: const ChannelHistoryOrder — Ascending order by timetoken.
- descending Type: const ChannelHistoryOrder — Descending order by timetoken.
- values Type: const List<ChannelHistoryOrder> — List of enum values.

#### Sample code

Retrieve the last 100 messages on a channel:

```
`1var history = pubnub.channel('my_channel').history(chunkSize: 100);  
`
```

#### Returns

history() returns a PaginatedChannelHistory with:

Property Description
- chunkSize Type: int — Max number of fetched messages when calling more().
- endTimetoken Type: Timetoken — Upper boundary of fetched messages’ timetokens.
- hasMore Type: bool — True if there are more messages to fetch. Before the first more call, always true.
- messages Type: List<BaseMessage> — Readonly list of messages; empty before first more call.
- order Type: ChannelHistoryOrder — Order of messages based on timetoken.
- startTimetoken Type: Long — Lower boundary of fetched messages’ timetokens.

PaginatedChannelHistory methods:
- more Returns: Future<FetchHistoryResult> — Fetches more messages and stores them in messages.
- reset Returns: void — Resets the history to the beginning.

#### Base message

Parameter Description
- content Type: dynamic — Message content.
- message Type: dynamic — Alias for content.
- originalMessage Type: dynamic — Original JSON message from server.
- publishedAt Type: Timetoken — Server-accepted timetoken.
- timetoken Type: Timetoken — Alias for timetoken.

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

Last updated on Jul 15, 2025**