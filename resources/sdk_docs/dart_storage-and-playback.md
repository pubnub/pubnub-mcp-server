# Message Persistence API – Dart SDK (Storage & Playback)

Message Persistence lets you store and retrieve messages, reactions, and files. Retention is configurable (1 day – Unlimited). AES-256 encryption is supported.

---

## Batch History (`fetchMessages`)

Requires Message Persistence enabled.

Maximum per request  
• 1 channel: 100 messages  
• ≤500 channels: 25 messages/channel  

Paging: use `start`, `end`, and `count`.  
Timetoken rules  
• `start` only ⇒ older than `start`  
• `end` only ⇒ `end` and newer  
• both ⇒ between (inclusive `end`)

### Method

```
`pubnub.batch.fetchMessages(  
  SetString> channels,  
  {Keyset? keyset,  
  String? using,  
  int? count,  
  Timetoken? start,  
  Timetoken? end,  
  bool? reverse,  
  bool? includeMeta,  
  bool includeMessageActions = false,  
  bool includeMessageType = true,  
  bool includeCustomMessageType,  
  bool includeUUID = true}  
)   
`
```

Parameters  
• channels (Set<String>) – required  
• keyset (Keyset) – override default keyset  
• using (String) – keyset name from `keysetStore`  
• count (int) – per-channel message limit (≤100 or 25)  
• start/end (Timetoken) – time range  
• reverse (bool, default false) – oldest-first order  
• includeMeta (bool, default false) – include message `meta`  
• includeMessageActions (bool, default false) – include actions (single channel only)  
• includeMessageType (bool, default true) – include internal type  
• includeCustomMessageType (bool, default false) – include custom type  
• includeUUID (bool, default true) – include sender UUID

### Sample

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  SetString> channels = {'my_channel'};  
  
`
```

### Paging Example

```
`  var messages = BatchHistoryResultEntry>[];  
  var channel = 'my_channel';  
  var loopResult, start, count;  
  do {  
    loopResult =  
        await pubnub.batch.fetchMessages({channel}, start: start, count: count);  
  
    messages.addAll((loopResult as BatchHistoryResult).channels[channel]!);  
  
    if ((loopResult).more != null) {  
      var more = loopResult.more as MoreHistory;  
      start = Timetoken(BigInt.parse(more.start));  
      count = more.count;  
    }  
  } while (loopResult.more != null);  
`
```

### Returns

`Map<String, List<BatchHistoryResultEntry>>`  
Each `BatchHistoryResultEntry` contains: `message`, `timetoken`, `uuid`, `actions`, `messageType`, `customMessageType`, `meta`, `error`.

---

## Delete Messages (`delete`)

Requires Message Persistence + “Enable Delete-From-History” (Admin Portal). Requires secret key.

### Method

```
`pubnub.delete()   
`
```

Parameters  
• channels (List<String>) – target channels  
• start (Long) – inclusive lower bound  
• end (Long) – exclusive upper bound

### Sample

```
`await pubnub  
  .channel('channel-name')  
  .messages(  
    from: Timetoken(BigInt.parse('123345')),  
    to: Timetoken(BigInt.parse('123538293')),  
  )  
  .delete();  
`
```

Delete a single message (publish timetoken = 15526611838554310):

```
`await pubnub  
  .channel('channel-name')  
  .messages(  
    from: Timetoken(BigInt.parse('15526611838554309')),  
    to: Timetoken(BigInt.parse('15526611838554310')),  
  )  
  .delete();  
`
```

---

## Message Counts (`countMessages`)

Requires Message Persistence. For unlimited retention keys, counts cover last 7 days.

### Method

```
`pubnub.batch.countMessages(  
  dynamic channels,  
  {Keyset? keyset,   
  String? using,   
  Timetoken? timetoken}  
)  
`
```

Parameters  
• channels – `Map<String, Timetoken>` or `Set<String>`  
• keyset – override default  
• using – keyset name  
• timetoken – required if `channels` is a set

### Sample

```
`var result = await pubnub.batch.countMessages({'my_channel'},  
    timetoken: Timetoken(BigInt.from(13406746780720711)));  
`
```

Returns: `CountMessagesResult.channels` (`Map<String,int>`)

---

## History (Deprecated)

Legacy, single-channel history. Use `fetchMessages` instead.

### Method

```
`pubnub.channel(String).history(  
  {ChannelHistoryOrder order = ChannelHistoryOrder.descending,  
  int chunkSize = 100}  
)  
  
// OR  
  
pubnub.channel(String).messages()  
`
```

Parameters  
• order – `ascending` | `descending` (default)  
• chunkSize (int, ≤100)

### Samples

Retrieve last 100:

```
`var history = pubnub.channel('my_channel').history(chunkSize: 100);  
`
```

Oldest 3 messages:

```
`var history = pubnub  
    .channel('my_channel')  
    .history(order: ChannelHistoryOrder.ascending, chunkSize: 3)  
`
```

Response:

```
`{  
    "messages":[  
        { "Timetoken": 0, "message": "Pub1" },  
        { "Timetoken": 0, "message": "Pub2" },  
        { "Timetoken": 0, "message": "Pub3" }  
    ],  
`
```

Paging:

```
`var history = pubnub.channel('asdf').history(chunkSize: 100, order: ChannelHistoryOrder.descending);**// To fetch next page:  
await history.more();  
// To access messages:  
print(history.messages);  
`
```

`PaginatedChannelHistory` exposes `messages`, `more()`, `reset()`, `hasMore`, `startTimetoken`, `endTimetoken`, `chunkSize`, `order`.

---

Last updated Jul 15 2025