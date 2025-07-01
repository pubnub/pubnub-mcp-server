# PubNub Dart SDK – Storage & Playback (Message Persistence)

Message Persistence must be enabled for your key in the Admin Portal.  
Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.  
All timetokens are 17-digit values (10 ns resolution).

---

## 1. Batch History – `fetchMessages()`

```dart
pubnub.batch.fetchMessages(
  Set<String> channels,                // required
  { Keyset?    keyset,
    String?    using,
    int?       count,
    Timetoken? start,
    Timetoken? end,
    bool?      reverse,
    bool?      includeMeta,
    bool       includeMessageActions = false,
    bool       includeMessageType   = true,
    bool?      includeCustomMessageType,
    bool       includeUUID          = true }
)
```

Parameter summary  
• `channels` Set<String> – channels to fetch (25 per channel & 500 channels max; 1 channel if `includeMessageActions = true`).  
• `count` int – max msgs per channel (100 or 25 with actions).  
• `start` / `end` Timetoken – page window (`start` exclusive, `end` inclusive).  
• `reverse` bool – `true` = oldest → newest.  
• `includeMeta`, `includeMessageActions`, `includeMessageType`, `includeCustomMessageType`, `includeUUID` – toggles for extra fields.

### Basic usage – last 25 messages

```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey:  'demo',
      userId:      UserId('myUniqueUserId'),
    ),
  );

  Set<String> channels = {'my_channel'};
  var result = await pubnub.batch.fetchMessages(channels, count: 25);
  print(result.channels['my_channel']);
}
```

### Paging example

```dart
var messages = <BatchHistoryResultEntry>[];
var channel  = 'my_channel';
BatchHistoryResult? loopResult;
Timetoken? start;
int? count;

do {
  loopResult = await pubnub.batch.fetchMessages({channel}, start: start, count: count);
  messages.addAll(loopResult.channels[channel]!);

  if (loopResult.more != null) {
    var more = loopResult.more as MoreHistory;
    start = Timetoken(BigInt.parse(more.start));
    count = more.count;
  }
} while (loopResult.more != null);
```

### Return type

`Map<String, List<BatchHistoryResultEntry>>` where each entry contains:  
`message`, `timetoken`, `uuid`, `actions`, `messageType`, `customMessageType`, `meta`, `error`.

---

## 2. Delete Messages – `delete()`

Enable **Delete-From-History** in the Admin Portal and initialize the SDK with a secret key.

```dart
pubnub.delete()   // internal helper

// Practical call:
await pubnub
  .channel('channel-name')
  .messages(
    from: Timetoken(BigInt.parse('123345')),      // start inclusive
    to:   Timetoken(BigInt.parse('123538293')),   // end exclusive
  )
  .delete();
```

### Delete a single message

```dart
await pubnub
  .channel('channel-name')
  .messages(
    from: Timetoken(BigInt.parse('15526611838554309')), // publishTT - 1
    to:   Timetoken(BigInt.parse('15526611838554310')), // publishTT
  )
  .delete();
```

---

## 3. Message Counts – `countMessages()`

```dart
pubnub.batch.countMessages(
  dynamic channels,                // Set<String> OR Map<String,Timetoken>
  { Keyset?    keyset,
    String?    using,
    Timetoken? timetoken }          // required when channels is Set
)
```

Returns `CountMessagesResult` → `Map<String, int>` (channel → message count).

Example:

```dart
var result = await pubnub.batch.countMessages(
  {'my_channel'},
  timetoken: Timetoken(BigInt.from(13406746780720711)),
);
print(result.channels['my_channel']);
```

(With unlimited retention, only the last 7 days are counted.)

---

## 4. History (Deprecated)

Prefer `fetchMessages()`; legacy helpers remain:

```dart
// Fetch paginated history on a single channel
var history = pubnub.channel('my_channel').history(
  order:     ChannelHistoryOrder.descending,  // newest→oldest by default
  chunkSize: 100                              // max per page
);

// Equivalent fluent API
pubnub.channel('my_channel').messages();
```

`PaginatedChannelHistory` fields: `messages`, `chunkSize`, `order`, `startTimetoken`, `endTimetoken`, `hasMore`; methods: `Future more()`, `void reset()`.

### Example – three oldest messages

```dart
var history = pubnub
    .channel('my_channel')
    .history(order: ChannelHistoryOrder.ascending, chunkSize: 3);
await history.more();
print(history.messages);
```

### Paging

```dart
var history = pubnub.channel('asdf').history(
  chunkSize: 100,
  order:     ChannelHistoryOrder.descending,
);

await history.more();          // next page
print(history.messages);
```

---

Last updated: Jun 10 2025