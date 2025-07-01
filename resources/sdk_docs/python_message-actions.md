# Message Actions API – PubNub Python SDK

Requirements  
• Message Persistence must be enabled on the key.  
• All operations can be run either synchronously (`.sync()`) or asynchronously (`.pn_async(cb)`).

```python
# Sync
env = pubnub.publish().channel("ch").message("hi").sync()
# Async
def cb(res, status): pass
pubnub.publish().channel("ch").message("hi").pn_async(cb)
```

---

## Add Message Action

```python
pubnub.add_message_action()            \
       .channel(str)                   \
       .message_action(PNMessageAction)\
       .pn_async(cb)
```

Named-argument form:

```python
pubnub.add_message_action(
        channel="chats.room1",
        message_action=PNMessageAction(
            type="reaction",
            value="smiley_face",
            message_timetoken="15956342921084730")
).pn_async(cb)
```

Parameters  
• `channel` (str) – channel to add the action to  
• `message_action` (PNMessageAction) –  
  • `type` (str) – feature name (“reaction”, “receipt”, …)  
  • `value` (str) – data to store  
  • `message_timetoken` (int/str) – target message TT  
• `cb` – callback (see PNMessageAction Callback)

Returns `Envelope`  
• `result` → `PNAddMessageActionResult`  
• `status` → `PNStatus`

`PNAddMessageActionResult` example:

```json
{
  "action_timetoken": "15956343330507960",
  "message_timetoken": "1595634332",
  "type": "reaction",
  "uuid": "my_uuid",
  "value": "smiley_face"
}
```

---

## Remove Message Action

```python
pubnub.remove_message_action() \
       .channel(str)           \
       .action_timetoken(int)  \
       .message_timetoken(int) \
       .pn_async(cb)
```

Named-argument form:

```python
pubnub.remove_message_action(
        channel="chats.room1",
        action_timetoken=15956346328442840,
        message_timetoken=1595634632
).pn_async(cb)
```

Parameters  
• `channel` (str) – channel containing the action  
• `action_timetoken` (int) – TT of the action to remove  
• `message_timetoken` (int) – TT of the parent message  
• `cb` – callback

Returns `Envelope` (`result` is empty `{}` on success).

---

## Get Message Actions

```python
pubnub.get_message_actions() \
       .channel(str)         \
       .start(str)           \  # optional
       .end(str)             \  # optional
       .limit(int)           \  # optional
       .pn_async(cb)
```

Named-argument form:

```python
pubnub.get_message_actions(
        channel="chats.room1",
        start="15956342921084731",
        end="15956342921084730",
        limit=50
).pn_async(cb)
```

Parameters  
• `channel` (str) – channel to query  
• `start` (str) – return actions **< start** (default: now)  
• `end` (str) – return actions **≥ end** (must be ≤ `start` if given)  
• `limit` (int) – max actions; may return `more` token  
• `cb` – callback

Returns `Envelope`  
• `result` → `PNGetMessageActionsResult`

```json
{
  "actions": [{
      "actionTimetoken": "15956373593404068",
      "messageTimetoken": "15956342921084730",
      "type": "reaction",
      "uuid": "my_uuid",
      "value": "smiley_face"
  }]
}
```

---

## PNMessageAction structure

```python
action = PNMessageAction({
    "uuid": "user1",
    "type": "reaction",
    "value": "smiley_face",
    "actionTimetoken": "15901706735798836",
    "messageTimetoken": "15901706735795200",
})
```

---

## Sample Callback

```python
from pubnub.models.consumer.message_actions import (
    PNAddMessageActionResult,
    PNRemoveMessageActionResult,
    PNGetMessageActionsResult,
)

def message_action_callback(envelope, status):
    if status.is_error():
        print("Error:", status)
        return

    if isinstance(envelope, PNAddMessageActionResult):
        print("Added:", envelope.type, envelope.value)
    elif isinstance(envelope, PNRemoveMessageActionResult):
        print("Removed OK")
    elif isinstance(envelope, PNGetMessageActionsResult):
        print("Fetched actions:", envelope.actions)
```

_Last updated Jun 10 2025_