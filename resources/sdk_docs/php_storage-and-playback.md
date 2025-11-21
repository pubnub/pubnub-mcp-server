# Message Persistence API for PHP SDK

Message Persistence provides real-time access to stored, timestamped messages across multiple regions with optional AES-256 encryption. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence: enable for your key in the Admin Portal.

Fetch historical messages from one or more channels, optionally including message actions, meta, message type, custom type, and publisher UUID.

Ordering and time window:
- start only: returns messages older than start (exclusive).
- end only: returns messages from end (inclusive) and newer.
- start and end: returns messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: limited to 1 channel and 25 messages.
Use iterative calls and adjust start to page through results.

### Method(s)

```
`1$pubnub.fetchMessages()  
2    ->channels(string|Arraystring>)  
3    ->maximumPerChannel(Int)  
4    ->start(string)  
5    ->end(string)  
6    ->includeMessageActions(Boolean)  
7    ->includeMeta(Boolean)  
8    ->includeMessageType(Boolean)  
9    ->includeCustomMessageType(Boolean)  
10    ->includeUuid(Boolean)  
`
```

Parameters:
- channels (required) — Type: string or Array<string>; Channels to fetch from (up to 500).
- maximumPerChannel — Type: Int; Default: 25 or 100; Max messages to return. Defaults/maximums: 100 (single channel), 25 (multi-channel), 25 with includeMessageActions.
- start — Type: string; Timetoken start (exclusive).
- end — Type: string; Timetoken end (inclusive).
- includeMessageActions — Type: Boolean; Default: False; Include message actions; when True, limited to one channel and 25 messages.
- includeMeta — Type: Boolean; Default: False; Include meta object if provided at publish.
- includeMessageType — Type: Boolean; Include message type.
- includeCustomMessageType — Type: Boolean; Include custom message type.
- includeUuid — Type: Boolean; Include publisher uuid.

### Sample code

Retrieve the last message on a channel:

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns

PNFetchMessagesResult:
- channels — Type: Array; Array of PNFetchMessageItem.
- startTimetoken — Type: Int; Start timetoken.
- endTimetoken — Type: Int; End timetoken.

PNFetchMessageItem:
- message — Type: string; Message.
- meta — Type: Any; Meta value.
- messageType — Type: Any; Message type.
- customMessageType — Type: Any; Custom message type.
- uuid — Type: string; Sender UUID.
- timetoken — Type: Int; Message timetoken.
- actions — Type: List; 3D list of message actions grouped by type and value.

## History

Requires Message Persistence: enable for your key in the Admin Portal.

Fetch historical messages for a single channel. Control order and window:
- reverse = false (default): search from newest end of the timeline.
- reverse = true: search from oldest end.
- Page with start OR end; slice with both (end inclusive).
- Limit with count (max 100 messages per request).

Start/End usage:
- start only: messages older than start (exclusive).
- end only: messages at end and newer.
- start and end: messages between them (end inclusive).
Page by iteratively calling history and adjusting start if more than count/100 messages match.

### Method(s)

```
`1$pubnub->history()  
2    ->channel(String)  
3    ->reverse(bool)  
4    ->includeTimetoken(bool)  
5    ->start(integer)  
6    ->end(integer)  
7    ->count(integer)  
8    ->sync();  
`
```

Parameters:
- channel (required) — Type: String; Channel to return history from.
- reverse — Type: Boolean; Default: false; Traverse from oldest to newest when true.
- includeTimetoken — Type: Boolean; Default: false; Include message timetokens.
- start — Type: Integer; Start timetoken (exclusive).
- end — Type: Integer; End timetoken (inclusive).
- count — Type: Integer; Number of messages to return.

Tip: Messages are returned sorted ascending by time. reverse affects which end of the interval to start from when more than count messages match.

### Sample code

Retrieve the last 5 messages on a channel:

```
1
  

```

### Response

PNHistoryResult:
- getMessages() — Type: Array; Array of PNHistoryItemResult.
- getStartTimetoken() — Type: Integer; Start timetoken.
- getEndTimetoken() — Type: Integer; End timetoken.

PNHistoryItemResult:
- getTimetoken() — Type: Integer; Message timetoken.
- getEntry() — Type: Object; Message.

### Other examples

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
1
  

```

##### Response

```
1PubNub\Models\Consumer\History\PNHistoryResult Object(  
2    [messages:PubNub\Models\Consumer\History\PNHistoryResult:private] => Array(  
3        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
4            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
5                [a] => 11  
6                [b] => 22  
7            )  
8            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
9            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 1111  
10        )  
11        [1] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
12            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
13                [a] => 33  
14                [b] => 44  
15            )  
16            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
17            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 2222  
18        )  
19        [2] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
20            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
21                [a] => 55  
22                [b] => 66  
23            )  
24            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
25            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 2222  
26        )  
27    )  
28
  
29    [startTimetoken:PubNub\Models\Consumer\History\PNHistoryResult:private] => 13406746729185766  
30    [endTimetoken:PubNub\Models\Consumer\History\PNHistoryResult:private] => 13406746780720711  
31)  

```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)

```
1
  

```

##### Response

```
1PubNub\Models\Consumer\History\PNHistoryResult Object(  
2    [messages:PubNub\Models\Consumer\History\PNHistoryResult:private] => Array(  
3        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
4            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array  
5                (  
6                    [a] => 11  
7                    [b] => 22  
8                )  
9
  
10            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
11            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 1111  
12        )  
13        [1] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
14            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
15                [a] => 33  
16                [b] => 44  
17            )  
18
  
19            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
20            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 2222  
21        )  
22        [2] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
23            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
24                [a] => 55  
25                [b] => 66  
26            )  
27
  
28            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
29            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 2222  
30        )  
31
  
32    )  
33
  
34    [startTimetoken:PubNub\Models\Consumer\History\PNHistoryResult:private] => 13406746729185766  
35    [endTimetoken:PubNub\Models\Consumer\History\PNHistoryResult:private] => 13406746780720711  
36)  

```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)

```
1
  

```

##### Response

```
1PubNub\Models\Consumer\History\PNHistoryResult Object(  
2    [messages:PubNub\Models\Consumer\History\PNHistoryResult:private] => Array(  
3        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
4            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
5                [a] => 11  
6                [b] => 22  
7            )  
8
  
9            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
10            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 1111  
11        )  
12        [1] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
13            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
14                [a] => 33  
15                [b] => 44  
16            )  
17
  
18            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
19            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 2222  
20        )  
21        [2] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
22            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
23                [a] => 55  
24                [b] => 66  
25            )  
26
  
27            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
28            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 2222  
29        )  
30  
31    )  
32  
33    [startTimetoken:PubNub\Models\Consumer\History\PNHistoryResult:private] => 13406746729185766  
34    [endTimetoken:PubNub\Models\Consumer\History\PNHistoryResult:private] => 13406746780720711  
35)  

```

#### Include timetoken in history response

```
`1$pubnub->history()  
2    ->channel("my_channel")  
3    ->count(100)  
4    ->includeTimetoken(true)  
5    ->sync();  
`
```

## Delete messages from history

Requires Message Persistence: enable for your key in the Admin Portal.

Required setting: Enable Delete-From-History for your key and initialize the SDK with a secret key.

Remove messages from a channel’s history within a time window.

### Method(s)

```
`1$pubnub->deleteMessages()  
2    ->channel(String)  
3    ->start(integer)  
4    ->end(integer)  
5    ->sync()  
`
```

Parameters:
- channel (required) — Type: String; Channel to delete from.
- start — Type: Integer; Start timetoken (inclusive).
- end — Type: Integer; End timetoken (exclusive).

### Sample code

```
1
  

```

### Other examples

#### Delete specific message from history

Delete a specific message by passing its publish timetoken in end and timetoken-1 in start. Example: publish timetoken 15526611838554310 → start 15526611838554309, end 15526611838554310.

```
1
  

```

## Message counts

Requires Message Persistence: enable for your key in the Admin Portal.

Return the number of messages published since the given time. Count equals messages with timetoken >= channelsTimetoken. With Unlimited retention, only the last 30 days are counted.

### Method(s)

```
`1$pubnub->messageCounts()  
2    ->channels(array)  
3    ->channelsTimetoken(array)  
`
```

Parameters:
- channels (required) — Type: Array; Channels to count messages for.
- channelsTimetoken (required) — Type: Array; Timetokens aligned with channels. A single timetoken applies to all channels; otherwise, array lengths must match or a PNStatus error is returned.

### Sample code

```
1
  

```

### Returns

PNMessageCountsResult:
- getChannels() — Type: Array; Associative array of channel => count. Channels with 0 messages return 0. Channels with >= 10,000 messages return 10000.

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
1
**
```