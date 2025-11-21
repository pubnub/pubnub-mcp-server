# Message Persistence API for C# SDK

Message Persistence provides real-time access to stored messages with 10ns timetokens across multiple regions. Messages can be encrypted with AES-256. Configure retention in the Admin Portal (1 day to Unlimited). You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Request execution

Use try/catch. Invalid parameters throw exceptions; network/server errors return details in PNStatus.

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

Requires Message Persistence enabled in Admin Portal.

Fetch historical messages from one or more channels. Use IncludeMessageActions to include message actions.

Ordering and range:
- start only: messages older than start timetoken.
- end only: messages from end timetoken and newer.
- start and end: messages between them (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- IncludeMessageActions = true: one channel, max 25 messages.
- Page results by iterating with updated start.

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
- Channels (string[], required): Channels to fetch from (up to 500).
- IncludeMeta (bool): Include meta object published with the message.
- IncludeMessageType (bool): Include message type. Default true.
- IncludeCustomMessageType (bool): Retrieve custom message type.
- IncludeUUID (bool): Include publisher uuid. Default true.
- IncludeMessageActions (bool): Include message actions. If true, limited to one channel and 25 messages. Default false.
- Reverse (bool): Oldest-to-newest when true.
- Start (long): Start timetoken (exclusive).
- End (long): End timetoken (inclusive).
- MaximumPerChannel (int): Max messages returned. Defaults: 100 single channel; 25 multiple channels; 25 if IncludeMessageActions is true.
- QueryParam (Dictionary<string, object>): Extra query params for features/debugging.
- Execute: PNCallback of PNFetchHistoryResult.
- ExecuteAsync: Returns PNResult<PNFetchHistoryResult>.

Truncated response:
- A more property indicates additional pages; iterate with adjusted parameters.

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

Retrieve the last 25 messages on a channel synchronously
```
1
  

```

## Delete messages from history

Requires Message Persistence enabled.

To accept delete requests, enable Delete-From-History for your key and initialize the SDK with a secret key.

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
- Channel (string, required): Channel to delete from.
- Start (long): Start timetoken (inclusive).
- End (long): End timetoken (exclusive).
- QueryParam (Dictionary<string, object>): Extra query params.
- Async: PNCallback of PNDeleteMessageResult. Deprecated; use ExecuteAsync.
- Execute: PNCallback of PNDeleteMessageResult.
- ExecuteAsync: Returns PNResult<PNDeleteMessageResult>.

### Sample code

```
1
  

```

### Returns

PNResult<PNDeleteMessageResult> with an empty PNDeleteMessageResult.

### Other examples

Delete messages sent in a particular timeframe
```
1
  

```

Delete specific message from history

To delete a specific message, set End to the message’s publish timetoken and Start to that timetoken minus 1 (for example Start=15526611838554309, End=15526611838554310).
```
1
  

```

## Message counts

Requires Message Persistence enabled.

Returns the number of messages published since a given time (timetoken >= ChannelsTimetoken).

Unlimited retention: Only last 30 days are counted.

### Method(s)

```
`1pubnub.MessageCounts()  
2        .Channels(string[])  
3        .ChannelsTimetoken(long[])  
4        .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- Channels (string[], required): Channels to count.
- ChannelsTimetoken (long[], required): Array of timetokens aligned with Channels. A single timetoken applies to all channels; otherwise, lengths must match or PNStatus error is returned.
- QueryParam (Dictionary<string, object>): Extra query params.
- Async: PNCallback of PNMessageCountResult. Deprecated; use ExecuteAsync.
- Execute: PNCallback of PNMessageCountResult.
- ExecuteAsync: Returns PNResult<PNMessageCountResult>.

### Sample code

```
1
  

```

### Returns

PNResult<PNMessageCountResult>:
- Result: PNMessageCountResult
- Status: PNStatus

PNMessageCountResult:
- Channels (Dictionary<string, long>): Per-channel counts. Channels without messages return 0. Channels with 10,000+ messages return 10000.

### Other examples

Retrieve count of messages for a single channel
```
1
  

```

Retrieve count of messages using different timetokens for each channel
```
1
  

```

## History (deprecated)

Requires Message Persistence enabled.

Deprecated: Use fetchHistory() instead.

Fetch historical messages for a single channel with optional paging and ordering.

Range and paging:
- Reverse=false (default): search from newest end of timeline.
- Reverse=true: search from oldest end.
- Page with Start or End; slice with both.
- Count limits returned messages.

Start & End clarity:
- Start only: messages older than and up to Start.
- End only: messages matching End and newer.
- Start and End: between them (End inclusive).
- Up to 100 messages per call; page using Start.

### Method(s) (deprecated)

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
- Channel (string, required): Channel to fetch from.
- IncludeMeta (bool): Include meta object.
- Reverse (bool): Oldest-to-newest when true.
- IncludeTimetoken (bool): Include message timetokens.
- Start (long): Start timetoken (exclusive).
- End (long): End timetoken (inclusive).
- Count (int): Number of messages to return.
- QueryParam (Dictionary<string, object>): Extra query params.
- Async: PNCallback of PNHistoryResult. Deprecated; use ExecuteAsync.
- Execute: PNCallback of PNHistoryResult.
- ExecuteAsync: Returns PNResult<PNHistoryResult>.

Using the reverse parameter:
- History always returns messages in ascending time order. Reverse affects which end of the interval retrieval begins when there are more messages than Count (or 100 default).

### Sample code (deprecated)

Retrieve the last 100 messages on a channel:
```
1
  

```

### Returns (deprecated)

PNResult<PNHistoryResult>:
- Result: PNHistoryResult
- Status: PNStatus

PNHistoryResult:
- Messages: List<PNHistoryItemResult>
- StartTimetoken: long
- EndTimetoken: long

PNHistoryItemResult (deprecated):
- Timetoken: long
- Entry: object

### Other examples (deprecated)

Retrieve the last 100 messages on a channel synchronously (deprecated)
```
1
  

```

Use history() to retrieve the three oldest messages by retrieving from the time line in reverse (deprecated)
```
1
  

```

Response (deprecated)
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

Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive) (deprecated)
```
1
  

```

Response (deprecated)
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

Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive) (deprecated)
```
1
  

```

Response (deprecated)
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

History paging example (deprecated)

Usage:
- Call the method by passing 0 or a valid timetoken as the argument.
```
1
  

```

Include timetoken in history response (deprecated)
```
1
**
```