# Message Actions API for Python SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Subscribe to a channel to receive message action events, or fetch past message actions from Message Persistence.

##### Request execution and return values

Operations can be executed synchronously or asynchronously.

`.sync()` returns an `Envelope` with:
- `Envelope.result` (type varies by API)
- `Envelope.status` (type: PnStatus)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes `Envelope.result` and `Envelope.status` to your callback.

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  

```

##### Reactions

"Message Reactions" is a specific use of the Message Actions API for emoji/social reactions.

##### Message Actions vs. Message Reactions

Message Actions is the low-level API for adding metadata (such as read receipts, delivery confirmations, custom data). Message Reactions uses Message Actions specifically for emoji reactions. Same API, different naming based on use case.

## Add message action[​](#add-message-action)

##### Requires Message Persistence

Message Persistence must be enabled for your key in the Admin Portal:
- Enable: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-
- Admin Portal: https://admin.pubnub.com/

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)

```
`1pubnub.add_message_action() \  
2    .channel(String) \  
3    .message_action(PNMessageAction) \  
4    .pn_async(Function message_action_callback)  
`
```

Parameters:
- channel (Type: String) — Channel name for the message action.
- message_action (Type: PNMessageAction) — Payload for the action:
  - message_action.type (Type: String) — Action type.
  - message_action.value (Type: String) — Action value.
  - message_action.message_timetoken (Type: Integer) — Timetoken of the target message.
- message_action_callback (Type: Function) — Callback for success or error.

### Sample code[​](#sample-code)

- Builder Pattern
- Named Arguments

```
1import os  
2import time  
3from pubnub.pnconfiguration import PNConfiguration  
4from pubnub.pubnub import PubNub  
5from pubnub.models.consumer.message_actions import PNMessageAction  
6
  
7
  
8def add_message_action(pubnub: PubNub):  
9    msg_action = PNMessageAction()  
10    msg_action.type = "reaction"  
11    msg_action.value = "smiley_face"  
12    msg_action.message_timetoken = str(int(time.time()))  
13
  
14    result = pubnub.add_message_action() \  
15        .channel("chats.room1") \  
16        .message_action(msg_action) \  
17        .sync()  
18
  
19    if result.status.is_error():  
20        print(f"Error: {result.status.error_data}")  
21    else:  
22        print("Message action added successfully.")  
23        print(f"Response: {result.result.__dict__}")  
24
  
25
  
26def main():  
27    # Configuration for PubNub instance  
28    pn_config = PNConfiguration()  
29    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
30    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
31    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
32
  
33    # Initialize PubNub client  
34    pubnub = PubNub(pn_config)  
35
  
36    # Add message action  
37    add_message_action(pubnub)  
38
  
39  
40if __name__ == "__main__":  
41    main()  
42
  

```

```
1import os  
2import time  
3from pubnub.pnconfiguration import PNConfiguration  
4from pubnub.pubnub import PubNub  
5from pubnub.models.consumer.message_actions import PNMessageAction  
6
  
7
  
8def add_message_action(pubnub: PubNub):  
9    msg_action = PNMessageAction()  
10    msg_action.type = "reaction"  
11    msg_action.value = "smiley_face"  
12    msg_action.message_timetoken = str(int(time.time()))  
13
  
14    result = pubnub.add_message_action(  
15        channel="chats.room1",  
16        message_action=msg_action  
17    ).sync()  
18
  
19    if result.status.is_error():  
20        print(f"Error: {result.status.error_data}")  
21    else:  
22        print("Message action added successfully.")  
23        print(f"Response: {result.result.__dict__}")  
24
  
25
  
26def main():  
27    # Configuration for PubNub instance  
28    pn_config = PNConfiguration()  
29    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
30    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
31    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
32
  
33    # Initialize PubNub client  
34    pubnub = PubNub(pn_config)  
35  
36    # Add message action  
37    add_message_action(pubnub)  
38
  
39  
40if __name__ == "__main__":  
41    main()  
42
  

```

### Returns[​](#returns)

`add_message_action()` returns an `Envelope`:
- result: PNAddMessageActionResult
- status: PNStatus

#### PNAddMessageActionResult[​](#pnaddmessageactionresult)

```
`1{  
2  'action_timetoken': '15956343330507960',  
3  'message_timetoken': '1595634332',  
4  'type': 'reaction',  
5  'uuid': 'my_uuid',  
6  'value': 'smiley_face'  
7}  
`
```

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence

Message Persistence must be enabled for your key in the Admin Portal:
- Enable: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-
- Admin Portal: https://admin.pubnub.com/

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)

```
`1pubnub.remove_message_action() \  
2    .channel(String) \  
3    .action_timetoken(Integer) \  
4    .message_timetoken(Integer) \  
5    .pn_async(message_action_callback)  
`
```

Parameters:
- channel (Type: String) — Channel name.
- action_timetoken (Type: Integer) — Timetoken of the message action to remove.
- message_timetoken (Type: Integer) — Timetoken of the target message.
- message_action_callback (Type: Function) — Callback for success or error.

### Sample code[​](#sample-code-1)

- Builder Pattern
- Named Arguments

```
`1pubnub.remove_message_action()\  
2    .channel("chats.room1")\  
3    .action_timetoken(15956346328442840)\  
4    .message_timetoken(1595634632)\  
5    .pn_async(message_action_callback)  
`
```

```
1from pubnub.models.consumer.message_actions import PNMessageAction  
2
  
3msg_action = PNMessageAction()  
4msg_action.type = "reaction"  
5msg_action.value = "smiley_face"  
6msg_action.message_timetoken = str(int(time.time()))  
7
  
8pubnub.remove_message_action(channel="chats.room1",  
9                             action_timetoken=15956346328442840,  
10                             message_timetoken=1595634632) \  
11    .pn_async(message_action_callback)  

```

### Returns[​](#returns-1)

`remove_message_action()` returns an `Envelope`:
- result: PNRemoveMessageActionResult
- status: PNStatus

#### PNRemoveMessageActionResult[​](#pnremovemessageactionresult)

```
`1# in case of success (empty object)  
2{}  
`
```

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence

Message Persistence must be enabled for your key in the Admin Portal:
- Enable: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-
- Admin Portal: https://admin.pubnub.com/

Get a list of message actions in a channel, sorted by action timetoken (ascending).

### Method(s)[​](#methods-2)

```
`1pubnub.get_message_actions() \  
2  .channel(String) \  
3    .start(String) \  
4    .end(String) \  
5    .limit(Integer) \  
6    .pn_async(message_action_callback)  
`
```

Parameters:
- channel (Type: String) — Channel to list actions for.
- start (Type: String) — Message action timetoken for start of range (exclusive).
- end (Type: String) — Message action timetoken for end of range (inclusive).
- limit (Type: Integer) — Max actions to return. If exceeded, results include a more token. See REST API: /docs/sdks/rest-api/get-actions
- message_action_callback (Type: Function) — Callback for success or error.

### Sample code[​](#sample-code-2)

- Builder Pattern
- Named Arguments

```
1# Retrieve all actions on a single message  
2
  
3pubnub.get_message_actions() \  
4    .channel("chats.room1") \  
5    .start("15956342921084731") \  
6    .end("15956342921084730") \  
7    .limit(50) \  
8    .pn_async(message_action_callback)  

```

```
1
  
2pubnub.get_message_actions(channel="chats.room1",  
3                           start="15956342921084731",  
4                           end="15956342921084730",  
5                           limit=50) \  
6    .pn_async(message_action_callback)  

```

### Returns[​](#returns-2)

`get_message_actions` returns an `Envelope`:
- result: PNGetMessageActionsResult
- status: PNStatus

#### PNGetMessageActionsResult[​](#pngetmessageactionsresult)

```
`1{  
2  'actions': [  
3    {  
4      'actionTimetoken': '15956373593404068',  
5      'messageTimetoken': '15956342921084730',  
6      'type': 'reaction',  
7      'uuid': 'my_uuid',  
8      'value': 'smiley_face'  
9    }  
10  ]  
11}  
`
```

## PNMessageAction[​](#pnmessageaction)

Structure:

```
`1action = PNMessageAction({  
2    'uuid': 'user1',  
3    'type': 'reaction',  
4    'value': 'smiley_face',  
5    'actionTimetoken': '15901706735798836',  
6    'messageTimetoken': '15901706735795200',  
7})  
`
```

Sample `message_action_callback`:

```
`1def message_action_callback(envelope, status):**2    if status.is_error():  
3        print(f"Uh oh. We had a problem sending the message. :( \n {status}")  
4        return  
5    if isinstance(envelope, PNAddMessageActionResult):  
6        print(f"Message Action type: {envelope.type}")  
7        print(f"Message Action value: {envelope.value}")  
8        print(f"Message Action timetoken: {envelope.message_timetoken}")  
9        print(f"Message Action uuid: {envelope.uuid}")  
10        print(f"Message Action timetoken: {envelope.action_timetoken}")  
11    elif isinstance(envelope, PNRemoveMessageActionResult):  
12        # Envelope here is an empty dictionary {}  
13        pass  
14    elif isinstance(envelope, PNGetMessageActionsResult):  
15        print("Message Actions Result:\n")  
16        for action in envelope.actions:  
17            print(f"Message Action type: {action.type}")  
18            print(f"Message Action value: {action.value}")  
19            print(f"Message Action timetoken: {action.message_timetoken}")  
20            print(f"Message Action uuid: {action.uuid}")  
21            print(f"Message Action timetoken: {action.action_timetoken}")  
22            print("")  
`
```