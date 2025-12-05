# Message Persistence API for C# SDK

Message Persistence provides real-time access to published message history. Messages are timestamped to the nearest 10 ns and stored across multiple availability zones globally. Optional AES-256 encryption secures stored messages. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

##### Request execution

Use try/catch. Invalid parameters throw an exception. Server/network errors are returned in PNResult.Status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Fetch history

##### Requires Message Persistence

Enable in the Admin Portal. Use IncludeMessageActions to include message actions.

Ordering and range:
- start only: messages older than start (exclusive).
- end only: messages from end (inclusive) and newer.
- start and end: messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- IncludeMessageActions = true: 1 channel, max 25 messages.
- Page by iterating with updated start timetoken.
- Truncated responses include a more property.

### Method(s)

```
`1pubnub.FetchHistory()  
2        .Channels(string[])  
3        .IncludeMeta(bool)  
4        .IncludeMessageType(bool)  
5        .IncludeCustomMessageType(bool)  
6        .IncludeUUID(bool)  
7        .IncludeMessageActions(bool)  
8        .Reverse(bool)  
9        .Start(int)  
10        .End(int)  
11        .MaximumPerChannel(int)  
12        .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- Channels (required) Type: string[] — Channels to fetch from (up to 500).
- IncludeMeta Type: bool — Include meta object published with the message.
- IncludeMessageType Type: bool — Include message type. Default true.
- IncludeCustomMessageType Type: bool — Retrieve custom message type.
- IncludeUUID Type: bool — Include publisher uuid. Default true.
- IncludeMessageActions Type: bool — Include message actions. If true, limited to 1 channel and 25 messages. Default false.
- Reverse Type: bool — Traverse oldest to newest when true.
- Start Type: long — Start timetoken (exclusive).
- End Type: long — End timetoken (inclusive).
- MaximumPerChannel Type: int — Max messages to return (100 single channel; 25 multi-channel; 25 with IncludeMessageActions).
- QueryParam Type: Dictionary<string, object> — Extra query params.
- Execute Type: PNCallback — PNCallback of type PNFetchHistoryResult.
- ExecuteAsync Type: None — Returns PNResult<PNFetchHistoryResult>.

### Sample code

Retrieve the last message on a channel:

```
1
  

```

### Returns

```
`1{  
2    "Messages":  
3        {  
4            "my_channel":  
5            [{  
6                "Timetoken":15717278253295153,  
7                "Entry":"sample message",  
8                "Meta":"",  
9                "Uuid":"user-1",  
10                "MessageType":0,  
11                "CustomMessageType":"text-message",  
12                "Actions":null  
13            }]  
14        },  
15    "More":null  
16}  
`
```

### Other examples

#### Retrieve the last 25 messages on a channel synchronously

```
1
  

```

## Delete messages from history

##### Requires Message Persistence

Enable in the Admin Portal.

Removes messages from a channel’s history.

##### Required setting

Enable Delete-From-History for your key and initialize the SDK with a secret key.

### Method(s)

```
`1pubnub.DeleteMessages()  
2        .Channel(string)  
3        .Start(long)  
4        .End(long)  
5        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- Channel (required) Type: string — Channel to delete from.
- Start Type: long — Start timetoken (inclusive).
- End Type: long — End timetoken (exclusive).
- QueryParam Type: Dictionary<string, object> — Extra query params.
- Async Type: PNCallback — PNCallback of type PNDeleteMessageResult. (Deprecated; use ExecuteAsync.)
- Execute Type: PNCallback — PNCallback of type PNDeleteMessageResult.
- ExecuteAsync Type: None — Returns PNResult<PNDeleteMessageResult>.

### Sample code

```
1
  

```

### Returns

PNResult<PNDeleteMessageResult> with an empty PNDeleteMessageResult.

### Other examples

#### Delete messages sent in a particular timeframe

```
1
  

```

#### Delete specific message from history

Set End to message publish timetoken; set Start to timetoken - 1. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.

```
1
  

```

## Message counts

##### Requires Message Persistence

Returns counts of messages with timetokens >= ChannelsTimetoken.
Note: With Unlimited retention enabled, counts include only the last 30 days.

### Method(s)

```
`1pubnub.MessageCounts()  
2        .Channels(string[])  
3        .ChannelsTimetoken(long[])  
4        .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- Channels (required) Type: string[] — Channels to count.
- ChannelsTimetoken (required) Type: long[] — Timetokens aligned with Channels. A single timetoken applies to all channels; otherwise, arrays must match length or a PNStatus error is returned.
- QueryParam Type: Dictionary<string, object> — Extra query params.
- Async Type: PNCallback — PNCallback of type PNMessageCountResult. (Deprecated; use ExecuteAsync.)
- Execute Type: PNCallback — PNCallback of type PNMessageCountResult.
- ExecuteAsync Type: None — Returns PNResult<PNMessageCountResult>.

### Sample code

```
1
  

```

### Returns

PNResult<PNMessageCountResult>:
- Result: PNMessageCountResult
- Status: PNStatus

PNMessageCountResult:
- Channels: Dictionary<string, long> — Channel counts. Channels with no messages return 0. Counts >= 10,000 are capped at 10000.

### Other examples

#### Retrieve count of messages for a single channel

```
1
  

```

#### Retrieve count of messages using different timetokens for each channel

```
1
  

```

## History (deprecated)

##### Requires Message Persistence

##### Deprecated

Use fetchHistory() instead.

Fetch historical messages for a single channel with paging and direction controls.

Behavior:
- Reverse = false (default): search from newest end.
- Reverse = true: search from oldest end.
- Page via Start or End timetoken; slice via both.
- Count limits the number of messages.

Start/End clarity:
- Start only: messages older than and up to Start.
- End only: messages at End and newer.
- Both: messages between them (inclusive of End).
- Up to 100 messages per call; page by adjusting Start.

#### Method(s) (deprecated)

```
`1pubnub.History()  
2        .Channel(string)  
3        .IncludeMeta(bool)  
4        .Reverse(bool)  
5        .IncludeTimetoken(bool)  
6        .Start(long)  
7        .End(long)  
8        .count(int)  
9        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- Channel (required) Type: string — Channel to fetch from.
- IncludeMeta Type: bool — Include meta object.
- Reverse Type: bool — Oldest to newest when true.
- IncludeTimetoken Type: bool — Include message timetokens.
- Start Type: long — Start timetoken (exclusive).
- End Type: long — End timetoken (inclusive).
- Count Type: int — Number of messages to return.
- QueryParam Type: Dictionary<string, object> — Extra query params.
- Async Type: PNCallback — PNCallback of type PNHistoryResult. (Deprecated; use ExecuteAsync.)
- Execute Type: PNCallback — PNCallback of type PNHistoryResult.
- ExecuteAsync Type: None — Returns PNResult<PNHistoryResult>.

##### Using the reverse parameter

Results are always sorted ascending by time. Reverse determines which end of the interval to start retrieving from when more than Count (or 100 default) messages exist in range.

#### Sample code (deprecated)

Retrieve the last 100 messages on a channel:

```
1
  

```

#### Returns (deprecated)

PNResult<PNHistoryResult>:
- Result: PNHistoryResult
- Status: PNStatus

PNHistoryResult:
- Messages: List<PNHistoryItemResult>
- StartTimetoken: long
- EndTimetoken: long

##### PNHistoryItemResult (deprecated)

- Timetoken: long — Message timetoken.
- Entry: object — Message.

#### Other examples (deprecated)

##### Retrieve the last 100 messages on a channel synchronously (deprecated)

```
1
  

```

##### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse (deprecated)

```
1
  

```

##### Response (deprecated)

```
`1{  
2    "Messages":[  
3        {  
4            "Timetoken": 0,  
5            "Entry": "Pub1"  
6        },  
7        {  
8            "Timetoken": 0,  
9            "Entry": "Pub2"  
10        },  
11        {  
12            "Timetoken": 0,  
13            "Entry": "Pub3"  
14        }  
15    ],  
16    "StartTimeToken": 13406746729185766,  
17    "EndTimeToken": 13406746780720711  
18}  
`
```

##### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive) (deprecated)

```
1
  

```

##### Response (deprecated)

```
`1{  
2    "Messages":[  
3        {  
4            "Timetoken": 0,  
5            "Entry": "Pub3"  
6        },  
7        {  
8            "Timetoken": 0,  
9            "Entry": "Pub4"  
10        },  
11        {  
12            "Timetoken": 0,  
13            "Entry": "Pub5"  
14        }  
15    ],  
16    "StartTimeToken": 13406746780720711,  
17    "EndTimeToken": 13406746845892666  
18}  
`
```

##### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive) (deprecated)

```
1
  

```

##### Response (deprecated)

```
`1{  
2    "Messages":[  
3        {  
4            "Timetoken": 0,  
5            "Entry": "Pub3"  
6        },  
7        {  
8            "Timetoken": 0,  
9            "Entry": "Pub4"  
10        },  
11        {  
12            "Timetoken": 0,  
13            "Entry": "Pub5"  
14        }  
15    ],  
16    "StartTimeToken": 13406746780720711,  
17    "EndTimeToken": 13406746845892666  
18}  
`
```

##### History paging example (deprecated)

##### Usage

Pass 0 or a valid timetoken.

```
1
  

```

##### Include timetoken in history response (deprecated)

```
1
**
```
Last updated on Sep 3, 2025**