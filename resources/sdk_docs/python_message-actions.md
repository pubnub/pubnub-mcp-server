On this page
# Message Actions API for Python SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Python SDK:

```
`pubnub.add_message_action() \  
    .channel(String) \  
    .message_action(PNMessageAction) \  
    .pn_async(Function message_action_callback)  
`
```

*  requiredParameterDescription`channel` *Type: StringThe channel name to which to add the message action`message_action` *Type: `PNMessageAction`Message action information`message_action.type` *Type: StringWhat feature this message action represents`message_action.value` *Type: StringValue to be stored along with the message action`message_action.message_timetoken` *Type: IntegerTimetoken of the message to which to add the action`message_action_callback` *Type: FunctionHandles returned data for successful and unsuccessful add message action operations. Details on the callback are [here](#pnmessageaction-callback)

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

```
`import os  
import time  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.message_actions import PNMessageAction  
  
  
def add_message_action(pubnub: PubNub):  
    msg_action = PNMessageAction()  
    msg_action.type = "reaction"  
    msg_action.value = "smiley_face"  
    msg_action.message_timetoken = str(int(time.time()))  
  
    result = pubnub.add_message_action() \  
        .channel("chats.room1") \  
`
```
show all 42 lines
```
`import os  
import time  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.message_actions import PNMessageAction  
  
  
def add_message_action(pubnub: PubNub):  
    msg_action = PNMessageAction()  
    msg_action.type = "reaction"  
    msg_action.value = "smiley_face"  
    msg_action.message_timetoken = str(int(time.time()))  
  
    result = pubnub.add_message_action(  
        channel="chats.room1",  
`
```
show all 42 lines

### Returns[​](#returns)

The `add_message_action()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNAddMessageActionResult`](#pnaddmessageactionresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNAddMessageActionResult[​](#pnaddmessageactionresult)

```
`{  
  'action_timetoken': '15956343330507960',  
  'message_timetoken': '1595634332',  
  'type': 'reaction',  
  'uuid': 'my_uuid',  
  'value': 'smiley_face'  
}  
`
```

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the JavaScript SDK:

```
`pubnub.remove_message_action() \  
    .channel(String) \  
    .action_timetoken(Integer) \  
    .message_timetoken(Integer) \  
    .pn_async(message_action_callback)  
`
```

*  requiredParameterDescription`channel` *Type: StringThe channel name from which to remove the message action`action_timetoken` *Type: IntegerTimetoken of the message action to be removed`message_timetoken` *Type: IntegerTimetoken of the message from which to remove the action`message_action_callback` *Type: FunctionHandles returned data for successful and unsuccessful remove message action operations. Details on the callback are [here](#pnmessageaction-callback)

### Basic Usage[​](#basic-usage-1)

- Builder Pattern
- Named Arguments

```
`pubnub.remove_message_action()\  
    .channel("chats.room1")\  
    .action_timetoken(15956346328442840)\  
    .message_timetoken(1595634632)\  
    .pn_async(message_action_callback)  
`
```

```
`from pubnub.models.consumer.message_actions import PNMessageAction  
  
msg_action = PNMessageAction()  
msg_action.type = "reaction"  
msg_action.value = "smiley_face"  
msg_action.message_timetoken = str(int(time.time()))  
  
pubnub.remove_message_action(channel="chats.room1",  
                             action_timetoken=15956346328442840,  
                             message_timetoken=1595634632) \  
    .pn_async(message_action_callback)  
`
```

### Returns[​](#returns-1)

The `remove_message_action()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNRemoveMessageActionResult`](#pnremovemessageactionresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNRemoveMessageActionResult[​](#pnremovemessageactionresult)

```
`# in case of success (empty object)  
{}  
`
```

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the Python SDK:

```
`pubnub.get_message_actions() \  
  .channel(String) \  
    .start(String) \  
    .end(String) \  
    .limit(Integer) \  
    .pn_async(message_action_callback)  
`
```

*  requiredParameterDescription`channel` *Type: StringThe channel name for which to retrieve the list of message actions`start`Type: StringMessage action timetoken denoting the start of the range requested. Return values will be less than `start`. If not specified, defaults to the current time.`end`Type: StringMessage action timetoken denoting the end of the range requested. Return values will be greater than or equal to `end`. If `start` is specified, `end` must be less than or equal to `start`.`limit`Type: IntegerMaximum number of message actions to return in the response. If the number of results exceeds this limit, the results will include a `more` token. Refer to the [REST API documentation](/docs/sdks/rest-api/get-actions) for details.`message_action_callback` *Type: FunctionHandles returned data for successful and unsuccessful retrieve message action operations. Details on the callback are [here](#pnmessageaction-callback)

### Basic Usage[​](#basic-usage-2)

- Builder Pattern
- Named Arguments

```
`# Retrieve all actions on a single message  
  
pubnub.get_message_actions() \  
    .channel("chats.room1") \  
    .start("15956342921084731") \  
    .end("15956342921084730") \  
    .limit(50) \  
    .pn_async(message_action_callback)  
`
```

```
`  
pubnub.get_message_actions(channel="chats.room1",  
                           start="15956342921084731",  
                           end="15956342921084730",  
                           limit=50) \  
    .pn_async(message_action_callback)  
`
```

### Returns[​](#returns-2)

The `get_message_actions` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetMessageActionsResult`](#pngetmessageactionsresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNGetMessageActionsResult[​](#pngetmessageactionsresult)

```
`{  
  'actions': [  
    {  
      'actionTimetoken': '15956373593404068',  
      'messageTimetoken': '15956342921084730',  
      'type': 'reaction',  
      'uuid': 'my_uuid',  
      'value': 'smiley_face'  
    }  
  ]  
}  
`
```

## PNMessageAction Callback[​](#pnmessageaction-callback)

The structure of a `PNMessageAction` is as follows:

```
`action = PNMessageAction({  
    'uuid': 'user1',  
    'type': 'reaction',  
    'value': 'smiley_face',  
    'actionTimetoken': '15901706735798836',  
    'messageTimetoken': '15901706735795200',  
})  
`
```

The following is a sample `message_action_callback` method you can use as a starting point for your own implementation:

```
`def message_action_callback(envelope, status):**    if status.is_error():  
        print(f"Uh oh. We had a problem sending the message. :( \n {status}")  
        return  
    if isinstance(envelope, PNAddMessageActionResult):  
        print(f"Message Action type: {envelope.type}")  
        print(f"Message Action value: {envelope.value}")  
        print(f"Message Action timetoken: {envelope.message_timetoken}")  
        print(f"Message Action uuid: {envelope.uuid}")  
        print(f"Message Action timetoken: {envelope.action_timetoken}")  
    elif isinstance(envelope, PNRemoveMessageActionResult):  
        # Envelope here is an empty dictionary {}  
        pass  
    elif isinstance(envelope, PNGetMessageActionsResult):  
        print("Message Actions Result:\n")  
`
```
show all 22 linesLast updated on Jun 10, 2025**