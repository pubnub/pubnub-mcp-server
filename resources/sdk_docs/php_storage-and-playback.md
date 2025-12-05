# Message Persistence API for PHP SDK

Message Persistence provides real-time access to stored messages (timestamped to 10ns, replicated across zones/regions) with optional AES-256 encryption. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve messages, message reactions, and files (via File Sharing API).

## Fetch history

Requires Message Persistence (enable in Admin Portal).

Fetch messages from one or more channels. Use includeMessageActions to include message actions. Ordering/limits:
- start only: returns messages older than start (exclusive).
- end only: returns messages from end (inclusive) and newer.
- both start and end: returns messages between them (inclusive of end).
- Limits: up to 100 messages for a single channel; for multiple channels (up to 500), up to 25 per channel. With includeMessageActions: one channel, max 25.
- Page iteratively by adjusting start.

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
- maximumPerChannel — Type: Int; Default/Max: 100 (single), 25 (multi), 25 with includeMessageActions.
- start — Type: string; Start timetoken (exclusive).
- end — Type: string; End timetoken (inclusive).
- includeMessageActions — Type: Boolean; Default: False; If True, limited to one channel and 25 messages.
- includeMeta — Type: Boolean; Default: False; Include meta object published with the message.
- includeMessageType — Type: Boolean; Include message type.
- includeCustomMessageType — Type: Boolean; Include custom message type.
- includeUuid — Type: Boolean; Include publisher uuid.

### Sample code

Retrieve the last message on a channel:

##### Reference code

```
1
  
```

### Returns

fetchMessages() returns PNFetchMessagesResult:

PNFetchMessagesResult:
- channels — Type: Array of PNFetchMessageItem
- startTimetoken — Type: Int
- endTimetoken — Type: Int

PNFetchMessageItem:
- message — Type: string
- meta — Type: Any
- messageType — Type: Any
- customMessageType — Type: Any
- uuid — Type: string
- timetoken — Type: Int
- actions — Type: List (3D list grouped by action type and value)

## History

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages of a channel with control over order and paging:
- reverse=false (default): search from newest end.
- reverse=true: search from oldest end.
- Page with start OR end timetoken.
- Slice with both start AND end (end inclusive).
- count limits the number of messages returned (max 100 per call).

Start/End clarity:
- start only: messages older than start (exclusive).
- end only: messages at end and newer (inclusive).
- both: between start and end (inclusive on end). Max 100 messages per call; page by iterating start.

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
- channel (required) — Type: String; Channel to fetch from.
- reverse — Type: Boolean; Default: false; Traverse from oldest to newest when true.
- includeTimetoken — Type: Boolean; Default: false; Include message timetokens.
- start — Type: Integer; Start timetoken (exclusive).
- end — Type: Integer; End timetoken (inclusive).
- count — Type: Integer; Number of messages to return.

Tip about reverse:
- Messages are returned sorted ascending by time. reverse affects which end of a >count interval to start from.

### Sample code

Retrieve the last 5 messages on a channel:

```
1
  
```

### Response

history() returns PNHistoryResult:

- getMessages() — Array of PNHistoryItemResult
- getStartTimetoken() — Integer
- getEndTimetoken() — Integer

PNHistoryItemResult:
- getTimetoken() — Integer
- getEntry() — Object (message)

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

Requires Message Persistence. Enable Delete-From-History in Admin Portal and initialize the SDK with a secret key.

Removes messages from a channel’s history.

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

Use publish timetoken as End and timetoken-1 as Start (e.g., Start=15526611838554309, End=15526611838554310):

```
1
  
```

## Message counts

Requires Message Persistence.

Returns the number of messages published since the given time (timetoken comparison is >= channelsTimetoken). Note: With Unlimited message retention enabled, only messages from the last 30 days are counted.

### Method(s)

```
`1$pubnub->messageCounts()  
2    ->channels(array)  
3    ->channelsTimetoken(array)  
`
```

Parameters:
- channels (required) — Type: Array; Channels to fetch message counts for.
- channelsTimetoken (required) — Type: Array; Single timetoken applies to all channels, or provide one per channel (lengths must match) or a PNStatus error is returned.

### Sample code

```
1
  
```

### Returns

PNMessageCountsResult:
- getChannels() — Array; Associative array channel => count (0 if none; 10000 if 10,000 or more).

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
1
**
```