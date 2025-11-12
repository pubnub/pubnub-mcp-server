# Message Persistence API for Unity SDK

Message Persistence provides real-time access to stored messages (timestamped to 10 ns, replicated across regions). Messages can be encrypted with AES-256. Configure message retention in the Admin Portal: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions. Ordering:
- Only start: returns messages older than start.
- Only end: returns messages from end and newer.
- Both start and end: returns messages between them (inclusive of end).

Limits: up to 100 messages on a single channel; or 25 per channel on up to 500 channels. Page by iteratively updating the start timetoken.

### Method(s)

Use the following method(s) in the Unity SDK:

```
`1pubnub.FetchHistory()  
2    .Channels(string[])  
3    .IncludeMeta(bool)  
4    .IncludeMessageType(bool)  
5    .IncludeCustomMessageType(bool)  
6    .IncludeUUID(bool)  
7    .IncludeMessageActions(bool)  
8    .Reverse(bool)  
9    .Start(int)  
10    .End(int)  
11    .MaximumPerChannel(int)  
12    .QueryParam(Dictionarystring, object>)  
`
```

Parameters and execution:
- Channels (Type: string[]): Channels to return history from. Max 500 channels.
- IncludeMeta (Type: bool): Include meta (published with the message).
- IncludeMessageType (Type: bool): Include message type. Default true.
- IncludeCustomMessageType (Type: bool): Retrieve messages with custom message type. See Retrieving Messages.
- IncludeUUID (Type: bool): Include publisher uuid. Default true.
- IncludeMessageActions (Type: bool): Include message actions. If true, limited to one channel and 25 messages. Default false.
- Reverse (Type: bool): true traverses oldest-to-newest.
- Start (Type: long): Start timetoken (exclusive).
- End (Type: long): End timetoken (inclusive).
- MaximumPerChannel (Type: int): Number of messages to return. Default/max 100 for a single channel; 25 for multiple channels; 25 if IncludeMessageActions is true.
- QueryParam (Type: Dictionary<string, object>): Additional query string parameters.
- Execute (Type: System.Action): System.Action of type PNFetchHistoryResult.
- ExecuteAsync (Type: None): Returns Task<PNResult<PNFetchHistoryResult>>.

#### Truncated response
If truncated, a more property is returned with additional parameters. Make iterative calls adjusting parameters.

### Sample code

Reference code to retrieve the last message on a channel:

```
1
  
```

### Returns

FetchHistory() returns PNFetchHistoryResult with:

- Messages (Type: Dictionary<string, List<PNHistoryItemResult>>): List of messages per channel.
- More (Type: MoreInfo): Pagination information.

Messages entries include:
- Channel Name (string): Name of the channel.
- timetoken (long)
- Entry (object): Message payload.
- Meta (object)
- Uuid (string)
- MessageType (string)
- CustomMessageType (string)
- Actions (object)

More contains:
- Start (long)
- End (long)
- Limit (int)

Example:
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
10                "MessageType":null,  
11                "Actions":null  
12            }]  
13        },  
14    "More":null  
15}  
`
```

### Other examples

Retrieve the last 25 messages on a channel synchronously:

```
1
  
```

## Delete messages from history

Requires Message Persistence enabled. Also enable Delete-From-History in key settings and initialize with a secret key.

Removes messages from the history of a specific channel.

### Method(s)

To delete messages from history:

```
`1pubnub.DeleteMessages()  
2    .Channel(string)  
3    .Start(long)  
4    .End(long)  
5    .QueryParam(Dictionarystring,object>)  
`
```

Parameters and execution:
- Channel (Type: string): Channel to delete messages from.
- Start (Type: long): Start timetoken (inclusive).
- End (Type: long): End timetoken (exclusive).
- QueryParam (Type: Dictionary<string, object>): Additional query string parameters.
- Async (Type: PNCallback): PNCallback of type PNDeleteMessageResult.
- Execute (Type: System.Action): System.Action of type PNDeleteMessageResult.
- ExecuteAsync (Type: None): Returns Task<PNResult<PNDeleteMessageResult>>.

### Sample code

```
1
  
```

### Returns

DeleteMessages() returns PNResult<PNDeleteMessageResult> which contains an empty PNDeleteMessageResult.

### Other examples

Delete messages sent in a particular timeframe:

```
1
  
```

Delete specific message from history:
- Pass the publish timetoken in End and timetoken ± 1 in Start.
- Example: for publish timetoken 15526611838554310, set Start to 15526611838554309 and End to 15526611838554310.

```
1
  
```

## Message counts

Requires Message Persistence enabled.

Returns the number of messages published since the given timetoken (count includes messages with timetoken ≥ provided value).

For keys with unlimited message retention, this method considers only the last 30 days.

### Method(s)

```
`1pubnub.MessageCounts()  
2    .Channels(string[])  
3    .ChannelsTimetoken(long[])  
4    .QueryParam(Dictionarystring, object>)  
`
```

Parameters and execution:
- Channels (Type: string[]): Channels to fetch message counts for.
- ChannelsTimetoken (Type: long[]): Array of timetokens corresponding to channels. Specify a single timetoken to apply to all channels; otherwise, the array length must match channels or a PNStatus error is returned.
- QueryParam (Type: Dictionary<string, object>): Additional query string parameters.
- Async (Type: PNCallback): PNCallback of type PNMessageCountResult.
- Execute (Type: System.Action): System.Action of type PNMessageCountResult.
- ExecuteAsync (Type: None): Returns Task<PNResult<PNMessageCountResult>>.

### Sample code

```
1
  
```

### Returns

Returns PNResult<PNMessageCountResult>:
- Result (Type: PNMessageCountResult): Contains counts.
- Status (Type: PNStatus)

PNMessageCountResult:
- Channels (Type: Dictionary<string, long>): Map of channels to message counts. Channels with no messages: 0. Channels with 10,000+ messages: 10000.

### Other examples

Retrieve count of messages for a single channel:

```
1
  
```

Retrieve count of messages using different timetokens for each channel:

```
1
**
```