# PubNub Dart SDK – Message Actions (Concise Reference)

Add, remove, and retrieve actions (reactions, receipts, custom metadata) attached to messages.

---

## Add Message Reaction  
*Requires **Mobile Push Notifications** add-on enabled in the Admin Portal.*

### Method
```dart
pubnub.addMessageAction(
  {String type,
  String value,
  String channel,
  Timetoken timetoken,
  Keyset? keyset,
  String? using}
)
```

Parameters  
• `type` (String) – Action type.  
• `value` (String) – Action value.  
• `channel` (String) – Target channel.  
• `timetoken` (Timetoken) – Timetoken of the parent message.  
• `keyset` (Keyset?) – Override default keyset.  
• `using` (String?) – Keyset name from `keysetStore`.

### Sample
```dart
import 'package:pubnub/pubnub.dart';

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
  // addMessageAction call here…
}
```

### Returns
`AddMessageActionResult`  
• `action` (MessageAction)

`MessageAction` fields:  
`type`, `value`, `actionTimetoken`, `messageTimetoken`, `uuid`.

Notes  
• Server does not verify that the parent message exists, but enforces uniqueness of `(type,value)` per message.

---

## Remove Message Reaction  
*Requires **Mobile Push Notifications** add-on.*

### Method
```dart
pubnub.deleteMessageAction(String channel,
      {Timetoken messageTimetoken,
      Timetoken actionTimetoken,
      Keyset? keyset,
      String? using})
```

Parameters  
• `channel` (String) – Channel name.  
• `messageTimetoken` (Timetoken) – Timetoken of the parent message.  
• `actionTimetoken` (Timetoken) – Timetoken of the action to remove.  
• `keyset`, `using` – Same as above.

### Sample
```dart
var result = await pubnub.deleteMessageAction(
    'my_channel', Timetoken(15610547826969050), Timetoken(15610547826969159));
```

### Returns
`DeleteMessageActionResult` (empty payload on success).

---

## Get Message Reactions  
*Requires **Mobile Push Notifications** add-on.*

### Method
```dart
pubnub.fetchMessageActions(
  String channel,
  {Timetoken? from,
  Timetoken? to,
  int? limit,
  Keyset? keyset,
  String? using})
```

Parameters  
• `channel` (String) – Channel to query.  
• `from` (Timetoken?) – Exclusive upper bound (results < `from`).  
• `to` (Timetoken?) – Inclusive lower bound (results ≥ `to`).  
• `limit` (int?) – Max items (default / max = 100).  
• `keyset`, `using` – See above.

### Sample
```dart
var result = await pubnub.fetchMessageActions('my_channel');
```

### Example Response
```json
{
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
    "url": "/v1/actions/sub-c-.../channel/my_channel?start=15610547826970050&end=15645905639093361&limit=2",
    "start": "15610547826970050",
    "end": "15645905639093361"
  }
}
```

### Returns
`FetchMessageActionsResult`  
• `actions` – `List<MessageAction>`  
• `moreActions` – `MoreAction` (pagination)

`MoreAction` fields: `url`, `start`, `limit`.

### Paged Fetch Example
```dart
// Continues fetching until no more pages remain
var allActions = <MessageAction>[];
FetchMessageActionsResult loopResult;
Timetoken? from, to;
int? limit;

do {
  loopResult = await pubnub.fetchMessageActions(
      'my_channel', from: from, to: to, limit: limit);

  allActions.addAll(loopResult.actions);

  if (loopResult.moreActions != null) {
    var more = loopResult.moreActions!;
    from = Timetoken(BigInt.parse(more.start));
    to   = Timetoken(BigInt.parse(more.end));
    limit = more.limit;
  } else {
    break;
  }
} while (true);
```

---

Last updated Jul 15 2025