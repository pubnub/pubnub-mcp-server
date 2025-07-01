On this page
# Message Actions API for Dart SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This method adds a message action to a parent message. Parent message is a normal message identified by a combination of `subscribeKey`, `channel` and `timetoken`. Returns the added reaction in the response.

##### Parent message existence

Server doesn't validate if the parent message exists at the time of adding the message action. It does, however, check if you haven't already added this particular action to the parent message.

For a given parent message, there can be only one message action with `type` and `value`.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Dart SDK:

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

*  requiredParameterDescription`type` *Type: StringType of message action.`value` *Type: StringValue of message action.`channel` *Type: StringSpecifies channel name to `publish` message actions to.`timetoken` *Type: TimetokenThe publish timetoken of a parent message.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Channel and message details  
  String channel = 'my_channel';  
  Timetoken messageTimetoken = Timetoken(BigInt.from(15610547826969050));  
`
```
show all 27 lines

### Returns[​](#returns)

The `addMessageAction()` operation returns a `AddMessageActionResult` which contains the following property:

Property NameTypeDescription`action``MessageAction`Added message action.

The `MessageAction` object contains the following properties:

Property NameTypeDescription`type`StringType of message action.`value`StringValue of message action.`actionTimetoken`StringTimetoken assigned to added message action.`messageTimetoken`StringTimetoken of message.`uuid`StringUUID of sender.

## Remove Message Action[​](#remove-message-action)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the Dart SDK:

```
`pubnub.deleteMessageAction(String channel,  
      {Timetoken messageTimetoken,  
      Timetoken actionTimetoken,  
      Keyset? keyset,  
      String? using})  
`
```

*  requiredParameterDescription`channel` *Type: StringChannel the message was sent to.`messageTimetoken` *Type: `Timetoken`Publish timetoken of the original message.`actionTimetoken` *Type: `Timetoken`Publish timetoken of the message action to be removed.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-1)

```
`  var result = await pubnub.deleteMessageAction(  
      'my_channel', Timetoken(15610547826969050), Timetoken(15610547826969159));  
`
```

### Returns[​](#returns-1)

The `deleteMessageAction()` operation  returns a `DeleteMessageActionResult` which does not have actionable data.

## Get Message Actions[​](#get-message-actions)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the Dart SDK:

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

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe `channel` name.`from`Type: TimetokenDefault:  
n/aMessage Action `timetoken` denoting the start of the range requested (return values will be less than `from`).`to`Type: TimetokenDefault:  
n/aMessage Action `timetoken` denoting the end of the range requested (return values will be greater than or equal to `to`).`limit`Type: intDefault:  
100Specifies the number of actions to return in response. Default/Maximum is `100`.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-2)

```
`  var result = await pubnub.fetchMessageActions('my_channel');  
`
```

### Response[​](#response)

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
show all 19 lines

### Returns[​](#returns-2)

The `fetchMessageActions()` operation returns a list of `FetchMessageActionsResult` object containing following properties:

Property NameTypeDescription`actions``List<MessageAction>`List of message actions.`moreActions``MoreAction`Pagination information.

The `MessageAction` has following properties:

Property NameTypeDescription`type`StringType of message action.`value`StringValue of message action.`actionTimetoken`StringTimetoken assigned to added message action.`messageTimetoken`StringTimetoken of message.`uuid`StringUUID of sender.

The `MoreAction` has following properties:

Property NameTypeDescription`url`StringURL to fetch next page of message actions.`start`StringStart timetoken value for next page.`limit`intLimit count for next page.

### Other Examples[​](#other-examples)

#### Fetch message actions with paging[​](#fetch-message-actions-with-paging)

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
show all 17 linesLast updated on Jun 10, 2025**