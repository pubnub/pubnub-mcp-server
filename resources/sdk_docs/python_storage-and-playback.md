# Message Persistence API – Python SDK (Storage & Playback)

Message Persistence stores every published message (optionally AES-256 encrypted) for the retention period configured on your key (1 day – Unlimited). The Python SDK exposes three active APIs—Fetch History, Delete Messages, and Message Counts—and one deprecated API (History).

All operations can be executed:
```python
# synchronous – returns Envelope(result, status)
pubnub.publish().channel("myChannel").message("Hi").sync()

# asynchronous – result & status passed to your callback
def cb(result, status): print(result, status)
pubnub.publish().channel("myChannel").message("Hi").pn_async(cb)
```

---

## Fetch History  `pubnub.fetch_messages()`

Requires Message Persistence to be enabled.

```python
pubnub.fetch_messages() \
    .channels(List) \                       # ≤ 500 channels
    .maximum_per_channel(Integer) \         # 1–100 (25 if actions or multi-ch)
    .start(Integer) \                       # exclusive
    .end(Integer) \                         # inclusive
    .include_message_actions(Boolean) \     # True = actions + single channel
    .include_meta(Boolean) \
    .include_message_type(Boolean) \
    .include_custom_message_type(Boolean) \
    .include_uuid(Boolean)
```

Parameters  
• `channels`* – list of channel names  
• `maximum_per_channel` – defaults: 25 (with actions / multi-channel) or 100 (single channel)  
• `start`, `end` – timetoken range (see rules above)  
• `include_*` booleans – add extra data to the response  

### Basic Usage
```python
import os
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

def my_fetch_messages_callback(envelope, status):
    if status.is_error():
        print(f"Error: {status.error_data}")
        return
    print("Fetch Messages Result:\n")
    for message in envelope.channels["my_channel"]:
        print("Message: %s" % message.message)
        print("Meta: %s" % message.meta)
        print("Timetoken: %s" % message.timetoken)
```
```python
message_envelope = pubnub.fetch_messages(
    channels=["my_channel"],
    maximum_per_channel=1,
    include_message_actions=True,
    include_meta=True,
    include_message_type=True,
    include_custom_message_type=True,
    include_uuid=True
).sync()

if message_envelope.status.is_error():
    print(f"Error: {status.error_data}")
else:
    print("Fetch Messages Result:\n")
    for message in message_envelope.result.channels["my_channel"]:
        print(f"Message: {message.message}")
        print(f"Meta: {message.meta}")
        print(f"Timetoken: {message.timetoken}")

        for action_type in message.actions:
            print(f"Message Action type: {action_type}")
            for action_value in message.actions[action_type]:
                ...
```

### Returns
`Envelope.result` ⇒ `PNFetchMessagesResult`  
• `channels` dict[str, PNFetchMessageItem]  
• `start_timetoken`, `end_timetoken`  

`PNFetchMessageItem` fields: `message`, `meta`, `message_type`, `custom_message_type`, `uuid`, `timetoken`, `actions`

---

## Delete Messages from History  `pubnub.delete_messages()`

Requires: Message Persistence enabled + “Enable Delete-From-History” checked + secret key.

```python
pubnub.delete_messages() \
    .channel(String) \
    .start(Integer) \   # inclusive
    .end(Integer) \     # exclusive
    .sync()
```

Parameters  
• `channel`* – single channel  
• `start`, `end` – timetoken range to delete  

### Basic Usage
```python
envelope = PubNub(pnconf).delete_messages() \
    .channel("my-ch") \
    .start(123) \
    .end(456) \
    .sync()
```
```python
envelope = pubnub.delete_messages(
    channels=["my_channel"], start=123, end=456
).sync()
```

#### Delete a specific message
Use `publish_timetoken` as `end` and `publish_timetoken-1` as `start`.
```python
envelope = PubNub(pnconf).delete_messages() \
    .channel("my-ch") \
    .start(15526611838554309) \
    .end(15526611838554310) \
    .sync()
```
```python
envelope = pubnub.delete_messages(
    channels="my-ch",
    start=15526611838554309,
    end=15526611838554310
).sync()
```

(No return payload.)

---

## Message Counts  `pubnub.message_counts()`

Counts messages published since each provided timetoken (last 30 days if unlimited retention).

```python
pn.message_counts() \
    .channel(String) \                   # single or comma-separated list
    .channel_timetokens(List)            # matches channel order
```

### Basic Usage
```python
envelope = pn.message_counts() \
    .channel('unique_1') \
    .channel_timetokens([15510391957007182]) \
    .sync()
print(envelope.result.channels['unique_1'])
```
```python
envelope = pubnub.message_counts(
    channels="my-ch",
    channel_timetokens=[15510391957007182]
).sync()
```

### Returns
`Envelope.result` ⇒ `PNMessageCountResult`  
• `channels` dict[channel → count]

#### Multiple channels
```python
envelope = pn.message_counts() \
    .channel('unique_1,unique_100') \
    .channel_timetokens([15510391957007182, 15510391957007184]) \
    .sync()
print(envelope.result.channels)
```
```python
envelope = pubnub.message_counts(
    channels="unique_1,unique_100",
    channel_timetokens=[15510391957007182, 15510391957007184]
).sync()
```

---

## History (Deprecated)  `pubnub.history()`

Use `fetch_messages()` instead. Still available:

```python
pubnub.history() \
    .channel(String) \                     # required
    .include_meta(Boolean) \               # default False
    .reverse(Boolean) \                    # default False
    .include_timetoken(Boolean) \          # default False
    .start(Integer) \                      # exclusive
    .end(Integer) \                        # inclusive
    .count(Integer)                        # ≤ 100
```

### Basic Usage
```python
envelope = pubnub.history() \
    .channel("history_channel") \
    .count(100) \
    .sync()
```

### Returns
`PNHistoryResult`  
• `messages` list[PNHistoryItemResult]  
• `start_timetoken`, `end_timetoken`

`PNHistoryItemResult`: `entry`, `timetoken`

### Additional Examples
Retrieve oldest three messages:
```python
envelope = pubnub.history() \
    .channel("my_channel") \
    .count(3) \
    .reverse(True) \
    .sync()
```
```json
{
  end_timetoken: 13406746729185766,
  start_timetoken: 13406746780720711,
  messages: [
    {entry:'Pub1'}, {entry:'Pub2'}, {entry:'Pub2'}
  ]
}
```

Retrieve newer than timetoken:
```python
pubnub.history()\
    .channel("my_channel")\
    .start(13847168620721752)\
    .reverse(True)\
    .sync()
```

Retrieve until timetoken:
```python
pubnub.history()\
    .channel("my_channel")\
    .count(100)\
    .start(-1)\
    .end(13847168819178600)\
    .reverse(True)\
    .sync()
```

History paging helper:
```python
def get_all_messages(start_tt):
    def history_callback(result, status):
        msgs = result.messages
        start = result.start_timetoken
        if len(msgs) == 100:
            get_all_messages(start)
```

Include timetoken in response:
```python
pubnub.history()\
    .channel("my_channel")\
    .count(100)\
    .include_timetoken()\
    .sync()
```

---

Last updated  Jun 10 2025