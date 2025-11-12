# Message Persistence API for PHP SDK

Message Persistence stores each message with a timetoken (10-ns precision) across multiple availability zones. Optional AES-256 encryption is supported. See Message Persistence docs for details and retention options (1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited).

Retrievable data:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Time window behavior:
- Only start: returns messages older than start.
- Only end: returns messages from end and newer.
- Both start and end: returns messages between them (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: max one channel and 25 messages.
- Page by iteratively adjusting start.

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
- channels (string | Array<string>): Required. Channels to fetch (up to 500).
- maximumPerChannel (Int): Default/Max: 100 (single), 25 (multi), 25 with includeMessageActions.
- start (string): Timetoken start (exclusive).
- end (string): Timetoken end (inclusive).
- includeMessageActions (Boolean): Default false. Include message actions. When true: one channel, 25 messages.
- includeMeta (Boolean): Default false. Include meta object (if published with meta).
- includeMessageType (Boolean): Include message type.
- includeCustomMessageType (Boolean): Include custom message type.
- includeUuid (Boolean): Include publisher uuid.

### Sample code

Retrieve the last message on a channel:

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns

fetchMessages() returns PNFetchMessagesResult:

#### PNFetchMessagesResult
- channels (Array): Array of PNFetchMessageItem
- startTimetoken (Int): Start timetoken
- endTimetoken (Int): End timetoken

#### PNFetchMessageItem
- message (string): The message
- meta (Any): Meta value
- messageType (Any): Message type
- customMessageType (Any): Custom message type
- uuid (string): Sender UUID
- timetoken (Int): Message timetoken
- actions (List): 3D list of message actions grouped by type and value

## History

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Fetch historical messages for a channel. Control order and range:

- reverse=false (default): Search from newest end.
- reverse=true: Search from oldest end.
- Page with start OR end.
- Slice with both start AND end (end inclusive).
- Limit count via count (max 100 per request).

Start/End clarity:
- Only start: older than start.
- Only end: end and newer.
- Both: between start and end (end inclusive).
Max 100 messages per call; page by updating start.

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
- channel (String): Required. Channel to fetch.
- reverse (Boolean): Default false. Traverse from oldest to newest when true.
- includeTimetoken (Boolean): Default false. Include message timetokens.
- start (Integer): Start timetoken (exclusive).
- end (Integer): End timetoken (inclusive).
- count (Integer): Number of messages to return (max 100).

Tip on reverse:
- Messages are returned in ascending time order. reverse affects which end to begin retrieving when more than count messages exist in the interval.

### Sample code

Retrieve the last 5 messages on a channel:

```
1
  

```

### Response

history() returns PNHistoryResult:

- getMessages() (Array): Array of PNHistoryItemResult
- getStartTimetoken() (Integer): Start timetoken
- getEndTimetoken() (Integer): End timetoken

#### PNHistoryItemResult
- getTimetoken() (Integer): Message timetoken
- getEntry() (Object): Message

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

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove messages from a channel’s history.

Required setting:
- Enable Delete-From-History in Admin Portal.
- Initialize the SDK with a secret key.

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
- channel (String): Required. Channel to delete from.
- start (Integer): Start timetoken (inclusive).
- end (Integer): End timetoken (exclusive).

### Sample code

```
1
  

```

### Other examples

#### Delete specific message from history

Pass the publish timetoken as End and timetoken-1 as Start.

```
1
  

```

## Message counts

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Return the number of messages published since the given time. Counts messages with timetoken >= channelsTimetoken.

Unlimited message retention:
- Only messages from the last 30 days are counted.

### Method(s)

```
`1$pubnub->messageCounts()  
2    ->channels(array)  
3    ->channelsTimetoken(array)  
`
```

Parameters:
- channels (Array): Required. Channels to count.
- channelsTimetoken (Array): Required. Single timetoken applies to all channels, or provide one per channel (same order). Otherwise returns PNStatus error.

### Sample code

```
1
  

```

### Returns

PNMessageCountsResult:
- getChannels() (Array): Associative array channel => count. Channels with no messages: 0. Channels with >= 10,000 messages: 10000.

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
1
**
```