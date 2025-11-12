# Message Actions API for Dart SDK

Use Message Actions to add/remove metadata (receipts, reactions) on published messages. Subscribe to channels to receive action events, and fetch historical actions from Message Persistence.

- Reactions: Using Message Actions specifically for emoji/social reactions.
- Message Actions vs. Reactions: Same underlying API; “Message Reactions” is a use-case term for emoji reactions.

## Add message action

Requires Message Persistence: Enable in the Admin Portal (https://admin.pubnub.com/) per https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

Adds a message action to a parent message identified by subscribeKey, channel, and timetoken.
- Server does not validate if the parent message exists.
- Only one action with a given type and value can exist per parent message.

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
- type (String, required): Message action type.
- value (String, required): Message action value.
- channel (String, required): Channel name.
- timetoken (Timetoken, required): Timetoken of the target message.
- keyset (Keyset, optional): Override the default keyset configuration.
- using (String, optional): Keyset name from keysetStore to use.

### Sample code

Reference code:
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
- action (MessageAction): The added message action.

MessageAction fields:
- type (String): Message action type.
- value (String): Message action value.
- actionTimetoken (String): Timetoken assigned to the added message action.
- messageTimetoken (String): Timetoken of the target message.
- uuid (String): UUID of the sender.

## Remove message action

Requires Message Persistence: Enable in the Admin Portal (https://admin.pubnub.com/) per https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

Removes a previously added action from a published message. Response is empty.

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
- channel (String, required): Channel the message was sent to.
- messageTimetoken (Timetoken, required): Timetoken of the target message.
- actionTimetoken (Timetoken, required): Timetoken of the message action to remove.
- keyset (Keyset, optional): Override the default keyset configuration.
- using (String, optional): Keyset name from keysetStore to use.

### Sample code
```
`1  var result = await pubnub.deleteMessageAction(  
2      'my_channel', Timetoken(15610547826969050), Timetoken(15610547826969159));  
`
```

### Returns

deleteMessageAction() returns DeleteMessageActionResult without actionable data.

## Get message actions

Requires Message Persistence: Enable in the Admin Portal (https://admin.pubnub.com/) per https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

Lists message actions in a channel, sorted by action timetoken ascending.

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
- channel (String, required): Channel name to list actions for.
- from (Timetoken, optional): Start of range (exclusive), by action timetoken.
- to (Timetoken, optional): End of range (inclusive), by action timetoken.
- limit (int, optional, default 100, max 100): Maximum number of actions to return.
- keyset (Keyset, optional): Override the default keyset configuration.
- using (String, optional): Keyset name from keysetStore to use.

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
- actions (List<MessageAction>): List of message actions.
- moreActions (MoreAction): Pagination info.

MessageAction fields:
- type (String), value (String), actionTimetoken (String), messageTimetoken (String), uuid (String).

MoreAction fields:
- url (String): URL for the next page.
- start (String): Start timetoken for the next page.
- limit (int): Limit for the next page.

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