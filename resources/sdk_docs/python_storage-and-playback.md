# Message Persistence API for Python SDK

Real-time access to stored messages with 10 ns timestamps. Messages are replicated across multiple zones and can be AES-256 encrypted. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Request execution and return values

Operations support synchronous and asynchronous execution.

`.sync()` returns an `Envelope` with:
- `Envelope.result` (type depends on API)
- `Envelope.status` (`PnStatus`)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and invokes your callback with `result` and `status`.

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  

```

## Fetch history

Requires Message Persistence (enable in the Admin Portal).

Fetch historical messages from one or more channels. Use `include_message_actions` to include message actions.

Time range:
- Only `start`: returns messages older than `start` (exclusive).
- Only `end`: returns messages from `end` (inclusive) and newer.
- Both `start` and `end`: returns messages between them (inclusive of `end`).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- Page with iterative calls adjusting `start` as needed.

### Method(s)

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
- channels (List<string>, required): Channels to return history for (max 500).
- maximum_per_channel (Integer): Single channel default/max 100; if `include_message_actions=True` default/max 25 and limited to single channel. For multiple channels, default/max 25.
- start (Integer): Exclusive start timetoken.
- end (Integer): Inclusive end timetoken.
- include_message_actions (Boolean, default False): Include associated message actions; limits to one channel, max 25.
- include_meta (Boolean, default False): Include message metadata.
- include_message_type (Boolean): Include PubNub message type.
- include_custom_message_type (Boolean): Include custom message type.
- include_uuid (Boolean): Include sender UUID.

### Sample code

Reference code (async, builder pattern):

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

Named arguments, sync:

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

### Returns

`fetch_messages()` returns an `Envelope`:
- result: `PNFetchMessagesResult`
- status: `PNStatus`

`PNFetchMessagesResult`:
- channels (Dictionary<string, List<PNFetchMessageItem>>)
- start_timetoken (Int)
- end_timetoken (Int)

`PNFetchMessageItem`:
- message (String)
- meta (Any)
- message_type (Any)
- custom_message_type (Any)
- uuid (String)
- timetoken (Int)
- actions (List) — 3D list grouped by action type and value

## Delete messages from history

Requires Message Persistence. Also requires enabling Delete-From-History in Admin Portal and initializing the SDK with a secret key.

Removes messages from a channel within a time range.

### Method(s)

```
`1pubnub.delete_messages() \  
2    .channel(String) \  
3    .start(Integer) \  
4    .end(Integer) \  
5    .sync()  
`
```

Parameters:
- channel (String, required): Channel to delete from.
- start (Integer): Inclusive start timetoken.
- end (Integer): Exclusive end timetoken.

### Sample code

Builder pattern:

```
`1envelope = PubNub(pnconf).delete_messages() \  
2    .channel("my-ch") \  
3    .start(123) \  
4    .end(456) \  
5    .sync()  
`
```

Named arguments:

```
`1envelope = pubnub.delete_messages(channels=["my_channel"], start=123, end=456).sync()  
`
```

### Returns

`delete_messages()` has no return value.

### Other examples

Delete a specific message (use publish timetoken as `end`, and `start = timetoken - 1`):

Builder pattern:

```
`1envelope = PubNub(pnconf).delete_messages() \  
2    .channel("my-ch") \  
3    .start(15526611838554309) \  
4    .end(15526611838554310) \  
5    .sync()  
`
```

Named arguments:

```
`1envelope = pubnub.delete_messages(channels="my-ch", start=15526611838554309, end=15526611838554310).sync()  
`
```

## Message counts

Requires Message Persistence.

Returns the number of messages published since the given timetoken(s). Only messages from the last 30 days are counted (even with unlimited retention).

### Method(s)

```
`1pn.message_counts() \  
2    .channel(String) \  
3    .channel_timetokens(List)  
`
```

Parameters:
- channel (String, required): Single or comma-separated channels.
- channel_timetokens (List, required): List of timetokens (str or int), ordered to match channels.

### Sample code

Builder pattern:

```
`1envelope = pn.message_counts() \  
2    .channel('unique_1') \  
3    .channel_timetokens([15510391957007182]) \  
4    .sync() \  
5print(envelope.result.channels['unique_1'])  
`
```

Named arguments:

```
`1envelope = pubnub.message_counts(channels="my-ch", channel_timetokens=[15510391957007182]).sync()  
`
```

### Returns

`message_counts()` returns an `Envelope`:
- result: `PNMessageCountResult`
- status: `PNStatus`

`PNMessageCountResult`:
- channels (Dictionary<string, int>): Missed message counts per channel.

### Other examples

Different timetokens for each channel:

Builder pattern:

```
`1envelope = pn.message_counts() \  
2    .channel('unique_1,unique_100') \  
3    .channel_timetokens([15510391957007182, 15510391957007184]) \  
4    .sync()  
5print(envelope.result.channels)  
`
```

Named arguments:

```
`1envelope = pubnub.message_counts(channels="unique_1,unique_100",  
2    channel_timetokens=[15510391957007182, 15510391957007184]).sync()  
`
```

## History (deprecated)

Requires Message Persistence. Deprecated: use Fetch history instead.

Fetches historical messages of a channel with controls for order and pagination.

### Method(s)

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
- channel (String, required): Channel to fetch from.
- include_meta (Boolean, default False): Include message meta.
- reverse (Boolean, default False): If True, traverses from oldest first when paging beyond count.
- include_timetoken (Boolean, default False): Include event timetokens in response.
- start (Integer): Exclusive start timetoken.
- end (Integer): Inclusive end timetoken.
- count (Integer): Number of messages to return (max 100).

Note on `reverse`: Results are always ascending by time within a page; `reverse` affects which end of the interval to page from when more than `count` messages exist.

### Sample code

Retrieve the last 100 messages on a channel:

```
`1envelope = pubnub.history() \  
2    .channel("history_channel") \  
3    .count(100) \  
4    .sync()  
`
```

### Returns

`history()` returns a `PNHistoryResult`:
- messages (List<PNHistoryItemResult>)
- start_timetoken (Integer)
- end_timetoken (Integer)

`PNHistoryItemResult`:
- timetoken (Integer)
- entry (Object)

### Other examples

Retrieve three oldest messages (reverse):

```
`1envelope = pubnub.history() \  
2    .channel("my_channel") \  
3    .count(3) \  
4    .reverse(True) \  
5    .sync()  
`
```

Response:

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

Retrieve messages newer than a given timetoken (exclusive), paging oldest to newest:

```
`1pubnub.history()\  
2    .channel("my_channel")\  
3    .start(13847168620721752)\  
4    .reverse(True)\  
5    .sync()  
`
```

Response:

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

Retrieve messages until a given timetoken (inclusive), paging newest to oldest:

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

Response:

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

History paging example:

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

Include timetoken in history response:

```
`1pubnub.history()\**2    .channel("my_channel")\  
3    .count(100)\  
4    .include_timetoken()  
5    .sync()  
`
```