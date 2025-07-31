# Message Persistence API – Python SDK (Storage & Playback)

Message Persistence retains all published messages with 10-ns resolution across multiple regions.  
Retention per key: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.  
Optional AES-256 encryption in transit and at rest.

## Request execution

Sync vs. async:

```
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
```

```
def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
```

`.sync()` → `Envelope(result, status)`   `.pn_async()` → callback(result, status)

---

## Fetch History  (recommended)

Requires Message Persistence to be enabled.

```
pubnub.fetch_messages() \  
    .channels(List) \  
    .maximum_per_channel(Integer) \  
    .start(Integer) \  
    .end(Integer) \  
    .include_message_actions(Boolean) \  
    .include_meta(Boolean)  
    .include_message_type(Boolean) \  
    .include_custom_message_type(Boolean) \  
    .include_uuid(Boolean) \  
```

Parameters  
• **channels** List[str] — required, ≤ 500  
• **maximum_per_channel** int — default 100 (25 if multiple channels, or if message actions requested)  
• **start** int — exclusive start timetoken  
• **end** int — inclusive end timetoken  
• **include_message_actions** bool (default False)  
• **include_meta** bool (default False)  
• **include_message_type**, **include_custom_message_type**, **include_uuid** bool  

Timetoken usage  
• Only `start` → messages < start  
• Only `end`   → messages ≥ end  
• Both         → start < msg ≤ end  
Max 100 msgs (single) / 25 msgs (multi); paginate with successive calls.

Example callbacks:

```
import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
  
def my_fetch_messages_callback(envelope, status):  
    if status.is_error():  
        print(f"Something went wrong. Error: {status.error_data}")  
        return  
  
    print("Fetch Messages Result:\n")  
    for message in envelope.channels["my_channel"]:  
        print("Message: %s" % message.message)  
        print("Meta: %s" % message.meta)  
        print("Timetoken: %s" % message.timetoken)  
```

```
message_envelope = pubnub.fetch_messages(channels=["my_channel"], maximum_per_channel=1, include_message_actions=True,  
    include_meta=True, include_message_type=True, include_custom_message_type=True, include_uuid=True).sync()  
  
if message_envelope.status.is_error():  
    print(f"Something went wrong. Error: {status.error_data}")  
else:  
        print("Fetch Messages Result:\n")  
    for message in message_envelope.result.channels["my_channel"]:  
        print(f"Message: {message.message}")  
        print(f"Meta: {message.meta}")  
        print(f"Timetoken: {message.timetoken}")  
  
        for action_type in message.actions:  
            print(f"Message Action type: {action_type}")  
            for action_value in message.actions[action_type]:  
```

Return  
`Envelope` → `PNFetchMessagesResult` (channels dict, start_timetoken, end_timetoken) + `PNStatus`.  
`PNFetchMessageItem` fields: message, meta, message_type, custom_message_type, uuid, timetoken, actions.

---

## Delete Messages from History

Message Persistence and “Enable Delete-From-History” setting (Admin Portal) required.  
Secret key must be configured.

```
pubnub.delete_messages() \  
    .channel(String) \  
    .start(Integer) \  
    .end(Integer) \  
    .sync()  
```

Parameters  
• **channel** str — required  
• **start** int — inclusive  
• **end**   int — exclusive  

Examples:

```
envelope = PubNub(pnconf).delete_messages() \  
    .channel("my-ch") \  
    .start(123) \  
    .end(456) \  
    .sync()  
```

```
envelope = pubnub.delete_messages(channels=["my_channel"], start=123, end=456).sync()  
```

Delete a single message (publish timetoken = 15526611838554310):

```
envelope = PubNub(pnconf).delete_messages() \  
    .channel("my-ch") \  
    .start(15526611838554309) \  
    .end(15526611838554310) \  
    .sync()  
```

```
envelope = pubnub.delete_messages(channels="my-ch", start=15526611838554309, end=15526611838554310).sync()  
```

Returns: status only.

---

## Message Counts

Returns number of messages on each channel since supplied timetoken(s).  
With Unlimited retention, only last 30 days are considered.

```
pn.message_counts() \  
    .channel(String) \  
    .channel_timetokens(List)  
```

Parameters  
• **channel** str — single or comma-separated list  
• **channel_timetokens** List[int|str] — ordered to match channels

Examples:

```
envelope = pn.message_counts() \  
    .channel('unique_1') \  
    .channel_timetokens([15510391957007182]) \  
    .sync() \  
print(envelope.result.channels['unique_1'])  
```

```
envelope = pubnub.message_counts(channels="my-ch", channel_timetokens=[15510391957007182]).sync()  
```

```
envelope = pn.message_counts() \  
    .channel('unique_1,unique_100') \  
    .channel_timetokens([15510391957007182, 15510391957007184]) \  
    .sync()  
print(envelope.result.channels)  
```

```
envelope = pubnub.message_counts(channels="unique_1,unique_100",  
    channel_timetokens=[15510391957007182, 15510391957007184]).sync()  
```

Return  
`Envelope` → `PNMessageCountResult` (`channels` dict) + `PNStatus`.

---

## History (deprecated – use Fetch History)

```
pubnub.history() \  
    .channel(String) \  
    .include_meta(True) \  
    .reverse(Boolean) \  
    .include_timetoken(Boolean) \  
    .start(Integer) \  
    .end(Integer) \  
    .count(Integer)  
```

Parameters  
• **channel** str — required  
• **include_meta** bool (default False)  
• **reverse** bool (default False) – paging direction  
• **include_timetoken** bool (default False)  
• **start** int – exclusive  
• **end**   int – inclusive  
• **count** int – max 100

Reverse notes: messages are returned oldest→newest; `reverse` defines which end of the interval the page starts from when more than `count` messages match.

Examples:

```
envelope = pubnub.history() \  
    .channel("history_channel") \  
    .count(100) \  
    .sync()  
```

```
envelope = pubnub.history() \  
    .channel("my_channel") \  
    .count(3) \  
    .reverse(True) \  
    .sync()  
```

```
{  
    end_timetoken: 13406746729185766,  
    start_timetoken: 13406746780720711,  
    messages: [{  
        crypto: None,  
        entry: 'Pub1',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub2',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub2',  
        timetoken: None  
```

```
pubnub.history()\  
    .channel("my_channel")\  
    .start(13847168620721752)\  
    .reverse(True)\  
    .sync()  
```

```
{  
    end_timetoken: 13406746729185766,  
    start_timetoken: 13406746780720711,  
    messages: [{  
        crypto: None,  
        entry: 'Pub4',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub5',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub6',  
        timetoken: None  
```

```
pubnub.history()\  
    .channel("my_channel")\  
    .count(100)\  
    .start(-1)\  
    .end(13847168819178600)\  
    .reverse(True)\  
    .sync()  
```

```
{  
    end_timetoken: 13406746729185766,  
    start_timetoken: 13406746780720711,  
    messages: [{  
        crypto: None,  
        entry: 'Pub4',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub5',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub6',  
        timetoken: None  
```

Paging helper:

```
def get_all_messages(start_tt):  
    def history_callback(result, status):  
        msgs = result.messages  
        start = result.start_timetoken  
        end = result.end_timetoken  
        count = len(msgs)  
  
        if count > 0:  
            print("%d" % count)  
            print("start %d" % start)  
            print("end %d" % end)  
  
        if count == 100:  
            get_all_messages(start)  
```

Include timetoken:

```
pubnub.history()\**    .channel("my_channel")\  
    .count(100)\  
    .include_timetoken()  
    .sync()  
```

Return  
`PNHistoryResult` → messages (List[PNHistoryItemResult]), start_timetoken, end_timetoken.  
`PNHistoryItemResult`: timetoken, entry.