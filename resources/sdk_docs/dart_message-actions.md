# Message Actions – PubNub Dart SDK (condensed)

Message Actions let you attach metadata (reactions, receipts, custom data) to any published message.  
Same API is marketed as “Message Reactions” when you only add emoji-style reactions.

⚠ Requires the *Mobile Push Notifications* add-on to be enabled for the keyset.

---

## Add Message Action

Only one `{type,value}` pair is allowed per parent message. The server does **not** verify that the parent message exists, but prevents duplicates.

### Method

```
`pubnub.addMessageAction(  
  {String type,  
  String value,  
  String channel,  
  Timetoken timetoken,  
  Keyset? keyset,  
  String? using}  
)   
`
```

Parameters  
• `type` (String, required) – Action type.  
• `value` (String, required) – Action value.  
• `channel` (String, required) – Channel that contains the parent message.  
• `timetoken` (Timetoken, required) – Timetoken of the parent message.  
• `keyset` (Keyset) – Override default keyset.  
• `using` (String) – Name of keyset from `keysetStore`.

### Example

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
  
  String channel = 'my_channel';  
  Timetoken messageTimetoken = Timetoken(BigInt.from(15610547826969050));  
`
```

### Return

`AddMessageActionResult` → `action` (`MessageAction`):

• `type`, `value`, `actionTimetoken`, `messageTimetoken`, `uuid`.

---

## Remove Message Action

### Method

```
`pubnub.deleteMessageAction(String channel,  
      {Timetoken messageTimetoken,  
      Timetoken actionTimetoken,  
      Keyset? keyset,  
      String? using})  
`
```

Parameters  
• `channel` (String, required) – Channel of the parent message.  
• `messageTimetoken` (Timetoken, required) – Timetoken of the parent message.  
• `actionTimetoken` (Timetoken, required) – Timetoken of the action to delete.  
• `keyset`, `using` – Same as above.

### Example

```
`  var result = await pubnub.deleteMessageAction(  
      'my_channel', Timetoken(15610547826969050), Timetoken(15610547826969159));  
`
```

### Return

`DeleteMessageActionResult` – empty payload.

---

## Get Message Actions

Returns actions in ascending `actionTimetoken` order.

### Method

```
`pubnub.fetchMessageActions(  
  String channel,  
  {Timetoken? from,  
  Timetoken? to,  
  int? limit,  
  Keyset? keyset,  
  String? using})  
`
```

Parameters  
• `channel` (String, required) – Channel name.  
• `from` (Timetoken) – Return actions **< from**.  
• `to` (Timetoken) – Return actions **≥ to**.  
• `limit` (int, default 100, max 100).  
• `keyset`, `using` – As above.

### Example

```
`  var result = await pubnub.fetchMessageActions('my_channel');  
`
```

### Sample Response

```
`{  
  "status": 200,  
  "data": [  
    {  
      "type": "reaction",  
      "value": "smiley_face",  
      "actionTimetoken": "15610547826970050",  
      "messageTimetoken": "15610547826969050",  
      "uuid": "terryterry69420"  
    }  
  ],  
  "more": {  
    "url": "/v1/actions/sub-c-6ba5f838-6456-11e8-9307-eaaa55e2558c/channel/my_channel?start=15610547826970050&end=15645905639093361&limit=2",  
    "start": "15610547826970050",  
    "end": "15645905639093361",  
`
```

### Return

`FetchMessageActionsResult`  
• `actions` (List<MessageAction>) – Properties identical to `MessageAction` above.  
• `moreActions` (MoreAction) – Pagination: `url`, `start`, `limit`.

### Paging Example

```
`// this loop continue fetching message actions when next batch is available**var fetchMessageActionsResult = FetchMessageActionsResult(MessageAction>[]);  
var loopResult, from, to, limit;  
do {  
  loopResult = await pubnub.fetchMessageActions('my_channel',  
      from: from, to: to, limit: limit);  
  
  fetchMessageActionsResult.actions.addAll(loopResult.actions);  
  
  if (loopResult.moreActions != null) {  
    var more = loopResult.moreActions;  
    from = Timetoken(BigInt.parse(more.start));  
    to = Timetoken(BigInt.parse(more.end));  
    limit = more.limit;  
  }  
`
```

_Last updated: Jun 10 2025_