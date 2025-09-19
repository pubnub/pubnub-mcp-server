# Message Actions API – Python SDK

Add, remove, and fetch message actions (reactions, receipts, custom metadata). Message Persistence **must be enabled**.

---

## Request execution

* `operation.sync()` → returns `Envelope(result, status)`
* `operation.pn_async(callback)` → returns `None`, passes `result` and `status` to `callback`.

```python
pubnub.publish()                         \
    .channel("myChannel")                \
    .message("Hello from PubNub Python") \
    .sync()
```

```python
def my_callback(result, status):
    print(f'TT:{result.timetoken}, status:{status.category.name}')

pubnub.publish()                         \
    .channel("myChannel")                \
    .message("Hello from PubNub Python") \
    .pn_async(my_callback)
```

---

## Add Message Reaction  *(add_message_action)*

```python
pubnub.add_message_action()                       \
    .channel(String)                              \
    .message_action(PNMessageAction)              \
    .pn_async(Function message_action_callback)
```

Parameters  
* `channel` (String) – target channel  
* `message_action` (`PNMessageAction`)  
  • `type`  (String) – feature name  
  • `value` (String) – stored value  
  • `message_timetoken` (Integer) – timetoken of target message  
* `message_action_callback` (Function)

Sample – Builder pattern

```python
import os, time
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.models.consumer.message_actions import PNMessageAction

def add_message_action(pubnub: PubNub):
    msg_action = PNMessageAction()
    msg_action.type = "reaction"
    msg_action.value = "smiley_face"
    msg_action.message_timetoken = str(int(time.time()))

    pubnub.add_message_action()           \
        .channel("chats.room1")           \
        .message_action(msg_action)       \
        .pn_async(message_action_callback)
```

Sample – Named arguments

```python
result = pubnub.add_message_action(
            channel="chats.room1",
            message_action=msg_action)
```

Return (`Envelope.result`):

```python
{
  'action_timetoken': '15956343330507960',
  'message_timetoken': '1595634332',
  'type': 'reaction',
  'uuid': 'my_uuid',
  'value': 'smiley_face'
}
```

---

## Remove Message Reaction  *(remove_message_action)*

```python
pubnub.remove_message_action()               \
    .channel(String)                         \
    .action_timetoken(Integer)               \
    .message_timetoken(Integer)              \
    .pn_async(message_action_callback)
```

Parameters  
* `channel` (String) – channel name  
* `action_timetoken` (Integer) – timetoken of action  
* `message_timetoken` (Integer) – timetoken of message  
* `message_action_callback` (Function)

Sample – Builder

```python
pubnub.remove_message_action()               \
    .channel("chats.room1")                  \
    .action_timetoken(15956346328442840)     \
    .message_timetoken(1595634632)           \
    .pn_async(message_action_callback)
```

Sample – Named arguments

```python
from pubnub.models.consumer.message_actions import PNMessageAction
msg_action = PNMessageAction()
msg_action.type = "reaction"
msg_action.value = "smiley_face"
msg_action.message_timetoken = str(int(time.time()))

pubnub.remove_message_action(
        channel="chats.room1",
        action_timetoken=15956346328442840,
        message_timetoken=1595634632)        \
    .pn_async(message_action_callback)
```

Return (`Envelope.result`):

```python
{}  # success
```

---

## Get Message Reactions  *(get_message_actions)*

```python
pubnub.get_message_actions()                \
    .channel(String)                        \
    .start(String)                          \
    .end(String)                            \
    .limit(Integer)                         \
    .pn_async(message_action_callback)
```

Parameters  
* `channel` (String) – channel to query  
* `start` (String, optional) – actions < this timetoken  
* `end` (String, optional) – actions ≥ this timetoken (≤ `start` if provided)  
* `limit` (Integer, optional) – max results (pagination)  
* `message_action_callback` (Function)

Sample – Builder

```python
pubnub.get_message_actions()                \
    .channel("chats.room1")                 \
    .start("15956342921084731")             \
    .end("15956342921084730")               \
    .limit(50)                              \
    .pn_async(message_action_callback)
```

Sample – Named arguments

```python
pubnub.get_message_actions(
        channel="chats.room1",
        start="15956342921084731",
        end="15956342921084730",
        limit=50)                           \
    .pn_async(message_action_callback)
```

Return (`Envelope.result`):

```python
{
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
```

---

## PNMessageAction object

```python
action = PNMessageAction({
    'uuid': 'user1',
    'type': 'reaction',
    'value': 'smiley_face',
    'actionTimetoken': '15901706735798836',
    'messageTimetoken': '15901706735795200',
})
```

### Callback template

```python
def message_action_callback(envelope, status):
    if status.is_error():
        print(f"Error: {status}")
        return
    if isinstance(envelope, PNAddMessageActionResult):
        print(f"Added: {envelope.type} {envelope.value} at {envelope.action_timetoken}")
    elif isinstance(envelope, PNRemoveMessageActionResult):
        pass  # empty dict on success
    elif isinstance(envelope, PNGetMessageActionsResult):
        print("Actions:", envelope.actions)
```

_Last updated: Jul 15 2025_