# Message Persistence API for Python SDK

Message Persistence provides real-time access to stored messages, reactions, and files. Messages are timestamped (10 ns precision) and can be AES-256 encrypted. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. Enable Message Persistence for your key in the Admin Portal.

##### Request execution and return values

Choose synchronous or asynchronous execution.

`.sync()` returns an `Envelope` with:
- `Envelope.result` (type varies by API)
- `Envelope.status` (`PnStatus`)

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

## Fetch history[​](#fetch-history)

Requires Message Persistence enabled in the Admin Portal.

Fetch historical messages from one or more channels. Use `include_message_actions` for message actions. Ordering rules:
- Only `start`: messages older than `start` (exclusive).
- Only `end`: messages from `end` and newer (inclusive).
- Both `start` and `end`: messages between them (inclusive of `end`).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With `include_message_actions=True`: single channel only; max 25.

### Method(s)[​](#methods)

```
`1pubnub.fetch_messages() \  
2    .channels(List) \  
3    .maximum_per_channel(Integer) \  
4    .start(Integer) \  
5    .end(Integer) \  
6    .include_message_actions(Boolean) \  
7    .include_meta(Boolean)  
8    .include_message_type(Boolean) \  
9    .include_custom_message_type(Boolean) \  
10    .include_uuid(Boolean) \  
`
```

Parameters:
- channels (required)
  - Type: List<string>
  - Max 500 channels. Channels to return history for.
- maximum_per_channel
  - Type: Integer
  - Default/Max: 100 for single channel; 25 for multiple channels; if `include_message_actions=True`, default and max 25 and single channel only.
- start
  - Type: Integer
  - Exclusive start timetoken.
- end
  - Type: Integer
  - Inclusive end timetoken.
- include_message_actions
  - Type: Boolean
  - Default: False. If True, single channel only; includes associated message actions.
- include_meta
  - Type: Boolean
  - Default: False. Include message metadata.
- include_message_type
  - Type: Boolean
  - Include PubNub message type.
- include_custom_message_type
  - Type: Boolean
  - Include custom message type.
- include_uuid
  - Type: Boolean
  - Include UUID of the sender.

### Sample code[​](#sample-code)

Retrieve the last message on a channel:

- Builder Pattern
- Named Arguments

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4
  
5
  
6def my_fetch_messages_callback(envelope, status):  
7    if status.is_error():  
8        print(f"Something went wrong. Error: {status.error_data}")  
9        return  
10
  
11    print("Fetch Messages Result:\n")  
12    for message in envelope.channels["my_channel"]:  
13        print("Message: %s" % message.message)  
14        print("Meta: %s" % message.meta)  
15        print("Timetoken: %s" % message.timetoken)  
16
  
17        for action_type in message.actions:  
18            print("\nMessage Action type: " + action_type)  
19            for action_value in message.actions[action_type]:  
20                print("Message Action value: %s" % action_value)  
21                for action in message.actions[action_type][action_value]:  
22                    print("Message Action timetoken: %s" % action['actionTimetoken'])  
23                    print("Message Action uuid: %s" % action['uuid'])  
24
  
25
  
26def main():  
27    # Configuration for PubNub instance  
28    pn_config = PNConfiguration()  
29    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
30    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
31
  
32    # Initialize PubNub client  
33    pubnub = PubNub(pn_config)  
34
  
35    # Fetch messages  
36    pubnub.fetch_messages() \  
37        .channels(["my_channel"]) \  
38        .maximum_per_channel(1) \  
39        .include_message_actions(True) \  
40        .include_meta(True) \  
41        .include_message_type(True) \  
42        .include_custom_message_type(True) \  
43        .include_uuid(True) \  
44        .pn_async(my_fetch_messages_callback)  
45
  
46
  
47if __name__ == "__main__":  
48    main()  
```

```
1message_envelope = pubnub.fetch_messages(channels=["my_channel"], maximum_per_channel=1, include_message_actions=True,  
2    include_meta=True, include_message_type=True, include_custom_message_type=True, include_uuid=True).sync()  
3
  
4if message_envelope.status.is_error():  
5    print(f"Something went wrong. Error: {status.error_data}")  
6else:  
7        print("Fetch Messages Result:\n")  
8    for message in message_envelope.result.channels["my_channel"]:  
9        print(f"Message: {message.message}")  
10        print(f"Meta: {message.meta}")  
11        print(f"Timetoken: {message.timetoken}")  
12
  
13        for action_type in message.actions:  
14            print(f"Message Action type: {action_type}")  
15            for action_value in message.actions[action_type]:  
16                print(f"Message Action value: {action_value}")  
17                for action in message.actions[action_type][action_value]:  
18                    print(f"Message Action timetoken: {action['actionTimetoken']}")  
19                    print(f"Message Action uuid: {action['uuid']}")  
20
```

### Returns[​](#returns)

`fetch_messages()` returns an `Envelope`:
- result: `PNFetchMessagesResult`
- status: `PNStatus`

#### PNFetchMessagesResult[​](#pnfetchmessagesresult)

- channels: Dictionary of [`PNFetchMessageItem`](#pnfetchmessageitem)
- start_timetoken: Int
- end_timetoken: Int

#### PNFetchMessageItem[​](#pnfetchmessageitem)

- message: String
- meta: Any
- message_type: Any
- custom_message_type: Any
- uuid: String
- timetoken: Int
- actions: List (3D list grouped by action type and value)

## Delete messages from history[​](#delete-messages-from-history)

Requires Message Persistence. Also enable Delete-From-History and initialize with a secret key.

Remove messages from a specific channel’s history.

### Method(s)[​](#methods-1)

```
`1pubnub.delete_messages() \  
2    .channel(String) \  
3    .start(Integer) \  
4    .end(Integer) \  
5    .sync()  
`
```

Parameters:
- channel (required)
  - Type: String
  - Channel to delete messages from.
- start
  - Type: Integer
  - Inclusive start timetoken.
- end
  - Type: Integer
  - Exclusive end timetoken.

### Sample code[​](#sample-code-1)

- Builder Pattern
- Named Arguments

```
`1envelope = PubNub(pnconf).delete_messages() \  
2    .channel("my-ch") \  
3    .start(123) \  
4    .end(456) \  
5    .sync()  
`
```

```
`1envelope = pubnub.delete_messages(channels=["my_channel"], start=123, end=456).sync()  
`
```

### Returns[​](#returns-1)

`delete_messages()` has no return value.

### Other examples[​](#other-examples)

#### Delete specific message from history[​](#delete-specific-message-from-history)

Use publish timetoken in `end` and `timetoken -/+ 1` in `start` to target a single message.

- Builder Pattern
- Named Arguments

```
`1envelope = PubNub(pnconf).delete_messages() \  
2    .channel("my-ch") \  
3    .start(15526611838554309) \  
4    .end(15526611838554310) \  
5    .sync()  
`
```

```
`1envelope = pubnub.delete_messages(channels="my-ch", start=15526611838554309, end=15526611838554310).sync()  
`
```

## Message counts[​](#message-counts)

Requires Message Persistence. Returns number of messages published since given time. With Unlimited retention enabled, only last 30 days are counted.

### Method(s)[​](#methods-2)

```
`1pn.message_counts() \  
2    .channel(String) \  
3    .channel_timetokens(List)  
`
```

Parameters:
- channel (required)
  - Type: String
  - Single channel or comma-separated channels.
- channel_timetokens (required)
  - Type: List
  - Timetokens ordered the same as channels; str or int.

### Sample code[​](#sample-code-2)

- Builder Pattern
- Named Arguments

```
`1envelope = pn.message_counts() \  
2    .channel('unique_1') \  
3    .channel_timetokens([15510391957007182]) \  
4    .sync() \  
5print(envelope.result.channels['unique_1'])  
`
```

```
`1envelope = pubnub.message_counts(channels="my-ch", channel_timetokens=[15510391957007182]).sync()  
`
```

### Returns[​](#returns-2)

`message_counts()` returns an `Envelope`:
- result: `PNMessageCountResult`
- status: `PNStatus`

#### PNMessageCountResult[​](#pnmessagecountresult)

- channels: Dictionary with missed message counts per channel.

### Other examples[​](#other-examples-1)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

- Builder Pattern
- Named Arguments

```
`1envelope = pn.message_counts() \  
2    .channel('unique_1,unique_100') \  
3    .channel_timetokens([15510391957007182, 15510391957007184]) \  
4    .sync()  
5print(envelope.result.channels)  
`
```

```
`1envelope = pubnub.message_counts(channels="unique_1,unique_100",  
2    channel_timetokens=[15510391957007182, 15510391957007184]).sync()  
`
```

## History (deprecated)[​](#history-deprecated)

Requires Message Persistence. Deprecated: use [fetch history](#fetch-history).

Controls ordering and ranges with `reverse`, `start`, `end`, and `count`:
- Default `reverse=False`: search from newest end.
- `reverse=True`: search from oldest end.
- Page with `start` OR `end`; slice with both.
- Max 100 messages unless `count` changes. Page by adjusting `start`.

### Method(s)[​](#methods-3)

```
`1pubnub.history() \  
2    .channel(String) \  
3    .include_meta(True) \  
4    .reverse(Boolean) \  
5    .include_timetoken(Boolean) \  
6    .start(Integer) \  
7    .end(Integer) \  
8    .count(Integer)  
`
```

Parameters:
- channel (required)
  - Type: String
- include_meta
  - Type: Boolean
  - Default: False
- reverse
  - Type: Boolean
  - Default: False
- include_timetoken
  - Type: Boolean
  - Default: False
- start
  - Type: Integer
  - Exclusive start timetoken.
- end
  - Type: Integer
  - Inclusive end timetoken.
- count
  - Type: Integer
  - Number of messages to return.

Tip: Messages are returned in ascending time. `reverse` affects which end to start from when more than `count` messages exist.

### Sample code[​](#sample-code-3)

Retrieve the last 100 messages on a channel:

```
`1envelope = pubnub.history() \  
2    .channel("history_channel") \  
3    .count(100) \  
4    .sync()  
`
```

### Returns[​](#returns-3)

`history()` returns a `PNHistoryResult`:
- messages: List of `PNHistoryItemResult`
- start_timetoken: Integer
- end_timetoken: Integer

#### PNHistoryItemResult[​](#pnhistoryitemresult)

- timetoken: Integer
- entry: Object

### Other examples[​](#other-examples-2)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`1envelope = pubnub.history() \  
2    .channel("my_channel") \  
3    .count(3) \  
4    .reverse(True) \  
5    .sync()  
`
```

##### Response[​](#response)

```
`1{  
2    end_timetoken: 13406746729185766,  
3    start_timetoken: 13406746780720711,  
4    messages: [{  
5        crypto: None,  
6        entry: 'Pub1',  
7        timetoken: None  
8    },{  
9        crypto: None,  
10        entry: 'Pub2',  
11        timetoken: None  
12    },{  
13        crypto: None,  
14        entry: 'Pub2',  
15        timetoken: None  
16    }]  
17}  
`
```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`1pubnub.history()\  
2    .channel("my_channel")\  
3    .start(13847168620721752)\  
4    .reverse(True)\  
5    .sync()  
`
```

##### Response[​](#response-1)

```
`1{  
2    end_timetoken: 13406746729185766,  
3    start_timetoken: 13406746780720711,  
4    messages: [{  
5        crypto: None,  
6        entry: 'Pub4',  
7        timetoken: None  
8    },{  
9        crypto: None,  
10        entry: 'Pub5',  
11        timetoken: None  
12    },{  
13        crypto: None,  
14        entry: 'Pub6',  
15        timetoken: None  
16    }]  
17}  
`
```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`1pubnub.history()\  
2    .channel("my_channel")\  
3    .count(100)\  
4    .start(-1)\  
5    .end(13847168819178600)\  
6    .reverse(True)\  
7    .sync()  
`
```

##### Response[​](#response-2)

```
`1{  
2    end_timetoken: 13406746729185766,  
3    start_timetoken: 13406746780720711,  
4    messages: [{  
5        crypto: None,  
6        entry: 'Pub4',  
7        timetoken: None  
8    },{  
9        crypto: None,  
10        entry: 'Pub5',  
11        timetoken: None  
12    },{  
13        crypto: None,  
14        entry: 'Pub6',  
15        timetoken: None  
16    }]  
17}  
`
```

#### History paging example[​](#history-paging-example)

##### Usage

You can call the method by passing 0 or a valid timetoken.

```
1def get_all_messages(start_tt):  
2    def history_callback(result, status):  
3        msgs = result.messages  
4        start = result.start_timetoken  
5        end = result.end_timetoken  
6        count = len(msgs)  
7
  
8        if count > 0:  
9            print("%d" % count)  
10            print("start %d" % start)  
11            print("end %d" % end)  
12
  
13        if count == 100:  
14            get_all_messages(start)  
15
  
16    pubnub.history()\  
17        .channel('history_channel')\  
18        .count(100)\  
19        .start(start_tt)\  
20        .pn_async(history_callback)  
21
  
22get_all_messages(14759343456292767)  
```

#### Include timetoken in history response[​](#include-timetoken-in-history-response)

```
`1pubnub.history()\**2    .channel("my_channel")\  
3    .count(100)\  
4    .include_timetoken()  
5    .sync()  
`
```