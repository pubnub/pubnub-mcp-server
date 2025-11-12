# Message Actions API for Python SDK

Use Message Actions to add or remove metadata (for example, receipts or reactions) on published messages. Message actions are delivered to subscribers and can be fetched from Message Persistence.

##### Request execution and return values

You can execute operations synchronously or asynchronously.

`.sync()` returns an `Envelope` with `Envelope.result` (type varies by API) and `Envelope.status` (`PnStatus`).

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and invokes your callback with `Envelope.result` and `Envelope.status`.

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

Message Reactions are a specific use of Message Actions for emoji/social reactions. The underlying API is the same.

## Add message action

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)

```
`1pubnub.add_message_action() \  
2    .channel(String) \  
3    .message_action(PNMessageAction) \  
4    .pn_async(Function message_action_callback)  
`
```

Parameters:
- channel (String) – Channel name to add the message action to.
- message_action (PNMessageAction) – Message action payload:
  - message_action.type (String) – Action type.
  - message_action.value (String) – Action value.
  - message_action.message_timetoken (Integer) – Timetoken of the target message.
- message_action_callback (Function) – Callback for success or error (see PNMessageAction callback).

### Sample code

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

### Returns

`add_message_action()` returns an `Envelope`:
- result: PNAddMessageActionResult
- status: PNStatus

#### PNAddMessageActionResult

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

## Remove message action

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)

```
`1pubnub.remove_message_action() \  
2    .channel(String) \  
3    .action_timetoken(Integer) \  
4    .message_timetoken(Integer) \  
5    .pn_async(message_action_callback)  
`
```

Parameters:
- channel (String) – Channel name to remove the message action from.
- action_timetoken (Integer) – Timetoken of the message action to remove.
- message_timetoken (Integer) – Timetoken of the target message.
- message_action_callback (Function) – Callback for success or error (see PNMessageAction callback).

### Sample code

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

### Returns

`remove_message_action()` returns an `Envelope`:
- result: PNRemoveMessageActionResult
- status: PNStatus

#### PNRemoveMessageActionResult

```
`1# in case of success (empty object)  
2{}  
`
```

## Get message actions

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal.

Get a list of message actions in a channel. Actions are sorted by action timetoken in ascending order.

### Method(s)

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
- channel (String) – Channel name to list message actions for.
- start (String) – Action timetoken for the start of the range (exclusive).
- end (String) – Action timetoken for the end of the range (inclusive).
- limit (Integer) – Max number of actions to return; if exceeded, results include a more token (see REST API docs).
- message_action_callback (Function) – Callback for success or error (see PNMessageAction callback).

### Sample code

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

### Returns

`get_message_actions` returns an `Envelope`:
- result: PNGetMessageActionsResult
- status: PNStatus

#### PNGetMessageActionsResult

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

## PNMessageAction

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

Callback template:

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