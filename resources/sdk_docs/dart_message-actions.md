# Message Actions API for Dart SDK

Use Message Actions to add/remove metadata on published messages (receipts, reactions). Subscribe to channels to receive action events. Fetch past actions from Message Persistence, on demand or with messages.

- Reactions: Using Message Actions for emoji/social reactions.
- Message Actions vs. Message Reactions: Same API; “Message Reactions” refers to the emoji use case.

Requires Message Persistence for all operations. Enable in the Admin Portal: https://admin.pubnub.com/ (support: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

## Add message action

Adds a message action to a parent message identified by subscribeKey, channel, and timetoken. Only one action per (type, value) per message. Server does not validate if the parent message exists; it only checks duplicates.

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
- type (String) — Message action type.
- value (String) — Message action value.
- channel (String) — Channel name to add the message action to.
- timetoken (Timetoken) — Timetoken of the target message.
- keyset (Keyset) — Optional override of default keyset.
- using (String) — Keyset name from keysetStore.

### Sample code

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
- action (MessageAction) — The added action.

MessageAction fields:
- type (String)
- value (String)
- actionTimetoken (String)
- messageTimetoken (String)
- uuid (String)

## Remove message action

Removes a previously added action from a message. Response is empty.

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
- channel (String) — Channel the message was sent to.
- messageTimetoken (Timetoken) — Timetoken of the target message.
- actionTimetoken (Timetoken) — Timetoken of the action to remove.
- keyset (Keyset) — Optional override of default keyset.
- using (String) — Keyset name from keysetStore.

### Sample code

```
`1  var result = await pubnub.deleteMessageAction(  
2      'my_channel', Timetoken(15610547826969050), Timetoken(15610547826969159));  
`
```

### Returns

deleteMessageAction() returns DeleteMessageActionResult with no actionable data.

## Get message actions

Fetches a list of message actions in a channel, sorted by action timetoken (ascending).

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
- channel (String) — Channel name to list message actions for.
- from (Timetoken) — Start action timetoken (exclusive).
- to (Timetoken) — End action timetoken (inclusive).
- limit (int) — Max actions to return. Default/Max: 100.
- keyset (Keyset) — Optional override of default keyset.
- using (String) — Keyset name from keysetStore.

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

fetchMessageActions() returns FetchMessageActionsResult:
- actions (List<MessageAction>) — List of message actions.
- moreActions (MoreAction) — Pagination info.

MessageAction fields:
- type (String)
- value (String)
- actionTimetoken (String)
- messageTimetoken (String)
- uuid (String)

MoreAction fields:
- url (String) — URL for next page.
- start (String) — Start timetoken for next page.
- end (String) — End timetoken for next page.
- limit (int) — Page size.

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