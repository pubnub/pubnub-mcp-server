# Message Persistence API for Unity SDK

Message Persistence provides real-time access to stored, timestamped messages (10 ns precision) replicated across regions. You can encrypt stored messages with AES-256. Configure retention in the Admin Portal: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Ordering and time window:
- Only start (no end): returns messages older than start.
- Only end (no start): returns messages from end and newer.
- Both start and end: returns messages between them (end inclusive; start exclusive).
- reverse = true returns oldest first.

Limits and pagination:
- Up to 100 messages for a single channel, or 25 per channel on up to 500 channels.
- If IncludeMessageActions = true: limited to 1 channel and 25 messages.
- Page by iteratively updating the start timetoken. If the response is truncated, a more object is returned to continue.

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

Parameters and options:
- Channels (required): Type: string[]. Channels to fetch from (max 500).
- IncludeMeta: Type: bool. Include meta passed on publish. Default: false.
- IncludeMessageType: Type: bool. Include message type. Default: true.
- IncludeCustomMessageType: Type: bool. Include custom message type messages.
- IncludeUUID: Type: bool. Include publisher UUID. Default: true.
- IncludeMessageActions: Type: bool. Include message actions. If true, limited to 1 channel and 25 messages. Default: false.
- Reverse: Type: bool. True to return oldest-first.
- Start: Type: long. Start timetoken (exclusive).
- End: Type: long. End timetoken (inclusive).
- MaximumPerChannel: Type: int. Max messages per channel. Max/Default: 100 (single channel), 25 (multiple channels), 25 if IncludeMessageActions = true.
- QueryParam: Type: Dictionary<string, object>. Additional query string parameters.
- Execute: Type: System.Action of PNFetchHistoryResult.
- ExecuteAsync: Returns Task<PNResult<PNFetchHistoryResult>>.

Truncated response:
- A more object may be returned with additional parameters (Start, End, Limit). Make iterative calls adjusting parameters.

### Sample code

Reference code. Retrieve the last message on a channel:

```
1
  

```

### Returns

FetchHistory() returns PNFetchHistoryResult:
- Messages: Dictionary<string, List<PNHistoryItemResult>>. Per-channel list of messages.
- More: MoreInfo pagination info (or null).

PNHistoryItemResult fields:
- Channel Name: string
- Timetoken: long
- Entry: object (payload)
- Meta: object
- Uuid: string
- MessageType: string
- CustomMessageType: string
- Actions: object

MoreInfo fields:
- Start: long
- End: long
- Limit: int

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

Retrieve the last 25 messages on a channel synchronously

```
1
  

```

## Delete messages from history

Requires Message Persistence enabled. Also enable Delete-From-History in key settings and initialize with a secret key.

Removes messages from the history of a specific channel.

### Method(s)

To Delete Messages from History use:

```
`1pubnub.DeleteMessages()  
2    .Channel(string)  
3    .Start(long)  
4    .End(long)  
5    .QueryParam(Dictionarystring,object>)  
`
```

Parameters and options:
- Channel (required): Type: string. Channel to delete from.
- Start: Type: long. Start timetoken (inclusive).
- End: Type: long. End timetoken (exclusive).
- QueryParam: Type: Dictionary<string, object>. Additional query string parameters.
- Async: Type: PNCallback of PNDeleteMessageResult.
- Execute: Type: System.Action of PNDeleteMessageResult.
- ExecuteAsync: Returns Task<PNResult<PNDeleteMessageResult>>.

### Sample code

```
1
  

```

### Returns

DeleteMessages() returns PNResult<PNDeleteMessageResult> with an empty PNDeleteMessageResult object.

### Other examples

Delete messages sent in a particular timeframe

```
1
  

```

Delete specific message from history

To delete a specific message, pass the publish timetoken (from a successful publish) in End and timetoken +/- 1 in Start. Example: for publish timetoken 15526611838554310, use Start=15526611838554309 and End=15526611838554310.

```
1
  

```

## Message counts

Requires Message Persistence enabled.

Returns the number of messages published since the given timetoken (count of messages with timetoken ≥ provided value).

Unlimited message retention keys: counts only messages published in the last 30 days.

### Method(s)

Use:

```
`1pubnub.MessageCounts()  
2    .Channels(string[])  
3    .ChannelsTimetoken(long[])  
4    .QueryParam(Dictionarystring, object>)  
`
```

Parameters and options:
- Channels (required): Type: string[]. Channels to fetch counts for.
- ChannelsTimetoken (required): Type: long[]. Timetokens in the same order as channels; specify one value to apply to all channels. If provided array length doesn’t match channels length (and isn’t a single value), a PNStatus error is returned.
- QueryParam: Type: Dictionary<string, object>. Additional query string parameters.
- Async: Type: PNCallback of PNMessageCountResult.
- Execute: Type: System.Action of PNMessageCountResult.
- ExecuteAsync: Returns Task<PNResult<PNMessageCountResult>>.

### Sample code

```
1
  

```

### Returns

Operation returns PNResult<PNMessageCountResult>:
- Result: PNMessageCountResult
- Status: PNStatus

PNMessageCountResult:
- Channels: Dictionary<string, long>. Message counts per channel. Channels without messages return 0; channels with 10,000+ messages return 10000.

### Other examples

Retrieve count of messages for a single channel

```
1
  

```

Retrieve count of messages using different timetokens for each channel

```
1
**
```

Last updated on Sep 3, 2025**