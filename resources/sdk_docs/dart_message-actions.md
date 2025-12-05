# Message Actions API for Dart SDK

Use message actions to add/remove metadata (for example, receipts or emoji reactions) on published messages. Clients can subscribe to channels to receive action events and fetch past actions from Message Persistence.

- Message Actions: Low-level API for arbitrary metadata (read receipts, delivery confirmations, custom data).
- Message Reactions: Using Message Actions specifically for emoji/social reactions (same API, different term).

Requires Message Persistence: Enable for your key in the Admin Portal as described in the support article.

## Add message action

Add a message action to a parent message (identified by subscribeKey, channel, and timetoken). Only one action with the same type and value can exist per parent message. The server doesn’t validate the parent message existence but does prevent duplicates.

### Method(s)

Use this Dart method:

```
`1pubnub.addMessageAction(  
2  {String type,  
3  String value,  
4  String channel,  
5  Timetoken timetoken,  
6  Keyset? keyset,  
7  String? using}  
8)   
`
```

Parameters:
- type — Type: String — Message action type. Required.
- value — Type: String — Message action value. Required.
- channel — Type: String — Channel to add the action to. Required.
- timetoken — Type: Timetoken — Timetoken of the target message. Required.
- keyset — Type: Keyset — Override default keyset.
- using — Type: String — Keyset name from keysetStore.

### Sample code

Reference code

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Channel and message details  
14  String channel = 'my_channel';  
15  Timetoken messageTimetoken = Timetoken(BigInt.from(15610547826969050));  
16
  
17  // Add a message action  
18  var result = await pubnub.addMessageAction(  
19    type: 'reaction',  
20    value: 'smiley',  
21    channel: channel,  
22    timetoken: messageTimetoken,  
23  );  
24
  
25  // Print the added message action details  
26  print('Added message action: ${result.action}');  
27}  
```

### Returns

addMessageAction() returns AddMessageActionResult:
- action — MessageAction — Added message action.

MessageAction fields:
- type — String — Action type.
- value — String — Action value.
- actionTimetoken — String — Timetoken assigned to the added action.
- messageTimetoken — String — Timetoken of the target message.
- uuid — String — UUID of the sender.

## Remove message action

Remove a previously added action from a published message. Response is empty.

### Method(s)

Use this Dart method:

```
`1pubnub.deleteMessageAction(String channel,  
2      {Timetoken messageTimetoken,  
3      Timetoken actionTimetoken,  
4      Keyset? keyset,  
5      String? using})  
`
```

Parameters:
- channel — Type: String — Channel where the message was sent. Required.
- messageTimetoken — Type: Timetoken — Timetoken of the target message. Required.
- actionTimetoken — Type: Timetoken — Timetoken of the action to remove. Required.
- keyset — Type: Keyset — Override default keyset.
- using — Type: String — Keyset name from keysetStore.

### Sample code

```
`1  var result = await pubnub.deleteMessageAction(  
2      'my_channel', Timetoken(15610547826969050), Timetoken(15610547826969159));  
`
```

### Returns

deleteMessageAction() returns DeleteMessageActionResult (no actionable data).

## Get message actions

Fetch a list of message actions in a channel. Sorted by action timetoken (ascending).

### Method(s)

Use this Dart method:

```
`1pubnub.fetchMessageActions(  
2  String channel,  
3  {Timetoken? from,  
4  Timetoken? to,  
5  int? limit,  
6  Keyset? keyset,  
7  String? using})  
`
```

Parameters:
- channel — Type: String — Channel to list actions for. Required.
- from — Type: Timetoken — Start of range (exclusive).
- to — Type: Timetoken — End of range (inclusive).
- limit — Type: int — Max actions to return. Default/Max: 100.
- keyset — Type: Keyset — Override default keyset.
- using — Type: String — Keyset name from keysetStore.

### Sample code

```
`1  var result = await pubnub.fetchMessageActions('my_channel');  
`
```

### Response

```
`1{  
2  "status": 200,  
3  "data": [  
4    {  
5      "type": "reaction",  
6      "value": "smiley_face",  
7      "actionTimetoken": "15610547826970050",  
8      "messageTimetoken": "15610547826969050",  
9      "uuid": "terryterry69420"  
10    }  
11  ],  
12  "more": {  
13    "url": "/v1/actions/sub-c-6ba5f838-6456-11e8-9307-eaaa55e2558c/channel/my_channel?start=15610547826970050&end=15645905639093361&limit=2",  
14    "start": "15610547826970050",  
15    "end": "15645905639093361",  
16    "limit": 2  
17  }  
18}  
`
```

### Returns

fetchMessageActions() returns a list of FetchMessageActionsResult:
- actions — List<MessageAction> — Message actions.
- moreActions — MoreAction — Pagination info.

MessageAction fields:
- type — String — Action type.
- value — String — Action value.
- actionTimetoken — String — Timetoken assigned to the added action.
- messageTimetoken — String — Timetoken of the target message.
- uuid — String — UUID of the sender.

MoreAction fields:
- url — String — URL to fetch next page.
- start — String — Start timetoken for next page.
- end — String — End timetoken for next page.
- limit — int — Page limit.

### Other examples

#### Fetch message actions with paging

```
1// this loop continues fetching message actions when the next batch is available  
2var fetchMessageActionsResult = FetchMessageActionsResult(MessageAction>[]);  
3var loopResult, from, to, limit;  
4do {  
5  loopResult = await pubnub.fetchMessageActions('my_channel',  
6      from: from, to: to, limit: limit);  
7
  
8  fetchMessageActionsResult.actions.addAll(loopResult.actions);  
9
**10  if (loopResult.moreActions != null) {  
11    var more = loopResult.moreActions;  
12    from = Timetoken(BigInt.parse(more.start));  
13    to = Timetoken(BigInt.parse(more.end));  
14    limit = more.limit;  
15  }  
16} while (loopResult.moreActions != null);  
17// now `fetchMessageActionsResult` contains all message actions  
```