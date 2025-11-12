# Message Persistence API for C# SDK

Message Persistence provides real-time access to stored messages, message reactions, and files. Messages are timestamped to the nearest 10 ns and may be encrypted with AES-256. Configure message retention in the Admin Portal (1 day to Unlimited).

##### Request execution
Use try/catch. Invalid parameters throw exceptions. Server/network errors are returned in the `status`.

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
Enable Message Persistence for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use `IncludeMessageActions` to include message actions.

Ordering and ranges:
- Only `start`: returns messages older than the `start` timetoken.
- Only `end`: returns messages from that `end` timetoken and newer.
- Both `start` and `end`: returns messages in that range (inclusive of `end`).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With `IncludeMessageActions=true`: limited to one channel and 25 messages.
- Page with iterative calls using the `start` timetoken. Truncated responses include a `more` property.

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
- Channels (required) — Type: string[] — Channels to fetch history from (up to 500).
- IncludeMeta — Type: bool — Include `meta` (if provided at publish time).
- IncludeMessageType — Type: bool — Include message type. Default: true.
- IncludeCustomMessageType — Type: bool — Retrieve messages with the custom message type.
- IncludeUUID — Type: bool — Include publisher `uuid`. Default: true.
- IncludeMessageActions — Type: bool — Include message actions. If true, limited to one channel and 25 messages. Default: false.
- Reverse — Type: bool — Traverse from oldest to newest when true.
- Start — Type: long — Start timetoken (exclusive).
- End — Type: long — End timetoken (inclusive).
- MaximumPerChannel — Type: int — Messages per channel. Default/max: 100 (single), 25 (multi), 25 if `IncludeMessageActions` is true.
- QueryParam — Type: Dictionary<string, object> — Custom query params.
- Execute — Type: PNCallback of type `PNFetchHistoryResult`.
- ExecuteAsync — Returns `PNResult<PNFetchHistoryResult>`.

##### Truncated response
If truncated, a `more` property is returned; make iterative calls adjusting parameters.

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
Enable Message Persistence in the Admin Portal.

##### Required setting
Enable the `Delete-From-History` setting and initialize the SDK with a secret key.

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
- Channel (required) — Type: string — Channel to delete messages from.
- Start — Type: long — Start timetoken (inclusive).
- End — Type: long — End timetoken (exclusive).
- QueryParam — Type: Dictionary<string, object> — Custom query params.
- Async — Type: PNCallback of type `PNDeleteMessageResult`. Deprecated; use `ExecuteAsync`.
- Execute — Type: PNCallback of type `PNDeleteMessageResult`.
- ExecuteAsync — Returns `PNResult<PNDeleteMessageResult>`.

### Sample code

```
1
  

```

### Returns
`PNResult<PNDeleteMessageResult>` containing an empty `PNDeleteMessageResult`.

### Other examples

#### Delete messages sent in a particular timeframe

```
1
  

```

#### Delete specific message from history
Set `End` to the message’s publish timetoken and `Start` to that timetoken minus 1 (for example, Start: `15526611838554309`, End: `15526611838554310`).

```
1
  

```

## Message counts

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Counts the number of messages published since the given timetoken(s). Count includes messages with timetoken >= `ChannelsTimetoken`.

##### Unlimited message retention
For keys with unlimited message retention, only messages from the last 30 days are counted.

### Method(s)

```
`1pubnub.MessageCounts()  
2        .Channels(string[])  
3        .ChannelsTimetoken(long[])  
4        .QueryParam(Dictionarystring, object>)  
`
```

Parameters:
- Channels (required) — Type: string[] — Channels to count.
- ChannelsTimetoken (required) — Type: long[] — Array of timetokens in same order as channels, or a single timetoken applied to all channels. If lengths mismatch, a `PNStatus` error is returned.
- QueryParam — Type: Dictionary<string, object> — Custom query params.
- Async — Type: PNCallback of type `PNMessageCountResult`. Deprecated; use `ExecuteAsync`.
- Execute — Type: PNCallback of type `PNMessageCountResult`.
- ExecuteAsync — Returns `PNResult<PNMessageCountResult>`.

### Sample code

```
1
  

```

### Returns
`PNResult<PNMessageCountResult>` with:
- Result — `PNMessageCountResult`
- Status — `PNStatus`

`PNMessageCountResult`:
- Channels — `Dictionary<string, long>`: channel-to-count map. Empty channels = 0. Channels with 10,000+ messages report 10000.

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
Enable Message Persistence in the Admin Portal.

##### Deprecated
Use `fetchHistory()` instead.

Fetch historical messages for a channel with ordering and range controls:
- `Reverse=false` (default): from newest end.
- `Reverse=true`: from oldest end.
- Page using `Start` and/or `End`. With both, the range is inclusive of `End`.
- Limit via `Count`. Up to 100 per call; page iteratively by adjusting `Start`.

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
- Channel (required) — Type: string — Channel to return history from.
- IncludeMeta — Type: bool — Include `meta`.
- Reverse — Type: bool — Traverse from oldest to newest when true.
- IncludeTimetoken — Type: bool — Include message timetokens in the response.
- Start — Type: long — Start timetoken (exclusive).
- End — Type: long — End timetoken (inclusive).
- Count — Type: int — Number of messages to return.
- QueryParam — Type: Dictionary<string, object> — Custom query params.
- Async — Type: PNCallback of type `PNHistoryResult`. Deprecated; use `ExecuteAsync`.
- Execute — Type: PNCallback of type `PNHistoryResult`.
- ExecuteAsync — Returns `PNResult<PNHistoryResult>`.

##### Using the reverse parameter
Messages are returned in ascending time order. `Reverse` affects which end of the interval to start from when more than `Count` messages match.

#### Sample code (deprecated)

Retrieve the last 100 messages on a channel:

```
1
  

```

#### Returns (deprecated)
`PNResult<PNHistoryResult>` with:
- Result — `PNHistoryResult`:
  - Messages — `List<PNHistoryItemResult>`
  - StartTimetoken — long
  - EndTimetoken — long
- Status — `PNStatus`

`PNHistoryItemResult`:
- Timetoken — long
- Entry — object

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
You can call the method by passing 0 or a valid timetoken as the argument.

```
1
  

```

##### Include timetoken in history response (deprecated)

```
1
**
```

Last updated on Sep 3, 2025**