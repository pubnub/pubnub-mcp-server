# Message Persistence API for Dart SDK

Message Persistence provides real-time, timestamped (10 ns) storage across multiple AZs/regions with optional AES-256 encryption. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve messages, message reactions, and files.

## Batch history

Requires Message Persistence enabled in the Admin Portal.

Fetch historical messages from multiple channels. Supports paging, ordering, and inclusion of actions, meta, UUID, and message types. Returns up to 100 messages on a single channel, or 25 per channel across up to 500 channels. Use start/end to paginate.

Start/End usage:
- Only start: returns messages older than start.
- Only end: returns messages from end and newer.
- Both: returns messages between start and end (inclusive of end).
- You still receive a max of 100 (or 25 with actions); paginate with start for more.

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
- channels (required) Type: Set<String>. Channels to return history from.
- keyset Type: Keyset. Override default keyset.
- using Type: String. Keyset name from keysetStore.
- count Type: int. Per-channel message count. Default/max 100 without actions; 25 with actions.
- start Type: Timetoken. Start of range (exclusive).
- end Type: Timetoken. End of range (inclusive).
- reverse Type: bool. Default false. If true, oldest first.
- includeMeta Type: bool. Default false. Include message metadata.
- includeMessageActions Type: bool. Default false. If true, limited to one channel.
- includeMessageType Type: bool. Default true. Include internal message type.
- includeCustomMessageType Type: bool. Default false. Include custom message type.
- includeUUID Type: bool. Include sender UUID.

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
- channels Type: Map<String, List<BatchHistoryResultEntry>>. Map of channels to entries.

#### BatchHistoryResultEntry

- message Type: dynamic. Message content.
- timetoken Type: Timetoken. Always returned.
- uuid Type: String. Sender UUID.
- actions Type: Map<String, dynamic>? Message actions if included; otherwise null.
- messageType Type: MessageType. Internal type.
- customMessageType Type: String? Custom type or null.
- meta Type: Map<String, dynamic>. Metadata if included; otherwise null.
- error Type: PubNubException? Decryption error per-message.

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

Requires Message Persistence enabled. You must enable “Delete-From-History” in key settings and initialize with a secret key.

Removes messages from a specific channel’s history.

### Method(s)

```
`1pubnub.delete()   
`
```

Parameters:
- channels Type: List<String>. Channels to delete from.
- start Type: Long. Start timetoken (inclusive).
- end Type: Long. End timetoken (exclusive).

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

Use the message’s publish timetoken as End, and Start = End - 1 (or +1) to target the single message.

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

Requires Message Persistence enabled. For Unlimited retention keys, counts only consider messages from the last 7 days.

Returns the number of messages published on channels since a given timetoken (greater than or equal to the provided timetoken).

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
- channels Type: Map<String, Timetoken> or Set<String>. Channel set or map of channel->timetoken.
- keyset Type: Keyset. Override default keyset.
- using Type: String. Keyset name from keysetStore.
- timetoken Type: Timetoken. Required when channels is a Set.

### Sample code

```
`1var result = await pubnub.batch.countMessages({'my_channel'},  
2    timetoken: Timetoken(BigInt.from(13406746780720711)));  
`
```

### Returns

- channels Type: Map<String, int>. Channel names with message count.

## History (deprecated)

Requires Message Persistence enabled.

Fetches historical messages of a channel with paging and order controls. Prefer batch history where possible.

Start/End usage:
- Only start: messages older than and up to start.
- Only end: messages at end and newer.
- Both: between start and end (end inclusive).
- Max 100 per call; paginate for more.

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
- order Type: ChannelHistoryOrder. Default ChannelHistoryOrder.descending.
- chunkSize Type: int. Number of returned messages.

#### Channel history order

- ascending Type: const ChannelHistoryOrder. Ascending by timetoken.
- descending Type: const ChannelHistoryOrder. Descending by timetoken.
- values Type: const List<ChannelHistoryOrder>. Enum values.

#### Sample code

Retrieve the last 100 messages on a channel:

```
`1var history = pubnub.channel('my_channel').history(chunkSize: 100);  
`
```

#### Returns

PaginatedChannelHistory:
- chunkSize Type: int. Max messages per more().
- endTimetoken Type: Timetoken. Upper boundary of fetched timetokens.
- hasMore Type: bool. True if more messages can be fetched.
- messages Type: List<BaseMessage>. Empty before first more() call.
- order Type: ChannelHistoryOrder. Order used.
- startTimetoken Type: Long. Lower boundary of fetched timetokens.

Methods:
- more Returns: Future<FetchHistoryResult>. Fetches more; appends to messages.
- reset Returns: void. Resets to beginning.

#### Base message

- content Type: dynamic. Message content.
- message Type: dynamic. Alias for content.
- originalMessage Type: dynamic. Original JSON payload.
- publishedAt Type: Timetoken. Server accept time.
- timetoken Type: Timetoken. Alias for publishedAt.

#### Other examples

##### Use history() to retrieve the three oldest messages

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